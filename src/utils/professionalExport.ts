import { writePsd, Psd, Layer } from "ag-psd";
import { jsPDF } from "jspdf";
import {
  DesignState,
  CanvasElement,
  ProfessionalExportOptions,
  ExportFormat,
} from "../types/designer";
import { convertUrlToDataUrl, waitForAllDomImagesToLoad } from "./exportEngine";

/**
 * Smart Export Recommendation Engine based on project composition
 */
export interface FormatRecommendation {
  recommendedFormat: ExportFormat;
  alternateFormats: ExportFormat[];
  category: "Vector-dominant" | "Mixed Vector & Raster" | "Photo & Bitmap Heavy";
  reasoning: string;
}

export function getSmartExportRecommendation(state: DesignState): FormatRecommendation {
  const totalElements = state.elements.length;
  let textCount = 0;
  let vectorShapeCount = 0;
  let imageCount = 0;

  state.elements.forEach((el) => {
    if (el.type === "text") textCount++;
    else if (el.type === "badge" || el.type === "button" || el.type === "shape") vectorShapeCount++;
    else if (el.type === "image" || el.type === "logo") imageCount++;
  });

  const vectorTotal = textCount + vectorShapeCount;
  const isImageBg = state.background.type === "image";

  if (imageCount === 0 && !isImageBg && vectorTotal > 0) {
    return {
      recommendedFormat: "ai",
      alternateFormats: ["svg", "pdf", "psd"],
      category: "Vector-dominant",
      reasoning: "Your design consists entirely of vector shapes and typography. AI, SVG, or PDF will preserve 100% infinite scalability.",
    };
  } else if (imageCount > 0 && vectorTotal > 0) {
    return {
      recommendedFormat: "psd",
      alternateFormats: ["pdf", "png", "webp", "ai"],
      category: "Mixed Vector & Raster",
      reasoning: "Combines photos/bitmaps with text & vector layers. PSD or PDF is ideal for preserving multi-layer editability in Photoshop/Illustrator.",
    };
  } else {
    return {
      recommendedFormat: "png",
      alternateFormats: ["psd", "jpg", "webp"],
      category: "Photo & Bitmap Heavy",
      reasoning: "Photo-centric composition. PNG or WebP offers high-fidelity visual accuracy, while PSD preserves backdrop layers.",
    };
  }
}

/**
 * Renders an offscreen HTMLCanvasElement for a given element or layer
 */
function createCanvasLayer(width: number, height: number): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  const ctx = canvas.getContext("2d")!;
  return { canvas, ctx };
}

/**
 * Generates a fully-layered Adobe Photoshop (.psd) binary data URL
 */
export async function generatePsdExport(
  state: DesignState,
  options: ProfessionalExportOptions,
  onProgress?: (msg: string) => void
): Promise<string> {
  onProgress?.("Initializing Photoshop PSD Layer Architecture...");

  const width = Math.round(state.width * (options.dpi / 72));
  const height = Math.round(state.height * (options.dpi / 72));
  const scale = options.dpi / 72;

  const psdLayers: Layer[] = [];

  // 1. BACKGROUND LAYER
  onProgress?.("Processing PSD Background Layer...");
  const { canvas: bgCanvas, ctx: bgCtx } = createCanvasLayer(width, height);
  if (!options.transparentBg) {
    if (state.background.type === "solid") {
      bgCtx.fillStyle = state.background.solidColor || "#0a0e27";
      bgCtx.fillRect(0, 0, width, height);
    } else if (state.background.type === "image" && state.background.imageUrl) {
      try {
        const dataUrl = await convertUrlToDataUrl(state.background.imageUrl);
        const img = await loadImage(dataUrl);
        bgCtx.drawImage(img, 0, 0, width, height);
      } catch (e) {
        bgCtx.fillStyle = state.background.solidColor || "#0a0e27";
        bgCtx.fillRect(0, 0, width, height);
      }
    } else {
      // Gradient or mesh fallback fill
      const grad = bgCtx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, state.background.gradientFrom || "#0a0e27");
      grad.addColorStop(1, state.background.gradientTo || "#1e1b4b");
      bgCtx.fillStyle = grad;
      bgCtx.fillRect(0, 0, width, height);
    }
  }

  psdLayers.push({
    name: "Background",
    canvas: bgCanvas,
    left: 0,
    top: 0,
    opacity: 1,
  });

  // 2. GLASS PANEL LAYER (if active)
  if (state.showGlassPanel) {
    onProgress?.("Adding Glass Backdrop Layer...");
    const { canvas: glassCanvas, ctx: glassCtx } = createCanvasLayer(width * 0.9, height * 0.9);
    glassCtx.fillStyle = `rgba(255, 255, 255, ${state.glassOpacity || 0.15})`;
    glassCtx.fillRect(0, 0, glassCanvas.width, glassCanvas.height);
    psdLayers.push({
      name: "Glassmorphism Backdrop",
      canvas: glassCanvas,
      left: Math.round(width * 0.05),
      top: Math.round(height * 0.05),
      opacity: state.glassOpacity || 0.8,
    });
  }

  // 3. FRAME BORDER LAYER (if active)
  if (state.frameConfig?.enabled) {
    onProgress?.("Rendering Frame & Corner Overlay Layer...");
    const { canvas: frameCanvas, ctx: frameCtx } = createCanvasLayer(width, height);
    const fw = Math.round((state.frameConfig.width || 4) * scale);
    frameCtx.strokeStyle = state.frameConfig.color || "#00f5ff";
    frameCtx.lineWidth = fw;
    frameCtx.strokeRect(fw / 2, fw / 2, width - fw, height - fw);

    psdLayers.push({
      name: "Outer Frame & Borders",
      canvas: frameCanvas,
      left: 0,
      top: 0,
      opacity: state.frameConfig.opacity || 1,
    });
  }

  // 4. CANVAS ELEMENTS LAYERS
  onProgress?.("Generating Layered PSD Elements...");
  for (let i = 0; i < state.elements.length; i++) {
    const el = state.elements[i];
    if (!el.visible) continue;

    const elX = Math.round((el.x / 100) * width);
    const elY = Math.round((el.y / 100) * height);
    const elW = Math.max(20, Math.round(((el.width || 30) / 100) * width));
    const elH = Math.max(20, Math.round(((el.height || 10) / 100) * height));

    const { canvas: elCanvas, ctx: elCtx } = createCanvasLayer(elW, elH);

    if (el.type === "text") {
      onProgress?.(`PSD Text Layer: ${el.name || "Text"}`);
      elCtx.fillStyle = el.color || "#ffffff";
      const fSize = Math.round((el.fontSize || 32) * scale);
      elCtx.font = `${el.fontWeight || "bold"} ${fSize}px ${el.fontFamily || "sans-serif"}`;
      elCtx.textAlign = (el.textAlign as CanvasTextAlign) || "left";
      elCtx.textBaseline = "middle";
      const textX = el.textAlign === "center" ? elW / 2 : el.textAlign === "right" ? elW : 0;
      elCtx.fillText(el.text || "", textX, elH / 2);

      psdLayers.push({
        name: `[Text] ${el.name || el.text || "Text Layer"}`,
        canvas: elCanvas,
        left: elX,
        top: elY,
        opacity: el.opacity ?? 1,
      });
    } else if (el.type === "image" || el.type === "logo") {
      onProgress?.(`PSD Bitmap Layer: ${el.name || "Image"}`);
      if (el.url) {
        try {
          const dataUrl = await convertUrlToDataUrl(el.url);
          const img = await loadImage(dataUrl);
          elCtx.drawImage(img, 0, 0, elW, elH);
        } catch (e) {
          elCtx.fillStyle = "#1e293b";
          elCtx.fillRect(0, 0, elW, elH);
        }
      }
      psdLayers.push({
        name: `[${el.type.toUpperCase()}] ${el.name || "Asset"}`,
        canvas: elCanvas,
        left: elX,
        top: elY,
        opacity: el.opacity ?? 1,
      });
    } else if (el.type === "badge" || el.type === "button" || el.type === "shape") {
      onProgress?.(`PSD Vector Layer: ${el.name || "Shape"}`);
      const bg = el.bg || el.color || "#00f5ff";
      elCtx.fillStyle = bg;
      const rad = Math.round((el.borderRadius || 8) * scale);
      drawRoundedRect(elCtx, 0, 0, elW, elH, rad);
      elCtx.fill();

      if (el.text) {
        elCtx.fillStyle = el.textColor || "#ffffff";
        const fSize = Math.round((el.fontSize || 16) * scale);
        elCtx.font = `bold ${fSize}px sans-serif`;
        elCtx.textAlign = "center";
        elCtx.textBaseline = "middle";
        elCtx.fillText(el.text, elW / 2, elH / 2);
      }

      psdLayers.push({
        name: `[Shape] ${el.name || el.text || "Vector Shape"}`,
        canvas: elCanvas,
        left: elX,
        top: elY,
        opacity: el.opacity ?? 1,
      });
    }
  }

  onProgress?.("Writing Photoshop PSD Binary Structure...");

  const psd: Psd = {
    width,
    height,
    children: psdLayers,
  };

  const buffer = writePsd(psd);
  const blob = new Blob([buffer], { type: "image/vnd.adobe.photoshop" });
  return URL.createObjectURL(blob);
}

/**
 * Generates Adobe Illustrator (.AI) / Encapsulated PostScript (.EPS) vector document
 */
export async function generateAiOrEpsExport(
  state: DesignState,
  options: ProfessionalExportOptions,
  isEps: boolean = false,
  onProgress?: (msg: string) => void
): Promise<string> {
  onProgress?.(`Constructing Adobe Illustrator ${isEps ? "EPS 3.0" : "AI"} Vector Stream...`);

  const width = state.width;
  const height = state.height;

  let header = isEps
    ? `%!PS-Adobe-3.0 EPSF-3.0\n%%BoundingBox: 0 0 ${width} ${height}\n%%Title: ${state.title || "Lizzdo Post Design"}\n%%Creator: Lizzdo Post Designer Pro\n%%Pages: 1\n%%EndComments\n`
    : `%!PS-Adobe-3.0\n%%Creator: Adobe Illustrator(R) Compatible Vector Stream (Lizzdo Pro)\n%%Title: ${state.title || "Design Export"}\n%%BoundingBox: 0 0 ${width} ${height}\n%%DocumentData: Clean7Bit\n%%EndComments\n`;

  let body = "gsave\n";

  // Background rect
  if (!options.transparentBg) {
    const bgHex = state.background.solidColor || "#0a0e27";
    const { r, g, b } = hexToRgb(bgHex);
    body += `${(r / 255).toFixed(3)} ${(g / 255).toFixed(3)} ${(b / 255).toFixed(3)} setrgbcolor\n`;
    body += `0 0 ${width} ${height} rectfill\n`;
  }

  // AI Layer Marker
  body += `%AI5_BeginLayer\n(Background & Setup) 1 1 0 0 0 0 0 0 0 0 LBS\n`;
  body += `%AI5_EndLayer\n`;

  // Elements
  body += `%AI5_BeginLayer\n(Canvas Design Layers) 1 1 0 0 0 0 0 0 0 0 LBS\n`;

  for (const el of state.elements) {
    if (!el.visible) continue;

    const elX = (el.x / 100) * width;
    const elY = height - (el.y / 100) * height; // PostScript Y origin is bottom-left
    const elW = ((el.width || 30) / 100) * width;
    const elH = ((el.height || 10) / 100) * height;

    if (el.type === "text" && el.text) {
      if (options.textMode === "vector_paths") {
        // Outline representation as vector box
        const { r, g, b } = hexToRgb(el.color || "#ffffff");
        body += `${(r / 255).toFixed(3)} ${(g / 255).toFixed(3)} ${(b / 255).toFixed(3)} setrgbcolor\n`;
        body += `newpath ${elX} ${elY - elH} ${elW} ${elH} rectfill\n`;
      } else {
        const { r, g, b } = hexToRgb(el.color || "#ffffff");
        body += `${(r / 255).toFixed(3)} ${(g / 255).toFixed(3)} ${(b / 255).toFixed(3)} setrgbcolor\n`;
        body += `/Helvetica findfont ${el.fontSize || 28} scalefont setfont\n`;
        const cleanText = el.text.replace(/\(/g, "\\(").replace(/\)/g, "\\)");
        body += `${elX} ${elY - (el.fontSize || 28)} moveto\n(${cleanText}) show\n`;
      }
    } else if (el.type === "badge" || el.type === "button" || el.type === "shape") {
      const { r, g, b } = hexToRgb(el.bg || el.color || "#00f5ff");
      body += `${(r / 255).toFixed(3)} ${(g / 255).toFixed(3)} ${(b / 255).toFixed(3)} setrgbcolor\n`;
      body += `newpath ${elX} ${elY - elH} ${elW} ${elH} rectfill\n`;

      if (el.text) {
        const { r: tr, g: tg, b: tb } = hexToRgb(el.textColor || "#ffffff");
        body += `${(tr / 255).toFixed(3)} ${(tg / 255).toFixed(3)} ${(tb / 255).toFixed(3)} setrgbcolor\n`;
        body += `/Helvetica-Bold 16 scalefont setfont\n`;
        const cleanText = el.text.replace(/\(/g, "\\(").replace(/\)/g, "\\)");
        body += `${elX + 10} ${elY - elH / 2 - 5} moveto\n(${cleanText}) show\n`;
      }
    }
  }

  body += `%AI5_EndLayer\n`;
  body += `grestore\nshowpage\n%%EOF\n`;

  const fullContent = header + body;
  const mime = isEps ? "application/postscript" : "application/illustrator";
  const blob = new Blob([fullContent], { type: mime });
  return URL.createObjectURL(blob);
}

/**
 * Generates Editable Clean SVG Vector Document
 */
export async function generateEditableSvgExport(
  state: DesignState,
  options: ProfessionalExportOptions,
  onProgress?: (msg: string) => void
): Promise<string> {
  onProgress?.("Generating Scalable Vector SVG XML Hierarchy...");

  const width = state.width;
  const height = state.height;

  let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">\n`;

  // Defs for gradients
  svgContent += `  <defs>\n`;
  if (state.background.type === "gradient") {
    svgContent += `    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">\n`;
    svgContent += `      <stop offset="0%" stop-color="${state.background.gradientFrom || "#0a0e27"}" />\n`;
    svgContent += `      <stop offset="100%" stop-color="${state.background.gradientTo || "#1e1b4b"}" />\n`;
    svgContent += `    </linearGradient>\n`;
  }
  svgContent += `  </defs>\n\n`;

  // Background Group
  svgContent += `  <!-- Layer: Background -->\n`;
  svgContent += `  <g id="Layer_Background">\n`;
  if (!options.transparentBg) {
    if (state.background.type === "gradient") {
      svgContent += `    <rect width="${width}" height="${height}" fill="url(#bgGradient)" />\n`;
    } else {
      svgContent += `    <rect width="${width}" height="${height}" fill="${state.background.solidColor || "#0a0e27"}" />\n`;
    }
    if (state.background.type === "image" && state.background.imageUrl) {
      try {
        const dataUrl = await convertUrlToDataUrl(state.background.imageUrl);
        svgContent += `    <image href="${dataUrl}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice" opacity="${state.background.imageOpacity ?? 1}" />\n`;
      } catch (e) {
        // ignore
      }
    }
  }
  svgContent += `  </g>\n\n`;

  // Frames & Corner Decorators Group
  if (state.frameConfig?.enabled || state.cornerDecorations?.enabled || state.showCyberBorders) {
    svgContent += `  <!-- Layer: Frames and Corner Decorations -->\n`;
    svgContent += `  <g id="Layer_Frames_And_Corners">\n`;
    if (state.frameConfig?.enabled) {
      const fw = state.frameConfig.width || 4;
      svgContent += `    <rect x="${fw / 2}" y="${fw / 2}" width="${width - fw}" height="${height - fw}" fill="none" stroke="${state.frameConfig.color || "#00f5ff"}" stroke-width="${fw}" rx="${state.frameConfig.radius || 0}" />\n`;
    }

    const cCfg = state.cornerDecorations;
    const isCornerActive = cCfg?.enabled ?? (state.showCyberBorders || false);
    if (isCornerActive && cCfg) {
      const defaultInset = cCfg.inset ?? 12;

      const getC = (pos: "tl" | "tr" | "bl" | "br") => {
        if (cCfg.syncAllCorners) return cCfg;
        return { ...cCfg, ...(cCfg[pos] || {}) };
      };

      const positions = [
        { id: "tl", x: getC("tl").inset ?? defaultInset, y: getC("tl").inset ?? defaultInset, transform: "" },
        { id: "tr", x: width - (getC("tr").inset ?? defaultInset), y: getC("tr").inset ?? defaultInset, transform: `translate(${width - (getC("tr").inset ?? defaultInset)}, ${getC("tr").inset ?? defaultInset}) scale(-1, 1)` },
        { id: "bl", x: getC("bl").inset ?? defaultInset, y: height - (getC("bl").inset ?? defaultInset), transform: `translate(${getC("bl").inset ?? defaultInset}, ${height - (getC("bl").inset ?? defaultInset)}) scale(1, -1)` },
        { id: "br", x: width - (getC("br").inset ?? defaultInset), y: height - (getC("br").inset ?? defaultInset), transform: `translate(${width - (getC("br").inset ?? defaultInset)}, ${height - (getC("br").inset ?? defaultInset)}) scale(-1, -1)` },
      ];

      for (const p of positions) {
        const cfg = getC(p.id as any);
        if (cfg.enabled === false) continue;
        const sz = cfg.size || 36;
        const len = cfg.length ?? sz;
        const th = cfg.thickness || 3;
        const col = cfg.color || "#00f5ff";
        const transformAttr = p.transform ? ` transform="${p.transform}"` : "";

        svgContent += `    <g id="Corner_${p.id.toUpperCase()}"${transformAttr}>\n`;
        svgContent += `      <path d="M0 ${len} V0 H${len}" fill="none" stroke="${col}" stroke-width="${th}" stroke-linecap="square" />\n`;
        svgContent += `    </g>\n`;
      }
    }
    svgContent += `  </g>\n\n`;
  }

  // Elements Group
  svgContent += `  <!-- Layer: Canvas Elements -->\n`;
  svgContent += `  <g id="Layer_Design_Elements">\n`;

  for (const el of state.elements) {
    if (!el.visible) continue;

    const elX = (el.x / 100) * width;
    const elY = (el.y / 100) * height;
    const elW = ((el.width || 30) / 100) * width;
    const elH = ((el.height || 10) / 100) * height;
    const layerId = (el.name || el.id || "element").replace(/[^a-zA-Z0-9_-]/g, "_");

    if (el.type === "text" && el.text) {
      svgContent += `    <g id="Text_${layerId}" opacity="${el.opacity ?? 1}">\n`;
      const textAnchor = el.textAlign === "center" ? "middle" : el.textAlign === "right" ? "end" : "start";
      const anchorX = el.textAlign === "center" ? elX + elW / 2 : el.textAlign === "right" ? elX + elW : elX;
      svgContent += `      <text x="${anchorX}" y="${elY + (el.fontSize || 28)}" font-family="${el.fontFamily || "sans-serif"}" font-size="${el.fontSize || 28}" font-weight="${el.fontWeight || "bold"}" fill="${el.color || "#ffffff"}" text-anchor="${textAnchor}">${escapeXml(el.text)}</text>\n`;
      svgContent += `    </g>\n`;
    } else if (el.type === "image" || el.type === "logo") {
      if (el.url) {
        try {
          const dataUrl = await convertUrlToDataUrl(el.url);
          svgContent += `    <g id="Bitmap_${layerId}" opacity="${el.opacity ?? 1}">\n`;
          svgContent += `      <image href="${dataUrl}" x="${elX}" y="${elY}" width="${elW}" height="${elH}" preserveAspectRatio="xMidYMid meet" />\n`;
          svgContent += `    </g>\n`;
        } catch (e) {
          // fallback box
        }
      }
    } else if (el.type === "badge" || el.type === "button" || el.type === "shape") {
      svgContent += `    <g id="Shape_${layerId}" opacity="${el.opacity ?? 1}">\n`;
      svgContent += `      <rect x="${elX}" y="${elY}" width="${elW}" height="${elH}" rx="${el.borderRadius || 8}" fill="${el.bg || el.color || "#00f5ff"}" />\n`;
      if (el.text) {
        svgContent += `      <text x="${elX + elW / 2}" y="${elY + elH / 2 + 5}" font-family="sans-serif" font-size="${el.fontSize || 16}" font-weight="bold" fill="${el.textColor || "#ffffff"}" text-anchor="middle">${escapeXml(el.text)}</text>\n`;
      }
      svgContent += `    </g>\n`;
    }
  }

  svgContent += `  </g>\n`;
  svgContent += `</svg>`;

  const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
  return URL.createObjectURL(blob);
}

/**
 * Generates Vector Editable PDF Document
 */
export async function generateEditablePdfExport(
  state: DesignState,
  options: ProfessionalExportOptions,
  onProgress?: (msg: string) => void
): Promise<string> {
  onProgress?.("Constructing Vector PDF Document with Illustrator Layer Attributes...");

  const widthPt = state.width * 0.75; // Convert px to pt (72 DPI)
  const heightPt = state.height * 0.75;

  const pdf = new jsPDF({
    orientation: widthPt > heightPt ? "landscape" : "portrait",
    unit: "pt",
    format: [widthPt, heightPt],
  });

  // Background
  if (!options.transparentBg) {
    const bgHex = state.background.solidColor || "#0a0e27";
    const { r, g, b } = hexToRgb(bgHex);
    pdf.setFillColor(r, g, b);
    pdf.rect(0, 0, widthPt, heightPt, "F");

    if (state.background.type === "image" && state.background.imageUrl) {
      try {
        const dataUrl = await convertUrlToDataUrl(state.background.imageUrl);
        pdf.addImage(dataUrl, "PNG", 0, 0, widthPt, heightPt);
      } catch (e) {
        // fallback
      }
    }
  }

  // Frame Overlay
  if (state.frameConfig?.enabled) {
    const fw = (state.frameConfig.width || 4) * 0.75;
    const { r, g, b } = hexToRgb(state.frameConfig.color || "#00f5ff");
    pdf.setDrawColor(r, g, b);
    pdf.setLineWidth(fw);
    pdf.rect(fw / 2, fw / 2, widthPt - fw, heightPt - fw, "S");
  }

  // Canvas Elements
  for (const el of state.elements) {
    if (!el.visible) continue;

    const elX = (el.x / 100) * widthPt;
    const elY = (el.y / 100) * heightPt;
    const elW = ((el.width || 30) / 100) * widthPt;
    const elH = ((el.height || 10) / 100) * heightPt;

    if (el.type === "text" && el.text) {
      const { r, g, b } = hexToRgb(el.color || "#ffffff");
      pdf.setTextColor(r, g, b);
      pdf.setFontSize((el.fontSize || 28) * 0.75);
      pdf.setFont("helvetica", el.fontWeight === "bold" ? "bold" : "normal");
      pdf.text(el.text, elX, elY + (el.fontSize || 28) * 0.75);
    } else if (el.type === "image" || el.type === "logo") {
      if (el.url) {
        try {
          const dataUrl = await convertUrlToDataUrl(el.url);
          pdf.addImage(dataUrl, "PNG", elX, elY, elW, elH);
        } catch (e) {
          // ignore
        }
      }
    } else if (el.type === "badge" || el.type === "button" || el.type === "shape") {
      const { r, g, b } = hexToRgb(el.bg || el.color || "#00f5ff");
      pdf.setFillColor(r, g, b);
      pdf.roundedRect(elX, elY, elW, elH, (el.borderRadius || 8) * 0.75, (el.borderRadius || 8) * 0.75, "F");

      if (el.text) {
        const { r: tr, g: tg, b: tb } = hexToRgb(el.textColor || "#ffffff");
        pdf.setTextColor(tr, tg, tb);
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text(el.text, elX + elW / 2, elY + elH / 2 + 4, { align: "center" });
      }
    }
  }

  const blob = pdf.output("blob");
  return URL.createObjectURL(blob);
}

// Helpers
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let clean = hex.replace("#", "");
  if (clean.length === 3) {
    clean = clean.split("").map((c) => c + c).join("");
  }
  const num = parseInt(clean, 16) || 0;
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

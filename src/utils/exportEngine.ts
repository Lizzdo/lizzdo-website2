import { toPng, toJpeg, toSvg } from "html-to-image";
import { DesignState, ExportFormat, ExportQuality, ProfessionalExportOptions } from "../types/designer";
import {
  generatePsdExport,
  generateAiOrEpsExport,
  generateEditableSvgExport,
  generateEditablePdfExport,
} from "./professionalExport";

export interface AssetDiagnostic {
  id: string;
  name: string;
  type: "background" | "image_element" | "logo_element";
  originalUrl: string;
  sanitizedUrl: string;
  status: "ok" | "warning" | "fallback_applied";
  message?: string;
}

/**
 * Calculates human readable file size string from byte count.
 */
export function formatFileSize(bytes: number): string {
  if (bytes <= 0) return "0 KB";
  const kb = bytes / 1024;
  if (kb < 1024) {
    return `${kb.toFixed(1)} KB`;
  }
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}

/**
 * Estimates file size from preview data URL or canvas state dimensions.
 */
export function estimateExportFileSize(
  dataUrl: string | null,
  width: number,
  height: number,
  format: ExportFormat,
  quality: ExportQuality
): string {
  if (dataUrl && (dataUrl.startsWith("data:") || dataUrl.startsWith("blob:"))) {
    if (dataUrl.startsWith("data:")) {
      const base64Length = dataUrl.split(",")[1]?.length || dataUrl.length;
      const bytes = Math.round((base64Length * 3) / 4);
      return formatFileSize(bytes);
    }
    return "~" + formatFileSize(width * height * 0.4);
  }

  // Fallback dimensional calculation
  const pixelCount = width * height * quality * quality;
  let bytePerPixel = 0.35; // PNG default
  if (format === "jpg") bytePerPixel = 0.15;
  if (format === "webp") bytePerPixel = 0.12;
  if (format === "svg") return "~120 KB";
  if (format === "psd") return "~4.2 MB";
  if (format === "ai" || format === "eps") return "~850 KB";
  if (format === "pdf") return "~1.5 MB";

  const estimatedBytes = Math.round(pixelCount * bytePerPixel);
  return formatFileSize(estimatedBytes);
}

/**
 * Creates an aesthetic SVG Data URL placeholder for broken or unreachable images.
 */
export function createFallbackImageSvgDataUrl(label: string = "Image Asset"): string {
  const cleanLabel = (label || "Image Asset").replace(/</g, "&lt;").replace(/>/g, "&gt;").slice(0, 30);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
    <rect width="800" height="600" fill="#0b0f19"/>
    <rect width="760" height="560" x="20" y="20" rx="16" fill="none" stroke="#00f5ff" stroke-width="2" stroke-dasharray="8,8" opacity="0.6"/>
    <circle cx="400" cy="250" r="48" fill="#1e293b" stroke="#00f5ff" stroke-width="2"/>
    <path d="M380 250l15-15 25 25 15-15 15 15" fill="none" stroke="#00f5ff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="400" y="340" font-family="sans-serif" font-size="22" font-weight="bold" fill="#00f5ff" text-anchor="middle" letter-spacing="1">
      ${cleanLabel.toUpperCase()}
    </text>
    <text x="400" y="375" font-family="monospace" font-size="13" fill="#94a3b8" text-anchor="middle">
      [CORS Safe Fallback Placeholder — Replaceable in Export Menu]
    </text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * Robust fetch & convert image URL to Base64 Data URL or Blob URL.
 */
export async function convertUrlToDataUrl(url: string): Promise<string> {
  if (!url) return "";
  if (url.startsWith("data:") || url.startsWith("blob:")) {
    return url;
  }

  const blobToDataUrl = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  try {
    const directRes = await fetch(url, { mode: "cors", cache: "force-cache" });
    if (directRes.ok) {
      const blob = await directRes.blob();
      if (blob.type.startsWith("image/")) {
        return await blobToDataUrl(blob);
      }
    }
  } catch (directErr) {
    // direct fetch failed
  }

  try {
    const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(url)}`;
    const proxyRes = await fetch(proxyUrl);
    if (proxyRes.ok) {
      const blob = await proxyRes.blob();
      if (blob.type.startsWith("image/")) {
        return await blobToDataUrl(blob);
      }
    }
  } catch (proxyErr) {
    // proxy fetch failed
  }

  try {
    const cleanUrl = url.replace(/^https?:\/\//, "");
    const extProxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(cleanUrl)}&output=png`;
    const extRes = await fetch(extProxyUrl);
    if (extRes.ok) {
      const blob = await extRes.blob();
      if (blob.type.startsWith("image/")) {
        return await blobToDataUrl(blob);
      }
    }
  } catch (extErr) {
    // ext proxy failed
  }

  try {
    const dataUrlFromCanvas = await new Promise<string>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth || 800;
          canvas.height = img.naturalHeight || 600;
          const ctx = canvas.getContext("2d");
          if (!ctx) return reject("No canvas context");
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/png"));
        } catch (canvasErr) {
          reject(canvasErr);
        }
      };
      img.onerror = reject;
      img.src = url;
    });

    if (dataUrlFromCanvas) return dataUrlFromCanvas;
  } catch (canvasErr) {
    // Canvas failed
  }

  throw new Error("Unable to fetch image directly or via CORS proxy");
}

/**
 * Inspects all images in the design state, converts them into Base64 Data URLs,
 * and generates diagnostic reports for any problematic assets.
 */
export async function prepareDesignStateForExport(
  state: DesignState
): Promise<{ sanitizedState: DesignState; diagnostics: AssetDiagnostic[] }> {
  const diagnostics: AssetDiagnostic[] = [];
  const sanitizedState: DesignState = JSON.parse(JSON.stringify(state));

  if (sanitizedState.background.type === "image" && sanitizedState.background.imageUrl) {
    const originalUrl = sanitizedState.background.imageUrl;
    try {
      const dataUrl = await convertUrlToDataUrl(originalUrl);
      sanitizedState.background.imageUrl = dataUrl;
      diagnostics.push({
        id: "bg-image",
        name: "Canvas Background Image",
        type: "background",
        originalUrl,
        sanitizedUrl: dataUrl,
        status: "ok",
      });
    } catch (err: any) {
      const fallbackUrl = createFallbackImageSvgDataUrl("Background Image");
      sanitizedState.background.imageUrl = fallbackUrl;
      diagnostics.push({
        id: "bg-image",
        name: "Canvas Background Image",
        type: "background",
        originalUrl,
        sanitizedUrl: fallbackUrl,
        status: "fallback_applied",
        message: "Remote server blocked CORS access. Fallback pattern applied.",
      });
    }
  }

  for (const el of sanitizedState.elements) {
    if ((el.type === "image" || el.type === "logo") && el.url) {
      const originalUrl = el.url;
      try {
        const dataUrl = await convertUrlToDataUrl(originalUrl);
        el.url = dataUrl;
        diagnostics.push({
          id: el.id,
          name: el.name || (el.type === "logo" ? "Brand Logo" : "Image Layer"),
          type: el.type === "logo" ? "logo_element" : "image_element",
          originalUrl,
          sanitizedUrl: dataUrl,
          status: "ok",
        });
      } catch (err: any) {
        const fallbackUrl = createFallbackImageSvgDataUrl(el.name || "Image Asset");
        el.url = fallbackUrl;
        diagnostics.push({
          id: el.id,
          name: el.name || (el.type === "logo" ? "Brand Logo" : "Image Layer"),
          type: el.type === "logo" ? "logo_element" : "image_element",
          originalUrl,
          sanitizedUrl: fallbackUrl,
          status: "fallback_applied",
          message: "CORS restriction detected. Replaced with safe placeholder.",
        });
      }
    }
  }

  return { sanitizedState, diagnostics };
}

/**
 * Ensures all <img> elements inside a DOM node are fully loaded and decoded.
 */
export async function waitForAllDomImagesToLoad(container: HTMLElement): Promise<void> {
  const images = Array.from(container.querySelectorAll<HTMLImageElement>("img"));

  const loadPromises = images.map((img) => {
    img.crossOrigin = "anonymous";
    img.referrerPolicy = "no-referrer";

    if (img.complete && img.naturalWidth > 0) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve) => {
      let resolved = false;
      const done = () => {
        if (!resolved) {
          resolved = true;
          resolve();
        }
      };

      img.addEventListener("load", done);
      img.addEventListener("error", done);
      if ("decode" in img && typeof img.decode === "function") {
        img.decode().then(done).catch(done);
      }
      setTimeout(done, 2500);
    });
  });

  await Promise.all(loadPromises);
}

/**
 * Clean 1:1 Edge-to-Edge Renderer for PNG, JPG, WebP, SVG, PSD, AI, EPS, and PDF formats.
 */
export async function renderArtworkFormat(
  node: HTMLElement,
  state: DesignState,
  format: ExportFormat,
  quality: ExportQuality,
  onProgress?: (msg: string) => void,
  profOptions?: ProfessionalExportOptions
): Promise<string> {
  const defaultProfOptions: ProfessionalExportOptions = profOptions || {
    format,
    quality,
    layerMode: "layered",
    textMode: "editable",
    imageMode: "embedded",
    colorMode: "rgb",
    transparentBg: false,
    dpi: quality === 1 ? 72 : quality === 2 ? 150 : quality === 3 ? 300 : 600,
    compression: "high_quality",
  };

  // 1. Specialized Professional Vector & Photoshop Generators
  if (format === "psd") {
    return await generatePsdExport(state, defaultProfOptions, onProgress);
  }

  if (format === "ai" || format === "eps") {
    return await generateAiOrEpsExport(state, defaultProfOptions, format === "eps", onProgress);
  }

  if (format === "svg") {
    return await generateEditableSvgExport(state, defaultProfOptions, onProgress);
  }

  if (format === "pdf") {
    return await generateEditablePdfExport(state, defaultProfOptions, onProgress);
  }

  // 2. High Quality Raster Bitmaps (PNG, JPG, WebP)
  onProgress?.("Preloading assets & verifying bitmaps...");
  await waitForAllDomImagesToLoad(node);

  onProgress?.(`Rendering 1:1 Edge-to-Edge ${format.toUpperCase()} Canvas...`);

  const options = {
    cacheBust: true,
    width: state.width,
    height: state.height,
    pixelRatio: quality,
    style: {
      transform: "none",
      transformOrigin: "top left",
      borderRadius: "0px",
      boxShadow: "none",
      margin: "0",
      position: "relative",
      top: "0",
      left: "0",
    },
    filter: (domNode: Node) => {
      if (domNode instanceof HTMLElement && domNode.dataset.exportHide === "true") {
        return false;
      }
      return true;
    },
    onClone: (clonedNode: HTMLElement) => {
      const rings = clonedNode.querySelectorAll(".ring-2, .ring-1, .ring-neon-cyan, .ring-offset-2, .ring-offset-black");
      rings.forEach((r) => {
        r.classList.remove("ring-2", "ring-1", "ring-neon-cyan", "ring-offset-2", "ring-offset-black");
      });

      const hideable = clonedNode.querySelectorAll('[data-export-hide="true"]');
      hideable.forEach((h) => ((h as HTMLElement).style.display = "none"));

      if (state.background.type === "image" && state.background.imageUrl) {
        const canvasRoot = (clonedNode.querySelector("#lizzdo-designer-canvas") as HTMLElement) || clonedNode;
        if (canvasRoot) {
          canvasRoot.style.backgroundImage = `url("${state.background.imageUrl}")`;
        }
      }

      for (const el of state.elements) {
        if ((el.type === "image" || el.type === "logo") && el.url) {
          const elContainer = clonedNode.querySelector(`[data-element-id="${el.id}"]`);
          if (elContainer) {
            const imgs = elContainer.querySelectorAll<HTMLImageElement>("img");
            imgs.forEach((img) => {
              img.src = el.url!;
            });
          }
        }
      }
    },
  };

  if (format === "png") {
    onProgress?.("Encoding Lossless PNG Buffer...");
    return await toPng(node, options);
  }

  if (format === "jpg") {
    onProgress?.("Optimizing JPEG Color Channels...");
    return await toJpeg(node, {
      ...options,
      quality: 0.95,
      backgroundColor: state.background.solidColor || "#0a0e27",
    });
  }

  if (format === "webp") {
    onProgress?.("Compressing WebP High-Efficiency Stream...");
    const pngDataUrl = await toPng(node, options);
    return await new Promise<string>((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = state.width * quality;
        canvas.height = state.height * quality;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/webp", 0.95));
        } else {
          resolve(pngDataUrl);
        }
      };
      img.onerror = () => resolve(pngDataUrl);
      img.src = pngDataUrl;
    });
  }

  return "";
}

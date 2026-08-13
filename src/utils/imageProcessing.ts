import {
  ColorAdjustments,
  TransformSettings,
  CropRect,
  ImageEffectSettings,
  BackgroundSettings,
  ImageLayer,
  ImageEditorHistorySnapshot,
} from "../types/imageEditor";

export const DEFAULT_ADJUSTMENTS: ColorAdjustments = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  vibrance: 0,
  hue: 0,
  temperature: 0,
  tint: 0,
  exposure: 0,
  highlights: 0,
  shadows: 0,
  whites: 0,
  blacks: 0,
  gamma: 1.0,
};

export const DEFAULT_TRANSFORM: TransformSettings = {
  rotate: 0,
  flipH: false,
  flipV: false,
  scaleX: 1,
  scaleY: 1,
  skewX: 0,
  skewY: 0,
  perspectiveX: 0,
  perspectiveY: 0,
};

export const DEFAULT_CROP: CropRect = {
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  aspectRatio: "free",
};

export const DEFAULT_EFFECTS: ImageEffectSettings = {
  blur: 0,
  sharpen: 0,
  noise: 0,
  glow: {
    enabled: false,
    color: "#a855f7",
    radius: 15,
    intensity: 0.8,
  },
  shadow: {
    enabled: false,
    color: "rgba(0, 0, 0, 0.6)",
    offsetX: 10,
    offsetY: 10,
    blur: 15,
  },
  outline: {
    enabled: false,
    color: "#ffffff",
    width: 4,
  },
  emboss: false,
  vintage: 0,
  blackAndWhite: false,
  sepia: 0,
  filmLook: false,
  hdr: 0,
  duotone: {
    enabled: false,
    colorA: "#06b6d4",
    colorB: "#ec4899",
  },
  colorOverlay: {
    enabled: false,
    color: "#a855f7",
    opacity: 0.2,
    blendMode: "source-over",
  },
  gradientOverlay: {
    enabled: false,
    color1: "#3b82f6",
    color2: "#ec4899",
    angle: 45,
    opacity: 0.3,
    blendMode: "source-over",
  },
};

export const DEFAULT_BACKGROUND: BackgroundSettings = {
  type: "cyber_wireframe",
  color: "#0a0a0a",
  gradientColor1: "#1e1b4b",
  gradientColor2: "#31104b",
  gradientAngle: 135,
  wireframeColor: "#a855f7",
  wireframeGridSize: 40,
  wireframeGlow: true,
  opacity: 1,
};

/**
 * Apply CSS filter string for live DOM preview
 */
export function getCssFilterString(
  adjustments: ColorAdjustments,
  effects: ImageEffectSettings
): string {
  const b = 100 + adjustments.brightness + adjustments.exposure;
  const c = 100 + adjustments.contrast;
  const s = 100 + adjustments.saturation;
  const h = adjustments.hue;
  const blur = effects.blur;
  const sepia = effects.sepia;
  const bw = effects.blackAndWhite ? 100 : 0;

  return `brightness(${Math.max(0, b)}%) contrast(${Math.max(0, c)}%) saturate(${Math.max(
    0,
    s
  )}%) hue-rotate(${h}deg) blur(${blur}px) sepia(${sepia}%) grayscale(${bw}%)`;
}

/**
 * Detect visible (non-transparent) pixel bounding box for PNG / WebP / SVG images
 */
export async function detectAlphaBounds(
  src: string
): Promise<{ x: number; y: number; width: number; height: number }> {
  return new Promise((resolve) => {
    if (!src) return resolve({ x: 0, y: 0, width: 100, height: 100 });
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const w = Math.min(img.naturalWidth || 400, 400);
        const h = Math.max(1, Math.round(w * ((img.naturalHeight || 400) / (img.naturalWidth || 400))));
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return resolve({ x: 0, y: 0, width: 100, height: 100 });
        }
        ctx.drawImage(img, 0, 0, w, h);
        const imgData = ctx.getImageData(0, 0, w, h);
        const data = imgData.data;

        let minX = w, minY = h, maxX = 0, maxY = 0;
        let found = false;

        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const alpha = data[(y * w + x) * 4 + 3];
            if (alpha > 15) {
              found = true;
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
            }
          }
        }

        if (!found || (minX === 0 && minY === 0 && maxX === w - 1 && maxY === h - 1)) {
          return resolve({ x: 0, y: 0, width: 100, height: 100 });
        }

        const visibleX = Math.round((minX / w) * 100);
        const visibleY = Math.round((minY / h) * 100);
        const visibleW = Math.max(5, Math.round(((maxX - minX + 1) / w) * 100));
        const visibleH = Math.max(5, Math.round(((maxY - minY + 1) / h) * 100));

        resolve({ x: visibleX, y: visibleY, width: visibleW, height: visibleH });
      } catch (e) {
        resolve({ x: 0, y: 0, width: 100, height: 100 });
      }
    };
    img.onerror = () => resolve({ x: 0, y: 0, width: 100, height: 100 });
    img.src = src;
  });
}

/**
 * Generate CSS filter string for CanvasElement adjustments and filter presets
 */
export function getCanvasElementCssFilter(el: {
  adjustments?: {
    brightness?: number;
    contrast?: number;
    saturation?: number;
    saturate?: number;
    exposure?: number;
    temperature?: number;
    tint?: number;
    hueRotate?: number;
    blur?: number;
    sepia?: number;
  };
  filterPreset?: string;
  filterIntensity?: number;
}): string {
  const adj = el.adjustments || {};
  const b = 100 + (adj.brightness || 0) + (adj.exposure || 0);
  const c = 100 + (adj.contrast || 0);
  const s = 100 + (adj.saturation ?? adj.saturate ?? 0);
  const blur = adj.blur || 0;
  const hue = adj.hueRotate || 0;
  const sep = adj.sepia || 0;

  // Temperature shift
  const temp = adj.temperature || 0;
  const tempHue = temp > 0 ? -15 * (temp / 100) : 20 * (Math.abs(temp) / 100);

  const intensity = (el.filterIntensity ?? 100) / 100;

  let presetFilter = "";
  const preset = el.filterPreset || "normal";

  switch (preset) {
    case "cinematic":
      presetFilter = `contrast(${100 + 40 * intensity}%) saturate(${100 + 30 * intensity}%) sepia(${20 * intensity}%)`;
      break;
    case "cyberpunk":
    case "cyber":
      presetFilter = `hue-rotate(${-30 * intensity}deg) contrast(${100 + 50 * intensity}%) saturate(${100 + 60 * intensity}%)`;
      break;
    case "neon":
      presetFilter = `saturate(${100 + 100 * intensity}%) contrast(${100 + 30 * intensity}%)`;
      break;
    case "cold":
    case "cool":
      presetFilter = `hue-rotate(${30 * intensity}deg) saturate(${100 - 20 * intensity}%)`;
      break;
    case "warm":
      presetFilter = `sepia(${30 * intensity}%) saturate(${100 + 20 * intensity}%)`;
      break;
    case "black_white":
    case "black-and-white":
    case "monochrome":
    case "noir":
      presetFilter = `grayscale(${100 * intensity}%) contrast(${100 + 30 * intensity}%)`;
      break;
    case "high_contrast":
    case "high-contrast":
    case "vivid":
      presetFilter = `contrast(${100 + 80 * intensity}%) saturate(${100 + 30 * intensity}%)`;
      break;
    case "vintage":
      presetFilter = `sepia(${50 * intensity}%) contrast(${100 - 10 * intensity}%)`;
      break;
    case "film":
      presetFilter = `contrast(${100 + 20 * intensity}%) sepia(${15 * intensity}%)`;
      break;
    case "moody":
      presetFilter = `brightness(${100 - 20 * intensity}%) contrast(${100 + 40 * intensity}%)`;
      break;
    case "clean":
      presetFilter = `brightness(${100 + 10 * intensity}%) contrast(${100 + 10 * intensity}%)`;
      break;
    case "hdr":
      presetFilter = `contrast(${100 + 60 * intensity}%) saturate(${100 + 40 * intensity}%)`;
      break;
    case "soft":
      presetFilter = `blur(${3 * intensity}px) brightness(${100 + 5 * intensity}%)`;
      break;
    case "dramatic":
      presetFilter = `contrast(${100 + 70 * intensity}%) brightness(${100 - 15 * intensity}%)`;
      break;
    case "grayscale":
      presetFilter = `grayscale(${100 * intensity}%)`;
      break;
    case "sepia":
      presetFilter = `sepia(${100 * intensity}%)`;
      break;
    default:
      presetFilter = "";
      break;
  }

  const baseFilter = `brightness(${Math.max(0, b)}%) contrast(${Math.max(0, c)}%) saturate(${Math.max(0, s)}%) hue-rotate(${hue + tempHue}deg) sepia(${sep}%) blur(${blur}px)`;
  return [baseFilter, presetFilter].filter(Boolean).join(" ");
}

/**
 * Render Cyber Wireframe or Blueprint Grid background on canvas
 */
export function renderBackgroundOnCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  bg: BackgroundSettings
) {
  ctx.save();

  if (bg.type === "transparent") {
    // Leave clear or draw checkerboard if needed
    ctx.clearRect(0, 0, width, height);
  } else if (bg.type === "solid") {
    ctx.fillStyle = bg.color || "#0d0d0d";
    ctx.fillRect(0, 0, width, height);
  } else if (bg.type === "linear_gradient") {
    const angleRad = ((bg.gradientAngle || 45) * Math.PI) / 180;
    const x2 = Math.cos(angleRad) * width;
    const y2 = Math.sin(angleRad) * height;
    const grad = ctx.createLinearGradient(0, 0, x2, y2);
    grad.addColorStop(0, bg.gradientColor1 || "#1e1b4b");
    grad.addColorStop(1, bg.gradientColor2 || "#ec4899");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  } else if (bg.type === "radial_gradient") {
    const grad = ctx.createRadialGradient(
      width / 2,
      height / 2,
      10,
      width / 2,
      height / 2,
      Math.max(width, height) / 1.2
    );
    grad.addColorStop(0, bg.gradientColor1 || "#3b82f6");
    grad.addColorStop(1, bg.gradientColor2 || "#000000");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  } else if (bg.type === "cyber_wireframe") {
    ctx.fillStyle = bg.color || "#09090b";
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = bg.wireframeColor || "rgba(168, 85, 247, 0.4)";
    ctx.lineWidth = 1;

    if (bg.wireframeGlow) {
      ctx.shadowColor = bg.wireframeColor || "#a855f7";
      ctx.shadowBlur = 8;
    }

    const gridSize = bg.wireframeGridSize || 40;
    ctx.beginPath();
    for (let x = 0; x <= width; x += gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let y = 0; y <= height; y += gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();

    // Cyber perspective grid horizon line
    ctx.strokeStyle = "rgba(236, 72, 153, 0.6)";
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
  } else if (bg.type === "blueprint_grid") {
    ctx.fillStyle = "#0284c7";
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
    ctx.lineWidth = 1;
    const gridSize = 25;
    ctx.beginPath();
    for (let x = 0; x <= width; x += gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let y = 0; y <= height; y += gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    ctx.lineWidth = 1.5;
    const majorGrid = gridSize * 4;
    ctx.beginPath();
    for (let x = 0; x <= width; x += majorGrid) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let y = 0; y <= height; y += majorGrid) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Pixel manipulation adjustments (Highlights, Shadows, Temperature, Vibrance, Gamma)
 */
export function processPixelAdjustments(
  imageData: ImageData,
  adj: ColorAdjustments
) {
  const data = imageData.data;
  const len = data.length;

  const temp = adj.temperature; // -100 to 100
  const tint = adj.tint; // -100 to 100
  const vibrance = adj.vibrance; // -100 to 100
  const gamma = adj.gamma || 1.0;
  const highlights = adj.highlights; // -100 to 100
  const shadows = adj.shadows; // -100 to 100

  for (let i = 0; i < len; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Temperature & Tint
    if (temp !== 0) {
      r += temp * 0.4;
      b -= temp * 0.4;
    }
    if (tint !== 0) {
      g += tint * 0.4;
    }

    // Gamma correction
    if (gamma !== 1.0) {
      r = 255 * Math.pow(r / 255, 1 / gamma);
      g = 255 * Math.pow(g / 255, 1 / gamma);
      b = 255 * Math.pow(b / 255, 1 / gamma);
    }

    // Highlights & Shadows
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    if (luminance > 128 && highlights !== 0) {
      const factor = ((luminance - 128) / 127) * (highlights / 100);
      r += r * factor;
      g += g * factor;
      b += b * factor;
    } else if (luminance <= 128 && shadows !== 0) {
      const factor = ((128 - luminance) / 128) * (shadows / 100);
      r += r * factor;
      g += g * factor;
      b += b * factor;
    }

    // Vibrance
    if (vibrance !== 0) {
      const max = Math.max(r, g, b);
      const avg = (r + g + b) / 3;
      const amt = (((max - avg) / 255) * -vibrance) / 100;
      r += (max - r) * amt;
      g += (max - g) * amt;
      b += (max - b) * amt;
    }

    data[i] = Math.min(255, Math.max(0, r));
    data[i + 1] = Math.min(255, Math.max(0, g));
    data[i + 2] = Math.min(255, Math.max(0, b));
  }
}

/**
 * Render complete composite canvas to Blob or DataURL for high quality export
 */
export async function renderExportCanvas(
  width: number,
  height: number,
  layers: ImageLayer[],
  background: BackgroundSettings,
  adjustments: ColorAdjustments,
  effects: ImageEffectSettings,
  crop: CropRect,
  scaleMultiplier: number = 1
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width * scaleMultiplier);
  canvas.height = Math.round(height * scaleMultiplier);

  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  ctx.scale(scaleMultiplier, scaleMultiplier);

  // 1. Draw Background
  renderBackgroundOnCanvas(ctx, width, height, background);

  // 2. Draw Layers in order
  for (const layer of layers) {
    if (!layer.visible) continue;

    ctx.save();
    ctx.globalAlpha = layer.opacity;
    ctx.globalCompositeOperation = layer.blendMode || "source-over";

    // Transform layer position
    ctx.translate(layer.x + layer.width / 2, layer.y + layer.height / 2);
    ctx.rotate((layer.rotation * Math.PI) / 180);

    if (layer.type === "image" && layer.src) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = layer.src;

      await new Promise((resolve) => {
        if (img.complete) resolve(true);
        else img.onload = () => resolve(true);
      });

      // Apply layer effects / CSS filters on canvas
      const filterStr = getCssFilterString(
        { ...adjustments, ...(layer.adjustments || {}) },
        { ...effects, ...(layer.effects || {}) }
      );
      ctx.filter = filterStr;

      ctx.drawImage(
        img,
        -layer.width / 2,
        -layer.height / 2,
        layer.width,
        layer.height
      );
      ctx.filter = "none";
    } else if (layer.type === "text" && layer.text) {
      ctx.font = `${layer.fontWeight || "bold"} ${layer.fontSize || 32}px ${
        layer.fontFamily || "sans-serif"
      }`;
      ctx.fillStyle = layer.textColor || "#ffffff";
      ctx.textAlign = layer.textAlign || "center";
      ctx.textBaseline = "middle";

      if (effects.glow?.enabled) {
        ctx.shadowColor = effects.glow.color;
        ctx.shadowBlur = effects.glow.radius;
      }

      ctx.fillText(layer.text, 0, 0);
    } else if (layer.type === "shape") {
      ctx.fillStyle = layer.fillColor || "#a855f7";
      ctx.strokeStyle = layer.strokeColor || "#ffffff";
      ctx.lineWidth = layer.strokeWidth || 0;

      if (layer.shapeType === "circle") {
        ctx.beginPath();
        ctx.arc(0, 0, layer.width / 2, 0, Math.PI * 2);
        ctx.fill();
        if (layer.strokeWidth) ctx.stroke();
      } else if (layer.shapeType === "rounded_rect") {
        const r = layer.cornerRadius || 16;
        ctx.beginPath();
        ctx.roundRect(
          -layer.width / 2,
          -layer.height / 2,
          layer.width,
          layer.height,
          r
        );
        ctx.fill();
        if (layer.strokeWidth) ctx.stroke();
      } else {
        ctx.fillRect(
          -layer.width / 2,
          -layer.height / 2,
          layer.width,
          layer.height
        );
      }
    }

    ctx.restore();
  }

  // 3. Apply Crop if crop rect is active (< 100%)
  if (
    crop.width < 100 ||
    crop.height < 100 ||
    crop.x > 0 ||
    crop.y > 0
  ) {
    const croppedCanvas = document.createElement("canvas");
    const cropX = Math.round((crop.x / 100) * canvas.width);
    const cropY = Math.round((crop.y / 100) * canvas.height);
    const cropW = Math.round((crop.width / 100) * canvas.width);
    const cropH = Math.round((crop.height / 100) * canvas.height);

    croppedCanvas.width = cropW;
    croppedCanvas.height = cropH;
    const cropCtx = croppedCanvas.getContext("2d");
    if (cropCtx) {
      cropCtx.drawImage(
        canvas,
        cropX,
        cropY,
        cropW,
        cropH,
        0,
        0,
        cropW,
        cropH
      );
      return croppedCanvas;
    }
  }

  return canvas;
}

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

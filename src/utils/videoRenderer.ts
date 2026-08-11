import { VideoClip, VideoProjectData, LogoAnimationPreset, ChromaKeyProps } from "../types/video";
import { renderProjectAudioMix } from "./audioEngine";

// Cache for loaded HTMLImageElements
const imageCache: Map<string, HTMLImageElement> = new Map();
// Cache for loaded HTMLVideoElements
const videoCache: Map<string, HTMLVideoElement> = new Map();
// Cache for Chroma Keyed offscreen canvases
const keyedCanvasCache: Map<string, HTMLCanvasElement> = new Map();

export interface VideoState {
  loaded: boolean;
  error: boolean;
  errorMessage?: string;
}
const videoStateCache: Map<string, VideoState> = new Map();

// Helper to determine if a clip source is a video file or video track clip
export function isVideoSource(clip: VideoClip): boolean {
  if (clip.type === "video") return true;
  const ft = (clip.fileType || "").toLowerCase();
  if (["mp4", "webm", "mov", "mkv", "avi", "m4v", "ogv", "video"].includes(ft)) return true;
  const src = (clip.src || "").toLowerCase();
  if (src.startsWith("data:video")) return true;
  if (src.endsWith(".mp4") || src.endsWith(".webm") || src.endsWith(".mov") || src.endsWith(".mkv") || src.endsWith(".m4v")) return true;
  if (src.includes("gtv-videos") || (src.includes("/sample/") && src.includes(".mp4"))) return true;
  return false;
}

// Helper to safely load or retrieve image from cache
export function getLoadedImage(url: string): HTMLImageElement | null {
  if (!url) return null;
  if (imageCache.has(url)) {
    const img = imageCache.get(url)!;
    return img.complete && img.naturalWidth > 0 ? img : null;
  }

  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = url;
  imageCache.set(url, img);
  return null;
}

// Helper to safely load or retrieve video element from cache
export function getLoadedVideo(url: string): { video: HTMLVideoElement | null; state: VideoState } {
  if (!url) return { video: null, state: { loaded: false, error: true, errorMessage: "No video URL" } };

  if (videoCache.has(url)) {
    const video = videoCache.get(url)!;
    const state = videoStateCache.get(url) || { loaded: false, error: false };
    if (video.readyState >= 1) {
      state.loaded = true;
    }
    return { video, state };
  }

  const video = document.createElement("video");
  video.crossOrigin = "anonymous";
  video.playsInline = true;
  video.muted = true; // Mute preview element so browser allows unrestricted playback & seeking
  video.preload = "auto";

  const state: VideoState = { loaded: false, error: false };
  videoStateCache.set(url, state);

  video.onloadedmetadata = () => {
    state.loaded = true;
    state.error = false;
  };

  video.oncanplay = () => {
    state.loaded = true;
    state.error = false;
  };

  video.onerror = () => {
    state.loaded = false;
    state.error = true;
    state.errorMessage = video.error?.message || "Failed to load video file";
  };

  video.src = url;
  video.load();
  videoCache.set(url, video);

  return { video, state };
}

// Generate procedural waveform amplitude array for audio clips
export function generateWaveformPoints(seedStr: string, count: number = 80): number[] {
  const points: number[] = [];
  let seed = 0;
  for (let i = 0; i < seedStr.length; i++) {
    seed += seedStr.charCodeAt(i);
  }

  for (let i = 0; i < count; i++) {
    const val = (Math.sin(i * 0.3 + seed) * 0.4 + Math.cos(i * 0.7) * 0.3 + 0.5);
    points.push(Math.min(1, Math.max(0.1, val)));
  }
  return points;
}

// Chroma Key Offscreen Image/Video Keying Engine
export function getChromaKeyedCanvas(
  source: HTMLImageElement | HTMLVideoElement,
  chromaKey: ChromaKeyProps
): HTMLCanvasElement | null {
  const isVideo = source instanceof HTMLVideoElement;
  const w = isVideo ? source.videoWidth : source.naturalWidth;
  const h = isVideo ? source.videoHeight : source.naturalHeight;
  if (!w || !h) return null;

  const timeKey = isVideo ? `_${source.currentTime.toFixed(2)}` : "";
  const cacheKey = `${source.src}_${chromaKey.keyColor}_${chromaKey.similarity}_${chromaKey.tolerance}_${chromaKey.spillReduction}${timeKey}`;
  if (keyedCanvasCache.has(cacheKey)) {
    return keyedCanvasCache.get(cacheKey)!;
  }

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.drawImage(source, 0, 0);
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  // Parse key color hex e.g. #00ff00
  const hex = (chromaKey.keyColor || "#00ff00").replace("#", "");
  const targetR = parseInt(hex.substring(0, 2), 16) || 0;
  const targetG = parseInt(hex.substring(2, 4), 16) || 0;
  const targetB = parseInt(hex.substring(4, 6), 16) || 0;

  const similarity = chromaKey.similarity ?? 0.3;
  const tolerance = chromaKey.tolerance ?? 0.1;
  const spill = chromaKey.spillReduction ?? 0.5;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const dist = Math.sqrt((r - targetR) ** 2 + (g - targetG) ** 2 + (b - targetB) ** 2) / 441.673;

    if (dist < similarity) {
      data[i + 3] = 0; // Fully transparent
    } else if (dist < similarity + tolerance) {
      const alphaFactor = (dist - similarity) / tolerance;
      data[i + 3] = Math.round(data[i + 3] * alphaFactor);
    }

    if (data[i + 3] > 0 && spill > 0) {
      if (targetG > targetR && targetG > targetB) {
        const maxRB = Math.max(r, b);
        if (g > maxRB) {
          data[i + 1] = Math.round(g * (1 - spill) + maxRB * spill);
        }
      } else if (targetB > targetR && targetB > targetG) {
        const maxRG = Math.max(r, g);
        if (b > maxRG) {
          data[i + 2] = Math.round(b * (1 - spill) + maxRG * spill);
        }
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
  keyedCanvasCache.set(cacheKey, canvas);
  return canvas;
}

// Render Safe Area Guides Overlay
export function renderGuidesOnCanvas(
  ctx: CanvasRenderingContext2D,
  preset: string,
  cw: number,
  ch: number
) {
  ctx.save();
  ctx.strokeStyle = "rgba(0, 245, 255, 0.6)";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 4]);

  if (preset === "grid") {
    // Rule of Thirds
    ctx.beginPath();
    ctx.moveTo(cw / 3, 0); ctx.lineTo(cw / 3, ch);
    ctx.moveTo((cw * 2) / 3, 0); ctx.lineTo((cw * 2) / 3, ch);
    ctx.moveTo(0, ch / 3); ctx.lineTo(cw, ch / 3);
    ctx.moveTo(0, (ch * 2) / 3); ctx.lineTo(cw, (ch * 2) / 3);
    ctx.stroke();
  } else if (preset === "youtube") {
    // 16:9 Title Safe Area
    const padX = cw * 0.1;
    const padY = ch * 0.1;
    ctx.strokeRect(padX, padY, cw - padX * 2, ch - padY * 2);
    ctx.fillStyle = "rgba(0, 245, 255, 0.9)";
    ctx.font = "bold 12px sans-serif";
    ctx.fillText("YouTube Title Safe Zone", padX + 10, padY + 20);
  } else if (preset === "tiktok") {
    // 9:16 Feed Safe Area
    const padTop = ch * 0.15;
    const padBottom = ch * 0.25;
    const padRight = cw * 0.2;
    ctx.strokeRect(0, padTop, cw - padRight, ch - padTop - padBottom);
    ctx.fillStyle = "rgba(0, 245, 255, 0.9)";
    ctx.font = "bold 12px sans-serif";
    ctx.fillText("TikTok Feed Safe Zone", 12, padTop + 20);
  } else if (preset === "instagram") {
    // 4:5 Safe Area
    const padY = ch * 0.1;
    ctx.strokeRect(cw * 0.05, padY, cw * 0.9, ch - padY * 2);
    ctx.fillStyle = "rgba(0, 245, 255, 0.9)";
    ctx.font = "bold 12px sans-serif";
    ctx.fillText("Instagram Safe Zone", cw * 0.05 + 10, padY + 20);
  }

  ctx.restore();
}

// Render Burned-In Subtitles / Captions
export function renderCaptionsOnCanvas(
  ctx: CanvasRenderingContext2D,
  project: VideoProjectData,
  time: number,
  cw: number,
  ch: number,
  scaleX: number
) {
  if (!project.captions || project.captions.length === 0) return;

  const activeCap = project.captions.find((c) => time >= c.startTime && time <= c.endTime);
  if (!activeCap || !activeCap.text) return;

  const style = project.captionStyle || {
    fontFamily: "Inter",
    fontSize: 28,
    fontWeight: 700,
    color: "#ffffff",
    backgroundColor: "rgba(0,0,0,0.75)",
    backgroundPadding: 10,
    outlineColor: "#000000",
    outlineWidth: 2,
    shadowColor: "rgba(0,0,0,0.5)",
    shadowBlur: 6,
    alignment: "center",
    positionY: 0.85,
    highlightColor: "#00f5ff",
  };

  ctx.save();

  const fontPx = Math.round((style.fontSize || 28) * scaleX);
  ctx.font = `${style.fontWeight || 700} ${fontPx}px ${style.fontFamily || "Inter"}, sans-serif`;
  ctx.textAlign = style.alignment || "center";
  ctx.textBaseline = "middle";

  const words = activeCap.text.split(" ");
  const capDur = activeCap.endTime - activeCap.startTime;
  const elapsed = time - activeCap.startTime;
  const currentWordIdx = Math.min(words.length - 1, Math.floor((elapsed / capDur) * words.length));

  const textMetrics = ctx.measureText(activeCap.text);
  const textW = textMetrics.width;
  const textH = fontPx * 1.2;

  const posX = style.alignment === "left" ? cw * 0.1 : style.alignment === "right" ? cw * 0.9 : cw / 2;
  const posY = ch * (style.positionY || 0.85);

  // Background Pill
  if (style.backgroundColor && style.backgroundColor !== "transparent") {
    const pad = (style.backgroundPadding || 8) * scaleX;
    ctx.fillStyle = style.backgroundColor;
    ctx.beginPath();
    let bgLeft = posX - textW / 2 - pad;
    if (style.alignment === "left") bgLeft = posX - pad;
    if (style.alignment === "right") bgLeft = posX - textW - pad;
    ctx.roundRect(bgLeft, posY - textH / 2 - pad, textW + pad * 2, textH + pad * 2, 8 * scaleX);
    ctx.fill();
  }

  // Shadow
  if (style.shadowColor && style.shadowBlur > 0) {
    ctx.shadowColor = style.shadowColor;
    ctx.shadowBlur = style.shadowBlur;
  }

  // Word-by-word highlight or full text
  if (style.presetName === "highlight" || style.highlightColor) {
    let currentX = style.alignment === "center" ? posX - textW / 2 : posX;
    ctx.textAlign = "left";

    words.forEach((word, idx) => {
      const wordStr = word + " ";
      const wordW = ctx.measureText(wordStr).width;

      if (idx === currentWordIdx && style.highlightColor) {
        ctx.fillStyle = style.highlightColor;
      } else {
        ctx.fillStyle = style.color || "#ffffff";
      }

      if (style.outlineWidth && style.outlineWidth > 0) {
        ctx.strokeStyle = style.outlineColor || "#000000";
        ctx.lineWidth = style.outlineWidth * scaleX;
        ctx.strokeText(wordStr, currentX, posY);
      }

      ctx.fillText(wordStr, currentX, posY);
      currentX += wordW;
    });
  } else {
    // Standard full line text
    if (style.outlineWidth && style.outlineWidth > 0) {
      ctx.strokeStyle = style.outlineColor || "#000000";
      ctx.lineWidth = style.outlineWidth * scaleX;
      ctx.strokeText(activeCap.text, posX, posY);
    }

    ctx.fillStyle = style.color || "#ffffff";
    ctx.fillText(activeCap.text, posX, posY);
  }

  ctx.restore();
}

// Main Frame Renderer for Video Canvas
export function renderFrameToCanvas(
  ctx: CanvasRenderingContext2D,
  project: VideoProjectData,
  time: number,
  canvasWidth: number,
  canvasHeight: number
) {
  ctx.save();

  // Clear Canvas & Render Background
  if (project.bgType === "gradient") {
    const grad = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
    grad.addColorStop(0, "#0f172a");
    grad.addColorStop(0.5, "#1e1b4b");
    grad.addColorStop(1, "#311042");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  } else if (project.bgType === "wireframe") {
    ctx.fillStyle = "#09090b";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.strokeStyle = "rgba(0, 245, 255, 0.08)";
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < canvasWidth; x += gridSize) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvasHeight); ctx.stroke();
    }
    for (let y = 0; y < canvasHeight; y += gridSize) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvasWidth, y); ctx.stroke();
    }
  } else if (project.bgType === "image" && project.bgImage) {
    const bgImg = getLoadedImage(project.bgImage);
    if (bgImg) {
      ctx.drawImage(bgImg, 0, 0, canvasWidth, canvasHeight);
    } else {
      ctx.fillStyle = project.bgColor || "#05050a";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    }
  } else {
    ctx.fillStyle = project.bgColor || "#05050a";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  }

  const scaleX = canvasWidth / project.width;
  const scaleY = canvasHeight / project.height;

  // Filter visible & non-locked tracks sorted by display order
  const activeTracks = project.tracks.filter((t) => !t.isHidden);

  // Group active clips by time
  const activeClips = project.clips.filter((clip) => {
    const track = activeTracks.find((t) => t.id === clip.trackId);
    if (!track) return false;
    return time >= clip.startTime && time <= clip.startTime + clip.duration;
  });

  // Track priority
  const trackTypePriority: Record<string, number> = {
    background: 1,
    video: 2,
    audio: 3,
    overlay: 4,
    logo: 5,
    text: 6,
    caption: 7,
    adjustment: 8,
    effect: 9,
  };

  activeClips.sort((a, b) => {
    const pA = trackTypePriority[a.type] || 5;
    const pB = trackTypePriority[b.type] || 5;
    return pA - pB;
  });

  // Render each clip or handle adjustment layers
  for (const clip of activeClips) {
    if (clip.type === "adjustment") {
      // Apply Adjustment Layer filter to existing canvas content below
      const relTime = time - clip.startTime;
      const adjBlur = getInterpolatedValue(clip, "blur", relTime, clip.effectProps?.blur || 0);
      const adjBrightness = getInterpolatedValue(clip, "brightness", relTime, clip.effectProps?.brightness || 0);
      const adjContrast = getInterpolatedValue(clip, "contrast", relTime, clip.effectProps?.contrast || 0);
      const adjSaturation = getInterpolatedValue(clip, "saturation", relTime, clip.effectProps?.saturation || 100);

      const snapCanvas = document.createElement("canvas");
      snapCanvas.width = canvasWidth;
      snapCanvas.height = canvasHeight;
      const snapCtx = snapCanvas.getContext("2d");
      if (snapCtx) {
        snapCtx.drawImage(ctx.canvas, 0, 0);
        ctx.save();
        const filterParts: string[] = [];
        if (adjBlur > 0) filterParts.push(`blur(${adjBlur}px)`);
        if (adjBrightness !== 0) filterParts.push(`brightness(${100 + adjBrightness}%)`);
        if (adjContrast !== 0) filterParts.push(`contrast(${100 + adjContrast}%)`);
        if (adjSaturation !== 100) filterParts.push(`saturate(${adjSaturation}%)`);

        if (filterParts.length > 0) {
          ctx.filter = filterParts.join(" ");
        }
        ctx.drawImage(snapCanvas, 0, 0);
        ctx.restore();
      }
    } else {
      renderClipOnCanvas(ctx, clip, time, canvasWidth, canvasHeight, scaleX, scaleY);
    }
  }

  // Render Captions
  renderCaptionsOnCanvas(ctx, project, time, canvasWidth, canvasHeight, scaleX);

  // Draw Guides Overlay if enabled
  if (project.showGuides && project.guidePreset && project.guidePreset !== "none") {
    renderGuidesOnCanvas(ctx, project.guidePreset, canvasWidth, canvasHeight);
  }

  ctx.restore();
}

// Calculate keyframe interpolated value for any clip property
export function getInterpolatedValue(
  clip: VideoClip,
  property: string,
  relTime: number,
  defaultValue: number
): number {
  if (!clip.keyframes || clip.keyframes.length === 0) return defaultValue;

  const kfs = clip.keyframes
    .filter((k) => k.property === property)
    .sort((a, b) => a.time - b.time);

  if (kfs.length === 0) return defaultValue;
  if (relTime <= kfs[0].time) return kfs[0].value;
  if (relTime >= kfs[kfs.length - 1].time) return kfs[kfs.length - 1].value;

  let k1 = kfs[0];
  let k2 = kfs[kfs.length - 1];
  for (let i = 0; i < kfs.length - 1; i++) {
    if (relTime >= kfs[i].time && relTime <= kfs[i + 1].time) {
      k1 = kfs[i];
      k2 = kfs[i + 1];
      break;
    }
  }

  const duration = k2.time - k1.time;
  if (duration <= 0) return k1.value;

  let progress = (relTime - k1.time) / duration;

  const mode = k2.easing || "linear";
  let eased = progress;
  if (mode === "easeIn") {
    eased = progress * progress;
  } else if (mode === "easeOut") {
    eased = progress * (2 - progress);
  } else if (mode === "easeInOut") {
    eased = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
  } else if (mode === "hold") {
    eased = 0;
  }

  return k1.value + (k2.value - k1.value) * eased;
}

function renderClipOnCanvas(
  ctx: CanvasRenderingContext2D,
  clip: VideoClip,
  time: number,
  cw: number,
  ch: number,
  scaleX: number,
  scaleY: number
) {
  let relTime = time - clip.startTime;
  if (relTime < 0 || relTime > clip.duration) return;

  // Handle Reverse processing
  if (clip.isReversed) {
    relTime = clip.duration - relTime;
  }

  // Evaluate keyframe interpolated values
  const currentOpacity = getInterpolatedValue(clip, "opacity", relTime, clip.opacity);
  const currentPosX = getInterpolatedValue(clip, "posX", relTime, clip.posX);
  const currentPosY = getInterpolatedValue(clip, "posY", relTime, clip.posY);
  const currentScale = getInterpolatedValue(clip, "scale", relTime, clip.scale);
  const currentRotation = getInterpolatedValue(clip, "rotation", relTime, clip.rotation);

  const currentBlur = getInterpolatedValue(clip, "blur", relTime, clip.effectProps?.blur || 0);
  const currentBrightness = getInterpolatedValue(clip, "brightness", relTime, clip.effectProps?.brightness || 0);
  const currentContrast = getInterpolatedValue(clip, "contrast", relTime, clip.effectProps?.contrast || 0);
  const currentSaturation = getInterpolatedValue(clip, "saturation", relTime, clip.effectProps?.saturation || 100);

  const currentCropTop = getInterpolatedValue(clip, "cropTop", relTime, clip.crop?.top || 0);
  const currentCropBottom = getInterpolatedValue(clip, "cropBottom", relTime, clip.crop?.bottom || 0);
  const currentCropLeft = getInterpolatedValue(clip, "cropLeft", relTime, clip.crop?.left || 0);
  const currentCropRight = getInterpolatedValue(clip, "cropRight", relTime, clip.crop?.right || 0);

  // 1. Calculate Opacity with Fade In / Fade Out
  let clipOpacity = currentOpacity;
  if (clip.fadeIn > 0 && relTime < clip.fadeIn) {
    clipOpacity *= relTime / clip.fadeIn;
  }
  if (clip.fadeOut > 0 && relTime > clip.duration - clip.fadeOut) {
    clipOpacity *= (clip.duration - relTime) / clip.fadeOut;
  }

  // Handle Clip Transitions
  if (clip.transition && clip.transition.type !== "none" && clip.transition.duration > 0) {
    const transDur = clip.transition.duration;
    if (relTime < transDur) {
      const progress = relTime / transDur;
      if (clip.transition.type === "dipToBlack" || clip.transition.type === "fade") {
        clipOpacity *= progress;
      }
    }
  }

  clipOpacity = Math.max(0, Math.min(1, clipOpacity));
  if (clipOpacity <= 0) return;

  ctx.save();
  ctx.globalAlpha = clipOpacity;

  // Apply Blend Mode if defined
  if (clip.blendMode && clip.blendMode !== "normal") {
    ctx.globalCompositeOperation = clip.blendMode as GlobalCompositeOperation;
  }

  // Apply Shadow if configured
  if (clip.shadow && (clip.shadow.blur > 0 || clip.shadow.offsetX !== 0 || clip.shadow.offsetY !== 0)) {
    ctx.shadowColor = clip.shadow.color || "#000000";
    ctx.shadowBlur = (clip.shadow.blur || 0) * scaleX;
    ctx.shadowOffsetX = (clip.shadow.offsetX || 0) * scaleX;
    ctx.shadowOffsetY = (clip.shadow.offsetY || 0) * scaleY;
  }

  // 2. Center Origin & Transforms
  const centerX = cw / 2 + currentPosX * scaleX;
  const centerY = ch / 2 + currentPosY * scaleY;

  ctx.translate(centerX, centerY);

  if (currentRotation !== 0) {
    ctx.rotate((currentRotation * Math.PI) / 180);
  }

  // 3. Logo & Element Animation Calculations
  let animScale = currentScale;
  let animOffsetX = 0;
  let animOffsetY = 0;

  if (clip.logoAnim && clip.logoAnim.preset !== "none") {
    const animDur = clip.logoAnim.duration || 1;
    const animProgress = Math.min(1, relTime / animDur);

    switch (clip.logoAnim.preset) {
      case "fadeIn":
        break;
      case "scaleIn":
        animScale *= animProgress;
        break;
      case "scaleOut":
        animScale *= Math.max(0, 1 - animProgress);
        break;
      case "slideLeft":
        animOffsetX = (1 - animProgress) * 200;
        break;
      case "slideRight":
        animOffsetX = -(1 - animProgress) * 200;
        break;
      case "slideUp":
        animOffsetY = (1 - animProgress) * 200;
        break;
      case "slideDown":
        animOffsetY = -(1 - animProgress) * 200;
        break;
      case "bounce":
        animOffsetY = Math.sin(relTime * 6) * 15;
        break;
      case "pop":
        animScale *= 1 + Math.sin(animProgress * Math.PI) * 0.3;
        break;
      case "rotate":
        ctx.rotate(relTime * 2);
        break;
    }
  }

  ctx.translate(animOffsetX * scaleX, animOffsetY * scaleY);
  ctx.scale(clip.flipX ? -animScale : animScale, clip.flipY ? -animScale : animScale);

  // 4. Filters & Color Effects (Keyframed unless bypassed)
  if (!clip.isBypassedEffects) {
    const filterParts: string[] = [];
    if (currentBlur > 0) filterParts.push(`blur(${currentBlur}px)`);
    if (currentBrightness !== 0) filterParts.push(`brightness(${100 + currentBrightness}%)`);
    if (currentContrast !== 0) filterParts.push(`contrast(${100 + currentContrast}%)`);
    if (currentSaturation !== 100) filterParts.push(`saturate(${currentSaturation}%)`);

    const fx = clip.effectProps;
    if (fx && fx.hueRotate !== 0) filterParts.push(`hue-rotate(${fx.hueRotate}deg)`);

    if (filterParts.length > 0) {
      ctx.filter = filterParts.join(" ");
    }
  }

  // 5. Draw Content depending on Clip Type
  if (clip.type === "video" || clip.type === "overlay" || clip.type === "logo" || clip.type === "background") {
    const isVid = isVideoSource(clip);

    if (isVid) {
      const { video, state } = getLoadedVideo(clip.src);

      if (video && (video.readyState >= 1 || state.loaded)) {
        const rawW = video.videoWidth || 1920;
        const rawH = video.videoHeight || 1080;

        // Calculate target media time
        const targetMediaTime = Math.max(0, (relTime * clip.speed) + (clip.mediaOffset || 0));
        const dur = video.duration || clip.mediaDuration || clip.duration;
        const clampedMediaTime = Math.min(dur, Math.max(0, targetMediaTime));

        // Sync video current time
        if (Math.abs(video.currentTime - clampedMediaTime) > 0.03) {
          try {
            video.currentTime = clampedMediaTime;
          } catch (e) {
            // Ignore rapid scrub DOMException
          }
        }

        // Crop coordinates calculation (Keyframed)
        const cropL = currentCropLeft * 0.01 * rawW;
        const cropR = currentCropRight * 0.01 * rawW;
        const cropT = currentCropTop * 0.01 * rawH;
        const cropB = currentCropBottom * 0.01 * rawH;

        const srcX = cropL;
        const srcY = cropT;
        const srcW = Math.max(1, rawW - cropL - cropR);
        const srcH = Math.max(1, rawH - cropT - cropB);

        const destW = srcW * scaleX;
        const destH = srcH * scaleY;

        // Frame Shape & Clipping Path (Circle, Rounded Corners)
        ctx.save();
        ctx.beginPath();
        if (clip.frameShape === "circle") {
          const radius = Math.min(destW, destH) / 2;
          ctx.arc(0, 0, radius, 0, Math.PI * 2);
          ctx.clip();
        } else if (clip.frameShape === "rounded" || clip.cornerRadius) {
          const cr = clip.cornerRadius || { topLeft: 16, topRight: 16, bottomLeft: 16, bottomRight: 16, isLinked: true };
          const tl = (cr.topLeft || 0) * scaleX;
          const tr = (cr.topRight || 0) * scaleX;
          const br = (cr.bottomRight || 0) * scaleX;
          const bl = (cr.bottomLeft || 0) * scaleX;
          ctx.roundRect(-destW / 2, -destH / 2, destW, destH, [tl, tr, br, bl]);
          ctx.clip();
        }

        // Mask Path Clipping
        if (clip.mask && clip.mask.type !== "none" && !clip.isBypassedEffects) {
          const mk = clip.mask;
          const mw = (mk.width || destW) * (mk.scale || 1) * scaleX;
          const mh = (mk.height || destH) * (mk.scale || 1) * scaleY;
          const mx = (mk.posX || 0) * scaleX;
          const my = (mk.posY || 0) * scaleY;

          ctx.beginPath();
          if (mk.type === "circle") {
            ctx.arc(mx, my, Math.min(mw, mh) / 2, 0, Math.PI * 2);
          } else if (mk.type === "ellipse") {
            ctx.ellipse(mx, my, mw / 2, mh / 2, 0, 0, Math.PI * 2);
          } else if (mk.type === "rounded") {
            ctx.roundRect(mx - mw / 2, my - mh / 2, mw, mh, 16 * scaleX);
          } else {
            ctx.rect(mx - mw / 2, my - mh / 2, mw, mh);
          }
          ctx.clip();
        }

        // Render Video or Chroma Keyed Canvas
        if (clip.chromaKey?.enabled && !clip.isBypassedEffects) {
          const keyedCanvas = getChromaKeyedCanvas(video, clip.chromaKey);
          if (keyedCanvas) {
            ctx.drawImage(keyedCanvas, srcX, srcY, srcW, srcH, -destW / 2, -destH / 2, destW, destH);
          } else {
            ctx.drawImage(video, srcX, srcY, srcW, srcH, -destW / 2, -destH / 2, destW, destH);
          }
        } else {
          ctx.drawImage(video, srcX, srcY, srcW, srcH, -destW / 2, -destH / 2, destW, destH);
        }

        ctx.restore();

        // Render Border / Stroke around content
        if (clip.border && clip.border.width > 0) {
          ctx.save();
          ctx.strokeStyle = clip.border.color || "#00f5ff";
          ctx.lineWidth = clip.border.width * scaleX;
          ctx.globalAlpha = clipOpacity * (clip.border.opacity ?? 1);

          ctx.beginPath();
          if (clip.frameShape === "circle") {
            const radius = Math.min(destW, destH) / 2;
            ctx.arc(0, 0, radius, 0, Math.PI * 2);
          } else if (clip.frameShape === "rounded" || clip.cornerRadius) {
            const cr = clip.cornerRadius || { topLeft: 16, topRight: 16, bottomLeft: 16, bottomRight: 16, isLinked: true };
            const tl = (cr.topLeft || 0) * scaleX;
            const tr = (cr.topRight || 0) * scaleX;
            const br = (cr.bottomRight || 0) * scaleX;
            const bl = (cr.bottomLeft || 0) * scaleX;
            ctx.roundRect(-destW / 2, -destH / 2, destW, destH, [tl, tr, br, bl]);
          } else {
            ctx.rect(-destW / 2, -destH / 2, destW, destH);
          }
          ctx.stroke();
          ctx.restore();
        }
      } else if (state.error) {
        // Video Error State Badge
        const boxW = 320 * scaleX;
        const boxH = 180 * scaleY;
        ctx.fillStyle = "rgba(239, 68, 68, 0.15)";
        ctx.strokeStyle = "rgba(239, 68, 68, 0.6)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(-boxW / 2, -boxH / 2, boxW, boxH, 12);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#ef4444";
        ctx.font = `bold ${Math.round(13 * scaleX)}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Unable to load video", 0, -10);
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.font = `${Math.round(10 * scaleX)}px sans-serif`;
        ctx.fillText(state.errorMessage || "Media file unreadable", 0, 12);
      } else {
        // Video Loading State Badge
        const boxW = 320 * scaleX;
        const boxH = 180 * scaleY;
        ctx.fillStyle = "rgba(15, 23, 42, 0.6)";
        ctx.strokeStyle = "rgba(0, 245, 255, 0.3)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(-boxW / 2, -boxH / 2, boxW, boxH, 12);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#00f5ff";
        ctx.font = `bold ${Math.round(12 * scaleX)}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Loading video...", 0, 0);
      }
    } else {
      // Image Source Handling
      const img = getLoadedImage(clip.src);
      if (img && img.complete && img.naturalWidth > 0) {
        const rawW = img.naturalWidth;
        const rawH = img.naturalHeight;

        const cropL = currentCropLeft * 0.01 * rawW;
        const cropR = currentCropRight * 0.01 * rawW;
        const cropT = currentCropTop * 0.01 * rawH;
        const cropB = currentCropBottom * 0.01 * rawH;

        const srcX = cropL;
        const srcY = cropT;
        const srcW = Math.max(1, rawW - cropL - cropR);
        const srcH = Math.max(1, rawH - cropT - cropB);

        const destW = srcW * scaleX;
        const destH = srcH * scaleY;

        ctx.save();
        ctx.beginPath();
        if (clip.frameShape === "circle") {
          const radius = Math.min(destW, destH) / 2;
          ctx.arc(0, 0, radius, 0, Math.PI * 2);
          ctx.clip();
        } else if (clip.frameShape === "rounded" || clip.cornerRadius) {
          const cr = clip.cornerRadius || { topLeft: 16, topRight: 16, bottomLeft: 16, bottomRight: 16, isLinked: true };
          const tl = (cr.topLeft || 0) * scaleX;
          const tr = (cr.topRight || 0) * scaleX;
          const br = (cr.bottomRight || 0) * scaleX;
          const bl = (cr.bottomLeft || 0) * scaleX;
          ctx.roundRect(-destW / 2, -destH / 2, destW, destH, [tl, tr, br, bl]);
          ctx.clip();
        }

        if (clip.mask && clip.mask.type !== "none" && !clip.isBypassedEffects) {
          const mk = clip.mask;
          const mw = (mk.width || destW) * (mk.scale || 1) * scaleX;
          const mh = (mk.height || destH) * (mk.scale || 1) * scaleY;
          const mx = (mk.posX || 0) * scaleX;
          const my = (mk.posY || 0) * scaleY;

          ctx.beginPath();
          if (mk.type === "circle") {
            ctx.arc(mx, my, Math.min(mw, mh) / 2, 0, Math.PI * 2);
          } else if (mk.type === "ellipse") {
            ctx.ellipse(mx, my, mw / 2, mh / 2, 0, 0, Math.PI * 2);
          } else if (mk.type === "rounded") {
            ctx.roundRect(mx - mw / 2, my - mh / 2, mw, mh, 16 * scaleX);
          } else {
            ctx.rect(mx - mw / 2, my - mh / 2, mw, mh);
          }
          ctx.clip();
        }

        if (clip.chromaKey?.enabled && !clip.isBypassedEffects) {
          const keyedCanvas = getChromaKeyedCanvas(img, clip.chromaKey);
          if (keyedCanvas) {
            ctx.drawImage(keyedCanvas, srcX, srcY, srcW, srcH, -destW / 2, -destH / 2, destW, destH);
          } else {
            ctx.drawImage(img, srcX, srcY, srcW, srcH, -destW / 2, -destH / 2, destW, destH);
          }
        } else {
          ctx.drawImage(img, srcX, srcY, srcW, srcH, -destW / 2, -destH / 2, destW, destH);
        }

        ctx.restore();

        if (clip.border && clip.border.width > 0) {
          ctx.save();
          ctx.strokeStyle = clip.border.color || "#00f5ff";
          ctx.lineWidth = clip.border.width * scaleX;
          ctx.globalAlpha = clipOpacity * (clip.border.opacity ?? 1);

          ctx.beginPath();
          if (clip.frameShape === "circle") {
            const radius = Math.min(destW, destH) / 2;
            ctx.arc(0, 0, radius, 0, Math.PI * 2);
          } else if (clip.frameShape === "rounded" || clip.cornerRadius) {
            const cr = clip.cornerRadius || { topLeft: 16, topRight: 16, bottomLeft: 16, bottomRight: 16, isLinked: true };
            const tl = (cr.topLeft || 0) * scaleX;
            const tr = (cr.topRight || 0) * scaleX;
            const br = (cr.bottomRight || 0) * scaleX;
            const bl = (cr.bottomLeft || 0) * scaleX;
            ctx.roundRect(-destW / 2, -destH / 2, destW, destH, [tl, tr, br, bl]);
          } else {
            ctx.rect(-destW / 2, -destH / 2, destW, destH);
          }
          ctx.stroke();
          ctx.restore();
        }
      } else {
        // Image Loading State Badge
        const boxW = 320 * scaleX;
        const boxH = 180 * scaleY;
        ctx.fillStyle = "rgba(15, 23, 42, 0.6)";
        ctx.strokeStyle = "rgba(0, 245, 255, 0.2)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(-boxW / 2, -boxH / 2, boxW, boxH, 12);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        ctx.font = `${Math.round(12 * scaleX)}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Loading image...", 0, 0);
      }
    }
  } else if (clip.type === "text") {
    const tp = clip.textProps;
    if (tp && tp.content) {
      let displayText = tp.content;

      // Text Animation Logic
      if (tp.animationType === "typewriter") {
        const charRatio = Math.min(1, relTime / 3);
        const count = Math.ceil(tp.content.length * charRatio);
        displayText = tp.content.substring(0, count);
      } else if (tp.animationType === "slideUp" && relTime < 1) {
        ctx.translate(0, (1 - relTime) * 30 * scaleY);
      } else if (tp.animationType === "pop" && relTime < 0.5) {
        const popScale = 1 + Math.sin((relTime / 0.5) * Math.PI) * 0.4;
        ctx.scale(popScale, popScale);
      }

      ctx.font = `${tp.fontWeight || 700} ${Math.round(tp.fontSize * scaleX)}px ${tp.fontFamily || "Orbitron"}, sans-serif`;
      ctx.textAlign = tp.alignment || "center";
      ctx.textBaseline = "middle";

      const metrics = ctx.measureText(displayText);
      const textW = metrics.width;
      const textH = tp.fontSize * scaleX;

      // Draw Background Pill
      if (tp.backgroundColor && tp.backgroundColor !== "transparent") {
        const pad = (tp.backgroundPadding || 8) * scaleX;
        ctx.fillStyle = tp.backgroundColor;
        ctx.beginPath();
        ctx.roundRect(-textW / 2 - pad, -textH / 2 - pad, textW + pad * 2, textH + pad * 2, 8);
        ctx.fill();
      }

      // Draw Glow / Shadow
      if (tp.glowColor && tp.glowBlur > 0) {
        ctx.shadowColor = tp.glowColor;
        ctx.shadowBlur = tp.glowBlur;
      } else if (tp.shadowColor) {
        ctx.shadowColor = tp.shadowColor;
        ctx.shadowBlur = tp.shadowBlur || 4;
        ctx.shadowOffsetX = (tp.shadowOffsetX || 2) * scaleX;
        ctx.shadowOffsetY = (tp.shadowOffsetY || 2) * scaleY;
      }

      // Draw Outline
      if (tp.outlineWidth > 0) {
        ctx.strokeStyle = tp.outlineColor || "#000000";
        ctx.lineWidth = tp.outlineWidth * scaleX;
        ctx.strokeText(displayText, 0, 0);
      }

      // Fill Text
      ctx.fillStyle = tp.color || "#00f5ff";
      ctx.fillText(displayText, 0, 0);
    }
  }

  // 6. Draw Vignette Overlay if set
  const fx = clip.effectProps;
  if (fx && fx.vignette > 0) {
    const rx = cw / 2;
    const ry = ch / 2;
    const grad = ctx.createRadialGradient(0, 0, rx * 0.5, 0, 0, rx);
    grad.addColorStop(0, "rgba(0,0,0,0)");
    grad.addColorStop(1, `rgba(0,0,0,${fx.vignette / 100})`);
    ctx.fillStyle = grad;
    ctx.fillRect(-cw, -ch, cw * 2, ch * 2);
  }

  ctx.restore();
}

// Helper to sync and seek video elements before exporting or rendering frames
export async function syncAndSeekVideosForProject(project: VideoProjectData, time: number): Promise<void> {
  const activeClips = project.clips.filter((c) => {
    const track = project.tracks.find((t) => t.id === c.trackId);
    if (!track || track.isHidden) return false;
    return time >= c.startTime && time <= c.startTime + c.duration;
  });

  const seekPromises: Promise<void>[] = [];

  for (const clip of activeClips) {
    if (isVideoSource(clip)) {
      const { video, state } = getLoadedVideo(clip.src);
      if (video && state.loaded) {
        const relTime = time - clip.startTime;
        const targetMediaTime = Math.max(0, (relTime * clip.speed) + (clip.mediaOffset || 0));
        const dur = video.duration || clip.mediaDuration || clip.duration;
        const clampedTime = Math.min(dur, Math.max(0, targetMediaTime));

        if (Math.abs(video.currentTime - clampedTime) > 0.01) {
          const promise = new Promise<void>((res) => {
            let done = false;
            const finish = () => {
              if (!done) {
                done = true;
                video.removeEventListener("seeked", finish);
                res();
              }
            };
            video.addEventListener("seeked", finish);
            try {
              video.currentTime = clampedTime;
            } catch (e) {
              finish();
            }
            setTimeout(finish, 80);
          });
          seekPromises.push(promise);
        }
      }
    }
  }

  if (seekPromises.length > 0) {
    await Promise.all(seekPromises);
  }
}

// Full Frame Export Engine (supports entire project or scene/range export)
export async function exportVideoProject(
  project: VideoProjectData,
  exportWidth: number,
  exportHeight: number,
  fps: number,
  onProgress: (percent: number, frame: number, totalFrames: number, estSecsLeft: number) => void,
  exportRange?: { start: number; end: number } | null
): Promise<string> {
  const rangeStart = exportRange ? Math.max(0, exportRange.start) : 0;
  const rangeEnd = exportRange ? Math.min(project.duration, exportRange.end) : project.duration;
  const exportDuration = Math.max(1, rangeEnd - rangeStart);

  // Pre-render audio mix for duration
  const audioBuffer = await renderProjectAudioMix(project, project.duration);

  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = exportWidth;
      canvas.height = exportHeight;
      const ctx = canvas.getContext("2d");

      if (!ctx) return reject("Failed to initialize export canvas context");

      const totalFrames = Math.ceil(exportDuration * fps);
      const frameDurationMs = 1000 / fps;

      const stream = canvas.captureStream(fps);

      // Attach audio stream track if pre-rendered audio buffer exists
      if (audioBuffer) {
        try {
          const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
          const audioCtx = new AudioCtx();
          const dest = audioCtx.createMediaStreamDestination();
          const source = audioCtx.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(dest);

          dest.stream.getAudioTracks().forEach((track) => {
            stream.addTrack(track);
          });

          source.start(0, rangeStart, exportDuration);
        } catch (audErr) {
          console.warn("Failed to attach audio stream to export:", audErr);
        }
      }

      const recorderOptions: MediaRecorderOptions = {
        mimeType: MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
          ? "video/webm;codecs=vp9"
          : "video/webm",
        videoBitsPerSecond: 12000000, // 12 Mbps
      };

      const recorder = new MediaRecorder(stream, recorderOptions);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const finalBlob = new Blob(chunks, { type: "video/webm" });
        const videoUrl = URL.createObjectURL(finalBlob);
        resolve(videoUrl);
      };

      recorder.start();

      let currentFrame = 0;
      const startTimeMs = Date.now();

      async function processFrame() {
        if (currentFrame >= totalFrames) {
          recorder.stop();
          return;
        }

        const currentTime = rangeStart + currentFrame / fps;
        await syncAndSeekVideosForProject(project, currentTime);
        renderFrameToCanvas(ctx, project, currentTime, exportWidth, exportHeight);

        currentFrame++;
        const percent = Math.min(100, Math.round((currentFrame / totalFrames) * 100));

        const elapsedSecs = (Date.now() - startTimeMs) / 1000;
        const framesPerSec = currentFrame / elapsedSecs;
        const remFrames = totalFrames - currentFrame;
        const estSecsLeft = Math.ceil(framesPerSec > 0 ? remFrames / framesPerSec : 0);

        onProgress(percent, currentFrame, totalFrames, estSecsLeft);

        // Schedule next frame rendering
        setTimeout(processFrame, frameDurationMs / 2);
      }

      processFrame();
    } catch (err) {
      reject(err);
    }
  });
}

import { VideoClip, VideoProjectData, LogoAnimationPreset } from "../types/video";

// Cache for loaded HTMLImageElements
const imageCache: Map<string, HTMLImageElement> = new Map();

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

// Main Frame Renderer for Video Canvas
export function renderFrameToCanvas(
  ctx: CanvasRenderingContext2D,
  project: VideoProjectData,
  time: number,
  canvasWidth: number,
  canvasHeight: number
) {
  // Clear Canvas & Render Selected Background
  ctx.save();

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
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasHeight);
      ctx.stroke();
    }
    for (let y = 0; y < canvasHeight; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasWidth, y);
      ctx.stroke();
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

  // Sort clips by track order
  const trackTypePriority: Record<string, number> = {
    background: 1,
    video: 2,
    audio: 3,
    overlay: 4,
    logo: 5,
    text: 6,
    effect: 7,
  };

  activeClips.sort((a, b) => {
    const pA = trackTypePriority[a.type] || 5;
    const pB = trackTypePriority[b.type] || 5;
    return pA - pB;
  });

  // Render each clip
  for (const clip of activeClips) {
    renderClipOnCanvas(ctx, clip, time, canvasWidth, canvasHeight, scaleX, scaleY);
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

  // 4. Filters & Color Effects (Keyframed)
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

  // 5. Draw Content depending on Clip Type
  if (clip.type === "video" || clip.type === "overlay" || clip.type === "logo" || clip.type === "background") {
    const img = getLoadedImage(clip.src);
    if (img) {
      const rawW = img.naturalWidth;
      const rawH = img.naturalHeight;

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

      ctx.drawImage(img, srcX, srcY, srcW, srcH, -destW / 2, -destH / 2, destW, destH);
    } else {
      // Fallback animated procedural video frame representation
      const boxW = 400 * scaleX;
      const boxH = 225 * scaleY;
      const grad = ctx.createLinearGradient(-boxW / 2, -boxH / 2, boxW / 2, boxH / 2);
      grad.addColorStop(0, clip.type === "logo" ? "#a855f7" : "#00f5ff");
      grad.addColorStop(1, "#3b82f6");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(-boxW / 2, -boxH / 2, boxW, boxH, 16);
      ctx.fill();

      // Label inside fallback
      ctx.fillStyle = "#ffffff";
      ctx.font = `bold ${Math.round(18 * scaleX)}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(clip.name, 0, 0);
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

// Full Frame Export Engine
export async function exportVideoProject(
  project: VideoProjectData,
  exportWidth: number,
  exportHeight: number,
  fps: number,
  onProgress: (percent: number, frame: number, totalFrames: number, estSecsLeft: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = exportWidth;
      canvas.height = exportHeight;
      const ctx = canvas.getContext("2d");

      if (!ctx) return reject("Failed to initialize export canvas context");

      const totalFrames = Math.ceil(project.duration * fps);
      const frameDurationMs = 1000 / fps;

      const stream = canvas.captureStream(fps);
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

      function processFrame() {
        if (currentFrame >= totalFrames) {
          recorder.stop();
          return;
        }

        const currentTime = currentFrame / fps;
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

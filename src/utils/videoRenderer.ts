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
  // Clear Canvas
  ctx.save();
  ctx.fillStyle = project.bgColor || "#05050a";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

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

  // Sort clips by track order (effects/logos on top, background/video on bottom)
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

function renderClipOnCanvas(
  ctx: CanvasRenderingContext2D,
  clip: VideoClip,
  time: number,
  cw: number,
  ch: number,
  scaleX: number,
  scaleY: number
) {
  const relTime = time - clip.startTime;
  if (relTime < 0 || relTime > clip.duration) return;

  // 1. Calculate Opacity with Fade In / Fade Out
  let clipOpacity = clip.opacity;
  if (clip.fadeIn > 0 && relTime < clip.fadeIn) {
    clipOpacity *= relTime / clip.fadeIn;
  }
  if (clip.fadeOut > 0 && relTime > clip.duration - clip.fadeOut) {
    clipOpacity *= (clip.duration - relTime) / clip.fadeOut;
  }
  clipOpacity = Math.max(0, Math.min(1, clipOpacity));

  if (clipOpacity <= 0) return;

  ctx.save();
  ctx.globalAlpha = clipOpacity;

  // 2. Center Origin & Transforms
  const centerX = cw / 2 + clip.posX * scaleX;
  const centerY = ch / 2 + clip.posY * scaleY;

  ctx.translate(centerX, centerY);

  if (clip.rotation !== 0) {
    ctx.rotate((clip.rotation * Math.PI) / 180);
  }

  // 3. Logo Animation Calculations
  let animScale = clip.scale;
  let animOffsetX = 0;
  let animOffsetY = 0;

  if (clip.logoAnim && clip.logoAnim.preset !== "none") {
    const animDur = clip.logoAnim.duration || 1;
    const animProgress = Math.min(1, relTime / animDur);

    switch (clip.logoAnim.preset) {
      case "fadeIn":
        // handled in opacity
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

  // 4. Filters & Effects
  const fx = clip.effectProps;
  if (fx) {
    const filterParts: string[] = [];
    if (fx.blur > 0) filterParts.push(`blur(${fx.blur}px)`);
    if (fx.brightness !== 0) filterParts.push(`brightness(${100 + fx.brightness}%)`);
    if (fx.contrast !== 0) filterParts.push(`contrast(${100 + fx.contrast}%)`);
    if (fx.saturation !== 100) filterParts.push(`saturate(${fx.saturation}%)`);
    if (fx.hueRotate !== 0) filterParts.push(`hue-rotate(${fx.hueRotate}deg)`);

    if (filterParts.length > 0) {
      ctx.filter = filterParts.join(" ");
    }
  }

  // 5. Draw Content depending on Clip Type
  if (clip.type === "video" || clip.type === "overlay" || clip.type === "logo" || clip.type === "background") {
    const img = getLoadedImage(clip.src);
    if (img) {
      const w = img.naturalWidth * scaleX;
      const h = img.naturalHeight * scaleY;
      ctx.drawImage(img, -w / 2, -h / 2, w, h);
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
      ctx.font = `${tp.fontWeight || 700} ${Math.round(tp.fontSize * scaleX)}px ${tp.fontFamily || "Orbitron"}, sans-serif`;
      ctx.textAlign = tp.alignment || "center";
      ctx.textBaseline = "middle";

      const metrics = ctx.measureText(tp.content);
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
        ctx.strokeText(tp.content, 0, 0);
      }

      // Fill Text
      ctx.fillStyle = tp.color || "#00f5ff";
      ctx.fillText(tp.content, 0, 0);
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

export type VideoTrackType =
  | "video"
  | "audio"
  | "text"
  | "logo"
  | "overlay"
  | "background"
  | "effect";

export type LogoAnimationPreset =
  | "none"
  | "fadeIn"
  | "fadeOut"
  | "scaleIn"
  | "scaleOut"
  | "slideLeft"
  | "slideRight"
  | "slideUp"
  | "slideDown"
  | "zoom"
  | "pop"
  | "rotate"
  | "bounce";

export type TransitionType =
  | "none"
  | "fade"
  | "dissolve"
  | "wipe"
  | "slide"
  | "zoom"
  | "blur"
  | "push"
  | "crossfade"
  | "flash"
  | "dipToBlack";

export interface TextClipProps {
  content: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  color: string;
  outlineColor: string;
  outlineWidth: number;
  shadowColor: string;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  glowColor: string;
  glowBlur: number;
  backgroundColor: string;
  backgroundPadding: number;
  alignment: "center" | "left" | "right";
  animationType: "none" | "fadeIn" | "typewriter" | "slideUp" | "pop" | "bounce";
}

export interface EffectProps {
  blur: number; // 0 - 20
  brightness: number; // -100 - 100
  contrast: number; // -100 - 100
  saturation: number; // 0 - 200
  hueRotate: number; // 0 - 360
  exposure: number; // -100 - 100
  vignette: number; // 0 - 100
  filmGrain: number; // 0 - 100
  noise: number; // 0 - 100
  lut: "none" | "cyberpunk" | "vintage" | "noir" | "neon" | "cinematic" | "matrix";
}

export interface LogoAnimProps {
  preset: LogoAnimationPreset;
  duration: number; // in seconds
  delay: number; // in seconds
  loop: boolean;
  positionPreset: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center" | "custom";
}

export interface VideoClip {
  id: string;
  trackId: string;
  name: string;
  type: VideoTrackType;
  src: string; // URL or data content
  fileType: string; // mp4, mov, mp3, png, svg, txt, etc.
  startTime: number; // timeline start in seconds
  duration: number; // duration on timeline in seconds
  mediaOffset: number; // offset into source file
  mediaDuration?: number; // total original media duration
  volume: number; // 0 to 2 (1 = 100%)
  isMuted: boolean;
  fadeIn: number; // fade in duration in seconds
  fadeOut: number; // fade out duration in seconds
  speed: number; // 0.25 to 4
  isReversed: boolean;
  opacity: number; // 0 to 1
  scale: number; // 0.1 to 3
  rotation: number; // degrees 0-360
  flipX: boolean;
  flipY: boolean;
  posX: number; // offset X from center
  posY: number; // offset Y from center
  crop: { top: number; right: number; bottom: number; left: number };
  logoAnim: LogoAnimProps;
  textProps: TextClipProps;
  effectProps: EffectProps;
  transition: {
    type: TransitionType;
    duration: number;
  };
}

export interface VideoTrack {
  id: string;
  name: string;
  type: VideoTrackType;
  isLocked: boolean;
  isHidden: boolean;
  isMuted: boolean;
  height: number;
  color: string;
}

export interface MediaItem {
  id: string;
  name: string;
  type: "video" | "audio" | "image" | "logo";
  fileType: string;
  url: string;
  duration?: number;
  fileSize: string;
  folderId?: string;
  createdAt: string;
}

export interface MediaFolder {
  id: string;
  name: string;
}

export interface CanvasPreset {
  id: string;
  name: string;
  platform: string;
  width: number;
  height: number;
  aspectRatio: string;
  category: string;
}

export interface ExportSettings {
  format: "mp4" | "webm" | "mov";
  resolutionPreset: "720p" | "1080p" | "1440p" | "4k";
  width: number;
  height: number;
  fps: 24 | 30 | 60;
  bitrateKbps: number;
  audioQualityKbps: 128 | 192 | 320;
}

export interface VideoMarker {
  id: string;
  time: number;
  label: string;
  color: string;
}

export interface VideoProjectData {
  id: string;
  title: string;
  width: number;
  height: number;
  fps: number;
  duration: number;
  currentTime: number;
  playbackSpeed: number;
  tracks: VideoTrack[];
  clips: VideoClip[];
  aspectRatioPreset: string;
  bgColor: string;
  bgType?: "solid" | "gradient" | "wireframe" | "image";
  bgImage?: string;
  markers?: VideoMarker[];
  updatedAt: string;
}

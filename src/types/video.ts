export type VideoTrackType =
  | "video"
  | "audio"
  | "text"
  | "logo"
  | "overlay"
  | "background"
  | "effect"
  | "caption"
  | "adjustment";

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
  | "cut"
  | "fade"
  | "crossfade"
  | "dissolve"
  | "dipToBlack"
  | "dipToWhite"
  | "slideLeft"
  | "slideRight"
  | "slideUp"
  | "slideDown"
  | "zoom"
  | "push"
  | "wipe"
  | "blur"
  | "flash";

export interface TransitionProps {
  type: TransitionType;
  duration: number; // in seconds
  direction?: "normal" | "reverse" | "in" | "out";
  intensity?: number; // 0 to 1
}

export type InterpolationMode = "linear" | "easeIn" | "easeOut" | "easeInOut" | "hold";

export type BlendMode =
  | "normal"
  | "multiply"
  | "screen"
  | "overlay"
  | "darken"
  | "lighten"
  | "difference"
  | "color-dodge"
  | "color-burn";

export type FrameShape = "rectangle" | "rounded" | "circle";

export interface CornerRadiusProps {
  topLeft: number;
  topRight: number;
  bottomLeft: number;
  bottomRight: number;
  isLinked: boolean;
}

export interface MaskProps {
  type: "none" | "rectangle" | "rounded" | "circle" | "ellipse";
  posX: number;
  posY: number;
  width: number;
  height: number;
  scale: number;
  rotation: number;
  feather: number;
  isInverted: boolean;
}

export interface ChromaKeyProps {
  enabled: boolean;
  keyColor: string; // hex string e.g. #00ff00
  similarity: number; // 0 to 1
  tolerance: number; // 0 to 1
  feather: number; // 0 to 20
  spillReduction: number; // 0 to 1
}

export interface BorderProps {
  width: number;
  color: string;
  opacity: number;
}

export interface ShadowProps {
  offsetX: number;
  offsetY: number;
  blur: number;
  color: string;
  opacity: number;
  spread: number;
}

export interface EffectItem {
  id: string;
  name: string;
  type: "brightness" | "contrast" | "blur" | "chromaKey" | "saturation" | "hueRotate" | "vignette";
  enabled: boolean;
}

export interface Keyframe {
  id: string;
  time: number; // in seconds relative to clip start (0 to clip.duration)
  property:
    | "posX"
    | "posY"
    | "scale"
    | "rotation"
    | "opacity"
    | "volume"
    | "blur"
    | "brightness"
    | "contrast"
    | "saturation"
    | "cropTop"
    | "cropBottom"
    | "cropLeft"
    | "cropRight"
    | "letterSpacing";
  value: number;
  easing: InterpolationMode;
}

export interface TextClipProps {
  content: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  isItalic?: boolean;
  isUnderline?: boolean;
  isUppercase?: boolean;
  letterSpacing?: number;
  lineHeight?: number;
  color: string;
  alignment: "center" | "left" | "right";
  verticalAlign?: "top" | "middle" | "bottom";
  
  // Box dimensions & wrapping
  boxMode?: "auto" | "fixed";
  boxWidth?: number;
  boxHeight?: number;

  // Background
  backgroundEnabled?: boolean;
  backgroundColor: string;
  backgroundOpacity?: number;
  backgroundPadding: number;
  backgroundBorderColor?: string;
  backgroundBorderWidth?: number;
  backgroundCornerRadius?: number;
  backgroundIndependentCorners?: boolean;
  backgroundCorners?: {
    topLeft: number;
    topRight: number;
    bottomLeft: number;
    bottomRight: number;
  };

  // Outline
  outlineEnabled?: boolean;
  outlineColor: string;
  outlineWidth: number;
  outlineOpacity?: number;

  // Shadow & Glow
  shadowEnabled?: boolean;
  shadowColor: string;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  shadowOpacity?: number;
  glowColor?: string;
  glowBlur?: number;

  // Gradient
  gradientEnabled?: boolean;
  gradientType?: "solid" | "linear" | "radial";
  gradientStart?: string;
  gradientEnd?: string;
  gradientAngle?: number;

  // Animations
  animationType?: "none" | "fadeIn" | "typewriter" | "slideUp" | "pop" | "bounce";
  animationIn?: "none" | "fadeIn" | "slideUp" | "slideDown" | "slideLeft" | "slideRight" | "scaleIn" | "popIn" | "typewriter";
  animationInDuration?: number;
  animationOut?: "none" | "fadeOut" | "slideUp" | "slideDown" | "slideLeft" | "slideRight" | "scaleOut";
  animationOutDuration?: number;

  // Secondary text for templates & lower thirds
  secondaryContent?: string;
  secondaryFontSize?: number;
  secondaryFontFamily?: string;
  secondaryColor?: string;
  templateType?: "none" | "lowerThird" | "mainTitle" | "subtitle" | "sectionTitle" | "quote" | "callToAction" | "outro" | "socialMedia";
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
  sepia?: number;
  grayscale?: number;
  invert?: number;
  grain?: number;
  sharpness?: number;
  bloom?: number;
  chromaticAberration?: number;
  glowColor?: string;
  glowBlur?: number;
  lutPreset?: string;
}

export interface LogoAnimProps {
  preset: LogoAnimationPreset;
  duration: number; // in seconds
  delay: number; // in seconds
  loop: boolean;
  positionPreset: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center" | "custom";
}

export type FitMode = "fit" | "fill" | "stretch" | "original";

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
  pan?: number; // -1 to 1 (0 = center)
  isMuted: boolean;
  isLocked?: boolean;
  fadeIn: number; // fade in duration in seconds
  fadeOut: number; // fade out duration in seconds
  speed: number; // 0.25 to 4
  isReversed: boolean;
  opacity: number; // 0 to 1
  scale: number; // 0.1 to 3
  scaleX?: number;
  scaleY?: number;
  fitMode?: FitMode;
  width?: number;
  height?: number;
  keepAspectRatio?: boolean;
  enableSnapping?: boolean;
  rawWidth?: number;
  rawHeight?: number;
  aspectRatio?: number;
  rotation: number; // degrees 0-360
  flipX: boolean;
  flipY: boolean;
  posX: number; // offset X from center
  posY: number; // offset Y from center
  crop: { top: number; right: number; bottom: number; left: number };
  logoAnim: LogoAnimProps;
  textProps: TextClipProps;
  effectProps: EffectProps;
  blendMode?: BlendMode;
  frameShape?: FrameShape;
  cornerRadius?: CornerRadiusProps;
  mask?: MaskProps;
  chromaKey?: ChromaKeyProps;
  border?: BorderProps;
  shadow?: ShadowProps;
  groupId?: string;
  isGroup?: boolean;
  effectsStack?: EffectItem[];
  isBypassedEffects?: boolean;
  transition: {
    type: TransitionType;
    duration: number;
  };
  keyframes?: Keyframe[];
  anchorX?: number; // 0 to 1 relative to width (0.5 = center)
  anchorY?: number; // 0 to 1 relative to height (0.5 = center)
}

export interface VideoTrack {
  id: string;
  name: string;
  type: VideoTrackType;
  isLocked: boolean;
  isHidden: boolean;
  isMuted: boolean;
  isSolo?: boolean;
  volume?: number; // 0 to 2 (1 = 100%)
  pan?: number; // -1 to 1 (0 = center)
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
  notes?: string;
}

export interface VideoScene {
  id: string;
  name: string;
  startTime: number;
  endTime: number;
  color?: string;
  thumbnail?: string;
  notes?: string;
}

export interface CaptionItem {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
  highlightWordIndex?: number;
}

export interface CaptionStyleProps {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  color: string;
  backgroundColor: string;
  backgroundPadding: number;
  outlineColor: string;
  outlineWidth: number;
  shadowColor: string;
  shadowBlur: number;
  alignment: "left" | "center" | "right";
  positionY: number; // 0 to 1 relative to container height (0.85 = bottom)
  presetName?: "clean" | "bold" | "subtitle" | "social" | "minimal" | "highlight";
  highlightColor?: string;
}

export interface NestedSequence {
  id: string;
  name: string;
  duration: number;
  clips: VideoClip[];
  tracks: VideoTrack[];
}

export interface TransitionPreset {
  id: string;
  name: string;
  type: TransitionType;
  duration: number;
  direction?: "normal" | "reverse" | "in" | "out";
  intensity?: number;
}

export interface CaptionStylePreset {
  id: string;
  name: string;
  style: CaptionStyleProps;
}

export interface EffectPreset {
  id: string;
  name: string;
  effectProps: EffectProps;
}

export interface ProjectTemplate {
  id: string;
  name: string;
  category: string;
  aspectRatio: string;
  width: number;
  height: number;
  description: string;
  placeholders: {
    id: string;
    type: "video" | "image" | "logo" | "text" | "audio";
    label: string;
    clipId: string;
  }[];
  projectData: Partial<VideoProjectData>;
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
  showGuides?: boolean;
  guidePreset?: "none" | "grid" | "youtube" | "tiktok" | "instagram" | "facebook" | "linkedin";
  snapToGuides?: boolean;
  snapToMarkers?: boolean;
  markers?: VideoMarker[];
  scenes?: VideoScene[];
  activeSceneId?: string;
  sceneRange?: { start: number; end: number } | null;
  nestedSequences?: NestedSequence[];
  captions?: CaptionItem[];
  captionStyle?: CaptionStyleProps;
  burnCaptionsOnExport?: boolean;
  rangeSelection?: { start: number; end: number } | null;
  rippleEditing?: boolean;
  trackTargeting?: string[]; // track IDs targeted for operations
  updatedAt: string;
}

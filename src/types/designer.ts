export type PlatformCategory =
  | "Website"
  | "Facebook"
  | "LinkedIn"
  | "X (Twitter)"
  | "Instagram"
  | "YouTube"
  | "GitHub"
  | "Fiverr"
  | "Custom";

export type CanvasPresetId = string;

export interface CanvasPreset {
  id: CanvasPresetId;
  name: string;
  platform: PlatformCategory;
  width: number;
  height: number;
  aspectRatio: string;
  description: string;
  safeMarginPct?: number;
  safeNote?: string;
}

export type ImageFitMode = "cover" | "contain" | "fill" | "smart";
export type ElementType =
  | "text"
  | "badge"
  | "image"
  | "button"
  | "logo"
  | "shape"
  | "mask"
  | "overlay"
  | "frame"
  | "group"
  | "draw"
  | "path"
  | "line"
  | "arrow"
  | "watermark";

export type WatermarkType = "text" | "logo" | "tiled" | "signature";

export type WatermarkStylePreset =
  | "solid"
  | "gradient"
  | "neon"
  | "glass"
  | "holographic"
  | "metallic"
  | "soft"
  | "cyberpunk"
  | "minimal"
  | "outline"
  | "glow"
  | "subtle"
  | "clean"
  | "professional"
  | "bold"
  | "copyright"
  | "custom";

export type WatermarkPositionPreset =
  | "top-left"
  | "top-center"
  | "top-right"
  | "center-left"
  | "center"
  | "center-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"
  | "custom";

export interface WatermarkConfig {
  type: WatermarkType;
  watermarkText?: string;
  logoUrl?: string;
  signatureUrl?: string;
  stylePreset?: WatermarkStylePreset;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string | number;
  fontStyle?: "normal" | "italic";
  textDecoration?: "none" | "underline";
  textTransform?: "none" | "uppercase" | "lowercase";
  letterSpacing?: number;
  lineHeight?: number;
  textAlign?: "left" | "center" | "right";
  color?: string;
  opacity?: number;

  gradientEnabled?: boolean;
  gradientType?: "linear" | "radial" | "angular" | "reflected";
  gradientColor1?: string;
  gradientColor2?: string;
  gradientColor3?: string;
  gradientAngle?: number;

  outlineEnabled?: boolean;
  outlineWidth?: number;
  outlineColor?: string;
  outlineOpacity?: number;
  outlineSoftness?: number;
  outlinePosition?: "inside" | "center" | "outside";

  shadowEnabled?: boolean;
  shadowColor?: string;
  shadowOpacity?: number;
  shadowBlur?: number;
  shadowDistance?: number;
  shadowX?: number;
  shadowY?: number;
  shadowAngle?: number;

  glowEnabled?: boolean;
  glowColor?: string;
  glowOpacity?: number;
  glowBlur?: number;
  glowSpread?: number;
  glowIntensity?: number;
  glowPreset?: string;

  blendMode?: "normal" | "multiply" | "screen" | "overlay" | "soft-light" | "hard-light" | "darken" | "lighten";

  positionPreset?: WatermarkPositionPreset;
  marginX?: number;
  marginY?: number;

  rotation?: number;
  scale?: number;
  lockAspectRatio?: boolean;

  tiledEnabled?: boolean;
  tiledSpacingX?: number;
  tiledSpacingY?: number;
  tiledRotation?: number;
  tiledOpacity?: number;
  tiledScale?: number;
  tiledDensity?: number;

  safeAreaEnabled?: boolean;
}

export interface PathAnchorPoint {
  id?: string;
  x: number;
  y: number;
  handleIn?: { x: number; y: number };
  handleOut?: { x: number; y: number };
  type?: "corner" | "smooth";
}

export interface DrawPoint {
  x: number;
  y: number;
  pressure?: number;
}
export type ExportFormat = "psd" | "ai" | "svg" | "pdf" | "eps" | "png" | "jpg" | "webp";
export type ExportQuality = 1 | 2 | 3 | 4;

export interface ProfessionalExportOptions {
  format: ExportFormat;
  quality: ExportQuality;
  layerMode?: "layered" | "flattened";
  textMode?: "editable" | "vector_paths";
  imageMode?: "embedded" | "linked";
  colorMode?: "rgb" | "cmyk";
  transparentBg?: boolean;
  dpi?: 72 | 150 | 300 | 600;
  compression?: "high_quality" | "balanced" | "max_compression";
}

export interface ElementCrop {
  enabled: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  aspectRatio?: string;
}

export interface ElementFrame {
  shape?: "rectangle" | "square" | "circle" | "oval" | "portrait" | "landscape" | "16:9" | "9:16";
  fit?: "fill" | "fit" | "center" | "contain" | "cover";
  zoom?: number;
  offsetX?: number;
  offsetY?: number;
  rotation?: number;
}

export interface ElementCornerRadii {
  disabled?: boolean;
  topLeft: number;
  topRight: number;
  bottomRight: number;
  bottomLeft: number;
}

export interface ElementBorder {
  enabled: boolean;
  mode?: "box" | "subject";
  followSubject?: boolean;
  width?: number;
  style?: "solid" | "dashed" | "dotted";
  color?: string;
  opacity?: number;
}

export interface ElementAdjustments {
  brightness?: number;
  contrast?: number;
  saturate?: number;
  saturation?: number;
  exposure?: number;
  temperature?: number;
  tint?: number;
  blur?: number;
  hueRotate?: number;
  sepia?: number;
}

export type FilterPreset = "normal" | "cyber" | "vintage" | "noir" | "warm" | "cool" | "vivid" | "monochrome";

export interface TextShadowConfig {
  enabled: boolean;
  color: string;
  blur: number;
  offsetX: number;
  offsetY: number;
  opacity?: number;
  distance?: number;
  angle?: number;
  spread?: number;
}

export interface TextStrokeConfig {
  enabled: boolean;
  color: string;
  width: number;
  opacity?: number;
  position?: "inside" | "center" | "outside";
  gradientEnabled?: boolean;
  gradientColor1?: string;
  gradientColor2?: string;
}

export interface TextGlowConfig {
  enabled: boolean;
  color: string;
  blur: number;
  type?: "soft" | "neon" | "outer" | "inner";
  opacity?: number;
  spread?: number;
  intensity?: number;
}

export interface TextGradientConfig {
  enabled: boolean;
  type: "linear" | "radial" | "angular" | "reflected";
  angle?: number;
  colorStops: Array<{ color: string; offset: number }>;
}

export interface Text3DEffectConfig {
  enabled: boolean;
  depth: number;
  direction: "top" | "bottom" | "left" | "right" | "diagonal-right" | "diagonal-left";
  color: string;
  shadowColor: string;
  opacity: number;
}

export interface TextEffectConfig {
  preset: "none" | "neon" | "glass" | "holographic" | "metallic" | "chrome" | "gradient" | "glitch" | "cyberpunk" | "retro" | "3d" | "soft" | "outline" | "shadow";
  threeD?: Text3DEffectConfig;
  glitchOffset?: number;
  chromeShineColor?: string;
}

export interface TextCurveConfig {
  enabled: boolean;
  curveType: "arc-up" | "arc-down" | "circle" | "wave";
  amount: number; // -100 to 100
  radius?: number;
  spacing?: number;
}

export interface TextBgConfig {
  enabled: boolean;
  type?: "solid" | "gradient" | "glass" | "neon" | "holographic";
  color: string;
  gradientColor1?: string;
  gradientColor2?: string;
  gradientAngle?: number;
  opacity?: number;
  padding?: number;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingLinked?: boolean;
  borderRadius?: number;
  cornerRadiusTL?: number;
  cornerRadiusTR?: number;
  cornerRadiusBR?: number;
  cornerRadiusBL?: number;
  cornersLinked?: boolean;
  borderEnabled?: boolean;
  borderColor?: string;
  borderWidth?: number;
  shadowEnabled?: boolean;
  glowEnabled?: boolean;
  glowColor?: string;
}

export interface ElementShadowConfig {
  enabled: boolean;
  color: string;
  blur: number;
  spread: number;
  offsetX: number;
  offsetY: number;
  opacity: number;
}

export interface ElementInnerShadowConfig {
  enabled: boolean;
  color: string;
  blur: number;
  offsetX: number;
  offsetY: number;
  opacity: number;
}

export interface ElementMaskConfig {
  enabled: boolean;
  shape: "none" | "circle" | "rectangle" | "rounded" | "ellipse" | "star" | "hexagon" | "triangle" | "custom" | "auto-silhouette";
  zoom: number;
  offsetX: number;
  offsetY: number;
  rotation: number;
}

export interface FillGradientConfig {
  enabled: boolean;
  type: "linear" | "radial";
  from: string;
  via?: string;
  to: string;
  angle: number; // 0-360
  opacity?: number;
}

export interface ElementSubjectGlowConfig {
  enabled: boolean;
  color: string;
  intensity: number; // 0 to 100
  spread: number; // 0 to 50
  blur: number; // 0 to 100
  opacity: number; // 0 to 1
}

export type ElementSubjectShadowPreset =
  | "soft"
  | "hard"
  | "floating"
  | "ground"
  | "cinematic"
  | "neon"
  | "custom";

export interface ElementSubjectShadowConfig {
  enabled: boolean;
  preset?: ElementSubjectShadowPreset;
  color: string;
  opacity: number; // 0 to 1
  blur: number; // 0 to 100
  distance: number; // 0 to 100
  angle: number; // 0 to 360
  spread?: number; // 0 to 50
}

export interface ElementGradientBorderConfig {
  enabled: boolean;
  color1: string;
  color2: string;
  color3?: string;
  angle: number; // 0 to 360
  width: number;
  opacity?: number; // 0 to 1
  glow?: boolean;
  style?: "solid" | "dashed" | "dotted" | "glow" | "gradient" | "neon" | "double" | "minimal";
}

export type ShaderLightingPreset =
  | "none"
  | "soft_light"
  | "soft-light"
  | "rim_light"
  | "rim-light"
  | "neon_light"
  | "neon-glow"
  | "cyberpunk"
  | "glow"
  | "bloom"
  | "spotlight"
  | "ambient_light"
  | "ambient-dark"
  | "holographic"
  | "metallic"
  | "glass"
  | "cinematic";

export type SmartCompositionStyle =
  | "01_studio_showcase"
  | "02_cyberpunk"
  | "03_glossy_product"
  | "04_gaming_character"
  | "05_roblox_showcase"
  | "06_portfolio_showcase"
  | "07_minimal"
  | "08_glass_ui"
  | "09_neon_frame"
  | "10_editorial";

export interface CanvasElement {
  id: string;
  name: string;
  type: ElementType;
  visible: boolean;
  locked: boolean;
  x: number; // percentage (0-100) or px
  y: number; // percentage (0-100) or px
  width?: number; // percentage or px
  height?: number; // percentage or px
  rotation?: number; // degrees
  opacity?: number; // 0 to 1
  zIndex?: number;
  aspectRatioLocked?: boolean;

  // Grouping
  groupId?: string;
  isGroup?: boolean;
  childrenIds?: string[];

  // Text properties
  text?: string;
  textType?: "point" | "paragraph" | "headline" | "subtitle" | "caption" | "label" | "button" | "badge" | "display" | "quote" | "custom";
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900" | "normal" | "semibold" | "bold" | "black" | string | number;
  fontStyle?: "normal" | "italic";
  textDecoration?: "none" | "underline" | "line-through";
  color?: string;
  blendMode?: string;
  textAlign?: "left" | "center" | "right" | "justify";
  verticalAlign?: "top" | "middle" | "bottom";
  letterSpacing?: number;
  lineHeight?: number;
  textTransform?: "uppercase" | "none" | "capitalize" | "lowercase";
  gradientText?: boolean;
  textGradient?: TextGradientConfig;
  autoWrap?: boolean;
  textShadow?: TextShadowConfig;
  textStroke?: TextStrokeConfig;
  textGlow?: TextGlowConfig;
  textBg?: TextBgConfig;
  textEffect?: TextEffectConfig;
  textCurve?: TextCurveConfig;

  // Badge / Tag properties
  bg?: string;
  textColor?: string;
  borderColor?: string;
  borderRadius?: number;

  // Image properties
  url?: string;
  src?: string;
  fitMode?: ImageFitMode;
  scale?: number;
  xOffset?: number;
  yOffset?: number;
  borderWidth?: number;
  shadowGlow?: string;

  // Advanced Image & Graphics properties
  boundsMode?: "object" | "visible" | "full";
  visibleBounds?: { x: number; y: number; width: number; height: number };
  crop?: ElementCrop;
  frame?: ElementFrame;
  cornerRadii?: ElementCornerRadii;
  border?: ElementBorder;
  adjustments?: ElementAdjustments;
  filterPreset?: FilterPreset;
  flipX?: boolean;
  flipY?: boolean;
  mask?: ElementMaskConfig;

  // Button properties
  bgGradient?: string;

  // Logo properties
  logoType?: "image" | "text";
  filterEffect?: "none" | "invert" | "grayscale" | "cyan-tint" | "purple-tint" | "gold-tint" | "brightness-boost";
  padding?: number;
  size?: number;
  glow?: boolean;
  alignment?: "top-left" | "top-center" | "top-right" | "center-left" | "center" | "center-right" | "bottom-left" | "bottom-center" | "bottom-right";

  // Shape properties
  shapeType?: "rect" | "rounded-rect" | "circle" | "ellipse" | "line" | "triangle" | "polygon" | "star" | "heart" | "hexagon" | "arrow" | "glow-card";
  fillColor?: string;
  fillGradient?: FillGradientConfig;
  borderStyle?: "solid" | "dashed" | "dotted";

  // Vector & Freehand Drawing properties
  drawPoints?: DrawPoint[];
  brushSize?: number;
  brushHardness?: number; // 0 to 1
  brushSmoothing?: number;
  isEraser?: boolean;

  pathPoints?: PathAnchorPoint[];
  pathData?: string;
  pathClosed?: boolean;

  // Stroke & Arrow Controls
  strokeColor?: string;
  strokeWidth?: number;
  strokeOpacity?: number;
  strokeDashArray?: string;
  strokeAlign?: "center" | "inside" | "outside";

  arrowStartHead?: "none" | "arrow" | "circle" | "diamond" | "square";
  arrowEndHead?: "none" | "arrow" | "circle" | "diamond" | "square";
  arrowHeadSize?: number;
  lineStart?: { x: number; y: number };
  lineEnd?: { x: number; y: number };

  // Corners
  cornerRadiusTL?: number;
  cornerRadiusTR?: number;
  cornerRadiusBR?: number;
  cornerRadiusBL?: number;
  cornersLinked?: boolean;

  // Shadows & Effects
  shadow?: ElementShadowConfig;
  innerShadow?: ElementInnerShadowConfig;
  backdropBlur?: number;

  // Smart Composition Controls
  subjectGlow?: ElementSubjectGlowConfig;
  subjectShadow?: ElementSubjectShadowConfig;
  gradientBorder?: ElementGradientBorderConfig;
  shaderPreset?: ShaderLightingPreset;
  outline?: ElementOutlineConfig;
  gloss?: ElementGlossConfig;
  filterIntensity?: number;

  // Watermark Configuration
  watermarkConfig?: WatermarkConfig;
}

export interface ElementOutlineConfig {
  enabled: boolean;
  width: number;
  color: string;
  opacity?: number;
  softness?: number;
  position?: "inside" | "center" | "outside";
  style?: "solid" | "gradient" | "neon";
  color1?: string;
  color2?: string;
  angle?: number;
}

export interface ElementGlossConfig {
  enabled: boolean;
  preset?: "glass" | "glossy" | "holographic" | "metallic" | "cyberpunk" | "neon_glass" | "frosted_glass";
  intensity?: number;
  reflection?: number;
  opacity?: number;
  angle?: number;
}

export type BackgroundType = "gradient" | "radial" | "mesh" | "solid" | "image" | "pattern" | "glass";

export interface DesignBackground {
  type: BackgroundType;
  solidColor: string;
  gradientFrom?: string;
  gradientVia?: string;
  gradientTo?: string;
  gradientDirection?: string; // "to-r", "to-br", "to-b", "to-tr", "to-bl"
  gradientAngle?: number; // 0 to 360
  
  // Radial
  radialShape?: "circle" | "ellipse";
  radialPosition?: "center" | "top" | "bottom" | "top-left" | "bottom-right";

  // Mesh Gradient
  meshColor1?: string;
  meshColor2?: string;
  meshColor3?: string;
  meshColor4?: string;

  // Filters & Adjustments
  brightness?: number; // 50 to 150
  contrast?: number; // 50 to 150
  blur?: number; // 0 to 50

  // Color Overlay
  overlayColor?: string;
  overlayOpacity?: number;

  // Pattern
  pattern?: "grid" | "scanline" | "dots" | "hexagons" | "circuit" | "cross" | "cyber" | "noise" | "none";
  patternColor?: string;
  patternOpacity?: number;

  // Wireframe & Grid Background Customization
  wireframeDensity?: number; // 10 to 100
  wireframeOpacity?: number; // 0 to 1
  wireframePerspective?: number; // 0 to 100
  wireframeScale?: number; // 0.5 to 3
  wireframeLineSpacing?: number; // 5 to 50 px

  // Image background
  imageUrl?: string;
  imageOpacity?: number;
  imageBlur?: number;
  imageFit?: "cover" | "contain" | "fill";
  imagePosition?: "center" | "top" | "bottom" | "left" | "right";
}

export type CornerStyle =
  | "square-corner"
  | "rounded-corner"
  | "sharp-45"
  | "cut-corner"
  | "cyber-hud"
  | "minimal"
  | "double-corner"
  | "technical-drawing"
  | "blueprint"
  | "custom-blank"
  | "thin-line"
  | "thick-border"
  | "gaming"
  | "sci-fi"
  | "neon"
  | "glass"
  | "premium-corporate"
  | "geometric"
  | "futuristic"
  | "industrial"
  | "modern-ui"
  | "elegant"
  // Legacy aliases for backward compatibility
  | "cyber-bracket"
  | "tech-cross"
  | "chamfer-notch"
  | "dots-bracket"
  | "minimal-angle"
  | "double-wire"
  | "neon-glow"
  | "orbit-ring"
  | "heavy-bracket"
  | "frame-corner"
  | "arrow-corner"
  | "segmented-rail"
  | "shield-corner"
  | "diamond-corner"
  | "target-reticle"
  | "blueprint-grid"
  | "dual-notch"
  | "modern-pill"
  | "decorative-flourish"
  | "accent-dash";

export interface IndividualCornerConfig {
  enabled?: boolean; // Individual toggle for this corner
  style: CornerStyle;
  size: number; // e.g. 10 to 120 px
  length?: number; // length of corner arms (10 to 120 px)
  thickness: number; // e.g. 1 to 16 px
  angle?: number; // rotation angle degrees (0, 90, 180, 270 or custom)
  inset?: number; // spacing from outer border/edge (0 to 60 px)
  offsetX?: number; // independent horizontal position shift (-100 to 100 px)
  offsetY?: number; // independent vertical position shift (-100 to 100 px)
  radius?: number; // corner radius for rounded styles (0 to 50 px)
  color: string; // main fill/stroke color
  borderColor?: string; // secondary stroke border color
  glowColor?: string; // glow color
  glowSpread?: number; // 0 to 40
  opacity?: number; // 0 to 1
  blur?: number; // 0 to 20 px blur filter
  borderStyle?: "solid" | "dashed" | "dotted" | "double";
  snappingEnabled?: boolean;
  outerShadowColor?: string;
  outerShadowBlur?: number;
  outerShadowOffsetX?: number;
  outerShadowOffsetY?: number;
  innerShadowColor?: string;
  innerShadowBlur?: number;
}

export interface CornerDecorationConfig extends IndividualCornerConfig {
  enabled: boolean; // Master toggle
  inset?: number; // default spacing from outer border
  syncAllCorners: boolean; // linked vs unlinked independent editing
  snappingEnabled?: boolean;
  tl?: Partial<IndividualCornerConfig>;
  tr?: Partial<IndividualCornerConfig>;
  bl?: Partial<IndividualCornerConfig>;
  br?: Partial<IndividualCornerConfig>;
}

export type FramePresetId =
  | "none"
  | "cyber-ui"
  | "blueprint"
  | "hud"
  | "glassmorphism"
  | "minimal"
  | "modern-corporate"
  | "neon"
  | "gaming"
  | "premium-product"
  | "technical-wireframe"
  | "elegant-thin"
  | "rounded-frames"
  | "double-borders"
  | "gradient-borders"
  | "animated-borders";

export interface FrameConfig {
  preset: FramePresetId;
  enabled: boolean;
  width: number; // uniform border width 1 to 40 px
  borderWidthHorizontal?: number; // separate horizontal border thickness
  borderWidthVertical?: number; // separate vertical border thickness
  color: string;
  gradientFrom?: string;
  gradientTo?: string;
  opacity: number; // 0 to 1
  radius: number; // 0 to 50 px
  glow?: string;
  glowSpread?: number;
  glowColor?: string;
  animated?: boolean;
  innerPadding?: number;
  borderStyle?: "solid" | "dashed" | "dotted" | "double" | "groove" | "ridge";
  
  // Secondary Inner Border Layer
  innerBorderEnabled?: boolean;
  innerBorderWidth?: number;
  innerBorderColor?: string;
  innerBorderOffset?: number;
  innerBorderStyle?: "solid" | "dashed" | "dotted" | "double";
}

export interface CustomCornerPreset {
  id: string;
  name: string;
  config: CornerDecorationConfig;
}

export interface DesignState {
  id: string;
  title: string;
  preset: CanvasPresetId;
  width: number;
  height: number;
  canvasWidth?: number;
  canvasHeight?: number;
  aspectRatio?: string;
  background: DesignBackground;
  elements: CanvasElement[];
  showCyberBorders: boolean;
  showGlassPanel: boolean;
  glassOpacity: number;
  glassBlur: number;
  showGuides?: boolean;
  showGrid?: boolean;
  showRulers?: boolean;
  showSafeMargins?: boolean;
  snappingEnabled?: boolean;
  safeMarginPct?: number;
  safeNote?: string;
  allowTransparentBackground?: boolean;
  createdAt?: string;
  updatedAt?: string;

  // Frame & Corner Decorations
  cornerDecorations?: CornerDecorationConfig;
  frameConfig?: FrameConfig;
  customCornerPresets?: CustomCornerPreset[];

  // Color Palette History
  projectColors?: string[];
  recentColors?: string[];
}

export interface DesignTemplate {
  id: string;
  name: string;
  category: "Portfolio" | "Blog" | "Store" | "Services" | "Case Study" | "Testimonial" | "Hero Banner" | "Project Showcase" | "Social Media Posts" | "Marketing Graphics" | "Custom";
  description: string;
  previewColor: string;
  isCustom?: boolean;
  state: DesignState;
}

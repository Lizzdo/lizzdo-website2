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
export type ElementType = "text" | "badge" | "image" | "button" | "logo" | "shape";
export type ExportFormat = "psd" | "ai" | "svg" | "pdf" | "eps" | "png" | "jpg" | "webp";
export type ExportQuality = 1 | 2 | 3 | 4;

export type ColorMode = "rgb" | "cmyk";
export type TextExportMode = "editable" | "outlines";
export type ImageExportMode = "embedded" | "linked";
export type LayerExportMode = "layered" | "flattened";

export interface ProfessionalExportOptions {
  format: ExportFormat;
  quality: ExportQuality;
  layerMode: LayerExportMode;
  textMode: TextExportMode;
  imageMode: ImageExportMode;
  colorMode: ColorMode;
  transparentBg: boolean;
  dpi: 72 | 150 | 300 | 600;
  compression: "high_quality" | "balanced" | "compact";
}

export interface CanvasElement {
  id: string;
  name: string;
  type: ElementType;
  visible: boolean;
  locked: boolean;
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  width?: number; // percentage or px
  height?: number; // percentage or px
  rotation?: number; // degrees
  opacity?: number; // 0 to 1
  zIndex?: number;

  // Text properties
  text?: string;
  fontSize?: number;
  fontFamily?: "Orbitron" | "Rajdhani" | "Inter" | "Space Mono";
  fontWeight?: "normal" | "semibold" | "bold" | "black";
  color?: string;
  textAlign?: "left" | "center" | "right";
  letterSpacing?: number;
  lineHeight?: number;
  textTransform?: "uppercase" | "none" | "capitalize";
  gradientText?: boolean;

  // Badge / Tag properties
  bg?: string;
  textColor?: string;
  borderColor?: string;
  borderRadius?: number;

  // Image properties
  url?: string;
  fitMode?: ImageFitMode;
  scale?: number;
  xOffset?: number;
  yOffset?: number;
  borderWidth?: number;
  shadowGlow?: string;

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
  shapeType?: "rect" | "circle" | "line" | "glow-card";
}

export type BackgroundType = "gradient" | "radial" | "mesh" | "solid" | "image" | "pattern" | "glass";

export interface DesignBackground {
  type: BackgroundType;
  solidColor: string;
  gradientFrom: string;
  gradientVia?: string;
  gradientTo: string;
  gradientDirection: string; // "to-r", "to-br", "to-b", "to-tr", "to-bl"
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
  pattern: "grid" | "scanline" | "dots" | "hexagons" | "circuit" | "cross" | "cyber" | "noise" | "none";
  patternColor?: string;
  patternOpacity: number;

  // Image background
  imageUrl?: string;
  imageOpacity?: number;
  imageBlur?: number;
  imageFit?: "cover" | "contain" | "fill";
  imagePosition?: "center" | "top" | "bottom" | "left" | "right";
}

export type CornerStyle =
  | "minimal"
  | "thin-line"
  | "thick-border"
  | "cyber-hud"
  | "blueprint"
  | "technical-drawing"
  | "gaming"
  | "sci-fi"
  | "neon"
  | "glass"
  | "premium-corporate"
  | "double-corner"
  | "rounded-corner"
  | "square-corner"
  | "geometric"
  | "futuristic"
  | "industrial"
  | "modern-ui"
  | "elegant"
  | "custom-blank"
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
  offsetX?: number; // independent horizontal position shift (-50 to 50 px)
  offsetY?: number; // independent vertical position shift (-50 to 50 px)
  radius?: number; // corner radius for rounded styles (0 to 50 px)
  color: string; // main fill/stroke color
  borderColor?: string; // secondary stroke border color
  glowColor?: string; // glow color
  glowSpread?: number; // 0 to 40
  opacity?: number; // 0 to 1
  blur?: number; // 0 to 20 px blur filter
  borderStyle?: "solid" | "dashed" | "dotted" | "double";
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
  width: number; // 1 to 40 px
  color: string;
  gradientFrom?: string;
  gradientTo?: string;
  opacity: number; // 0 to 1
  radius: number; // 0 to 50 px
  glow?: string;
  animated?: boolean;
  innerPadding?: number;
  borderStyle?: "solid" | "dashed" | "dotted" | "double";
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
  background: DesignBackground;
  elements: CanvasElement[];
  showCyberBorders: boolean;
  showGlassPanel: boolean;
  glassOpacity: number;
  glassBlur: number;
  showGuides?: boolean;
  showGrid?: boolean;
  showSafeMargins?: boolean;
  safeMarginPct?: number;
  safeNote?: string;
  allowTransparentBackground?: boolean;
  createdAt?: string;
  updatedAt?: string;

  // Frame & Corner Decorations
  cornerDecorations?: CornerDecorationConfig;
  frameConfig?: FrameConfig;
  customCornerPresets?: CustomCornerPreset[];
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

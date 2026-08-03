export type CanvasPresetId =
  | "portfolio_thumb"
  | "blog_featured"
  | "store_product"
  | "og_image"
  | "facebook_cover"
  | "linkedin_cover"
  | "twitter_header"
  | "instagram_post"
  | "instagram_story"
  | "custom";

export interface CanvasPreset {
  id: CanvasPresetId;
  name: string;
  width: number;
  height: number;
  aspectRatio: string;
  description: string;
}

export type ImageFitMode = "cover" | "contain" | "fill" | "smart";
export type ElementType = "text" | "badge" | "image" | "button" | "logo" | "shape";
export type ExportFormat = "png" | "jpg" | "webp" | "svg";
export type ExportQuality = 1 | 2 | 3;

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
  size?: number;
  glow?: boolean;

  // Shape properties
  shapeType?: "rect" | "circle" | "line" | "glow-card";
}

export interface DesignBackground {
  type: "gradient" | "solid" | "image" | "pattern";
  solidColor: string;
  gradientFrom: string;
  gradientTo: string;
  gradientDirection: string; // "to-r", "to-br", "to-b", "to-tr"
  pattern: "grid" | "scanline" | "dots" | "hexagons" | "none";
  patternOpacity: number;
  imageUrl?: string;
  imageOpacity?: number;
  imageBlur?: number;
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
  allowTransparentBackground?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface DesignTemplate {
  id: string;
  name: string;
  category: "Portfolio" | "Blog" | "Store" | "Services" | "Case Study" | "Testimonial" | "Hero Banner" | "Custom";
  description: string;
  previewColor: string;
  isCustom?: boolean;
  state: DesignState;
}

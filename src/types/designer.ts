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

export interface DesignTextElement {
  id: string;
  type: "title" | "subtitle" | "description" | "custom";
  text: string;
  visible: boolean;
  fontSize: number; // in px for base reference
  fontFamily: "Orbitron" | "Rajdhani" | "Inter" | "Space Mono";
  fontWeight: "bold" | "black" | "normal" | "semibold";
  color: string;
  textAlign: "left" | "center" | "right";
  letterSpacing: number; // in px
  lineHeight: number;
  textTransform: "uppercase" | "none" | "capitalize";
  x: number; // position percentage 0-100
  y: number; // position percentage 0-100
  gradientText?: boolean;
}

export interface DesignBadge {
  id: string;
  text: string;
  visible: boolean;
  bg: string;
  textColor: string;
  borderColor: string;
  fontSize: number;
  x: number;
  y: number;
}

export interface DesignCtaButton {
  text: string;
  visible: boolean;
  bgGradient: string;
  textColor: string;
  borderRadius: number;
  fontSize: number;
  x: number;
  y: number;
}

export interface DesignBackground {
  type: "gradient" | "solid" | "image" | "pattern";
  solidColor: string;
  gradientFrom: string;
  gradientTo: string;
  gradientDirection: string; // "to-r", "to-br", "to-b", etc.
  pattern: "grid" | "scanline" | "dots" | "hexagons" | "none";
  patternOpacity: number;
  imageUrl?: string;
}

export interface DesignImageLayer {
  url?: string;
  fitMode: ImageFitMode;
  scale: number; // 0.5 to 3.0
  xOffset: number; // -100 to 100
  yOffset: number; // -100 to 100
  rotation: number; // degrees
  borderRadius: number; // px
  borderWidth: number;
  borderColor: string;
  shadowGlow: string; // e.g. "cyan", "purple", "pink", "orange", "none"
  opacity: number; // 0 to 1
  visible: boolean;
}

export interface DesignLogo {
  visible: boolean;
  text: string;
  logoUrl?: string;
  x: number;
  y: number;
  size: number;
  glow: boolean;
}

export interface LayerItem {
  id: string;
  name: string;
  type: "background" | "image" | "title" | "subtitle" | "description" | "badges" | "cta" | "logo" | "overlay";
  visible: boolean;
  locked: boolean;
}

export interface DesignState {
  id: string;
  title: string;
  preset: CanvasPresetId;
  width: number;
  height: number;
  background: DesignBackground;
  image: DesignImageLayer;
  texts: DesignTextElement[];
  badges: DesignBadge[];
  cta: DesignCtaButton;
  logo: DesignLogo;
  showCyberBorders: boolean;
  showGlassPanel: boolean;
  glassOpacity: number;
  glassBlur: number;
  layers: LayerItem[];
}

export interface DesignTemplate {
  id: string;
  name: string;
  category: "Portfolio" | "Blog" | "Store" | "Services" | "Case Study" | "Testimonial" | "Team" | "Hero Banner";
  description: string;
  previewColor: string;
  state: Partial<DesignState>;
}

export type ImageEditorTool =
  | "adjust"
  | "transform"
  | "crop"
  | "effects"
  | "background"
  | "layers"
  | "text_shapes"
  | "presets"
  | "history";

export type AspectRatioPreset = "custom" | "free" | "1:1" | "16:9" | "4:3" | "9:16" | "3:2" | "2:3" | "4:5";

export interface ColorAdjustments {
  brightness: number; // -100 to 100
  contrast: number; // -100 to 100
  saturation: number; // -100 to 100
  vibrance: number; // -100 to 100
  hue: number; // -180 to 180
  temperature: number; // -100 to 100
  tint: number; // -100 to 100
  exposure: number; // -100 to 100
  highlights: number; // -100 to 100
  shadows: number; // -100 to 100
  whites: number; // -100 to 100
  blacks: number; // -100 to 100
  gamma: number; // 0.1 to 3.0
}

export interface TransformSettings {
  rotate: number; // -180 to 180
  flipH: boolean;
  flipV: boolean;
  scaleX: number; // 0.1 to 3.0
  scaleY: number; // 0.1 to 3.0
  skewX: number; // -45 to 45 deg
  skewY: number; // -45 to 45 deg
  perspectiveX: number; // -50 to 50
  perspectiveY: number; // -50 to 50
}

export interface CropRect {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number; // percentage 0-100
  height: number; // percentage 0-100
  aspectRatio?: AspectRatioPreset;
}

export interface ImageEffectSettings {
  blur: number; // 0 to 50px
  sharpen: number; // 0 to 100
  noise: number; // 0 to 100
  glow: {
    enabled: boolean;
    color: string;
    radius: number;
    intensity: number;
  };
  shadow: {
    enabled: boolean;
    color: string;
    offsetX: number;
    offsetY: number;
    blur: number;
  };
  outline: {
    enabled: boolean;
    color: string;
    width: number;
  };
  emboss: boolean;
  vintage: number; // 0 to 100
  blackAndWhite: boolean;
  sepia: number; // 0 to 100
  filmLook: boolean;
  hdr: number; // 0 to 100
  duotone: {
    enabled: boolean;
    colorA: string;
    colorB: string;
  };
  colorOverlay: {
    enabled: boolean;
    color: string;
    opacity: number;
    blendMode: GlobalCompositeOperation;
  };
  gradientOverlay: {
    enabled: boolean;
    color1: string;
    color2: string;
    angle: number;
    opacity: number;
    blendMode: GlobalCompositeOperation;
  };
}

export type BackgroundType =
  | "transparent"
  | "solid"
  | "linear_gradient"
  | "radial_gradient"
  | "mesh_gradient"
  | "cyber_wireframe"
  | "blueprint_grid"
  | "image";

export interface BackgroundSettings {
  type: BackgroundType;
  color: string;
  gradientColor1: string;
  gradientColor2: string;
  gradientColor3?: string;
  gradientAngle: number;
  wireframeColor: string;
  wireframeGridSize: number;
  wireframeGlow: boolean;
  imageUrl?: string;
  opacity: number;
}

export type LayerType = "image" | "text" | "shape" | "background";

export interface ImageLayer {
  id: string;
  name: string;
  type: LayerType;
  visible: boolean;
  locked: boolean;
  opacity: number; // 0 to 1
  blendMode: GlobalCompositeOperation;
  x: number; // pixels on canvas
  y: number; // pixels on canvas
  width: number; // pixels on canvas
  height: number; // pixels on canvas
  rotation: number; // deg
  
  // Specific data
  src?: string; // For image layer
  text?: string; // For text layer
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  fontStyle?: "normal" | "italic";
  textAlign?: "left" | "center" | "right";
  textColor?: string;
  letterSpacing?: number;
  lineHeight?: number;
  
  shapeType?: "rectangle" | "rounded_rect" | "circle" | "star" | "triangle" | "line";
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  cornerRadius?: number;

  maskShape?: "none" | "circle" | "rounded" | "star";

  // Filter/effect overrides for image layer
  adjustments?: Partial<ColorAdjustments>;
  effects?: Partial<ImageEffectSettings>;
  transform?: Partial<TransformSettings>;
}

export interface CanvasSettings {
  width: number;
  height: number;
  zoom: number; // 0.1 to 5.0
  panX: number;
  panY: number;
  showRulers: boolean;
  showGrid: boolean;
  showSafeMargins: boolean;
  snapToGrid: boolean;
  snapToObjects: boolean;
  backgroundColor: string;
}

export interface ImageEditorHistorySnapshot {
  id: string;
  timestamp: number;
  description: string;
  layers: ImageLayer[];
  adjustments: ColorAdjustments;
  transform: TransformSettings;
  crop: CropRect;
  effects: ImageEffectSettings;
  background: BackgroundSettings;
  canvas: { width: number; height: number };
}

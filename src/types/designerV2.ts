import { DesignState, CanvasElement, ExportFormat, ExportQuality, ProfessionalExportOptions, CanvasPreset } from "./designer";

export interface V2Artboard {
  id: string;
  title: string;
  x: number; // canvas position X in px
  y: number; // canvas position Y in px
  width: number;
  height: number;
  presetId?: string;
  state: DesignState;
  isLocked?: boolean;
}

export interface BrandKit {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  headingFont: "Orbitron" | "Rajdhani" | "Inter" | "Space Mono";
  bodyFont: "Orbitron" | "Rajdhani" | "Inter" | "Space Mono";
  logoUrl?: string;
}

export interface V2Project {
  id: string;
  title: string;
  version: "2.0";
  createdAt: string;
  updatedAt: string;
  activeArtboardId: string;
  artboards: V2Artboard[];
  brandKit?: BrandKit;
  meta?: {
    author?: string;
    description?: string;
    tags?: string[];
  };
}

export type V2Tool =
  | "select"
  | "pan"
  | "artboard"
  | "text"
  | "image"
  | "shape"
  | "badge"
  | "button"
  | "frame"
  | "wireframe"
  | "components"
  | "ai_assistant";

export interface HistoryEntry {
  id: string;
  timestamp: string;
  description: string;
  projectSnapshot: V2Project;
}

export interface WorkspaceConfig {
  zoom: number; // 0.1 to 5.0 (10% to 500%)
  panX: number;
  panY: number;
  showGrid: boolean;
  gridSize: number;
  showSnapGuides: boolean;
  showWireframe: boolean;
  showSafeMargins: boolean;
  theme: "dark" | "light";
  activeTool: V2Tool;
  leftPanelTab: "layers" | "assets" | "templates" | "history" | "brand";
  rightPanelTab: "inspector" | "export" | "plugins";
  leftPanelOpen: boolean;
  rightPanelOpen: boolean;
}

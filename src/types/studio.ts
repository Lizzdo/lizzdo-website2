export type StudioToolCategory = 
  | "design"
  | "ai_media"
  | "marketing"
  | "resources"
  | "system"
  | "future";

export type StudioToolId =
  | "dashboard"
  | "designer"
  | "image-editor"
  | "ai-generator"
  | "video-editor"
  | "thumbnail-creator"
  | "banner-creator"
  | "logo-creator"
  | "portfolio-builder"
  | "blog-designer"
  | "store-designer"
  | "social-designer"
  | "mockup-generator"
  | "brand-kit"
  | "asset-library"
  | "assets"
  | "templates"
  | "icons"
  | "fonts"
  | "ai-assistant"
  | "file-manager"
  | "files"
  | "projects"
  | "settings"
  // Future Expansion
  | "3d-viewer"
  | "animation-editor"
  | "website-builder"
  | "doc-designer";

export interface StudioToolMeta {
  id: StudioToolId;
  name: string;
  category: StudioToolCategory;
  description: string;
  badge?: string;
  shortcut?: string;
  iconName: string;
}

export type StudioProjectStatus = "draft" | "in_progress" | "exported" | "published" | "archived";

export interface StudioProject {
  id: string;
  title: string;
  toolId: StudioToolId;
  thumbnailUrl?: string;
  width: number;
  height: number;
  createdAt: string;
  updatedAt: string;
  status: StudioProjectStatus;
  favorite: boolean;
  tags: string[];
  platform: string;
  fileSize: string;
  folder?: string;
  category?: string;
  data: any; // Stores canvas elements, video tracks, prompt history, etc.
}

export type ActivityType =
  | "project_created"
  | "project_updated"
  | "export_completed"
  | "template_used"
  | "asset_uploaded"
  | "ai_generated"
  | "blog_published"
  | "portfolio_updated";

export interface StudioActivity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  projectId?: string;
  toolId?: StudioToolId;
}

export interface SharedAsset {
  id: string;
  name: string;
  type: "image" | "font" | "color" | "logo" | "video" | "template" | "icon" | "audio";
  url: string;
  category: string;
  tags: string[];
  sizeStr?: string;
  createdAt: string;
}

export interface BrandKitData {
  brandName: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  accentColors: string[];
  neutralColors: string[];
  headingFont: string;
  bodyFont: string;
  logoVariants: { id: string; name: string; url: string }[];
}

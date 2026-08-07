export type AICategory =
  | "Logo Design"
  | "YouTube Thumbnail"
  | "Facebook Cover"
  | "Portfolio Banner"
  | "Store Product Image"
  | "Cyber Background"
  | "Blog Header"
  | "Social Media"
  | "Marketing Copy"
  | "General";

export interface AIPromptTemplate {
  id: string;
  title: string;
  prompt: string;
  negativePrompt?: string;
  category: AICategory;
  tags: string[];
  favorite: boolean;
  author: string;
  isCustom: boolean;
  createdAt: string;
  aspectRatio?: string;
  stylePreset?: string;
}

export type AIGenerationType =
  | "image"
  | "edit"
  | "writer"
  | "bg"
  | "template"
  | "brand"
  | "asset";

export interface AIGenerationTask {
  id: string;
  type: AIGenerationType;
  prompt: string;
  negativePrompt?: string;
  status: "queued" | "processing" | "completed" | "failed" | "cancelled";
  progress: number; // 0 to 100
  startedAt: string;
  completedAt?: string;
  error?: string;
  results: string[];
  textResult?: string;
  model: string;
  seed: number;
  aspectRatio?: string;
  style?: string;
  promptWeight?: number;
  guidanceStrength?: number;
  qualityPreset?: string;
  referenceImages?: string[];
  editTool?: string;
}

export interface AIHistoryEntry {
  id: string;
  type: "Image" | "Edit" | "Writer" | "Background" | "Template" | "Brand" | "Asset";
  prompt: string;
  negativePrompt?: string;
  date: string;
  timestamp: number;
  seed: number;
  model: string;
  previewUrls?: string[];
  textResult?: string;
  favorite: boolean;
  settingsUsed: {
    aspectRatio?: string;
    style?: string;
    promptWeight?: number;
    guidanceStrength?: number;
    qualityPreset?: string;
    batchCount?: number;
    editingTool?: string;
    writerType?: string;
    writerTone?: string;
    writerAction?: string;
    referenceImagesCount?: number;
  };
  projectName?: string;
}

export interface AISettings {
  defaultModel: string;
  qualityPreset: "Standard" | "High" | "Ultra 8K" | "Photorealistic";
  defaultAspectRatio: string;
  maxQueueConcurrency: number;
  enableCaching: boolean;
  timeoutSeconds: number;
  brandConsistencyEnabled: boolean;
  autoSaveToHistory: boolean;
  safetyFilterLevel: "Strict" | "Balanced" | "Permissive";
  apiKeyConfigured: boolean;
}

export interface AIImageEditOption {
  id:
    | "bg-remove"
    | "bg-replace"
    | "obj-remove"
    | "obj-replace"
    | "inpainting"
    | "outpainting"
    | "expansion"
    | "face-restore"
    | "upscale"
    | "relighting"
    | "color-match"
    | "smart-erase";
  label: string;
  description: string;
  iconName: string;
  badge?: string;
}

export interface AIWriterOption {
  id:
    | "blog"
    | "portfolio"
    | "product"
    | "service"
    | "faq"
    | "case-study"
    | "docs"
    | "seo"
    | "meta"
    | "social"
    | "ad"
    | "email";
  label: string;
  description: string;
}

export interface AIWriterActionOption {
  id:
    | "generate"
    | "rewrite"
    | "expand"
    | "shorten"
    | "translate"
    | "grammar"
    | "tone"
    | "keywords"
    | "hashtags";
  label: string;
  description: string;
}

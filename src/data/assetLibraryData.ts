export type AssetType =
  | "Images"
  | "SVG Icons"
  | "Logos"
  | "Fonts"
  | "Backgrounds"
  | "Textures"
  | "Wireframes"
  | "Gradients"
  | "Shapes"
  | "Mockups"
  | "Patterns"
  | "Stickers"
  | "Decorative Elements"
  | "UI Components"
  | "Videos"
  | "Audio"
  | "PDF & Documents"
  | "Lottie & Motion"
  | "PSD & Design Files";

export interface ExtendedAssetMeta {
  id: string;
  name: string;
  type: AssetType;
  category: string;
  tags: string[];
  url?: string;
  svgCode?: string;
  previewUrl?: string;
  gradientCSS?: string;
  fontFamily?: string;
  color?: string;
  style?: string;
  orientation?: "Landscape" | "Portrait" | "Square";
  collectionIds?: string[];
  folderPath?: string;
  sizeStr?: string;
  sizeBytes?: number;
  dimensions?: string;
  createdAt: string;
  favorite?: boolean;
  archived?: boolean;
  usageCount?: number;
  colorPalette?: string[];
  durationStr?: string;
  format?: string;
  mimeType?: string;
  optimized?: boolean;
  originalSizeStr?: string;
}

export const ASSET_TYPES: AssetType[] = [
  "Images",
  "SVG Icons",
  "Logos",
  "Fonts",
  "Backgrounds",
  "Textures",
  "Wireframes",
  "Gradients",
  "Shapes",
  "Mockups",
  "Patterns",
  "Stickers",
  "Decorative Elements",
  "UI Components",
  "Videos",
  "Audio",
  "PDF & Documents",
  "Lottie & Motion",
  "PSD & Design Files",
];

export const INITIAL_MARKETPLACE_ASSETS: ExtendedAssetMeta[] = [
  // 1. IMAGES
  {
    id: "asset-img-1",
    name: "Cyber Neon Grid Matrix",
    type: "Images",
    category: "Portfolio Images",
    tags: ["neon", "cyberpunk", "grid", "background", "cyan", "Technology"],
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    color: "Cyan",
    style: "Cyberpunk",
    orientation: "Landscape",
    sizeStr: "1.4 MB",
    sizeBytes: 1468006,
    dimensions: "1920x1080",
    createdAt: "2026-08-01",
    folderPath: "/Backgrounds",
    usageCount: 14,
    colorPalette: ["#00f5ff", "#0a0e27", "#121829", "#1f293d"],
    format: "JPG",
    mimeType: "image/jpeg",
    optimized: true,
  },
  {
    id: "asset-img-2",
    name: "Futuristic Holographic Core",
    type: "Images",
    category: "3D",
    tags: ["hologram", "future", "tech", "abstract", "purple", "3D"],
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    color: "Purple",
    style: "Futuristic Tech",
    orientation: "Landscape",
    sizeStr: "2.1 MB",
    sizeBytes: 2202009,
    dimensions: "2400x1600",
    createdAt: "2026-08-02",
    folderPath: "/Portfolio Images",
    usageCount: 8,
    colorPalette: ["#a855f7", "#3b82f6", "#050515", "#2e1065"],
    format: "WebP",
    mimeType: "image/webp",
  },

  // 2. SVG ICONS
  {
    id: "asset-icon-1",
    name: "Shield Cyber Security Icon",
    type: "SVG Icons",
    category: "Icons",
    tags: ["shield", "security", "protection", "vector", "icon", "Cybersecurity"],
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#00f5ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>`,
    color: "Cyan",
    style: "Minimalist",
    sizeStr: "12 KB",
    sizeBytes: 12288,
    createdAt: "2026-08-01",
    folderPath: "/Icons",
    usageCount: 25,
    colorPalette: ["#00f5ff"],
    format: "SVG",
    mimeType: "image/svg+xml",
  },
  {
    id: "asset-icon-2",
    name: "Lightning AI Energy Vector",
    type: "SVG Icons",
    category: "Icons",
    tags: ["zap", "energy", "power", "ai", "bolt", "Gaming"],
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    color: "Yellow",
    style: "Neon Luxury",
    sizeStr: "8 KB",
    sizeBytes: 8192,
    createdAt: "2026-08-02",
    folderPath: "/Icons",
    usageCount: 19,
    colorPalette: ["#f59e0b"],
    format: "SVG",
    mimeType: "image/svg+xml",
  },

  // 3. LOGOS
  {
    id: "asset-logo-1",
    name: "Lizzdo Cyber Emblem Logo",
    type: "Logos",
    category: "Logos",
    tags: ["lizzdo", "logo", "emblem", "cyan", "brand", "Business"],
    url: "/lizzdo-logo.png",
    color: "Cyan",
    style: "Minimalist",
    sizeStr: "240 KB",
    sizeBytes: 245760,
    dimensions: "500x500",
    createdAt: "2026-08-01",
    folderPath: "/Logos",
    usageCount: 42,
    colorPalette: ["#00f5ff", "#ffffff", "#000000"],
    format: "PNG",
    mimeType: "image/png",
  },

  // 4. FONTS
  {
    id: "asset-font-1",
    name: "Orbitron Display Tech Font",
    type: "Fonts",
    category: "Brand Assets",
    tags: ["font", "orbitron", "cyber", "headline", "tech", "Technology"],
    fontFamily: "Orbitron",
    style: "Futuristic Tech",
    sizeStr: "180 KB",
    sizeBytes: 184320,
    createdAt: "2026-08-01",
    folderPath: "/Brand Assets",
    usageCount: 31,
    format: "WOFF2",
  },
  {
    id: "asset-font-2",
    name: "Rajdhani Modern UI Font",
    type: "Fonts",
    category: "Brand Assets",
    tags: ["font", "rajdhani", "clean", "sans", "Business"],
    fontFamily: "Rajdhani",
    style: "SaaS Modern",
    sizeStr: "120 KB",
    sizeBytes: 122880,
    createdAt: "2026-08-01",
    folderPath: "/Brand Assets",
    usageCount: 18,
    format: "TTF",
  },

  // 5. BACKGROUNDS
  {
    id: "asset-bg-1",
    name: "Deep Space Dark Nebula Background",
    type: "Backgrounds",
    category: "Backgrounds",
    tags: ["nebula", "space", "dark", "wallpaper", "bg", "Social Media"],
    url: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80",
    color: "Dark",
    style: "Corporate Dark",
    orientation: "Landscape",
    sizeStr: "3.2 MB",
    sizeBytes: 3355443,
    dimensions: "3840x2160",
    createdAt: "2026-08-03",
    folderPath: "/Backgrounds",
    usageCount: 12,
    colorPalette: ["#090d16", "#1a233a", "#2e3c63"],
    format: "JPG",
    mimeType: "image/jpeg",
  },

  // 6. VIDEOS
  {
    id: "asset-vid-1",
    name: "Cyber City Motion Loop",
    type: "Videos",
    category: "Videos",
    tags: ["video", "motion", "cyber", "loop", "neon", "Gaming"],
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    previewUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    color: "Cyan",
    style: "Cyberpunk",
    orientation: "Landscape",
    sizeStr: "14.2 MB",
    sizeBytes: 14889779,
    dimensions: "1920x1080",
    durationStr: "00:15",
    createdAt: "2026-08-04",
    folderPath: "/Videos",
    usageCount: 9,
    format: "MP4",
    mimeType: "video/mp4",
  },

  // 7. AUDIO
  {
    id: "asset-aud-1",
    name: "Synthwave Ambient Track",
    type: "Audio",
    category: "Audio",
    tags: ["audio", "music", "synthwave", "ambient", "soundtrack", "Marketing"],
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "Purple",
    style: "Neon Luxury",
    sizeStr: "4.8 MB",
    sizeBytes: 5033164,
    durationStr: "06:12",
    createdAt: "2026-08-04",
    folderPath: "/Audio",
    usageCount: 6,
    format: "MP3",
    mimeType: "audio/mp3",
  },

  // 8. PDF & DOCUMENTS
  {
    id: "asset-doc-1",
    name: "Lizzdo Brand Guidelines 2026",
    type: "PDF & Documents",
    category: "Brand Assets",
    tags: ["pdf", "brand", "guidelines", "manual", "document", "Store"],
    url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    color: "Cyan",
    style: "Corporate Dark",
    sizeStr: "2.4 MB",
    sizeBytes: 2516582,
    createdAt: "2026-08-05",
    folderPath: "/Brand Assets",
    usageCount: 15,
    format: "PDF",
    mimeType: "application/pdf",
  },

  // 9. LOTTIE & MOTION
  {
    id: "asset-lot-1",
    name: "Interactive Success Checkmark Lottie",
    type: "Lottie & Motion",
    category: "Templates",
    tags: ["lottie", "json", "animation", "check", "success"],
    url: "https://assets9.lottiefiles.com/packages/lf20_jbrw3hcz.json",
    color: "Green",
    style: "Minimalist",
    sizeStr: "45 KB",
    sizeBytes: 46080,
    createdAt: "2026-08-05",
    folderPath: "/Templates",
    usageCount: 11,
    format: "JSON",
    mimeType: "application/json",
  },

  // 10. PSD & DESIGN FILES
  {
    id: "asset-psd-1",
    name: "Photoshop Product Showcase Mockup",
    type: "PSD & Design Files",
    category: "Mockups",
    tags: ["psd", "photoshop", "mockup", "layers", "product", "Roblox"],
    color: "Dark",
    style: "SaaS Modern",
    sizeStr: "48.5 MB",
    sizeBytes: 50855936,
    dimensions: "4000x3000",
    createdAt: "2026-08-05",
    folderPath: "/Mockups",
    usageCount: 7,
    format: "PSD",
    mimeType: "image/vnd.adobe.photoshop",
  },

  // 11. GRADIENTS
  {
    id: "asset-grad-1",
    name: "Cyber Cyan to Ultraviolet Gradient",
    type: "Gradients",
    category: "Backgrounds",
    tags: ["gradient", "cyan", "purple", "linear", "bg"],
    gradientCSS: "linear-gradient(135deg, #00f5ff 0%, #a855f7 100%)",
    color: "Cyan",
    style: "Neon Luxury",
    sizeStr: "2 KB",
    sizeBytes: 2048,
    createdAt: "2026-08-01",
    folderPath: "/Backgrounds",
    usageCount: 22,
    colorPalette: ["#00f5ff", "#a855f7"],
  },

  // 12. UI COMPONENTS
  {
    id: "asset-ui-1",
    name: "Glassmorphic CTA Glass Button",
    type: "UI Components",
    category: "Store Images",
    tags: ["ui", "button", "cta", "glass", "cyan", "Store"],
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 80"><rect width="300" height="80" rx="20" fill="#00f5ff" opacity="0.2" stroke="#00f5ff" stroke-width="2"/><text x="150" y="48" font-family="Orbitron" font-size="20" font-weight="bold" fill="#00f5ff" text-anchor="middle">LAUNCH STUDIO</text></svg>`,
    color: "Cyan",
    style: "SaaS Modern",
    sizeStr: "10 KB",
    sizeBytes: 10240,
    createdAt: "2026-08-04",
    folderPath: "/Store Images",
    usageCount: 16,
    format: "SVG",
  },
];


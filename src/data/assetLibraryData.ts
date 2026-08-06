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
  | "UI Components";

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
  dimensions?: string;
  createdAt: string;
  favorite?: boolean;
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
];

export const INITIAL_MARKETPLACE_ASSETS: ExtendedAssetMeta[] = [
  // 1. IMAGES
  {
    id: "asset-img-1",
    name: "Cyber Neon Grid Matrix",
    type: "Images",
    category: "Cyberpunk",
    tags: ["neon", "cyberpunk", "grid", "background", "cyan"],
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    color: "Cyan",
    style: "Cyberpunk",
    orientation: "Landscape",
    sizeStr: "1.4 MB",
    dimensions: "1920x1080",
    createdAt: "2026-08-01",
    folderPath: "/Backgrounds/Cyber",
  },
  {
    id: "asset-img-2",
    name: "Futuristic Holographic Core",
    type: "Images",
    category: "Technology",
    tags: ["hologram", "future", "tech", "abstract", "purple"],
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    color: "Purple",
    style: "Futuristic Tech",
    orientation: "Landscape",
    sizeStr: "2.1 MB",
    dimensions: "2400x1600",
    createdAt: "2026-08-02",
    folderPath: "/3D Renders",
  },

  // 2. SVG ICONS
  {
    id: "asset-icon-1",
    name: "Shield Cyber Security",
    type: "SVG Icons",
    category: "Security",
    tags: ["shield", "security", "protection", "vector", "icon"],
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#00f5ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>`,
    color: "Cyan",
    style: "Minimalist",
    sizeStr: "12 KB",
    createdAt: "2026-08-01",
    folderPath: "/Icons/Vectors",
  },
  {
    id: "asset-icon-2",
    name: "Lightning AI Energy",
    type: "SVG Icons",
    category: "Power",
    tags: ["zap", "energy", "power", "ai", "bolt"],
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    color: "Yellow",
    style: "Neon Luxury",
    sizeStr: "8 KB",
    createdAt: "2026-08-02",
    folderPath: "/Icons/Vectors",
  },

  // 3. LOGOS
  {
    id: "asset-logo-1",
    name: "Lizzdo Cyber Emblem Logo",
    type: "Logos",
    category: "Brand Logos",
    tags: ["lizzdo", "logo", "emblem", "cyan", "brand"],
    url: "/lizzdo-logo.png",
    color: "Cyan",
    style: "Minimalist",
    sizeStr: "240 KB",
    dimensions: "500x500",
    createdAt: "2026-08-01",
    folderPath: "/Logos/Official",
  },

  // 4. FONTS
  {
    id: "asset-font-1",
    name: "Orbitron Display Tech Font",
    type: "Fonts",
    category: "Display",
    tags: ["font", "orbitron", "cyber", "headline", "tech"],
    fontFamily: "Orbitron",
    style: "Futuristic Tech",
    sizeStr: "180 KB",
    createdAt: "2026-08-01",
    folderPath: "/Typography/Display",
  },
  {
    id: "asset-font-2",
    name: "Rajdhani Modern UI Font",
    type: "Fonts",
    category: "Body",
    tags: ["font", "rajdhani", "clean", "sans"],
    fontFamily: "Rajdhani",
    style: "SaaS Modern",
    sizeStr: "120 KB",
    createdAt: "2026-08-01",
    folderPath: "/Typography/Body",
  },

  // 5. BACKGROUNDS
  {
    id: "asset-bg-1",
    name: "Deep Space Dark Nebula Background",
    type: "Backgrounds",
    category: "Space",
    tags: ["nebula", "space", "dark", "wallpaper", "bg"],
    url: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80",
    color: "Dark",
    style: "Corporate Dark",
    orientation: "Landscape",
    sizeStr: "3.2 MB",
    dimensions: "3840x2160",
    createdAt: "2026-08-03",
    folderPath: "/Backgrounds/Space",
  },

  // 6. TEXTURES
  {
    id: "asset-tex-1",
    name: "Metallic Brushed Fiber Texture",
    type: "Textures",
    category: "Metal",
    tags: ["metal", "texture", "surface", "brushed", "dark"],
    url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80",
    color: "Gray",
    style: "Bold Brutalist",
    orientation: "Square",
    sizeStr: "1.8 MB",
    dimensions: "2000x2000",
    createdAt: "2026-08-02",
    folderPath: "/Textures/Metal",
  },

  // 7. WIREFRAMES
  {
    id: "asset-wire-1",
    name: "SaaS Dashboard Wireframe Grid Component",
    type: "Wireframes",
    category: "UI Wireframes",
    tags: ["wireframe", "dashboard", "ui", "ux", "layout"],
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 600" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="4 4"><rect x="20" y="20" width="960" height="560" rx="16"/><line x1="20" y1="80" x2="980" y2="80"/><rect x="50" y="120" width="200" height="420" rx="12"/><rect x="280" y="120" width="650" height="200" rx="12"/><rect x="280" y="340" width="310" height="200" rx="12"/><rect x="620" y="340" width="310" height="200" rx="12"/></svg>`,
    color: "Light",
    style: "Minimalist",
    sizeStr: "15 KB",
    createdAt: "2026-08-03",
    folderPath: "/Wireframes/Web",
  },

  // 8. GRADIENTS
  {
    id: "asset-grad-1",
    name: "Cyber Cyan to Ultraviolet Gradient",
    type: "Gradients",
    category: "Vibrant",
    tags: ["gradient", "cyan", "purple", "linear", "bg"],
    gradientCSS: "linear-gradient(135deg, #00f5ff 0%, #a855f7 100%)",
    color: "Cyan",
    style: "Neon Luxury",
    sizeStr: "2 KB",
    createdAt: "2026-08-01",
    folderPath: "/Gradients/Cyber",
  },
  {
    id: "asset-grad-2",
    name: "Sunset Crimson Flame Gradient",
    type: "Gradients",
    category: "Warm",
    tags: ["gradient", "crimson", "orange", "warm"],
    gradientCSS: "linear-gradient(135deg, #f43f5e 0%, #f59e0b 100%)",
    color: "Red",
    style: "Playful",
    sizeStr: "2 KB",
    createdAt: "2026-08-02",
    folderPath: "/Gradients/Warm",
  },

  // 9. SHAPES
  {
    id: "asset-shape-1",
    name: "Holographic Cyber Hexagon Vector",
    type: "Shapes",
    category: "Polygons",
    tags: ["hexagon", "shape", "vector", "cyber"],
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="#00f5ff" opacity="0.8"><polygon points="50,5 95,25 95,75 50,95 5,75 5,25"/></svg>`,
    color: "Cyan",
    style: "Cyberpunk",
    sizeStr: "5 KB",
    createdAt: "2026-08-01",
    folderPath: "/Shapes/Polygons",
  },

  // 10. MOCKUPS
  {
    id: "asset-mock-1",
    name: "3D Glassmorphic iPhone 16 Frame",
    type: "Mockups",
    category: "Mobile",
    tags: ["mockup", "iphone", "mobile", "3d", "frame"],
    url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80",
    color: "Dark",
    style: "SaaS Modern",
    orientation: "Portrait",
    sizeStr: "1.9 MB",
    createdAt: "2026-08-04",
    folderPath: "/Mockups/Mobile",
  },

  // 11. PATTERNS
  {
    id: "asset-pat-1",
    name: "Seamless Dark Carbon Hex Pattern",
    type: "Patterns",
    category: "Textures",
    tags: ["pattern", "carbon", "seamless", "dark"],
    url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    color: "Dark",
    style: "Futuristic Tech",
    orientation: "Square",
    sizeStr: "2.4 MB",
    createdAt: "2026-08-02",
    folderPath: "/Patterns/Dark",
  },

  // 12. STICKERS
  {
    id: "asset-stick-1",
    name: "100% Verified Quality Badge Sticker",
    type: "Stickers",
    category: "Badges",
    tags: ["sticker", "badge", "verified", "quality", "icon"],
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="#10b981"/><path d="m30 50 15 15 25-30" stroke="#ffffff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`,
    color: "Green",
    style: "Playful",
    sizeStr: "6 KB",
    createdAt: "2026-08-03",
    folderPath: "/Stickers/Badges",
  },

  // 13. DECORATIVE ELEMENTS
  {
    id: "asset-dec-1",
    name: "Cyber Neon Flare & Particle Ray",
    type: "Decorative Elements",
    category: "Effects",
    tags: ["flare", "glow", "particles", "neon", "cyber"],
    url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80",
    color: "Cyan",
    style: "Neon Luxury",
    sizeStr: "1.1 MB",
    createdAt: "2026-08-01",
    folderPath: "/Decorations/Flares",
  },

  // 14. UI COMPONENTS
  {
    id: "asset-ui-1",
    name: "Glassmorphic CTA Glass Button",
    type: "UI Components",
    category: "Buttons",
    tags: ["ui", "button", "cta", "glass", "cyan"],
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 80"><rect width="300" height="80" rx="20" fill="#00f5ff" opacity="0.2" stroke="#00f5ff" stroke-width="2"/><text x="150" y="48" font-family="Orbitron" font-size="20" font-weight="bold" fill="#00f5ff" text-anchor="middle">LAUNCH STUDIO</text></svg>`,
    color: "Cyan",
    style: "SaaS Modern",
    sizeStr: "10 KB",
    createdAt: "2026-08-04",
    folderPath: "/UI/Buttons",
  },
];

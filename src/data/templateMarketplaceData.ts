import { DesignState, DesignTemplate } from "../types/designer";
import { DEFAULT_DESIGN_STATE } from "./designerTemplates";

export interface ExtendedTemplateMeta {
  id: string;
  name: string;
  category:
    | "Portfolio"
    | "Blog"
    | "Store"
    | "Services"
    | "Landing Pages"
    | "Social Media"
    | "Business"
    | "Technology"
    | "Cybersecurity"
    | "Corporate"
    | "Education"
    | "Gaming"
    | "Events"
    | "Marketing"
    | "Branding"
    | "Personal"
    | "E-commerce"
    | "Announcements"
    | "Case Studies"
    | "Presentations";
  description: string;
  tags: string[];
  style:
    | "Cyberpunk"
    | "Minimalist"
    | "SaaS Modern"
    | "Corporate Dark"
    | "Neon Luxury"
    | "Academic"
    | "Playful"
    | "Editorial"
    | "Futuristic Tech"
    | "Bold Brutalist";
  colorPalette: string[];
  orientation: "Landscape" | "Portrait" | "Square";
  platform: "Web" | "Social" | "Print" | "Presentation" | "E-commerce";
  width: number;
  height: number;
  aspectRatio: string;
  state: DesignState;
  featured?: boolean;
  author?: string;
  usesCount?: number;
  updatedAt: string;
}

export const TEMPLATE_CATEGORIES = [
  "All",
  "Portfolio",
  "Blog",
  "Store",
  "Services",
  "Landing Pages",
  "Social Media",
  "Business",
  "Technology",
  "Cybersecurity",
  "Corporate",
  "Education",
  "Gaming",
  "Events",
  "Marketing",
  "Branding",
  "Personal",
  "E-commerce",
  "Announcements",
  "Case Studies",
  "Presentations",
] as const;

export const TEMPLATE_STYLES = [
  "All Styles",
  "Cyberpunk",
  "Minimalist",
  "SaaS Modern",
  "Corporate Dark",
  "Neon Luxury",
  "Academic",
  "Playful",
  "Editorial",
  "Futuristic Tech",
  "Bold Brutalist",
] as const;

export const TEMPLATE_ORIENTATIONS = ["All Orientations", "Landscape", "Portrait", "Square"] as const;

export const MARKETPLACE_TEMPLATES: ExtendedTemplateMeta[] = [
  // 1. PORTFOLIO
  {
    id: "tmpl-portfolio-1",
    name: "Architectural & Designer Showcase",
    category: "Portfolio",
    description: "Sleek dark-mode portfolio hero banner highlighting featured projects with glassmorphic stats.",
    tags: ["portfolio", "showcase", "architect", "dark", "minimalist"],
    style: "Minimalist",
    colorPalette: ["#00f5ff", "#0a0a0a", "#1a1a1a", "#ffffff"],
    orientation: "Landscape",
    platform: "Web",
    width: 1920,
    height: 1080,
    aspectRatio: "16:9",
    featured: true,
    author: "Lizzdo Studio Pro",
    usesCount: 1420,
    updatedAt: "2026-08-01",
    state: {
      ...DEFAULT_DESIGN_STATE,
      title: "Architectural & Designer Showcase",
      width: 1920,
      height: 1080,
      elements: [
        {
          id: "p1-bg",
          name: "Background Rect",
          type: "shape",
          visible: true,
          locked: true,
          x: 0,
          y: 0,
          width: 1920,
          height: 1080,
          rotation: 0,
          opacity: 1,
          bg: "#0a0e1a",
          shapeType: "rect",
        },
        {
          id: "p1-title",
          name: "Title Text",
          type: "text",
          visible: true,
          locked: false,
          x: 120,
          y: 340,
          width: 1100,
          height: 180,
          rotation: 0,
          opacity: 1,
          text: "CREATIVE PORTFOLIO 2026",
          fontSize: 72,
          fontFamily: "Orbitron",
          color: "#00f5ff",
          fontWeight: "bold",
          alignment: "top-left",
        },
        {
          id: "p1-sub",
          name: "Subtitle Text",
          type: "text",
          visible: true,
          locked: false,
          x: 120,
          y: 540,
          width: 800,
          height: 100,
          rotation: 0,
          opacity: 0.8,
          text: "Interactive UI/UX, Spatial Design & Generative Art Work",
          fontSize: 28,
          fontFamily: "Rajdhani",
          color: "#ffffff",
          alignment: "top-left",
        },
      ],
    },
  },
  {
    id: "tmpl-portfolio-2",
    name: "Freelance Creative Grid Card",
    category: "Portfolio",
    description: "High-impact square gallery thumb with vibrant cyber accent borders.",
    tags: ["portfolio", "gallery", "freelance", "cyan"],
    style: "Cyberpunk",
    colorPalette: ["#00f5ff", "#a855f7", "#12183a"],
    orientation: "Square",
    platform: "Web",
    width: 1000,
    height: 1000,
    aspectRatio: "1:1",
    author: "Lizzdo Studio Pro",
    usesCount: 890,
    updatedAt: "2026-07-28",
    state: {
      ...DEFAULT_DESIGN_STATE,
      title: "Freelance Creative Grid Card",
      width: 1000,
      height: 1000,
      elements: [],
    },
  },

  // 2. BLOG
  {
    id: "tmpl-blog-1",
    name: "AI & Future Tech Editorial Header",
    category: "Blog",
    description: "Header banner for long-form technical blogs and AI break-downs.",
    tags: ["blog", "article", "ai", "editorial", "tech"],
    style: "Futuristic Tech",
    colorPalette: ["#38bdf8", "#0f172a", "#f8fafc"],
    orientation: "Landscape",
    platform: "Web",
    width: 1200,
    height: 675,
    aspectRatio: "16:9",
    featured: true,
    author: "Lizzdo Editorial",
    usesCount: 2310,
    updatedAt: "2026-08-02",
    state: {
      ...DEFAULT_DESIGN_STATE,
      title: "AI & Future Tech Editorial Header",
      width: 1200,
      height: 675,
      elements: [],
    },
  },

  // 3. STORE
  {
    id: "tmpl-store-1",
    name: "Cyberpunk Apparel Digital Drop",
    category: "Store",
    description: "Square digital product artwork with price tag badge & drop countdown.",
    tags: ["store", "ecommerce", "apparel", "cyberpunk", "drop"],
    style: "Cyberpunk",
    colorPalette: ["#f43f5e", "#00f5ff", "#050505"],
    orientation: "Square",
    platform: "E-commerce",
    width: 1000,
    height: 1000,
    aspectRatio: "1:1",
    featured: true,
    author: "Lizzdo Store",
    usesCount: 3120,
    updatedAt: "2026-08-03",
    state: {
      ...DEFAULT_DESIGN_STATE,
      title: "Cyberpunk Apparel Digital Drop",
      width: 1000,
      height: 1000,
      elements: [],
    },
  },

  // 4. SERVICES
  {
    id: "tmpl-services-1",
    name: "Enterprise Digital Agency Offering",
    category: "Services",
    description: "Professional banner card highlighting core service capabilities and ROI metrics.",
    tags: ["services", "agency", "enterprise", "corporate"],
    style: "Corporate Dark",
    colorPalette: ["#3b82f6", "#1e293b", "#ffffff"],
    orientation: "Landscape",
    platform: "Web",
    width: 1200,
    height: 630,
    aspectRatio: "1.91:1",
    author: "Lizzdo Studio Pro",
    usesCount: 1780,
    updatedAt: "2026-07-25",
    state: {
      ...DEFAULT_DESIGN_STATE,
      title: "Enterprise Digital Agency Offering",
      width: 1200,
      height: 630,
      elements: [],
    },
  },

  // 5. LANDING PAGES
  {
    id: "tmpl-landing-1",
    name: "SaaS Launch Product Hero Section",
    category: "Landing Pages",
    description: "Ultra-wide 1920x1080 SaaS landing page hero with CTAs & feature badges.",
    tags: ["landing", "saas", "hero", "launch", "modern"],
    style: "SaaS Modern",
    colorPalette: ["#a855f7", "#06b6d4", "#090d16"],
    orientation: "Landscape",
    platform: "Web",
    width: 1920,
    height: 1080,
    aspectRatio: "16:9",
    featured: true,
    author: "Lizzdo SaaS Team",
    usesCount: 4500,
    updatedAt: "2026-08-04",
    state: {
      ...DEFAULT_DESIGN_STATE,
      title: "SaaS Launch Product Hero Section",
      width: 1920,
      height: 1080,
      elements: [],
    },
  },

  // 6. SOCIAL MEDIA
  {
    id: "tmpl-social-1",
    name: "Instagram Vertical Reel & Story Template",
    category: "Social Media",
    description: "Mobile 9:16 portrait canvas with safe zones for Instagram Reels & TikTok.",
    tags: ["social", "instagram", "reel", "story", "tiktok", "vertical"],
    style: "Neon Luxury",
    colorPalette: ["#ec4899", "#8b5cf6", "#0f0f17"],
    orientation: "Portrait",
    platform: "Social",
    width: 1080,
    height: 1920,
    aspectRatio: "9:16",
    featured: true,
    author: "Lizzdo Social",
    usesCount: 6800,
    updatedAt: "2026-08-04",
    state: {
      ...DEFAULT_DESIGN_STATE,
      title: "Instagram Vertical Reel & Story Template",
      width: 1080,
      height: 1920,
      elements: [],
    },
  },

  // 7. BUSINESS
  {
    id: "tmpl-business-1",
    name: "Executive Quarterly Briefing Cover",
    category: "Business",
    description: "Formal executive summary card with clean typography & corporate grid lines.",
    tags: ["business", "corporate", "briefing", "report"],
    style: "Corporate Dark",
    colorPalette: ["#0284c7", "#0f172a", "#f1f5f9"],
    orientation: "Landscape",
    platform: "Presentation",
    width: 1920,
    height: 1080,
    aspectRatio: "16:9",
    author: "Lizzdo Biz",
    usesCount: 940,
    updatedAt: "2026-07-20",
    state: {
      ...DEFAULT_DESIGN_STATE,
      title: "Executive Quarterly Briefing Cover",
      width: 1920,
      height: 1080,
      elements: [],
    },
  },

  // 8. TECHNOLOGY
  {
    id: "tmpl-tech-1",
    name: "Quantum Computing Hardware Showcase",
    category: "Technology",
    description: "Deep cyan neon hardware visual with specs badges & vector circuit grid.",
    tags: ["tech", "quantum", "hardware", "cyber", "specs"],
    style: "Futuristic Tech",
    colorPalette: ["#00f5ff", "#10b981", "#020617"],
    orientation: "Landscape",
    platform: "Web",
    width: 1200,
    height: 675,
    aspectRatio: "16:9",
    featured: true,
    author: "Lizzdo Tech Lab",
    usesCount: 2150,
    updatedAt: "2026-08-01",
    state: {
      ...DEFAULT_DESIGN_STATE,
      title: "Quantum Computing Hardware Showcase",
      width: 1200,
      height: 675,
      elements: [],
    },
  },

  // 9. CYBERSECURITY
  {
    id: "tmpl-cyber-1",
    name: "Zero-Trust Security Threat Shield",
    category: "Cybersecurity",
    description: "High-security operational graphic featuring shield vectors & threat level status.",
    tags: ["cybersecurity", "security", "shield", "infosec", "threat"],
    style: "Cyberpunk",
    colorPalette: ["#f43f5e", "#00f5ff", "#030712"],
    orientation: "Landscape",
    platform: "Web",
    width: 1200,
    height: 630,
    aspectRatio: "1.91:1",
    author: "Lizzdo CyberSec",
    usesCount: 1620,
    updatedAt: "2026-07-29",
    state: {
      ...DEFAULT_DESIGN_STATE,
      title: "Zero-Trust Security Threat Shield",
      width: 1200,
      height: 630,
      elements: [],
    },
  },

  // 10. CORPORATE
  {
    id: "tmpl-corp-1",
    name: "Global Enterprise Annual Summit",
    category: "Corporate",
    description: "Elegant corporate conference poster with speaker slots and schedule grid.",
    tags: ["corporate", "summit", "conference", "business"],
    style: "Corporate Dark",
    colorPalette: ["#6366f1", "#0f172a", "#ffffff"],
    orientation: "Portrait",
    platform: "Print",
    width: 1200,
    height: 1600,
    aspectRatio: "3:4",
    author: "Lizzdo Corporate",
    usesCount: 780,
    updatedAt: "2026-07-15",
    state: {
      ...DEFAULT_DESIGN_STATE,
      title: "Global Enterprise Annual Summit",
      width: 1200,
      height: 1600,
      elements: [],
    },
  },

  // 11. EDUCATION
  {
    id: "tmpl-edu-1",
    name: "Interactive AI Coding Bootcamp Banner",
    category: "Education",
    description: "Educational workshop banner with syllabus points and certificate badge.",
    tags: ["education", "bootcamp", "coding", "course", "ai"],
    style: "Academic",
    colorPalette: ["#10b981", "#0f172a", "#f8fafc"],
    orientation: "Landscape",
    platform: "Web",
    width: 1200,
    height: 630,
    aspectRatio: "1.91:1",
    author: "Lizzdo Edu",
    usesCount: 1100,
    updatedAt: "2026-07-30",
    state: {
      ...DEFAULT_DESIGN_STATE,
      title: "Interactive AI Coding Bootcamp Banner",
      width: 1200,
      height: 630,
      elements: [],
    },
  },

  // 12. GAMING
  {
    id: "tmpl-gaming-1",
    name: "eSports Tournament Championship Banner",
    category: "Gaming",
    description: "Aggressive neon esports gaming banner with squad slots & prize pool tag.",
    tags: ["gaming", "esports", "twitch", "tournament", "cyber"],
    style: "Cyberpunk",
    colorPalette: ["#f59e0b", "#f43f5e", "#0a0a0a"],
    orientation: "Landscape",
    platform: "Social",
    width: 1920,
    height: 1080,
    aspectRatio: "16:9",
    featured: true,
    author: "Lizzdo Gaming",
    usesCount: 5200,
    updatedAt: "2026-08-02",
    state: {
      ...DEFAULT_DESIGN_STATE,
      title: "eSports Tournament Championship Banner",
      width: 1920,
      height: 1080,
      elements: [],
    },
  },

  // 13. EVENTS
  {
    id: "tmpl-events-1",
    name: "Electronic Music Festival VIP Pass",
    category: "Events",
    description: "High-contrast VIP ticket pass card with QR code zone and holographic foil accents.",
    tags: ["events", "music", "festival", "pass", "ticket"],
    style: "Neon Luxury",
    colorPalette: ["#a855f7", "#00f5ff", "#000000"],
    orientation: "Portrait",
    platform: "Print",
    width: 800,
    height: 1200,
    aspectRatio: "2:3",
    author: "Lizzdo Events",
    usesCount: 1340,
    updatedAt: "2026-07-22",
    state: {
      ...DEFAULT_DESIGN_STATE,
      title: "Electronic Music Festival VIP Pass",
      width: 800,
      height: 1200,
      elements: [],
    },
  },

  // 14. MARKETING
  {
    id: "tmpl-marketing-1",
    name: "Black Friday Cyber Sale Campaign",
    category: "Marketing",
    description: "Ultra promo banner with bold 70% OFF typography and neon countdown timer box.",
    tags: ["marketing", "sale", "promo", "blackfriday", "discount"],
    style: "Bold Brutalist",
    colorPalette: ["#f43f5e", "#f59e0b", "#000000"],
    orientation: "Landscape",
    platform: "Social",
    width: 1200,
    height: 630,
    aspectRatio: "1.91:1",
    featured: true,
    author: "Lizzdo Marketing",
    usesCount: 4200,
    updatedAt: "2026-08-04",
    state: {
      ...DEFAULT_DESIGN_STATE,
      title: "Black Friday Cyber Sale Campaign",
      width: 1200,
      height: 630,
      elements: [],
    },
  },

  // 15. BRANDING
  {
    id: "tmpl-brand-1",
    name: "Minimalist Brand Identity Style Guide",
    category: "Branding",
    description: "Multi-page visual brand kit overview card showing typography, logos & hex codes.",
    tags: ["branding", "brandkit", "logo", "identity", "styleguide"],
    style: "Minimalist",
    colorPalette: ["#18181b", "#71717a", "#ffffff"],
    orientation: "Landscape",
    platform: "Presentation",
    width: 1920,
    height: 1080,
    aspectRatio: "16:9",
    author: "Lizzdo Brand Lab",
    usesCount: 1980,
    updatedAt: "2026-07-31",
    state: {
      ...DEFAULT_DESIGN_STATE,
      title: "Minimalist Brand Identity Style Guide",
      width: 1920,
      height: 1080,
      elements: [],
    },
  },

  // 16. PERSONAL
  {
    id: "tmpl-personal-1",
    name: "Personal Resume & Developer Bio Card",
    category: "Personal",
    description: "Sleek social avatar header and developer bio summary card.",
    tags: ["personal", "resume", "bio", "developer", "avatar"],
    style: "SaaS Modern",
    colorPalette: ["#06b6d4", "#0f172a", "#ffffff"],
    orientation: "Landscape",
    platform: "Social",
    width: 1200,
    height: 630,
    aspectRatio: "1.91:1",
    author: "Lizzdo Creator",
    usesCount: 1450,
    updatedAt: "2026-07-19",
    state: {
      ...DEFAULT_DESIGN_STATE,
      title: "Personal Resume & Developer Bio Card",
      width: 1200,
      height: 630,
      elements: [],
    },
  },

  // 17. E-COMMERCE
  {
    id: "tmpl-ecom-1",
    name: "Shopify Product Feature Carousel",
    category: "E-commerce",
    description: "Multi-angle product feature highlight banner with spec list and buy button.",
    tags: ["ecommerce", "shopify", "product", "store", "catalog"],
    style: "SaaS Modern",
    colorPalette: ["#10b981", "#1e293b", "#ffffff"],
    orientation: "Square",
    platform: "E-commerce",
    width: 1000,
    height: 1000,
    aspectRatio: "1:1",
    author: "Lizzdo E-com",
    usesCount: 2890,
    updatedAt: "2026-08-01",
    state: {
      ...DEFAULT_DESIGN_STATE,
      title: "Shopify Product Feature Carousel",
      width: 1000,
      height: 1000,
      elements: [],
    },
  },

  // 18. ANNOUNCEMENTS
  {
    id: "tmpl-announce-1",
    name: "Series A Funding & Expansion Announcement",
    category: "Announcements",
    description: "High-visibility company milestone announcement card with investor logo bar.",
    tags: ["announcements", "funding", "startup", "press"],
    style: "Corporate Dark",
    colorPalette: ["#3b82f6", "#0f172a", "#f8fafc"],
    orientation: "Landscape",
    platform: "Social",
    width: 1200,
    height: 630,
    aspectRatio: "1.91:1",
    author: "Lizzdo PR",
    usesCount: 880,
    updatedAt: "2026-07-27",
    state: {
      ...DEFAULT_DESIGN_STATE,
      title: "Series A Funding & Expansion Announcement",
      width: 1200,
      height: 630,
      elements: [],
    },
  },

  // 19. CASE STUDIES
  {
    id: "tmpl-case-1",
    name: "FinTech 300% Growth Case Study Cover",
    category: "Case Studies",
    description: "Data-driven case study presentation card with growth chart vector graphic.",
    tags: ["casestudies", "fintech", "growth", "data", "metrics"],
    style: "SaaS Modern",
    colorPalette: ["#10b981", "#0284c7", "#090d16"],
    orientation: "Landscape",
    platform: "Web",
    width: 1200,
    height: 630,
    aspectRatio: "1.91:1",
    author: "Lizzdo Growth",
    usesCount: 1220,
    updatedAt: "2026-07-24",
    state: {
      ...DEFAULT_DESIGN_STATE,
      title: "FinTech 300% Growth Case Study Cover",
      width: 1200,
      height: 630,
      elements: [],
    },
  },

  // 20. PRESENTATIONS
  {
    id: "tmpl-pres-1",
    name: "AI Startup Investor Pitch Deck Title Slide",
    category: "Presentations",
    description: "Widescreen 16:9 pitch deck title slide with holographic gradient backdrop.",
    tags: ["presentations", "pitchdeck", "startup", "investor", "slide"],
    style: "Neon Luxury",
    colorPalette: ["#a855f7", "#00f5ff", "#020617"],
    orientation: "Landscape",
    platform: "Presentation",
    width: 1920,
    height: 1080,
    aspectRatio: "16:9",
    featured: true,
    author: "Lizzdo Decks",
    usesCount: 3900,
    updatedAt: "2026-08-03",
    state: {
      ...DEFAULT_DESIGN_STATE,
      title: "AI Startup Investor Pitch Deck Title Slide",
      width: 1920,
      height: 1080,
      elements: [],
    },
  },
];

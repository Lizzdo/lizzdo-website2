export type PresetCategory =
  | "social"
  | "website"
  | "blog"
  | "store"
  | "portfolio"
  | "youtube"
  | "tiktok"
  | "facebook"
  | "linkedin"
  | "x"
  | "instagram"
  | "fiverr"
  | "github"
  | "opengraph"
  | "custom";

export type ProjectType =
  | "Image Design"
  | "Video"
  | "Social Media"
  | "Website Graphic"
  | "Blog Graphic"
  | "Store Graphic"
  | "Portfolio Graphic"
  | "Custom";

export type CanvasUnit = "px" | "in" | "cm";

export interface ProjectPreset {
  id: string;
  name: string;
  category: PresetCategory;
  projectType: ProjectType;
  platform: string;
  width: number;
  height: number;
  aspectRatio: string;
  description: string;
  iconName?: string;
  recommendedDpi?: number;
  safeMarginPct?: number;
  safeNote?: string;
}

export const PROJECT_PRESETS: ProjectPreset[] = [
  // FACEBOOK
  {
    id: "fb_post",
    name: "Facebook Feed Post",
    category: "facebook",
    projectType: "Social Media",
    platform: "Facebook",
    width: 1200,
    height: 630,
    aspectRatio: "1.91:1",
    description: "Standard landscape post image for Facebook newsfeed",
    iconName: "Facebook",
  },
  {
    id: "fb_cover",
    name: "Facebook Cover Banner",
    category: "facebook",
    projectType: "Social Media",
    platform: "Facebook",
    width: 820,
    height: 312,
    aspectRatio: "2.63:1",
    description: "Desktop & mobile safe cover header image for Facebook Pages",
    iconName: "Facebook",
  },
  {
    id: "fb_story",
    name: "Facebook Story / Reel",
    category: "facebook",
    projectType: "Social Media",
    platform: "Facebook",
    width: 1080,
    height: 1920,
    aspectRatio: "9:16",
    description: "Full-bleed vertical story & video reel format",
    iconName: "Facebook",
  },
  {
    id: "fb_video",
    name: "Facebook Video Ad",
    category: "facebook",
    projectType: "Video",
    platform: "Facebook",
    width: 1080,
    height: 1080,
    aspectRatio: "1:1",
    description: "High-conversion square video format for Facebook Feed",
    iconName: "Facebook",
  },

  // LINKEDIN
  {
    id: "li_post",
    name: "LinkedIn Feed Post",
    category: "linkedin",
    projectType: "Social Media",
    platform: "LinkedIn",
    width: 1200,
    height: 627,
    aspectRatio: "1.91:1",
    description: "Professional corporate update & article link preview banner",
    iconName: "Linkedin",
  },
  {
    id: "li_company_cover",
    name: "LinkedIn Company Banner",
    category: "linkedin",
    projectType: "Social Media",
    platform: "LinkedIn",
    width: 1128,
    height: 191,
    aspectRatio: "5.9:1",
    description: "Header graphic for LinkedIn business profiles",
    iconName: "Linkedin",
  },
  {
    id: "li_personal_cover",
    name: "LinkedIn Personal Banner",
    category: "linkedin",
    projectType: "Social Media",
    platform: "LinkedIn",
    width: 1584,
    height: 396,
    aspectRatio: "4:1",
    description: "Header image for individual LinkedIn profiles",
    iconName: "Linkedin",
  },
  {
    id: "li_video",
    name: "LinkedIn Video Post",
    category: "linkedin",
    projectType: "Video",
    platform: "LinkedIn",
    width: 1080,
    height: 1080,
    aspectRatio: "1:1",
    description: "Square video creative for B2B engagement",
    iconName: "Linkedin",
  },

  // X (TWITTER)
  {
    id: "x_post",
    name: "X (Twitter) Feed Image",
    category: "x",
    projectType: "Social Media",
    platform: "X",
    width: 1600,
    height: 900,
    aspectRatio: "16:9",
    description: "High resolution landscape timeline card image for X",
    iconName: "Twitter",
  },
  {
    id: "x_header",
    name: "X (Twitter) Header Banner",
    category: "x",
    projectType: "Social Media",
    platform: "X",
    width: 1500,
    height: 500,
    aspectRatio: "3:1",
    description: "Profile banner header image for X accounts",
    iconName: "Twitter",
  },

  // YOUTUBE
  {
    id: "yt_thumbnail",
    name: "YouTube Video Thumbnail",
    category: "youtube",
    projectType: "Social Media",
    platform: "YouTube",
    width: 1280,
    height: 720,
    aspectRatio: "16:9",
    description: "High-CTR 720p custom video cover thumbnail",
    iconName: "Youtube",
  },
  {
    id: "yt_banner",
    name: "YouTube Channel Banner",
    category: "youtube",
    projectType: "Social Media",
    platform: "YouTube",
    width: 2560,
    height: 1440,
    aspectRatio: "16:9",
    description: "TV & mobile safe channel art banner (safe box 1546x423)",
    iconName: "Youtube",
    safeMarginPct: 15,
    safeNote: "Keep logos inside central 1546x423 area",
  },
  {
    id: "yt_shorts",
    name: "YouTube Shorts Video",
    category: "youtube",
    projectType: "Video",
    platform: "YouTube",
    width: 1080,
    height: 1920,
    aspectRatio: "9:16",
    description: "Vertical video format for YouTube Shorts",
    iconName: "Youtube",
  },

  // INSTAGRAM
  {
    id: "ig_square",
    name: "Instagram Square Post",
    category: "instagram",
    projectType: "Social Media",
    platform: "Instagram",
    width: 1080,
    height: 1080,
    aspectRatio: "1:1",
    description: "Classic 1:1 feed photo & graphics format",
    iconName: "Instagram",
  },
  {
    id: "ig_portrait",
    name: "Instagram Portrait Post",
    category: "instagram",
    projectType: "Social Media",
    platform: "Instagram",
    width: 1080,
    height: 1350,
    aspectRatio: "4:5",
    description: "Maximum vertical screen area feed post (4:5)",
    iconName: "Instagram",
  },
  {
    id: "ig_story",
    name: "Instagram Story / Reel",
    category: "instagram",
    projectType: "Social Media",
    platform: "Instagram",
    width: 1080,
    height: 1920,
    aspectRatio: "9:16",
    description: "Full-screen vertical story & video reel canvas",
    iconName: "Instagram",
  },

  // TIKTOK
  {
    id: "tt_video",
    name: "TikTok Video Canvas",
    category: "tiktok",
    projectType: "Video",
    platform: "TikTok",
    width: 1080,
    height: 1920,
    aspectRatio: "9:16",
    description: "Standard 9:16 vertical video & graphics composition",
    iconName: "Video",
  },
  {
    id: "tt_cover",
    name: "TikTok Cover Frame",
    category: "tiktok",
    projectType: "Social Media",
    platform: "TikTok",
    width: 1080,
    height: 1920,
    aspectRatio: "9:16",
    description: "Thumbnail preview frame for TikTok videos",
    iconName: "Video",
  },

  // FIVERR
  {
    id: "fiverr_gig",
    name: "Fiverr Gig Image",
    category: "fiverr",
    projectType: "Social Media",
    platform: "Fiverr",
    width: 1280,
    height: 769,
    aspectRatio: "1.66:1",
    description: "Recommended gig showcase preview card for Fiverr sellers",
    iconName: "Briefcase",
  },
  {
    id: "fiverr_video",
    name: "Fiverr Gig Video",
    category: "fiverr",
    projectType: "Video",
    platform: "Fiverr",
    width: 1920,
    height: 1080,
    aspectRatio: "16:9",
    description: "1080p video showcase for Fiverr gig introduction",
    iconName: "Video",
  },

  // GITHUB
  {
    id: "github_preview",
    name: "GitHub Social Preview",
    category: "github",
    projectType: "Social Media",
    platform: "GitHub",
    width: 1280,
    height: 640,
    aspectRatio: "2:1",
    description: "Repository social preview card image for GitHub links",
    iconName: "Github",
  },

  // OPENGRAPH
  {
    id: "og_standard",
    name: "Standard OpenGraph Image",
    category: "opengraph",
    projectType: "Website Graphic",
    platform: "OpenGraph",
    width: 1200,
    height: 630,
    aspectRatio: "1.91:1",
    description: "Universal web link preview thumbnail for Facebook, Slack, iMessage",
    iconName: "Share2",
  },

  // WEBSITE
  {
    id: "web_hero_1080p",
    name: "Website Hero Widescreen",
    category: "website",
    projectType: "Website Graphic",
    platform: "Website",
    width: 1920,
    height: 1080,
    aspectRatio: "16:9",
    description: "Full width landing page hero visual",
    iconName: "Layout",
  },
  {
    id: "web_header",
    name: "Website Header Banner",
    category: "website",
    projectType: "Website Graphic",
    platform: "Website",
    width: 1440,
    height: 600,
    aspectRatio: "2.4:1",
    description: "Top page banner illustration for corporate sites",
    iconName: "Layout",
  },

  // BLOG
  {
    id: "blog_hero",
    name: "Blog Article Featured Header",
    category: "blog",
    projectType: "Blog Graphic",
    platform: "Blog",
    width: 1200,
    height: 675,
    aspectRatio: "16:9",
    description: "Main editorial header illustration",
    iconName: "FileText",
  },
  {
    id: "blog_body",
    name: "Blog Body Illustration",
    category: "blog",
    projectType: "Blog Graphic",
    platform: "Blog",
    width: 1000,
    height: 750,
    aspectRatio: "4:3",
    description: "High-detail inline graphic for articles",
    iconName: "FileText",
  },

  // STORE
  {
    id: "store_product_cover",
    name: "E-Commerce Product Cover",
    category: "store",
    projectType: "Store Graphic",
    platform: "Store",
    width: 1000,
    height: 1000,
    aspectRatio: "1:1",
    description: "Clean product showcase box art image",
    iconName: "ShoppingBag",
  },

  // PORTFOLIO
  {
    id: "portfolio_hero",
    name: "Portfolio Case Study Banner",
    category: "portfolio",
    projectType: "Portfolio Graphic",
    platform: "Portfolio",
    width: 1200,
    height: 630,
    aspectRatio: "1.91:1",
    description: "Showcase banner for design case studies",
    iconName: "Briefcase",
  },
];

export function calculateAspectRatio(width: number, height: number): string {
  if (!width || !height) return "1:1";
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(Math.round(width), Math.round(height));
  const wRatio = Math.round(width) / divisor;
  const hRatio = Math.round(height) / divisor;

  // Handle common standard ratios nicely
  const decimalRatio = width / height;
  if (Math.abs(decimalRatio - 16 / 9) < 0.02) return "16:9";
  if (Math.abs(decimalRatio - 9 / 16) < 0.02) return "9:16";
  if (Math.abs(decimalRatio - 4 / 3) < 0.02) return "4:3";
  if (Math.abs(decimalRatio - 3 / 4) < 0.02) return "3:4";
  if (Math.abs(decimalRatio - 1) < 0.02) return "1:1";
  if (Math.abs(decimalRatio - 1.91) < 0.03) return "1.91:1";

  if (wRatio > 100 || hRatio > 100) {
    return `${decimalRatio.toFixed(2)}:1`;
  }
  return `${wRatio}:${hRatio}`;
}

export function convertUnitsToPixels(val: number, unit: CanvasUnit, dpi: number = 72): number {
  if (unit === "px") return Math.round(val);
  if (unit === "in") return Math.round(val * dpi);
  if (unit === "cm") return Math.round((val / 2.54) * dpi);
  return Math.round(val);
}

export function convertPixelsToUnits(pxVal: number, unit: CanvasUnit, dpi: number = 72): number {
  if (unit === "px") return Math.round(pxVal);
  if (unit === "in") return parseFloat((pxVal / dpi).toFixed(2));
  if (unit === "cm") return parseFloat(((pxVal / dpi) * 2.54).toFixed(2));
  return Math.round(pxVal);
}

export type LogoType =
  | "Primary Logo"
  | "Secondary Logo"
  | "Icon Only / Mark"
  | "Horizontal Logo"
  | "Vertical Logo"
  | "Light Version"
  | "Dark Version"
  | "Monochrome Version"
  | "Transparent PNG"
  | "SVG Vector Logo"
  | "AI / EPS Vector Logo"
  | "PDF Vector Logo";

export interface LogoVariant {
  id: string;
  type: LogoType;
  name: string;
  url: string;
  format: "png" | "svg" | "ai" | "pdf";
  dimensions?: string;
  fileSize?: string;
  updatedAt: string;
}

export type TypographyRoleName = "display" | "heading" | "body" | "button" | "caption";

export interface TypographyRole {
  roleName: TypographyRoleName;
  label: string;
  fontFamily: string;
  fontSize: number; // in px
  fontWeight: number; // 300 to 900
  lineHeight: number; // e.g., 1.2, 1.5
  letterSpacing: string; // e.g. "0.05em"
  textTransform: "none" | "uppercase" | "lowercase" | "capitalize";
  isGoogleFont?: boolean;
}

export interface BrandAssetItem {
  id: string;
  name: string;
  category:
    | "Icons"
    | "SVG Files"
    | "Patterns"
    | "Backgrounds"
    | "Textures"
    | "Watermarks"
    | "Social Icons"
    | "Buttons"
    | "UI Components";
  url?: string;
  svgCode?: string;
  tags: string[];
}

export interface BrandColorSet {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface CustomPalette {
  id: string;
  name: string;
  colors: string[];
}

export interface WatermarkConfig {
  enabled: boolean;
  logoId?: string;
  customText?: string;
  opacity: number; // 0.1 to 1.0
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
  scale: number; // 0.1 to 2.0
}

export interface BrandKitProfile {
  id: string;
  brandName: string;
  companyName: string;
  description: string;
  tagline: string;
  websiteUrl: string;
  emailSignature: string;
  faviconUrl: string;

  // Social Links
  socialLinks: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
    youtube: string;
    tiktok: string;
    github: string;
    dribbble: string;
    fiverr: string;
  };

  // Logos
  logoVariants: LogoVariant[];

  // Colors
  colors: BrandColorSet;
  customPalettes: CustomPalette[];
  colorHistory: string[];

  // Typography
  typography: Record<TypographyRoleName, TypographyRole>;

  // Watermark
  watermark: WatermarkConfig;

  // Assets
  assets: BrandAssetItem[];

  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
}

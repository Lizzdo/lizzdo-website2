import { DesignState, CanvasElement } from "../types/designer";
import { BrandKitProfile } from "../types/brandKit";
import { ExtendedTemplateMeta } from "../data/templateMarketplaceData";

export interface AspectRatioPreset {
  id: string;
  label: string;
  ratioStr: "1:1" | "4:5" | "16:9" | "9:16" | "3:2" | "2:3" | "Custom";
  width: number;
  height: number;
  description: string;
}

export const ASPECT_RATIO_PRESETS: AspectRatioPreset[] = [
  { id: "16-9", label: "16:9 Widescreen", ratioStr: "16:9", width: 1920, height: 1080, description: "YouTube, Banners, Presentations" },
  { id: "1-1", label: "1:1 Square", ratioStr: "1:1", width: 1080, height: 1080, description: "Instagram Post, Store Catalog, Logos" },
  { id: "9-16", label: "9:16 Vertical", ratioStr: "9:16", width: 1080, height: 1920, description: "Instagram Story, Reels, TikTok" },
  { id: "4-5", label: "4:5 Portrait", ratioStr: "4:5", width: 1080, height: 1350, description: "Instagram Feed Portrait, Facebook" },
  { id: "3-2", label: "3:2 Standard", ratioStr: "3:2", width: 1200, height: 800, description: "Blog Gallery, Portfolio Showcase" },
  { id: "2-3", label: "2:3 Poster", ratioStr: "2:3", width: 1000, height: 1500, description: "Pinterest Pin, Posters, Flyers" },
];

/**
 * Applies active Brand Kit tokens onto a DesignState's elements.
 */
export function applyBrandKitToDesignState(
  state: DesignState,
  brandKit: BrandKitProfile,
  options: {
    applyColors?: boolean;
    applyFonts?: boolean;
    applyLogo?: boolean;
    applyText?: boolean;
    applyWatermark?: boolean;
  } = { applyColors: true, applyFonts: true, applyLogo: true, applyText: true, applyWatermark: true }
): DesignState {
  const { applyColors = true, applyFonts = true, applyLogo = true, applyText = true, applyWatermark = true } = options;

  const primaryLogo = brandKit.logoVariants?.[0]?.url || "/lizzdo-logo.png";
  const headingFont = brandKit.typography?.heading?.fontFamily || brandKit.typography?.display?.fontFamily || "Orbitron";
  const bodyFont = brandKit.typography?.body?.fontFamily || "Rajdhani";

  const updatedElements: CanvasElement[] = state.elements.map((elem) => {
    const el = { ...elem };

    // 1. Backgrounds & Shapes
    if (el.type === "shape") {
      if (applyColors) {
        if (el.name?.toLowerCase().includes("bg") || el.name?.toLowerCase().includes("background")) {
          el.bg = brandKit.colors.background;
        } else if (el.name?.toLowerCase().includes("accent") || el.name?.toLowerCase().includes("card")) {
          el.bg = brandKit.colors.surface || brandKit.colors.secondary;
          el.borderColor = brandKit.colors.primary;
        } else if (el.name?.toLowerCase().includes("button") || el.name?.toLowerCase().includes("cta")) {
          el.bg = brandKit.colors.primary;
        }
      }
    }

    // 2. Text Elements
    if (el.type === "text") {
      if (applyFonts) {
        if (el.fontSize && el.fontSize >= 36) {
          el.fontFamily = headingFont as any;
        } else {
          el.fontFamily = bodyFont as any;
        }
      }

      if (applyColors) {
        if (el.fontSize && el.fontSize >= 36) {
          el.color = brandKit.colors.primary;
        } else if (el.text?.toLowerCase().includes("http") || el.text?.toLowerCase().includes("www") || el.text?.toLowerCase().includes(".com")) {
          el.color = brandKit.colors.accent;
        } else {
          el.color = brandKit.colors.text;
        }
      }

      if (applyText) {
        const textLower = el.text?.toLowerCase() || "";
        if (textLower.includes("title") || textLower.includes("brand name") || textLower.includes("headline")) {
          el.text = brandKit.brandName.toUpperCase();
        } else if (textLower.includes("subtitle") || textLower.includes("tagline") || textLower.includes("description")) {
          el.text = brandKit.tagline || brandKit.description || el.text;
        } else if (textLower.includes("www") || textLower.includes("http") || textLower.includes(".com") || textLower.includes("website")) {
          el.text = brandKit.websiteUrl || "www.lizzdo.studio";
        }
      }
    }

    // 3. Logo & Image Elements
    if (el.type === "image" || (el.type as string) === "icon") {
      if (applyLogo && (el.name?.toLowerCase().includes("logo") || el.id?.toLowerCase().includes("logo"))) {
        el.src = primaryLogo;
        el.url = primaryLogo;
        (el as any).content = primaryLogo;
      }
    }

    return el;
  });

  // Check if watermark needs to be appended
  let finalElements = updatedElements;
  if (applyWatermark && brandKit.watermark?.enabled) {
    const wmText = brandKit.watermark.customText || brandKit.brandName;
    const wmOpacity = brandKit.watermark.opacity || 0.3;
    const exists = finalElements.some((e) => e.id === "brand-watermark-elem");
    if (!exists) {
      finalElements = [
        ...finalElements,
        {
          id: "brand-watermark-elem",
          name: "Brand Watermark",
          type: "text",
          visible: true,
          locked: true,
          x: state.width - 240,
          y: state.height - 40,
          width: 220,
          height: 30,
          rotation: 0,
          opacity: wmOpacity,
          text: `© ${wmText}`,
          fontSize: 14,
          fontFamily: bodyFont as any,
          color: brandKit.colors.text,
          alignment: "bottom-right",
        } as any,
      ];
    }
  }

  return {
    ...state,
    width: state.width,
    height: state.height,
    background: applyColors
      ? { ...state.background, solidColor: brandKit.colors.background }
      : state.background,
    elements: finalElements,
  };
}

/**
 * Adapt a DesignState to a new target dimension/aspect ratio smartly.
 */
export function adaptDesignStateToDimensions(
  state: DesignState,
  targetWidth: number,
  targetHeight: number
): DesignState {
  const origWidth = state.width || 1920;
  const origHeight = state.height || 1080;

  const scaleX = targetWidth / origWidth;
  const scaleY = targetHeight / origHeight;
  const uniformScale = Math.min(scaleX, scaleY);

  const adaptedElements: CanvasElement[] = state.elements.map((elem) => {
    const el = { ...elem };

    // Background shapes expand to full bounds
    if (
      el.type === "shape" &&
      (el.width >= origWidth * 0.9 || el.height >= origHeight * 0.9)
    ) {
      el.x = 0;
      el.y = 0;
      el.width = targetWidth;
      el.height = targetHeight;
      return el;
    }

    // Reposition and scale elements relative to center
    const origCenterX = el.x + el.width / 2;
    const origCenterY = el.y + el.height / 2;

    const newCenterX = origCenterX * scaleX;
    const newCenterY = origCenterY * scaleY;

    const newWidth = Math.round(el.width * uniformScale);
    const newHeight = Math.round(el.height * uniformScale);

    el.x = Math.round(newCenterX - newWidth / 2);
    el.y = Math.round(newCenterY - newHeight / 2);
    el.width = Math.max(20, newWidth);
    el.height = Math.max(20, newHeight);

    if (el.fontSize) {
      el.fontSize = Math.max(10, Math.round(el.fontSize * uniformScale));
    }

    return el;
  });

  return {
    ...state,
    width: targetWidth,
    height: targetHeight,
    elements: adaptedElements,
  };
}

/**
 * Replaces a named smart placeholder in a design state.
 */
export function replaceSmartPlaceholderInDesignState(
  state: DesignState,
  placeholderType:
    | "Title"
    | "Subtitle"
    | "Description"
    | "Price"
    | "Website URL"
    | "Logo"
    | "Featured Image"
    | "Tags",
  newValue: string
): DesignState {
  const updatedElements = state.elements.map((elem) => {
    const el = { ...elem };

    const nameLower = el.name?.toLowerCase() || "";
    const typeLower = placeholderType.toLowerCase();

    if (el.type === "text" && (nameLower.includes(typeLower) || el.text?.toLowerCase().includes(typeLower))) {
      el.text = newValue;
    }

    if ((el.type === "image" || (el.type as string) === "icon") && (nameLower.includes(typeLower) || el.id?.toLowerCase().includes(typeLower))) {
      el.src = newValue;
      el.url = newValue;
      (el as any).content = newValue;
    }

    return el;
  });

  return {
    ...state,
    elements: updatedElements,
  };
}

/**
 * Export Template Package as a formatted JSON Blob.
 */
export function exportTemplatePackageJson(template: ExtendedTemplateMeta): void {
  const packageData = {
    schemaVersion: "2.0.0",
    generator: "Studio.Lizzdo.com Template Engine",
    exportedAt: new Date().toISOString(),
    template: {
      ...template,
      versionHistory: [
        {
          version: "v1.0.0",
          date: new Date().toISOString().split("T")[0],
          changes: "Initial exported template package release",
        },
      ],
    },
  };

  const jsonStr = JSON.stringify(packageData, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${template.name.toLowerCase().replace(/[^a-z0-9]+/g, "_")}_template_package.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Import Template Package from JSON string or file.
 */
export function importTemplatePackageJson(jsonStr: string): ExtendedTemplateMeta {
  const parsed = JSON.parse(jsonStr);
  if (!parsed.template || !parsed.template.name || !parsed.template.state) {
    throw new Error("Invalid template package format. Missing required design state or metadata.");
  }

  const rawTmpl = parsed.template;
  const importedTemplate: ExtendedTemplateMeta = {
    ...rawTmpl,
    id: `tmpl-imported-${Date.now()}`,
    name: `${rawTmpl.name} (Imported)`,
    updatedAt: new Date().toISOString().split("T")[0],
    usesCount: 1,
  };

  return importedTemplate;
}

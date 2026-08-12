import {
  DesignState,
  CanvasElement,
  DesignBackground,
  SmartCompositionStyle,
  ElementSubjectShadowConfig,
  ElementSubjectGlowConfig,
  ElementGradientBorderConfig,
} from "../types/designer";

export interface SmartCompositionOptions {
  imageUrl: string;
  imageName?: string;
  style: SmartCompositionStyle;
  canvasWidth?: number;
  canvasHeight?: number;
  variantSeed?: number;
}

export const SMART_STYLE_DEFINITIONS: {
  id: SmartCompositionStyle;
  name: string;
  tagline: string;
  badge: string;
  colorScheme: string;
}[] = [
  {
    id: "01_studio_showcase",
    name: "01. Studio Showcase",
    tagline: "Large centered subject with smooth gradient, soft floor shadow, subtle glow & border.",
    badge: "STUDIO SHOWCASE",
    colorScheme: "#0f172a",
  },
  {
    id: "02_cyberpunk",
    name: "02. Cyberpunk",
    tagline: "Dark cyber background with neon cyan/purple glow, grid pattern, and HUD elements.",
    badge: "CYBERPUNK // DROP",
    colorScheme: "#00f5ff",
  },
  {
    id: "03_glossy_product",
    name: "03. Glossy Product",
    tagline: "Glossy backdrop, soft studio reflection shadow, glass frame, and luxury typography.",
    badge: "PREMIUM PRODUCT",
    colorScheme: "#f43f5e",
  },
  {
    id: "04_gaming_character",
    name: "04. Gaming Character",
    tagline: "Dramatic radial background, character centered, atmospheric subject glow, and gaming badge.",
    badge: "LEGENDARY HERO",
    colorScheme: "#a855f7",
  },
  {
    id: "05_roblox_showcase",
    name: "05. Roblox Showcase",
    tagline: "Designed specifically for Roblox characters & assets with vibrant gaming backdrop & pedestal.",
    badge: "ROBLOX SHOWCASE",
    colorScheme: "#38bdf8",
  },
  {
    id: "06_portfolio_showcase",
    name: "06. Portfolio Showcase",
    tagline: "Large subject, project title, category pill badge, and clean studio metadata.",
    badge: "PORTFOLIO FEATURE",
    colorScheme: "#10b981",
  },
  {
    id: "07_minimal",
    name: "07. Minimal",
    tagline: "Clean neutral background, subtle drop shadow, thin border, and elegant typography.",
    badge: "EDITORIAL MINIMAL",
    colorScheme: "#f4f4f5",
  },
  {
    id: "08_glass_ui",
    name: "08. Glass UI",
    tagline: "Translucent glass panels, backdrop blur, soft cyan/pink ambient glow, and glass border.",
    badge: "GLASSMORPHISM",
    colorScheme: "#ec4899",
  },
  {
    id: "09_neon_frame",
    name: "09. Neon Frame",
    tagline: "Dark background, glowing gradient frame, subject glow, and futuristic title.",
    badge: "NEON FRAME",
    colorScheme: "#f59e0b",
  },
  {
    id: "10_editorial",
    name: "10. Editorial",
    tagline: "Asymmetric magazine layout, Playfair display title, overlapping layers, and credits.",
    badge: "EDITORIAL NO. 01",
    colorScheme: "#e2e8f0",
  },
];

export function generateSmartCompositionState(
  currentState: DesignState,
  options: SmartCompositionOptions
): DesignState {
  const width = options.canvasWidth || currentState.width || 1200;
  const height = options.canvasHeight || currentState.height || 630;
  const seed = options.variantSeed || Date.now();

  let bg: DesignBackground = {
    type: "solid",
    solidColor: "#090d16",
    brightness: 100,
    contrast: 100,
    blur: 0,
  };

  const elements: CanvasElement[] = [];

  // Helper ID builder
  const makeId = (prefix: string) => `el-${prefix}-${seed}-${Math.floor(Math.random() * 1000)}`;

  // Default subject image shadow & glow setups
  let subjectShadow: ElementSubjectShadowConfig = {
    enabled: true,
    preset: "soft",
    color: "rgba(0, 0, 0, 0.5)",
    opacity: 0.6,
    blur: 25,
    distance: 15,
    angle: 90,
    spread: 5,
  };

  let subjectGlow: ElementSubjectGlowConfig = {
    enabled: true,
    color: "#00f5ff",
    intensity: 60,
    spread: 12,
    blur: 35,
    opacity: 0.7,
  };

  let gradientBorder: ElementGradientBorderConfig = {
    enabled: true,
    color1: "#00f5ff",
    color2: "#a855f7",
    angle: 135,
    width: 2,
    opacity: 0.8,
    glow: true,
    style: "solid",
  };

  switch (options.style) {
    case "01_studio_showcase": {
      bg = {
        type: "radial",
        solidColor: "#0b0f19",
        gradientFrom: "#1e293b",
        gradientTo: "#020617",
        radialShape: "ellipse",
        radialPosition: "center",
        brightness: 105,
        contrast: 110,
        blur: 0,
      };

      subjectShadow = {
        enabled: true,
        preset: "ground",
        color: "rgba(0, 0, 0, 0.75)",
        opacity: 0.8,
        blur: 30,
        distance: 20,
        angle: 90,
        spread: 10,
      };

      subjectGlow = {
        enabled: true,
        color: "#38bdf8",
        intensity: 45,
        spread: 10,
        blur: 30,
        opacity: 0.5,
      };

      // Outer Frame
      elements.push({
        id: makeId("frame"),
        name: "Studio Frame Border",
        type: "shape",
        visible: true,
        locked: true,
        x: 3,
        y: 4,
        width: 94,
        height: 92,
        bg: "transparent",
        borderColor: "rgba(255, 255, 255, 0.15)",
        borderWidth: 1.5,
        borderRadius: 20,
        shapeType: "rect",
        zIndex: 1,
      });

      // Top Category Badge
      elements.push({
        id: makeId("badge"),
        name: "Category Badge",
        type: "badge",
        visible: true,
        locked: false,
        x: 6,
        y: 8,
        width: 22,
        height: 6,
        text: "STUDIO SHOWCASE",
        fontSize: 12,
        fontFamily: "Space Mono",
        textColor: "#38bdf8",
        bg: "rgba(56, 189, 248, 0.15)",
        borderColor: "rgba(56, 189, 248, 0.4)",
        borderRadius: 12,
        zIndex: 10,
      });

      // Top Right Studio Branding
      elements.push({
        id: makeId("brand"),
        name: "Lizzdo Studio Branding",
        type: "text",
        visible: true,
        locked: false,
        x: 72,
        y: 8,
        width: 22,
        height: 5,
        text: "LIZZDO STUDIO PRO",
        fontSize: 11,
        fontFamily: "Space Mono",
        color: "rgba(255, 255, 255, 0.6)",
        textAlign: "right",
        zIndex: 10,
      });

      // Main Uploaded Subject Image
      elements.push({
        id: makeId("subject"),
        name: options.imageName || "Main Subject Image",
        type: "image",
        visible: true,
        locked: false,
        x: 20,
        y: 16,
        width: 60,
        height: 68,
        url: options.imageUrl,
        src: options.imageUrl,
        fitMode: "contain",
        boundsMode: "visible",
        opacity: 1,
        zIndex: 5,
        subjectShadow,
        subjectGlow,
        shaderPreset: "soft_light",
      });

      // Bottom Title Text
      elements.push({
        id: makeId("title"),
        name: "Composition Headline",
        type: "text",
        visible: true,
        locked: false,
        x: 10,
        y: 86,
        width: 80,
        height: 8,
        text: "PREMIUM STUDIO VISUAL",
        fontSize: 28,
        fontFamily: "Orbitron",
        fontWeight: "bold",
        color: "#ffffff",
        textAlign: "center",
        zIndex: 10,
      });
      break;
    }

    case "02_cyberpunk": {
      bg = {
        type: "mesh",
        solidColor: "#05050e",
        gradientFrom: "#00f5ff",
        gradientTo: "#a855f7",
        meshColor1: "#00f5ff",
        meshColor2: "#7c3aed",
        meshColor3: "#050b18",
        meshColor4: "#020617",
        pattern: "grid",
        patternColor: "rgba(0, 245, 255, 0.25)",
        patternOpacity: 0.2,
        brightness: 110,
        contrast: 115,
        blur: 0,
      };

      subjectShadow = {
        enabled: true,
        preset: "neon",
        color: "rgba(0, 245, 255, 0.6)",
        opacity: 0.85,
        blur: 35,
        distance: 10,
        angle: 45,
        spread: 12,
      };

      subjectGlow = {
        enabled: true,
        color: "#00f5ff",
        intensity: 85,
        spread: 18,
        blur: 40,
        opacity: 0.9,
      };

      gradientBorder = {
        enabled: true,
        color1: "#00f5ff",
        color2: "#a855f7",
        color3: "#f43f5e",
        angle: 135,
        width: 2,
        opacity: 1,
        glow: true,
        style: "neon",
      };

      // Cyber Frame
      elements.push({
        id: makeId("cyber-frame"),
        name: "Cyber HUD Frame",
        type: "shape",
        visible: true,
        locked: true,
        x: 3,
        y: 4,
        width: 94,
        height: 92,
        bg: "rgba(2, 6, 23, 0.4)",
        borderColor: "#00f5ff",
        borderWidth: 2,
        borderRadius: 16,
        shapeType: "rect",
        zIndex: 1,
      });

      // HUD Badge
      elements.push({
        id: makeId("hud-badge"),
        name: "Cyber Badge",
        type: "badge",
        visible: true,
        locked: false,
        x: 6,
        y: 8,
        width: 24,
        height: 6,
        text: "CYBERPUNK // DROP 2026",
        fontSize: 11,
        fontFamily: "Orbitron",
        textColor: "#00f5ff",
        bg: "rgba(0, 245, 255, 0.15)",
        borderColor: "#00f5ff",
        borderRadius: 8,
        zIndex: 10,
      });

      // Top Right Lizzdo Cyber Tag
      elements.push({
        id: makeId("cyber-brand"),
        name: "Cyber Tag",
        type: "text",
        visible: true,
        locked: false,
        x: 68,
        y: 8,
        width: 26,
        height: 5,
        text: "LIZZDO // SYSTEM READY",
        fontSize: 11,
        fontFamily: "Space Mono",
        color: "#a855f7",
        textAlign: "right",
        zIndex: 10,
      });

      // Main Uploaded Subject Image
      elements.push({
        id: makeId("subject"),
        name: options.imageName || "Cyber Subject Image",
        type: "image",
        visible: true,
        locked: false,
        x: 18,
        y: 16,
        width: 64,
        height: 68,
        url: options.imageUrl,
        src: options.imageUrl,
        fitMode: "contain",
        boundsMode: "visible",
        opacity: 1,
        zIndex: 5,
        subjectShadow,
        subjectGlow,
        gradientBorder,
        shaderPreset: "neon_light",
      });

      // Cyber Title
      elements.push({
        id: makeId("title"),
        name: "Cyber Title Text",
        type: "text",
        visible: true,
        locked: false,
        x: 10,
        y: 85,
        width: 80,
        height: 9,
        text: "FUTURE CYBER EDITION",
        fontSize: 32,
        fontFamily: "Orbitron",
        fontWeight: "bold",
        color: "#00f5ff",
        textAlign: "center",
        gradientText: true,
        zIndex: 10,
      });
      break;
    }

    case "03_glossy_product": {
      bg = {
        type: "gradient",
        solidColor: "#0d0208",
        gradientFrom: "#1f0914",
        gradientTo: "#050104",
        gradientDirection: "to-b",
        brightness: 100,
        contrast: 105,
        blur: 0,
      };

      subjectShadow = {
        enabled: true,
        preset: "floating",
        color: "rgba(244, 63, 94, 0.4)",
        opacity: 0.7,
        blur: 30,
        distance: 18,
        angle: 90,
        spread: 8,
      };

      subjectGlow = {
        enabled: true,
        color: "#f43f5e",
        intensity: 50,
        spread: 12,
        blur: 30,
        opacity: 0.6,
      };

      // Glossy Glass Card Base
      elements.push({
        id: makeId("glass-card"),
        name: "Glossy Base Card",
        type: "shape",
        visible: true,
        locked: true,
        x: 5,
        y: 5,
        width: 90,
        height: 90,
        bg: "rgba(255, 255, 255, 0.04)",
        borderColor: "rgba(244, 63, 94, 0.3)",
        borderWidth: 1.5,
        borderRadius: 24,
        shapeType: "glow-card",
        zIndex: 1,
      });

      // Product Badge
      elements.push({
        id: makeId("prod-badge"),
        name: "Product Badge",
        type: "badge",
        visible: true,
        locked: false,
        x: 10,
        y: 10,
        width: 22,
        height: 6,
        text: "PREMIUM SELECTION",
        fontSize: 11,
        fontFamily: "Space Mono",
        textColor: "#ffffff",
        bg: "#f43f5e",
        borderRadius: 12,
        zIndex: 10,
      });

      // Main Subject
      elements.push({
        id: makeId("subject"),
        name: options.imageName || "Glossy Product Image",
        type: "image",
        visible: true,
        locked: false,
        x: 22,
        y: 18,
        width: 56,
        height: 64,
        url: options.imageUrl,
        src: options.imageUrl,
        fitMode: "contain",
        boundsMode: "visible",
        opacity: 1,
        zIndex: 5,
        subjectShadow,
        subjectGlow,
        shaderPreset: "glass",
      });

      // Product Title
      elements.push({
        id: makeId("title"),
        name: "Product Title",
        type: "text",
        visible: true,
        locked: false,
        x: 10,
        y: 84,
        width: 80,
        height: 8,
        text: "LUXURY EDITION SHOWCASE",
        fontSize: 26,
        fontFamily: "Playfair Display",
        fontWeight: "bold",
        color: "#ffffff",
        textAlign: "center",
        zIndex: 10,
      });
      break;
    }

    case "04_gaming_character": {
      bg = {
        type: "radial",
        solidColor: "#0f051d",
        gradientFrom: "#581c87",
        gradientTo: "#030008",
        radialShape: "circle",
        radialPosition: "center",
        pattern: "circuit",
        patternColor: "rgba(168, 85, 247, 0.2)",
        patternOpacity: 0.25,
        brightness: 110,
        contrast: 110,
        blur: 0,
      };

      subjectShadow = {
        enabled: true,
        preset: "cinematic",
        color: "rgba(0, 0, 0, 0.8)",
        opacity: 0.85,
        blur: 35,
        distance: 25,
        angle: 90,
        spread: 12,
      };

      subjectGlow = {
        enabled: true,
        color: "#c084fc",
        intensity: 80,
        spread: 16,
        blur: 40,
        opacity: 0.85,
      };

      // Character Badge
      elements.push({
        id: makeId("hero-badge"),
        name: "Character Badge",
        type: "badge",
        visible: true,
        locked: false,
        x: 6,
        y: 8,
        width: 22,
        height: 6,
        text: "LEGENDARY AVATAR",
        fontSize: 11,
        fontFamily: "Rajdhani",
        textColor: "#c084fc",
        bg: "rgba(192, 132, 252, 0.2)",
        borderColor: "#c084fc",
        borderRadius: 10,
        zIndex: 10,
      });

      // Main Hero Character Image
      elements.push({
        id: makeId("subject"),
        name: options.imageName || "Gaming Character Image",
        type: "image",
        visible: true,
        locked: false,
        x: 15,
        y: 12,
        width: 70,
        height: 74,
        url: options.imageUrl,
        src: options.imageUrl,
        fitMode: "contain",
        boundsMode: "visible",
        opacity: 1,
        zIndex: 5,
        subjectShadow,
        subjectGlow,
        shaderPreset: "rim_light",
      });

      // Title
      elements.push({
        id: makeId("title"),
        name: "Gaming Title",
        type: "text",
        visible: true,
        locked: false,
        x: 10,
        y: 87,
        width: 80,
        height: 8,
        text: "CHAMPION SHOWCASE",
        fontSize: 30,
        fontFamily: "Orbitron",
        fontWeight: "bold",
        color: "#c084fc",
        textAlign: "center",
        zIndex: 10,
      });
      break;
    }

    case "05_roblox_showcase": {
      bg = {
        type: "mesh",
        solidColor: "#021329",
        gradientFrom: "#0284c7",
        gradientTo: "#0f172a",
        meshColor1: "#38bdf8",
        meshColor2: "#0284c7",
        meshColor3: "#0369a1",
        meshColor4: "#0f172a",
        pattern: "dots",
        patternColor: "rgba(56, 189, 248, 0.3)",
        patternOpacity: 0.3,
        brightness: 110,
        contrast: 105,
        blur: 0,
      };

      subjectShadow = {
        enabled: true,
        preset: "ground",
        color: "rgba(2, 132, 199, 0.6)",
        opacity: 0.8,
        blur: 25,
        distance: 12,
        angle: 90,
        spread: 10,
      };

      subjectGlow = {
        enabled: true,
        color: "#38bdf8",
        intensity: 75,
        spread: 15,
        blur: 35,
        opacity: 0.8,
      };

      // Roblox Pedestal / Glossy Base
      elements.push({
        id: makeId("pedestal"),
        name: "Character Pedestal Base",
        type: "shape",
        visible: true,
        locked: true,
        x: 25,
        y: 72,
        width: 50,
        height: 12,
        bg: "rgba(56, 189, 248, 0.2)",
        borderColor: "#38bdf8",
        borderWidth: 2,
        borderRadius: 50,
        shapeType: "ellipse",
        zIndex: 2,
      });

      // Roblox Tag Badge
      elements.push({
        id: makeId("rblx-badge"),
        name: "Roblox Badge",
        type: "badge",
        visible: true,
        locked: false,
        x: 6,
        y: 8,
        width: 24,
        height: 6,
        text: "ROBLOX AVATAR // PRO",
        fontSize: 11,
        fontFamily: "Orbitron",
        textColor: "#000000",
        bg: "#38bdf8",
        borderRadius: 10,
        zIndex: 10,
      });

      // Roblox Main Character
      elements.push({
        id: makeId("subject"),
        name: options.imageName || "Roblox Character Image",
        type: "image",
        visible: true,
        locked: false,
        x: 20,
        y: 12,
        width: 60,
        height: 68,
        url: options.imageUrl,
        src: options.imageUrl,
        fitMode: "contain",
        boundsMode: "visible",
        opacity: 1,
        zIndex: 5,
        subjectShadow,
        subjectGlow,
        shaderPreset: "bloom",
      });

      // Title
      elements.push({
        id: makeId("title"),
        name: "Roblox Title",
        type: "text",
        visible: true,
        locked: false,
        x: 10,
        y: 86,
        width: 80,
        height: 8,
        text: "AVATAR SPOTLIGHT",
        fontSize: 28,
        fontFamily: "Orbitron",
        fontWeight: "bold",
        color: "#ffffff",
        textAlign: "center",
        zIndex: 10,
      });
      break;
    }

    case "06_portfolio_showcase": {
      bg = {
        type: "solid",
        solidColor: "#111827",
        brightness: 100,
        contrast: 100,
        blur: 0,
      };

      subjectShadow = {
        enabled: true,
        preset: "soft",
        color: "rgba(0, 0, 0, 0.6)",
        opacity: 0.65,
        blur: 20,
        distance: 10,
        angle: 90,
        spread: 4,
      };

      // Header Pill
      elements.push({
        id: makeId("port-badge"),
        name: "Portfolio Category Pill",
        type: "badge",
        visible: true,
        locked: false,
        x: 6,
        y: 8,
        width: 20,
        height: 6,
        text: "DESIGN PORTFOLIO",
        fontSize: 11,
        fontFamily: "Space Mono",
        textColor: "#10b981",
        bg: "rgba(16, 185, 129, 0.15)",
        borderColor: "rgba(16, 185, 129, 0.4)",
        borderRadius: 10,
        zIndex: 10,
      });

      // Main Image Frame
      elements.push({
        id: makeId("subject"),
        name: options.imageName || "Portfolio Work Image",
        type: "image",
        visible: true,
        locked: false,
        x: 6,
        y: 18,
        width: 58,
        height: 72,
        url: options.imageUrl,
        src: options.imageUrl,
        fitMode: "cover",
        borderRadius: 16,
        borderColor: "rgba(255, 255, 255, 0.15)",
        borderWidth: 1,
        opacity: 1,
        zIndex: 5,
        subjectShadow,
      });

      // Right Text Details Block
      elements.push({
        id: makeId("port-title"),
        name: "Project Title",
        type: "text",
        visible: true,
        locked: false,
        x: 68,
        y: 24,
        width: 28,
        height: 12,
        text: "PROJECT SHOWCASE",
        fontSize: 26,
        fontFamily: "Plus Jakarta Sans",
        fontWeight: "bold",
        color: "#ffffff",
        zIndex: 10,
      });

      elements.push({
        id: makeId("port-desc"),
        name: "Project Description",
        type: "text",
        visible: true,
        locked: false,
        x: 68,
        y: 40,
        width: 28,
        height: 20,
        text: "High-impact visual composition created with Lizzdo Studio professional design engine.",
        fontSize: 13,
        fontFamily: "Plus Jakarta Sans",
        color: "#9ca3af",
        zIndex: 10,
      });

      elements.push({
        id: makeId("port-btn"),
        name: "View Case Study CTA",
        type: "button",
        visible: true,
        locked: false,
        x: 68,
        y: 65,
        width: 24,
        height: 8,
        text: "VIEW DETAILS →",
        fontSize: 12,
        fontFamily: "Space Mono",
        color: "#000000",
        bg: "#10b981",
        borderRadius: 12,
        zIndex: 10,
      });
      break;
    }

    case "07_minimal": {
      bg = {
        type: "solid",
        solidColor: "#18181b",
        brightness: 100,
        contrast: 100,
        blur: 0,
      };

      subjectShadow = {
        enabled: true,
        preset: "soft",
        color: "rgba(0, 0, 0, 0.4)",
        opacity: 0.5,
        blur: 15,
        distance: 8,
        angle: 90,
        spread: 2,
      };

      // Thin Hairline Border
      elements.push({
        id: makeId("min-border"),
        name: "Minimal Border",
        type: "shape",
        visible: true,
        locked: true,
        x: 4,
        y: 4,
        width: 92,
        height: 92,
        bg: "transparent",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        borderRadius: 12,
        shapeType: "rect",
        zIndex: 1,
      });

      // Main Subject Image
      elements.push({
        id: makeId("subject"),
        name: options.imageName || "Minimal Subject Image",
        type: "image",
        visible: true,
        locked: false,
        x: 25,
        y: 15,
        width: 50,
        height: 62,
        url: options.imageUrl,
        src: options.imageUrl,
        fitMode: "contain",
        boundsMode: "visible",
        opacity: 1,
        zIndex: 5,
        subjectShadow,
      });

      // Minimal Typography
      elements.push({
        id: makeId("title"),
        name: "Minimal Headline",
        type: "text",
        visible: true,
        locked: false,
        x: 10,
        y: 84,
        width: 80,
        height: 6,
        text: "MINIMALIST ARTWORK",
        fontSize: 20,
        fontFamily: "Space Mono",
        color: "#f4f4f5",
        textAlign: "center",
        zIndex: 10,
      });
      break;
    }

    case "08_glass_ui": {
      bg = {
        type: "mesh",
        solidColor: "#09090b",
        gradientFrom: "#ec4899",
        gradientTo: "#3b82f6",
        meshColor1: "#ec4899",
        meshColor2: "#8b5cf6",
        meshColor3: "#3b82f6",
        meshColor4: "#09090b",
        brightness: 105,
        contrast: 105,
        blur: 0,
      };

      subjectShadow = {
        enabled: true,
        preset: "floating",
        color: "rgba(236, 72, 153, 0.5)",
        opacity: 0.7,
        blur: 30,
        distance: 15,
        angle: 90,
        spread: 6,
      };

      subjectGlow = {
        enabled: true,
        color: "#ec4899",
        intensity: 65,
        spread: 14,
        blur: 35,
        opacity: 0.75,
      };

      // Glass Panel Behind Subject
      elements.push({
        id: makeId("glass-panel"),
        name: "Glassmorphism Backdrop Panel",
        type: "shape",
        visible: true,
        locked: true,
        x: 8,
        y: 8,
        width: 84,
        height: 84,
        bg: "rgba(255, 255, 255, 0.06)",
        borderColor: "rgba(255, 255, 255, 0.2)",
        borderWidth: 1.5,
        borderRadius: 24,
        shapeType: "glow-card",
        backdropBlur: 15,
        zIndex: 1,
      });

      // Glass Badge
      elements.push({
        id: makeId("glass-badge"),
        name: "Glass Badge",
        type: "badge",
        visible: true,
        locked: false,
        x: 12,
        y: 12,
        width: 22,
        height: 6,
        text: "GLASS UI EDITION",
        fontSize: 11,
        fontFamily: "Space Mono",
        textColor: "#ec4899",
        bg: "rgba(236, 72, 153, 0.15)",
        borderColor: "rgba(236, 72, 153, 0.4)",
        borderRadius: 12,
        zIndex: 10,
      });

      // Main Subject Image
      elements.push({
        id: makeId("subject"),
        name: options.imageName || "Glass UI Image",
        type: "image",
        visible: true,
        locked: false,
        x: 20,
        y: 18,
        width: 60,
        height: 62,
        url: options.imageUrl,
        src: options.imageUrl,
        fitMode: "contain",
        boundsMode: "visible",
        opacity: 1,
        zIndex: 5,
        subjectShadow,
        subjectGlow,
        shaderPreset: "glass",
      });

      // Glass Title
      elements.push({
        id: makeId("title"),
        name: "Glass Title",
        type: "text",
        visible: true,
        locked: false,
        x: 10,
        y: 84,
        width: 80,
        height: 8,
        text: "TRANSLUCENT COMPOSITION",
        fontSize: 24,
        fontFamily: "Orbitron",
        fontWeight: "bold",
        color: "#ffffff",
        textAlign: "center",
        zIndex: 10,
      });
      break;
    }

    case "09_neon_frame": {
      bg = {
        type: "radial",
        solidColor: "#0a0a02",
        gradientFrom: "#f59e0b",
        gradientTo: "#050501",
        radialShape: "circle",
        radialPosition: "center",
        brightness: 110,
        contrast: 110,
        blur: 0,
      };

      subjectShadow = {
        enabled: true,
        preset: "neon",
        color: "rgba(245, 158, 11, 0.7)",
        opacity: 0.8,
        blur: 30,
        distance: 12,
        angle: 45,
        spread: 10,
      };

      subjectGlow = {
        enabled: true,
        color: "#f59e0b",
        intensity: 80,
        spread: 16,
        blur: 35,
        opacity: 0.85,
      };

      gradientBorder = {
        enabled: true,
        color1: "#f59e0b",
        color2: "#ef4444",
        angle: 90,
        width: 3,
        opacity: 1,
        glow: true,
        style: "neon",
      };

      // Neon Frame
      elements.push({
        id: makeId("neon-border"),
        name: "Neon Frame Border",
        type: "shape",
        visible: true,
        locked: true,
        x: 5,
        y: 5,
        width: 90,
        height: 90,
        bg: "rgba(0, 0, 0, 0.6)",
        borderColor: "#f59e0b",
        borderWidth: 2.5,
        borderRadius: 20,
        shapeType: "rect",
        zIndex: 1,
      });

      // Neon Badge
      elements.push({
        id: makeId("neon-badge"),
        name: "Neon Badge",
        type: "badge",
        visible: true,
        locked: false,
        x: 8,
        y: 9,
        width: 22,
        height: 6,
        text: "NEON GLOW FRAME",
        fontSize: 11,
        fontFamily: "Orbitron",
        textColor: "#f59e0b",
        bg: "rgba(245, 158, 11, 0.2)",
        borderColor: "#f59e0b",
        borderRadius: 10,
        zIndex: 10,
      });

      // Main Subject
      elements.push({
        id: makeId("subject"),
        name: options.imageName || "Neon Subject Image",
        type: "image",
        visible: true,
        locked: false,
        x: 18,
        y: 16,
        width: 64,
        height: 66,
        url: options.imageUrl,
        src: options.imageUrl,
        fitMode: "contain",
        boundsMode: "visible",
        opacity: 1,
        zIndex: 5,
        subjectShadow,
        subjectGlow,
        gradientBorder,
        shaderPreset: "neon_light",
      });

      // Neon Title
      elements.push({
        id: makeId("title"),
        name: "Neon Title",
        type: "text",
        visible: true,
        locked: false,
        x: 10,
        y: 85,
        width: 80,
        height: 8,
        text: "AMERICANA NEON EDITION",
        fontSize: 28,
        fontFamily: "Orbitron",
        fontWeight: "bold",
        color: "#f59e0b",
        textAlign: "center",
        zIndex: 10,
      });
      break;
    }

    case "10_editorial": {
      bg = {
        type: "solid",
        solidColor: "#0f172a",
        brightness: 100,
        contrast: 100,
        blur: 0,
      };

      subjectShadow = {
        enabled: true,
        preset: "cinematic",
        color: "rgba(0, 0, 0, 0.7)",
        opacity: 0.75,
        blur: 25,
        distance: 15,
        angle: 90,
        spread: 5,
      };

      // Editorial Header Title
      elements.push({
        id: makeId("ed-head"),
        name: "Editorial Header Text",
        type: "text",
        visible: true,
        locked: false,
        x: 6,
        y: 6,
        width: 88,
        height: 10,
        text: "CHRONICLES // ISSUE NO. 12",
        fontSize: 36,
        fontFamily: "Playfair Display",
        fontWeight: "bold",
        color: "#ffffff",
        zIndex: 10,
      });

      // Main Asymmetric Image Frame
      elements.push({
        id: makeId("subject"),
        name: options.imageName || "Editorial Feature Image",
        type: "image",
        visible: true,
        locked: false,
        x: 6,
        y: 18,
        width: 60,
        height: 72,
        url: options.imageUrl,
        src: options.imageUrl,
        fitMode: "cover",
        borderRadius: 20,
        borderColor: "rgba(255, 255, 255, 0.2)",
        borderWidth: 1,
        opacity: 1,
        zIndex: 5,
        subjectShadow,
      });

      // Side Detail Text
      elements.push({
        id: makeId("ed-desc"),
        name: "Editorial Description",
        type: "text",
        visible: true,
        locked: false,
        x: 70,
        y: 22,
        width: 26,
        height: 35,
        text: "A study in visual composition, high-contrast imagery, and dynamic spatial placement built inside Lizzdo Studio.",
        fontSize: 14,
        fontFamily: "Plus Jakarta Sans",
        color: "#cbd5e1",
        zIndex: 10,
      });

      // Studio Footer Credits
      elements.push({
        id: makeId("ed-footer"),
        name: "Editorial Footer",
        type: "text",
        visible: true,
        locked: false,
        x: 70,
        y: 80,
        width: 26,
        height: 8,
        text: "STUDIO EDITORIAL 2026",
        fontSize: 11,
        fontFamily: "Space Mono",
        color: "#64748b",
        zIndex: 10,
      });
      break;
    }
  }

  return {
    ...currentState,
    width,
    height,
    background: bg,
    elements: [...currentState.elements, ...elements],
  };
}

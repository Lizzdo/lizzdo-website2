// Color space conversions and WCAG contrast tools

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export interface CMYK {
  c: number;
  m: number;
  y: number;
  k: number;
}

export function hexToRgb(hex: string): RGB {
  let cleaned = hex.replace("#", "");
  if (cleaned.length === 3) {
    cleaned = cleaned
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const num = parseInt(cleaned, 16) || 0;
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return (
    "#" +
    [clamp(r), clamp(g), clamp(b)]
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("")
  );
}

export function hexToHsl(hex: string): HSL {
  const { r, g, b } = hexToRgb(hex);
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / d + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function hexToCmyk(hex: string): CMYK {
  const { r, g, b } = hexToRgb(hex);
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const k = 1 - Math.max(rNorm, gNorm, bNorm);
  if (k === 1) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }

  const c = (1 - rNorm - k) / (1 - k);
  const m = (1 - gNorm - k) / (1 - k);
  const y = (1 - bNorm - k) / (1 - k);

  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100),
  };
}

// WCAG Luminance & Contrast Ratio Calculation
export function getRelativeLuminance({ r, g, b }: RGB): number {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getRelativeLuminance(hexToRgb(hex1));
  const lum2 = getRelativeLuminance(hexToRgb(hex2));
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  const ratio = (brightest + 0.05) / (darkest + 0.05);
  return Number(ratio.toFixed(2));
}

export interface WcagRating {
  ratio: number;
  passesAA: boolean;
  passesAAA: boolean;
  passesAALarge: boolean;
  levelText: string;
}

export function checkWcagContrast(textHex: string, bgHex: string): WcagRating {
  const ratio = getContrastRatio(textHex, bgHex);
  const passesAA = ratio >= 4.5;
  const passesAALarge = ratio >= 3.0;
  const passesAAA = ratio >= 7.0;

  let levelText = "Fail (Poor)";
  if (passesAAA) levelText = "AAA (Excellent)";
  else if (passesAA) levelText = "AA (Pass)";
  else if (passesAALarge) levelText = "AA Large Text Only";

  return { ratio, passesAA, passesAAA, passesAALarge, levelText };
}

// AI COLOR SUGGESTION GENERATOR (Heuristic + Keyword mapping)
export function generateAiPaletteSuggestion(brandName: string, description: string): {
  name: string;
  colors: string[];
}[] {
  const descLower = (brandName + " " + description).toLowerCase();

  if (descLower.includes("cyber") || descLower.includes("tech") || descLower.includes("future") || descLower.includes("game")) {
    return [
      { name: "Neon Cyber Grid", colors: ["#00f5ff", "#a855f7", "#f43f5e", "#0a0e1a", "#ffffff"] },
      { name: "Quantum Matrix", colors: ["#10b981", "#06b6d4", "#3b82f6", "#020617", "#f8fafc"] },
      { name: "Laser Synthwave", colors: ["#ff007f", "#7928ca", "#00dfd8", "#111827", "#f3f4f6"] },
    ];
  }

  if (descLower.includes("lux") || descLower.includes("gold") || descLower.includes("fash") || descLower.includes("eleg")) {
    return [
      { name: "Royal Gold & Velvet", colors: ["#d97706", "#b45309", "#18181b", "#27272a", "#fef3c7"] },
      { name: "Champagne Pearl", colors: ["#eab308", "#ca8a04", "#09090b", "#1c1917", "#fffbeb"] },
      { name: "Emerald Luxe", colors: ["#059669", "#047857", "#111827", "#1f2937", "#ecfdf5"] },
    ];
  }

  if (descLower.includes("health") || descLower.includes("eco") || descLower.includes("green") || descLower.includes("nature")) {
    return [
      { name: "Botanical Forest", colors: ["#16a34a", "#15803d", "#022c22", "#064e3b", "#f0fdf4"] },
      { name: "Oceanic Breeze", colors: ["#0284c7", "#0369a1", "#0c4a6e", "#0f172a", "#f0f9ff"] },
    ];
  }

  // Default SaaS Modern
  return [
    { name: "SaaS Enterprise Sapphire", colors: ["#2563eb", "#7c3aed", "#06b6d4", "#0f172a", "#f8fafc"] },
    { name: "Modern Sunset Gradient", colors: ["#f97316", "#ec4899", "#8b5cf6", "#18181b", "#ffffff"] },
    { name: "Monochrome Minimal", colors: ["#09090b", "#27272a", "#71717a", "#e4e4e7", "#ffffff"] },
  ];
}

// Safe Google Fonts & Web Fonts Loader Engine for Preview & Canvas Export

export interface FontOption {
  family: string;
  category: "sans-serif" | "serif" | "display" | "monospace" | "handwriting";
  weights: number[];
  googleFontName?: string;
}

export const AVAILABLE_FONTS: FontOption[] = [
  // Cyber / Display / Tech
  { family: "Orbitron", category: "display", weights: [400, 500, 600, 700, 800, 900], googleFontName: "Orbitron:wght@400;500;600;700;800;900" },
  { family: "Rajdhani", category: "display", weights: [300, 400, 500, 600, 700], googleFontName: "Rajdhani:wght@300;400;500;600;700" },
  { family: "Space Grotesk", category: "sans-serif", weights: [300, 400, 500, 600, 700], googleFontName: "Space+Grotesk:wght@300;400;500;600;700" },
  { family: "Audiowide", category: "display", weights: [400], googleFontName: "Audiowide" },
  { family: "Syne", category: "display", weights: [400, 600, 700, 800], googleFontName: "Syne:wght@400;600;700;800" },
  { family: "Righteous", category: "display", weights: [400], googleFontName: "Righteous" },
  
  // Headlines & Display
  { family: "Bebas Neue", category: "display", weights: [400], googleFontName: "Bebas+Neue" },
  { family: "Oswald", category: "sans-serif", weights: [200, 300, 400, 500, 600, 700], googleFontName: "Oswald:wght@200;300;400;500;600;700" },
  { family: "Anton", category: "display", weights: [400], googleFontName: "Anton" },
  { family: "Montserrat", category: "sans-serif", weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], googleFontName: "Montserrat:wght@100;200;300;400;500;600;700;800;900" },
  
  // Sans-Serif
  { family: "Inter", category: "sans-serif", weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], googleFontName: "Inter:wght@100;200;300;400;500;600;700;800;900" },
  { family: "Roboto", category: "sans-serif", weights: [100, 300, 400, 500, 700, 900], googleFontName: "Roboto:wght@100;300;400;500;700;900" },
  { family: "Poppins", category: "sans-serif", weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], googleFontName: "Poppins:wght@100;200;300;400;500;600;700;800;900" },
  { family: "Plus Jakarta Sans", category: "sans-serif", weights: [200, 300, 400, 500, 600, 700, 800], googleFontName: "Plus+Jakarta+Sans:wght@200;300;400;500;600;700;800" },
  { family: "Work Sans", category: "sans-serif", weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], googleFontName: "Work+Sans:wght@100;200;300;400;500;600;700;800;900" },
  
  // Serif & Luxury
  { family: "Playfair Display", category: "serif", weights: [400, 500, 600, 700, 800, 900], googleFontName: "Playfair+Display:wght@400;500;600;700;800;900" },
  { family: "Cinzel", category: "serif", weights: [400, 500, 600, 700, 800, 900], googleFontName: "Cinzel:wght@400;500;600;700;800;900" },
  { family: "Merriweather", category: "serif", weights: [300, 400, 700, 900], googleFontName: "Merriweather:wght@300;400;700;900" },
  { family: "Lora", category: "serif", weights: [400, 500, 600, 700], googleFontName: "Lora:wght@400;500;600;700" },
  
  // Monospace & Code
  { family: "Fira Code", category: "monospace", weights: [300, 400, 500, 600, 700], googleFontName: "Fira+Code:wght@300;400;500;600;700" },
  { family: "Space Mono", category: "monospace", weights: [400, 700], googleFontName: "Space+Mono:wght@400;700" },
  
  // Handwriting & Script
  { family: "Caveat", category: "handwriting", weights: [400, 500, 600, 700], googleFontName: "Caveat:wght@400;500;600;700" },
  { family: "Pacifico", category: "handwriting", weights: [400], googleFontName: "Pacifico" },
  { family: "Dancing Script", category: "handwriting", weights: [400, 500, 600, 700], googleFontName: "Dancing+Script:wght@400;500;600;700" },
  
  // System Fallbacks
  { family: "Arial", category: "sans-serif", weights: [400, 700] },
  { family: "Trebuchet MS", category: "sans-serif", weights: [400, 700] },
  { family: "Impact", category: "display", weights: [400, 700] },
  { family: "Georgia", category: "serif", weights: [400, 700] },
  { family: "Courier New", category: "monospace", weights: [400, 700] },
];

const loadedFontFamilies = new Set<string>(["Arial", "Trebuchet MS", "Impact", "Georgia", "Courier New", "sans-serif", "serif", "monospace"]);
const failedFontFamilies = new Set<string>();

export function getFontFamilyWithFallback(fontFamily?: string): string {
  if (!fontFamily) return "'Inter', sans-serif";
  
  const config = AVAILABLE_FONTS.find((f) => f.family.toLowerCase() === fontFamily.toLowerCase());
  const categoryFallback = config?.category === "serif"
    ? "serif"
    : config?.category === "monospace"
    ? "monospace"
    : config?.category === "handwriting"
    ? "cursive"
    : "sans-serif";

  return `"${fontFamily}", "${config?.family || fontFamily}", ${categoryFallback}`;
}

export function isFontFailed(fontFamily: string): boolean {
  return failedFontFamilies.has(fontFamily.toLowerCase());
}

export function loadFontFamily(fontFamily: string): Promise<boolean> {
  if (!fontFamily || loadedFontFamilies.has(fontFamily)) {
    return Promise.resolve(true);
  }

  const fontConfig = AVAILABLE_FONTS.find(
    (f) => f.family.toLowerCase() === fontFamily.toLowerCase()
  );

  if (!fontConfig || !fontConfig.googleFontName) {
    loadedFontFamilies.add(fontFamily);
    return Promise.resolve(true);
  }

  return new Promise((resolve) => {
    const linkId = `google-font-${fontFamily.replace(/\s+/g, "-").toLowerCase()}`;
    if (!document.getElementById(linkId)) {
      const link = document.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com/css2?family=${fontConfig.googleFontName}&display=swap`;
      document.head.appendChild(link);
    }

    if ("fonts" in document) {
      document.fonts.load(`16px "${fontFamily}"`).then(() => {
        loadedFontFamilies.add(fontFamily);
        resolve(true);
      }).catch(() => {
        console.warn(`Font load failed for "${fontFamily}". Falling back gracefully.`);
        failedFontFamilies.add(fontFamily.toLowerCase());
        resolve(false);
      });
    } else {
      loadedFontFamilies.add(fontFamily);
      setTimeout(() => resolve(true), 300);
    }
  });
}

export async function ensureFontsLoaded(fontFamilies: string[]): Promise<void> {
  const promises = fontFamilies.map((f) => loadFontFamily(f));
  await Promise.all(promises);
}

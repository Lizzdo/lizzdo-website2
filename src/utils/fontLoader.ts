// Safe Google Fonts & Web Fonts Loader Engine for Preview & Canvas Export

export interface FontOption {
  family: string;
  category: "sans-serif" | "serif" | "display" | "monospace" | "handwriting";
  weights: number[];
  googleFontName?: string;
}

export const AVAILABLE_FONTS: FontOption[] = [
  { family: "Orbitron", category: "display", weights: [400, 600, 700, 900], googleFontName: "Orbitron:wght@400;600;700;900" },
  { family: "Inter", category: "sans-serif", weights: [300, 400, 500, 600, 700, 800], googleFontName: "Inter:wght@300;400;500;600;700;800" },
  { family: "Roboto", category: "sans-serif", weights: [300, 400, 500, 700, 900], googleFontName: "Roboto:wght@300;400;500;700;900" },
  { family: "Montserrat", category: "sans-serif", weights: [400, 600, 700, 800, 900], googleFontName: "Montserrat:wght@400;600;700;800;900" },
  { family: "Poppins", category: "sans-serif", weights: [300, 400, 600, 700, 800], googleFontName: "Poppins:wght@300;400;600;700;800" },
  { family: "Playfair Display", category: "serif", weights: [400, 600, 700, 900], googleFontName: "Playfair+Display:wght@400;600;700;900" },
  { family: "Cinzel", category: "serif", weights: [400, 600, 700, 900], googleFontName: "Cinzel:wght@400;600;700;900" },
  { family: "Bebas Neue", category: "display", weights: [400], googleFontName: "Bebas+Neue" },
  { family: "Oswald", category: "sans-serif", weights: [400, 600, 700], googleFontName: "Oswald:wght@400;600;700" },
  { family: "Space Grotesk", category: "sans-serif", weights: [400, 600, 700], googleFontName: "Space+Grotesk:wght@400;600;700" },
  { family: "Caveat", category: "handwriting", weights: [400, 700], googleFontName: "Caveat:wght@400;700" },
  { family: "Fira Code", category: "monospace", weights: [400, 600, 700], googleFontName: "Fira+Code:wght@400;600;700" },
  { family: "Arial", category: "sans-serif", weights: [400, 700] },
  { family: "Trebuchet MS", category: "sans-serif", weights: [400, 700] },
  { family: "Impact", category: "display", weights: [400, 700] },
];

const loadedFontFamilies = new Set<string>(["Arial", "Trebuchet MS", "Impact", "sans-serif"]);

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
        loadedFontFamilies.add(fontFamily);
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

import React, { useState } from "react";
import { useStudio } from "../../../context/StudioContext";
import {
  Type,
  Search,
  Send,
  Upload,
  Check,
  Sparkles,
  Palette,
} from "lucide-react";

const FONTS_LIST = [
  { name: "Orbitron", category: "Display / Futuristic", sample: "LIZZDO STUDIO V3" },
  { name: "Rajdhani", category: "Sans-Serif / Clean", sample: "THE FUTURE OF CREATIVE TOOLS" },
  { name: "Playfair Display", category: "Serif / Luxury", sample: "Timeless Elegance & Precision" },
  { name: "Syne", category: "Display / Avant-Garde", sample: "MODERN BRAND IDENTITIES" },
  { name: "Fira Code", category: "Monospace / Tech", sample: "const studio = new LizzdoStudio();" },
  { name: "Inter", category: "UI / Body Text", sample: "Clean readable UI typography" },
];

export function FontsWorkspace() {
  const { createProject } = useStudio();
  const [searchQuery, setSearchQuery] = useState("");
  const [sampleText, setSampleText] = useState("LIZZDO STUDIO");

  const filteredFonts = FONTS_LIST.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUseFont = (fontName: string) => {
    createProject(`${fontName} Typography`, "designer", {
      width: 1200,
      height: 800,
      elements: [
        {
          id: `elem-font-${Date.now()}`,
          type: "text",
          name: "Font Specimen",
          x: 100,
          y: 300,
          width: 1000,
          height: 200,
          rotation: 0,
          opacity: 1,
          text: sampleText,
          fontSize: 72,
          fontFamily: fontName,
          fill: "#00f5ff",
          align: "center",
        },
      ],
    });
  };

  return (
    <div className="flex-1 bg-black text-white p-6 overflow-y-auto custom-scrollbar font-sans select-none space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-neutral-900 border border-white/10 shadow-2xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-purple/10 border border-neon-purple/30 text-neon-purple text-xs font-mono">
            <Type className="w-3.5 h-3.5" />
            <span>Google Fonts & Custom Loader</span>
          </div>
          <h1 className="font-display font-black text-2xl md:text-3xl tracking-wider text-white uppercase">
            Fonts Studio & Typography Vault
          </h1>
          <p className="text-xs text-gray-400 font-mono">
            Preview, test, and apply typography pairings across all 22 Lizzdo Studio tools.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert("Upload custom TTF/WOFF2 font feature ready!")}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-neon-purple to-neon-pink text-white font-display font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(168,85,247,0.6)] transition-all flex items-center gap-2 shrink-0"
        >
          <Upload className="w-4 h-4" /> Custom Font (.TTF)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        <div className="relative">
          <input
            type="text"
            placeholder="Search font families..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-900 border border-white/10 rounded-2xl px-4 py-3 pl-10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple"
          />
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>

        <div>
          <input
            type="text"
            placeholder="Type custom preview text..."
            value={sampleText}
            onChange={(e) => setSampleText(e.target.value)}
            className="w-full bg-neutral-900 border border-white/10 rounded-2xl px-4 py-3 text-xs text-neon-cyan font-bold focus:outline-none focus:border-neon-purple"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredFonts.map((font) => (
          <div
            key={font.name}
            onClick={() => handleUseFont(font.name)}
            className="p-6 rounded-2xl bg-neutral-900 border border-white/10 hover:border-neon-purple/60 transition-all cursor-pointer group flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg"
          >
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-neon-purple">{font.name}</span>
                <span className="text-[10px] font-mono text-gray-500">({font.category})</span>
              </div>
              <div
                style={{ fontFamily: font.name }}
                className="text-2xl md:text-3xl text-white truncate py-2"
              >
                {sampleText || font.sample}
              </div>
            </div>

            <button
              type="button"
              className="px-4 py-2 rounded-xl bg-neon-purple/20 border border-neon-purple/40 text-neon-purple group-hover:bg-neon-purple group-hover:text-white font-mono text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
            >
              <span>Use in Canvas</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

import React from "react";
import { FolderOpen, Sparkles, LayoutGrid, Check } from "lucide-react";
import { DesignState } from "../../types/designer";

interface TemplateManagerV2Props {
  onSelectTemplate: (templateState: DesignState) => void;
  onClose: () => void;
}

const DESIGN_TEMPLATES: { name: string; category: string; description: string; state: DesignState }[] = [
  {
    name: "Cyber Portfolio Showcase",
    category: "Portfolio",
    description: "High-contrast portfolio hero layout with corner decorations and action buttons.",
    state: {
      id: "tpl-portfolio",
      title: "Cyber Portfolio Showcase",
      preset: "website-hero",
      width: 1200,
      height: 630,
      background: {
        type: "gradient",
        solidColor: "#0a0e27",
        gradientFrom: "#0a0e27",
        gradientVia: "#121838",
        gradientTo: "#050814",
        gradientDirection: "to-br",
        pattern: "grid",
        patternColor: "rgba(0, 245, 255, 0.2)",
        patternOpacity: 0.3,
      },
      elements: [
        {
          id: "t1",
          name: "Tag Badge",
          type: "badge",
          visible: true,
          locked: false,
          x: 10,
          y: 12,
          width: 25,
          height: 7,
          text: "PORTFOLIO EDITION",
          bg: "rgba(0,245,255,0.15)",
          textColor: "#00f5ff",
          borderColor: "#00f5ff",
          borderRadius: 8,
          zIndex: 1,
        },
        {
          id: "t2",
          name: "Main Title",
          type: "text",
          visible: true,
          locked: false,
          x: 10,
          y: 26,
          width: 80,
          height: 20,
          text: "SENIOR CREATIVE ARCHITECT",
          fontFamily: "Orbitron",
          fontWeight: "black",
          fontSize: 38,
          color: "#ffffff",
          gradientText: true,
          zIndex: 2,
        },
        {
          id: "t3",
          name: "Description",
          type: "text",
          visible: true,
          locked: false,
          x: 10,
          y: 50,
          width: 70,
          height: 15,
          text: "Building scalable web platforms, immersive 3D interfaces & futuristic brand systems.",
          fontFamily: "Rajdhani",
          fontWeight: "semibold",
          fontSize: 18,
          color: "#94a3b8",
          zIndex: 3,
        },
        {
          id: "t4",
          name: "CTA Button",
          type: "button",
          visible: true,
          locked: false,
          x: 10,
          y: 72,
          width: 25,
          height: 10,
          text: "VIEW PROJECT CASE STUDIES",
          textColor: "#ffffff",
          borderRadius: 12,
          zIndex: 4,
        },
      ],
      showCyberBorders: true,
      showGlassPanel: true,
      glassOpacity: 0.3,
      glassBlur: 10,
      cornerDecorations: {
        enabled: true,
        syncAllCorners: true,
        style: "cyber-hud",
        size: 40,
        length: 40,
        thickness: 3,
        color: "#00f5ff",
        glowColor: "#00f5ff",
        glowSpread: 12,
        opacity: 0.9,
      },
    },
  },
  {
    name: "Tech Blog Banner",
    category: "Blog",
    description: "Minimalist futuristic blog header optimized for article thumbnails.",
    state: {
      id: "tpl-blog",
      title: "Tech Blog Banner",
      preset: "blog-header",
      width: 1200,
      height: 630,
      background: {
        type: "mesh",
        solidColor: "#0b0f19",
        meshColor1: "#8b5cf6",
        meshColor2: "#06b6d4",
        gradientFrom: "#0b0f19",
        gradientTo: "#1e1b4b",
        gradientDirection: "to-r",
        pattern: "hexagons",
        patternColor: "rgba(139, 92, 246, 0.2)",
        patternOpacity: 0.3,
      },
      elements: [
        {
          id: "tb1",
          name: "Category",
          type: "badge",
          visible: true,
          locked: false,
          x: 10,
          y: 15,
          width: 20,
          height: 6,
          text: "ARTIFICIAL INTELLIGENCE",
          bg: "rgba(139, 92, 246, 0.2)",
          textColor: "#a855f7",
          borderColor: "#a855f7",
          borderRadius: 8,
          zIndex: 1,
        },
        {
          id: "tb2",
          name: "Article Title",
          type: "text",
          visible: true,
          locked: false,
          x: 10,
          y: 30,
          width: 80,
          height: 25,
          text: "THE FUTURE OF AI STUDIO PLATFORMS",
          fontFamily: "Orbitron",
          fontWeight: "bold",
          fontSize: 34,
          color: "#ffffff",
          gradientText: false,
          zIndex: 2,
        },
      ],
      showCyberBorders: true,
      showGlassPanel: true,
      glassOpacity: 0.2,
      glassBlur: 8,
    },
  },
  {
    name: "E-Commerce Product Showcase",
    category: "Store",
    description: "High impact product launch banner with neon badge accents.",
    state: {
      id: "tpl-store",
      title: "E-Commerce Product Showcase",
      preset: "product-launch",
      width: 1200,
      height: 630,
      background: {
        type: "gradient",
        solidColor: "#000000",
        gradientFrom: "#18002e",
        gradientVia: "#000000",
        gradientTo: "#001a2e",
        gradientDirection: "to-br",
        pattern: "circuit",
        patternColor: "rgba(255, 0, 110, 0.2)",
        patternOpacity: 0.3,
      },
      elements: [
        {
          id: "ts1",
          name: "Store Tag",
          type: "badge",
          visible: true,
          locked: false,
          x: 10,
          y: 15,
          width: 22,
          height: 7,
          text: "NEW ARRIVAL PRO",
          bg: "rgba(255, 0, 110, 0.2)",
          textColor: "#ff006e",
          borderColor: "#ff006e",
          borderRadius: 8,
          zIndex: 1,
        },
        {
          id: "ts2",
          name: "Product Name",
          type: "text",
          visible: true,
          locked: false,
          x: 10,
          y: 30,
          width: 75,
          height: 22,
          text: "LIZZDO CYBER GEAR X1",
          fontFamily: "Orbitron",
          fontWeight: "black",
          fontSize: 36,
          color: "#ffffff",
          gradientText: true,
          zIndex: 2,
        },
        {
          id: "ts3",
          name: "Buy CTA",
          type: "button",
          visible: true,
          locked: false,
          x: 10,
          y: 65,
          width: 22,
          height: 10,
          text: "ORDER NOW",
          textColor: "#ffffff",
          borderRadius: 12,
          zIndex: 3,
        },
      ],
      showCyberBorders: true,
      showGlassPanel: true,
      glassOpacity: 0.3,
      glassBlur: 12,
    },
  },
];

export default function TemplateManagerV2({ onSelectTemplate, onClose }: TemplateManagerV2Props) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#0b0f19] border border-neon-cyan/40 rounded-2xl w-full max-w-4xl p-6 text-white space-y-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neon-cyan/20 border border-neon-cyan flex items-center justify-center text-neon-cyan">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-white">Preset Template Library</h2>
              <p className="text-xs font-mono text-gray-400">Load high-converting layouts into Designer Pro V2</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono transition-colors"
          >
            Close (Esc)
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {DESIGN_TEMPLATES.map((tpl) => (
            <div
              key={tpl.name}
              onClick={() => {
                onSelectTemplate(tpl.state);
                onClose();
              }}
              className="group p-4 rounded-xl border border-white/10 bg-white/5 hover:border-neon-cyan cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-neon-cyan bg-neon-cyan/10 px-2 py-0.5 rounded uppercase">
                    {tpl.category}
                  </span>
                  <Sparkles className="w-4 h-4 text-neon-purple group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="font-display font-bold text-sm text-white group-hover:text-neon-cyan transition-colors">
                  {tpl.name}
                </h3>
                <p className="text-xs font-mono text-gray-400 leading-relaxed">{tpl.description}</p>
              </div>

              <button className="w-full py-2 rounded-lg bg-gradient-to-r from-neon-cyan to-neon-purple text-black font-display font-bold text-xs uppercase tracking-wider group-hover:shadow-[0_0_15px_rgba(0,245,255,0.4)] transition-all">
                Load Template
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

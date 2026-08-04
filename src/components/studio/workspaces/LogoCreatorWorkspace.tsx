import React, { useState } from "react";
import { useStudio } from "../../../context/StudioContext";
import {
  Shield,
  Palette,
  Type,
  Shapes,
  Download,
  Copy,
  Send,
  Eye,
  Sliders,
  Sparkles,
  Check,
  Grid,
  Sun,
  Moon,
} from "lucide-react";

export function LogoCreatorWorkspace() {
  const { createProject } = useStudio();

  const [companyName, setCompanyName] = useState("LIZZDO");
  const [tagline, setTagline] = useState("NEXT GEN STUDIO");
  const [iconShape, setIconShape] = useState<"shield" | "hexagon" | "diamond" | "circle" | "triangle">("shield");
  const [primaryColor, setPrimaryColor] = useState("#00f5ff");
  const [secondaryColor, setSecondaryColor] = useState("#a855f7");
  const [previewBg, setPreviewBg] = useState<"dark" | "light" | "transparent">("dark");

  const handleOpenInDesigner = () => {
    createProject(`${companyName} Logo`, "designer", {
      width: 1000,
      height: 1000,
      elements: [
        {
          id: `elem-logo-${Date.now()}`,
          type: "text",
          name: "Brand Title",
          x: 200,
          y: 600,
          width: 600,
          height: 100,
          rotation: 0,
          opacity: 1,
          text: companyName,
          fontSize: 64,
          fontFamily: "Orbitron",
          fill: primaryColor,
          align: "center",
        },
        {
          id: `elem-tagline-${Date.now()}`,
          type: "text",
          name: "Tagline",
          x: 200,
          y: 720,
          width: 600,
          height: 50,
          rotation: 0,
          opacity: 1,
          text: tagline,
          fontSize: 24,
          fontFamily: "Rajdhani",
          fill: secondaryColor,
          align: "center",
        },
      ],
    });
  };

  return (
    <div className="flex-1 bg-black text-white flex flex-col lg:flex-row overflow-hidden font-sans select-none">
      {/* LEFT LOGO CONTROLS SIDEBAR */}
      <div className="w-full lg:w-96 bg-neutral-950 border-r border-white/10 flex flex-col p-4 space-y-5 overflow-y-auto custom-scrollbar shrink-0">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-neon-cyan animate-pulse" />
          <h2 className="font-display font-bold text-sm tracking-wider uppercase text-white">
            Vector Logo Creator
          </h2>
          <span className="ml-auto px-2 py-0.5 rounded bg-neon-cyan/20 border border-neon-cyan/40 text-neon-cyan text-[9px] font-mono font-bold">
            VECTOR
          </span>
        </div>

        {/* LOGO TEXT INPUTS */}
        <div className="space-y-3 font-mono text-xs">
          <div className="space-y-1.5">
            <label className="text-gray-400 uppercase">Brand / Company Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-white font-bold focus:border-neon-cyan focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-gray-400 uppercase">Tagline / Subtitle</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-gray-300 focus:border-neon-cyan focus:outline-none"
            />
          </div>
        </div>

        {/* VECTOR EMBLEM SHAPE PICKER */}
        <div className="space-y-2">
          <label className="text-xs font-mono font-bold text-gray-300 uppercase">Vector Emblem Shape</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "shield", label: "Shield" },
              { id: "hexagon", label: "Hexagon" },
              { id: "diamond", label: "Diamond" },
              { id: "circle", label: "Circle" },
              { id: "triangle", label: "Delta" },
            ].map((sh) => (
              <button
                key={sh.id}
                type="button"
                onClick={() => setIconShape(sh.id as any)}
                className={`py-2 rounded-xl border font-mono text-xs text-center transition-all ${
                  iconShape === sh.id
                    ? "bg-neon-cyan/20 border-neon-cyan text-white font-bold"
                    : "bg-neutral-900 border-white/5 text-gray-400 hover:text-white"
                }`}
              >
                {sh.label}
              </button>
            ))}
          </div>
        </div>

        {/* BRAND PALETTE COLOR PICKER */}
        <div className="space-y-2 font-mono text-xs">
          <label className="font-bold text-gray-300 uppercase">Gradient Colors</label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-[10px] text-gray-500 block mb-1">Primary Color</span>
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-full h-9 rounded-xl bg-neutral-900 border border-white/10 cursor-pointer"
              />
            </div>
            <div>
              <span className="text-[10px] text-gray-500 block mb-1">Secondary Color</span>
              <input
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="w-full h-9 rounded-xl bg-neutral-900 border border-white/10 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="pt-2 space-y-2">
          <button
            type="button"
            onClick={handleOpenInDesigner}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-display font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(0,245,255,0.6)] transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" /> Open Vector in Designer
          </button>
        </div>
      </div>

      {/* CENTER STAGE PREVIEW */}
      <div className="flex-1 bg-neutral-900 flex flex-col overflow-hidden relative">
        <div className="h-12 bg-neutral-950 border-b border-white/10 px-4 flex items-center justify-between font-mono text-xs text-gray-300">
          <span>Logo Canvas Stage (1000 x 1000 px)</span>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Preview Canvas:</span>
            <button
              onClick={() => setPreviewBg("dark")}
              className={`px-2 py-1 rounded-lg border text-[10px] ${previewBg === "dark" ? "bg-white/20 border-white text-white font-bold" : "border-white/10 text-gray-400"}`}
            >
              Dark
            </button>
            <button
              onClick={() => setPreviewBg("light")}
              className={`px-2 py-1 rounded-lg border text-[10px] ${previewBg === "light" ? "bg-white text-black font-bold" : "border-white/10 text-gray-400"}`}
            >
              Light
            </button>
          </div>
        </div>

        {/* LOGO VECTOR STAGE CANVAS */}
        <div className="flex-1 p-8 flex items-center justify-center relative overflow-hidden">
          <div
            className={`w-96 h-96 rounded-3xl border border-white/20 shadow-2xl flex flex-col items-center justify-center p-8 text-center transition-colors ${
              previewBg === "light" ? "bg-white text-black" : "bg-black text-white"
            }`}
          >
            {/* EMBLEM SHAPE */}
            <div className="relative mb-6">
              <div
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                }}
                className="w-32 h-32 rounded-3xl flex items-center justify-center shadow-[0_0_30px_rgba(0,245,255,0.4)]"
              >
                <Shield className="w-16 h-16 text-black drop-shadow-md" />
              </div>
            </div>

            {/* BRAND TITLE & TAGLINE */}
            <h1
              style={{ color: previewBg === "light" ? "#000" : primaryColor }}
              className="font-display font-black text-3xl tracking-[4px] uppercase"
            >
              {companyName || "BRAND NAME"}
            </h1>
            <p
              style={{ color: previewBg === "light" ? "#555" : secondaryColor }}
              className="font-mono text-xs tracking-[3px] uppercase mt-2"
            >
              {tagline || "TAGLINE HERE"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

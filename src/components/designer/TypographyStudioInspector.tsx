import React, { useState } from "react";
import { CanvasElement, TextEffectConfig } from "../../types/designer";
import { AVAILABLE_FONTS, loadFontFamily, isFontFailed, getFontFamilyWithFallback } from "../../utils/fontLoader";
import {
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Italic,
  Underline,
  Strikethrough,
  Sparkles,
  Palette,
  Sliders,
  Zap,
  Plus,
  Trash2,
  Lock,
  Unlock,
  Box,
  Wand2,
  AlertTriangle,
  Sun,
  Layers,
  CircleDot,
  RotateCcw,
} from "lucide-react";

interface Props {
  element: CanvasElement;
  onUpdateProp: (key: keyof CanvasElement, value: any) => void;
  onUpdateProps?: (updates: Partial<CanvasElement>) => void;
}

export function TypographyStudioInspector({ element, onUpdateProp, onUpdateProps }: Props) {
  const [activeTab, setActiveTab] = useState<"font" | "color" | "stroke" | "effects" | "box">("font");
  const [fontCategory, setFontCategory] = useState<string>("all");
  const [fontWarning, setFontWarning] = useState<string | null>(null);

  // Helper to safely batch update or single update
  const updateProp = (key: keyof CanvasElement, value: any) => {
    onUpdateProp(key, value);
  };

  const updateMultiple = (updates: Partial<CanvasElement>) => {
    if (onUpdateProps) {
      onUpdateProps(updates);
    } else {
      Object.entries(updates).forEach(([k, v]) => onUpdateProp(k as keyof CanvasElement, v));
    }
  };

  // Font change handler with Google Font loading
  const handleFontFamilyChange = async (newFamily: string) => {
    updateProp("fontFamily", newFamily);
    setFontWarning(null);

    const success = await loadFontFamily(newFamily);
    if (!success || isFontFailed(newFamily)) {
      setFontWarning(`Font "${newFamily}" could not be fetched. Safe fallback applied.`);
    }
  };

  const currentFontFamily = element.fontFamily || "Orbitron";
  const filteredFonts = AVAILABLE_FONTS.filter(
    (f) => fontCategory === "all" || f.category === fontCategory
  );

  // PRESETS APPLY HANDLER
  const applyTypographyPreset = (presetKey: string) => {
    switch (presetKey) {
      case "cyber-headline":
        updateMultiple({
          fontFamily: "Orbitron",
          fontWeight: "900",
          fontSize: 48,
          letterSpacing: 6,
          lineHeight: 1.1,
          textTransform: "uppercase",
          color: "#00f5ff",
          gradientText: true,
          textGradient: {
            enabled: true,
            type: "linear",
            angle: 90,
            colorStops: [
              { color: "#00f5ff", offset: 0 },
              { color: "#a855f7", offset: 50 },
              { color: "#ff006e", offset: 100 },
            ],
          },
          textGlow: {
            enabled: true,
            type: "neon",
            color: "#00f5ff",
            blur: 15,
            spread: 5,
            opacity: 0.9,
          },
          textShadow: {
            enabled: true,
            color: "rgba(0,0,0,0.9)",
            blur: 10,
            offsetX: 0,
            offsetY: 4,
          },
        });
        break;

      case "neon-title":
        updateMultiple({
          fontFamily: "Rajdhani",
          fontWeight: "700",
          fontSize: 56,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: "#ffffff",
          gradientText: false,
          textStroke: {
            enabled: true,
            color: "#ff006e",
            width: 2,
            opacity: 1,
            position: "center",
          },
          textGlow: {
            enabled: true,
            type: "neon",
            color: "#ff006e",
            blur: 20,
            opacity: 1,
          },
          textShadow: {
            enabled: true,
            color: "#ff006e",
            blur: 30,
            offsetX: 0,
            offsetY: 0,
          },
        });
        break;

      case "3d-metallic":
        updateMultiple({
          fontFamily: "Bebas Neue",
          fontWeight: "700",
          fontSize: 64,
          letterSpacing: 3,
          textTransform: "uppercase",
          gradientText: true,
          textGradient: {
            enabled: true,
            type: "linear",
            angle: 180,
            colorStops: [
              { color: "#ffffff", offset: 0 },
              { color: "#94a3b8", offset: 45 },
              { color: "#334155", offset: 50 },
              { color: "#cbd5e1", offset: 100 },
            ],
          },
          textEffect: {
            preset: "3d",
            threeD: {
              enabled: true,
              depth: 8,
              direction: "diagonal-right",
              color: "#1e293b",
              shadowColor: "#000000",
              opacity: 0.9,
            },
          },
        });
        break;

      case "glass-title":
        updateMultiple({
          fontFamily: "Syne",
          fontWeight: "800",
          fontSize: 42,
          letterSpacing: 2,
          color: "rgba(255,255,255,0.85)",
          gradientText: false,
          textBg: {
            enabled: true,
            type: "glass",
            color: "rgba(255,255,255,0.08)",
            opacity: 0.8,
            paddingTop: 12,
            paddingRight: 24,
            paddingBottom: 12,
            paddingLeft: 24,
            paddingLinked: true,
            borderRadius: 16,
            borderEnabled: true,
            borderColor: "rgba(255,255,255,0.2)",
            borderWidth: 1,
          },
        });
        break;

      case "glitch-cyber":
        updateMultiple({
          fontFamily: "Fira Code",
          fontWeight: "700",
          fontSize: 36,
          letterSpacing: 5,
          textTransform: "uppercase",
          color: "#00f5ff",
          textShadow: {
            enabled: true,
            color: "#ff006e",
            blur: 0,
            offsetX: -3,
            offsetY: 2,
          },
          textEffect: {
            preset: "glitch",
            glitchOffset: 4,
          },
        });
        break;

      case "modern-minimal":
        updateMultiple({
          fontFamily: "Inter",
          fontWeight: "600",
          fontSize: 32,
          letterSpacing: -1,
          lineHeight: 1.2,
          color: "#ffffff",
          gradientText: false,
          textStroke: { enabled: false, color: "#000", width: 0 },
          textShadow: { enabled: false, color: "#000", blur: 0, offsetX: 0, offsetY: 0 },
          textGlow: { enabled: false, color: "#000", blur: 0 },
        });
        break;
    }
  };

  return (
    <div className="space-y-4 bg-neutral-900/90 p-3.5 rounded-2xl border border-white/10 shadow-2xl text-xs font-sans">
      {/* HEADER WITH TYPOGRAPHY STUDIO BADGE */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <Type className="w-4 h-4 text-neon-cyan animate-pulse" />
          <span className="font-display font-bold text-white text-xs tracking-wider uppercase">
            Typography Studio
          </span>
        </div>
        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-neon-cyan/20 border border-neon-cyan/40 text-neon-cyan font-semibold">
          PRO V1
        </span>
      </div>

      {/* FONT WARNING BANNER IF FALLBACK IS ACTIVE */}
      {(fontWarning || isFontFailed(currentFontFamily)) && (
        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] flex items-center gap-2 font-mono">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{fontWarning || `Font "${currentFontFamily}" failed to load. Displaying safe system fallback.`}</span>
        </div>
      )}

      {/* QUICK PRESETS CAROUSEL */}
      <div className="space-y-1.5">
        <label className="text-[10px] uppercase font-mono text-gray-400 block font-bold">
          Quick Style Presets
        </label>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
          <button
            type="button"
            onClick={() => applyTypographyPreset("cyber-headline")}
            className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/40 text-cyan-300 hover:scale-105 transition-all text-[10px] font-mono whitespace-nowrap"
          >
            Cyber Headline
          </button>
          <button
            type="button"
            onClick={() => applyTypographyPreset("neon-title")}
            className="px-2.5 py-1 rounded-lg bg-pink-500/20 border border-pink-500/40 text-pink-300 hover:scale-105 transition-all text-[10px] font-mono whitespace-nowrap"
          >
            Neon Title
          </button>
          <button
            type="button"
            onClick={() => applyTypographyPreset("3d-metallic")}
            className="px-2.5 py-1 rounded-lg bg-slate-500/20 border border-slate-400/40 text-slate-200 hover:scale-105 transition-all text-[10px] font-mono whitespace-nowrap"
          >
            3D Chrome
          </button>
          <button
            type="button"
            onClick={() => applyTypographyPreset("glass-title")}
            className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/30 text-white hover:scale-105 transition-all text-[10px] font-mono whitespace-nowrap"
          >
            Glass Title
          </button>
          <button
            type="button"
            onClick={() => applyTypographyPreset("glitch-cyber")}
            className="px-2.5 py-1 rounded-lg bg-cyan-900/30 border border-cyan-400/50 text-cyan-300 hover:scale-105 transition-all text-[10px] font-mono whitespace-nowrap"
          >
            Glitch Tech
          </button>
          <button
            type="button"
            onClick={() => applyTypographyPreset("modern-minimal")}
            className="px-2.5 py-1 rounded-lg bg-neutral-800 border border-neutral-600 text-gray-300 hover:scale-105 transition-all text-[10px] font-mono whitespace-nowrap"
          >
            Minimal
          </button>
        </div>
      </div>

      {/* TAB SUB-NAVIGATOR */}
      <div className="grid grid-cols-5 gap-1 p-1 bg-black/60 rounded-xl border border-white/10 font-mono text-[10px]">
        <button
          type="button"
          onClick={() => setActiveTab("font")}
          className={`py-1.5 rounded-lg transition-all flex flex-col items-center justify-center gap-0.5 ${
            activeTab === "font"
              ? "bg-neon-cyan/20 border border-neon-cyan/50 text-neon-cyan font-bold"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>Font</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("color")}
          className={`py-1.5 rounded-lg transition-all flex flex-col items-center justify-center gap-0.5 ${
            activeTab === "color"
              ? "bg-neon-purple/20 border border-neon-purple/50 text-neon-purple font-bold"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Color</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("stroke")}
          className={`py-1.5 rounded-lg transition-all flex flex-col items-center justify-center gap-0.5 ${
            activeTab === "stroke"
              ? "bg-neon-pink/20 border border-neon-pink/50 text-neon-pink font-bold"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Sun className="w-3.5 h-3.5" />
          <span>Glow</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("effects")}
          className={`py-1.5 rounded-lg transition-all flex flex-col items-center justify-center gap-0.5 ${
            activeTab === "effects"
              ? "bg-amber-400/20 border border-amber-400/50 text-amber-300 font-bold"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>3D/FX</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("box")}
          className={`py-1.5 rounded-lg transition-all flex flex-col items-center justify-center gap-0.5 ${
            activeTab === "box"
              ? "bg-emerald-400/20 border border-emerald-400/50 text-emerald-300 font-bold"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Box className="w-3.5 h-3.5" />
          <span>Badge</span>
        </button>
      </div>

      {/* TAB 1: TEXT CONTENT, FONT & TYPOGRAPHY METRICS */}
      {activeTab === "font" && (
        <div className="space-y-3.5">
          {/* TEXT TYPE SELECTOR */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-gray-400 block">Typography Type</label>
            <select
              value={element.textType || "custom"}
              onChange={(e) => updateProp("textType", e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-xl px-2.5 py-1.5 text-white font-mono text-xs focus:border-neon-cyan focus:outline-none"
            >
              <option value="point">Point Text (Auto Width)</option>
              <option value="paragraph">Paragraph Box (Auto Wrap)</option>
              <option value="headline">Headline Display</option>
              <option value="subtitle">Subtitle / Subheading</option>
              <option value="caption">Caption / Small Note</option>
              <option value="label">Tech Tag / Label</option>
              <option value="button">CTA Button Text</option>
              <option value="badge">Badge Text</option>
              <option value="quote">Pull Quote</option>
              <option value="custom">Custom Format</option>
            </select>
          </div>

          {/* TEXT AREA INPUT */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-mono text-gray-400">Content String</label>
              <div className="flex items-center gap-1 text-[9px] font-mono">
                <button
                  type="button"
                  onClick={() => updateProp("text", (element.text || "").toUpperCase())}
                  className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 text-gray-300"
                  title="UPPERCASE"
                >
                  AA
                </button>
                <button
                  type="button"
                  onClick={() => updateProp("text", (element.text || "").toLowerCase())}
                  className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 text-gray-300"
                  title="lowercase"
                >
                  aa
                </button>
              </div>
            </div>
            <textarea
              rows={2}
              value={element.text || ""}
              onChange={(e) => updateProp("text", e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-white focus:border-neon-cyan focus:outline-none text-xs font-sans"
              placeholder="Type typography content..."
            />
          </div>

          {/* FONT CATEGORY FILTER & FAMILY DROP-DOWN */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-mono text-gray-400">Font Family</label>
              <select
                value={fontCategory}
                onChange={(e) => setFontCategory(e.target.value)}
                className="bg-black/60 border border-white/10 rounded-lg px-2 py-0.5 text-[10px] text-neon-cyan font-mono"
              >
                <option value="all">All Fonts</option>
                <option value="display">Display / Tech</option>
                <option value="sans-serif">Sans-Serif</option>
                <option value="serif">Serif / Luxury</option>
                <option value="monospace">Monospace</option>
                <option value="handwriting">Handwriting</option>
              </select>
            </div>

            <select
              value={currentFontFamily}
              onChange={(e) => handleFontFamilyChange(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-xl px-2.5 py-2 text-white font-mono text-xs focus:border-neon-cyan focus:outline-none"
              style={{ fontFamily: getFontFamilyWithFallback(currentFontFamily) }}
            >
              {filteredFonts.map((f) => (
                <option key={f.family} value={f.family} style={{ fontFamily: f.family }}>
                  {f.family} ({f.category})
                </option>
              ))}
            </select>
          </div>

          {/* FONT SIZE CONTROLS */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-gray-400">Font Size</span>
              <span className="text-neon-cyan font-bold">{element.fontSize || 16}px</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateProp("fontSize", Math.max(6, (element.fontSize || 16) - 2))}
                className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-white flex items-center justify-center font-mono font-bold hover:bg-white/10"
              >
                -
              </button>
              <input
                type="range"
                min="8"
                max="256"
                value={element.fontSize || 16}
                onChange={(e) => updateProp("fontSize", parseInt(e.target.value))}
                className="flex-1 accent-neon-cyan cursor-pointer"
              />
              <button
                type="button"
                onClick={() => updateProp("fontSize", Math.min(300, (element.fontSize || 16) + 2))}
                className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-white flex items-center justify-center font-mono font-bold hover:bg-white/10"
              >
                +
              </button>
              <input
                type="number"
                value={element.fontSize || 16}
                onChange={(e) => updateProp("fontSize", Math.max(6, parseInt(e.target.value) || 16))}
                className="w-14 bg-black/60 border border-white/10 rounded-lg px-2 py-1 text-right text-white font-mono text-xs focus:border-neon-cyan focus:outline-none"
              />
            </div>

            {/* QUICK SIZES PILLS */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[9px] font-mono">
              {[12, 16, 24, 32, 48, 64, 96, 128].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => updateProp("fontSize", size)}
                  className={`px-2 py-0.5 rounded-md border transition-all ${
                    element.fontSize === size
                      ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan font-bold"
                      : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* FONT WEIGHT & STYLE ROW */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-mono text-gray-400 block mb-1">Font Weight</label>
              <select
                value={element.fontWeight || "400"}
                onChange={(e) => updateProp("fontWeight", e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl px-2 py-1.5 text-white font-mono text-xs focus:border-neon-cyan focus:outline-none"
              >
                <option value="100">100 - Thin</option>
                <option value="200">200 - Extra Light</option>
                <option value="300">300 - Light</option>
                <option value="400">400 - Regular</option>
                <option value="500">500 - Medium</option>
                <option value="600">600 - Semi Bold</option>
                <option value="700">700 - Bold</option>
                <option value="800">800 - Extra Bold</option>
                <option value="900">900 - Black</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono text-gray-400 block mb-1">Transform Case</label>
              <select
                value={element.textTransform || "none"}
                onChange={(e) => updateProp("textTransform", e.target.value as any)}
                className="w-full bg-black/60 border border-white/10 rounded-xl px-2 py-1.5 text-white font-mono text-xs focus:border-neon-cyan focus:outline-none"
              >
                <option value="none">As Typed</option>
                <option value="uppercase">UPPERCASE</option>
                <option value="lowercase">lowercase</option>
                <option value="capitalize">Capitalize Words</option>
              </select>
            </div>
          </div>

          {/* LETTER SPACING & LINE HEIGHT */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-gray-400">Kerning</span>
                <span className="text-neon-cyan">{element.letterSpacing || 0}px</span>
              </div>
              <input
                type="range"
                min="-10"
                max="80"
                value={element.letterSpacing || 0}
                onChange={(e) => updateProp("letterSpacing", parseFloat(e.target.value))}
                className="w-full accent-neon-cyan cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-gray-400">Leading</span>
                <span className="text-neon-cyan">{element.lineHeight || 1.2}</span>
              </div>
              <input
                type="range"
                min="0.7"
                max="3.0"
                step="0.05"
                value={element.lineHeight || 1.2}
                onChange={(e) => updateProp("lineHeight", parseFloat(e.target.value))}
                className="w-full accent-neon-cyan cursor-pointer"
              />
            </div>
          </div>

          {/* ALIGNMENT & DECORATION BUTTONS */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/10">
            {/* Horizontal Align */}
            <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => updateProp("textAlign", "left")}
                className={`p-1.5 rounded-lg transition-all ${
                  element.textAlign === "left" || !element.textAlign
                    ? "bg-neon-cyan text-black"
                    : "text-gray-400 hover:text-white"
                }`}
                title="Align Left"
              >
                <AlignLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => updateProp("textAlign", "center")}
                className={`p-1.5 rounded-lg transition-all ${
                  element.textAlign === "center" ? "bg-neon-cyan text-black" : "text-gray-400 hover:text-white"
                }`}
                title="Align Center"
              >
                <AlignCenter className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => updateProp("textAlign", "right")}
                className={`p-1.5 rounded-lg transition-all ${
                  element.textAlign === "right" ? "bg-neon-cyan text-black" : "text-gray-400 hover:text-white"
                }`}
                title="Align Right"
              >
                <AlignRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => updateProp("textAlign", "justify")}
                className={`p-1.5 rounded-lg transition-all ${
                  element.textAlign === "justify" ? "bg-neon-cyan text-black" : "text-gray-400 hover:text-white"
                }`}
                title="Justify Text"
              >
                <AlignJustify className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Formatting Toggles */}
            <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() =>
                  updateProp("fontStyle", element.fontStyle === "italic" ? "normal" : "italic")
                }
                className={`p-1.5 rounded-lg transition-all ${
                  element.fontStyle === "italic" ? "bg-neon-purple text-white" : "text-gray-400 hover:text-white"
                }`}
                title="Italic"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() =>
                  updateProp(
                    "textDecoration",
                    element.textDecoration === "underline" ? "none" : "underline"
                  )
                }
                className={`p-1.5 rounded-lg transition-all ${
                  element.textDecoration === "underline" ? "bg-neon-purple text-white" : "text-gray-400 hover:text-white"
                }`}
                title="Underline"
              >
                <Underline className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() =>
                  updateProp(
                    "textDecoration",
                    element.textDecoration === "line-through" ? "none" : "line-through"
                  )
                }
                className={`p-1.5 rounded-lg transition-all ${
                  element.textDecoration === "line-through" ? "bg-neon-purple text-white" : "text-gray-400 hover:text-white"
                }`}
                title="Strikethrough"
              >
                <Strikethrough className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COLOR & GRADIENT ENGINE */}
      {activeTab === "color" && (
        <div className="space-y-3.5 font-mono text-xs">
          {/* GRADIENT vs SOLID TOGGLE */}
          <div className="flex items-center justify-between bg-black/60 p-1.5 rounded-xl border border-white/10">
            <span className="text-gray-300 font-bold text-[11px] px-1">Fill Engine</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => updateProp("gradientText", false)}
                className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  !element.gradientText ? "bg-neon-cyan text-black" : "text-gray-400 hover:text-white"
                }`}
              >
                Solid
              </button>
              <button
                type="button"
                onClick={() => {
                  updateProp("gradientText", true);
                  if (!element.textGradient) {
                    updateProp("textGradient", {
                      enabled: true,
                      type: "linear",
                      angle: 90,
                      colorStops: [
                        { color: "#00f5ff", offset: 0 },
                        { color: "#a855f7", offset: 100 },
                      ],
                    });
                  }
                }}
                className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  element.gradientText
                    ? "bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Gradient
              </button>
            </div>
          </div>

          {!element.gradientText ? (
            /* SOLID COLOR PICKER */
            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 block">Solid Text Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={element.color || "#ffffff"}
                  onChange={(e) => updateProp("color", e.target.value)}
                  className="w-9 h-9 rounded-xl cursor-pointer bg-transparent border border-white/20"
                />
                <input
                  type="text"
                  value={element.color || "#ffffff"}
                  onChange={(e) => updateProp("color", e.target.value)}
                  className="flex-1 bg-black/60 border border-white/10 rounded-xl px-2.5 py-2 text-white font-mono text-xs focus:border-neon-cyan focus:outline-none"
                />
              </div>

              {/* QUICK COLOR SWATCHES */}
              <div className="space-y-1 pt-1">
                <label className="text-[9px] text-gray-400 block">Quick Color Palette</label>
                <div className="grid grid-cols-10 gap-1">
                  {[
                    "#ffffff",
                    "#000000",
                    "#00f5ff",
                    "#3b82f6",
                    "#a855f7",
                    "#ec4899",
                    "#ff006e",
                    "#10b981",
                    "#f59e0b",
                    "#ef4444",
                  ].map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      onClick={() => updateProp("color", hex)}
                      className="w-full aspect-square rounded-lg border border-white/20 hover:scale-110 transition-transform"
                      style={{ backgroundColor: hex }}
                      title={hex}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* GRADIENT ENGINE CONTROLS */
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-gray-400 block mb-1">Gradient Type</label>
                  <select
                    value={element.textGradient?.type || "linear"}
                    onChange={(e) =>
                      updateProp("textGradient", {
                        ...(element.textGradient || {
                          enabled: true,
                          angle: 90,
                          colorStops: [
                            { color: "#00f5ff", offset: 0 },
                            { color: "#a855f7", offset: 100 },
                          ],
                        }),
                        type: e.target.value,
                      })
                    }
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-2 py-1.5 text-white text-xs focus:border-neon-cyan focus:outline-none"
                  >
                    <option value="linear">Linear Gradient</option>
                    <option value="radial">Radial Gradient</option>
                    <option value="angular">Conic / Angular</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                    <span>Angle</span>
                    <span className="text-neon-cyan">{element.textGradient?.angle || 90}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={element.textGradient?.angle || 90}
                    onChange={(e) =>
                      updateProp("textGradient", {
                        ...(element.textGradient || {
                          enabled: true,
                          type: "linear",
                          colorStops: [
                            { color: "#00f5ff", offset: 0 },
                            { color: "#a855f7", offset: 100 },
                          ],
                        }),
                        angle: parseInt(e.target.value),
                      })
                    }
                    className="w-full accent-neon-cyan cursor-pointer"
                  />
                </div>
              </div>

              {/* COLOR STOPS LIST */}
              <div className="space-y-1.5 bg-black/40 p-2.5 rounded-xl border border-white/10">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-gray-300 font-bold">Gradient Color Stops</span>
                  <button
                    type="button"
                    onClick={() => {
                      const stops = element.textGradient?.colorStops || [
                        { color: "#00f5ff", offset: 0 },
                        { color: "#a855f7", offset: 100 },
                      ];
                      if (stops.length < 5) {
                        updateProp("textGradient", {
                          ...(element.textGradient || { enabled: true, type: "linear", angle: 90 }),
                          colorStops: [...stops, { color: "#ff006e", offset: 100 }],
                        });
                      }
                    }}
                    className="px-2 py-0.5 rounded bg-neon-cyan/20 border border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan hover:text-black transition-all flex items-center gap-1 text-[9px]"
                  >
                    <Plus className="w-3 h-3" /> Add Stop
                  </button>
                </div>

                {(
                  element.textGradient?.colorStops || [
                    { color: "#00f5ff", offset: 0 },
                    { color: "#a855f7", offset: 100 },
                  ]
                ).map((stop, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="color"
                      value={stop.color}
                      onChange={(e) => {
                        const stops = [...(element.textGradient?.colorStops || [])];
                        stops[idx] = { ...stops[idx], color: e.target.value };
                        updateProp("textGradient", {
                          ...(element.textGradient || { enabled: true, type: "linear", angle: 90 }),
                          colorStops: stops,
                        });
                      }}
                      className="w-6 h-6 rounded-md cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={stop.offset}
                      onChange={(e) => {
                        const stops = [...(element.textGradient?.colorStops || [])];
                        stops[idx] = { ...stops[idx], offset: parseInt(e.target.value) };
                        updateProp("textGradient", {
                          ...(element.textGradient || { enabled: true, type: "linear", angle: 90 }),
                          colorStops: stops,
                        });
                      }}
                      className="flex-1 accent-neon-cyan cursor-pointer"
                    />
                    <span className="text-[10px] text-gray-400 w-8 text-right">{stop.offset}%</span>
                    {(element.textGradient?.colorStops || []).length > 2 && (
                      <button
                        type="button"
                        onClick={() => {
                          const stops = (element.textGradient?.colorStops || []).filter(
                            (_, i) => i !== idx
                          );
                          updateProp("textGradient", {
                            ...(element.textGradient || { enabled: true, type: "linear", angle: 90 }),
                            colorStops: stops,
                          });
                        }}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BLEND MODE & OPACITY */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
            <div>
              <label className="text-[10px] text-gray-400 block mb-1">Blend Mode</label>
              <select
                value={element.blendMode || "normal"}
                onChange={(e) => updateProp("blendMode", e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl px-2 py-1.5 text-white text-xs focus:border-neon-cyan focus:outline-none"
              >
                <option value="normal">Normal</option>
                <option value="multiply">Multiply</option>
                <option value="screen">Screen</option>
                <option value="overlay">Overlay</option>
                <option value="soft-light">Soft Light</option>
                <option value="hard-light">Hard Light</option>
                <option value="difference">Difference</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                <span>Opacity</span>
                <span className="text-neon-cyan">{Math.round((element.opacity ?? 1) * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={element.opacity ?? 1}
                onChange={(e) => updateProp("opacity", parseFloat(e.target.value))}
                className="w-full accent-neon-cyan cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: OUTLINE STROKE, SHADOW & NEON GLOW */}
      {activeTab === "stroke" && (
        <div className="space-y-4 font-mono text-xs">
          {/* TEXT STROKE / OUTLINE SECTION */}
          <div className="space-y-2 bg-black/40 p-3 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-gray-200 font-bold text-xs">Text Outline / Stroke</span>
              <input
                type="checkbox"
                checked={element.textStroke?.enabled || false}
                onChange={(e) =>
                  updateProp("textStroke", {
                    ...(element.textStroke || { color: "#00f5ff", width: 2, opacity: 1 }),
                    enabled: e.target.checked,
                  })
                }
                className="w-4 h-4 accent-neon-cyan cursor-pointer rounded"
              />
            </div>

            {element.textStroke?.enabled && (
              <div className="space-y-2 pt-1">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Stroke Color</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={element.textStroke.color || "#00f5ff"}
                        onChange={(e) =>
                          updateProp("textStroke", { ...element.textStroke, color: e.target.value })
                        }
                        className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={element.textStroke.color || "#00f5ff"}
                        onChange={(e) =>
                          updateProp("textStroke", { ...element.textStroke, color: e.target.value })
                        }
                        className="w-full bg-black/60 border border-white/10 rounded-lg px-2 py-1 text-white text-[11px]"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                      <span>Width</span>
                      <span className="text-neon-cyan">{element.textStroke.width || 1}px</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      value={element.textStroke.width || 1}
                      onChange={(e) =>
                        updateProp("textStroke", {
                          ...element.textStroke,
                          width: parseInt(e.target.value),
                        })
                      }
                      className="w-full accent-neon-cyan cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* NEON GLOW ENGINE */}
          <div className="space-y-2 bg-black/40 p-3 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-gray-200 font-bold text-xs flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-neon-pink" /> Neon & Outer Glow
              </span>
              <input
                type="checkbox"
                checked={element.textGlow?.enabled || false}
                onChange={(e) =>
                  updateProp("textGlow", {
                    ...(element.textGlow || { color: "#ff006e", blur: 15, type: "neon" }),
                    enabled: e.target.checked,
                  })
                }
                className="w-4 h-4 accent-neon-pink cursor-pointer rounded"
              />
            </div>

            {element.textGlow?.enabled && (
              <div className="space-y-2.5 pt-1">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Glow Type</label>
                    <select
                      value={element.textGlow.type || "neon"}
                      onChange={(e) =>
                        updateProp("textGlow", { ...element.textGlow, type: e.target.value as any })
                      }
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-2 py-1.5 text-white text-xs"
                    >
                      <option value="soft">Soft Ambient</option>
                      <option value="neon">Intense Neon</option>
                      <option value="outer">Outer Aura</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Glow Color</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={element.textGlow.color || "#ff006e"}
                        onChange={(e) =>
                          updateProp("textGlow", { ...element.textGlow, color: e.target.value })
                        }
                        className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={element.textGlow.color || "#ff006e"}
                        onChange={(e) =>
                          updateProp("textGlow", { ...element.textGlow, color: e.target.value })
                        }
                        className="w-full bg-black/60 border border-white/10 rounded-lg px-2 py-1 text-white text-[11px]"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-gray-400">
                    <span>Glow Radius / Blur</span>
                    <span className="text-neon-pink">{element.textGlow.blur || 15}px</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="60"
                    value={element.textGlow.blur || 15}
                    onChange={(e) =>
                      updateProp("textGlow", { ...element.textGlow, blur: parseInt(e.target.value) })
                    }
                    className="w-full accent-neon-pink cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          {/* TEXT DROP SHADOW */}
          <div className="space-y-2 bg-black/40 p-3 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-gray-200 font-bold text-xs">Drop Shadow</span>
              <input
                type="checkbox"
                checked={element.textShadow?.enabled || false}
                onChange={(e) =>
                  updateProp("textShadow", {
                    ...(element.textShadow || {
                      color: "rgba(0,0,0,0.8)",
                      blur: 10,
                      offsetX: 2,
                      offsetY: 4,
                    }),
                    enabled: e.target.checked,
                  })
                }
                className="w-4 h-4 accent-neon-cyan cursor-pointer rounded"
              />
            </div>

            {element.textShadow?.enabled && (
              <div className="space-y-2 pt-1">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Shadow Color</label>
                    <input
                      type="text"
                      value={element.textShadow.color || "rgba(0,0,0,0.8)"}
                      onChange={(e) =>
                        updateProp("textShadow", { ...element.textShadow, color: e.target.value })
                      }
                      className="w-full bg-black/60 border border-white/10 rounded-lg px-2 py-1 text-white text-[11px]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                      <span>Blur</span>
                      <span className="text-neon-cyan">{element.textShadow.blur || 10}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={element.textShadow.blur || 10}
                      onChange={(e) =>
                        updateProp("textShadow", {
                          ...element.textShadow,
                          blur: parseInt(e.target.value),
                        })
                      }
                      className="w-full accent-neon-cyan cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                      <span>Offset X</span>
                      <span className="text-neon-cyan">{element.textShadow.offsetX || 0}px</span>
                    </div>
                    <input
                      type="range"
                      min="-30"
                      max="30"
                      value={element.textShadow.offsetX || 0}
                      onChange={(e) =>
                        updateProp("textShadow", {
                          ...element.textShadow,
                          offsetX: parseInt(e.target.value),
                        })
                      }
                      className="w-full accent-neon-cyan cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                      <span>Offset Y</span>
                      <span className="text-neon-cyan">{element.textShadow.offsetY || 0}px</span>
                    </div>
                    <input
                      type="range"
                      min="-30"
                      max="30"
                      value={element.textShadow.offsetY || 0}
                      onChange={(e) =>
                        updateProp("textShadow", {
                          ...element.textShadow,
                          offsetY: parseInt(e.target.value),
                        })
                      }
                      className="w-full accent-neon-cyan cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: 3D EXTRUSION, CURVED TEXT & EFFECTS */}
      {activeTab === "effects" && (
        <div className="space-y-4 font-mono text-xs">
          {/* 3D EXTRUSION CONTROLS */}
          <div className="space-y-2.5 bg-black/40 p-3 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-gray-200 font-bold text-xs flex items-center gap-1.5">
                <Box className="w-3.5 h-3.5 text-amber-400" /> 3D Text Extrusion
              </span>
              <input
                type="checkbox"
                checked={element.textEffect?.threeD?.enabled || false}
                onChange={(e) =>
                  updateProp("textEffect", {
                    ...(element.textEffect || { preset: "3d" }),
                    preset: "3d",
                    threeD: {
                      ...(element.textEffect?.threeD || {
                        enabled: true,
                        depth: 6,
                        direction: "diagonal-right",
                        color: "#1e293b",
                        shadowColor: "#000000",
                        opacity: 0.9,
                      }),
                      enabled: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 accent-amber-400 cursor-pointer rounded"
              />
            </div>

            {element.textEffect?.threeD?.enabled && (
              <div className="space-y-2 pt-1">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                      <span>Depth</span>
                      <span className="text-amber-400">
                        {element.textEffect.threeD.depth || 6}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      value={element.textEffect.threeD.depth || 6}
                      onChange={(e) =>
                        updateProp("textEffect", {
                          ...element.textEffect,
                          threeD: {
                            ...element.textEffect!.threeD!,
                            depth: parseInt(e.target.value),
                          },
                        })
                      }
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">3D Direction</label>
                    <select
                      value={element.textEffect.threeD.direction || "diagonal-right"}
                      onChange={(e) =>
                        updateProp("textEffect", {
                          ...element.textEffect,
                          threeD: {
                            ...element.textEffect!.threeD!,
                            direction: e.target.value as any,
                          },
                        })
                      }
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-2 py-1.5 text-white text-[11px]"
                    >
                      <option value="top">Top</option>
                      <option value="bottom">Bottom</option>
                      <option value="left">Left</option>
                      <option value="right">Right</option>
                      <option value="diagonal-right">Diagonal Right</option>
                      <option value="diagonal-left">Diagonal Left</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Extrusion Color</label>
                    <input
                      type="color"
                      value={element.textEffect.threeD.color || "#1e293b"}
                      onChange={(e) =>
                        updateProp("textEffect", {
                          ...element.textEffect,
                          threeD: { ...element.textEffect!.threeD!, color: e.target.value },
                        })
                      }
                      className="w-full h-7 rounded-lg cursor-pointer bg-transparent border border-white/10"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Shadow Color</label>
                    <input
                      type="color"
                      value={element.textEffect.threeD.shadowColor || "#000000"}
                      onChange={(e) =>
                        updateProp("textEffect", {
                          ...element.textEffect,
                          threeD: { ...element.textEffect!.threeD!, shadowColor: e.target.value },
                        })
                      }
                      className="w-full h-7 rounded-lg cursor-pointer bg-transparent border border-white/10"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CURVED TEXT / ARC ENGINE */}
          <div className="space-y-2 bg-black/40 p-3 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-gray-200 font-bold text-xs flex items-center gap-1.5">
                <CircleDot className="w-3.5 h-3.5 text-neon-cyan" /> Curved Text & Arc
              </span>
              <input
                type="checkbox"
                checked={element.textCurve?.enabled || false}
                onChange={(e) =>
                  updateProp("textCurve", {
                    ...(element.textCurve || { enabled: true, curveType: "arc-up", amount: 40 }),
                    enabled: e.target.checked,
                  })
                }
                className="w-4 h-4 accent-neon-cyan cursor-pointer rounded"
              />
            </div>

            {element.textCurve?.enabled && (
              <div className="space-y-2 pt-1">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Curve Pattern</label>
                    <select
                      value={element.textCurve.curveType || "arc-up"}
                      onChange={(e) =>
                        updateProp("textCurve", {
                          ...element.textCurve,
                          curveType: e.target.value as any,
                        })
                      }
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-2 py-1.5 text-white text-[11px]"
                    >
                      <option value="arc-up">Arc Up</option>
                      <option value="arc-down">Arc Down</option>
                      <option value="circle">Full Circle</option>
                      <option value="wave">Sine Wave</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                      <span>Curvature</span>
                      <span className="text-neon-cyan">{element.textCurve.amount || 0}%</span>
                    </div>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={element.textCurve.amount || 0}
                      onChange={(e) =>
                        updateProp("textCurve", {
                          ...element.textCurve,
                          amount: parseInt(e.target.value),
                        })
                      }
                      className="w-full accent-neon-cyan cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: BADGE / TEXT BOX BACKGROUND */}
      {activeTab === "box" && (
        <div className="space-y-4 font-mono text-xs">
          <div className="space-y-3 bg-black/40 p-3 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-gray-200 font-bold text-xs flex items-center gap-1.5">
                <Box className="w-3.5 h-3.5 text-emerald-400" /> Badge Box Background
              </span>
              <input
                type="checkbox"
                checked={element.textBg?.enabled || false}
                onChange={(e) =>
                  updateProp("textBg", {
                    ...(element.textBg || {
                      enabled: true,
                      color: "rgba(0,0,0,0.6)",
                      paddingTop: 8,
                      paddingRight: 16,
                      paddingBottom: 8,
                      paddingLeft: 16,
                      borderRadius: 12,
                    }),
                    enabled: e.target.checked,
                  })
                }
                className="w-4 h-4 accent-emerald-400 cursor-pointer rounded"
              />
            </div>

            {element.textBg?.enabled && (
              <div className="space-y-3 pt-1">
                {/* BACKGROUND TYPE & COLOR */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Box Style</label>
                    <select
                      value={element.textBg.type || "solid"}
                      onChange={(e) =>
                        updateProp("textBg", { ...element.textBg, type: e.target.value as any })
                      }
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-2 py-1.5 text-white text-[11px]"
                    >
                      <option value="solid">Solid Background</option>
                      <option value="glass">Glassmorphic Blur</option>
                      <option value="neon">Neon Ambient Box</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Box Color</label>
                    <input
                      type="color"
                      value={element.textBg.color || "#000000"}
                      onChange={(e) =>
                        updateProp("textBg", { ...element.textBg, color: e.target.value })
                      }
                      className="w-full h-8 rounded-xl cursor-pointer bg-transparent border border-white/10"
                    />
                  </div>
                </div>

                {/* CORNER RADIUS */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-gray-400">
                    <span>Corner Radius</span>
                    <span className="text-emerald-400">{element.textBg.borderRadius || 8}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    value={element.textBg.borderRadius || 8}
                    onChange={(e) =>
                      updateProp("textBg", {
                        ...element.textBg,
                        borderRadius: parseInt(e.target.value),
                      })
                    }
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                </div>

                {/* PADDING */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-gray-400">
                    <span>Box Padding</span>
                    <span className="text-emerald-400">{element.textBg.padding || 8}px</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="60"
                    value={element.textBg.padding || 8}
                    onChange={(e) =>
                      updateProp("textBg", {
                        ...element.textBg,
                        padding: parseInt(e.target.value),
                      })
                    }
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

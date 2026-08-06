import React, { useState } from "react";
import { useStudio } from "../../../context/StudioContext";
import {
  hexToRgb,
  hexToHsl,
  hexToCmyk,
  checkWcagContrast,
  generateAiPaletteSuggestion,
} from "../../../utils/colorUtils";
import {
  Palette,
  Copy,
  Check,
  Plus,
  Trash2,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Sliders,
  Layers,
  ChevronRight,
} from "lucide-react";

export const ColorSystemSection: React.FC = () => {
  const { activeBrandKit, updateActiveBrandKit, addNotification } = useStudio();

  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [activeColorKey, setActiveColorKey] = useState<string>("primary");

  // Gradient Creator state
  const [gradType, setGradType] = useState<"linear" | "radial">("linear");
  const [gradAngle, setGradAngle] = useState(135);
  const [gradColor1, setGradColor1] = useState(activeBrandKit.colors.primary);
  const [gradColor2, setGradColor2] = useState(activeBrandKit.colors.secondary);

  // AI Suggestions
  const [aiSuggestions, setAiSuggestions] = useState<
    { name: string; colors: string[] }[]
  >([]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(`${label}:${text}`);
    setTimeout(() => setCopiedFormat(null), 1500);
  };

  const handleColorChange = (key: string, value: string) => {
    updateActiveBrandKit({
      colors: {
        ...activeBrandKit.colors,
        [key]: value,
      },
      colorHistory: Array.from(new Set([value, ...activeBrandKit.colorHistory])).slice(0, 10),
    });
  };

  const handleGenerateAiPalettes = () => {
    const suggested = generateAiPaletteSuggestion(
      activeBrandKit.brandName,
      activeBrandKit.description
    );
    setAiSuggestions(suggested);
    addNotification("AI Palettes Generated", "Generated 3 cohesive color palettes based on brand keywords", "success");
  };

  const applySuggestedPalette = (colors: string[]) => {
    if (colors.length >= 4) {
      updateActiveBrandKit({
        colors: {
          ...activeBrandKit.colors,
          primary: colors[0],
          secondary: colors[1],
          accent: colors[2],
          background: colors[3],
        },
      });
      addNotification("Palette Applied", "Updated brand colors with AI suggested palette", "success");
    }
  };

  const handleSaveCustomPalette = () => {
    const newPal = {
      id: `pal-${Date.now()}`,
      name: `Palette ${activeBrandKit.customPalettes.length + 1}`,
      colors: [
        activeBrandKit.colors.primary,
        activeBrandKit.colors.secondary,
        activeBrandKit.colors.accent,
        activeBrandKit.colors.background,
        activeBrandKit.colors.surface,
      ],
    };
    updateActiveBrandKit({
      customPalettes: [...activeBrandKit.customPalettes, newPal],
    });
    addNotification("Palette Saved", "Saved current color set to custom palettes", "success");
  };

  const handleDeleteCustomPalette = (id: string) => {
    updateActiveBrandKit({
      customPalettes: activeBrandKit.customPalettes.filter((p) => p.id !== id),
    });
  };

  const cssGradientCode =
    gradType === "linear"
      ? `linear-gradient(${gradAngle}deg, ${gradColor1}, ${gradColor2})`
      : `radial-gradient(circle, ${gradColor1}, ${gradColor2})`;

  // Calculate WCAG Ratings
  const contrastVsBg = checkWcagContrast(
    activeBrandKit.colors.text,
    activeBrandKit.colors.background
  );
  const contrastVsPrimary = checkWcagContrast(
    "#ffffff",
    activeBrandKit.colors.primary
  );

  const BRAND_COLOR_ROLES = [
    { key: "primary", label: "Primary Brand Color", desc: "Main brand CTA & key accents" },
    { key: "secondary", label: "Secondary Color", desc: "Gradient transitions & highlights" },
    { key: "accent", label: "Accent Color", desc: "Badges, pills & focus elements" },
    { key: "background", label: "Background Color", desc: "Main dark/light canvas background" },
    { key: "surface", label: "Surface / Card Color", desc: "Card containers & modal panels" },
    { key: "text", label: "Text / Foreground", desc: "Primary typography color" },
    { key: "success", label: "Success Green", desc: "Confirmation & positive metrics" },
    { key: "warning", label: "Warning Amber", desc: "Alerts & pending notifications" },
    { key: "error", label: "Error Red", desc: "Errors, validation & destructive actions" },
    { key: "info", label: "Information Blue", desc: "Informational callouts & tooltips" },
  ];

  return (
    <div className="p-6 rounded-3xl bg-neutral-900 border border-white/10 space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="font-display font-bold text-base tracking-wider uppercase text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-neon-cyan" /> Multi-Format Color Management & Accessibility
          </h2>
          <p className="text-xs text-gray-400 font-mono mt-0.5">
            HEX, RGB, RGBA, HSL, CMYK color spaces, interactive gradient builder, WCAG contrast analyzer, and AI palettes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleGenerateAiPalettes}
            className="px-4 py-2 rounded-xl bg-neon-purple/10 hover:bg-neon-purple/20 text-neon-purple border border-neon-purple/30 text-xs font-mono font-bold flex items-center gap-2 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" /> AI Palette Suggestions
          </button>
        </div>
      </div>

      {/* 10 COLOR ROLES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {BRAND_COLOR_ROLES.map(({ key, label, desc }) => {
          const hex = (activeBrandKit.colors as any)[key] || "#000000";
          const rgb = hexToRgb(hex);
          const hsl = hexToHsl(hex);
          const cmyk = hexToCmyk(hex);

          return (
            <div
              key={key}
              className={`p-4 rounded-2xl bg-black border space-y-3 transition-all ${
                activeColorKey === key
                  ? "border-neon-cyan shadow-[0_0_15px_rgba(0,245,255,0.2)]"
                  : "border-white/10 hover:border-white/20"
              }`}
              onClick={() => setActiveColorKey(key)}
            >
              {/* SWATCH HEADER */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-gray-400 uppercase font-bold truncate">
                  {label}
                </span>
                <input
                  type="color"
                  value={hex}
                  onChange={(e) => handleColorChange(key, e.target.value)}
                  className="w-6 h-6 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                />
              </div>

              {/* LIVE SWATCH BOX */}
              <div
                style={{ backgroundColor: hex }}
                className="h-20 rounded-xl border border-white/10 flex items-center justify-center relative group shadow-md cursor-pointer"
                onClick={() => copyToClipboard(hex, `HEX:${key}`)}
              >
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-2.5 py-1 rounded-lg text-[10px] font-mono text-white flex items-center gap-1">
                  {copiedFormat?.startsWith(`HEX:${key}`) ? (
                    <>
                      <Check className="w-3 h-3 text-neon-cyan" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-gray-300" /> Copy HEX
                    </>
                  )}
                </div>
              </div>

              {/* MULTI-FORMAT CODES */}
              <div className="space-y-1 font-mono text-[10px] bg-neutral-950 p-2.5 rounded-xl border border-white/5 text-gray-300">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-bold">HEX</span>
                  <span className="font-bold text-white uppercase">{hex}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-bold">RGB</span>
                  <span>{rgb.r}, {rgb.g}, {rgb.b}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-bold">HSL</span>
                  <span>{hsl.h}°, {hsl.s}%, {hsl.l}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-bold">CMYK</span>
                  <span>{cmyk.c}%, {cmyk.m}%, {cmyk.y}%, {cmyk.k}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* LOWER ROW: ACCESSIBILITY CHECKER & GRADIENT CREATOR */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* WCAG ACCESSIBILITY CONTRAST CHECKER */}
        <div className="p-5 rounded-2xl bg-black border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> WCAG 2.1 Accessibility Contrast Checker
            </h3>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold">
              Real-time Analysis
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            {/* SAMPLE 1: TEXT ON BACKGROUND */}
            <div className="p-4 rounded-xl border border-white/10 space-y-3" style={{ backgroundColor: activeBrandKit.colors.background }}>
              <div className="space-y-1">
                <span className="text-[10px] uppercase text-gray-400 block font-bold">
                  Text on Background
                </span>
                <p className="font-display text-lg font-bold" style={{ color: activeBrandKit.colors.text }}>
                  Sample Headline Text
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[10px]">
                <span className="text-gray-400">Ratio: <strong className="text-white">{contrastVsBg.ratio}:1</strong></span>
                <span
                  className={`px-2 py-0.5 rounded font-bold ${
                    contrastVsBg.passesAA
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {contrastVsBg.levelText}
                </span>
              </div>
            </div>

            {/* SAMPLE 2: WHITE TEXT ON PRIMARY CTA */}
            <div className="p-4 rounded-xl border border-white/10 space-y-3" style={{ backgroundColor: activeBrandKit.colors.primary }}>
              <div className="space-y-1">
                <span className="text-[10px] uppercase text-black/70 block font-bold">
                  White Text on Primary Button
                </span>
                <p className="font-display text-lg font-black text-white drop-shadow">
                  Action Button
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-black/10 text-[10px]">
                <span className="text-black/80">Ratio: <strong className="text-black">{contrastVsPrimary.ratio}:1</strong></span>
                <span
                  className={`px-2 py-0.5 rounded font-bold ${
                    contrastVsPrimary.passesAA
                      ? "bg-black/20 text-black"
                      : "bg-red-900/30 text-white"
                  }`}
                >
                  {contrastVsPrimary.levelText}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* INTERACTIVE GRADIENT CREATOR */}
        <div className="p-5 rounded-2xl bg-black border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-neon-purple" /> Interactive Gradient Builder
            </h3>
            <button
              type="button"
              onClick={() => copyToClipboard(cssGradientCode, "CSS_GRADIENT")}
              className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-[10px] font-mono font-bold flex items-center gap-1 transition-all"
            >
              {copiedFormat?.startsWith("CSS_GRADIENT") ? (
                <>
                  <Check className="w-3 h-3 text-neon-cyan" /> Copied CSS
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" /> Copy CSS
                </>
              )}
            </button>
          </div>

          {/* GRADIENT PREVIEW CANVAS */}
          <div
            style={{ background: cssGradientCode }}
            className="h-24 rounded-xl border border-white/15 shadow-inner flex items-center justify-center"
          >
            <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white font-mono text-xs font-bold border border-white/20">
              {gradType.toUpperCase()} {gradType === "linear" ? `${gradAngle}°` : "Radial"}
            </span>
          </div>

          {/* GRADIENT CONTROLS */}
          <div className="grid grid-cols-3 gap-3 font-mono text-xs">
            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 block uppercase">Type</label>
              <select
                value={gradType}
                onChange={(e) => setGradType(e.target.value as any)}
                className="w-full bg-neutral-900 border border-white/15 rounded-xl px-2 py-1.5 text-white focus:outline-none"
              >
                <option value="linear">Linear</option>
                <option value="radial">Radial</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 block uppercase">Color Stop 1</label>
              <div className="flex items-center gap-1 bg-neutral-900 border border-white/15 rounded-xl px-2 py-1">
                <input
                  type="color"
                  value={gradColor1}
                  onChange={(e) => setGradColor1(e.target.value)}
                  className="w-5 h-5 rounded cursor-pointer bg-transparent border-0 p-0"
                />
                <span className="text-[10px] text-gray-300 font-bold uppercase">{gradColor1}</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 block uppercase">Color Stop 2</label>
              <div className="flex items-center gap-1 bg-neutral-900 border border-white/15 rounded-xl px-2 py-1">
                <input
                  type="color"
                  value={gradColor2}
                  onChange={(e) => setGradColor2(e.target.value)}
                  className="w-5 h-5 rounded cursor-pointer bg-transparent border-0 p-0"
                />
                <span className="text-[10px] text-gray-300 font-bold uppercase">{gradColor2}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI SUGGESTED PALETTES DISPLAY */}
      {aiSuggestions.length > 0 && (
        <div className="p-5 rounded-2xl bg-neutral-950 border border-neon-purple/30 space-y-4 font-mono text-xs animate-fade-in">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h3 className="font-display font-bold text-xs uppercase text-neon-purple flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> AI Suggested Cohesive Palettes
            </h3>
            <button
              type="button"
              onClick={() => setAiSuggestions([])}
              className="text-gray-500 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiSuggestions.map((sug, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-black border border-white/10 space-y-2 hover:border-neon-purple transition-all"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white text-[11px]">{sug.name}</span>
                  <button
                    type="button"
                    onClick={() => applySuggestedPalette(sug.colors)}
                    className="px-2 py-0.5 rounded bg-neon-purple/20 text-neon-purple text-[10px] font-bold hover:bg-neon-purple/30"
                  >
                    Apply Palette
                  </button>
                </div>

                <div className="grid grid-cols-5 h-10 rounded-lg overflow-hidden border border-white/10">
                  {sug.colors.map((c, idx) => (
                    <div
                      key={idx}
                      style={{ backgroundColor: c }}
                      title={c}
                      className="h-full"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SAVED PALETTES */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-white/10 pt-4">
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-gray-400 font-bold uppercase">Saved Palettes:</span>
          <button
            type="button"
            onClick={handleSaveCustomPalette}
            className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-neon-cyan border border-neon-cyan/20 text-[11px] font-bold flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Save Current Palette
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
          {activeBrandKit.customPalettes.map((pal) => (
            <div
              key={pal.id}
              className="px-3 py-1.5 rounded-xl bg-black border border-white/10 flex items-center gap-2"
            >
              <div className="flex items-center -space-x-1">
                {pal.colors.slice(0, 4).map((c, i) => (
                  <div
                    key={i}
                    className="w-3.5 h-3.5 rounded-full border border-black"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <span className="text-white font-bold text-[11px]">{pal.name}</span>
              <button
                type="button"
                onClick={() => handleDeleteCustomPalette(pal.id)}
                className="text-gray-500 hover:text-red-400 text-xs"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from "react";
import { DesignState, CanvasPresetId, BackgroundType, DesignBackground } from "../../types/designer";
import { CANVAS_PRESETS } from "../../data/designerTemplates";
import {
  Monitor,
  Layout,
  Image as ImageIcon,
  Sparkles,
  Sliders,
  Shield,
  Upload,
  Palette,
  Layers,
  Zap,
  Check,
  Grid,
  Sun,
  Eye,
  SlidersHorizontal,
} from "lucide-react";

interface BackgroundInspectorProps {
  state: DesignState;
  onChange: (updatedState: DesignState) => void;
}

// PREMIUM BACKGROUND PRESETS BY CATEGORY
const PRESET_BACKGROUND_CATEGORIES: {
  category: "Portfolio & Cyber" | "Blog & Editorial" | "Store & Product" | "Services & Corporate";
  items: {
    name: string;
    description: string;
    bg: DesignBackground;
  }[];
}[] = [
  {
    category: "Portfolio & Cyber",
    items: [
      {
        name: "Cyber Neon Grid",
        description: "Dark cosmic void with cyan-purple linear gradient and grid overlay",
        bg: {
          type: "gradient",
          solidColor: "#020617",
          gradientFrom: "#020617",
          gradientVia: "#0b0f2a",
          gradientTo: "#12002e",
          gradientDirection: "to-br",
          gradientAngle: 135,
          pattern: "grid",
          patternColor: "#00f5ff",
          patternOpacity: 0.35,
          brightness: 100,
          contrast: 100,
          blur: 0,
        },
      },
      {
        name: "Neon Mesh Aura",
        description: "4-point radial mesh glow with electric cyan, purple, and magenta",
        bg: {
          type: "mesh",
          solidColor: "#0a0e27",
          gradientFrom: "#00f5ff",
          gradientTo: "#a855f7",
          gradientDirection: "to-r",
          meshColor1: "#00f5ff",
          meshColor2: "#a855f7",
          meshColor3: "#ff006e",
          meshColor4: "#020617",
          pattern: "dots",
          patternColor: "rgba(255,255,255,0.4)",
          patternOpacity: 0.2,
          brightness: 100,
          contrast: 100,
          blur: 0,
        },
      },
      {
        name: "Matrix Circuit",
        description: "Deep emerald matrix tint with circuit board vector pattern",
        bg: {
          type: "gradient",
          solidColor: "#021510",
          gradientFrom: "#021a12",
          gradientVia: "#00281a",
          gradientTo: "#00100a",
          gradientDirection: "to-b",
          pattern: "circuit",
          patternColor: "#00ff9d",
          patternOpacity: 0.4,
          brightness: 100,
          contrast: 100,
          blur: 0,
        },
      },
      {
        name: "Deep Cosmic Void",
        description: "Pure obsidian background with subtle radial center starburst glow",
        bg: {
          type: "radial",
          solidColor: "#000000",
          gradientFrom: "#101633",
          gradientVia: "#050814",
          gradientTo: "#000000",
          gradientDirection: "to-r",
          radialShape: "ellipse",
          radialPosition: "center",
          pattern: "noise",
          patternOpacity: 0.15,
          brightness: 100,
          contrast: 100,
          blur: 0,
        },
      },
    ],
  },
  {
    category: "Blog & Editorial",
    items: [
      {
        name: "Clean Charcoal Minimal",
        description: "Elegant dark charcoal with soft linear depth and noise texture",
        bg: {
          type: "gradient",
          solidColor: "#111318",
          gradientFrom: "#1a1d24",
          gradientTo: "#0d0e12",
          gradientDirection: "to-b",
          pattern: "noise",
          patternOpacity: 0.2,
          brightness: 100,
          contrast: 100,
          blur: 0,
        },
      },
      {
        name: "Sunset Horizon Glow",
        description: "Warm sunset crimson to deep indigo gradient for editorial stories",
        bg: {
          type: "gradient",
          solidColor: "#1c0b1e",
          gradientFrom: "#ff006e",
          gradientVia: "#8338ec",
          gradientTo: "#3a0ca3",
          gradientDirection: "to-br",
          pattern: "dots",
          patternColor: "rgba(255,255,255,0.3)",
          patternOpacity: 0.25,
          brightness: 100,
          contrast: 100,
          blur: 0,
        },
      },
      {
        name: "Soft Ocean Gradient",
        description: "Calm sapphire blue to emerald dark teal gradient",
        bg: {
          type: "gradient",
          solidColor: "#081c24",
          gradientFrom: "#0284c7",
          gradientVia: "#0f766e",
          gradientTo: "#064e3b",
          gradientDirection: "to-tr",
          pattern: "hexagons",
          patternColor: "rgba(255,255,255,0.2)",
          patternOpacity: 0.2,
          brightness: 100,
          contrast: 100,
          blur: 0,
        },
      },
    ],
  },
  {
    category: "Store & Product",
    items: [
      {
        name: "Product Stage Spotlight",
        description: "Radial top-spotlight glow focusing attention on showcase products",
        bg: {
          type: "radial",
          solidColor: "#05050a",
          gradientFrom: "#1e293b",
          gradientVia: "#0f172a",
          gradientTo: "#020617",
          radialShape: "ellipse",
          radialPosition: "top",
          gradientDirection: "to-b",
          pattern: "grid",
          patternColor: "rgba(255,255,255,0.15)",
          patternOpacity: 0.2,
          brightness: 100,
          contrast: 100,
          blur: 0,
        },
      },
      {
        name: "Dark Gold Luxury",
        description: "Rich amber gold to obsidian metallic dark tone for premium store items",
        bg: {
          type: "gradient",
          solidColor: "#141004",
          gradientFrom: "#d97706",
          gradientVia: "#451a03",
          gradientTo: "#090600",
          gradientDirection: "to-br",
          pattern: "cross",
          patternColor: "#ffb703",
          patternOpacity: 0.3,
          brightness: 100,
          contrast: 100,
          blur: 0,
        },
      },
      {
        name: "Radial Cyan Aura",
        description: "Intense central cyan spotlight with dark peripheral shadow vignette",
        bg: {
          type: "radial",
          solidColor: "#00101a",
          gradientFrom: "#00f5ff",
          gradientVia: "#003b4d",
          gradientTo: "#020813",
          radialShape: "circle",
          radialPosition: "center",
          gradientDirection: "to-r",
          pattern: "cyber",
          patternColor: "#00f5ff",
          patternOpacity: 0.3,
          brightness: 100,
          contrast: 100,
          blur: 0,
        },
      },
    ],
  },
  {
    category: "Services & Corporate",
    items: [
      {
        name: "High-Contrast Navy",
        description: "Deep corporate navy with crisp tech grid accent",
        bg: {
          type: "gradient",
          solidColor: "#030b1e",
          gradientFrom: "#1e1b4b",
          gradientTo: "#020617",
          gradientDirection: "to-b",
          pattern: "grid",
          patternColor: "#6366f1",
          patternOpacity: 0.3,
          brightness: 100,
          contrast: 100,
          blur: 0,
        },
      },
      {
        name: "Electric Violet Mesh",
        description: "Vibrant violet and amethyst gradient for modern service agencies",
        bg: {
          type: "mesh",
          solidColor: "#0f0728",
          gradientFrom: "#a855f7",
          gradientTo: "#6366f1",
          gradientDirection: "to-r",
          meshColor1: "#7c3aed",
          meshColor2: "#c084fc",
          meshColor3: "#3b82f6",
          meshColor4: "#09031a",
          pattern: "scanline",
          patternOpacity: 0.25,
          brightness: 100,
          contrast: 100,
          blur: 0,
        },
      },
    ],
  },
];

export const BackgroundInspector: React.FC<BackgroundInspectorProps> = ({ state, onChange }) => {
  const { background, width, height, preset } = state;
  const [selectedPresetTab, setSelectedPresetTab] = useState<string>("Portfolio & Cyber");

  const updateBackground = (updatedBg: Partial<DesignBackground>) => {
    onChange({
      ...state,
      background: { ...background, ...updatedBg },
    });
  };

  const handlePresetChange = (presetId: CanvasPresetId) => {
    const found = CANVAS_PRESETS.find((p) => p.id === presetId);
    if (found) {
      onChange({
        ...state,
        preset: presetId,
        width: found.width,
        height: found.height,
        safeMarginPct: found.safeMarginPct || 5,
        safeNote: found.safeNote,
      });
    } else {
      onChange({ ...state, preset: presetId });
    }
  };

  // Upload Custom Background Image
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateBackground({
            type: "image",
            imageUrl: event.target.result as string,
            imageOpacity: 1,
            imageBlur: 0,
            imageFit: "cover",
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 text-sm text-gray-300">
      {/* Canvas Dimensions & Ratio */}
      <div className="space-y-3 pb-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono uppercase text-neon-cyan font-bold flex items-center gap-1.5">
            <Monitor className="w-3.5 h-3.5" /> Platform Presets & Sizes
          </label>
          <span className="text-[10px] font-mono text-gray-400">{CANVAS_PRESETS.length} Presets</span>
        </div>

        <select
          value={preset}
          onChange={(e) => handlePresetChange(e.target.value as CanvasPresetId)}
          className="w-full bg-black/70 border border-white/20 rounded-xl px-3 py-2 text-white text-xs focus:border-neon-cyan focus:outline-none font-mono"
        >
          {Array.from(new Set(CANVAS_PRESETS.map((p) => p.platform))).map((plat) => (
            <optgroup key={plat} label={`── ${plat.toUpperCase()} ──`} className="bg-neutral-900 text-neon-cyan font-bold">
              {CANVAS_PRESETS.filter((p) => p.platform === plat).map((p) => (
                <option key={p.id} value={p.id} className="bg-black text-gray-200">
                  {p.name} — {p.width}×{p.height} ({p.aspectRatio})
                </option>
              ))}
            </optgroup>
          ))}
        </select>

        {/* ACTIVE PRESET DETAILS BADGE */}
        {(() => {
          const activePresetObj = CANVAS_PRESETS.find((p) => p.id === preset);
          if (!activePresetObj) return null;
          return (
            <div className="p-3 rounded-2xl bg-black/60 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-neon-cyan/20 border border-neon-cyan/40 text-neon-cyan font-mono text-[10px] font-bold uppercase">
                  {activePresetObj.platform}
                </span>
                <span className="text-[11px] font-mono text-gray-300 font-bold">
                  {width} × {height} px ({activePresetObj.aspectRatio})
                </span>
              </div>
              <p className="text-[11px] text-gray-400 line-clamp-2">{activePresetObj.description}</p>
              
              {/* Safe area note if present */}
              {activePresetObj.safeNote && (
                <div className="text-[10px] font-mono text-amber-300/90 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                  ⚠️ {activePresetObj.safeNote}
                </div>
              )}

              {/* Safe Area Toggle */}
              <div className="flex items-center justify-between pt-1 border-t border-white/5">
                <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1">
                  <Shield className="w-3 h-3 text-amber-400" /> Safe Area Margin Guide
                </span>
                <button
                  type="button"
                  onClick={() => onChange({ ...state, showSafeMargins: !state.showSafeMargins })}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-mono transition-all ${
                    state.showSafeMargins
                      ? "bg-amber-400/20 border border-amber-400/50 text-amber-300 font-bold"
                      : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"
                  }`}
                >
                  {state.showSafeMargins ? "ACTIVE ON CANVAS" : "SHOW GUIDE"}
                </button>
              </div>
            </div>
          );
        })()}

        {preset === "custom" && (
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-[11px] text-gray-400 font-mono block mb-1">Width (px)</label>
              <input
                type="number"
                min="200"
                max="3840"
                value={width}
                onChange={(e) => onChange({ ...state, width: parseInt(e.target.value) || 800 })}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-white text-xs focus:border-neon-cyan font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] text-gray-400 font-mono block mb-1">Height (px)</label>
              <input
                type="number"
                min="200"
                max="3840"
                value={height}
                onChange={(e) => onChange({ ...state, height: parseInt(e.target.value) || 600 })}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-white text-xs focus:border-neon-cyan font-mono"
              />
            </div>
          </div>
        )}
      </div>

      {/* BACKGROUND TYPE SELECTOR */}
      <div className="space-y-3 pb-4 border-b border-white/10">
        <label className="text-xs font-mono uppercase text-neon-cyan block font-bold flex items-center gap-1.5">
          <Layout className="w-3.5 h-3.5" /> Background Type
        </label>

        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-black/60 border border-white/10 text-[11px] font-mono">
          {(
            [
              { id: "gradient", label: "Linear" },
              { id: "radial", label: "Radial" },
              { id: "mesh", label: "Mesh Glow" },
              { id: "solid", label: "Solid" },
              { id: "image", label: "Image" },
              { id: "glass", label: "Glass" },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => updateBackground({ type: item.id as BackgroundType })}
              className={`py-1.5 rounded-lg uppercase transition-all ${
                background.type === item.id
                  ? "bg-neon-cyan/20 border border-neon-cyan/50 text-neon-cyan font-bold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* DYNAMIC BACKGROUND CONTROLS */}

      {/* 1. LINEAR GRADIENT CONTROLS */}
      {background.type === "gradient" && (
        <div className="space-y-4 pb-4 border-b border-white/10">
          <label className="text-xs font-mono uppercase text-neon-cyan block font-bold">
            Gradient Color Stops
          </label>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] text-gray-400 font-mono block mb-1">Start Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={background.gradientFrom || "#020617"}
                  onChange={(e) => updateBackground({ gradientFrom: e.target.value })}
                  className="w-8 h-8 rounded-lg bg-transparent border border-white/20 cursor-pointer"
                />
                <span className="text-[10px] font-mono uppercase text-gray-300">
                  {background.gradientFrom || "#020617"}
                </span>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-gray-400 font-mono block mb-1">Middle Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={background.gradientVia || "#0b0f2a"}
                  onChange={(e) => updateBackground({ gradientVia: e.target.value })}
                  className="w-8 h-8 rounded-lg bg-transparent border border-white/20 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => updateBackground({ gradientVia: background.gradientVia ? undefined : "#0b0f2a" })}
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                    background.gradientVia ? "bg-neon-cyan/20 text-neon-cyan border-neon-cyan/40" : "bg-white/5 text-gray-500 border-white/10"
                  }`}
                >
                  {background.gradientVia ? "ON" : "OFF"}
                </button>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-gray-400 font-mono block mb-1">End Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={background.gradientTo || "#0f172a"}
                  onChange={(e) => updateBackground({ gradientTo: e.target.value })}
                  className="w-8 h-8 rounded-lg bg-transparent border border-white/20 cursor-pointer"
                />
                <span className="text-[10px] font-mono uppercase text-gray-300">
                  {background.gradientTo || "#0f172a"}
                </span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] text-gray-400 font-mono">Gradient Angle ({background.gradientAngle ?? 135}°)</label>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={background.gradientAngle ?? 135}
              onChange={(e) => updateBackground({ gradientAngle: parseInt(e.target.value) })}
              className="w-full accent-neon-cyan"
            />
          </div>
        </div>
      )}

      {/* 2. RADIAL GRADIENT CONTROLS */}
      {background.type === "radial" && (
        <div className="space-y-4 pb-4 border-b border-white/10">
          <label className="text-xs font-mono uppercase text-neon-cyan block font-bold">
            Radial Spotlight Controls
          </label>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-gray-400 font-mono block mb-1">Center Color</label>
              <input
                type="color"
                value={background.gradientFrom || "#00f5ff"}
                onChange={(e) => updateBackground({ gradientFrom: e.target.value })}
                className="w-full h-8 rounded-lg bg-transparent border border-white/20 cursor-pointer"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-400 font-mono block mb-1">Outer Shadow Color</label>
              <input
                type="color"
                value={background.gradientTo || "#020617"}
                onChange={(e) => updateBackground({ gradientTo: e.target.value })}
                className="w-full h-8 rounded-lg bg-transparent border border-white/20 cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-gray-400 font-mono block mb-1">Position</label>
              <select
                value={background.radialPosition || "center"}
                onChange={(e) => updateBackground({ radialPosition: e.target.value as any })}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-2 py-1.5 text-xs text-white"
              >
                <option value="center">Center</option>
                <option value="top">Top Stage</option>
                <option value="bottom">Bottom Stage</option>
                <option value="top-left">Top Left</option>
                <option value="bottom-right">Bottom Right</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-gray-400 font-mono block mb-1">Radial Shape</label>
              <select
                value={background.radialShape || "circle"}
                onChange={(e) => updateBackground({ radialShape: e.target.value as any })}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-2 py-1.5 text-xs text-white"
              >
                <option value="circle">Circle</option>
                <option value="ellipse">Ellipse</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* 3. MESH GRADIENT CONTROLS */}
      {background.type === "mesh" && (
        <div className="space-y-4 pb-4 border-b border-white/10">
          <label className="text-xs font-mono uppercase text-neon-cyan block font-bold">
            4-Point Mesh Colors
          </label>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-gray-400 font-mono block mb-1">Top-Left Mesh</label>
              <input
                type="color"
                value={background.meshColor1 || "#00f5ff"}
                onChange={(e) => updateBackground({ meshColor1: e.target.value })}
                className="w-full h-8 rounded-lg bg-transparent border border-white/20 cursor-pointer"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-400 font-mono block mb-1">Top-Right Mesh</label>
              <input
                type="color"
                value={background.meshColor2 || "#a855f7"}
                onChange={(e) => updateBackground({ meshColor2: e.target.value })}
                className="w-full h-8 rounded-lg bg-transparent border border-white/20 cursor-pointer"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-400 font-mono block mb-1">Bottom-Right Mesh</label>
              <input
                type="color"
                value={background.meshColor3 || "#ff006e"}
                onChange={(e) => updateBackground({ meshColor3: e.target.value })}
                className="w-full h-8 rounded-lg bg-transparent border border-white/20 cursor-pointer"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-400 font-mono block mb-1">Bottom-Left Base</label>
              <input
                type="color"
                value={background.meshColor4 || "#020617"}
                onChange={(e) => updateBackground({ meshColor4: e.target.value })}
                className="w-full h-8 rounded-lg bg-transparent border border-white/20 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* 4. SOLID COLOR CONTROLS */}
      {background.type === "solid" && (
        <div className="space-y-3 pb-4 border-b border-white/10">
          <label className="text-xs font-mono uppercase text-neon-cyan block font-bold">
            Solid Background Color
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={background.solidColor || "#0a0e27"}
              onChange={(e) => updateBackground({ solidColor: e.target.value })}
              className="w-10 h-10 rounded-xl bg-transparent border border-white/20 cursor-pointer"
            />
            <input
              type="text"
              value={background.solidColor || "#0a0e27"}
              onChange={(e) => updateBackground({ solidColor: e.target.value })}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-white font-mono text-xs"
            />
          </div>
        </div>
      )}

      {/* 5. IMAGE BACKGROUND CONTROLS */}
      {background.type === "image" && (
        <div className="space-y-4 pb-4 border-b border-white/10">
          <label className="text-xs font-mono uppercase text-neon-cyan block font-bold flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5" /> Upload Custom Background Image
          </label>

          <label className="p-4 rounded-2xl border-2 border-dashed border-white/20 hover:border-neon-cyan/60 bg-black/40 hover:bg-black/60 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer text-center group">
            <Upload className="w-5 h-5 text-neon-cyan group-hover:scale-110 transition-transform" />
            <span className="text-xs font-mono text-gray-300">Click or Drag & Drop Image File</span>
            <span className="text-[10px] text-gray-500 font-mono">PNG, JPG, WebP (Auto 1:1 High Quality)</span>
            <input type="file" accept="image/*" onChange={handleImageFileUpload} className="hidden" />
          </label>

          <div className="space-y-2">
            <label className="text-[11px] text-gray-400 font-mono block">Image URL fallback</label>
            <input
              type="text"
              placeholder="https://images.unsplash.com/..."
              value={background.imageUrl || ""}
              onChange={(e) => updateBackground({ imageUrl: e.target.value })}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-white text-xs font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-gray-400 font-mono block mb-1">Image Fit</label>
              <select
                value={background.imageFit || "cover"}
                onChange={(e) => updateBackground({ imageFit: e.target.value as any })}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-2 py-1 text-xs text-white font-mono"
              >
                <option value="cover">Cover (Fill)</option>
                <option value="contain">Contain (Fit)</option>
                <option value="fill">Stretch</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] text-gray-400 font-mono block mb-1">Position</label>
              <select
                value={background.imagePosition || "center"}
                onChange={(e) => updateBackground({ imagePosition: e.target.value as any })}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-2 py-1 text-xs text-white font-mono"
              >
                <option value="center">Center</option>
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* PATTERN & OVERLAY CONTROLS */}
      <div className="space-y-4 pb-4 border-b border-white/10">
        <label className="text-xs font-mono uppercase text-neon-cyan block font-bold flex items-center gap-1.5">
          <Grid className="w-3.5 h-3.5" /> Texture Patterns & Overlays
        </label>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-gray-400 font-mono block mb-1">Vector Pattern</label>
            <select
              value={background.pattern || "none"}
              onChange={(e) => updateBackground({ pattern: e.target.value as any })}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-2.5 py-1.5 text-white text-xs font-mono"
            >
              <option value="none">None</option>
              <option value="grid">Cyber Grid</option>
              <option value="scanline">CRT Scanline</option>
              <option value="dots">Dot Matrix</option>
              <option value="hexagons">Hex Lattice</option>
              <option value="circuit">Circuit Lines</option>
              <option value="cross">Crosshairs</option>
              <option value="cyber">Cyber Diamonds</option>
              <option value="noise">Film Grain Noise</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] text-gray-400 font-mono block mb-1">
              Pattern Opacity ({Math.round((background.patternOpacity ?? 0.3) * 100)}%)
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={background.patternOpacity ?? 0.3}
              onChange={(e) => updateBackground({ patternOpacity: parseFloat(e.target.value) })}
              className="w-full accent-neon-cyan"
            />
          </div>
        </div>

        {background.pattern !== "none" && (
          <div className="flex items-center gap-3">
            <label className="text-[11px] text-gray-400 font-mono">Pattern Color:</label>
            <input
              type="color"
              value={background.patternColor || "#00f5ff"}
              onChange={(e) => updateBackground({ patternColor: e.target.value })}
              className="w-6 h-6 rounded bg-transparent border border-white/20 cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* FILTER & ADJUSTMENT CONTROLS */}
      <div className="space-y-3 pb-4 border-b border-white/10">
        <label className="text-xs font-mono uppercase text-neon-cyan block font-bold flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5" /> Brightness & Contrast
        </label>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-gray-400 font-mono block mb-1">Brightness ({background.brightness ?? 100}%)</label>
            <input
              type="range"
              min="50"
              max="150"
              value={background.brightness ?? 100}
              onChange={(e) => updateBackground({ brightness: parseInt(e.target.value) })}
              className="w-full accent-neon-cyan"
            />
          </div>

          <div>
            <label className="text-[11px] text-gray-400 font-mono block mb-1">Contrast ({background.contrast ?? 100}%)</label>
            <input
              type="range"
              min="50"
              max="150"
              value={background.contrast ?? 100}
              onChange={(e) => updateBackground({ contrast: parseInt(e.target.value) })}
              className="w-full accent-neon-cyan"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] text-gray-400 font-mono block mb-1">Background Blur ({background.blur ?? 0}px)</label>
          <input
            type="range"
            min="0"
            max="30"
            value={background.blur ?? 0}
            onChange={(e) => updateBackground({ blur: parseInt(e.target.value) })}
            className="w-full accent-neon-cyan"
          />
        </div>
      </div>

      {/* PRESET BACKGROUND LIBRARY */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono uppercase text-neon-pink block font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Preset Background Library
          </label>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1 p-1 rounded-xl bg-black/60 border border-white/10 text-[10px] font-mono">
          {PRESET_BACKGROUND_CATEGORIES.map((cat) => (
            <button
              key={cat.category}
              type="button"
              onClick={() => setSelectedPresetTab(cat.category)}
              className={`px-2.5 py-1 rounded-lg uppercase transition-all ${
                selectedPresetTab === cat.category
                  ? "bg-neon-pink/20 border border-neon-pink/50 text-neon-pink font-bold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {cat.category.split(" ")[0]}
            </button>
          ))}
        </div>

        {/* Preset Cards Grid */}
        <div className="grid grid-cols-1 gap-2.5 max-h-[320px] overflow-y-auto pr-1">
          {PRESET_BACKGROUND_CATEGORIES.find((c) => c.category === selectedPresetTab)?.items.map((presetItem) => (
            <div
              key={presetItem.name}
              onClick={() => updateBackground(presetItem.bg)}
              className="p-3 rounded-2xl bg-black/40 border border-white/10 hover:border-neon-pink/60 hover:bg-neon-pink/10 transition-all cursor-pointer group flex items-start gap-3"
            >
              <div
                className="w-12 h-12 rounded-xl border border-white/20 shrink-0 shadow"
                style={{
                  background:
                    presetItem.bg.type === "gradient"
                      ? `linear-gradient(135deg, ${presetItem.bg.gradientFrom}, ${presetItem.bg.gradientTo})`
                      : presetItem.bg.type === "radial"
                      ? `radial-gradient(circle, ${presetItem.bg.gradientFrom}, ${presetItem.bg.gradientTo})`
                      : presetItem.bg.solidColor,
                }}
              />
              <div className="space-y-0.5">
                <h4 className="text-xs font-display font-bold text-white group-hover:text-neon-pink transition-colors">
                  {presetItem.name}
                </h4>
                <p className="text-[10px] text-gray-400 leading-tight">{presetItem.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

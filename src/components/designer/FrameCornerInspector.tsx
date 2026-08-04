import React, { useState } from "react";
import {
  CornerDecorationConfig,
  CornerStyle,
  DesignState,
  FrameConfig,
  FramePresetId,
  IndividualCornerConfig,
  CustomCornerPreset,
} from "../../types/designer";
import {
  CORNER_STYLE_LABELS,
  DEFAULT_CORNER_CONFIG,
  DEFAULT_FRAME_CONFIG,
} from "./FrameCornerDecorationRenderer";
import {
  Square,
  Shield,
  Sparkles,
  Bookmark,
  Copy,
  Plus,
  Trash2,
  Zap,
  RotateCw,
  Eye,
  EyeOff,
  Link,
  Unlink,
  Move,
  Layers,
  Palette,
  Check,
  RotateCcw,
  Sliders,
  SlidersHorizontal,
} from "lucide-react";

interface Props {
  state: DesignState;
  onChange: (newState: DesignState) => void;
}

export const FRAME_PRESET_OPTIONS: Array<{
  id: FramePresetId;
  name: string;
  category: string;
  description: string;
}> = [
  { id: "none", name: "No Outer Frame", category: "Standard", description: "Seamless canvas border without frame overlay" },
  { id: "cyber-ui", name: "Cyber UI Border", category: "Futuristic", description: "Neon cyan glow frame with tech notches" },
  { id: "blueprint", name: "Blueprint Wireframe", category: "Technical", description: "Engineering blue grid line border with ticks" },
  { id: "hud", name: "HUD Target Frame", category: "Futuristic", description: "Sci-Fi HUD border with status bar cutouts" },
  { id: "glassmorphism", name: "Frosted Glass Rim", category: "Modern", description: "Translucent backdrop blurred rim with highlights" },
  { id: "minimal", name: "Minimal Hairline", category: "Clean", description: "Ultra-crisp 1px subtle dark/light frame" },
  { id: "modern-corporate", name: "Modern Corporate", category: "Professional", description: "Polished dark slate frame with metallic trim" },
  { id: "neon", name: "Neon Dual Glow", category: "Glow", description: "Radiant multi-stop neon glow border" },
  { id: "gaming", name: "Esports Carbon", category: "Gaming", description: "High-contrast gaming frame with corner cuts" },
  { id: "premium-product", name: "Champagne Gold", category: "Luxury", description: "Luxury champagne gold gradient stroke frame" },
  { id: "technical-wireframe", name: "Tech Grid Frame", category: "Technical", description: "Crosshatched rule border with scale marks" },
  { id: "elegant-thin", name: "Double Hairline", category: "Classic", description: "Dual 1px floating offset hairline borders" },
  { id: "rounded-frames", name: "Smooth Curved Rim", category: "Modern", description: "Rounded corners with smooth ambient drop shadow" },
  { id: "double-borders", name: "Parallel Double Frame", category: "Classic", description: "Inner & outer parallel stroke borders" },
  { id: "gradient-borders", name: "Linear Gradient Rim", category: "Creative", description: "Custom dual-color linear gradient border" },
  { id: "animated-borders", name: "Shimmering Cyber Pulse", category: "Animated", description: "Dynamic pulsing shimmer frame (editor preview)" },
];

const PRESET_COLOR_SWATCHES = [
  "#00f5ff", // Neon Cyan
  "#a855f7", // Electric Purple
  "#f43f5e", // Hot Pink
  "#f59e0b", // Gold Amber
  "#10b981", // Emerald
  "#3b82f6", // Cobalt Blue
  "#ffffff", // Crisp White
  "#000000", // Onyx Black
];

export function FrameCornerInspector({ state, onChange }: Props) {
  const [activeSection, setActiveSection] = useState<"corners" | "frames" | "presets">("corners");
  const [selectedCornerPos, setSelectedCornerPos] = useState<"tl" | "tr" | "bl" | "br">("tl");
  const [presetCategoryFilter, setPresetCategoryFilter] = useState<string>("All");
  const [presetNameInput, setPresetNameInput] = useState("");

  const cornerCfg: CornerDecorationConfig = {
    ...DEFAULT_CORNER_CONFIG,
    ...state.cornerDecorations,
    enabled: state.cornerDecorations?.enabled ?? (state.showCyberBorders || false),
  };

  const frameCfg: FrameConfig = {
    ...DEFAULT_FRAME_CONFIG,
    ...state.frameConfig,
  };

  const customPresets: CustomCornerPreset[] = state.customCornerPresets || [];

  // Helper to update global corner decorations
  const updateCornerConfig = (updates: Partial<CornerDecorationConfig>) => {
    const updated = { ...cornerCfg, ...updates };
    onChange({
      ...state,
      showCyberBorders: updated.enabled,
      cornerDecorations: updated,
    });
  };

  // Helper to update a single specific corner position (TL, TR, BL, BR)
  const updateSingleCorner = (pos: "tl" | "tr" | "bl" | "br", updates: Partial<IndividualCornerConfig>) => {
    const currentPosConfig = cornerCfg[pos] || {};
    const updatedPosConfig = { ...currentPosConfig, ...updates };
    const updatedCornerConfig: CornerDecorationConfig = {
      ...cornerCfg,
      [pos]: updatedPosConfig,
    };
    onChange({
      ...state,
      cornerDecorations: updatedCornerConfig,
    });
  };

  // Helper to update frame config
  const updateFrameConfig = (updates: Partial<FrameConfig>) => {
    const updated = { ...frameCfg, ...updates };
    onChange({
      ...state,
      frameConfig: updated,
    });
  };

  // Save Current Corner Setup as Custom Preset
  const handleSaveCustomPreset = () => {
    if (!presetNameInput.trim()) return;
    const newPreset: CustomCornerPreset = {
      id: `corner-preset-${Date.now()}`,
      name: presetNameInput.trim(),
      config: JSON.parse(JSON.stringify(cornerCfg)),
    };
    onChange({
      ...state,
      customCornerPresets: [...customPresets, newPreset],
    });
    setPresetNameInput("");
  };

  const handleDeleteCustomPreset = (presetId: string) => {
    onChange({
      ...state,
      customCornerPresets: customPresets.filter((p) => p.id !== presetId),
    });
  };

  // Copy current active corner settings to all other corners
  const handleCopyActiveToAllCorners = () => {
    const activeDetails = cornerCfg.syncAllCorners
      ? cornerCfg
      : { ...cornerCfg, ...cornerCfg[selectedCornerPos] };
    
    const singleConfig: Partial<IndividualCornerConfig> = {
      enabled: activeDetails.enabled ?? true,
      style: activeDetails.style,
      size: activeDetails.size,
      length: activeDetails.length,
      thickness: activeDetails.thickness,
      angle: activeDetails.angle,
      inset: activeDetails.inset,
      offsetX: activeDetails.offsetX,
      offsetY: activeDetails.offsetY,
      radius: activeDetails.radius,
      color: activeDetails.color,
      borderColor: activeDetails.borderColor,
      glowColor: activeDetails.glowColor,
      glowSpread: activeDetails.glowSpread,
      opacity: activeDetails.opacity,
      blur: activeDetails.blur,
      borderStyle: activeDetails.borderStyle,
      outerShadowColor: activeDetails.outerShadowColor,
      outerShadowBlur: activeDetails.outerShadowBlur,
      outerShadowOffsetX: activeDetails.outerShadowOffsetX,
      outerShadowOffsetY: activeDetails.outerShadowOffsetY,
    };

    updateCornerConfig({
      tl: singleConfig,
      tr: singleConfig,
      bl: singleConfig,
      br: singleConfig,
    });
  };

  // Get active detail values depending on sync state vs single corner override
  const getActiveCornerVal = <K extends keyof IndividualCornerConfig>(
    key: K,
    defaultVal: IndividualCornerConfig[K]
  ): IndividualCornerConfig[K] => {
    if (cornerCfg.syncAllCorners) {
      return (cornerCfg[key] !== undefined ? cornerCfg[key] : defaultVal) as IndividualCornerConfig[K];
    }
    const posOverride = cornerCfg[selectedCornerPos];
    if (posOverride && posOverride[key] !== undefined) {
      return posOverride[key] as IndividualCornerConfig[K];
    }
    return (cornerCfg[key] !== undefined ? cornerCfg[key] : defaultVal) as IndividualCornerConfig[K];
  };

  const updateActiveCornerVal = <K extends keyof IndividualCornerConfig>(
    key: K,
    val: IndividualCornerConfig[K]
  ) => {
    if (cornerCfg.syncAllCorners) {
      updateCornerConfig({ [key]: val });
    } else {
      updateSingleCorner(selectedCornerPos, { [key]: val });
    }
  };

  // Categories for preset selector
  const presetCategories = ["All", "Futuristic", "Minimal", "Industrial", "Technical", "Gaming", "Luxury", "Modern", "Classic"];

  const filteredPresetEntries = Object.entries(CORNER_STYLE_LABELS).filter(([_, info]) => {
    if (presetCategoryFilter === "All") return true;
    return info.category.toLowerCase() === presetCategoryFilter.toLowerCase();
  });

  return (
    <div className="space-y-5 text-xs text-gray-300 font-mono">
      {/* MODULE HEADER TABS */}
      <div className="grid grid-cols-3 gap-1 p-1 rounded-2xl bg-black/60 border border-white/10 text-[11px]">
        <button
          onClick={() => setActiveSection("corners")}
          className={`py-2 rounded-xl uppercase transition-all flex items-center justify-center gap-1.5 ${
            activeSection === "corners"
              ? "bg-neon-cyan/20 border border-neon-cyan/50 text-neon-cyan font-bold shadow-[0_0_12px_rgba(0,245,255,0.2)]"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Square className="w-3.5 h-3.5" /> Corner Frame
        </button>
        <button
          onClick={() => setActiveSection("frames")}
          className={`py-2 rounded-xl uppercase transition-all flex items-center justify-center gap-1.5 ${
            activeSection === "frames"
              ? "bg-neon-purple/20 border border-neon-purple/50 text-neon-purple font-bold shadow-[0_0_12px_rgba(168,85,247,0.2)]"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Shield className="w-3.5 h-3.5" /> Outer Frame
        </button>
        <button
          onClick={() => setActiveSection("presets")}
          className={`py-2 rounded-xl uppercase transition-all flex items-center justify-center gap-1.5 ${
            activeSection === "presets"
              ? "bg-neon-pink/20 border border-neon-pink/50 text-neon-pink font-bold shadow-[0_0_12px_rgba(244,63,94,0.2)]"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" /> Presets
        </button>
      </div>

      {/* SECTION 1: CORNER FRAME DECORATIONS */}
      {activeSection === "corners" && (
        <div className="space-y-4">
          {/* MASTER ENABLE / DISABLE TOGGLE */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black/50 border border-white/10">
            <div className="space-y-0.5">
              <span className="font-bold text-white block uppercase text-[11px] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-neon-cyan" /> Corner Frames
              </span>
              <p className="text-[10px] text-gray-400">Customizable, modular & decoupled corner elements</p>
            </div>
            <button
              type="button"
              onClick={() => updateCornerConfig({ enabled: !cornerCfg.enabled })}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all flex items-center gap-1.5 ${
                cornerCfg.enabled
                  ? "bg-neon-cyan text-black shadow-[0_0_15px_rgba(0,245,255,0.4)]"
                  : "bg-white/5 text-gray-400 border border-white/10 hover:text-white"
              }`}
            >
              {cornerCfg.enabled ? <Check className="w-3.5 h-3.5" /> : null}
              {cornerCfg.enabled ? "ENABLED" : "DISABLED"}
            </button>
          </div>

          {cornerCfg.enabled && (
            <>
              {/* LINKED VS INDEPENDENT EDITING TOGGLE */}
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-gray-300 flex items-center gap-1.5">
                    {cornerCfg.syncAllCorners ? <Link className="w-3.5 h-3.5 text-neon-cyan" /> : <Unlink className="w-3.5 h-3.5 text-neon-purple" />}
                    Corner Sync Mode
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => updateCornerConfig({ syncAllCorners: true })}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
                        cornerCfg.syncAllCorners
                          ? "bg-neon-cyan/20 border border-neon-cyan/50 text-neon-cyan shadow-[0_0_10px_rgba(0,245,255,0.2)]"
                          : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"
                      }`}
                      title="Link all corners together for synchronized editing"
                    >
                      <Link className="w-3 h-3" /> LINKED
                    </button>
                    <button
                      type="button"
                      onClick={() => updateCornerConfig({ syncAllCorners: false })}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
                        !cornerCfg.syncAllCorners
                          ? "bg-neon-purple/20 border border-neon-purple/50 text-neon-purple shadow-[0_0_10px_rgba(168,85,247,0.2)]"
                          : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"
                      }`}
                      title="Disconnect corners for independent custom editing"
                    >
                      <Unlink className="w-3 h-3" /> DECOUPLED
                    </button>
                  </div>
                </div>

                {/* INTERACTIVE 4-CORNER SELECTOR DIAGRAM */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 uppercase font-bold">
                      Individual Corner Visibility & Selection
                    </span>
                    {!cornerCfg.syncAllCorners && (
                      <button
                        type="button"
                        onClick={handleCopyActiveToAllCorners}
                        className="text-[9px] text-neon-purple hover:underline flex items-center gap-1 font-mono"
                        title="Copy current active corner settings to all other corners"
                      >
                        <Copy className="w-3 h-3" /> Sync Active to All
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-2 rounded-2xl bg-black/60 border border-white/10 relative">
                    {(["tl", "tr", "bl", "br"] as const).map((pos) => {
                      const posCfg = cornerCfg[pos] || {};
                      const isVisible = posCfg.enabled !== false;
                      const isSelected = !cornerCfg.syncAllCorners && selectedCornerPos === pos;

                      const posLabels: Record<string, string> = {
                        tl: "TOP LEFT",
                        tr: "TOP RIGHT",
                        bl: "BOTTOM LEFT",
                        br: "BOTTOM RIGHT",
                      };

                      return (
                        <div
                          key={pos}
                          onClick={() => {
                            if (!cornerCfg.syncAllCorners) setSelectedCornerPos(pos);
                          }}
                          className={`p-2 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? "bg-neon-purple/20 border-neon-purple text-white shadow-[0_0_12px_rgba(168,85,247,0.3)]"
                              : "bg-white/5 border-white/10 hover:border-white/20 text-gray-300"
                          }`}
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-[10px] font-bold uppercase truncate">
                              {posLabels[pos]}
                            </span>
                            {isSelected && (
                              <span className="w-1.5 h-1.5 rounded-full bg-neon-purple animate-ping" />
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateSingleCorner(pos, { enabled: !isVisible });
                            }}
                            className={`p-1 rounded-lg transition-all ${
                              isVisible
                                ? "text-neon-cyan hover:bg-neon-cyan/20"
                                : "text-gray-500 hover:text-gray-300 hover:bg-white/10"
                            }`}
                            title={isVisible ? "Hide corner" : "Show corner"}
                          >
                            {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* CORNER STYLE PRESET LIBRARY (20+ VARIATIONS) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-gray-400 font-bold uppercase text-[10px]">
                    Corner Preset Library ({filteredPresetEntries.length} Options)
                  </label>
                  <span className="text-[10px] text-neon-cyan font-bold">
                    {CORNER_STYLE_LABELS[getActiveCornerVal("style", "cyber-hud")]?.name || "Custom"}
                  </span>
                </div>

                {/* Category Filters */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[9px]">
                  {presetCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setPresetCategoryFilter(cat)}
                      className={`px-2 py-0.5 rounded-lg shrink-0 uppercase transition-all ${
                        presetCategoryFilter === cat
                          ? "bg-neon-cyan/20 border border-neon-cyan/50 text-neon-cyan font-bold"
                          : "bg-white/5 text-gray-400 hover:text-white"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Preset Dropdown Select */}
                <select
                  value={getActiveCornerVal("style", "cyber-hud")}
                  onChange={(e) => updateActiveCornerVal("style", e.target.value as CornerStyle)}
                  className="w-full bg-black/80 border border-white/20 rounded-xl px-3 py-2 text-white text-xs font-mono focus:border-neon-cyan focus:outline-none"
                >
                  {filteredPresetEntries.map(([key, label]) => (
                    <option key={key} value={key} className="bg-neutral-900 text-gray-200">
                      [{label.category.toUpperCase()}] {label.name} — {label.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* DETAILED CUSTOMIZATION CONTROLS */}
              <div className="space-y-4 p-4 rounded-2xl bg-black/50 border border-white/10">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-[10px] text-white font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-neon-cyan" />
                    {cornerCfg.syncAllCorners ? "All Corners Properties" : `${selectedCornerPos.toUpperCase()} Corner Properties`}
                  </span>
                </div>

                {/* 1. SIZE & ARM LENGTH */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-gray-400">Corner Size</span>
                      <span className="text-neon-cyan font-bold">{getActiveCornerVal("size", 36)}px</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="120"
                      value={getActiveCornerVal("size", 36)}
                      onChange={(e) => updateActiveCornerVal("size", Number(e.target.value))}
                      className="w-full accent-neon-cyan h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-gray-400">Arm Length</span>
                      <span className="text-neon-cyan font-bold">{getActiveCornerVal("length", 36)}px</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="120"
                      value={getActiveCornerVal("length", 36)}
                      onChange={(e) => updateActiveCornerVal("length", Number(e.target.value))}
                      className="w-full accent-neon-cyan h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                {/* 2. STROKE THICKNESS & ROTATION ANGLE */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-gray-400">Thickness</span>
                      <span className="text-neon-cyan font-bold">{getActiveCornerVal("thickness", 3)}px</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="16"
                      value={getActiveCornerVal("thickness", 3)}
                      onChange={(e) => updateActiveCornerVal("thickness", Number(e.target.value))}
                      className="w-full accent-neon-cyan h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-gray-400">Rotation Angle</span>
                      <span className="text-neon-cyan font-bold">{getActiveCornerVal("angle", 0)}°</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      step="15"
                      value={getActiveCornerVal("angle", 0)}
                      onChange={(e) => updateActiveCornerVal("angle", Number(e.target.value))}
                      className="w-full accent-neon-cyan h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                {/* 3. EDGE INSET SPACING & CORNER RADIUS */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-gray-400">Edge Inset Margin</span>
                      <span className="text-neon-cyan font-bold">{getActiveCornerVal("inset", 12)}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="60"
                      value={getActiveCornerVal("inset", 12)}
                      onChange={(e) => updateActiveCornerVal("inset", Number(e.target.value))}
                      className="w-full accent-neon-cyan h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-gray-400">Corner Radius</span>
                      <span className="text-neon-cyan font-bold">{getActiveCornerVal("radius", 0)}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="40"
                      value={getActiveCornerVal("radius", 0)}
                      onChange={(e) => updateActiveCornerVal("radius", Number(e.target.value))}
                      className="w-full accent-neon-cyan h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                {/* 4. INDEPENDENT POSITION OFFSET (X & Y) */}
                <div className="space-y-1 pt-2 border-t border-white/5">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-gray-400 flex items-center gap-1">
                      <Move className="w-3 h-3 text-neon-purple" /> Position Offsets (X / Y)
                    </span>
                    <span className="text-neon-purple font-bold">
                      X: {getActiveCornerVal("offsetX", 0)}px | Y: {getActiveCornerVal("offsetY", 0)}px
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      value={getActiveCornerVal("offsetX", 0)}
                      onChange={(e) => updateActiveCornerVal("offsetX", Number(e.target.value))}
                      className="w-full accent-neon-purple h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                    />
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      value={getActiveCornerVal("offsetY", 0)}
                      onChange={(e) => updateActiveCornerVal("offsetY", Number(e.target.value))}
                      className="w-full accent-neon-purple h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                {/* 5. STROKE STYLE SELECTOR */}
                <div className="space-y-1 pt-2 border-t border-white/5">
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Stroke Line Style</span>
                  <div className="grid grid-cols-4 gap-1">
                    {(["solid", "dashed", "dotted", "double"] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => updateActiveCornerVal("borderStyle", st)}
                        className={`py-1 rounded-lg text-[9px] uppercase font-bold transition-all ${
                          getActiveCornerVal("borderStyle", "solid") === st
                            ? "bg-neon-cyan/20 border border-neon-cyan/50 text-neon-cyan"
                            : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 6. GLOW INTENSITY & OPACITY */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-gray-400">Glow Spread</span>
                      <span className="text-neon-cyan font-bold">{getActiveCornerVal("glowSpread", 8)}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="40"
                      value={getActiveCornerVal("glowSpread", 8)}
                      onChange={(e) => updateActiveCornerVal("glowSpread", Number(e.target.value))}
                      className="w-full accent-neon-cyan h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-gray-400">Opacity</span>
                      <span className="text-neon-cyan font-bold">
                        {Math.round((getActiveCornerVal("opacity", 1) || 1) * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.05"
                      value={getActiveCornerVal("opacity", 1)}
                      onChange={(e) => updateActiveCornerVal("opacity", Number(e.target.value))}
                      className="w-full accent-neon-cyan h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                {/* 7. COLOR PICKERS: MAIN COLOR, BORDER COLOR & GLOW COLOR */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[9px] text-gray-400 font-bold uppercase block">Corner Color</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={getActiveCornerVal("color", "#00f5ff")}
                          onChange={(e) => {
                            const hex = e.target.value;
                            updateActiveCornerVal("color", hex);
                          }}
                          className="w-7 h-7 rounded-lg bg-transparent border border-white/20 cursor-pointer shrink-0"
                        />
                        <input
                          type="text"
                          value={getActiveCornerVal("color", "#00f5ff")}
                          onChange={(e) => updateActiveCornerVal("color", e.target.value)}
                          className="w-full bg-black/60 border border-white/10 rounded-lg px-2 py-1 text-white font-mono text-[10px]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] text-gray-400 font-bold uppercase block">Border Color</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={getActiveCornerVal("borderColor", "#00f5ff")}
                          onChange={(e) => updateActiveCornerVal("borderColor", e.target.value)}
                          className="w-7 h-7 rounded-lg bg-transparent border border-white/20 cursor-pointer shrink-0"
                        />
                        <input
                          type="text"
                          value={getActiveCornerVal("borderColor", "#00f5ff")}
                          onChange={(e) => updateActiveCornerVal("borderColor", e.target.value)}
                          className="w-full bg-black/60 border border-white/10 rounded-lg px-2 py-1 text-white font-mono text-[10px]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Quick Color Swatches */}
                  <div className="flex items-center gap-1.5 pt-1">
                    {PRESET_COLOR_SWATCHES.map((hex) => (
                      <button
                        key={hex}
                        type="button"
                        onClick={() => {
                          updateActiveCornerVal("color", hex);
                          updateActiveCornerVal("borderColor", hex);
                          updateActiveCornerVal("glowColor", hex);
                        }}
                        className="w-5 h-5 rounded-lg border border-white/20 transition-transform hover:scale-110"
                        style={{ backgroundColor: hex }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* SECTION 2: FRAME LIBRARY */}
      {activeSection === "frames" && (
        <div className="space-y-4">
          {/* MASTER TOGGLE */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black/50 border border-white/10">
            <div className="space-y-0.5">
              <span className="font-bold text-white block uppercase text-[11px] flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-neon-purple" /> Professional Frame Overlay
              </span>
              <p className="text-[10px] text-gray-400">Outer borders, glass rims & tech wireframes</p>
            </div>
            <button
              type="button"
              onClick={() => updateFrameConfig({ enabled: !frameCfg.enabled })}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all ${
                frameCfg.enabled
                  ? "bg-neon-purple text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                  : "bg-white/5 text-gray-400 border border-white/10 hover:text-white"
              }`}
            >
              {frameCfg.enabled ? "ACTIVE" : "DISABLED"}
            </button>
          </div>

          {frameCfg.enabled && (
            <>
              {/* FRAME PRESET GRID */}
              <div className="space-y-2">
                <label className="text-gray-400 font-bold uppercase text-[10px] block">
                  Select Frame Style ({FRAME_PRESET_OPTIONS.length} Options)
                </label>

                <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                  {FRAME_PRESET_OPTIONS.map((fp) => (
                    <button
                      key={fp.id}
                      type="button"
                      onClick={() => updateFrameConfig({ preset: fp.id })}
                      className={`p-2.5 rounded-2xl border text-left space-y-1 transition-all ${
                        frameCfg.preset === fp.id
                          ? "bg-neon-purple/20 border-neon-purple text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                          : "bg-black/40 border-white/10 hover:border-white/30 text-gray-400 hover:text-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[11px] truncate">{fp.name}</span>
                        <span className="text-[8px] px-1.5 py-0.5 rounded bg-white/10 font-mono uppercase">
                          {fp.category}
                        </span>
                      </div>
                      <p className="text-[9px] text-gray-400 line-clamp-2 leading-tight">{fp.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* FRAME CUSTOMIZATION SLIDERS */}
              <div className="space-y-3.5 p-4 rounded-2xl bg-black/50 border border-white/10">
                {/* FRAME WIDTH */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-gray-400">Frame Thickness</span>
                    <span className="text-neon-purple font-bold">{frameCfg.width}px</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="40"
                    value={frameCfg.width}
                    onChange={(e) => updateFrameConfig({ width: Number(e.target.value) })}
                    className="w-full accent-neon-purple h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                  />
                </div>

                {/* INNER PADDING / GAP */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-gray-400">Inner Padding Offset</span>
                    <span className="text-neon-purple font-bold">{frameCfg.innerPadding || 0}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    value={frameCfg.innerPadding || 0}
                    onChange={(e) => updateFrameConfig({ innerPadding: Number(e.target.value) })}
                    className="w-full accent-neon-purple h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                  />
                </div>

                {/* CORNER RADIUS */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-gray-400">Frame Corner Radius</span>
                    <span className="text-neon-purple font-bold">{frameCfg.radius}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={frameCfg.radius}
                    onChange={(e) => updateFrameConfig({ radius: Number(e.target.value) })}
                    className="w-full accent-neon-purple h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                  />
                </div>

                {/* ANIMATED TOGGLE */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="text-[10px] text-gray-300 font-bold uppercase flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" /> Pulse Shimmer Effect
                  </span>
                  <button
                    type="button"
                    onClick={() => updateFrameConfig({ animated: !frameCfg.animated })}
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-bold ${
                      frameCfg.animated
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                        : "bg-white/5 text-gray-400 border border-white/10"
                    }`}
                  >
                    {frameCfg.animated ? "ON" : "OFF"}
                  </button>
                </div>

                {/* COLOR PICKER & GRADIENT */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <label className="text-[10px] text-gray-400 font-bold uppercase block">Frame Primary Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={frameCfg.color || "#00f5ff"}
                      onChange={(e) => updateFrameConfig({ color: e.target.value })}
                      className="w-8 h-8 rounded-xl bg-transparent border border-white/20 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={frameCfg.color || "#00f5ff"}
                      onChange={(e) => updateFrameConfig({ color: e.target.value })}
                      className="flex-1 bg-black/60 border border-white/10 rounded-xl px-2.5 py-1.5 text-white font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* SECTION 3: SAVED CUSTOM PRESETS */}
      {activeSection === "presets" && (
        <div className="space-y-4">
          <div className="space-y-2 p-3.5 rounded-2xl bg-black/50 border border-white/10">
            <label className="text-[10px] text-neon-pink font-bold uppercase flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5" /> Save Current Corner Setup
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Custom Preset Name..."
                value={presetNameInput}
                onChange={(e) => setPresetNameInput(e.target.value)}
                className="flex-1 bg-black/80 border border-white/20 rounded-xl px-3 py-1.5 text-white text-xs font-mono focus:border-neon-pink focus:outline-none"
              />
              <button
                type="button"
                onClick={handleSaveCustomPreset}
                disabled={!presetNameInput.trim()}
                className="px-3 py-1.5 rounded-xl bg-neon-pink hover:bg-neon-pink/80 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" /> Save
              </button>
            </div>
          </div>

          {/* LIST OF SAVED PRESETS */}
          <div className="space-y-2">
            <span className="text-[10px] text-gray-400 font-bold uppercase block">
              Saved Presets ({customPresets.length})
            </span>

            {customPresets.length === 0 ? (
              <p className="text-[11px] text-gray-500 italic p-3 text-center border border-white/5 rounded-2xl">
                No custom presets saved yet. Create a unique corner layout above and save it here!
              </p>
            ) : (
              <div className="space-y-2">
                {customPresets.map((preset) => (
                  <div
                    key={preset.id}
                    className="p-3 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-between gap-2"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <span className="font-bold text-white block text-[11px] truncate">{preset.name}</span>
                      <span className="text-[9px] text-neon-cyan font-mono block">
                        Style: {preset.config.style} | Size: {preset.config.size}px
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          onChange({
                            ...state,
                            showCyberBorders: preset.config.enabled,
                            cornerDecorations: JSON.parse(JSON.stringify(preset.config)),
                          })
                        }
                        className="px-2.5 py-1 rounded-lg bg-neon-cyan/20 border border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan/30 text-[10px] font-bold uppercase"
                      >
                        Apply
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCustomPreset(preset.id)}
                        className="p-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[10px]"
                        title="Delete Preset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

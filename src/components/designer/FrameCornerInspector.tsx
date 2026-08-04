import React, { useState, useRef, useCallback } from "react";
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
  Trash2,
  Zap,
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
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Maximize2,
  FlipHorizontal,
  FlipVertical,
  ClipboardCheck,
  Clipboard,
  Download,
  Upload,
  Plus,
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
  const [activeTab, setActiveTab] = useState<"corners" | "position" | "frames" | "presets">("corners");
  const [selectedCornerPos, setSelectedCornerPos] = useState<"tl" | "tr" | "bl" | "br">("tl");
  const [presetCategoryFilter, setPresetCategoryFilter] = useState<string>("All");
  const [presetNameInput, setPresetNameInput] = useState("");
  const [clipboardStyle, setClipboardStyle] = useState<Partial<IndividualCornerConfig> | null>(null);
  const [copyNotification, setCopyNotification] = useState<string | null>(null);

  // Drag Pad Ref
  const padRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

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

  // Notification helper
  const showToast = (msg: string) => {
    setCopyNotification(msg);
    setTimeout(() => setCopyNotification(null), 2500);
  };

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

  // Action: Reset single corner to default
  const handleResetActiveCorner = () => {
    if (cornerCfg.syncAllCorners) {
      updateCornerConfig({ ...DEFAULT_CORNER_CONFIG, enabled: true, syncAllCorners: true });
      showToast("Reset all corners to default");
    } else {
      updateSingleCorner(selectedCornerPos, {
        enabled: true,
        style: cornerCfg.style,
        size: cornerCfg.size,
        length: cornerCfg.length,
        thickness: cornerCfg.thickness,
        angle: 0,
        inset: cornerCfg.inset ?? 12,
        offsetX: 0,
        offsetY: 0,
        radius: 0,
        color: cornerCfg.color,
        borderColor: cornerCfg.borderColor,
        glowColor: cornerCfg.glowColor,
        glowSpread: cornerCfg.glowSpread,
        opacity: 1,
        blur: 0,
      });
      showToast(`Reset ${selectedCornerPos.toUpperCase()} corner to default`);
    }
  };

  // Action: Copy style from active corner
  const handleCopyStyle = () => {
    const currentVal: Partial<IndividualCornerConfig> = {
      enabled: getActiveCornerVal("enabled", true),
      style: getActiveCornerVal("style", "cyber-hud"),
      size: getActiveCornerVal("size", 36),
      length: getActiveCornerVal("length", 36),
      thickness: getActiveCornerVal("thickness", 3),
      angle: getActiveCornerVal("angle", 0),
      inset: getActiveCornerVal("inset", 12),
      offsetX: getActiveCornerVal("offsetX", 0),
      offsetY: getActiveCornerVal("offsetY", 0),
      radius: getActiveCornerVal("radius", 0),
      color: getActiveCornerVal("color", "#00f5ff"),
      borderColor: getActiveCornerVal("borderColor", "rgba(0,245,255,0.4)"),
      glowColor: getActiveCornerVal("glowColor", "rgba(0,245,255,0.6)"),
      glowSpread: getActiveCornerVal("glowSpread", 10),
      opacity: getActiveCornerVal("opacity", 1),
      blur: getActiveCornerVal("blur", 0),
      borderStyle: getActiveCornerVal("borderStyle", "solid"),
      outerShadowColor: getActiveCornerVal("outerShadowColor", undefined),
      outerShadowBlur: getActiveCornerVal("outerShadowBlur", undefined),
      outerShadowOffsetX: getActiveCornerVal("outerShadowOffsetX", undefined),
      outerShadowOffsetY: getActiveCornerVal("outerShadowOffsetY", undefined),
    };
    setClipboardStyle(currentVal);
    showToast("Copied corner style to clipboard");
  };

  // Action: Paste style to active corner or all
  const handlePasteStyle = () => {
    if (!clipboardStyle) return;
    if (cornerCfg.syncAllCorners) {
      updateCornerConfig({ ...clipboardStyle });
    } else {
      updateSingleCorner(selectedCornerPos, { ...clipboardStyle });
    }
    showToast(`Pasted style to ${cornerCfg.syncAllCorners ? "all corners" : selectedCornerPos.toUpperCase()}`);
  };

  // Action: Duplicate active corner to all 4 corners
  const handleDuplicateActiveToAll = () => {
    const currentVal: Partial<IndividualCornerConfig> = {
      enabled: getActiveCornerVal("enabled", true),
      style: getActiveCornerVal("style", "cyber-hud"),
      size: getActiveCornerVal("size", 36),
      length: getActiveCornerVal("length", 36),
      thickness: getActiveCornerVal("thickness", 3),
      angle: getActiveCornerVal("angle", 0),
      inset: getActiveCornerVal("inset", 12),
      offsetX: getActiveCornerVal("offsetX", 0),
      offsetY: getActiveCornerVal("offsetY", 0),
      radius: getActiveCornerVal("radius", 0),
      color: getActiveCornerVal("color", "#00f5ff"),
      borderColor: getActiveCornerVal("borderColor", "rgba(0,245,255,0.4)"),
      glowColor: getActiveCornerVal("glowColor", "rgba(0,245,255,0.6)"),
      glowSpread: getActiveCornerVal("glowSpread", 10),
      opacity: getActiveCornerVal("opacity", 1),
      blur: getActiveCornerVal("blur", 0),
      borderStyle: getActiveCornerVal("borderStyle", "solid"),
    };

    updateCornerConfig({
      tl: currentVal,
      tr: currentVal,
      bl: currentVal,
      br: currentVal,
    });
    showToast("Duplicated active corner settings to all 4 corners");
  };

  // Action: Mirror Horizontal (TL <-> TR, BL <-> BR)
  const handleMirrorHorizontal = () => {
    const tlVal = cornerCfg.tl || {};
    const trVal = cornerCfg.tr || {};
    const blVal = cornerCfg.bl || {};
    const brVal = cornerCfg.br || {};

    updateCornerConfig({
      syncAllCorners: false,
      tl: { ...trVal },
      tr: { ...tlVal },
      bl: { ...brVal },
      br: { ...blVal },
    });
    showToast("Mirrored corners horizontally");
  };

  // Action: Mirror Vertical (TL <-> BL, TR <-> BR)
  const handleMirrorVertical = () => {
    const tlVal = cornerCfg.tl || {};
    const trVal = cornerCfg.tr || {};
    const blVal = cornerCfg.bl || {};
    const brVal = cornerCfg.br || {};

    updateCornerConfig({
      syncAllCorners: false,
      tl: { ...blVal },
      bl: { ...tlVal },
      tr: { ...brVal },
      br: { ...trVal },
    });
    showToast("Mirrored corners vertically");
  };

  // 2D Drag Pad Handler
  const handlePadInteraction = useCallback(
    (clientX: number, clientY: number) => {
      if (!padRef.current) return;
      const rect = padRef.current.getBoundingClientRect();
      const relativeX = (clientX - rect.left) / rect.width; // 0 to 1
      const relativeY = (clientY - rect.top) / rect.height; // 0 to 1

      // Map from [0, 1] to [-50, +50] offset range
      let rawOffsetX = Math.round((relativeX - 0.5) * 100);
      let rawOffsetY = Math.round((relativeY - 0.5) * 100);

      const isSnapping = getActiveCornerVal("snappingEnabled", true);
      if (isSnapping) {
        // Snap to nearest 5 or edge
        if (Math.abs(rawOffsetX) < 3) rawOffsetX = 0;
        else rawOffsetX = Math.round(rawOffsetX / 5) * 5;

        if (Math.abs(rawOffsetY) < 3) rawOffsetY = 0;
        else rawOffsetY = Math.round(rawOffsetY / 5) * 5;
      }

      updateActiveCornerVal("offsetX", Math.max(-50, Math.min(50, rawOffsetX)));
      updateActiveCornerVal("offsetY", Math.max(-50, Math.min(50, rawOffsetY)));
    },
    [cornerCfg, selectedCornerPos]
  );

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    handlePadInteraction(e.clientX, e.clientY);

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (isDraggingRef.current) {
        handlePadInteraction(moveEvent.clientX, moveEvent.clientY);
      }
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  // Save Custom Preset
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
    showToast(`Saved preset "${newPreset.name}"`);
  };

  const handleDeleteCustomPreset = (presetId: string) => {
    onChange({
      ...state,
      customCornerPresets: customPresets.filter((p) => p.id !== presetId),
    });
    showToast("Deleted custom preset");
  };

  // Categories for preset selector
  const presetCategories = ["All", "Square & Sharp", "Rounded & Cut", "Cyber & HUD", "Minimal & Thin", "Double & Tech", "Custom"];

  const filteredPresetEntries = Object.entries(CORNER_STYLE_LABELS).filter(([_, info]) => {
    if (presetCategoryFilter === "All") return true;
    return info.category.toLowerCase() === presetCategoryFilter.toLowerCase();
  });

  const activeOffsetX = getActiveCornerVal("offsetX", 0);
  const activeOffsetY = getActiveCornerVal("offsetY", 0);

  return (
    <div className="space-y-4 text-xs text-gray-300 font-mono">
      {/* TOAST NOTIFICATION BANNER */}
      {copyNotification && (
        <div className="p-2 rounded-xl bg-neon-cyan/20 border border-neon-cyan/50 text-neon-cyan text-[10px] font-bold text-center animate-fade-in flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(0,245,255,0.2)]">
          <Check className="w-3.5 h-3.5" /> {copyNotification}
        </div>
      )}

      {/* MODULE NAVIGATION TABS */}
      <div className="grid grid-cols-4 gap-1 p-1 rounded-2xl bg-black/60 border border-white/10 text-[10px]">
        <button
          onClick={() => setActiveTab("corners")}
          className={`py-2 rounded-xl uppercase transition-all flex flex-col items-center justify-center gap-1 ${
            activeTab === "corners"
              ? "bg-neon-cyan/20 border border-neon-cyan/50 text-neon-cyan font-bold shadow-[0_0_12px_rgba(0,245,255,0.2)]"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Square className="w-3.5 h-3.5" />
          <span>Styles</span>
        </button>
        <button
          onClick={() => setActiveTab("position")}
          className={`py-2 rounded-xl uppercase transition-all flex flex-col items-center justify-center gap-1 ${
            activeTab === "position"
              ? "bg-neon-purple/20 border border-neon-purple/50 text-neon-purple font-bold shadow-[0_0_12px_rgba(168,85,247,0.2)]"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Move className="w-3.5 h-3.5" />
          <span>2D Move</span>
        </button>
        <button
          onClick={() => setActiveTab("frames")}
          className={`py-2 rounded-xl uppercase transition-all flex flex-col items-center justify-center gap-1 ${
            activeTab === "frames"
              ? "bg-neon-pink/20 border border-neon-pink/50 text-neon-pink font-bold shadow-[0_0_12px_rgba(244,63,94,0.2)]"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Borders</span>
        </button>
        <button
          onClick={() => setActiveTab("presets")}
          className={`py-2 rounded-xl uppercase transition-all flex flex-col items-center justify-center gap-1 ${
            activeTab === "presets"
              ? "bg-amber-400/20 border border-amber-400/50 text-amber-300 font-bold shadow-[0_0_12px_rgba(251,191,36,0.2)]"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Presets</span>
        </button>
      </div>

      {/* MASTER TOGGLE + LINK/UNLINK ACTION BAR */}
      <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="font-bold text-white block uppercase text-[11px] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-neon-cyan" /> Corner System
            </span>
            <p className="text-[10px] text-gray-400">Modular & independent 4-corner controls</p>
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
          <div className="pt-2 border-t border-white/5 flex items-center justify-between">
            <span className="text-[10px] text-gray-400 uppercase font-bold flex items-center gap-1">
              {cornerCfg.syncAllCorners ? <Link className="w-3 h-3 text-neon-cyan" /> : <Unlink className="w-3 h-3 text-neon-purple" />}
              {cornerCfg.syncAllCorners ? "Sync All Corners" : "Decoupled Mode"}
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => updateCornerConfig({ syncAllCorners: true })}
                className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase transition-all ${
                  cornerCfg.syncAllCorners
                    ? "bg-neon-cyan/20 border border-neon-cyan/50 text-neon-cyan"
                    : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                Sync All
              </button>
              <button
                type="button"
                onClick={() => updateCornerConfig({ syncAllCorners: false })}
                className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase transition-all ${
                  !cornerCfg.syncAllCorners
                    ? "bg-neon-purple/20 border border-neon-purple/50 text-neon-purple"
                    : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                Decoupled
              </button>
            </div>
          </div>
        )}
      </div>

      {cornerCfg.enabled && (
        <>
          {/* INDEPENDENT CORNER SELECTOR + QUICK ACTION TOOLBAR */}
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-3">
            <div className="flex items-center justify-between text-[10px] uppercase text-gray-400 font-bold">
              <span>Select Active Corner</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyStyle}
                  className="hover:text-neon-cyan flex items-center gap-1"
                  title="Copy Active Corner Style"
                >
                  <Copy className="w-3 h-3" /> Copy
                </button>
                <button
                  type="button"
                  onClick={handlePasteStyle}
                  disabled={!clipboardStyle}
                  className={`flex items-center gap-1 ${
                    clipboardStyle ? "hover:text-neon-purple text-gray-300" : "text-gray-600 cursor-not-allowed"
                  }`}
                  title="Paste Style"
                >
                  <Clipboard className="w-3 h-3" /> Paste
                </button>
                <button
                  type="button"
                  onClick={handleResetActiveCorner}
                  className="hover:text-amber-400 flex items-center gap-1"
                  title="Reset Active Corner"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>
            </div>

            {/* 4-CORNER SELECTOR DIAGRAM WITH EYE TOGGLES */}
            <div className="grid grid-cols-2 gap-2">
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

            {/* MIRRORING & DUPLICATION BAR */}
            <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-white/5 text-[9px]">
              <button
                type="button"
                onClick={handleMirrorHorizontal}
                className="py-1.5 px-2 rounded-xl bg-white/5 border border-white/10 hover:border-neon-cyan/40 hover:text-neon-cyan transition-all flex items-center justify-center gap-1"
                title="Mirror left & right corners"
              >
                <FlipHorizontal className="w-3 h-3" /> Mirror H
              </button>
              <button
                type="button"
                onClick={handleMirrorVertical}
                className="py-1.5 px-2 rounded-xl bg-white/5 border border-white/10 hover:border-neon-purple/40 hover:text-neon-purple transition-all flex items-center justify-center gap-1"
                title="Mirror top & bottom corners"
              >
                <FlipVertical className="w-3 h-3" /> Mirror V
              </button>
              <button
                type="button"
                onClick={handleDuplicateActiveToAll}
                className="py-1.5 px-2 rounded-xl bg-white/5 border border-white/10 hover:border-neon-pink/40 hover:text-neon-pink transition-all flex items-center justify-center gap-1"
                title="Apply active corner to all 4 corners"
              >
                <Copy className="w-3 h-3" /> Duplicate All
              </button>
            </div>
          </div>

          {/* TAB 1: CORNER STYLES & FULL CONTROLS */}
          {activeTab === "corners" && (
            <div className="space-y-4">
              {/* CATEGORY FILTER SWATCHES */}
              <div className="space-y-2">
                <label className="text-gray-400 font-bold uppercase text-[10px]">
                  Filter Style Category
                </label>
                <div className="flex flex-wrap gap-1">
                  {presetCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setPresetCategoryFilter(cat)}
                      className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase transition-all ${
                        presetCategoryFilter === cat
                          ? "bg-neon-cyan text-black shadow-[0_0_10px_rgba(0,245,255,0.3)]"
                          : "bg-white/5 text-gray-400 border border-white/10 hover:text-white"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* CORNER STYLE SELECTOR GRID */}
              <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                {filteredPresetEntries.map(([styleKey, info]) => {
                  const isSelected = getActiveCornerVal("style", "cyber-hud") === styleKey;
                  return (
                    <div
                      key={styleKey}
                      onClick={() => updateActiveCornerVal("style", styleKey as CornerStyle)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "bg-neon-cyan/20 border-neon-cyan text-white shadow-[0_0_15px_rgba(0,245,255,0.25)]"
                          : "bg-black/40 border-white/10 hover:border-white/30 text-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[10px] text-white truncate">
                          {info.name}
                        </span>
                        {isSelected && <Check className="w-3 h-3 text-neon-cyan" />}
                      </div>
                      <p className="text-[9px] text-gray-400 line-clamp-2 leading-snug">
                        {info.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* FINE-TUNING SLIDERS */}
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                <span className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-neon-cyan" />
                  Corner Parameters
                </span>

                {/* CORNER RADIUS */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-gray-400">Corner Radius</span>
                    <span className="text-neon-cyan font-bold">{getActiveCornerVal("radius", 0)}px</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={50}
                    value={getActiveCornerVal("radius", 0)}
                    onChange={(e) => updateActiveCornerVal("radius", Number(e.target.value))}
                    className="w-full accent-neon-cyan"
                  />
                </div>

                {/* CORNER SIZE & ARM LENGTH */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-gray-400">Size</span>
                      <span className="text-neon-cyan font-bold">{getActiveCornerVal("size", 36)}px</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={120}
                      value={getActiveCornerVal("size", 36)}
                      onChange={(e) => updateActiveCornerVal("size", Number(e.target.value))}
                      className="w-full accent-neon-cyan"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-gray-400">Arm Length</span>
                      <span className="text-neon-cyan font-bold">{getActiveCornerVal("length", 36)}px</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={120}
                      value={getActiveCornerVal("length", 36)}
                      onChange={(e) => updateActiveCornerVal("length", Number(e.target.value))}
                      className="w-full accent-neon-cyan"
                    />
                  </div>
                </div>

                {/* THICKNESS & ANGLE */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-gray-400">Thickness</span>
                      <span className="text-neon-cyan font-bold">{getActiveCornerVal("thickness", 3)}px</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={20}
                      value={getActiveCornerVal("thickness", 3)}
                      onChange={(e) => updateActiveCornerVal("thickness", Number(e.target.value))}
                      className="w-full accent-neon-cyan"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-gray-400">Angle</span>
                      <span className="text-neon-cyan font-bold">{getActiveCornerVal("angle", 0)}°</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={360}
                      step={15}
                      value={getActiveCornerVal("angle", 0)}
                      onChange={(e) => updateActiveCornerVal("angle", Number(e.target.value))}
                      className="w-full accent-neon-cyan"
                    />
                  </div>
                </div>

                {/* INSET SPACING & OPACITY */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-gray-400">Edge Inset</span>
                      <span className="text-neon-cyan font-bold">{getActiveCornerVal("inset", 12)}px</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={60}
                      value={getActiveCornerVal("inset", 12)}
                      onChange={(e) => updateActiveCornerVal("inset", Number(e.target.value))}
                      className="w-full accent-neon-cyan"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-gray-400">Opacity</span>
                      <span className="text-neon-cyan font-bold">{Math.round(getActiveCornerVal("opacity", 1) * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0.1}
                      max={1}
                      step={0.05}
                      value={getActiveCornerVal("opacity", 1)}
                      onChange={(e) => updateActiveCornerVal("opacity", Number(e.target.value))}
                      className="w-full accent-neon-cyan"
                    />
                  </div>
                </div>

                {/* GLOW SPREAD & BLUR */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-gray-400">Glow Spread</span>
                      <span className="text-neon-cyan font-bold">{getActiveCornerVal("glowSpread", 10)}px</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={40}
                      value={getActiveCornerVal("glowSpread", 10)}
                      onChange={(e) => updateActiveCornerVal("glowSpread", Number(e.target.value))}
                      className="w-full accent-neon-cyan"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-gray-400">Blur</span>
                      <span className="text-neon-cyan font-bold">{getActiveCornerVal("blur", 0)}px</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={20}
                      value={getActiveCornerVal("blur", 0)}
                      onChange={(e) => updateActiveCornerVal("blur", Number(e.target.value))}
                      className="w-full accent-neon-cyan"
                    />
                  </div>
                </div>

                {/* COLOR SELECTION */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <label className="text-gray-400 font-bold uppercase text-[10px]">
                    Color & Glow Palette
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 space-y-1">
                      <span className="text-[9px] text-gray-400 block">Main Color</span>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={getActiveCornerVal("color", "#00f5ff")}
                          onChange={(e) => updateActiveCornerVal("color", e.target.value)}
                          className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                        />
                        <input
                          type="text"
                          value={getActiveCornerVal("color", "#00f5ff")}
                          onChange={(e) => updateActiveCornerVal("color", e.target.value)}
                          className="w-full px-2 py-1 rounded bg-black/60 border border-white/10 text-[10px] text-white"
                        />
                      </div>
                    </div>

                    <div className="flex-1 space-y-1">
                      <span className="text-[9px] text-gray-400 block">Border / Glow</span>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={getActiveCornerVal("borderColor", "#00f5ff")}
                          onChange={(e) => {
                            updateActiveCornerVal("borderColor", e.target.value);
                            updateActiveCornerVal("glowColor", e.target.value);
                          }}
                          className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                        />
                        <input
                          type="text"
                          value={getActiveCornerVal("borderColor", "#00f5ff")}
                          onChange={(e) => updateActiveCornerVal("borderColor", e.target.value)}
                          className="w-full px-2 py-1 rounded bg-black/60 border border-white/10 text-[10px] text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* PRESET SWATCHES */}
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
                        style={{ backgroundColor: hex }}
                        className="w-5 h-5 rounded-full border border-white/20 hover:scale-110 transition-transform"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FREE 2D MOVEMENT & POSITIONING PAD */}
          {activeTab === "position" && (
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-gray-300 font-bold uppercase flex items-center gap-1.5">
                  <Move className="w-3.5 h-3.5 text-neon-purple" />
                  Free 2D Movement Pad
                </span>

                <label className="flex items-center gap-1.5 cursor-pointer text-[10px] text-gray-400">
                  <input
                    type="checkbox"
                    checked={getActiveCornerVal("snappingEnabled", true)}
                    onChange={(e) => updateActiveCornerVal("snappingEnabled", e.target.checked)}
                    className="accent-neon-purple rounded"
                  />
                  <span>Snap to Edges</span>
                </label>
              </div>

              {/* INTERACTIVE 2D TOUCHPAD BOX */}
              <div className="space-y-1">
                <div
                  ref={padRef}
                  onMouseDown={handleMouseDown}
                  className="w-full h-44 rounded-2xl bg-black/80 border-2 border-dashed border-neon-purple/40 relative cursor-crosshair overflow-hidden select-none flex items-center justify-center group"
                >
                  {/* Grid Lines */}
                  <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:12px_12px]" />
                  <div className="absolute top-1/2 left-0 right-0 h-px border-b border-dashed border-neon-purple/30" />
                  <div className="absolute left-1/2 top-0 bottom-0 w-px border-r border-dashed border-neon-purple/30" />

                  {/* Corner Vertex Snapping Target Labels */}
                  <div className="absolute top-2 left-2 text-[8px] text-neon-cyan/60 font-mono">TL (-50,-50)</div>
                  <div className="absolute top-2 right-2 text-[8px] text-neon-cyan/60 font-mono">TR (+50,-50)</div>
                  <div className="absolute bottom-2 left-2 text-[8px] text-neon-cyan/60 font-mono">BL (-50,+50)</div>
                  <div className="absolute bottom-2 right-2 text-[8px] text-neon-cyan/60 font-mono">BR (+50,+50)</div>

                  {/* Interactive Draggable Indicator Node */}
                  <div
                    style={{
                      left: `${((activeOffsetX + 50) / 100) * 100}%`,
                      top: `${((activeOffsetY + 50) / 100) * 100}%`,
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-neon-purple/30 border-2 border-neon-purple flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.8)] transition-transform group-hover:scale-110"
                  >
                    <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                  </div>
                </div>
                <p className="text-[9px] text-gray-500 text-center">
                  Click or drag dot inside box to adjust X and Y position freely
                </p>
              </div>

              {/* NUMERICAL OFFSET SLIDERS */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-gray-400">Position X Shift</span>
                    <span className="text-neon-purple font-bold">{activeOffsetX}px</span>
                  </div>
                  <input
                    type="range"
                    min={-50}
                    max={50}
                    value={activeOffsetX}
                    onChange={(e) => updateActiveCornerVal("offsetX", Number(e.target.value))}
                    className="w-full accent-neon-purple"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-gray-400">Position Y Shift</span>
                    <span className="text-neon-purple font-bold">{activeOffsetY}px</span>
                  </div>
                  <input
                    type="range"
                    min={-50}
                    max={50}
                    value={activeOffsetY}
                    onChange={(e) => updateActiveCornerVal("offsetY", Number(e.target.value))}
                    className="w-full accent-neon-purple"
                  />
                </div>
              </div>

              {/* DIRECTIONAL NUDGE BUTTONS */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <span className="text-[10px] text-gray-400 uppercase font-bold">Directional Nudge</span>
                <div className="flex flex-col items-center gap-1">
                  <button
                    type="button"
                    onClick={() => updateActiveCornerVal("offsetY", Math.max(-50, activeOffsetY - 2))}
                    className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-neon-purple text-gray-300 hover:text-white"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateActiveCornerVal("offsetX", Math.max(-50, activeOffsetX - 2))}
                      className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-neon-purple text-gray-300 hover:text-white"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        updateActiveCornerVal("offsetX", 0);
                        updateActiveCornerVal("offsetY", 0);
                      }}
                      className="px-2 py-1 rounded-lg bg-neon-purple/20 border border-neon-purple/40 text-[9px] font-bold text-neon-purple"
                    >
                      CENTER (0,0)
                    </button>
                    <button
                      type="button"
                      onClick={() => updateActiveCornerVal("offsetX", Math.min(50, activeOffsetX + 2))}
                      className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-neon-purple text-gray-300 hover:text-white"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateActiveCornerVal("offsetY", Math.min(50, activeOffsetY + 2))}
                    className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-neon-purple text-gray-300 hover:text-white"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: OUTER BORDER & DUAL FRAME LAYERS */}
          {activeTab === "frames" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black/50 border border-white/10">
                <div className="space-y-0.5">
                  <span className="font-bold text-white block uppercase text-[11px] flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-neon-pink" /> Outer Border Frame
                  </span>
                  <p className="text-[10px] text-gray-400">Primary outer border & dual layer styling</p>
                </div>
                <button
                  type="button"
                  onClick={() => updateFrameConfig({ enabled: !frameCfg.enabled })}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all flex items-center gap-1.5 ${
                    frameCfg.enabled
                      ? "bg-neon-pink text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]"
                      : "bg-white/5 text-gray-400 border border-white/10 hover:text-white"
                  }`}
                >
                  {frameCfg.enabled ? <Check className="w-3.5 h-3.5" /> : null}
                  {frameCfg.enabled ? "ENABLED" : "DISABLED"}
                </button>
              </div>

              {frameCfg.enabled && (
                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                  {/* PRESET SELECTOR */}
                  <div className="space-y-2">
                    <label className="text-gray-400 font-bold uppercase text-[10px]">Frame Preset Style</label>
                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                      {FRAME_PRESET_OPTIONS.map((opt) => (
                        <div
                          key={opt.id}
                          onClick={() => updateFrameConfig({ preset: opt.id })}
                          className={`p-2 rounded-xl border transition-all cursor-pointer ${
                            frameCfg.preset === opt.id
                              ? "bg-neon-pink/20 border-neon-pink text-white shadow-[0_0_10px_rgba(244,63,94,0.3)]"
                              : "bg-black/40 border-white/10 hover:border-white/30 text-gray-300"
                          }`}
                        >
                          <span className="font-bold text-[10px] block text-white truncate">{opt.name}</span>
                          <span className="text-[9px] text-gray-400 truncate block">{opt.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* BORDER THICKNESS (UNIFORM VS SEPARATE HORIZONTAL/VERTICAL) */}
                  <div className="space-y-3 pt-2 border-t border-white/5">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-gray-400">Border Thickness (Uniform)</span>
                        <span className="text-neon-pink font-bold">{frameCfg.width}px</span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={40}
                        value={frameCfg.width}
                        onChange={(e) => updateFrameConfig({ width: Number(e.target.value) })}
                        className="w-full accent-neon-pink"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-gray-400">Horizontal Border</span>
                          <span className="text-neon-pink font-bold">{frameCfg.borderWidthHorizontal ?? frameCfg.width}px</span>
                        </div>
                        <input
                          type="range"
                          min={1}
                          max={40}
                          value={frameCfg.borderWidthHorizontal ?? frameCfg.width}
                          onChange={(e) => updateFrameConfig({ borderWidthHorizontal: Number(e.target.value) })}
                          className="w-full accent-neon-pink"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-gray-400">Vertical Border</span>
                          <span className="text-neon-pink font-bold">{frameCfg.borderWidthVertical ?? frameCfg.width}px</span>
                        </div>
                        <input
                          type="range"
                          min={1}
                          max={40}
                          value={frameCfg.borderWidthVertical ?? frameCfg.width}
                          onChange={(e) => updateFrameConfig({ borderWidthVertical: Number(e.target.value) })}
                          className="w-full accent-neon-pink"
                        />
                      </div>
                    </div>
                  </div>

                  {/* BORDER RADIUS & STYLE */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-gray-400">Frame Radius</span>
                        <span className="text-neon-pink font-bold">{frameCfg.radius}px</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={50}
                        value={frameCfg.radius}
                        onChange={(e) => updateFrameConfig({ radius: Number(e.target.value) })}
                        className="w-full accent-neon-pink"
                      />
                    </div>

                    <div className="space-y-1">
                      <span className="text-gray-400 block text-[10px]">Stroke Style</span>
                      <select
                        value={frameCfg.borderStyle || "solid"}
                        onChange={(e) => updateFrameConfig({ borderStyle: e.target.value as any })}
                        className="w-full px-2 py-1.5 rounded-lg bg-black/60 border border-white/10 text-[10px] text-white"
                      >
                        <option value="solid">Solid</option>
                        <option value="dashed">Dashed</option>
                        <option value="dotted">Dotted</option>
                        <option value="double">Double</option>
                        <option value="groove">Groove</option>
                        <option value="ridge">Ridge</option>
                      </select>
                    </div>
                  </div>

                  {/* SECONDARY INNER BORDER LAYER */}
                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-300 font-bold uppercase">
                        Secondary Inner Border Layer
                      </span>
                      <input
                        type="checkbox"
                        checked={frameCfg.innerBorderEnabled || false}
                        onChange={(e) => updateFrameConfig({ innerBorderEnabled: e.target.checked })}
                        className="accent-neon-pink rounded cursor-pointer"
                      />
                    </div>

                    {frameCfg.innerBorderEnabled && (
                      <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <span className="text-gray-400 block text-[9px]">Inner Width</span>
                            <input
                              type="range"
                              min={1}
                              max={10}
                              value={frameCfg.innerBorderWidth || 1}
                              onChange={(e) => updateFrameConfig({ innerBorderWidth: Number(e.target.value) })}
                              className="w-full accent-neon-pink"
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-gray-400 block text-[9px]">Inner Offset</span>
                            <input
                              type="range"
                              min={2}
                              max={30}
                              value={frameCfg.innerBorderOffset || 8}
                              onChange={(e) => updateFrameConfig({ innerBorderOffset: Number(e.target.value) })}
                              className="w-full accent-neon-pink"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[9px] text-gray-400">Inner Color</span>
                          <input
                            type="color"
                            value={frameCfg.innerBorderColor || frameCfg.color}
                            onChange={(e) => updateFrameConfig({ innerBorderColor: e.target.value })}
                            className="w-5 h-5 rounded cursor-pointer bg-transparent border-0"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: CUSTOM PRESETS MANAGER */}
          {activeTab === "presets" && (
            <div className="space-y-4 p-3.5 rounded-2xl bg-black/40 border border-white/10">
              <span className="text-[10px] text-amber-300 font-bold uppercase flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                Custom Preset Manager
              </span>

              {/* SAVE PRESET INPUT */}
              <div className="space-y-2">
                <label className="text-gray-400 font-bold uppercase text-[9px]">Save Current Configuration</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Enter preset name (e.g. Cyber HUD Gold)"
                    value={presetNameInput}
                    onChange={(e) => setPresetNameInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-[10px] text-white focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={handleSaveCustomPreset}
                    disabled={!presetNameInput.trim()}
                    className="px-3 py-1.5 rounded-xl bg-amber-400 text-black font-bold text-[10px] uppercase hover:bg-amber-300 disabled:opacity-50 transition-all flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Save
                  </button>
                </div>
              </div>

              {/* SAVED PRESETS LIST */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <label className="text-gray-400 font-bold uppercase text-[9px]">Saved Presets ({customPresets.length})</label>
                {customPresets.length === 0 ? (
                  <p className="text-[9px] text-gray-500 italic">No custom presets saved yet.</p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                    {customPresets.map((preset) => (
                      <div
                        key={preset.id}
                        className="p-2 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between"
                      >
                        <span className="text-[10px] font-bold text-white truncate">{preset.name}</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              onChange({
                                ...state,
                                cornerDecorations: preset.config,
                              });
                              showToast(`Applied preset "${preset.name}"`);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-amber-400/20 text-amber-300 font-bold text-[9px] uppercase hover:bg-amber-400/30"
                          >
                            Apply
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCustomPreset(preset.id)}
                            className="p-1 text-gray-500 hover:text-rose-400"
                            title="Delete Preset"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

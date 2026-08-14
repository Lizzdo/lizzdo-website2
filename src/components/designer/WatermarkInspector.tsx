import React, { useState } from "react";
import {
  CanvasElement,
  DesignState,
  WatermarkConfig,
  WatermarkType,
  WatermarkStylePreset,
  WatermarkPositionPreset,
} from "../../types/designer";
import { useStudio } from "../../context/StudioContext";
import {
  ShieldCheck,
  Type,
  Image as ImageIcon,
  Grid,
  PenTool,
  BookmarkCheck,
  SlidersHorizontal,
  Palette,
  Sparkles,
  Scissors,
  Copy,
  Trash2,
  RotateCw,
  Maximize2,
  Sun,
  Layers,
  Check,
  Plus,
  RefreshCw,
  Shield,
  Eye,
  EyeOff,
  Move,
  Lock,
  Unlock,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Italic,
  Underline,
} from "lucide-react";

interface Props {
  state: DesignState;
  onChangeState: (newState: DesignState) => void;
  selectedElement: CanvasElement | null;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  onAddElement: (element: Partial<CanvasElement>) => void;
  onDuplicateElement: (id: string) => void;
  onDeleteElement: (id: string) => void;
}

const DEFAULT_WATERMARK_CONFIG: WatermarkConfig = {
  type: "text",
  watermarkText: "LIZZDO STUDIO",
  stylePreset: "clean",
  fontFamily: "Space Grotesk",
  fontSize: 22,
  fontWeight: "bold",
  fontStyle: "normal",
  textDecoration: "none",
  textTransform: "uppercase",
  letterSpacing: 4,
  lineHeight: 1.2,
  textAlign: "center",
  color: "#ffffff",
  opacity: 0.35,

  gradientEnabled: false,
  gradientType: "linear",
  gradientColor1: "#00f5ff",
  gradientColor2: "#a855f7",
  gradientAngle: 135,

  outlineEnabled: false,
  outlineWidth: 2,
  outlineColor: "#ffffff",
  outlineOpacity: 0.8,
  outlineSoftness: 0,
  outlinePosition: "center",

  shadowEnabled: true,
  shadowColor: "#000000",
  shadowOpacity: 0.6,
  shadowBlur: 8,
  shadowDistance: 2,
  shadowX: 0,
  shadowY: 2,
  shadowAngle: 90,

  glowEnabled: false,
  glowColor: "#00f5ff",
  glowOpacity: 0.8,
  glowBlur: 15,
  glowSpread: 5,
  glowIntensity: 100,

  blendMode: "normal",

  positionPreset: "bottom-right",
  marginX: 5,
  marginY: 5,

  rotation: 0,
  scale: 100,
  lockAspectRatio: true,

  tiledEnabled: false,
  tiledSpacingX: 120,
  tiledSpacingY: 80,
  tiledRotation: -30,
  tiledOpacity: 0.2,
  tiledScale: 80,
  tiledDensity: 1,

  safeAreaEnabled: false,
};

const QUICK_COLORS = [
  "#ffffff",
  "#000000",
  "#9ca3af",
  "#00f5ff",
  "#3b82f6",
  "#a855f7",
  "#ff006e",
  "#22c55e",
  "#ef4444",
  "#f97316",
  "#eab308",
];

const FONT_OPTIONS = [
  "Space Grotesk",
  "Montserrat",
  "Inter",
  "Orbitron",
  "Playfair Display",
  "Plus Jakarta Sans",
  "Syne",
  "Cinzel",
  "Fira Code",
  "Dancing Script",
  "Pacifico",
  "Great Vibes",
];

export function WatermarkInspector({
  state,
  onChangeState,
  selectedElement,
  onUpdateElement,
  onAddElement,
  onDuplicateElement,
  onDeleteElement,
}: Props) {
  const { activeBrandKit } = useStudio();

  // Find if a watermark element is already on canvas
  const canvasWatermark = state.elements.find(
    (el) => el.id === selectedElement?.id && (el.type === "watermark" || el.watermarkConfig)
  ) || state.elements.find((el) => el.type === "watermark" || el.watermarkConfig);

  const activeWatermarkElement = selectedElement?.type === "watermark" || selectedElement?.watermarkConfig
    ? selectedElement
    : canvasWatermark || null;

  const [stagedConfig, setStagedConfig] = useState<WatermarkConfig>(DEFAULT_WATERMARK_CONFIG);

  const currentConfig: WatermarkConfig = {
    ...DEFAULT_WATERMARK_CONFIG,
    ...(activeWatermarkElement?.watermarkConfig || stagedConfig),
  };

  const [activeTab, setActiveTab] = useState<"type" | "style" | "position" | "presets" | "tiled">("type");

  // Helper to safely update watermark element or staging
  const updateConfig = (updates: Partial<WatermarkConfig>) => {
    const newConfig: WatermarkConfig = { ...currentConfig, ...updates };
    setStagedConfig(newConfig);

    if (activeWatermarkElement) {
      onUpdateElement(activeWatermarkElement.id, {
        watermarkConfig: newConfig,
        text: newConfig.watermarkText || activeWatermarkElement.text,
        color: newConfig.color || activeWatermarkElement.color,
        opacity: newConfig.opacity ?? activeWatermarkElement.opacity,
        rotation: newConfig.rotation ?? activeWatermarkElement.rotation,
      });
    }
  };

  const createNewWatermark = (config: WatermarkConfig = currentConfig) => {
    const watermarkId = `el-watermark-${Date.now()}`;
    const newEl: Partial<CanvasElement> = {
      id: watermarkId,
      type: "watermark",
      name: `Watermark (${config.type.toUpperCase()})`,
      text: config.watermarkText || "LIZZDO STUDIO",
      url: config.logoUrl || config.signatureUrl,
      x: config.positionPreset === "center" ? 50 : config.positionPreset?.includes("left") ? 10 : config.positionPreset?.includes("right") ? 80 : 50,
      y: config.positionPreset?.includes("top") ? 10 : config.positionPreset?.includes("bottom") ? 85 : 50,
      width: config.tiledEnabled ? 100 : 35,
      height: config.tiledEnabled ? 100 : 10,
      opacity: config.opacity ?? 0.35,
      rotation: config.rotation || 0,
      color: config.color || "#ffffff",
      fontSize: config.fontSize || 22,
      fontFamily: config.fontFamily || "Space Grotesk",
      fontWeight: config.fontWeight || "bold",
      visible: true,
      locked: false,
      zIndex: 900,
      watermarkConfig: config,
    };
    onAddElement(newEl);
  };

  // Preset Applicator
  const applyPreset = (presetKey: WatermarkStylePreset) => {
    let presetUpdates: Partial<WatermarkConfig> = { stylePreset: presetKey };

    switch (presetKey) {
      case "subtle":
        presetUpdates = { ...presetUpdates, opacity: 0.15, color: "#ffffff", shadowEnabled: false, glowEnabled: false };
        break;
      case "clean":
        presetUpdates = { ...presetUpdates, opacity: 0.35, color: "#ffffff", shadowEnabled: true, shadowOpacity: 0.5 };
        break;
      case "professional":
        presetUpdates = { ...presetUpdates, opacity: 0.5, color: "#ffffff", fontWeight: "bold", letterSpacing: 3 };
        break;
      case "bold":
        presetUpdates = { ...presetUpdates, opacity: 0.75, color: "#ffffff", fontWeight: "black", letterSpacing: 4 };
        break;
      case "copyright":
        presetUpdates = {
          ...presetUpdates,
          opacity: 0.6,
          color: "#ffffff",
          watermarkText: `© ${new Date().getFullYear()} ${activeBrandKit?.brandName || "LIZZDO"}. All Rights Reserved.`,
        };
        break;
      case "cyberpunk":
        presetUpdates = {
          ...presetUpdates,
          opacity: 0.65,
          color: "#00f5ff",
          gradientEnabled: true,
          gradientColor1: "#00f5ff",
          gradientColor2: "#ff006e",
          glowEnabled: true,
          glowColor: "#00f5ff",
          glowBlur: 15,
        };
        break;
      case "glass":
        presetUpdates = {
          ...presetUpdates,
          opacity: 0.3,
          color: "#ffffff",
          outlineEnabled: true,
          outlineColor: "#ffffff",
          outlineWidth: 1,
          shadowEnabled: true,
          shadowBlur: 10,
          blendMode: "overlay",
        };
        break;
      case "neon":
        presetUpdates = {
          ...presetUpdates,
          opacity: 0.8,
          color: "#00f5ff",
          glowEnabled: true,
          glowColor: "#00f5ff",
          glowBlur: 20,
          glowIntensity: 100,
        };
        break;
      case "minimal":
        presetUpdates = { ...presetUpdates, opacity: 0.25, color: "#ffffff", shadowEnabled: false, glowEnabled: false, outlineEnabled: false };
        break;
    }

    updateConfig(presetUpdates);
  };

  // Position Matrix Applicator
  const applyPositionPreset = (pos: WatermarkPositionPreset) => {
    let x = 50;
    let y = 50;
    const mx = currentConfig.marginX || 5;
    const my = currentConfig.marginY || 5;

    switch (pos) {
      case "top-left":
        x = mx;
        y = my;
        break;
      case "top-center":
        x = 50;
        y = my;
        break;
      case "top-right":
        x = 100 - mx;
        y = my;
        break;
      case "center-left":
        x = mx;
        y = 50;
        break;
      case "center":
        x = 50;
        y = 50;
        break;
      case "center-right":
        x = 100 - mx;
        y = 50;
        break;
      case "bottom-left":
        x = mx;
        y = 100 - my;
        break;
      case "bottom-center":
        x = 50;
        y = 100 - my;
        break;
      case "bottom-right":
        x = 100 - mx;
        y = 100 - my;
        break;
    }

    updateConfig({ positionPreset: pos });

    if (activeWatermarkElement) {
      onUpdateElement(activeWatermarkElement.id, { x, y });
    }
  };

  // Handle Logo Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const logoDataUrl = event.target?.result as string;
        updateConfig({ type: "logo", logoUrl: logoDataUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-full bg-neutral-900 text-gray-200 font-sans select-none overflow-y-auto custom-scrollbar p-3 gap-4">
      {/* HEADER BAR */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-neon-cyan/20 border border-neon-cyan/50 flex items-center justify-center text-neon-cyan shadow-[0_0_10px_rgba(0,245,255,0.2)]">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
              Watermark Engine
            </h3>
            <p className="text-[10px] text-gray-400">Protect & Brand Your Artwork</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => createNewWatermark()}
          className="px-2.5 py-1 rounded-lg bg-neon-cyan text-black font-mono font-bold text-[10px] hover:bg-cyan-300 transition-all flex items-center gap-1 shadow-[0_0_12px_rgba(0,245,255,0.4)]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Watermark</span>
        </button>
      </div>

      {/* ACTIVE WATERMARK STATUS BANNER */}
      {activeWatermarkElement ? (
        <div className="bg-neon-cyan/10 border border-neon-cyan/30 rounded-xl p-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
            <div className="flex flex-col">
              <span className="font-mono font-bold text-white text-[11px]">
                Active: {activeWatermarkElement.name || "Watermark Layer"}
              </span>
              <span className="text-[9px] text-gray-400 font-mono">
                {activeWatermarkElement.watermarkConfig?.type?.toUpperCase() || "TEXT"} • {Math.round((activeWatermarkElement.watermarkConfig?.opacity ?? 0.35) * 100)}% Opacity
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onDuplicateElement(activeWatermarkElement.id)}
              className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              title="Duplicate Watermark"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDeleteElement(activeWatermarkElement.id)}
              className="p-1.5 rounded hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors"
              title="Delete Watermark"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-neon-cyan/5 border border-neon-cyan/20 rounded-xl p-3 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-neon-cyan font-mono text-xs">
            <Sparkles className="w-4 h-4" />
            <span className="font-bold">No Watermark on Canvas</span>
          </div>
          <p className="text-[10px] text-gray-400">
            Configure your brand watermark below and click the button to apply it to your design.
          </p>
          <button
            type="button"
            onClick={() => createNewWatermark(currentConfig)}
            className="w-full py-2 rounded-lg bg-neon-cyan text-black font-mono font-bold text-xs hover:bg-cyan-300 transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(0,245,255,0.3)]"
          >
            <Plus className="w-4 h-4" /> Add Watermark to Canvas
          </button>
        </div>
      )}

      {/* QUICK PRESETS BANNER */}
      <div className="space-y-2">
        <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">
          Quick Style Presets
        </label>
        <div className="grid grid-cols-3 gap-1.5 font-mono text-[10px]">
          {[
            { key: "subtle", label: "Subtle (15%)" },
            { key: "clean", label: "Clean (35%)" },
            { key: "professional", label: "Pro (50%)" },
            { key: "bold", label: "Bold (75%)" },
            { key: "copyright", label: "© Copyright" },
            { key: "cyberpunk", label: "Cyberpunk" },
            { key: "glass", label: "Glass" },
            { key: "neon", label: "Neon Glow" },
            { key: "minimal", label: "Minimal" },
          ].map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => applyPreset(p.key as WatermarkStylePreset)}
              className={`py-1.5 px-2 rounded-lg border text-center transition-all ${
                currentConfig.stylePreset === p.key
                  ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan font-bold"
                  : "bg-black/40 border-white/10 text-gray-300 hover:border-white/30"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* WATERMARK TYPE MODE SWITCHER */}
      <div className="space-y-2">
        <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">
          Watermark Mode
        </label>
        <div className="grid grid-cols-4 gap-1 p-1 bg-black/60 rounded-xl border border-white/10 font-mono text-[10px]">
          {[
            { id: "text", label: "Text", icon: Type },
            { id: "logo", label: "Logo", icon: ImageIcon },
            { id: "tiled", label: "Tiled", icon: Grid },
            { id: "signature", label: "Signature", icon: PenTool },
          ].map((mode) => {
            const Icon = mode.icon;
            const isActive = currentConfig.type === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => updateConfig({ type: mode.id as WatermarkType, tiledEnabled: mode.id === "tiled" })}
                className={`py-1.5 rounded-lg flex flex-col items-center justify-center gap-1 transition-all ${
                  isActive
                    ? "bg-neon-cyan/20 border border-neon-cyan/50 text-neon-cyan font-bold"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TEXT WATERMARK CONTENT CONTROLS */}
      {(currentConfig.type === "text" || currentConfig.type === "tiled" || currentConfig.type === "signature") && (
        <div className="space-y-3 bg-black/40 p-3 rounded-xl border border-white/10 font-mono text-xs">
          <label className="text-[11px] uppercase text-neon-cyan font-bold block flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-neon-cyan" /> Watermark Text
          </label>
          <input
            type="text"
            value={currentConfig.watermarkText || "LIZZDO STUDIO"}
            onChange={(e) => updateConfig({ watermarkText: e.target.value })}
            placeholder="Enter custom watermark text..."
            className="w-full bg-black/80 border border-white/20 rounded-lg px-3 py-2 text-white font-mono text-xs focus:border-neon-cyan focus:outline-none"
          />

          {/* Quick Text Suggestions */}
          <div className="flex flex-wrap gap-1 pt-1">
            {["LIZZDO", "LIZZDO STUDIO", "© LIZZDO", "Lizzdo.com", "Created by Lizzdo", "CONFIDENTIAL", "DRAFT"].map(
              (txt) => (
                <button
                  key={txt}
                  type="button"
                  onClick={() => updateConfig({ watermarkText: txt })}
                  className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[9px] text-gray-300"
                >
                  {txt}
                </button>
              )
            )}
          </div>
        </div>
      )}

      {/* LOGO WATERMARK CONTENT CONTROLS */}
      {currentConfig.type === "logo" && (
        <div className="space-y-3 bg-black/40 p-3 rounded-xl border border-white/10 font-mono text-xs">
          <label className="text-[11px] uppercase text-neon-pink font-bold block flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-neon-pink" /> Logo / Image Source
          </label>

          {currentConfig.logoUrl ? (
            <div className="flex items-center gap-3 bg-black/60 p-2 rounded-lg border border-white/10">
              <img src={currentConfig.logoUrl} alt="Logo" className="w-12 h-12 object-contain bg-black/40 rounded p-1 border border-white/10" />
              <div className="flex-1 overflow-hidden">
                <span className="text-[10px] text-emerald-400 font-bold block">Custom Logo Active</span>
                <span className="text-[9px] text-gray-400 truncate block">Transparent PNG/SVG</span>
              </div>
              <label className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-[9px] font-bold cursor-pointer">
                Change
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              </label>
            </div>
          ) : (
            <label className="border-2 border-dashed border-white/20 hover:border-neon-pink rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-black/30">
              <ImageIcon className="w-6 h-6 text-neon-pink" />
              <span className="text-[11px] font-bold text-white">Upload Logo Watermark</span>
              <span className="text-[9px] text-gray-400">Supports PNG, SVG, WebP with transparency</span>
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>
          )}
        </div>
      )}

      {/* BRAND WATERMARK QUICK INSERTION */}
      <div className="bg-black/40 p-3 rounded-xl border border-white/10 space-y-2 font-mono text-xs">
        <label className="text-[11px] uppercase text-amber-300 font-bold block flex items-center gap-1.5">
          <BookmarkCheck className="w-3.5 h-3.5 text-amber-300" /> Insert My Brand Watermark
        </label>
        <div className="grid grid-cols-2 gap-2 text-[10px]">
          <button
            type="button"
            onClick={() =>
              createNewWatermark({
                ...DEFAULT_WATERMARK_CONFIG,
                watermarkText: activeBrandKit?.brandName || "MY BRAND",
                stylePreset: "professional",
                opacity: 0.5,
              })
            }
            className="p-2 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-300 hover:bg-amber-400/20 font-bold text-center truncate"
          >
            Brand Name ({activeBrandKit?.brandName || "LIZZDO"})
          </button>
          <button
            type="button"
            onClick={() =>
              createNewWatermark({
                ...DEFAULT_WATERMARK_CONFIG,
                watermarkText: activeBrandKit?.websiteUrl || "lizzdo.com",
                stylePreset: "subtle",
                opacity: 0.3,
              })
            }
            className="p-2 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-300 hover:bg-amber-400/20 font-bold text-center truncate"
          >
            Website ({activeBrandKit?.websiteUrl || "lizzdo.com"})
          </button>
        </div>
      </div>

      {/* OPACITY SLIDER & NUMERIC VALUE */}
      <div className="space-y-3 bg-black/40 p-3 rounded-xl border border-white/10 font-mono text-xs">
        <div className="flex justify-between items-center">
          <label className="text-[11px] uppercase text-neon-cyan font-bold flex items-center gap-1.5">
            <Sun className="w-3.5 h-3.5 text-neon-cyan" /> Watermark Opacity
          </label>
          <span className="text-neon-cyan font-bold text-xs">
            {Math.round((currentConfig.opacity ?? 0.35) * 100)}%
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={Math.round((currentConfig.opacity ?? 0.35) * 100)}
          onChange={(e) => updateConfig({ opacity: parseInt(e.target.value) / 100 })}
          className="w-full accent-neon-cyan"
        />

        {/* Quick Opacity Presets */}
        <div className="grid grid-cols-5 gap-1 pt-1 text-[9px]">
          {[15, 25, 50, 75, 100].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => updateConfig({ opacity: val / 100 })}
              className={`py-1 rounded border text-center transition-all ${
                Math.round((currentConfig.opacity ?? 0.35) * 100) === val
                  ? "bg-neon-cyan text-black font-bold border-neon-cyan"
                  : "bg-white/10 border-white/10 text-gray-300 hover:text-white"
              }`}
            >
              {val}%
            </button>
          ))}
        </div>
      </div>

      {/* COLOR & GRADIENT CONTROL */}
      <div className="space-y-3 bg-black/40 p-3 rounded-xl border border-white/10 font-mono text-xs">
        <div className="flex items-center justify-between">
          <label className="text-[11px] uppercase text-purple-400 font-bold flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-purple-400" /> Color & Fill
          </label>
          <button
            type="button"
            onClick={() => updateConfig({ gradientEnabled: !currentConfig.gradientEnabled })}
            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              currentConfig.gradientEnabled
                ? "bg-purple-500 text-white"
                : "bg-white/10 text-gray-400 hover:text-white"
            }`}
          >
            Gradient {currentConfig.gradientEnabled ? "ON" : "OFF"}
          </button>
        </div>

        {!currentConfig.gradientEnabled ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={currentConfig.color || "#ffffff"}
                onChange={(e) => updateConfig({ color: e.target.value })}
                className="w-8 h-8 rounded bg-transparent border border-white/20 cursor-pointer"
              />
              <input
                type="text"
                value={currentConfig.color || "#ffffff"}
                onChange={(e) => updateConfig({ color: e.target.value })}
                className="flex-1 bg-black/70 border border-white/20 rounded px-2 py-1 text-white uppercase text-[11px]"
              />
            </div>

            {/* Quick Palette */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {QUICK_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => updateConfig({ color: c })}
                  className="w-5 h-5 rounded-full border border-white/20 hover:scale-125 transition-transform"
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-2 pt-1 border-t border-white/10">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-gray-400 block mb-1">Color 1</label>
                <input
                  type="color"
                  value={currentConfig.gradientColor1 || "#00f5ff"}
                  onChange={(e) => updateConfig({ gradientColor1: e.target.value })}
                  className="w-full h-8 rounded bg-transparent border border-white/20 cursor-pointer"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-400 block mb-1">Color 2</label>
                <input
                  type="color"
                  value={currentConfig.gradientColor2 || "#a855f7"}
                  onChange={(e) => updateConfig({ gradientColor2: e.target.value })}
                  className="w-full h-8 rounded bg-transparent border border-white/20 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                <span>Angle</span>
                <span>{currentConfig.gradientAngle || 135}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={currentConfig.gradientAngle || 135}
                onChange={(e) => updateConfig({ gradientAngle: parseInt(e.target.value) })}
                className="w-full accent-purple-400"
              />
            </div>
          </div>
        )}
      </div>

      {/* TYPOGRAPHY CONTROLS */}
      {currentConfig.type !== "logo" && (
        <div className="space-y-3 bg-black/40 p-3 rounded-xl border border-white/10 font-mono text-xs">
          <label className="text-[11px] uppercase text-emerald-400 font-bold block flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-emerald-400" /> Typography & Font
          </label>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-gray-400 block mb-1">Font Family</label>
              <select
                value={currentConfig.fontFamily || "Space Grotesk"}
                onChange={(e) => updateConfig({ fontFamily: e.target.value })}
                className="w-full bg-black/70 border border-white/20 rounded px-2 py-1 text-white text-[11px]"
              >
                {FONT_OPTIONS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] text-gray-400 block mb-1">Font Weight</label>
              <select
                value={currentConfig.fontWeight || "bold"}
                onChange={(e) => updateConfig({ fontWeight: e.target.value })}
                className="w-full bg-black/70 border border-white/20 rounded px-2 py-1 text-white text-[11px]"
              >
                <option value="100">Thin (100)</option>
                <option value="300">Light (300)</option>
                <option value="normal">Regular (400)</option>
                <option value="medium">Medium (500)</option>
                <option value="bold">Bold (700)</option>
                <option value="black">Black (900)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                <span>Font Size</span>
                <span>{currentConfig.fontSize || 22}px</span>
              </div>
              <input
                type="range"
                min="10"
                max="120"
                value={currentConfig.fontSize || 22}
                onChange={(e) => updateConfig({ fontSize: parseInt(e.target.value) })}
                className="w-full accent-emerald-400"
              />
            </div>

            <div>
              <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                <span>Letter Spacing</span>
                <span>{currentConfig.letterSpacing || 0}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                value={currentConfig.letterSpacing || 0}
                onChange={(e) => updateConfig({ letterSpacing: parseInt(e.target.value) })}
                className="w-full accent-emerald-400"
              />
            </div>
          </div>

          {/* Text Style Toggles */}
          <div className="flex items-center gap-1 pt-1">
            <button
              type="button"
              onClick={() =>
                updateConfig({
                  fontStyle: currentConfig.fontStyle === "italic" ? "normal" : "italic",
                })
              }
              className={`p-1.5 rounded border ${
                currentConfig.fontStyle === "italic" ? "bg-emerald-400 text-black border-emerald-400 font-bold" : "bg-white/10 border-white/10 text-gray-300"
              }`}
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() =>
                updateConfig({
                  textDecoration: currentConfig.textDecoration === "underline" ? "none" : "underline",
                })
              }
              className={`p-1.5 rounded border ${
                currentConfig.textDecoration === "underline" ? "bg-emerald-400 text-black border-emerald-400 font-bold" : "bg-white/10 border-white/10 text-gray-300"
              }`}
            >
              <Underline className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() =>
                updateConfig({
                  textTransform: currentConfig.textTransform === "uppercase" ? "none" : "uppercase",
                })
              }
              className={`px-2 py-1 rounded border text-[10px] ${
                currentConfig.textTransform === "uppercase" ? "bg-emerald-400 text-black border-emerald-400 font-bold" : "bg-white/10 border-white/10 text-gray-300"
              }`}
            >
              AA
            </button>
            <button
              type="button"
              onClick={() =>
                updateConfig({
                  textTransform: currentConfig.textTransform === "lowercase" ? "none" : "lowercase",
                })
              }
              className={`px-2 py-1 rounded border text-[10px] ${
                currentConfig.textTransform === "lowercase" ? "bg-emerald-400 text-black border-emerald-400 font-bold" : "bg-white/10 border-white/10 text-gray-300"
              }`}
            >
              aa
            </button>
          </div>
        </div>
      )}

      {/* POSITIONING MATRIX & MARGINS */}
      <div className="space-y-3 bg-black/40 p-3 rounded-xl border border-white/10 font-mono text-xs">
        <label className="text-[11px] uppercase text-cyan-300 font-bold block flex items-center gap-1.5">
          <Move className="w-3.5 h-3.5 text-cyan-300" /> Positioning Matrix & Margin
        </label>

        <div className="grid grid-cols-3 gap-1 p-2 bg-black/70 rounded-xl border border-white/10 max-w-[200px] mx-auto">
          {[
            { id: "top-left", label: "TL" },
            { id: "top-center", label: "TC" },
            { id: "top-right", label: "TR" },
            { id: "center-left", label: "CL" },
            { id: "center", label: "C" },
            { id: "center-right", label: "CR" },
            { id: "bottom-left", label: "BL" },
            { id: "bottom-center", label: "BC" },
            { id: "bottom-right", label: "BR" },
          ].map((pos) => (
            <button
              key={pos.id}
              type="button"
              onClick={() => applyPositionPreset(pos.id as WatermarkPositionPreset)}
              className={`h-9 rounded-lg border text-center font-bold text-[10px] transition-all flex items-center justify-center ${
                currentConfig.positionPreset === pos.id
                  ? "bg-cyan-400 text-black border-cyan-300 shadow-[0_0_10px_rgba(0,245,255,0.4)]"
                  : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {pos.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <div>
            <div className="flex justify-between text-[10px] text-gray-400 mb-1">
              <span>Margin X</span>
              <span>{currentConfig.marginX || 5}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              value={currentConfig.marginX || 5}
              onChange={(e) => {
                const mx = parseInt(e.target.value);
                updateConfig({ marginX: mx });
                if (currentConfig.positionPreset) applyPositionPreset(currentConfig.positionPreset);
              }}
              className="w-full accent-cyan-300"
            />
          </div>
          <div>
            <div className="flex justify-between text-[10px] text-gray-400 mb-1">
              <span>Margin Y</span>
              <span>{currentConfig.marginY || 5}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              value={currentConfig.marginY || 5}
              onChange={(e) => {
                const my = parseInt(e.target.value);
                updateConfig({ marginY: my });
                if (currentConfig.positionPreset) applyPositionPreset(currentConfig.positionPreset);
              }}
              className="w-full accent-cyan-300"
            />
          </div>
        </div>
      </div>

      {/* ROTATION & SCALE */}
      <div className="space-y-3 bg-black/40 p-3 rounded-xl border border-white/10 font-mono text-xs">
        <label className="text-[11px] uppercase text-amber-300 font-bold block flex items-center gap-1.5">
          <RotateCw className="w-3.5 h-3.5 text-amber-300" /> Rotation & Scale
        </label>

        <div>
          <div className="flex justify-between text-[10px] text-gray-400 mb-1">
            <span>Rotation</span>
            <span>{currentConfig.rotation || 0}°</span>
          </div>
          <input
            type="range"
            min="-180"
            max="180"
            value={currentConfig.rotation || 0}
            onChange={(e) => updateConfig({ rotation: parseInt(e.target.value) })}
            className="w-full accent-amber-300"
          />
          <div className="flex gap-1 pt-1">
            {[0, 45, 90, -45, -90].map((deg) => (
              <button
                key={deg}
                type="button"
                onClick={() => updateConfig({ rotation: deg })}
                className="flex-1 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[9px] text-gray-300 text-center"
              >
                {deg}°
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[10px] text-gray-400 mb-1">
            <span>Scale</span>
            <span>{currentConfig.scale || 100}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="500"
            value={currentConfig.scale || 100}
            onChange={(e) => updateConfig({ scale: parseInt(e.target.value) })}
            className="w-full accent-amber-300"
          />
        </div>
      </div>

      {/* TILED WATERMARK PATTERN CONTROLS */}
      <div className="space-y-3 bg-black/40 p-3 rounded-xl border border-white/10 font-mono text-xs">
        <div className="flex items-center justify-between">
          <label className="text-[11px] uppercase text-neon-pink font-bold flex items-center gap-1.5">
            <Grid className="w-3.5 h-3.5 text-neon-pink" /> Tiled Diagonal Pattern
          </label>
          <button
            type="button"
            onClick={() => updateConfig({ tiledEnabled: !currentConfig.tiledEnabled })}
            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              currentConfig.tiledEnabled ? "bg-neon-pink text-white" : "bg-white/10 text-gray-400 hover:text-white"
            }`}
          >
            Tiled {currentConfig.tiledEnabled ? "ON" : "OFF"}
          </button>
        </div>

        {currentConfig.tiledEnabled && (
          <div className="space-y-2 pt-2 border-t border-white/10">
            <div>
              <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                <span>Pattern Density</span>
                <span>{currentConfig.tiledDensity || 1}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={currentConfig.tiledDensity || 1}
                onChange={(e) => updateConfig({ tiledDensity: parseFloat(e.target.value) })}
                className="w-full accent-neon-pink"
              />
            </div>

            <div>
              <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                <span>Pattern Angle</span>
                <span>{currentConfig.tiledRotation || -30}°</span>
              </div>
              <input
                type="range"
                min="-90"
                max="90"
                value={currentConfig.tiledRotation || -30}
                onChange={(e) => updateConfig({ tiledRotation: parseInt(e.target.value) })}
                className="w-full accent-neon-pink"
              />
            </div>
          </div>
        )}
      </div>

      {/* BLEND MODES */}
      <div className="space-y-3 bg-black/40 p-3 rounded-xl border border-white/10 font-mono text-xs">
        <label className="text-[11px] uppercase text-indigo-400 font-bold block flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-indigo-400" /> Layer Blend Mode
        </label>
        <select
          value={currentConfig.blendMode || "normal"}
          onChange={(e) => updateConfig({ blendMode: e.target.value as any })}
          className="w-full bg-black/70 border border-white/20 rounded px-2.5 py-1.5 text-white text-xs font-mono"
        >
          <option value="normal">Normal</option>
          <option value="multiply">Multiply (Darken)</option>
          <option value="screen">Screen (Lighten)</option>
          <option value="overlay">Overlay (Contrast)</option>
          <option value="soft-light">Soft Light</option>
          <option value="hard-light">Hard Light</option>
          <option value="darken">Darken</option>
          <option value="lighten">Lighten</option>
        </select>
      </div>

      {/* SAFE AREA TOGGLE */}
      <div className="bg-black/40 p-3 rounded-xl border border-white/10 flex items-center justify-between font-mono text-xs">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-amber-400" />
          <span className="text-white text-[11px] font-bold">Show Safe Area Margins</span>
        </div>
        <button
          type="button"
          onClick={() =>
            onChangeState({
              ...state,
              showSafeMargins: !state.showSafeMargins,
            })
          }
          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
            state.showSafeMargins ? "bg-amber-400 text-black" : "bg-white/10 text-gray-400 hover:text-white"
          }`}
        >
          {state.showSafeMargins ? "Visible" : "Hidden"}
        </button>
      </div>
    </div>
  );
}

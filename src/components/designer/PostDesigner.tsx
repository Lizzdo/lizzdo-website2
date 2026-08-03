import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  Download,
  LayoutTemplate,
  RotateCcw,
  Sparkles,
  Sliders,
  Type,
  Image as ImageIcon,
  Palette,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Plus,
  Trash2,
  Check,
  Save,
  Grid,
  Square,
  Shield,
  Eye,
} from "lucide-react";
import { CanvasStage } from "./CanvasStage";
import ExportDialog from "./ExportDialog";
import TemplateLibrary from "./TemplateLibrary";
import LayerManager from "./LayerManager";
import { CANVAS_PRESETS, DEFAULT_DESIGN_STATE } from "../../data/designerTemplates";
import {
  DesignState,
  CanvasPresetId,
  DesignTemplate,
  ImageFitMode,
} from "../../types/designer";

export default function PostDesigner() {
  const [designState, setDesignState] = useState<DesignState>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("lizzdo_designer_state");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse saved design state:", e);
        }
      }
    }
    return DEFAULT_DESIGN_STATE;
  });

  const [activeTab, setActiveTab] = useState<"preset" | "image" | "text" | "background" | "branding" | "layers">("image");
  const [stageScale, setStageScale] = useState<number>(0.75);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isTemplateOpen, setIsTemplateOpen] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Auto-save state to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("lizzdo_designer_state", JSON.stringify(designState));
    }
  }, [designState]);

  // Handle preset change
  const handlePresetChange = (presetId: CanvasPresetId) => {
    const found = CANVAS_PRESETS.find((p) => p.id === presetId);
    if (found) {
      setDesignState((prev) => ({
        ...prev,
        preset: presetId,
        width: found.width,
        height: found.height,
      }));
    }
  };

  // Image Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setDesignState((prev) => ({
            ...prev,
            image: {
              ...prev.image,
              url: event.target!.result as string,
              visible: true,
            },
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Background Image Upload
  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setDesignState((prev) => ({
            ...prev,
            background: {
              ...prev.background,
              type: "image",
              imageUrl: event.target!.result as string,
            },
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Custom Logo Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setDesignState((prev) => ({
            ...prev,
            logo: {
              ...prev.logo,
              logoUrl: event.target!.result as string,
              visible: true,
            },
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Select Template
  const handleSelectTemplate = (template: DesignTemplate) => {
    if (template.state) {
      setDesignState((prev) => ({
        ...prev,
        ...template.state,
        image: { ...prev.image, ...template.state.image },
        background: { ...prev.background, ...template.state.background },
        cta: { ...prev.cta, ...template.state.cta },
        logo: { ...prev.logo, ...template.state.logo },
      }));
    }
  };

  // Manual Save Action
  const handleSaveToMemory = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("lizzdo_designer_state", JSON.stringify(designState));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

  // Reset to default
  const handleReset = () => {
    setDesignState(DEFAULT_DESIGN_STATE);
  };

  // Layer toggles
  const handleToggleLayerVisibility = (layerId: string) => {
    setDesignState((prev) => ({
      ...prev,
      layers: prev.layers.map((l) => (l.id === layerId ? { ...l, visible: !l.visible } : l)),
    }));
  };

  const handleToggleLayerLock = (layerId: string) => {
    setDesignState((prev) => ({
      ...prev,
      layers: prev.layers.map((l) => (l.id === layerId ? { ...l, locked: !l.locked } : l)),
    }));
  };

  const handleMoveLayer = (index: number, direction: "up" | "down") => {
    const newLayers = [...designState.layers];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newLayers.length) {
      const temp = newLayers[index];
      newLayers[index] = newLayers[targetIndex];
      newLayers[targetIndex] = temp;
      setDesignState((prev) => ({ ...prev, layers: newLayers }));
    }
  };

  // Text state helpers
  const updateText = (id: string, updates: any) => {
    setDesignState((prev) => ({
      ...prev,
      texts: prev.texts.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white font-sans">
      {/* Hidden File Inputs */}
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
      <input ref={bgInputRef} type="file" accept="image/*" onChange={handleBgUpload} className="hidden" />
      <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />

      {/* Top Navigation & Action Bar */}
      <header className="h-16 border-b border-white/10 bg-slate-950 px-6 flex items-center justify-between shrink-0 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-neon-cyan/10 border border-neon-cyan/40 text-neon-cyan flex items-center justify-center font-display font-black text-sm">
              LZ
            </div>
            <span className="font-display font-bold text-lg tracking-wider text-white">
              POST & COVER <span className="text-neon-cyan">DESIGNER</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2 border-l border-white/10 pl-4">
            <button
              onClick={() => setIsTemplateOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-neon-purple/10 border border-neon-purple/30 text-neon-purple hover:bg-neon-purple hover:text-white transition-all text-xs font-mono uppercase tracking-wider flex items-center gap-2"
            >
              <LayoutTemplate size={14} /> Templates
            </button>
            <button
              onClick={handleReset}
              className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all text-xs font-mono uppercase tracking-wider flex items-center gap-1.5"
            >
              <RotateCcw size={14} /> Reset
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Save Status */}
          <button
            onClick={handleSaveToMemory}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-gray-400 hover:text-white text-xs font-mono"
          >
            {savedSuccess ? (
              <span className="text-neon-green flex items-center gap-1">
                <Check size={14} /> Saved
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Save size={14} /> Save Draft
              </span>
            )}
          </button>

          {/* Export Button */}
          <button
            onClick={() => setIsExportOpen(true)}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-black font-display font-bold text-xs uppercase tracking-[2px] hover:shadow-[0_0_25px_rgba(0,245,255,0.5)] transition-all flex items-center gap-2"
          >
            <Download size={16} /> Export Image
          </button>
        </div>
      </header>

      {/* Main Designer Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Sidebar Controls */}
        <aside className="w-full lg:w-[420px] bg-slate-950 border-r border-white/10 flex flex-col shrink-0 overflow-y-auto max-h-[50vh] lg:max-h-none">
          {/* Control Navigation Tabs */}
          <div className="flex border-b border-white/10 bg-slate-900/60 p-2 gap-1 overflow-x-auto no-scrollbar shrink-0">
            {[
              { id: "image", label: "Image", icon: ImageIcon },
              { id: "text", label: "Text", icon: Type },
              { id: "preset", label: "Canvas", icon: Sliders },
              { id: "background", label: "Style", icon: Palette },
              { id: "branding", label: "Brand", icon: Shield },
              { id: "layers", label: "Layers", icon: Layers },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono uppercase whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-neon-cyan text-black font-bold shadow-[0_0_12px_rgba(0,245,255,0.4)]"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon size={14} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Control Panels */}
          <div className="p-6 space-y-6 flex-1">
            {/* CANVAS PRESET TAB */}
            {activeTab === "preset" && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider mb-3">
                    Canvas Aspect Ratio & Size
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {CANVAS_PRESETS.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handlePresetChange(p.id)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          designState.preset === p.id
                            ? "bg-slate-900 border-neon-cyan text-white shadow-[0_0_15px_rgba(0,245,255,0.2)]"
                            : "bg-slate-900/50 border-white/5 text-gray-400 hover:border-white/20"
                        }`}
                      >
                        <div className="font-display font-bold text-xs text-white mb-1">
                          {p.name}
                        </div>
                        <div className="font-mono text-[10px] text-neon-cyan">
                          {p.width} × {p.height} px ({p.aspectRatio})
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {designState.preset === "custom" && (
                  <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-900 border border-white/10">
                    <div>
                      <label className="text-xs font-mono text-gray-400 uppercase">Width (px)</label>
                      <input
                        type="number"
                        value={designState.width}
                        onChange={(e) =>
                          setDesignState((prev) => ({ ...prev, width: Number(e.target.value) || 800 }))
                        }
                        className="w-full mt-1 bg-black border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-xs focus:border-neon-cyan"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono text-gray-400 uppercase">Height (px)</label>
                      <input
                        type="number"
                        value={designState.height}
                        onChange={(e) =>
                          setDesignState((prev) => ({ ...prev, height: Number(e.target.value) || 600 }))
                        }
                        className="w-full mt-1 bg-black border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-xs focus:border-neon-cyan"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* IMAGE CONTROL TAB */}
            {activeTab === "image" && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider mb-3">
                    Featured Asset Image
                  </h4>

                  <div className="flex gap-3 mb-4">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 py-3 px-4 rounded-xl bg-neon-cyan/10 border border-neon-cyan/40 text-neon-cyan font-mono text-xs uppercase tracking-wider hover:bg-neon-cyan hover:text-black transition-all flex items-center justify-center gap-2"
                    >
                      <Upload size={14} /> Upload Custom Image
                    </button>
                  </div>

                  {designState.image.url && (
                    <div className="p-3 rounded-xl bg-slate-900 border border-white/10 flex items-center gap-3 mb-4">
                      <img
                        src={designState.image.url}
                        alt="Current"
                        className="w-12 h-12 object-cover rounded-lg border border-white/10 shrink-0"
                      />
                      <div className="overflow-hidden flex-1">
                        <span className="text-xs font-mono text-gray-300 block truncate">Image loaded</span>
                        <span className="text-[10px] font-mono text-neon-cyan uppercase">
                          Fit: {designState.image.fitMode}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Fitting Options */}
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">
                    Image Fit & Crop Mode
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(["smart", "cover", "contain", "fill"] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() =>
                          setDesignState((prev) => ({
                            ...prev,
                            image: { ...prev.image, fitMode: mode },
                          }))
                        }
                        className={`py-2 px-1 rounded-xl border text-[11px] font-mono uppercase transition-all ${
                          designState.image.fitMode === mode
                            ? "bg-neon-cyan text-black border-neon-cyan font-bold"
                            : "bg-slate-900 border-white/5 text-gray-400 hover:text-white"
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Scale / Zoom */}
                <div>
                  <div className="flex justify-between items-center text-xs font-mono mb-2">
                    <span className="text-gray-400 uppercase">Zoom Scale</span>
                    <span className="text-neon-cyan">{Math.round(designState.image.scale * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.5"
                    step="0.05"
                    value={designState.image.scale}
                    onChange={(e) =>
                      setDesignState((prev) => ({
                        ...prev,
                        image: { ...prev.image, scale: parseFloat(e.target.value) },
                      }))
                    }
                    className="w-full accent-neon-cyan"
                  />
                </div>

                {/* Offset Position */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-mono text-gray-400 uppercase flex justify-between">
                      <span>X Offset</span>
                      <span className="text-neon-cyan">{designState.image.xOffset}px</span>
                    </label>
                    <input
                      type="range"
                      min="-150"
                      max="150"
                      value={designState.image.xOffset}
                      onChange={(e) =>
                        setDesignState((prev) => ({
                          ...prev,
                          image: { ...prev.image, xOffset: parseInt(e.target.value) },
                        }))
                      }
                      className="w-full accent-neon-cyan mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-gray-400 uppercase flex justify-between">
                      <span>Y Offset</span>
                      <span className="text-neon-cyan">{designState.image.yOffset}px</span>
                    </label>
                    <input
                      type="range"
                      min="-150"
                      max="150"
                      value={designState.image.yOffset}
                      onChange={(e) =>
                        setDesignState((prev) => ({
                          ...prev,
                          image: { ...prev.image, yOffset: parseInt(e.target.value) },
                        }))
                      }
                      className="w-full accent-neon-cyan mt-1"
                    />
                  </div>
                </div>

                {/* Border & Glow Styling */}
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono text-gray-400 uppercase">Shadow Glow</span>
                    <div className="flex gap-1">
                      {(["cyan", "purple", "pink", "orange", "none"] as const).map((g) => (
                        <button
                          key={g}
                          onClick={() =>
                            setDesignState((prev) => ({
                              ...prev,
                              image: { ...prev.image, shadowGlow: g },
                            }))
                          }
                          className={`w-6 h-6 rounded-full border ${
                            designState.image.shadowGlow === g
                              ? "border-white ring-2 ring-white/50"
                              : "border-transparent"
                          }`}
                          style={{
                            backgroundColor:
                              g === "cyan"
                                ? "#00f5ff"
                                : g === "purple"
                                ? "#a855f7"
                                : g === "pink"
                                ? "#ff006e"
                                : g === "orange"
                                ? "#ff9500"
                                : "#333",
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-gray-400 uppercase">Corner Radius</span>
                      <span className="text-neon-cyan">{designState.image.borderRadius}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="40"
                      value={designState.image.borderRadius}
                      onChange={(e) =>
                        setDesignState((prev) => ({
                          ...prev,
                          image: { ...prev.image, borderRadius: parseInt(e.target.value) },
                        }))
                      }
                      className="w-full accent-neon-cyan"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TEXT EDITING TAB */}
            {activeTab === "text" && (
              <div className="space-y-6">
                {/* Headline Title */}
                <div className="p-4 bg-slate-900/80 border border-white/10 rounded-2xl space-y-3">
                  <span className="text-xs font-display font-bold text-neon-cyan uppercase tracking-wider block">
                    Headline Title
                  </span>
                  <input
                    type="text"
                    value={designState.texts.find((t) => t.id === "title")?.text || ""}
                    onChange={(e) => updateText("title", { text: e.target.value })}
                    className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-white font-future text-sm focus:border-neon-cyan"
                  />
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="text-[10px] font-mono text-gray-400 uppercase">Font Size</label>
                      <input
                        type="number"
                        value={designState.texts.find((t) => t.id === "title")?.fontSize || 32}
                        onChange={(e) => updateText("title", { fontSize: Number(e.target.value) })}
                        className="w-full bg-black border border-white/10 rounded-lg px-2 py-1 text-white font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-gray-400 uppercase">Font Family</label>
                      <select
                        value={designState.texts.find((t) => t.id === "title")?.fontFamily || "Orbitron"}
                        onChange={(e) => updateText("title", { fontFamily: e.target.value })}
                        className="w-full bg-black border border-white/10 rounded-lg px-2 py-1 text-white font-mono text-xs"
                      >
                        <option value="Orbitron">Orbitron (Display)</option>
                        <option value="Rajdhani">Rajdhani (Tech)</option>
                        <option value="Space Mono">Space Mono (Code)</option>
                        <option value="Inter">Inter (Sans)</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <label className="text-xs font-mono text-gray-400 uppercase">Holographic Gradient</label>
                    <input
                      type="checkbox"
                      checked={designState.texts.find((t) => t.id === "title")?.gradientText || false}
                      onChange={(e) => updateText("title", { gradientText: e.target.checked })}
                      className="accent-neon-cyan w-4 h-4"
                    />
                  </div>
                </div>

                {/* Subtitle / Category Tag */}
                <div className="p-4 bg-slate-900/80 border border-white/10 rounded-2xl space-y-3">
                  <span className="text-xs font-display font-bold text-neon-purple uppercase tracking-wider block">
                    Subtitle / Category
                  </span>
                  <input
                    type="text"
                    value={designState.texts.find((t) => t.id === "subtitle")?.text || ""}
                    onChange={(e) => updateText("subtitle", { text: e.target.value })}
                    className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-white font-future text-sm focus:border-neon-purple"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-mono text-gray-400 uppercase">Font Size</label>
                      <input
                        type="number"
                        value={designState.texts.find((t) => t.id === "subtitle")?.fontSize || 14}
                        onChange={(e) => updateText("subtitle", { fontSize: Number(e.target.value) })}
                        className="w-full bg-black border border-white/10 rounded-lg px-2 py-1 text-white font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-gray-400 uppercase">Text Color</label>
                      <input
                        type="color"
                        value={designState.texts.find((t) => t.id === "subtitle")?.color || "#00f5ff"}
                        onChange={(e) => updateText("subtitle", { color: e.target.value })}
                        className="w-full h-7 bg-black border border-white/10 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Description Body */}
                <div className="p-4 bg-slate-900/80 border border-white/10 rounded-2xl space-y-3">
                  <span className="text-xs font-display font-bold text-gray-300 uppercase tracking-wider block">
                    Description Body
                  </span>
                  <textarea
                    rows={2}
                    value={designState.texts.find((t) => t.id === "description")?.text || ""}
                    onChange={(e) => updateText("description", { text: e.target.value })}
                    className="w-full bg-black border border-white/10 rounded-xl p-3 text-white font-future text-xs focus:border-white"
                  />
                </div>
              </div>
            )}

            {/* BACKGROUND & STYLING TAB */}
            {activeTab === "background" && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider mb-3">
                    Background Color & Gradient
                  </h4>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <label className="text-[10px] font-mono text-gray-400 uppercase">From Color</label>
                      <input
                        type="color"
                        value={designState.background.gradientFrom}
                        onChange={(e) =>
                          setDesignState((prev) => ({
                            ...prev,
                            background: { ...prev.background, gradientFrom: e.target.value },
                          }))
                        }
                        className="w-full h-9 bg-black border border-white/10 rounded-xl cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-gray-400 uppercase">To Color</label>
                      <input
                        type="color"
                        value={designState.background.gradientTo}
                        onChange={(e) =>
                          setDesignState((prev) => ({
                            ...prev,
                            background: { ...prev.background, gradientTo: e.target.value },
                          }))
                        }
                        className="w-full h-9 bg-black border border-white/10 rounded-xl cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Cyber Pattern Overlays */}
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">
                    Cyber Pattern Overlay
                  </label>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {(["grid", "scanline", "dots", "hexagons", "none"] as const).map((pat) => (
                      <button
                        key={pat}
                        onClick={() =>
                          setDesignState((prev) => ({
                            ...prev,
                            background: { ...prev.background, pattern: pat },
                          }))
                        }
                        className={`py-2 px-2 rounded-xl border text-[11px] font-mono uppercase transition-all ${
                          designState.background.pattern === pat
                            ? "bg-neon-purple text-white border-neon-purple font-bold"
                            : "bg-slate-900 border-white/5 text-gray-400 hover:text-white"
                        }`}
                      >
                        {pat}
                      </button>
                    ))}
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-gray-400 uppercase">Pattern Opacity</span>
                      <span className="text-neon-purple">
                        {Math.round(designState.background.patternOpacity * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="0.8"
                      step="0.05"
                      value={designState.background.patternOpacity}
                      onChange={(e) =>
                        setDesignState((prev) => ({
                          ...prev,
                          background: { ...prev.background, patternOpacity: parseFloat(e.target.value) },
                        }))
                      }
                      className="w-full accent-neon-purple"
                    />
                  </div>
                </div>

                {/* Cyber Borders & Glass Backdrop Toggle */}
                <div className="p-4 bg-slate-900 border border-white/10 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-gray-300 uppercase">Cyber Neon Corners</span>
                    <input
                      type="checkbox"
                      checked={designState.showCyberBorders}
                      onChange={(e) =>
                        setDesignState((prev) => ({ ...prev, showCyberBorders: e.target.checked }))
                      }
                      className="accent-neon-cyan w-4 h-4"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-gray-300 uppercase">Glass Panel Layer</span>
                    <input
                      type="checkbox"
                      checked={designState.showGlassPanel}
                      onChange={(e) =>
                        setDesignState((prev) => ({ ...prev, showGlassPanel: e.target.checked }))
                      }
                      className="accent-neon-cyan w-4 h-4"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* BRANDING TAB */}
            {activeTab === "branding" && (
              <div className="space-y-6">
                {/* Logo Configuration */}
                <div className="p-4 bg-slate-900 border border-white/10 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-display font-bold text-white uppercase">Lizzdo Logo</span>
                    <input
                      type="checkbox"
                      checked={designState.logo.visible}
                      onChange={(e) =>
                        setDesignState((prev) => ({
                          ...prev,
                          logo: { ...prev.logo, visible: e.target.checked },
                        }))
                      }
                      className="accent-neon-cyan w-4 h-4"
                    />
                  </div>

                  <input
                    type="text"
                    value={designState.logo.text}
                    onChange={(e) =>
                      setDesignState((prev) => ({
                        ...prev,
                        logo: { ...prev.logo, text: e.target.value },
                      }))
                    }
                    className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-white font-display text-sm focus:border-neon-cyan"
                    placeholder="LIZZDO"
                  />

                  <button
                    onClick={() => logoInputRef.current?.click()}
                    className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-gray-300 hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Upload size={14} /> Upload Custom Logo Image
                  </button>
                </div>

                {/* CTA Button Editor */}
                <div className="p-4 bg-slate-900 border border-white/10 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-display font-bold text-white uppercase">CTA Button</span>
                    <input
                      type="checkbox"
                      checked={designState.cta.visible}
                      onChange={(e) =>
                        setDesignState((prev) => ({
                          ...prev,
                          cta: { ...prev.cta, visible: e.target.checked },
                        }))
                      }
                      className="accent-neon-cyan w-4 h-4"
                    />
                  </div>

                  <input
                    type="text"
                    value={designState.cta.text}
                    onChange={(e) =>
                      setDesignState((prev) => ({
                        ...prev,
                        cta: { ...prev.cta, text: e.target.value },
                      }))
                    }
                    className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-white font-display text-xs focus:border-neon-cyan"
                  />
                </div>
              </div>
            )}

            {/* LAYERS TAB */}
            {activeTab === "layers" && (
              <LayerManager
                layers={designState.layers}
                onToggleVisibility={handleToggleLayerVisibility}
                onToggleLock={handleToggleLayerLock}
                onMoveLayer={handleMoveLayer}
              />
            )}
          </div>
        </aside>

        {/* Right Interactive Preview Stage */}
        <main className="flex-1 bg-slate-900/60 p-6 md:p-10 flex flex-col items-center justify-center relative overflow-auto">
          {/* Zoom Level Controls */}
          <div className="absolute top-6 right-6 z-20 flex items-center gap-2 bg-slate-950/80 border border-white/10 rounded-xl p-1.5 backdrop-blur-md">
            <button
              onClick={() => setStageScale((s) => Math.max(0.3, s - 0.1))}
              className="p-1.5 text-gray-400 hover:text-white transition-colors"
              title="Zoom Out"
            >
              <ZoomOut size={16} />
            </button>
            <span className="text-xs font-mono text-neon-cyan px-2">
              {Math.round(stageScale * 100)}%
            </span>
            <button
              onClick={() => setStageScale((s) => Math.min(1.5, s + 0.1))}
              className="p-1.5 text-gray-400 hover:text-white transition-colors"
              title="Zoom In"
            >
              <ZoomIn size={16} />
            </button>
            <button
              onClick={() => setStageScale(0.75)}
              className="p-1.5 text-gray-400 hover:text-white border-l border-white/10 pl-2 transition-colors"
              title="Reset Zoom"
            >
              <Maximize2 size={16} />
            </button>
          </div>

          {/* Canvas Stage Wrapper */}
          <div className="relative p-8 flex items-center justify-center">
            <div
              style={{
                width: `${designState.width * stageScale}px`,
                height: `${designState.height * stageScale}px`,
              }}
              className="transition-all duration-300 relative"
            >
              <CanvasStage ref={stageRef} state={designState} scaleFactor={stageScale} />
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <ExportDialog
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        targetRef={stageRef}
        defaultTitle={designState.title}
        canvasWidth={designState.width}
        canvasHeight={designState.height}
      />

      <TemplateLibrary
        isOpen={isTemplateOpen}
        onClose={() => setIsTemplateOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />
    </div>
  );
}

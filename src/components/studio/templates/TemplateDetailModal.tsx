import React, { useState } from "react";
import { ExtendedTemplateMeta, MAIN_TEMPLATE_GROUPS } from "../../../data/templateMarketplaceData";
import { useEcosystem } from "../../../context/EcosystemContext";
import { useStudio } from "../../../context/StudioContext";
import {
  X,
  Play,
  Heart,
  Palette,
  Maximize2,
  Sparkles,
  Layers,
  Check,
  Tag,
  Copy,
  Edit3,
  Bookmark,
  Share2,
  Download,
  Upload,
  RefreshCw,
  Sliders,
  ZoomIn,
  ZoomOut,
  Maximize,
  CheckCircle2,
  Columns,
  SlidersHorizontal,
  Trash2,
  Info,
  CheckSquare,
} from "lucide-react";
import {
  ASPECT_RATIO_PRESETS,
  adaptDesignStateToDimensions,
  applyBrandKitToDesignState,
  replaceSmartPlaceholderInDesignState,
} from "../../../utils/templateEngine";

interface TemplateDetailModalProps {
  template: ExtendedTemplateMeta | null;
  onClose: () => void;
  onOpenInDesigner: (template: ExtendedTemplateMeta) => void;
}

export function TemplateDetailModal({
  template,
  onClose,
  onOpenInDesigner,
}: TemplateDetailModalProps) {
  const {
    favoriteTemplateIds,
    toggleFavoriteTemplate,
    saveCustomTemplate,
    deleteCustomTemplate,
    duplicateTemplate,
    exportTemplatePackage,
    trackTemplateUsed,
    templates,
  } = useEcosystem();

  const { addNotification, activeBrandKit } = useStudio();

  // Local Interactive States
  const [customTitle, setCustomTitle] = useState(template?.name || "");
  const [selectedPrimaryColor, setSelectedPrimaryColor] = useState(
    template?.colorPalette?.[0] || "#00f5ff"
  );
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isFullscreenPreview, setIsFullscreenPreview] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Responsive Engine Preset State
  const [activeAspectPreset, setActiveAspectPreset] = useState<string>("default");
  const [currentDimensions, setCurrentDimensions] = useState({
    width: template?.width || 1920,
    height: template?.height || 1080,
  });

  // Brand Kit Auto Injection State
  const [isBrandKitEnabled, setIsBrandKitEnabled] = useState(false);

  // Smart Placeholders Interactive State
  const [placeholderValues, setPlaceholderValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    template?.placeholders?.forEach((p) => {
      initial[p.type] = p.defaultValue;
    });
    return initial;
  });

  // Comparison State
  const [compareTemplateId, setCompareTemplateId] = useState<string>("");

  if (!template) return null;

  const isFavorite = favoriteTemplateIds.includes(template.id);
  const isCustom = !!template.isCustom;

  // Derive Current Working Design State with Brand Kit & Aspect Ratio Transformations
  let workingState = { ...template.state };

  if (customTitle && customTitle !== template.name) {
    workingState.title = customTitle;
  }

  // 1. Apply Brand Kit if enabled
  if (isBrandKitEnabled && activeBrandKit) {
    workingState = applyBrandKitToDesignState(workingState, activeBrandKit, {
      applyColors: true,
      applyFonts: true,
      applyLogo: true,
      applyText: true,
      applyWatermark: activeBrandKit.watermark?.enabled,
    });
  } else if (selectedPrimaryColor) {
    workingState.background = { ...workingState.background, solidColor: selectedPrimaryColor };
  }

  // 2. Apply Smart Placeholders
  Object.entries(placeholderValues).forEach(([type, value]) => {
    if (value) {
      workingState = replaceSmartPlaceholderInDesignState(
        workingState,
        type as any,
        value
      );
    }
  });

  // 3. Apply Responsive Dimensions Adaptation if preset changed
  if (
    currentDimensions.width !== template.width ||
    currentDimensions.height !== template.height
  ) {
    workingState = adaptDesignStateToDimensions(
      workingState,
      currentDimensions.width,
      currentDimensions.height
    );
  }

  // Handlers
  const handleLaunchInDesigner = () => {
    trackTemplateUsed(template.id);
    const finalTemplate: ExtendedTemplateMeta = {
      ...template,
      name: customTitle || template.name,
      width: currentDimensions.width,
      height: currentDimensions.height,
      state: workingState,
    };
    onOpenInDesigner(finalTemplate);
  };

  const handleSaveAsCustom = () => {
    const saved = saveCustomTemplate(
      `${customTitle || template.name} (Custom)`,
      template.category,
      workingState,
      template.tags,
      template.style,
      template.mainCategory,
      currentDimensions.width,
      currentDimensions.height
    );
    addNotification("Template Saved", `Saved "${saved.name}" to your Custom Vault.`, "success");
  };

  const handleDuplicate = () => {
    const dup = duplicateTemplate(template.id);
    if (dup) {
      addNotification("Template Duplicated", `Created copy "${dup.name}"`, "success");
    }
  };

  const handleDelete = () => {
    deleteCustomTemplate(template.id);
    addNotification("Template Deleted", `Deleted "${template.name}"`, "info");
    onClose();
  };

  const handleExportPackage = () => {
    exportTemplatePackage(template.id);
    addNotification("Package Exported", `Downloaded JSON manifest for "${template.name}"`, "success");
  };

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    addNotification("Link Copied", "Template share link copied to clipboard.", "info");
  };

  const handlePresetSelect = (presetId: string) => {
    setActiveAspectPreset(presetId);
    if (presetId === "default") {
      setCurrentDimensions({ width: template.width, height: template.height });
    } else {
      const preset = ASPECT_RATIO_PRESETS.find((p) => p.id === presetId);
      if (preset) {
        setCurrentDimensions({ width: preset.width, height: preset.height });
      }
    }
  };

  const compareTargetTemplate = templates.find((t) => t.id === compareTemplateId);

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-xl z-50 flex items-center justify-center p-4 font-mono select-none animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-neutral-900 border border-white/15 w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* MODAL HEADER */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/50">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-neon-purple/20 border border-neon-purple/40 text-neon-purple">
              <Bookmark className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-neon-purple/20 border border-neon-purple/40 text-[10px] text-neon-purple font-bold uppercase">
                  {template.mainCategory} • {template.category}
                </span>
                <span className="text-[10px] text-gray-400 font-bold">
                  {currentDimensions.width} x {currentDimensions.height} PX
                </span>
                {isCustom && (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500 text-emerald-400 text-[9px] font-bold">
                    Custom Template
                  </span>
                )}
              </div>
              <h2 className="font-display font-bold text-lg text-white truncate max-w-lg">
                {template.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toggleFavoriteTemplate(template.id)}
              className={`p-2.5 rounded-xl border transition-all ${
                isFavorite
                  ? "bg-rose-500/20 border-rose-500 text-rose-400"
                  : "bg-neutral-800 border-white/10 text-gray-400 hover:text-white"
              }`}
              title="Toggle Favorite"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? "fill-rose-400" : ""}`} />
            </button>

            <button
              type="button"
              onClick={handleExportPackage}
              className="p-2.5 rounded-xl bg-neutral-800 border border-white/10 text-gray-400 hover:text-white transition-colors"
              title="Export Package JSON"
            >
              <Download className="w-4 h-4 text-neon-cyan" />
            </button>

            <button
              type="button"
              onClick={handleShareLink}
              className="p-2.5 rounded-xl bg-neutral-800 border border-white/10 text-gray-400 hover:text-white transition-colors"
              title="Share Link"
            >
              {isCopied ? <Check className="w-4 h-4 text-neon-cyan" /> : <Share2 className="w-4 h-4" />}
            </button>

            {isCustom && (
              <button
                type="button"
                onClick={handleDelete}
                className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
                title="Delete Custom Template"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2.5 rounded-xl bg-neutral-800 border border-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6 flex-1 bg-black/60">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT COLUMN: LIVE ADAPTIVE CANVAS PREVIEW STAGE */}
            <div className="lg:col-span-7 flex flex-col space-y-3">
              <div className="flex items-center justify-between text-xs text-gray-400 bg-neutral-900 border border-white/10 p-2.5 rounded-2xl">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-neon-cyan" /> Real-Time Adaptive Preview
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.max(50, z - 25))}
                    className="p-1 rounded hover:bg-white/10 text-gray-300"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-mono text-neon-cyan">{zoomLevel}%</span>
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.min(200, z + 25))}
                    className="p-1 rounded hover:bg-white/10 text-gray-300"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* CANVAS BOX CONTAINER */}
              <div
                className={`bg-black/90 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[380px] relative overflow-hidden transition-all ${
                  isFullscreenPreview ? "fixed inset-4 z-50 bg-black/95 border-neon-cyan" : ""
                }`}
              >
                <div
                  className="rounded-2xl p-6 flex flex-col justify-between shadow-2xl relative transition-all overflow-hidden border border-white/20"
                  style={{
                    width: `${Math.min(500, (currentDimensions.width / 1920) * 500) * (zoomLevel / 100)}px`,
                    aspectRatio: `${currentDimensions.width} / ${currentDimensions.height}`,
                    backgroundColor: isBrandKitEnabled && activeBrandKit ? activeBrandKit.colors.background : selectedPrimaryColor,
                  }}
                >
                  {/* Internal Element Stack Mock */}
                  <div className="space-y-3">
                    <span className="px-2.5 py-1 rounded bg-black/70 text-[10px] font-bold text-neon-cyan border border-neon-cyan/40 w-max block">
                      {template.style}
                    </span>
                    <h3
                      className="font-display font-black text-2xl uppercase tracking-wider line-clamp-2"
                      style={{
                        color: isBrandKitEnabled && activeBrandKit ? activeBrandKit.colors.primary : "#ffffff",
                        fontFamily: isBrandKitEnabled && activeBrandKit ? activeBrandKit.typography.heading.fontFamily : "Orbitron",
                      }}
                    >
                      {placeholderValues["Title"] || customTitle || template.name}
                    </h3>
                    <p
                      className="text-xs line-clamp-3 opacity-90"
                      style={{
                        color: isBrandKitEnabled && activeBrandKit ? activeBrandKit.colors.text : "#d1d5db",
                      }}
                    >
                      {placeholderValues["Subtitle"] || template.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-gray-300 border-t border-white/20 pt-3">
                    <span>{isBrandKitEnabled && activeBrandKit ? activeBrandKit.brandName : template.author || "Lizzdo Studio"}</span>
                    <span className="text-neon-cyan font-bold">{workingState.elements?.length || 6} Editable Layers</span>
                  </div>
                </div>

                <span className="absolute bottom-3 left-3 text-[10px] text-gray-500 font-mono">
                  {currentDimensions.width}x{currentDimensions.height} PX • Scale {zoomLevel}%
                </span>
              </div>

              {/* RESPONSIVE ENGINE ASPECT RATIO SELECTOR */}
              <div className="p-3 bg-neutral-900 border border-white/10 rounded-2xl space-y-2 font-mono text-xs">
                <span className="text-[10px] text-gray-400 uppercase font-bold flex items-center gap-1">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-neon-cyan" /> Responsive Preset Switcher
                </span>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
                  <button
                    type="button"
                    onClick={() => handlePresetSelect("default")}
                    className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all whitespace-nowrap shrink-0 ${
                      activeAspectPreset === "default"
                        ? "bg-neon-cyan text-black border-neon-cyan"
                        : "bg-black/40 border-white/10 text-gray-300 hover:text-white"
                    }`}
                  >
                    Original ({template.width}x{template.height})
                  </button>

                  {ASPECT_RATIO_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handlePresetSelect(p.id)}
                      className={`px-3 py-1.5 rounded-xl border text-[11px] transition-all whitespace-nowrap shrink-0 ${
                        activeAspectPreset === p.id
                          ? "bg-neon-cyan text-black font-bold border-neon-cyan"
                          : "bg-black/40 border-white/10 text-gray-400 hover:text-white"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: BRAND KIT + SMART PLACEHOLDERS + CUSTOMIZATION */}
            <div className="lg:col-span-5 space-y-5">
              {/* BRAND KIT AUTO THEME INJECTION */}
              {activeBrandKit && (
                <div className="p-4 bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 border border-neon-purple/50 rounded-2xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-neon-purple" /> Active Brand Kit
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsBrandKitEnabled(!isBrandKitEnabled)}
                      className={`px-3 py-1 rounded-xl text-[11px] font-bold border transition-all ${
                        isBrandKitEnabled
                          ? "bg-neon-purple text-black border-neon-purple"
                          : "bg-black/60 border-white/20 text-gray-400 hover:text-white"
                      }`}
                    >
                      {isBrandKitEnabled ? "Branding Active" : "Apply Brand Theme"}
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-300">
                    Applying <strong className="text-white">{activeBrandKit.brandName}</strong> logo, colors, fonts, and watermarks automatically to this template.
                  </p>
                </div>
              )}

              {/* TITLE RENAME */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-400 uppercase tracking-wider flex items-center gap-1 font-bold">
                  <Edit3 className="w-3.5 h-3.5 text-neon-cyan" /> Template Name
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-neon-cyan font-mono"
                />
              </div>

              {/* SMART PLACEHOLDERS EDITOR */}
              {template.placeholders && template.placeholders.length > 0 && (
                <div className="p-4 bg-neutral-900 border border-white/10 rounded-2xl space-y-3 font-mono text-xs">
                  <span className="text-[10px] text-neon-cyan uppercase font-bold flex items-center gap-1">
                    <CheckSquare className="w-3.5 h-3.5" /> Dynamic Smart Placeholders
                  </span>

                  <div className="space-y-2 max-h-[180px] overflow-y-auto custom-scrollbar pr-1">
                    {template.placeholders.map((p) => (
                      <div key={p.type} className="space-y-1">
                        <label className="text-[10px] text-gray-400 block font-bold">{p.label}</label>
                        <input
                          type="text"
                          value={placeholderValues[p.type] || ""}
                          onChange={(e) =>
                            setPlaceholderValues((prev) => ({
                              ...prev,
                              [p.type]: e.target.value,
                            }))
                          }
                          placeholder={p.defaultValue}
                          className="w-full bg-black/60 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-neon-cyan"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* COLOR SWATCH REPLACER */}
              {!isBrandKitEnabled && (
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 uppercase tracking-wider flex items-center gap-1 font-bold">
                    <Palette className="w-3.5 h-3.5 text-neon-purple" /> Primary Color Swatch
                  </label>
                  <div className="flex items-center gap-2">
                    {["#00f5ff", "#a855f7", "#f43f5e", "#f59e0b", "#10b981", "#0f172a", "#000000"].map(
                      (color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setSelectedPrimaryColor(color)}
                          className={`w-7 h-7 rounded-full border-2 transition-transform ${
                            selectedPrimaryColor === color
                              ? "border-white scale-110 shadow-[0_0_12px_rgba(255,255,255,0.8)]"
                              : "border-transparent opacity-80 hover:opacity-100"
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      )
                    )}
                  </div>
                </div>
              )}

              {/* SIDE BY SIDE TEMPLATE COMPARISON */}
              <div className="space-y-1.5 font-mono text-xs">
                <label className="text-[10px] text-gray-400 uppercase font-bold flex items-center gap-1">
                  <Columns className="w-3.5 h-3.5 text-amber-400" /> Compare Side-By-Side With
                </label>
                <select
                  value={compareTemplateId}
                  onChange={(e) => setCompareTemplateId(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none text-xs"
                >
                  <option value="">Select Template to Compare...</option>
                  {templates
                    .filter((t) => t.id !== template.id)
                    .map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.width}x{t.height})
                      </option>
                    ))}
                </select>

                {compareTargetTemplate && (
                  <div className="p-3 bg-neutral-900/90 border border-amber-400/50 rounded-xl space-y-1.5 text-[11px] animate-in fade-in">
                    <div className="flex justify-between text-gray-300">
                      <span>Target Dimensions</span>
                      <strong className="text-amber-400">{compareTargetTemplate.width} x {compareTargetTemplate.height}</strong>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Style & Platform</span>
                      <strong className="text-white">{compareTargetTemplate.style} • {compareTargetTemplate.platform}</strong>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="p-5 border-t border-white/10 bg-black/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleSaveAsCustom}
              className="px-4 py-2.5 rounded-xl border border-white/10 bg-neutral-800 hover:bg-neutral-700 text-gray-200 text-xs font-bold transition-colors flex items-center justify-center gap-2"
            >
              <Copy className="w-4 h-4 text-neon-purple" /> Save as Reusable Preset
            </button>

            <button
              type="button"
              onClick={handleDuplicate}
              className="px-4 py-2.5 rounded-xl border border-white/10 bg-neutral-800 hover:bg-neutral-700 text-gray-200 text-xs font-bold transition-colors flex items-center justify-center gap-2"
            >
              <Copy className="w-4 h-4 text-neon-cyan" /> Duplicate
            </button>
          </div>

          <button
            type="button"
            onClick={handleLaunchInDesigner}
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-neon-purple to-neon-cyan text-black font-display font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_25px_rgba(0,245,255,0.6)] transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <Play className="w-4 h-4 fill-black" /> Open & Edit in Designer V1
          </button>
        </div>
      </div>
    </div>
  );
}

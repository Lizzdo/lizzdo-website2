import React, { useState } from "react";
import { ExtendedTemplateMeta } from "../../../data/templateMarketplaceData";
import { useEcosystem } from "../../../context/EcosystemContext";
import { useStudio } from "../../../context/StudioContext";
import {
  X,
  Play,
  Heart,
  FolderPlus,
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
} from "lucide-react";

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
    collections,
    addAssetToCollection,
    saveCustomTemplate,
  } = useEcosystem();

  const { addNotification } = useStudio();

  const [customTitle, setCustomTitle] = useState(template?.name || "");
  const [selectedPrimaryColor, setSelectedPrimaryColor] = useState(
    template?.colorPalette?.[0] || "#00f5ff"
  );
  const [selectedCollectionId, setSelectedCollectionId] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  if (!template) return null;

  const isFavorite = favoriteTemplateIds.includes(template.id);

  const handleLaunchInDesigner = () => {
    // Create state with potential modified color/title
    const updatedState = {
      ...template.state,
      title: customTitle || template.name,
      backgroundColor: selectedPrimaryColor,
    };
    const modifiedTemplate: ExtendedTemplateMeta = {
      ...template,
      name: customTitle || template.name,
      state: updatedState,
    };
    onOpenInDesigner(modifiedTemplate);
  };

  const handleSaveAsCustom = () => {
    saveCustomTemplate(
      `${customTitle || template.name} (Custom)`,
      template.category,
      {
        ...template.state,
        title: customTitle || template.name,
        background: { ...template.state.background, solidColor: selectedPrimaryColor },
      },
      template.tags,
      template.style
    );
    addNotification("Template Saved", "Added to your custom template vault", "success");
  };

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    addNotification("Link Copied", "Template link copied to clipboard", "info");
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 font-mono select-none animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-neutral-900 border border-white/15 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-neon-purple/20 border border-neon-purple/40 text-neon-purple">
              <Bookmark className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-neon-purple/20 border border-neon-purple/40 text-[10px] text-neon-purple font-bold uppercase">
                  {template.category}
                </span>
                <span className="text-[10px] text-gray-400">
                  {template.width} x {template.height} PX • {template.aspectRatio}
                </span>
              </div>
              <h2 className="font-display font-bold text-lg text-white truncate max-w-md">
                {template.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toggleFavoriteTemplate(template.id)}
              className={`p-2 rounded-xl border transition-all ${
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
              onClick={handleShareLink}
              className="p-2 rounded-xl bg-neutral-800 border border-white/10 text-gray-400 hover:text-white transition-colors"
              title="Share Link"
            >
              {isCopied ? <Check className="w-4 h-4 text-neon-cyan" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-800 border border-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* BODY CONTENT */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6 flex-1 bg-black/60">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* CANVAS STAGE PREVIEW */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center bg-black/90 border border-white/10 rounded-2xl p-6 min-h-[320px] relative overflow-hidden group">
              <div
                className="w-full max-w-sm aspect-video rounded-xl border border-white/20 p-4 flex flex-col justify-between shadow-2xl relative transition-all"
                style={{ backgroundColor: selectedPrimaryColor }}
              >
                <div className="space-y-2">
                  <span className="px-2 py-0.5 rounded bg-black/60 text-[9px] font-bold text-neon-cyan border border-neon-cyan/40">
                    {template.style}
                  </span>
                  <h3 className="font-display font-black text-xl text-white uppercase tracking-wider line-clamp-2">
                    {customTitle || template.name}
                  </h3>
                </div>

                <div className="flex items-center justify-between text-[10px] text-gray-300 border-t border-white/20 pt-2">
                  <span>{template.author || "Lizzdo Studio"}</span>
                  <span>{template.state.elements?.length || 5} Layers</span>
                </div>
              </div>

              <div className="absolute bottom-3 left-3 text-[10px] text-gray-500 font-mono">
                Real-Time 1:1 Vector Preview
              </div>
            </div>

            {/* CUSTOMIZATION & DETAILS PANEL */}
            <div className="lg:col-span-5 space-y-5">
              {/* Title Edit */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <Edit3 className="w-3 h-3 text-neon-cyan" /> Project Title
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="Enter template name..."
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-cyan"
                />
              </div>

              {/* Color Swatch Replacer */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <Palette className="w-3 h-3 text-neon-purple" /> Primary Accent Swatch
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
                            ? "border-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                            : "border-transparent opacity-80 hover:opacity-100"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    )
                  )}
                </div>
              </div>

              {/* Metadata Badges */}
              <div className="p-3 bg-neutral-900/80 border border-white/10 rounded-xl space-y-2 text-[11px]">
                <div className="flex justify-between text-gray-400">
                  <span>Category</span>
                  <span className="text-white font-bold">{template.category}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Visual Style</span>
                  <span className="text-neon-cyan font-bold">{template.style}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Platform Format</span>
                  <span className="text-white font-bold">{template.platform}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Total Uses</span>
                  <span className="text-emerald-400 font-bold">{template.usesCount || 100}+</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {template.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md bg-neutral-800 border border-white/10 text-[10px] text-gray-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-5 border-t border-white/10 bg-black/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleSaveAsCustom}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-white/10 bg-neutral-800 hover:bg-neutral-700 text-gray-200 text-xs font-bold transition-colors flex items-center justify-center gap-2"
          >
            <Copy className="w-4 h-4 text-neon-purple" /> Save to My Custom Library
          </button>

          <button
            type="button"
            onClick={handleLaunchInDesigner}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-neon-purple to-neon-cyan text-black font-display font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_25px_rgba(0,245,255,0.6)] transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-black" /> Open & Edit in Designer V1
          </button>
        </div>
      </div>
    </div>
  );
}

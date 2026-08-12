import React, { useState } from "react";
import { DesignTemplate, DesignState } from "../../types/designer";
import { useEcosystem } from "../../context/EcosystemContext";
import {
  Plus,
  Bookmark,
  Search,
  Sliders,
  Sparkles,
  Layers,
  Image as ImageIcon,
  Type,
  Maximize2,
  Check,
  Star,
  Eye,
  Box,
  Palette,
  X,
  Zap,
} from "lucide-react";

interface TemplateManagerProps {
  currentState: DesignState;
  onSelectTemplate: (template: DesignTemplate) => void;
  onSaveCurrentAsTemplate: (name: string, category: DesignTemplate["category"]) => void;
}

export const TemplateManager: React.FC<TemplateManagerProps> = ({
  currentState,
  onSelectTemplate,
  onSaveCurrentAsTemplate,
}) => {
  const { templates, saveCustomTemplate, favoriteTemplateIds, toggleFavoriteTemplate } =
    useEcosystem();

  const [isSaving, setIsSaving] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newCategory, setNewCategory] = useState<any>("Portfolio");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("All");
  const [selectedStyleFilter, setSelectedStyleFilter] = useState<string>("All");
  const [previewTemplate, setPreviewTemplate] = useState<any | null>(null);

  const categories = [
    "All",
    "Social Media",
    "Mockups",
    "Minimal",
    "Cyberpunk",
    "Glassmorphism",
    "Editorial",
    "Corporate",
    "Portfolio",
    "Product Showcase",
    "Personal Brand",
    "Tech / AI",
  ];

  const stylesList = [
    "All",
    "Cyberpunk",
    "Minimalist",
    "Editorial",
    "Glassmorphism",
    "Corporate Dark",
    "Futuristic Tech",
    "Neon Luxury",
    "SaaS Modern",
    "Bold Brutalist",
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplateName.trim()) return;

    saveCustomTemplate(newTemplateName.trim(), newCategory, currentState);
    onSaveCurrentAsTemplate(newTemplateName.trim(), newCategory);
    setNewTemplateName("");
    setIsSaving(false);
  };

  const filtered = templates.filter((t) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      t.name.toLowerCase().includes(query) ||
      t.category.toLowerCase().includes(query) ||
      t.mainCategory?.toLowerCase().includes(query) ||
      t.description?.toLowerCase().includes(query) ||
      (t.tags && t.tags.some((tag) => tag.toLowerCase().includes(query)));

    const catFilter = selectedCategoryFilter.toLowerCase();
    const matchesCat =
      catFilter === "all" ||
      t.category.toLowerCase().includes(catFilter) ||
      t.mainCategory?.toLowerCase().includes(catFilter) ||
      (catFilter === "social media" &&
        ["instagram", "facebook", "linkedin", "x", "youtube", "tiktok", "pinterest", "social"].some(
          (s) => t.category.toLowerCase().includes(s) || t.mainCategory?.toLowerCase().includes(s)
        )) ||
      (catFilter === "mockups" &&
        (t.category.toLowerCase().includes("mockup") || t.name.toLowerCase().includes("mockup"))) ||
      (catFilter === "minimal" &&
        (t.style?.toLowerCase().includes("minimal") || t.name.toLowerCase().includes("minimal"))) ||
      (catFilter === "cyberpunk" &&
        (t.style?.toLowerCase().includes("cyber") || t.name.toLowerCase().includes("cyber"))) ||
      (catFilter === "glassmorphism" &&
        (t.style?.toLowerCase().includes("glass") || t.name.toLowerCase().includes("glass"))) ||
      (catFilter === "editorial" &&
        (t.style?.toLowerCase().includes("editorial") || t.name.toLowerCase().includes("editorial"))) ||
      (catFilter === "corporate" &&
        (t.style?.toLowerCase().includes("corporate") || t.name.toLowerCase().includes("corporate"))) ||
      (catFilter === "tech / ai" &&
        (t.style?.toLowerCase().includes("tech") ||
          t.name.toLowerCase().includes("tech") ||
          t.name.toLowerCase().includes("ai")));

    const styleFilter = selectedStyleFilter.toLowerCase();
    const matchesStyle =
      styleFilter === "all" || (t.style && t.style.toLowerCase().includes(styleFilter));

    return matchesSearch && matchesCat && matchesStyle;
  });

  const handleApply = (t: any) => {
    onSelectTemplate({
      id: t.id,
      name: t.name,
      category: (t.mainCategory || t.category) as any,
      description: t.description || "",
      previewColor: t.colorPalette?.[0] || "#00f5ff",
      state: t.state,
    });
    setPreviewTemplate(null);
  };

  return (
    <div className="space-y-3 text-xs font-mono text-gray-300 select-none">
      {/* Header & Save Action */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-1.5">
          <Bookmark className="w-4 h-4 text-neon-cyan animate-pulse" />
          <h3 className="font-display font-bold text-white text-xs tracking-wider uppercase">
            Presets Library
          </h3>
        </div>
        <button
          type="button"
          onClick={() => setIsSaving(!isSaving)}
          className="px-2.5 py-1 rounded-xl bg-neon-cyan/20 border border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan/30 text-[10px] font-bold flex items-center gap-1 transition-all"
        >
          <Plus className="w-3.5 h-3.5" /> Save Canvas
        </button>
      </div>

      {/* Save Custom Form */}
      {isSaving && (
        <form
          onSubmit={handleSave}
          className="p-3 rounded-2xl bg-black/90 border border-neon-cyan/50 space-y-2 shadow-xl"
        >
          <h4 className="text-[10px] uppercase text-neon-cyan font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Save Canvas as Custom Preset
          </h4>
          <input
            type="text"
            required
            placeholder="Preset title..."
            value={newTemplateName}
            onChange={(e) => setNewTemplateName(e.target.value)}
            className="w-full bg-neutral-900 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-neon-cyan font-sans"
          />
          <div className="flex gap-2">
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1 bg-neutral-900 border border-white/10 rounded-xl px-2 py-1 text-xs text-white"
            >
              {categories
                .filter((c) => c !== "All")
                .map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
            </select>
            <button
              type="submit"
              className="px-3 py-1 bg-neon-cyan text-black font-bold rounded-xl text-xs hover:bg-cyan-300 transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      )}

      {/* Search Bar & Style Filter */}
      <div className="space-y-1.5">
        <div className="relative">
          <input
            type="text"
            placeholder="Search presets by title, category, or style..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/60 border border-white/10 rounded-xl px-2.5 py-1.5 pl-8 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan"
          />
          <Search className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Style Selector */}
        <div className="flex items-center gap-2">
          <label className="text-[10px] text-gray-400 shrink-0 font-bold">Style:</label>
          <select
            value={selectedStyleFilter}
            onChange={(e) => setSelectedStyleFilter(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-0.5 text-[11px] text-gray-300 focus:border-neon-cyan"
          >
            {stylesList.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 custom-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategoryFilter(cat)}
            className={`px-2 py-1 rounded-lg border text-[10px] whitespace-nowrap transition-all ${
              selectedCategoryFilter === cat
                ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan font-bold"
                : "bg-black/40 border-white/5 text-gray-400 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Presets Cards List */}
      <div className="space-y-2.5 max-h-[460px] overflow-y-auto custom-scrollbar pr-1">
        {filtered.length === 0 ? (
          <div className="p-6 text-center text-gray-500 space-y-2 bg-black/40 rounded-2xl border border-white/5">
            <Search className="w-6 h-6 text-neon-cyan/40 mx-auto" />
            <p className="text-gray-300 font-bold text-xs">No matching presets found</p>
            <p className="text-[10px]">Try clearing search or picking another category filter.</p>
          </div>
        ) : (
          filtered.map((t) => {
            const isFav = favoriteTemplateIds.includes(t.id);
            const elementsList = t.state?.elements || [];
            const imageCount = elementsList.filter((e: any) => e.type === "image").length;
            const textCount = elementsList.filter((e: any) => e.type === "text").length;
            const totalCount = elementsList.length;

            return (
              <div
                key={t.id}
                className="p-3 rounded-2xl bg-black/40 border border-white/10 hover:border-neon-cyan/70 transition-all group relative space-y-2 overflow-hidden shadow-lg"
              >
                {/* Visual Header / Banner Frame */}
                <div
                  onClick={() => setPreviewTemplate(t)}
                  style={{
                    backgroundColor: t.colorPalette?.[2] || "#0a0d18",
                    backgroundImage: `linear-gradient(135deg, ${
                      t.colorPalette?.[0] || "#00f5ff"
                    }22, ${t.colorPalette?.[1] || "#a855f7"}22)`,
                  }}
                  className="h-20 rounded-xl border border-white/10 flex items-center justify-between p-3 relative cursor-pointer overflow-hidden group-hover:scale-[1.01] transition-transform"
                >
                  <div className="space-y-1 z-10">
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-black/60 border border-white/20 text-neon-cyan uppercase tracking-wider">
                      {t.category || t.mainCategory}
                    </span>
                    <h4 className="font-bold text-white text-xs truncate max-w-[180px] drop-shadow-md">
                      {t.name}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1 z-10 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewTemplate(t);
                      }}
                      className="p-1.5 rounded-lg bg-black/60 border border-white/20 hover:border-neon-cyan text-gray-300 hover:text-neon-cyan transition-all"
                      title="Preview Preset"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavoriteTemplate(t.id);
                      }}
                      className={`p-1.5 rounded-lg bg-black/60 border border-white/20 transition-all ${
                        isFav ? "text-rose-400 border-rose-400/50" : "text-gray-400 hover:text-white"
                      }`}
                      title="Favorite"
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>
                </div>

                {/* Specs & Breakdown Badges */}
                <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 pt-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-300 font-bold">
                      {t.width}×{t.height}
                    </span>
                    <span className="text-gray-500">•</span>
                    <span className="text-neon-purple font-bold">{t.style || "Editorial"}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-0.5 text-amber-300 font-bold">
                      <ImageIcon className="w-3 h-3" /> {imageCount}
                    </span>
                    <span className="flex items-center gap-0.5 text-cyan-300 font-bold">
                      <Type className="w-3 h-3" /> {textCount}
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold border border-emerald-500/30">
                      Editable
                    </span>
                  </div>
                </div>

                {/* Apply Preset Action Button */}
                <button
                  type="button"
                  onClick={() => handleApply(t)}
                  className="w-full py-1.5 px-3 rounded-xl bg-neon-cyan/20 hover:bg-neon-cyan/30 border border-neon-cyan/50 text-neon-cyan font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-[0.98]"
                >
                  <Zap className="w-3.5 h-3.5" /> Apply Preset to Canvas
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* PREVIEW MODAL DIALOG */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 font-sans text-xs">
          <div className="bg-neutral-900 border border-white/20 rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl text-gray-200 relative animate-in fade-in zoom-in-95 duration-150">
            {/* Close Button */}
            <button
              onClick={() => setPreviewTemplate(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Title & Category Header */}
            <div className="space-y-1">
              <span className="px-2 py-0.5 rounded-md bg-neon-cyan/20 border border-neon-cyan/40 text-neon-cyan font-mono text-[10px] font-bold uppercase">
                {previewTemplate.category || previewTemplate.mainCategory} • {previewTemplate.style}
              </span>
              <h3 className="text-lg font-bold text-white font-display">
                {previewTemplate.name}
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-mono">
                {previewTemplate.description ||
                  "Fully customizable preset composition with real editable image slots, vector shapes, typography, and layered effects."}
              </p>
            </div>

            {/* Preview Banner Simulation */}
            <div
              style={{
                backgroundColor: previewTemplate.colorPalette?.[2] || "#0a0d18",
                backgroundImage: `linear-gradient(135deg, ${
                  previewTemplate.colorPalette?.[0] || "#00f5ff"
                }33, ${previewTemplate.colorPalette?.[1] || "#a855f7"}33)`,
              }}
              className="h-44 rounded-2xl border border-white/20 p-4 flex flex-col justify-between relative overflow-hidden shadow-inner"
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-white/80">
                <span className="bg-black/60 px-2 py-1 rounded-md border border-white/10 font-bold">
                  Canvas: {previewTemplate.width} × {previewTemplate.height} PX
                </span>
                <span className="bg-black/60 px-2 py-1 rounded-md border border-white/10 font-bold">
                  Aspect Ratio: {previewTemplate.aspectRatio || "16:9"}
                </span>
              </div>

              <div className="space-y-1">
                <div className="text-base font-bold text-white font-display">
                  {previewTemplate.state?.title || previewTemplate.name}
                </div>
                <div className="text-[11px] font-mono text-neon-cyan font-bold">
                  100% Real Layers • Fully Interactive & Editable
                </div>
              </div>
            </div>

            {/* Layer Breakdown Summary */}
            <div className="grid grid-cols-3 gap-2 text-center font-mono">
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 space-y-0.5">
                <ImageIcon className="w-4 h-4 text-amber-300 mx-auto" />
                <div className="text-white font-bold">
                  {(previewTemplate.state?.elements || []).filter((e: any) => e.type === "image").length} Slots
                </div>
                <div className="text-[9px] text-gray-400">Replaceable Photos</div>
              </div>

              <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 space-y-0.5">
                <Type className="w-4 h-4 text-neon-cyan mx-auto" />
                <div className="text-white font-bold">
                  {(previewTemplate.state?.elements || []).filter((e: any) => e.type === "text").length} Layers
                </div>
                <div className="text-[9px] text-gray-400">Custom Typography</div>
              </div>

              <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 space-y-0.5">
                <Layers className="w-4 h-4 text-neon-purple mx-auto" />
                <div className="text-white font-bold">
                  {(previewTemplate.state?.elements || []).length} Total
                </div>
                <div className="text-[9px] text-gray-400">Canvas Objects</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPreviewTemplate(null)}
                className="flex-1 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-mono text-xs font-bold transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleApply(previewTemplate)}
                className="flex-1 py-2.5 rounded-2xl bg-neon-cyan text-black hover:bg-cyan-300 font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-neon-cyan/20"
              >
                <Zap className="w-4 h-4" /> APPLY PRESET NOW
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

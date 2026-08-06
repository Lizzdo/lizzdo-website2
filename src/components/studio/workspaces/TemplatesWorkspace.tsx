import React, { useState } from "react";
import { useEcosystem } from "../../../context/EcosystemContext";
import { useStudio } from "../../../context/StudioContext";
import {
  ExtendedTemplateMeta,
  TEMPLATE_CATEGORIES,
} from "../../../data/templateMarketplaceData";
import { SmartSearchFilterBar } from "../ecosystem/SmartSearchFilterBar";
import { TemplateDetailModal } from "../templates/TemplateDetailModal";
import {
  LayoutTemplate,
  Search,
  Sparkles,
  ArrowRight,
  Palette,
  Eye,
  Heart,
  Plus,
  Bookmark,
  Layers,
  FolderPlus,
} from "lucide-react";

export function TemplatesWorkspace() {
  const {
    templates,
    favoriteTemplateIds,
    toggleFavoriteTemplate,
    searchQuery,
    selectedCategory,
    selectedStyle,
    selectedOrientation,
    selectedColor,
    showFavoritesOnly,
  } = useEcosystem();

  const { createProject, setActiveToolId } = useStudio();

  const [activeTemplateModal, setActiveTemplateModal] =
    useState<ExtendedTemplateMeta | null>(null);

  // Filter Logic
  const filteredTemplates = templates.filter((t) => {
    // Search query match
    const matchesQuery =
      !searchQuery.trim() ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    // Category match
    const matchesCategory =
      selectedCategory === "All" ||
      t.category.toLowerCase() === selectedCategory.toLowerCase();

    // Style match
    const matchesStyle =
      selectedStyle === "All Styles" ||
      t.style.toLowerCase() === selectedStyle.toLowerCase();

    // Orientation match
    const matchesOrientation =
      selectedOrientation === "All Orientations" ||
      t.orientation.toLowerCase() === selectedOrientation.toLowerCase();

    // Favorites match
    const matchesFav = !showFavoritesOnly || favoriteTemplateIds.includes(t.id);

    return matchesQuery && matchesCategory && matchesStyle && matchesOrientation && matchesFav;
  });

  const handleOpenInDesigner = (tmpl: ExtendedTemplateMeta) => {
    // Instantiates project with design state and routes straight to Designer V1
    createProject(tmpl.name, "designer", tmpl.state);
    setActiveToolId("designer");
  };

  return (
    <div className="flex-1 bg-black text-white p-6 overflow-y-auto custom-scrollbar font-sans select-none space-y-6">
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl bg-neutral-900 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="space-y-1 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-purple/10 border border-neon-purple/30 text-neon-purple text-xs font-mono">
            <LayoutTemplate className="w-3.5 h-3.5" />
            <span>20 Categories • 1,000+ Vector Presets</span>
          </div>
          <h1 className="font-display font-black text-2xl md:text-3xl tracking-wider text-white uppercase">
            Professional Template Marketplace
          </h1>
          <p className="text-xs text-gray-400 font-mono max-w-2xl">
            Fully customizable design presets for SaaS landing pages, portfolios, cyber e-commerce drops, presentation decks, and social media banners.
          </p>
        </div>

        <button
          onClick={() => {
            createProject("Untitled Blank Canvas", "designer");
            setActiveToolId("designer");
          }}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-neon-purple to-neon-cyan text-black font-display font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(168,85,247,0.6)] transition-all flex items-center gap-2 shrink-0 z-10"
        >
          <Plus className="w-4 h-4 fill-black" /> Create Blank Design
        </button>
      </div>

      {/* SMART SEARCH & FILTERS BAR */}
      <SmartSearchFilterBar categories={TEMPLATE_CATEGORIES} type="templates" />

      {/* RESULTS SUMMARY */}
      <div className="flex items-center justify-between font-mono text-xs text-gray-400 px-1">
        <span>
          Showing <strong className="text-neon-cyan">{filteredTemplates.length}</strong> editable templates
        </span>
        {showFavoritesOnly && (
          <span className="text-rose-400 font-bold flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 fill-rose-400" /> Favorites Filter Active
          </span>
        )}
      </div>

      {/* TEMPLATES GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTemplates.map((tmpl) => {
          const isFav = favoriteTemplateIds.includes(tmpl.id);
          return (
            <div
              key={tmpl.id}
              className="rounded-2xl bg-neutral-900 border border-white/10 overflow-hidden hover:border-neon-purple/60 transition-all group flex flex-col justify-between shadow-lg relative"
            >
              {/* CANVAS PREVIEW CARD STAGE */}
              <div
                onClick={() => setActiveTemplateModal(tmpl)}
                className="h-44 bg-black/80 relative flex flex-col items-center justify-center p-4 border-b border-white/5 cursor-pointer overflow-hidden"
              >
                {/* Visual Swatch Card Background */}
                <div
                  className="w-full h-full rounded-xl p-3 flex flex-col justify-between border border-white/10 shadow-inner transition-transform group-hover:scale-105"
                  style={{ backgroundColor: tmpl.colorPalette?.[0] || "#111" }}
                >
                  <span className="px-2 py-0.5 rounded bg-black/60 text-[9px] font-mono text-neon-cyan font-bold w-max border border-neon-cyan/30">
                    {tmpl.style}
                  </span>
                  <div>
                    <h4 className="font-display font-bold text-xs text-white truncate">
                      {tmpl.name}
                    </h4>
                    <span className="text-[9px] text-gray-300 font-mono">
                      {tmpl.width} x {tmpl.height} PX
                    </span>
                  </div>
                </div>

                {/* Favorite Toggle Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavoriteTemplate(tmpl.id);
                  }}
                  className={`absolute top-3 right-3 p-1.5 rounded-lg border transition-all z-10 ${
                    isFav
                      ? "bg-rose-500/20 border-rose-500 text-rose-400"
                      : "bg-black/60 border-white/20 text-gray-400 hover:text-white"
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-rose-400" : ""}`} />
                </button>

                {/* Quick Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <span className="px-3 py-1.5 rounded-xl bg-neon-purple text-black font-bold text-xs font-mono flex items-center gap-1 shadow-lg">
                    <Eye className="w-3.5 h-3.5" /> Preview & Edit
                  </span>
                </div>
              </div>

              {/* CARD DETAILS */}
              <div className="p-3.5 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full bg-white/5 text-[9px] text-gray-300">
                    {tmpl.category}
                  </span>
                  <span className="text-[10px] text-gray-500">{tmpl.platform}</span>
                </div>

                <h3 className="font-bold text-white truncate group-hover:text-neon-purple transition-colors">
                  {tmpl.name}
                </h3>
                <p className="text-[10px] text-gray-400 line-clamp-2">{tmpl.description}</p>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <button
                    onClick={() => handleOpenInDesigner(tmpl)}
                    className="w-full py-1.5 rounded-xl bg-neon-purple/10 hover:bg-neon-purple hover:text-black border border-neon-purple/40 text-neon-purple font-bold text-xs transition-all flex items-center justify-center gap-2"
                  >
                    <span>Use Template</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* TEMPLATE DETAIL INSPECTOR MODAL */}
      {activeTemplateModal && (
        <TemplateDetailModal
          template={activeTemplateModal}
          onClose={() => setActiveTemplateModal(null)}
          onOpenInDesigner={(tmpl) => {
            setActiveTemplateModal(null);
            handleOpenInDesigner(tmpl);
          }}
        />
      )}
    </div>
  );
}

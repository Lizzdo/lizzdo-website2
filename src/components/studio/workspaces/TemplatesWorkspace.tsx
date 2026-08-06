import React, { useState, useRef } from "react";
import { useEcosystem } from "../../../context/EcosystemContext";
import { useStudio } from "../../../context/StudioContext";
import {
  ExtendedTemplateMeta,
  MAIN_TEMPLATE_GROUPS,
  TEMPLATE_SUBCATEGORIES,
  MainTemplateGroup,
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
  Upload,
  Download,
  Clock,
  CheckCircle2,
  SlidersHorizontal,
  Copy,
  Trash2,
  FileCode,
} from "lucide-react";

export function TemplatesWorkspace() {
  const {
    templates,
    favoriteTemplateIds,
    recentlyUsedTemplateIds,
    toggleFavoriteTemplate,
    searchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedStyle,
    selectedOrientation,
    showFavoritesOnly,
    showRecentlyUsedOnly,
    setShowRecentlyUsedOnly,
    importTemplatePackage,
    deleteCustomTemplate,
    duplicateTemplate,
  } = useEcosystem();

  const { createProject, setActiveToolId, activeBrandKit, addNotification } = useStudio();

  const [activeMainGroup, setActiveMainGroup] = useState<string>("All");
  const [activeTemplateModal, setActiveTemplateModal] = useState<ExtendedTemplateMeta | null>(null);

  const packageInputRef = useRef<HTMLInputElement | null>(null);

  // Main Group + Subcategory + Filter Logic
  const filteredTemplates = templates.filter((t) => {
    // Main category match
    if (activeMainGroup !== "All" && t.mainCategory !== activeMainGroup) {
      return false;
    }

    // Subcategory match
    if (selectedCategory !== "All" && t.category !== selectedCategory) {
      return false;
    }

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = t.name.toLowerCase().includes(q);
      const matchDesc = t.description.toLowerCase().includes(q);
      const matchTags = t.tags.some((tag) => tag.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchTags) return false;
    }

    // Style match
    if (selectedStyle !== "All Styles" && t.style.toLowerCase() !== selectedStyle.toLowerCase()) {
      return false;
    }

    // Orientation match
    if (
      selectedOrientation !== "All Orientations" &&
      t.orientation.toLowerCase() !== selectedOrientation.toLowerCase()
    ) {
      return false;
    }

    // Favorites filter
    if (showFavoritesOnly && !favoriteTemplateIds.includes(t.id)) {
      return false;
    }

    // Recently used filter
    if (showRecentlyUsedOnly && !recentlyUsedTemplateIds.includes(t.id)) {
      return false;
    }

    return true;
  });

  const recentlyUsedTemplates = templates.filter((t) => recentlyUsedTemplateIds.includes(t.id));

  const handleOpenInDesigner = (tmpl: ExtendedTemplateMeta) => {
    createProject(tmpl.name, "designer", tmpl.state);
    setActiveToolId("designer");
  };

  const handleImportPackageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonStr = event.target?.result as string;
        const imported = importTemplatePackage(jsonStr);
        addNotification("Template Package Imported", `Successfully loaded "${imported.name}"`, "success");
        setActiveTemplateModal(imported);
      } catch (err: any) {
        addNotification("Import Failed", "Invalid template JSON manifest.", "error");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const currentSubcategories =
    activeMainGroup !== "All" && activeMainGroup in TEMPLATE_SUBCATEGORIES
      ? TEMPLATE_SUBCATEGORIES[activeMainGroup as MainTemplateGroup]
      : [];

  return (
    <div className="flex-1 bg-black text-white p-6 overflow-y-auto custom-scrollbar font-sans select-none space-y-6">
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl bg-neutral-900 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="space-y-1 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-purple/10 border border-neon-purple/30 text-neon-purple text-xs font-mono">
            <LayoutTemplate className="w-3.5 h-3.5" />
            <span>4 Main Categories • 40+ Platform Specs • Dynamic Presets</span>
          </div>
          <h1 className="font-display font-black text-2xl md:text-3xl tracking-wider text-white uppercase">
            Professional Template Manager & Preset System
          </h1>
          <p className="text-xs text-gray-400 font-mono max-w-2xl">
            Fully editable vector presets for Social Media, Websites, Business Collateral, and Marketing. Dynamically adapt dimensions, placeholders, and active brand kit profiles.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 z-10 flex-wrap">
          <input
            type="file"
            ref={packageInputRef}
            onChange={handleImportPackageFile}
            accept=".json"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => packageInputRef.current?.click()}
            className="px-4 py-2.5 rounded-xl bg-neutral-800 border border-white/15 text-gray-200 font-mono text-xs font-bold hover:text-white hover:border-white/30 transition-colors flex items-center gap-2"
          >
            <Upload className="w-4 h-4 text-neon-cyan" /> Import Package JSON
          </button>

          <button
            type="button"
            onClick={() => {
              createProject("Untitled Blank Canvas", "designer");
              setActiveToolId("designer");
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-neon-purple to-neon-cyan text-black font-display font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(168,85,247,0.6)] transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4 fill-black" /> Blank Canvas
          </button>
        </div>
      </div>

      {/* MAIN CATEGORIES TAB NAVIGATION BAR */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 font-mono text-xs overflow-x-auto custom-scrollbar">
        <button
          type="button"
          onClick={() => {
            setActiveMainGroup("All");
            setSelectedCategory("All");
          }}
          className={`px-4 py-2 rounded-2xl border transition-all whitespace-nowrap font-bold ${
            activeMainGroup === "All"
              ? "bg-neon-cyan text-black border-neon-cyan shadow-[0_0_15px_rgba(0,245,255,0.4)]"
              : "bg-neutral-900 border-white/10 text-gray-400 hover:text-white"
          }`}
        >
          All Templates ({templates.length})
        </button>

        {MAIN_TEMPLATE_GROUPS.map((group) => {
          const count = templates.filter((t) => t.mainCategory === group).length;
          return (
            <button
              key={group}
              type="button"
              onClick={() => {
                setActiveMainGroup(group);
                setSelectedCategory("All");
              }}
              className={`px-4 py-2 rounded-2xl border transition-all whitespace-nowrap font-bold ${
                activeMainGroup === group
                  ? "bg-neon-purple text-black border-neon-purple shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                  : "bg-neutral-900 border-white/10 text-gray-400 hover:text-white"
              }`}
            >
              {group} ({count})
            </button>
          );
        })}
      </div>

      {/* SUBCATEGORY PILL FILTERS BAR */}
      {currentSubcategories.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar font-mono text-xs">
          <span className="text-[10px] text-gray-500 font-bold uppercase shrink-0">
            Subcategories:
          </span>
          <button
            type="button"
            onClick={() => setSelectedCategory("All")}
            className={`px-3 py-1 rounded-xl text-[11px] font-bold border transition-all shrink-0 ${
              selectedCategory === "All"
                ? "bg-white text-black border-white"
                : "bg-neutral-900 border-white/10 text-gray-400 hover:text-white"
            }`}
          >
            All Subcategories
          </button>
          {currentSubcategories.map((sub) => (
            <button
              key={sub}
              type="button"
              onClick={() => setSelectedCategory(sub)}
              className={`px-3 py-1 rounded-xl text-[11px] border transition-all shrink-0 ${
                selectedCategory === sub
                  ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan font-bold"
                  : "bg-neutral-900 border-white/10 text-gray-400 hover:text-white"
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      {/* RECENTLY USED TEMPLATES QUICK STRIP */}
      {recentlyUsedTemplates.length > 0 && !showFavoritesOnly && (
        <div className="p-4 bg-neutral-900/60 border border-white/10 rounded-2xl space-y-3 font-mono">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-neon-cyan" /> Recently Used Templates
            </span>
            <button
              type="button"
              onClick={() => setShowRecentlyUsedOnly(!showRecentlyUsedOnly)}
              className="text-[11px] text-neon-cyan hover:underline"
            >
              {showRecentlyUsedOnly ? "Show All Templates" : "Filter Recently Used"}
            </button>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-1 custom-scrollbar">
            {recentlyUsedTemplates.map((tmpl) => (
              <div
                key={`rec-${tmpl.id}`}
                onClick={() => setActiveTemplateModal(tmpl)}
                className="p-3 bg-neutral-900 border border-white/10 hover:border-neon-cyan rounded-xl shrink-0 w-56 cursor-pointer group transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-neon-cyan font-bold">{tmpl.category}</span>
                  <span className="text-gray-500">{tmpl.width}x{tmpl.height}</span>
                </div>
                <h4 className="font-bold text-xs text-white truncate group-hover:text-neon-cyan">
                  {tmpl.name}
                </h4>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SMART SEARCH & FILTERS BAR */}
      <SmartSearchFilterBar categories={TEMPLATE_CATEGORIES} type="templates" />

      {/* RESULTS SUMMARY */}
      <div className="flex items-center justify-between font-mono text-xs text-gray-400 px-1">
        <span>
          Showing <strong className="text-neon-cyan">{filteredTemplates.length}</strong> vector templates
        </span>
        {activeBrandKit && (
          <span className="text-neon-purple font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Active Brand Kit Ready ({activeBrandKit.brandName})
          </span>
        )}
      </div>

      {/* TEMPLATES GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTemplates.map((tmpl) => {
          const isFav = favoriteTemplateIds.includes(tmpl.id);
          const isCustom = !!tmpl.isCustom;

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
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-black/60 text-[9px] font-mono text-neon-cyan font-bold border border-neon-cyan/30">
                      {tmpl.style}
                    </span>
                    {isCustom && (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[8px] font-bold border border-emerald-500/40">
                        Custom
                      </span>
                    )}
                  </div>

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
                    <Eye className="w-3.5 h-3.5" /> Inspect & Edit
                  </span>
                </div>
              </div>

              {/* CARD DETAILS */}
              <div className="p-3.5 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full bg-white/5 text-[9px] text-gray-300">
                    {tmpl.mainCategory} • {tmpl.category}
                  </span>
                  <span className="text-[10px] text-gray-500">{tmpl.platform}</span>
                </div>

                <h3 className="font-bold text-white truncate group-hover:text-neon-purple transition-colors">
                  {tmpl.name}
                </h3>
                <p className="text-[10px] text-gray-400 line-clamp-2">{tmpl.description}</p>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleOpenInDesigner(tmpl)}
                    className="flex-1 py-1.5 rounded-xl bg-neon-purple/10 hover:bg-neon-purple hover:text-black border border-neon-purple/40 text-neon-purple font-bold text-xs transition-all flex items-center justify-center gap-2"
                  >
                    <span>Use Preset</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => duplicateTemplate(tmpl.id)}
                    className="p-1.5 rounded-xl bg-neutral-800 border border-white/10 text-gray-400 hover:text-white transition-colors"
                    title="Duplicate Template"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  {isCustom && (
                    <button
                      type="button"
                      onClick={() => deleteCustomTemplate(tmpl.id)}
                      className="p-1.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
                      title="Delete Custom Template"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
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

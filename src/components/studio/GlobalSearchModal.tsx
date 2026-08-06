import React, { useState, useEffect } from "react";
import { useStudio } from "../../context/StudioContext";
import { STUDIO_TOOLS } from "../../data/studioTools";
import { StudioToolId } from "../../types/studio";
import {
  Search,
  X,
  Palette,
  Kanban,
  LayoutTemplate,
  Layers,
  Wand2,
  BookmarkCheck,
  FolderOpen,
  ArrowRight,
  Clock,
  Trash2,
  FileText,
  ShoppingBag,
  FolderGit2,
} from "lucide-react";

export function GlobalSearchModal() {
  const {
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    projects,
    sharedAssets,
    brandKits,
    openProject,
    setActiveToolId,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
  } = useStudio();

  const [activeTab, setActiveTab] = useState<string>("all");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const queryClean = searchQuery.toLowerCase().trim();

  // FILTERED PROJECTS
  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(queryClean) ||
      p.toolId.toLowerCase().includes(queryClean) ||
      p.tags?.some((t) => t.toLowerCase().includes(queryClean))
  );

  // FILTERED TOOLS / TEMPLATES
  const filteredTools = STUDIO_TOOLS.filter(
    (t) =>
      t.name.toLowerCase().includes(queryClean) ||
      t.description.toLowerCase().includes(queryClean) ||
      t.category.toLowerCase().includes(queryClean)
  );

  // FILTERED ASSETS
  const filteredAssets = sharedAssets.filter(
    (a) =>
      a.name.toLowerCase().includes(queryClean) ||
      a.category.toLowerCase().includes(queryClean) ||
      a.tags?.some((t) => t.toLowerCase().includes(queryClean))
  );

  // FILTERED BRANDS
  const filteredBrands = brandKits.filter(
    (b) =>
      b.brandName.toLowerCase().includes(queryClean) ||
      b.companyName?.toLowerCase().includes(queryClean)
  );

  const handleSelectResult = (type: string, id: string, toolId?: StudioToolId) => {
    if (searchQuery) addRecentSearch(searchQuery);
    setIsSearchOpen(false);

    if (type === "project") {
      openProject(id);
    } else if (type === "tool" && toolId) {
      setActiveToolId(toolId);
    } else if (type === "brand") {
      setActiveToolId("brand-kit");
    } else if (type === "asset") {
      setActiveToolId("asset-library");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-start justify-center pt-20 px-4 font-sans select-none"
      onClick={() => setIsSearchOpen(false)}
    >
      <div
        className="w-full max-w-3xl bg-neutral-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden space-y-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* SEARCH INPUT BAR */}
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-neon-purple absolute left-4" />
          <input
            type="text"
            autoFocus
            placeholder="Search projects, tools, templates, assets, AI & brand kits... (Cmd + K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/60 border border-white/10 rounded-2xl pl-12 pr-10 py-3.5 text-sm text-white placeholder-gray-500 font-mono focus:outline-none focus:border-neon-purple shadow-inner"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-4 p-1 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <span className="absolute right-4 text-[10px] text-gray-500 font-mono px-2 py-1 rounded bg-white/5 border border-white/10">
              ESC
            </span>
          )}
        </div>

        {/* TAB FILTERS */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1">
            {[
              { id: "all", label: "All Results" },
              { id: "projects", label: `Projects (${filteredProjects.length})` },
              { id: "tools", label: `Studio Tools (${filteredTools.length})` },
              { id: "assets", label: `Assets (${filteredAssets.length})` },
              { id: "brands", label: `Brand Kits (${filteredBrands.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl transition-all shrink-0 ${
                  activeTab === tab.id
                    ? "bg-neon-purple text-white font-bold"
                    : "bg-white/5 text-gray-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* RECENT SEARCHES TAGS */}
        {!searchQuery && recentSearches.length > 0 && (
          <div className="space-y-2 pt-1 font-mono text-xs">
            <div className="flex items-center justify-between text-gray-400">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-neon-purple" /> Recent Searches:
              </span>
              <button
                type="button"
                onClick={clearRecentSearches}
                className="text-[10px] text-gray-500 hover:text-red-400 flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> Clear
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSearchQuery(s)}
                  className="px-3 py-1 rounded-xl bg-black/40 border border-white/10 hover:border-neon-purple/50 text-gray-300 hover:text-white transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* SEARCH RESULTS LIST */}
        <div className="max-h-96 overflow-y-auto custom-scrollbar space-y-4 pr-1 font-mono text-xs">
          {/* PROJECTS RESULTS */}
          {(activeTab === "all" || activeTab === "projects") && filteredProjects.length > 0 && (
            <div className="space-y-2">
              <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                Saved Projects
              </div>
              {filteredProjects.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleSelectResult("project", p.id, p.toolId)}
                  className="p-3 rounded-2xl bg-black/40 border border-white/5 hover:border-neon-purple/50 hover:bg-neutral-800/80 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-xl bg-neon-purple/20 text-neon-purple shrink-0">
                      <Kanban className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-white group-hover:text-neon-purple transition-colors truncate">
                        {p.title}
                      </h4>
                      <p className="text-[10px] text-gray-400">
                        {p.toolId} • {p.platform || "Universal"} • Updated {new Date(p.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-neon-purple group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          )}

          {/* TOOLS & CREATOR SUITES RESULTS */}
          {(activeTab === "all" || activeTab === "tools") && filteredTools.length > 0 && (
            <div className="space-y-2">
              <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                Studio Tools & Launchers
              </div>
              {filteredTools.slice(0, 6).map((t) => (
                <div
                  key={t.id}
                  onClick={() => handleSelectResult("tool", t.id, t.id)}
                  className="p-3 rounded-2xl bg-black/40 border border-white/5 hover:border-neon-pink/50 hover:bg-neutral-800/80 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-xl bg-neon-pink/20 text-neon-pink shrink-0">
                      <Palette className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-white group-hover:text-neon-pink transition-colors truncate">
                        {t.name}
                      </h4>
                      <p className="text-[10px] text-gray-400 truncate">{t.description}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-neon-pink group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          )}

          {/* ASSETS RESULTS */}
          {(activeTab === "all" || activeTab === "assets") && filteredAssets.length > 0 && (
            <div className="space-y-2">
              <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                Asset Vault
              </div>
              {filteredAssets.map((a) => (
                <div
                  key={a.id}
                  onClick={() => handleSelectResult("asset", a.id)}
                  className="p-3 rounded-2xl bg-black/40 border border-white/5 hover:border-cyan-500/50 hover:bg-neutral-800/80 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 shrink-0">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-white group-hover:text-cyan-400 transition-colors truncate">
                        {a.name}
                      </h4>
                      <p className="text-[10px] text-gray-400 truncate">
                        {a.category} • {a.sizeStr || "Shared Asset"}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          )}

          {/* BRAND KITS RESULTS */}
          {(activeTab === "all" || activeTab === "brands") && filteredBrands.length > 0 && (
            <div className="space-y-2">
              <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                Brand Kits
              </div>
              {filteredBrands.map((b) => (
                <div
                  key={b.id}
                  onClick={() => handleSelectResult("brand", b.id)}
                  className="p-3 rounded-2xl bg-black/40 border border-white/5 hover:border-amber-500/50 hover:bg-neutral-800/80 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                      <BookmarkCheck className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-white group-hover:text-amber-400 transition-colors truncate">
                        {b.brandName}
                      </h4>
                      <p className="text-[10px] text-gray-400 truncate">
                        {b.companyName} • {b.tagline}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          )}

          {/* EMPTY SEARCH STATE */}
          {queryClean &&
            filteredProjects.length === 0 &&
            filteredTools.length === 0 &&
            filteredAssets.length === 0 &&
            filteredBrands.length === 0 && (
              <div className="py-12 text-center text-gray-500 space-y-2">
                <Search className="w-8 h-8 mx-auto text-gray-600" />
                <p>No results found for "{searchQuery}". Try searching for "logo", "video", or "brand".</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

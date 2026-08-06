import React, { useState } from "react";
import { useEcosystem } from "../../../context/EcosystemContext";
import { TEMPLATE_CATEGORIES, TEMPLATE_STYLES, TEMPLATE_ORIENTATIONS } from "../../../data/templateMarketplaceData";
import {
  Search,
  Filter,
  Heart,
  X,
  Palette,
  Maximize2,
  Compass,
  RotateCcw,
  Sparkles,
  Layers,
} from "lucide-react";

interface SmartSearchFilterBarProps {
  categories?: readonly string[];
  type: "templates" | "assets";
}

export const COLOR_OPTIONS = [
  "All Colors",
  "Cyan",
  "Purple",
  "Red",
  "Yellow",
  "Green",
  "Dark",
  "Light",
] as const;

export function SmartSearchFilterBar({
  categories = TEMPLATE_CATEGORIES,
  type,
}: SmartSearchFilterBarProps) {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedStyle,
    setSelectedStyle,
    selectedOrientation,
    setSelectedOrientation,
    selectedColor,
    setSelectedColor,
    showFavoritesOnly,
    setShowFavoritesOnly,
    resetAllFilters,
  } = useEcosystem();

  const [isExpandedFiltersOpen, setIsExpandedFiltersOpen] = useState(false);

  const activeFiltersCount =
    (selectedCategory !== "All" ? 1 : 0) +
    (selectedStyle !== "All Styles" ? 1 : 0) +
    (selectedOrientation !== "All Orientations" ? 1 : 0) +
    (selectedColor !== "All Colors" ? 1 : 0) +
    (showFavoritesOnly ? 1 : 0) +
    (searchQuery.trim() !== "" ? 1 : 0);

  return (
    <div className="space-y-3 font-mono text-xs select-none">
      {/* PRIMARY SEARCH & QUICK PILLS BAR */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-neutral-900 border border-white/10 p-3 rounded-2xl shadow-xl">
        {/* Search Input */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder={
              type === "templates"
                ? "Search templates by title, tag, style, orientation, color..."
                : "Search assets by name, tag, category, size..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 pl-9 pr-8 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan transition-colors"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Quick Favorites & Filter Expansion Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`px-3 py-2 rounded-xl border flex items-center gap-1.5 transition-all text-xs ${
              showFavoritesOnly
                ? "bg-rose-500/20 border-rose-500 text-rose-300 font-bold"
                : "bg-black/40 border-white/10 text-gray-400 hover:text-white"
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                showFavoritesOnly ? "fill-rose-400 text-rose-400" : ""
              }`}
            />
            <span>Favorites</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExpandedFiltersOpen(!isExpandedFiltersOpen)}
            className={`px-3 py-2 rounded-xl border flex items-center gap-1.5 transition-all text-xs ${
              isExpandedFiltersOpen || activeFiltersCount > 0
                ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan font-bold"
                : "bg-black/40 border-white/10 text-gray-400 hover:text-white"
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filter Engine</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-neon-cyan text-black text-[10px] font-black flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={resetAllFilters}
              className="px-2.5 py-2 rounded-xl border border-white/10 bg-black/40 text-gray-400 hover:text-white transition-colors"
              title="Reset Filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* CATEGORY HORIZONTAL SCROLL PILLS */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl border text-[11px] transition-all whitespace-nowrap shrink-0 ${
              selectedCategory === cat
                ? "bg-neon-purple/20 border-neon-purple text-white font-bold shadow-[0_0_12px_rgba(168,85,247,0.3)]"
                : "bg-neutral-900/80 border-white/10 text-gray-400 hover:text-white hover:bg-neutral-800"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* EXPANDED FILTER ENGINE PANEL */}
      {isExpandedFiltersOpen && (
        <div className="bg-neutral-900 border border-white/10 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-150">
          {/* Style Filter */}
          <div className="space-y-1">
            <label className="text-[10px] text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <Compass className="w-3 h-3 text-neon-cyan" /> Visual Style
            </label>
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="w-full bg-black/80 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-neon-cyan"
            >
              {TEMPLATE_STYLES.map((st) => (
                <option key={st} value={st} className="bg-neutral-900">
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Color Palette Filter */}
          <div className="space-y-1">
            <label className="text-[10px] text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <Palette className="w-3 h-3 text-neon-purple" /> Dominant Color
            </label>
            <select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="w-full bg-black/80 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-neon-purple"
            >
              {COLOR_OPTIONS.map((col) => (
                <option key={col} value={col} className="bg-neutral-900">
                  {col}
                </option>
              ))}
            </select>
          </div>

          {/* Orientation Filter */}
          <div className="space-y-1">
            <label className="text-[10px] text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <Maximize2 className="w-3 h-3 text-amber-400" /> Canvas Orientation
            </label>
            <select
              value={selectedOrientation}
              onChange={(e) => setSelectedOrientation(e.target.value)}
              className="w-full bg-black/80 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
            >
              {TEMPLATE_ORIENTATIONS.map((or) => (
                <option key={or} value={or} className="bg-neutral-900">
                  {or}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Action */}
          <div className="flex items-end">
            <button
              type="button"
              onClick={resetAllFilters}
              className="w-full py-1.5 rounded-xl border border-white/10 bg-neutral-800 hover:bg-neutral-700 text-gray-300 hover:text-white transition-colors flex items-center justify-center gap-1.5 text-xs font-bold"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Filter Matrix
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

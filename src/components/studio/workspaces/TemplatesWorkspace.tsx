import React, { useState } from "react";
import { useStudio } from "../../../context/StudioContext";
import { DESIGN_TEMPLATES } from "../../../data/designerTemplates";
import {
  LayoutTemplate,
  Search,
  Sparkles,
  ArrowRight,
  Palette,
  Eye,
  Check,
} from "lucide-react";

export function TemplatesWorkspace() {
  const { createProject } = useStudio();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Social", "Portfolio", "Banner", "Store", "Logo"];

  const filteredTemplates = DESIGN_TEMPLATES.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat =
      selectedCategory === "All" ||
      t.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCat;
  });

  const handleUseTemplate = (tmpl: any) => {
    createProject(tmpl.name, "designer", tmpl.state);
  };

  return (
    <div className="flex-1 bg-black text-white p-6 overflow-y-auto custom-scrollbar font-sans select-none space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-neutral-900 border border-white/10 shadow-2xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-purple/10 border border-neon-purple/30 text-neon-purple text-xs font-mono">
            <LayoutTemplate className="w-3.5 h-3.5" />
            <span>1,000+ Pre-Made Design Layouts</span>
          </div>
          <h1 className="font-display font-black text-2xl md:text-3xl tracking-wider text-white uppercase">
            Templates Vault & Preset Library
          </h1>
          <p className="text-xs text-gray-400 font-mono">
            Professional multi-format templates for social media, YouTube covers, logos, banners, and portfolio cards.
          </p>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl border transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-neon-purple/20 border-neon-purple text-white font-bold"
                  : "bg-neutral-900 border-white/10 text-gray-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-1.5 pl-8 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple"
          />
          <Search className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* TEMPLATES GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTemplates.map((tmpl) => (
          <div
            key={tmpl.id}
            onClick={() => handleUseTemplate(tmpl)}
            className="rounded-2xl bg-neutral-900 border border-white/10 overflow-hidden hover:border-neon-purple/60 transition-all cursor-pointer group flex flex-col justify-between shadow-lg"
          >
            <div className="h-44 bg-black/80 relative flex flex-col items-center justify-center p-4 border-b border-white/5">
              <div className="text-center space-y-1">
                <Palette className="w-8 h-8 text-neon-purple mx-auto group-hover:scale-110 transition-transform" />
                <span className="font-mono text-[10px] text-gray-500 block">
                  {tmpl.state.width} x {tmpl.state.height} PX
                </span>
              </div>
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/80 border border-white/10 text-[9px] font-mono text-neon-purple font-bold">
                {tmpl.category}
              </span>
            </div>

            <div className="p-3 space-y-2 font-mono text-xs">
              <h3 className="font-bold text-white truncate group-hover:text-neon-purple transition-colors">
                {tmpl.name}
              </h3>
              <p className="text-[10px] text-gray-400 line-clamp-1">{tmpl.description}</p>
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-neon-purple font-bold">
                <span>Use Template</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

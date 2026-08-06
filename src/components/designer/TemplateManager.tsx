import React, { useState } from "react";
import { DesignTemplate, DesignState } from "../../types/designer";
import { useEcosystem } from "../../context/EcosystemContext";
import { Plus, Bookmark, Search, Download, Upload, Heart } from "lucide-react";

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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplateName.trim()) return;

    saveCustomTemplate(newTemplateName.trim(), newCategory, currentState);
    onSaveCurrentAsTemplate(newTemplateName.trim(), newCategory);
    setNewTemplateName("");
    setIsSaving(false);
  };

  const categories = ["All", "Portfolio", "Blog", "Store", "Services", "Landing Pages", "Social Media", "Gaming", "Marketing"];

  const filtered = templates.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat =
      selectedCategoryFilter === "All" ||
      t.category.toLowerCase() === selectedCategoryFilter.toLowerCase();
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-4 text-xs font-mono text-gray-300">
      {/* Action Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-neon-cyan" />
          <h3 className="font-display font-bold text-white text-xs uppercase">Template Vault</h3>
        </div>
        <button
          onClick={() => setIsSaving(!isSaving)}
          className="px-2.5 py-1 rounded-xl bg-neon-cyan/20 border border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan/30 text-[10px] font-bold flex items-center gap-1 transition-all"
        >
          <Plus className="w-3.5 h-3.5" /> Save Canvas
        </button>
      </div>

      {/* Save Custom Form */}
      {isSaving && (
        <form onSubmit={handleSave} className="p-3 rounded-xl bg-black/80 border border-neon-cyan/40 space-y-2">
          <h4 className="text-[10px] uppercase text-neon-cyan font-bold">Save as Custom Template</h4>
          <input
            type="text"
            required
            placeholder="Template name..."
            value={newTemplateName}
            onChange={(e) => setNewTemplateName(e.target.value)}
            className="w-full bg-neutral-900 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-neon-cyan"
          />
          <div className="flex gap-2">
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1 bg-neutral-900 border border-white/10 rounded-lg px-2 py-1 text-xs text-white"
            >
              {categories.filter((c) => c !== "All").map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="px-3 py-1 bg-neon-cyan text-black font-bold rounded-lg text-xs"
            >
              Save
            </button>
          </div>
        </form>
      )}

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Filter templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-neutral-900 border border-white/10 rounded-xl px-2.5 py-1.5 pl-8 text-xs text-white focus:outline-none focus:border-neon-cyan"
        />
        <Search className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 custom-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategoryFilter(cat)}
            className={`px-2 py-1 rounded-lg border text-[10px] whitespace-nowrap ${
              selectedCategoryFilter === cat
                ? "bg-neon-purple/20 border-neon-purple text-white font-bold"
                : "bg-neutral-900 border-white/5 text-gray-400 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Templates List */}
      <div className="space-y-2 max-h-[380px] overflow-y-auto custom-scrollbar pr-1">
        {filtered.map((t) => {
          const isFav = favoriteTemplateIds.includes(t.id);
          return (
            <div
              key={t.id}
              onClick={() =>
                onSelectTemplate({
                  id: t.id,
                  name: t.name,
                  category: t.category as any,
                  description: t.description,
                  previewColor: t.colorPalette?.[0] || "#00f5ff",
                  state: t.state,
                })
              }
              className="p-2.5 rounded-xl bg-neutral-900 border border-white/10 hover:border-neon-cyan transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="space-y-0.5 truncate">
                <span className="text-[9px] text-neon-cyan font-bold uppercase block">{t.category}</span>
                <h4 className="font-bold text-white truncate group-hover:text-neon-cyan">{t.name}</h4>
                <p className="text-[9px] text-gray-500 truncate">{t.width}x{t.height} PX • {t.style}</p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavoriteTemplate(t.id);
                }}
                className={`p-1 rounded hover:text-rose-400 ${isFav ? "text-rose-400" : "text-gray-500"}`}
              >
                ★
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

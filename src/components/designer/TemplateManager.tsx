import React, { useState, useEffect } from "react";
import { DesignTemplate, DesignState } from "../../types/designer";
import { DESIGN_TEMPLATES } from "../../data/designerTemplates";
import { Plus, Copy, Trash2, Edit3, Download, Upload, Check, FolderPlus, Bookmark } from "lucide-react";

interface TemplateManagerProps {
  currentState: DesignState;
  onSelectTemplate: (template: DesignTemplate) => void;
  onSaveCurrentAsTemplate: (name: string, category: DesignTemplate["category"]) => void;
}

const STORAGE_KEY = "lizzdo_custom_designer_templates_v2";

export const TemplateManager: React.FC<TemplateManagerProps> = ({
  currentState,
  onSelectTemplate,
  onSaveCurrentAsTemplate,
}) => {
  const [customTemplates, setCustomTemplates] = useState<DesignTemplate[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newCategory, setNewCategory] = useState<DesignTemplate["category"]>("Portfolio");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load saved templates on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCustomTemplates(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Failed to load custom templates", err);
    }
  }, []);

  // Save custom templates back to localStorage
  const persistTemplates = (updated: DesignTemplate[]) => {
    setCustomTemplates(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to store custom templates", err);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplateName.trim()) return;

    const newTpl: DesignTemplate = {
      id: `custom-${Date.now()}`,
      name: newTemplateName.trim(),
      category: newCategory,
      description: "User created custom design template.",
      previewColor: "#00f5ff",
      isCustom: true,
      state: {
        ...currentState,
        id: `design-${Date.now()}`,
        title: newTemplateName.trim(),
      },
    };

    const updated = [newTpl, ...customTemplates];
    persistTemplates(updated);
    onSaveCurrentAsTemplate(newTemplateName.trim(), newCategory);
    setNewTemplateName("");
    setIsSaving(false);
  };

  const handleDelete = (id: string) => {
    const updated = customTemplates.filter((t) => t.id !== id);
    persistTemplates(updated);
  };

  const handleDuplicate = (tpl: DesignTemplate) => {
    const dup: DesignTemplate = {
      ...tpl,
      id: `custom-${Date.now()}`,
      name: `${tpl.name} (Copy)`,
      isCustom: true,
      state: {
        ...tpl.state,
        id: `design-${Date.now()}`,
      },
    };
    persistTemplates([dup, ...customTemplates]);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentState, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${currentState.title.toLowerCase().replace(/\s+/g, "_")}_lizzdo_template.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && parsed.elements) {
          onSelectTemplate({
            id: `imported-${Date.now()}`,
            name: parsed.title || "Imported Design",
            category: "Custom",
            description: "Imported JSON configuration file",
            previewColor: "#a855f7",
            state: parsed,
          });
        }
      } catch (err) {
        alert("Invalid JSON design template file format.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 text-sm text-gray-300">
      {/* Action Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-neon-cyan" />
          <h3 className="font-display font-bold text-white text-base">Template Library</h3>
        </div>
        <button
          onClick={() => setIsSaving(!isSaving)}
          className="px-3 py-1.5 rounded-xl bg-neon-cyan/20 border border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan/30 font-display text-xs uppercase tracking-wider font-bold flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-3.5 h-3.5" /> Save Current
        </button>
      </div>

      {/* Save New Custom Template Form */}
      {isSaving && (
        <form onSubmit={handleSave} className="p-4 rounded-2xl bg-black/60 border border-neon-cyan/40 space-y-3">
          <h4 className="text-xs font-mono uppercase text-neon-cyan font-bold">Save as New Custom Template</h4>
          <input
            type="text"
            required
            value={newTemplateName}
            onChange={(e) => setNewTemplateName(e.target.value)}
            placeholder="Template Title (e.g. Cyberpunk Product Card)"
            className="w-full bg-black/50 border border-white/20 rounded-xl px-3 py-2 text-white focus:border-neon-cyan focus:outline-none text-xs"
          />
          <div className="grid grid-cols-2 gap-2">
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as any)}
              className="bg-black/50 border border-white/20 rounded-xl px-3 py-2 text-white text-xs focus:border-neon-cyan focus:outline-none"
            >
              <option value="Portfolio">Portfolio</option>
              <option value="Blog">Blog</option>
              <option value="Store">Store</option>
              <option value="Services">Services</option>
              <option value="Case Study">Case Study</option>
              <option value="Custom">Custom</option>
            </select>
            <button
              type="submit"
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-display text-xs font-bold uppercase tracking-wider"
            >
              Confirm Save
            </button>
          </div>
        </form>
      )}

      {/* Import / Export JSON Utilities */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleExportJSON}
          className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white text-xs font-mono flex items-center justify-center gap-1.5 transition-all"
        >
          <Download className="w-3.5 h-3.5 text-neon-green" /> Export JSON
        </button>
        <label className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white text-xs font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer">
          <Upload className="w-3.5 h-3.5 text-neon-cyan" /> Import JSON
          <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
        </label>
      </div>

      {/* Custom Saved Templates Section */}
      {customTemplates.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-mono uppercase text-neon-cyan font-bold flex items-center gap-1.5">
            <FolderPlus className="w-3.5 h-3.5" /> Your Custom Saved Templates ({customTemplates.length})
          </h4>
          <div className="space-y-2">
            {customTemplates.map((tpl) => (
              <div
                key={tpl.id}
                className="p-3 rounded-xl bg-black/40 border border-white/10 hover:border-neon-cyan/50 flex items-center justify-between transition-all group"
              >
                <div>
                  <h5 className="font-display font-bold text-white text-xs">{tpl.name}</h5>
                  <span className="text-[10px] font-mono text-neon-cyan">{tpl.category}</span>
                </div>
                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onSelectTemplate(tpl)}
                    className="px-2 py-1 rounded bg-neon-cyan/20 text-neon-cyan text-[10px] font-mono hover:bg-neon-cyan/30"
                  >
                    LOAD
                  </button>
                  <button
                    onClick={() => handleDuplicate(tpl)}
                    title="Duplicate"
                    className="p-1 text-gray-400 hover:text-white"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(tpl.id)}
                    title="Delete"
                    className="p-1 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preset Starter Templates Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-mono uppercase text-gray-400 font-bold">Preset Studio Starter Templates</h4>
          <span className="text-[10px] font-mono text-neon-cyan font-bold">{DESIGN_TEMPLATES.length} Available</span>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-1 pb-1">
          {["All", "Portfolio", "Blog", "Store", "Services", "Project Showcase", "Social Media Posts", "Marketing Graphics"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategoryFilter(cat)}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-mono transition-all ${
                selectedCategoryFilter === cat
                  ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50 font-bold"
                  : "bg-white/5 text-gray-400 border border-white/10 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {DESIGN_TEMPLATES.filter(tpl => selectedCategoryFilter === "All" || tpl.category === selectedCategoryFilter).map((tpl) => (
            <div
              key={tpl.id}
              onClick={() => onSelectTemplate(tpl)}
              className="p-3 rounded-2xl bg-black/40 border border-white/10 hover:border-neon-cyan cursor-pointer transition-all flex items-center justify-between group"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: tpl.previewColor }}
                  />
                  <h5 className="font-display font-bold text-white text-xs group-hover:text-neon-cyan transition-colors">
                    {tpl.name}
                  </h5>
                </div>
                <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{tpl.description}</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400 uppercase shrink-0">
                {tpl.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

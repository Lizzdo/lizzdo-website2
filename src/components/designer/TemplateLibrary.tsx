import React, { useState } from "react";
import { X, LayoutTemplate, Sparkles, Check } from "lucide-react";
import { DESIGN_TEMPLATES } from "../../data/designerTemplates";
import { DesignTemplate, DesignState } from "../../types/designer";

interface TemplateLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: DesignTemplate) => void;
}

export default function TemplateLibrary({
  isOpen,
  onClose,
  onSelectTemplate,
}: TemplateLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  if (!isOpen) return null;

  const categories = [
    "All",
    "Portfolio",
    "Blog",
    "Store",
    "Services",
    "Case Study",
    "Testimonial",
    "Hero Banner",
  ];

  const filteredTemplates =
    selectedCategory === "All"
      ? DESIGN_TEMPLATES
      : DESIGN_TEMPLATES.filter((t) => t.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-4xl max-h-[85vh] flex flex-col glass-panel bg-slate-950 border border-white/10 rounded-3xl p-6 md:p-8 relative shadow-[0_0_60px_rgba(0,0,0,0.9)]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors z-10"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-neon-purple/20 border border-neon-purple/40 text-neon-purple flex items-center justify-center">
            <LayoutTemplate size={20} />
          </div>
          <div>
            <h3 className="font-display font-bold text-xl text-white uppercase tracking-wider">
              Template Library
            </h3>
            <p className="text-xs text-gray-400 font-future">
              Select a pre-designed layout optimized for Lizzdo website posts & covers
            </p>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 shrink-0 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl border text-xs font-mono uppercase whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-neon-cyan text-black border-neon-cyan font-bold shadow-[0_0_15px_rgba(0,245,255,0.4)]"
                  : "bg-slate-900 border-white/10 text-gray-400 hover:text-white hover:border-white/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto pr-2 flex-1">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => {
                onSelectTemplate(template);
                onClose();
              }}
              className="glass-panel bg-slate-900/80 border border-white/10 rounded-2xl p-5 hover:border-neon-cyan/50 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span
                    className="text-[10px] font-mono tracking-[2px] px-2.5 py-1 rounded bg-white/5 border uppercase"
                    style={{
                      borderColor: `${template.previewColor}40`,
                      color: template.previewColor,
                    }}
                  >
                    {template.category}
                  </span>
                  <span className="text-[10px] font-mono text-gray-500">
                    {template.state.preset || "Preset"}
                  </span>
                </div>

                <h4 className="font-display font-bold text-lg text-white group-hover:text-neon-cyan transition-colors mb-2">
                  {template.name}
                </h4>

                <p className="text-xs text-gray-400 font-future leading-relaxed mb-6">
                  {template.description}
                </p>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-white/5">
                <span className="text-xs font-mono text-gray-500 flex items-center gap-1.5">
                  <Sparkles size={12} style={{ color: template.previewColor }} /> Apply Layout
                </span>
                <span className="text-xs font-display font-bold uppercase tracking-widest text-neon-cyan group-hover:translate-x-1 transition-transform">
                  Load Template →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

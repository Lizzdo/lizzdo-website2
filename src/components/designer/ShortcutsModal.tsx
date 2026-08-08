import React, { useState } from "react";
import { X, Command, Keyboard, Check, RotateCcw } from "lucide-react";
import { getStorageItem, removeStorageItem } from "../../utils/storage";

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutItem {
  id: string;
  category: "Selection" | "Transform & Edit" | "View & Zoom" | "Document";
  label: string;
  defaultKey: string;
  customKey?: string;
}

const DEFAULT_SHORTCUTS: ShortcutItem[] = [
  { id: "new", category: "Document", label: "New Project", defaultKey: "Ctrl + N" },
  { id: "save", category: "Document", label: "Save Project", defaultKey: "Ctrl + S" },
  { id: "export", category: "Document", label: "Export Artwork", defaultKey: "Ctrl + E" },
  { id: "undo", category: "Transform & Edit", label: "Undo", defaultKey: "Ctrl + Z" },
  { id: "redo", category: "Transform & Edit", label: "Redo", defaultKey: "Ctrl + Y" },
  { id: "copy", category: "Transform & Edit", label: "Copy Selection", defaultKey: "Ctrl + C" },
  { id: "paste", category: "Transform & Edit", label: "Paste Selection", defaultKey: "Ctrl + V" },
  { id: "cut", category: "Transform & Edit", label: "Cut Selection", defaultKey: "Ctrl + X" },
  { id: "duplicate", category: "Transform & Edit", label: "Duplicate Element", defaultKey: "Ctrl + D" },
  { id: "delete", category: "Transform & Edit", label: "Delete Element", defaultKey: "Delete / Backspace" },
  { id: "selectAll", category: "Selection", label: "Select All Elements", defaultKey: "Ctrl + A" },
  { id: "deselect", category: "Selection", label: "Deselect All", defaultKey: "Esc" },
  { id: "group", category: "Selection", label: "Group Selection", defaultKey: "Ctrl + G" },
  { id: "ungroup", category: "Selection", label: "Ungroup Selection", defaultKey: "Ctrl + Shift + G" },
  { id: "zoomIn", category: "View & Zoom", label: "Zoom In", defaultKey: "Ctrl + +" },
  { id: "zoomOut", category: "View & Zoom", label: "Zoom Out", defaultKey: "Ctrl + -" },
  { id: "fitScreen", category: "View & Zoom", label: "Fit to Screen", defaultKey: "Ctrl + 0" },
  { id: "panCanvas", category: "View & Zoom", label: "Pan Canvas", defaultKey: "Space + Drag" },
];

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  const [shortcuts, setShortcuts] = useState<ShortcutItem[]>(() => {
    const saved = getStorageItem("lizzdo_custom_shortcuts");
    return saved ? JSON.parse(saved) : DEFAULT_SHORTCUTS;
  });

  const [activeCategory, setActiveCategory] = useState<string>("All");

  if (!isOpen) return null;

  const categories = ["All", "Selection", "Transform & Edit", "View & Zoom", "Document"];

  const filtered = shortcuts.filter(
    (item) => activeCategory === "All" || item.category === activeCategory
  );

  const handleResetDefaults = () => {
    setShortcuts(DEFAULT_SHORTCUTS);
    removeStorageItem("lizzdo_custom_shortcuts");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-neutral-900 border border-white/20 rounded-3xl shadow-2xl overflow-hidden text-gray-200 font-sans flex flex-col max-h-[85vh]">
        {/* HEADER */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-neon-cyan/20 border border-neon-cyan/50 text-neon-cyan">
              <Keyboard className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-white tracking-wide">
                Keyboard Shortcuts & Custom Binds
              </h2>
              <p className="text-xs font-mono text-gray-400">
                Speed up your design workflow with desktop application shortcuts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CATEGORY TABS */}
        <div className="px-5 py-3 bg-black/20 border-b border-white/10 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? "bg-neon-cyan text-black shadow-[0_0_15px_rgba(0,245,255,0.4)]"
                  : "bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* SHORTCUTS LIST */}
        <div className="p-5 overflow-y-auto space-y-2 flex-1 font-mono text-xs">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-neon-cyan/40 flex items-center justify-between transition-all"
            >
              <div className="space-y-0.5">
                <span className="font-bold text-white text-sm">{item.label}</span>
                <div className="text-[10px] text-neon-purple uppercase tracking-wider">
                  {item.category}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-black border border-white/20 font-bold text-neon-cyan text-xs tracking-widest shadow-inner">
                  {item.customKey || item.defaultKey}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-white/10 bg-black/40 flex items-center justify-between text-xs font-mono">
          <button
            onClick={handleResetDefaults}
            className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white transition-all flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5 text-neon-cyan" /> Reset Defaults
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink text-white font-display font-bold hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

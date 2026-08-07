import React, { useState } from "react";
import { AIPromptTemplate, AICategory } from "../../../types/ai";
import {
  Bookmark,
  Search,
  Plus,
  Star,
  Copy,
  Check,
  Share2,
  Trash2,
  Sparkles,
  Tag,
  Wand2,
  Folder,
} from "lucide-react";

interface AIPromptLibraryViewProps {
  prompts: AIPromptTemplate[];
  onSelectPrompt: (prompt: AIPromptTemplate) => void;
  onSaveCustomPrompt: (newPrompt: Omit<AIPromptTemplate, "id" | "createdAt">) => void;
  onToggleFavorite: (id: string) => void;
  onDeletePrompt: (id: string) => void;
  onDuplicatePrompt: (prompt: AIPromptTemplate) => void;
}

const CATEGORIES: { id: AICategory | "All"; label: string }[] = [
  { id: "All", label: "All Categories" },
  { id: "Logo Design", label: "Logo Design" },
  { id: "YouTube Thumbnail", label: "YouTube Thumbnail" },
  { id: "Facebook Cover", label: "Facebook Cover" },
  { id: "Portfolio Banner", label: "Portfolio Banner" },
  { id: "Store Product Image", label: "Store Product Image" },
  { id: "Cyber Background", label: "Cyber Background" },
  { id: "Blog Header", label: "Blog Header" },
  { id: "Social Media", label: "Social Media" },
  { id: "Marketing Copy", label: "Marketing Copy" },
  { id: "General", label: "General" },
];

export function AIPromptLibraryView({
  prompts,
  onSelectPrompt,
  onSaveCustomPrompt,
  onToggleFavorite,
  onDeletePrompt,
  onDuplicatePrompt,
}: AIPromptLibraryViewProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<AICategory | "All">("All");
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New Prompt Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPromptText, setNewPromptText] = useState("");
  const [newNegativePrompt, setNewNegativePrompt] = useState("");
  const [newCategory, setNewCategory] = useState<AICategory>("Logo Design");

  const filteredPrompts = prompts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.prompt.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesFav = !showOnlyFavorites || p.favorite;

    return matchesSearch && matchesCategory && matchesFav;
  });

  const handleCreatePrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPromptText.trim()) return;

    onSaveCustomPrompt({
      title: newTitle.trim(),
      prompt: newPromptText.trim(),
      negativePrompt: newNegativePrompt.trim(),
      category: newCategory,
      tags: ["custom", newCategory.toLowerCase().replace(/\s+/g, "-")],
      favorite: false,
      author: "You",
      isCustom: true,
      aspectRatio: "1:1",
      stylePreset: "3d-render",
    });

    setNewTitle("");
    setNewPromptText("");
    setNewNegativePrompt("");
    setIsModalOpen(false);
  };

  const handleCopyPromptText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="flex-1 bg-neutral-950 border border-white/10 rounded-2xl p-6 flex flex-col overflow-hidden font-mono text-xs space-y-5">
      {/* HEADER & TOP CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-neon-cyan">
            <Bookmark className="w-5 h-5" />
            <h2 className="font-bold text-white text-sm uppercase">AI Prompt Library & Presets</h2>
          </div>
          <p className="text-gray-400 font-sans text-xs mt-1">
            Browse, categorize, save, and reuse tuned prompts across all Studio AI tools.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-neon-cyan text-black font-bold uppercase hover:bg-neon-cyan/80 transition-all flex items-center gap-2 self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Save New Prompt</span>
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search prompt title, keywords, tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-neutral-900 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan font-sans"
          />
        </div>

        {/* Category Select */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value as any)}
          className="bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-neon-cyan font-sans"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>

        {/* Favorites Filter */}
        <button
          onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
          className={`px-3 py-2 rounded-xl border transition-all flex items-center justify-center gap-2 font-bold ${
            showOnlyFavorites
              ? "bg-amber-500/20 border-amber-500 text-amber-300"
              : "bg-neutral-900 border-white/10 text-gray-400 hover:text-white"
          }`}
        >
          <Star className={`w-4 h-4 ${showOnlyFavorites ? "fill-amber-400 text-amber-400" : ""}`} />
          <span>{showOnlyFavorites ? "Showing Favorites Only" : "Filter Favorites"}</span>
        </button>
      </div>

      {/* PROMPTS GRID */}
      <div className="flex-1 overflow-y-auto custom-scrollbar grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-1">
        {filteredPrompts.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-2xl bg-neutral-900/80 border border-white/10 hover:border-neon-cyan/50 transition-all flex flex-col justify-between space-y-3 group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded bg-neon-cyan/15 border border-neon-cyan/30 text-neon-cyan text-[9px] font-bold uppercase">
                  {item.category}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onToggleFavorite(item.id)}
                    className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-amber-400 transition-all"
                    title="Favorite Prompt"
                  >
                    <Star
                      className={`w-3.5 h-3.5 ${
                        item.favorite ? "fill-amber-400 text-amber-400" : ""
                      }`}
                    />
                  </button>

                  <button
                    onClick={() => onDuplicatePrompt(item)}
                    className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                    title="Duplicate Prompt"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  {item.isCustom && (
                    <button
                      onClick={() => onDeletePrompt(item.id)}
                      className="p-1 rounded-lg hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 transition-all"
                      title="Delete Custom Prompt"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <h3 className="font-bold text-white text-xs font-sans group-hover:text-neon-cyan transition-all">
                {item.title}
              </h3>

              <p className="text-gray-300 font-sans text-xs leading-relaxed mt-1.5 line-clamp-3 bg-black/40 p-2.5 rounded-xl border border-white/5">
                "{item.prompt}"
              </p>

              {item.negativePrompt && (
                <p className="text-gray-500 text-[10px] mt-1.5 truncate">
                  <strong className="text-gray-400">Avoid:</strong> {item.negativePrompt}
                </p>
              )}
            </div>

            {/* ACTION BUTTONS */}
            <div className="pt-2 border-t border-white/10 flex items-center gap-2">
              <button
                onClick={() => onSelectPrompt(item)}
                className="flex-1 py-2 rounded-xl bg-neon-cyan/20 border border-neon-cyan/50 text-neon-cyan font-bold hover:bg-neon-cyan hover:text-black transition-all flex items-center justify-center gap-1.5"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Use Prompt</span>
              </button>

              <button
                onClick={() => handleCopyPromptText(item.id, item.prompt)}
                className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white transition-all flex items-center gap-1"
                title="Copy Prompt Text"
              >
                {copiedId === item.id ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        ))}

        {filteredPrompts.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 font-sans space-y-2">
            <Bookmark className="w-8 h-8 text-gray-600 mx-auto" />
            <p className="text-xs">No matching prompts found in the library.</p>
          </div>
        )}
      </div>

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-white/15 rounded-3xl p-6 w-full max-w-lg space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="font-bold text-white text-sm uppercase">Save Prompt to Library</span>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePrompt} className="space-y-3 font-sans">
              <div>
                <label className="text-xs font-bold text-gray-300 uppercase block mb-1">
                  Prompt Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cyberpunk Store Banner 8K"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/15 rounded-xl p-2.5 text-white focus:outline-none focus:border-neon-cyan text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 uppercase block mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-neutral-900 border border-white/15 rounded-xl p-2.5 text-white focus:outline-none focus:border-neon-cyan text-xs font-mono"
                >
                  {CATEGORIES.filter((c) => c.id !== "All").map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 uppercase block mb-1">
                  Positive Prompt
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detailed creative prompt instructions..."
                  value={newPromptText}
                  onChange={(e) => setNewPromptText(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/15 rounded-xl p-2.5 text-white focus:outline-none focus:border-neon-cyan text-xs resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">
                  Negative Prompt (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. blurry, distortion, noise..."
                  value={newNegativePrompt}
                  onChange={(e) => setNewNegativePrompt(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/15 rounded-xl p-2.5 text-gray-300 focus:outline-none focus:border-neon-cyan text-xs"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 font-mono">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-neon-cyan text-black font-bold uppercase hover:bg-neon-cyan/80"
                >
                  Save Prompt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

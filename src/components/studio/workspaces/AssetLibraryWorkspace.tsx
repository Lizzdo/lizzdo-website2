import React, { useState } from "react";
import { useStudio } from "../../../context/StudioContext";
import {
  Layers,
  Upload,
  Search,
  Plus,
  Trash2,
  Copy,
  Image as ImageIcon,
  Tag,
  Check,
  FolderOpen,
} from "lucide-react";

export function AssetLibraryWorkspace() {
  const { sharedAssets, uploadSharedAsset } = useStudio();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Brand Logos", "Textures", "Illustrations", "User Uploads"];

  const filteredAssets = sharedAssets.filter((a) => {
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === "All" || a.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await uploadSharedAsset(e.target.files[0]);
    }
  };

  return (
    <div className="flex-1 bg-black text-white p-6 overflow-y-auto custom-scrollbar font-sans select-none space-y-6">
      {/* HEADER & UPLOAD BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-neutral-900 border border-white/10 shadow-2xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-xs font-mono">
            <Layers className="w-3.5 h-3.5" />
            <span>Shared Asset Repository</span>
          </div>
          <h1 className="font-display font-black text-2xl md:text-3xl tracking-wider text-white uppercase">
            Asset Library & Stock Vault
          </h1>
          <p className="text-xs text-gray-400 font-mono">
            Upload files once and access them across all 22 Lizzdo Studio editors, AI generators, and video timelines.
          </p>
        </div>

        <label className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-display font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(0,245,255,0.6)] cursor-pointer transition-all flex items-center gap-2 shrink-0">
          <Upload className="w-4 h-4" /> Upload Asset File
          <input type="file" onChange={handleFileUpload} accept="image/*" className="hidden" />
        </label>
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
                  ? "bg-neon-cyan/20 border-neon-cyan text-white font-bold"
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
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-1.5 pl-8 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan"
          />
          <Search className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* ASSETS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredAssets.map((asset) => (
          <div
            key={asset.id}
            className="rounded-2xl bg-neutral-900 border border-white/10 overflow-hidden hover:border-neon-cyan/50 transition-all group flex flex-col justify-between shadow-lg"
          >
            <div className="h-40 bg-black/80 p-3 flex items-center justify-center relative">
              <img
                src={asset.url}
                alt={asset.name}
                className="max-h-full max-w-full object-contain rounded-lg group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/80 border border-white/10 text-[9px] font-mono text-neon-cyan">
                {asset.category}
              </span>
            </div>

            <div className="p-3 space-y-1 font-mono text-xs">
              <h3 className="font-bold text-white truncate">{asset.name}</h3>
              <p className="text-[10px] text-gray-500">{asset.sizeStr || "Shared Asset"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

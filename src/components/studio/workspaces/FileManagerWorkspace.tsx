import React, { useState, useMemo } from "react";
import { useStudio } from "../../../context/StudioContext";
import { SharedAsset } from "../../../types/studio";
import {
  FolderOpen,
  Upload,
  Search,
  HardDrive,
  Trash2,
  File,
  FileImage,
  FileVideo,
  FileCode,
  FileText,
  Download,
  Filter,
  Layers,
  Sparkles,
  Zap,
  ExternalLink,
  Tag,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

export function FileManagerWorkspace() {
  const { sharedAssets, uploadSharedAsset, storageUsage, addNotification } = useStudio();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedAsset, setSelectedAsset] = useState<SharedAsset | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await uploadSharedAsset(e.target.files[0]);
    }
  };

  const filteredAssets = useMemo(() => {
    return sharedAssets.filter((a) => {
      const matchesCategory =
        activeCategory === "all" ||
        (activeCategory === "image" && (a.type === "image" || a.type === "logo" || a.type === "icon")) ||
        (activeCategory === "video" && a.type === "video") ||
        (activeCategory === "audio" && a.type === "audio") ||
        (activeCategory === "font" && a.type === "font") ||
        (activeCategory === "template" && a.type === "template");

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [sharedAssets, activeCategory, searchQuery]);

  return (
    <div className="flex-1 bg-black text-white p-6 overflow-y-auto custom-scrollbar font-sans select-none space-y-6">
      {/* HEADER BANNER */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl bg-neutral-900 border border-white/10 shadow-2xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-xs font-mono">
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Unified Cloud Storage System</span>
          </div>
          <h1 className="font-display font-black text-2xl md:text-3xl tracking-wider text-white uppercase">
            File Manager & Asset Vault
          </h1>
          <p className="text-xs text-gray-400 font-mono">
            Organize, relink, optimize, and inspect images, videos, fonts, logos, and vector templates.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <label className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-display font-bold text-xs uppercase tracking-wider cursor-pointer hover:shadow-[0_0_20px_rgba(0,245,255,0.6)] transition-all flex items-center gap-2">
            <Upload className="w-4 h-4" /> Upload Asset
            <input type="file" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* STORAGE & CATEGORY TOOLBAR */}
      <div className="p-4 rounded-2xl bg-neutral-900 border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-4 font-mono text-xs">
        {/* CATEGORY TABS */}
        <div className="flex items-center gap-1.5 flex-wrap w-full lg:w-auto">
          {[
            { id: "all", label: "All Files" },
            { id: "image", label: "Images & Logos" },
            { id: "video", label: "Videos" },
            { id: "audio", label: "Audio Clips" },
            { id: "font", label: "Typography Fonts" },
            { id: "template", label: "Templates" },
          ].map((cat) => (
            <button
              type="button"
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                activeCategory === cat.id
                  ? "bg-neon-cyan/20 border border-neon-cyan/50 text-neon-cyan"
                  : "bg-white/5 text-gray-400 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* SEARCH BAR */}
        <div className="relative w-full lg:w-72">
          <input
            type="text"
            placeholder="Search vault assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-950 border border-white/10 rounded-xl px-3 py-1.5 pl-9 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan font-mono"
          />
          <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* ASSET GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 font-mono text-xs">
        {filteredAssets.map((asset) => (
          <div
            key={asset.id}
            onClick={() => setSelectedAsset(asset)}
            className="rounded-2xl bg-neutral-900 border border-white/10 hover:border-neon-cyan/60 transition-all cursor-pointer group overflow-hidden flex flex-col justify-between shadow-lg"
          >
            {/* ASSET PREVIEW */}
            <div className="h-36 bg-neutral-950 relative flex items-center justify-center p-3 border-b border-white/5 overflow-hidden">
              {asset.url && asset.type === "image" ? (
                <img
                  src={asset.url}
                  alt={asset.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="text-center space-y-1">
                  <FileCode className="w-8 h-8 text-neon-cyan mx-auto group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] text-gray-400 block uppercase font-bold">{asset.type}</span>
                </div>
              )}

              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/80 border border-white/10 text-[9px] font-mono text-neon-cyan font-bold">
                {asset.category}
              </span>
            </div>

            {/* ASSET DETAILS */}
            <div className="p-3.5 space-y-2">
              <div>
                <h3 className="font-bold text-white text-xs truncate group-hover:text-neon-cyan transition-colors">
                  {asset.name}
                </h3>
                <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                  {asset.sizeStr || "240 KB"} • {new Date(asset.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex flex-wrap gap-1">
                {asset.tags.slice(0, 3).map((t) => (
                  <span key={t} className="px-1.5 py-0.2 rounded bg-white/5 text-gray-400 text-[9px]">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

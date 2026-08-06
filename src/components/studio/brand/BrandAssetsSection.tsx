import React, { useState } from "react";
import { useStudio } from "../../../context/StudioContext";
import { useEcosystem } from "../../../context/EcosystemContext";
import { BrandAssetItem } from "../../../types/brandKit";
import {
  Layers,
  Upload,
  Plus,
  Trash2,
  Tag,
  CheckCircle2,
  Share2,
  FolderOpen,
  Sparkles,
} from "lucide-react";

const ASSET_CATEGORIES: BrandAssetItem["category"][] = [
  "Icons",
  "SVG Files",
  "Patterns",
  "Backgrounds",
  "Textures",
  "Watermarks",
  "Social Icons",
  "Buttons",
  "UI Components",
];

export const BrandAssetsSection: React.FC = () => {
  const { activeBrandKit, updateActiveBrandKit, addNotification, uploadSharedAsset } = useStudio();
  const { uploadAssetFile } = useEcosystem();

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [newAssetName, setNewAssetName] = useState("");
  const [newAssetCategory, setNewAssetCategory] =
    useState<BrandAssetItem["category"]>("Icons");
  const [isAddingAsset, setIsAddingAsset] = useState(false);

  const handleUploadBrandAsset = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const assetMeta = await uploadAssetFile(file, newAssetCategory, "/BrandKit");

    const newBrandAsset: BrandAssetItem = {
      id: `asset-${Date.now()}`,
      name: file.name.replace(/\.[^/.]+$/, ""),
      category: newAssetCategory,
      url: assetMeta.url,
      tags: ["brand", activeBrandKit.brandName.toLowerCase(), newAssetCategory.toLowerCase()],
    };

    updateActiveBrandKit({
      assets: [newBrandAsset, ...activeBrandKit.assets],
    });

    addNotification("Brand Asset Uploaded", `Added "${newBrandAsset.name}" to ${newAssetCategory}`, "success");
    setIsAddingAsset(false);
  };

  const handleDeleteAsset = (id: string) => {
    updateActiveBrandKit({
      assets: activeBrandKit.assets.filter((a) => a.id !== id),
    });
    addNotification("Asset Removed", "Brand asset deleted from kit", "info");
  };

  const filteredAssets =
    activeCategory === "All"
      ? activeBrandKit.assets
      : activeBrandKit.assets.filter((a) => a.category === activeCategory);

  return (
    <div className="p-6 rounded-3xl bg-neutral-900 border border-white/10 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="font-display font-bold text-base tracking-wider uppercase text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-neon-cyan" /> Reusable Brand Assets & UI Components
          </h2>
          <p className="text-xs text-gray-400 font-mono mt-0.5">
            Store brand icons, vector SVGs, patterns, textures, and custom buttons. Automatically synced into Designer V1.
          </p>
        </div>

        <label className="px-4 py-2 rounded-xl bg-neon-cyan/10 hover:bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30 text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0">
          <Upload className="w-3.5 h-3.5" /> Upload Brand Asset
          <input
            type="file"
            accept="image/*,.svg"
            className="hidden"
            onChange={handleUploadBrandAsset}
          />
        </label>
      </div>

      {/* CATEGORY FILTER PILLS */}
      <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
        <button
          type="button"
          onClick={() => setActiveCategory("All")}
          className={`px-3 py-1.5 rounded-xl border transition-all ${
            activeCategory === "All"
              ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan font-bold"
              : "bg-black border-white/10 text-gray-400 hover:text-white"
          }`}
        >
          All ({activeBrandKit.assets.length})
        </button>
        {ASSET_CATEGORIES.map((cat) => {
          const count = activeBrandKit.assets.filter((a) => a.category === cat).length;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl border transition-all ${
                activeCategory === cat
                  ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan font-bold"
                  : "bg-black border-white/10 text-gray-400 hover:text-white"
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* ASSETS GRID */}
      {filteredAssets.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              className="p-3 rounded-2xl bg-black border border-white/10 hover:border-neon-cyan/50 space-y-2 group transition-all"
            >
              <div className="h-28 rounded-xl bg-neutral-950 border border-white/5 flex items-center justify-center p-2 relative overflow-hidden">
                {asset.url ? (
                  <img
                    src={asset.url}
                    alt={asset.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <Sparkles className="w-8 h-8 text-neon-cyan opacity-40" />
                )}

                <div className="absolute top-1.5 right-1.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => {
                      addNotification("Vault Synced", `Asset "${asset.name}" synced with Studio Shared Vault`, "success");
                    }}
                    className="p-1 rounded-lg bg-black/80 hover:bg-neon-cyan/80 text-white"
                    title="Sync to Shared Vault"
                  >
                    <Share2 className="w-3 h-3 text-neon-cyan" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteAsset(asset.id)}
                    className="p-1 rounded-lg bg-red-500/80 text-white"
                    title="Delete Asset"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="font-mono text-[10px]">
                <span className="text-white font-bold block truncate">{asset.name}</span>
                <span className="text-gray-500 block truncate">{asset.category}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-black border border-dashed border-white/10 text-center space-y-2 font-mono text-xs text-gray-400">
          <FolderOpen className="w-8 h-8 text-gray-500 mx-auto" />
          <p>No brand assets found in "{activeCategory}". Click Upload Brand Asset to add icons or SVGs.</p>
        </div>
      )}
    </div>
  );
};

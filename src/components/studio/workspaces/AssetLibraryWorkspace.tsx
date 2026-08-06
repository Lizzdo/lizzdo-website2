import React, { useState } from "react";
import { useEcosystem } from "../../../context/EcosystemContext";
import { useStudio } from "../../../context/StudioContext";
import { ExtendedAssetMeta, ASSET_TYPES } from "../../../data/assetLibraryData";
import { SmartSearchFilterBar } from "../ecosystem/SmartSearchFilterBar";
import { AssetPreviewModal } from "../assets/AssetPreviewModal";
import { CollectionsManagerModal } from "../assets/CollectionsManagerModal";
import {
  Layers,
  Upload,
  Search,
  Plus,
  Trash2,
  Copy,
  FolderOpen,
  FolderPlus,
  Tag,
  Check,
  Heart,
  Eye,
  Download,
  CheckSquare,
  Square,
  FileText,
  Filter,
  Sparkles,
} from "lucide-react";

export function AssetLibraryWorkspace() {
  const {
    assets,
    favoriteAssetIds,
    toggleFavoriteAsset,
    uploadAssetFile,
    selectedAssetIds,
    toggleSelectAsset,
    selectAllAssets,
    clearSelectedAssets,
    bulkDeleteAssets,
    bulkTagAssets,
    bulkMoveToCollection,
    collections,
    searchQuery,
    selectedCategory,
    selectedStyle,
    selectedColor,
    showFavoritesOnly,
  } = useEcosystem();

  const { addNotification } = useStudio();

  const [activeAssetModal, setActiveAssetModal] = useState<ExtendedAssetMeta | null>(null);
  const [isCollectionsModalOpen, setIsCollectionsModalOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string>("All");
  const [isDragOver, setIsDragOver] = useState(false);
  const [bulkTagInput, setBulkTagInput] = useState("");
  const [showBulkTagModal, setShowBulkTagModal] = useState(false);

  // Filter Logic
  const filteredAssets = assets.filter((a) => {
    const matchesSearch =
      !searchQuery.trim() ||
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType =
      selectedCategory === "All" || a.type.toLowerCase() === selectedCategory.toLowerCase();

    const matchesStyle =
      selectedStyle === "All Styles" ||
      (a.style && a.style.toLowerCase() === selectedStyle.toLowerCase());

    const matchesColor =
      selectedColor === "All Colors" ||
      (a.color && a.color.toLowerCase() === selectedColor.toLowerCase());

    const matchesFolder =
      selectedFolder === "All" || (a.folderPath && a.folderPath.startsWith(selectedFolder));

    const matchesFav = !showFavoritesOnly || favoriteAssetIds.includes(a.id);

    return (
      matchesSearch &&
      matchesType &&
      matchesStyle &&
      matchesColor &&
      matchesFolder &&
      matchesFav
    );
  });

  // DRAG & DROP & UPLOAD HANDLERS
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArr = Array.from(e.target.files);
      for (const file of filesArr) {
        await uploadAssetFile(file);
      }
      addNotification("Upload Complete", `Uploaded ${filesArr.length} file(s)`, "success");
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArr = Array.from(e.dataTransfer.files);
      for (const file of filesArr) {
        await uploadAssetFile(file);
      }
      addNotification("Upload Complete", `Uploaded ${filesArr.length} file(s)`, "success");
    }
  };

  const handleApplyBulkTags = () => {
    if (bulkTagInput.trim()) {
      const tagsArr = bulkTagInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      bulkTagAssets(tagsArr);
      setBulkTagInput("");
      setShowBulkTagModal(false);
      addNotification("Bulk Tagged", `Applied tags to ${selectedAssetIds.length} assets`, "success");
    }
  };

  const isAllSelected =
    filteredAssets.length > 0 && selectedAssetIds.length === filteredAssets.length;

  return (
    <div className="flex-1 bg-black text-white p-6 overflow-y-auto custom-scrollbar font-sans select-none space-y-6">
      {/* HEADER & MULTI-FILE UPLOAD BAR */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`p-6 rounded-3xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl relative overflow-hidden ${
          isDragOver
            ? "bg-neon-cyan/20 border-neon-cyan scale-[1.01]"
            : "bg-neutral-900 border-white/10"
        }`}
      >
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-xs font-mono">
            <Layers className="w-3.5 h-3.5" />
            <span>Shared Across All Studio Tools</span>
          </div>
          <h1 className="font-display font-black text-2xl md:text-3xl tracking-wider text-white uppercase">
            Centralized Asset Repository & Stock Vault
          </h1>
          <p className="text-xs text-gray-400 font-mono">
            Upload images, SVG icons, logos, fonts, textures, gradients, mockups, stickers, and UI components once and reuse across every project.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsCollectionsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl border border-white/10 bg-neutral-800 hover:bg-neutral-700 text-gray-200 text-xs font-mono font-bold transition-colors flex items-center gap-2"
          >
            <FolderPlus className="w-4 h-4 text-neon-purple" />
            <span>Collections</span>
          </button>

          <label className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-black font-display font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(0,245,255,0.6)] cursor-pointer transition-all flex items-center gap-2">
            <Upload className="w-4 h-4" /> Upload Assets
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* SMART SEARCH & FILTER BAR */}
      <SmartSearchFilterBar categories={["All", ...ASSET_TYPES]} type="assets" />

      {/* BULK ACTIONS TOOLBAR (WHEN ASSETS ARE SELECTED) */}
      {selectedAssetIds.length > 0 && (
        <div className="p-3 bg-neutral-900 border border-neon-cyan/50 rounded-2xl flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-150 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-neon-cyan text-black font-bold flex items-center justify-center text-[10px]">
              {selectedAssetIds.length}
            </span>
            <span className="text-white font-bold">Assets Selected</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBulkTagModal(true)}
              className="px-3 py-1.5 rounded-xl bg-neutral-800 border border-white/10 text-gray-200 hover:text-white flex items-center gap-1.5"
            >
              <Tag className="w-3.5 h-3.5 text-neon-cyan" /> Bulk Tag
            </button>

            <button
              onClick={bulkDeleteAssets}
              className="px-3 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500 text-rose-400 hover:bg-rose-500 hover:text-white flex items-center gap-1.5 transition-colors font-bold"
            >
              <Trash2 className="w-3.5 h-3.5" /> Bulk Delete
            </button>

            <button
              onClick={clearSelectedAssets}
              className="px-3 py-1.5 rounded-xl border border-white/10 text-gray-400 hover:text-white"
            >
              Cancel Selection
            </button>
          </div>
        </div>
      )}

      {/* MAIN ASSETS GRID & SIDEBAR CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* FOLDER NAVIGATION SIDEBAR */}
        <div className="lg:col-span-3 space-y-3 font-mono text-xs bg-neutral-900/60 border border-white/10 p-4 rounded-2xl h-fit">
          <div className="flex items-center justify-between text-gray-400 border-b border-white/10 pb-2">
            <span className="font-bold text-white flex items-center gap-1.5">
              <FolderOpen className="w-4 h-4 text-neon-cyan" /> Folder Vault
            </span>
            <span className="text-[10px] text-gray-500">{assets.length} Total</span>
          </div>

          <div className="space-y-1">
            {["All", "/Backgrounds", "/3D Renders", "/Icons", "/Logos", "/Textures", "/Wireframes", "/Uploads"].map(
              (f) => (
                <button
                  key={f}
                  onClick={() => setSelectedFolder(f)}
                  className={`w-full px-3 py-2 rounded-xl text-left border transition-all flex items-center justify-between ${
                    selectedFolder === f
                      ? "bg-neon-cyan/20 border-neon-cyan text-white font-bold"
                      : "bg-black/40 border-white/5 text-gray-400 hover:text-white"
                  }`}
                >
                  <span className="truncate">{f === "All" ? "All Shared Assets" : f}</span>
                </button>
              )
            )}
          </div>
        </div>

        {/* ASSETS CARDS GRID */}
        <div className="lg:col-span-9 space-y-3">
          <div className="flex items-center justify-between font-mono text-xs text-gray-400 px-1">
            <button
              onClick={() =>
                isAllSelected
                  ? clearSelectedAssets()
                  : selectAllAssets(filteredAssets.map((a) => a.id))
              }
              className="flex items-center gap-1.5 hover:text-white"
            >
              {isAllSelected ? (
                <CheckSquare className="w-4 h-4 text-neon-cyan" />
              ) : (
                <Square className="w-4 h-4 text-gray-500" />
              )}
              <span>Select All ({filteredAssets.length})</span>
            </button>

            <span>
              Showing <strong className="text-neon-cyan">{filteredAssets.length}</strong> items
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredAssets.map((asset) => {
              const isSelected = selectedAssetIds.includes(asset.id);
              const isFav = favoriteAssetIds.includes(asset.id);

              return (
                <div
                  key={asset.id}
                  className={`rounded-2xl bg-neutral-900 border overflow-hidden transition-all group flex flex-col justify-between shadow-lg relative ${
                    isSelected ? "border-neon-cyan bg-neon-cyan/5" : "border-white/10 hover:border-neon-cyan/50"
                  }`}
                >
                  {/* SELECTION CHECKBOX */}
                  <button
                    type="button"
                    onClick={() => toggleSelectAsset(asset.id)}
                    className="absolute top-2 left-2 z-20 p-1 rounded-md bg-black/80 border border-white/20 text-white"
                  >
                    {isSelected ? (
                      <CheckSquare className="w-3.5 h-3.5 text-neon-cyan" />
                    ) : (
                      <Square className="w-3.5 h-3.5 text-gray-500" />
                    )}
                  </button>

                  {/* FAVORITE BUTTON */}
                  <button
                    type="button"
                    onClick={() => toggleFavoriteAsset(asset.id)}
                    className={`absolute top-2 right-2 z-20 p-1.5 rounded-md border transition-all ${
                      isFav
                        ? "bg-rose-500/20 border-rose-500 text-rose-400"
                        : "bg-black/80 border-white/10 text-gray-400 hover:text-white"
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-rose-400" : ""}`} />
                  </button>

                  {/* PREVIEW CONTAINER */}
                  <div
                    onClick={() => setActiveAssetModal(asset)}
                    className="h-40 bg-black/80 p-3 flex items-center justify-center relative cursor-pointer group-hover:bg-black/60 transition-colors"
                  >
                    {asset.url ? (
                      <img
                        src={asset.url}
                        alt={asset.name}
                        className="max-h-full max-w-full object-contain rounded-lg group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                    ) : asset.svgCode ? (
                      <div
                        className="w-20 h-20 flex items-center justify-center group-hover:scale-105 transition-transform"
                        dangerouslySetInnerHTML={{ __html: asset.svgCode }}
                      />
                    ) : asset.gradientCSS ? (
                      <div
                        className="w-full h-full rounded-lg shadow-inner group-hover:scale-105 transition-transform"
                        style={{ background: asset.gradientCSS }}
                      />
                    ) : (
                      <FileText className="w-12 h-12 text-neon-cyan" />
                    )}

                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 border border-white/10 text-[9px] font-mono text-neon-cyan">
                      {asset.type}
                    </span>
                  </div>

                  {/* DETAILS FOOTER */}
                  <div className="p-3 space-y-1 font-mono text-xs">
                    <h3 className="font-bold text-white truncate group-hover:text-neon-cyan transition-colors">
                      {asset.name}
                    </h3>
                    <div className="flex items-center justify-between text-[10px] text-gray-500">
                      <span>{asset.sizeStr || "Vector"}</span>
                      <span>{asset.category}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ASSET PREVIEW MODAL */}
      {activeAssetModal && (
        <AssetPreviewModal
          asset={activeAssetModal}
          onClose={() => setActiveAssetModal(null)}
        />
      )}

      {/* COLLECTIONS MANAGEMENT MODAL */}
      {isCollectionsModalOpen && (
        <CollectionsManagerModal onClose={() => setIsCollectionsModalOpen(null)} />
      )}

      {/* BULK TAG MODAL */}
      {showBulkTagModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 font-mono text-xs">
          <div className="bg-neutral-900 border border-white/15 p-6 rounded-2xl w-full max-w-md space-y-4">
            <h3 className="font-bold text-white text-sm">Bulk Tag Selected Assets</h3>
            <p className="text-gray-400">
              Enter comma-separated tags to add to {selectedAssetIds.length} assets:
            </p>
            <input
              type="text"
              placeholder="e.g. cyber, campaign2026, approved"
              value={bulkTagInput}
              onChange={(e) => setBulkTagInput(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-neon-cyan"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowBulkTagModal(false)}
                className="px-3 py-1.5 rounded-xl border border-white/10 text-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyBulkTags}
                className="px-4 py-1.5 rounded-xl bg-neon-cyan text-black font-bold"
              >
                Apply Tags
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from "react";
import { ExtendedAssetMeta } from "../../../data/assetLibraryData";
import { useEcosystem } from "../../../context/EcosystemContext";
import { useStudio } from "../../../context/StudioContext";
import {
  X,
  Copy,
  Check,
  Download,
  Trash2,
  Tag,
  Edit3,
  FolderPlus,
  Layers,
  Heart,
  Share2,
  FileText,
  Clock,
  Code,
} from "lucide-react";

interface AssetPreviewModalProps {
  asset: ExtendedAssetMeta | null;
  onClose: () => void;
  onInsertToCanvas?: (asset: ExtendedAssetMeta) => void;
}

export function AssetPreviewModal({
  asset,
  onClose,
  onInsertToCanvas,
}: AssetPreviewModalProps) {
  const {
    favoriteAssetIds,
    toggleFavoriteAsset,
    renameAsset,
    deleteAsset,
    duplicateAsset,
    collections,
    addAssetToCollection,
  } = useEcosystem();

  const { addNotification } = useStudio();

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(asset?.name || "");
  const [isCopied, setIsCopied] = useState(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState("");

  if (!asset) return null;

  const isFavorite = favoriteAssetIds.includes(asset.id);

  const handleSaveName = () => {
    if (nameInput.trim()) {
      renameAsset(asset.id, nameInput.trim());
      setIsEditingName(false);
      addNotification("Asset Renamed", `Updated to "${nameInput.trim()}"`, "success");
    }
  };

  const handleCopyCode = () => {
    const textToCopy = asset.svgCode || asset.url || asset.gradientCSS || asset.fontFamily || "";
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    addNotification("Copied", "Asset payload copied to clipboard", "info");
  };

  const handleDownload = () => {
    if (asset.url) {
      const link = document.createElement("a");
      link.href = asset.url;
      link.download = `${asset.name}.png`;
      link.click();
    } else if (asset.svgCode) {
      const blob = new Blob([asset.svgCode], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${asset.name}.svg`;
      link.click();
    }
    addNotification("Download Started", `Downloading ${asset.name}`, "success");
  };

  const handleAddToCollection = () => {
    if (selectedCollectionId) {
      addAssetToCollection(asset.id, selectedCollectionId);
      addNotification("Collection Updated", "Asset added to custom collection", "success");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 font-mono select-none animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-neutral-900 border border-white/15 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-neon-cyan/20 border border-neon-cyan/40 text-neon-cyan">
              <Layers className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-neon-cyan/20 border border-neon-cyan/40 text-[10px] text-neon-cyan font-bold uppercase">
                  {asset.type}
                </span>
                <span className="text-[10px] text-gray-400">{asset.category}</span>
              </div>
              {isEditingName ? (
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="bg-black border border-neon-cyan rounded px-2 py-0.5 text-xs text-white"
                  />
                  <button
                    onClick={handleSaveName}
                    className="px-2 py-0.5 bg-neon-cyan text-black font-bold text-[10px] rounded"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <h2
                  onClick={() => setIsEditingName(true)}
                  className="font-display font-bold text-lg text-white truncate max-w-md cursor-pointer hover:text-neon-cyan transition-colors flex items-center gap-2"
                >
                  {asset.name} <Edit3 className="w-3.5 h-3.5 text-gray-500" />
                </h2>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toggleFavoriteAsset(asset.id)}
              className={`p-2 rounded-xl border transition-all ${
                isFavorite
                  ? "bg-rose-500/20 border-rose-500 text-rose-400"
                  : "bg-neutral-800 border-white/10 text-gray-400 hover:text-white"
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? "fill-rose-400" : ""}`} />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-800 border border-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* BODY CONTENT */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6 flex-1 bg-black/60">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* ASSET PREVIEW STAGE */}
            <div className="md:col-span-7 bg-black/90 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[260px] relative">
              {asset.url ? (
                <img
                  src={asset.url}
                  alt={asset.name}
                  className="max-h-64 max-w-full object-contain rounded-lg"
                  referrerPolicy="no-referrer"
                />
              ) : asset.svgCode ? (
                <div
                  className="w-32 h-32 flex items-center justify-center"
                  dangerouslySetInnerHTML={{ __html: asset.svgCode }}
                />
              ) : asset.gradientCSS ? (
                <div
                  className="w-full h-40 rounded-xl shadow-xl"
                  style={{ background: asset.gradientCSS }}
                />
              ) : asset.fontFamily ? (
                <div className="text-center space-y-2">
                  <span
                    className="text-3xl text-white font-bold block"
                    style={{ fontFamily: asset.fontFamily }}
                  >
                    The Quick Brown Fox
                  </span>
                  <span className="text-xs text-gray-400 font-mono">
                    Font Family: {asset.fontFamily}
                  </span>
                </div>
              ) : (
                <FileText className="w-16 h-16 text-neon-cyan" />
              )}
            </div>

            {/* METADATA & ACTIONS */}
            <div className="md:col-span-5 space-y-4">
              <div className="p-3 bg-neutral-900 border border-white/10 rounded-xl space-y-2 text-[11px]">
                <div className="flex justify-between text-gray-400">
                  <span>File Size</span>
                  <span className="text-white font-bold">{asset.sizeStr || "Shared"}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Dimensions</span>
                  <span className="text-neon-cyan font-bold">{asset.dimensions || "Vector"}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Folder Path</span>
                  <span className="text-gray-300 font-mono text-[10px]">
                    {asset.folderPath || "/Root"}
                  </span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Created Date</span>
                  <span className="text-white">{asset.createdAt}</span>
                </div>
              </div>

              {/* Collections Selector */}
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <FolderPlus className="w-3 h-3 text-neon-cyan" /> Add to Collection
                </label>
                <div className="flex gap-2">
                  <select
                    value={selectedCollectionId}
                    onChange={(e) => setSelectedCollectionId(e.target.value)}
                    className="flex-1 bg-neutral-900 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
                  >
                    <option value="">Select Collection...</option>
                    {collections.map((col) => (
                      <option key={col.id} value={col.id}>
                        {col.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleAddToCollection}
                    disabled={!selectedCollectionId}
                    className="px-3 py-1.5 rounded-xl bg-neon-cyan text-black font-bold text-xs disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {asset.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md bg-neutral-800 border border-white/10 text-[10px] text-gray-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-5 border-t border-white/10 bg-black/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCode}
              className="px-3 py-2 rounded-xl border border-white/10 bg-neutral-800 text-gray-200 text-xs font-bold hover:text-white flex items-center gap-1.5"
            >
              {isCopied ? (
                <Check className="w-3.5 h-3.5 text-neon-cyan" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>Copy Data/Code</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-3 py-2 rounded-xl border border-white/10 bg-neutral-800 text-gray-200 text-xs font-bold hover:text-white flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-neon-purple" />
              <span>Download</span>
            </button>
          </div>

          {onInsertToCanvas && (
            <button
              onClick={() => {
                onInsertToCanvas(asset);
                onClose();
              }}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-black font-display font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(0,245,255,0.6)]"
            >
              Insert Onto Canvas Stage
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

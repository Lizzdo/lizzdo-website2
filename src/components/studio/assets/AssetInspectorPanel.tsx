import React, { useState } from "react";
import { ExtendedAssetMeta } from "../../../data/assetLibraryData";
import { useEcosystem } from "../../../context/EcosystemContext";
import { useStudio } from "../../../context/StudioContext";
import {
  X,
  Download,
  Trash2,
  Copy,
  Tag,
  FolderOpen,
  Eye,
  Heart,
  Edit2,
  Zap,
  Sparkles,
  Maximize2,
  Check,
  Palette,
  FileText,
  Clock,
  Layers,
  HardDrive,
  FileCheck,
  Plus,
  RefreshCw,
  Share2,
} from "lucide-react";

interface AssetInspectorPanelProps {
  asset: ExtendedAssetMeta | null;
  onClose: () => void;
  onInsertToCanvas?: (asset: ExtendedAssetMeta) => void;
  onSetAsBackground?: (asset: ExtendedAssetMeta) => void;
}

export function AssetInspectorPanel({
  asset,
  onClose,
  onInsertToCanvas,
  onSetAsBackground,
}: AssetInspectorPanelProps) {
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
  const [editedName, setEditedName] = useState("");
  const [newTagInput, setNewTagInput] = useState("");
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [selectedCollectionId, setSelectedCollectionId] = useState("");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!asset) return null;

  const isFavorite = favoriteAssetIds.includes(asset.id);

  const handleStartRename = () => {
    setEditedName(asset.name);
    setIsEditingName(true);
  };

  const handleSaveRename = () => {
    if (editedName.trim()) {
      renameAsset(asset.id, editedName.trim());
      addNotification("Asset Renamed", `Updated asset name to "${editedName.trim()}".`, "info");
    }
    setIsEditingName(false);
  };

  const handleCopyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    addNotification("Color Copied", `Copied color code ${hex} to clipboard.`, "info");
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handleDownload = () => {
    if (asset.url) {
      const link = document.createElement("a");
      link.href = asset.url;
      link.download = `${asset.name}.${asset.format?.toLowerCase() || "png"}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      addNotification("Download Started", `Downloading ${asset.name}...`, "success");
    } else if (asset.svgCode) {
      const blob = new Blob([asset.svgCode], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${asset.name}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      addNotification("SVG Downloaded", `Downloaded ${asset.name}.svg`, "success");
    } else {
      addNotification("Download Unavailable", "This asset preview has no direct download payload.", "warning");
    }
  };

  const handleAddToCollection = () => {
    if (selectedCollectionId) {
      addAssetToCollection(asset.id, selectedCollectionId);
      const colName = collections.find((c) => c.id === selectedCollectionId)?.name || "Collection";
      addAssetToCollection(asset.id, selectedCollectionId);
      addNotification("Collection Updated", `Added "${asset.name}" to ${colName}.`, "success");
      setSelectedCollectionId("");
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-neutral-900/98 backdrop-blur-xl border-l border-white/10 z-50 flex flex-col shadow-2xl text-xs font-mono select-none animate-in slide-in-from-right duration-200">
      {/* PANEL HEADER */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-black/60">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-neon-cyan/20 border border-neon-cyan/40 text-neon-cyan font-bold text-[10px] uppercase">
            {asset.type}
          </span>
          <span className="text-gray-400 text-[10px] truncate max-w-[200px]">
            {asset.folderPath || "/Root"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleFavoriteAsset(asset.id)}
            className={`p-2 rounded-xl border transition-all ${
              isFavorite
                ? "bg-rose-500/20 border-rose-500 text-rose-400"
                : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
            }`}
            title="Toggle Favorite"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-rose-400" : ""}`} />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* PANEL BODY SCROLLABLE */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {/* PREVIEW CONTAINER */}
        <div className="relative rounded-2xl bg-black/80 border border-white/10 overflow-hidden flex items-center justify-center min-h-[220px] max-h-[320px] p-4 group">
          {asset.url && asset.type !== "Videos" && asset.type !== "Audio" && (
            <img
              src={asset.url}
              alt={asset.name}
              className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
            />
          )}

          {asset.type === "Videos" && asset.url && (
            <video
              src={asset.url}
              controls
              autoPlay
              loop
              muted
              className="max-h-full max-w-full rounded-lg"
            />
          )}

          {asset.type === "Audio" && asset.url && (
            <div className="w-full text-center space-y-3 p-4">
              <Zap className="w-12 h-12 text-neon-cyan mx-auto animate-pulse" />
              <p className="text-white font-bold text-sm">{asset.name}</p>
              <p className="text-gray-400 text-xs">{asset.durationStr || "Audio Track"}</p>
              <audio src={asset.url} controls className="w-full mt-2" />
            </div>
          )}

          {asset.svgCode && (
            <div
              className="w-40 h-40 flex items-center justify-center p-2 text-neon-cyan"
              dangerouslySetInnerHTML={{ __html: asset.svgCode }}
            />
          )}

          {asset.type === "Gradients" && asset.gradientCSS && (
            <div
              className="w-full h-48 rounded-xl border border-white/20 shadow-2xl flex items-end p-3"
              style={{ background: asset.gradientCSS }}
            >
              <span className="text-white font-bold bg-black/60 px-2 py-1 rounded text-xs">
                {asset.gradientCSS}
              </span>
            </div>
          )}

          {asset.type === "Fonts" && (
            <div className="text-center p-6 space-y-2">
              <span className="text-neon-cyan font-bold text-3xl block" style={{ fontFamily: asset.fontFamily }}>
                Aa Bb Cc 123
              </span>
              <p className="text-gray-300 text-sm font-bold" style={{ fontFamily: asset.fontFamily }}>
                {asset.fontFamily || asset.name}
              </p>
              <p className="text-gray-500 text-xs">The quick brown fox jumps over the lazy dog.</p>
            </div>
          )}

          {asset.type === "PDF & Documents" && (
            <div className="text-center space-y-2 p-6">
              <FileText className="w-16 h-16 text-rose-400 mx-auto" />
              <p className="text-white font-bold text-sm">{asset.name}</p>
              <p className="text-gray-400 text-xs">Portable Document Format (PDF)</p>
            </div>
          )}

          {asset.type === "PSD & Design Files" && (
            <div className="text-center space-y-2 p-6">
              <Layers className="w-16 h-16 text-blue-400 mx-auto" />
              <p className="text-white font-bold text-sm">{asset.name}</p>
              <p className="text-gray-400 text-xs">Adobe Photoshop Layered Document</p>
            </div>
          )}

          {/* Quick Overlay Badges */}
          <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-black/70 border border-white/20 text-[10px] text-gray-300 flex items-center gap-1.5">
            <HardDrive className="w-3 h-3 text-neon-cyan" />
            <span>{asset.sizeStr || "Unknown Size"}</span>
          </div>

          {asset.dimensions && (
            <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-black/70 border border-white/20 text-[10px] text-gray-300 flex items-center gap-1.5">
              <Maximize2 className="w-3 h-3 text-amber-400" />
              <span>{asset.dimensions}</span>
            </div>
          )}
        </div>

        {/* ASSET TITLE & EDIT RENAME */}
        <div className="space-y-2 bg-black/40 border border-white/10 p-3.5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Asset Title</span>
            {!isEditingName && (
              <button
                type="button"
                onClick={handleStartRename}
                className="text-neon-cyan hover:underline text-[10px] flex items-center gap-1"
              >
                <Edit2 className="w-3 h-3" /> Rename
              </button>
            )}
          </div>

          {isEditingName ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="flex-1 bg-black border border-neon-cyan rounded-xl px-3 py-1.5 text-white text-xs font-bold focus:outline-none"
                autoFocus
              />
              <button
                type="button"
                onClick={handleSaveRename}
                className="p-2 rounded-xl bg-neon-cyan text-black font-bold"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <h2 className="text-sm font-bold text-white tracking-wide">{asset.name}</h2>
          )}
        </div>

        {/* PRIMARY CANVAS INSERT ACTIONS */}
        <div className="grid grid-cols-2 gap-2">
          {onInsertToCanvas && (
            <button
              type="button"
              onClick={() => {
                onInsertToCanvas(asset);
                addNotification("Canvas Direct Insert", `Added ${asset.name} to canvas workspace.`, "success");
              }}
              className="p-3 rounded-2xl bg-gradient-to-r from-neon-cyan to-blue-500 text-black font-bold text-xs uppercase shadow-lg hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Insert to Stage
            </button>
          )}

          {onSetAsBackground && (
            <button
              type="button"
              onClick={() => {
                onSetAsBackground(asset);
                addNotification("Background Applied", `Set ${asset.name} as canvas background.`, "success");
              }}
              className="p-3 rounded-2xl bg-white/10 border border-white/20 text-white font-bold text-xs uppercase hover:bg-white/20 transition-all flex items-center justify-center gap-2"
            >
              <Layers className="w-4 h-4 text-neon-purple" /> Set BG
            </button>
          )}
        </div>

        {/* METADATA SPECIFICATIONS TABLE */}
        <div className="space-y-2 bg-black/40 border border-white/10 p-3.5 rounded-2xl">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-bold">
            Asset Metadata
          </span>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
            <div className="p-2 rounded-xl bg-neutral-900 border border-white/5 space-y-0.5">
              <span className="text-gray-500 text-[9px] block uppercase">Format / MIME</span>
              <span className="text-white font-bold">{asset.format || "PNG/Media"}</span>
            </div>

            <div className="p-2 rounded-xl bg-neutral-900 border border-white/5 space-y-0.5">
              <span className="text-gray-500 text-[9px] block uppercase">Dimensions</span>
              <span className="text-amber-300 font-bold">{asset.dimensions || "Vector Scalable"}</span>
            </div>

            <div className="p-2 rounded-xl bg-neutral-900 border border-white/5 space-y-0.5">
              <span className="text-gray-500 text-[9px] block uppercase">File Storage Size</span>
              <span className="text-neon-cyan font-bold">{asset.sizeStr || "1.2 MB"}</span>
            </div>

            <div className="p-2 rounded-xl bg-neutral-900 border border-white/5 space-y-0.5">
              <span className="text-gray-500 text-[9px] block uppercase">Date Created</span>
              <span className="text-gray-300">{asset.createdAt}</span>
            </div>

            <div className="p-2 rounded-xl bg-neutral-900 border border-white/5 space-y-0.5">
              <span className="text-gray-500 text-[9px] block uppercase">Usage Count</span>
              <span className="text-emerald-400 font-bold">{asset.usageCount || 0} Projects</span>
            </div>

            <div className="p-2 rounded-xl bg-neutral-900 border border-white/5 space-y-0.5">
              <span className="text-gray-500 text-[9px] block uppercase">Compression</span>
              <span className={asset.optimized ? "text-emerald-400 font-bold" : "text-gray-400"}>
                {asset.optimized ? "Optimized WebP" : "Standard Raw"}
              </span>
            </div>
          </div>
        </div>

        {/* EXTRACTED COLOR PALETTE */}
        {asset.colorPalette && asset.colorPalette.length > 0 && (
          <div className="space-y-2 bg-black/40 border border-white/10 p-3.5 rounded-2xl">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider flex items-center justify-between font-bold">
              <span>Extracted Color Palette</span>
              <Palette className="w-3.5 h-3.5 text-neon-purple" />
            </span>

            <div className="grid grid-cols-4 gap-2 pt-1">
              {asset.colorPalette.map((hex, i) => (
                <div
                  key={i}
                  onClick={() => handleCopyColor(hex)}
                  className="p-2 rounded-xl border border-white/10 cursor-pointer hover:scale-105 transition-transform flex flex-col items-center gap-1.5 bg-neutral-900"
                >
                  <div className="w-full h-8 rounded-lg shadow-inner" style={{ backgroundColor: hex }} />
                  <span className="text-[9px] text-gray-300 font-mono font-bold">{hex}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAGS LIST */}
        <div className="space-y-2 bg-black/40 border border-white/10 p-3.5 rounded-2xl">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-bold">
            Asset Tags ({asset.tags.length})
          </span>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {asset.tags.map((tag, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-[10px] flex items-center gap-1"
              >
                <Tag className="w-3 h-3 text-neon-cyan" />
                <span>{tag}</span>
              </span>
            ))}
          </div>
        </div>

        {/* COLLECTION ORGANIZER */}
        <div className="space-y-2 bg-black/40 border border-white/10 p-3.5 rounded-2xl">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-bold">
            Add to Campaign Collection
          </span>

          <div className="flex items-center gap-2">
            <select
              value={selectedCollectionId}
              onChange={(e) => setSelectedCollectionId(e.target.value)}
              className="flex-1 bg-black border border-white/15 rounded-xl p-2 text-white text-xs"
            >
              <option value="">Select Collection...</option>
              {collections.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleAddToCollection}
              disabled={!selectedCollectionId}
              className="px-3 py-2 rounded-xl bg-neon-purple text-black font-bold disabled:opacity-40"
            >
              Add
            </button>
          </div>
        </div>

        {/* BOTTOM UTILITY ACTIONS */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={handleDownload}
            className="w-full p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-neon-cyan/50 text-white font-bold transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4 text-neon-cyan" /> Download High-Res File
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                duplicateAsset(asset.id);
                addNotification("Asset Duplicated", `Created duplicate copy of ${asset.name}.`, "info");
              }}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5 text-amber-400" /> Duplicate
            </button>

            <button
              type="button"
              onClick={() => {
                deleteAsset(asset.id);
                addNotification("Asset Deleted", `Removed ${asset.name} from library.`, "warning");
                onClose();
              }}
              className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-400 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete File
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

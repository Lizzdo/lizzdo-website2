import React, { useState } from "react";
import { useEcosystem } from "../../../context/EcosystemContext";
import { useStudio } from "../../../context/StudioContext";
import { ExtendedAssetMeta, ASSET_TYPES } from "../../../data/assetLibraryData";
import { SmartSearchFilterBar } from "../ecosystem/SmartSearchFilterBar";
import { AssetInspectorPanel } from "../assets/AssetInspectorPanel";
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
  Zap,
  RefreshCw,
  SlidersHorizontal,
  ArrowUpDown,
  HardDrive,
  Maximize2,
  MoreVertical,
  Edit2,
  Share2,
  Video,
  Music,
  FileCode,
  Box,
  Palette,
  Folder,
} from "lucide-react";

export function AssetLibraryWorkspace() {
  const {
    assets,
    favoriteAssetIds,
    toggleFavoriteAsset,
    uploadAssetFile,
    selectedAssetIds,
    setSelectedAssetIds,
    toggleSelectAsset,
    selectAllAssets,
    clearSelectedAssets,
    bulkDeleteAssets,
    bulkTagAssets,
    bulkMoveToFolder,
    bulkRenameAssets,
    bulkOptimizeAssets,
    bulkMoveToCollection,
    collections,
    folders,
    currentFolder,
    setCurrentFolder,
    createFolder,
    renameFolder,
    deleteFolder,
    toggleFavoriteFolder,
    setFolderColor,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    selectedStyle,
    selectedColor,
    selectedType,
    setSelectedType,
    selectedTagPills,
    toggleTagPill,
    sortOrder,
    setSortOrder,
    showFavoritesOnly,
  } = useEcosystem();

  const { addNotification, currentProject, updateProject } = useStudio();

  const [inspectorAsset, setInspectorAsset] = useState<ExtendedAssetMeta | null>(null);
  const [isCollectionsModalOpen, setIsCollectionsModalOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // Modal States for Bulk Operations
  const [showBulkTagModal, setShowBulkTagModal] = useState(false);
  const [bulkTagInput, setBulkTagInput] = useState("");
  const [showBulkMoveModal, setShowBulkMoveModal] = useState(false);
  const [bulkTargetFolder, setBulkTargetFolder] = useState("/Backgrounds");
  const [showBulkRenameModal, setShowBulkRenameModal] = useState(false);
  const [bulkRenamePrefix, setBulkRenamePrefix] = useState("Studio_Asset");

  // New Folder State
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderColor, setNewFolderColor] = useState("#00f5ff");

  // POPULAR TAGS LIST FOR QUICK FILTER PILLS
  const QUICK_TAG_PILLS = [
    "Technology",
    "Cybersecurity",
    "Business",
    "Gaming",
    "3D",
    "Roblox",
    "Portfolio",
    "Social Media",
    "Blog",
    "Store",
    "Marketing",
    "Background",
    "Neon",
  ];

  // FILTER & SORT ASSETS
  const filteredAssets = assets
    .filter((a) => {
      const matchesSearch =
        !searchQuery.trim() ||
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (a.category && a.category.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === "All" ||
        (a.type && a.type.toLowerCase() === selectedCategory.toLowerCase()) ||
        (a.category && a.category.toLowerCase() === selectedCategory.toLowerCase());

      const matchesType =
        selectedType === "All" || (a.type && a.type.toLowerCase() === selectedType.toLowerCase());

      const matchesStyle =
        selectedStyle === "All Styles" ||
        (a.style && a.style.toLowerCase() === selectedStyle.toLowerCase());

      const matchesColor =
        selectedColor === "All Colors" ||
        (a.color && a.color.toLowerCase() === selectedColor.toLowerCase());

      const matchesFolder =
        currentFolder === "All" ||
        (a.folderPath && a.folderPath.toLowerCase() === currentFolder.toLowerCase());

      const matchesTags =
        selectedTagPills.length === 0 ||
        selectedTagPills.every((pill) =>
          a.tags.some((t) => t.toLowerCase().includes(pill.toLowerCase()))
        );

      const matchesFav = !showFavoritesOnly || favoriteAssetIds.includes(a.id);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesType &&
        matchesStyle &&
        matchesColor &&
        matchesFolder &&
        matchesTags &&
        matchesFav
      );
    })
    .sort((a, b) => {
      if (sortOrder === "newest") return b.createdAt.localeCompare(a.createdAt);
      if (sortOrder === "oldest") return a.createdAt.localeCompare(b.createdAt);
      if (sortOrder === "name-asc") return a.name.localeCompare(b.name);
      if (sortOrder === "name-desc") return b.name.localeCompare(a.name);
      if (sortOrder === "size") return (b.sizeBytes || 0) - (a.sizeBytes || 0);
      if (sortOrder === "usage") return (b.usageCount || 0) - (a.usageCount || 0);
      return 0;
    });

  // DRAG & DROP FILE HANDLERS
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArr = Array.from(e.target.files);
      for (const file of filesArr) {
        await uploadAssetFile(
          file,
          "User Uploads",
          currentFolder !== "All" ? currentFolder : "/Uploads"
        );
      }
      addNotification("Assets Imported", `Successfully stored ${filesArr.length} file(s) in Vault.`, "success");
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArr = Array.from(e.dataTransfer.files);
      for (const file of filesArr) {
        await uploadAssetFile(
          file,
          "User Uploads",
          currentFolder !== "All" ? currentFolder : "/Uploads"
        );
      }
      addNotification("Upload Complete", `Uploaded ${filesArr.length} file(s) into ${currentFolder}`, "success");
    }
  };

  // BULK ACTION EXECUTORS
  const handleApplyBulkTags = () => {
    if (bulkTagInput.trim()) {
      const tagsArr = bulkTagInput.split(",").map((t) => t.trim()).filter(Boolean);
      bulkTagAssets(tagsArr);
      setBulkTagInput("");
      setShowBulkTagModal(false);
      addNotification("Bulk Tagging", `Tagged ${selectedAssetIds.length} assets.`, "success");
    }
  };

  const handleApplyBulkMove = () => {
    bulkMoveToFolder(bulkTargetFolder);
    setShowBulkMoveModal(false);
    addNotification("Bulk Relocation", `Moved ${selectedAssetIds.length} assets to ${bulkTargetFolder}.`, "success");
  };

  const handleApplyBulkRename = () => {
    if (bulkRenamePrefix.trim()) {
      bulkRenameAssets(bulkRenamePrefix.trim());
      setShowBulkRenameModal(false);
      addNotification("Batch Rename", `Renamed selected assets with prefix "${bulkRenamePrefix}".`, "info");
    }
  };

  const handleCreateNewFolder = () => {
    if (newFolderName.trim()) {
      createFolder(newFolderName.trim(), newFolderColor);
      setNewFolderName("");
      setIsCreatingFolder(false);
      addNotification("Folder Created", `Created folder /${newFolderName.trim()}`, "success");
    }
  };

  // DIRECT CANVAS INSERTION ENGINE
  const handleInsertAssetToStage = (asset: ExtendedAssetMeta) => {
    if (currentProject) {
      const newElem = {
        id: `elem-${Date.now()}`,
        type: asset.type === "SVG Icons" ? "icon" : "image",
        content: asset.url || asset.svgCode || asset.name,
        src: asset.url,
        x: 100,
        y: 100,
        width: 300,
        height: 300,
        rotation: 0,
        opacity: 1,
        locked: false,
        visible: true,
      };

      const updatedState = {
        ...currentProject.designState,
        elements: [...currentProject.designState.elements, newElem],
      };

      updateProject(currentProject.id, { designState: updatedState });
      addNotification("Canvas Direct Insert", `Inserted ${asset.name} into active canvas project!`, "success");
    } else {
      addNotification("No Active Stage", "Open or create a design project in Designer V1 to insert assets directly.", "warning");
    }
  };

  const handleSetAssetAsBackground = (asset: ExtendedAssetMeta) => {
    if (currentProject && asset.url) {
      const updatedState = {
        ...currentProject.designState,
        background: {
          ...currentProject.designState.background,
          type: "image",
          imageUrl: asset.url,
        },
      };

      updateProject(currentProject.id, { designState: updatedState });
      addNotification("Background Applied", `Set ${asset.name} as canvas background.`, "success");
    } else {
      addNotification("No Active Stage", "Open a design project in Designer V1 to set stage background.", "warning");
    }
  };

  const isAllSelected =
    filteredAssets.length > 0 && selectedAssetIds.length === filteredAssets.length;

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      className={`flex-1 bg-black text-white p-6 overflow-y-auto custom-scrollbar font-sans select-none space-y-6 relative transition-all ${
        isDragOver ? "bg-black/90 ring-4 ring-neon-cyan/50 ring-inset" : ""
      }`}
    >
      {/* DRAG OVERLAY WATERMARK */}
      {isDragOver && (
        <div className="fixed inset-0 bg-neon-cyan/20 backdrop-blur-md z-50 flex flex-col items-center justify-center space-y-4 pointer-events-none animate-in fade-in duration-150">
          <Upload className="w-16 h-16 text-neon-cyan animate-bounce" />
          <h2 className="font-display font-black text-3xl text-white uppercase tracking-wider">
            Drop Files Anywhere to Vault
          </h2>
          <p className="font-mono text-xs text-neon-cyan font-bold">
            Target Destination: {currentFolder}
          </p>
        </div>
      )}

      {/* HEADER BAR & UPLOAD VAULT TRIGGER */}
      <div className="p-6 rounded-3xl bg-neutral-900 border border-white/10 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-xs font-mono">
            <Layers className="w-3.5 h-3.5" />
            <span>Studio.Lizzdo Central Media Vault</span>
          </div>
          <h1 className="font-display font-black text-2xl lg:text-3xl tracking-wider text-white uppercase">
            Asset Library & Media Hub
          </h1>
          <p className="text-xs text-gray-400 font-mono">
            Full-spectrum asset repository supporting high-res PNG, JPG, WebP, SVG, MP4, MOV, MP3, WAV, Fonts, Lottie JSON, and Photoshop PSDs.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsCollectionsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl border border-white/10 bg-neutral-800 hover:bg-neutral-700 text-gray-200 text-xs font-mono font-bold transition-colors flex items-center gap-2"
          >
            <FolderPlus className="w-4 h-4 text-neon-purple" />
            <span>Campaign Collections ({collections.length})</span>
          </button>

          <label className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-black font-display font-bold text-xs uppercase tracking-wider hover:scale-[1.02] cursor-pointer transition-all flex items-center gap-2 shadow-lg shadow-neon-cyan/20">
            <Upload className="w-4 h-4" /> Upload Vault Assets
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

      {/* QUICK TAG FILTER PILLS */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 font-mono text-xs custom-scrollbar">
        <span className="text-[10px] text-gray-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Tag className="w-3 h-3 text-neon-cyan" /> Quick Tags:
        </span>
        {QUICK_TAG_PILLS.map((tag) => {
          const isSelected = selectedTagPills.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTagPill(tag)}
              className={`px-2.5 py-1 rounded-xl border text-[10px] transition-all whitespace-nowrap shrink-0 ${
                isSelected
                  ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan font-bold"
                  : "bg-neutral-900 border-white/10 text-gray-400 hover:text-white"
              }`}
            >
              #{tag}
            </button>
          );
        })}
      </div>

      {/* BULK OPERATIONS CONTROL TOOLBAR */}
      {selectedAssetIds.length > 0 && (
        <div className="p-3.5 bg-neutral-900/95 backdrop-blur-xl border border-neon-cyan/60 rounded-2xl flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-150 font-mono text-xs shadow-2xl">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-neon-cyan text-black font-black flex items-center justify-center text-[11px]">
              {selectedAssetIds.length}
            </span>
            <span className="text-white font-bold">Assets Selected for Batch Operations</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowBulkTagModal(true)}
              className="px-3 py-1.5 rounded-xl bg-neutral-800 border border-white/10 text-gray-200 hover:text-white flex items-center gap-1.5"
            >
              <Tag className="w-3.5 h-3.5 text-neon-cyan" /> Tag
            </button>

            <button
              type="button"
              onClick={() => setShowBulkMoveModal(true)}
              className="px-3 py-1.5 rounded-xl bg-neutral-800 border border-white/10 text-gray-200 hover:text-white flex items-center gap-1.5"
            >
              <FolderOpen className="w-3.5 h-3.5 text-amber-400" /> Relocate Folder
            </button>

            <button
              type="button"
              onClick={() => setShowBulkRenameModal(true)}
              className="px-3 py-1.5 rounded-xl bg-neutral-800 border border-white/10 text-gray-200 hover:text-white flex items-center gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5 text-neon-purple" /> Batch Rename
            </button>

            <button
              type="button"
              onClick={() => {
                bulkOptimizeAssets();
                addNotification("Compression Complete", `Optimized file sizes for ${selectedAssetIds.length} assets.`, "success");
              }}
              className="px-3 py-1.5 rounded-xl bg-neutral-800 border border-white/10 text-emerald-400 hover:text-white flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" /> Optimize Size
            </button>

            <button
              type="button"
              onClick={bulkDeleteAssets}
              className="px-3 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500 text-rose-400 hover:bg-rose-500 hover:text-white flex items-center gap-1.5 transition-colors font-bold"
            >
              <Trash2 className="w-3.5 h-3.5" /> Bulk Delete
            </button>

            <button
              type="button"
              onClick={clearSelectedAssets}
              className="px-3 py-1.5 rounded-xl border border-white/10 text-gray-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* MAIN TWO-COLUMN LAYOUT: FOLDER SIDEBAR + ASSET GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: NESTED FOLDER TREE & ACTIONS */}
        <div className="lg:col-span-3 space-y-3 font-mono text-xs bg-neutral-900/80 border border-white/10 p-4 rounded-2xl h-fit">
          <div className="flex items-center justify-between text-gray-400 border-b border-white/10 pb-2">
            <span className="font-bold text-white flex items-center gap-1.5">
              <FolderOpen className="w-4 h-4 text-neon-cyan" /> Folder Tree ({folders.length})
            </span>
            <button
              type="button"
              onClick={() => setIsCreatingFolder(true)}
              className="text-neon-cyan hover:underline text-[10px] flex items-center gap-1 font-bold"
            >
              <Plus className="w-3 h-3" /> New Folder
            </button>
          </div>

          {/* CREATE FOLDER INPUT BOX */}
          {isCreatingFolder && (
            <div className="p-3 bg-black/60 border border-neon-cyan/50 rounded-xl space-y-2">
              <span className="text-[10px] text-gray-400 uppercase font-bold block">New Directory Path</span>
              <input
                type="text"
                placeholder="e.g. Brand Assets/Sub"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="w-full bg-neutral-900 border border-white/15 rounded-lg p-1.5 text-white text-xs focus:outline-none"
                autoFocus
              />
              <div className="flex items-center justify-between pt-1">
                <input
                  type="color"
                  value={newFolderColor}
                  onChange={(e) => setNewFolderColor(e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer border-none bg-transparent"
                />
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setIsCreatingFolder(false)}
                    className="px-2 py-1 rounded bg-white/5 text-gray-400 text-[10px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateNewFolder}
                    className="px-2.5 py-1 rounded bg-neon-cyan text-black font-bold text-[10px]"
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* FOLDERS LIST */}
          <div className="space-y-1 max-h-[400px] overflow-y-auto custom-scrollbar">
            <button
              type="button"
              onClick={() => setCurrentFolder("All")}
              className={`w-full px-3 py-2 rounded-xl text-left border transition-all flex items-center justify-between ${
                currentFolder === "All"
                  ? "bg-neon-cyan/20 border-neon-cyan text-white font-bold"
                  : "bg-black/40 border-white/5 text-gray-400 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2 truncate">
                <Folder className="w-4 h-4 text-neon-cyan" /> All Shared Vault Items
              </span>
              <span className="text-[10px] font-mono text-gray-500">{assets.length}</span>
            </button>

            {folders.map((f) => {
              const count = assets.filter((a) => a.folderPath === f.path).length;
              const isSelected = currentFolder === f.path;

              return (
                <div
                  key={f.path}
                  className={`group rounded-xl border transition-all flex items-center justify-between p-2 cursor-pointer ${
                    isSelected
                      ? "bg-neon-cyan/20 border-neon-cyan text-white font-bold"
                      : "bg-black/40 border-white/5 text-gray-400 hover:text-white"
                  }`}
                  onClick={() => setCurrentFolder(f.path)}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: f.color || "#00f5ff" }} />
                    <span className="truncate">{f.name}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] text-gray-500">{count}</span>
                    {f.path !== "/Backgrounds" && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteFolder(f.path);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-rose-400 transition-opacity p-0.5"
                        title="Delete folder"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: ASSETS GRID & TOOLBAR */}
        <div className="lg:col-span-9 space-y-4">
          {/* SORT & SELECT ALL BAR */}
          <div className="p-3 bg-neutral-900 border border-white/10 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 font-mono text-xs text-gray-400">
            <button
              type="button"
              onClick={() =>
                isAllSelected
                  ? clearSelectedAssets()
                  : selectAllAssets(filteredAssets.map((a) => a.id))
              }
              className="flex items-center gap-2 hover:text-white font-bold"
            >
              {isAllSelected ? (
                <CheckSquare className="w-4 h-4 text-neon-cyan" />
              ) : (
                <Square className="w-4 h-4 text-gray-500" />
              )}
              <span>Select All Visible ({filteredAssets.length})</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-[11px]">
                <ArrowUpDown className="w-3.5 h-3.5 text-neon-cyan" />
                <span>Sort By:</span>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="bg-black/60 border border-white/10 rounded-xl px-2 py-1 text-white focus:outline-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="size">Largest Storage Size</option>
                  <option value="usage">Most Frequently Used</option>
                </select>
              </div>

              <span>
                Showing <strong className="text-neon-cyan">{filteredAssets.length}</strong> items
              </span>
            </div>
          </div>

          {/* ASSET CARDS RESPONSIVE GRID */}
          {filteredAssets.length === 0 ? (
            <div className="p-12 text-center bg-neutral-900/60 border border-white/10 rounded-3xl space-y-3 font-mono text-xs">
              <FolderOpen className="w-12 h-12 text-neon-cyan mx-auto opacity-50" />
              <p className="text-white font-bold text-sm">No assets found in vault matching criteria.</p>
              <p className="text-gray-400">Try adjusting your filters, clearing search query, or uploading new media.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredAssets.map((asset) => {
                const isSelected = selectedAssetIds.includes(asset.id);
                const isFav = favoriteAssetIds.includes(asset.id);

                return (
                  <div
                    key={asset.id}
                    className={`rounded-2xl bg-neutral-900 border overflow-hidden transition-all group flex flex-col justify-between shadow-xl relative ${
                      isSelected ? "border-neon-cyan bg-neon-cyan/10 ring-2 ring-neon-cyan/40" : "border-white/10 hover:border-neon-cyan/50"
                    }`}
                  >
                    {/* SELECTION CHECKBOX */}
                    <button
                      type="button"
                      onClick={() => toggleSelectAsset(asset.id)}
                      className="absolute top-2.5 left-2.5 z-20 p-1.5 rounded-lg bg-black/80 border border-white/20 text-white"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-neon-cyan" />
                      ) : (
                        <Square className="w-4 h-4 text-gray-500" />
                      )}
                    </button>

                    {/* FAVORITE TOGGLE */}
                    <button
                      type="button"
                      onClick={() => toggleFavoriteAsset(asset.id)}
                      className={`absolute top-2.5 right-2.5 z-20 p-1.5 rounded-lg border transition-all ${
                        isFav
                          ? "bg-rose-500/20 border-rose-500 text-rose-400"
                          : "bg-black/80 border-white/10 text-gray-400 hover:text-white"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? "fill-rose-400" : ""}`} />
                    </button>

                    {/* PREVIEW IMAGE / MEDIA STAGE */}
                    <div
                      onClick={() => setInspectorAsset(asset)}
                      className="h-44 bg-black/80 p-3 flex items-center justify-center relative cursor-pointer group-hover:bg-black/60 transition-colors"
                    >
                      {asset.url && asset.type !== "Videos" && asset.type !== "Audio" && (
                        <img
                          src={asset.url}
                          alt={asset.name}
                          className="max-h-full max-w-full object-contain rounded-lg group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                      )}

                      {asset.type === "Videos" && (
                        <div className="text-center space-y-1">
                          <Video className="w-10 h-10 text-cyan-400 mx-auto" />
                          <span className="text-[9px] font-mono text-cyan-300 block font-bold">
                            {asset.durationStr || "MP4 Motion"}
                          </span>
                        </div>
                      )}

                      {asset.type === "Audio" && (
                        <div className="text-center space-y-1">
                          <Music className="w-10 h-10 text-emerald-400 mx-auto animate-pulse" />
                          <span className="text-[9px] font-mono text-emerald-300 block font-bold">
                            {asset.durationStr || "Audio Track"}
                          </span>
                        </div>
                      )}

                      {asset.svgCode && (
                        <div
                          className="w-20 h-20 flex items-center justify-center group-hover:scale-105 transition-transform text-neon-cyan"
                          dangerouslySetInnerHTML={{ __html: asset.svgCode }}
                        />
                      )}

                      {asset.type === "Gradients" && asset.gradientCSS && (
                        <div
                          className="w-full h-full rounded-lg shadow-inner group-hover:scale-105 transition-transform"
                          style={{ background: asset.gradientCSS }}
                        />
                      )}

                      {asset.type === "Fonts" && (
                        <div className="text-center space-y-1">
                          <span className="text-neon-cyan font-bold text-2xl block" style={{ fontFamily: asset.fontFamily }}>
                            Aa
                          </span>
                          <span className="text-[10px] text-gray-300 font-bold block">{asset.fontFamily}</span>
                        </div>
                      )}

                      {asset.type === "PDF & Documents" && (
                        <div className="text-center space-y-1">
                          <FileText className="w-10 h-10 text-rose-400 mx-auto" />
                          <span className="text-[9px] text-rose-300 font-bold block">PDF Document</span>
                        </div>
                      )}

                      {asset.type === "PSD & Design Files" && (
                        <div className="text-center space-y-1">
                          <Box className="w-10 h-10 text-blue-400 mx-auto" />
                          <span className="text-[9px] text-blue-300 font-bold block">Photoshop PSD</span>
                        </div>
                      )}

                      {/* QUICK TYPE BADGE */}
                      <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded bg-black/90 border border-white/10 text-[9px] font-mono text-neon-cyan font-bold uppercase">
                        {asset.type}
                      </span>
                    </div>

                    {/* CARD FOOTER INFO */}
                    <div className="p-3 space-y-1.5 font-mono text-xs bg-neutral-900 border-t border-white/5">
                      <div className="flex items-center justify-between">
                        <h3
                          onClick={() => setInspectorAsset(asset)}
                          className="font-bold text-white truncate hover:text-neon-cyan cursor-pointer transition-colors max-w-[140px]"
                        >
                          {asset.name}
                        </h3>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-gray-500">
                        <span>{asset.sizeStr || "1.2 MB"}</span>
                        <span>{asset.format || "PNG"}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* INSPECTOR SLIDE-OVER PANEL */}
      {inspectorAsset && (
        <AssetInspectorPanel
          asset={inspectorAsset}
          onClose={() => setInspectorAsset(null)}
          onInsertToCanvas={handleInsertAssetToStage}
          onSetAsBackground={handleSetAssetAsBackground}
        />
      )}

      {/* COLLECTIONS MANAGEMENT MODAL */}
      {isCollectionsModalOpen && (
        <CollectionsManagerModal onClose={() => setIsCollectionsModalOpen(false)} />
      )}

      {/* BULK TAG MODAL */}
      {showBulkTagModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 font-mono text-xs">
          <div className="bg-neutral-900 border border-white/15 p-6 rounded-2xl w-full max-w-md space-y-4">
            <h3 className="font-bold text-white text-sm">Bulk Tag Selected Assets ({selectedAssetIds.length})</h3>
            <p className="text-gray-400">Enter comma-separated tags to append to selected assets:</p>
            <input
              type="text"
              placeholder="e.g. campaign2026, approved, verified"
              value={bulkTagInput}
              onChange={(e) => setBulkTagInput(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-neon-cyan"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowBulkTagModal(false)}
                className="px-3 py-1.5 rounded-xl border border-white/10 text-gray-400"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyBulkTags}
                className="px-4 py-1.5 rounded-xl bg-neon-cyan text-black font-bold"
              >
                Apply Tags
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BULK MOVE MODAL */}
      {showBulkMoveModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 font-mono text-xs">
          <div className="bg-neutral-900 border border-white/15 p-6 rounded-2xl w-full max-w-md space-y-4">
            <h3 className="font-bold text-white text-sm">Relocate Selected Assets ({selectedAssetIds.length})</h3>
            <p className="text-gray-400">Select target destination directory in vault:</p>
            <select
              value={bulkTargetFolder}
              onChange={(e) => setBulkTargetFolder(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-xl p-2 text-white"
            >
              {folders.map((f) => (
                <option key={f.path} value={f.path}>
                  {f.path} ({f.name})
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowBulkMoveModal(false)}
                className="px-3 py-1.5 rounded-xl border border-white/10 text-gray-400"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyBulkMove}
                className="px-4 py-1.5 rounded-xl bg-amber-400 text-black font-bold"
              >
                Move Assets
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BULK RENAME MODAL */}
      {showBulkRenameModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 font-mono text-xs">
          <div className="bg-neutral-900 border border-white/15 p-6 rounded-2xl w-full max-w-md space-y-4">
            <h3 className="font-bold text-white text-sm">Batch Rename Assets ({selectedAssetIds.length})</h3>
            <p className="text-gray-400">Enter file prefix for automated indexing (e.g. "Banner_2026_1"):</p>
            <input
              type="text"
              placeholder="e.g. Cyberpunk_Asset"
              value={bulkRenamePrefix}
              onChange={(e) => setBulkRenamePrefix(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-neon-purple"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowBulkRenameModal(false)}
                className="px-3 py-1.5 rounded-xl border border-white/10 text-gray-400"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyBulkRename}
                className="px-4 py-1.5 rounded-xl bg-neon-purple text-white font-bold"
              >
                Batch Rename
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from "react";
import { useEcosystem, AssetCollection } from "../../../context/EcosystemContext";
import { useStudio } from "../../../context/StudioContext";
import {
  X,
  Plus,
  FolderPlus,
  Folder,
  Trash2,
  Share2,
  Check,
  Bookmark,
  Layers,
  Sparkles,
} from "lucide-react";

interface CollectionsManagerModalProps {
  onClose: () => void;
}

export function CollectionsManagerModal({ onClose }: CollectionsManagerModalProps) {
  const { collections, createCollection, deleteCollection, createFolderInCollection } =
    useEcosystem();
  const { addNotification } = useStudio();

  const [newColName, setNewColName] = useState("");
  const [newColDesc, setNewColDesc] = useState("");
  const [selectedColId, setSelectedColId] = useState<string | null>(
    collections[0]?.id || null
  );
  const [newFolderName, setNewFolderName] = useState("");

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (newColName.trim()) {
      const created = createCollection(newColName.trim(), newColDesc.trim());
      setSelectedColId(created.id);
      setNewColName("");
      setNewColDesc("");
      addNotification("Collection Created", `Collection "${created.name}" is ready`, "success");
    }
  };

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedColId && newFolderName.trim()) {
      createFolderInCollection(selectedColId, newFolderName.trim());
      setNewFolderName("");
      addNotification("Folder Added", `Added folder "${newFolderName.trim()}"`, "success");
    }
  };

  const activeCollection = collections.find((c) => c.id === selectedColId);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 font-mono select-none animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-neutral-900 border border-white/15 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* HEADER */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-neon-purple/20 border border-neon-purple/40 text-neon-purple">
              <FolderPlus className="w-5 h-5" />
            </span>
            <div>
              <h2 className="font-display font-bold text-lg text-white">
                Collections & Shared Project Vaults
              </h2>
              <p className="text-[10px] text-gray-400">
                Organize shared assets and templates into shared team collections and sub-folders.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-800 border border-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto custom-scrollbar flex-1 bg-black/60">
          {/* LEFT: COLLECTION LIST & CREATOR */}
          <div className="lg:col-span-5 space-y-4 border-r border-white/10 pr-4">
            <form onSubmit={handleCreateCollection} className="p-3 bg-neutral-900 rounded-2xl border border-white/10 space-y-2">
              <span className="text-[10px] text-neon-purple font-bold uppercase tracking-wider block">
                Create New Collection
              </span>
              <input
                type="text"
                placeholder="Collection title..."
                value={newColName}
                onChange={(e) => setNewColName(e.target.value)}
                className="w-full bg-black/80 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-neon-purple"
              />
              <input
                type="text"
                placeholder="Optional description..."
                value={newColDesc}
                onChange={(e) => setNewColDesc(e.target.value)}
                className="w-full bg-black/80 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-neon-purple"
              />
              <button
                type="submit"
                disabled={!newColName.trim()}
                className="w-full py-1.5 rounded-xl bg-neon-purple/20 border border-neon-purple text-neon-purple text-xs font-bold hover:bg-neon-purple hover:text-black transition-all flex items-center justify-center gap-1 disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5" /> Create Collection
              </button>
            </form>

            {/* Existing Collections */}
            <div className="space-y-1.5">
              {collections.map((col) => (
                <div
                  key={col.id}
                  onClick={() => setSelectedColId(col.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedColId === col.id
                      ? "bg-neon-purple/20 border-neon-purple text-white font-bold"
                      : "bg-neutral-900/60 border-white/10 text-gray-400 hover:text-white"
                  }`}
                >
                  <div className="space-y-0.5 truncate">
                    <h3 className="text-xs truncate">{col.name}</h3>
                    <p className="text-[10px] text-gray-500 font-mono">
                      {col.assetIds.length} Assets • {col.folders.length} Folders
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteCollection(col.id);
                    }}
                    className="p-1 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: SELECTED COLLECTION DETAILS & FOLDERS */}
          <div className="lg:col-span-7 space-y-4">
            {activeCollection ? (
              <div className="space-y-4">
                <div className="p-4 bg-neutral-900 border border-white/10 rounded-2xl space-y-1">
                  <span className="text-[10px] text-neon-cyan font-bold uppercase">Active Vault</span>
                  <h3 className="font-display font-bold text-base text-white">
                    {activeCollection.name}
                  </h3>
                  <p className="text-xs text-gray-400">{activeCollection.description || "No description provided."}</p>
                </div>

                {/* Sub-Folders Creator */}
                <form onSubmit={handleCreateFolder} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="New sub-folder name (e.g. /Logos)..."
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    className="flex-1 bg-neutral-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-neon-cyan"
                  />
                  <button
                    type="submit"
                    disabled={!newFolderName.trim()}
                    className="px-4 py-1.5 rounded-xl bg-neon-cyan text-black font-bold text-xs hover:bg-neon-cyan/80 transition-colors disabled:opacity-50"
                  >
                    Add Folder
                  </button>
                </form>

                {/* Folder List */}
                <div className="space-y-2">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block">
                    Collection Folders Tree
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {activeCollection.folders.map((folder) => (
                      <div
                        key={folder}
                        className="p-3 rounded-xl bg-neutral-900 border border-white/10 flex items-center gap-2 text-xs text-gray-300"
                      >
                        <Folder className="w-4 h-4 text-neon-cyan shrink-0" />
                        <span className="truncate">{folder}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500 font-mono text-xs">
                Select or create a collection to view folders and assets.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

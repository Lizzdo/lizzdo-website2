import React, { useState, useEffect } from "react";
import { useStudio } from "../../../context/StudioContext";
import { StudioFolder } from "../../../types/studio";
import { X, Folder, FolderPlus, Palette, Briefcase, BookOpen, ShoppingBag, Award, Target, Share2, Video, LayoutTemplate, Users, User, FileText, Check } from "lucide-react";

interface FolderManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  editFolder?: StudioFolder | null;
  defaultParentId?: string | null;
}

const COLOR_OPTIONS = [
  "#a855f7", // Neon Purple
  "#06b6d4", // Cyan
  "#ec4899", // Pink
  "#f59e0b", // Amber
  "#10b981", // Emerald
  "#3b82f6", // Blue
  "#f43f5e", // Rose
  "#8b5cf6", // Violet
  "#14b8a6", // Teal
  "#6b7280", // Gray
];

const ICON_OPTIONS = [
  { name: "Folder", icon: Folder },
  { name: "Briefcase", icon: Briefcase },
  { name: "BookOpen", icon: BookOpen },
  { name: "ShoppingBag", icon: ShoppingBag },
  { name: "Award", icon: Award },
  { name: "Target", icon: Target },
  { name: "Share2", icon: Share2 },
  { name: "Video", icon: Video },
  { name: "LayoutTemplate", icon: LayoutTemplate },
  { name: "Users", icon: Users },
  { name: "User", icon: User },
  { name: "FileText", icon: FileText },
];

export function FolderManagementModal({
  isOpen,
  onClose,
  editFolder,
  defaultParentId = null,
}: FolderManagementModalProps) {
  const { folders, createFolder, updateFolder } = useStudio();

  const [folderName, setFolderName] = useState("");
  const [parentId, setParentId] = useState<string | null>(defaultParentId);
  const [selectedColor, setSelectedColor] = useState("#a855f7");
  const [selectedIcon, setSelectedIcon] = useState("Folder");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (editFolder) {
      setFolderName(editFolder.name);
      setParentId(editFolder.parentId || null);
      setSelectedColor(editFolder.color || "#a855f7");
      setSelectedIcon(editFolder.icon || "Folder");
      setDescription(editFolder.description || "");
    } else {
      setFolderName("");
      setParentId(defaultParentId);
      setSelectedColor("#a855f7");
      setSelectedIcon("Folder");
      setDescription("");
    }
  }, [editFolder, defaultParentId, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) return;

    if (editFolder) {
      updateFolder(editFolder.id, {
        name: folderName.trim(),
        parentId,
        color: selectedColor,
        icon: selectedIcon,
        description: description.trim(),
      });
    } else {
      createFolder(folderName.trim(), parentId, selectedColor, selectedIcon, description.trim());
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans text-white">
      <div className="w-full max-w-md bg-neutral-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* MODAL HEADER */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-lg"
              style={{ backgroundColor: selectedColor }}
            >
              <FolderPlus className="w-4 h-4" />
            </div>
            <h3 className="font-display font-bold text-sm text-white">
              {editFolder ? "Edit Folder Details" : "Create Workspace Folder"}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* MODAL FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 font-mono text-xs">
          {/* FOLDER NAME */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-gray-400">Folder Name</label>
            <input
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="e.g., Q3 Social Media Campaigns"
              required
              className="w-full bg-neutral-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:border-neon-purple focus:outline-none"
            />
          </div>

          {/* PARENT FOLDER SELECTOR */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-gray-400">Parent Directory</label>
            <select
              value={parentId || ""}
              onChange={(e) => setParentId(e.target.value || null)}
              className="w-full bg-neutral-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
            >
              <option value="">Root (Top Level Workspace)</option>
              {folders
                .filter((f) => !editFolder || f.id !== editFolder.id)
                .map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
            </select>
          </div>

          {/* COLOR PALETTE PICKER */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1">
              <Palette className="w-3 h-3 text-neon-purple" /> Color Label
            </label>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  className={`w-7 h-7 rounded-xl transition-all flex items-center justify-center ${
                    selectedColor === c ? "ring-2 ring-white scale-110 shadow-lg" : "hover:scale-105 opacity-80"
                  }`}
                  style={{ backgroundColor: c }}
                >
                  {selectedColor === c && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                </button>
              ))}
            </div>
          </div>

          {/* ICON SELECTOR */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-gray-400">Folder Icon</label>
            <div className="grid grid-cols-6 gap-2">
              {ICON_OPTIONS.map(({ name, icon: IconComp }) => (
                <button
                  type="button"
                  key={name}
                  onClick={() => setSelectedIcon(name)}
                  className={`p-2.5 rounded-xl border transition-all flex items-center justify-center ${
                    selectedIcon === name
                      ? "bg-white/15 border-neon-purple text-neon-purple"
                      : "bg-neutral-950 border-white/10 text-gray-400 hover:text-white"
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-gray-400">Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Organize assets and deliverables for this project category..."
              className="w-full h-16 bg-neutral-950 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none custom-scrollbar"
            />
          </div>

          {/* SUBMIT ACTIONS */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold text-xs"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-neon-purple to-neon-pink text-white font-bold text-xs shadow-lg hover:scale-105 transition-all"
            >
              {editFolder ? "Save Changes" : "Create Folder"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

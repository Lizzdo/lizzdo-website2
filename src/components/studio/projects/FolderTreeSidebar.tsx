import React, { useState } from "react";
import { useStudio } from "../../../context/StudioContext";
import { StudioFolder } from "../../../types/studio";
import {
  Folder,
  FolderPlus,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Star,
  Pin,
  Clock,
  Archive,
  Trash2,
  Plus,
  Upload,
  Download,
  MoreVertical,
  Edit2,
  Copy,
  Layers,
  HardDrive,
  Briefcase,
  ShoppingBag,
  Users,
  Target,
  Share2,
  BookOpen,
  Video,
  LayoutTemplate,
  Award,
  User,
  FileText,
  Sparkles,
} from "lucide-react";

interface FolderTreeSidebarProps {
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedFolderId: string | null;
  setSelectedFolderId: (folderId: string | null) => void;
  onOpenCreateFolderModal: (parentId?: string | null) => void;
  onOpenEditFolderModal: (folder: StudioFolder) => void;
  onOpenImportModal: () => void;
  onExportBackup: () => void;
}

export function FolderTreeSidebar({
  selectedCategory,
  setSelectedCategory,
  selectedFolderId,
  setSelectedFolderId,
  onOpenCreateFolderModal,
  onOpenEditFolderModal,
  onOpenImportModal,
  onExportBackup,
}: FolderTreeSidebarProps) {
  const {
    projects,
    folders,
    deleteFolder,
    toggleFavoriteFolder,
    duplicateFolder,
    storageUsage,
    emptyRecycleBin,
  } = useStudio();

  const [expandedFolderIds, setExpandedFolderIds] = useState<Record<string, boolean>>({
    "folder-social": true,
    "folder-branding": true,
  });

  const [activeMenuFolderId, setActiveMenuFolderId] = useState<string | null>(null);

  const toggleExpand = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedFolderIds((prev) => ({ ...prev, [folderId]: !prev[folderId] }));
  };

  // Icon mapping helper
  const renderFolderIcon = (iconName?: string, color = "#a855f7") => {
    const style = { color };
    switch (iconName) {
      case "Briefcase":
        return <Briefcase className="w-3.5 h-3.5 shrink-0" style={style} />;
      case "BookOpen":
        return <BookOpen className="w-3.5 h-3.5 shrink-0" style={style} />;
      case "ShoppingBag":
        return <ShoppingBag className="w-3.5 h-3.5 shrink-0" style={style} />;
      case "Award":
        return <Award className="w-3.5 h-3.5 shrink-0" style={style} />;
      case "Target":
        return <Target className="w-3.5 h-3.5 shrink-0" style={style} />;
      case "Share2":
        return <Share2 className="w-3.5 h-3.5 shrink-0" style={style} />;
      case "Video":
        return <Video className="w-3.5 h-3.5 shrink-0" style={style} />;
      case "LayoutTemplate":
        return <LayoutTemplate className="w-3.5 h-3.5 shrink-0" style={style} />;
      case "Users":
        return <Users className="w-3.5 h-3.5 shrink-0" style={style} />;
      case "User":
        return <User className="w-3.5 h-3.5 shrink-0" style={style} />;
      case "FileText":
        return <FileText className="w-3.5 h-3.5 shrink-0" style={style} />;
      case "Archive":
        return <Archive className="w-3.5 h-3.5 shrink-0" style={style} />;
      default:
        return <Folder className="w-3.5 h-3.5 shrink-0" style={style} />;
    }
  };

  // Counts
  const activeProjects = projects.filter((p) => !p.isDeleted);
  const totalActiveCount = activeProjects.length;
  const starredCount = activeProjects.filter((p) => p.favorite).length;
  const pinnedCount = activeProjects.filter((p) => p.isPinned).length;
  const archivedCount = activeProjects.filter((p) => p.status === "archived").length;
  const trashCount = projects.filter((p) => p.isDeleted).length;

  // Render tree recursively
  const renderFolderItems = (parentId: string | null = null, depth = 0) => {
    const levelFolders = folders.filter((f) => (parentId === null ? !f.parentId : f.parentId === parentId));

    if (levelFolders.length === 0) return null;

    return (
      <div className="space-y-0.5">
        {levelFolders.map((folder) => {
          const isExpanded = !!expandedFolderIds[folder.id];
          const isSelected = selectedCategory === "folder" && selectedFolderId === folder.id;
          const subFolders = folders.filter((f) => f.parentId === folder.id);
          const hasSubs = subFolders.length > 0;

          // Count projects in this folder
          const folderProjCount = activeProjects.filter(
            (p) => p.folderId === folder.id || p.folder?.toLowerCase() === folder.name.toLowerCase()
          ).length;

          return (
            <div key={folder.id} className="select-none">
              <div
                onClick={() => {
                  setSelectedCategory("folder");
                  setSelectedFolderId(folder.id);
                }}
                className={`group relative flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-mono cursor-pointer transition-all ${
                  isSelected
                    ? "bg-neon-purple/20 text-white font-bold border border-neon-purple/40 shadow-[0_0_12px_rgba(168,85,247,0.2)]"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
                style={{ paddingLeft: `${12 + depth * 14}px` }}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {hasSubs ? (
                    <button
                      type="button"
                      onClick={(e) => toggleExpand(folder.id, e)}
                      className="p-0.5 text-gray-400 hover:text-white transition-colors"
                    >
                      {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    </button>
                  ) : (
                    <span className="w-3" />
                  )}

                  {renderFolderIcon(folder.icon, folder.color || "#a855f7")}

                  <span className="truncate text-xs">{folder.name}</span>
                </div>

                <div className="flex items-center gap-1">
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono ${
                      isSelected ? "bg-neon-purple text-white" : "bg-white/10 text-gray-400 group-hover:text-white"
                    }`}
                  >
                    {folderProjCount}
                  </span>

                  {/* FOLDER CONTEXT MENU TRIGGER */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuFolderId(activeMenuFolderId === folder.id ? null : folder.id);
                      }}
                      className="p-1 opacity-0 group-hover:opacity-100 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                    >
                      <MoreVertical className="w-3 h-3" />
                    </button>

                    {activeMenuFolderId === folder.id && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 top-6 w-44 rounded-xl bg-neutral-900 border border-white/10 shadow-2xl p-1 z-50 text-xs font-mono space-y-0.5"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuFolderId(null);
                            onOpenCreateFolderModal(folder.id);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-white flex items-center gap-2"
                        >
                          <FolderPlus className="w-3.5 h-3.5 text-neon-purple" /> Add Subfolder
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuFolderId(null);
                            onOpenEditFolderModal(folder);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-gray-300 flex items-center gap-2"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-cyan-400" /> Edit Folder
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuFolderId(null);
                            toggleFavoriteFolder(folder.id);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-gray-300 flex items-center gap-2"
                        >
                          <Star className={`w-3.5 h-3.5 ${folder.favorite ? "text-amber-400 fill-amber-400" : "text-gray-400"}`} />
                          {folder.favorite ? "Unstar" : "Star Folder"}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuFolderId(null);
                            duplicateFolder(folder.id);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-gray-300 flex items-center gap-2"
                        >
                          <Copy className="w-3.5 h-3.5 text-amber-400" /> Duplicate
                        </button>

                        <div className="my-1 border-t border-white/10" />

                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuFolderId(null);
                            deleteFolder(folder.id, false);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-red-500/20 text-red-400 flex items-center gap-2"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-400" /> Delete Folder
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {hasSubs && isExpanded && renderFolderItems(folder.id, depth + 1)}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <aside className="w-64 bg-neutral-900 border-r border-white/10 p-4 flex flex-col justify-between space-y-6 shrink-0 custom-scrollbar overflow-y-auto font-sans select-none">
      <div className="space-y-6">
        {/* HEADER BRAND / TITLE */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center text-white font-black text-sm shadow-[0_0_15px_rgba(168,85,247,0.4)]">
              P
            </div>
            <div>
              <h2 className="font-display font-black text-xs text-white uppercase tracking-wider">
                Project Explorer
              </h2>
              <p className="text-[10px] text-gray-400 font-mono">Workspace Hub</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenCreateFolderModal(null)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-neon-purple/20 text-gray-300 hover:text-neon-purple transition-all border border-white/10"
            title="Create New Folder"
          >
            <FolderPlus className="w-4 h-4" />
          </button>
        </div>

        {/* QUICK VIEWS SECTION */}
        <div className="space-y-1 font-mono text-xs">
          <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500 px-2 block mb-1">
            Quick Views
          </span>

          <button
            type="button"
            onClick={() => {
              setSelectedCategory("all");
              setSelectedFolderId(null);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
              selectedCategory === "all"
                ? "bg-neon-purple/20 text-white font-bold border border-neon-purple/40 shadow-[0_0_12px_rgba(168,85,247,0.2)]"
                : "text-gray-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-neon-purple" /> All Projects
            </span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-bold">
              {totalActiveCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedCategory("starred");
              setSelectedFolderId(null);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
              selectedCategory === "starred"
                ? "bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40"
                : "text-gray-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400/30" /> Favorites
            </span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-bold">
              {starredCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedCategory("pinned");
              setSelectedFolderId(null);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
              selectedCategory === "pinned"
                ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40"
                : "text-gray-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span className="flex items-center gap-2">
              <Pin className="w-4 h-4 text-cyan-400" /> Pinned
            </span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-bold">
              {pinnedCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedCategory("recent");
              setSelectedFolderId(null);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
              selectedCategory === "recent"
                ? "bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40"
                : "text-gray-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" /> Recently Opened
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedCategory("archived");
              setSelectedFolderId(null);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
              selectedCategory === "archived"
                ? "bg-gray-500/20 text-gray-300 font-bold border border-gray-500/40"
                : "text-gray-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span className="flex items-center gap-2">
              <Archive className="w-4 h-4 text-gray-400" /> Archived
            </span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-bold">
              {archivedCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedCategory("trash");
              setSelectedFolderId(null);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
              selectedCategory === "trash"
                ? "bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40"
                : "text-gray-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span className="flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-rose-400" /> Recycle Bin
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                trashCount > 0 ? "bg-rose-500/30 text-rose-300" : "bg-white/10 text-gray-400"
              }`}
            >
              {trashCount}
            </span>
          </button>
        </div>

        {/* FOLDERS HIERARCHY SECTION */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <div className="flex items-center justify-between px-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">
              Folders Workspace
            </span>
            <button
              type="button"
              onClick={() => onOpenCreateFolderModal(null)}
              className="text-[10px] text-neon-purple hover:underline font-mono"
            >
              + Folder
            </button>
          </div>

          <div className="space-y-0.5">{renderFolderItems(null, 0)}</div>
        </div>
      </div>

      {/* STORAGE & BACKUP FOOTER WIDGET */}
      <div className="pt-4 border-t border-white/10 space-y-3 font-mono text-xs">
        <div className="p-3 rounded-2xl bg-black/60 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-gray-300">
            <span className="flex items-center gap-1.5 font-bold">
              <HardDrive className="w-3.5 h-3.5 text-cyan-400" /> Storage
            </span>
            <span className="text-gray-400 font-bold">{storageUsage.usedMB} MB</span>
          </div>

          <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink h-full rounded-full transition-all duration-500"
              style={{ width: `${storageUsage.percentage}%` }}
            />
          </div>
        </div>

        {/* UTILITY BUTTONS */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onOpenImportModal}
            className="px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white transition-all text-[10px] font-bold flex items-center justify-center gap-1"
          >
            <Upload className="w-3 h-3 text-cyan-400" /> Import
          </button>

          <button
            type="button"
            onClick={onExportBackup}
            className="px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white transition-all text-[10px] font-bold flex items-center justify-center gap-1"
          >
            <Download className="w-3 h-3 text-emerald-400" /> Backup
          </button>
        </div>
      </div>
    </aside>
  );
}

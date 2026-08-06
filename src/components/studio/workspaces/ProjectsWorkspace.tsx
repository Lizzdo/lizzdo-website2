import React, { useState, useMemo } from "react";
import { useStudio } from "../../../context/StudioContext";
import { StudioProject, StudioFolder } from "../../../types/studio";
import { STUDIO_TOOLS } from "../../../data/studioTools";
import { FolderTreeSidebar } from "../projects/FolderTreeSidebar";
import { ProjectInspectorDrawer } from "../projects/ProjectInspectorDrawer";
import { FolderManagementModal } from "../projects/FolderManagementModal";
import { PackageImportExportModal } from "../projects/PackageImportExportModal";
import { AutoSaveRecoveryBanner } from "../projects/AutoSaveRecoveryBanner";
import {
  Kanban,
  Search,
  Plus,
  Trash2,
  Copy,
  Clock,
  Palette,
  ExternalLink,
  Grid,
  List,
  Filter,
  ArrowUpDown,
  Star,
  Pin,
  Folder,
  FolderPlus,
  MoreVertical,
  RotateCcw,
  Sparkles,
  Info,
  Layers,
  Upload,
  Download,
  ShieldCheck,
} from "lucide-react";

export function ProjectsWorkspace() {
  const {
    projects,
    folders,
    openProject,
    createProject,
    deleteProject,
    duplicateProject,
    toggleFavoriteProject,
    togglePinProject,
    restoreProjectFromTrash,
    permanentlyDeleteProject,
    emptyRecycleBin,
  } = useStudio();

  // Navigation & Filtering state
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"updatedAt" | "createdAt" | "title" | "fileSize">("updatedAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Inspector & Modal States
  const [inspectedProject, setInspectedProject] = useState<StudioProject | null>(null);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<StudioFolder | null>(null);
  const [folderModalParentId, setFolderModalParentId] = useState<string | null>(null);
  const [isPkgModalOpen, setIsPkgModalOpen] = useState(false);
  const [pkgModalMode, setPkgModalMode] = useState<"import" | "export">("import");

  // Current folder instance if selected
  const activeFolder = folders.find((f) => f.id === selectedFolderId);

  // Filter projects according to category, folder, status, and search query
  const filteredProjects = useMemo(() => {
    let result = projects;

    if (selectedCategory === "trash") {
      result = result.filter((p) => p.isDeleted);
    } else {
      result = result.filter((p) => !p.isDeleted);

      if (selectedCategory === "starred") {
        result = result.filter((p) => p.favorite);
      } else if (selectedCategory === "pinned") {
        result = result.filter((p) => p.isPinned);
      } else if (selectedCategory === "archived") {
        result = result.filter((p) => p.status === "archived");
      } else if (selectedCategory === "recent") {
        // Last 48 hours or recent 10
        const cutoff = Date.now() - 86400000 * 2;
        result = result.filter((p) => new Date(p.updatedAt).getTime() > cutoff);
      } else if (selectedCategory === "folder" && selectedFolderId) {
        const targetF = folders.find((f) => f.id === selectedFolderId);
        result = result.filter(
          (p) => p.folderId === selectedFolderId || (targetF && p.folder?.toLowerCase() === targetF.name.toLowerCase())
        );
      }
    }

    // Status Filter
    if (statusFilter !== "all") {
      result = result.filter((p) => p.status === statusFilter);
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.toolId.toLowerCase().includes(q)
      );
    }

    // Sort
    return result.sort((a, b) => {
      let comp = 0;
      if (sortBy === "title") {
        comp = a.title.localeCompare(b.title);
      } else if (sortBy === "createdAt") {
        comp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === "fileSize") {
        comp = parseFloat(a.fileSize || "0") - parseFloat(b.fileSize || "0");
      } else {
        comp = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      }
      return sortOrder === "desc" ? -comp : comp;
    });
  }, [projects, selectedCategory, selectedFolderId, statusFilter, searchQuery, sortBy, sortOrder, folders]);

  // Subfolders list if in a folder view or root view
  const displayFolders = useMemo(() => {
    if (selectedCategory === "folder" && selectedFolderId) {
      return folders.filter((f) => f.parentId === selectedFolderId);
    }
    if (selectedCategory === "all") {
      return folders.filter((f) => !f.parentId);
    }
    return [];
  }, [folders, selectedCategory, selectedFolderId]);

  return (
    <div className="flex-1 flex h-full bg-black text-white font-sans overflow-hidden select-none">
      {/* LEFT FOLDER HIERARCHY SIDEBAR */}
      <FolderTreeSidebar
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedFolderId={selectedFolderId}
        setSelectedFolderId={setSelectedFolderId}
        onOpenCreateFolderModal={(parentId) => {
          setEditingFolder(null);
          setFolderModalParentId(parentId || null);
          setIsFolderModalOpen(true);
        }}
        onOpenEditFolderModal={(folder) => {
          setEditingFolder(folder);
          setIsFolderModalOpen(true);
        }}
        onOpenImportModal={() => {
          setPkgModalMode("import");
          setIsPkgModalOpen(true);
        }}
        onExportBackup={() => {
          setPkgModalMode("export");
          setIsPkgModalOpen(true);
        }}
      />

      {/* MAIN WORKSPACE CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full overflow-hidden custom-scrollbar">
        {/* AUTOSAVE RECOVERY HEADER BANNER */}
        <AutoSaveRecoveryBanner />

        <div className="flex-1 p-6 overflow-y-auto space-y-6 custom-scrollbar">
          {/* HEADER BANNER */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl bg-neutral-900 border border-white/10 shadow-2xl">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-purple/10 border border-neon-purple/30 text-neon-purple text-xs font-mono">
                <Kanban className="w-3.5 h-3.5" />
                <span>Project Manager V5</span>
              </div>
              <h1 className="font-display font-black text-2xl md:text-3xl tracking-wider text-white uppercase">
                {selectedCategory === "trash"
                  ? "Recycle Bin & Recovery Vault"
                  : activeFolder
                  ? `Folder: ${activeFolder.name}`
                  : selectedCategory === "starred"
                  ? "Starred Favorites"
                  : selectedCategory === "pinned"
                  ? "Pinned Projects"
                  : selectedCategory === "archived"
                  ? "Archived Projects"
                  : selectedCategory === "recent"
                  ? "Recently Opened"
                  : "All Creative Projects"}
              </h1>
              <p className="text-xs text-gray-400 font-mono">
                {activeFolder
                  ? activeFolder.description || `Managing projects inside "${activeFolder.name}" folder directory.`
                  : "Central repository for design, video, thumbnail, logo, and brand kit projects."}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {selectedCategory === "trash" ? (
                <button
                  type="button"
                  onClick={emptyRecycleBin}
                  className="px-4 py-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500/30 font-mono text-xs font-bold transition-all flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4 text-rose-400" /> Empty Recycle Bin
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setPkgModalMode("import");
                      setIsPkgModalOpen(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-200 font-mono text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <Upload className="w-4 h-4 text-cyan-400" /> Import
                  </button>

                  <button
                    type="button"
                    onClick={() => createProject("Untitled Studio Project", "designer", null, selectedFolderId || undefined)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-neon-purple to-neon-pink text-white font-display font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(168,85,247,0.6)] transition-all flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> New Project
                  </button>
                </>
              )}
            </div>
          </div>

          {/* SEARCH, FILTERS & SORTING TOOLBAR */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 font-mono text-xs">
            {/* SEARCH INPUT */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search projects by title, tag, or tool..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-900 border border-white/10 rounded-2xl px-4 py-2 Pl-10 pl-10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple font-mono"
              />
              <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* CONTROLS */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* STATUS FILTER */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none"
              >
                <option value="all">Status: All</option>
                <option value="draft">Drafts</option>
                <option value="in_progress">In Progress</option>
                <option value="exported">Exported</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>

              {/* SORT BY */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none"
              >
                <option value="updatedAt">Sort: Last Modified</option>
                <option value="createdAt">Sort: Created Date</option>
                <option value="title">Sort: Title A-Z</option>
                <option value="fileSize">Sort: File Size</option>
              </select>

              <button
                type="button"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="p-2 rounded-xl bg-neutral-900 border border-white/10 text-gray-400 hover:text-white"
                title="Toggle Sort Order"
              >
                <ArrowUpDown className="w-4 h-4" />
              </button>

              {/* VIEW MODE TOGGLE */}
              <div className="flex items-center bg-neutral-900 border border-white/10 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg transition-all ${
                    viewMode === "grid" ? "bg-neon-purple text-white shadow-md" : "text-gray-400 hover:text-white"
                  }`}
                  title="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-lg transition-all ${
                    viewMode === "list" ? "bg-neon-purple text-white shadow-md" : "text-gray-400 hover:text-white"
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* SUBFOLDERS ROW (IF ANY) */}
          {displayFolders.length > 0 && selectedCategory !== "trash" && (
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500 font-mono block">
                Workspace Folders ({displayFolders.length})
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 font-mono text-xs">
                {displayFolders.map((f) => {
                  const projsInF = projects.filter((p) => !p.isDeleted && (p.folderId === f.id || p.folder?.toLowerCase() === f.name.toLowerCase())).length;

                  return (
                    <div
                      key={f.id}
                      onClick={() => {
                        setSelectedCategory("folder");
                        setSelectedFolderId(f.id);
                      }}
                      className="p-3.5 rounded-2xl bg-neutral-900 border border-white/10 hover:border-neon-purple/50 transition-all cursor-pointer group flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md group-hover:scale-105 transition-transform"
                          style={{ backgroundColor: f.color || "#a855f7" }}
                        >
                          <Folder className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-white truncate group-hover:text-neon-purple transition-colors">
                            {f.name}
                          </h4>
                          <span className="text-[10px] text-gray-400">{projsInF} project(s)</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PROJECTS SECTION */}
          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500 block">
                Projects ({filteredProjects.length})
              </span>
            </div>

            {filteredProjects.length === 0 ? (
              <div className="p-12 text-center bg-neutral-900/60 rounded-3xl border border-white/10 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white/5 text-gray-500 mx-auto flex items-center justify-center">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-sm text-white">No matching projects found</h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  {selectedCategory === "trash"
                    ? "Your recycle bin is currently empty."
                    : "Try adjusting your search keywords, status filter, or create a new blank project."}
                </p>
                {selectedCategory !== "trash" && (
                  <button
                    type="button"
                    onClick={() => createProject("Untitled Studio Project", "designer")}
                    className="px-4 py-2 rounded-xl bg-neon-purple text-white font-bold text-xs shadow-lg inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Create Blank Project
                  </button>
                )}
              </div>
            ) : viewMode === "grid" ? (
              /* GRID VIEW */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProjects.map((proj) => {
                  const matchingTool = STUDIO_TOOLS.find((t) => t.id === proj.toolId);

                  return (
                    <div
                      key={proj.id}
                      onClick={() => setInspectedProject(proj)}
                      className={`rounded-2xl bg-neutral-900 border transition-all cursor-pointer group overflow-hidden flex flex-col justify-between shadow-lg ${
                        inspectedProject?.id === proj.id
                          ? "border-neon-purple shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                          : "border-white/10 hover:border-neon-purple/60"
                      }`}
                    >
                      {/* CARD PREVIEW HEADER */}
                      <div className="h-40 bg-neutral-950 relative flex items-center justify-center p-2 border-b border-white/5 overflow-hidden">
                        {proj.thumbnailUrl ? (
                          <img src={proj.thumbnailUrl} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        ) : (
                          <div className="text-center p-3 space-y-1">
                            <Palette className="w-8 h-8 text-neon-purple mx-auto group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] text-gray-500 block">{proj.width}x{proj.height}</span>
                          </div>
                        )}

                        {/* BADGES OVERLAY */}
                        <div className="absolute top-2 left-2 flex items-center gap-1.5 flex-wrap">
                          {matchingTool && (
                            <span className="px-2 py-0.5 rounded-full bg-black/80 border border-white/10 text-[9px] font-mono text-neon-purple font-bold">
                              {matchingTool.name}
                            </span>
                          )}

                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase ${
                              proj.status === "published"
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                                : proj.status === "exported"
                                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
                                : "bg-white/10 text-gray-300"
                            }`}
                          >
                            {proj.status.replace("_", " ")}
                          </span>
                        </div>

                        {/* PIN & STAR TOP ACTIONS */}
                        <div className="absolute top-2 right-2 flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavoriteProject(proj.id);
                            }}
                            className={`p-1.5 rounded-lg bg-black/60 hover:bg-black text-xs transition-all ${
                              proj.favorite ? "text-amber-400 fill-amber-400" : "text-gray-400 hover:text-white"
                            }`}
                          >
                            <Star className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePinProject(proj.id);
                            }}
                            className={`p-1.5 rounded-lg bg-black/60 hover:bg-black text-xs transition-all ${
                              proj.isPinned ? "text-cyan-400" : "text-gray-400 hover:text-white"
                            }`}
                          >
                            <Pin className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* CARD BODY */}
                      <div className="p-3.5 space-y-2.5">
                        <div>
                          <h3 className="font-bold text-white text-sm truncate group-hover:text-neon-purple transition-colors">
                            {proj.title}
                          </h3>
                          <p className="text-[10px] text-gray-400 truncate">
                            Folder: {proj.folder || "General"} • {proj.fileSize || "1.2 MB"}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-gray-500 pt-2 border-t border-white/5">
                          <span className="flex items-center gap-1 text-gray-400">
                            <Clock className="w-3 h-3 text-gray-500" />
                            {new Date(proj.updatedAt).toLocaleDateString()}
                          </span>

                          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => openProject(proj.id)}
                              className="px-2.5 py-1 rounded-lg bg-neon-purple/20 text-neon-purple font-bold text-[10px] hover:bg-neon-purple hover:text-white transition-all flex items-center gap-1"
                            >
                              Launch <ExternalLink className="w-3 h-3" />
                            </button>

                            <button
                              type="button"
                              onClick={() => duplicateProject(proj.id)}
                              className="p-1 hover:text-neon-purple text-gray-400"
                              title="Duplicate"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

                            {proj.isDeleted ? (
                              <button
                                type="button"
                                onClick={() => restoreProjectFromTrash(proj.id)}
                                className="p-1 hover:text-emerald-400 text-gray-400"
                                title="Restore"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => deleteProject(proj.id)}
                                className="p-1 hover:text-red-400 text-gray-400"
                                title="Trash"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* LIST VIEW */
              <div className="space-y-2">
                {filteredProjects.map((proj) => (
                  <div
                    key={proj.id}
                    onClick={() => setInspectedProject(proj)}
                    className={`p-3 rounded-2xl bg-neutral-900 border transition-all cursor-pointer flex items-center justify-between gap-4 hover:border-neon-purple/50 ${
                      inspectedProject?.id === proj.id ? "border-neon-purple bg-neutral-850" : "border-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-neutral-950 border border-white/10 flex items-center justify-center text-neon-purple shrink-0 font-bold">
                        <Palette className="w-5 h-5" />
                      </div>

                      <div className="min-w-0">
                        <h4 className="font-bold text-sm text-white truncate">{proj.title}</h4>
                        <p className="text-[10px] text-gray-400 font-mono">
                          {proj.toolId} • Folder: {proj.folder || "General"} • {proj.fileSize} • v{proj.version || "1.0.0"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 font-mono text-xs">
                      <span className="text-[11px] text-gray-400">
                        Updated {new Date(proj.updatedAt).toLocaleDateString()}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openProject(proj.id);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-neon-purple/20 text-neon-purple font-bold text-xs hover:bg-neon-purple hover:text-white transition-all flex items-center gap-1"
                      >
                        Open <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* INSPECTOR DRAWER */}
      <ProjectInspectorDrawer
        project={inspectedProject}
        onClose={() => setInspectedProject(null)}
      />

      {/* FOLDER CREATION / EDIT MODAL */}
      <FolderManagementModal
        isOpen={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        editFolder={editingFolder}
        defaultParentId={folderModalParentId}
      />

      {/* PACKAGE IMPORT / EXPORT MODAL */}
      <PackageImportExportModal
        isOpen={isPkgModalOpen}
        onClose={() => setIsPkgModalOpen(false)}
        initialMode={pkgModalMode}
      />
    </div>
  );
}

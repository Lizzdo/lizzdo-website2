import React, { useState, useRef, useEffect } from "react";
import { useStudio } from "../../context/StudioContext";
import { StudioProject, StudioProjectStatus } from "../../types/studio";
import { STUDIO_TOOLS } from "../../data/studioTools";
import {
  Palette,
  Clock,
  Copy,
  Trash2,
  Star,
  MoreVertical,
  ExternalLink,
  Edit2,
  FolderInput,
  Archive,
  Download,
  Share2,
  Check,
  Tag,
  Monitor,
  Sparkles,
  Video,
  FileText,
  Shield,
  Layers,
  ShoppingBag,
  Image as ImageIcon,
} from "lucide-react";

interface ProjectCardProps {
  project: StudioProject;
  onOpenRenameModal?: (project: StudioProject) => void;
  onOpenMoveModal?: (project: StudioProject) => void;
}

export function ProjectCard({ project, onOpenRenameModal, onOpenMoveModal }: ProjectCardProps) {
  const {
    openProject,
    duplicateProject,
    deleteProject,
    toggleFavoriteProject,
    updateProjectStatus,
    archiveProject,
    exportProject,
    shareProject,
    exportProjectJSON,
  } = useStudio();

  const [menuOpen, setMenuOpen] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const matchingTool = STUDIO_TOOLS.find((t) => t.id === project.toolId);

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
      setContextMenuPos(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenuPos({ x: e.clientX, y: e.clientY });
  };

  const getStatusBadge = (status?: StudioProjectStatus) => {
    switch (status) {
      case "in_progress":
        return { label: "In Progress", bg: "bg-amber-500/10 text-amber-400 border-amber-500/30" };
      case "exported":
        return { label: "Exported", bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" };
      case "published":
        return { label: "Published", bg: "bg-neon-purple/10 text-neon-purple border-neon-purple/30" };
      case "archived":
        return { label: "Archived", bg: "bg-gray-500/10 text-gray-400 border-gray-500/30" };
      case "draft":
      default:
        return { label: "Draft", bg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30" };
    }
  };

  const statusMeta = getStatusBadge(project.status);

  return (
    <div
      onContextMenu={handleContextMenu}
      onClick={() => openProject(project.id)}
      className="group relative rounded-2xl bg-neutral-900 border border-white/10 hover:border-neon-purple/60 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between shadow-xl hover:shadow-[0_0_25px_rgba(168,85,247,0.2)]"
    >
      {/* CARD TOP THUMBNAIL AREA */}
      <div className="h-44 bg-neutral-950 relative flex items-center justify-center p-4 border-b border-white/5 overflow-hidden">
        {project.thumbnailUrl ? (
          <img
            src={project.thumbnailUrl}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-center">
            <Palette className="w-10 h-10 text-neon-purple/80 group-hover:text-neon-purple group-hover:scale-110 transition-all" />
            <span className="text-[10px] text-gray-400 font-mono">
              {project.width} × {project.height} PX
            </span>
          </div>
        )}

        {/* OVERLAY ACTIONS ON HOVER */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openProject(project.id);
            }}
            className="px-3 py-1.5 rounded-lg bg-neon-purple text-white text-xs font-bold font-mono shadow-lg flex items-center gap-1 hover:bg-neon-pink transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Launch Editor
          </button>
        </div>

        {/* TOOL BADGE */}
        {matchingTool && (
          <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md border border-white/10 text-[9px] font-mono text-cyan-400 font-semibold flex items-center gap-1.5">
            <span>{matchingTool.name}</span>
          </span>
        )}

        {/* STAR FAVORITE BUTTON */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavoriteProject(project.id);
          }}
          className={`absolute top-2.5 right-2.5 p-1.5 rounded-md backdrop-blur-md border transition-all ${
            project.favorite
              ? "bg-amber-500/20 border-amber-500/50 text-amber-400"
              : "bg-black/60 border-white/10 text-gray-400 hover:text-white"
          }`}
          title={project.favorite ? "Starred" : "Star Project"}
        >
          <Star className={`w-3.5 h-3.5 ${project.favorite ? "fill-amber-400" : ""}`} />
        </button>

        {/* STATUS BADGE */}
        <span
          className={`absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-full border text-[9px] font-mono font-bold ${statusMeta.bg}`}
        >
          {statusMeta.label}
        </span>

        {/* PLATFORM / FILE SIZE BADGE */}
        <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 border border-white/10 text-[9px] font-mono text-gray-300">
          {project.platform || "Universal"} • {project.fileSize || "1.8 MB"}
        </span>
      </div>

      {/* CARD CONTENT */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-sm text-white truncate group-hover:text-neon-purple transition-colors">
              {project.title}
            </h3>

            {/* THREE DOTS MENU */}
            <div className="relative" ref={menuRef} onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-6 w-48 rounded-xl bg-neutral-900 border border-white/10 shadow-2xl p-1.5 z-50 text-xs font-mono space-y-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      openProject(project.id);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-white/10 text-white flex items-center gap-2"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-neon-purple" /> Open Editor
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      if (onOpenRenameModal) onOpenRenameModal(project);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-white/10 text-gray-300 flex items-center gap-2"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-cyan-400" /> Rename Title
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      duplicateProject(project.id);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-white/10 text-gray-300 flex items-center gap-2"
                  >
                    <Copy className="w-3.5 h-3.5 text-amber-400" /> Duplicate
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      exportProject(project.id);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-white/10 text-gray-300 flex items-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" /> Quick Export
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      exportProjectJSON(project.id);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-white/10 text-gray-300 flex items-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-400" /> Save JSON File
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      shareProject(project.id);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-white/10 text-gray-300 flex items-center gap-2"
                  >
                    <Share2 className="w-3.5 h-3.5 text-neon-pink" /> Copy Share Link
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      archiveProject(project.id);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-white/10 text-gray-300 flex items-center gap-2"
                  >
                    <Archive className="w-3.5 h-3.5 text-gray-400" />
                    {project.status === "archived" ? "Unarchive" : "Archive"}
                  </button>
                  <div className="my-1 border-t border-white/10" />
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      deleteProject(project.id);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-red-500/20 text-red-400 flex items-center gap-2"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-400" /> Delete Project
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* TAGS */}
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {project.tags.map((t, idx) => (
                <span
                  key={idx}
                  className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] text-gray-400 font-mono border border-white/5"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* CARD FOOTER */}
        <div className="flex items-center justify-between text-[10px] text-gray-500 pt-2 border-t border-white/5 font-mono">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-gray-500" />
            {new Date(project.updatedAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </span>

          <span className="text-gray-400">{project.folder || "General"}</span>
        </div>
      </div>

      {/* RIGHT CLICK CONTEXT MENU */}
      {contextMenuPos && (
        <div
          style={{ top: contextMenuPos.y, left: contextMenuPos.x }}
          className="fixed z-[999] w-48 rounded-xl bg-neutral-900 border border-white/10 shadow-2xl p-1.5 font-mono text-xs space-y-0.5"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => {
              setContextMenuPos(null);
              openProject(project.id);
            }}
            className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-white/10 text-white flex items-center gap-2"
          >
            <ExternalLink className="w-3.5 h-3.5 text-neon-purple" /> Open Workspace
          </button>
          <button
            type="button"
            onClick={() => {
              setContextMenuPos(null);
              duplicateProject(project.id);
            }}
            className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-white/10 text-gray-300 flex items-center gap-2"
          >
            <Copy className="w-3.5 h-3.5 text-amber-400" /> Duplicate
          </button>
          <button
            type="button"
            onClick={() => {
              setContextMenuPos(null);
              exportProject(project.id);
            }}
            className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-white/10 text-gray-300 flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" /> Export File
          </button>
          <button
            type="button"
            onClick={() => {
              setContextMenuPos(null);
              shareProject(project.id);
            }}
            className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-white/10 text-gray-300 flex items-center gap-2"
          >
            <Share2 className="w-3.5 h-3.5 text-neon-pink" /> Share Link
          </button>
          <button
            type="button"
            onClick={() => {
              setContextMenuPos(null);
              archiveProject(project.id);
            }}
            className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-white/10 text-gray-300 flex items-center gap-2"
          >
            <Archive className="w-3.5 h-3.5 text-gray-400" /> Archive
          </button>
          <div className="my-1 border-t border-white/10" />
          <button
            type="button"
            onClick={() => {
              setContextMenuPos(null);
              deleteProject(project.id);
            }}
            className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-red-500/20 text-red-400 flex items-center gap-2"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
        </div>
      )}
    </div>
  );
}

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Download,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Plus,
  Layers,
  FolderOpen,
  Save,
  Share2,
  Moon,
  Sun,
  LayoutGrid,
  Shield,
  Zap,
  ArrowLeft,
  ChevronDown,
  Check,
  FileCode,
  Wand2,
} from "lucide-react";
import { V2Project, WorkspaceConfig } from "../../types/designerV2";

interface DesignerV2HeaderProps {
  project: V2Project;
  workspace: WorkspaceConfig;
  onUpdateProject: (updater: (prev: V2Project) => V2Project) => void;
  onUpdateWorkspace: (updater: (prev: WorkspaceConfig) => WorkspaceConfig) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onOpenExportModal: () => void;
  onOpenPluginModal: () => void;
  onOpenImportModal: () => void;
  onOpenTemplateModal: () => void;
  onNewArtboard: () => void;
  onSaveProject: () => void;
}

export default function DesignerV2Header({
  project,
  workspace,
  onUpdateProject,
  onUpdateWorkspace,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onOpenExportModal,
  onOpenPluginModal,
  onOpenImportModal,
  onOpenTemplateModal,
  onNewArtboard,
  onSaveProject,
}: DesignerV2HeaderProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [projectTitle, setProjectTitle] = useState(project.title);
  const [showArtboardDropdown, setShowArtboardDropdown] = useState(false);

  const activeArtboard = project.artboards.find((a) => a.id === project.activeArtboardId) || project.artboards[0];

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (projectTitle.trim()) {
      onUpdateProject((prev) => ({
        ...prev,
        title: projectTitle.trim(),
      }));
    }
  };

  return (
    <header className="h-14 bg-black/95 backdrop-blur-xl border-b border-neon-cyan/20 px-4 flex items-center justify-between z-40 select-none text-white">
      {/* Left: Brand / Version Switcher / Project Title */}
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="flex items-center gap-2 group text-white/80 hover:text-neon-cyan transition-colors"
          title="Back to LIZZDO Studio"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-cyan/30 to-neon-purple/30 border border-neon-cyan/50 flex items-center justify-center font-display font-black text-neon-cyan text-sm group-hover:scale-105 transition-transform">
            L2
          </div>
        </Link>

        {/* Version Switcher Badge */}
        <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-0.5">
          <Link
            to="/designer"
            className="px-2.5 py-1 rounded-md text-[11px] font-mono text-gray-400 hover:text-white transition-colors"
            title="Switch to Designer V1 (Legacy)"
          >
            V1 Legacy
          </Link>

          <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-gradient-to-r from-neon-cyan to-neon-purple text-black flex items-center gap-1 shadow-[0_0_10px_rgba(0,245,255,0.4)]">
            <Zap className="w-3 h-3 fill-black" />
            V2 PRO
          </span>
        </div>

        <div className="h-5 w-[1px] bg-white/15" />

        {/* Project Title Editor */}
        {isEditingTitle ? (
          <input
            type="text"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyDown={(e) => e.key === "Enter" && handleTitleSubmit()}
            autoFocus
            className="bg-black/80 border border-neon-cyan text-white text-sm font-display px-2 py-1 rounded outline-none w-48"
          />
        ) : (
          <button
            onClick={() => setIsEditingTitle(true)}
            className="text-sm font-display font-bold tracking-wide hover:text-neon-cyan transition-colors flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/5"
            title="Click to rename project"
          >
            <span>{project.title}</span>
            <span className="text-[10px] font-mono text-neon-cyan/70 bg-neon-cyan/10 px-1.5 py-0.5 rounded">
              {project.artboards.length} {project.artboards.length === 1 ? "Artboard" : "Artboards"}
            </span>
          </button>
        )}

        {/* Active Artboard Selector */}
        <div className="relative">
          <button
            onClick={() => setShowArtboardDropdown(!showArtboardDropdown)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-gray-300"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-neon-cyan" />
            <span className="max-w-[120px] truncate">{activeArtboard?.title || "Artboard 1"}</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>

          {showArtboardDropdown && (
            <div className="absolute top-full left-0 mt-2 w-56 bg-black/95 border border-white/15 rounded-xl shadow-2xl p-2 z-50 backdrop-blur-2xl">
              <div className="text-[10px] font-mono uppercase tracking-wider text-gray-400 px-2 py-1 flex items-center justify-between">
                <span>Canvas Artboards</span>
                <button
                  onClick={() => {
                    setShowArtboardDropdown(false);
                    onNewArtboard();
                  }}
                  className="text-neon-cyan hover:underline flex items-center gap-1 text-[10px]"
                >
                  <Plus className="w-3 h-3" /> Add New
                </button>
              </div>

              <div className="space-y-1 max-h-48 overflow-y-auto my-1">
                {project.artboards.map((ab) => (
                  <button
                    key={ab.id}
                    onClick={() => {
                      onUpdateProject((prev) => ({
                        ...prev,
                        activeArtboardId: ab.id,
                      }));
                      setShowArtboardDropdown(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center justify-between transition-colors ${
                      ab.id === project.activeArtboardId
                        ? "bg-neon-cyan/20 border border-neon-cyan/40 text-neon-cyan font-bold"
                        : "hover:bg-white/5 text-gray-300"
                    }`}
                  >
                    <span className="truncate">{ab.title}</span>
                    <span className="text-[10px] text-gray-500">
                      {ab.width}x{ab.height}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Middle: Undo/Redo & Zoom & View Toggles */}
      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-2 py-1">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent text-gray-300 hover:text-white transition-colors"
          title="Undo (Ctrl+Z)"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={onRedo}
          disabled={!canRedo}
          className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent text-gray-300 hover:text-white transition-colors"
          title="Redo (Ctrl+Y)"
        >
          <RotateCw className="w-4 h-4" />
        </button>

        <div className="h-4 w-[1px] bg-white/15" />

        {/* Zoom Controls */}
        <button
          onClick={() =>
            onUpdateWorkspace((prev) => ({
              ...prev,
              zoom: Math.max(0.1, Number((prev.zoom - 0.1).toFixed(2))),
            }))
          }
          className="p-1.5 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <span
          onClick={() =>
            onUpdateWorkspace((prev) => ({
              ...prev,
              zoom: 1,
              panX: 0,
              panY: 0,
            }))
          }
          className="text-xs font-mono w-12 text-center text-neon-cyan cursor-pointer hover:underline"
          title="Reset Zoom to 100%"
        >
          {Math.round(workspace.zoom * 100)}%
        </span>

        <button
          onClick={() =>
            onUpdateWorkspace((prev) => ({
              ...prev,
              zoom: Math.min(5.0, Number((prev.zoom + 0.1).toFixed(2))),
            }))
          }
          className="p-1.5 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <button
          onClick={() =>
            onUpdateWorkspace((prev) => ({
              ...prev,
              zoom: 1,
              panX: 0,
              panY: 0,
            }))
          }
          className="p-1.5 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
          title="Fit Canvas Center"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        <div className="h-4 w-[1px] bg-white/15" />

        {/* Grid & Wireframe Overlay Toggles */}
        <button
          onClick={() =>
            onUpdateWorkspace((prev) => ({
              ...prev,
              showGrid: !prev.showGrid,
            }))
          }
          className={`p-1.5 rounded-lg transition-colors ${
            workspace.showGrid
              ? "bg-neon-cyan/20 text-neon-cyan"
              : "text-gray-400 hover:bg-white/10 hover:text-white"
          }`}
          title="Toggle Grid System"
        >
          <LayoutGrid className="w-4 h-4" />
        </button>

        <button
          onClick={() =>
            onUpdateWorkspace((prev) => ({
              ...prev,
              showWireframe: !prev.showWireframe,
            }))
          }
          className={`p-1.5 rounded-lg transition-colors ${
            workspace.showWireframe
              ? "bg-neon-purple/20 text-neon-purple"
              : "text-gray-400 hover:bg-white/10 hover:text-white"
          }`}
          title="Toggle Blueprint Wireframe Mode"
        >
          <FileCode className="w-4 h-4" />
        </button>
      </div>

      {/* Right: Actions, AI Plugins, Project Import/Export */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenTemplateModal}
          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono font-semibold text-gray-200 flex items-center gap-1.5 transition-colors"
        >
          <FolderOpen className="w-3.5 h-3.5 text-neon-cyan" />
          <span>Templates</span>
        </button>

        <button
          onClick={onOpenImportModal}
          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono font-semibold text-gray-200 flex items-center gap-1.5 transition-colors"
          title="Open or Convert V1 Projects"
        >
          <RotateCcw className="w-3.5 h-3.5 text-neon-purple" />
          <span>Import V1</span>
        </button>

        <button
          onClick={onSaveProject}
          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono font-semibold text-gray-200 flex items-center gap-1.5 transition-colors"
          title="Save Project to Local Storage & File"
        >
          <Save className="w-3.5 h-3.5 text-neon-cyan" />
          <span>Save</span>
        </button>

        <button
          onClick={onOpenPluginModal}
          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-neon-purple/30 to-neon-pink/30 hover:from-neon-purple/50 hover:to-neon-pink/50 border border-neon-purple/50 text-xs font-mono font-bold text-white flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(168,85,247,0.3)]"
        >
          <Wand2 className="w-3.5 h-3.5 text-neon-pink animate-pulse" />
          <span>AI Assistant</span>
        </button>

        <button
          onClick={onOpenExportModal}
          className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-neon-cyan to-neon-purple hover:from-neon-cyan/90 hover:to-neon-purple/90 text-black font-display font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(0,245,255,0.4)]"
        >
          <Download className="w-4 h-4 fill-black" />
          <span>Export Pro</span>
        </button>
      </div>
    </header>
  );
}

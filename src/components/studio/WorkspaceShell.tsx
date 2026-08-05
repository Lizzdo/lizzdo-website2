import React, { useState } from "react";
import { useStudio } from "../../context/StudioContext";
import { StudioToolId } from "../../types/studio";
import {
  Layers,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Undo2,
  Redo2,
  Grid,
  Save,
  Download,
  Share2,
  Check,
  CheckCircle2,
  Zap,
  Sparkles,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  HelpCircle,
  Eye,
  Lock,
  Copy,
  Trash2,
} from "lucide-react";

export interface WorkspaceShellProps {
  title: string;
  subtitle?: string;
  toolId?: StudioToolId;
  icon?: React.ComponentType<{ className?: string }>;
  badgeText?: string;

  // Custom Toolbar Actions
  topActions?: React.ReactNode;

  // Left Tool Panel
  leftPanel?: React.ReactNode;
  leftPanelTitle?: string;
  defaultLeftOpen?: boolean;

  // Right Properties Panel
  rightPanel?: React.ReactNode;
  rightPanelTitle?: string;
  defaultRightOpen?: boolean;

  // Status Bar Metrics
  dimensionsText?: string;
  statusMessage?: string;

  // Center Working Area
  children: React.ReactNode;
}

export function WorkspaceShell({
  title,
  subtitle = "Lizzdo Studio Creative Engine",
  toolId,
  icon: IconComponent = Layers,
  badgeText = "STUDIO V3 OS",
  topActions,
  leftPanel,
  leftPanelTitle = "Tools & Assets",
  defaultLeftOpen = true,
  rightPanel,
  rightPanelTitle = "Inspector & Properties",
  defaultRightOpen = true,
  dimensionsText = "1920 x 1080 PX",
  statusMessage = "AUTOSAVE ACTIVE",
  children,
}: WorkspaceShellProps) {
  const {
    currentProject,
    setIsSearchOpen,
    setIsQuickActionOpen,
    setIsNotificationOpen,
    addNotification,
  } = useStudio();

  // Panel Collapsible States
  const [isLeftOpen, setIsLeftOpen] = useState(defaultLeftOpen);
  const [isRightOpen, setIsRightOpen] = useState(defaultRightOpen);

  // Canvas Viewport Controls
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [isSaved, setIsSaved] = useState(true);

  // Zoom Helpers
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 10, 25));
  const handleZoomReset = () => setZoomLevel(100);

  const handleManualSave = () => {
    setIsSaved(true);
    addNotification("Project Saved", `Persisted changes for "${currentProject?.title || title}"`, "success");
  };

  const handleExport = () => {
    addNotification("Export Started", `Processing high-resolution render for "${title}"`, "info");
  };

  return (
    <div className="flex-1 w-full h-full bg-black text-white flex flex-col overflow-hidden font-sans select-none relative">
      {/* 1. TOP TOOLBAR */}
      <header className="h-14 bg-neutral-950 border-b border-white/10 px-4 flex items-center justify-between gap-2 shrink-0 z-20 font-mono text-xs">
        {/* Left Section: Tool Title & Info */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setIsLeftOpen(!isLeftOpen)}
            className="p-1.5 rounded-xl bg-neutral-900 border border-white/10 text-gray-400 hover:text-white hover:border-neon-cyan/50 transition-all flex items-center gap-1 shrink-0"
            title={isLeftOpen ? "Collapse Left Tool Panel" : "Expand Left Tool Panel"}
          >
            {isLeftOpen ? <PanelLeftClose className="w-4 h-4 text-neon-cyan" /> : <PanelLeftOpen className="w-4 h-4 text-neon-cyan" />}
          </button>

          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan shrink-0">
              <IconComponent className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-display font-bold text-xs text-white uppercase tracking-wider truncate">
                  {title}
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-[9px] font-bold shrink-0">
                  {badgeText}
                </span>
              </div>
              <p className="text-[10px] text-gray-400 truncate hidden md:block">{subtitle}</p>
            </div>
          </div>
        </div>

        {/* Center Section: View & History Controls */}
        <div className="hidden lg:flex items-center gap-1.5 bg-neutral-900 border border-white/10 rounded-2xl p-1 shrink-0">
          <button
            type="button"
            onClick={() => addNotification("Undo", "Action undone", "info")}
            className="p-1.5 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => addNotification("Redo", "Action redone", "info")}
            className="p-1.5 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-4 bg-white/10 my-auto mx-1" />

          {/* Grid Toggle */}
          <button
            type="button"
            onClick={() => setShowGrid(!showGrid)}
            className={`p-1.5 rounded-xl transition-all ${
              showGrid ? "bg-neon-cyan/20 text-neon-cyan font-bold" : "text-gray-400 hover:text-white"
            }`}
            title="Toggle Canvas Grid Overlay"
          >
            <Grid className="w-3.5 h-3.5" />
          </button>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1 px-2 text-[11px] text-gray-300">
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-1 hover:text-white text-gray-400"
              title="Zoom Out"
            >
              <ZoomOut className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={handleZoomReset}
              className="font-bold hover:text-neon-cyan transition-colors"
              title="Reset Zoom (100%)"
            >
              {zoomLevel}%
            </button>
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-1 hover:text-white text-gray-400"
              title="Zoom In"
            >
              <ZoomIn className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Right Section: Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {topActions}

          <button
            type="button"
            onClick={handleManualSave}
            className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-white/10 hover:border-emerald-500/50 text-gray-300 hover:text-white transition-all flex items-center gap-1.5"
            title="Save Project Changes"
          >
            <Save className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Save</span>
          </button>

          <button
            type="button"
            onClick={handleExport}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-bold hover:shadow-[0_0_15px_rgba(0,245,255,0.5)] transition-all flex items-center gap-1.5 uppercase"
            title="Export High-Res Canvas File"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button
            type="button"
            onClick={() => setIsRightOpen(!isRightOpen)}
            className="p-1.5 rounded-xl bg-neutral-900 border border-white/10 text-gray-400 hover:text-white hover:border-neon-purple/50 transition-all flex items-center gap-1"
            title={isRightOpen ? "Collapse Inspector Panel" : "Expand Inspector Panel"}
          >
            {isRightOpen ? <PanelRightClose className="w-4 h-4 text-neon-purple" /> : <PanelRightOpen className="w-4 h-4 text-neon-purple" />}
          </button>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE CONTAINER (LEFT PANEL + CENTER AREA + RIGHT PANEL) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* LEFT TOOL PANEL */}
        {isLeftOpen && (
          <aside className="w-72 sm:w-80 bg-neutral-950 border-r border-white/10 flex flex-col z-10 shrink-0 transition-all duration-200">
            {/* Left Panel Header */}
            <div className="h-10 px-4 border-b border-white/10 flex items-center justify-between font-mono text-xs text-gray-400 shrink-0 bg-neutral-900/50">
              <div className="flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-neon-cyan" />
                <span className="font-bold text-white uppercase">{leftPanelTitle}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsLeftOpen(false)}
                className="p-1 hover:text-white text-gray-500 rounded"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Left Panel Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 font-mono text-xs">
              {leftPanel || (
                <div className="space-y-4">
                  <div className="p-3 rounded-2xl bg-neutral-900 border border-white/10 space-y-2">
                    <span className="text-gray-400 font-bold block uppercase text-[10px]">Canvas Tools</span>
                    <p className="text-gray-500 text-[11px]">
                      Select tool parameters or add vector elements from the panel.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}

        {/* CENTER WORKING AREA */}
        <div className="flex-1 bg-neutral-900 relative flex flex-col overflow-hidden">
          {/* Subtle Canvas Dot Grid Background */}
          {showGrid && (
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(255, 255, 255, 0.25) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
          )}

          {/* Children Viewport Container */}
          <div
            className="flex-1 w-full h-full relative overflow-auto custom-scrollbar flex items-center justify-center p-4 transition-transform duration-100"
            style={{
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: "center center",
            }}
          >
            {children}
          </div>
        </div>

        {/* RIGHT PROPERTIES PANEL */}
        {isRightOpen && (
          <aside className="w-72 sm:w-80 bg-neutral-950 border-l border-white/10 flex flex-col z-10 shrink-0 transition-all duration-200">
            {/* Right Panel Header */}
            <div className="h-10 px-4 border-b border-white/10 flex items-center justify-between font-mono text-xs text-gray-400 shrink-0 bg-neutral-900/50">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-neon-purple" />
                <span className="font-bold text-white uppercase">{rightPanelTitle}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsRightOpen(false)}
                className="p-1 hover:text-white text-gray-500 rounded"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right Panel Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 font-mono text-xs">
              {rightPanel || (
                <div className="space-y-4">
                  {/* Canvas Size Settings */}
                  <div className="p-4 rounded-2xl bg-neutral-900 border border-white/10 space-y-3">
                    <span className="font-bold text-white block uppercase text-[10px] text-neon-purple">
                      Canvas Metrics
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-gray-300">
                      <div className="p-2 rounded-xl bg-black border border-white/10">
                        <span className="text-[9px] text-gray-500 block">WIDTH</span>
                        <span className="font-bold text-white">{dimensionsText.split("x")[0] || "1920"}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-black border border-white/10">
                        <span className="text-[9px] text-gray-500 block">HEIGHT</span>
                        <span className="font-bold text-white">{dimensionsText.split("x")[1] || "1080"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Export Options */}
                  <div className="p-4 rounded-2xl bg-neutral-900 border border-white/10 space-y-3">
                    <span className="font-bold text-white block uppercase text-[10px] text-neon-cyan">
                      Quick Export
                    </span>
                    <button
                      type="button"
                      onClick={handleExport}
                      className="w-full py-2 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan font-bold hover:bg-neon-cyan hover:text-black transition-all"
                    >
                      Download PNG 8K
                    </button>
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>

      {/* 3. BOTTOM STATUS BAR */}
      <footer className="h-8 bg-neutral-950 border-t border-white/10 px-4 flex items-center justify-between text-[10px] font-mono text-gray-400 shrink-0 z-20">
        {/* Status Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-white uppercase">{statusMessage}</span>
          </div>
          <span className="text-gray-600">|</span>
          <span className="text-gray-400 hidden sm:inline">{dimensionsText}</span>
        </div>

        {/* Keyboard Shortcuts Cheatsheet */}
        <div className="hidden lg:flex items-center gap-3 text-gray-500">
          <span><strong className="text-gray-300">Cmd+K</strong> Search</span>
          <span><strong className="text-gray-300">Cmd+J</strong> Quick Action</span>
          <span><strong className="text-gray-300">Space</strong> Pan</span>
          <span><strong className="text-gray-300">Ctrl+Z</strong> Undo</span>
        </div>

        {/* View Metrics */}
        <div className="flex items-center gap-3">
          <span className="text-neon-cyan font-bold">{zoomLevel}% ZOOM</span>
          <button
            type="button"
            onClick={() => setIsNotificationOpen(true)}
            className="hover:text-white transition-colors"
            title="Notification Log"
          >
            NOTIFICATIONS
          </button>
        </div>
      </footer>
    </div>
  );
}

// Alias export
export { WorkspaceShell as Workspace };

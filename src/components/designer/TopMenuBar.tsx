import React, { useState } from "react";
import { CanvasPreset } from "../../types/designer";
import { CANVAS_PRESETS } from "../../data/designerTemplates";
import {
  Sparkles,
  Download,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Undo2,
  Redo2,
  Save,
  CheckCircle2,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Sun,
  Moon,
  Search,
  ChevronDown,
  FileText,
  Layers,
  Image as ImageIcon,
  Type,
  Square,
  Shield,
  HelpCircle,
  Sliders,
  Grid,
  Eye,
  Plus,
  FolderOpen,
  Copy,
  Printer,
  Trash2,
  Sparkle,
} from "lucide-react";

interface Props {
  title: string;
  onTitleChange: (newTitle: string) => void;
  presetId: string;
  onPresetChange: (presetId: string) => void;
  zoomScale: number;
  onZoomChange: (zoom: number) => void;
  leftSidebarOpen: boolean;
  onToggleLeftSidebar: () => void;
  rightSidebarOpen: boolean;
  onToggleRightSidebar: () => void;
  onOpenExport: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  theme: "dark" | "light";
  onToggleTheme: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onAddElement: (type: any) => void;
  onToggleGrid?: () => void;
  onToggleGuides?: () => void;
  showGrid?: boolean;
  showGuides?: boolean;
}

export function TopMenuBar({
  title,
  onTitleChange,
  presetId,
  onPresetChange,
  zoomScale,
  onZoomChange,
  leftSidebarOpen,
  onToggleLeftSidebar,
  rightSidebarOpen,
  onToggleRightSidebar,
  onOpenExport,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  theme,
  onToggleTheme,
  isFullscreen,
  onToggleFullscreen,
  onAddElement,
  onToggleGrid,
  onToggleGuides,
  showGrid,
  showGuides,
}: Props) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const menuItems = [
    { id: "file", label: "File" },
    { id: "edit", label: "Edit" },
    { id: "view", label: "View" },
    { id: "insert", label: "Insert" },
    { id: "object", label: "Object" },
    { id: "text", label: "Text" },
    { id: "shapes", label: "Shapes" },
    { id: "frames", label: "Frames" },
    { id: "assets", label: "Assets" },
    { id: "templates", label: "Templates" },
    { id: "ai", label: "AI Tools" },
    { id: "plugins", label: "Plugins" },
    { id: "export", label: "Export" },
    { id: "help", label: "Help" },
  ];

  const activePreset = CANVAS_PRESETS.find((p) => p.id === presetId) || CANVAS_PRESETS[0];

  return (
    <div className="h-14 bg-neutral-900 border-b border-white/10 flex items-center justify-between px-3 text-xs font-sans select-none shrink-0 z-40 text-gray-200">
      {/* LEFT SECTION: BRAND + BACK TO WEBSITE + MAIN MENU BAR */}
      <div className="flex items-center gap-2.5 min-w-0">
        {/* Back to Website CTA */}
        <a
          href="/"
          className="px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/15 hover:bg-white/10 hover:border-neon-cyan/50 text-gray-300 hover:text-white transition-all text-xs font-mono flex items-center gap-1.5 shrink-0 group"
          title="Exit Designer & Return to Main Website"
        >
          <Sparkles className="w-3.5 h-3.5 text-neon-cyan group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline font-semibold">Back to Website</span>
        </a>

        {/* Project Title Input & Save Badge */}
        <div className="flex items-center gap-2 min-w-0">
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="bg-transparent border-b border-transparent hover:border-white/20 focus:border-neon-cyan font-display font-bold text-sm text-white focus:outline-none px-1 py-0.5 truncate max-w-[130px] sm:max-w-[200px]"
            title="Edit Project Title"
          />
          <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono shrink-0">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Auto Saved</span>
          </div>
        </div>

        {/* Top Dropdown Menu Items */}
        <div className="hidden xl:flex items-center gap-0.5 border-l border-white/10 pl-2">
          {menuItems.map((menu) => (
            <div key={menu.id} className="relative">
              <button
                type="button"
                onClick={() => setActiveMenu(activeMenu === menu.id ? null : menu.id)}
                className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                  activeMenu === menu.id
                    ? "bg-white/15 text-white font-bold"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {menu.label}
              </button>

              {/* DROPDOWN MENU MODAL */}
              {activeMenu === menu.id && (
                <div
                  className="absolute top-full left-0 mt-1 w-56 rounded-xl bg-neutral-900 border border-white/15 shadow-2xl py-1.5 z-50 text-xs font-mono space-y-0.5"
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  {menu.id === "file" && (
                    <>
                      <button
                        onClick={() => {
                          onOpenExport();
                          setActiveMenu(null);
                        }}
                        className="w-full px-3 py-1.5 text-left hover:bg-neon-cyan/20 hover:text-neon-cyan flex items-center justify-between"
                      >
                        <span>Export Graphic...</span>
                        <span className="text-[10px] text-gray-500">Ctrl+E</span>
                      </button>
                      <button
                        onClick={() => setActiveMenu(null)}
                        className="w-full px-3 py-1.5 text-left hover:bg-white/10 flex items-center justify-between"
                      >
                        <span>Save Local Copy</span>
                        <span className="text-[10px] text-gray-500">Ctrl+S</span>
                      </button>
                    </>
                  )}

                  {menu.id === "edit" && (
                    <>
                      <button
                        disabled={!canUndo}
                        onClick={() => {
                          onUndo();
                          setActiveMenu(null);
                        }}
                        className="w-full px-3 py-1.5 text-left hover:bg-white/10 flex items-center justify-between disabled:opacity-40"
                      >
                        <span>Undo</span>
                        <span className="text-[10px] text-gray-500">Ctrl+Z</span>
                      </button>
                      <button
                        disabled={!canRedo}
                        onClick={() => {
                          onRedo();
                          setActiveMenu(null);
                        }}
                        className="w-full px-3 py-1.5 text-left hover:bg-white/10 flex items-center justify-between disabled:opacity-40"
                      >
                        <span>Redo</span>
                        <span className="text-[10px] text-gray-500">Ctrl+Y</span>
                      </button>
                    </>
                  )}

                  {menu.id === "view" && (
                    <>
                      <button
                        onClick={() => {
                          onToggleGrid?.();
                          setActiveMenu(null);
                        }}
                        className="w-full px-3 py-1.5 text-left hover:bg-white/10 flex items-center justify-between"
                      >
                        <span>{showGrid ? "Hide Grid" : "Show Alignment Grid"}</span>
                        <span className="text-[10px] text-neon-cyan">{showGrid ? "ON" : "OFF"}</span>
                      </button>
                      <button
                        onClick={() => {
                          onToggleGuides?.();
                          setActiveMenu(null);
                        }}
                        className="w-full px-3 py-1.5 text-left hover:bg-white/10 flex items-center justify-between"
                      >
                        <span>{showGuides ? "Hide Safe Margins" : "Show Safe Margins"}</span>
                        <span className="text-[10px] text-neon-purple">{showGuides ? "ON" : "OFF"}</span>
                      </button>
                    </>
                  )}

                  {menu.id === "insert" && (
                    <>
                      <button
                        onClick={() => {
                          onAddElement("text");
                          setActiveMenu(null);
                        }}
                        className="w-full px-3 py-1.5 text-left hover:bg-white/10 flex items-center gap-2"
                      >
                        <Type className="w-3.5 h-3.5 text-neon-cyan" /> Text Box
                      </button>
                      <button
                        onClick={() => {
                          onAddElement("badge");
                          setActiveMenu(null);
                        }}
                        className="w-full px-3 py-1.5 text-left hover:bg-white/10 flex items-center gap-2"
                      >
                        <Shield className="w-3.5 h-3.5 text-neon-purple" /> Badge Tag
                      </button>
                      <button
                        onClick={() => {
                          onAddElement("shape");
                          setActiveMenu(null);
                        }}
                        className="w-full px-3 py-1.5 text-left hover:bg-white/10 flex items-center gap-2"
                      >
                        <Square className="w-3.5 h-3.5 text-neon-pink" /> Glass Shape
                      </button>
                    </>
                  )}

                  {menu.id === "export" && (
                    <>
                      <button
                        onClick={() => {
                          onOpenExport();
                          setActiveMenu(null);
                        }}
                        className="w-full px-3 py-1.5 text-left hover:bg-neon-cyan/20 hover:text-neon-cyan flex items-center gap-2 font-bold"
                      >
                        <Download className="w-3.5 h-3.5 text-neon-cyan" /> Export High-Res Graphic
                      </button>
                    </>
                  )}

                  {["object", "text", "shapes", "frames", "assets", "templates", "ai", "plugins", "help"].includes(menu.id) && (
                    <div className="px-3 py-2 text-gray-400 text-[11px] font-sans">
                      Click tools in left rail or open corresponding panels.
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CENTER SECTION: PLATFORM PRESET & ZOOM CONTROL */}
      <div className="flex items-center gap-2">
        {/* Left Sidebar Toggle Button */}
        <button
          type="button"
          onClick={onToggleLeftSidebar}
          className={`p-1.5 rounded-lg border transition-all flex items-center gap-1 ${
            leftSidebarOpen
              ? "bg-neon-cyan/20 border-neon-cyan/50 text-neon-cyan"
              : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
          }`}
          title="Toggle Left Tool Panel"
        >
          {leftSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
        </button>

        {/* Preset Canvas Format Dropdown */}
        <div className="relative">
          <select
            value={presetId}
            onChange={(e) => onPresetChange(e.target.value)}
            className="appearance-none bg-black/60 border border-white/15 rounded-xl px-3 py-1.5 pr-8 text-xs font-mono text-neon-cyan font-bold cursor-pointer hover:border-neon-cyan/50 focus:outline-none"
          >
            {CANVAS_PRESETS.map((p) => (
              <option key={p.id} value={p.id} className="bg-neutral-900 text-white">
                {p.platform}: {p.name} ({p.width}x{p.height})
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-neon-cyan absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Undo / Redo */}
        <div className="hidden sm:flex items-center gap-1 bg-black/40 border border-white/10 rounded-xl p-0.5">
          <button
            type="button"
            disabled={!canUndo}
            onClick={onUndo}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white disabled:opacity-30 hover:bg-white/10 transition-all"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            disabled={!canRedo}
            onClick={onRedo}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white disabled:opacity-30 hover:bg-white/10 transition-all"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 rounded-xl px-2 py-1 font-mono text-xs text-gray-300">
          <button
            type="button"
            onClick={() => onZoomChange(Math.max(0.3, zoomScale - 0.1))}
            className="hover:text-neon-cyan p-0.5"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="min-w-[40px] text-center font-bold text-neon-cyan">
            {Math.round(zoomScale * 100)}%
          </span>
          <button
            type="button"
            onClick={() => onZoomChange(Math.min(2.0, zoomScale + 0.1))}
            className="hover:text-neon-cyan p-0.5"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right Sidebar Toggle Button */}
        <button
          type="button"
          onClick={onToggleRightSidebar}
          className={`p-1.5 rounded-lg border transition-all flex items-center gap-1 ${
            rightSidebarOpen
              ? "bg-neon-purple/20 border-neon-purple/50 text-neon-purple"
              : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
          }`}
          title="Toggle Right Inspector Panel"
        >
          {rightSidebarOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
        </button>
      </div>

      {/* RIGHT SECTION: SEARCH + THEME + FULLSCREEN + EXPORT BUTTON */}
      <div className="flex items-center gap-2">
        {/* Fullscreen Toggle */}
        <button
          type="button"
          onClick={onToggleFullscreen}
          className="p-1.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all hidden sm:flex items-center justify-center"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Workspace"}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {/* Primary Export CTA */}
        <button
          type="button"
          onClick={onOpenExport}
          className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink text-white font-display font-bold text-xs tracking-wider uppercase hover:shadow-[0_0_20px_rgba(0,245,255,0.5)] transition-all flex items-center gap-2 shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
}

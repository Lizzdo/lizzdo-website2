import React, { useState, useRef, useEffect } from "react";
import { useStudio } from "../../context/StudioContext";
import { STUDIO_TOOLS } from "../../data/studioTools";
import { StudioToolId } from "../../types/studio";
import {
  Sparkles,
  Search,
  ChevronDown,
  Plus,
  Maximize2,
  Minimize2,
  Download,
  FolderOpen,
  LayoutDashboard,
  Palette,
  SlidersHorizontal,
  Wand2,
  Video,
  Image as ImageIcon,
  Shield,
  FolderGit2,
  FileText,
  ShoppingBag,
  Share2,
  Monitor,
  BookmarkCheck,
  Layers,
  LayoutTemplate,
  Shapes,
  Type,
  Bot,
  Kanban,
  Settings,
  Box,
  Film,
  Globe,
  FileSpreadsheet,
  CheckCircle2,
  Moon,
  Sun,
  X,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";

// MAP ICON STRINGS TO LUCIDE COMPONENTS
const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard,
  Palette,
  SlidersHorizontal,
  Wand2,
  Video,
  Sparkles,
  Image: ImageIcon,
  Shield,
  FolderGit2,
  FileText,
  ShoppingBag,
  Share2,
  Monitor,
  BookmarkCheck,
  Layers,
  LayoutTemplate,
  Shapes,
  Type,
  Bot,
  FolderOpen,
  Kanban,
  Settings,
  Box,
  Film,
  Globe,
  FileSpreadsheet,
};

export function StudioTopNav() {
  const {
    activeToolId,
    setActiveToolId,
    projects,
    currentProjectId,
    createProject,
  } = useStudio();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const menuRef = useRef<HTMLDivElement>(null);

  const activeTool = STUDIO_TOOLS.find((t) => t.id === activeToolId) || STUDIO_TOOLS[0];
  const activeProject = projects.find((p) => p.id === currentProjectId);

  // Close dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const filteredTools = STUDIO_TOOLS.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = [
    { id: "design", label: "Design Editors" },
    { id: "ai_media", label: "AI & Video Studio" },
    { id: "marketing", label: "Marketing & Growth" },
    { id: "resources", label: "Assets & Brand" },
    { id: "system", label: "System & Projects" },
    { id: "future", label: "Modular Expansion" },
  ];

  return (
    <header className="h-14 bg-neutral-950 border-b border-white/10 flex items-center justify-between px-3 text-xs select-none shrink-0 z-50 text-gray-200">
      {/* LEFT SECTION: BRAND + TOOL SWITCHER DROPDOWN */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Main Website Link / Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 group shrink-0"
          title="Back to Lizzdo Website"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-neon-cyan via-neon-purple to-neon-pink p-0.5 flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-black rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-neon-cyan group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="font-display font-black text-sm tracking-[2px] text-white leading-none">
              STUDIO<span className="text-neon-cyan">.LIZZDO</span>
            </span>
            <span className="text-[9px] font-mono text-gray-500 tracking-wider">
              CREATIVE SUITE V3
            </span>
          </div>
        </Link>

        {/* TOOL SWITCHER DROPDOWN BUTTON */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 border border-white/15 hover:border-neon-cyan/50 transition-all font-mono text-xs text-white group"
          >
            {activeTool && (
              <>
                {React.createElement(ICON_MAP[activeTool.iconName] || Palette, {
                  className: "w-4 h-4 text-neon-cyan",
                })}
                <span className="font-bold tracking-wide">{activeTool.name}</span>
                {activeTool.badge && (
                  <span className="px-1.5 py-0.2 rounded bg-neon-cyan/20 border border-neon-cyan/40 text-neon-cyan text-[9px] font-bold">
                    {activeTool.badge}
                  </span>
                )}
              </>
            )}
            <ChevronDown className={`w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-transform ${menuOpen ? "rotate-180" : ""}`} />
          </button>

          {/* ALL 22 TOOLS DROPDOWN MODAL */}
          {menuOpen && (
            <div className="absolute top-full left-0 mt-2 w-[340px] sm:w-[480px] max-h-[82vh] bg-neutral-900 border border-white/20 rounded-2xl shadow-2xl p-3 z-50 overflow-y-auto custom-scrollbar font-sans">
              {/* SEARCH TOOLS */}
              <div className="relative mb-3">
                <input
                  type="text"
                  placeholder="Search 22+ Lizzdo Studio tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-black/80 border border-white/15 rounded-xl px-3 py-2 pl-9 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan font-mono"
                />
                <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* TOOL CATEGORIES GRID */}
              <div className="space-y-4">
                {categories.map((cat) => {
                  const toolsInCat = filteredTools.filter((t) => t.category === cat.id);
                  if (toolsInCat.length === 0) return null;

                  return (
                    <div key={cat.id} className="space-y-1.5">
                      <div className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider px-1">
                        {cat.label}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {toolsInCat.map((tool) => {
                          const ToolIcon = ICON_MAP[tool.iconName] || Palette;
                          const isCurrent = activeToolId === tool.id;

                          return (
                            <button
                              key={tool.id}
                              type="button"
                              onClick={() => {
                                setActiveToolId(tool.id);
                                setMenuOpen(false);
                              }}
                              className={`p-2 rounded-xl border text-left transition-all flex items-start gap-2.5 group ${
                                isCurrent
                                  ? "bg-neon-cyan/20 border-neon-cyan text-white shadow-[0_0_12px_rgba(0,245,255,0.3)] font-bold"
                                  : "bg-black/40 border-white/5 hover:border-white/20 hover:bg-white/5 text-gray-300"
                              }`}
                            >
                              <ToolIcon className={`w-4 h-4 shrink-0 mt-0.5 ${isCurrent ? "text-neon-cyan" : "text-neon-purple group-hover:text-neon-cyan"}`} />
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-mono text-xs truncate font-medium text-white">
                                    {tool.name}
                                  </span>
                                  {tool.badge && (
                                    <span className="px-1 py-0.1 rounded bg-neon-purple/20 text-neon-purple text-[8px] font-mono font-bold shrink-0">
                                      {tool.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-gray-400 truncate leading-tight mt-0.5">
                                  {tool.description}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* QUICK TOOL SWITCHER PILLS (Desktop) */}
        <div className="hidden lg:flex items-center gap-1 border-l border-white/10 pl-3">
          {[
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            { id: "designer", label: "Designer", icon: Palette },
            { id: "ai-generator", label: "AI Generator", icon: Wand2 },
            { id: "video-editor", label: "Video", icon: Video },
            { id: "logo-creator", label: "Logo", icon: Shield },
            { id: "brand-kit", label: "Brand Kit", icon: BookmarkCheck },
            { id: "projects", label: "Projects", icon: Kanban },
          ].map((pill) => {
            const PillIcon = pill.icon;
            const isActive = activeToolId === pill.id;

            return (
              <button
                key={pill.id}
                type="button"
                onClick={() => setActiveToolId(pill.id as StudioToolId)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
                  isActive
                    ? "bg-white/15 text-neon-cyan font-bold border border-neon-cyan/40"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <PillIcon className="w-3.5 h-3.5" />
                <span>{pill.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT SECTION: ACTIVE PROJECT BADGE + NEW PROJECT + FULLSCREEN */}
      <div className="flex items-center gap-2 shrink-0">
        {/* ACTIVE PROJECT BADGE */}
        {activeProject && (
          <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-black/60 border border-white/10 text-xs font-mono">
            <span className="text-gray-500 uppercase text-[10px]">Project:</span>
            <span className="text-neon-cyan font-bold truncate max-w-[140px]">
              {activeProject.title}
            </span>
            <span title="Saved">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </span>
          </div>
        )}

        {/* NEW PROJECT QUICK CREATOR */}
        <button
          type="button"
          onClick={() => {
            createProject("Untitled Studio Graphic", activeToolId);
          }}
          className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/15 hover:border-neon-cyan text-gray-200 hover:text-white font-mono text-xs flex items-center gap-1.5 transition-all"
          title="Create New Project"
        >
          <Plus className="w-3.5 h-3.5 text-neon-cyan" />
          <span className="hidden sm:inline">New Project</span>
        </button>

        {/* FULLSCREEN WORKSPACE TOGGLE */}
        <button
          type="button"
          onClick={toggleFullscreen}
          className="p-1.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all hidden sm:flex items-center justify-center"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Workspace"}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {/* RETURN TO MAIN SITE LINK */}
        <Link
          to="/"
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink text-white font-display font-bold text-xs tracking-wider uppercase hover:shadow-[0_0_15px_rgba(0,245,255,0.5)] transition-all flex items-center gap-1.5 shrink-0"
        >
          <span>Exit Studio</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </header>
  );
}

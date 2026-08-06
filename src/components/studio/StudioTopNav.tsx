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
  Bell,
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
    setIsSearchOpen,
    setIsQuickActionOpen,
    setIsNotificationOpen,
    notifications,
  } = useStudio();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const menuRef = useRef<HTMLDivElement>(null);

  const activeTool = STUDIO_TOOLS.find((t) => t.id === activeToolId) || STUDIO_TOOLS[0];
  const activeProject = projects.find((p) => p.id === currentProjectId);

  const unreadCount = notifications.filter((n) => !n.read).length;

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
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-neon-purple via-neon-pink to-cyan-400 p-0.5 flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-black rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-neon-purple group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="font-display font-black text-sm tracking-[2px] text-white leading-none">
              STUDIO<span className="text-neon-purple">.LIZZDO</span>
            </span>
            <span className="text-[9px] font-mono text-gray-500 tracking-wider">
              CREATIVE OS V3
            </span>
          </div>
        </Link>

        {/* TOOL SWITCHER DROPDOWN BUTTON */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 border border-white/15 hover:border-neon-purple/50 transition-all font-mono text-xs text-white group"
          >
            {activeTool && (
              <>
                {React.createElement(ICON_MAP[activeTool.iconName] || Palette, {
                  className: "w-4 h-4 text-neon-purple",
                })}
                <span className="font-bold tracking-wide">{activeTool.name}</span>
                {activeTool.badge && (
                  <span className="px-1.5 py-0.2 rounded bg-neon-purple/20 border border-neon-purple/40 text-neon-purple text-[9px] font-bold">
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
                  className="w-full bg-black/80 border border-white/15 rounded-xl px-3 py-2 pl-9 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple font-mono"
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
                                  ? "bg-neon-purple/20 border-neon-purple text-white shadow-[0_0_12px_rgba(168,85,247,0.3)] font-bold"
                                  : "bg-black/40 border-white/5 hover:border-white/20 hover:bg-white/5 text-gray-300"
                              }`}
                            >
                              <ToolIcon className={`w-4 h-4 shrink-0 mt-0.5 ${isCurrent ? "text-neon-purple" : "text-neon-pink group-hover:text-neon-purple"}`} />
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

        {/* UNIVERSAL SEARCH TRIGGER BUTTON */}
        <button
          type="button"
          onClick={() => setIsSearchOpen(true)}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 hover:border-neon-purple text-gray-400 hover:text-white transition-all font-mono text-xs"
        >
          <Search className="w-3.5 h-3.5 text-neon-purple" />
          <span>Search studio...</span>
          <span className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] text-gray-300">⌘K</span>
        </button>
      </div>

      {/* RIGHT SECTION: ACTIONS, NOTIFICATIONS, SETTINGS */}
      <div className="flex items-center gap-2 shrink-0">
        {/* QUICK CREATION LAUNCHER */}
        <button
          type="button"
          onClick={() => setIsQuickActionOpen(true)}
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-neon-purple to-neon-pink text-white font-display font-bold text-xs tracking-wider uppercase hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Quick Action</span>
        </button>

        {/* NOTIFICATION DRAWER TRIGGER */}
        <button
          type="button"
          onClick={() => setIsNotificationOpen(true)}
          className="relative p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white transition-all"
          title="Notifications & Activity Logs"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-neon-purple text-white font-mono text-[9px] font-bold flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {/* THEME TOGGLE */}
        <button
          type="button"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all hidden sm:flex"
          title="Toggle Theme Mode"
        >
          {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
        </button>

        {/* FULLSCREEN WORKSPACE TOGGLE */}
        <button
          type="button"
          onClick={toggleFullscreen}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all hidden sm:flex"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Workspace"}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {/* SETTINGS LINK */}
        <button
          type="button"
          onClick={() => setActiveToolId("settings")}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all"
          title="Studio Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* RETURN TO MAIN SITE LINK */}
        <Link
          to="/"
          className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 font-mono text-xs flex items-center gap-1.5 transition-all shrink-0"
        >
          <span className="hidden md:inline">Exit Studio</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </header>
  );
}

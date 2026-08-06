import React from "react";
import { useStudio } from "../../context/StudioContext";
import { STUDIO_TOOLS } from "../../data/studioTools";
import { StudioToolId } from "../../types/studio";
import {
  LayoutDashboard,
  Kanban,
  BookmarkCheck,
  Layers,
  LayoutTemplate,
  Bot,
  Settings,
  ChevronLeft,
  ChevronRight,
  Pin,
  Palette,
  Video,
  Sparkles,
  Shield,
  FolderOpen,
  Wand2,
  HardDrive,
  Plus,
} from "lucide-react";

export function StudioSidebar() {
  const {
    activeToolId,
    setActiveToolId,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    isSidebarPinned,
    setIsSidebarPinned,
    createProject,
    setIsQuickActionOpen,
  } = useStudio();

  const mainNavItems = [
    { id: "dashboard" as StudioToolId, name: "Dashboard", icon: LayoutDashboard },
    { id: "projects" as StudioToolId, name: "Projects Hub", icon: Kanban },
    { id: "brand-kit" as StudioToolId, name: "Brand Kit", icon: BookmarkCheck },
    { id: "asset-library" as StudioToolId, name: "Asset Library", icon: Layers },
    { id: "templates" as StudioToolId, name: "Templates", icon: LayoutTemplate },
    { id: "ai-assistant" as StudioToolId, name: "AI Assistant", icon: Bot },
    { id: "settings" as StudioToolId, name: "Settings", icon: Settings },
  ];

  const quickToolSuites = [
    { id: "designer" as StudioToolId, name: "Designer", icon: Palette },
    { id: "video-editor" as StudioToolId, name: "Video Editor", icon: Video },
    { id: "ai-generator" as StudioToolId, name: "AI Generator", icon: Wand2 },
    { id: "thumbnail-creator" as StudioToolId, name: "Thumbnails", icon: Sparkles },
    { id: "logo-creator" as StudioToolId, name: "Logo Studio", icon: Shield },
  ];

  return (
    <aside
      className={`relative h-full bg-neutral-950 border-r border-white/10 flex flex-col justify-between transition-all duration-300 font-sans z-40 select-none ${
        isSidebarCollapsed ? "w-16" : "w-60"
      }`}
    >
      {/* TOGGLE PIN / COLLAPSE BAR */}
      <div className="p-3 border-b border-white/10 flex items-center justify-between">
        {!isSidebarCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-neon-purple animate-pulse" />
            <span className="font-display font-black text-xs uppercase tracking-widest text-white">
              Studio OS
            </span>
          </div>
        )}

        <div className="flex items-center gap-1 mx-auto sm:mx-0">
          {!isSidebarCollapsed && (
            <button
              type="button"
              onClick={() => setIsSidebarPinned(!isSidebarPinned)}
              className={`p-1.5 rounded-lg border transition-colors ${
                isSidebarPinned
                  ? "bg-neon-purple/20 border-neon-purple/50 text-neon-purple"
                  : "bg-white/5 border-white/10 text-gray-500 hover:text-white"
              }`}
              title={isSidebarPinned ? "Sidebar Pinned" : "Pin Sidebar"}
            >
              <Pin className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* QUICK LAUNCH BUTTON */}
      <div className="p-3">
        <button
          type="button"
          onClick={() => setIsQuickActionOpen(true)}
          className={`w-full py-2.5 rounded-xl bg-gradient-to-r from-neon-purple to-neon-pink text-white font-display font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all flex items-center justify-center gap-2 ${
            isSidebarCollapsed ? "px-0" : "px-4"
          }`}
          title="New Creation Action"
        >
          <Plus className="w-4 h-4 shrink-0" />
          {!isSidebarCollapsed && <span>New Creation</span>}
        </button>
      </div>

      {/* MAIN NAVIGATION ITEMS */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-2 space-y-6 py-2 font-mono text-xs">
        {/* WORKSPACE NAVIGATION */}
        <div className="space-y-1">
          {!isSidebarCollapsed && (
            <div className="px-3 py-1 text-[10px] text-gray-500 uppercase font-bold tracking-wider">
              Workspace
            </div>
          )}
          {mainNavItems.map((item) => {
            const IconComp = item.icon;
            const isActive = activeToolId === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveToolId(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  isActive
                    ? "bg-neon-purple text-white font-bold shadow-lg shadow-neon-purple/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                } ${isSidebarCollapsed ? "justify-center px-0" : ""}`}
                title={item.name}
              >
                <IconComp className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-gray-400"}`} />
                {!isSidebarCollapsed && <span className="truncate">{item.name}</span>}
              </button>
            );
          })}
        </div>

        {/* TOOL SUITES */}
        <div className="space-y-1">
          {!isSidebarCollapsed && (
            <div className="px-3 py-1 text-[10px] text-gray-500 uppercase font-bold tracking-wider">
              Creation Editors
            </div>
          )}
          {quickToolSuites.map((tool) => {
            const IconComp = tool.icon;
            const isActive = activeToolId === tool.id;

            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => setActiveToolId(tool.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  isActive
                    ? "bg-neon-pink text-white font-bold shadow-lg shadow-neon-pink/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                } ${isSidebarCollapsed ? "justify-center px-0" : ""}`}
                title={tool.name}
              >
                <IconComp className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-gray-400"}`} />
                {!isSidebarCollapsed && <span className="truncate">{tool.name}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* FOOTER USER STATUS */}
      {!isSidebarCollapsed && (
        <div className="p-3 border-t border-white/10 font-mono text-[11px] text-gray-400 flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="truncate">Studio.Lizzdo.com</span>
          </div>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white font-bold">
            PRO V3
          </span>
        </div>
      )}
    </aside>
  );
}

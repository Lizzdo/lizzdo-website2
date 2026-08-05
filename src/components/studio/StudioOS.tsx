import React, { useState, useEffect } from "react";
import { useStudio } from "../../context/StudioContext";
import { StudioTopNav } from "./StudioTopNav";

// Import all workspace views
import { DashboardWorkspace } from "./workspaces/DashboardWorkspace";
import { DesignerWorkspace } from "./workspaces/DesignerWorkspace";
import { AIGeneratorWorkspace } from "./workspaces/AIGeneratorWorkspace";
import { VideoEditorWorkspace } from "./workspaces/VideoEditorWorkspace";
import { LogoCreatorWorkspace } from "./workspaces/LogoCreatorWorkspace";
import { ThumbnailCreatorWorkspace } from "./workspaces/ThumbnailCreatorWorkspace";
import { BrandKitWorkspace } from "./workspaces/BrandKitWorkspace";
import { AssetLibraryWorkspace } from "./workspaces/AssetLibraryWorkspace";
import { TemplatesWorkspace } from "./workspaces/TemplatesWorkspace";
import { IconsWorkspace } from "./workspaces/IconsWorkspace";
import { FontsWorkspace } from "./workspaces/FontsWorkspace";
import { AIAssistantWorkspace } from "./workspaces/AIAssistantWorkspace";
import { FileManagerWorkspace } from "./workspaces/FileManagerWorkspace";
import { ProjectsWorkspace } from "./workspaces/ProjectsWorkspace";
import { ImageEditorWorkspace } from "./workspaces/ImageEditorWorkspace";
import { BannerCreatorWorkspace } from "./workspaces/BannerCreatorWorkspace";
import { MockupGeneratorWorkspace } from "./workspaces/MockupGeneratorWorkspace";
import { SettingsWorkspace } from "./workspaces/SettingsWorkspace";

import {
  Search,
  Zap,
  Bell,
  X,
  Plus,
  Upload,
  Sparkles,
  Layers,
  FileText,
  ShoppingBag,
  FolderOpen,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Info,
  Clock,
  Command,
} from "lucide-react";

export function StudioOS() {
  const {
    activeToolId,
    setActiveToolId,
    searchQuery,
    setSearchQuery,
    isSearchOpen,
    setIsSearchOpen,
    isQuickActionOpen,
    setIsQuickActionOpen,
    isNotificationOpen,
    setIsNotificationOpen,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    createProject,
    projects,
    openProject,
    sharedAssets,
    addNotification,
  } = useStudio();

  // Keyboard Shortcuts (Cmd+K for search, Cmd+J for quick action)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "j") {
        e.preventDefault();
        setIsQuickActionOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setIsSearchOpen, setIsQuickActionOpen]);

  // Render workspace depending on activeToolId
  const renderWorkspaceContent = () => {
    switch (activeToolId) {
      case "dashboard":
        return <DashboardWorkspace />;
      case "designer":
        return <DesignerWorkspace />;
      case "ai-generator":
        return <AIGeneratorWorkspace />;
      case "video-editor":
        return <VideoEditorWorkspace />;
      case "logo-creator":
        return <LogoCreatorWorkspace />;
      case "thumbnail-creator":
        return <ThumbnailCreatorWorkspace />;
      case "brand-kit":
        return <BrandKitWorkspace />;
      case "assets":
        return <AssetLibraryWorkspace />;
      case "templates":
        return <TemplatesWorkspace />;
      case "icons":
        return <IconsWorkspace />;
      case "fonts":
        return <FontsWorkspace />;
      case "ai-assistant":
        return <AIAssistantWorkspace />;
      case "files":
        return <FileManagerWorkspace />;
      case "projects":
        return <ProjectsWorkspace />;
      case "image-editor":
        return <ImageEditorWorkspace />;
      case "banner-creator":
        return <BannerCreatorWorkspace />;
      case "mockup-generator":
        return <MockupGeneratorWorkspace />;
      case "settings":
        return <SettingsWorkspace />;
      default:
        return <DashboardWorkspace />;
    }
  };

  // Search Results Filtering
  const searchResultsProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const searchResultsAssets = sharedAssets.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-screen bg-black text-white flex flex-col overflow-hidden font-sans select-none">
      {/* GLOBAL TOP NAV BAR */}
      <StudioTopNav />

      {/* ACTIVE WORKSPACE AREA */}
      <main className="flex-1 overflow-hidden relative flex flex-col bg-neutral-950">
        {renderWorkspaceContent()}
      </main>

      {/* GLOBAL SEARCH MODAL (CMD+K) */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-start justify-center pt-20 p-4">
          <div className="bg-neutral-900 border border-white/15 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col font-mono text-xs animate-in fade-in zoom-in-95 duration-200">
            {/* Search Input */}
            <div className="p-4 border-b border-white/10 flex items-center gap-3">
              <Search className="w-5 h-5 text-neon-cyan" />
              <input
                type="text"
                autoFocus
                placeholder="Universal Search across Projects, Assets, Templates, Icons, Fonts & Tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm text-white focus:outline-none placeholder-gray-500 font-sans"
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results */}
            <div className="p-4 max-h-[60vh] overflow-y-auto custom-scrollbar space-y-4">
              {/* Projects */}
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block mb-2">
                  Matching Saved Projects ({searchResultsProjects.length})
                </span>
                <div className="space-y-1">
                  {searchResultsProjects.slice(0, 5).map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        openProject(p.id);
                        setIsSearchOpen(false);
                      }}
                      className="p-3 rounded-xl bg-neutral-950 border border-white/5 hover:border-neon-cyan/50 hover:bg-neutral-800 transition-all cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-neon-cyan" />
                        <span className="font-bold text-white font-sans">{p.title}</span>
                      </div>
                      <span className="text-[10px] text-gray-500">{p.toolId}</span>
                    </div>
                  ))}
                  {searchResultsProjects.length === 0 && (
                    <span className="text-[11px] text-gray-500 italic">No matching projects found</span>
                  )}
                </div>
              </div>

              {/* Shared Assets */}
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block mb-2">
                  Matching Cloud Assets ({searchResultsAssets.length})
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {searchResultsAssets.slice(0, 4).map((a) => (
                    <div
                      key={a.id}
                      onClick={() => {
                        setActiveToolId("assets");
                        setIsSearchOpen(false);
                      }}
                      className="p-2 rounded-xl bg-neutral-950 border border-white/5 hover:border-neon-cyan/50 cursor-pointer flex items-center gap-2"
                    >
                      <img src={a.url} alt={a.name} className="w-8 h-8 object-cover rounded-lg" referrerPolicy="no-referrer" />
                      <span className="truncate text-gray-300 font-sans">{a.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QUICK ACTION LAUNCHER MODAL (CMD+J) */}
      {isQuickActionOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/15 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col font-mono text-xs">
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-neon-cyan animate-pulse" />
                <h2 className="font-display font-black text-sm text-white uppercase tracking-wider">
                  Quick Action Launcher
                </h2>
              </div>
              <button
                onClick={() => setIsQuickActionOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  label: "Create New Project",
                  desc: "Start blank canvas design",
                  icon: Plus,
                  action: () => {
                    createProject("New Blank Design", "designer");
                    setIsQuickActionOpen(false);
                  },
                },
                {
                  label: "Generate AI Graphic",
                  desc: "Text-to-Image AI generation",
                  icon: Sparkles,
                  action: () => {
                    setActiveToolId("ai-generator");
                    setIsQuickActionOpen(false);
                  },
                },
                {
                  label: "Upload Asset File",
                  desc: "Import images, fonts, vectors",
                  icon: Upload,
                  action: () => {
                    setActiveToolId("assets");
                    setIsQuickActionOpen(false);
                  },
                },
                {
                  label: "Design YouTube Thumbnail",
                  desc: "Click-boosting 1280x720 canvas",
                  icon: Layers,
                  action: () => {
                    setActiveToolId("thumbnail-creator");
                    setIsQuickActionOpen(false);
                  },
                },
                {
                  label: "Create Logo & Brand",
                  desc: "Vector logo studio suite",
                  icon: Sparkles,
                  action: () => {
                    setActiveToolId("logo-creator");
                    setIsQuickActionOpen(false);
                  },
                },
                {
                  label: "Open Video Editor Timeline",
                  desc: "Multi-track video studio",
                  icon: FolderOpen,
                  action: () => {
                    setActiveToolId("video-editor");
                    setIsQuickActionOpen(false);
                  },
                },
              ].map((act, i) => {
                const Icon = act.icon;
                return (
                  <button
                    key={i}
                    onClick={act.action}
                    className="p-4 rounded-2xl bg-neutral-950 border border-white/10 hover:border-neon-cyan/50 hover:bg-neutral-800 transition-all text-left group flex items-start gap-3"
                  >
                    <div className="p-2 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan group-hover:bg-neon-cyan group-hover:text-black transition-colors shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-white block font-sans text-xs">{act.label}</span>
                      <span className="text-[10px] text-gray-400">{act.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* NOTIFICATION DRAWER OVERLAY */}
      {isNotificationOpen && (
        <div className="fixed inset-y-0 right-0 w-80 sm:w-96 bg-neutral-950 border-l border-white/15 z-50 p-6 flex flex-col shadow-2xl font-mono text-xs">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-neon-cyan" />
              <h2 className="font-display font-bold text-sm text-white uppercase">Notification Center</h2>
            </div>
            <button
              onClick={() => setIsNotificationOpen(false)}
              className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar py-4 space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  n.read
                    ? "bg-neutral-900/50 border-white/5 opacity-60"
                    : "bg-neutral-900 border-neon-cyan/30"
                }`}
              >
                <div className="flex items-start gap-2">
                  {n.type === "success" && <CheckCircle2 className="w-4 h-4 text-neon-cyan shrink-0 mt-0.5" />}
                  {n.type === "error" && <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />}
                  {n.type === "info" && <Info className="w-4 h-4 text-neon-purple shrink-0 mt-0.5" />}
                  <div className="space-y-1 min-w-0">
                    <h4 className="font-bold text-white text-xs">{n.title}</h4>
                    <p className="text-[10px] text-gray-400 leading-normal">{n.message}</p>
                    <span className="text-[9px] text-gray-500 block">
                      {new Date(n.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {notifications.length === 0 && (
              <div className="text-center py-12 text-gray-500 italic">No notifications</div>
            )}
          </div>

          {notifications.length > 0 && (
            <button
              onClick={clearAllNotifications}
              className="w-full py-2 rounded-xl bg-neutral-900 border border-white/10 hover:bg-neutral-800 text-gray-400 hover:text-white transition-all text-[11px]"
            >
              Clear All Notifications
            </button>
          )}
        </div>
      )}
    </div>
  );
}

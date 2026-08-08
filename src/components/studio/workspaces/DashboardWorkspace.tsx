import React, { useState } from "react";
import { useStudio } from "../../../context/StudioContext";
import { ProjectCard } from "../ProjectCard";
import { QuickActionPanel } from "../QuickActionPanel";
import { ActivityTimeline } from "../ActivityTimeline";
import { StorageUsageWidget } from "../StorageUsageWidget";
import {
  Sparkles,
  Kanban,
  Search,
  Plus,
  Star,
  FileEdit,
  Download,
  Wand2,
  Filter,
  Grid,
  List,
  FolderPlus,
  LayoutDashboard,
  Zap,
} from "lucide-react";

export function DashboardWorkspace() {
  const {
    projects,
    setIsSearchOpen,
    setIsQuickActionOpen,
    createProject,
    openCreateProjectModal,
  } = useStudio();

  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Filter projects by Tab and Search
  const filteredProjects = projects.filter((p) => {
    // Search Query
    if (
      searchQuery &&
      !p.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !p.toolId.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Status Filter
    if (statusFilter !== "all" && p.status !== statusFilter) {
      return false;
    }

    // Tab Filters
    if (activeTab === "favorites") return p.favorite === true;
    if (activeTab === "drafts") return p.status === "draft";
    if (activeTab === "exported") return p.status === "exported";
    if (activeTab === "ai") return p.tags?.includes("ai") || p.toolId === "ai-generator";

    return true;
  });

  return (
    <div className="flex-1 bg-neutral-950 text-white overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8 space-y-8 font-sans select-none">
      {/* TOP COMMAND HERO BANNER */}
      <div className="relative rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-black border border-white/10 p-6 sm:p-8 overflow-hidden shadow-2xl space-y-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-neon-pink/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-purple/10 border border-neon-purple/30 text-neon-purple text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Studio.Lizzdo.com Creative Command Center</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-4xl tracking-wider text-white uppercase">
              Workspace & Projects
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 font-mono leading-relaxed">
              Unified creative dashboard for your graphics, videos, vector logos, YouTube thumbnails, and brand assets.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsQuickActionOpen(true)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-neon-purple via-neon-pink to-cyan-400 text-white font-display font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-all flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              <span>Quick Actions</span>
            </button>

            <button
              type="button"
              onClick={() => openCreateProjectModal("designer")}
              className="px-5 py-3 rounded-2xl bg-white/10 border border-white/20 hover:bg-white/20 text-white font-display font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Project</span>
            </button>
          </div>
        </div>
      </div>

      {/* QUICK ACTION 12 LAUNCHERS GRID */}
      <QuickActionPanel />

      {/* MAIN WORKSPACE CONTENT: GRID & SIDEBAR WIDGETS */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* LEFT 3 COLS: PROJECTS HUB */}
        <div className="lg:col-span-3 space-y-6">
          {/* BAR FILTERS & SEARCH */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            {/* TABS */}
            <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 text-xs font-mono">
              {[
                { id: "all", label: `All Projects (${projects.length})` },
                { id: "favorites", label: "Favorites", icon: Star },
                { id: "drafts", label: "Drafts", icon: FileEdit },
                { id: "exported", label: "Recently Exported", icon: Download },
                { id: "ai", label: "AI Generations", icon: Wand2 },
              ].map((tab) => {
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
                      activeTab === tab.id
                        ? "bg-neon-purple text-white font-bold shadow-lg shadow-neon-purple/20"
                        : "bg-neutral-900 border border-white/5 text-gray-400 hover:text-white"
                    }`}
                  >
                    {TabIcon && <TabIcon className="w-3.5 h-3.5" />}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* SEARCH + VIEW MODE */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-56">
                <input
                  type="text"
                  placeholder="Filter projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-1.5 pl-8 text-xs text-white placeholder-gray-500 font-mono focus:outline-none focus:border-neon-purple"
                />
                <Search className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>

              <div className="flex items-center p-1 rounded-xl bg-neutral-900 border border-white/10 shrink-0">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === "grid" ? "bg-white/15 text-white" : "text-gray-500 hover:text-white"
                  }`}
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === "list" ? "bg-white/15 text-white" : "text-gray-500 hover:text-white"
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* PROJECTS GRID */}
          {filteredProjects.length === 0 ? (
            <div className="py-16 text-center rounded-3xl bg-neutral-900 border border-white/10 space-y-3 font-mono text-xs">
              <Kanban className="w-10 h-10 text-neon-purple mx-auto animate-pulse" />
              <p className="text-gray-400">No projects found matching selected tab or filters.</p>
              <button
                type="button"
                onClick={() => openCreateProjectModal("designer")}
                className="px-4 py-2 rounded-xl bg-neon-purple text-white font-bold hover:bg-neon-purple/80 transition-colors inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Create New Project
              </button>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "space-y-3"
              }
            >
              {filteredProjects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COL: TIMELINE & STORAGE VAULT */}
        <div className="space-y-6">
          <StorageUsageWidget />
          <ActivityTimeline />
        </div>
      </div>
    </div>
  );
}

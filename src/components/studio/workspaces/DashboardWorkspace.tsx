import React, { useState } from "react";
import { useStudio } from "../../../context/StudioContext";
import { STUDIO_TOOLS } from "../../../data/studioTools";
import { StudioToolId } from "../../../types/studio";
import {
  LayoutDashboard,
  Palette,
  Wand2,
  Video,
  Shield,
  Sparkles,
  Share2,
  FolderOpen,
  Kanban,
  Plus,
  ArrowRight,
  Clock,
  Trash2,
  Copy,
  ExternalLink,
  Layers,
  HardDrive,
  Activity,
  Bot,
  Search,
  BookmarkCheck,
  Shapes,
  Type,
  SlidersHorizontal,
} from "lucide-react";

export function DashboardWorkspace() {
  const {
    projects,
    openProject,
    createProject,
    deleteProject,
    duplicateProject,
    setActiveToolId,
    sharedAssets,
  } = useStudio();

  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const quickLaunchers = [
    { id: "designer", title: "New Designer Canvas", toolId: "designer" as StudioToolId, icon: Palette, color: "from-cyan-500 to-blue-600", desc: "1920x1080 Vector & Raster Editor" },
    { id: "ai-generator", title: "AI Image Generator", toolId: "ai-generator" as StudioToolId, icon: Wand2, color: "from-purple-500 to-pink-600", desc: "Turn prompts into 8K artwork" },
    { id: "video-editor", title: "Video Timeline Suite", toolId: "video-editor" as StudioToolId, icon: Video, color: "from-red-500 to-amber-600", desc: "Multi-track audio/video editor" },
    { id: "thumbnail-creator", title: "YouTube Thumbnail", toolId: "thumbnail-creator" as StudioToolId, icon: Sparkles, color: "from-amber-500 to-emerald-600", desc: "High-CTR covers with badges" },
    { id: "logo-creator", title: "Vector Logo Studio", toolId: "logo-creator" as StudioToolId, icon: Shield, color: "from-emerald-500 to-cyan-600", desc: "Emblems, monograms & badges" },
    { id: "brand-kit", title: "Brand Guidelines", toolId: "brand-kit" as StudioToolId, icon: BookmarkCheck, color: "from-blue-500 to-indigo-600", desc: "Palettes, logos & typography" },
  ];

  return (
    <div className="flex-1 bg-neutral-950 text-white overflow-y-auto custom-scrollbar p-6 space-y-8 font-sans select-none">
      {/* HERO BANNER & QUICK ACTION HEADER */}
      <div className="relative rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-black border border-white/10 p-6 md:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-neon-purple/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Studio.Lizzdo.com Central Suite</span>
            </div>
            <h1 className="font-display font-black text-2xl md:text-4xl tracking-wider text-white uppercase">
              Creative Hub & Studio Control
            </h1>
            <p className="text-sm text-gray-400 font-mono leading-relaxed">
              Access 22+ professional creative tools, AI image generators, video editors, vector logos, and shared assets in one unified workspace.
            </p>
          </div>

          <button
            type="button"
            onClick={() => createProject("New Studio Project", "designer")}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink text-white font-display font-bold text-sm tracking-wider uppercase hover:shadow-[0_0_25px_rgba(0,245,255,0.6)] transition-all flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Blank Project</span>
          </button>
        </div>
      </div>

      {/* QUICK LAUNCHERS GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-white text-sm tracking-wider uppercase flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-neon-cyan" /> Launch Creative Tool
          </h2>
          <button
            type="button"
            onClick={() => setActiveToolId("projects")}
            className="text-xs font-mono text-neon-cyan hover:underline flex items-center gap-1"
          >
            <span>View All Tools (22)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLaunchers.map((ql) => {
            const Icon = ql.icon;
            return (
              <div
                key={ql.id}
                onClick={() => createProject(ql.title, ql.toolId)}
                className="p-5 rounded-2xl bg-neutral-900 border border-white/10 hover:border-neon-cyan/50 hover:bg-neutral-800/80 transition-all cursor-pointer group flex items-start gap-4 shadow-lg"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${ql.color} p-0.5 shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                  <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <h3 className="font-display font-bold text-white text-sm group-hover:text-neon-cyan transition-colors truncate">
                    {ql.title}
                  </h3>
                  <p className="text-xs text-gray-400 font-mono leading-tight">
                    {ql.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RECENT PROJECTS SECTION */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h2 className="font-display font-bold text-white text-sm tracking-wider uppercase flex items-center gap-2">
            <Kanban className="w-4 h-4 text-neon-purple" /> Saved Projects ({projects.length})
          </h2>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-1.5 pl-8 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple font-mono"
            />
            <Search className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-neutral-900 border border-white/10 font-mono text-gray-500 space-y-3">
            <Kanban className="w-8 h-8 text-neon-purple mx-auto animate-pulse" />
            <p className="text-xs">No projects found. Launch any tool above to start creating!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProjects.map((proj) => {
              const matchingTool = STUDIO_TOOLS.find((t) => t.id === proj.toolId);

              return (
                <div
                  key={proj.id}
                  onClick={() => openProject(proj.id)}
                  className="rounded-2xl bg-neutral-900 border border-white/10 hover:border-neon-cyan/50 transition-all cursor-pointer group overflow-hidden flex flex-col justify-between shadow-lg"
                >
                  {/* PREVIEW THUMBNAIL AREA */}
                  <div className="h-36 bg-black/80 relative flex items-center justify-center p-4 border-b border-white/5">
                    <div className="text-center space-y-1">
                      <Palette className="w-8 h-8 text-neon-cyan mx-auto group-hover:scale-110 transition-transform" />
                      <span className="font-mono text-[10px] text-gray-500 uppercase block">
                        {proj.width} × {proj.height} PX
                      </span>
                    </div>
                    {matchingTool && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/80 border border-white/10 text-[9px] font-mono text-neon-cyan font-bold">
                        {matchingTool.name}
                      </span>
                    )}
                  </div>

                  {/* INFO & CONTROLS */}
                  <div className="p-3 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-white text-xs truncate group-hover:text-neon-cyan transition-colors">
                        {proj.title}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-gray-500 pt-1 border-t border-white/5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-500" />
                        {new Date(proj.updatedAt).toLocaleDateString()}
                      </span>

                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => duplicateProject(proj.id)}
                          className="p-1 hover:text-neon-cyan text-gray-400"
                          title="Duplicate Project"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteProject(proj.id)}
                          className="p-1 hover:text-red-400 text-gray-400"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SYSTEM STATS & SHARED RESOURCES OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs font-mono">
        <div className="p-4 rounded-2xl bg-neutral-900 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span>SHARED ASSET VAULT</span>
            <Layers className="w-4 h-4 text-neon-cyan" />
          </div>
          <div className="text-xl font-bold text-white">{sharedAssets.length} Stored Assets</div>
          <p className="text-[10px] text-gray-500">Accessible across all 22 creative tools</p>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-900 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span>STORAGE ENGINE</span>
            <HardDrive className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-white">Cloud Storage Ready</div>
          <p className="text-[10px] text-gray-500">Auto-saves locally with cloud backup support</p>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-900 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span>AI ACCELERATION</span>
            <Bot className="w-4 h-4 text-neon-purple" />
          </div>
          <div className="text-xl font-bold text-emerald-400">Ultra Fast GPU</div>
          <p className="text-[10px] text-gray-500">Gemini & Canvas export acceleration active</p>
        </div>
      </div>
    </div>
  );
}

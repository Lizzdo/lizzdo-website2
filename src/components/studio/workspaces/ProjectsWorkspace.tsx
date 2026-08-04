import React, { useState } from "react";
import { useStudio } from "../../../context/StudioContext";
import { STUDIO_TOOLS } from "../../../data/studioTools";
import {
  Kanban,
  Search,
  Plus,
  Trash2,
  Copy,
  Clock,
  Palette,
  ExternalLink,
} from "lucide-react";

export function ProjectsWorkspace() {
  const {
    projects,
    openProject,
    createProject,
    deleteProject,
    duplicateProject,
  } = useStudio();

  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 bg-black text-white p-6 overflow-y-auto custom-scrollbar font-sans select-none space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-neutral-900 border border-white/10 shadow-2xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-purple/10 border border-neon-purple/30 text-neon-purple text-xs font-mono">
            <Kanban className="w-3.5 h-3.5" />
            <span>Unified Project System</span>
          </div>
          <h1 className="font-display font-black text-2xl md:text-3xl tracking-wider text-white uppercase">
            Projects Hub & Saved Creations
          </h1>
          <p className="text-xs text-gray-400 font-mono">
            All your design, video, logo, thumbnail, and brand projects saved in one central repository.
          </p>
        </div>

        <button
          type="button"
          onClick={() => createProject("Untitled Studio Project", "designer")}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-neon-purple to-neon-pink text-white font-display font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(168,85,247,0.6)] transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" /> New Blank Project
        </button>
      </div>

      <div className="relative w-full max-w-md">
        <input
          type="text"
          placeholder="Search saved projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-neutral-900 border border-white/10 rounded-2xl px-4 py-2.5 pl-10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple font-mono"
        />
        <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 font-mono text-xs">
        {filteredProjects.map((proj) => {
          const matchingTool = STUDIO_TOOLS.find((t) => t.id === proj.toolId);

          return (
            <div
              key={proj.id}
              onClick={() => openProject(proj.id)}
              className="rounded-2xl bg-neutral-900 border border-white/10 hover:border-neon-purple/60 transition-all cursor-pointer group overflow-hidden flex flex-col justify-between shadow-lg"
            >
              <div className="h-36 bg-black/80 relative flex items-center justify-center p-4 border-b border-white/5">
                <Palette className="w-8 h-8 text-neon-purple group-hover:scale-110 transition-transform" />
                {matchingTool && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/80 border border-white/10 text-[9px] font-mono text-neon-purple font-bold">
                    {matchingTool.name}
                  </span>
                )}
              </div>

              <div className="p-3 space-y-2">
                <h3 className="font-bold text-white truncate group-hover:text-neon-purple transition-colors">
                  {proj.title}
                </h3>

                <div className="flex items-center justify-between text-[10px] text-gray-500 pt-2 border-t border-white/5">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-500" />
                    {new Date(proj.updatedAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => duplicateProject(proj.id)}
                      className="p-1 hover:text-neon-purple text-gray-400"
                      title="Duplicate"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteProject(proj.id)}
                      className="p-1 hover:text-red-400 text-gray-400"
                      title="Delete"
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
    </div>
  );
}

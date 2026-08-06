import React, { useState } from "react";
import { useStudio } from "../../context/StudioContext";
import { StudioActivity, ActivityType } from "../../types/studio";
import {
  Clock,
  PlusCircle,
  Edit3,
  Download,
  LayoutTemplate,
  Upload,
  Wand2,
  FileText,
  FolderGit2,
  Trash2,
  Filter,
  ExternalLink,
} from "lucide-react";

export function ActivityTimeline() {
  const { activities, clearActivities, openProject } = useStudio();

  const [selectedType, setSelectedType] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("all");

  const filteredActivities = activities.filter((act) => {
    // Type Filter
    if (selectedType !== "all" && act.type !== selectedType) return false;

    // Date Filter
    if (dateRange === "today") {
      const actDate = new Date(act.timestamp).toDateString();
      const today = new Date().toDateString();
      if (actDate !== today) return false;
    } else if (dateRange === "week") {
      const actTime = new Date(act.timestamp).getTime();
      const weekAgo = Date.now() - 86400000 * 7;
      if (actTime < weekAgo) return false;
    }

    return true;
  });

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case "project_created":
        return <PlusCircle className="w-4 h-4 text-neon-purple" />;
      case "project_updated":
        return <Edit3 className="w-4 h-4 text-amber-400" />;
      case "export_completed":
        return <Download className="w-4 h-4 text-emerald-400" />;
      case "template_used":
        return <LayoutTemplate className="w-4 h-4 text-cyan-400" />;
      case "asset_uploaded":
        return <Upload className="w-4 h-4 text-blue-400" />;
      case "ai_generated":
        return <Wand2 className="w-4 h-4 text-neon-pink" />;
      case "blog_published":
        return <FileText className="w-4 h-4 text-yellow-400" />;
      case "portfolio_updated":
        return <FolderGit2 className="w-4 h-4 text-violet-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="rounded-3xl bg-neutral-900 border border-white/10 p-6 shadow-xl space-y-5 font-sans">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-neon-purple/20 text-neon-purple border border-neon-purple/30">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-black text-lg text-white tracking-wider uppercase">
              Recent Activity & Timeline
            </h2>
            <p className="text-xs text-gray-400 font-mono">
              Live audit trail of actions, exports, AI generations, and edits
            </p>
          </div>
        </div>

        {activities.length > 0 && (
          <button
            type="button"
            onClick={clearActivities}
            className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-red-500/20 hover:text-red-400 text-xs text-gray-400 transition-colors flex items-center gap-1.5 font-mono"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear History
          </button>
        )}
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
          <Filter className="w-3.5 h-3.5 text-gray-500 shrink-0" />
          <span className="text-gray-400 shrink-0">Type:</span>
          {[
            { id: "all", label: "All Events" },
            { id: "project_created", label: "Created" },
            { id: "export_completed", label: "Exports" },
            { id: "ai_generated", label: "AI Generations" },
            { id: "asset_uploaded", label: "Asset Uploads" },
          ].map((typeOption) => (
            <button
              key={typeOption.id}
              type="button"
              onClick={() => setSelectedType(typeOption.id)}
              className={`px-3 py-1 rounded-full border transition-all shrink-0 ${
                selectedType === typeOption.id
                  ? "bg-neon-purple text-white border-neon-purple font-bold"
                  : "bg-black/40 text-gray-400 border-white/10 hover:text-white"
              }`}
            >
              {typeOption.label}
            </button>
          ))}
        </div>

        {/* DATE RANGE FILTER */}
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Time:</span>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-black/60 border border-white/10 rounded-xl px-2.5 py-1 text-xs text-white focus:outline-none focus:border-neon-purple"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Past 7 Days</option>
          </select>
        </div>
      </div>

      {/* TIMELINE LIST */}
      {filteredActivities.length === 0 ? (
        <div className="py-12 text-center text-gray-500 font-mono text-xs space-y-2">
          <Clock className="w-8 h-8 mx-auto text-gray-600" />
          <p>No activity logs matching selected filters.</p>
        </div>
      ) : (
        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
          {filteredActivities.map((act) => (
            <div
              key={act.id}
              className="relative group bg-black/40 border border-white/5 hover:border-white/20 p-3.5 rounded-2xl transition-all flex items-start justify-between gap-3"
            >
              {/* TIMELINE DOT */}
              <div className="absolute -left-6 top-4 p-1 rounded-full bg-neutral-900 border border-white/20 shadow-md">
                {getActivityIcon(act.type)}
              </div>

              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-xs text-white font-mono">{act.title}</h4>
                  <span className="text-[10px] text-gray-500 font-mono">
                    {new Date(act.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-xs text-gray-300 font-sans">{act.description}</p>
              </div>

              {/* LAUNCH LINK IF ATTACHED TO A PROJECT */}
              {act.projectId && (
                <button
                  type="button"
                  onClick={() => openProject(act.projectId!)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 hover:bg-neon-purple hover:text-white text-[11px] text-gray-300 font-mono transition-colors flex items-center gap-1 shrink-0"
                >
                  <ExternalLink className="w-3 h-3" /> View
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { AIGenerationTask, AIHistoryEntry } from "../../../types/ai";
import { AIQueueManager } from "../../../services/aiQueueManager";
import { useStudio } from "../../../context/StudioContext";
import {
  Clock,
  RefreshCw,
  XCircle,
  CheckCircle2,
  AlertTriangle,
  Star,
  Copy,
  Send,
  Search,
  Trash2,
  SlidersHorizontal,
  Layers,
  Wand2,
  FolderPlus,
  Play,
  RotateCcw,
  Sparkles,
} from "lucide-react";

interface AIQueueAndHistoryViewProps {
  history: AIHistoryEntry[];
  onToggleHistoryFavorite: (id: string) => void;
  onSendToDesigner: (url: string) => void;
  onSendToImageEditor: (url: string) => void;
  onSendToVideoEditor: (url: string) => void;
  onSendToAssetLibrary: (url: string) => void;
  onSendToBlog: (url: string, text?: string) => void;
  onSendToPortfolio: (url: string, text?: string) => void;
  onSendToStore: (url: string, text?: string) => void;
  onRegenerateHistoryItem: (item: AIHistoryEntry) => void;
}

export function AIQueueAndHistoryView({
  history,
  onToggleHistoryFavorite,
  onSendToDesigner,
  onSendToImageEditor,
  onSendToVideoEditor,
  onSendToAssetLibrary,
  onSendToBlog,
  onSendToPortfolio,
  onSendToStore,
  onRegenerateHistoryItem,
}: AIQueueAndHistoryViewProps) {
  const { addNotification } = useStudio();

  const [activeSubTab, setActiveSubTab] = useState<"history" | "queue" | "gallery">("history");
  const [tasks, setTasks] = useState<AIGenerationTask[]>([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("All");

  // Subscribe to live queue manager updates
  useEffect(() => {
    const unsubscribe = AIQueueManager.subscribe((updatedTasks) => {
      setTasks(updatedTasks);
    });
    return () => unsubscribe();
  }, []);

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.prompt.toLowerCase().includes(search.toLowerCase()) ||
      (item.textResult && item.textResult.toLowerCase().includes(search.toLowerCase()));

    const matchesType = filterType === "All" || item.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="flex-1 bg-neutral-950 border border-white/10 rounded-2xl p-6 flex flex-col overflow-hidden font-mono text-xs space-y-4">
      {/* TOP NAVIGATION SUBTABS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab("history")}
            className={`px-4 py-2 rounded-xl font-bold uppercase transition-all flex items-center gap-2 ${
              activeSubTab === "history"
                ? "bg-neon-cyan text-black"
                : "bg-neutral-900 border border-white/10 text-gray-400 hover:text-white"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>AI History Log ({history.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab("queue")}
            className={`px-4 py-2 rounded-xl font-bold uppercase transition-all flex items-center gap-2 relative ${
              activeSubTab === "queue"
                ? "bg-neon-purple text-white"
                : "bg-neutral-900 border border-white/10 text-gray-400 hover:text-white"
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Generation Queue</span>
            {tasks.filter((t) => t.status === "processing" || t.status === "queued").length > 0 && (
              <span className="w-2 h-2 rounded-full bg-neon-cyan animate-ping" />
            )}
          </button>

          <button
            onClick={() => setActiveSubTab("gallery")}
            className={`px-4 py-2 rounded-xl font-bold uppercase transition-all flex items-center gap-2 ${
              activeSubTab === "gallery"
                ? "bg-neon-pink text-white"
                : "bg-neutral-900 border border-white/10 text-gray-400 hover:text-white"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Output Gallery & Integrations</span>
          </button>
        </div>

        {/* SEARCH & FILTER */}
        {activeSubTab !== "queue" && (
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search prompt history..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-neutral-900 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan font-sans text-xs"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-neutral-900 border border-white/10 rounded-xl px-2.5 py-1.5 text-gray-300 font-sans text-xs"
            >
              <option value="All">All Types</option>
              <option value="Image">Image</option>
              <option value="Edit">Edit</option>
              <option value="Writer">Writer</option>
              <option value="Background">Background</option>
            </select>
          </div>
        )}
      </div>

      {/* SUBTAB CONTENT */}
      {activeSubTab === "history" && (
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-neutral-900/80 border border-white/10 hover:border-white/20 transition-all flex flex-col md:flex-row gap-4 items-start justify-between"
            >
              {/* PREVIEW THUMBNAIL OR TEXT */}
              <div className="w-full md:w-36 h-28 rounded-xl bg-black overflow-hidden border border-white/10 shrink-0 relative">
                {item.previewUrls && item.previewUrls.length > 0 ? (
                  <img
                    src={item.previewUrls[0]}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full p-2 text-[9px] text-gray-400 font-sans line-clamp-6 bg-neutral-950">
                    {item.textResult}
                  </div>
                )}

                <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/70 border border-white/20 text-[8px] font-bold uppercase text-neon-cyan">
                  {item.type}
                </span>
              </div>

              {/* DETAILS */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white font-sans text-xs">{item.prompt}</span>
                    {item.projectName && (
                      <span className="text-gray-500 text-[10px]">• {item.projectName}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onToggleHistoryFavorite(item.id)}
                      className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-amber-400"
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          item.favorite ? "fill-amber-400 text-amber-400" : ""
                        }`}
                      />
                    </button>
                    <button
                      onClick={() => onRegenerateHistoryItem(item)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white font-bold text-[10px] flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" /> Regenerate
                    </button>
                  </div>
                </div>

                {/* METADATA TAGS */}
                <div className="flex flex-wrap items-center gap-2 text-[10px] text-gray-400">
                  <span>Model: {item.model}</span>
                  <span>• Seed: {item.seed}</span>
                  <span>• Date: {item.date}</span>
                  {item.settingsUsed.aspectRatio && <span>• Aspect: {item.settingsUsed.aspectRatio}</span>}
                  {item.settingsUsed.style && <span>• Style: {item.settingsUsed.style}</span>}
                </div>

                {/* WORKFLOW INTEGRATION SHORTCUTS */}
                <div className="pt-2 flex flex-wrap items-center gap-1.5 border-t border-white/5">
                  {item.previewUrls?.[0] && (
                    <>
                      <button
                        onClick={() => onSendToDesigner(item.previewUrls![0])}
                        className="px-2.5 py-1 rounded-lg bg-neon-cyan/20 border border-neon-cyan/40 text-neon-cyan font-bold hover:bg-neon-cyan hover:text-black transition-all text-[10px]"
                      >
                        Send to Designer V1
                      </button>

                      <button
                        onClick={() => onSendToImageEditor(item.previewUrls![0])}
                        className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white transition-all text-[10px]"
                      >
                        Image Editor
                      </button>

                      <button
                        onClick={() => onSendToVideoEditor(item.previewUrls![0])}
                        className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white transition-all text-[10px]"
                      >
                        Video Editor
                      </button>

                      <button
                        onClick={() => onSendToAssetLibrary(item.previewUrls![0])}
                        className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white transition-all text-[10px]"
                      >
                        Save Asset
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => onSendToBlog(item.previewUrls?.[0] || "", item.textResult)}
                    className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white transition-all text-[10px]"
                  >
                    Send to Blog
                  </button>

                  <button
                    onClick={() => onSendToPortfolio(item.previewUrls?.[0] || "", item.textResult)}
                    className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white transition-all text-[10px]"
                  >
                    Send to Portfolio
                  </button>

                  <button
                    onClick={() => onSendToStore(item.previewUrls?.[0] || "", item.textResult)}
                    className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white transition-all text-[10px]"
                  >
                    Send to Store
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredHistory.length === 0 && (
            <div className="py-12 text-center text-gray-500 font-sans">
              No generation history records found.
            </div>
          )}
        </div>
      )}

      {/* QUEUE SUBTAB */}
      {activeSubTab === "queue" && (
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-gray-400">Background Request Queue ({tasks.length})</span>
            <button
              onClick={() => AIQueueManager.clearCompleted()}
              className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white"
            >
              Clear Completed
            </button>
          </div>

          {tasks.map((t) => (
            <div
              key={t.id}
              className="p-4 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-between gap-4"
            >
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white font-sans text-xs">{t.prompt}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      t.status === "processing"
                        ? "bg-neon-cyan/20 text-neon-cyan animate-pulse"
                        : t.status === "completed"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : t.status === "failed"
                        ? "bg-rose-500/20 text-rose-400"
                        : "bg-gray-800 text-gray-400"
                    }`}
                  >
                    {t.status}
                  </span>
                </div>

                {/* PROGRESS BAR */}
                {t.status === "processing" && (
                  <div className="w-full h-1.5 bg-black rounded-full overflow-hidden mt-2">
                    <div
                      className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple transition-all duration-300"
                      style={{ width: `${t.progress}%` }}
                    />
                  </div>
                )}

                <div className="text-[10px] text-gray-500">
                  Model: {t.model} • Type: {t.type} • Started: {new Date(t.startedAt).toLocaleTimeString()}
                </div>
              </div>

              {/* QUEUE ACTIONS */}
              <div className="flex items-center gap-2">
                {t.status === "processing" || t.status === "queued" ? (
                  <button
                    onClick={() => AIQueueManager.cancelTask(t.id)}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500 hover:text-white transition-all"
                  >
                    Cancel
                  </button>
                ) : t.status === "failed" || t.status === "cancelled" ? (
                  <button
                    onClick={() => AIQueueManager.retryTask(t.id)}
                    className="px-3 py-1.5 rounded-xl bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/40 hover:bg-neon-cyan hover:text-black transition-all"
                  >
                    Retry Task
                  </button>
                ) : null}
              </div>
            </div>
          ))}

          {tasks.length === 0 && (
            <div className="py-12 text-center text-gray-500 font-sans">
              No tasks in queue. All requests processed.
            </div>
          )}
        </div>
      )}

      {/* GALLERY SUBTAB */}
      {activeSubTab === "gallery" && (
        <div className="flex-1 overflow-y-auto custom-scrollbar grid grid-cols-2 md:grid-cols-4 gap-4 pr-1">
          {history
            .flatMap((h) => h.previewUrls || [])
            .map((url, idx) => (
              <div
                key={idx}
                className="group relative h-44 rounded-2xl bg-black border border-white/10 overflow-hidden hover:border-neon-cyan transition-all"
              >
                <img
                  src={url}
                  alt="Gallery Item"
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                  referrerPolicy="no-referrer"
                />

                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all p-3 flex flex-col justify-between">
                  <span className="text-[10px] text-neon-cyan font-bold uppercase">
                    AI Render #{idx + 1}
                  </span>

                  <div className="space-y-1">
                    <button
                      onClick={() => onSendToDesigner(url)}
                      className="w-full py-1.5 rounded-lg bg-neon-cyan text-black font-bold hover:bg-neon-cyan/80 transition-all text-[10px]"
                    >
                      Use in Designer V1
                    </button>
                    <button
                      onClick={() => onSendToImageEditor(url)}
                      className="w-full py-1 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all text-[9px]"
                    >
                      Image Editor
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

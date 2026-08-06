import React, { useState } from "react";
import { useStudio } from "../../context/StudioContext";
import {
  Bell,
  X,
  CheckCircle2,
  Info,
  AlertTriangle,
  Download,
  Upload,
  Wand2,
  Save,
  Share2,
  Shield,
  Trash2,
  Check,
  Search,
} from "lucide-react";

export function NotificationCenterDrawer() {
  const {
    isNotificationOpen,
    setIsNotificationOpen,
    notifications,
    markNotificationRead,
    clearAllNotifications,
  } = useStudio();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [filterQuery, setFilterQuery] = useState<string>("");

  if (!isNotificationOpen) return null;

  const filteredNotifs = notifications.filter((n) => {
    if (selectedCategory !== "all" && n.category !== selectedCategory) return false;
    if (filterQuery && !n.title.toLowerCase().includes(filterQuery.toLowerCase()) && !n.message.toLowerCase().includes(filterQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const getCategoryIcon = (category?: string, type?: string) => {
    switch (category) {
      case "exports":
        return <Download className="w-4 h-4 text-emerald-400" />;
      case "uploads":
        return <Upload className="w-4 h-4 text-blue-400" />;
      case "ai":
        return <Wand2 className="w-4 h-4 text-neon-purple" />;
      case "autosave":
        return <Save className="w-4 h-4 text-cyan-400" />;
      case "shared":
        return <Share2 className="w-4 h-4 text-neon-pink" />;
      case "errors":
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default:
        return <Shield className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex justify-end font-sans select-none"
      onClick={() => setIsNotificationOpen(false)}
    >
      <div
        className="w-full max-w-md bg-neutral-900 border-l border-white/10 h-full shadow-2xl flex flex-col justify-between p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="space-y-4 pb-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-neon-purple/20 text-neon-purple border border-neon-purple/30">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display font-black text-lg text-white uppercase tracking-wider">
                  Notifications
                </h2>
                <p className="text-xs text-gray-400 font-mono">System alerts & activity logs</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsNotificationOpen(false)}
              className="p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* SEARCH BAR */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search notifications..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 pl-9 text-xs text-white placeholder-gray-500 font-mono focus:outline-none focus:border-neon-purple"
            />
            <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* CATEGORY TABS */}
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 text-[11px] font-mono">
            {[
              { id: "all", label: "All" },
              { id: "exports", label: "Exports" },
              { id: "uploads", label: "Uploads" },
              { id: "autosave", label: "Autosave" },
              { id: "system", label: "System" },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg transition-all shrink-0 ${
                  selectedCategory === cat.id
                    ? "bg-neon-purple text-white font-bold"
                    : "bg-white/5 text-gray-400 hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* NOTIFICATIONS LIST */}
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 font-mono text-xs pr-1">
          {filteredNotifs.length === 0 ? (
            <div className="py-12 text-center text-gray-500 space-y-2">
              <Bell className="w-8 h-8 mx-auto text-gray-600" />
              <p>No notifications matching filters.</p>
            </div>
          ) : (
            filteredNotifs.map((n) => (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative space-y-1 ${
                  n.read
                    ? "bg-black/30 border-white/5 opacity-70"
                    : "bg-black/80 border-neon-purple/40 shadow-lg"
                }`}
              >
                {!n.read && (
                  <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-neon-purple animate-ping" />
                )}

                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-neutral-800 shrink-0">
                    {getCategoryIcon(n.category, n.type)}
                  </div>
                  <h4 className="font-bold text-white text-xs truncate">{n.title}</h4>
                </div>

                <p className="text-[11px] text-gray-300 font-sans leading-relaxed">{n.message}</p>

                <div className="flex items-center justify-between text-[9px] text-gray-500 pt-1">
                  <span>
                    {new Date(n.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>

                  <span className="uppercase tracking-wider font-bold text-gray-400">
                    {n.category || "system"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* FOOTER ACTIONS */}
        {notifications.length > 0 && (
          <div className="pt-3 border-t border-white/10 flex items-center justify-between font-mono text-xs">
            <button
              type="button"
              onClick={clearAllNotifications}
              className="text-gray-400 hover:text-red-400 flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </button>

            <button
              type="button"
              onClick={() => notifications.forEach((n) => markNotificationRead(n.id))}
              className="text-neon-purple hover:text-neon-pink font-bold flex items-center gap-1.5 transition-colors"
            >
              <Check className="w-3.5 h-3.5" /> Mark All Read
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

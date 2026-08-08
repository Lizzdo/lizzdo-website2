import React, { useState, useEffect } from "react";
import { X, History, RotateCcw, Save, ShieldCheck, Trash2, Clock } from "lucide-react";
import { DesignState } from "../../types/designer";
import { getStorageItem, setStorageItem } from "../../utils/storage";

interface VersionSnapshot {
  id: string;
  timestamp: string;
  label: string;
  state: DesignState;
}

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentState: DesignState;
  onRestoreState: (state: DesignState) => void;
}

export const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({
  isOpen,
  onClose,
  currentState,
  onRestoreState,
}) => {
  const [snapshots, setSnapshots] = useState<VersionSnapshot[]>([]);
  const [snapshotLabel, setSnapshotLabel] = useState("");

  // Load existing snapshots from localStorage
  useEffect(() => {
    if (isOpen) {
      const saved = getStorageItem(`lizzdo_snapshots_${currentState.id}`);
      if (saved) {
        try {
          setSnapshots(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse snapshots", e);
        }
      }
    }
  }, [isOpen, currentState.id]);

  if (!isOpen) return null;

  const handleCreateSnapshot = () => {
    const newSnapshot: VersionSnapshot = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      label: snapshotLabel.trim() || `Snapshot #${snapshots.length + 1}`,
      state: JSON.parse(JSON.stringify(currentState)),
    };

    const updated = [newSnapshot, ...snapshots];
    setSnapshots(updated);
    setStorageItem(`lizzdo_snapshots_${currentState.id}`, JSON.stringify(updated));
    setSnapshotLabel("");
  };

  const handleRestore = (snapshot: VersionSnapshot) => {
    onRestoreState(snapshot.state);
    onClose();
  };

  const handleDeleteSnapshot = (id: string) => {
    const updated = snapshots.filter((s) => s.id !== id);
    setSnapshots(updated);
    setStorageItem(`lizzdo_snapshots_${currentState.id}`, JSON.stringify(updated));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-neutral-900 border border-white/20 rounded-3xl shadow-2xl overflow-hidden text-gray-200 font-sans flex flex-col max-h-[85vh]">
        {/* HEADER */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-neon-purple/20 border border-neon-purple/50 text-neon-purple">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-white tracking-wide">
                Version History & Backup Snapshots
              </h2>
              <p className="text-xs font-mono text-gray-400">
                Crash recovery, version rollbacks, and manual project checkpoints
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CREATE SNAPSHOT INPUT BAR */}
        <div className="p-4 bg-white/5 border-b border-white/10 flex items-center gap-2">
          <input
            type="text"
            value={snapshotLabel}
            onChange={(e) => setSnapshotLabel(e.target.value)}
            placeholder="Snapshot title (e.g. Before Layout Overhaul)..."
            className="flex-1 bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple"
          />
          <button
            onClick={handleCreateSnapshot}
            className="px-4 py-2 rounded-xl bg-neon-purple text-white font-mono font-bold text-xs hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all flex items-center gap-1.5 shrink-0"
          >
            <Save className="w-3.5 h-3.5" /> Save Point
          </button>
        </div>

        {/* SNAPSHOTS LIST */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1 font-mono text-xs">
          {snapshots.length === 0 ? (
            <div className="p-8 text-center text-gray-400 space-y-2 border border-dashed border-white/15 rounded-2xl bg-black/30">
              <ShieldCheck className="w-8 h-8 text-neon-purple mx-auto opacity-60" />
              <p className="font-bold text-sm text-gray-300">Autosave Active</p>
              <p className="text-xs text-gray-500">
                Your project automatically saves every edit. Create manual snapshots above to keep named rollbacks!
              </p>
            </div>
          ) : (
            snapshots.map((s) => (
              <div
                key={s.id}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-neon-purple/50 flex items-center justify-between transition-all"
              >
                <div className="space-y-1 min-w-0 pr-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm truncate">{s.label}</span>
                    <span className="px-2 py-0.5 rounded-full bg-neon-purple/15 text-neon-purple text-[10px] font-bold">
                      {s.state.elements.length} elements
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-neon-cyan" /> Saved at {s.timestamp}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleRestore(s)}
                    className="px-3 py-1.5 rounded-xl bg-neon-cyan/20 border border-neon-cyan/50 text-neon-cyan font-bold hover:bg-neon-cyan hover:text-black transition-all flex items-center gap-1.5 text-xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Rollback
                  </button>
                  <button
                    onClick={() => handleDeleteSnapshot(s.id)}
                    className="p-1.5 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    title="Delete Snapshot"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-white/10 bg-black/40 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 text-white font-mono font-bold text-xs hover:bg-white/20 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

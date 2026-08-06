import React from "react";
import { ImageEditorHistorySnapshot } from "../../../types/imageEditor";
import { History, X, Check, RotateCcw } from "lucide-react";

interface ImageEditorHistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  history: ImageEditorHistorySnapshot[];
  currentIndex: number;
  onRestoreIndex: (index: number) => void;
}

export function ImageEditorHistoryPanel({
  isOpen,
  onClose,
  history,
  currentIndex,
  onRestoreIndex,
}: ImageEditorHistoryPanelProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex justify-end font-sans select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-neutral-950 border-l border-white/10 h-full p-5 flex flex-col space-y-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2 text-white">
            <History className="w-4 h-4 text-neon-purple" />
            <h3 className="font-display font-bold text-xs uppercase tracking-wider">
              Edit Snapshot History
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 font-mono text-xs">
          {history.map((snapshot, idx) => {
            const isCurrent = idx === currentIndex;
            const timeStr = new Date(snapshot.timestamp).toLocaleTimeString();

            return (
              <div
                key={snapshot.id || idx}
                onClick={() => onRestoreIndex(idx)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isCurrent
                    ? "bg-neon-purple/20 border-neon-purple text-white font-bold shadow-lg"
                    : idx < currentIndex
                    ? "bg-neutral-900 border-white/10 text-gray-300 hover:border-white/30"
                    : "bg-black/30 border-white/5 text-gray-600 hover:text-gray-400"
                }`}
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {isCurrent && <Check className="w-3.5 h-3.5 text-neon-purple shrink-0" />}
                    <span className="truncate">{snapshot.description || `Step #${idx + 1}`}</span>
                  </div>
                  <span className="text-[10px] text-gray-500 block">{timeStr}</span>
                </div>

                {isCurrent && (
                  <span className="px-2 py-0.5 rounded-full bg-neon-purple text-white text-[9px] font-bold uppercase">
                    Active
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

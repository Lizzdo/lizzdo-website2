import React from "react";
import { History, RotateCcw, Clock, CheckCircle } from "lucide-react";
import { HistoryEntry } from "../../types/designerV2";

interface HistoryPanelV2Props {
  historyStack: HistoryEntry[];
  historyIndex: number;
  onRestoreHistoryIndex: (index: number) => void;
}

export default function HistoryPanelV2({
  historyStack,
  historyIndex,
  onRestoreHistoryIndex,
}: HistoryPanelV2Props) {
  return (
    <div className="w-full h-full bg-black/95 text-white p-3 flex flex-col gap-3 font-mono text-xs select-none">
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-neon-purple" />
          <span className="font-display font-bold uppercase tracking-wider text-xs">History Timeline</span>
        </div>
        <span className="text-[10px] text-gray-400 bg-white/5 px-2 py-0.5 rounded-full">
          {historyStack.length} States
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
        {historyStack.map((entry, idx) => {
          const isCurrent = idx === historyIndex;
          return (
            <div
              key={entry.id || idx}
              onClick={() => onRestoreHistoryIndex(idx)}
              className={`p-2 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-all ${
                isCurrent
                  ? "bg-neon-purple/20 border-neon-purple text-white shadow-[0_0_10px_rgba(168,85,247,0.3)]"
                  : idx < historyIndex
                  ? "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                  : "bg-black/40 border-white/5 text-gray-600 hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {isCurrent ? (
                  <CheckCircle className="w-3.5 h-3.5 text-neon-purple shrink-0" />
                ) : (
                  <Clock className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                )}
                <span className="truncate font-medium text-xs">{entry.description}</span>
              </div>

              <span className="text-[9px] text-gray-500 shrink-0">{entry.timestamp}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

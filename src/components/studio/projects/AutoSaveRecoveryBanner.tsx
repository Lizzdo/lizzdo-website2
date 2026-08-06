import React from "react";
import { useStudio } from "../../../context/StudioContext";
import { Save, ShieldAlert, RotateCcw, X, CheckCircle2 } from "lucide-react";

export function AutoSaveRecoveryBanner() {
  const { currentProject, lastAutoSaveTime, recoveryDrafts, restoreRecoveryDraft, discardRecoveryDraft } = useStudio();

  if (!currentProject) return null;

  const activeDraft = recoveryDrafts.find((d) => d.projectId === currentProject.id);

  return (
    <div className="w-full bg-neutral-900 border-b border-white/10 px-4 py-2 flex items-center justify-between font-mono text-xs select-none">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Autosave Engine Active</span>
        </div>

        <span className="text-gray-500">•</span>

        <span className="text-gray-400 text-[11px]">
          {lastAutoSaveTime
            ? `Saved ${new Date(lastAutoSaveTime).toLocaleTimeString()}`
            : "Protected in Local Vault"}
        </span>
      </div>

      {activeDraft && (
        <div className="flex items-center gap-3 bg-neon-purple/20 border border-neon-purple/50 px-3 py-1 rounded-xl animate-in fade-in">
          <span className="flex items-center gap-1.5 text-neon-purple font-bold text-[11px]">
            <ShieldAlert className="w-3.5 h-3.5 animate-pulse" /> Unsaved draft available from {new Date(activeDraft.savedAt).toLocaleTimeString()}
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => restoreRecoveryDraft(currentProject.id)}
              className="px-2 py-0.5 rounded bg-neon-purple text-white text-[10px] font-bold flex items-center gap-1 hover:bg-neon-purple/80"
            >
              <RotateCcw className="w-3 h-3" /> Restore
            </button>

            <button
              type="button"
              onClick={() => discardRecoveryDraft(currentProject.id)}
              className="p-0.5 text-gray-400 hover:text-white"
              title="Discard draft"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

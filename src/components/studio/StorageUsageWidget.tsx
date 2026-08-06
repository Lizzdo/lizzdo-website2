import React from "react";
import { useStudio } from "../../context/StudioContext";
import { HardDrive, Trash2, FolderOpen, Layers, Database } from "lucide-react";

export function StorageUsageWidget() {
  const { storageUsage, projects, sharedAssets, addNotification } = useStudio();

  const handleCleanStorage = () => {
    addNotification("Storage Optimized", "Cleaned cache and temporary vector render assets.", "success", "system");
  };

  return (
    <div className="rounded-3xl bg-neutral-900 border border-white/10 p-5 shadow-xl font-mono text-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-neon-purple/20 text-neon-purple border border-neon-purple/30">
            <HardDrive className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wider">
              Storage Vault
            </h3>
            <p className="text-[10px] text-gray-400">Cloud & Local Storage Engine</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCleanStorage}
          className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          title="Clean Storage Cache"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* STORAGE METER */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-gray-400">Used Space:</span>
          <span className="font-bold text-neon-purple">
            {storageUsage.usedMB} MB / {storageUsage.totalMB} MB ({storageUsage.percentage}%)
          </span>
        </div>

        <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden border border-white/10 p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-neon-purple via-neon-pink to-cyan-400 transition-all duration-500"
            style={{ width: `${Math.max(4, storageUsage.percentage)}%` }}
          />
        </div>
      </div>

      {/* COUNTERS */}
      <div className="grid grid-cols-2 gap-2 text-[10px] pt-2 border-t border-white/5">
        <div className="flex items-center gap-2 p-2 rounded-xl bg-black/40 border border-white/5">
          <FolderOpen className="w-3.5 h-3.5 text-cyan-400" />
          <div>
            <div className="font-bold text-white">{projects.length} Projects</div>
            <div className="text-gray-500">Saved State</div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-xl bg-black/40 border border-white/5">
          <Layers className="w-3.5 h-3.5 text-neon-pink" />
          <div>
            <div className="font-bold text-white">{sharedAssets.length} Assets</div>
            <div className="text-gray-500">Shared Vault</div>
          </div>
        </div>
      </div>
    </div>
  );
}

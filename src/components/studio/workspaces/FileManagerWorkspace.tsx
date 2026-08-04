import React, { useState } from "react";
import { useStudio } from "../../../context/StudioContext";
import {
  FolderOpen,
  Upload,
  Search,
  HardDrive,
  Trash2,
  File,
  FileImage,
  FileVideo,
  FileCode,
  Download,
} from "lucide-react";

export function FileManagerWorkspace() {
  const { sharedAssets, uploadSharedAsset } = useStudio();
  const [searchQuery, setSearchQuery] = useState("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await uploadSharedAsset(e.target.files[0]);
    }
  };

  return (
    <div className="flex-1 bg-black text-white p-6 overflow-y-auto custom-scrollbar font-sans select-none space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-neutral-900 border border-white/10 shadow-2xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-xs font-mono">
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Unified Cloud File System</span>
          </div>
          <h1 className="font-display font-black text-2xl md:text-3xl tracking-wider text-white uppercase">
            File Manager & Storage Hub
          </h1>
          <p className="text-xs text-gray-400 font-mono">
            Manage your images, videos, fonts, vector graphics, and exported project files in one place.
          </p>
        </div>

        <label className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-display font-bold text-xs uppercase tracking-wider cursor-pointer hover:shadow-[0_0_20px_rgba(0,245,255,0.6)] transition-all flex items-center gap-2 shrink-0">
          <Upload className="w-4 h-4" /> Upload File
          <input type="file" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
        {sharedAssets.map((asset) => (
          <div
            key={asset.id}
            className="p-4 rounded-2xl bg-neutral-900 border border-white/10 hover:border-neon-cyan/50 transition-all group flex items-center gap-3 shadow-lg"
          >
            <div className="w-10 h-10 rounded-xl bg-black border border-white/10 flex items-center justify-center shrink-0 text-neon-cyan">
              <FileImage className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-white truncate text-xs">{asset.name}</h3>
              <p className="text-[10px] text-gray-500">{asset.sizeStr || "240 KB"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

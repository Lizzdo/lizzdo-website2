import React from "react";
import {
  Video,
  Download,
  RotateCcw,
  RotateCw,
  CheckCircle2,
  Sparkles,
  Sliders,
  Maximize2,
  Share2,
} from "lucide-react";
import { CanvasPreset, VideoProjectData } from "../../../types/video";
import { CANVAS_PRESETS } from "../../../utils/videoEngine";

interface Props {
  project: VideoProjectData;
  onUpdateProject: (updated: Partial<VideoProjectData>) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onOpenExportModal: () => void;
}

export const VideoHeaderBar: React.FC<Props> = ({
  project,
  onUpdateProject,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onOpenExportModal,
}) => {
  const handlePresetChange = (presetId: string) => {
    const preset = CANVAS_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    onUpdateProject({
      aspectRatioPreset: preset.id,
      width: preset.width,
      height: preset.height,
    });
  };

  return (
    <div className="h-12 bg-neutral-950 border-b border-white/10 px-4 flex items-center justify-between font-mono text-xs text-gray-300 shrink-0 select-none">
      {/* LEFT: TITLE & PRESETS */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Video className="w-4 h-4 text-neon-cyan animate-pulse" />
          <input
            type="text"
            value={project.title}
            onChange={(e) => onUpdateProject({ title: e.target.value })}
            className="bg-transparent text-white font-bold font-display text-sm focus:outline-none border-b border-transparent focus:border-neon-cyan transition-colors"
          />
        </div>

        {/* ASPECT RATIO PRESETS DROPDOWN */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-gray-500 text-[10px] uppercase">Preset:</span>
          <select
            value={project.aspectRatioPreset}
            onChange={(e) => handlePresetChange(e.target.value)}
            className="bg-black border border-white/15 rounded-lg px-2 py-1 text-neon-cyan font-bold text-[11px] focus:outline-none"
          >
            {CANVAS_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.width}x{p.height})
              </option>
            ))}
          </select>
        </div>

        {/* FPS SELECTOR */}
        <div className="hidden md:flex items-center gap-1.5">
          <span className="text-gray-500 text-[10px] uppercase">FPS:</span>
          <select
            value={project.fps}
            onChange={(e) => onUpdateProject({ fps: Number(e.target.value) })}
            className="bg-black border border-white/15 rounded-lg px-2 py-1 text-gray-300 font-bold text-[11px] focus:outline-none"
          >
            <option value={24}>24 FPS</option>
            <option value={30}>30 FPS</option>
            <option value={60}>60 FPS</option>
          </select>
        </div>
      </div>

      {/* RIGHT: UNDO/REDO & EXPORT */}
      <div className="flex items-center gap-3">
        {/* UNDO / REDO */}
        <div className="flex items-center gap-1 border-r border-white/10 pr-3">
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-1.5 rounded-lg ${
              canUndo ? "hover:bg-white/10 text-gray-300" : "text-gray-600 opacity-40"
            }`}
            title="Undo"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo}
            className={`p-1.5 rounded-lg ${
              canRedo ? "hover:bg-white/10 text-gray-300" : "text-gray-600 opacity-40"
            }`}
            title="Redo"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-1.5 text-[10px] text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Autosaved</span>
        </div>

        {/* EXPORT BUTTON */}
        <button
          type="button"
          onClick={onOpenExportModal}
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-bold text-xs uppercase flex items-center gap-1.5 hover:shadow-[0_0_15px_rgba(0,245,255,0.5)] transition-all shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Video</span>
        </button>
      </div>
    </div>
  );
};

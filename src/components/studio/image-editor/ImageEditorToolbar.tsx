import React from "react";
import {
  Undo2,
  Redo2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Hand,
  Grid,
  Ruler,
  ShieldAlert,
  Download,
  Send,
  History,
  SlidersHorizontal,
  Crop,
  Sparkles,
  Palette,
  Layers,
  Type,
  ImageIcon,
} from "lucide-react";
import { ImageEditorTool } from "../../../types/imageEditor";

interface ImageEditorToolbarProps {
  activeTool: ImageEditorTool;
  setActiveTool: (tool: ImageEditorTool) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  zoom: number;
  setZoom: (zoom: number | ((prev: number) => number)) => void;
  isPanMode: boolean;
  setIsPanMode: (pan: boolean | ((prev: boolean) => boolean)) => void;
  showRulers: boolean;
  setShowRulers: (r: boolean | ((prev: boolean) => boolean)) => void;
  showGrid: boolean;
  setShowGrid: (g: boolean | ((prev: boolean) => boolean)) => void;
  showSafeMargins: boolean;
  setShowSafeMargins: (s: boolean | ((prev: boolean) => boolean)) => void;
  onOpenHistory: () => void;
  onOpenExport: () => void;
  onSendToDesigner: () => void;
}

export function ImageEditorToolbar({
  activeTool,
  setActiveTool,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onReset,
  zoom,
  setZoom,
  isPanMode,
  setIsPanMode,
  showRulers,
  setShowRulers,
  showGrid,
  setShowGrid,
  showSafeMargins,
  setShowSafeMargins,
  onOpenHistory,
  onOpenExport,
  onSendToDesigner,
}: ImageEditorToolbarProps) {
  const toolButtons: { id: ImageEditorTool; label: string; icon: any }[] = [
    { id: "adjust", label: "Adjust", icon: SlidersHorizontal },
    { id: "crop", label: "Crop & Transform", icon: Crop },
    { id: "effects", label: "Effects & Filters", icon: Sparkles },
    { id: "background", label: "Background", icon: Palette },
    { id: "layers", label: "Layers", icon: Layers },
    { id: "text_shapes", label: "Text & Shapes", icon: Type },
    { id: "presets", label: "Presets", icon: ImageIcon },
  ];

  return (
    <div className="bg-neutral-950 border-b border-white/10 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono select-none">
      {/* LEFT: MAIN TOOL TABS */}
      <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pb-1">
        {toolButtons.map((tb) => {
          const Icon = tb.icon;
          const isActive = activeTool === tb.id;
          return (
            <button
              key={tb.id}
              type="button"
              onClick={() => setActiveTool(tb.id)}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
                isActive
                  ? "bg-neon-purple text-white font-bold shadow-lg shadow-neon-purple/30"
                  : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tb.label}</span>
            </button>
          );
        })}
      </div>

      {/* CENTER: UNDO/REDO & ZOOM & CANVAS CONTROLS */}
      <div className="flex items-center gap-2">
        {/* UNDO / REDO */}
        <div className="flex items-center bg-black/60 border border-white/10 rounded-xl p-0.5">
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-300 disabled:opacity-30 disabled:hover:bg-transparent"
            title="Undo (Cmd+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo}
            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-300 disabled:opacity-30 disabled:hover:bg-transparent"
            title="Redo (Cmd+Y)"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onReset}
            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-red-400 border-l border-white/10"
            title="Reset All Edits to Original"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* ZOOM CONTROLS */}
        <div className="flex items-center bg-black/60 border border-white/10 rounded-xl p-0.5">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.2, z - 0.1))}
            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-300"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="px-2 text-[11px] font-bold text-white w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(4, z + 0.1))}
            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-300"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setZoom(1)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white border-l border-white/10"
            title="Reset Zoom to 100%"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* PAN & TOGGLES */}
        <div className="flex items-center bg-black/60 border border-white/10 rounded-xl p-0.5">
          <button
            type="button"
            onClick={() => setIsPanMode((p) => !p)}
            className={`p-1.5 rounded-lg transition-colors ${
              isPanMode ? "bg-neon-purple text-white font-bold" : "text-gray-400 hover:text-white"
            }`}
            title="Hand / Pan Canvas Mode"
          >
            <Hand className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setShowRulers((r) => !r)}
            className={`p-1.5 rounded-lg transition-colors ${
              showRulers ? "bg-neon-purple text-white" : "text-gray-400 hover:text-white"
            }`}
            title="Toggle Rulers"
          >
            <Ruler className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setShowGrid((g) => !g)}
            className={`p-1.5 rounded-lg transition-colors ${
              showGrid ? "bg-neon-purple text-white" : "text-gray-400 hover:text-white"
            }`}
            title="Toggle Alignment Grid"
          >
            <Grid className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setShowSafeMargins((s) => !s)}
            className={`p-1.5 rounded-lg transition-colors ${
              showSafeMargins ? "bg-neon-purple text-white" : "text-gray-400 hover:text-white"
            }`}
            title="Toggle Safe Margins Overlay"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* HISTORY */}
        <button
          type="button"
          onClick={onOpenHistory}
          className="p-2 rounded-xl bg-black/60 border border-white/10 hover:border-neon-purple text-gray-300 hover:text-white"
          title="Edit History & Snapshots"
        >
          <History className="w-4 h-4" />
        </button>
      </div>

      {/* RIGHT: EXPORT & OPEN IN DESIGNER */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onSendToDesigner}
          className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 text-white font-display font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5"
        >
          <Send className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Designer</span>
        </button>

        <button
          type="button"
          onClick={onOpenExport}
          className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-neon-purple to-neon-pink text-white font-display font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export HD</span>
        </button>
      </div>
    </div>
  );
}

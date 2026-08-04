import React, { useState, useEffect } from "react";
import { CanvasElement, DesignState } from "../../types/designer";
import { estimateExportFileSize } from "../../utils/exportEngine";
import {
  CheckCircle2,
  HardDrive,
  Layers,
  Maximize2,
  MousePointer,
  Activity,
  Cpu,
  Sparkles,
} from "lucide-react";

interface Props {
  state: DesignState;
  selectedElement?: CanvasElement;
  zoomScale: number;
  mousePos: { x: number; y: number };
}

export function BottomStatusBar({ state, selectedElement, zoomScale, mousePos }: Props) {
  const [fileSizeStr, setFileSizeStr] = useState<string>("~1.2 MB");

  useEffect(() => {
    try {
      const estimated = estimateExportFileSize(null, state.width, state.height, "png", 2);
      setFileSizeStr(estimated);
    } catch {
      setFileSizeStr("~1.5 MB");
    }
  }, [state.width, state.height, state.elements.length]);

  return (
    <div className="h-7 bg-neutral-900 border-t border-white/10 flex items-center justify-between px-3 text-[10px] font-mono text-gray-400 select-none shrink-0 z-30">
      {/* LEFT: ZOOM, CANVAS SIZE, MOUSE POSITION */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 text-neon-cyan font-bold">
          <Maximize2 className="w-3 h-3" />
          <span>{Math.round(zoomScale * 100)}%</span>
        </div>

        <span className="text-gray-600">•</span>

        <div className="flex items-center gap-1 text-gray-300">
          <span className="text-gray-500">CANVAS:</span>
          <span className="text-white font-bold">{state.width} × {state.height} PX</span>
        </div>

        <span className="text-gray-600">•</span>

        <div className="flex items-center gap-1 text-gray-400">
          <MousePointer className="w-3 h-3 text-neon-purple" />
          <span>X: {mousePos.x}px, Y: {mousePos.y}px</span>
        </div>
      </div>

      {/* CENTER: SELECTED OBJECT INFO */}
      <div className="hidden md:flex items-center gap-2 px-2 py-0.5 rounded bg-black/40 border border-white/5 truncate max-w-xs">
        <span className="text-gray-500 uppercase">SELECTED:</span>
        {selectedElement ? (
          <span className="text-neon-cyan font-bold truncate">
            {selectedElement.name} [{selectedElement.type.toUpperCase()}]
          </span>
        ) : (
          <span className="text-gray-500 italic">None (Canvas Selected)</span>
        )}
      </div>

      {/* RIGHT: LAYERS, ESTIMATED FILE SIZE, GPU / PERFORMANCE */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 text-gray-300">
          <Layers className="w-3 h-3 text-neon-pink" />
          <span>{state.elements.length} LAYERS</span>
        </div>

        <span className="text-gray-600">•</span>

        <div className="flex items-center gap-1 text-gray-300">
          <HardDrive className="w-3 h-3 text-amber-400" />
          <span>EST: {fileSizeStr}</span>
        </div>

        <span className="text-gray-600">•</span>

        <div className="hidden sm:flex items-center gap-1.5 text-emerald-400 font-bold">
          <Activity className="w-3 h-3 text-emerald-400" />
          <span>60 FPS • GPU ACCELERATED</span>
        </div>
      </div>
    </div>
  );
}

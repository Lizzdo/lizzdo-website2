import React from "react";
import { Eye, EyeOff, Lock, Unlock, Layers, MoveUp, MoveDown } from "lucide-react";
import { LayerItem } from "../../types/designer";

interface LayerManagerProps {
  layers: LayerItem[];
  onToggleVisibility: (layerId: string) => void;
  onToggleLock: (layerId: string) => void;
  onMoveLayer: (index: number, direction: "up" | "down") => void;
  selectedLayerId?: string;
  onSelectLayer?: (layerId: string) => void;
}

export default function LayerManager({
  layers,
  onToggleVisibility,
  onToggleLock,
  onMoveLayer,
  selectedLayerId,
  onSelectLayer,
}: LayerManagerProps) {
  return (
    <div className="bg-slate-950 border border-white/10 rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-gray-400 pb-2 border-b border-white/10">
        <Layers size={14} className="text-neon-cyan" />
        <span>Canvas Layers ({layers.length})</span>
      </div>

      <div className="space-y-2">
        {layers.map((layer, index) => {
          const isSelected = selectedLayerId === layer.id;
          return (
            <div
              key={layer.id}
              onClick={() => onSelectLayer?.(layer.id)}
              className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all ${
                isSelected
                  ? "bg-slate-900 border-neon-cyan text-white shadow-[0_0_10px_rgba(0,245,255,0.2)]"
                  : "bg-slate-900/60 border-white/5 text-gray-300 hover:border-white/20"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-2 h-2 rounded-full bg-neon-cyan/50 shrink-0" />
                <span className="font-future truncate">{layer.name}</span>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {/* Move Up */}
                <button
                  disabled={index === 0}
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveLayer(index, "up");
                  }}
                  className="p-1 text-gray-500 hover:text-white disabled:opacity-30 transition-colors"
                  title="Move Up"
                >
                  <MoveUp size={12} />
                </button>

                {/* Move Down */}
                <button
                  disabled={index === layers.length - 1}
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveLayer(index, "down");
                  }}
                  className="p-1 text-gray-500 hover:text-white disabled:opacity-30 transition-colors"
                  title="Move Down"
                >
                  <MoveDown size={12} />
                </button>

                {/* Visibility */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleVisibility(layer.id);
                  }}
                  className={`p-1 transition-colors ${
                    layer.visible ? "text-neon-cyan" : "text-gray-600"
                  }`}
                  title={layer.visible ? "Hide Layer" : "Show Layer"}
                >
                  {layer.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>

                {/* Lock */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleLock(layer.id);
                  }}
                  className={`p-1 transition-colors ${
                    layer.locked ? "text-neon-orange" : "text-gray-600"
                  }`}
                  title={layer.locked ? "Unlock Layer" : "Lock Layer"}
                >
                  {layer.locked ? <Lock size={14} /> : <Unlock size={14} />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

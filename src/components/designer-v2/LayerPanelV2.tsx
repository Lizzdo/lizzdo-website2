import React from "react";
import {
  Layers,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Type,
  Image,
  Square,
  Sparkles,
  BadgeAlert,
  Sliders,
} from "lucide-react";
import { V2Artboard } from "../../types/designerV2";
import { CanvasElement } from "../../types/designer";

interface LayerPanelV2Props {
  artboard: V2Artboard;
  selectedElementId: string | null;
  onSelectElement: (elementId: string | null) => void;
  onUpdateElement: (elementId: string, updates: Partial<CanvasElement>) => void;
  onDeleteElement: (elementId: string) => void;
  onDuplicateElement: (elementId: string) => void;
  onReorderElementZIndex: (elementId: string, direction: "up" | "down") => void;
}

export default function LayerPanelV2({
  artboard,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
  onReorderElementZIndex,
}: LayerPanelV2Props) {
  const elements = artboard.state.elements || [];
  // Sort descending by zIndex for top-to-bottom rendering in Layer Tree
  const sortedElements = [...elements].sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0));

  const getElementIcon = (type: CanvasElement["type"]) => {
    switch (type) {
      case "text":
        return <Type className="w-3.5 h-3.5 text-neon-cyan" />;
      case "image":
        return <Image className="w-3.5 h-3.5 text-neon-purple" />;
      case "shape":
        return <Square className="w-3.5 h-3.5 text-amber-400" />;
      case "badge":
        return <BadgeAlert className="w-3.5 h-3.5 text-neon-pink" />;
      case "button":
        return <Sparkles className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Layers className="w-3.5 h-3.5 text-gray-400" />;
    }
  };

  return (
    <div className="w-full h-full bg-black/95 text-white p-3 flex flex-col gap-3 font-mono text-xs select-none">
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-neon-cyan" />
          <span className="font-display font-bold uppercase tracking-wider text-xs">Layer Tree</span>
        </div>
        <span className="text-[10px] text-gray-400 bg-white/5 px-2 py-0.5 rounded-full">
          {elements.length} Layers
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1 pr-1">
        {sortedElements.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-[11px]">
            No elements on this artboard. Add text or shapes from the left toolbar.
          </div>
        ) : (
          sortedElements.map((el) => {
            const isSelected = selectedElementId === el.id;
            return (
              <div
                key={el.id}
                onClick={() => onSelectElement(el.id)}
                className={`p-2 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-all ${
                  isSelected
                    ? "bg-neon-cyan/20 border-neon-cyan/60 text-white shadow-[0_0_10px_rgba(0,245,255,0.2)]"
                    : "bg-white/5 border-white/10 hover:bg-white/10 text-gray-300"
                }`}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {getElementIcon(el.type)}
                  <span className="truncate font-medium text-xs">
                    {el.name || el.text || `${el.type.toUpperCase()} Layer`}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {/* Reorder Z-Index Buttons */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onReorderElementZIndex(el.id, "up");
                    }}
                    className="p-1 hover:bg-white/20 rounded text-gray-400 hover:text-white"
                    title="Bring Forward"
                  >
                    <ChevronUp className="w-3 h-3" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onReorderElementZIndex(el.id, "down");
                    }}
                    className="p-1 hover:bg-white/20 rounded text-gray-400 hover:text-white"
                    title="Send Backward"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  {/* Toggle Visibility */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateElement(el.id, { visible: !el.visible });
                    }}
                    className="p-1 hover:bg-white/20 rounded text-gray-400 hover:text-white"
                    title={el.visible ? "Hide Layer" : "Show Layer"}
                  >
                    {el.visible ? <Eye className="w-3 h-3 text-neon-cyan" /> : <EyeOff className="w-3 h-3 text-gray-600" />}
                  </button>

                  {/* Toggle Lock */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateElement(el.id, { locked: !el.locked });
                    }}
                    className="p-1 hover:bg-white/20 rounded text-gray-400 hover:text-white"
                    title={el.locked ? "Unlock Layer" : "Lock Layer"}
                  >
                    {el.locked ? <Lock className="w-3 h-3 text-amber-400" /> : <Unlock className="w-3 h-3 text-gray-500" />}
                  </button>

                  {/* Duplicate */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicateElement(el.id);
                    }}
                    className="p-1 hover:bg-white/20 rounded text-gray-400 hover:text-white"
                    title="Duplicate Layer"
                  >
                    <Copy className="w-3 h-3" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteElement(el.id);
                    }}
                    className="p-1 hover:bg-red-500/30 rounded text-gray-400 hover:text-red-400"
                    title="Delete Layer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

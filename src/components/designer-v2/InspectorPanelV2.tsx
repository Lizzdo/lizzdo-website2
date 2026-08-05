import React from "react";
import { Sliders, Type, Palette, Maximize, RotateCw, Layers, Sparkles, Square, LayoutGrid, Eye } from "lucide-react";
import { V2Artboard } from "../../types/designerV2";
import { CanvasElement, DesignState } from "../../types/designer";

interface InspectorPanelV2Props {
  artboard: V2Artboard;
  selectedElementId: string | null;
  onUpdateElement: (elementId: string, updates: Partial<CanvasElement>) => void;
  onUpdateArtboardState: (artboardId: string, updates: Partial<DesignState>) => void;
}

export default function InspectorPanelV2({
  artboard,
  selectedElementId,
  onUpdateElement,
  onUpdateArtboardState,
}: InspectorPanelV2Props) {
  const elements = artboard.state.elements || [];
  const selectedElement = elements.find((el) => el.id === selectedElementId);

  // If no element selected, inspect Artboard settings
  if (!selectedElement) {
    const bg = artboard.state.background;
    return (
      <div className="w-full h-full bg-black/95 text-white p-3 flex flex-col gap-3 font-mono text-xs select-none overflow-y-auto">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-neon-cyan" />
            <span className="font-display font-bold uppercase tracking-wider text-xs">Artboard Inspector</span>
          </div>
          <span className="text-[10px] text-neon-cyan bg-neon-cyan/10 px-2 py-0.5 rounded">
            {artboard.width}x{artboard.height}px
          </span>
        </div>

        {/* Background Type Selector */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Background Mode</label>
          <select
            value={bg.type}
            onChange={(e) =>
              onUpdateArtboardState(artboard.id, {
                background: {
                  ...bg,
                  type: e.target.value as any,
                },
              })
            }
            className="w-full bg-white/5 border border-white/15 rounded-xl p-2 text-white outline-none focus:border-neon-cyan"
          >
            <option value="gradient" className="bg-black">Gradient</option>
            <option value="solid" className="bg-black">Solid Color</option>
            <option value="mesh" className="bg-black">Cyber Mesh</option>
            <option value="radial" className="bg-black">Radial Glow</option>
            <option value="image" className="bg-black">Image</option>
          </select>
        </div>

        {/* Colors */}
        {bg.type === "solid" && (
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Solid Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={bg.solidColor || "#0a0e27"}
                onChange={(e) =>
                  onUpdateArtboardState(artboard.id, {
                    background: { ...bg, solidColor: e.target.value },
                  })
                }
                className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
              />
              <input
                type="text"
                value={bg.solidColor || "#0a0e27"}
                onChange={(e) =>
                  onUpdateArtboardState(artboard.id, {
                    background: { ...bg, solidColor: e.target.value },
                  })
                }
                className="flex-1 bg-white/5 border border-white/15 rounded-xl p-2 text-white font-mono text-xs"
              />
            </div>
          </div>
        )}

        {(bg.type === "gradient" || bg.type === "radial") && (
          <div className="space-y-2">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Gradient From</label>
              <input
                type="color"
                value={bg.gradientFrom || "#0a0e27"}
                onChange={(e) =>
                  onUpdateArtboardState(artboard.id, {
                    background: { ...bg, gradientFrom: e.target.value },
                  })
                }
                className="w-full h-8 rounded-lg cursor-pointer bg-transparent"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Gradient To</label>
              <input
                type="color"
                value={bg.gradientTo || "#050814"}
                onChange={(e) =>
                  onUpdateArtboardState(artboard.id, {
                    background: { ...bg, gradientTo: e.target.value },
                  })
                }
                className="w-full h-8 rounded-lg cursor-pointer bg-transparent"
              />
            </div>
          </div>
        )}

        {/* Glassmorphism Toggle */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-white">Glassmorphism Overlay</span>
            <input
              type="checkbox"
              checked={artboard.state.showGlassPanel}
              onChange={(e) =>
                onUpdateArtboardState(artboard.id, {
                  showGlassPanel: e.target.checked,
                })
              }
              className="accent-neon-cyan w-4 h-4 cursor-pointer"
            />
          </div>

          {artboard.state.showGlassPanel && (
            <div className="space-y-2 pl-2">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>Glass Opacity</span>
                  <span>{Math.round((artboard.state.glassOpacity ?? 0.3) * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.9"
                  step="0.05"
                  value={artboard.state.glassOpacity ?? 0.3}
                  onChange={(e) =>
                    onUpdateArtboardState(artboard.id, {
                      glassOpacity: parseFloat(e.target.value),
                    })
                  }
                  className="w-full accent-neon-cyan"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Inspect Selected Element
  return (
    <div className="w-full h-full bg-black/95 text-white p-3 flex flex-col gap-3 font-mono text-xs select-none overflow-y-auto">
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-neon-cyan" />
          <span className="font-display font-bold uppercase tracking-wider text-xs">Inspector</span>
        </div>
        <span className="text-[10px] text-neon-cyan bg-neon-cyan/10 px-2 py-0.5 rounded uppercase">
          {selectedElement.type} Layer
        </span>
      </div>

      {/* Layer Name */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Layer Name</label>
        <input
          type="text"
          value={selectedElement.name || ""}
          onChange={(e) => onUpdateElement(selectedElement.id, { name: e.target.value })}
          className="w-full bg-white/5 border border-white/15 rounded-xl p-2 text-white font-mono text-xs outline-none focus:border-neon-cyan"
        />
      </div>

      {/* Transform / Geometry */}
      <div className="space-y-2 pt-2 border-t border-white/10">
        <span className="font-bold text-xs text-neon-cyan flex items-center gap-1.5">
          <Maximize className="w-3.5 h-3.5" /> Position & Size
        </span>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-[10px] text-gray-400">Position X (%)</label>
            <input
              type="number"
              value={Math.round(selectedElement.x)}
              onChange={(e) => onUpdateElement(selectedElement.id, { x: parseFloat(e.target.value) || 0 })}
              className="w-full bg-white/5 border border-white/15 rounded-lg p-1.5 text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-gray-400">Position Y (%)</label>
            <input
              type="number"
              value={Math.round(selectedElement.y)}
              onChange={(e) => onUpdateElement(selectedElement.id, { y: parseFloat(e.target.value) || 0 })}
              className="w-full bg-white/5 border border-white/15 rounded-lg p-1.5 text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-gray-400">Width (%)</label>
            <input
              type="number"
              value={Math.round(selectedElement.width || 30)}
              onChange={(e) => onUpdateElement(selectedElement.id, { width: parseFloat(e.target.value) || 10 })}
              className="w-full bg-white/5 border border-white/15 rounded-lg p-1.5 text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-gray-400">Rotation (°)</label>
            <input
              type="number"
              value={selectedElement.rotation || 0}
              onChange={(e) => onUpdateElement(selectedElement.id, { rotation: parseFloat(e.target.value) || 0 })}
              className="w-full bg-white/5 border border-white/15 rounded-lg p-1.5 text-white"
            />
          </div>
        </div>
      </div>

      {/* Text Properties */}
      {selectedElement.type === "text" && (
        <div className="space-y-2 pt-2 border-t border-white/10">
          <span className="font-bold text-xs text-neon-cyan flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5" /> Typography
          </span>

          <div className="space-y-1">
            <label className="text-[10px] text-gray-400">Text String</label>
            <textarea
              rows={2}
              value={selectedElement.text || ""}
              onChange={(e) => onUpdateElement(selectedElement.id, { text: e.target.value })}
              className="w-full bg-white/5 border border-white/15 rounded-xl p-2 text-white font-mono text-xs outline-none focus:border-neon-cyan"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[10px] text-gray-400">Font Family</label>
              <select
                value={selectedElement.fontFamily || "Inter"}
                onChange={(e) => onUpdateElement(selectedElement.id, { fontFamily: e.target.value as any })}
                className="w-full bg-white/5 border border-white/15 rounded-lg p-1.5 text-white"
              >
                <option value="Orbitron" className="bg-black">Orbitron</option>
                <option value="Rajdhani" className="bg-black">Rajdhani</option>
                <option value="Space Mono" className="bg-black">Space Mono</option>
                <option value="Inter" className="bg-black">Inter</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-gray-400">Font Size (px)</label>
              <input
                type="number"
                value={selectedElement.fontSize || 24}
                onChange={(e) => onUpdateElement(selectedElement.id, { fontSize: parseInt(e.target.value) || 12 })}
                className="w-full bg-white/5 border border-white/15 rounded-lg p-1.5 text-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-gray-400">Cyber Gradient Text</span>
            <input
              type="checkbox"
              checked={selectedElement.gradientText ?? false}
              onChange={(e) => onUpdateElement(selectedElement.id, { gradientText: e.target.checked })}
              className="accent-neon-cyan w-4 h-4 cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Opacity Slider */}
      <div className="space-y-1.5 pt-2 border-t border-white/10">
        <div className="flex justify-between text-[10px] text-gray-400">
          <span>Opacity</span>
          <span>{Math.round((selectedElement.opacity ?? 1) * 100)}%</span>
        </div>
        <input
          type="range"
          min="0.1"
          max="1.0"
          step="0.05"
          value={selectedElement.opacity ?? 1}
          onChange={(e) => onUpdateElement(selectedElement.id, { opacity: parseFloat(e.target.value) })}
          className="w-full accent-neon-cyan"
        />
      </div>
    </div>
  );
}

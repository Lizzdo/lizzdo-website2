import React from "react";
import { CanvasElement, ElementType } from "../../types/designer";
import {
  Type,
  Tag,
  Image as ImageIcon,
  MousePointer,
  Square,
  Shield,
  Eye,
  EyeOff,
  Trash2,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Palette,
  Sliders,
  Maximize2,
  RotateCw,
} from "lucide-react";

interface ElementInspectorProps {
  element: CanvasElement;
  onChange: (updated: CanvasElement) => void;
  onDelete: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
}

const COLOR_PRESETS = [
  "#00f5ff", // Neon Cyan
  "#a855f7", // Neon Purple
  "#ff006e", // Neon Pink
  "#00ff88", // Neon Emerald
  "#ff9500", // Neon Orange
  "#ffffff", // White
  "#9ca3af", // Muted Gray
  "#000000", // Pure Black
];

export const ElementInspector: React.FC<ElementInspectorProps> = ({
  element,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
}) => {
  const updateProp = <K extends keyof CanvasElement>(key: K, value: CanvasElement[K]) => {
    onChange({ ...element, [key]: value });
  };

  return (
    <div className="space-y-6 text-sm text-gray-300">
      {/* Header & Quick Action */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          {element.type === "text" && <Type className="w-4 h-4 text-neon-cyan" />}
          {element.type === "badge" && <Tag className="w-4 h-4 text-neon-purple" />}
          {element.type === "image" && <ImageIcon className="w-4 h-4 text-neon-pink" />}
          {element.type === "button" && <MousePointer className="w-4 h-4 text-neon-green" />}
          {element.type === "logo" && <Shield className="w-4 h-4 text-neon-orange" />}
          {element.type === "shape" && <Square className="w-4 h-4 text-cyan-400" />}

          <input
            type="text"
            value={element.name}
            onChange={(e) => updateProp("name", e.target.value)}
            className="bg-transparent border-b border-transparent hover:border-white/20 focus:border-neon-cyan px-1 py-0.5 text-white font-bold font-display text-sm focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onMoveUp(element.id)}
            title="Move Layer Up"
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onMoveDown(element.id)}
            title="Move Layer Down"
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => updateProp("visible", !element.visible)}
            title={element.visible ? "Hide Element" : "Show Element"}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            {element.visible ? <Eye className="w-3.5 h-3.5 text-neon-cyan" /> : <EyeOff className="w-3.5 h-3.5 text-gray-500" />}
          </button>
          <button
            onClick={() => onDelete(element.id)}
            title="Delete Element"
            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* CONTENT FIELDS */}
      {(element.type === "text" || element.type === "badge" || element.type === "button" || element.type === "logo") && (
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wider font-mono text-gray-400">Content Text</label>
          {element.type === "text" ? (
            <textarea
              rows={3}
              value={element.text || ""}
              onChange={(e) => updateProp("text", e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-neon-cyan focus:outline-none font-sans text-sm"
              placeholder="Enter text..."
            />
          ) : (
            <input
              type="text"
              value={element.text || ""}
              onChange={(e) => updateProp("text", e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-white focus:border-neon-cyan focus:outline-none text-sm font-sans"
              placeholder="Enter text label..."
            />
          )}
        </div>
      )}

      {/* IMAGE SPECIFIC CONTROLS */}
      {element.type === "image" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider font-mono text-gray-400">Image Source URL</label>
            <input
              type="text"
              value={element.url || ""}
              onChange={(e) => updateProp("url", e.target.value)}
              placeholder="https://..."
              className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:border-neon-cyan focus:outline-none font-mono"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider font-mono text-gray-400">Or Upload Image File</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    if (event.target?.result) {
                      updateProp("url", event.target.result as string);
                    }
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="w-full text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-neon-cyan/20 file:text-neon-cyan hover:file:bg-neon-cyan/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 font-mono block mb-1">Fit Mode</label>
              <select
                value={element.fitMode || "smart"}
                onChange={(e) => updateProp("fitMode", e.target.value as any)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:border-neon-cyan focus:outline-none"
              >
                <option value="smart">Smart Cover</option>
                <option value="cover">Crop Fill (Cover)</option>
                <option value="contain">Fit Frame (Contain)</option>
                <option value="fill">Stretch Fill</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 font-mono block mb-1">Scale ({Math.round((element.scale || 1) * 100)}%)</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.05"
                value={element.scale || 1}
                onChange={(e) => updateProp("scale", parseFloat(e.target.value))}
                className="w-full accent-neon-cyan"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 font-mono block mb-1">Pan X Offset ({element.xOffset || 0}px)</label>
              <input
                type="range"
                min="-200"
                max="200"
                value={element.xOffset || 0}
                onChange={(e) => updateProp("xOffset", parseInt(e.target.value))}
                className="w-full accent-neon-cyan"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 font-mono block mb-1">Pan Y Offset ({element.yOffset || 0}px)</label>
              <input
                type="range"
                min="-200"
                max="200"
                value={element.yOffset || 0}
                onChange={(e) => updateProp("yOffset", parseInt(e.target.value))}
                className="w-full accent-neon-cyan"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 font-mono block mb-1">Glow Aura</label>
              <select
                value={element.shadowGlow || "none"}
                onChange={(e) => updateProp("shadowGlow", e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:border-neon-cyan focus:outline-none"
              >
                <option value="none">None</option>
                <option value="cyan">Neon Cyan</option>
                <option value="purple">Neon Purple</option>
                <option value="pink">Neon Pink</option>
                <option value="orange">Neon Orange</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 font-mono block mb-1">Corner Radius ({element.borderRadius ?? 16}px)</label>
              <input
                type="range"
                min="0"
                max="48"
                value={element.borderRadius ?? 16}
                onChange={(e) => updateProp("borderRadius", parseInt(e.target.value))}
                className="w-full accent-neon-cyan"
              />
            </div>
          </div>

          <div className="pt-1 flex items-center gap-2">
            <button
              type="button"
              onClick={() => onChange({ ...element, scale: 1, xOffset: 0, yOffset: 0 })}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-gray-300 hover:text-white transition-colors flex items-center gap-1"
            >
              Reset Image Alignment
            </button>
          </div>
        </div>
      )}

      {/* TYPOGRAPHY CONTROLS FOR TEXT & BUTTONS */}
      {(element.type === "text" || element.type === "badge" || element.type === "button") && (
        <div className="space-y-4 pt-2 border-t border-white/10">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-neon-cyan">
            <Type className="w-3.5 h-3.5" /> Typography & Style
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 font-mono block mb-1">Font Family</label>
              <select
                value={element.fontFamily || "Orbitron"}
                onChange={(e) => updateProp("fontFamily", e.target.value as any)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:border-neon-cyan focus:outline-none"
              >
                <option value="Orbitron">Orbitron (Display Header)</option>
                <option value="Rajdhani">Rajdhani (Future Subtitle)</option>
                <option value="Inter">Inter (Clean Body)</option>
                <option value="Space Mono">Space Mono (Tech Code)</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-400 font-mono block mb-1">Font Weight</label>
              <select
                value={element.fontWeight || "bold"}
                onChange={(e) => updateProp("fontWeight", e.target.value as any)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:border-neon-cyan focus:outline-none"
              >
                <option value="normal">Normal (400)</option>
                <option value="semibold">SemiBold (600)</option>
                <option value="bold">Bold (700)</option>
                <option value="black">Black Heavy (900)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 font-mono block mb-1">Font Size ({element.fontSize || 16}px)</label>
              <input
                type="range"
                min="10"
                max="80"
                value={element.fontSize || 16}
                onChange={(e) => updateProp("fontSize", parseInt(e.target.value))}
                className="w-full accent-neon-cyan"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 font-mono block mb-1">Letter Spacing ({element.letterSpacing || 0}px)</label>
              <input
                type="range"
                min="0"
                max="10"
                value={element.letterSpacing || 0}
                onChange={(e) => updateProp("letterSpacing", parseInt(e.target.value))}
                className="w-full accent-neon-cyan"
              />
            </div>
          </div>

          {element.type === "text" && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10">
              <span className="text-xs font-mono uppercase text-gray-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-neon-purple" /> Holographic Gradient
              </span>
              <button
                type="button"
                onClick={() => updateProp("gradientText", !element.gradientText)}
                className={`w-10 h-5 rounded-full p-0.5 transition-colors ${
                  element.gradientText ? "bg-neon-purple" : "bg-white/20"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    element.gradientText ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          )}
        </div>
      )}

      {/* COLOR PICKER & PRESETS */}
      <div className="space-y-3 pt-2 border-t border-white/10">
        <label className="text-xs font-mono uppercase text-neon-cyan block">Color & Palette</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={element.color || element.textColor || "#ffffff"}
            onChange={(e) => {
              if (element.type === "text") updateProp("color", e.target.value);
              else updateProp("textColor", e.target.value);
            }}
            className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0"
          />
          <div className="flex items-center gap-1.5 flex-wrap">
            {COLOR_PRESETS.map((hex) => (
              <button
                key={hex}
                onClick={() => {
                  if (element.type === "text") updateProp("color", hex);
                  else updateProp("textColor", hex);
                }}
                style={{ backgroundColor: hex }}
                className="w-6 h-6 rounded-full border border-white/20 hover:scale-110 transition-transform"
              />
            ))}
          </div>
        </div>
      </div>

      {/* POSITION & OPACITY CONTROLS */}
      <div className="space-y-4 pt-2 border-t border-white/10">
        <div className="flex items-center gap-2 text-xs font-mono uppercase text-neon-cyan">
          <Sliders className="w-3.5 h-3.5" /> Position & Opacity
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-400 font-mono block mb-1">X Position ({element.x}%)</label>
            <input
              type="range"
              min="0"
              max="90"
              value={element.x}
              onChange={(e) => updateProp("x", parseInt(e.target.value))}
              className="w-full accent-neon-cyan"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 font-mono block mb-1">Y Position ({element.y}%)</label>
            <input
              type="range"
              min="0"
              max="90"
              value={element.y}
              onChange={(e) => updateProp("y", parseInt(e.target.value))}
              className="w-full accent-neon-cyan"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-400 font-mono block mb-1">Align & Snap to Guides</label>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => updateProp("x", 50)}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-mono text-neon-cyan"
            >
              Center X (50%)
            </button>
            <button
              type="button"
              onClick={() => updateProp("y", 50)}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-mono text-neon-cyan"
            >
              Center Y (50%)
            </button>
            <button
              type="button"
              onClick={() => {
                onChange({ ...element, x: 50, y: 50 });
              }}
              className="px-2.5 py-1 rounded-lg bg-neon-cyan/20 border border-neon-cyan/40 text-[10px] font-mono font-bold text-neon-cyan"
            >
              Center Canvas
            </button>
            <button
              type="button"
              onClick={() => updateProp("x", 6)}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-mono text-gray-300"
            >
              Left Margin (6%)
            </button>
            <button
              type="button"
              onClick={() => updateProp("y", 8)}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-mono text-gray-300"
            >
              Top Safe (8%)
            </button>
            <button
              type="button"
              onClick={() => updateProp("y", 80)}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-mono text-gray-300"
            >
              Bottom Safe (80%)
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-400 font-mono block mb-1">
            Element Opacity ({Math.round((element.opacity ?? 1) * 100)}%)
          </label>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={element.opacity ?? 1}
            onChange={(e) => updateProp("opacity", parseFloat(e.target.value))}
            className="w-full accent-neon-cyan"
          />
        </div>
      </div>
    </div>
  );
};

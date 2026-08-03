import React from "react";
import { DesignState, CanvasPresetId } from "../../types/designer";
import { CANVAS_PRESETS } from "../../data/designerTemplates";
import { Monitor, Layout, Image as ImageIcon, Sparkles, Sliders, Shield } from "lucide-react";

interface BackgroundInspectorProps {
  state: DesignState;
  onChange: (updatedState: DesignState) => void;
}

const BG_SOLID_PRESETS = [
  "#020617", // Midnight Slate
  "#090d16", // Deep Cyber Dark
  "#000000", // Pure Black
  "#120024", // Deep Neon Purple
  "#001a10", // Emerald Dark
  "#1a0800", // Amber Ember Dark
];

export const BackgroundInspector: React.FC<BackgroundInspectorProps> = ({ state, onChange }) => {
  const { background, width, height, preset, showCyberBorders, showGlassPanel, glassOpacity, glassBlur } = state;

  const updateBackground = (updatedBg: Partial<typeof background>) => {
    onChange({
      ...state,
      background: { ...background, ...updatedBg },
    });
  };

  const handlePresetChange = (presetId: CanvasPresetId) => {
    const found = CANVAS_PRESETS.find((p) => p.id === presetId);
    if (found) {
      onChange({
        ...state,
        preset: presetId,
        width: found.width,
        height: found.height,
      });
    } else {
      onChange({ ...state, preset: presetId });
    }
  };

  return (
    <div className="space-y-6 text-sm text-gray-300">
      {/* Canvas Dimensions & Ratio */}
      <div className="space-y-3 pb-4 border-b border-white/10">
        <label className="text-xs font-mono uppercase text-neon-cyan block font-bold flex items-center gap-1.5">
          <Monitor className="w-3.5 h-3.5" /> Canvas Presets & Aspect Ratios
        </label>

        <select
          value={preset}
          onChange={(e) => handlePresetChange(e.target.value as CanvasPresetId)}
          className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:border-neon-cyan focus:outline-none"
        >
          {CANVAS_PRESETS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.width}x{p.height} - {p.aspectRatio})
            </option>
          ))}
        </select>

        {preset === "custom" && (
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-[11px] text-gray-400 font-mono block mb-1">Width (px)</label>
              <input
                type="number"
                min="200"
                max="3840"
                value={width}
                onChange={(e) => onChange({ ...state, width: parseInt(e.target.value) || 800 })}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-white text-xs focus:border-neon-cyan font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] text-gray-400 font-mono block mb-1">Height (px)</label>
              <input
                type="number"
                min="200"
                max="3840"
                value={height}
                onChange={(e) => onChange({ ...state, height: parseInt(e.target.value) || 600 })}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-white text-xs focus:border-neon-cyan font-mono"
              />
            </div>
          </div>
        )}
      </div>

      {/* BACKGROUND TYPE SELECTOR */}
      <div className="space-y-3 pb-4 border-b border-white/10">
        <label className="text-xs font-mono uppercase text-neon-cyan block font-bold flex items-center gap-1.5">
          <Layout className="w-3.5 h-3.5" /> Background Mode
        </label>

        <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-black/60 border border-white/10">
          {(["gradient", "solid", "image", "pattern"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => updateBackground({ type })}
              className={`py-1.5 rounded-lg text-xs font-mono uppercase transition-all ${
                background.type === type
                  ? "bg-neon-cyan/20 border border-neon-cyan/40 text-neon-cyan font-bold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* SOLID COLOR CONTROLS */}
        {background.type === "solid" && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={background.solidColor}
                onChange={(e) => updateBackground({ solidColor: e.target.value })}
                className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0"
              />
              <div className="flex items-center gap-1.5 flex-wrap">
                {BG_SOLID_PRESETS.map((hex) => (
                  <button
                    key={hex}
                    onClick={() => updateBackground({ solidColor: hex })}
                    style={{ backgroundColor: hex }}
                    className="w-6 h-6 rounded-full border border-white/20 hover:scale-110 transition-transform"
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* GRADIENT CONTROLS */}
        {background.type === "gradient" && (
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-gray-400 font-mono block mb-1">Color From</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={background.gradientFrom}
                    onChange={(e) => updateBackground({ gradientFrom: e.target.value })}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={background.gradientFrom}
                    onChange={(e) => updateBackground({ gradientFrom: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-2 py-1 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-gray-400 font-mono block mb-1">Color To</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={background.gradientTo}
                    onChange={(e) => updateBackground({ gradientTo: e.target.value })}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={background.gradientTo}
                    onChange={(e) => updateBackground({ gradientTo: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-2 py-1 text-white text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-gray-400 font-mono block mb-1">Gradient Direction</label>
              <select
                value={background.gradientDirection}
                onChange={(e) => updateBackground({ gradientDirection: e.target.value })}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:border-neon-cyan focus:outline-none"
              >
                <option value="to-r">Horizontal (Left to Right)</option>
                <option value="to-br">Diagonal (Top-Left to Bottom-Right)</option>
                <option value="to-b">Vertical (Top to Bottom)</option>
                <option value="to-tr">Diagonal Up (Bottom-Left to Top-Right)</option>
              </select>
            </div>
          </div>
        )}

        {/* UPLOADED IMAGE BACKGROUND CONTROLS */}
        {background.type === "image" && (
          <div className="space-y-3 pt-2">
            <div>
              <label className="text-[11px] text-gray-400 font-mono block mb-1">Image URL</label>
              <input
                type="text"
                value={background.imageUrl || ""}
                onChange={(e) => updateBackground({ imageUrl: e.target.value })}
                placeholder="https://..."
                className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-white text-xs font-mono focus:border-neon-cyan"
              />
            </div>

            <div>
              <label className="text-[11px] text-gray-400 font-mono block mb-1">Or Upload Background Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      if (event.target?.result) {
                        updateBackground({ imageUrl: event.target.result as string });
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
                <label className="text-[11px] text-gray-400 font-mono block mb-1">Opacity ({Math.round((background.imageOpacity ?? 0.8) * 100)}%)</label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={background.imageOpacity ?? 0.8}
                  onChange={(e) => updateBackground({ imageOpacity: parseFloat(e.target.value) })}
                  className="w-full accent-neon-cyan"
                />
              </div>

              <div>
                <label className="text-[11px] text-gray-400 font-mono block mb-1">Blur ({background.imageBlur || 0}px)</label>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={background.imageBlur || 0}
                  onChange={(e) => updateBackground({ imageBlur: parseInt(e.target.value) })}
                  className="w-full accent-neon-cyan"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* BACKGROUND PATTERN OVERLAY */}
      <div className="space-y-3 pb-4 border-b border-white/10">
        <label className="text-xs font-mono uppercase text-neon-cyan block font-bold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Cyber Pattern Overlay
        </label>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-gray-400 font-mono block mb-1">Pattern Grid Style</label>
            <select
              value={background.pattern}
              onChange={(e) => updateBackground({ pattern: e.target.value as any })}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:border-neon-cyan"
            >
              <option value="none">None</option>
              <option value="grid">Cyber Grid Lines</option>
              <option value="scanline">CRT Scanlines</option>
              <option value="dots">Matrix Dot Array</option>
              <option value="hexagons">Honeycomb Hexagons</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] text-gray-400 font-mono block mb-1">Pattern Opacity ({Math.round(background.patternOpacity * 100)}%)</label>
            <input
              type="range"
              min="0"
              max="0.8"
              step="0.05"
              value={background.patternOpacity}
              onChange={(e) => updateBackground({ patternOpacity: parseFloat(e.target.value) })}
              className="w-full accent-neon-cyan"
            />
          </div>
        </div>
      </div>

      {/* FRAME OVERLAYS & GLASSMORPHISM */}
      <div className="space-y-3 pb-4 border-b border-white/10">
        <label className="text-xs font-mono uppercase text-neon-cyan block font-bold flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5" /> Frame & Glass Overlay
        </label>

        <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10">
          <span className="text-xs text-gray-300 font-mono uppercase">Neon Corner Accents</span>
          <button
            type="button"
            onClick={() => onChange({ ...state, showCyberBorders: !showCyberBorders })}
            className={`w-10 h-5 rounded-full p-0.5 transition-colors ${showCyberBorders ? "bg-neon-cyan" : "bg-white/20"}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${showCyberBorders ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10">
          <span className="text-xs text-gray-300 font-mono uppercase">Glassmorphic Inner Card</span>
          <button
            type="button"
            onClick={() => onChange({ ...state, showGlassPanel: !showGlassPanel })}
            className={`w-10 h-5 rounded-full p-0.5 transition-colors ${showGlassPanel ? "bg-neon-purple" : "bg-white/20"}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${showGlassPanel ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>

        {showGlassPanel && (
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-[11px] text-gray-400 font-mono block mb-1">Glass Opacity ({Math.round((glassOpacity ?? 0.3) * 100)}%)</label>
              <input
                type="range"
                min="0"
                max="0.8"
                step="0.05"
                value={glassOpacity ?? 0.3}
                onChange={(e) => onChange({ ...state, glassOpacity: parseFloat(e.target.value) })}
                className="w-full accent-neon-purple"
              />
            </div>

            <div>
              <label className="text-[11px] text-gray-400 font-mono block mb-1">Glass Blur ({glassBlur ?? 12}px)</label>
              <input
                type="range"
                min="0"
                max="30"
                value={glassBlur ?? 12}
                onChange={(e) => onChange({ ...state, glassBlur: parseInt(e.target.value) })}
                className="w-full accent-neon-purple"
              />
            </div>
          </div>
        )}
      </div>

      {/* CANVAS GUIDES & SAFE MARGINS */}
      <div className="space-y-3">
        <label className="text-xs font-mono uppercase text-neon-cyan block font-bold flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5" /> Editor Guides & Transparency
        </label>

        <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10">
          <span className="text-xs text-gray-300 font-mono uppercase">Center Crosshair Guides</span>
          <button
            type="button"
            onClick={() => onChange({ ...state, showGuides: !state.showGuides })}
            className={`w-10 h-5 rounded-full p-0.5 transition-colors ${state.showGuides ? "bg-neon-cyan" : "bg-white/20"}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${state.showGuides ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10">
          <span className="text-xs text-gray-300 font-mono uppercase">Safe Area Box (5%)</span>
          <button
            type="button"
            onClick={() => onChange({ ...state, showSafeMargins: !state.showSafeMargins })}
            className={`w-10 h-5 rounded-full p-0.5 transition-colors ${state.showSafeMargins ? "bg-amber-400" : "bg-white/20"}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${state.showSafeMargins ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10">
          <span className="text-xs text-gray-300 font-mono uppercase">Alignment Grid Overlay</span>
          <button
            type="button"
            onClick={() => onChange({ ...state, showGrid: !state.showGrid })}
            className={`w-10 h-5 rounded-full p-0.5 transition-colors ${state.showGrid ? "bg-neon-purple" : "bg-white/20"}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${state.showGrid ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10">
          <div>
            <span className="text-xs text-gray-300 font-mono uppercase block">Transparent Background</span>
            <span className="text-[10px] text-gray-500 font-mono">Export transparent PNG (for stickers/logos)</span>
          </div>
          <button
            type="button"
            onClick={() => onChange({ ...state, allowTransparentBackground: !state.allowTransparentBackground })}
            className={`w-10 h-5 rounded-full p-0.5 transition-colors ${state.allowTransparentBackground ? "bg-neon-pink" : "bg-white/20"}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${state.allowTransparentBackground ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

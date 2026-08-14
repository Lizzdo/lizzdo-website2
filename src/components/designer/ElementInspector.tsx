import React, { useState } from "react";
import { CanvasElement, ElementType, FilterPreset, PathAnchorPoint } from "../../types/designer";
import { detectAlphaBounds } from "../../utils/imageProcessing";
import { TypographyStudioInspector } from "./TypographyStudioInspector";
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
  Crop,
  FlipHorizontal,
  FlipVertical,
  RotateCcw,
  Sun,
  SlidersHorizontal,
  Box,
  Circle as CircleIcon,
  Scissors,
  Lock,
  Unlock,
  Move,
  AlignCenter,
  AlignLeft,
  AlignRight,
  AlignJustify,
  Italic,
  Underline,
  Sparkle,
  Layers,
  Sparkles as SparklesIcon,
} from "lucide-react";

interface ElementInspectorProps {
  element: CanvasElement | null;
  onChange: (updated: CanvasElement) => void;
  onDelete: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onOpenCropper?: () => void;
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
  onOpenCropper,
}) => {
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [comparingBeforeAfter, setComparingBeforeAfter] = useState<boolean>(false);
  const [cornersLinked, setCornersLinked] = useState<boolean>(true);

  if (!element) {
    return (
      <div className="p-6 text-center text-gray-500 font-mono text-xs space-y-3">
        <Sliders className="w-8 h-8 text-neon-cyan mx-auto animate-pulse" />
        <p className="font-bold text-gray-400">NO ELEMENT SELECTED</p>
        <p className="text-[11px] leading-relaxed">
          Select any object on the canvas or layer list to inspect and customize typography, colors, position, borders, and effects.
        </p>
      </div>
    );
  }

  const toggleSection = (id: string) => {
    setCollapsedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const updateProp = <K extends keyof CanvasElement>(key: K, value: CanvasElement[K]) => {
    onChange({ ...element, [key]: value });
  };

  const handleWidthChange = (newW: number) => {
    if (element.aspectRatioLocked && element.width && element.height && element.width > 0) {
      const ratio = element.height / element.width;
      onChange({ ...element, width: newW, height: Math.round(newW * ratio * 100) / 100 });
    } else {
      onChange({ ...element, width: newW });
    }
  };

  const handleHeightChange = (newH: number) => {
    if (element.aspectRatioLocked && element.width && element.height && element.width > 0) {
      const ratio = element.width / element.height;
      onChange({ ...element, height: newH, width: Math.round(newH * ratio * 100) / 100 });
    } else {
      onChange({ ...element, height: newH });
    }
  };

  const handleAutoTrimAlphaBounds = async () => {
    const imgSrc = element.url || element.src;
    if (!imgSrc) return;
    try {
      const bounds = await detectAlphaBounds(imgSrc);
      if (bounds) {
        onChange({
          ...element,
          crop: {
            enabled: true,
            x: bounds.x,
            y: bounds.y,
            width: bounds.width,
            height: bounds.height,
          },
        });
      }
    } catch (err) {
      console.error("Alpha bounds detection failed:", err);
    }
  };

  return (
    <div className="space-y-6 text-sm text-gray-300">
      {/* Header & Quick Action */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          {element.type === "text" && <Type className="w-4 h-4 text-neon-cyan" />}
          {element.type === "badge" && <Tag className="w-4 h-4 text-neon-purple" />}
          {element.type === "image" && <ImageIcon className="w-4 h-4 text-neon-pink" />}
          {element.type === "button" && <MousePointer className="w-4 h-4 text-emerald-400" />}
          {element.type === "logo" && <Shield className="w-4 h-4 text-amber-400" />}
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

      {/* 1. POSITION & SIZE PANEL */}
      <div className="space-y-3 bg-black/40 p-3 rounded-xl border border-white/10">
        <div className="flex items-center justify-between">
          <label className="text-[11px] uppercase font-mono text-neon-cyan font-bold flex items-center gap-1.5">
            <Move className="w-3.5 h-3.5" /> Position & Dimensions
          </label>
          <button
            type="button"
            onClick={() => updateProp("aspectRatioLocked", !element.aspectRatioLocked)}
            className={`p-1 rounded-lg border text-[10px] font-mono flex items-center gap-1 transition-all ${
              element.aspectRatioLocked
                ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan"
                : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
            }`}
            title="Lock Aspect Ratio"
          >
            {element.aspectRatioLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
            {element.aspectRatioLocked ? "Ratio Locked" : "Free Ratio"}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div>
            <label className="text-[10px] text-gray-400 block mb-1">X Position (%)</label>
            <input
              type="number"
              value={element.x}
              onChange={(e) => updateProp("x", parseFloat(e.target.value) || 0)}
              className="w-full bg-black/60 border border-white/10 rounded-lg px-2.5 py-1.5 text-white focus:border-neon-cyan focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 block mb-1">Y Position (%)</label>
            <input
              type="number"
              value={element.y}
              onChange={(e) => updateProp("y", parseFloat(e.target.value) || 0)}
              className="w-full bg-black/60 border border-white/10 rounded-lg px-2.5 py-1.5 text-white focus:border-neon-cyan focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 block mb-1">Width (%)</label>
            <input
              type="number"
              value={element.width ?? 100}
              onChange={(e) => handleWidthChange(parseFloat(e.target.value) || 1)}
              className="w-full bg-black/60 border border-white/10 rounded-lg px-2.5 py-1.5 text-white focus:border-neon-cyan focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 block mb-1">Height (%)</label>
            <input
              type="number"
              value={element.height ?? 100}
              onChange={(e) => handleHeightChange(parseFloat(e.target.value) || 1)}
              className="w-full bg-black/60 border border-white/10 rounded-lg px-2.5 py-1.5 text-white focus:border-neon-cyan focus:outline-none"
            />
          </div>
        </div>

        {/* Rotation & Flip */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-gray-400">Rotation</span>
            <span className="text-neon-cyan font-bold">{element.rotation || 0}°</span>
          </div>
          <input
            type="range"
            min="-180"
            max="180"
            value={element.rotation || 0}
            onChange={(e) => updateProp("rotation", parseInt(e.target.value))}
            className="w-full accent-neon-cyan"
          />

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => updateProp("flipX", !element.flipX)}
              className={`flex-1 py-1.5 px-2 rounded-lg border text-xs font-mono flex items-center justify-center gap-1 transition-all ${
                element.flipX
                  ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan"
                  : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
              }`}
            >
              <FlipHorizontal className="w-3.5 h-3.5" /> Flip H
            </button>
            <button
              type="button"
              onClick={() => updateProp("flipY", !element.flipY)}
              className={`flex-1 py-1.5 px-2 rounded-lg border text-xs font-mono flex items-center justify-center gap-1 transition-all ${
                element.flipY
                  ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan"
                  : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
              }`}
            >
              <FlipVertical className="w-3.5 h-3.5" /> Flip V
            </button>
          </div>
        </div>
      </div>

      {/* 2. IMAGE QUICK ACTION PRESETS */}
      {element.type === "image" && (
        <div className="space-y-2 bg-black/40 p-3 rounded-xl border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] uppercase font-mono text-neon-purple font-bold">
              Image Quick Actions
            </label>
            <button
              type="button"
              onMouseDown={() => setComparingBeforeAfter(true)}
              onMouseUp={() => setComparingBeforeAfter(false)}
              onMouseLeave={() => setComparingBeforeAfter(false)}
              className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 hover:bg-amber-400/30 transition-all"
              title="Hold to preview raw original un-edited image"
            >
              Hold: Before / After
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
            {/* REPLACE IMAGE BUTTON */}
            <label className="col-span-2 py-2 px-3 bg-neon-purple/20 hover:bg-neon-purple/30 border border-neon-purple/50 text-neon-purple font-bold rounded-xl cursor-pointer flex items-center justify-center gap-2 text-xs transition-all shadow-md group">
              <ImageIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Replace Image (Keep Frame & Styles)</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      if (ev.target?.result) {
                        const newUrl = ev.target.result as string;
                        onChange({
                          ...element,
                          url: newUrl,
                          src: newUrl,
                        });
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={handleAutoTrimAlphaBounds}
              className="py-1.5 px-2 bg-neon-cyan/10 hover:bg-neon-cyan/20 border border-neon-cyan/30 text-neon-cyan rounded-lg transition-all text-center flex items-center justify-center gap-1 text-[11px] font-bold"
              title="Auto-detect non-transparent pixels on cutout PNGs"
            >
              <Scissors className="w-3 h-3" /> Auto-Trim Bounds
            </button>

            {onOpenCropper && (
              <button
                type="button"
                onClick={onOpenCropper}
                className="py-1.5 px-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-300 hover:text-white transition-all text-center flex items-center justify-center gap-1 text-[11px]"
              >
                <Crop className="w-3 h-3 text-neon-purple" /> Interactive Crop
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                const w = element.width ?? 50;
                onChange({ ...element, x: Math.round(((100 - w) / 2) * 10) / 10 });
              }}
              className="py-1.5 px-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-300 hover:text-white transition-all text-center text-[11px]"
            >
              Center Horiz.
            </button>

            <button
              type="button"
              onClick={() => {
                const h = element.height ?? 50;
                onChange({ ...element, y: Math.round(((100 - h) / 2) * 10) / 10 });
              }}
              className="py-1.5 px-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-300 hover:text-white transition-all text-center text-[11px]"
            >
              Center Vert.
            </button>

            <button
              type="button"
              onClick={() => {
                const w = element.width ?? 50;
                const h = element.height ?? 50;
                onChange({
                  ...element,
                  x: Math.round(((100 - w) / 2) * 10) / 10,
                  y: Math.round(((100 - h) / 2) * 10) / 10,
                });
              }}
              className="py-1.5 px-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-300 hover:text-white transition-all text-center text-[11px]"
            >
              Center Both
            </button>

            <button
              type="button"
              onClick={() =>
                onChange({
                  ...element,
                  x: 0,
                  width: 100,
                  fitMode: "contain",
                })
              }
              className="py-1.5 px-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-300 hover:text-white transition-all text-center text-[11px]"
            >
              Fit Width
            </button>

            <button
              type="button"
              onClick={() =>
                onChange({
                  ...element,
                  y: 0,
                  height: 100,
                  fitMode: "contain",
                })
              }
              className="py-1.5 px-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-300 hover:text-white transition-all text-center text-[11px]"
            >
              Fit Height
            </button>

            <button
              type="button"
              onClick={() =>
                onChange({
                  ...element,
                  x: 0,
                  y: 0,
                  width: 100,
                  height: 100,
                  fitMode: "fill",
                })
              }
              className="py-1.5 px-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-300 hover:text-white transition-all text-center text-[11px]"
            >
              Fill Canvas
            </button>

            <button
              type="button"
              onClick={() =>
                onChange({
                  ...element,
                  rotation: 0,
                  scale: 1,
                  flipX: false,
                  flipY: false,
                  xOffset: 0,
                  yOffset: 0,
                })
              }
              className="py-1.5 px-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-300 hover:text-white transition-all text-center text-[11px]"
            >
              Reset Transform
            </button>
          </div>
        </div>
      )}

      {/* 3. CONTENT & TYPOGRAPHY STUDIO INSPECTOR */}
      {(element.type === "text" || element.type === "badge" || element.type === "button" || element.type === "logo") && (
        <TypographyStudioInspector
          element={element}
          onUpdateProp={updateProp}
          onUpdateProps={(updates) => {
            Object.entries(updates).forEach(([k, v]) => updateProp(k as keyof CanvasElement, v));
          }}
        />
      )}

      {/* 4. VECTOR SHAPES, DRAWINGS & PATHS INSPECTOR */}
      {(element.type === "shape" || element.type === "draw" || element.type === "path" || element.type === "line" || element.type === "arrow") && (
        <div className="space-y-4 bg-black/40 p-3 rounded-xl border border-white/10 font-mono text-xs">
          <div className="flex items-center justify-between">
            <label className="text-[11px] uppercase font-mono text-cyan-400 font-bold block">
              Vector & Graphic Properties
            </label>

            {/* Shape to Path Conversion Button */}
            {element.type === "shape" && (
              <button
                type="button"
                onClick={() => {
                  let defaultPoints: PathAnchorPoint[] = [
                    { x: 10, y: 10, type: "corner" },
                    { x: 90, y: 10, type: "corner" },
                    { x: 90, y: 90, type: "corner" },
                    { x: 10, y: 90, type: "corner" },
                  ];
                  if (element.shapeType === "triangle") {
                    defaultPoints = [
                      { x: 50, y: 10, type: "corner" },
                      { x: 90, y: 90, type: "corner" },
                      { x: 10, y: 90, type: "corner" },
                    ];
                  } else if (element.shapeType === "star") {
                    defaultPoints = [
                      { x: 50, y: 5, type: "corner" }, { x: 63, y: 35, type: "corner" }, { x: 95, y: 38, type: "corner" },
                      { x: 71, y: 60, type: "corner" }, { x: 78, y: 92, type: "corner" }, { x: 50, y: 75, type: "corner" },
                      { x: 22, y: 92, type: "corner" }, { x: 29, y: 60, type: "corner" }, { x: 5, y: 38, type: "corner" }, { x: 37, y: 35, type: "corner" }
                    ];
                  }
                  onChange({
                    ...element,
                    type: "path",
                    pathPoints: defaultPoints,
                    pathClosed: true,
                  });
                }}
                className="px-2 py-1 rounded bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 text-[10px] font-bold border border-amber-400/40 transition-all flex items-center gap-1"
                title="Convert shape into editable vector anchor points"
              >
                <Scissors className="w-3 h-3" /> Shape → Path
              </button>
            )}
          </div>

          {/* Shape Type Selector if Shape */}
          {element.type === "shape" && (
            <div>
              <label className="text-[10px] text-gray-400 block mb-1">Shape Type</label>
              <select
                value={element.shapeType || "rect"}
                onChange={(e) => updateProp("shapeType", e.target.value as any)}
                className="w-full bg-black/60 border border-white/10 rounded-lg px-2.5 py-1.5 text-white focus:border-cyan-400 focus:outline-none"
              >
                <option value="rect">Rectangle</option>
                <option value="rounded-rect">Rounded Rectangle</option>
                <option value="circle">Circle / Ellipse</option>
                <option value="triangle">Triangle</option>
                <option value="polygon">Polygon</option>
                <option value="star">Star</option>
                <option value="hexagon">Hexagon</option>
                <option value="heart">Heart</option>
                <option value="arrow">Arrow</option>
                <option value="line">Line / Divider</option>
                <option value="glow-card">Cyber Glow Panel</option>
              </select>
            </div>
          )}

          {/* Brush Controls if Freehand Drawing */}
          {element.type === "draw" && (
            <div className="space-y-2 border-b border-white/10 pb-3">
              <label className="text-[10px] text-amber-400 font-bold block">Freehand Brush Settings</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-gray-400 block mb-1">Brush Size ({element.brushSize || 4}px)</label>
                  <input
                    type="range"
                    min="1"
                    max="80"
                    value={element.brushSize || 4}
                    onChange={(e) => updateProp("brushSize", parseInt(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 block mb-1">Hardness ({Math.round((element.brushHardness ?? 1) * 100)}%)</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={element.brushHardness ?? 1}
                    onChange={(e) => updateProp("brushHardness", parseFloat(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Fill Controls (Solid / Transparent / No Fill) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px]">
              <label className="text-gray-400">Fill Color</label>
              <button
                type="button"
                onClick={() => updateProp("fillColor", element.fillColor === "transparent" || !element.fillColor ? "rgba(0,245,255,0.4)" : "transparent")}
                className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                  element.fillColor === "transparent" ? "bg-red-500/20 text-red-400" : "bg-white/10 text-gray-300"
                }`}
              >
                {element.fillColor === "transparent" ? "No Fill (Transparent)" : "Clear Fill"}
              </button>
            </div>
            {element.fillColor !== "transparent" && (
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={element.fillColor || element.bg || "#00f5ff"}
                  onChange={(e) => {
                    updateProp("fillColor", e.target.value);
                    updateProp("bg", e.target.value);
                  }}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={element.fillColor || element.bg || "#00f5ff"}
                  onChange={(e) => {
                    updateProp("fillColor", e.target.value);
                    updateProp("bg", e.target.value);
                  }}
                  className="flex-1 bg-black/60 border border-white/10 rounded-lg px-2.5 py-1.5 text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Stroke Controls (Color, Width, Style, Alignment) */}
          <div className="space-y-3 pt-2 border-t border-white/10">
            <label className="text-[10px] text-cyan-400 font-bold block">Stroke & Border</label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-gray-400 block mb-1">Stroke Width ({element.strokeWidth ?? element.borderWidth ?? 0}px)</label>
                <input
                  type="number"
                  min="0"
                  max="40"
                  value={element.strokeWidth ?? element.borderWidth ?? 0}
                  onChange={(e) => {
                    const w = parseInt(e.target.value) || 0;
                    updateProp("strokeWidth", w);
                    updateProp("borderWidth", w);
                  }}
                  className="w-full bg-black/60 border border-white/10 rounded-lg px-2.5 py-1.5 text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-400 block mb-1">Stroke Style</label>
                <select
                  value={element.borderStyle || "solid"}
                  onChange={(e) => updateProp("borderStyle", e.target.value as any)}
                  className="w-full bg-black/60 border border-white/10 rounded-lg px-2.5 py-1.5 text-white focus:border-cyan-400 focus:outline-none"
                >
                  <option value="solid">Solid</option>
                  <option value="dashed">Dashed</option>
                  <option value="dotted">Dotted</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="color"
                value={element.strokeColor || element.borderColor || "#00f5ff"}
                onChange={(e) => {
                  updateProp("strokeColor", e.target.value);
                  updateProp("borderColor", e.target.value);
                }}
                className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
              />
              <input
                type="text"
                value={element.strokeColor || element.borderColor || "#00f5ff"}
                onChange={(e) => {
                  updateProp("strokeColor", e.target.value);
                  updateProp("borderColor", e.target.value);
                }}
                className="flex-1 bg-black/60 border border-white/10 rounded-lg px-2.5 py-1.5 text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Corner Radius Controls */}
          {(element.type === "shape" || element.type === "path") && (
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between text-[10px]">
                <label className="text-gray-400 font-bold">Corner Radius</label>
                <button
                  type="button"
                  onClick={() => {
                    onChange({
                      ...element,
                      borderRadius: 0,
                      cornerRadiusTL: 0,
                      cornerRadiusTR: 0,
                      cornerRadiusBR: 0,
                      cornerRadiusBL: 0,
                    });
                  }}
                  className="px-1.5 py-0.5 rounded text-[9px] bg-white/10 hover:bg-white/20 text-gray-300 font-mono"
                  title="Reset corners to 0px square corners"
                >
                  Reset (0px Square)
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-400 w-16">Global:</span>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    value={element.borderRadius || 0}
                    onChange={(e) => {
                      const r = parseInt(e.target.value) || 0;
                      onChange({
                        ...element,
                        borderRadius: r,
                        cornerRadiusTL: r,
                        cornerRadiusTR: r,
                        cornerRadiusBR: r,
                        cornerRadiusBL: r,
                      });
                    }}
                    className="flex-1 accent-cyan-400"
                  />
                  <span className="text-[10px] font-mono text-cyan-400 w-8 text-right">{element.borderRadius || 0}px</span>
                </div>

                {/* Individual Corners Grid */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="text-[9px] text-gray-400 block">Top Left ({element.cornerRadiusTL ?? element.borderRadius ?? 0}px)</label>
                    <input
                      type="number"
                      min="0"
                      max="60"
                      value={element.cornerRadiusTL ?? element.borderRadius ?? 0}
                      onChange={(e) => updateProp("cornerRadiusTL", parseInt(e.target.value) || 0)}
                      className="w-full bg-black/60 border border-white/10 rounded px-2 py-1 text-white font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-gray-400 block">Top Right ({element.cornerRadiusTR ?? element.borderRadius ?? 0}px)</label>
                    <input
                      type="number"
                      min="0"
                      max="60"
                      value={element.cornerRadiusTR ?? element.borderRadius ?? 0}
                      onChange={(e) => updateProp("cornerRadiusTR", parseInt(e.target.value) || 0)}
                      className="w-full bg-black/60 border border-white/10 rounded px-2 py-1 text-white font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-gray-400 block">Bottom Left ({element.cornerRadiusBL ?? element.borderRadius ?? 0}px)</label>
                    <input
                      type="number"
                      min="0"
                      max="60"
                      value={element.cornerRadiusBL ?? element.borderRadius ?? 0}
                      onChange={(e) => updateProp("cornerRadiusBL", parseInt(e.target.value) || 0)}
                      className="w-full bg-black/60 border border-white/10 rounded px-2 py-1 text-white font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-gray-400 block">Bottom Right ({element.cornerRadiusBR ?? element.borderRadius ?? 0}px)</label>
                    <input
                      type="number"
                      min="0"
                      max="60"
                      value={element.cornerRadiusBR ?? element.borderRadius ?? 0}
                      onChange={(e) => updateProp("cornerRadiusBR", parseInt(e.target.value) || 0)}
                      className="w-full bg-black/60 border border-white/10 rounded px-2 py-1 text-white font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Arrow Head Controls */}
          {(element.type === "arrow" || element.shapeType === "arrow" || element.type === "line") && (
            <div className="space-y-2 pt-2 border-t border-white/10">
              <label className="text-[10px] text-amber-400 font-bold block">Arrow Heads</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] text-gray-400 block mb-1">Start Head</label>
                  <select
                    value={element.arrowStartHead || "none"}
                    onChange={(e) => updateProp("arrowStartHead", e.target.value as any)}
                    className="w-full bg-black/60 border border-white/10 rounded px-2 py-1 text-white text-xs"
                  >
                    <option value="none">None</option>
                    <option value="arrow">Arrow</option>
                    <option value="circle">Circle</option>
                    <option value="diamond">Diamond</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] text-gray-400 block mb-1">End Head</label>
                  <select
                    value={element.arrowEndHead || "arrow"}
                    onChange={(e) => updateProp("arrowEndHead", e.target.value as any)}
                    className="w-full bg-black/60 border border-white/10 rounded px-2 py-1 text-white text-xs"
                  >
                    <option value="none">None</option>
                    <option value="arrow">Arrow</option>
                    <option value="circle">Circle</option>
                    <option value="diamond">Diamond</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. IMAGE MASKING, GLOW, SHADOW, BORDERS & SHADERS */}
      {element.type === "image" && (
        <>
          {/* BOUNDING MODE */}
          <div className="space-y-2 bg-black/40 p-3 rounded-xl border border-white/10 font-mono text-xs">
            <label className="text-[11px] uppercase text-cyan-400 font-bold block flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5" /> Bounding Mode
            </label>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-black/60 rounded-lg border border-white/10 text-[10px]">
              <button
                type="button"
                onClick={() => updateProp("boundsMode", "full")}
                className={`py-1.5 rounded transition-all ${
                  !element.boundsMode || element.boundsMode === "full"
                    ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Full Canvas Bounds
              </button>
              <button
                type="button"
                onClick={() => {
                  updateProp("boundsMode", "visible");
                  handleAutoTrimAlphaBounds();
                }}
                className={`py-1.5 rounded transition-all ${
                  element.boundsMode === "visible"
                    ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Visible Cutout Bounds
              </button>
            </div>
          </div>

          {/* COLOR & LIGHTING ADJUSTMENTS */}
          <div className="space-y-3 bg-black/40 p-3 rounded-xl border border-white/10 font-mono text-xs">
            <div className="flex items-center justify-between">
              <label className="text-[11px] uppercase text-emerald-400 font-bold flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" /> Adjustments
              </label>
              <button
                type="button"
                onClick={() =>
                  updateProp("adjustments", {
                    brightness: 0,
                    contrast: 0,
                    saturation: 0,
                    saturate: 0,
                    exposure: 0,
                    temperature: 0,
                    blur: 0,
                  })
                }
                className="px-2 py-0.5 rounded text-[9px] font-bold bg-white/10 text-gray-400 hover:text-white"
              >
                Reset
              </button>
            </div>

            <div className="space-y-2 pt-1">
              <div>
                <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                  <span>Brightness</span>
                  <span>{element.adjustments?.brightness || 0}</span>
                </div>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={element.adjustments?.brightness || 0}
                  onChange={(e) =>
                    updateProp("adjustments", { ...element.adjustments, brightness: parseInt(e.target.value) })
                  }
                  className="w-full accent-emerald-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                  <span>Contrast</span>
                  <span>{element.adjustments?.contrast || 0}</span>
                </div>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={element.adjustments?.contrast || 0}
                  onChange={(e) =>
                    updateProp("adjustments", { ...element.adjustments, contrast: parseInt(e.target.value) })
                  }
                  className="w-full accent-emerald-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                  <span>Saturation</span>
                  <span>{element.adjustments?.saturation ?? element.adjustments?.saturate ?? 0}</span>
                </div>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={element.adjustments?.saturation ?? element.adjustments?.saturate ?? 0}
                  onChange={(e) =>
                    updateProp("adjustments", { ...element.adjustments, saturation: parseInt(e.target.value) })
                  }
                  className="w-full accent-emerald-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                  <span>Exposure</span>
                  <span>{element.adjustments?.exposure || 0}</span>
                </div>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={element.adjustments?.exposure || 0}
                  onChange={(e) =>
                    updateProp("adjustments", { ...element.adjustments, exposure: parseInt(e.target.value) })
                  }
                  className="w-full accent-emerald-400"
                />
              </div>
            </div>
          </div>

          {/* PROFESSIONAL IMAGE FILTERS & INTENSITY */}
          <div className="space-y-3 bg-black/40 p-3 rounded-xl border border-white/10 font-mono text-xs">
            <label className="text-[11px] uppercase text-indigo-400 font-bold block flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-indigo-400" /> Filter Preset
            </label>
            <select
              value={element.filterPreset || "normal"}
              onChange={(e) => updateProp("filterPreset", e.target.value as any)}
              className="w-full bg-black/70 border border-white/20 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs focus:border-indigo-400 focus:outline-none"
            >
              <option value="normal">Normal (Original)</option>
              <option value="cinematic">Cinematic Movie</option>
              <option value="cyberpunk">Cyberpunk Neon</option>
              <option value="neon">Neon Boost</option>
              <option value="cold">Cold Cool Tone</option>
              <option value="warm">Warm Golden Hour</option>
              <option value="black_white">Black & White (Monochrome)</option>
              <option value="high_contrast">High Contrast Vivid</option>
              <option value="vintage">Vintage Sepia</option>
              <option value="film">Film Grain Aesthetic</option>
              <option value="moody">Moody Dark Studio</option>
              <option value="clean">Clean Minimal Bright</option>
              <option value="hdr">HDR Dynamic Range</option>
              <option value="soft">Soft Focus Glow</option>
              <option value="dramatic">Dramatic Contrast</option>
            </select>

            {element.filterPreset && element.filterPreset !== "normal" && (
              <div>
                <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                  <span>Filter Intensity</span>
                  <span>{element.filterIntensity ?? 100}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={element.filterIntensity ?? 100}
                  onChange={(e) => updateProp("filterIntensity", parseInt(e.target.value))}
                  className="w-full accent-indigo-400"
                />
              </div>
            )}
          </div>

          {/* SILHOUETTE OUTLINE */}
          <div className="space-y-3 bg-black/40 p-3 rounded-xl border border-white/10 font-mono text-xs">
            <div className="flex items-center justify-between">
              <label className="text-[11px] uppercase text-cyan-300 font-bold flex items-center gap-1.5">
                <Scissors className="w-3.5 h-3.5 text-cyan-300" /> Silhouette Outline / Stroke
              </label>
              <button
                type="button"
                onClick={() =>
                  updateProp("outline", {
                    enabled: !(element.outline?.enabled),
                    width: element.outline?.width || 4,
                    color: element.outline?.color || "#ffffff",
                    softness: element.outline?.softness || 0,
                  })
                }
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  element.outline?.enabled ? "bg-cyan-300 text-black" : "bg-white/10 text-gray-400 hover:text-white"
                }`}
              >
                {element.outline?.enabled ? "Outline ON" : "Add Outline"}
              </button>
            </div>

            {element.outline?.enabled && (
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-400 w-16">Color:</span>
                  <input
                    type="color"
                    value={element.outline.color || "#ffffff"}
                    onChange={(e) =>
                      updateProp("outline", { ...element.outline!, color: e.target.value })
                    }
                    className="w-7 h-7 rounded bg-transparent border border-white/20 cursor-pointer"
                  />
                  <div className="flex gap-1 flex-1">
                    {["#ffffff", "#00f5ff", "#a855f7", "#ff006e", "#3b82f6", "#22c55e"].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() =>
                          updateProp("outline", { ...element.outline!, color: c })
                        }
                        className="w-4 h-4 rounded-full border border-white/20 hover:scale-125 transition-transform"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Width ({element.outline.width || 4}px)</label>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={element.outline.width || 4}
                      onChange={(e) =>
                        updateProp("outline", { ...element.outline!, width: parseInt(e.target.value) })
                      }
                      className="w-full accent-cyan-300"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Softness ({element.outline.softness || 0}px)</label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={element.outline.softness || 0}
                      onChange={(e) =>
                        updateProp("outline", { ...element.outline!, softness: parseInt(e.target.value) })
                      }
                      className="w-full accent-cyan-300"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SUBJECT GLOW */}
          <div className="space-y-3 bg-black/40 p-3 rounded-xl border border-white/10 font-mono text-xs">
            <div className="flex items-center justify-between">
              <label className="text-[11px] uppercase text-cyan-400 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Subject Glow Effect
              </label>
              <button
                type="button"
                onClick={() =>
                  updateProp("subjectGlow", {
                    enabled: !(element.subjectGlow?.enabled),
                    color: element.subjectGlow?.color || "#00f5ff",
                    intensity: element.subjectGlow?.intensity || 80,
                    blur: element.subjectGlow?.blur || 25,
                    spread: element.subjectGlow?.spread || 10,
                    opacity: element.subjectGlow?.opacity || 0.85,
                  })
                }
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  element.subjectGlow?.enabled ? "bg-cyan-400 text-black" : "bg-white/10 text-gray-400 hover:text-white"
                }`}
              >
                {element.subjectGlow?.enabled ? "Glow ON" : "Add Glow"}
              </button>
            </div>

            {element.subjectGlow?.enabled && (
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-400 w-16">Color:</span>
                  <input
                    type="color"
                    value={element.subjectGlow.color || "#00f5ff"}
                    onChange={(e) =>
                      updateProp("subjectGlow", { ...element.subjectGlow!, color: e.target.value })
                    }
                    className="w-7 h-7 rounded bg-transparent border border-white/20 cursor-pointer"
                  />
                  <div className="flex gap-1 flex-1">
                    {["#00f5ff", "#a855f7", "#ff006e", "#3b82f6", "#22c55e", "#ffffff"].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() =>
                          updateProp("subjectGlow", { ...element.subjectGlow!, color: c })
                        }
                        className="w-4 h-4 rounded-full border border-white/20 hover:scale-125 transition-transform"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-gray-400 block mb-1">
                    Blur Radius ({element.subjectGlow.blur ?? 25}px)
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="80"
                    value={element.subjectGlow.blur ?? 25}
                    onChange={(e) =>
                      updateProp("subjectGlow", { ...element.subjectGlow!, blur: parseInt(e.target.value) })
                    }
                    className="w-full accent-cyan-400"
                  />
                </div>
              </div>
            )}
          </div>

          {/* SUBJECT GROUND / DROP SHADOW */}
          <div className="space-y-3 bg-black/40 p-3 rounded-xl border border-white/10 font-mono text-xs">
            <div className="flex items-center justify-between">
              <label className="text-[11px] uppercase text-purple-400 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Ground & Drop Shadow
              </label>
              <button
                type="button"
                onClick={() =>
                  updateProp("subjectShadow", {
                    enabled: !(element.subjectShadow?.enabled),
                    color: element.subjectShadow?.color || "rgba(0,0,0,0.8)",
                    blur: element.subjectShadow?.blur || 25,
                    distance: element.subjectShadow?.distance || 20,
                    angle: element.subjectShadow?.angle || 90,
                    opacity: element.subjectShadow?.opacity || 0.8,
                    preset: element.subjectShadow?.preset || "ground",
                  })
                }
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  element.subjectShadow?.enabled ? "bg-purple-400 text-black" : "bg-white/10 text-gray-400 hover:text-white"
                }`}
              >
                {element.subjectShadow?.enabled ? "Shadow ON" : "Add Shadow"}
              </button>
            </div>

            {element.subjectShadow?.enabled && (
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="grid grid-cols-3 gap-1 text-[9px] text-center">
                  {[
                    { id: "soft", label: "Soft Drop" },
                    { id: "ground", label: "Ground Base" },
                    { id: "floating", label: "Floating 3D" },
                    { id: "cinematic", label: "Cinematic" },
                    { id: "neon", label: "Neon Glow" },
                    { id: "hard", label: "Hard Edge" },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        let presetShadow: any = { ...element.subjectShadow, preset: p.id };
                        if (p.id === "soft") { presetShadow.blur = 20; presetShadow.distance = 12; presetShadow.angle = 90; }
                        if (p.id === "ground") { presetShadow.blur = 35; presetShadow.distance = 25; presetShadow.angle = 90; }
                        if (p.id === "floating") { presetShadow.blur = 45; presetShadow.distance = 40; presetShadow.angle = 90; }
                        if (p.id === "cinematic") { presetShadow.blur = 50; presetShadow.distance = 30; presetShadow.angle = 120; }
                        if (p.id === "neon") { presetShadow.blur = 30; presetShadow.distance = 0; presetShadow.color = "#00f5ff"; }
                        updateProp("subjectShadow", presetShadow);
                      }}
                      className={`py-1 rounded border transition-all ${
                        element.subjectShadow.preset === p.id
                          ? "bg-purple-500/30 border-purple-400 text-purple-200 font-bold"
                          : "bg-black/40 border-white/10 text-gray-400 hover:text-white"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">
                      Distance ({element.subjectShadow.distance ?? 20}px)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="60"
                      value={element.subjectShadow.distance ?? 20}
                      onChange={(e) =>
                        updateProp("subjectShadow", { ...element.subjectShadow!, distance: parseInt(e.target.value) })
                      }
                      className="w-full accent-purple-400"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">
                      Blur ({element.subjectShadow.blur ?? 25}px)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="80"
                      value={element.subjectShadow.blur ?? 25}
                      onChange={(e) =>
                        updateProp("subjectShadow", { ...element.subjectShadow!, blur: parseInt(e.target.value) })
                      }
                      className="w-full accent-purple-400"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* GRADIENT BORDER */}
          <div className="space-y-3 bg-black/40 p-3 rounded-xl border border-white/10 font-mono text-xs">
            <div className="flex items-center justify-between">
              <label className="text-[11px] uppercase text-amber-400 font-bold flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-400" /> Gradient & Custom Border
              </label>
              <button
                type="button"
                onClick={() =>
                  updateProp("gradientBorder", {
                    enabled: !(element.gradientBorder?.enabled),
                    color1: element.gradientBorder?.color1 || "#00f5ff",
                    color2: element.gradientBorder?.color2 || "#a855f7",
                    color3: element.gradientBorder?.color3 || "#ff006e",
                    angle: element.gradientBorder?.angle || 135,
                    width: element.gradientBorder?.width || 4,
                    glow: element.gradientBorder?.glow ?? true,
                  })
                }
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  element.gradientBorder?.enabled ? "bg-amber-400 text-black" : "bg-white/10 text-gray-400 hover:text-white"
                }`}
              >
                {element.gradientBorder?.enabled ? "Border ON" : "Add Border"}
              </button>
            </div>

            {element.gradientBorder?.enabled && (
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-400 w-16">Colors:</span>
                  <input
                    type="color"
                    value={element.gradientBorder.color1 || "#00f5ff"}
                    onChange={(e) =>
                      updateProp("gradientBorder", { ...element.gradientBorder!, color1: e.target.value })
                    }
                    className="w-6 h-6 rounded bg-transparent border border-white/20 cursor-pointer"
                  />
                  <input
                    type="color"
                    value={element.gradientBorder.color2 || "#a855f7"}
                    onChange={(e) =>
                      updateProp("gradientBorder", { ...element.gradientBorder!, color2: e.target.value })
                    }
                    className="w-6 h-6 rounded bg-transparent border border-white/20 cursor-pointer"
                  />
                  <input
                    type="color"
                    value={element.gradientBorder.color3 || "#ff006e"}
                    onChange={(e) =>
                      updateProp("gradientBorder", { ...element.gradientBorder!, color3: e.target.value })
                    }
                    className="w-6 h-6 rounded bg-transparent border border-white/20 cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">
                      Width ({element.gradientBorder.width || 4}px)
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={element.gradientBorder.width || 4}
                      onChange={(e) =>
                        updateProp("gradientBorder", { ...element.gradientBorder!, width: parseInt(e.target.value) })
                      }
                      className="w-full accent-amber-400"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">
                      Angle ({element.gradientBorder.angle || 135}°)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={element.gradientBorder.angle || 135}
                      onChange={(e) =>
                        updateProp("gradientBorder", { ...element.gradientBorder!, angle: parseInt(e.target.value) })
                      }
                      className="w-full accent-amber-400"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SHADER & LIGHTING ATMOSPHERE */}
          <div className="space-y-2 bg-black/40 p-3 rounded-xl border border-white/10 font-mono text-xs">
            <label className="text-[11px] uppercase text-pink-400 font-bold block flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-pink-400" /> Shader & Lighting Atmosphere
            </label>
            <select
              value={element.shaderPreset || "none"}
              onChange={(e) => updateProp("shaderPreset", e.target.value as any)}
              className="w-full bg-black/70 border border-white/20 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs focus:border-pink-400 focus:outline-none"
            >
              <option value="none">None (Standard Image)</option>
              <option value="soft-light">Soft Studio Light</option>
              <option value="rim-light">Cyan Rim Light Highlight</option>
              <option value="neon-glow">Neon Cyber Glow</option>
              <option value="bloom">Bloom Central Burst</option>
              <option value="spotlight">Top Spotlight Cone</option>
              <option value="ambient-dark">Ambient Dark Studio</option>
              <option value="holographic">Holographic Rainbow Shimmer</option>
              <option value="metallic">Metallic Gold/Silver Shimmer</option>
              <option value="glass">Glass Sheen Overlay</option>
            </select>
          </div>

          {/* MASKING SYSTEM */}
          <div className="space-y-3 bg-black/40 p-3 rounded-xl border border-white/10 font-mono text-xs">
            <div className="flex items-center justify-between">
              <label className="text-[11px] uppercase text-amber-400 font-bold flex items-center gap-1.5">
                <Scissors className="w-3.5 h-3.5" /> Masking System
              </label>
              <button
                type="button"
                onClick={() =>
                  updateProp("mask", {
                    enabled: !(element.mask?.enabled),
                    shape: element.mask?.shape || "circle",
                    zoom: 1,
                    offsetX: 0,
                    offsetY: 0,
                    rotation: 0,
                  })
                }
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  element.mask?.enabled ? "bg-amber-400 text-black" : "bg-white/10 text-gray-400 hover:text-white"
                }`}
              >
                {element.mask?.enabled ? "Mask Enabled" : "Enable Mask"}
              </button>
            </div>

            {element.mask?.enabled && (
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div>
                  <label className="text-[10px] text-gray-400 block mb-1">Mask Shape</label>
                  <select
                    value={element.mask.shape || "circle"}
                    onChange={(e) =>
                      updateProp("mask", { ...element.mask!, shape: e.target.value as any })
                    }
                    className="w-full bg-black/60 border border-white/10 rounded-lg px-2.5 py-1.5 text-white focus:border-amber-400 focus:outline-none"
                  >
                    <option value="circle">Circle Mask</option>
                    <option value="ellipse">Ellipse Mask</option>
                    <option value="rounded">Rounded Rectangle</option>
                    <option value="star">Star Mask</option>
                    <option value="hexagon">Hexagon Mask</option>
                    <option value="triangle">Triangle Mask</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* 6. DROP SHADOW & OBJECT EFFECTS */}
      <div className="space-y-3 bg-black/40 p-3 rounded-xl border border-white/10 font-mono text-xs">
        <div className="flex items-center justify-between">
          <label className="text-[11px] uppercase text-neon-pink font-bold flex items-center gap-1.5">
            <SparklesIcon className="w-3.5 h-3.5" /> Shadow & Effects
          </label>
          <button
            type="button"
            onClick={() =>
              updateProp("shadow", {
                enabled: !(element.shadow?.enabled),
                color: "rgba(0, 0, 0, 0.6)",
                blur: 15,
                spread: 0,
                offsetX: 0,
                offsetY: 8,
                opacity: 0.8,
              })
            }
            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              element.shadow?.enabled ? "bg-neon-pink text-white" : "bg-white/10 text-gray-400 hover:text-white"
            }`}
          >
            {element.shadow?.enabled ? "Shadow ON" : "Add Shadow"}
          </button>
        </div>

        {element.shadow?.enabled && (
          <div className="space-y-2 pt-2 border-t border-white/10">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-gray-400 block mb-1">Offset X/Y</label>
                <div className="flex gap-1">
                  <input
                    type="number"
                    value={element.shadow.offsetX}
                    onChange={(e) =>
                      updateProp("shadow", { ...element.shadow!, offsetX: parseInt(e.target.value) || 0 })
                    }
                    className="w-1/2 bg-black/60 border border-white/10 rounded px-1.5 py-1 text-white"
                    placeholder="X"
                  />
                  <input
                    type="number"
                    value={element.shadow.offsetY}
                    onChange={(e) =>
                      updateProp("shadow", { ...element.shadow!, offsetY: parseInt(e.target.value) || 0 })
                    }
                    className="w-1/2 bg-black/60 border border-white/10 rounded px-1.5 py-1 text-white"
                    placeholder="Y"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-gray-400 block mb-1">Blur Radius ({element.shadow.blur}px)</label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={element.shadow.blur}
                  onChange={(e) =>
                    updateProp("shadow", { ...element.shadow!, blur: parseInt(e.target.value) })
                  }
                  className="w-full accent-neon-pink"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 7. REUSABLE ELEMENT ACTIONS */}
      <div className="pt-2 border-t border-white/10">
        <button
          type="button"
          onClick={() => {
            try {
              const existingStr = localStorage.getItem("lizzdo_my_reusable_elements");
              const existing = existingStr ? JSON.parse(existingStr) : [];
              const newReusable = {
                id: `reusable-${Date.now()}`,
                name: element.name || "Saved Element",
                type: element.type,
                createdAt: new Date().toISOString(),
                element: { ...element, id: `el-${element.type}-${Date.now()}` },
              };
              const updated = [newReusable, ...existing];
              localStorage.setItem("lizzdo_my_reusable_elements", JSON.stringify(updated));
              alert(`Saved "${element.name}" to My Elements Library! You can reuse it in any design.`);
            } catch (err) {
              console.error("Failed to save reusable element:", err);
            }
          }}
          className="w-full py-2.5 px-3 rounded-xl bg-neon-cyan/15 border border-neon-cyan/40 hover:bg-neon-cyan/25 text-neon-cyan font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 group shadow-lg"
        >
          <Box className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span>Save to My Elements Library</span>
        </button>
      </div>
    </div>
  );
};

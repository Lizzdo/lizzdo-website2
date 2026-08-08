import React, { useState } from "react";
import { CanvasElement, ElementType, FilterPreset } from "../../types/designer";
import { detectAlphaBounds } from "../../utils/imageProcessing";
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
    if (element.aspectRatioLocked && element.width && element.height && element.height > 0) {
      const ratio = element.width / element.height;
      onChange({ ...element, height: newH, width: Math.round(newH * ratio * 100) / 100 });
    } else {
      onChange({ ...element, height: newH });
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
          <label className="text-[11px] uppercase font-mono text-neon-purple font-bold block mb-2">
            Image Quick Actions
          </label>
          <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...element,
                  x: 0,
                  y: 0,
                  width: 100,
                  height: 100,
                  fitMode: "contain",
                })
              }
              className="py-1.5 px-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-300 hover:text-white transition-all text-center"
            >
              Fit Canvas
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
              className="py-1.5 px-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-300 hover:text-white transition-all text-center"
            >
              Fill Canvas
            </button>

            <button
              type="button"
              onClick={() =>
                onChange({
                  ...element,
                  x: 25,
                  y: 25,
                  width: 50,
                  height: 50,
                })
              }
              className="py-1.5 px-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-300 hover:text-white transition-all text-center"
            >
              Center Image
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
              className="py-1.5 px-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-300 hover:text-white transition-all text-center"
            >
              Reset Transform
            </button>
          </div>
        </div>
      )}

      {/* 3. CONTENT & TYPOGRAPHY TOOL */}
      {(element.type === "text" || element.type === "badge" || element.type === "button" || element.type === "logo") && (
        <div className="space-y-4 bg-black/40 p-3 rounded-xl border border-white/10">
          <label className="text-[11px] uppercase font-mono text-neon-cyan font-bold block">
            Typography & Style
          </label>

          <div className="space-y-2">
            <label className="text-xs font-mono text-gray-400 block">Text Content</label>
            <textarea
              rows={2}
              value={element.text || ""}
              onChange={(e) => updateProp("text", e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-white focus:border-neon-cyan focus:outline-none text-xs font-sans"
              placeholder="Type content..."
            />
          </div>

          {/* Font Family & Weight */}
          <div className="grid grid-cols-2 gap-2 font-mono text-xs">
            <div>
              <label className="text-[10px] text-gray-400 block mb-1">Font Family</label>
              <select
                value={element.fontFamily || "Orbitron"}
                onChange={(e) => updateProp("fontFamily", e.target.value as any)}
                className="w-full bg-black/60 border border-white/10 rounded-lg px-2 py-1.5 text-white focus:border-neon-cyan focus:outline-none"
              >
                <option value="Orbitron">Orbitron (Display)</option>
                <option value="Rajdhani">Rajdhani (Clean Tech)</option>
                <option value="Inter">Inter (Sans)</option>
                <option value="Space Mono">Space Mono (Code)</option>
                <option value="Playfair Display">Playfair (Serif)</option>
                <option value="Plus Jakarta Sans">Plus Jakarta</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-gray-400 block mb-1">Font Size ({element.fontSize || 16}px)</label>
              <input
                type="number"
                value={element.fontSize || 16}
                onChange={(e) => updateProp("fontSize", parseInt(e.target.value) || 12)}
                className="w-full bg-black/60 border border-white/10 rounded-lg px-2 py-1.5 text-white focus:border-neon-cyan focus:outline-none"
              />
            </div>
          </div>

          {/* Alignments & Format Toggle */}
          <div className="flex items-center justify-between gap-1 pt-1">
            <div className="flex items-center gap-1 bg-black/60 p-1 rounded-lg border border-white/10">
              <button
                type="button"
                onClick={() => updateProp("textAlign", "left")}
                className={`p-1.5 rounded ${element.textAlign === "left" || !element.textAlign ? "bg-neon-cyan text-black" : "text-gray-400 hover:text-white"}`}
              >
                <AlignLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => updateProp("textAlign", "center")}
                className={`p-1.5 rounded ${element.textAlign === "center" ? "bg-neon-cyan text-black" : "text-gray-400 hover:text-white"}`}
              >
                <AlignCenter className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => updateProp("textAlign", "right")}
                className={`p-1.5 rounded ${element.textAlign === "right" ? "bg-neon-cyan text-black" : "text-gray-400 hover:text-white"}`}
              >
                <AlignRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-1 bg-black/60 p-1 rounded-lg border border-white/10">
              <button
                type="button"
                onClick={() => updateProp("fontStyle", element.fontStyle === "italic" ? "normal" : "italic")}
                className={`p-1.5 rounded ${element.fontStyle === "italic" ? "bg-neon-purple text-white" : "text-gray-400 hover:text-white"}`}
                title="Italic"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => updateProp("textDecoration", element.textDecoration === "underline" ? "none" : "underline")}
                className={`p-1.5 rounded ${element.textDecoration === "underline" ? "bg-neon-purple text-white" : "text-gray-400 hover:text-white"}`}
                title="Underline"
              >
                <Underline className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Color & Gradient Text */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <label className="text-gray-400">Text Color</label>
              <button
                type="button"
                onClick={() => updateProp("gradientText", !element.gradientText)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                  element.gradientText ? "bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink text-white" : "bg-white/10 text-gray-400"
                }`}
              >
                Gradient Text
              </button>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={element.color || "#ffffff"}
                onChange={(e) => updateProp("color", e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
              />
              <input
                type="text"
                value={element.color || "#ffffff"}
                onChange={(e) => updateProp("color", e.target.value)}
                className="flex-1 bg-black/60 border border-white/10 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs focus:border-neon-cyan focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* 4. SHAPES INSPECTOR */}
      {element.type === "shape" && (
        <div className="space-y-4 bg-black/40 p-3 rounded-xl border border-white/10 font-mono text-xs">
          <label className="text-[11px] uppercase font-mono text-cyan-400 font-bold block">
            Shape Properties
          </label>

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
              <option value="line">Divider Line</option>
              <option value="glow-card">Cyber Glow Panel</option>
            </select>
          </div>

          {/* Fill Color */}
          <div className="space-y-2">
            <label className="text-[10px] text-gray-400 block">Fill Color</label>
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
          </div>

          {/* Border Width & Color */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-gray-400 block mb-1">Border Width ({element.borderWidth || 0}px)</label>
              <input
                type="number"
                min="0"
                max="20"
                value={element.borderWidth || 0}
                onChange={(e) => updateProp("borderWidth", parseInt(e.target.value) || 0)}
                className="w-full bg-black/60 border border-white/10 rounded-lg px-2.5 py-1.5 text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-400 block mb-1">Corner Radius ({element.borderRadius || 0}px)</label>
              <input
                type="number"
                min="0"
                max="50"
                value={element.borderRadius || 0}
                onChange={(e) => updateProp("borderRadius", parseInt(e.target.value) || 0)}
                className="w-full bg-black/60 border border-white/10 rounded-lg px-2.5 py-1.5 text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* 5. IMAGE MASKING SYSTEM */}
      {element.type === "image" && (
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
    </div>
  );
};

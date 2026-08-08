import React, { useState } from "react";
import { CanvasElement, ElementCrop } from "../../types/designer";
import { Crop, Check, X, RotateCcw, Maximize, Square, Smartphone, Monitor } from "lucide-react";

interface ImageCropperModalProps {
  element: CanvasElement;
  isOpen: boolean;
  onClose: () => void;
  onApplyCrop: (crop: ElementCrop) => void;
}

export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  element,
  isOpen,
  onClose,
  onApplyCrop,
}) => {
  if (!isOpen || !element.url) return null;

  const initialCrop: ElementCrop = element.crop || {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    enabled: true,
    aspectRatio: "free",
  };

  const [crop, setCrop] = useState<ElementCrop>(initialCrop);

  const applyPreset = (preset: string) => {
    let newW = 100;
    let newH = 100;

    switch (preset) {
      case "1:1":
        newW = 100;
        newH = 100;
        break;
      case "4:3":
        newW = 100;
        newH = 75;
        break;
      case "3:4":
        newW = 75;
        newH = 100;
        break;
      case "16:9":
        newW = 100;
        newH = 56.25;
        break;
      case "9:16":
        newW = 56.25;
        newH = 100;
        break;
      case "free":
      default:
        newW = 100;
        newH = 100;
        break;
    }

    setCrop({
      ...crop,
      x: Math.min(crop.x, 100 - newW),
      y: Math.min(crop.y, 100 - newH),
      width: newW,
      height: newH,
      enabled: true,
      aspectRatio: preset,
    });
  };

  const handleReset = () => {
    setCrop({
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      enabled: false,
      aspectRatio: "free",
    });
  };

  const handleSave = () => {
    onApplyCrop({
      ...crop,
      enabled: true,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-neon-cyan/40 rounded-2xl max-w-3xl w-full p-6 shadow-[0_0_50px_rgba(0,245,255,0.2)] flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Crop className="w-5 h-5 text-neon-cyan" />
            <h3 className="font-display font-bold text-white text-base">NON-DESTRUCTIVE CROP TOOL</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preview Container */}
        <div className="relative w-full h-80 bg-black/60 rounded-xl overflow-hidden border border-white/10 flex items-center justify-center p-4">
          <div className="relative max-w-full max-h-full flex items-center justify-center">
            <img
              src={element.url}
              alt="Crop preview"
              className="max-h-72 object-contain pointer-events-none rounded select-none"
            />
            {/* Crop Overlay Grid */}
            <div
              className="absolute border-2 border-neon-cyan bg-neon-cyan/10 shadow-[0_0_20px_rgba(0,245,255,0.4)] flex items-center justify-center pointer-events-none"
              style={{
                left: `${crop.x}%`,
                top: `${crop.y}%`,
                width: `${crop.width}%`,
                height: `${crop.height}%`,
              }}
            >
              {/* Grid Lines */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none border border-neon-cyan/30">
                <div className="border-r border-b border-neon-cyan/20" />
                <div className="border-r border-b border-neon-cyan/20" />
                <div className="border-b border-neon-cyan/20" />
                <div className="border-r border-b border-neon-cyan/20" />
                <div className="border-r border-b border-neon-cyan/20" />
                <div className="border-b border-neon-cyan/20" />
                <div className="border-r border-neon-cyan/20" />
                <div className="border-r border-neon-cyan/20" />
              </div>

              {/* Handles */}
              <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-neon-cyan rounded-full shadow" />
              <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-neon-cyan rounded-full shadow" />
              <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-neon-cyan rounded-full shadow" />
              <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-neon-cyan rounded-full shadow" />
            </div>
          </div>
        </div>

        {/* Presets */}
        <div className="space-y-2">
          <label className="text-xs uppercase font-mono tracking-wider text-gray-400">Aspect Ratio Presets</label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: "free", label: "Free Crop", icon: Maximize },
              { id: "1:1", label: "Square (1:1)", icon: Square },
              { id: "4:3", label: "4:3 Standard", icon: Monitor },
              { id: "3:4", label: "3:4 Portrait", icon: Smartphone },
              { id: "16:9", label: "16:9 Widescreen", icon: Monitor },
              { id: "9:16", label: "9:16 Story", icon: Smartphone },
            ].map((p) => {
              const Icon = p.icon;
              const isActive = crop.aspectRatio === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => applyPreset(p.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                    isActive
                      ? "bg-neon-cyan text-black shadow-[0_0_12px_rgba(0,245,255,0.5)]"
                      : "bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Manual Sliders */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-black/40 p-4 rounded-xl border border-white/5">
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-mono text-gray-400">
              <span>Position X</span>
              <span className="text-neon-cyan">{Math.round(crop.x)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100 - crop.width}
              value={crop.x}
              onChange={(e) => setCrop({ ...crop, x: Number(e.target.value) })}
              className="w-full accent-neon-cyan"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-mono text-gray-400">
              <span>Position Y</span>
              <span className="text-neon-cyan">{Math.round(crop.y)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100 - crop.height}
              value={crop.y}
              onChange={(e) => setCrop({ ...crop, y: Number(e.target.value) })}
              className="w-full accent-neon-cyan"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-mono text-gray-400">
              <span>Width</span>
              <span className="text-neon-cyan">{Math.round(crop.width)}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={100 - crop.x}
              value={crop.width}
              onChange={(e) => setCrop({ ...crop, width: Number(e.target.value) })}
              className="w-full accent-neon-cyan"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-mono text-gray-400">
              <span>Height</span>
              <span className="text-neon-cyan">{Math.round(crop.height)}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={100 - crop.y}
              value={crop.height}
              onChange={(e) => setCrop({ ...crop, height: Number(e.target.value) })}
              className="w-full accent-neon-cyan"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between border-t border-white/10 pt-4">
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Reset Crop
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs font-mono font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-black font-display font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(0,245,255,0.4)] flex items-center gap-1.5 transition-all hover:scale-105"
            >
              <Check className="w-4 h-4" /> Apply Non-Destructive Crop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

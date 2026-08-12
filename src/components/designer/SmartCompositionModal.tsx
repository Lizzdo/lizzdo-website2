import React, { useState } from "react";
import {
  SMART_STYLE_DEFINITIONS,
  SmartCompositionOptions,
} from "../../utils/smartCompositionGenerator";
import { SmartCompositionStyle, DesignState } from "../../types/designer";
import {
  Sparkles,
  Zap,
  X,
  Image as ImageIcon,
  Bookmark,
  Layout,
  Sliders,
  RotateCw,
  Eye,
  Check,
  Layers,
  Palette,
} from "lucide-react";

interface SmartCompositionModalProps {
  imageUrl: string;
  imageName?: string;
  currentState: DesignState;
  onSelectOption: (
    mode: "smart" | "blank" | "preset" | "template" | "custom",
    style?: SmartCompositionStyle
  ) => void;
  onClose: () => void;
}

export const SmartCompositionModal: React.FC<SmartCompositionModalProps> = ({
  imageUrl,
  imageName,
  currentState,
  onSelectOption,
  onClose,
}) => {
  const [selectedStyle, setSelectedStyle] =
    useState<SmartCompositionStyle>("01_studio_showcase");
  const [controlMode, setControlMode] = useState<"auto" | "manual">("auto");
  const [seed, setSeed] = useState<number>(Date.now());

  const handleRegenerate = () => {
    setSeed(Date.now());
  };

  const handleApplySmart = () => {
    onSelectOption("smart", selectedStyle);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 font-sans select-none animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-white/20 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative text-gray-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1.5 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase">
            <Sparkles className="w-4 h-4 text-neon-cyan animate-pulse" /> IMAGE UPLOADED SUCCESSFULLY
          </div>
          <h2 className="text-xl font-bold font-display text-white">
            Choose how to build your composition
          </h2>
          <p className="text-xs text-gray-400 leading-relaxed font-mono">
            Lizzdo Studio can automatically generate a polished, professional graphic composition around{" "}
            <span className="text-neon-cyan font-bold">{imageName || "your uploaded subject"}</span> while keeping every layer 100% independently editable.
          </p>
        </div>

        {/* Uploaded Image Preview Box */}
        <div className="flex items-center gap-4 bg-black/50 p-3.5 rounded-2xl border border-white/10">
          <div className="w-16 h-16 rounded-xl border border-white/20 bg-neutral-950 flex items-center justify-center overflow-hidden shrink-0 relative">
            <img
              src={imageUrl}
              alt="Uploaded subject"
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <div className="flex-1 space-y-1 font-mono text-xs">
            <div className="text-white font-bold truncate max-w-sm">
              {imageName || "Uploaded Artwork"}
            </div>
            <div className="text-[10px] text-neon-cyan flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-400" /> Transparent PNG & Subject Bounds Auto-Detected
            </div>
            <div className="text-[10px] text-gray-400">
              Preserves transparency • Multi-layered studio depth • Non-destructive
            </div>
          </div>
        </div>

        {/* MAIN 5 WORKFLOW CHOICE BUTTONS */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={() => onSelectOption("smart", selectedStyle)}
            className="p-3 rounded-2xl bg-gradient-to-b from-neon-cyan/25 to-neon-purple/20 border-2 border-neon-cyan text-white hover:border-cyan-300 transition-all flex flex-col items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(0,245,255,0.2)] text-center group"
          >
            <Zap className="w-5 h-5 text-neon-cyan group-hover:scale-110 transition-transform fill-neon-cyan/30" />
            <span className="font-bold text-[11px]">Smart Composition</span>
            <span className="text-[9px] text-neon-cyan/80">Auto Studio Design</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectOption("blank")}
            className="p-3 rounded-2xl bg-black/40 border border-white/15 text-gray-300 hover:border-white hover:text-white transition-all flex flex-col items-center justify-center gap-1.5 text-center group"
          >
            <ImageIcon className="w-5 h-5 text-gray-400 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-[11px]">Blank Image</span>
            <span className="text-[9px] text-gray-500">Raw Canvas Layer</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectOption("preset")}
            className="p-3 rounded-2xl bg-black/40 border border-white/15 text-gray-300 hover:border-neon-pink hover:text-white transition-all flex flex-col items-center justify-center gap-1.5 text-center group"
          >
            <Bookmark className="w-5 h-5 text-neon-pink group-hover:scale-110 transition-transform" />
            <span className="font-bold text-[11px]">Use Preset</span>
            <span className="text-[9px] text-gray-500">Preset Library</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectOption("template")}
            className="p-3 rounded-2xl bg-black/40 border border-white/15 text-gray-300 hover:border-amber-400 hover:text-white transition-all flex flex-col items-center justify-center gap-1.5 text-center group"
          >
            <Layout className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-[11px]">Use Template</span>
            <span className="text-[9px] text-gray-500">Marketplace</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectOption("custom")}
            className="p-3 rounded-2xl bg-black/40 border border-white/15 text-gray-300 hover:border-emerald-400 hover:text-white transition-all flex flex-col items-center justify-center gap-1.5 text-center group col-span-2 sm:col-span-1"
          >
            <Sliders className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-[11px]">Custom</span>
            <span className="text-[9px] text-gray-500">Manual Inspector</span>
          </button>
        </div>

        {/* SMART COMPOSITION STYLE SELECTION GALLERY */}
        <div className="space-y-3 pt-2 border-t border-white/10">
          <div className="flex items-center justify-between">
            <label className="font-mono text-xs font-bold text-white uppercase flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-neon-cyan" /> Select Smart Composition Style
            </label>

            {/* AUTO vs MANUAL Toggle & REGENERATE */}
            <div className="flex items-center gap-2 font-mono text-[10px]">
              <div className="bg-black/60 p-0.5 rounded-xl border border-white/10 flex items-center">
                <button
                  type="button"
                  onClick={() => setControlMode("auto")}
                  className={`px-2 py-1 rounded-lg transition-all ${
                    controlMode === "auto"
                      ? "bg-neon-cyan text-black font-bold"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  AUTO
                </button>
                <button
                  type="button"
                  onClick={() => setControlMode("manual")}
                  className={`px-2 py-1 rounded-lg transition-all ${
                    controlMode === "manual"
                      ? "bg-neon-cyan text-black font-bold"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  MANUAL
                </button>
              </div>

              <button
                type="button"
                onClick={handleRegenerate}
                className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/15 text-gray-300 hover:text-white hover:border-neon-cyan flex items-center gap-1 transition-all"
                title="Regenerate Composition Seed"
              >
                <RotateCw className="w-3 h-3 text-neon-cyan animate-spin-slow" /> Regenerate
              </button>
            </div>
          </div>

          {/* 10 Smart Composition Style Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[280px] overflow-y-auto custom-scrollbar pr-1">
            {SMART_STYLE_DEFINITIONS.map((def) => {
              const isSelected = selectedStyle === def.id;
              return (
                <div
                  key={def.id}
                  onClick={() => setSelectedStyle(def.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer space-y-1.5 relative overflow-hidden font-mono ${
                    isSelected
                      ? "bg-neon-cyan/15 border-neon-cyan text-white shadow-[0_0_15px_rgba(0,245,255,0.15)]"
                      : "bg-black/40 border-white/10 text-gray-400 hover:border-white/30 hover:text-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                        isSelected
                          ? "bg-neon-cyan text-black border-neon-cyan font-bold"
                          : "bg-black/60 text-gray-300 border-white/10"
                      }`}
                    >
                      {def.badge}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-neon-cyan font-bold" />}
                  </div>

                  <h4 className="font-display font-bold text-xs text-white">
                    {def.name}
                  </h4>
                  <p className="text-[10px] text-gray-400 leading-snug line-clamp-2">
                    {def.tagline}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10 font-mono text-xs">
          <div className="text-[10px] text-gray-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-neon-purple" /> Creates editable background, glow, shadows, frames & text.
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white font-bold transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApplySmart}
              className="px-5 py-2 rounded-xl bg-neon-cyan text-black font-bold hover:bg-cyan-300 transition-all shadow-[0_0_20px_rgba(0,245,255,0.3)] flex items-center gap-2"
            >
              <Zap className="w-4 h-4 fill-black" /> BUILD SMART COMPOSITION
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

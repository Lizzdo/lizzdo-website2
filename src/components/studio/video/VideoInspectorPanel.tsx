import React from "react";
import { VideoClip, VideoProjectData, LogoAnimationPreset, TransitionType } from "../../../types/video";
import {
  Sliders,
  Maximize2,
  Volume2,
  VolumeX,
  Type,
  Award,
  Sparkles,
  RotateCcw,
  Scissors,
  Layers,
  Copy,
  Trash2,
  Music,
  Snowflake,
  FlipHorizontal,
  FlipVertical,
} from "lucide-react";

interface Props {
  clip: VideoClip | null;
  currentTime: number;
  onUpdateClip: (clipId: string, updated: Partial<VideoClip>) => void;
  onDeleteClip: (clipId: string) => void;
  onDuplicateClip: (clipId: string) => void;
  onFreezeFrame: (clipId: string) => void;
  onDetachAudio: (clipId: string) => void;
}

export const VideoInspectorPanel: React.FC<Props> = ({
  clip,
  currentTime,
  onUpdateClip,
  onDeleteClip,
  onDuplicateClip,
  onFreezeFrame,
  onDetachAudio,
}) => {
  if (!clip) {
    return (
      <div className="w-full md:w-72 bg-neutral-950 border-l border-white/10 p-4 font-mono text-xs text-gray-500 flex flex-col items-center justify-center text-center shrink-0 select-none">
        <Sliders className="w-8 h-8 text-gray-700 mb-2" />
        <p className="font-bold text-gray-400">No Clip Selected</p>
        <p className="text-[10px] mt-1">Select any clip on the timeline to inspect and edit properties.</p>
      </div>
    );
  }

  const updateText = (updatedProps: any) => {
    onUpdateClip(clip.id, {
      textProps: {
        ...clip.textProps,
        ...updatedProps,
      },
    });
  };

  const updateEffect = (updatedProps: any) => {
    onUpdateClip(clip.id, {
      effectProps: {
        ...clip.effectProps,
        ...updatedProps,
      },
    });
  };

  const updateLogoAnim = (updatedProps: any) => {
    onUpdateClip(clip.id, {
      logoAnim: {
        ...clip.logoAnim,
        ...updatedProps,
      },
    });
  };

  return (
    <div className="w-full md:w-72 bg-neutral-950 border-l border-white/10 p-4 flex flex-col shrink-0 font-mono text-xs text-gray-300 overflow-y-auto custom-scrollbar space-y-4 select-none">
      {/* HEADER BAR */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-neon-cyan" />
          <span className="font-bold text-white uppercase text-xs truncate w-36">{clip.name}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onDuplicateClip(clip.id)}
            className="p-1 hover:text-white text-gray-400"
            title="Duplicate"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDeleteClip(clip.id)}
            className="p-1 hover:text-red-400 text-gray-400"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* QUICK CLIP ACTIONS */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onFreezeFrame(clip.id)}
          className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-300 font-bold text-[10px] flex items-center justify-center gap-1"
        >
          <Snowflake className="w-3.5 h-3.5" /> Freeze Frame
        </button>
        {clip.type === "video" && (
          <button
            onClick={() => onDetachAudio(clip.id)}
            className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-300 font-bold text-[10px] flex items-center justify-center gap-1"
          >
            <Music className="w-3.5 h-3.5" /> Detach Audio
          </button>
        )}
      </div>

      {/* TIMING & SPEED */}
      <div className="space-y-2 pt-2 border-t border-white/5">
        <span className="text-[10px] text-gray-500 uppercase font-bold">Timing & Speed</span>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div>
            <label className="text-[10px] text-gray-400">Start (s)</label>
            <input
              type="number"
              step={0.1}
              value={clip.startTime}
              onChange={(e) => onUpdateClip(clip.id, { startTime: Number(e.target.value) })}
              className="w-full bg-black border border-white/10 rounded-lg px-2 py-1 text-white font-bold"
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-400">Duration (s)</label>
            <input
              type="number"
              step={0.1}
              value={clip.duration}
              onChange={(e) => onUpdateClip(clip.id, { duration: Number(e.target.value) })}
              className="w-full bg-black border border-white/10 rounded-lg px-2 py-1 text-white font-bold"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[10px] text-gray-400">
            <span>Speed Multiplier</span>
            <span className="text-neon-cyan font-bold">{clip.speed}x</span>
          </div>
          <input
            type="range"
            min={0.25}
            max={4}
            step={0.25}
            value={clip.speed}
            onChange={(e) => onUpdateClip(clip.id, { speed: Number(e.target.value) })}
            className="w-full h-1 accent-neon-cyan cursor-pointer"
          />
        </div>
      </div>

      {/* TRANSFORM & OPACITY */}
      {(clip.type === "video" || clip.type === "overlay" || clip.type === "logo" || clip.type === "text") && (
        <div className="space-y-2 pt-2 border-t border-white/5">
          <span className="text-[10px] text-gray-500 uppercase font-bold">Transform & Layout</span>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] text-gray-400">
              <span>Scale</span>
              <span className="text-white font-bold">{Math.round(clip.scale * 100)}%</span>
            </div>
            <input
              type="range"
              min={0.1}
              max={3}
              step={0.05}
              value={clip.scale}
              onChange={(e) => onUpdateClip(clip.id, { scale: Number(e.target.value) })}
              className="w-full h-1 accent-neon-cyan cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] text-gray-400">
              <span>Opacity</span>
              <span className="text-white font-bold">{Math.round(clip.opacity * 100)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={clip.opacity}
              onChange={(e) => onUpdateClip(clip.id, { opacity: Number(e.target.value) })}
              className="w-full h-1 accent-neon-cyan cursor-pointer"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={() => onUpdateClip(clip.id, { flipX: !clip.flipX })}
              className={`flex-1 py-1.5 rounded-lg border text-[10px] font-bold flex items-center justify-center gap-1 ${
                clip.flipX ? "border-neon-cyan bg-neon-cyan/20 text-neon-cyan" : "border-white/10 bg-black text-gray-400"
              }`}
            >
              <FlipHorizontal className="w-3.5 h-3.5" /> Flip H
            </button>
            <button
              onClick={() => onUpdateClip(clip.id, { flipY: !clip.flipY })}
              className={`flex-1 py-1.5 rounded-lg border text-[10px] font-bold flex items-center justify-center gap-1 ${
                clip.flipY ? "border-neon-cyan bg-neon-cyan/20 text-neon-cyan" : "border-white/10 bg-black text-gray-400"
              }`}
            >
              <FlipVertical className="w-3.5 h-3.5" /> Flip V
            </button>
          </div>
        </div>
      )}

      {/* AUDIO CONTROLS */}
      {(clip.type === "audio" || clip.type === "video") && (
        <div className="space-y-2 pt-2 border-t border-white/5">
          <span className="text-[10px] text-emerald-400 uppercase font-bold">Audio Controls</span>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] text-gray-400">
              <span>Volume</span>
              <span className="text-emerald-400 font-bold">{Math.round(clip.volume * 100)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={2}
              step={0.05}
              value={clip.volume}
              onChange={(e) => onUpdateClip(clip.id, { volume: Number(e.target.value) })}
              className="w-full h-1 accent-emerald-400 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-gray-400">Fade In (s)</label>
              <input
                type="number"
                min={0}
                max={5}
                step={0.5}
                value={clip.fadeIn}
                onChange={(e) => onUpdateClip(clip.id, { fadeIn: Number(e.target.value) })}
                className="w-full bg-black border border-white/10 rounded-lg px-2 py-1 text-white font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-400">Fade Out (s)</label>
              <input
                type="number"
                min={0}
                max={5}
                step={0.5}
                value={clip.fadeOut}
                onChange={(e) => onUpdateClip(clip.id, { fadeOut: Number(e.target.value) })}
                className="w-full bg-black border border-white/10 rounded-lg px-2 py-1 text-white font-bold"
              />
            </div>
          </div>
        </div>
      )}

      {/* LOGO & WATERMARK ANIMATION PRESETS */}
      {clip.type === "logo" && (
        <div className="space-y-2 pt-2 border-t border-white/5">
          <span className="text-[10px] text-purple-400 uppercase font-bold">Logo Animation Preset</span>

          <select
            value={clip.logoAnim?.preset || "none"}
            onChange={(e) => updateLogoAnim({ preset: e.target.value as LogoAnimationPreset })}
            className="w-full bg-black border border-white/10 rounded-lg px-2 py-1.5 text-xs text-purple-300 font-bold"
          >
            <option value="none">None (Static Watermark)</option>
            <option value="fadeIn">Fade In Smooth</option>
            <option value="scaleIn">Scale In Pop</option>
            <option value="slideLeft">Slide In From Right</option>
            <option value="slideRight">Slide In From Left</option>
            <option value="slideUp">Slide Up From Bottom</option>
            <option value="bounce">Continuous Bounce</option>
            <option value="rotate">Continuous Spin</option>
          </select>
        </div>
      )}

      {/* TEXT PROPERTIES */}
      {clip.type === "text" && clip.textProps && (
        <div className="space-y-2 pt-2 border-t border-white/5">
          <span className="text-[10px] text-amber-400 uppercase font-bold">Text Customizer</span>

          <div>
            <label className="text-[10px] text-gray-400">Text Content</label>
            <input
              type="text"
              value={clip.textProps.content}
              onChange={(e) => updateText({ content: e.target.value })}
              className="w-full bg-black border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-gray-400">Font</label>
              <select
                value={clip.textProps.fontFamily}
                onChange={(e) => updateText({ fontFamily: e.target.value })}
                className="w-full bg-black border border-white/10 rounded-lg px-2 py-1 text-xs text-white font-bold"
              >
                <option value="Orbitron">Orbitron</option>
                <option value="Rajdhani">Rajdhani</option>
                <option value="Plus Jakarta Sans">Plus Jakarta</option>
                <option value="Inter">Inter</option>
                <option value="Playfair Display">Playfair</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-gray-400">Font Size</label>
              <input
                type="number"
                value={clip.textProps.fontSize}
                onChange={(e) => updateText({ fontSize: Number(e.target.value) })}
                className="w-full bg-black border border-white/10 rounded-lg px-2 py-1 text-xs text-white font-bold"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-gray-400">Text Color</span>
            <input
              type="color"
              value={clip.textProps.color}
              onChange={(e) => updateText({ color: e.target.value })}
              className="w-6 h-6 rounded cursor-pointer border border-white/10 bg-transparent"
            />
          </div>
        </div>
      )}

      {/* EFFECTS & COLOR GRADING */}
      <div className="space-y-2 pt-2 border-t border-white/5">
        <span className="text-[10px] text-neon-cyan uppercase font-bold">Effects & Color Filter</span>

        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-gray-400">
            <span>Blur</span>
            <span>{clip.effectProps?.blur || 0}px</span>
          </div>
          <input
            type="range"
            min={0}
            max={20}
            value={clip.effectProps?.blur || 0}
            onChange={(e) => updateEffect({ blur: Number(e.target.value) })}
            className="w-full h-1 accent-neon-cyan cursor-pointer"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-gray-400">
            <span>Brightness</span>
            <span>{clip.effectProps?.brightness || 0}</span>
          </div>
          <input
            type="range"
            min={-100}
            max={100}
            value={clip.effectProps?.brightness || 0}
            onChange={(e) => updateEffect({ brightness: Number(e.target.value) })}
            className="w-full h-1 accent-neon-cyan cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

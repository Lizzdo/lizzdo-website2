import React, { useState } from "react";
import { VideoClip, VideoProjectData, LogoAnimationPreset, TransitionType, Keyframe, InterpolationMode } from "../../../types/video";
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
  Diamond,
  Zap,
  Play,
  ClipboardCheck,
} from "lucide-react";

interface Props {
  clip: VideoClip | null;
  project?: VideoProjectData;
  currentTime: number;
  onUpdateClip: (clipId: string, updated: Partial<VideoClip>) => void;
  onDeleteClip: (clipId: string) => void;
  onDuplicateClip: (clipId: string) => void;
  onFreezeFrame: (clipId: string) => void;
  onDetachAudio: (clipId: string) => void;
  onUpdateProject?: (updated: Partial<VideoProjectData>) => void;
}

// Module clipboard memory for Keyframe Animation Copy/Paste
let clipboardKeyframes: Keyframe[] | null = null;

export const VideoInspectorPanel: React.FC<Props> = ({
  clip,
  project,
  currentTime,
  onUpdateClip,
  onDeleteClip,
  onDuplicateClip,
  onFreezeFrame,
  onDetachAudio,
  onUpdateProject,
}) => {
  const [presetDuration, setPresetDuration] = useState<number>(1);
  const [hasCopiedAnim, setHasCopiedAnim] = useState<boolean>(false);

  if (!clip) {
    return (
      <div className="w-full md:w-72 bg-neutral-950 border-l border-white/10 p-4 font-mono text-xs text-gray-400 flex flex-col shrink-0 select-none overflow-y-auto custom-scrollbar space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-white font-bold uppercase">
          <Sliders className="w-4 h-4 text-neon-cyan" />
          <span>Canvas & Project</span>
        </div>

        {project && onUpdateProject && (
          <div className="space-y-3">
            <div>
              <label className="text-[10px] text-gray-500 uppercase font-bold">Canvas Background</label>
              <div className="grid grid-cols-2 gap-1.5 mt-1">
                {(["solid", "gradient", "wireframe", "image"] as const).map((bg) => (
                  <button
                    key={bg}
                    onClick={() => onUpdateProject({ bgType: bg })}
                    className={`py-1.5 rounded-lg border text-[10px] font-bold uppercase transition-all ${
                      (project.bgType || "solid") === bg
                        ? "border-neon-cyan bg-neon-cyan/20 text-neon-cyan"
                        : "border-white/10 bg-black text-gray-400 hover:text-white"
                    }`}
                  >
                    {bg}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-400">Background Color</span>
              <input
                type="color"
                value={project.bgColor || "#05050a"}
                onChange={(e) => onUpdateProject({ bgColor: e.target.value })}
                className="w-6 h-6 rounded cursor-pointer border border-white/10 bg-transparent"
              />
            </div>
          </div>
        )}

        <div className="pt-4 text-center text-gray-500 border-t border-white/5 space-y-1">
          <p className="font-bold text-gray-400">No Clip Selected</p>
          <p className="text-[10px]">Select any clip on the timeline to inspect and edit properties.</p>
        </div>
      </div>
    );
  }

  const relTime = Math.max(0, Math.min(clip.duration, currentTime - clip.startTime));

  const hasKeyframeAtCurrentTime = (property: string) => {
    if (!clip.keyframes) return false;
    return clip.keyframes.some((k) => k.property === property && Math.abs(k.time - relTime) < 0.1);
  };

  const toggleKeyframeAtCurrentTime = (property: any, currentValue: number) => {
    const existingKeyframes = clip.keyframes || [];
    const index = existingKeyframes.findIndex(
      (k) => k.property === property && Math.abs(k.time - relTime) < 0.1
    );

    if (index >= 0) {
      const updated = existingKeyframes.filter((_, i) => i !== index);
      onUpdateClip(clip.id, { keyframes: updated });
    } else {
      const newKf: Keyframe = {
        id: `kf-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        time: Number(relTime.toFixed(2)),
        property,
        value: currentValue,
        easing: "easeInOut",
      };
      onUpdateClip(clip.id, { keyframes: [...existingKeyframes, newKf] });
    }
  };

  const updateKeyframe = (kfId: string, updated: Partial<Keyframe>) => {
    if (!clip.keyframes) return;
    const updatedKfs = clip.keyframes.map((k) => (k.id === kfId ? { ...k, ...updated } : k));
    onUpdateClip(clip.id, { keyframes: updatedKfs });
  };

  const deleteKeyframe = (kfId: string) => {
    if (!clip.keyframes) return;
    const updatedKfs = clip.keyframes.filter((k) => k.id !== kfId);
    onUpdateClip(clip.id, { keyframes: updatedKfs });
  };

  const applyMotionPreset = (preset: string) => {
    const dur = presetDuration;
    const existingKfs = clip.keyframes || [];
    let newKfs: Keyframe[] = [...existingKfs];

    const addKf = (time: number, property: any, value: number, easing: InterpolationMode = "easeInOut") => {
      newKfs = newKfs.filter((k) => !(k.property === property && Math.abs(k.time - time) < 0.05));
      newKfs.push({
        id: `kf-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        time: Number(time.toFixed(2)),
        property,
        value,
        easing,
      });
    };

    switch (preset) {
      case "fadeIn":
        addKf(0, "opacity", 0);
        addKf(dur, "opacity", 1);
        break;
      case "fadeOut":
        addKf(Math.max(0, clip.duration - dur), "opacity", 1);
        addKf(clip.duration, "opacity", 0);
        break;
      case "slideLeft":
        addKf(0, "posX", -500);
        addKf(dur, "posX", 0);
        break;
      case "slideRight":
        addKf(0, "posX", 500);
        addKf(dur, "posX", 0);
        break;
      case "slideUp":
        addKf(0, "posY", 300);
        addKf(dur, "posY", 0);
        break;
      case "slideDown":
        addKf(0, "posY", -300);
        addKf(dur, "posY", 0);
        break;
      case "zoomIn":
        addKf(0, "scale", 0.2);
        addKf(dur, "scale", 1);
        break;
      case "popIn":
        addKf(0, "scale", 0);
        addKf(dur * 0.6, "scale", 1.25);
        addKf(dur, "scale", 1);
        break;
      case "kenBurns":
        addKf(0, "scale", 1.0);
        addKf(clip.duration, "scale", 1.25);
        addKf(0, "posX", -50);
        addKf(clip.duration, "posX", 50);
        break;
      case "pulse":
        addKf(0, "scale", 1);
        addKf(clip.duration * 0.5, "scale", 1.15);
        addKf(clip.duration, "scale", 1);
        break;
      case "rotateSpin":
        addKf(0, "rotation", 0);
        addKf(clip.duration, "rotation", 360);
        break;
    }

    onUpdateClip(clip.id, { keyframes: newKfs });
  };

  const handleCopyAnimation = () => {
    clipboardKeyframes = clip.keyframes ? [...clip.keyframes] : [];
    setHasCopiedAnim(true);
    setTimeout(() => setHasCopiedAnim(false), 2000);
  };

  const handlePasteAnimation = () => {
    if (!clipboardKeyframes) return;
    onUpdateClip(clip.id, { keyframes: [...clipboardKeyframes] });
  };

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

  const updateCrop = (updatedCrop: any) => {
    onUpdateClip(clip.id, {
      crop: {
        ...clip.crop,
        ...updatedCrop,
      },
    });
  };

  const updateTransition = (updatedTrans: any) => {
    onUpdateClip(clip.id, {
      transition: {
        ...clip.transition,
        ...updatedTrans,
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
            title="Duplicate Clip"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDeleteClip(clip.id)}
            className="p-1 hover:text-red-400 text-gray-400"
            title="Delete Clip"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* QUICK CLIP ACTIONS & ANIMATION COPY/PASTE */}
      <div className="space-y-1.5">
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

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleCopyAnimation}
            className="py-1.5 px-2 rounded-lg bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 text-purple-300 text-[10px] font-bold flex items-center justify-center gap-1 transition-all"
          >
            {hasCopiedAnim ? <ClipboardCheck className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{hasCopiedAnim ? "Copied!" : "Copy Anim"}</span>
          </button>

          <button
            onClick={handlePasteAnimation}
            className="py-1.5 px-2 rounded-lg bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-300 text-[10px] font-bold flex items-center justify-center gap-1 transition-all"
            title="Paste Keyframe Animation to selected clip"
          >
            <Zap className="w-3 h-3" />
            <span>Paste Anim</span>
          </button>
        </div>
      </div>

      {/* MOTION PRESETS SECTION */}
      <div className="space-y-2 pt-2 border-t border-white/5 bg-neutral-900/50 p-2.5 rounded-xl border border-white/5">
        <div className="flex items-center justify-between text-neon-cyan">
          <span className="text-[10px] uppercase font-bold flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" /> Keyframe Motion Presets
          </span>
          <select
            value={presetDuration}
            onChange={(e) => setPresetDuration(Number(e.target.value))}
            className="bg-black border border-white/10 rounded text-[9px] text-white px-1 py-0.5"
          >
            <option value={0.5}>0.5s</option>
            <option value={1}>1.0s</option>
            <option value={1.5}>1.5s</option>
            <option value={2}>2.0s</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-1.5 text-[9px]">
          <button
            onClick={() => applyMotionPreset("fadeIn")}
            className="py-1 rounded bg-black border border-white/10 hover:border-neon-cyan text-gray-300 text-left px-2 truncate"
          >
            ⚡ Fade In
          </button>
          <button
            onClick={() => applyMotionPreset("fadeOut")}
            className="py-1 rounded bg-black border border-white/10 hover:border-neon-cyan text-gray-300 text-left px-2 truncate"
          >
            ⚡ Fade Out
          </button>
          <button
            onClick={() => applyMotionPreset("slideLeft")}
            className="py-1 rounded bg-black border border-white/10 hover:border-neon-cyan text-gray-300 text-left px-2 truncate"
          >
            ⚡ Slide Left
          </button>
          <button
            onClick={() => applyMotionPreset("slideRight")}
            className="py-1 rounded bg-black border border-white/10 hover:border-neon-cyan text-gray-300 text-left px-2 truncate"
          >
            ⚡ Slide Right
          </button>
          <button
            onClick={() => applyMotionPreset("slideUp")}
            className="py-1 rounded bg-black border border-white/10 hover:border-neon-cyan text-gray-300 text-left px-2 truncate"
          >
            ⚡ Slide Up
          </button>
          <button
            onClick={() => applyMotionPreset("zoomIn")}
            className="py-1 rounded bg-black border border-white/10 hover:border-neon-cyan text-gray-300 text-left px-2 truncate"
          >
            ⚡ Zoom In
          </button>
          <button
            onClick={() => applyMotionPreset("popIn")}
            className="py-1 rounded bg-black border border-white/10 hover:border-neon-cyan text-gray-300 text-left px-2 truncate"
          >
            ⚡ Pop Elastic
          </button>
          <button
            onClick={() => applyMotionPreset("kenBurns")}
            className="py-1 rounded bg-black border border-white/10 hover:border-neon-cyan text-gray-300 text-left px-2 truncate"
          >
            ⚡ Ken Burns
          </button>
        </div>
      </div>

      {/* TRANSFORM & LAYOUT WITH KEYFRAME TOGGLES */}
      {(clip.type === "video" || clip.type === "overlay" || clip.type === "logo" || clip.type === "text") && (
        <div className="space-y-2 pt-2 border-t border-white/5">
          <span className="text-[10px] text-gray-500 uppercase font-bold">Transform & Keyframes</span>

          {/* POS X & POS Y KEYFRAME TOGGLES */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
                <span>Pos X ({clip.posX})</span>
                <button
                  onClick={() => toggleKeyframeAtCurrentTime("posX", clip.posX)}
                  className={`p-0.5 rounded transition-all ${
                    hasKeyframeAtCurrentTime("posX")
                      ? "text-neon-cyan bg-neon-cyan/20 border border-neon-cyan"
                      : "text-gray-500 hover:text-white"
                  }`}
                  title="Toggle Keyframe at Playhead"
                >
                  <Diamond className="w-3 h-3 fill-current" />
                </button>
              </div>
              <input
                type="number"
                value={clip.posX}
                onChange={(e) => onUpdateClip(clip.id, { posX: Number(e.target.value) })}
                className="w-full bg-black border border-white/10 rounded px-2 py-1 text-white font-bold"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
                <span>Pos Y ({clip.posY})</span>
                <button
                  onClick={() => toggleKeyframeAtCurrentTime("posY", clip.posY)}
                  className={`p-0.5 rounded transition-all ${
                    hasKeyframeAtCurrentTime("posY")
                      ? "text-neon-cyan bg-neon-cyan/20 border border-neon-cyan"
                      : "text-gray-500 hover:text-white"
                  }`}
                  title="Toggle Keyframe at Playhead"
                >
                  <Diamond className="w-3 h-3 fill-current" />
                </button>
              </div>
              <input
                type="number"
                value={clip.posY}
                onChange={(e) => onUpdateClip(clip.id, { posY: Number(e.target.value) })}
                className="w-full bg-black border border-white/10 rounded px-2 py-1 text-white font-bold"
              />
            </div>
          </div>

          {/* SCALE KEYFRAME TOGGLE */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] text-gray-400">
              <span>Scale ({Math.round(clip.scale * 100)}%)</span>
              <button
                onClick={() => toggleKeyframeAtCurrentTime("scale", clip.scale)}
                className={`p-0.5 rounded transition-all ${
                  hasKeyframeAtCurrentTime("scale")
                    ? "text-neon-cyan bg-neon-cyan/20 border border-neon-cyan"
                    : "text-gray-500 hover:text-white"
                }`}
                title="Toggle Keyframe at Playhead"
              >
                <Diamond className="w-3 h-3 fill-current" />
              </button>
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

          {/* ROTATION KEYFRAME TOGGLE */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] text-gray-400">
              <span>Rotation ({clip.rotation}°)</span>
              <button
                onClick={() => toggleKeyframeAtCurrentTime("rotation", clip.rotation)}
                className={`p-0.5 rounded transition-all ${
                  hasKeyframeAtCurrentTime("rotation")
                    ? "text-neon-cyan bg-neon-cyan/20 border border-neon-cyan"
                    : "text-gray-500 hover:text-white"
                }`}
                title="Toggle Keyframe at Playhead"
              >
                <Diamond className="w-3 h-3 fill-current" />
              </button>
            </div>
            <input
              type="range"
              min={0}
              max={360}
              step={5}
              value={clip.rotation}
              onChange={(e) => onUpdateClip(clip.id, { rotation: Number(e.target.value) })}
              className="w-full h-1 accent-neon-cyan cursor-pointer"
            />
          </div>

          {/* OPACITY KEYFRAME TOGGLE */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] text-gray-400">
              <span>Opacity ({Math.round(clip.opacity * 100)}%)</span>
              <button
                onClick={() => toggleKeyframeAtCurrentTime("opacity", clip.opacity)}
                className={`p-0.5 rounded transition-all ${
                  hasKeyframeAtCurrentTime("opacity")
                    ? "text-neon-cyan bg-neon-cyan/20 border border-neon-cyan"
                    : "text-gray-500 hover:text-white"
                }`}
                title="Toggle Keyframe at Playhead"
              >
                <Diamond className="w-3 h-3 fill-current" />
              </button>
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

          {/* QUICK ALIGNMENT BUTTONS */}
          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
            <button
              onClick={() => onUpdateClip(clip.id, { posX: 0 })}
              className="py-1 rounded bg-black border border-white/10 hover:border-neon-cyan text-gray-300"
            >
              Center Horizontal
            </button>
            <button
              onClick={() => onUpdateClip(clip.id, { posY: 0 })}
              className="py-1 rounded bg-black border border-white/10 hover:border-neon-cyan text-gray-300"
            >
              Center Vertical
            </button>
            <button
              onClick={() => onUpdateClip(clip.id, { scale: 1, posX: 0, posY: 0 })}
              className="py-1 rounded bg-black border border-white/10 hover:border-neon-cyan text-gray-300"
            >
              Fit Canvas
            </button>
            <button
              onClick={() => onUpdateClip(clip.id, { scale: 1.25, posX: 0, posY: 0 })}
              className="py-1 rounded bg-black border border-white/10 hover:border-neon-cyan text-gray-300"
            >
              Fill Canvas
            </button>
          </div>
        </div>
      )}

      {/* KEYFRAME LIST & EDITING TABLE */}
      {clip.keyframes && clip.keyframes.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-white/5">
          <span className="text-[10px] text-neon-cyan font-bold uppercase flex items-center justify-between">
            <span>Keyframes ({clip.keyframes.length})</span>
            <button
              onClick={() => onUpdateClip(clip.id, { keyframes: [] })}
              className="text-[9px] text-gray-500 hover:text-red-400"
            >
              Clear All
            </button>
          </span>

          <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar pr-1">
            {clip.keyframes.map((kf) => (
              <div
                key={kf.id}
                className="p-1.5 rounded-lg bg-black border border-white/10 flex items-center justify-between text-[10px]"
              >
                <div className="space-y-0.5 truncate">
                  <span className="text-neon-cyan font-bold uppercase block text-[9px]">{kf.property}</span>
                  <span className="text-gray-400 text-[9px]">{kf.time.toFixed(2)}s | Val: {kf.value}</span>
                </div>

                <div className="flex items-center gap-1">
                  <select
                    value={kf.easing}
                    onChange={(e) => updateKeyframe(kf.id, { easing: e.target.value as InterpolationMode })}
                    className="bg-neutral-900 text-gray-300 border border-white/10 rounded px-1 py-0.5 text-[9px]"
                  >
                    <option value="linear">Linear</option>
                    <option value="easeIn">Ease In</option>
                    <option value="easeOut">Ease Out</option>
                    <option value="easeInOut">Ease In Out</option>
                    <option value="hold">Hold</option>
                  </select>

                  <button
                    onClick={() => deleteKeyframe(kf.id)}
                    className="p-1 text-gray-500 hover:text-red-400"
                    title="Delete Keyframe"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AUDIO CONTROLS WITH KEYFRAME TOGGLE */}
      {(clip.type === "audio" || clip.type === "video") && (
        <div className="space-y-2 pt-2 border-t border-white/5">
          <span className="text-[10px] text-emerald-400 uppercase font-bold">Audio Controls</span>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[10px] text-gray-400">
              <span>Volume ({Math.round(clip.volume * 100)}%)</span>
              <button
                onClick={() => toggleKeyframeAtCurrentTime("volume", clip.volume)}
                className={`p-0.5 rounded transition-all ${
                  hasKeyframeAtCurrentTime("volume")
                    ? "text-emerald-400 bg-emerald-500/20 border border-emerald-400"
                    : "text-gray-500 hover:text-white"
                }`}
                title="Toggle Volume Keyframe"
              >
                <Diamond className="w-3 h-3 fill-current" />
              </button>
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

      {/* CROP TOOL */}
      {(clip.type === "video" || clip.type === "overlay" || clip.type === "logo") && (
        <div className="space-y-2 pt-2 border-t border-white/5">
          <span className="text-[10px] text-gray-500 uppercase font-bold">Crop Tool</span>

          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div>
              <label className="text-gray-400">Crop Top %</label>
              <input
                type="number"
                min={0}
                max={45}
                value={clip.crop?.top || 0}
                onChange={(e) => updateCrop({ top: Number(e.target.value) })}
                className="w-full bg-black border border-white/10 rounded px-2 py-1 text-white font-bold"
              />
            </div>
            <div>
              <label className="text-gray-400">Crop Bottom %</label>
              <input
                type="number"
                min={0}
                max={45}
                value={clip.crop?.bottom || 0}
                onChange={(e) => updateCrop({ bottom: Number(e.target.value) })}
                className="w-full bg-black border border-white/10 rounded px-2 py-1 text-white font-bold"
              />
            </div>
            <div>
              <label className="text-gray-400">Crop Left %</label>
              <input
                type="number"
                min={0}
                max={45}
                value={clip.crop?.left || 0}
                onChange={(e) => updateCrop({ left: Number(e.target.value) })}
                className="w-full bg-black border border-white/10 rounded px-2 py-1 text-white font-bold"
              />
            </div>
            <div>
              <label className="text-gray-400">Crop Right %</label>
              <input
                type="number"
                min={0}
                max={45}
                value={clip.crop?.right || 0}
                onChange={(e) => updateCrop({ right: Number(e.target.value) })}
                className="w-full bg-black border border-white/10 rounded px-2 py-1 text-white font-bold"
              />
            </div>
          </div>
        </div>
      )}

      {/* TRANSITIONS */}
      {(clip.type === "video" || clip.type === "overlay" || clip.type === "logo") && (
        <div className="space-y-2 pt-2 border-t border-white/5">
          <span className="text-[10px] text-purple-400 uppercase font-bold">Transition Effect</span>

          <select
            value={clip.transition?.type || "none"}
            onChange={(e) => updateTransition({ type: e.target.value as TransitionType })}
            className="w-full bg-black border border-white/10 rounded-lg px-2 py-1.5 text-xs text-purple-300 font-bold"
          >
            <option value="none">None</option>
            <option value="fade">Fade In</option>
            <option value="dipToBlack">Dip to Black</option>
            <option value="zoom">Zoom Transition</option>
            <option value="slide">Slide Transition</option>
            <option value="crossfade">Crossfade</option>
          </select>

          {clip.transition?.type !== "none" && (
            <div>
              <label className="text-[10px] text-gray-400">Transition Duration (s)</label>
              <input
                type="number"
                step={0.2}
                min={0.2}
                max={3}
                value={clip.transition?.duration || 1}
                onChange={(e) => updateTransition({ duration: Number(e.target.value) })}
                className="w-full bg-black border border-white/10 rounded px-2 py-1 text-white font-bold"
              />
            </div>
          )}
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

          <div>
            <label className="text-[10px] text-gray-400">Text Animation</label>
            <select
              value={clip.textProps.animationType || "none"}
              onChange={(e) => updateText({ animationType: e.target.value as any })}
              className="w-full bg-black border border-white/10 rounded-lg px-2 py-1 text-xs text-amber-300 font-bold"
            >
              <option value="none">Static Text</option>
              <option value="typewriter">Typewriter Reveal</option>
              <option value="slideUp">Slide Up Smooth</option>
              <option value="pop">Pop Elastic</option>
              <option value="bounce">Bounce In</option>
              <option value="fadeIn">Fade In</option>
            </select>
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
          <div className="flex justify-between items-center text-[10px] text-gray-400">
            <span>Blur</span>
            <button
              onClick={() => toggleKeyframeAtCurrentTime("blur", clip.effectProps?.blur || 0)}
              className={`p-0.5 rounded transition-all ${
                hasKeyframeAtCurrentTime("blur")
                  ? "text-neon-cyan bg-neon-cyan/20 border border-neon-cyan"
                  : "text-gray-500 hover:text-white"
              }`}
              title="Toggle Blur Keyframe"
            >
              <Diamond className="w-3 h-3 fill-current" />
            </button>
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
          <div className="flex justify-between items-center text-[10px] text-gray-400">
            <span>Brightness</span>
            <button
              onClick={() => toggleKeyframeAtCurrentTime("brightness", clip.effectProps?.brightness || 0)}
              className={`p-0.5 rounded transition-all ${
                hasKeyframeAtCurrentTime("brightness")
                  ? "text-neon-cyan bg-neon-cyan/20 border border-neon-cyan"
                  : "text-gray-500 hover:text-white"
              }`}
              title="Toggle Brightness Keyframe"
            >
              <Diamond className="w-3 h-3 fill-current" />
            </button>
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

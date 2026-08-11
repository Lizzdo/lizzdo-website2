import React, { useState } from "react";
import {
  VideoClip,
  VideoProjectData,
  LogoAnimationPreset,
  TransitionType,
  Keyframe,
  InterpolationMode,
  BlendMode,
  FrameShape,
  CornerRadiusProps,
  MaskProps,
  ChromaKeyProps,
  BorderProps,
  ShadowProps,
} from "../../../types/video";
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
  Eye,
  EyeOff,
  Palette,
  Square,
  Circle,
  Box,
  MoveUp,
  MoveDown,
  ArrowUpToLine,
  ArrowDownToLine,
  Grid,
  Lock,
  Unlock,
  Check,
  ShieldAlert,
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

// Module clipboard memory for Keyframe Animation, Style & Effects Copy/Paste
let clipboardKeyframes: Keyframe[] | null = null;
let clipboardStyle: Partial<VideoClip> | null = null;
let clipboardEffects: Partial<VideoClip> | null = null;

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
  const [hasCopiedStyle, setHasCopiedStyle] = useState<boolean>(false);
  const [hasCopiedEffects, setHasCopiedEffects] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"transform" | "compositing" | "effects" | "audio">("transform");

  if (!clip) {
    return (
      <div className="w-full md:w-80 bg-neutral-950 border-l border-white/10 p-4 font-mono text-xs text-gray-400 flex flex-col shrink-0 select-none overflow-y-auto custom-scrollbar space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-white font-bold uppercase">
          <Sliders className="w-4 h-4 text-neon-cyan" />
          <span>Canvas & Guides</span>
        </div>

        {project && onUpdateProject && (
          <div className="space-y-4">
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

            {/* SAFE AREA GUIDES CONTROL */}
            <div className="pt-3 border-t border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-neon-cyan font-bold uppercase flex items-center gap-1">
                  <Grid className="w-3.5 h-3.5" /> Safe Area Guides
                </span>
                <button
                  onClick={() => onUpdateProject({ showGuides: !project.showGuides })}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    project.showGuides
                      ? "border-neon-cyan bg-neon-cyan/20 text-neon-cyan"
                      : "border-white/10 bg-black text-gray-400"
                  }`}
                >
                  {project.showGuides ? "ON" : "OFF"}
                </button>
              </div>

              {project.showGuides && (
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  {(["none", "grid", "youtube", "tiktok", "instagram"] as const).map((preset) => (
                    <button
                      key={preset}
                      onClick={() => onUpdateProject({ guidePreset: preset })}
                      className={`py-1 rounded border text-[9px] font-bold uppercase ${
                        (project.guidePreset || "none") === preset
                          ? "border-neon-cyan bg-neon-cyan/20 text-neon-cyan"
                          : "border-white/10 bg-black text-gray-400 hover:text-white"
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="pt-4 text-center text-gray-500 border-t border-white/5 space-y-1">
          <p className="font-bold text-gray-400">No Clip Selected</p>
          <p className="text-[10px]">Select any clip on the timeline to edit properties, PIP, masks, effects, or chroma key.</p>
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

  // PIP Presets Application
  const applyPipPreset = (preset: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center" | "custom") => {
    const pw = project?.width || 1920;
    const ph = project?.height || 1080;

    let posX = 0;
    let posY = 0;
    const scale = preset === "center" ? 0.5 : 0.35;

    switch (preset) {
      case "top-left":
        posX = -pw * 0.28;
        posY = -ph * 0.28;
        break;
      case "top-right":
        posX = pw * 0.28;
        posY = -ph * 0.28;
        break;
      case "bottom-left":
        posX = -pw * 0.28;
        posY = ph * 0.28;
        break;
      case "bottom-right":
        posX = pw * 0.28;
        posY = ph * 0.28;
        break;
      case "center":
        posX = 0;
        posY = 0;
        break;
    }

    onUpdateClip(clip.id, {
      posX: Math.round(posX),
      posY: Math.round(posY),
      scale,
      frameShape: clip.frameShape || "rounded",
      border: clip.border || { width: 2, color: "#00f5ff", opacity: 1 },
      shadow: clip.shadow || { offsetX: 4, offsetY: 8, blur: 16, color: "#000000", opacity: 0.8, spread: 0 },
    });
  };

  // Style Copy / Paste
  const handleCopyStyle = () => {
    clipboardStyle = {
      border: clip.border ? { ...clip.border } : undefined,
      shadow: clip.shadow ? { ...clip.shadow } : undefined,
      cornerRadius: clip.cornerRadius ? { ...clip.cornerRadius } : undefined,
      frameShape: clip.frameShape,
      blendMode: clip.blendMode,
      mask: clip.mask ? { ...clip.mask } : undefined,
      opacity: clip.opacity,
    };
    setHasCopiedStyle(true);
    setTimeout(() => setHasCopiedStyle(false), 2000);
  };

  const handlePasteStyle = () => {
    if (!clipboardStyle) return;
    onUpdateClip(clip.id, { ...clipboardStyle });
  };

  // Effects Copy / Paste
  const handleCopyEffects = () => {
    clipboardEffects = {
      effectProps: clip.effectProps ? { ...clip.effectProps } : undefined,
      chromaKey: clip.chromaKey ? { ...clip.chromaKey } : undefined,
    };
    setHasCopiedEffects(true);
    setTimeout(() => setHasCopiedEffects(false), 2000);
  };

  const handlePasteEffects = () => {
    if (!clipboardEffects) return;
    onUpdateClip(clip.id, { ...clipboardEffects });
  };

  // Layer Reordering
  const handleLayerOrder = (action: "bringForward" | "sendBackward" | "bringToFront" | "sendToBack") => {
    if (!project || !onUpdateProject) return;
    const tracks = [...project.tracks];
    const trackIdx = tracks.findIndex((t) => t.id === clip.trackId);
    if (trackIdx === -1) return;

    if (action === "bringForward" && trackIdx < tracks.length - 1) {
      const temp = tracks[trackIdx];
      tracks[trackIdx] = tracks[trackIdx + 1];
      tracks[trackIdx + 1] = temp;
    } else if (action === "sendBackward" && trackIdx > 0) {
      const temp = tracks[trackIdx];
      tracks[trackIdx] = tracks[trackIdx - 1];
      tracks[trackIdx - 1] = temp;
    } else if (action === "bringToFront") {
      const [item] = tracks.splice(trackIdx, 1);
      tracks.push(item);
    } else if (action === "sendToBack") {
      const [item] = tracks.splice(trackIdx, 1);
      tracks.unshift(item);
    }

    onUpdateProject({ tracks });
  };

  const updateChromaKey = (updated: Partial<ChromaKeyProps>) => {
    onUpdateClip(clip.id, {
      chromaKey: {
        enabled: clip.chromaKey?.enabled || false,
        keyColor: clip.chromaKey?.keyColor || "#00ff00",
        similarity: clip.chromaKey?.similarity ?? 0.3,
        tolerance: clip.chromaKey?.tolerance ?? 0.1,
        feather: clip.chromaKey?.feather ?? 2,
        spillReduction: clip.chromaKey?.spillReduction ?? 0.5,
        ...updated,
      },
    });
  };

  const updateCornerRadius = (updated: Partial<CornerRadiusProps>) => {
    const current = clip.cornerRadius || { topLeft: 16, topRight: 16, bottomLeft: 16, bottomRight: 16, isLinked: true };
    if (updated.isLinked || (current.isLinked && updated.topLeft !== undefined)) {
      const val = updated.topLeft ?? current.topLeft;
      onUpdateClip(clip.id, {
        cornerRadius: {
          topLeft: val,
          topRight: val,
          bottomLeft: val,
          bottomRight: val,
          isLinked: updated.isLinked ?? current.isLinked,
        },
      });
    } else {
      onUpdateClip(clip.id, {
        cornerRadius: {
          ...current,
          ...updated,
        },
      });
    }
  };

  const updateMask = (updated: Partial<MaskProps>) => {
    onUpdateClip(clip.id, {
      mask: {
        type: clip.mask?.type || "none",
        posX: clip.mask?.posX || 0,
        posY: clip.mask?.posY || 0,
        width: clip.mask?.width || 400,
        height: clip.mask?.height || 225,
        scale: clip.mask?.scale || 1,
        rotation: clip.mask?.rotation || 0,
        feather: clip.mask?.feather || 0,
        isInverted: clip.mask?.isInverted || false,
        ...updated,
      },
    });
  };

  const updateBorder = (updated: Partial<BorderProps>) => {
    onUpdateClip(clip.id, {
      border: {
        width: clip.border?.width || 0,
        color: clip.border?.color || "#00f5ff",
        opacity: clip.border?.opacity ?? 1,
        ...updated,
      },
    });
  };

  const updateShadow = (updated: Partial<ShadowProps>) => {
    onUpdateClip(clip.id, {
      shadow: {
        offsetX: clip.shadow?.offsetX || 4,
        offsetY: clip.shadow?.offsetY || 6,
        blur: clip.shadow?.blur || 12,
        color: clip.shadow?.color || "#000000",
        opacity: clip.shadow?.opacity ?? 0.8,
        spread: clip.shadow?.spread || 0,
        ...updated,
      },
    });
  };

  return (
    <div className="w-full md:w-80 bg-neutral-950 border-l border-white/10 p-4 flex flex-col shrink-0 font-mono text-xs text-gray-300 overflow-y-auto custom-scrollbar space-y-4 select-none">
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

      {/* INSPECTOR TAB NAVIGATION */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-black rounded-xl border border-white/10 text-[9px] font-bold uppercase">
        <button
          onClick={() => setActiveTab("transform")}
          className={`py-1.5 rounded-lg transition-all ${
            activeTab === "transform" ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan" : "text-gray-400 hover:text-white"
          }`}
        >
          Layout
        </button>
        <button
          onClick={() => setActiveTab("compositing")}
          className={`py-1.5 rounded-lg transition-all ${
            activeTab === "compositing" ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan" : "text-gray-400 hover:text-white"
          }`}
        >
          PIP/Blend
        </button>
        <button
          onClick={() => setActiveTab("effects")}
          className={`py-1.5 rounded-lg transition-all ${
            activeTab === "effects" ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan" : "text-gray-400 hover:text-white"
          }`}
        >
          Key/Effects
        </button>
        <button
          onClick={() => setActiveTab("audio")}
          className={`py-1.5 rounded-lg transition-all ${
            activeTab === "audio" ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan" : "text-gray-400 hover:text-white"
          }`}
        >
          Audio
        </button>
      </div>

      {/* QUICK STYLE & EFFECTS COPY / PASTE BAR */}
      <div className="grid grid-cols-2 gap-1.5 text-[9px] font-bold">
        <button
          onClick={handleCopyStyle}
          className="py-1 px-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-300 flex items-center justify-center gap-1"
        >
          {hasCopiedStyle ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>{hasCopiedStyle ? "Style Copied!" : "Copy Style"}</span>
        </button>
        <button
          onClick={handlePasteStyle}
          className="py-1 px-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-300 flex items-center justify-center gap-1"
          title="Paste Border, Corners, Shadow, Mask, Blend Mode"
        >
          <Zap className="w-3 h-3" />
          <span>Paste Style</span>
        </button>
      </div>

      {/* TAB 1: LAYOUT & TRANSFORM & KEYFRAMES */}
      {activeTab === "transform" && (
        <div className="space-y-4">
          {/* QUICK CLIP ACTIONS */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onFreezeFrame(clip.id)}
              className="p-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-300 font-bold text-[10px] flex items-center justify-center gap-1"
            >
              <Snowflake className="w-3.5 h-3.5" /> Freeze Frame
            </button>
            {clip.type === "video" && (
              <button
                onClick={() => onDetachAudio(clip.id)}
                className="p-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-300 font-bold text-[10px] flex items-center justify-center gap-1"
              >
                <Music className="w-3.5 h-3.5" /> Detach Audio
              </button>
            )}
          </div>

          {/* LAYER ORDERING */}
          <div className="space-y-1.5 pt-2 border-t border-white/5">
            <span className="text-[10px] text-gray-500 uppercase font-bold">Layer Order</span>
            <div className="grid grid-cols-4 gap-1 text-[9px] font-bold">
              <button
                onClick={() => handleLayerOrder("bringToFront")}
                className="p-1.5 rounded bg-black border border-white/10 hover:border-neon-cyan text-gray-300 flex flex-col items-center gap-0.5"
                title="Bring to Front"
              >
                <ArrowUpToLine className="w-3 h-3" /> Top
              </button>
              <button
                onClick={() => handleLayerOrder("bringForward")}
                className="p-1.5 rounded bg-black border border-white/10 hover:border-neon-cyan text-gray-300 flex flex-col items-center gap-0.5"
                title="Bring Forward"
              >
                <MoveUp className="w-3 h-3" /> Up
              </button>
              <button
                onClick={() => handleLayerOrder("sendBackward")}
                className="p-1.5 rounded bg-black border border-white/10 hover:border-neon-cyan text-gray-300 flex flex-col items-center gap-0.5"
                title="Send Backward"
              >
                <MoveDown className="w-3 h-3" /> Down
              </button>
              <button
                onClick={() => handleLayerOrder("sendToBack")}
                className="p-1.5 rounded bg-black border border-white/10 hover:border-neon-cyan text-gray-300 flex flex-col items-center gap-0.5"
                title="Send to Back"
              >
                <ArrowDownToLine className="w-3 h-3" /> Bottom
              </button>
            </div>
          </div>

          {/* TRANSFORM & KEYFRAMES */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <span className="text-[10px] text-gray-500 uppercase font-bold">Transform & Keyframes</span>

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

            <button
              onClick={() => onUpdateClip(clip.id, { posX: 0, posY: 0, scale: 1, rotation: 0, opacity: 1 })}
              className="w-full py-1.5 rounded bg-black border border-white/10 hover:border-neon-cyan text-gray-300 font-bold text-[10px]"
            >
              Reset Transform
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: PIP, FRAMES, CORNERS, BLEND MODES, SHADOWS, BORDERS */}
      {activeTab === "compositing" && (
        <div className="space-y-4">
          {/* PIP PRESETS */}
          <div className="space-y-2">
            <span className="text-[10px] text-neon-cyan font-bold uppercase">Picture-in-Picture Presets</span>
            <div className="grid grid-cols-3 gap-1.5 text-[9px] font-bold">
              <button
                onClick={() => applyPipPreset("top-left")}
                className="py-1.5 rounded bg-black border border-white/10 hover:border-neon-cyan text-gray-300"
              >
                Top Left
              </button>
              <button
                onClick={() => applyPipPreset("top-right")}
                className="py-1.5 rounded bg-black border border-white/10 hover:border-neon-cyan text-gray-300"
              >
                Top Right
              </button>
              <button
                onClick={() => applyPipPreset("center")}
                className="py-1.5 rounded bg-black border border-white/10 hover:border-neon-cyan text-gray-300"
              >
                Center
              </button>
              <button
                onClick={() => applyPipPreset("bottom-left")}
                className="py-1.5 rounded bg-black border border-white/10 hover:border-neon-cyan text-gray-300"
              >
                Bottom Left
              </button>
              <button
                onClick={() => applyPipPreset("bottom-right")}
                className="py-1.5 rounded bg-black border border-white/10 hover:border-neon-cyan text-gray-300"
              >
                Bottom Right
              </button>
              <button
                onClick={() => applyPipPreset("custom")}
                className="py-1.5 rounded bg-black border border-white/10 hover:border-neon-cyan text-gray-300"
              >
                Custom
              </button>
            </div>
          </div>

          {/* BLEND MODES */}
          <div className="space-y-1.5 pt-2 border-t border-white/5">
            <span className="text-[10px] text-gray-400 uppercase font-bold">Blend Mode</span>
            <select
              value={clip.blendMode || "normal"}
              onChange={(e) => onUpdateClip(clip.id, { blendMode: e.target.value as BlendMode })}
              className="w-full bg-black border border-white/10 rounded-lg px-2 py-1.5 text-xs text-neon-cyan font-bold"
            >
              <option value="normal">Normal</option>
              <option value="multiply">Multiply</option>
              <option value="screen">Screen</option>
              <option value="overlay">Overlay</option>
              <option value="darken">Darken</option>
              <option value="lighten">Lighten</option>
              <option value="difference">Difference</option>
              <option value="color-dodge">Color Dodge</option>
              <option value="color-burn">Color Burn</option>
            </select>
          </div>

          {/* FRAME SHAPE & CORNER RADIUS CONTROL */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <span className="text-[10px] text-gray-400 uppercase font-bold">Frame Shape & Corners</span>
            <div className="grid grid-cols-3 gap-1.5 text-[9px] font-bold">
              <button
                onClick={() => onUpdateClip(clip.id, { frameShape: "rectangle" })}
                className={`py-1.5 rounded border ${
                  (clip.frameShape || "rectangle") === "rectangle"
                    ? "border-neon-cyan bg-neon-cyan/20 text-neon-cyan"
                    : "border-white/10 bg-black text-gray-400"
                }`}
              >
                Rectangle
              </button>
              <button
                onClick={() => onUpdateClip(clip.id, { frameShape: "rounded" })}
                className={`py-1.5 rounded border ${
                  clip.frameShape === "rounded"
                    ? "border-neon-cyan bg-neon-cyan/20 text-neon-cyan"
                    : "border-white/10 bg-black text-gray-400"
                }`}
              >
                Rounded
              </button>
              <button
                onClick={() => onUpdateClip(clip.id, { frameShape: "circle" })}
                className={`py-1.5 rounded border ${
                  clip.frameShape === "circle"
                    ? "border-neon-cyan bg-neon-cyan/20 text-neon-cyan"
                    : "border-white/10 bg-black text-gray-400"
                }`}
              >
                Circle
              </button>
            </div>

            {clip.frameShape === "rounded" && (
              <div className="space-y-2 pt-1 bg-black/50 p-2 rounded-xl border border-white/5">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-gray-400 font-bold">Independent Corner Radius</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateCornerRadius({ isLinked: !clip.cornerRadius?.isLinked })}
                      className="p-1 hover:text-white text-neon-cyan"
                      title={clip.cornerRadius?.isLinked ? "Unlink Corners" : "Link Corners"}
                    >
                      {clip.cornerRadius?.isLinked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                    </button>
                    <button
                      onClick={() => updateCornerRadius({ topLeft: 0, topRight: 0, bottomLeft: 0, bottomRight: 0 })}
                      className="px-1.5 py-0.5 rounded bg-neutral-900 border border-white/10 text-[9px] text-gray-300"
                    >
                      90° Sharp
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div>
                    <label className="text-gray-500">Top-Left ({clip.cornerRadius?.topLeft || 16}px)</label>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={clip.cornerRadius?.topLeft || 16}
                      onChange={(e) => updateCornerRadius({ topLeft: Number(e.target.value) })}
                      className="w-full h-1 accent-neon-cyan"
                    />
                  </div>
                  <div>
                    <label className="text-gray-500">Top-Right ({clip.cornerRadius?.topRight || 16}px)</label>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={clip.cornerRadius?.topRight || 16}
                      onChange={(e) => updateCornerRadius({ topRight: Number(e.target.value) })}
                      className="w-full h-1 accent-neon-cyan"
                      disabled={clip.cornerRadius?.isLinked}
                    />
                  </div>
                  <div>
                    <label className="text-gray-500">Bottom-Left ({clip.cornerRadius?.bottomLeft || 16}px)</label>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={clip.cornerRadius?.bottomLeft || 16}
                      onChange={(e) => updateCornerRadius({ bottomLeft: Number(e.target.value) })}
                      className="w-full h-1 accent-neon-cyan"
                      disabled={clip.cornerRadius?.isLinked}
                    />
                  </div>
                  <div>
                    <label className="text-gray-500">Bottom-Right ({clip.cornerRadius?.bottomRight || 16}px)</label>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={clip.cornerRadius?.bottomRight || 16}
                      onChange={(e) => updateCornerRadius({ bottomRight: Number(e.target.value) })}
                      className="w-full h-1 accent-neon-cyan"
                      disabled={clip.cornerRadius?.isLinked}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* BORDER & STROKE */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <span className="text-[10px] text-gray-400 uppercase font-bold">Border & Stroke</span>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-gray-400">Border Width ({clip.border?.width || 0}px)</span>
                <input
                  type="color"
                  value={clip.border?.color || "#00f5ff"}
                  onChange={(e) => updateBorder({ color: e.target.value })}
                  className="w-5 h-5 rounded cursor-pointer border border-white/10 bg-transparent"
                />
              </div>
              <input
                type="range"
                min={0}
                max={20}
                value={clip.border?.width || 0}
                onChange={(e) => updateBorder({ width: Number(e.target.value) })}
                className="w-full h-1 accent-neon-cyan"
              />
            </div>
          </div>

          {/* DROP SHADOW */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <span className="text-[10px] text-gray-400 uppercase font-bold">Drop Shadow</span>
            <div className="space-y-2 text-[10px]">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Shadow Blur ({clip.shadow?.blur || 0}px)</span>
                <input
                  type="color"
                  value={clip.shadow?.color || "#000000"}
                  onChange={(e) => updateShadow({ color: e.target.value })}
                  className="w-5 h-5 rounded cursor-pointer border border-white/10 bg-transparent"
                />
              </div>
              <input
                type="range"
                min={0}
                max={50}
                value={clip.shadow?.blur || 0}
                onChange={(e) => updateShadow({ blur: Number(e.target.value) })}
                className="w-full h-1 accent-neon-cyan"
              />

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-gray-500">Offset X</label>
                  <input
                    type="number"
                    value={clip.shadow?.offsetX || 0}
                    onChange={(e) => updateShadow({ offsetX: Number(e.target.value) })}
                    className="w-full bg-black border border-white/10 rounded px-2 py-1 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-gray-500">Offset Y</label>
                  <input
                    type="number"
                    value={clip.shadow?.offsetY || 0}
                    onChange={(e) => updateShadow({ offsetY: Number(e.target.value) })}
                    className="w-full bg-black border border-white/10 rounded px-2 py-1 text-white font-bold"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CHROMA KEY, MASKS, & EFFECTS STACK */}
      {activeTab === "effects" && (
        <div className="space-y-4">
          {/* BEFORE / AFTER BYPASS TOGGLE */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-purple-500/10 border border-purple-500/30">
            <span className="text-[10px] text-purple-300 font-bold uppercase flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> Before / After Preview
            </span>
            <button
              onClick={() => onUpdateClip(clip.id, { isBypassedEffects: !clip.isBypassedEffects })}
              className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all ${
                clip.isBypassedEffects
                  ? "border-amber-500/50 bg-amber-500/20 text-amber-300"
                  : "border-purple-500/50 bg-purple-500/20 text-purple-300"
              }`}
            >
              {clip.isBypassedEffects ? "ORIGINAL" : "EDITED"}
            </button>
          </div>

          {/* CHROMA KEY (GREEN SCREEN) ENGINE */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Chroma Key (Green Screen)
              </span>
              <button
                onClick={() => updateChromaKey({ enabled: !clip.chromaKey?.enabled })}
                className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                  clip.chromaKey?.enabled
                    ? "border-emerald-400 bg-emerald-500/20 text-emerald-300"
                    : "border-white/10 bg-black text-gray-400"
                }`}
              >
                {clip.chromaKey?.enabled ? "ENABLED" : "DISABLED"}
              </button>
            </div>

            {clip.chromaKey?.enabled && (
              <div className="space-y-3 pt-1 bg-black/50 p-2.5 rounded-xl border border-white/5 text-[10px]">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 font-bold">Key Color</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={clip.chromaKey?.keyColor || "#00ff00"}
                      onChange={(e) => updateChromaKey({ keyColor: e.target.value })}
                      className="w-6 h-6 rounded cursor-pointer border border-white/10 bg-transparent"
                    />
                    <button
                      onClick={() => updateChromaKey({ keyColor: "#00ff00" })}
                      className="px-1.5 py-0.5 rounded bg-emerald-900/40 border border-emerald-500/30 text-emerald-300 text-[9px]"
                    >
                      Green
                    </button>
                    <button
                      onClick={() => updateChromaKey({ keyColor: "#0000ff" })}
                      className="px-1.5 py-0.5 rounded bg-blue-900/40 border border-blue-500/30 text-blue-300 text-[9px]"
                    >
                      Blue
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-gray-400">
                    <span>Similarity ({Math.round((clip.chromaKey?.similarity ?? 0.3) * 100)}%)</span>
                  </div>
                  <input
                    type="range"
                    min={0.05}
                    max={0.8}
                    step={0.02}
                    value={clip.chromaKey?.similarity ?? 0.3}
                    onChange={(e) => updateChromaKey({ similarity: Number(e.target.value) })}
                    className="w-full h-1 accent-emerald-400 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-gray-400">
                    <span>Edge Tolerance ({Math.round((clip.chromaKey?.tolerance ?? 0.1) * 100)}%)</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={0.5}
                    step={0.02}
                    value={clip.chromaKey?.tolerance ?? 0.1}
                    onChange={(e) => updateChromaKey({ tolerance: Number(e.target.value) })}
                    className="w-full h-1 accent-emerald-400 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-gray-400">
                    <span>Spill Reduction ({Math.round((clip.chromaKey?.spillReduction ?? 0.5) * 100)}%)</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.1}
                    value={clip.chromaKey?.spillReduction ?? 0.5}
                    onChange={(e) => updateChromaKey({ spillReduction: Number(e.target.value) })}
                    className="w-full h-1 accent-emerald-400 cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          {/* MASK SYSTEM */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <span className="text-[10px] text-gray-400 uppercase font-bold">Shape & Vector Mask</span>
            <div className="grid grid-cols-3 gap-1.5 text-[9px] font-bold">
              {(["none", "rectangle", "rounded", "circle", "ellipse"] as const).map((maskType) => (
                <button
                  key={maskType}
                  onClick={() => updateMask({ type: maskType })}
                  className={`py-1.5 rounded border capitalize ${
                    (clip.mask?.type || "none") === maskType
                      ? "border-neon-cyan bg-neon-cyan/20 text-neon-cyan"
                      : "border-white/10 bg-black text-gray-400"
                  }`}
                >
                  {maskType}
                </button>
              ))}
            </div>

            {clip.mask && clip.mask.type !== "none" && (
              <div className="space-y-2 pt-1 bg-black/50 p-2.5 rounded-xl border border-white/5 text-[10px]">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 font-bold">Invert Mask</span>
                  <input
                    type="checkbox"
                    checked={clip.mask.isInverted}
                    onChange={(e) => updateMask({ isInverted: e.target.checked })}
                    className="accent-neon-cyan cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-gray-500">Mask Pos X</label>
                    <input
                      type="number"
                      value={clip.mask.posX}
                      onChange={(e) => updateMask({ posX: Number(e.target.value) })}
                      className="w-full bg-black border border-white/10 rounded px-2 py-1 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-gray-500">Mask Pos Y</label>
                    <input
                      type="number"
                      value={clip.mask.posY}
                      onChange={(e) => updateMask({ posY: Number(e.target.value) })}
                      className="w-full bg-black border border-white/10 rounded px-2 py-1 text-white font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-gray-400">
                    <span>Mask Feather ({clip.mask.feather || 0}px)</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={50}
                    value={clip.mask.feather || 0}
                    onChange={(e) => updateMask({ feather: Number(e.target.value) })}
                    className="w-full h-1 accent-neon-cyan"
                  />
                </div>
              </div>
            )}
          </div>

          {/* COLOR EFFECTS & FILTERS */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <span className="text-[10px] text-neon-cyan uppercase font-bold">Color Effects & Filters</span>

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

            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] text-gray-400">
                <span>Contrast</span>
                <button
                  onClick={() => toggleKeyframeAtCurrentTime("contrast", clip.effectProps?.contrast || 0)}
                  className={`p-0.5 rounded transition-all ${
                    hasKeyframeAtCurrentTime("contrast")
                      ? "text-neon-cyan bg-neon-cyan/20 border border-neon-cyan"
                      : "text-gray-500 hover:text-white"
                  }`}
                >
                  <Diamond className="w-3 h-3 fill-current" />
                </button>
              </div>
              <input
                type="range"
                min={-100}
                max={100}
                value={clip.effectProps?.contrast || 0}
                onChange={(e) => updateEffect({ contrast: Number(e.target.value) })}
                className="w-full h-1 accent-neon-cyan cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] text-gray-400">
                <span>Saturation</span>
                <button
                  onClick={() => toggleKeyframeAtCurrentTime("saturation", clip.effectProps?.saturation || 100)}
                  className={`p-0.5 rounded transition-all ${
                    hasKeyframeAtCurrentTime("saturation")
                      ? "text-neon-cyan bg-neon-cyan/20 border border-neon-cyan"
                      : "text-gray-500 hover:text-white"
                  }`}
                >
                  <Diamond className="w-3 h-3 fill-current" />
                </button>
              </div>
              <input
                type="range"
                min={0}
                max={200}
                value={clip.effectProps?.saturation || 100}
                onChange={(e) => updateEffect({ saturation: Number(e.target.value) })}
                className="w-full h-1 accent-neon-cyan cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIO CONTROLS */}
      {activeTab === "audio" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-emerald-400 uppercase font-bold flex items-center gap-1">
              <Music className="w-3.5 h-3.5" /> Audio Mixing
            </span>
            <button
              onClick={() => onUpdateClip(clip.id, { isMuted: !clip.isMuted })}
              className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                clip.isMuted
                  ? "border-red-500/50 bg-red-500/20 text-red-400"
                  : "border-white/10 bg-black text-gray-400 hover:text-white"
              }`}
            >
              {clip.isMuted ? "MUTED" : "Mute"}
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] text-gray-400">
              <span>Volume ({Math.round((clip.volume || 1) * 100)}%)</span>
              <button
                onClick={() => toggleKeyframeAtCurrentTime("volume", clip.volume)}
                className={`p-0.5 rounded transition-all ${
                  hasKeyframeAtCurrentTime("volume")
                    ? "text-emerald-400 bg-emerald-500/20 border border-emerald-400"
                    : "text-gray-500 hover:text-white"
                }`}
              >
                <Diamond className="w-3 h-3 fill-current" />
              </button>
            </div>
            <input
              type="range"
              min={0}
              max={2}
              step={0.05}
              value={clip.volume || 1}
              onChange={(e) => onUpdateClip(clip.id, { volume: Number(e.target.value) })}
              className="w-full h-1 accent-emerald-400 cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] text-gray-400">
              <span>Stereo Pan ({clip.pan === 0 || !clip.pan ? "Center" : clip.pan < 0 ? `L ${Math.round(Math.abs(clip.pan) * 100)}%` : `R ${Math.round(clip.pan * 100)}%`})</span>
            </div>
            <input
              type="range"
              min={-1}
              max={1}
              step={0.1}
              value={clip.pan || 0}
              onChange={(e) => onUpdateClip(clip.id, { pan: Number(e.target.value) })}
              className="w-full h-1 accent-emerald-400 cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
};

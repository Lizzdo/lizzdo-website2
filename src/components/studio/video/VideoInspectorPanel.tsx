import React, { useState, useEffect } from "react";
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
  TextClipProps,
} from "../../../types/video";
import { AVAILABLE_FONTS, loadFontFamily } from "../../../utils/fontLoader";
import { createDefaultTextProps } from "../../../utils/videoEngine";
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
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Baseline,
  Save,
  ArrowDownUp,
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
  const [activeTab, setActiveTab] = useState<"text" | "transform" | "compositing" | "effects" | "audio">("transform");
  const [presetSavedNotice, setPresetSavedNotice] = useState<string | null>(null);

  useEffect(() => {
    if (clip?.type === "text") {
      setActiveTab("text");
    }
  }, [clip?.id, clip?.type]);

  const updateTextProps = (updated: Partial<TextClipProps>) => {
    if (!clip) return;
    const currentTp = clip.textProps || createDefaultTextProps();
    onUpdateClip(clip.id, { textProps: { ...currentTp, ...updated } });
  };

  const handleSaveAsCustomTextPreset = () => {
    if (!clip || !clip.textProps) return;
    const presetName = prompt("Enter a name for your Custom Text Preset:", clip.textProps.content || "My Text Preset");
    if (!presetName) return;

    const newPreset = {
      id: `custom-text-${Date.now()}`,
      name: presetName,
      textProps: { ...clip.textProps },
    };

    try {
      const stored = localStorage.getItem("lizzdo_custom_text_presets");
      const list = stored ? JSON.parse(stored) : [];
      list.push(newPreset);
      localStorage.setItem("lizzdo_custom_text_presets", JSON.stringify(list));
      setPresetSavedNotice(`Saved "${presetName}" to Custom Presets!`);
      setTimeout(() => setPresetSavedNotice(null), 3000);
    } catch (e) {
      console.error(e);
    }
  };

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
      textProps: clip.textProps ? { ...clip.textProps } : undefined,
    };
    setHasCopiedStyle(true);
    setTimeout(() => setHasCopiedStyle(false), 2000);
  };

  const handlePasteStyle = () => {
    if (!clipboardStyle) return;
    if (clip.type === "text" && clipboardStyle.textProps) {
      const currentContent = clip.textProps?.content || "";
      const currentSecondary = clip.textProps?.secondaryContent || "";
      onUpdateClip(clip.id, {
        textProps: {
          ...clipboardStyle.textProps,
          content: currentContent,
          secondaryContent: currentSecondary,
        },
      });
    } else {
      onUpdateClip(clip.id, { ...clipboardStyle });
    }
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

  const updateEffect = (updated: any) => {
    onUpdateClip(clip.id, {
      effectProps: {
        blur: clip.effectProps?.blur || 0,
        brightness: clip.effectProps?.brightness || 0,
        contrast: clip.effectProps?.contrast || 0,
        saturation: clip.effectProps?.saturation ?? 100,
        hueRotate: clip.effectProps?.hueRotate || 0,
        sepia: clip.effectProps?.sepia || 0,
        grayscale: clip.effectProps?.grayscale || 0,
        invert: clip.effectProps?.invert || 0,
        vignette: clip.effectProps?.vignette || 0,
        grain: clip.effectProps?.grain || 0,
        sharpness: clip.effectProps?.sharpness || 0,
        bloom: clip.effectProps?.bloom || 0,
        chromaticAberration: clip.effectProps?.chromaticAberration || 0,
        glowColor: clip.effectProps?.glowColor || "#00f5ff",
        glowBlur: clip.effectProps?.glowBlur || 0,
        lutPreset: clip.effectProps?.lutPreset || "none",
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
      <div className={`grid ${clip.type === "text" ? "grid-cols-5" : "grid-cols-4"} gap-1 p-1 bg-black rounded-xl border border-white/10 text-[9px] font-bold uppercase`}>
        {clip.type === "text" && (
          <button
            onClick={() => setActiveTab("text")}
            className={`py-1.5 rounded-lg transition-all ${
              activeTab === "text" ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan" : "text-gray-400 hover:text-white"
            }`}
          >
            Type
          </button>
        )}
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

      {/* TAB 0: ADVANCED TEXT & TYPOGRAPHY STUDIO */}
      {activeTab === "text" && clip.type === "text" && (
        <div className="space-y-4">
          {presetSavedNotice && (
            <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              <span>{presetSavedNotice}</span>
            </div>
          )}

          {/* PRESET SAVE & QUICK COPY */}
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={handleSaveAsCustomTextPreset}
              className="py-1.5 px-2 rounded-lg bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 text-purple-300 font-bold text-[10px] flex items-center justify-center gap-1"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Preset</span>
            </button>
            <button
              onClick={handleCopyStyle}
              className="py-1.5 px-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-300 font-bold text-[10px] flex items-center justify-center gap-1"
            >
              {hasCopiedStyle ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{hasCopiedStyle ? "Style Copied" : "Copy Style"}</span>
            </button>
          </div>

          {/* 1. CONTENT EDITING */}
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-bold text-gray-300">
              <span className="flex items-center gap-1">
                <Type className="w-3 h-3 text-neon-cyan" />
                Text Content
              </span>
              <span className="text-gray-500">
                {(clip.textProps?.content || "").length} chars
              </span>
            </div>
            <textarea
              value={clip.textProps?.content || ""}
              onChange={(e) => updateTextProps({ content: e.target.value })}
              placeholder="Enter text..."
              rows={3}
              className="w-full bg-black border border-white/10 rounded-lg p-2 text-white font-sans text-xs focus:outline-none focus:border-neon-cyan resize-none"
            />

            {/* SECONDARY TEXT INPUT FOR LOWER THIRDS & SUBTITLES */}
            <div className="pt-1 border-t border-white/5 space-y-1">
              <label className="text-[9px] font-bold text-gray-400">
                Secondary Line / Job Title (Lower Thirds)
              </label>
              <input
                type="text"
                value={clip.textProps?.secondaryContent || ""}
                onChange={(e) => updateTextProps({ secondaryContent: e.target.value })}
                placeholder="e.g. Senior Motion Designer..."
                className="w-full bg-black border border-white/10 rounded-lg px-2 py-1 text-white font-sans text-xs focus:outline-none focus:border-neon-cyan"
              />
            </div>
          </div>

          {/* 2. TYPOGRAPHY & FONT STYLING */}
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <span className="text-[10px] font-bold text-gray-300 flex items-center gap-1">
              <Baseline className="w-3 h-3 text-neon-cyan" />
              Font & Typography
            </span>

            {/* Font Family Dropdown */}
            <div className="space-y-1">
              <label className="text-[9px] text-gray-400 font-bold">Font Family</label>
              <select
                value={clip.textProps?.fontFamily || "Orbitron"}
                onChange={(e) => {
                  loadFontFamily(e.target.value);
                  updateTextProps({ fontFamily: e.target.value });
                }}
                className="w-full bg-black border border-white/10 rounded-lg px-2 py-1.5 text-white font-sans text-xs focus:outline-none focus:border-neon-cyan"
              >
                {AVAILABLE_FONTS.map((font) => (
                  <option key={font.family} value={font.family}>
                    {font.family} ({font.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Font Size & Weight */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] text-gray-400 font-bold">
                  <span>Size</span>
                  <span>{clip.textProps?.fontSize || 36}px</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="180"
                  value={clip.textProps?.fontSize || 36}
                  onChange={(e) => updateTextProps({ fontSize: Number(e.target.value) })}
                  className="w-full accent-neon-cyan h-1.5 bg-black rounded cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] text-gray-400 font-bold">Weight</label>
                <select
                  value={clip.textProps?.fontWeight || 700}
                  onChange={(e) => updateTextProps({ fontWeight: Number(e.target.value) })}
                  className="w-full bg-black border border-white/10 rounded-lg px-1.5 py-1 text-white text-xs focus:outline-none focus:border-neon-cyan"
                >
                  <option value={300}>300 - Light</option>
                  <option value={400}>400 - Normal</option>
                  <option value={600}>600 - SemiBold</option>
                  <option value={700}>700 - Bold</option>
                  <option value={900}>900 - ExtraBold</option>
                </select>
              </div>
            </div>

            {/* Quick Toggle Buttons: Bold, Italic, Underline, Uppercase */}
            <div className="grid grid-cols-4 gap-1">
              <button
                onClick={() => updateTextProps({ fontWeight: clip.textProps?.fontWeight === 700 ? 400 : 700 })}
                className={`py-1 rounded border text-[10px] font-bold flex items-center justify-center gap-1 ${
                  (clip.textProps?.fontWeight || 700) >= 700
                    ? "border-neon-cyan bg-neon-cyan/20 text-neon-cyan"
                    : "border-white/10 bg-black text-gray-400 hover:text-white"
                }`}
                title="Bold"
              >
                <Bold className="w-3 h-3" />
                <span>B</span>
              </button>

              <button
                onClick={() => updateTextProps({ isItalic: !clip.textProps?.isItalic })}
                className={`py-1 rounded border text-[10px] font-bold flex items-center justify-center gap-1 ${
                  clip.textProps?.isItalic
                    ? "border-neon-cyan bg-neon-cyan/20 text-neon-cyan"
                    : "border-white/10 bg-black text-gray-400 hover:text-white"
                }`}
                title="Italic"
              >
                <Italic className="w-3 h-3" />
                <span>I</span>
              </button>

              <button
                onClick={() => updateTextProps({ isUnderline: !clip.textProps?.isUnderline })}
                className={`py-1 rounded border text-[10px] font-bold flex items-center justify-center gap-1 ${
                  clip.textProps?.isUnderline
                    ? "border-neon-cyan bg-neon-cyan/20 text-neon-cyan"
                    : "border-white/10 bg-black text-gray-400 hover:text-white"
                }`}
                title="Underline"
              >
                <Underline className="w-3 h-3" />
                <span>U</span>
              </button>

              <button
                onClick={() => updateTextProps({ isUppercase: !clip.textProps?.isUppercase })}
                className={`py-1 rounded border text-[10px] font-bold flex items-center justify-center gap-1 ${
                  clip.textProps?.isUppercase
                    ? "border-neon-cyan bg-neon-cyan/20 text-neon-cyan"
                    : "border-white/10 bg-black text-gray-400 hover:text-white"
                }`}
                title="Uppercase"
              >
                <span>TT</span>
              </button>
            </div>

            {/* Letter Spacing & Keyframe Button */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[9px] text-gray-400 font-bold">
                <span className="flex items-center gap-1">
                  <span>Letter Spacing</span>
                  <span>{clip.textProps?.letterSpacing || 0}px</span>
                </span>
                <button
                  onClick={() => toggleKeyframeAtCurrentTime("letterSpacing", clip.textProps?.letterSpacing || 0)}
                  className={`p-1 rounded ${
                    hasKeyframeAtCurrentTime("letterSpacing")
                      ? "text-amber-400 bg-amber-400/20"
                      : "text-gray-500 hover:text-white"
                  }`}
                  title="Toggle Keyframe for Letter Spacing"
                >
                  <Diamond className="w-3 h-3 fill-current" />
                </button>
              </div>
              <input
                type="range"
                min="-5"
                max="30"
                value={clip.textProps?.letterSpacing || 0}
                onChange={(e) => updateTextProps({ letterSpacing: Number(e.target.value) })}
                className="w-full accent-neon-cyan h-1.5 bg-black rounded cursor-pointer"
              />
            </div>

            {/* Line Height */}
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] text-gray-400 font-bold">
                <span>Line Height</span>
                <span>{(clip.textProps?.lineHeight || 1.2).toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="2.5"
                step="0.1"
                value={clip.textProps?.lineHeight || 1.2}
                onChange={(e) => updateTextProps({ lineHeight: Number(e.target.value) })}
                className="w-full accent-neon-cyan h-1.5 bg-black rounded cursor-pointer"
              />
            </div>
          </div>

          {/* 3. ALIGNMENT & BOUNDING BOX */}
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <span className="text-[10px] font-bold text-gray-300 flex items-center gap-1">
              <AlignLeft className="w-3 h-3 text-neon-cyan" />
              Alignment & Box Bounds
            </span>

            {/* Horizontal Alignment */}
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => updateTextProps({ alignment: "left" })}
                className={`py-1.5 rounded border text-[10px] font-bold flex items-center justify-center gap-1 ${
                  clip.textProps?.alignment === "left"
                    ? "border-neon-cyan bg-neon-cyan/20 text-neon-cyan"
                    : "border-white/10 bg-black text-gray-400 hover:text-white"
                }`}
              >
                <AlignLeft className="w-3 h-3" />
                <span>Left</span>
              </button>
              <button
                onClick={() => updateTextProps({ alignment: "center" })}
                className={`py-1.5 rounded border text-[10px] font-bold flex items-center justify-center gap-1 ${
                  clip.textProps?.alignment === "center" || !clip.textProps?.alignment
                    ? "border-neon-cyan bg-neon-cyan/20 text-neon-cyan"
                    : "border-white/10 bg-black text-gray-400 hover:text-white"
                }`}
              >
                <AlignCenter className="w-3 h-3" />
                <span>Center</span>
              </button>
              <button
                onClick={() => updateTextProps({ alignment: "right" })}
                className={`py-1.5 rounded border text-[10px] font-bold flex items-center justify-center gap-1 ${
                  clip.textProps?.alignment === "right"
                    ? "border-neon-cyan bg-neon-cyan/20 text-neon-cyan"
                    : "border-white/10 bg-black text-gray-400 hover:text-white"
                }`}
              >
                <AlignRight className="w-3 h-3" />
                <span>Right</span>
              </button>
            </div>

            {/* Box Mode */}
            <div className="space-y-2 pt-1 border-t border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-gray-400 font-bold">Box Sizing Mode</span>
                <div className="flex bg-black rounded-lg p-0.5 border border-white/10">
                  <button
                    onClick={() => updateTextProps({ boxMode: "auto" })}
                    className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      clip.textProps?.boxMode !== "fixed"
                        ? "bg-neon-cyan/20 text-neon-cyan"
                        : "text-gray-400"
                    }`}
                  >
                    Auto
                  </button>
                  <button
                    onClick={() => updateTextProps({ boxMode: "fixed" })}
                    className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      clip.textProps?.boxMode === "fixed"
                        ? "bg-neon-cyan/20 text-neon-cyan"
                        : "text-gray-400"
                    }`}
                  >
                    Fixed
                  </button>
                </div>
              </div>

              {clip.textProps?.boxMode === "fixed" && (
                <div className="space-y-2 pt-1">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] text-gray-400 font-bold">
                      <span>Box Width</span>
                      <span>{clip.textProps?.boxWidth || 400}px</span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="1200"
                      value={clip.textProps?.boxWidth || 400}
                      onChange={(e) => updateTextProps({ boxWidth: Number(e.target.value) })}
                      className="w-full accent-neon-cyan h-1.5 bg-black rounded cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 4. FILL COLOR & GRADIENTS */}
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-300 flex items-center gap-1">
                <Palette className="w-3 h-3 text-neon-cyan" />
                Fill & Gradients
              </span>
              <button
                onClick={() => updateTextProps({ gradientEnabled: !clip.textProps?.gradientEnabled })}
                className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                  clip.textProps?.gradientEnabled
                    ? "border-neon-cyan bg-neon-cyan/20 text-neon-cyan"
                    : "border-white/10 bg-black text-gray-400"
                }`}
              >
                {clip.textProps?.gradientEnabled ? "Gradient" : "Solid"}
              </button>
            </div>

            {!clip.textProps?.gradientEnabled ? (
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={clip.textProps?.color || "#00f5ff"}
                  onChange={(e) => updateTextProps({ color: e.target.value })}
                  className="w-7 h-7 rounded border border-white/20 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={clip.textProps?.color || "#00f5ff"}
                  onChange={(e) => updateTextProps({ color: e.target.value })}
                  className="flex-1 bg-black border border-white/10 rounded px-2 py-1 text-xs text-white uppercase font-mono"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] text-gray-400 font-bold block mb-1">Start Color</label>
                    <input
                      type="color"
                      value={clip.textProps?.gradientStart || "#00f5ff"}
                      onChange={(e) => updateTextProps({ gradientStart: e.target.value })}
                      className="w-full h-7 rounded border border-white/20 bg-transparent cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-gray-400 font-bold block mb-1">End Color</label>
                    <input
                      type="color"
                      value={clip.textProps?.gradientEnd || "#ff007f"}
                      onChange={(e) => updateTextProps({ gradientEnd: e.target.value })}
                      className="w-full h-7 rounded border border-white/20 bg-transparent cursor-pointer"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] text-gray-400 font-bold">
                    <span>Angle</span>
                    <span>{clip.textProps?.gradientAngle || 90}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={clip.textProps?.gradientAngle || 90}
                    onChange={(e) => updateTextProps({ gradientAngle: Number(e.target.value) })}
                    className="w-full accent-neon-cyan h-1.5 bg-black rounded cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 5. BACKGROUND BOX & INDEPENDENT CORNERS */}
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-300 flex items-center gap-1">
                <Box className="w-3 h-3 text-neon-cyan" />
                Background Pill
              </span>
              <button
                onClick={() => updateTextProps({ backgroundEnabled: !clip.textProps?.backgroundEnabled })}
                className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                  clip.textProps?.backgroundEnabled !== false
                    ? "border-neon-cyan bg-neon-cyan/20 text-neon-cyan"
                    : "border-white/10 bg-black text-gray-400"
                }`}
              >
                {clip.textProps?.backgroundEnabled !== false ? "ON" : "OFF"}
              </button>
            </div>

            {clip.textProps?.backgroundEnabled !== false && (
              <div className="space-y-3 pt-1">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] text-gray-400 font-bold block mb-1">Bg Color</label>
                    <input
                      type="color"
                      value={clip.textProps?.backgroundColor || "#000000"}
                      onChange={(e) => updateTextProps({ backgroundColor: e.target.value })}
                      className="w-full h-7 rounded border border-white/20 bg-transparent cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-gray-400 font-bold block mb-1">Padding</label>
                    <input
                      type="range"
                      min="0"
                      max="40"
                      value={clip.textProps?.backgroundPadding ?? 12}
                      onChange={(e) => updateTextProps({ backgroundPadding: Number(e.target.value) })}
                      className="w-full accent-neon-cyan h-1.5 bg-black rounded cursor-pointer"
                    />
                  </div>
                </div>

                {/* Corner Radius & Independent Corners */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[9px] font-bold text-gray-400">
                    <span>Corner Radius</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateTextProps({ backgroundCornerRadius: 0, backgroundIndependentCorners: false })}
                        className="px-1.5 py-0.5 rounded bg-black border border-white/10 text-gray-400 hover:text-white"
                        title="0° Sharp Corners"
                      >
                        0° Sharp
                      </button>
                      <button
                        onClick={() =>
                          updateTextProps({
                            backgroundIndependentCorners: !clip.textProps?.backgroundIndependentCorners,
                          })
                        }
                        className={`px-1.5 py-0.5 rounded border ${
                          clip.textProps?.backgroundIndependentCorners
                            ? "border-neon-cyan bg-neon-cyan/20 text-neon-cyan"
                            : "border-white/10 bg-black text-gray-400"
                        }`}
                      >
                        Individual
                      </button>
                    </div>
                  </div>

                  {!clip.textProps?.backgroundIndependentCorners ? (
                    <input
                      type="range"
                      min="0"
                      max="32"
                      value={clip.textProps?.backgroundCornerRadius ?? 8}
                      onChange={(e) => updateTextProps({ backgroundCornerRadius: Number(e.target.value) })}
                      className="w-full accent-neon-cyan h-1.5 bg-black rounded cursor-pointer"
                    />
                  ) : (
                    <div className="grid grid-cols-2 gap-1.5">
                      <div>
                        <span className="text-[8px] text-gray-500">Top-Left</span>
                        <input
                          type="number"
                          min="0"
                          max="40"
                          value={clip.textProps?.backgroundCorners?.topLeft ?? 8}
                          onChange={(e) =>
                            updateTextProps({
                              backgroundCorners: {
                                ...(clip.textProps?.backgroundCorners || { topLeft: 8, topRight: 8, bottomLeft: 8, bottomRight: 8 }),
                                topLeft: Number(e.target.value),
                              },
                            })
                          }
                          className="w-full bg-black border border-white/10 rounded px-1.5 py-0.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <span className="text-[8px] text-gray-500">Top-Right</span>
                        <input
                          type="number"
                          min="0"
                          max="40"
                          value={clip.textProps?.backgroundCorners?.topRight ?? 8}
                          onChange={(e) =>
                            updateTextProps({
                              backgroundCorners: {
                                ...(clip.textProps?.backgroundCorners || { topLeft: 8, topRight: 8, bottomLeft: 8, bottomRight: 8 }),
                                topRight: Number(e.target.value),
                              },
                            })
                          }
                          className="w-full bg-black border border-white/10 rounded px-1.5 py-0.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <span className="text-[8px] text-gray-500">Bottom-Left</span>
                        <input
                          type="number"
                          min="0"
                          max="40"
                          value={clip.textProps?.backgroundCorners?.bottomLeft ?? 8}
                          onChange={(e) =>
                            updateTextProps({
                              backgroundCorners: {
                                ...(clip.textProps?.backgroundCorners || { topLeft: 8, topRight: 8, bottomLeft: 8, bottomRight: 8 }),
                                bottomLeft: Number(e.target.value),
                              },
                            })
                          }
                          className="w-full bg-black border border-white/10 rounded px-1.5 py-0.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <span className="text-[8px] text-gray-500">Bottom-Right</span>
                        <input
                          type="number"
                          min="0"
                          max="40"
                          value={clip.textProps?.backgroundCorners?.bottomRight ?? 8}
                          onChange={(e) =>
                            updateTextProps({
                              backgroundCorners: {
                                ...(clip.textProps?.backgroundCorners || { topLeft: 8, topRight: 8, bottomLeft: 8, bottomRight: 8 }),
                                bottomRight: Number(e.target.value),
                              },
                            })
                          }
                          className="w-full bg-black border border-white/10 rounded px-1.5 py-0.5 text-xs text-white"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Border Options */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/5">
                  <div>
                    <label className="text-[9px] text-gray-400 font-bold block mb-1">Border Width</label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={clip.textProps?.backgroundBorderWidth || 0}
                      onChange={(e) => updateTextProps({ backgroundBorderWidth: Number(e.target.value) })}
                      className="w-full accent-neon-cyan h-1.5 bg-black rounded cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-gray-400 font-bold block mb-1">Border Color</label>
                    <input
                      type="color"
                      value={clip.textProps?.backgroundBorderColor || "#00f5ff"}
                      onChange={(e) => updateTextProps({ backgroundBorderColor: e.target.value })}
                      className="w-full h-7 rounded border border-white/20 bg-transparent cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 6. OUTLINE / STROKE */}
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-300 flex items-center gap-1">
                <Square className="w-3 h-3 text-neon-cyan" />
                Text Outline / Stroke
              </span>
              <button
                onClick={() => updateTextProps({ outlineEnabled: !clip.textProps?.outlineEnabled })}
                className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                  clip.textProps?.outlineEnabled
                    ? "border-neon-cyan bg-neon-cyan/20 text-neon-cyan"
                    : "border-white/10 bg-black text-gray-400"
                }`}
              >
                {clip.textProps?.outlineEnabled ? "ON" : "OFF"}
              </button>
            </div>

            {clip.textProps?.outlineEnabled && (
              <div className="space-y-2 pt-1">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] text-gray-400 font-bold block mb-1">Stroke Color</label>
                    <input
                      type="color"
                      value={clip.textProps?.outlineColor || "#000000"}
                      onChange={(e) => updateTextProps({ outlineColor: e.target.value })}
                      className="w-full h-7 rounded border border-white/20 bg-transparent cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-gray-400 font-bold block mb-1">Width ({clip.textProps?.outlineWidth || 2}px)</label>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={clip.textProps?.outlineWidth || 2}
                      onChange={(e) => updateTextProps({ outlineWidth: Number(e.target.value) })}
                      className="w-full accent-neon-cyan h-1.5 bg-black rounded cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 7. SHADOW & GLOW */}
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-neon-cyan" />
                Text Shadow & Glow
              </span>
              <button
                onClick={() => updateTextProps({ shadowEnabled: !clip.textProps?.shadowEnabled })}
                className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                  clip.textProps?.shadowEnabled !== false
                    ? "border-neon-cyan bg-neon-cyan/20 text-neon-cyan"
                    : "border-white/10 bg-black text-gray-400"
                }`}
              >
                {clip.textProps?.shadowEnabled !== false ? "ON" : "OFF"}
              </button>
            </div>

            {clip.textProps?.shadowEnabled !== false && (
              <div className="space-y-3 pt-1">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] text-gray-400 font-bold block mb-1">Shadow Color</label>
                    <input
                      type="color"
                      value={clip.textProps?.shadowColor || "#000000"}
                      onChange={(e) => updateTextProps({ shadowColor: e.target.value })}
                      className="w-full h-7 rounded border border-white/20 bg-transparent cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-gray-400 font-bold block mb-1">Blur</label>
                    <input
                      type="range"
                      min="0"
                      max="30"
                      value={clip.textProps?.shadowBlur ?? 10}
                      onChange={(e) => updateTextProps({ shadowBlur: Number(e.target.value) })}
                      className="w-full accent-neon-cyan h-1.5 bg-black rounded cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] text-gray-400 font-bold block mb-1">Glow Color</label>
                    <input
                      type="color"
                      value={clip.textProps?.glowColor || "#00f5ff"}
                      onChange={(e) => updateTextProps({ glowColor: e.target.value })}
                      className="w-full h-7 rounded border border-white/20 bg-transparent cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-gray-400 font-bold block mb-1">Glow Blur</label>
                    <input
                      type="range"
                      min="0"
                      max="40"
                      value={clip.textProps?.glowBlur || 0}
                      onChange={(e) => updateTextProps({ glowBlur: Number(e.target.value) })}
                      className="w-full accent-neon-cyan h-1.5 bg-black rounded cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 8. ANIMATIONS & PRESETS */}
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <span className="text-[10px] font-bold text-gray-300 flex items-center gap-1">
              <Zap className="w-3 h-3 text-neon-cyan" />
              Motion & Entrance Animations
            </span>

            <div className="space-y-2">
              <div className="space-y-1">
                <label className="text-[9px] text-gray-400 font-bold">Entrance Effect</label>
                <select
                  value={clip.textProps?.animationIn || clip.textProps?.animationType || "fadeIn"}
                  onChange={(e) => updateTextProps({ animationIn: e.target.value as any, animationType: e.target.value as any })}
                  className="w-full bg-black border border-white/10 rounded-lg px-2 py-1 text-white text-xs focus:outline-none focus:border-neon-cyan"
                >
                  <option value="none">None (Static)</option>
                  <option value="fadeIn">Fade In</option>
                  <option value="slideUp">Slide Up</option>
                  <option value="slideDown">Slide Down</option>
                  <option value="slideLeft">Slide Left</option>
                  <option value="slideRight">Slide Right</option>
                  <option value="scaleIn">Scale / Pop In</option>
                  <option value="typewriter">Typewriter (Char by Char)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] text-gray-400 font-bold">Exit Effect</label>
                <select
                  value={clip.textProps?.animationOut || "fadeOut"}
                  onChange={(e) => updateTextProps({ animationOut: e.target.value as any })}
                  className="w-full bg-black border border-white/10 rounded-lg px-2 py-1 text-white text-xs focus:outline-none focus:border-neon-cyan"
                >
                  <option value="none">None</option>
                  <option value="fadeOut">Fade Out</option>
                  <option value="slideUp">Slide Up</option>
                  <option value="slideDown">Slide Down</option>
                  <option value="slideLeft">Slide Left</option>
                  <option value="slideRight">Slide Right</option>
                  <option value="scaleOut">Scale Out</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

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

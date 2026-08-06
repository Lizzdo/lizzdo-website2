import React, { useRef } from "react";
import {
  ImageEditorTool,
  ColorAdjustments,
  TransformSettings,
  CropRect,
  ImageEffectSettings,
  BackgroundSettings,
  ImageLayer,
  AspectRatioPreset,
} from "../../../types/imageEditor";
import {
  SlidersHorizontal,
  Crop as CropIcon,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Sparkles,
  Palette,
  Layers as LayersIcon,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Plus,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Type,
  Square,
  Circle,
  Star,
  Triangle,
  Upload,
  RotateCcw as ResetIcon,
  Grid,
  HardDrive,
  Wand2,
} from "lucide-react";

interface ImageEditorSidebarProps {
  activeTool: ImageEditorTool;
  adjustments: ColorAdjustments;
  setAdjustments: React.Dispatch<React.SetStateAction<ColorAdjustments>>;
  transform: TransformSettings;
  setTransform: React.Dispatch<React.SetStateAction<TransformSettings>>;
  crop: CropRect;
  setCrop: React.Dispatch<React.SetStateAction<CropRect>>;
  effects: ImageEffectSettings;
  setEffects: React.Dispatch<React.SetStateAction<ImageEffectSettings>>;
  background: BackgroundSettings;
  setBackground: React.Dispatch<React.SetStateAction<BackgroundSettings>>;
  layers: ImageLayer[];
  setLayers: React.Dispatch<React.SetStateAction<ImageLayer[]>>;
  selectedLayerId: string | null;
  setSelectedLayerId: (id: string | null) => void;
  activeImgUrl: string;
  setActiveImgUrl: (url: string) => void;
  onApplyPreset: (presetName: string) => void;
}

export function ImageEditorSidebar({
  activeTool,
  adjustments,
  setAdjustments,
  transform,
  setTransform,
  crop,
  setCrop,
  effects,
  setEffects,
  background,
  setBackground,
  layers,
  setLayers,
  selectedLayerId,
  setSelectedLayerId,
  activeImgUrl,
  setActiveImgUrl,
  onApplyPreset,
}: ImageEditorSidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleImages = [
    {
      name: "Cyber City",
      url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Neon Lights",
      url: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Portrait Art",
      url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Abstract Waves",
      url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  // Helper for file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setActiveImgUrl(url);

      // Also update primary image layer
      setLayers((prev) =>
        prev.map((l) => (l.type === "image" ? { ...l, src: url } : l))
      );
    }
  };

  const handleAddTextLayer = () => {
    const newLayer: ImageLayer = {
      id: `text-${Date.now()}`,
      name: "New Text Layer",
      type: "text",
      visible: true,
      locked: false,
      opacity: 1,
      blendMode: "source-over",
      x: 300,
      y: 300,
      width: 400,
      height: 100,
      rotation: 0,
      text: "CREATIVE VISION",
      fontFamily: "sans-serif",
      fontSize: 48,
      fontWeight: "bold",
      textColor: "#a855f7",
      textAlign: "center",
    };
    setLayers((prev) => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
  };

  const handleAddShapeLayer = (shapeType: "rectangle" | "rounded_rect" | "circle" | "star") => {
    const newLayer: ImageLayer = {
      id: `shape-${Date.now()}`,
      name: `Shape (${shapeType})`,
      type: "shape",
      visible: true,
      locked: false,
      opacity: 1,
      blendMode: "source-over",
      x: 350,
      y: 250,
      width: 200,
      height: 200,
      rotation: 0,
      shapeType,
      fillColor: "#ec4899",
      strokeColor: "#ffffff",
      strokeWidth: 2,
      cornerRadius: 16,
    };
    setLayers((prev) => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
  };

  return (
    <aside className="w-full lg:w-80 bg-neutral-950 border-r border-white/10 flex flex-col p-4 space-y-5 overflow-y-auto custom-scrollbar shrink-0 select-none font-sans text-xs">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* 1. ADJUSTMENTS PANEL */}
      {activeTool === "adjust" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h3 className="font-display font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-neon-purple" /> Color & Light Adjustments
            </h3>
            <button
              type="button"
              onClick={() => setAdjustments({
                brightness: 0, contrast: 0, saturation: 0, vibrance: 0, hue: 0,
                temperature: 0, tint: 0, exposure: 0, highlights: 0, shadows: 0,
                whites: 0, blacks: 0, gamma: 1.0,
              })}
              className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1 font-mono"
            >
              <ResetIcon className="w-3 h-3" /> Reset
            </button>
          </div>

          <div className="space-y-3 font-mono text-[11px]">
            {[
              { key: "brightness", label: "Brightness", min: -100, max: 100 },
              { key: "contrast", label: "Contrast", min: -100, max: 100 },
              { key: "exposure", label: "Exposure", min: -100, max: 100 },
              { key: "saturation", label: "Saturation", min: -100, max: 100 },
              { key: "vibrance", label: "Vibrance", min: -100, max: 100 },
              { key: "hue", label: "Hue Shift", min: -180, max: 180 },
              { key: "temperature", label: "Temperature", min: -100, max: 100 },
              { key: "tint", label: "Tint", min: -100, max: 100 },
              { key: "highlights", label: "Highlights", min: -100, max: 100 },
              { key: "shadows", label: "Shadows", min: -100, max: 100 },
            ].map((slider) => (
              <div key={slider.key} className="space-y-1">
                <div className="flex justify-between text-gray-400">
                  <span>{slider.label}</span>
                  <span className="font-bold text-white">
                    {(adjustments as any)[slider.key]}
                  </span>
                </div>
                <input
                  type="range"
                  min={slider.min}
                  max={slider.max}
                  value={(adjustments as any)[slider.key]}
                  onChange={(e) =>
                    setAdjustments((prev) => ({
                      ...prev,
                      [slider.key]: Number(e.target.value),
                    }))
                  }
                  className="w-full accent-neon-purple cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. CROP & TRANSFORM PANEL */}
      {activeTool === "crop" && (
        <div className="space-y-4">
          <div className="pb-2 border-b border-white/10">
            <h3 className="font-display font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <CropIcon className="w-4 h-4 text-neon-pink" /> Crop & Geometric Transform
            </h3>
          </div>

          {/* ASPECT RATIO PRESETS */}
          <div className="space-y-2 font-mono">
            <span className="text-gray-400 text-[10px] uppercase font-bold">Crop Aspect Presets:</span>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: "free", label: "Free" },
                { id: "1:1", label: "1:1 Square" },
                { id: "16:9", label: "16:9 Widescreen" },
                { id: "4:3", label: "4:3 Standard" },
                { id: "9:16", label: "9:16 Story" },
                { id: "3:2", label: "3:2 Photo" },
              ].map((asp) => (
                <button
                  key={asp.id}
                  type="button"
                  onClick={() => setCrop((c) => ({ ...c, aspectRatio: asp.id as AspectRatioPreset }))}
                  className={`px-2 py-1.5 rounded-lg border text-[11px] transition-all ${
                    crop.aspectRatio === asp.id
                      ? "bg-neon-pink text-white border-neon-pink font-bold"
                      : "bg-black/40 text-gray-400 border-white/10 hover:text-white"
                  }`}
                >
                  {asp.label}
                </button>
              ))}
            </div>
          </div>

          {/* ROTATE & FLIP CONTROLS */}
          <div className="space-y-3 font-mono pt-2 border-t border-white/10">
            <span className="text-gray-400 text-[10px] uppercase font-bold">Rotate & Flip:</span>
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setTransform((t) => ({ ...t, rotate: (t.rotate - 90) % 360 }))}
                className="p-2 rounded-xl bg-black/40 border border-white/10 hover:bg-white/10 text-white flex flex-col items-center gap-1"
                title="Rotate 90 Left"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="text-[9px]">-90°</span>
              </button>
              <button
                type="button"
                onClick={() => setTransform((t) => ({ ...t, rotate: (t.rotate + 90) % 360 }))}
                className="p-2 rounded-xl bg-black/40 border border-white/10 hover:bg-white/10 text-white flex flex-col items-center gap-1"
                title="Rotate 90 Right"
              >
                <RotateCw className="w-4 h-4" />
                <span className="text-[9px]">+90°</span>
              </button>
              <button
                type="button"
                onClick={() => setTransform((t) => ({ ...t, flipH: !t.flipH }))}
                className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-colors ${
                  transform.flipH ? "bg-neon-purple border-neon-purple text-white font-bold" : "bg-black/40 border-white/10 text-gray-300"
                }`}
                title="Flip Horizontal"
              >
                <FlipHorizontal className="w-4 h-4" />
                <span className="text-[9px]">Flip H</span>
              </button>
              <button
                type="button"
                onClick={() => setTransform((t) => ({ ...t, flipV: !t.flipV }))}
                className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-colors ${
                  transform.flipV ? "bg-neon-purple border-neon-purple text-white font-bold" : "bg-black/40 border-white/10 text-gray-300"
                }`}
                title="Flip Vertical"
              >
                <FlipVertical className="w-4 h-4" />
                <span className="text-[9px]">Flip V</span>
              </button>
            </div>

            {/* FINE ROTATE SLIDER */}
            <div className="space-y-1 pt-2">
              <div className="flex justify-between text-gray-400 text-[11px]">
                <span>Fine Rotation Angle</span>
                <span className="text-white font-bold">{transform.rotate}°</span>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                value={transform.rotate}
                onChange={(e) => setTransform((t) => ({ ...t, rotate: Number(e.target.value) }))}
                className="w-full accent-neon-pink cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. EFFECTS & FILTERS PANEL */}
      {activeTool === "effects" && (
        <div className="space-y-4 font-mono">
          <div className="pb-2 border-b border-white/10">
            <h3 className="font-display font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" /> Editable Effects & Filters
            </h3>
          </div>

          {/* PRESET FILTER STYLES */}
          <div className="space-y-2">
            <span className="text-gray-400 text-[10px] uppercase font-bold">Preset Filters:</span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: "Normal", preset: "normal" },
                { name: "Cyberpunk", preset: "cyberpunk" },
                { name: "Vintage", preset: "vintage" },
                { name: "B & W", preset: "bw" },
                { name: "Duotone", preset: "duotone" },
                { name: "HDR Tone", preset: "hdr" },
              ].map((f) => (
                <button
                  key={f.preset}
                  type="button"
                  onClick={() => onApplyPreset(f.preset)}
                  className="p-2.5 rounded-xl bg-black/40 border border-white/10 hover:border-cyan-400 text-white hover:text-cyan-400 text-left transition-all"
                >
                  <span className="font-bold text-xs">{f.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* BLUR / GLOW / SHADOW SLIDERS */}
          <div className="space-y-3 pt-2 border-t border-white/10 text-[11px]">
            <div className="space-y-1">
              <div className="flex justify-between text-gray-400">
                <span>Gaussian Blur</span>
                <span className="text-white font-bold">{effects.blur}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={effects.blur}
                onChange={(e) => setEffects((ef) => ({ ...ef, blur: Number(e.target.value) }))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-gray-400">
                <span>Sepia Tone</span>
                <span className="text-white font-bold">{effects.sepia}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={effects.sepia}
                onChange={(e) => setEffects((ef) => ({ ...ef, sepia: Number(e.target.value) }))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* 4. BACKGROUNDS PANEL */}
      {activeTool === "background" && (
        <div className="space-y-4 font-mono">
          <div className="pb-2 border-b border-white/10">
            <h3 className="font-display font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Palette className="w-4 h-4 text-neon-purple" /> Canvas & Cyber Backgrounds
            </h3>
          </div>

          <div className="space-y-2">
            <span className="text-gray-400 text-[10px] uppercase font-bold">Background Style:</span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "cyber_wireframe", label: "Cyber Grid" },
                { id: "blueprint_grid", label: "Blueprint" },
                { id: "linear_gradient", label: "Linear Grad" },
                { id: "radial_gradient", label: "Radial Grad" },
                { id: "solid", label: "Solid Color" },
                { id: "transparent", label: "Transparent" },
              ].map((bgType) => (
                <button
                  key={bgType.id}
                  type="button"
                  onClick={() => setBackground((b) => ({ ...b, type: bgType.id as any }))}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    background.type === bgType.id
                      ? "bg-neon-purple text-white border-neon-purple font-bold"
                      : "bg-black/40 border-white/10 text-gray-400 hover:text-white"
                  }`}
                >
                  <span className="text-xs">{bgType.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. LAYERS PANEL */}
      {activeTool === "layers" && (
        <div className="space-y-4 font-mono">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h3 className="font-display font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <LayersIcon className="w-4 h-4 text-amber-400" /> Layer Stack & Orders
            </h3>
            <button
              type="button"
              onClick={handleAddTextLayer}
              className="p-1.5 rounded-lg bg-neon-purple text-white font-bold hover:bg-neon-purple/80 text-[10px] flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Text Layer
            </button>
          </div>

          <div className="space-y-2">
            {layers.map((layer, idx) => (
              <div
                key={layer.id}
                onClick={() => setSelectedLayerId(layer.id)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                  selectedLayerId === layer.id
                    ? "bg-neutral-800 border-amber-400 shadow-md text-white font-bold"
                    : "bg-black/40 border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLayers((prev) =>
                        prev.map((l) =>
                          l.id === layer.id ? { ...l, visible: !l.visible } : l
                        )
                      );
                    }}
                    className="p-1 hover:text-white"
                  >
                    {layer.visible ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5 text-gray-600" />}
                  </button>

                  <span className="text-xs truncate">{layer.name}</span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (layers.length > 1) {
                        setLayers((prev) => prev.filter((l) => l.id !== layer.id));
                      }
                    }}
                    className="p-1 hover:text-red-400 text-gray-500"
                    title="Delete Layer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. TEXT & SHAPES PANEL */}
      {activeTool === "text_shapes" && (
        <div className="space-y-4 font-mono">
          <div className="pb-2 border-b border-white/10">
            <h3 className="font-display font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Type className="w-4 h-4 text-neon-pink" /> Text & Vector Shapes
            </h3>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={handleAddTextLayer}
              className="w-full py-2.5 rounded-xl bg-neon-pink text-white font-bold text-xs uppercase tracking-wider hover:bg-neon-pink/80 transition-all flex items-center justify-center gap-2"
            >
              <Type className="w-4 h-4" /> Add Text Layer
            </button>

            <div className="pt-2">
              <span className="text-gray-400 text-[10px] uppercase font-bold block mb-2">Vector Shapes:</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleAddShapeLayer("rounded_rect")}
                  className="p-2.5 rounded-xl bg-black/40 border border-white/10 hover:border-neon-pink text-white flex items-center gap-2"
                >
                  <Square className="w-4 h-4 text-neon-pink" /> Rounded Rect
                </button>
                <button
                  type="button"
                  onClick={() => handleAddShapeLayer("circle")}
                  className="p-2.5 rounded-xl bg-black/40 border border-white/10 hover:border-neon-pink text-white flex items-center gap-2"
                >
                  <Circle className="w-4 h-4 text-cyan-400" /> Circle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. PRESETS & SAMPLES */}
      {activeTool === "presets" && (
        <div className="space-y-4 font-mono">
          <div className="pb-2 border-b border-white/10">
            <h3 className="font-display font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-emerald-400" /> Photo Gallery & Uploads
            </h3>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-3 rounded-2xl bg-black/60 border border-dashed border-white/20 hover:border-emerald-400 text-gray-300 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4 text-emerald-400" /> Upload Local Image
          </button>

          <div className="space-y-2 pt-2">
            <span className="text-gray-400 text-[10px] uppercase font-bold">Sample Photos:</span>
            <div className="grid grid-cols-2 gap-2">
              {sampleImages.map((img, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setActiveImgUrl(img.url);
                    setLayers((prev) =>
                      prev.map((l) => (l.type === "image" ? { ...l, src: img.url } : l))
                    );
                  }}
                  className="p-2 rounded-xl bg-black/40 border border-white/10 hover:border-emerald-400 cursor-pointer space-y-1.5 group"
                >
                  <img src={img.url} alt={img.name} className="w-full h-20 object-cover rounded-lg group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                  <span className="text-[10px] font-bold text-gray-300 block truncate">{img.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

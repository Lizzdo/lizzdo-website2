import React, { useState, useRef, useEffect } from "react";
import { LogoVariant } from "../../../types/brandKit";
import {
  Crop,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Check,
  X,
  Maximize2,
  Sliders,
  Sparkles,
} from "lucide-react";

interface Props {
  isOpen: boolean;
  logo: LogoVariant | null;
  onClose: () => void;
  onSaveCroppedLogo: (newUrl: string, dimensions: string) => void;
}

export const LogoCropResizeModal: React.FC<Props> = ({
  isOpen,
  logo,
  onClose,
  onSaveCroppedLogo,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [targetWidth, setTargetWidth] = useState(512);
  const [targetHeight, setTargetHeight] = useState(512);
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "16:9" | "4:3" | "custom">("1:1");
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);

  useEffect(() => {
    if (aspectRatio === "1:1") {
      setTargetWidth(512);
      setTargetHeight(512);
    } else if (aspectRatio === "16:9") {
      setTargetWidth(1280);
      setTargetHeight(720);
    } else if (aspectRatio === "4:3") {
      setTargetWidth(800);
      setTargetHeight(600);
    }
  }, [aspectRatio]);

  useEffect(() => {
    if (!isOpen || !logo) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = logo.url;

    img.onload = () => {
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      ctx.clearRect(0, 0, targetWidth, targetHeight);

      // Filters
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;

      // Transform
      ctx.save();
      ctx.translate(targetWidth / 2, targetHeight / 2);
      ctx.rotate((rotation * Math.PI) / 180);

      const scale = zoom / 100;
      const drawWidth = img.width * scale;
      const drawHeight = img.height * scale;

      ctx.drawImage(
        img,
        -drawWidth / 2,
        -drawHeight / 2,
        drawWidth,
        drawHeight
      );

      ctx.restore();
    };
  }, [isOpen, logo, zoom, rotation, targetWidth, targetHeight, brightness, contrast]);

  if (!isOpen || !logo) return null;

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL("image/png");
    onSaveCroppedLogo(dataUrl, `${targetWidth}x${targetHeight}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-3xl bg-neutral-900 border border-white/20 p-6 space-y-6 shadow-2xl font-mono text-xs animate-fade-in">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Crop className="w-5 h-5 text-neon-cyan" />
            <h3 className="font-display font-bold text-base uppercase text-white">
              Crop & Resize Logo: {logo.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* PREVIEW CANVAS (7 COLS) */}
          <div className="md:col-span-7 flex flex-col items-center justify-center bg-neutral-950 p-4 rounded-2xl border border-white/10 min-h-[300px] relative overflow-hidden">
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-[280px] object-contain border border-white/10 rounded-xl shadow-lg bg-black"
            />
            <span className="mt-2 text-[10px] text-gray-500 font-bold">
              Canvas Output: {targetWidth} × {targetHeight} px
            </span>
          </div>

          {/* CONTROLS (5 COLS) */}
          <div className="md:col-span-5 space-y-4">
            {/* ASPECT RATIO */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-400 uppercase font-bold">
                Aspect Ratio
              </label>
              <div className="grid grid-cols-4 gap-1.5 font-mono text-[10px]">
                {(["1:1", "16:9", "4:3", "custom"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setAspectRatio(r)}
                    className={`py-1.5 rounded-lg border font-bold uppercase ${
                      aspectRatio === r
                        ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan"
                        : "bg-black border-white/10 text-gray-400 hover:text-white"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* CUSTOM DIMENSIONS */}
            {aspectRatio === "custom" && (
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400">Width (px)</label>
                  <input
                    type="number"
                    value={targetWidth}
                    onChange={(e) => setTargetWidth(Number(e.target.value))}
                    className="w-full bg-black border border-white/15 rounded-lg px-2.5 py-1 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400">Height (px)</label>
                  <input
                    type="number"
                    value={targetHeight}
                    onChange={(e) => setTargetHeight(Number(e.target.value))}
                    className="w-full bg-black border border-white/15 rounded-lg px-2.5 py-1 text-white"
                  />
                </div>
              </div>
            )}

            {/* ZOOM SLIDER */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px]">
                <span className="text-gray-400 uppercase">Zoom Scale</span>
                <span className="text-white font-bold">{zoom}%</span>
              </div>
              <input
                type="range"
                min={20}
                max={250}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full accent-neon-cyan"
              />
            </div>

            {/* ROTATION BUTTONS */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-400 uppercase font-bold">
                Rotate Angle
              </label>
              <div className="flex items-center gap-2">
                {[0, 90, 180, 270].map((deg) => (
                  <button
                    key={deg}
                    type="button"
                    onClick={() => setRotation(deg)}
                    className={`flex-1 py-1 rounded-lg border text-[10px] font-bold ${
                      rotation === deg
                        ? "bg-neon-purple/20 border-neon-purple text-neon-purple"
                        : "bg-black border-white/10 text-gray-400"
                    }`}
                  >
                    {deg}°
                  </button>
                ))}
              </div>
            </div>

            {/* BRIGHTNESS / CONTRAST */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400">Brightness ({brightness}%)</label>
                <input
                  type="range"
                  min={50}
                  max={150}
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full accent-neon-cyan"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400">Contrast ({contrast}%)</label>
                <input
                  type="range"
                  min={50}
                  max={150}
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full accent-neon-cyan"
                />
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-display font-bold uppercase flex items-center gap-2"
          >
            <Check className="w-4 h-4" /> Apply & Save Cropped Logo
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from "react";
import {
  ColorAdjustments,
  TransformSettings,
  CropRect,
  ImageEffectSettings,
  BackgroundSettings,
  ImageLayer,
} from "../../../types/imageEditor";
import { renderExportCanvas } from "../../../utils/imageProcessing";
import { useStudio } from "../../../context/StudioContext";
import {
  Download,
  X,
  CheckCircle2,
  Send,
  Layers,
  Sparkles,
  FileImage,
} from "lucide-react";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  width: number;
  height: number;
  layers: ImageLayer[];
  background: BackgroundSettings;
  adjustments: ColorAdjustments;
  effects: ImageEffectSettings;
  crop: CropRect;
  onSendToDesigner: () => void;
}

export function ExportModal({
  isOpen,
  onClose,
  width,
  height,
  layers,
  background,
  adjustments,
  effects,
  crop,
  onSendToDesigner,
}: ExportModalProps) {
  const { uploadSharedAsset, addNotification } = useStudio();

  const [filename, setFilename] = useState("Studio_Image_Export");
  const [format, setFormat] = useState<"png" | "jpeg" | "webp">("png");
  const [scale, setScale] = useState<number>(1);
  const [jpegQuality, setJpegQuality] = useState<number>(0.95);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const exportW = Math.round(width * scale);
  const exportH = Math.round(height * scale);

  const handleDownload = async () => {
    setIsExporting(true);
    try {
      const canvas = await renderExportCanvas(
        width,
        height,
        layers,
        background,
        adjustments,
        effects,
        crop,
        scale
      );

      const mime = `image/${format}`;
      const dataUrl = canvas.toDataURL(mime, jpegQuality);

      const link = document.createElement("a");
      link.download = `${filename}.${format}`;
      link.href = dataUrl;
      link.click();

      addNotification(
        "Image Exported Successfully",
        `Downloaded ${filename}.${format} (${exportW}x${exportH}px)`,
        "success",
        "exports"
      );
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleSaveToVault = async () => {
    setIsExporting(true);
    try {
      const canvas = await renderExportCanvas(
        width,
        height,
        layers,
        background,
        adjustments,
        effects,
        crop,
        scale
      );

      const mime = `image/${format}`;
      const dataUrl = canvas.toDataURL(mime, jpegQuality);

      // Convert dataUrl to blob file
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], `${filename}.${format}`, { type: mime });

      uploadSharedAsset(file);

      addNotification(
        "Saved to Asset Vault",
        `Saved ${filename}.${format} to your Studio Shared Assets.`,
        "success",
        "uploads"
      );
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 font-sans select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-neutral-900 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-neon-purple/20 text-neon-purple border border-neon-purple/30">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-black text-lg text-white uppercase tracking-wider">
                Export High-Resolution Image
              </h2>
              <p className="text-xs text-gray-400 font-mono">
                Exact canvas rendering with non-destructive edits
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SETTINGS FORM */}
        <div className="space-y-4 font-mono text-xs">
          {/* FILENAME */}
          <div className="space-y-1">
            <label className="text-gray-400">File Name:</label>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-neon-purple"
            />
          </div>

          {/* FORMAT SELECTOR */}
          <div className="space-y-1">
            <label className="text-gray-400">File Format:</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "png", label: "PNG (Transparent)", desc: "Best for Graphics" },
                { id: "jpeg", label: "JPEG (Compressed)", desc: "Smallest Size" },
                { id: "webp", label: "WebP (Modern)", desc: "Web Standard" },
              ].map((fmt) => (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={() => setFormat(fmt.id as any)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    format === fmt.id
                      ? "bg-neon-purple text-white border-neon-purple font-bold shadow-lg"
                      : "bg-black/40 border-white/10 text-gray-400 hover:text-white"
                  }`}
                >
                  <div className="text-xs">{fmt.label}</div>
                  <div className="text-[10px] text-gray-400">{fmt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* RESOLUTION SCALE */}
          <div className="space-y-1">
            <div className="flex justify-between text-gray-400">
              <span>Export Resolution Scale:</span>
              <span className="text-neon-purple font-bold">
                {exportW} x {exportH} px ({scale}x)
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { s: 1, label: "1x (Standard)" },
                { s: 2, label: "2x (2K HD)" },
                { s: 4, label: "4x (4K Ultra)" },
              ].map((sc) => (
                <button
                  key={sc.s}
                  type="button"
                  onClick={() => setScale(sc.s)}
                  className={`py-2 rounded-xl border text-center transition-all ${
                    scale === sc.s
                      ? "bg-neon-pink text-white border-neon-pink font-bold"
                      : "bg-black/40 border-white/10 text-gray-400 hover:text-white"
                  }`}
                >
                  {sc.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
          <button
            type="button"
            onClick={handleSaveToVault}
            disabled={isExporting}
            className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 text-white transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" /> Save to Vault
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={isExporting}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-neon-purple to-neon-pink text-white font-display font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Download File
          </button>
        </div>
      </div>
    </div>
  );
}

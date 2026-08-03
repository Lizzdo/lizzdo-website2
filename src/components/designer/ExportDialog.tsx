import React, { useState } from "react";
import { X, Download, FileImage, Sparkles, Check, Loader2 } from "lucide-react";
import { toPng, toJpeg, toSvg } from "html-to-image";

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  targetRef: React.RefObject<HTMLDivElement | null>;
  defaultTitle?: string;
  canvasWidth: number;
  canvasHeight: number;
}

export default function ExportDialog({
  isOpen,
  onClose,
  targetRef,
  defaultTitle = "lizzdo-cover-design",
  canvasWidth,
  canvasHeight,
}: ExportDialogProps) {
  const [format, setFormat] = useState<"png" | "jpg" | "webp" | "svg">("png");
  const [scale, setScale] = useState<number>(2); // Default 2x for Retina sharpness
  const [fileName, setFileName] = useState<string>(
    defaultTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")
  );
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportedSuccess, setExportedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    if (!targetRef.current) return;
    setIsExporting(true);
    setExportedSuccess(false);

    try {
      const node = targetRef.current;
      const options = {
        pixelRatio: scale,
        quality: 0.95,
        cacheBust: true,
      };

      let dataUrl = "";
      let ext = format;

      if (format === "png" || format === "webp") {
        dataUrl = await toPng(node, options);
      } else if (format === "jpg") {
        dataUrl = await toJpeg(node, options);
        ext = "jpg";
      } else if (format === "svg") {
        dataUrl = await toSvg(node, options);
      }

      const link = document.createElement("a");
      link.download = `${fileName || "lizzdo-design"}.${ext}`;
      link.href = dataUrl;
      link.click();

      setExportedSuccess(true);
      setTimeout(() => {
        setExportedSuccess(false);
        onClose();
      }, 1200);
    } catch (err) {
      console.error("Failed to export image:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const finalWidth = canvasWidth * scale;
  const finalHeight = canvasHeight * scale;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-lg glass-panel bg-slate-950 border border-white/10 rounded-3xl p-8 relative shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan flex items-center justify-center">
            <Download size={20} />
          </div>
          <div>
            <h3 className="font-display font-bold text-xl text-white uppercase tracking-wider">
              Export Design
            </h3>
            <p className="text-xs text-gray-400 font-future">
              Download high-resolution image for publishing
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* File Name */}
          <div>
            <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">
              File Name
            </label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white font-future text-sm focus:outline-none focus:border-neon-cyan transition-colors"
              placeholder="e.g. blog-cover-post"
            />
          </div>

          {/* Format Selector */}
          <div>
            <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">
              Export Format
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(["png", "jpg", "webp", "svg"] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setFormat(fmt)}
                  className={`py-3 rounded-xl border text-xs font-display font-bold uppercase transition-all ${
                    format === fmt
                      ? "bg-neon-cyan text-black border-neon-cyan shadow-[0_0_15px_rgba(0,245,255,0.4)]"
                      : "bg-slate-900 border-white/10 text-gray-300 hover:border-white/30"
                  }`}
                >
                  {fmt.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Resolution Multiplier */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                Resolution Scale
              </label>
              <span className="text-xs font-mono text-neon-cyan">
                {finalWidth} × {finalHeight} px ({scale}x)
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "1x (Standard)", value: 1 },
                { label: "2x (HD Sharp)", value: 2 },
                { label: "3x (Ultra Retina)", value: 3 },
              ].map((s) => (
                <button
                  key={s.value}
                  onClick={() => setScale(s.value)}
                  className={`py-3 px-2 rounded-xl border text-xs font-future transition-all ${
                    scale === s.value
                      ? "bg-neon-purple text-white border-neon-purple shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                      : "bg-slate-900 border-white/10 text-gray-400 hover:text-white"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Download Action */}
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink text-white font-display font-bold uppercase text-sm tracking-[2px] hover:shadow-[0_0_30px_rgba(0,245,255,0.5)] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Rendering Design...
              </>
            ) : exportedSuccess ? (
              <>
                <Check size={18} className="text-green-400" /> Export Complete!
              </>
            ) : (
              <>
                <Sparkles size={18} /> Download Image
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

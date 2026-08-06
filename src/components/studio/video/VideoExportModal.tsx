import React, { useState } from "react";
import { X, Download, Film, Sparkles, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { VideoProjectData } from "../../../types/video";
import { exportVideoProject } from "../../../utils/videoRenderer";

interface Props {
  project: VideoProjectData;
  isOpen: boolean;
  onClose: () => void;
}

export const VideoExportModal: React.FC<Props> = ({ project, isOpen, onClose }) => {
  const [format, setFormat] = useState<"mp4" | "webm" | "mov">("mp4");
  const [resolutionPreset, setResolutionPreset] = useState<"720p" | "1080p" | "1440p" | "4k">("1080p");
  const [fps, setFps] = useState<24 | 30 | 60>(30);

  const [isExporting, setIsExporting] = useState(false);
  const [progressPct, setProgressPct] = useState(0);
  const [renderedFrames, setRenderedFrames] = useState(0);
  const [totalFrames, setTotalFrames] = useState(0);
  const [estSecsLeft, setEstSecsLeft] = useState(0);

  const [exportedUrl, setExportedUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const resolutionMap = {
    "720p": { w: 1280, h: 720 },
    "1080p": { w: 1920, h: 1080 },
    "1440p": { w: 2560, h: 1440 },
    "4k": { w: 3840, h: 2160 },
  };

  const handleStartExport = async () => {
    setIsExporting(true);
    setProgressPct(0);
    setExportedUrl(null);

    const targetRes = resolutionMap[resolutionPreset];

    try {
      const url = await exportVideoProject(
        project,
        targetRes.w,
        targetRes.h,
        fps,
        (pct, frame, total, secsLeft) => {
          setProgressPct(pct);
          setRenderedFrames(frame);
          setTotalFrames(total);
          setEstSecsLeft(secsLeft);
        }
      );

      setExportedUrl(url);
      setIsExporting(false);
    } catch (err) {
      console.error("Export failed:", err);
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 font-mono text-xs select-none">
      <div className="w-full max-w-lg bg-neutral-950 border border-white/15 rounded-3xl p-6 shadow-2xl relative space-y-5 text-gray-200">
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* HEADER */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-neon-cyan/20 to-neon-purple/20 border border-neon-cyan/40">
            <Film className="w-6 h-6 text-neon-cyan" />
          </div>
          <div>
            <h3 className="text-base font-bold font-display text-white uppercase">Export Video Project</h3>
            <p className="text-[10px] text-gray-400">
              Render {project.title} with GPU Acceleration
            </p>
          </div>
        </div>

        {/* SETTINGS CONFIGURATION */}
        {!isExporting && !exportedUrl && (
          <div className="space-y-4">
            {/* FORMAT SELECTOR */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-400 uppercase font-bold">Export Format</label>
              <div className="grid grid-cols-3 gap-2">
                {(["mp4", "webm", "mov"] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setFormat(fmt)}
                    className={`py-2 rounded-xl border font-bold uppercase transition-all ${
                      format === fmt
                        ? "border-neon-cyan bg-neon-cyan/20 text-neon-cyan shadow-[0_0_10px_rgba(0,245,255,0.3)]"
                        : "border-white/10 bg-black text-gray-400 hover:text-white"
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* RESOLUTION SELECTOR */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-400 uppercase font-bold">Quality & Resolution</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "720p", label: "720p HD", res: "1280x720" },
                  { id: "1080p", label: "1080p Full HD", res: "1920x1080" },
                  { id: "1440p", label: "1440p QHD", res: "2560x1440" },
                  { id: "4k", label: "4K Ultra HD", res: "3840x2160" },
                ].map((res) => (
                  <button
                    key={res.id}
                    onClick={() => setResolutionPreset(res.id as any)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      resolutionPreset === res.id
                        ? "border-neon-cyan bg-neon-cyan/20 text-neon-cyan font-bold"
                        : "border-white/10 bg-black text-gray-400 hover:text-white"
                    }`}
                  >
                    <p className="font-bold text-white text-xs">{res.label}</p>
                    <p className="text-[10px] text-gray-500">{res.res}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* FPS SELECTOR */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-400 uppercase font-bold">Frame Rate</label>
              <div className="grid grid-cols-3 gap-2">
                {([24, 30, 60] as const).map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setFps(rate)}
                    className={`py-2 rounded-xl border font-bold transition-all ${
                      fps === rate
                        ? "border-purple-400 bg-purple-500/20 text-purple-300"
                        : "border-white/10 bg-black text-gray-400 hover:text-white"
                    }`}
                  >
                    {rate} FPS
                  </button>
                ))}
              </div>
            </div>

            {/* ACTION BUTTON */}
            <button
              onClick={handleStartExport}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-bold text-xs uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,245,255,0.4)] hover:scale-[1.02] transition-all"
            >
              <Sparkles className="w-4 h-4" /> Start Video Rendering
            </button>
          </div>
        )}

        {/* EXPORTING PROGRESS SCREEN */}
        {isExporting && (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-neon-cyan/10 border border-neon-cyan flex items-center justify-center text-neon-cyan animate-pulse">
              <RefreshCw className="w-8 h-8 animate-spin" />
            </div>

            <div>
              <p className="font-bold text-white text-sm">Rendering Frame {renderedFrames} / {totalFrames}</p>
              <p className="text-[10px] text-gray-400 mt-1">
                Estimated time remaining: {estSecsLeft}s
              </p>
            </div>

            {/* PROGRESS BAR */}
            <div className="w-full h-3 bg-black rounded-full border border-white/10 overflow-hidden">
              <div
                style={{ width: `${progressPct}%` }}
                className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple transition-all duration-150"
              />
            </div>
            <p className="text-xs font-bold text-neon-cyan">{progressPct}% Complete</p>
          </div>
        )}

        {/* EXPORT COMPLETED SCREEN */}
        {exportedUrl && (
          <div className="py-4 text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <p className="font-bold text-white text-sm">Rendering Complete!</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Your video is ready to download.</p>
            </div>

            {/* VIDEO PREVIEW */}
            <video
              src={exportedUrl}
              controls
              className="w-full rounded-2xl border border-white/10 max-h-48 object-cover bg-black"
            />

            <a
              href={exportedUrl}
              download={`${project.title.toLowerCase().replace(/\s+/g, "_")}_export.${format}`}
              className="w-full py-3.5 rounded-2xl bg-emerald-500 text-black font-bold text-xs uppercase flex items-center justify-center gap-2 hover:bg-emerald-400 transition-all shadow-[0_0_15px_rgba(16,185,129,0.5)]"
            >
              <Download className="w-4 h-4" /> Download Video File
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

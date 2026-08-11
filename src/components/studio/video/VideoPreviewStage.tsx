import React, { useEffect, useRef, useState } from "react";
import { VideoClip, VideoProjectData } from "../../../types/video";
import { renderFrameToCanvas, getInterpolatedValue, renderSafeAreaGuides } from "../../../utils/videoRenderer";
import { Maximize2, ZoomIn, ZoomOut, Play, Pause, Grid } from "lucide-react";

interface Props {
  project: VideoProjectData;
  currentTime: number;
  isPlaying: boolean;
  selectedClipId?: string;
  onTogglePlay: () => void;
}

export const VideoPreviewStage: React.FC<Props> = ({
  project,
  currentTime,
  isPlaying,
  selectedClipId,
  onTogglePlay,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showSafeArea, setShowSafeArea] = useState(false);

  // Render canvas frame on currentTime change or project change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Maintain aspect ratio resolution matching project dimensions
    canvas.width = project.width;
    canvas.height = project.height;

    renderFrameToCanvas(ctx, project, currentTime, project.width, project.height);

    if (showSafeArea) {
      renderSafeAreaGuides(ctx, project.width, project.height);
    }

    // Draw Motion Path overlay for selected clip with keyframes
    if (selectedClipId) {
      const selectedClip = project.clips.find((c) => c.id === selectedClipId);
      if (selectedClip && selectedClip.keyframes && selectedClip.keyframes.length > 0) {
        const posKfs = selectedClip.keyframes.filter((k) => k.property === "posX" || k.property === "posY");
        if (posKfs.length > 0) {
          ctx.save();
          ctx.strokeStyle = "#00f5ff";
          ctx.lineWidth = 2;
          ctx.setLineDash([6, 4]);

          const samples = 30;
          const points: { x: number; y: number }[] = [];
          for (let i = 0; i <= samples; i++) {
            const sampleRelTime = (i / samples) * selectedClip.duration;
            const posX = getInterpolatedValue(selectedClip, "posX", sampleRelTime, selectedClip.posX);
            const posY = getInterpolatedValue(selectedClip, "posY", sampleRelTime, selectedClip.posY);
            points.push({
              x: project.width / 2 + posX,
              y: project.height / 2 + posY,
            });
          }

          ctx.beginPath();
          points.forEach((pt, idx) => {
            if (idx === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          });
          ctx.stroke();

          // Draw Keyframe diamond dots along path
          ctx.setLineDash([]);
          const timeSet = Array.from(new Set(posKfs.map((k) => k.time))).sort((a, b) => a - b);
          timeSet.forEach((t) => {
            const posX = getInterpolatedValue(selectedClip, "posX", t, selectedClip.posX);
            const posY = getInterpolatedValue(selectedClip, "posY", t, selectedClip.posY);
            const kx = project.width / 2 + posX;
            const ky = project.height / 2 + posY;

            ctx.fillStyle = "#00f5ff";
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(kx, ky, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          });

          ctx.restore();
        }
      }
    }
  }, [project, currentTime, selectedClipId, showSafeArea]);

  return (
    <div
      ref={containerRef}
      className="flex-1 bg-neutral-900 flex flex-col items-center justify-center p-4 relative overflow-hidden select-none"
    >
      {/* CANVAS CONTAINER FRAME */}
      <div className="relative w-full h-full max-w-4xl flex items-center justify-center">
        <div
          className="relative max-w-full max-h-full rounded-2xl bg-black border border-white/20 shadow-2xl overflow-hidden group cursor-pointer"
          onClick={onTogglePlay}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full object-contain pointer-events-none"
            style={{
              aspectRatio: `${project.width} / ${project.height}`,
            }}
          />

          {/* PLAY / PAUSE OVERLAY ON HOVER */}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <div className="p-4 rounded-full bg-neon-cyan/80 text-black shadow-[0_0_20px_rgba(0,245,255,0.8)]">
              {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
            </div>
          </div>

          {/* PROJECT RESOLUTION & PRESET BADGE OVERLAY */}
          <div className="absolute top-3 left-3 bg-black/80 border border-white/10 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold text-gray-300">
            {project.width}x{project.height} • {project.fps} FPS
          </div>

          {/* SAFE AREA GUIDES TOGGLE OVERLAY */}
          <div className="absolute top-3 right-3 z-10">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowSafeArea(!showSafeArea);
              }}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1.5 transition-all ${
                showSafeArea
                  ? "bg-amber-400 text-black border border-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.6)]"
                  : "bg-black/80 border border-white/20 text-gray-300 hover:text-white"
              }`}
              title="Toggle Text Safe (80%) & Action Safe (90%) Guides"
            >
              <Grid className="w-3.5 h-3.5" />
              <span>{showSafeArea ? "Safe Area ON" : "Safe Area"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

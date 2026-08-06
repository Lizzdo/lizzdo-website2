import React, { useEffect, useRef } from "react";
import { VideoClip, VideoProjectData } from "../../../types/video";
import { renderFrameToCanvas } from "../../../utils/videoRenderer";
import { Maximize2, ZoomIn, ZoomOut, Play, Pause } from "lucide-react";

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
  }, [project, currentTime]);

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
        </div>
      </div>
    </div>
  );
};

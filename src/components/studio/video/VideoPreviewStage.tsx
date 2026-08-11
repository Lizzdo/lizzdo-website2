import React, { useEffect, useRef, useState } from "react";
import { VideoClip, VideoProjectData } from "../../../types/video";
import {
  renderFrameToCanvas,
  renderSafeAreaGuides,
  getClipProjectBounds,
} from "../../../utils/videoRenderer";
import { Play, Pause, Grid } from "lucide-react";

interface Props {
  project: VideoProjectData;
  currentTime: number;
  isPlaying: boolean;
  selectedClipId?: string;
  onTogglePlay: () => void;
  onSelectClip?: (clipId: string | null) => void;
  onUpdateClip?: (clipId: string, updated: Partial<VideoClip>) => void;
}

type DragHandle =
  | "move"
  | "tl"
  | "tr"
  | "bl"
  | "br"
  | "tm"
  | "bm"
  | "lm"
  | "rm"
  | "rotate"
  | null;

interface DragState {
  handle: DragHandle;
  startProjX: number;
  startProjY: number;
  startPosX: number;
  startPosY: number;
  startScale: number;
  startWidth: number;
  startHeight: number;
  startRotation: number;
}

export const VideoPreviewStage: React.FC<Props> = ({
  project,
  currentTime,
  isPlaying,
  selectedClipId,
  onTogglePlay,
  onSelectClip,
  onUpdateClip,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showSafeArea, setShowSafeArea] = useState(false);
  const [activeDrag, setActiveDrag] = useState<DragState | null>(null);
  const [isSnappedX, setIsSnappedX] = useState(false);
  const [isSnappedY, setIsSnappedY] = useState(false);

  // Re-render canvas whenever project, currentTime, selectedClipId, showSafeArea changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = project.width;
    canvas.height = project.height;

    renderFrameToCanvas(ctx, project, currentTime, project.width, project.height);

    if (showSafeArea) {
      renderSafeAreaGuides(ctx, project.width, project.height);
    }

    // Snapping Guides
    if (isSnappedX) {
      ctx.save();
      ctx.strokeStyle = "#00f5ff";
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(project.width / 2, 0);
      ctx.lineTo(project.width / 2, project.height);
      ctx.stroke();
      ctx.restore();
    }
    if (isSnappedY) {
      ctx.save();
      ctx.strokeStyle = "#00f5ff";
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, project.height / 2);
      ctx.lineTo(project.width, project.height / 2);
      ctx.stroke();
      ctx.restore();
    }

    // Draw Selected Clip Interactive Overlay (Bounding Box & Handles)
    if (selectedClipId) {
      const selectedClip = project.clips.find(
        (c) =>
          c.id === selectedClipId &&
          currentTime >= c.startTime &&
          currentTime <= c.startTime + c.duration
      );

      if (selectedClip) {
        const bounds = getClipProjectBounds(
          selectedClip,
          project.width,
          project.height,
          selectedClip.rawWidth || 1920,
          selectedClip.rawHeight || 1080
        );

        ctx.save();
        const cx = project.width / 2 + bounds.x;
        const cy = project.height / 2 + bounds.y;

        ctx.translate(cx, cy);
        ctx.rotate((bounds.rotation * Math.PI) / 180);

        const w = bounds.width;
        const h = bounds.height;
        const hw = w / 2;
        const hh = h / 2;

        // Bounding Box Rectangle
        ctx.strokeStyle = "#00f5ff";
        ctx.lineWidth = 2;
        ctx.strokeRect(-hw, -hh, w, h);

        // Edge Handles (TM, BM, LM, RM)
        const handleSize = 8;
        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "#00f5ff";
        ctx.lineWidth = 1.5;

        // TM
        ctx.fillRect(-handleSize / 2, -hh - handleSize / 2, handleSize, handleSize);
        ctx.strokeRect(-handleSize / 2, -hh - handleSize / 2, handleSize, handleSize);

        // BM
        ctx.fillRect(-handleSize / 2, hh - handleSize / 2, handleSize, handleSize);
        ctx.strokeRect(-handleSize / 2, hh - handleSize / 2, handleSize, handleSize);

        // LM
        ctx.fillRect(-hw - handleSize / 2, -handleSize / 2, handleSize, handleSize);
        ctx.strokeRect(-hw - handleSize / 2, -handleSize / 2, handleSize, handleSize);

        // RM
        ctx.fillRect(hw - handleSize / 2, -handleSize / 2, handleSize, handleSize);
        ctx.strokeRect(hw - handleSize / 2, -handleSize / 2, handleSize, handleSize);

        // Corner Handles (TL, TR, BL, BR)
        const cornerSize = 10;
        // TL
        ctx.fillRect(-hw - cornerSize / 2, -hh - cornerSize / 2, cornerSize, cornerSize);
        ctx.strokeRect(-hw - cornerSize / 2, -hh - cornerSize / 2, cornerSize, cornerSize);

        // TR
        ctx.fillRect(hw - cornerSize / 2, -hh - cornerSize / 2, cornerSize, cornerSize);
        ctx.strokeRect(hw - cornerSize / 2, -hh - cornerSize / 2, cornerSize, cornerSize);

        // BL
        ctx.fillRect(-hw - cornerSize / 2, hh - cornerSize / 2, cornerSize, cornerSize);
        ctx.strokeRect(-hw - cornerSize / 2, hh - cornerSize / 2, cornerSize, cornerSize);

        // BR
        ctx.fillRect(hw - cornerSize / 2, hh - cornerSize / 2, cornerSize, cornerSize);
        ctx.strokeRect(hw - cornerSize / 2, hh - cornerSize / 2, cornerSize, cornerSize);

        // Rotation Handle (Line & Circle above Top Center)
        const rotDist = 28;
        ctx.beginPath();
        ctx.moveTo(0, -hh);
        ctx.lineTo(0, -hh - rotDist);
        ctx.stroke();

        ctx.fillStyle = "#00f5ff";
        ctx.beginPath();
        ctx.arc(0, -hh - rotDist, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.restore();
      }
    }
  }, [project, currentTime, selectedClipId, showSafeArea, isSnappedX, isSnappedY]);

  // Listen for video-frame-ready event to re-render immediately on media load
  useEffect(() => {
    const handleFrameReady = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      renderFrameToCanvas(ctx, project, currentTime, project.width, project.height);
    };

    window.addEventListener("video-frame-ready", handleFrameReady);
    return () => window.removeEventListener("video-frame-ready", handleFrameReady);
  }, [project, currentTime]);

  // Helper to map Client Mouse Event to Canvas Project Coordinates
  const getCanvasProjectCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { projX: 0, projY: 0 };

    const rect = canvas.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;

    // Center of canvas is (0,0)
    const projX = (relX - 0.5) * project.width;
    const projY = (relY - 0.5) * project.height;

    return { projX, projY };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const { projX, projY } = getCanvasProjectCoords(e);

    if (selectedClipId) {
      const selectedClip = project.clips.find((c) => c.id === selectedClipId);
      if (selectedClip) {
        const bounds = getClipProjectBounds(
          selectedClip,
          project.width,
          project.height,
          selectedClip.rawWidth || 1920,
          selectedClip.rawHeight || 1080
        );

        const cx = bounds.x;
        const cy = bounds.y;
        const rad = (-bounds.rotation * Math.PI) / 180;

        // Transform click to local unrotated clip space
        const dx = projX - cx;
        const dy = projY - cy;
        const localX = dx * Math.cos(rad) - dy * Math.sin(rad);
        const localY = dx * Math.sin(rad) + dy * Math.cos(rad);

        const hw = bounds.width / 2;
        const hh = bounds.height / 2;
        const hitTol = 14;

        // Hit tests
        // Rotation handle at (0, -hh - 28)
        if (Math.hypot(localX - 0, localY - (-hh - 28)) <= hitTol) {
          setActiveDrag({
            handle: "rotate",
            startProjX: projX,
            startProjY: projY,
            startPosX: selectedClip.posX,
            startPosY: selectedClip.posY,
            startScale: selectedClip.scale,
            startWidth: bounds.baseWidth,
            startHeight: bounds.baseHeight,
            startRotation: selectedClip.rotation,
          });
          return;
        }

        // Corner handles
        if (Math.hypot(localX - (-hw), localY - (-hh)) <= hitTol) {
          setActiveDrag({ handle: "tl", startProjX: projX, startProjY: projY, startPosX: selectedClip.posX, startPosY: selectedClip.posY, startScale: selectedClip.scale, startWidth: bounds.baseWidth, startHeight: bounds.baseHeight, startRotation: selectedClip.rotation });
          return;
        }
        if (Math.hypot(localX - hw, localY - (-hh)) <= hitTol) {
          setActiveDrag({ handle: "tr", startProjX: projX, startProjY: projY, startPosX: selectedClip.posX, startPosY: selectedClip.posY, startScale: selectedClip.scale, startWidth: bounds.baseWidth, startHeight: bounds.baseHeight, startRotation: selectedClip.rotation });
          return;
        }
        if (Math.hypot(localX - (-hw), localY - hh) <= hitTol) {
          setActiveDrag({ handle: "bl", startProjX: projX, startProjY: projY, startPosX: selectedClip.posX, startPosY: selectedClip.posY, startScale: selectedClip.scale, startWidth: bounds.baseWidth, startHeight: bounds.baseHeight, startRotation: selectedClip.rotation });
          return;
        }
        if (Math.hypot(localX - hw, localY - hh) <= hitTol) {
          setActiveDrag({ handle: "br", startProjX: projX, startProjY: projY, startPosX: selectedClip.posX, startPosY: selectedClip.posY, startScale: selectedClip.scale, startWidth: bounds.baseWidth, startHeight: bounds.baseHeight, startRotation: selectedClip.rotation });
          return;
        }

        // Inside bounding box move handle
        if (Math.abs(localX) <= hw && Math.abs(localY) <= hh) {
          setActiveDrag({
            handle: "move",
            startProjX: projX,
            startProjY: projY,
            startPosX: selectedClip.posX,
            startPosY: selectedClip.posY,
            startScale: selectedClip.scale,
            startWidth: bounds.baseWidth,
            startHeight: bounds.baseHeight,
            startRotation: selectedClip.rotation,
          });
          return;
        }
      }
    }

    // Check if clicked another clip
    const activeClipsAtTime = project.clips.filter(
      (c) => currentTime >= c.startTime && currentTime <= c.startTime + c.duration
    );

    for (let i = activeClipsAtTime.length - 1; i >= 0; i--) {
      const clip = activeClipsAtTime[i];
      const bounds = getClipProjectBounds(clip, project.width, project.height, clip.rawWidth || 1920, clip.rawHeight || 1080);
      const rad = (-bounds.rotation * Math.PI) / 180;
      const localX = (projX - bounds.x) * Math.cos(rad) - (projY - bounds.y) * Math.sin(rad);
      const localY = (projX - bounds.x) * Math.sin(rad) + (projY - bounds.y) * Math.cos(rad);

      if (Math.abs(localX) <= bounds.width / 2 && Math.abs(localY) <= bounds.height / 2) {
        onSelectClip?.(clip.id);
        setActiveDrag({
          handle: "move",
          startProjX: projX,
          startProjY: projY,
          startPosX: clip.posX,
          startPosY: clip.posY,
          startScale: clip.scale,
          startWidth: bounds.baseWidth,
          startHeight: bounds.baseHeight,
          startRotation: clip.rotation,
        });
        return;
      }
    }

    // Clicked empty canvas space
    onSelectClip?.(null);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!activeDrag || !selectedClipId || !onUpdateClip) return;

    const selectedClip = project.clips.find((c) => c.id === selectedClipId);
    if (!selectedClip) return;

    const { projX, projY } = getCanvasProjectCoords(e);
    const deltaX = projX - activeDrag.startProjX;
    const deltaY = projY - activeDrag.startProjY;

    if (activeDrag.handle === "move") {
      let newX = activeDrag.startPosX + deltaX;
      let newY = activeDrag.startPosY + deltaY;

      let snapX = false;
      let snapY = false;

      if (selectedClip.enableSnapping ?? true) {
        if (Math.abs(newX) < 12) {
          newX = 0;
          snapX = true;
        }
        if (Math.abs(newY) < 12) {
          newY = 0;
          snapY = true;
        }
      }

      setIsSnappedX(snapX);
      setIsSnappedY(snapY);

      onUpdateClip(selectedClip.id, {
        posX: Math.round(newX),
        posY: Math.round(newY),
      });
    } else if (activeDrag.handle === "rotate") {
      const cx = selectedClip.posX;
      const cy = selectedClip.posY;
      const angleRad = Math.atan2(projY - cy, projX - cx);
      let angleDeg = Math.round((angleRad * 180) / Math.PI + 90);
      angleDeg = (angleDeg + 360) % 360;

      // Snap to 0, 90, 180, 270
      if (Math.abs(angleDeg - 0) < 4 || Math.abs(angleDeg - 360) < 4) angleDeg = 0;
      else if (Math.abs(angleDeg - 90) < 4) angleDeg = 90;
      else if (Math.abs(angleDeg - 180) < 4) angleDeg = 180;
      else if (Math.abs(angleDeg - 270) < 4) angleDeg = 270;

      onUpdateClip(selectedClip.id, { rotation: angleDeg });
    } else if (
      activeDrag.handle === "tl" ||
      activeDrag.handle === "tr" ||
      activeDrag.handle === "bl" ||
      activeDrag.handle === "br"
    ) {
      const dist = Math.hypot(projX - selectedClip.posX, projY - selectedClip.posY);
      const startDist = Math.hypot(
        activeDrag.startProjX - selectedClip.posX,
        activeDrag.startProjY - selectedClip.posY
      );
      if (startDist > 0) {
        const scaleFactor = dist / startDist;
        const newScale = Math.max(0.1, Math.min(5, activeDrag.startScale * scaleFactor));
        onUpdateClip(selectedClip.id, { scale: Number(newScale.toFixed(2)) });
      }
    }
  };

  const handleMouseUp = () => {
    setActiveDrag(null);
    setIsSnappedX(false);
    setIsSnappedY(false);
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 bg-neutral-900 flex flex-col items-center justify-center p-4 relative overflow-hidden select-none"
    >
      {/* CANVAS CONTAINER FRAME */}
      <div className="relative w-full h-full max-w-4xl flex items-center justify-center">
        <div className="relative max-w-full max-h-full rounded-2xl bg-black border border-white/20 shadow-2xl overflow-hidden group cursor-crosshair">
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="w-full h-full object-contain cursor-crosshair"
            style={{
              aspectRatio: `${project.width} / ${project.height}`,
            }}
          />

          {/* PROJECT RESOLUTION & PRESET BADGE OVERLAY */}
          <div className="absolute top-3 left-3 bg-black/80 border border-white/10 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold text-gray-300 pointer-events-none">
            {project.width}x{project.height} • {project.fps} FPS
          </div>

          {/* SAFE AREA GUIDES TOGGLE OVERLAY */}
          <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onTogglePlay();
              }}
              className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-neon-cyan/20 border border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/40 flex items-center gap-1.5 transition-all"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? "Pause" : "Play"}</span>
            </button>

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

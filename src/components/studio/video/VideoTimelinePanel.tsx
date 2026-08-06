import React, { useState, useRef } from "react";
import {
  VideoTrack,
  VideoClip,
  VideoProjectData,
  VideoTrackType,
} from "../../../types/video";
import {
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Plus,
  Trash2,
  Scissors,
  Copy,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Music,
} from "lucide-react";
import { generateWaveformPoints } from "../../../utils/videoRenderer";

interface Props {
  project: VideoProjectData;
  currentTime: number;
  selectedClipId?: string;
  onSelectClip: (clipId: string | undefined) => void;
  onUpdateClip: (clipId: string, updated: Partial<VideoClip>) => void;
  onDeleteClip: (clipId: string) => void;
  onDuplicateClip: (clipId: string) => void;
  onAddTrack: (type: VideoTrackType) => void;
  onDeleteTrack: (trackId: string) => void;
  onToggleLockTrack: (trackId: string) => void;
  onToggleHideTrack: (trackId: string) => void;
  onToggleMuteTrack: (trackId: string) => void;
  onSeek: (time: number) => void;
  onSplitClip: (clipId: string) => void;
  onDetachAudio: (clipId: string) => void;
}

export const VideoTimelinePanel: React.FC<Props> = ({
  project,
  currentTime,
  selectedClipId,
  onSelectClip,
  onUpdateClip,
  onDeleteClip,
  onDuplicateClip,
  onAddTrack,
  onDeleteTrack,
  onToggleLockTrack,
  onToggleHideTrack,
  onToggleMuteTrack,
  onSeek,
  onSplitClip,
  onDetachAudio,
}) => {
  const [zoomScale, setZoomScale] = useState<number>(60); // View total seconds scale (10 to 300)
  const [draggingClipId, setDraggingClipId] = useState<string | null>(null);
  const [resizingClipId, setResizingClipId] = useState<{ id: string; edge: "left" | "right" } | null>(null);

  const timelineRef = useRef<HTMLDivElement>(null);
  const duration = project.duration || 60;

  // Handle timeline ruler click seeking
  const handleRulerClick = (e: React.MouseEvent) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickPct = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(clickPct * duration);
  };

  // Clip drag move handler
  const handleClipMouseDown = (e: React.MouseEvent, clip: VideoClip) => {
    e.stopPropagation();
    onSelectClip(clip.id);

    const startMouseX = e.clientX;
    const initialStartTime = clip.startTime;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!timelineRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const deltaX = moveEvent.clientX - startMouseX;
      const deltaSecs = (deltaX / rect.width) * duration;

      const newStartTime = Math.max(0, Math.min(duration - clip.duration, initialStartTime + deltaSecs));
      onUpdateClip(clip.id, { startTime: newStartTime });
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  // Clip trim resize handler (left or right handle)
  const handleTrimMouseDown = (e: React.MouseEvent, clip: VideoClip, edge: "left" | "right") => {
    e.stopPropagation();
    onSelectClip(clip.id);

    const startMouseX = e.clientX;
    const initialStartTime = clip.startTime;
    const initialDuration = clip.duration;
    const initialOffset = clip.mediaOffset || 0;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!timelineRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const deltaX = moveEvent.clientX - startMouseX;
      const deltaSecs = (deltaX / rect.width) * duration;

      if (edge === "left") {
        const newStartTime = Math.max(0, Math.min(initialStartTime + initialDuration - 0.5, initialStartTime + deltaSecs));
        const diff = newStartTime - initialStartTime;
        const newDuration = Math.max(0.5, initialDuration - diff);
        const newOffset = Math.max(0, initialOffset + diff);

        onUpdateClip(clip.id, {
          startTime: newStartTime,
          duration: newDuration,
          mediaOffset: newOffset,
        });
      } else {
        const newDuration = Math.max(0.5, Math.min(duration - initialStartTime, initialDuration + deltaSecs));
        onUpdateClip(clip.id, { duration: newDuration });
      }
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="h-64 bg-neutral-950 border-t border-white/10 flex flex-col shrink-0 font-mono text-xs select-none">
      {/* TIMELINE TOOLBAR */}
      <div className="h-9 bg-black/60 border-b border-white/10 px-4 flex items-center justify-between text-gray-400 shrink-0">
        {/* ADD TRACK BUTTONS */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-gray-500 uppercase font-bold mr-1">Add Track:</span>
          <button
            onClick={() => onAddTrack("video")}
            className="px-2 py-0.5 rounded bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-bold"
          >
            + Video
          </button>
          <button
            onClick={() => onAddTrack("audio")}
            className="px-2 py-0.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold"
          >
            + Audio
          </button>
          <button
            onClick={() => onAddTrack("text")}
            className="px-2 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold"
          >
            + Text
          </button>
          <button
            onClick={() => onAddTrack("logo")}
            className="px-2 py-0.5 rounded bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[10px] font-bold"
          >
            + Logo
          </button>
        </div>

        {/* SELECTED CLIP TOOLBAR ACTIONS */}
        {selectedClipId && (
          <div className="flex items-center gap-2 bg-neutral-900 px-3 py-0.5 rounded-lg border border-white/10">
            <span className="text-[10px] text-neon-cyan font-bold">Clip Selected:</span>
            <button
              onClick={() => onSplitClip(selectedClipId)}
              className="p-1 text-gray-300 hover:text-neon-cyan"
              title="Split Clip at Playhead"
            >
              <Scissors className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDuplicateClip(selectedClipId)}
              className="p-1 text-gray-300 hover:text-white"
              title="Duplicate Clip"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDetachAudio(selectedClipId)}
              className="p-1 text-gray-300 hover:text-emerald-400"
              title="Detach Audio to New Track"
            >
              <Music className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDeleteClip(selectedClipId)}
              className="p-1 text-gray-300 hover:text-red-400"
              title="Delete Clip"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* ZOOM SLIDER */}
        <div className="flex items-center gap-2">
          <ZoomOut className="w-3.5 h-3.5 text-gray-500" />
          <input
            type="range"
            min={10}
            max={180}
            value={zoomScale}
            onChange={(e) => setZoomScale(Number(e.target.value))}
            className="w-20 h-1 accent-neon-cyan cursor-pointer"
          />
          <ZoomIn className="w-3.5 h-3.5 text-gray-500" />
        </div>
      </div>

      {/* TRACKS & RULER MAIN CONTAINER */}
      <div className="flex-1 overflow-y-auto custom-scrollbar flex">
        {/* TRACK HEADERS SIDEBAR */}
        <div className="w-48 bg-neutral-950 border-r border-white/10 shrink-0 flex flex-col divide-y divide-white/5">
          {/* RULER CORNER */}
          <div className="h-6 bg-black border-b border-white/10 px-3 flex items-center text-[10px] text-gray-500 font-bold uppercase">
            Tracks
          </div>

          {/* TRACK HEADERS LIST */}
          {project.tracks.map((track) => (
            <div
              key={track.id}
              className="h-10 px-2.5 flex items-center justify-between text-[11px] font-bold bg-neutral-900/40 hover:bg-neutral-900"
            >
              <span className="truncate text-gray-300 w-24">{track.name}</span>

              <div className="flex items-center gap-1 text-gray-500">
                <button
                  onClick={() => onToggleLockTrack(track.id)}
                  className={`p-1 hover:text-white ${track.isLocked ? "text-amber-400" : ""}`}
                >
                  {track.isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                </button>
                <button
                  onClick={() => onToggleHideTrack(track.id)}
                  className={`p-1 hover:text-white ${track.isHidden ? "text-red-400" : ""}`}
                >
                  {track.isHidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </button>
                <button
                  onClick={() => onToggleMuteTrack(track.id)}
                  className={`p-1 hover:text-white ${track.isMuted ? "text-red-400" : ""}`}
                >
                  {track.isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                </button>
                <button
                  onClick={() => onDeleteTrack(track.id)}
                  className="p-1 hover:text-red-400"
                  title="Delete Track"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* RULER & TRACK LANES CANVAS */}
        <div className="flex-1 flex flex-col min-w-0 relative bg-neutral-900/40">
          {/* TIME RULER */}
          <div
            ref={timelineRef}
            onClick={handleRulerClick}
            className="h-6 bg-black border-b border-white/10 relative cursor-pointer select-none"
          >
            {Array.from({ length: 13 }).map((_, idx) => {
              const sec = Math.round((idx / 12) * duration);
              const leftPct = (sec / duration) * 100;
              return (
                <div
                  key={idx}
                  style={{ left: `${leftPct}%` }}
                  className="absolute top-0 bottom-0 border-l border-white/20 pl-1 text-[9px] text-gray-500 font-mono pointer-events-none"
                >
                  {sec}s
                </div>
              );
            })}

            {/* SEEKHEAD LINE IN RULER */}
            <div
              style={{ left: `${(currentTime / duration) * 100}%` }}
              className="absolute top-0 bottom-0 w-3 -ml-1.5 bg-neon-cyan rounded-t z-30 flex items-center justify-center cursor-ew-resize shadow-[0_0_10px_rgba(0,245,255,1)]"
            >
              <div className="w-1 h-3 bg-black rounded-full" />
            </div>
          </div>

          {/* TRACK LANES */}
          <div className="flex-1 relative divide-y divide-white/5">
            {project.tracks.map((track) => {
              const trackClips = project.clips.filter((c) => c.trackId === track.id);

              return (
                <div
                  key={track.id}
                  className={`h-10 relative overflow-hidden ${
                    track.isHidden ? "opacity-30 pointer-events-none" : ""
                  }`}
                >
                  {trackClips.map((clip) => {
                    const leftPct = (clip.startTime / duration) * 100;
                    const widthPct = ((clip.duration) / duration) * 100;
                    const isSelected = selectedClipId === clip.id;

                    return (
                      <div
                        key={clip.id}
                        onMouseDown={(e) => handleClipMouseDown(e, clip)}
                        style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                        className={`absolute top-1 bottom-1 rounded-lg border px-2 flex items-center justify-between text-[10px] font-bold text-white truncate cursor-pointer shadow-md group transition-all ${
                          track.color
                        } ${
                          isSelected
                            ? "ring-2 ring-neon-cyan border-white z-20 scale-[1.01]"
                            : "hover:border-white/60"
                        }`}
                      >
                        {/* LEFT TRIM HANDLE */}
                        <div
                          onMouseDown={(e) => handleTrimMouseDown(e, clip, "left")}
                          className="absolute left-0 top-0 bottom-0 w-2 bg-white/30 hover:bg-neon-cyan rounded-l cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity"
                        />

                        <span className="truncate pr-1">{clip.name}</span>

                        {/* AUDIO WAVEFORM PREVIEW DRAWING */}
                        {clip.type === "audio" && (
                          <div className="flex items-center gap-0.5 h-3 opacity-60 overflow-hidden">
                            {generateWaveformPoints(clip.id, 20).map((pt, pIdx) => (
                              <div
                                key={pIdx}
                                style={{ height: `${pt * 100}%` }}
                                className="w-0.5 bg-emerald-400 rounded-full"
                              />
                            ))}
                          </div>
                        )}

                        {/* RIGHT TRIM HANDLE */}
                        <div
                          onMouseDown={(e) => handleTrimMouseDown(e, clip, "right")}
                          className="absolute right-0 top-0 bottom-0 w-2 bg-white/30 hover:bg-neon-cyan rounded-r cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      </div>
                    );
                  })}
                </div>
              );
            })}

            {/* FULL TIMELINE PLAYHEAD INDICATOR LINE */}
            <div
              style={{ left: `${(currentTime / duration) * 100}%` }}
              className="absolute top-0 bottom-0 w-0.5 bg-neon-cyan z-30 pointer-events-none shadow-[0_0_12px_rgba(0,245,255,1)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

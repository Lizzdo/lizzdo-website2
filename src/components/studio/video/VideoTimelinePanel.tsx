import React, { useState, useRef } from "react";
import {
  VideoTrack,
  VideoClip,
  VideoProjectData,
  VideoTrackType,
  VideoMarker,
  TransitionType,
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
  Magnet,
  Bookmark,
  Flag,
  Sparkles,
  ArrowRightLeft,
  ChevronsLeftRight,
  Film,
  MessageSquare,
  Repeat,
  Crosshair,
} from "lucide-react";
import { generateWaveformPoints } from "../../../utils/videoRenderer";
import { AudioWaveform } from "./AudioWaveform";
import { closeGapsOnTrack, applyRippleDelete } from "../../../utils/videoEngine";

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
  onToggleSoloTrack?: (trackId: string) => void;
  onUpdateTrack?: (trackId: string, updated: Partial<VideoTrack>) => void;
  onSeek: (time: number) => void;
  onSplitClip: (clipId: string) => void;
  onDetachAudio: (clipId: string) => void;
  onAddMarker?: (time: number) => void;
  onDeleteMarker?: (markerId: string) => void;
  onUpdateProject?: (updated: Partial<VideoProjectData>) => void;
  onOpenTransitionControl?: (clipId: string) => void;
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
  onToggleSoloTrack,
  onUpdateTrack,
  onSeek,
  onSplitClip,
  onDetachAudio,
  onAddMarker,
  onDeleteMarker,
  onUpdateProject,
  onOpenTransitionControl,
}) => {
  const [zoomScale, setZoomScale] = useState<number>(60);
  const [isSnappingEnabled, setIsSnappingEnabled] = useState<boolean>(project.snapToMarkers ?? true);
  const [inPoint, setInPoint] = useState<number | null>(project.rangeSelection?.start ?? null);
  const [outPoint, setOutPoint] = useState<number | null>(project.rangeSelection?.end ?? null);
  const [editingMarkerId, setEditingMarkerId] = useState<string | null>(null);

  const timelineRef = useRef<HTMLDivElement>(null);
  const duration = project.duration || 60;

  // Snapping logic calculation
  const getSnappedTime = (rawTime: number) => {
    if (!isSnappingEnabled) return rawTime;
    const snapThreshold = 0.8; // 0.8 seconds snap window

    const pointsToSnap = [0, currentTime, duration];
    if (project.markers) {
      project.markers.forEach((m) => pointsToSnap.push(m.time));
    }
    if (project.scenes) {
      project.scenes.forEach((s) => {
        pointsToSnap.push(s.startTime);
        pointsToSnap.push(s.endTime);
      });
    }
    project.clips.forEach((c) => {
      pointsToSnap.push(c.startTime);
      pointsToSnap.push(c.startTime + c.duration);
    });

    for (const pt of pointsToSnap) {
      if (Math.abs(pt - rawTime) <= snapThreshold) {
        return pt;
      }
    }
    return rawTime;
  };

  // Handle timeline ruler click seeking
  const handleRulerClick = (e: React.MouseEvent) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickPct = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(clickPct * duration);
  };

  // Clip drag move handler
  const handleClipMouseDown = (e: React.MouseEvent, clip: VideoClip, isTrackLocked?: boolean) => {
    if (isTrackLocked || clip.isLocked) return;
    e.stopPropagation();
    onSelectClip(clip.id);

    const startMouseX = e.clientX;
    const initialStartTime = clip.startTime;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!timelineRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const deltaX = moveEvent.clientX - startMouseX;
      const deltaSecs = (deltaX / rect.width) * duration;

      let newStartTime = Math.max(0, Math.min(duration - clip.duration, initialStartTime + deltaSecs));
      newStartTime = getSnappedTime(newStartTime);
      onUpdateClip(clip.id, { startTime: newStartTime });
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  // Clip trim resize handler
  const handleTrimMouseDown = (e: React.MouseEvent, clip: VideoClip, edge: "left" | "right", isTrackLocked?: boolean) => {
    if (isTrackLocked || clip.isLocked) return;
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
        let newStartTime = Math.max(0, Math.min(initialStartTime + initialDuration - 0.5, initialStartTime + deltaSecs));
        newStartTime = getSnappedTime(newStartTime);
        const diff = newStartTime - initialStartTime;
        const newDuration = Math.max(0.5, initialDuration - diff);
        const newOffset = Math.max(0, initialOffset + diff);

        onUpdateClip(clip.id, {
          startTime: newStartTime,
          duration: newDuration,
          mediaOffset: newOffset,
        });
      } else {
        let newDuration = Math.max(0.5, Math.min(duration - initialStartTime, initialDuration + deltaSecs));
        const endPt = getSnappedTime(initialStartTime + newDuration);
        newDuration = Math.max(0.5, endPt - initialStartTime);
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

  // Create Scene from Marker
  const handleCreateSceneFromMarker = (marker: VideoMarker) => {
    if (!onUpdateProject) return;
    const existingScenes = project.scenes || [];
    const newScene = {
      id: `sc-${Date.now()}`,
      name: `Scene: ${marker.label}`,
      startTime: marker.time,
      endTime: Math.min(duration, marker.time + 10),
      color: marker.color || "#3b82f6",
      notes: marker.notes || "",
    };
    onUpdateProject({ scenes: [...existingScenes, newScene] });
  };

  // Handle Gap Closing on track
  const handleCloseGap = (trackId: string) => {
    if (!onUpdateProject) return;
    const updatedClips = closeGapsOnTrack(project.clips, trackId);
    onUpdateProject({ clips: updatedClips });
  };

  // Handle Ripple Delete on Selected Clip
  const handleRippleDeleteClip = (clipId: string) => {
    const clip = project.clips.find((c) => c.id === clipId);
    if (!clip || !onUpdateProject) {
      onDeleteClip(clipId);
      return;
    }
    const updatedClips = applyRippleDelete(project.clips, clip, project.trackTargeting);
    onUpdateProject({ clips: updatedClips });
    onSelectClip(undefined);
  };

  return (
    <div className="h-72 bg-neutral-950 border-t border-white/10 flex flex-col shrink-0 font-mono text-xs select-none">
      {/* TIMELINE TOOLBAR */}
      <div className="h-9 bg-black/60 border-b border-white/10 px-4 flex items-center justify-between text-gray-400 shrink-0 gap-2 overflow-x-auto custom-scrollbar">
        {/* ADD TRACK BUTTONS & SNAPPING & RIPPLE EDIT */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] text-gray-500 uppercase font-bold mr-1">Add:</span>
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
            + Title
          </button>
          <button
            onClick={() => onAddTrack("adjustment")}
            className="px-2 py-0.5 rounded bg-fuchsia-500/10 hover:bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30 text-[10px] font-bold"
            title="Add Adjustment Layer Track"
          >
            + Adj Layer
          </button>

          {/* RIPPLE EDIT TOGGLE */}
          <button
            onClick={() => onUpdateProject && onUpdateProject({ rippleEditing: !project.rippleEditing })}
            className={`ml-2 px-2 py-0.5 rounded border text-[10px] font-bold flex items-center gap-1 transition-colors ${
              project.rippleEditing
                ? "border-amber-400 bg-amber-400/20 text-amber-300"
                : "border-white/10 bg-black text-gray-500"
            }`}
            title="Toggle Ripple Edit Mode (Automatically closes gaps when deleting/moving clips)"
          >
            <Repeat className="w-3 h-3" />
            <span>Ripple {project.rippleEditing ? "ON" : "OFF"}</span>
          </button>

          {/* SNAPPING TOGGLE */}
          <button
            onClick={() => {
              const next = !isSnappingEnabled;
              setIsSnappingEnabled(next);
              if (onUpdateProject) onUpdateProject({ snapToMarkers: next });
            }}
            className={`px-2 py-0.5 rounded border text-[10px] font-bold flex items-center gap-1 transition-colors ${
              isSnappingEnabled
                ? "border-neon-cyan bg-neon-cyan/20 text-neon-cyan"
                : "border-white/10 bg-black text-gray-500"
            }`}
            title={isSnappingEnabled ? "Snapping Enabled" : "Snapping Disabled"}
          >
            <Magnet className="w-3 h-3" />
            <span>Snap</span>
          </button>

          {/* ADD MARKER BUTTON */}
          {onAddMarker && (
            <button
              onClick={() => onAddMarker(currentTime)}
              className="px-2 py-0.5 rounded border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[10px] font-bold flex items-center gap-1"
              title="Add Marker at Playhead"
            >
              <Bookmark className="w-3 h-3" />
              <span>Marker</span>
            </button>
          )}

          {/* RANGE SELECTION IN / OUT BUTTONS */}
          <div className="flex items-center gap-1 ml-2 border-l border-white/10 pl-2">
            <button
              onClick={() => {
                setInPoint(currentTime);
                if (onUpdateProject) onUpdateProject({ rangeSelection: { start: currentTime, end: outPoint ?? duration } });
              }}
              className="px-1.5 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold"
              title="Set Selection In Point (Key: I)"
            >
              [ In
            </button>
            <button
              onClick={() => {
                setOutPoint(currentTime);
                if (onUpdateProject) onUpdateProject({ rangeSelection: { start: inPoint ?? 0, end: currentTime } });
              }}
              className="px-1.5 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold"
              title="Set Selection Out Point (Key: O)"
            >
              Out ]
            </button>
            {(inPoint !== null || outPoint !== null) && (
              <button
                onClick={() => {
                  setInPoint(null);
                  setOutPoint(null);
                  if (onUpdateProject) onUpdateProject({ rangeSelection: null });
                }}
                className="px-1 py-0.5 rounded bg-red-500/20 hover:bg-red-500/30 text-red-300 text-[9px]"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* SELECTED CLIP TOOLBAR ACTIONS */}
        {selectedClipId && (
          <div className="flex items-center gap-2 bg-neutral-900 px-3 py-0.5 rounded-lg border border-white/10 shrink-0">
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
              onClick={() =>
                project.rippleEditing ? handleRippleDeleteClip(selectedClipId) : onDeleteClip(selectedClipId)
              }
              className="p-1 text-gray-300 hover:text-red-400"
              title={project.rippleEditing ? "Ripple Delete Clip" : "Delete Clip"}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* ZOOM SLIDER */}
        <div className="flex items-center gap-2 shrink-0">
          <ZoomOut className="w-3.5 h-3.5 text-gray-500" />
          <input
            type="range"
            min={10}
            max={180}
            value={zoomScale}
            onChange={(e) => setZoomScale(Number(e.target.value))}
            className="w-16 h-1 accent-neon-cyan cursor-pointer"
          />
          <ZoomIn className="w-3.5 h-3.5 text-gray-500" />
        </div>
      </div>

      {/* TRACKS & RULER MAIN CONTAINER */}
      <div className="flex-1 overflow-y-auto custom-scrollbar flex">
        {/* TRACK HEADERS SIDEBAR */}
        <div className="w-52 bg-neutral-950 border-r border-white/10 shrink-0 flex flex-col divide-y divide-white/5">
          <div className="h-6 bg-black border-b border-white/10 px-3 flex items-center justify-between text-[10px] text-gray-500 font-bold uppercase">
            <span>Tracks</span>
            <span className="text-[9px] text-gray-600">Close Gap</span>
          </div>

          {project.tracks.map((track) => (
            <div
              key={track.id}
              className={`h-11 px-2 flex items-center justify-between text-[11px] font-bold border-b border-white/5 group ${
                track.isLocked ? "bg-red-950/20" : "bg-neutral-900/40 hover:bg-neutral-900"
              }`}
            >
              <div className="flex items-center gap-1 min-w-0">
                <input
                  type="text"
                  value={track.name}
                  onChange={(e) => onUpdateTrack && onUpdateTrack(track.id, { name: e.target.value })}
                  className="bg-transparent text-gray-200 hover:text-white border-none focus:outline-none focus:bg-black/60 rounded px-1 truncate w-20 text-[10px]"
                  title="Click to rename track"
                />
              </div>

              <div className="flex items-center gap-0.5 text-gray-500 shrink-0">
                {/* CLOSE GAP BUTTON */}
                <button
                  onClick={() => handleCloseGap(track.id)}
                  className="p-0.5 rounded text-[9px] text-gray-400 hover:text-amber-300 hover:bg-white/10"
                  title="Close Gaps on Track"
                >
                  <ChevronsLeftRight className="w-3 h-3" />
                </button>

                {/* SOLO BUTTON */}
                <button
                  onClick={() => onToggleSoloTrack && onToggleSoloTrack(track.id)}
                  className={`w-4 h-4 rounded text-[9px] font-extrabold flex items-center justify-center transition-colors ${
                    track.isSolo
                      ? "bg-amber-400 text-black shadow-[0_0_8px_rgba(251,191,36,0.8)]"
                      : "bg-white/5 text-gray-500 hover:text-white"
                  }`}
                  title="Solo Track"
                >
                  S
                </button>

                {/* MUTE BUTTON */}
                <button
                  onClick={() => onToggleMuteTrack(track.id)}
                  className={`p-0.5 rounded transition-colors ${track.isMuted ? "text-red-400 bg-red-500/20" : "hover:text-white"}`}
                  title="Mute Track"
                >
                  {track.isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                </button>

                {/* LOCK TRACK */}
                <button
                  onClick={() => onToggleLockTrack(track.id)}
                  className={`p-0.5 hover:text-white ${track.isLocked ? "text-amber-400" : ""}`}
                  title={track.isLocked ? "Track Locked" : "Lock Track"}
                >
                  {track.isLocked ? <Lock className="w-3 h-3 text-amber-400" /> : <Unlock className="w-3 h-3" />}
                </button>

                <button
                  onClick={() => onDeleteTrack(track.id)}
                  className="p-0.5 hover:text-red-400"
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
          {/* TIME RULER & SCENES / MARKERS */}
          <div
            ref={timelineRef}
            onClick={handleRulerClick}
            className="h-7 bg-black border-b border-white/10 relative cursor-pointer select-none overflow-hidden"
          >
            {/* RULER SECOND TICKS */}
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

            {/* RANGE SELECTION HIGHLIGHT OVERLAY */}
            {(inPoint !== null || outPoint !== null) && (
              <div
                style={{
                  left: `${((inPoint ?? 0) / duration) * 100}%`,
                  width: `${(((outPoint ?? duration) - (inPoint ?? 0)) / duration) * 100}%`,
                }}
                className="absolute top-0 bottom-0 bg-neon-cyan/15 border-x border-neon-cyan pointer-events-none z-10"
              />
            )}

            {/* SCENES BAND OVERLAY */}
            {project.scenes &&
              project.scenes.map((scene) => {
                const leftPct = (scene.startTime / duration) * 100;
                const widthPct = ((scene.endTime - scene.startTime) / duration) * 100;
                const isActive = project.activeSceneId === scene.id;

                return (
                  <div
                    key={scene.id}
                    style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSeek(scene.startTime);
                      if (onUpdateProject) onUpdateProject({ activeSceneId: scene.id });
                    }}
                    className={`absolute top-0 h-2 cursor-pointer transition-all ${
                      isActive ? "ring-2 ring-white z-20" : "hover:brightness-125"
                    }`}
                  >
                    <div
                      style={{ backgroundColor: scene.color || "#3b82f6" }}
                      className="w-full h-full opacity-80 rounded-t-sm"
                      title={`${scene.name} (${scene.startTime}s - ${scene.endTime}s)`}
                    />
                  </div>
                );
              })}

            {/* TIMELINE MARKERS WITH NOTES TOOLTIP */}
            {project.markers &&
              project.markers.map((marker) => (
                <div
                  key={marker.id}
                  style={{ left: `${(marker.time / duration) * 100}%` }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSeek(marker.time);
                  }}
                  className="absolute top-0 bottom-0 z-20 group flex flex-col items-center cursor-pointer"
                  title={`Marker: ${marker.label} (${marker.time.toFixed(1)}s)`}
                >
                  <Flag className="w-3.5 h-3.5 text-amber-400 fill-amber-400 -mt-0.5" />
                  <div className="hidden group-hover:flex flex-col bg-neutral-900 border border-amber-500/40 p-1.5 rounded shadow-xl text-[9px] text-gray-200 z-50 absolute top-5 -left-12 w-32">
                    <span className="font-bold text-amber-300">{marker.label}</span>
                    {marker.notes && <p className="text-[8px] text-gray-400 line-clamp-2">{marker.notes}</p>}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCreateSceneFromMarker(marker);
                      }}
                      className="mt-1 px-1.5 py-0.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-[8px] font-bold"
                    >
                      Make Scene
                    </button>
                  </div>
                </div>
              ))}

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
                  className={`h-11 relative overflow-hidden ${
                    track.isHidden ? "opacity-30 pointer-events-none" : ""
                  } ${track.isLocked ? "bg-red-950/10 cursor-not-allowed" : ""}`}
                >
                  {/* LOCKED OVERLAY BADGE */}
                  {track.isLocked && (
                    <div className="absolute inset-0 bg-black/40 z-30 flex items-center justify-center pointer-events-none gap-2 text-amber-400 font-bold text-[10px]">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Track Locked</span>
                    </div>
                  )}

                  {trackClips.map((clip, clipIndex) => {
                    const leftPct = (clip.startTime / duration) * 100;
                    const widthPct = (clip.duration / duration) * 100;
                    const isSelected = selectedClipId === clip.id;

                    // Transition Attached badge detection
                    const hasTransition = clip.transition && clip.transition.type !== "none" && clip.transition.duration > 0;

                    return (
                      <React.Fragment key={clip.id}>
                        <div
                          onMouseDown={(e) => handleClipMouseDown(e, clip, track.isLocked)}
                          style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                          className={`absolute top-1 bottom-1 rounded-lg border px-2 flex items-center justify-between text-[10px] font-bold text-white truncate shadow-md group transition-all ${
                            track.isLocked ? "cursor-not-allowed opacity-80" : "cursor-pointer"
                          } ${track.color} ${
                            isSelected
                              ? "ring-2 ring-neon-cyan border-white z-20 scale-[1.01]"
                              : "hover:border-white/60"
                          }`}
                        >
                          {/* LEFT TRIM HANDLE */}
                          {!track.isLocked && (
                            <div
                              onMouseDown={(e) => handleTrimMouseDown(e, clip, "left", track.isLocked)}
                              className="absolute left-0 top-0 bottom-0 w-2 bg-white/30 hover:bg-neon-cyan rounded-l cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity"
                            />
                          )}

                          <div className="flex items-center gap-1 truncate pr-1 z-10">
                            {clip.type === "adjustment" && <Sparkles className="w-3 h-3 text-fuchsia-300 shrink-0" />}
                            <span className="truncate">{clip.name}</span>
                          </div>

                          {/* KEYFRAME MARKERS ON TIMELINE CLIP ITEM */}
                          {clip.keyframes && clip.keyframes.length > 0 && (
                            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                              {clip.keyframes.map((kf) => {
                                const kfLeftPct = Math.max(0, Math.min(100, (kf.time / clip.duration) * 100));
                                return (
                                  <div
                                    key={kf.id}
                                    style={{ left: `${kfLeftPct}%` }}
                                    className="absolute top-0 bottom-0 w-2 flex items-center justify-center -ml-1"
                                    title={`Keyframe: ${kf.property} (${kf.time.toFixed(2)}s)`}
                                  >
                                    <div className="w-1.5 h-1.5 rotate-45 bg-neon-cyan shadow-[0_0_6px_rgba(0,245,255,1)] border border-black" />
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* AUDIO WAVEFORM PREVIEW DRAWING */}
                          {clip.type === "audio" && (
                            <div className="absolute inset-x-2 bottom-1 top-5 overflow-hidden">
                              <AudioWaveform
                                src={clip.src}
                                duration={clip.duration}
                                fadeIn={clip.fadeIn}
                                fadeOut={clip.fadeOut}
                              />
                            </div>
                          )}

                          {/* RIGHT TRIM HANDLE */}
                          {!track.isLocked && (
                            <div
                              onMouseDown={(e) => handleTrimMouseDown(e, clip, "right", track.isLocked)}
                              className="absolute right-0 top-0 bottom-0 w-2 bg-white/30 hover:bg-neon-cyan rounded-r cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity"
                            />
                          )}
                        </div>

                        {/* TRANSITION DRAG & CLICK BADGE BETWEEN ADJACENT CLIPS / ENTRANCE */}
                        {hasTransition && (
                          <div
                            style={{ left: `${leftPct}%` }}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectClip(clip.id);
                              if (onOpenTransitionControl) onOpenTransitionControl(clip.id);
                            }}
                            className="absolute top-1 z-30 -ml-2 w-4 h-8 bg-amber-500/90 border border-black rounded-full flex items-center justify-center cursor-pointer shadow-[0_0_8px_rgba(245,158,11,0.8)] hover:scale-125 transition-transform"
                            title={`Transition: ${clip.transition.type} (${clip.transition.duration}s)`}
                          >
                            <span className="text-[9px] text-black font-extrabold">◆</span>
                          </div>
                        )}
                      </React.Fragment>
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

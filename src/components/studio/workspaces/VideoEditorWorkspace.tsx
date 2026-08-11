import React, { useState, useEffect, useRef } from "react";
import { getStorageItem, setStorageItem } from "../../../utils/storage";
import {
  MediaFolder,
  MediaItem,
  VideoClip,
  VideoProjectData,
  VideoTrack,
  VideoTrackType,
} from "../../../types/video";
import {
  INITIAL_FOLDERS,
  INITIAL_STOCK_MEDIA,
  createDefaultEffectProps,
  createDefaultTextProps,
  createDefaultVideoProject,
} from "../../../utils/videoEngine";
import { VideoHeaderBar } from "../video/VideoHeaderBar";
import { VideoMediaLibraryPanel } from "../video/VideoMediaLibraryPanel";
import { VideoPreviewStage } from "../video/VideoPreviewStage";
import { VideoPlaybackBar } from "../video/VideoPlaybackBar";
import { VideoTimelinePanel } from "../video/VideoTimelinePanel";
import { VideoInspectorPanel } from "../video/VideoInspectorPanel";
import { VideoExportModal } from "../video/VideoExportModal";
import { AudioTimelinePlayer } from "../../../utils/audioEngine";

export function VideoEditorWorkspace() {
  // 1. Initial Project State
  const [project, setProject] = useState<VideoProjectData>(() => {
    const saved = getStorageItem("lizzdo_video_project");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved project:", e);
      }
    }
    return createDefaultVideoProject();
  });

  // Undo / Redo History Stack
  const [history, setHistory] = useState<VideoProjectData[]>([project]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const updateProjectWithHistory = (updated: Partial<VideoProjectData>) => {
    setProject((prev) => {
      const next = { ...prev, ...updated, updatedAt: new Date().toISOString() };
      setStorageItem("lizzdo_video_project", JSON.stringify(next));

      // Push to history
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(next);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);

      return next;
    });
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setProject(prev);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setProject(next);
    }
  };

  // 2. Playback State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(12.4);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [masterVolume, setMasterVolume] = useState(1);
  const [selectedClipId, setSelectedClipId] = useState<string | undefined>("clip-video-1");

  // 3. Media Library State
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(INITIAL_STOCK_MEDIA);
  const [folders] = useState<MediaFolder[]>(INITIAL_FOLDERS);

  // 4. Modal state
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Real-time Playback Animation Loop & Audio Sync
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const audioPlayerRef = useRef<AudioTimelinePlayer>(new AudioTimelinePlayer());

  useEffect(() => {
    if (isPlaying) {
      audioPlayerRef.current.syncAndPlay(project, currentTime, masterVolume, isMuted);
    } else {
      audioPlayerRef.current.stop();
    }
  }, [isPlaying, isMuted, masterVolume]);

  useEffect(() => {
    if (isPlaying) {
      const loop = (timestamp: number) => {
        if (lastTimeRef.current !== null) {
          const deltaSecs = (timestamp - lastTimeRef.current) / 1000;
          setCurrentTime((prev) => {
            const next = prev + deltaSecs * playbackSpeed;
            if (next >= project.duration) {
              setIsPlaying(false);
              return 0;
            }
            return next;
          });
        }
        lastTimeRef.current = timestamp;
        animFrameRef.current = requestAnimationFrame(loop);
      };

      lastTimeRef.current = performance.now();
      animFrameRef.current = requestAnimationFrame(loop);
    } else {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      lastTimeRef.current = null;
    }

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, playbackSpeed, project.duration]);

  // Upload file handler
  const handleUploadFile = (file: File) => {
    const isVideo = file.type.startsWith("video/");
    const isAudio = file.type.startsWith("audio/");
    const isImage = file.type.startsWith("image/");

    const type = isVideo ? "video" : isAudio ? "audio" : "image";
    const url = URL.createObjectURL(file);

    const newItem: MediaItem = {
      id: `media-up-${Date.now()}`,
      name: file.name,
      type,
      fileType: file.name.split(".").pop() || "file",
      url,
      duration: isVideo || isAudio ? 15 : undefined,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      folderId: "f-uploads",
      createdAt: new Date().toISOString(),
    };

    setMediaItems((prev) => [newItem, ...prev]);
  };

  // Add media to timeline
  const handleAddMediaToTimeline = (media: MediaItem) => {
    let targetTrack = project.tracks.find((t) => t.type === media.type);

    if (!targetTrack) {
      // Create track if none exists
      const trackId = `t-${media.type}-${Date.now()}`;
      targetTrack = {
        id: trackId,
        name: `${media.type.toUpperCase()} Track`,
        type: media.type as VideoTrackType,
        isLocked: false,
        isHidden: false,
        isMuted: false,
        height: 40,
        color:
          media.type === "video"
            ? "bg-blue-500/20 border-blue-500 text-blue-300"
            : media.type === "audio"
            ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
            : "bg-purple-500/20 border-purple-500 text-purple-300",
      };
      project.tracks.push(targetTrack);
    }

    const newClip: VideoClip = {
      id: `clip-${Date.now()}`,
      trackId: targetTrack.id,
      name: media.name,
      type: media.type as VideoTrackType,
      src: media.url,
      fileType: media.fileType,
      startTime: currentTime,
      duration: media.duration || 10,
      mediaOffset: 0,
      mediaDuration: media.duration || 10,
      volume: 1,
      isMuted: false,
      fadeIn: 0,
      fadeOut: 0,
      speed: 1,
      isReversed: false,
      opacity: 1,
      scale: 1,
      rotation: 0,
      flipX: false,
      flipY: false,
      posX: 0,
      posY: 0,
      crop: { top: 0, right: 0, bottom: 0, left: 0 },
      logoAnim: { preset: "none", duration: 0, delay: 0, loop: false, positionPreset: "custom" },
      textProps: createDefaultTextProps(),
      effectProps: createDefaultEffectProps(),
      transition: { type: "none", duration: 0 },
    };

    updateProjectWithHistory({
      tracks: [...project.tracks],
      clips: [...project.clips, newClip],
    });

    setSelectedClipId(newClip.id);
  };

  // Add text preset to timeline
  const handleAddTextToTimeline = (presetType: string) => {
    let textTrack = project.tracks.find((t) => t.type === "text");
    if (!textTrack) {
      textTrack = {
        id: `t-text-${Date.now()}`,
        name: "Text Track",
        type: "text",
        isLocked: false,
        isHidden: false,
        isMuted: false,
        height: 38,
        color: "bg-amber-500/20 border-amber-500 text-amber-300",
      };
      project.tracks.push(textTrack);
    }

    const defaultProps = createDefaultTextProps();
    if (presetType === "subtitle") {
      defaultProps.content = "Add Subtitle Text Here";
      defaultProps.fontSize = 24;
      defaultProps.backgroundColor = "rgba(0,0,0,0.8)";
      defaultProps.color = "#ffffff";
    } else if (presetType === "lower-third") {
      defaultProps.content = "SPEAKER NAME | TITLE";
      defaultProps.fontSize = 20;
      defaultProps.backgroundColor = "#00f5ff";
      defaultProps.color = "#000000";
    }

    const newClip: VideoClip = {
      id: `clip-text-${Date.now()}`,
      trackId: textTrack.id,
      name: `Text: ${defaultProps.content}`,
      type: "text",
      src: defaultProps.content,
      fileType: "txt",
      startTime: currentTime,
      duration: 8,
      mediaOffset: 0,
      volume: 1,
      isMuted: false,
      fadeIn: 0.5,
      fadeOut: 0.5,
      speed: 1,
      isReversed: false,
      opacity: 1,
      scale: 1,
      rotation: 0,
      flipX: false,
      flipY: false,
      posX: 0,
      posY: presetType === "subtitle" ? 220 : presetType === "lower-third" ? 180 : 0,
      crop: { top: 0, right: 0, bottom: 0, left: 0 },
      logoAnim: { preset: "none", duration: 0, delay: 0, loop: false, positionPreset: "custom" },
      textProps: defaultProps,
      effectProps: createDefaultEffectProps(),
      transition: { type: "none", duration: 0 },
    };

    updateProjectWithHistory({
      tracks: [...project.tracks],
      clips: [...project.clips, newClip],
    });

    setSelectedClipId(newClip.id);
  };

  // Add logo watermark to timeline
  const handleAddLogoToTimeline = (logoUrl: string) => {
    let logoTrack = project.tracks.find((t) => t.type === "logo");
    if (!logoTrack) {
      logoTrack = {
        id: `t-logo-${Date.now()}`,
        name: "Logo Watermark Track",
        type: "logo",
        isLocked: false,
        isHidden: false,
        isMuted: false,
        height: 38,
        color: "bg-purple-500/20 border-purple-500 text-purple-300",
      };
      project.tracks.push(logoTrack);
    }

    const newClip: VideoClip = {
      id: `clip-logo-${Date.now()}`,
      trackId: logoTrack.id,
      name: "Watermark Badge",
      type: "logo",
      src: logoUrl,
      fileType: "png",
      startTime: 0,
      duration: project.duration,
      mediaOffset: 0,
      volume: 1,
      isMuted: false,
      fadeIn: 1,
      fadeOut: 1,
      speed: 1,
      isReversed: false,
      opacity: 0.9,
      scale: 0.6,
      rotation: 0,
      flipX: false,
      flipY: false,
      posX: 380,
      posY: -220,
      crop: { top: 0, right: 0, bottom: 0, left: 0 },
      logoAnim: { preset: "fadeIn", duration: 1, delay: 0, loop: false, positionPreset: "top-right" },
      textProps: createDefaultTextProps(),
      effectProps: createDefaultEffectProps(),
      transition: { type: "none", duration: 0 },
    };

    updateProjectWithHistory({
      tracks: [...project.tracks],
      clips: [...project.clips, newClip],
    });

    setSelectedClipId(newClip.id);
  };

  // Add recorded audio
  const handleAddRecordedAudio = (audioUrl: string, recDuration: number) => {
    let audioTrack = project.tracks.find((t) => t.type === "audio");
    if (!audioTrack) {
      audioTrack = {
        id: `t-audio-${Date.now()}`,
        name: "Voice-Over Mic Track",
        type: "audio",
        isLocked: false,
        isHidden: false,
        isMuted: false,
        height: 38,
        color: "bg-emerald-500/20 border-emerald-500 text-emerald-300",
      };
      project.tracks.push(audioTrack);
    }

    const newClip: VideoClip = {
      id: `clip-mic-${Date.now()}`,
      trackId: audioTrack.id,
      name: `Voice Record (${recDuration.toFixed(1)}s)`,
      type: "audio",
      src: audioUrl,
      fileType: "webm",
      startTime: currentTime,
      duration: recDuration,
      mediaOffset: 0,
      volume: 1,
      isMuted: false,
      fadeIn: 0.2,
      fadeOut: 0.2,
      speed: 1,
      isReversed: false,
      opacity: 1,
      scale: 1,
      rotation: 0,
      flipX: false,
      flipY: false,
      posX: 0,
      posY: 0,
      crop: { top: 0, right: 0, bottom: 0, left: 0 },
      logoAnim: { preset: "none", duration: 0, delay: 0, loop: false, positionPreset: "custom" },
      textProps: createDefaultTextProps(),
      effectProps: createDefaultEffectProps(),
      transition: { type: "none", duration: 0 },
    };

    updateProjectWithHistory({
      tracks: [...project.tracks],
      clips: [...project.clips, newClip],
    });

    setSelectedClipId(newClip.id);
  };

  // Split clip at playhead
  const handleSplitClip = (clipId: string) => {
    const clip = project.clips.find((c) => c.id === clipId);
    if (!clip) return;

    if (currentTime <= clip.startTime || currentTime >= clip.startTime + clip.duration) {
      return; // Playhead not inside clip
    }

    const firstDuration = currentTime - clip.startTime;
    const secondDuration = clip.duration - firstDuration;

    const firstClip: VideoClip = {
      ...clip,
      duration: firstDuration,
    };

    const secondClip: VideoClip = {
      ...clip,
      id: `clip-split-${Date.now()}`,
      startTime: currentTime,
      duration: secondDuration,
      mediaOffset: clip.mediaOffset + firstDuration,
    };

    const updatedClips = project.clips.map((c) => (c.id === clipId ? firstClip : c));
    updatedClips.push(secondClip);

    updateProjectWithHistory({ clips: updatedClips });
    setSelectedClipId(secondClip.id);
  };

  // Freeze frame
  const handleFreezeFrame = (clipId: string) => {
    const clip = project.clips.find((c) => c.id === clipId);
    if (!clip) return;

    const freezeClip: VideoClip = {
      ...clip,
      id: `clip-freeze-${Date.now()}`,
      name: `Freeze Frame (${clip.name})`,
      startTime: currentTime,
      duration: 3,
      speed: 0, // static freeze
    };

    updateProjectWithHistory({ clips: [...project.clips, freezeClip] });
  };

  // Detach audio
  const handleDetachAudio = (clipId: string) => {
    const clip = project.clips.find((c) => c.id === clipId);
    if (!clip || clip.type !== "video") return;

    let audioTrack = project.tracks.find((t) => t.type === "audio");
    if (!audioTrack) {
      audioTrack = {
        id: `t-audio-${Date.now()}`,
        name: "Extracted Audio Track",
        type: "audio",
        isLocked: false,
        isHidden: false,
        isMuted: false,
        height: 38,
        color: "bg-emerald-500/20 border-emerald-500 text-emerald-300",
      };
      project.tracks.push(audioTrack);
    }

    const audioClip: VideoClip = {
      ...clip,
      id: `clip-detached-audio-${Date.now()}`,
      trackId: audioTrack.id,
      name: `Audio: ${clip.name}`,
      type: "audio",
    };

    updateProjectWithHistory({
      tracks: [...project.tracks],
      clips: [...project.clips, audioClip],
    });
  };

  // Clip updates
  const handleUpdateClip = (clipId: string, updated: Partial<VideoClip>) => {
    const newClips = project.clips.map((c) => (c.id === clipId ? { ...c, ...updated } : c));
    updateProjectWithHistory({ clips: newClips });
  };

  // Duplicate clip
  const handleDuplicateClip = (clipId: string) => {
    const clip = project.clips.find((c) => c.id === clipId);
    if (!clip) return;

    const dupClip: VideoClip = {
      ...clip,
      id: `clip-dup-${Date.now()}`,
      startTime: clip.startTime + clip.duration,
    };

    updateProjectWithHistory({ clips: [...project.clips, dupClip] });
    setSelectedClipId(dupClip.id);
  };

  // Delete clip
  const handleDeleteClip = (clipId: string) => {
    const newClips = project.clips.filter((c) => c.id !== clipId);
    updateProjectWithHistory({ clips: newClips });
    if (selectedClipId === clipId) setSelectedClipId(undefined);
  };

  // Add track
  const handleAddTrack = (type: VideoTrackType) => {
    const newTrack: VideoTrack = {
      id: `t-${type}-${Date.now()}`,
      name: `New ${type.toUpperCase()} Track`,
      type,
      isLocked: false,
      isHidden: false,
      isMuted: false,
      height: 40,
      color: "bg-cyan-500/20 border-cyan-500 text-cyan-300",
    };

    updateProjectWithHistory({ tracks: [...project.tracks, newTrack] });
  };

  // Delete track
  const handleDeleteTrack = (trackId: string) => {
    const newTracks = project.tracks.filter((t) => t.id !== trackId);
    const newClips = project.clips.filter((c) => c.trackId !== trackId);
    updateProjectWithHistory({ tracks: newTracks, clips: newClips });
  };

  // Track toggles
  const handleToggleLockTrack = (trackId: string) => {
    const updated = project.tracks.map((t) => (t.id === trackId ? { ...t, isLocked: !t.isLocked } : t));
    updateProjectWithHistory({ tracks: updated });
  };

  const handleToggleHideTrack = (trackId: string) => {
    const updated = project.tracks.map((t) => (t.id === trackId ? { ...t, isHidden: !t.isHidden } : t));
    updateProjectWithHistory({ tracks: updated });
  };

  const handleToggleMuteTrack = (trackId: string) => {
    const updated = project.tracks.map((t) => (t.id === trackId ? { ...t, isMuted: !t.isMuted } : t));
    updateProjectWithHistory({ tracks: updated });
  };

  const handleToggleSoloTrack = (trackId: string) => {
    const updated = project.tracks.map((t) => (t.id === trackId ? { ...t, isSolo: !t.isSolo } : t));
    updateProjectWithHistory({ tracks: updated });
  };

  const handleUpdateTrack = (trackId: string, updated: Partial<VideoTrack>) => {
    const newTracks = project.tracks.map((t) => (t.id === trackId ? { ...t, ...updated } : t));
    updateProjectWithHistory({ tracks: newTracks });
  };

  const selectedClip = project.clips.find((c) => c.id === selectedClipId) || null;

  return (
    <div className="flex-1 bg-black text-white flex flex-col overflow-hidden font-sans select-none">
      {/* 1. TOP HEADER & EXPORT BAR */}
      <VideoHeaderBar
        project={project}
        onUpdateProject={updateProjectWithHistory}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onOpenExportModal={() => setIsExportModalOpen(true)}
      />

      {/* 2. MIDDLE REGION: MEDIA LIBRARY + PREVIEW STAGE + INSPECTOR */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
        <VideoMediaLibraryPanel
          mediaItems={mediaItems}
          folders={folders}
          onUploadFile={handleUploadFile}
          onAddMediaToTimeline={handleAddMediaToTimeline}
          onAddTextToTimeline={handleAddTextToTimeline}
          onAddLogoToTimeline={handleAddLogoToTimeline}
          onDeleteMedia={(id) => setMediaItems((prev) => prev.filter((m) => m.id !== id))}
          onAddRecordedAudioToTimeline={handleAddRecordedAudio}
        />

        <VideoPreviewStage
          project={project}
          currentTime={currentTime}
          isPlaying={isPlaying}
          selectedClipId={selectedClipId}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
        />

        <VideoInspectorPanel
          clip={selectedClip}
          project={project}
          currentTime={currentTime}
          onUpdateClip={handleUpdateClip}
          onDeleteClip={handleDeleteClip}
          onDuplicateClip={handleDuplicateClip}
          onFreezeFrame={handleFreezeFrame}
          onDetachAudio={handleDetachAudio}
          onUpdateProject={updateProjectWithHistory}
        />
      </div>

      {/* 3. BOTTOM REGION: PLAYBACK TRANSPORT & TIMELINE */}
      <div className="flex flex-col shrink-0">
        <VideoPlaybackBar
          project={project}
          currentTime={currentTime}
          isPlaying={isPlaying}
          playbackSpeed={playbackSpeed}
          isMuted={isMuted}
          masterVolume={masterVolume}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
          onStop={() => {
            setIsPlaying(false);
            setCurrentTime(0);
          }}
          onSeek={(t) => setCurrentTime(t)}
          onChangeSpeed={(s) => setPlaybackSpeed(s)}
          onToggleMute={() => setIsMuted(!isMuted)}
          onChangeMasterVolume={(v) => setMasterVolume(v)}
          onSplitActiveClipAtPlayhead={() => selectedClipId && handleSplitClip(selectedClipId)}
        />

        <VideoTimelinePanel
          project={project}
          currentTime={currentTime}
          selectedClipId={selectedClipId}
          onSelectClip={(id) => setSelectedClipId(id)}
          onUpdateClip={handleUpdateClip}
          onDeleteClip={handleDeleteClip}
          onDuplicateClip={handleDuplicateClip}
          onAddTrack={handleAddTrack}
          onDeleteTrack={handleDeleteTrack}
          onToggleLockTrack={handleToggleLockTrack}
          onToggleHideTrack={handleToggleHideTrack}
          onToggleMuteTrack={handleToggleMuteTrack}
          onToggleSoloTrack={handleToggleSoloTrack}
          onUpdateTrack={handleUpdateTrack}
          onSeek={(t) => setCurrentTime(t)}
          onSplitClip={handleSplitClip}
          onDetachAudio={handleDetachAudio}
          onUpdateProject={updateProjectWithHistory}
          onAddMarker={(time) => {
            const newMarker = {
              id: `m-${Date.now()}`,
              time,
              label: `Marker ${(project.markers?.length || 0) + 1}`,
              color: "#fbbf24",
              notes: "Key production milestone",
            };
            updateProjectWithHistory({ markers: [...(project.markers || []), newMarker] });
          }}
          onDeleteMarker={(id) =>
            updateProjectWithHistory({
              markers: (project.markers || []).filter((m) => m.id !== id),
            })
          }
        />
      </div>

      {/* EXPORT MODAL */}
      <VideoExportModal
        project={project}
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
}

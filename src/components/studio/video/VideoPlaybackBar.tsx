import React from "react";
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  SkipBack,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Gauge,
  Scissors,
} from "lucide-react";
import { VideoProjectData } from "../../../types/video";

interface Props {
  project: VideoProjectData;
  currentTime: number;
  isPlaying: boolean;
  playbackSpeed: number;
  isMuted: boolean;
  masterVolume: number;
  onTogglePlay: () => void;
  onStop: () => void;
  onSeek: (secs: number) => void;
  onChangeSpeed: (speed: number) => void;
  onToggleMute: () => void;
  onChangeMasterVolume: (vol: number) => void;
  onSplitActiveClipAtPlayhead: () => void;
}

export const VideoPlaybackBar: React.FC<Props> = ({
  project,
  currentTime,
  isPlaying,
  playbackSpeed,
  isMuted,
  masterVolume,
  onTogglePlay,
  onStop,
  onSeek,
  onChangeSpeed,
  onToggleMute,
  onChangeMasterVolume,
  onSplitActiveClipAtPlayhead,
}) => {
  const duration = project.duration || 60;

  const formatTimecode = (secs: number) => {
    const safeSecs = Math.max(0, Math.min(duration, secs));
    const mins = Math.floor(safeSecs / 60);
    const remSecs = Math.floor(safeSecs % 60);
    const frames = Math.floor((safeSecs % 1) * project.fps);
    return `${mins.toString().padStart(2, "0")}:${remSecs
      .toString()
      .padStart(2, "0")}.${frames.toString().padStart(2, "0")}`;
  };

  const frameTime = 1 / project.fps;

  return (
    <div className="h-11 bg-black/80 border-b border-white/10 px-4 flex items-center justify-between text-xs font-mono text-gray-300 shrink-0 select-none">
      {/* LEFT: TRANSPORT CONTROL BUTTONS */}
      <div className="flex items-center gap-2">
        {/* RESTART */}
        <button
          type="button"
          onClick={() => {
            onSeek(0);
          }}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-colors"
          title="Jump to Start (0s)"
        >
          <SkipBack className="w-3.5 h-3.5" />
        </button>

        {/* PREVIOUS FRAME */}
        <button
          type="button"
          onClick={() => onSeek(Math.max(0, currentTime - frameTime))}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-colors"
          title="Previous Frame (1/30s)"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {/* PLAY / PAUSE */}
        <button
          type="button"
          onClick={onTogglePlay}
          className="p-2 rounded-xl bg-neon-cyan text-black hover:scale-105 transition-transform shadow-[0_0_10px_rgba(0,245,255,0.4)]"
          title={isPlaying ? "Pause (Space)" : "Play (Space)"}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current ml-0.5" />
          )}
        </button>

        {/* STOP */}
        <button
          type="button"
          onClick={onStop}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-colors"
          title="Stop & Reset to 0s"
        >
          <Square className="w-3.5 h-3.5 fill-current" />
        </button>

        {/* NEXT FRAME */}
        <button
          type="button"
          onClick={() => onSeek(Math.min(duration, currentTime + frameTime))}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-colors"
          title="Next Frame (1/30s)"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        {/* JUMP TO END */}
        <button
          type="button"
          onClick={() => onSeek(duration)}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-colors"
          title="Jump to End"
        >
          <SkipForward className="w-3.5 h-3.5" />
        </button>

        {/* TIMECODE DISPLAY */}
        <span className="text-neon-cyan font-bold text-xs ml-2">
          {formatTimecode(currentTime)} / {formatTimecode(duration)}
        </span>
      </div>

      {/* CENTER: SPLIT CLIP QUICK ACTION */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onSplitActiveClipAtPlayhead}
          className="px-3 py-1 rounded-lg bg-neon-cyan/15 border border-neon-cyan/40 hover:bg-neon-cyan hover:text-black text-neon-cyan font-bold text-xs flex items-center gap-1.5 transition-all"
        >
          <Scissors className="w-3.5 h-3.5" />
          <span>Split Clip</span>
        </button>
      </div>

      {/* RIGHT: PLAYBACK SPEED & MASTER VOLUME */}
      <div className="flex items-center gap-4">
        {/* PLAYBACK SPEED DROPDOWN */}
        <div className="flex items-center gap-1">
          <Gauge className="w-3.5 h-3.5 text-gray-400" />
          <select
            value={playbackSpeed}
            onChange={(e) => onChangeSpeed(Number(e.target.value))}
            className="bg-black border border-white/10 rounded-lg px-2 py-0.5 text-[11px] text-gray-300 font-bold focus:outline-none"
          >
            <option value={0.25}>0.25x</option>
            <option value={0.5}>0.5x</option>
            <option value={1}>1.0x Normal</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2.0x Fast</option>
          </select>
        </div>

        {/* MASTER VOLUME */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleMute}
            className="p-1 text-gray-400 hover:text-white"
          >
            {isMuted || masterVolume === 0 ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            )}
          </button>

          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={isMuted ? 0 : masterVolume}
            onChange={(e) => onChangeMasterVolume(Number(e.target.value))}
            className="w-16 h-1 accent-neon-cyan cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

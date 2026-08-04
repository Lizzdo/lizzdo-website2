import React, { useState } from "react";
import {
  Video,
  Play,
  Pause,
  RotateCcw,
  Scissors,
  Plus,
  Volume2,
  VolumeX,
  Layers,
  Music,
  Type,
  Sparkles,
  Download,
  Film,
  Sliders,
  ChevronRight,
  Maximize2,
  Clock,
} from "lucide-react";

export function VideoEditorWorkspace() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(12.4);
  const [duration] = useState(60.0);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState<"media" | "text" | "audio" | "effects">("media");

  const [tracks, setTracks] = useState([
    { id: "t-video", type: "video", name: "Main Video Track", color: "bg-cyan-500/20 border-cyan-500", clips: [{ id: "c1", start: 0, end: 35, name: "Intro_Cyberpunk.mp4" }, { id: "c2", start: 35, end: 60, name: "Outro_Lizzdo.mp4" }] },
    { id: "t-overlay", type: "overlay", name: "Glitch FX Overlay", color: "bg-purple-500/20 border-purple-500", clips: [{ id: "c3", start: 10, end: 25, name: "Neon_Glitch_Particle.mov" }] },
    { id: "t-text", type: "text", name: "Lower Third & Titles", color: "bg-amber-500/20 border-amber-500", clips: [{ id: "c4", start: 5, end: 18, name: "Title: STUDIO LIZZDO" }] },
    { id: "t-audio", type: "audio", name: "Background Music", color: "bg-emerald-500/20 border-emerald-500", clips: [{ id: "c5", start: 0, end: 60, name: "Synthwave_Loop_120BPM.mp3" }] },
  ]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    const ms = Math.floor((secs % 1) * 10);
    return `${mins.toString().padStart(2, "0")}:${remainingSecs.toString().padStart(2, "0")}.${ms}`;
  };

  return (
    <div className="flex-1 bg-black text-white flex flex-col overflow-hidden font-sans select-none">
      {/* TOP MENU & EXPORT BAR */}
      <div className="h-12 bg-neutral-950 border-b border-white/10 px-4 flex items-center justify-between font-mono text-xs text-gray-300 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-neon-cyan animate-pulse" />
            <span className="font-bold text-white uppercase">Video Editor Suite</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-gray-400">
            1080p Full HD • 60 FPS
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-bold text-xs flex items-center gap-1.5 hover:shadow-[0_0_15px_rgba(0,245,255,0.5)] transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export MP4 Video</span>
          </button>
        </div>
      </div>

      {/* MIDDLE SECTION: MEDIA SIDEBAR + VIDEO PREVIEW STAGE */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
        {/* LEFT MEDIA & EFFECTS ASSET SIDEBAR */}
        <div className="w-full md:w-80 bg-neutral-950 border-r border-white/10 flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
          {/* TAB HEADERS */}
          <div className="flex border-b border-white/10 font-mono text-[11px]">
            {[
              { id: "media", label: "Media", icon: Film },
              { id: "text", label: "Text", icon: Type },
              { id: "audio", label: "Audio", icon: Music },
              { id: "effects", label: "Effects", icon: Sparkles },
            ].map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 py-3 text-center transition-all flex flex-col items-center gap-1 border-b-2 ${
                    activeTab === tab.id
                      ? "border-neon-cyan text-neon-cyan font-bold bg-white/5"
                      : "border-transparent text-gray-400 hover:text-white"
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB CONTENT */}
          <div className="p-4 space-y-3 font-mono text-xs">
            {activeTab === "media" && (
              <div className="space-y-3">
                <button className="w-full py-2.5 rounded-xl border border-dashed border-neon-cyan/50 bg-neon-cyan/10 hover:bg-neon-cyan/20 text-neon-cyan font-bold flex items-center justify-center gap-2 transition-all">
                  <Plus className="w-4 h-4" /> Upload Video Clips
                </button>

                <div className="space-y-2 pt-2">
                  <span className="text-[10px] text-gray-500 uppercase">Stock Clips & Loops</span>
                  {[
                    "Cyberpunk_Neon_City.mp4",
                    "Abstract_3D_Tunnel.mp4",
                    "Glitch_Particle_Burst.mov",
                    "Tech_HUD_Interface.mp4",
                  ].map((clip, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-neutral-900 border border-white/5 hover:border-white/20 flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Film className="w-4 h-4 text-neon-purple shrink-0" />
                        <span className="truncate text-gray-300 group-hover:text-white">{clip}</span>
                      </div>
                      <Plus className="w-3.5 h-3.5 text-neon-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "text" && (
              <div className="space-y-2">
                <span className="text-[10px] text-gray-500 uppercase">Text Presets</span>
                {["Animated Title", "Subtitles Caption", "Lower Third Badge", "Callout Box"].map((txt, i) => (
                  <button
                    key={i}
                    className="w-full p-2.5 rounded-xl bg-neutral-900 border border-white/5 hover:border-neon-cyan text-left font-bold text-white text-xs flex items-center justify-between"
                  >
                    <span>{txt}</span>
                    <Plus className="w-3.5 h-3.5 text-neon-cyan" />
                  </button>
                ))}
              </div>
            )}

            {activeTab === "audio" && (
              <div className="space-y-2">
                <span className="text-[10px] text-gray-500 uppercase">Audio Tracks</span>
                {["Cyber Synthwave - 120 BPM", "Future Bass Drops", "Glitch Sound FX"].map((aud, i) => (
                  <button
                    key={i}
                    className="w-full p-2.5 rounded-xl bg-neutral-900 border border-white/5 hover:border-emerald-400 text-left text-xs font-bold text-gray-200 flex items-center justify-between"
                  >
                    <span className="truncate">{aud}</span>
                    <Music className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  </button>
                ))}
              </div>
            )}

            {activeTab === "effects" && (
              <div className="space-y-2">
                <span className="text-[10px] text-gray-500 uppercase">Video Transitions</span>
                {["Glitch Dissolve", "Cyber Zoom In", "RGB Split Flash", "Neon Wipe"].map((fx, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-neutral-900 border border-white/5 hover:border-purple-400 text-xs text-gray-300 font-bold"
                  >
                    {fx}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CENTER VIDEO CANVI PREVIEW STAGE */}
        <div className="flex-1 bg-neutral-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
          <div className="relative w-full max-w-2xl aspect-video rounded-2xl bg-black border border-white/20 shadow-2xl overflow-hidden flex items-center justify-center group">
            {/* SIMULATED VIDEO FRAME */}
            <img
              src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80"
              alt="Video Preview"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

            {/* OVERLAY TEXT ON VIDEO */}
            <div className="absolute bottom-6 left-6 right-6 font-display font-black text-2xl tracking-widest text-neon-cyan uppercase drop-shadow-[0_0_10px_rgba(0,245,255,0.8)]">
              STUDIO LIZZDO VIDEO
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM TIMELINE REGION */}
      <div className="h-64 bg-neutral-950 border-t border-white/10 flex flex-col shrink-0 font-mono text-xs">
        {/* TIMELINE CONTROLS BAR */}
        <div className="h-10 bg-black/60 border-b border-white/10 px-4 flex items-center justify-between text-gray-300 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="p-1.5 rounded-lg bg-neon-cyan text-black hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>
            <button
              onClick={() => setCurrentTime(0)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <span className="text-neon-cyan font-bold font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 flex items-center gap-1">
              <Scissors className="w-3.5 h-3.5 text-neon-cyan" /> Split Clip
            </button>
            <button onClick={() => setIsMuted(!isMuted)} className="p-1.5 text-gray-400 hover:text-white">
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* TRACK TIMELINE STAGE */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2 bg-neutral-900/50">
          {tracks.map((track) => (
            <div key={track.id} className="flex items-center gap-2 h-10">
              <div className="w-40 shrink-0 text-[10px] font-bold text-gray-400 truncate bg-neutral-950 px-2.5 py-1.5 rounded-lg border border-white/5">
                {track.name}
              </div>

              {/* TRACK CANVAS RULER & CLIPS */}
              <div className="flex-1 h-full bg-black/80 rounded-lg border border-white/5 relative overflow-hidden">
                {track.clips.map((clip) => {
                  const leftPct = (clip.start / duration) * 100;
                  const widthPct = ((clip.end - clip.start) / duration) * 100;

                  return (
                    <div
                      key={clip.id}
                      style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                      className={`absolute top-1 bottom-1 rounded-md border px-2 flex items-center text-[10px] font-bold text-white truncate shadow-md ${track.color}`}
                    >
                      {clip.name}
                    </div>
                  );
                })}

                {/* SEEKHEAD INDICATOR LINE */}
                <div
                  style={{ left: `${(currentTime / duration) * 100}%` }}
                  className="absolute top-0 bottom-0 w-0.5 bg-neon-cyan z-20 pointer-events-none shadow-[0_0_8px_rgba(0,245,255,1)]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

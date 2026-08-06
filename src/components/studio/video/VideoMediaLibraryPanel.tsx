import React, { useState, useRef } from "react";
import {
  Film,
  Type,
  Music,
  Sparkles,
  Plus,
  Upload,
  Folder,
  Search,
  Mic,
  MicOff,
  Trash2,
  Copy,
  Edit2,
  Sliders,
  Award,
  Layers,
  FileVideo,
  FileAudio,
  Image as ImageIcon,
  Check,
} from "lucide-react";
import { MediaFolder, MediaItem, VideoClip, VideoTrack } from "../../../types/video";
import { INITIAL_FOLDERS, INITIAL_STOCK_MEDIA, VoiceRecorderEngine, createDefaultTextProps, createDefaultEffectProps } from "../../../utils/videoEngine";
import { useStudio } from "../../../context/StudioContext";

interface Props {
  mediaItems: MediaItem[];
  folders: MediaFolder[];
  onUploadFile: (file: File) => void;
  onAddMediaToTimeline: (media: MediaItem) => void;
  onAddTextToTimeline: (presetType: string) => void;
  onAddLogoToTimeline: (logoUrl: string) => void;
  onDeleteMedia: (id: string) => void;
  onAddRecordedAudioToTimeline: (audioUrl: string, duration: number) => void;
}

export const VideoMediaLibraryPanel: React.FC<Props> = ({
  mediaItems,
  folders,
  onUploadFile,
  onAddMediaToTimeline,
  onAddTextToTimeline,
  onAddLogoToTimeline,
  onDeleteMedia,
  onAddRecordedAudioToTimeline,
}) => {
  const { activeBrandKit } = useStudio();
  const [activeTab, setActiveTab] = useState<"media" | "text" | "audio" | "logo" | "effects" | "transitions">("media");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string>("f-all");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Voice recorder state
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const recorderRef = useRef<VoiceRecorderEngine | null>(null);
  const timerRef = useRef<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUploadFile(e.dataTransfer.files[0]);
    }
  };

  // Toggle voice-over recording
  const handleToggleVoiceRecorder = async () => {
    if (!isRecording) {
      const recorder = new VoiceRecorderEngine();
      const started = await recorder.startRecording();
      if (started) {
        recorderRef.current = recorder;
        setIsRecording(true);
        setRecordTime(0);

        timerRef.current = setInterval(() => {
          setRecordTime((prev) => prev + 1);
        }, 1000);
      }
    } else {
      if (recorderRef.current) {
        clearInterval(timerRef.current);
        const result = await recorderRef.current.stopRecording();
        setIsRecording(false);
        onAddRecordedAudioToTimeline(result.url, result.duration);
      }
    }
  };

  const filteredMedia = mediaItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = selectedFolder === "f-all" || item.folderId === selectedFolder;
    return matchesSearch && matchesFolder;
  });

  return (
    <div className="w-full md:w-80 bg-neutral-950 border-r border-white/10 flex flex-col shrink-0 font-mono text-xs overflow-hidden select-none">
      {/* TABS HEADER */}
      <div className="flex border-b border-white/10 text-[11px] bg-black/40">
        {[
          { id: "media", label: "Media", icon: Film },
          { id: "text", label: "Text", icon: Type },
          { id: "audio", label: "Audio", icon: Music },
          { id: "logo", label: "Logo", icon: Award },
          { id: "effects", label: "FX", icon: Sparkles },
          { id: "transitions", label: "Trans", icon: Layers },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2.5 text-center transition-all flex flex-col items-center gap-1 border-b-2 ${
                activeTab === tab.id
                  ? "border-neon-cyan text-neon-cyan font-bold bg-white/5"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="text-[10px]">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENTS */}
      <div className="flex-1 p-3 overflow-y-auto custom-scrollbar space-y-3">
        {/* MEDIA TAB */}
        {activeTab === "media" && (
          <div className="space-y-3">
            {/* UPLOAD & RECORD ACTION BUTTONS */}
            <div className="flex gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="video/*,audio/*,image/*,.mp4,.mov,.avi,.mkv,.webm,.gif,.png,.jpg,.jpeg,.svg,.webp,.mp3,.wav,.ogg,.aac"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-2.5 rounded-xl border border-dashed border-neon-cyan/50 bg-neon-cyan/10 hover:bg-neon-cyan/20 text-neon-cyan font-bold flex items-center justify-center gap-1.5 transition-all text-xs"
              >
                <Upload className="w-3.5 h-3.5" /> Upload File
              </button>

              <button
                type="button"
                onClick={handleToggleVoiceRecorder}
                className={`px-3 py-2.5 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition-all text-xs ${
                  isRecording
                    ? "border-red-500 bg-red-500/20 text-red-400 animate-pulse"
                    : "border-emerald-500/50 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400"
                }`}
              >
                {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                <span>{isRecording ? `${recordTime}s` : "Mic"}</span>
              </button>
            </div>

            {/* DRAG & DROP ZONE */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="p-3 rounded-xl border border-dashed border-white/10 hover:border-neon-cyan/40 bg-neutral-900/60 text-center cursor-pointer group"
            >
              <p className="text-[10px] text-gray-400 group-hover:text-neon-cyan transition-colors">
                Drag & Drop MP4, MOV, WebM, MP3, WAV, PNG, SVG, JPG
              </p>
            </div>

            {/* SEARCH & FOLDER FILTER */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search media..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl pl-8 pr-2 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan"
                />
              </div>

              <div className="flex gap-1 overflow-x-auto custom-scrollbar pb-1">
                {folders.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFolder(f.id)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold shrink-0 transition-colors ${
                      selectedFolder === f.id
                        ? "bg-neon-cyan text-black"
                        : "bg-white/5 text-gray-400 hover:text-white"
                    }`}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>

            {/* MEDIA ITEMS GRID */}
            <div className="space-y-2">
              <span className="text-[10px] text-gray-500 uppercase font-bold">
                Assets ({filteredMedia.length})
              </span>
              {filteredMedia.map((media) => (
                <div
                  key={media.id}
                  className="p-2 rounded-xl bg-neutral-900 border border-white/5 hover:border-white/20 flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {media.type === "video" && <FileVideo className="w-4 h-4 text-neon-cyan shrink-0" />}
                    {media.type === "audio" && <FileAudio className="w-4 h-4 text-emerald-400 shrink-0" />}
                    {media.type === "image" && <ImageIcon className="w-4 h-4 text-purple-400 shrink-0" />}
                    {media.type === "logo" && <Award className="w-4 h-4 text-amber-400 shrink-0" />}

                    <div className="truncate">
                      <p className="truncate text-gray-200 group-hover:text-white font-bold text-xs">
                        {media.name}
                      </p>
                      <p className="text-[10px] text-gray-500">
                        {media.fileSize} {media.duration ? `• ${media.duration}s` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onAddMediaToTimeline(media)}
                      className="p-1.5 rounded-lg bg-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan hover:text-black transition-colors"
                      title="Add to Timeline"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteMedia(media.id)}
                      className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TEXT TAB */}
        {activeTab === "text" && (
          <div className="space-y-3">
            <span className="text-[10px] text-gray-500 uppercase font-bold">Text Presets</span>
            {[
              { id: "title", label: "Animated Neon Title", desc: "Glowing cyberpunk header text" },
              { id: "subtitle", label: "Subtitles Caption", desc: "Clean bottom caption bar" },
              { id: "lower-third", label: "Lower Third Badge", desc: "Modern speaker tag" },
              { id: "callout", label: "Callout Box", desc: "Highlighted callout pill" },
              { id: "end-screen", label: "End Screen Card", desc: "Outro subscribe banner" },
            ].map((txt) => (
              <div
                key={txt.id}
                onClick={() => onAddTextToTimeline(txt.id)}
                className="p-3 rounded-xl bg-neutral-900 border border-white/5 hover:border-neon-cyan cursor-pointer transition-all flex items-center justify-between group"
              >
                <div>
                  <p className="font-bold text-white text-xs group-hover:text-neon-cyan">{txt.label}</p>
                  <p className="text-[10px] text-gray-400">{txt.desc}</p>
                </div>
                <Plus className="w-4 h-4 text-neon-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        )}

        {/* AUDIO TAB */}
        {activeTab === "audio" && (
          <div className="space-y-3">
            <span className="text-[10px] text-gray-500 uppercase font-bold">Stock Audio Loops</span>
            {[
              { id: "a1", name: "Cyber Synthwave - 120 BPM", duration: "60s", url: "https://actions.google.com/sounds/v1/science_fiction/alien_spaceship_ambient.ogg" },
              { id: "a2", name: "Future Bass Drop Loop", duration: "45s", url: "https://actions.google.com/sounds/v1/science_fiction/deep_space_hum.ogg" },
              { id: "a3", name: "Glitch Sound FX Pulse", duration: "12s", url: "https://actions.google.com/sounds/v1/science_fiction/hi_tech_device.ogg" },
            ].map((aud) => (
              <div
                key={aud.id}
                className="p-2.5 rounded-xl bg-neutral-900 border border-white/5 hover:border-emerald-400 flex items-center justify-between group"
              >
                <div className="truncate">
                  <p className="font-bold text-xs text-gray-200 group-hover:text-emerald-400 truncate">
                    {aud.name}
                  </p>
                  <p className="text-[10px] text-gray-500">{aud.duration}</p>
                </div>
                <button
                  onClick={() =>
                    onAddMediaToTimeline({
                      id: `stock-aud-${Date.now()}`,
                      name: aud.name,
                      type: "audio",
                      fileType: "mp3",
                      url: aud.url,
                      duration: 60,
                      fileSize: "3.2 MB",
                      createdAt: new Date().toISOString(),
                    })
                  }
                  className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-black transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* LOGO & BRAND TAB */}
        {activeTab === "logo" && (
          <div className="space-y-3">
            <span className="text-[10px] text-gray-500 uppercase font-bold">Brand Kit Watermarks</span>

            {activeBrandKit && (
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 space-y-2">
                <p className="font-bold text-purple-300 text-xs">
                  Active Brand: {activeBrandKit.brandName}
                </p>
                {activeBrandKit.logoVariants && activeBrandKit.logoVariants.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {activeBrandKit.logoVariants.map((logo) => (
                      <button
                        key={logo.id}
                        onClick={() => onAddLogoToTimeline(logo.url)}
                        className="p-2 rounded-lg bg-black border border-white/10 hover:border-purple-400 text-left text-[10px] font-bold text-gray-200 truncate flex flex-col items-center gap-1"
                      >
                        <img src={logo.url} alt={logo.name} className="w-8 h-8 object-contain" />
                        <span className="truncate w-full text-center">{logo.name}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-gray-400">No logo variants in active Brand Kit.</p>
                )}
              </div>
            )}

            <button
              onClick={() => onAddLogoToTimeline("/lizzdo-logo.png")}
              className="w-full p-2.5 rounded-xl bg-neutral-900 border border-white/5 hover:border-purple-400 flex items-center justify-between font-bold text-xs text-purple-300"
            >
              <span>Lizzdo Studio Watermark</span>
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* EFFECTS TAB */}
        {activeTab === "effects" && (
          <div className="space-y-3">
            <span className="text-[10px] text-gray-500 uppercase font-bold">Color Grading LUTs</span>
            {[
              { id: "cyberpunk", label: "Cyberpunk Teal & Orange" },
              { id: "vintage", label: "Vintage Film Warm" },
              { id: "noir", label: "Noir Black & White" },
              { id: "neon", label: "Neon Pop Vibrant" },
              { id: "cinematic", label: "Cinematic Cold Teal" },
            ].map((lut) => (
              <div
                key={lut.id}
                className="p-2.5 rounded-xl bg-neutral-900 border border-white/5 hover:border-neon-cyan font-bold text-xs text-gray-300 flex items-center justify-between"
              >
                <span>{lut.label}</span>
                <Sparkles className="w-3.5 h-3.5 text-neon-cyan" />
              </div>
            ))}
          </div>
        )}

        {/* TRANSITIONS TAB */}
        {activeTab === "transitions" && (
          <div className="space-y-2">
            <span className="text-[10px] text-gray-500 uppercase font-bold">Video Transitions</span>
            {[
              "Fade Dissolve",
              "Cyber Zoom In",
              "RGB Split Flash",
              "Neon Wipe",
              "Crossfade Dip",
              "Push Slide",
            ].map((trans, i) => (
              <div
                key={i}
                className="p-2.5 rounded-xl bg-neutral-900 border border-white/5 hover:border-purple-400 font-bold text-xs text-gray-300 flex items-center justify-between"
              >
                <span>{trans}</span>
                <Layers className="w-3.5 h-3.5 text-purple-400" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

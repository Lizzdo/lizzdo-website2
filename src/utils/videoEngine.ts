import {
  CanvasPreset,
  MediaFolder,
  MediaItem,
  VideoClip,
  VideoProjectData,
  VideoTrack,
} from "../types/video";

export const CANVAS_PRESETS: CanvasPreset[] = [
  { id: "yt-16-9", name: "YouTube Landscape", platform: "YouTube", width: 1920, height: 1080, aspectRatio: "16:9", category: "Social" },
  { id: "yt-shorts", name: "YouTube Shorts", platform: "YouTube", width: 1080, height: 1920, aspectRatio: "9:16", category: "Social" },
  { id: "tiktok", name: "TikTok Video", platform: "TikTok", width: 1080, height: 1920, aspectRatio: "9:16", category: "Social" },
  { id: "ig-reel", name: "Instagram Reel", platform: "Instagram", width: 1080, height: 1920, aspectRatio: "9:16", category: "Social" },
  { id: "ig-story", name: "Instagram Story", platform: "Instagram", width: 1080, height: 1920, aspectRatio: "9:16", category: "Social" },
  { id: "fb-video", name: "Facebook Video", platform: "Facebook", width: 1920, height: 1080, aspectRatio: "16:9", category: "Social" },
  { id: "fb-story", name: "Facebook Story", platform: "Facebook", width: 1080, height: 1920, aspectRatio: "9:16", category: "Social" },
  { id: "li-video", name: "LinkedIn Video", platform: "LinkedIn", width: 1920, height: 1080, aspectRatio: "16:9", category: "Social" },
  { id: "x-video", name: "X (Twitter) Video", platform: "X", width: 1200, height: 675, aspectRatio: "16:9", category: "Social" },
  { id: "pinterest", name: "Pinterest Video", platform: "Pinterest", width: 1000, height: 1500, aspectRatio: "2:3", category: "Social" },
  { id: "hero-21-9", name: "Website Hero Video", platform: "Web", width: 2560, height: 1080, aspectRatio: "21:9", category: "Web" },
  { id: "portfolio", name: "Portfolio Showcase", platform: "Portfolio", width: 1920, height: 1080, aspectRatio: "16:9", category: "Web" },
  { id: "blog-hdr", name: "Blog Article Video", platform: "Blog", width: 1280, height: 720, aspectRatio: "16:9", category: "Web" },
  { id: "store-prod", name: "Store Product Video", platform: "E-Commerce", width: 1080, height: 1080, aspectRatio: "1:1", category: "E-Commerce" },
  { id: "fiverr-gig", name: "Fiverr Gig Video", platform: "Fiverr", width: 1280, height: 769, aspectRatio: "16:9", category: "Services" },
];

export const INITIAL_FOLDERS: MediaFolder[] = [
  { id: "f-all", name: "All Assets" },
  { id: "f-uploads", name: "User Uploads" },
  { id: "f-stock-vid", name: "Stock Videos" },
  { id: "f-audio", name: "Audio Tracks" },
  { id: "f-logos", name: "Logos & Watermarks" },
  { id: "f-overlays", name: "Overlays & FX" },
];

export const INITIAL_STOCK_MEDIA: MediaItem[] = [
  {
    id: "m-cyberpunk",
    name: "Cyberpunk_Neon_City.mp4",
    type: "video",
    fileType: "mp4",
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    duration: 35,
    fileSize: "14.2 MB",
    folderId: "f-stock-vid",
    createdAt: "2026-08-01",
  },
  {
    id: "m-tunnel",
    name: "Abstract_3D_Tunnel.mp4",
    type: "video",
    fileType: "mp4",
    url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
    duration: 25,
    fileSize: "9.8 MB",
    folderId: "f-stock-vid",
    createdAt: "2026-08-01",
  },
  {
    id: "m-particle",
    name: "Neon_Glitch_Particle.mov",
    type: "video",
    fileType: "mov",
    url: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80",
    duration: 15,
    fileSize: "6.1 MB",
    folderId: "f-overlays",
    createdAt: "2026-08-02",
  },
  {
    id: "m-synth-track",
    name: "Synthwave_Loop_120BPM.mp3",
    type: "audio",
    fileType: "mp3",
    url: "https://actions.google.com/sounds/v1/science_fiction/alien_spaceship_ambient.ogg",
    duration: 60,
    fileSize: "3.4 MB",
    folderId: "f-audio",
    createdAt: "2026-08-02",
  },
  {
    id: "m-logo-watermark",
    name: "Lizzdo_Studio_Badge.png",
    type: "logo",
    fileType: "png",
    url: "/lizzdo-logo.png",
    duration: 60,
    fileSize: "420 KB",
    folderId: "f-logos",
    createdAt: "2026-08-03",
  },
];

export function createDefaultVideoProject(): VideoProjectData {
  const tracks: VideoTrack[] = [
    {
      id: "t-logo",
      name: "Watermark & Logo Track",
      type: "logo",
      isLocked: false,
      isHidden: false,
      isMuted: false,
      height: 38,
      color: "bg-purple-500/20 border-purple-500 text-purple-300",
    },
    {
      id: "t-text",
      name: "Titles & Captions",
      type: "text",
      isLocked: false,
      isHidden: false,
      isMuted: false,
      height: 38,
      color: "bg-amber-500/20 border-amber-500 text-amber-300",
    },
    {
      id: "t-overlay",
      name: "Overlays & FX",
      type: "overlay",
      isLocked: false,
      isHidden: false,
      isMuted: false,
      height: 38,
      color: "bg-cyan-500/20 border-cyan-500 text-cyan-300",
    },
    {
      id: "t-video-1",
      name: "Main Video Track 1",
      type: "video",
      isLocked: false,
      isHidden: false,
      isMuted: false,
      height: 44,
      color: "bg-blue-500/20 border-blue-500 text-blue-300",
    },
    {
      id: "t-audio-1",
      name: "Background Music Track",
      type: "audio",
      isLocked: false,
      isHidden: false,
      isMuted: false,
      height: 38,
      color: "bg-emerald-500/20 border-emerald-500 text-emerald-300",
    },
  ];

  const clips: VideoClip[] = [
    {
      id: "clip-logo-1",
      trackId: "t-logo",
      name: "Lizzdo Watermark",
      type: "logo",
      src: "/lizzdo-logo.png",
      fileType: "png",
      startTime: 0,
      duration: 60,
      mediaOffset: 0,
      volume: 1,
      isMuted: false,
      fadeIn: 1,
      fadeOut: 1,
      speed: 1,
      isReversed: false,
      opacity: 0.85,
      scale: 0.8,
      rotation: 0,
      flipX: false,
      flipY: false,
      posX: 380,
      posY: -220,
      crop: { top: 0, right: 0, bottom: 0, left: 0 },
      logoAnim: {
        preset: "fadeIn",
        duration: 1.5,
        delay: 0,
        loop: false,
        positionPreset: "top-right",
      },
      textProps: createDefaultTextProps(),
      effectProps: createDefaultEffectProps(),
      transition: { type: "none", duration: 0 },
    },
    {
      id: "clip-text-1",
      trackId: "t-text",
      name: "Lower Third: STUDIO LIZZDO",
      type: "text",
      src: "STUDIO LIZZDO PRO",
      fileType: "txt",
      startTime: 3,
      duration: 15,
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
      posY: 180,
      crop: { top: 0, right: 0, bottom: 0, left: 0 },
      logoAnim: {
        preset: "none",
        duration: 0,
        delay: 0,
        loop: false,
        positionPreset: "custom",
      },
      textProps: {
        ...createDefaultTextProps(),
        content: "STUDIO LIZZDO PRO",
        fontSize: 32,
        color: "#00f5ff",
        glowColor: "#00f5ff",
        glowBlur: 12,
        backgroundColor: "rgba(0,0,0,0.7)",
        backgroundPadding: 12,
        animationType: "slideUp",
      },
      effectProps: createDefaultEffectProps(),
      transition: { type: "none", duration: 0 },
    },
    {
      id: "clip-video-1",
      trackId: "t-video-1",
      name: "Cyberpunk_Neon_City.mp4",
      type: "video",
      src: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
      fileType: "mp4",
      startTime: 0,
      duration: 35,
      mediaOffset: 0,
      mediaDuration: 35,
      volume: 1,
      isMuted: false,
      fadeIn: 0,
      fadeOut: 1,
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
      transition: { type: "fade", duration: 1 },
    },
    {
      id: "clip-video-2",
      trackId: "t-video-1",
      name: "Abstract_3D_Tunnel.mp4",
      type: "video",
      src: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
      fileType: "mp4",
      startTime: 35,
      duration: 25,
      mediaOffset: 0,
      mediaDuration: 25,
      volume: 1,
      isMuted: false,
      fadeIn: 1,
      fadeOut: 1,
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
      transition: { type: "zoom", duration: 1 },
    },
    {
      id: "clip-audio-1",
      trackId: "t-audio-1",
      name: "Synthwave_Loop_120BPM.mp3",
      type: "audio",
      src: "https://actions.google.com/sounds/v1/science_fiction/alien_spaceship_ambient.ogg",
      fileType: "mp3",
      startTime: 0,
      duration: 60,
      mediaOffset: 0,
      mediaDuration: 60,
      volume: 0.8,
      isMuted: false,
      fadeIn: 2,
      fadeOut: 2,
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
    },
  ];

  return {
    id: `proj-video-${Date.now()}`,
    title: "Lizzdo Cyberpunk Promo Video",
    width: 1920,
    height: 1080,
    fps: 30,
    duration: 60,
    currentTime: 12.4,
    playbackSpeed: 1,
    tracks,
    clips,
    aspectRatioPreset: "yt-16-9",
    bgColor: "#05050a",
    updatedAt: new Date().toISOString(),
  };
}

export function createDefaultTextProps() {
  return {
    content: "LIZZDO VIDEO TITLE",
    fontFamily: "Orbitron",
    fontSize: 36,
    fontWeight: 700,
    color: "#00f5ff",
    outlineColor: "#000000",
    outlineWidth: 2,
    shadowColor: "rgba(0,0,0,0.8)",
    shadowBlur: 10,
    shadowOffsetX: 2,
    shadowOffsetY: 2,
    glowColor: "#00f5ff",
    glowBlur: 15,
    backgroundColor: "transparent",
    backgroundPadding: 8,
    alignment: "center" as const,
    animationType: "none" as const,
  };
}

export function createDefaultEffectProps() {
  return {
    blur: 0,
    brightness: 0,
    contrast: 0,
    saturation: 100,
    hueRotate: 0,
    exposure: 0,
    vignette: 0,
    filmGrain: 0,
    noise: 0,
    lut: "none" as const,
  };
}

// Live Voice-Over Recording Utility
export class VoiceRecorderEngine {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  async startRecording(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioChunks = [];
      this.mediaRecorder = new MediaRecorder(stream);

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start();
      return true;
    } catch (err) {
      console.error("Microphone access error:", err);
      return false;
    }
  }

  stopRecording(): Promise<{ blob: Blob; url: string; duration: number }> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        return reject("No active recording");
      }

      const startTime = Date.now();

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(audioBlob);
        const recDuration = Math.max(1, (Date.now() - startTime) / 1000);

        // Stop all tracks to release mic
        this.mediaRecorder?.stream.getTracks().forEach((track) => track.stop());

        resolve({
          blob: audioBlob,
          url: audioUrl,
          duration: recDuration,
        });
      };

      this.mediaRecorder.stop();
    });
  }
}

import {
  CanvasPreset,
  MediaFolder,
  MediaItem,
  VideoClip,
  VideoProjectData,
  VideoTrack,
  CaptionStyleProps,
  TransitionPreset,
  ProjectTemplate,
  VideoScene,
  CaptionItem,
  VideoMarker,
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

export function createDefaultCaptionStyle(): CaptionStyleProps {
  return {
    fontFamily: "Inter",
    fontSize: 28,
    fontWeight: 700,
    color: "#ffffff",
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    backgroundPadding: 10,
    outlineColor: "#000000",
    outlineWidth: 2,
    shadowColor: "rgba(0, 0, 0, 0.5)",
    shadowBlur: 6,
    alignment: "center",
    positionY: 0.85,
    presetName: "social",
    highlightColor: "#00f5ff",
  };
}

export const CAPTION_PRESETS: { id: string; name: string; style: Partial<CaptionStyleProps> }[] = [
  {
    id: "clean",
    name: "Clean Subtitle",
    style: {
      fontFamily: "Inter",
      fontSize: 24,
      fontWeight: 500,
      color: "#ffffff",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      backgroundPadding: 8,
      outlineWidth: 0,
      shadowBlur: 4,
      positionY: 0.88,
    },
  },
  {
    id: "bold",
    name: "Bold Impact",
    style: {
      fontFamily: "Impact",
      fontSize: 36,
      fontWeight: 900,
      color: "#facc15",
      backgroundColor: "#000000",
      backgroundPadding: 12,
      outlineColor: "#000000",
      outlineWidth: 4,
      shadowColor: "#000000",
      shadowBlur: 10,
      positionY: 0.82,
    },
  },
  {
    id: "social",
    name: "Social Reel",
    style: {
      fontFamily: "Montserrat",
      fontSize: 32,
      fontWeight: 800,
      color: "#00f5ff",
      backgroundColor: "rgba(15, 23, 42, 0.9)",
      backgroundPadding: 12,
      outlineColor: "#000000",
      outlineWidth: 2,
      shadowColor: "rgba(0,245,255,0.4)",
      shadowBlur: 12,
      positionY: 0.82,
    },
  },
  {
    id: "minimal",
    name: "Minimal White",
    style: {
      fontFamily: "Inter",
      fontSize: 22,
      fontWeight: 400,
      color: "#ffffff",
      backgroundColor: "transparent",
      backgroundPadding: 0,
      outlineColor: "rgba(0,0,0,0.8)",
      outlineWidth: 2,
      shadowBlur: 6,
      positionY: 0.88,
    },
  },
  {
    id: "highlight",
    name: "Karaoke Highlight",
    style: {
      fontFamily: "Orbitron",
      fontSize: 30,
      fontWeight: 700,
      color: "#38bdf8",
      highlightColor: "#f43f5e",
      backgroundColor: "rgba(0,0,0,0.85)",
      backgroundPadding: 10,
      outlineWidth: 1,
      shadowBlur: 8,
      positionY: 0.85,
    },
  },
];

export const TRANSITION_PRESETS: TransitionPreset[] = [
  { id: "cut", name: "Cut", type: "cut", duration: 0.25 },
  { id: "fade", name: "Fade In / Out", type: "fade", duration: 1.0 },
  { id: "crossfade", name: "Cross Dissolve", type: "crossfade", duration: 1.0 },
  { id: "dipToBlack", name: "Dip to Black", type: "dipToBlack", duration: 1.0 },
  { id: "dipToWhite", name: "Dip to White", type: "dipToWhite", duration: 1.0 },
  { id: "slideLeft", name: "Slide Left", type: "slideLeft", duration: 0.75 },
  { id: "slideRight", name: "Slide Right", type: "slideRight", duration: 0.75 },
  { id: "slideUp", name: "Slide Up", type: "slideUp", duration: 0.75 },
  { id: "slideDown", name: "Slide Down", type: "slideDown", duration: 0.75 },
  { id: "zoom", name: "Zoom In", type: "zoom", duration: 0.75 },
  { id: "push", name: "Push Left", type: "push", duration: 0.75 },
  { id: "wipe", name: "Wipe Transition", type: "wipe", duration: 1.0 },
  { id: "blur", name: "Blur Dissolve", type: "blur", duration: 0.75 },
  { id: "flash", name: "Flash White", type: "flash", duration: 0.5 },
];

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: "tmpl-social-reel",
    name: "Viral Social Reel / Shorts",
    category: "Social Media",
    aspectRatio: "9:16",
    width: 1080,
    height: 1920,
    description: "High-energy portrait video template with caption tracks, logo watermark, and smooth slide transitions.",
    placeholders: [
      { id: "p-vid-1", type: "video", label: "Intro Hook Video", clipId: "clip-video-1" },
      { id: "p-vid-2", type: "video", label: "Main Demo Footage", clipId: "clip-video-2" },
      { id: "p-logo", type: "logo", label: "Brand Logo Watermark", clipId: "clip-logo-1" },
    ],
    projectData: {
      title: "Social Media Reel Template",
      width: 1080,
      height: 1920,
      aspectRatioPreset: "yt-shorts",
    },
  },
  {
    id: "tmpl-product-promo",
    name: "SaaS & Tech Product Launch",
    category: "Promotional",
    aspectRatio: "16:9",
    width: 1920,
    height: 1080,
    description: "5-scene structured project with adjustment layers, lower third titles, and audio beat synched cuts.",
    placeholders: [
      { id: "p-intro-vid", type: "video", label: "Hero Intro Footage", clipId: "clip-video-1" },
      { id: "p-audio", type: "audio", label: "Background Music Track", clipId: "clip-audio-1" },
    ],
    projectData: {
      title: "Product Promo Template",
      width: 1920,
      height: 1080,
      aspectRatioPreset: "yt-16-9",
    },
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
      id: "t-caption",
      name: "C1 Subtitles & Captions",
      type: "caption",
      isLocked: false,
      isHidden: false,
      isMuted: false,
      height: 38,
      color: "bg-cyan-500/20 border-cyan-500 text-cyan-300",
    },
    {
      id: "t-text",
      name: "Titles & Lower Thirds",
      type: "text",
      isLocked: false,
      isHidden: false,
      isMuted: false,
      height: 38,
      color: "bg-amber-500/20 border-amber-500 text-amber-300",
    },
    {
      id: "t-adj",
      name: "V4 Adjustment Layer",
      type: "adjustment",
      isLocked: false,
      isHidden: false,
      isMuted: false,
      height: 38,
      color: "bg-fuchsia-500/20 border-fuchsia-500 text-fuchsia-300",
    },
    {
      id: "t-overlay",
      name: "Overlays & FX",
      type: "overlay",
      isLocked: false,
      isHidden: false,
      isMuted: false,
      height: 38,
      color: "bg-blue-500/20 border-blue-500 text-blue-300",
    },
    {
      id: "t-video-1",
      name: "Main Video Track 1",
      type: "video",
      isLocked: false,
      isHidden: false,
      isMuted: false,
      height: 44,
      color: "bg-indigo-500/20 border-indigo-500 text-indigo-300",
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

  const scenes: VideoScene[] = [
    { id: "sc-1", name: "Scene 1: Intro", startTime: 0, endTime: 5, color: "#3b82f6", notes: "Hook viewer with high-impact visuals" },
    { id: "sc-2", name: "Scene 2: Product Demo", startTime: 5, endTime: 20, color: "#10b981", notes: "Showcase core UI and feature highlights" },
    { id: "sc-3", name: "Scene 3: Key Features", startTime: 20, endTime: 35, color: "#a855f7", notes: "Demonstrate workflow and speed" },
    { id: "sc-4", name: "Scene 4: Call To Action", startTime: 35, endTime: 48, color: "#f59e0b", notes: "Special launch offer & link" },
    { id: "sc-5", name: "Scene 5: Outro", startTime: 48, endTime: 60, color: "#ef4444", notes: "Brand tagline and final social badges" },
  ];

  const captions: CaptionItem[] = [
    { id: "cap-1", startTime: 1, endTime: 4.5, text: "Welcome to Studio Lizzdo Pro Video Editor" },
    { id: "cap-2", startTime: 5, endTime: 9.5, text: "Create stunning promotional videos with automated scenes and transitions" },
    { id: "cap-3", startTime: 10, endTime: 14.5, text: "Customize captions, apply adjustment layers, and keyframe your effects" },
    { id: "cap-4", startTime: 15, endTime: 19.5, text: "Export pixel-perfect social media reels in 4K resolution" },
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
      id: "clip-adj-1",
      trackId: "t-adj",
      name: "Cinematic Grade Adjustment Layer",
      type: "adjustment",
      src: "",
      fileType: "fx",
      startTime: 0,
      duration: 35,
      mediaOffset: 0,
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
      effectProps: {
        blur: 0,
        brightness: 5,
        contrast: 15,
        saturation: 120,
        hueRotate: 0,
        exposure: 5,
        vignette: 25,
        filmGrain: 0,
        noise: 0,
        lut: "cinematic",
      },
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
      logoAnim: { preset: "none", duration: 0, delay: 0, loop: false, positionPreset: "custom" },
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
      transition: { type: "crossfade", duration: 1.0 },
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
      transition: { type: "slideLeft", duration: 0.75 },
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

  const markers: VideoMarker[] = [
    { id: "m-1", time: 0, label: "Intro", color: "#3b82f6", notes: "Opening hook" },
    { id: "m-2", time: 5, label: "Product Demo", color: "#10b981", notes: "Core feature showcase" },
    { id: "m-3", time: 20, label: "Features", color: "#a855f7", notes: "Key specs" },
    { id: "m-4", time: 35, label: "CTA", color: "#f59e0b", notes: "Call to action link" },
    { id: "m-5", time: 48, label: "Outro", color: "#ef4444", notes: "Social media handles" },
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
    scenes,
    activeSceneId: undefined,
    sceneRange: null,
    captions,
    captionStyle: createDefaultCaptionStyle(),
    burnCaptionsOnExport: true,
    aspectRatioPreset: "yt-16-9",
    bgColor: "#05050a",
    showGuides: false,
    guidePreset: "none",
    snapToGuides: true,
    snapToMarkers: true,
    rippleEditing: false,
    markers,
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

// Helper to format seconds into SRT/VTT timestamp (HH:MM:SS,mmm or HH:MM:SS.mmm)
function formatSubtitleTimestamp(seconds: number, isVtt: boolean = false): string {
  const pad = (num: number, size: number = 2) => String(num).padStart(size, "0");
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);

  const sep = isVtt ? "." : ",";
  return `${pad(hrs)}:${pad(mins)}:${pad(secs)}${sep}${pad(ms, 3)}`;
}

export function generateSRT(captions: CaptionItem[]): string {
  const sorted = [...captions].sort((a, b) => a.startTime - b.startTime);
  return sorted
    .map((cap, index) => {
      const start = formatSubtitleTimestamp(cap.startTime, false);
      const end = formatSubtitleTimestamp(cap.endTime, false);
      return `${index + 1}\n${start} --> ${end}\n${cap.text}\n`;
    })
    .join("\n");
}

export function generateVTT(captions: CaptionItem[]): string {
  const sorted = [...captions].sort((a, b) => a.startTime - b.startTime);
  const body = sorted
    .map((cap, index) => {
      const start = formatSubtitleTimestamp(cap.startTime, true);
      const end = formatSubtitleTimestamp(cap.endTime, true);
      return `${index + 1}\n${start} --> ${end}\n${cap.text}\n`;
    })
    .join("\n");

  return `WEBVTT\n\n${body}`;
}

export function closeGapsOnTrack(clips: VideoClip[], trackId: string): VideoClip[] {
  const trackClips = clips.filter((c) => c.trackId === trackId).sort((a, b) => a.startTime - b.startTime);
  if (trackClips.length === 0) return clips;

  let currentEnd = 0;
  const updatedMap = new Map<string, number>();

  for (const c of trackClips) {
    if (c.startTime > currentEnd) {
      updatedMap.set(c.id, currentEnd);
      currentEnd = currentEnd + c.duration;
    } else {
      updatedMap.set(c.id, c.startTime);
      currentEnd = Math.max(currentEnd, c.startTime + c.duration);
    }
  }

  return clips.map((c) => {
    if (updatedMap.has(c.id)) {
      return { ...c, startTime: updatedMap.get(c.id)! };
    }
    return c;
  });
}

export function applyRippleDelete(clips: VideoClip[], deletedClip: VideoClip, targetTracks?: string[]): VideoClip[] {
  const delStart = deletedClip.startTime;
  const delDur = deletedClip.duration;

  return clips
    .filter((c) => c.id !== deletedClip.id)
    .map((c) => {
      if (targetTracks && targetTracks.length > 0 && !targetTracks.includes(c.trackId)) {
        return c;
      }
      if (c.startTime >= delStart + delDur) {
        return { ...c, startTime: Math.max(0, c.startTime - delDur) };
      }
      return c;
    });
}

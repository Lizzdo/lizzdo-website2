import React from "react";

interface VideoPlayerProps {
  url?: string;
  className?: string;
  autoPlay?: boolean;
  title?: string;
}

export function parseVideoUrl(url: string) {
  if (!url) return null;

  const trimmed = url.trim();

  // Handle raw iframe tag
  if (trimmed.startsWith("<iframe")) {
    const srcMatch = trimmed.match(/src=["']([^"']+)["']/);
    if (srcMatch && srcMatch[1]) {
      return { type: "iframe", embedUrl: srcMatch[1] };
    }
  }

  // YouTube matchers
  // Matches standard watch, embed, shorts, youtu.be
  const ytMatch = trimmed.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytMatch && ytMatch[1]) {
    return {
      type: "youtube",
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`,
      id: ytMatch[1]
    };
  }

  // Vimeo matchers
  const vimeoMatch = trimmed.match(/(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)(\d+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
      id: vimeoMatch[1]
    };
  }

  // Direct video file or external video link
  if (trimmed.match(/\.(mp4|webm|ogg)$/i) || trimmed.startsWith("blob:") || trimmed.startsWith("data:video")) {
    return {
      type: "file",
      embedUrl: trimmed
    };
  }

  // Fallback to iframe embed if it looks like an embed or http link
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return {
      type: "external",
      embedUrl: trimmed
    };
  }

  return null;
}

export default function VideoPlayer({ url, className = "w-full aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black", autoPlay = false, title = "Video player" }: VideoPlayerProps) {
  if (!url) return null;

  const parsed = parseVideoUrl(url);
  if (!parsed) return null;

  if (parsed.type === "file") {
    return (
      <div className={className}>
        <video 
          src={parsed.embedUrl} 
          controls 
          autoPlay={autoPlay}
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  return (
    <div className={className}>
      <iframe
        src={parsed.embedUrl}
        title={title}
        className="w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; webshare"
        allowFullScreen
      />
    </div>
  );
}

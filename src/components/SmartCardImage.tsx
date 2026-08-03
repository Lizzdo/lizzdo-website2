import React, { useState } from "react";
import { cn } from "@/src/lib/utils";

interface SmartCardImageProps {
  src?: string;
  alt: string;
  aspectRatio?: "4/3" | "16/10" | "video" | "square";
  fit?: "cover" | "contain" | "smart";
  className?: string;
  imageClassName?: string;
  hoverScale?: boolean;
  overlay?: React.ReactNode;
}

export default function SmartCardImage({
  src,
  alt,
  aspectRatio = "4/3",
  fit = "smart",
  className,
  imageClassName,
  hoverScale = true,
  overlay,
}: SmartCardImageProps) {
  const [hasError, setHasError] = useState(false);

  const aspectClasses = {
    "4/3": "aspect-[4/3]",
    "16/10": "aspect-[16/10]",
    "video": "aspect-video",
    "square": "aspect-square",
  }[aspectRatio];

  const imgSrc = !src || hasError ? "/lizzdo-logo.png" : src;
  const isFallbackLogo = imgSrc.includes("lizzdo-logo.png");

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-slate-950/80 border-b border-white/10 shrink-0 group/img flex items-center justify-center",
        aspectClasses,
        className
      )}
    >
      {/* Subtle Ambient Blur Background for non-cover / smart mode */}
      {!isFallbackLogo && fit !== "cover" && (
        <img
          src={imgSrc}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-35 scale-125 pointer-events-none transition-opacity duration-500"
          referrerPolicy="no-referrer"
        />
      )}

      {/* Main Image */}
      <img
        src={imgSrc}
        alt={alt}
        onError={() => setHasError(true)}
        className={cn(
          "w-full h-full transition-transform duration-700 ease-out",
          fit === "contain" || (fit === "smart" && isFallbackLogo)
            ? "object-contain p-4"
            : fit === "smart"
            ? "object-cover object-center"
            : "object-cover object-center",
          hoverScale && "group-hover/img:scale-105",
          imageClassName
        )}
        referrerPolicy="no-referrer"
      />

      {/* Custom Overlay (e.g. Eye icon, Badges, etc.) */}
      {overlay && <div className="absolute inset-0 z-10 pointer-events-none">{overlay}</div>}
    </div>
  );
}

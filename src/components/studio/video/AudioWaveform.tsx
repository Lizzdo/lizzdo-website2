import React, { useEffect, useState } from "react";
import { getWaveformPeaks } from "../../../utils/audioEngine";

interface Props {
  src: string;
  duration: number;
  fadeIn?: number;
  fadeOut?: number;
  color?: string;
  className?: string;
}

export const AudioWaveform: React.FC<Props> = ({
  src,
  duration,
  fadeIn = 0,
  fadeOut = 0,
  color = "bg-emerald-400",
  className = "",
}) => {
  const [peaks, setPeaks] = useState<number[]>([]);

  useEffect(() => {
    let isMounted = true;
    getWaveformPeaks(src, 60).then((res) => {
      if (isMounted) setPeaks(res);
    });
    return () => {
      isMounted = false;
    };
  }, [src]);

  const fadeInRatio = duration > 0 ? Math.min(1, fadeIn / duration) : 0;
  const fadeOutRatio = duration > 0 ? Math.min(1, fadeOut / duration) : 0;

  return (
    <div className={`relative flex items-center gap-0.5 h-full w-full opacity-80 overflow-hidden pointer-events-none ${className}`}>
      {peaks.length > 0 ? (
        peaks.map((pt, pIdx) => {
          const ratio = pIdx / peaks.length;
          let amp = pt;

          // Apply visual fade envelopes
          if (fadeInRatio > 0 && ratio < fadeInRatio) {
            amp *= ratio / fadeInRatio;
          }
          if (fadeOutRatio > 0 && ratio > 1 - fadeOutRatio) {
            amp *= (1 - ratio) / fadeOutRatio;
          }

          return (
            <div
              key={pIdx}
              style={{ height: `${Math.max(10, Math.round(amp * 90))}%` }}
              className={`flex-1 min-w-[2px] rounded-full transition-all ${color}`}
            />
          );
        })
      ) : (
        <div className="w-full h-1 bg-emerald-500/30 animate-pulse" />
      )}

      {/* Visual fade-in shade overlay */}
      {fadeInRatio > 0 && (
        <div
          style={{ width: `${fadeInRatio * 100}%` }}
          className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-black/60 to-transparent pointer-events-none border-r border-emerald-400/50"
        />
      )}

      {/* Visual fade-out shade overlay */}
      {fadeOutRatio > 0 && (
        <div
          style={{ width: `${fadeOutRatio * 100}%` }}
          className="absolute right-0 top-0 bottom-0 bg-gradient-to-l from-black/60 to-transparent pointer-events-none border-l border-emerald-400/50"
        />
      )}
    </div>
  );
};

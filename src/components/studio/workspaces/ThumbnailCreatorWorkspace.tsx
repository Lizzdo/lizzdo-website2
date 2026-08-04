import React, { useState } from "react";
import { useStudio } from "../../../context/StudioContext";
import {
  Sparkles,
  Zap,
  Type,
  Image as ImageIcon,
  Send,
  Eye,
  Flame,
  Star,
  Layers,
  LayoutTemplate,
} from "lucide-react";

export function ThumbnailCreatorWorkspace() {
  const { createProject } = useStudio();

  const [title, setTitle] = useState("I TESTED 22 AI CREATIVE TOOLS!");
  const [badgeText, setBadgeText] = useState("INSANE RESULTS!");
  const [accentColor, setAccentColor] = useState("#00f5ff");
  const [preset, setPreset] = useState("youtube-gaming");

  const handleOpenInDesigner = () => {
    createProject(`${title} Thumbnail`, "designer", {
      width: 1280,
      height: 720,
      preset: "youtube-thumb",
      elements: [
        {
          id: `elem-title-${Date.now()}`,
          type: "text",
          name: "Thumbnail Title",
          x: 60,
          y: 200,
          width: 800,
          height: 200,
          rotation: 0,
          opacity: 1,
          text: title,
          fontSize: 72,
          fontFamily: "Orbitron",
          fill: "#ffffff",
        },
      ],
    });
  };

  return (
    <div className="flex-1 bg-black text-white flex flex-col lg:flex-row overflow-hidden font-sans select-none">
      {/* LEFT CONTROLS PANEL */}
      <div className="w-full lg:w-96 bg-neutral-950 border-r border-white/10 flex flex-col p-4 space-y-5 overflow-y-auto custom-scrollbar shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
          <h2 className="font-display font-bold text-sm tracking-wider uppercase text-white">
            YouTube & Twitch Thumbnail Creator
          </h2>
          <span className="ml-auto px-2 py-0.5 rounded bg-amber-400/20 border border-amber-400/40 text-amber-400 text-[9px] font-mono font-bold">
            HIGH CTR
          </span>
        </div>

        {/* THUMBNAIL TITLE INPUT */}
        <div className="space-y-3 font-mono text-xs">
          <div className="space-y-1.5">
            <label className="text-gray-400 uppercase">Thumbnail Clickbait Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-white font-bold focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-gray-400 uppercase">Badge Overlay Tag</label>
            <input
              type="text"
              value={badgeText}
              onChange={(e) => setBadgeText(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-amber-400 font-bold focus:border-amber-400 focus:outline-none"
            />
          </div>
        </div>

        {/* PRESET LAYOUT GALLERY */}
        <div className="space-y-2">
          <label className="text-xs font-mono font-bold text-gray-300 uppercase">Cover Style Presets</label>
          <div className="grid grid-cols-2 gap-2 font-mono text-xs">
            {[
              { id: "youtube-tech", name: "Tech Review" },
              { id: "youtube-gaming", name: "Gaming & Esports" },
              { id: "youtube-vlog", name: "Vlog & Story" },
              { id: "youtube-podcast", name: "Podcast / Interview" },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPreset(p.id)}
                className={`p-2 rounded-xl border text-left transition-all ${
                  preset === p.id
                    ? "bg-amber-400/20 border-amber-400 text-white font-bold"
                    : "bg-neutral-900 border-white/5 text-gray-400 hover:text-white"
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenInDesigner}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-red-500 text-white font-display font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(245,158,11,0.6)] transition-all flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" /> Open Full Canvas Editor
        </button>
      </div>

      {/* CENTER STAGE PREVIEW */}
      <div className="flex-1 bg-neutral-900 flex flex-col overflow-hidden relative">
        <div className="h-12 bg-neutral-950 border-b border-white/10 px-4 flex items-center justify-between font-mono text-xs text-gray-300">
          <span>YouTube Thumbnail Safe Margin (1280 x 720 px)</span>
          <span className="text-emerald-400 font-bold">16:9 Standard HD</span>
        </div>

        <div className="flex-1 p-8 flex items-center justify-center relative overflow-hidden">
          <div className="relative w-full max-w-2xl aspect-video rounded-2xl bg-black border border-white/20 shadow-2xl overflow-hidden flex flex-col justify-between p-8">
            <img
              src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80"
              alt="Thumbnail background"
              className="absolute inset-0 w-full h-full object-cover opacity-60"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />

            {/* BADGE */}
            <div className="relative z-10 self-start px-3 py-1 rounded-xl bg-amber-400 text-black font-display font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>{badgeText || "NEW VIDEO"}</span>
            </div>

            {/* HIGH-CTR TITLE OVERLAY */}
            <div className="relative z-10 max-w-md space-y-2">
              <h1 className="font-display font-black text-3xl md:text-4xl text-white uppercase tracking-wider leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                {title || "YOUR THUMBNAIL TITLE"}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

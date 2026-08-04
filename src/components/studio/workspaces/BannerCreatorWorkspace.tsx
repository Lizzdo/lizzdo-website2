import React, { useState } from "react";
import { useStudio } from "../../../context/StudioContext";
import { Image as ImageIcon, Send, Sparkles } from "lucide-react";

export function BannerCreatorWorkspace() {
  const { createProject } = useStudio();
  const [headline, setHeadline] = useState("BUILD THE FUTURE WITH LIZZDO");
  const [platform, setPlatform] = useState("linkedin");

  const handleOpenInDesigner = () => {
    createProject(`${headline} Banner`, "designer", {
      width: 1584,
      height: 396,
      preset: "linkedin-banner",
      elements: [
        {
          id: `elem-banner-${Date.now()}`,
          type: "text",
          name: "Headline",
          x: 100,
          y: 120,
          width: 1200,
          height: 100,
          rotation: 0,
          opacity: 1,
          text: headline,
          fontSize: 48,
          fontFamily: "Orbitron",
          fill: "#00f5ff",
        },
      ],
    });
  };

  return (
    <div className="flex-1 bg-black text-white flex flex-col lg:flex-row overflow-hidden font-sans select-none">
      <div className="w-full lg:w-96 bg-neutral-950 border-r border-white/10 flex flex-col p-4 space-y-5 shrink-0 overflow-y-auto custom-scrollbar">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-neon-cyan animate-pulse" />
          <h2 className="font-display font-bold text-sm tracking-wider uppercase text-white">
            Banner Creator
          </h2>
        </div>

        <div className="space-y-3 font-mono text-xs">
          <div className="space-y-1.5">
            <label className="text-gray-400 uppercase">Banner Headline</label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-white font-bold focus:border-neon-cyan focus:outline-none"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenInDesigner}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-display font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(0,245,255,0.6)] transition-all flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" /> Open Banner in Designer
        </button>
      </div>

      <div className="flex-1 bg-neutral-900 flex flex-col items-center justify-center p-8 relative overflow-hidden">
        <div className="w-full max-w-3xl aspect-[1584/396] rounded-2xl bg-black border border-white/20 shadow-2xl relative overflow-hidden flex items-center p-8">
          <img
            src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80"
            alt="Banner background"
            className="absolute inset-0 w-full h-full object-cover opacity-50"
            referrerPolicy="no-referrer"
          />
          <h1 className="relative z-10 font-display font-black text-2xl md:text-3xl text-neon-cyan uppercase tracking-wider">
            {headline}
          </h1>
        </div>
      </div>
    </div>
  );
}

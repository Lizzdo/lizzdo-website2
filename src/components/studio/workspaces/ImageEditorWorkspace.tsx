import React, { useState } from "react";
import { useStudio } from "../../../context/StudioContext";
import {
  SlidersHorizontal,
  Crop,
  Sun,
  Contrast,
  Sparkles,
  Download,
  Send,
  RotateCw,
  Wand2,
} from "lucide-react";

export function ImageEditorWorkspace() {
  const { createProject } = useStudio();
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturate, setSaturate] = useState(100);
  const [blur, setBlur] = useState(0);

  const activeImg =
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80";

  const handleSendToDesigner = () => {
    createProject("Edited Photo Project", "designer", {
      width: 1200,
      height: 800,
      elements: [
        {
          id: `elem-photo-${Date.now()}`,
          type: "image",
          name: "Retouched Photo",
          x: 0,
          y: 0,
          width: 1200,
          height: 800,
          rotation: 0,
          opacity: 1,
          src: activeImg,
        },
      ],
    });
  };

  return (
    <div className="flex-1 bg-black text-white flex flex-col lg:flex-row overflow-hidden font-sans select-none">
      <div className="w-full lg:w-80 bg-neutral-950 border-r border-white/10 flex flex-col p-4 space-y-5 overflow-y-auto custom-scrollbar shrink-0">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-neon-cyan animate-pulse" />
          <h2 className="font-display font-bold text-sm tracking-wider uppercase text-white">
            Photo Retouch & Editor
          </h2>
        </div>

        <div className="space-y-4 font-mono text-xs">
          <div className="space-y-1">
            <div className="flex justify-between text-gray-400">
              <span>Brightness</span>
              <span>{brightness}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="150"
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="w-full accent-neon-cyan"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-gray-400">
              <span>Contrast</span>
              <span>{contrast}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="150"
              value={contrast}
              onChange={(e) => setContrast(Number(e.target.value))}
              className="w-full accent-neon-cyan"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-gray-400">
              <span>Saturation</span>
              <span>{saturate}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              value={saturate}
              onChange={(e) => setSaturate(Number(e.target.value))}
              className="w-full accent-neon-cyan"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleSendToDesigner}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-display font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(0,245,255,0.6)] transition-all flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" /> Open in Designer
        </button>
      </div>

      <div className="flex-1 bg-neutral-900 flex items-center justify-center p-8 relative overflow-hidden">
        <div className="max-h-full max-w-full rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
          <img
            src={activeImg}
            alt="Retouched"
            style={{
              filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) blur(${blur}px)`,
            }}
            className="max-h-[70vh] max-w-full object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </div>
  );
}

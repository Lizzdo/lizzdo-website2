import React, { useState } from "react";
import { useStudio } from "../../../context/StudioContext";
import { Monitor, Smartphone, Shirt, Box, Send } from "lucide-react";

export function MockupGeneratorWorkspace() {
  const { createProject } = useStudio();
  const [device, setDevice] = useState<"macbook" | "iphone" | "tshirt">("macbook");

  const handleOpenInDesigner = () => {
    createProject(`${device.toUpperCase()} Mockup Design`, "designer", {
      width: 1200,
      height: 900,
      elements: [],
    });
  };

  return (
    <div className="flex-1 bg-black text-white flex flex-col lg:flex-row overflow-hidden font-sans select-none">
      <div className="w-full lg:w-80 bg-neutral-950 border-r border-white/10 flex flex-col p-4 space-y-5 shrink-0 overflow-y-auto custom-scrollbar">
        <div className="flex items-center gap-2">
          <Monitor className="w-5 h-5 text-neon-cyan animate-pulse" />
          <h2 className="font-display font-bold text-sm tracking-wider uppercase text-white">
            3D Mockup Generator
          </h2>
        </div>

        <div className="space-y-2 font-mono text-xs">
          <label className="text-gray-400 uppercase">3D Device / Apparel Frame</label>
          <div className="grid grid-cols-1 gap-2">
            {[
              { id: "macbook", label: "MacBook Pro Studio", icon: Monitor },
              { id: "iphone", label: "iPhone 15 Pro Max", icon: Smartphone },
              { id: "tshirt", label: "Cyberpunk T-Shirt Apparel", icon: Shirt },
            ].map((m) => {
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setDevice(m.id as any)}
                  className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                    device === m.id
                      ? "bg-neon-cyan/20 border-neon-cyan text-white font-bold"
                      : "bg-neutral-900 border-white/5 text-gray-400 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4 text-neon-cyan" />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenInDesigner}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-display font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(0,245,255,0.6)] transition-all flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" /> Open Mockup in Designer
        </button>
      </div>

      <div className="flex-1 bg-neutral-900 flex items-center justify-center p-8 relative overflow-hidden">
        <div className="w-full max-w-xl aspect-square rounded-3xl bg-black border border-white/20 shadow-2xl p-8 flex flex-col items-center justify-center relative overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80"
            alt="Device Mockup"
            className="max-h-full max-w-full object-contain rounded-2xl"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-6 font-display font-bold text-neon-cyan text-sm uppercase">
            3D {device.toUpperCase()} SURFACE ACTIVE
          </div>
        </div>
      </div>
    </div>
  );
}

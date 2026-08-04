import React, { useState } from "react";
import { Settings, Check, Key, Palette, Sliders } from "lucide-react";

export function SettingsWorkspace() {
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [autoSave, setAutoSave] = useState(true);

  return (
    <div className="flex-1 bg-black text-white p-6 overflow-y-auto custom-scrollbar font-sans select-none space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-neutral-900 border border-white/10 shadow-2xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-xs font-mono">
            <Settings className="w-3.5 h-3.5" />
            <span>Workspace Preferences</span>
          </div>
          <h1 className="font-display font-black text-2xl md:text-3xl tracking-wider text-white uppercase">
            Studio System Settings
          </h1>
          <p className="text-xs text-gray-400 font-mono">
            Configure export quality defaults, auto-save interval, theme settings, and API integrations.
          </p>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-neutral-900 border border-white/10 space-y-4 font-mono text-xs max-w-2xl">
        <div className="space-y-2">
          <label className="text-gray-400 uppercase font-bold flex items-center gap-2">
            <Key className="w-4 h-4 text-neon-cyan" /> Gemini API Integration Key
          </label>
          <input
            type="password"
            placeholder="Enter Gemini API Key..."
            value={geminiApiKey}
            onChange={(e) => setGeminiApiKey(e.target.value)}
            className="w-full bg-black border border-white/15 rounded-xl px-3 py-2 text-white focus:border-neon-cyan focus:outline-none"
          />
          <p className="text-[10px] text-gray-500">
            Enables high-resolution AI Image generation and copywriting assistant.
          </p>
        </div>

        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
          <div>
            <span className="font-bold text-white block">Auto-Save Projects</span>
            <span className="text-[10px] text-gray-500">
              Automatically persist all design changes to browser storage every 5 seconds.
            </span>
          </div>
          <button
            onClick={() => setAutoSave(!autoSave)}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              autoSave ? "bg-neon-cyan" : "bg-neutral-800"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-black absolute top-0.5 transition-transform ${
                autoSave ? "right-0.5" : "left-0.5"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

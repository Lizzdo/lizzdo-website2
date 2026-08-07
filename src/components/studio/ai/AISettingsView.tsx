import React, { useState } from "react";
import { AISettings } from "../../../types/ai";
import { useStudio } from "../../../context/StudioContext";
import { Sliders, Shield, Zap, Clock, Key, Check, Save } from "lucide-react";

interface AISettingsViewProps {
  settings: AISettings;
  onUpdateSettings: (newSettings: Partial<AISettings>) => void;
}

export function AISettingsView({ settings, onUpdateSettings }: AISettingsViewProps) {
  const { addNotification } = useStudio();
  const [localSettings, setLocalSettings] = useState<AISettings>({ ...settings });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onUpdateSettings(localSettings);
    setSaved(true);
    addNotification("AI Settings Updated", "Saved global model parameters & engine preferences.", "success", "ai");
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex-1 bg-neutral-950 border border-white/10 rounded-2xl p-6 overflow-y-auto custom-scrollbar font-mono text-xs max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-neon-cyan">
            <Sliders className="w-5 h-5" />
            <h2 className="font-bold text-white text-sm uppercase">Global AI Engine & Model Settings</h2>
          </div>
          <p className="text-gray-400 font-sans text-xs mt-1">
            Configure default models, concurrency limits, caching rules, and brand consistency filters.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-neon-cyan text-black font-bold uppercase hover:bg-neon-cyan/80 transition-all flex items-center gap-2"
        >
          {saved ? <Check className="w-4 h-4 text-emerald-950" /> : <Save className="w-4 h-4" />}
          <span>{saved ? "Saved Settings" : "Save Changes"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
        {/* MODEL SELECTION */}
        <div className="p-4 rounded-2xl bg-neutral-900 border border-white/10 space-y-3">
          <label className="text-white font-bold uppercase text-xs font-mono block">
            Default AI Model
          </label>
          <select
            value={localSettings.defaultModel}
            onChange={(e) => setLocalSettings({ ...localSettings, defaultModel: e.target.value })}
            className="w-full bg-black border border-white/15 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-neon-cyan text-xs"
          >
            <option value="gemini-3.6-flash">Gemini 3.6 Flash (Fast & Intelligent)</option>
            <option value="gemini-3.1-flash-image">Gemini 3.1 Flash Image (High Res Visuals)</option>
            <option value="gemini-3.1-flash-lite-image">Gemini 3.1 Flash Lite Image (Speed Optimized)</option>
            <option value="nano-banana">Nano Banana Local Engine</option>
          </select>
          <p className="text-gray-400 text-[11px]">
            Selected engine handles all text-to-image and multimodal tasks.
          </p>
        </div>

        {/* QUALITY PRESET */}
        <div className="p-4 rounded-2xl bg-neutral-900 border border-white/10 space-y-3">
          <label className="text-white font-bold uppercase text-xs font-mono block">
            Quality Preset
          </label>
          <select
            value={localSettings.qualityPreset}
            onChange={(e) => setLocalSettings({ ...localSettings, qualityPreset: e.target.value as any })}
            className="w-full bg-black border border-white/15 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-neon-cyan text-xs"
          >
            <option value="Standard">Standard (Fast)</option>
            <option value="High">High Resolution</option>
            <option value="Ultra 8K">Ultra 8K Octane Render</option>
            <option value="Photorealistic">Photorealistic Studio HD</option>
          </select>
        </div>

        {/* CONCURRENCY & QUEUE */}
        <div className="p-4 rounded-2xl bg-neutral-900 border border-white/10 space-y-3">
          <label className="text-white font-bold uppercase text-xs font-mono block">
            Max Queue Concurrency
          </label>
          <input
            type="number"
            min={1}
            max={8}
            value={localSettings.maxQueueConcurrency}
            onChange={(e) => setLocalSettings({ ...localSettings, maxQueueConcurrency: parseInt(e.target.value) || 2 })}
            className="w-full bg-black border border-white/15 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-neon-cyan text-xs"
          />
          <p className="text-gray-400 text-[11px]">
            Controls parallel background job execution.
          </p>
        </div>

        {/* TIMEOUT DURATION */}
        <div className="p-4 rounded-2xl bg-neutral-900 border border-white/10 space-y-3">
          <label className="text-white font-bold uppercase text-xs font-mono block">
            Request Timeout (Seconds)
          </label>
          <input
            type="number"
            min={10}
            max={120}
            value={localSettings.timeoutSeconds}
            onChange={(e) => setLocalSettings({ ...localSettings, timeoutSeconds: parseInt(e.target.value) || 30 })}
            className="w-full bg-black border border-white/15 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-neon-cyan text-xs"
          />
        </div>

        {/* TOGGLES */}
        <div className="p-4 rounded-2xl bg-neutral-900 border border-white/10 space-y-4 md:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold text-white text-xs block font-mono">Enable Cache Engine</span>
              <span className="text-gray-400 text-[11px]">Instant re-runs for identical prompts and seeds.</span>
            </div>
            <input
              type="checkbox"
              checked={localSettings.enableCaching}
              onChange={(e) => setLocalSettings({ ...localSettings, enableCaching: e.target.checked })}
              className="w-5 h-5 accent-neon-cyan cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between border-t border-white/5 pt-3">
            <div>
              <span className="font-bold text-white text-xs block font-mono">Brand Consistency Enforcement</span>
              <span className="text-gray-400 text-[11px]">Inject active Brand Kit colors into prompts automatically.</span>
            </div>
            <input
              type="checkbox"
              checked={localSettings.brandConsistencyEnabled}
              onChange={(e) => setLocalSettings({ ...localSettings, brandConsistencyEnabled: e.target.checked })}
              className="w-5 h-5 accent-neon-cyan cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

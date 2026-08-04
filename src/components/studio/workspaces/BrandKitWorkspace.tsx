import React, { useState } from "react";
import { useStudio } from "../../../context/StudioContext";
import {
  BookmarkCheck,
  Plus,
  Trash2,
  Copy,
  Download,
  Palette,
  Type,
  Shield,
  Check,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export function BrandKitWorkspace() {
  const { brandKit, updateBrandKit } = useStudio();
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 1500);
  };

  return (
    <div className="flex-1 bg-black text-white p-6 overflow-y-auto custom-scrollbar font-sans select-none space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-neutral-900 border border-white/10 shadow-2xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-xs font-mono">
            <BookmarkCheck className="w-3.5 h-3.5 text-neon-cyan" />
            <span>Shared Across All 22 Studio Tools</span>
          </div>
          <h1 className="font-display font-black text-2xl md:text-3xl tracking-wider text-white uppercase">
            Brand Kit & Style Guidelines
          </h1>
          <p className="text-xs text-gray-400 font-mono">
            Centralized color palettes, typography pairings, and brand logos used automatically by the Designer, Banner, and AI tools.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            alert("Brand Kit rules saved and synced across all Studio tools!");
          }}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-display font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(0,245,255,0.6)] transition-all flex items-center gap-2 shrink-0"
        >
          <CheckCircle2 className="w-4 h-4" /> Save Brand Kit
        </button>
      </div>

      {/* BRAND NAME & TAGLINE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        <div className="p-5 rounded-2xl bg-neutral-900 border border-white/10 space-y-2">
          <label className="text-gray-400 uppercase">Brand / Company Name</label>
          <input
            type="text"
            value={brandKit.brandName}
            onChange={(e) => updateBrandKit({ brandName: e.target.value })}
            className="w-full bg-black border border-white/15 rounded-xl px-3 py-2 text-white font-bold text-sm focus:border-neon-cyan focus:outline-none"
          />
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900 border border-white/10 space-y-2">
          <label className="text-gray-400 uppercase">Brand Tagline</label>
          <input
            type="text"
            value={brandKit.tagline}
            onChange={(e) => updateBrandKit({ tagline: e.target.value })}
            className="w-full bg-black border border-white/15 rounded-xl px-3 py-2 text-gray-300 focus:border-neon-cyan focus:outline-none"
          />
        </div>
      </div>

      {/* COLOR PALETTES */}
      <div className="p-6 rounded-3xl bg-neutral-900 border border-white/10 space-y-4">
        <h2 className="font-display font-bold text-sm tracking-wider uppercase text-white flex items-center gap-2">
          <Palette className="w-4 h-4 text-neon-cyan" /> Brand Color Palettes
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: "Primary Cyan", color: brandKit.primaryColor, key: "primaryColor" },
            { label: "Secondary Purple", color: brandKit.secondaryColor, key: "secondaryColor" },
            ...brandKit.accentColors.map((c, i) => ({ label: `Accent ${i + 1}`, color: c, key: `accent-${i}` })),
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-black border border-white/10 space-y-2 group hover:border-neon-cyan/50 transition-all"
            >
              <div
                style={{ backgroundColor: item.color }}
                onClick={() => copyToClipboard(item.color)}
                className="h-16 rounded-xl border border-white/10 cursor-pointer flex items-center justify-center relative shadow-md"
              >
                {copiedColor === item.color ? (
                  <Check className="w-5 h-5 text-black bg-white rounded-full p-1" />
                ) : (
                  <Copy className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
              <div className="font-mono text-[10px]">
                <span className="text-gray-400 block truncate">{item.label}</span>
                <span className="text-white font-bold block mt-0.5">{item.color}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TYPOGRAPHY PAIRINGS */}
      <div className="p-6 rounded-3xl bg-neutral-900 border border-white/10 space-y-4">
        <h2 className="font-display font-bold text-sm tracking-wider uppercase text-white flex items-center gap-2">
          <Type className="w-4 h-4 text-neon-purple" /> Typography Pairings
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <div className="p-4 rounded-2xl bg-black border border-white/10 space-y-2">
            <span className="text-gray-500 uppercase">Headings Font</span>
            <div className="font-display text-2xl font-black text-neon-cyan uppercase">
              {brandKit.headingFont}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black border border-white/10 space-y-2">
            <span className="text-gray-500 uppercase">Body & Subtitles Font</span>
            <div className="font-mono text-lg font-bold text-white">
              {brandKit.bodyFont}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

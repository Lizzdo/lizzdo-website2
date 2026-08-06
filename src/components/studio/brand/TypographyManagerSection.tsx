import React, { useState, useRef } from "react";
import { useStudio } from "../../../context/StudioContext";
import { TypographyRoleName, TypographyRole } from "../../../types/brandKit";
import {
  Type,
  Upload,
  Sparkles,
  Sliders,
  Check,
  Plus,
  Trash2,
  CheckCircle2,
} from "lucide-react";

const GOOGLE_FONTS_CATALOG = [
  "Orbitron",
  "Rajdhani",
  "Plus Jakarta Sans",
  "Playfair Display",
  "Inter",
  "Space Grotesk",
  "Montserrat",
  "Poppins",
  "Oswald",
  "Fira Code",
  "Cinzel",
  "Syne",
  "Outfit",
  "Cabinet Grotesk",
  "Roboto",
  "Open Sans",
  "Lato",
];

const ROLES: { name: TypographyRoleName; label: string; desc: string }[] = [
  { name: "display", label: "Display / Hero Banner", desc: "Oversized hero headlines and impact banners" },
  { name: "heading", label: "Headings & Section Titles", desc: "Main titles across templates and cards" },
  { name: "body", label: "Body Text & Paragraphs", desc: "Subtitles, descriptions, and long-form articles" },
  { name: "button", label: "Buttons & CTAs", desc: "Action buttons, navigation pills, and tags" },
  { name: "caption", label: "Captions & Code Labels", desc: "Footers, metadata tags, and code blocks" },
];

export const TypographyManagerSection: React.FC = () => {
  const { activeBrandKit, updateActiveBrandKit, addNotification } = useStudio();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeRole, setActiveRole] = useState<TypographyRoleName>("heading");
  const [customFonts, setCustomFonts] = useState<string[]>(["Custom Brand Font"]);

  const currentRoleConfig = activeBrandKit.typography[activeRole];

  const handleUpdateRole = (updatedFields: Partial<TypographyRole>) => {
    updateActiveBrandKit({
      typography: {
        ...activeBrandKit.typography,
        [activeRole]: {
          ...currentRoleConfig,
          ...updatedFields,
        },
      },
    });
  };

  const handleCustomFontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const fontName = file.name.replace(/\.[^/.]+$/, "");

    // Inject @font-face style dynamically
    const reader = new FileReader();
    reader.onload = (evt) => {
      const fontUrl = evt.target?.result as string;
      const newStyle = document.createElement("style");
      newStyle.appendChild(
        document.createTextNode(
          `@font-face { font-family: '${fontName}'; src: url('${fontUrl}'); }`
        )
      );
      document.head.appendChild(newStyle);

      setCustomFonts((prev) => Array.from(new Set([...prev, fontName])));
      handleUpdateRole({ fontFamily: fontName, isGoogleFont: false });
      addNotification("Custom Font Uploaded", `Added and applied custom font "${fontName}"`, "success");
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="p-6 rounded-3xl bg-neutral-900 border border-white/10 space-y-6">
      {/* Hidden File Input for Custom Font Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".ttf,.otf,.woff,.woff2"
        className="hidden"
        onChange={handleCustomFontUpload}
      />

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="font-display font-bold text-base tracking-wider uppercase text-white flex items-center gap-2">
            <Type className="w-5 h-5 text-neon-purple" /> Typography System & Font Specimen Manager
          </h2>
          <p className="text-xs text-gray-400 font-mono mt-0.5">
            Configure Display, Heading, Body, Button, and Caption roles with Google Fonts or uploaded font files.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 rounded-xl bg-neon-purple/10 hover:bg-neon-purple/20 text-neon-purple border border-neon-purple/30 text-xs font-mono font-bold flex items-center gap-2 transition-all shrink-0"
        >
          <Upload className="w-3.5 h-3.5" /> Upload Custom Font (.ttf/.otf/.woff)
        </button>
      </div>

      {/* ROLE TAB SWITCHER */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-xs">
        {ROLES.map(({ name, label }) => {
          const config = activeBrandKit.typography[name];
          const isActive = activeRole === name;

          return (
            <button
              key={name}
              type="button"
              onClick={() => setActiveRole(name)}
              className={`p-3 rounded-2xl border text-left transition-all space-y-1 ${
                isActive
                  ? "bg-black text-white border-neon-cyan shadow-[0_0_15px_rgba(0,245,255,0.2)]"
                  : "bg-black/60 text-gray-400 border-white/10 hover:border-white/20 hover:text-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-gray-500">{name}</span>
                {isActive && <Check className="w-3.5 h-3.5 text-neon-cyan" />}
              </div>
              <div className="font-bold text-xs truncate text-white">{config.fontFamily}</div>
            </button>
          );
        })}
      </div>

      {/* MAIN CONFIG & SPECIMEN PREVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT CONFIGURATOR PANEL (5 COLS) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-black border border-white/10 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-bold text-white uppercase flex items-center gap-2">
              <Sliders className="w-4 h-4 text-neon-cyan" /> Edit {currentRoleConfig.label}
            </span>
            <span className="text-[10px] text-gray-500">Role: {activeRole}</span>
          </div>

          {/* FONT FAMILY SELECTOR */}
          <div className="space-y-1.5">
            <label className="text-gray-400 uppercase text-[10px]">Font Family</label>
            <select
              value={currentRoleConfig.fontFamily}
              onChange={(e) => handleUpdateRole({ fontFamily: e.target.value })}
              className="w-full bg-neutral-900 border border-white/15 rounded-xl px-3 py-2 text-white font-bold focus:border-neon-cyan focus:outline-none"
            >
              <optgroup label="Google Fonts Library">
                {GOOGLE_FONTS_CATALOG.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </optgroup>
              {customFonts.length > 0 && (
                <optgroup label="Uploaded Custom Fonts">
                  {customFonts.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>

          {/* FONT SIZE & WEIGHT */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-gray-400 uppercase text-[10px]">Font Size ({currentRoleConfig.fontSize}px)</label>
              <input
                type="range"
                min={10}
                max={96}
                value={currentRoleConfig.fontSize}
                onChange={(e) => handleUpdateRole({ fontSize: Number(e.target.value) })}
                className="w-full accent-neon-cyan"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-400 uppercase text-[10px]">Weight ({currentRoleConfig.fontWeight})</label>
              <select
                value={currentRoleConfig.fontWeight}
                onChange={(e) => handleUpdateRole({ fontWeight: Number(e.target.value) })}
                className="w-full bg-neutral-900 border border-white/15 rounded-xl px-2 py-1.5 text-white focus:outline-none"
              >
                <option value={300}>300 - Light</option>
                <option value={400}>400 - Regular</option>
                <option value={500}>500 - Medium</option>
                <option value={600}>600 - SemiBold</option>
                <option value={700}>700 - Bold</option>
                <option value={900}>900 - Black</option>
              </select>
            </div>
          </div>

          {/* LINE HEIGHT & LETTER SPACING */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-gray-400 uppercase text-[10px]">Line Height ({currentRoleConfig.lineHeight})</label>
              <input
                type="range"
                min={0.9}
                max={2.2}
                step={0.1}
                value={currentRoleConfig.lineHeight}
                onChange={(e) => handleUpdateRole({ lineHeight: Number(e.target.value) })}
                className="w-full accent-neon-cyan"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-400 uppercase text-[10px]">Letter Spacing</label>
              <select
                value={currentRoleConfig.letterSpacing}
                onChange={(e) => handleUpdateRole({ letterSpacing: e.target.value })}
                className="w-full bg-neutral-900 border border-white/15 rounded-xl px-2 py-1.5 text-white focus:outline-none"
              >
                <option value="-0.03em">-0.03em Tight</option>
                <option value="0em">0em Normal</option>
                <option value="0.05em">0.05em Wide</option>
                <option value="0.1em">0.1em Spaced</option>
                <option value="0.2em">0.2em Wider</option>
              </select>
            </div>
          </div>

          {/* TEXT TRANSFORM */}
          <div className="space-y-1.5">
            <label className="text-gray-400 uppercase text-[10px]">Text Transform</label>
            <div className="grid grid-cols-4 gap-2 font-mono text-[10px]">
              {(["none", "uppercase", "lowercase", "capitalize"] as const).map((tt) => (
                <button
                  key={tt}
                  type="button"
                  onClick={() => handleUpdateRole({ textTransform: tt })}
                  className={`py-1.5 rounded-lg border capitalize ${
                    currentRoleConfig.textTransform === tt
                      ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan font-bold"
                      : "bg-neutral-900 border-white/10 text-gray-400 hover:text-white"
                  }`}
                >
                  {tt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT LIVE SPECIMEN PREVIEW (7 COLS) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-black border border-white/10 flex flex-col justify-between space-y-6">
          <div className="space-y-2 border-b border-white/10 pb-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-gray-400 uppercase font-bold">
                Live Font Specimen Canvas
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-neon-cyan/10 text-neon-cyan text-[10px] font-mono font-bold border border-neon-cyan/30">
                {currentRoleConfig.fontFamily}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-neutral-950 border border-white/5 space-y-2">
              <div
                style={{
                  fontFamily: currentRoleConfig.fontFamily,
                  fontSize: `${currentRoleConfig.fontSize}px`,
                  fontWeight: currentRoleConfig.fontWeight,
                  lineHeight: currentRoleConfig.lineHeight,
                  letterSpacing: currentRoleConfig.letterSpacing,
                  textTransform: currentRoleConfig.textTransform,
                  color: activeBrandKit.colors.primary,
                }}
                className="transition-all break-words"
              >
                {activeBrandKit.brandName} Creative OS
              </div>

              <div
                style={{
                  fontFamily: currentRoleConfig.fontFamily,
                  fontSize: `${Math.max(14, currentRoleConfig.fontSize * 0.5)}px`,
                  fontWeight: Math.min(600, currentRoleConfig.fontWeight),
                  lineHeight: 1.5,
                  letterSpacing: currentRoleConfig.letterSpacing,
                  color: activeBrandKit.colors.text,
                }}
                className="transition-all text-gray-300"
              >
                {activeBrandKit.tagline} • The quick brown fox jumps over the lazy dog 1234567890
              </div>
            </div>
          </div>

          {/* ALL 5 ROLES SUMMARY CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
            {ROLES.map(({ name, label }) => {
              const cfg = activeBrandKit.typography[name];
              return (
                <div key={name} className="p-3 rounded-xl bg-neutral-900 border border-white/5 space-y-1">
                  <span className="text-[9px] uppercase text-gray-500 font-bold block">{name}</span>
                  <div
                    style={{
                      fontFamily: cfg.fontFamily,
                      fontWeight: cfg.fontWeight,
                      textTransform: cfg.textTransform,
                    }}
                    className="text-white font-bold text-sm truncate"
                  >
                    {cfg.fontFamily} ({cfg.fontSize}px)
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

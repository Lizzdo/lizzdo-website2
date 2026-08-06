import React, { useState } from "react";
import { CanvasElement, DesignState, DesignTemplate } from "../../types/designer";
import { TemplateManager } from "./TemplateManager";
import { useStudio } from "../../context/StudioContext";
import {
  Bookmark,
  Image as ImageIcon,
  Upload,
  Sparkles,
  Layers,
  Palette,
  Type,
  Shield,
  FolderOpen,
  Plus,
  Search,
  Grid,
  Zap,
  Tag,
  MousePointer,
  Square,
  Copy,
  Trash2,
  ChevronUp,
  ChevronDown,
  Wand2,
  FileCheck,
  History,
  Lock,
  Eye,
  EyeOff,
  Sliders,
  Maximize2,
  Check,
  BookmarkCheck,
} from "lucide-react";

interface Props {
  state: DesignState;
  onChangeState: (newState: DesignState) => void;
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onAddElement: (type: any) => void;
  onMultipleImagesUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDuplicateElement: (id: string) => void;
  onDeleteElement: (id: string) => void;
  onMoveLayer: (id: string, direction: "up" | "down") => void;
  onSelectTemplate: (template: DesignTemplate) => void;
}

export function ExpandedLeftSidebar({
  state,
  onChangeState,
  selectedElementId,
  onSelectElement,
  onAddElement,
  onMultipleImagesUpload,
  onDuplicateElement,
  onDeleteElement,
  onMoveLayer,
  onSelectTemplate,
}: Props) {
  const { activeBrandKit, brandKits, setActiveBrandId, applyBrandKitToDesign } = useStudio();

  const [activeTab, setActiveTab] = useState<
    "templates" | "elements" | "assets" | "uploads" | "history" | "plugins" | "brand"
  >("elements");

  const [assetCategory, setAssetCategory] = useState<
    "icons" | "illustrations" | "logos" | "textures" | "patterns" | "gradients" | "colors" | "typography"
  >("icons");

  const [searchAssetQuery, setSearchAssetQuery] = useState("");

  // History action log simulation
  const [historyLogs, setHistoryLogs] = useState<string[]>([
    "Project Opened",
    "Template Loaded: Cyberpunk Poster",
    "Added Text Box Element",
    "Modified Background Gradient",
    "Configured Corner Decorations",
  ]);

  return (
    <div className="w-80 bg-neutral-900 border-r border-white/10 flex flex-col h-full overflow-hidden shrink-0 select-none z-20 text-xs font-sans">
      {/* SIDEBAR TABS HEADER */}
      <div className="grid grid-cols-7 gap-1 p-1 bg-black/60 border-b border-white/10 text-[9px] font-mono shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab("elements")}
          className={`py-1.5 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all ${
            activeTab === "elements"
              ? "bg-neon-cyan/20 border border-neon-cyan/50 text-neon-cyan font-bold"
              : "text-gray-400 hover:text-white"
          }`}
          title="Add Elements"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Insert</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("brand")}
          className={`py-1.5 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all ${
            activeTab === "brand"
              ? "bg-neon-cyan/20 border border-neon-cyan/50 text-neon-cyan font-bold"
              : "text-gray-400 hover:text-white"
          }`}
          title="Brand Kit"
        >
          <BookmarkCheck className="w-3.5 h-3.5" />
          <span>Brand</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("templates")}
          className={`py-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
            activeTab === "templates"
              ? "bg-neon-pink/20 border border-neon-pink/50 text-neon-pink font-bold"
              : "text-gray-400 hover:text-white"
          }`}
          title="Templates Library"
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Presets</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("assets")}
          className={`py-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
            activeTab === "assets"
              ? "bg-neon-purple/20 border border-neon-purple/50 text-neon-purple font-bold"
              : "text-gray-400 hover:text-white"
          }`}
          title="Assets & Stock"
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Assets</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("uploads")}
          className={`py-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
            activeTab === "uploads"
              ? "bg-amber-400/20 border border-amber-400/50 text-amber-300 font-bold"
              : "text-gray-400 hover:text-white"
          }`}
          title="Upload Images"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("history")}
          className={`py-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
            activeTab === "history"
              ? "bg-emerald-400/20 border border-emerald-400/50 text-emerald-300 font-bold"
              : "text-gray-400 hover:text-white"
          }`}
          title="History Timeline"
        >
          <History className="w-3.5 h-3.5" />
          <span>History</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("plugins")}
          className={`py-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
            activeTab === "plugins"
              ? "bg-blue-400/20 border border-blue-400/50 text-blue-300 font-bold"
              : "text-gray-400 hover:text-white"
          }`}
          title="AI Plugins"
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>AI & Plugins</span>
        </button>
      </div>

      {/* TAB CONTENT AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {/* TAB 1: ELEMENTS & QUICK ADD */}
        {activeTab === "elements" && (
          <div className="space-y-4">
            <h3 className="font-display font-bold text-white text-xs tracking-wider uppercase flex items-center gap-2">
              <Plus className="w-4 h-4 text-neon-cyan" /> Add Design Objects
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onAddElement("text")}
                className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-neon-cyan/50 hover:bg-neon-cyan/10 text-gray-300 hover:text-white transition-all text-left flex items-center gap-2.5 text-xs font-mono group"
              >
                <Type className="w-4 h-4 text-neon-cyan group-hover:scale-110 transition-transform" />
                <span>Text Box</span>
              </button>

              <button
                type="button"
                onClick={() => onAddElement("badge")}
                className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-neon-purple/50 hover:bg-neon-purple/10 text-gray-300 hover:text-white transition-all text-left flex items-center gap-2.5 text-xs font-mono group"
              >
                <Tag className="w-4 h-4 text-neon-purple group-hover:scale-110 transition-transform" />
                <span>Badge Tag</span>
              </button>

              <button
                type="button"
                onClick={() => onAddElement("button")}
                className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-400/50 hover:bg-emerald-400/10 text-gray-300 hover:text-white transition-all text-left flex items-center gap-2.5 text-xs font-mono group"
              >
                <MousePointer className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span>CTA Button</span>
              </button>

              <button
                type="button"
                onClick={() => onAddElement("logo")}
                className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/50 hover:bg-amber-400/10 text-gray-300 hover:text-white transition-all text-left flex items-center gap-2.5 text-xs font-mono group"
              >
                <Shield className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                <span>Studio Logo</span>
              </button>

              <button
                type="button"
                onClick={() => onAddElement("shape")}
                className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-neon-pink/50 hover:bg-neon-pink/10 text-gray-300 hover:text-white transition-all text-left flex items-center gap-2.5 text-xs font-mono group col-span-2"
              >
                <Square className="w-4 h-4 text-neon-pink group-hover:scale-110 transition-transform" />
                <span>Glass Container / Divider</span>
              </button>
            </div>

            {/* BATCH IMAGE UPLOADER */}
            <div className="pt-3 border-t border-white/10 space-y-2">
              <label className="font-display font-bold text-white text-xs tracking-wider uppercase flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-neon-pink" /> Batch Photo Canvas Loader
              </label>
              <p className="text-[11px] text-gray-400 leading-tight">
                Import one or multiple photos to render on canvas as independent layered assets.
              </p>

              <label className="p-4 rounded-2xl border-2 border-dashed border-white/20 hover:border-neon-pink/60 bg-black/40 hover:bg-black/60 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer text-center group">
                <Upload className="w-5 h-5 text-neon-pink group-hover:scale-110 transition-transform" />
                <span className="text-xs font-mono text-gray-300 font-bold">Select Local Photos</span>
                <span className="text-[10px] text-gray-500 font-mono">PNG, JPG, WebP, SVG supported</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={onMultipleImagesUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}

        {/* TAB 2: TEMPLATES MANAGER */}
        {activeTab === "templates" && (
          <TemplateManager
            currentState={state}
            onSelectTemplate={onSelectTemplate}
            onSaveCurrentAsTemplate={(name, category) => {
              onChangeState({ ...state, title: name });
            }}
          />
        )}

        {/* TAB 3: ASSETS & STOCK LIBRARY */}
        {activeTab === "assets" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-white text-xs tracking-wider uppercase">
                Design Assets
              </h3>
            </div>

            {/* Sub-Category Pills */}
            <div className="flex flex-wrap gap-1">
              {(
                [
                  "icons",
                  "illustrations",
                  "logos",
                  "textures",
                  "patterns",
                  "gradients",
                  "colors",
                  "typography",
                ] as const
              ).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setAssetCategory(cat)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-mono capitalize transition-all ${
                    assetCategory === cat
                      ? "bg-neon-purple text-black font-bold"
                      : "bg-white/5 text-gray-400 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Asset Items Grid */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              {assetCategory === "gradients" && (
                <>
                  {[
                    { from: "#00f5ff", to: "#a855f7", name: "Cyber Neon" },
                    { from: "#f43f5e", to: "#f59e0b", name: "Sunset Blaze" },
                    { from: "#10b981", to: "#3b82f6", name: "Emerald Wave" },
                    { from: "#6366f1", to: "#ec4899", name: "Electric Dusk" },
                  ].map((grad, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        onChangeState({
                          ...state,
                          background: {
                            ...state.background,
                            type: "gradient",
                            gradientFrom: grad.from,
                            gradientTo: grad.to,
                          },
                        });
                      }}
                      style={{
                        backgroundImage: `linear-gradient(135deg, ${grad.from}, ${grad.to})`,
                      }}
                      className="h-16 rounded-xl border border-white/20 cursor-pointer hover:scale-105 transition-transform p-2 flex items-end shadow-lg"
                    >
                      <span className="text-[9px] font-mono text-white font-bold bg-black/60 px-1.5 py-0.5 rounded">
                        {grad.name}
                      </span>
                    </div>
                  ))}
                </>
              )}

              {assetCategory === "colors" && (
                <>
                  {[
                    "#00f5ff",
                    "#a855f7",
                    "#f43f5e",
                    "#f59e0b",
                    "#10b981",
                    "#3b82f6",
                    "#ffffff",
                    "#0a0e27",
                  ].map((color, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        onChangeState({
                          ...state,
                          background: {
                            ...state.background,
                            type: "solid",
                            solidColor: color,
                          },
                        });
                      }}
                      style={{ backgroundColor: color }}
                      className="h-12 rounded-xl border border-white/20 cursor-pointer hover:scale-105 transition-transform p-2 flex items-end shadow-lg"
                    >
                      <span className="text-[9px] font-mono text-white font-bold bg-black/60 px-1 rounded">
                        {color}
                      </span>
                    </div>
                  ))}
                </>
              )}

              {assetCategory !== "gradients" && assetCategory !== "colors" && (
                <div className="col-span-2 text-center py-6 text-gray-500 font-mono text-[11px] space-y-2">
                  <Palette className="w-8 h-8 text-neon-purple mx-auto animate-pulse" />
                  <p>Explore {assetCategory.toUpperCase()} presets</p>
                  <p className="text-[10px] text-gray-600">Click any preset to apply directly to canvas!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: UPLOADS */}
        {activeTab === "uploads" && (
          <div className="space-y-4">
            <h3 className="font-display font-bold text-white text-xs tracking-wider uppercase flex items-center gap-2">
              <Upload className="w-4 h-4 text-amber-400" /> Upload Assets
            </h3>

            <label className="p-6 rounded-2xl border-2 border-dashed border-amber-400/40 hover:border-amber-400 bg-black/40 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer text-center">
              <Upload className="w-6 h-6 text-amber-400" />
              <span className="text-xs font-mono text-gray-200 font-bold">Drag & Drop Files Here</span>
              <span className="text-[10px] text-gray-500">or click to browse from disk</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={onMultipleImagesUpload}
                className="hidden"
              />
            </label>
          </div>
        )}

        {/* TAB 5: HISTORY TIMELINE */}
        {activeTab === "history" && (
          <div className="space-y-3">
            <h3 className="font-display font-bold text-white text-xs tracking-wider uppercase flex items-center gap-2">
              <History className="w-4 h-4 text-emerald-400" /> Action History Log
            </h3>
            <div className="space-y-1.5 font-mono text-[10px]">
              {historyLogs.map((log, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-gray-300 hover:border-emerald-400/40 cursor-pointer"
                >
                  <span className="truncate">{log}</span>
                  <span className="text-emerald-400 text-[9px]">Step {idx + 1}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: BRAND KIT INTEGRATION */}
        {activeTab === "brand" && (
          <div className="space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-bold text-white uppercase text-xs flex items-center gap-2">
                <BookmarkCheck className="w-4 h-4 text-neon-cyan" /> Brand Kit
              </span>
              <span className="text-[10px] text-neon-cyan font-bold">
                {activeBrandKit.brandName}
              </span>
            </div>

            {/* BRAND SWITCHER SELECT */}
            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 block uppercase">Switch Active Brand</label>
              <select
                value={activeBrandKit.id}
                onChange={(e) => setActiveBrandId(e.target.value)}
                className="w-full bg-black border border-white/15 rounded-xl p-2 text-white font-bold text-xs"
              >
                {brandKits.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.brandName}
                  </option>
                ))}
              </select>
            </div>

            {/* 1-CLICK APPLY BUTTON */}
            <button
              type="button"
              onClick={() => {
                const updated = applyBrandKitToDesign(state, activeBrandKit);
                onChangeState(updated);
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-display font-bold text-xs uppercase shadow-lg shadow-neon-cyan/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> 1-Click Apply {activeBrandKit.brandName}
            </button>

            {/* PALETTE SWATCHES */}
            <div className="p-3 rounded-2xl bg-black border border-white/10 space-y-2">
              <span className="text-[10px] text-gray-400 font-bold block uppercase">Brand Colors</span>
              <div className="grid grid-cols-5 gap-1.5">
                {[
                  activeBrandKit.colors.primary,
                  activeBrandKit.colors.secondary,
                  activeBrandKit.colors.accent,
                  activeBrandKit.colors.background,
                  activeBrandKit.colors.surface,
                ].map((c, i) => (
                  <div
                    key={i}
                    style={{ backgroundColor: c }}
                    title={c}
                    className="h-8 rounded-lg border border-white/10 shadow-sm cursor-pointer"
                  />
                ))}
              </div>
            </div>

            {/* TYPOGRAPHY PREVIEW */}
            <div className="p-3 rounded-2xl bg-black border border-white/10 space-y-2">
              <span className="text-[10px] text-gray-400 font-bold block uppercase">Brand Typography</span>
              <div className="space-y-1">
                <div className="text-white font-bold text-xs truncate">
                  Heading: {activeBrandKit.typography.heading.fontFamily}
                </div>
                <div className="text-gray-400 text-[10px] truncate">
                  Body: {activeBrandKit.typography.body.fontFamily}
                </div>
              </div>
            </div>

            {/* LOGOS MINI GRID */}
            {activeBrandKit.logoVariants.length > 0 && (
              <div className="p-3 rounded-2xl bg-black border border-white/10 space-y-2">
                <span className="text-[10px] text-gray-400 font-bold block uppercase">Brand Logos</span>
                <div className="grid grid-cols-3 gap-2">
                  {activeBrandKit.logoVariants.slice(0, 3).map((logo) => (
                    <button
                      key={logo.id}
                      type="button"
                      onClick={() => onAddElement("image")}
                      className="h-12 rounded-lg bg-neutral-900 border border-white/10 p-1 flex items-center justify-center group hover:border-neon-cyan"
                      title={`Add ${logo.name} to canvas`}
                    >
                      <img src={logo.url} alt={logo.name} className="max-h-full max-w-full object-contain" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: AI & PLUGINS */}
        {activeTab === "plugins" && (
          <div className="space-y-4">
            <h3 className="font-display font-bold text-white text-xs tracking-wider uppercase flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-blue-400" /> AI Studio Plugins
            </h3>

            <div className="space-y-2">
              <div className="p-3 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">AI Background Remover</span>
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[9px] font-mono">
                    ACTIVE
                  </span>
                </div>
                <p className="text-[10px] text-gray-400">
                  Automatically isolate subject photos and erase messy backgrounds.
                </p>
                <button
                  type="button"
                  className="w-full py-1.5 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-300 font-bold hover:bg-blue-500/30 transition-all text-[10px]"
                >
                  Run Background Eraser
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">Smart Color Harmony</span>
                  <span className="px-2 py-0.5 rounded bg-neon-purple/20 text-neon-purple text-[9px] font-mono">
                    AI
                  </span>
                </div>
                <p className="text-[10px] text-gray-400">
                  Auto-tune text, borders, and backgrounds based on high-contrast color theory.
                </p>
                <button
                  type="button"
                  className="w-full py-1.5 rounded-xl bg-neon-purple/20 border border-neon-purple/40 text-neon-purple font-bold hover:bg-neon-purple/30 transition-all text-[10px]"
                >
                  Auto Harmonize Colors
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

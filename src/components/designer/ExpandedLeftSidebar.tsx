import React, { useState, useEffect } from "react";
import { CanvasElement, DesignState, DesignTemplate } from "../../types/designer";
import { TemplateManager } from "./TemplateManager";
import { useStudio } from "../../context/StudioContext";
import { WatermarkInspector } from "./WatermarkInspector";
import { SidebarTab } from "./LeftToolRail";
import {
  PlusCircle,
  ShieldCheck,
  Package,
  Palette,
  LayoutTemplate,
  Sparkles,
  Upload,
  History,
  Wand2,
  X,
  Type,
  Square,
  Tag,
  MousePointer,
  Shield,
  Grid,
  Zap,
  Box,
  Trash2,
  BookmarkCheck,
  ImageIcon,
  Search,
  Check,
  Sliders,
  Maximize2,
  Layers,
  ArrowRight,
  RefreshCw,
  Copy,
} from "lucide-react";

interface Props {
  activeTab: SidebarTab;
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
  onClose?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export function ExpandedLeftSidebar({
  activeTab,
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
  onClose,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
}: Props) {
  const { activeBrandKit, brandKits, setActiveBrandId, applyBrandKitToDesign } = useStudio();

  // Search & Filters for Assets
  const [assetCategory, setAssetCategory] = useState<
    "all" | "icons" | "cyber" | "badges" | "shapes" | "gradients" | "colors"
  >("all");
  const [searchAssetQuery, setSearchAssetQuery] = useState("");

  // My Objects persistent storage
  const [myObjects, setMyObjects] = useState<
    Array<{ id: string; name: string; type: string; savedAt: string; element: Partial<CanvasElement> }>
  >([]);

  // Default pre-seeded objects if none exist
  const defaultStarterObjects = [
    {
      id: "starter-obj-1",
      name: "Cyber Verified Badge",
      type: "badge",
      savedAt: "Built-in",
      element: {
        type: "badge" as const,
        name: "Cyber Verified Badge",
        text: "VERIFIED // 01",
        color: "#00f5ff",
        bg: "rgba(0, 245, 255, 0.15)",
        borderColor: "#00f5ff",
        borderRadius: 8,
        borderWidth: 1,
        width: 32,
        height: 6,
        x: 34,
        y: 45,
      },
    },
    {
      id: "starter-obj-2",
      name: "Neon Glow Action Button",
      type: "button",
      savedAt: "Built-in",
      element: {
        type: "button" as const,
        name: "Neon CTA Button",
        text: "EXPLORE NOW ➔",
        color: "#ffffff",
        bg: "linear-gradient(135deg, #ff006e, #7928ca)",
        borderRadius: 12,
        width: 36,
        height: 8,
        x: 32,
        y: 60,
      },
    },
    {
      id: "starter-obj-3",
      name: "Glass UI Metric Card",
      type: "shape",
      savedAt: "Built-in",
      element: {
        type: "shape" as const,
        shapeType: "glow-card" as const,
        name: "Glass UI Card",
        fillColor: "rgba(255, 255, 255, 0.05)",
        strokeColor: "rgba(255, 255, 255, 0.2)",
        strokeWidth: 1,
        borderRadius: 16,
        width: 40,
        height: 25,
        x: 30,
        y: 30,
      },
    },
  ];

  // Load saved objects
  useEffect(() => {
    try {
      const saved = localStorage.getItem("lizzdo_my_reusable_elements");
      if (saved) {
        setMyObjects(JSON.parse(saved));
      } else {
        setMyObjects(defaultStarterObjects);
      }
    } catch (e) {
      setMyObjects(defaultStarterObjects);
    }
  }, []);

  const saveSelectedElementToMyObjects = () => {
    const selected = state.elements.find((el) => el.id === selectedElementId);
    if (!selected) return;

    const newObj = {
      id: `my-obj-${Date.now()}`,
      name: selected.name || "Custom Saved Element",
      type: selected.type,
      savedAt: new Date().toLocaleDateString(),
      element: { ...selected },
    };

    const updated = [newObj, ...myObjects];
    setMyObjects(updated);
    try {
      localStorage.setItem("lizzdo_my_reusable_elements", JSON.stringify(updated));
    } catch (e) {}
  };

  const deleteFromMyObjects = (id: string) => {
    const updated = myObjects.filter((o) => o.id !== id);
    setMyObjects(updated);
    try {
      localStorage.setItem("lizzdo_my_reusable_elements", JSON.stringify(updated));
    } catch (e) {}
  };

  // Preset Social Canvas Dimensions
  const canvasPresets = [
    { name: "Instagram Square", w: 1080, h: 1080, ratio: "1:1", cat: "Instagram" },
    { name: "Instagram Portrait", w: 1080, h: 1350, ratio: "4:5", cat: "Instagram" },
    { name: "Instagram / TikTok Story", w: 1080, h: 1920, ratio: "9:16", cat: "Stories & Reels" },
    { name: "YouTube Thumbnail", w: 1280, h: 720, ratio: "16:9", cat: "YouTube" },
    { name: "YouTube Banner", w: 2560, h: 1440, ratio: "16:9", cat: "YouTube" },
    { name: "Facebook Feed Post", w: 1200, h: 630, ratio: "1.91:1", cat: "Facebook" },
    { name: "X / Twitter Post", w: 1600, h: 900, ratio: "16:9", cat: "X (Twitter)" },
    { name: "X / Twitter Header", w: 1500, h: 500, ratio: "3:1", cat: "X (Twitter)" },
    { name: "LinkedIn Feed Post", w: 1200, h: 1200, ratio: "1:1", cat: "LinkedIn" },
    { name: "LinkedIn Banner", w: 1584, h: 396, ratio: "4:1", cat: "LinkedIn" },
  ];

  // Sample Cutouts for Transparent Testing
  const sampleCutouts = [
    {
      name: "Cyber Character",
      url: "https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80",
      type: "cutout",
    },
    {
      name: "Holographic Sphere",
      url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
      type: "cutout",
    },
    {
      name: "Studio Headset",
      url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
      type: "cutout",
    },
    {
      name: "3D Geometric Mesh",
      url: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop&q=80",
      type: "cutout",
    },
  ];

  // Metadata per tab
  const tabMetadata: Record<
    SidebarTab,
    { title: string; subtitle: string; icon: React.ElementType; color: string }
  > = {
    elements: {
      title: "Insert Elements",
      subtitle: "Typography, Shapes, Badges & Buttons",
      icon: PlusCircle,
      color: "text-neon-cyan",
    },
    watermark: {
      title: "Watermark Studio",
      subtitle: "Opacity, Tiled Matrix, Logos & Presets",
      icon: ShieldCheck,
      color: "text-neon-cyan",
    },
    "my-objects": {
      title: "My Objects Library",
      subtitle: "Reusable Custom Canvas Elements",
      icon: Package,
      color: "text-amber-400",
    },
    brand: {
      title: "Brand Kits & Styles",
      subtitle: "1-Click Brand Harmony & Color Palettes",
      icon: Palette,
      color: "text-neon-cyan",
    },
    presets: {
      title: "Presets & Templates",
      subtitle: "Social Dimensions & Multi-Layer Compositions",
      icon: LayoutTemplate,
      color: "text-neon-pink",
    },
    assets: {
      title: "Asset Library",
      subtitle: "HUD Lines, Badges, Icons & Textures",
      icon: Sparkles,
      color: "text-neon-purple",
    },
    uploads: {
      title: "Upload & Media",
      subtitle: "Photos, SVGs & Transparent Cutouts",
      icon: Upload,
      color: "text-amber-400",
    },
    history: {
      title: "History Timeline",
      subtitle: "Visual Snapshots & State Rollback",
      icon: History,
      color: "text-emerald-400",
    },
    ai: {
      title: "AI Smart Stylizer",
      subtitle: "Background Eraser & Composition Harmony",
      icon: Wand2,
      color: "text-blue-400",
    },
  };

  const currentMeta = tabMetadata[activeTab] || tabMetadata.elements;
  const MetaIcon = currentMeta.icon;

  return (
    <aside
      id="expanded-left-sidebar"
      aria-label={`${currentMeta.title} Panel`}
      className="w-80 bg-neutral-900/95 border-r border-white/10 flex flex-col h-full overflow-hidden shrink-0 select-none z-20 text-xs font-sans shadow-2xl backdrop-blur-md"
    >
      {/* PANEL HEADER WITH CLEAN DISMISS BUTTON */}
      <div className="p-3.5 bg-neutral-950/80 border-b border-white/10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className={`w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center ${currentMeta.color} shadow-inner shrink-0`}>
            <MetaIcon className="w-4 h-4" />
          </div>
          <div className="truncate">
            <h2 className="font-mono text-xs font-bold text-white uppercase tracking-wider truncate">
              {currentMeta.title}
            </h2>
            <p className="text-[10px] text-gray-400 truncate">{currentMeta.subtitle}</p>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
            title="Collapse Panel (Maximize Canvas)"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* PANEL MAIN SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {/* ========================================================================= */}
        {/* 1. INSERT ELEMENTS TAB */}
        {/* ========================================================================= */}
        {activeTab === "elements" && (
          <div className="space-y-4">
            {/* TEXT TOOLS SECTION */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">
                Typography Elements
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const newEl: CanvasElement = {
                      id: `text-point-${Date.now()}`,
                      type: "text",
                      textType: "point",
                      name: "Point Text",
                      text: "POINT TYPOGRAPHY",
                      fontFamily: "Space Grotesk",
                      fontWeight: "700",
                      fontSize: 32,
                      color: "#00f5ff",
                      letterSpacing: 3,
                      x: 25,
                      y: 35,
                      width: 50,
                      height: 12,
                      zIndex: 25,
                      visible: true,
                      locked: false,
                      autoWrap: false,
                    };
                    onChangeState({ ...state, elements: [...state.elements, newEl] });
                    onSelectElement(newEl.id);
                  }}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-neon-cyan/50 hover:bg-neon-cyan/10 text-gray-200 hover:text-white transition-all text-left flex flex-col gap-1 group"
                >
                  <div className="flex items-center gap-2">
                    <Type className="w-4 h-4 text-neon-cyan group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-xs font-mono">Point Text</span>
                  </div>
                  <span className="text-[9px] text-gray-400">Click-to-place headline</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const newEl: CanvasElement = {
                      id: `text-para-${Date.now()}`,
                      type: "text",
                      textType: "paragraph",
                      name: "Paragraph Box",
                      text: "Lizzdo Studio typography engine gives you complete control over kerning, leading, gradients, text backgrounds, and contour shadows.",
                      fontFamily: "Inter",
                      fontWeight: "400",
                      fontSize: 16,
                      color: "#ffffff",
                      letterSpacing: 0,
                      lineHeight: 1.5,
                      x: 20,
                      y: 45,
                      width: 60,
                      height: 25,
                      zIndex: 25,
                      visible: true,
                      locked: false,
                      autoWrap: true,
                    };
                    onChangeState({ ...state, elements: [...state.elements, newEl] });
                    onSelectElement(newEl.id);
                  }}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-neon-purple/50 hover:bg-neon-purple/10 text-gray-200 hover:text-white transition-all text-left flex flex-col gap-1 group"
                >
                  <div className="flex items-center gap-2">
                    <Type className="w-4 h-4 text-neon-purple group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-xs font-mono">Paragraph Box</span>
                  </div>
                  <span className="text-[9px] text-gray-400">Multi-line bounding box</span>
                </button>

                <button
                  type="button"
                  onClick={() => onAddElement("badge")}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-neon-pink/50 hover:bg-neon-pink/10 text-gray-200 hover:text-white transition-all text-left flex flex-col gap-1 group"
                >
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-neon-pink group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-xs font-mono">Badge Tag</span>
                  </div>
                  <span className="text-[9px] text-gray-400">Pill & label chip</span>
                </button>

                <button
                  type="button"
                  onClick={() => onAddElement("button")}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-400/50 hover:bg-emerald-400/10 text-gray-200 hover:text-white transition-all text-left flex flex-col gap-1 group"
                >
                  <div className="flex items-center gap-2">
                    <MousePointer className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-xs font-mono">CTA Button</span>
                  </div>
                  <span className="text-[9px] text-gray-400">Interactive button</span>
                </button>
              </div>
            </div>

            {/* VECTOR SHAPES SECTION */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">
                Vector Shapes & Frames
              </label>
              <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => onAddElement("shape")}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-neon-cyan/50 hover:bg-white/10 flex flex-col items-center gap-1.5 transition-all text-center group"
                >
                  <Square className="w-4 h-4 text-neon-cyan group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] text-gray-300">Rectangle</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const newEl: CanvasElement = {
                      id: `circle-${Date.now()}`,
                      type: "shape",
                      shapeType: "circle",
                      name: "Vector Circle",
                      visible: true,
                      locked: false,
                      x: 35,
                      y: 35,
                      width: 25,
                      height: 25,
                      fillColor: "rgba(168, 85, 247, 0.4)",
                      strokeColor: "#a855f7",
                      strokeWidth: 2,
                      borderStyle: "solid",
                      zIndex: 10,
                    };
                    onChangeState({ ...state, elements: [...state.elements, newEl] });
                    onSelectElement(newEl.id);
                  }}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-neon-purple/50 hover:bg-white/10 flex flex-col items-center gap-1.5 transition-all text-center group"
                >
                  <Grid className="w-4 h-4 text-neon-purple group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] text-gray-300">Circle</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const newEl: CanvasElement = {
                      id: `star-${Date.now()}`,
                      type: "shape",
                      shapeType: "star",
                      name: "Vector Star",
                      visible: true,
                      locked: false,
                      x: 40,
                      y: 40,
                      width: 20,
                      height: 20,
                      fillColor: "rgba(255, 149, 0, 0.5)",
                      strokeColor: "#ff9500",
                      strokeWidth: 2,
                      zIndex: 10,
                    };
                    onChangeState({ ...state, elements: [...state.elements, newEl] });
                    onSelectElement(newEl.id);
                  }}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400/50 hover:bg-white/10 flex flex-col items-center gap-1.5 transition-all text-center group"
                >
                  <Sparkles className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] text-gray-300">Star</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const newEl: CanvasElement = {
                      id: `arrow-${Date.now()}`,
                      type: "arrow",
                      name: "Vector Arrow",
                      visible: true,
                      locked: false,
                      x: 30,
                      y: 45,
                      width: 35,
                      height: 10,
                      strokeColor: "#00f5ff",
                      strokeWidth: 3,
                      arrowEndHead: "arrow",
                      zIndex: 10,
                    };
                    onChangeState({ ...state, elements: [...state.elements, newEl] });
                    onSelectElement(newEl.id);
                  }}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-neon-cyan/50 hover:bg-white/10 flex flex-col items-center gap-1.5 transition-all text-center group"
                >
                  <Zap className="w-4 h-4 text-neon-cyan group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] text-gray-300">Arrow</span>
                </button>

                <button
                  type="button"
                  onClick={() => onAddElement("logo")}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-rose-400/50 hover:bg-white/10 flex flex-col items-center gap-1.5 transition-all text-center group"
                >
                  <Shield className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] text-gray-300">Studio Logo</span>
                </button>

                <button
                  type="button"
                  onClick={() => onAddElement("watermark")}
                  className="p-2.5 rounded-xl bg-neon-cyan/10 border border-neon-cyan/40 hover:border-neon-cyan flex flex-col items-center gap-1.5 transition-all text-center group text-neon-cyan"
                >
                  <ShieldCheck className="w-4 h-4 text-neon-cyan group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold">Watermark</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. WATERMARK STUDIO TAB */}
        {/* ========================================================================= */}
        {activeTab === "watermark" && (
          <WatermarkInspector
            state={state}
            onChangeState={onChangeState}
            selectedElement={state.elements.find((el) => el.id === selectedElementId) || null}
            onUpdateElement={(id, updates) => {
              const updated = {
                ...state,
                elements: state.elements.map((el) => (el.id === id ? { ...el, ...updates } : el)),
              };
              onChangeState(updated);
            }}
            onAddElement={(el) => onAddElement(el)}
            onDuplicateElement={(id) => onDuplicateElement(id)}
            onDeleteElement={(id) => onDeleteElement(id)}
          />
        )}

        {/* ========================================================================= */}
        {/* 3. MY OBJECTS LIBRARY TAB */}
        {/* ========================================================================= */}
        {activeTab === "my-objects" && (
          <div className="space-y-4">
            {/* SAVE BUTTON */}
            <div className="p-3 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Box className="w-4 h-4" /> Save Current Object
                </span>
                <span className="text-[9px] font-mono text-gray-400">{myObjects.length} Saved</span>
              </div>
              <p className="text-[10px] text-gray-300">
                Save the selected canvas object (with its custom colors, borders, glow, and effects) to your personal reusable library.
              </p>
              <button
                type="button"
                onClick={saveSelectedElementToMyObjects}
                disabled={!selectedElementId}
                className={`w-full py-2 rounded-xl font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                  selectedElementId
                    ? "bg-amber-400 text-black hover:bg-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.3)] cursor-pointer"
                    : "bg-white/10 text-gray-500 cursor-not-allowed"
                }`}
              >
                <PlusCircle className="w-4 h-4" /> Save Selected Object
              </button>
            </div>

            {/* SAVED OBJECTS LIST */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">
                Saved & Starter Objects
              </label>
              {myObjects.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-black/40 border border-white/10 hover:border-amber-400/50 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="w-8 h-8 rounded-lg bg-amber-400/15 border border-amber-400/30 flex items-center justify-center shrink-0">
                      <Box className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="truncate">
                      <div className="text-white font-bold text-xs truncate">{item.name}</div>
                      <div className="text-[9px] font-mono text-gray-400 uppercase">
                        {item.type} • {item.savedAt}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        const newEl = {
                          ...item.element,
                          id: `el-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
                          x: 35,
                          y: 35,
                          visible: true,
                          locked: false,
                        };
                        onChangeState({
                          ...state,
                          elements: [...state.elements, newEl as CanvasElement],
                        });
                        onSelectElement(newEl.id);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-black font-mono font-bold text-[10px] flex items-center gap-1 transition-all"
                      title="Insert onto Canvas"
                    >
                      <PlusCircle className="w-3.5 h-3.5" /> Insert
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteFromMyObjects(item.id)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-rose-500/20 transition-colors"
                      title="Delete Object"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. BRAND KITS & STYLES TAB */}
        {/* ========================================================================= */}
        {activeTab === "brand" && (
          <div className="space-y-4">
            {/* ACTIVE BRAND SELECTOR */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">
                Active Brand Profile
              </label>
              <select
                value={activeBrandKit.id}
                onChange={(e) => setActiveBrandId(e.target.value)}
                className="w-full bg-black border border-white/20 rounded-xl p-2 text-white font-mono font-bold text-xs focus:border-neon-cyan focus:outline-none"
              >
                {brandKits.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.brandName}
                  </option>
                ))}
              </select>
            </div>

            {/* 1-CLICK APPLY BRAND BUTTON */}
            <button
              type="button"
              onClick={() => {
                const updated = applyBrandKitToDesign(state, activeBrandKit);
                onChangeState(updated);
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-black font-mono font-bold text-xs uppercase shadow-[0_0_20px_rgba(0,245,255,0.3)] hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-black" /> 1-Click Apply {activeBrandKit.brandName}
            </button>

            {/* BRAND COLOR PALETTE */}
            <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">
                Brand Palette (Click to Apply Color)
              </span>
              <div className="grid grid-cols-5 gap-1.5">
                {[
                  { name: "Primary", color: activeBrandKit.colors.primary },
                  { name: "Secondary", color: activeBrandKit.colors.secondary },
                  { name: "Accent", color: activeBrandKit.colors.accent },
                  { name: "Dark", color: activeBrandKit.colors.background },
                  { name: "Surface", color: activeBrandKit.colors.surface },
                ].map((swatch, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      if (selectedElementId) {
                        const updated = state.elements.map((el) =>
                          el.id === selectedElementId ? { ...el, color: swatch.color, fillColor: swatch.color } : el
                        );
                        onChangeState({ ...state, elements: updated });
                      } else {
                        onChangeState({
                          ...state,
                          background: { ...state.background, type: "solid", solidColor: swatch.color },
                        });
                      }
                    }}
                    style={{ backgroundColor: swatch.color }}
                    title={`${swatch.name}: ${swatch.color}`}
                    className="h-10 rounded-lg border border-white/20 hover:scale-105 transition-transform flex items-end justify-center p-1 shadow-md"
                  >
                    <span className="text-[8px] font-mono text-white bg-black/70 px-1 rounded truncate max-w-full">
                      {swatch.color}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* BRAND TYPOGRAPHY RULES */}
            <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">
                Brand Typography
              </span>
              <div className="space-y-1 font-mono text-xs">
                <div className="flex items-center justify-between text-gray-300">
                  <span>Display Font:</span>
                  <span className="text-neon-cyan font-bold">
                    {activeBrandKit.typography?.heading?.fontFamily || "Space Grotesk"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-gray-300">
                  <span>Body Font:</span>
                  <span className="text-white">
                    {activeBrandKit.typography?.body?.fontFamily || "Inter"}
                  </span>
                </div>
              </div>
            </div>

            {/* BRAND LOGOS */}
            {activeBrandKit.logoVariants && activeBrandKit.logoVariants.length > 0 && (
              <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">
                  Brand Logos
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {activeBrandKit.logoVariants.map((logo) => (
                    <button
                      key={logo.id}
                      type="button"
                      onClick={() => {
                        const newEl: CanvasElement = {
                          id: `logo-${Date.now()}`,
                          type: "image",
                          name: logo.name || "Brand Logo",
                          url: logo.url,
                          x: 40,
                          y: 40,
                          width: 20,
                          height: 20,
                          visible: true,
                          locked: false,
                          zIndex: 50,
                        };
                        onChangeState({ ...state, elements: [...state.elements, newEl] });
                        onSelectElement(newEl.id);
                      }}
                      className="h-16 rounded-xl bg-neutral-900 border border-white/15 p-2 flex items-center justify-center hover:border-neon-cyan transition-colors group"
                      title={`Add ${logo.name} to canvas`}
                    >
                      <img src={logo.url} alt={logo.name} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 5. PRESETS & TEMPLATES TAB */}
        {/* ========================================================================= */}
        {activeTab === "presets" && (
          <div className="space-y-4">
            {/* SOCIAL MEDIA CANVAS DIMENSIONS */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">
                Social Media Canvas Presets
              </label>
              <div className="grid grid-cols-2 gap-1.5 font-mono text-xs">
                {canvasPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      onChangeState({
                        ...state,
                        canvasWidth: preset.w,
                        canvasHeight: preset.h,
                        aspectRatio: preset.ratio,
                      });
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all flex flex-col gap-0.5 ${
                      state.canvasWidth === preset.w && state.canvasHeight === preset.h
                        ? "bg-neon-pink/20 border-neon-pink text-neon-pink font-bold"
                        : "bg-black/40 border-white/10 hover:border-white/30 text-gray-300"
                    }`}
                  >
                    <span className="font-bold text-[11px] truncate">{preset.name}</span>
                    <span className="text-[9px] text-gray-400">
                      {preset.w} × {preset.h} ({preset.ratio})
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* MULTI-LAYER EDITABLE COMPOSITIONS */}
            <div className="pt-2 border-t border-white/10 space-y-2">
              <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">
                Multi-Layer Compositions
              </label>
              <TemplateManager
                currentState={state}
                onSelectTemplate={onSelectTemplate}
                onSaveCurrentAsTemplate={(name, category) => {
                  onChangeState({ ...state, title: name });
                }}
              />
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 6. ASSET LIBRARY TAB */}
        {/* ========================================================================= */}
        {activeTab === "assets" && (
          <div className="space-y-4">
            {/* SEARCH */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search icons, shapes, HUDs..."
                value={searchAssetQuery}
                onChange={(e) => setSearchAssetQuery(e.target.value)}
                className="w-full bg-black/60 border border-white/15 rounded-xl pl-8 pr-3 py-2 text-white font-mono text-xs focus:border-neon-purple focus:outline-none"
              />
            </div>

            {/* CATEGORY PILLS */}
            <div className="flex flex-wrap gap-1">
              {(["all", "cyber", "badges", "shapes", "gradients", "colors"] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setAssetCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono capitalize transition-all ${
                    assetCategory === cat
                      ? "bg-neon-purple text-black font-bold"
                      : "bg-white/5 text-gray-400 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* ASSET ITEMS GRID */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { from: "#00f5ff", to: "#a855f7", name: "Cyber Neon" },
                { from: "#f43f5e", to: "#f59e0b", name: "Sunset Blaze" },
                { from: "#10b981", to: "#3b82f6", name: "Emerald Wave" },
                { from: "#6366f1", to: "#ec4899", name: "Electric Dusk" },
              ].map((grad, i) => (
                <button
                  key={i}
                  type="button"
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
                  className="h-16 rounded-xl border border-white/20 hover:scale-105 transition-transform p-2 flex items-end shadow-lg text-left"
                >
                  <span className="text-[9px] font-mono text-white font-bold bg-black/60 px-1.5 py-0.5 rounded">
                    {grad.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 7. UPLOAD & MEDIA TAB */}
        {/* ========================================================================= */}
        {activeTab === "uploads" && (
          <div className="space-y-4">
            {/* DRAG & DROP UPLOAD */}
            <label className="p-6 rounded-2xl border-2 border-dashed border-amber-400/40 hover:border-amber-400 bg-black/40 hover:bg-black/60 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer text-center group">
              <Upload className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-mono text-gray-200 font-bold">Select Local Files</span>
              <span className="text-[10px] text-gray-400 font-mono">PNG, JPG, SVG, WebP supported</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={onMultipleImagesUpload}
                className="hidden"
              />
            </label>

            {/* SAMPLE TRANSPARENT CUTOUTS LIBRARY FOR MASKING TESTS */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                  Transparent Cutouts (Auto Silhouette)
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {sampleCutouts.map((cutout, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      const newEl: CanvasElement = {
                        id: `cutout-${Date.now()}-${idx}`,
                        type: "image",
                        name: cutout.name,
                        url: cutout.url,
                        x: 30,
                        y: 25,
                        width: 40,
                        height: 50,
                        visible: true,
                        locked: false,
                        zIndex: 40,
                        mask: {
                          enabled: true,
                          shape: "auto-silhouette",
                          zoom: 1,
                          offsetX: 0,
                          offsetY: 0,
                          rotation: 0,
                        },
                        outline: {
                          enabled: true,
                          width: 3,
                          color: "#00f5ff",
                          style: "solid",
                        },
                      };
                      onChangeState({ ...state, elements: [...state.elements, newEl] });
                      onSelectElement(newEl.id);
                    }}
                    className="h-24 rounded-xl bg-neutral-950 border border-white/10 hover:border-amber-400 p-2 flex flex-col items-center justify-between group transition-all"
                  >
                    <img
                      src={cutout.url}
                      alt={cutout.name}
                      className="max-h-16 max-w-full object-contain group-hover:scale-105 transition-transform"
                    />
                    <span className="text-[9px] font-mono text-gray-300 truncate w-full text-center">
                      {cutout.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 8. HISTORY TIMELINE TAB */}
        {/* ========================================================================= */}
        {activeTab === "history" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onUndo}
                disabled={!canUndo}
                className={`flex-1 py-2 rounded-xl font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                  canUndo
                    ? "bg-emerald-400/20 border border-emerald-400/50 text-emerald-300 hover:bg-emerald-400/30 cursor-pointer"
                    : "bg-white/5 text-gray-500 border border-white/5 cursor-not-allowed"
                }`}
              >
                Undo (Ctrl+Z)
              </button>
              <button
                type="button"
                onClick={onRedo}
                disabled={!canRedo}
                className={`flex-1 py-2 rounded-xl font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                  canRedo
                    ? "bg-emerald-400/20 border border-emerald-400/50 text-emerald-300 hover:bg-emerald-400/30 cursor-pointer"
                    : "bg-white/5 text-gray-500 border border-white/5 cursor-not-allowed"
                }`}
              >
                Redo (Ctrl+Y)
              </button>
            </div>

            <div className="space-y-1.5 font-mono text-[10px]">
              {[
                { title: "Current Canvas State", time: "Just now", active: true },
                { title: `Elements Count: ${state.elements.length}`, time: "Live", active: false },
                { title: `Canvas Dimensions: ${state.canvasWidth}×${state.canvasHeight}`, time: "Active", active: false },
                { title: `Background: ${state.background.type.toUpperCase()}`, time: "Synced", active: false },
              ].map((log, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border flex items-center justify-between ${
                    log.active
                      ? "bg-emerald-400/10 border-emerald-400/40 text-emerald-300 font-bold"
                      : "bg-black/40 border-white/5 text-gray-400"
                  }`}
                >
                  <span>{log.title}</span>
                  <span className="text-[9px] text-gray-500">{log.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 9. AI TOOLS TAB */}
        {/* ========================================================================= */}
        {activeTab === "ai" && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-white text-xs">AI Auto Silhouette Mask</span>
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[9px] font-mono">
                  ALPHA-ACCURATE
                </span>
              </div>
              <p className="text-[10px] text-gray-300">
                Detects transparent subject boundaries to mask and generate pixel-accurate silhouette borders and rim glows.
              </p>
              <button
                type="button"
                onClick={() => {
                  if (selectedElementId) {
                    const updated = state.elements.map((el) =>
                      el.id === selectedElementId
                        ? {
                            ...el,
                            mask: {
                              enabled: true,
                              shape: "auto-silhouette" as const,
                              zoom: 1,
                              offsetX: 0,
                              offsetY: 0,
                              rotation: 0,
                            },
                            outline: {
                              enabled: true,
                              width: 3,
                              color: "#00f5ff",
                              style: "solid" as const,
                            },
                          }
                        : el
                    );
                    onChangeState({ ...state, elements: updated });
                  }
                }}
                className="w-full py-2 rounded-xl bg-blue-500 text-white font-mono font-bold hover:bg-blue-400 transition-all text-xs flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(59,130,246,0.3)]"
              >
                <Wand2 className="w-4 h-4" /> Apply Auto Silhouette to Selected
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-neon-purple/10 border border-neon-purple/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-white text-xs">AI Color Harmony</span>
                <span className="px-2 py-0.5 rounded bg-neon-purple/20 text-neon-purple text-[9px] font-mono">
                  THEORY
                </span>
              </div>
              <p className="text-[10px] text-gray-300">
                Calculates mathematical color harmony ratios across canvas elements, text, and backgrounds.
              </p>
              <button
                type="button"
                onClick={() => {
                  const updated = state.elements.map((el, i) => {
                    const colors = ["#00f5ff", "#a855f7", "#ff006e", "#38ef7d"];
                    return { ...el, color: colors[i % colors.length] };
                  });
                  onChangeState({ ...state, elements: updated });
                }}
                className="w-full py-2 rounded-xl bg-neon-purple text-black font-mono font-bold hover:bg-purple-300 transition-all text-xs flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" /> Auto Harmonize Layer Colors
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

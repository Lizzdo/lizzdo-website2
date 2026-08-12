import React, { useState, useEffect } from "react";
import { useStudio } from "../../../context/StudioContext";
import {
  PROJECT_PRESETS,
  ProjectPreset,
  PresetCategory,
  ProjectType,
  CanvasUnit,
  calculateAspectRatio,
  convertUnitsToPixels,
} from "../../../data/projectPresets";
import { DESIGN_TEMPLATES } from "../../../data/designerTemplates";
import { StudioToolId } from "../../../types/studio";
import { CanvasElement } from "../../../types/designer";
import {
  X,
  Plus,
  Sparkles,
  Layout,
  Maximize2,
  Sliders,
  Palette,
  Grid,
  Upload,
  Check,
  Folder,
  Image as ImageIcon,
  Facebook,
  Linkedin,
  Twitter,
  Youtube,
  Instagram,
  Video,
  Briefcase,
  Github,
  Share2,
  ShoppingBag,
  FileText,
  Layers,
} from "lucide-react";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultToolId?: StudioToolId;
}

export function CreateProjectModal({ isOpen, onClose, defaultToolId = "designer" }: CreateProjectModalProps) {
  const { createProject, folders, setActiveToolId } = useStudio();

  // Mode: Presets vs Custom
  const [activeTab, setActiveTab] = useState<"presets" | "custom">("presets");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Selection
  const [selectedPreset, setSelectedPreset] = useState<ProjectPreset>(PROJECT_PRESETS[0]);

  // Project Fields
  const [title, setTitle] = useState("");
  const [projectType, setProjectType] = useState<ProjectType>("Image Design");
  const [toolId, setToolId] = useState<StudioToolId>(defaultToolId);
  const [selectedFolderId, setSelectedFolderId] = useState<string>("");

  // Custom Dimensions State
  const [customWidth, setCustomWidth] = useState<number>(1920);
  const [customHeight, setCustomHeight] = useState<number>(1080);
  const [customUnit, setCustomUnit] = useState<CanvasUnit>("px");
  const [customDpi, setCustomDpi] = useState<number>(72);
  const [transparentBg, setTransparentBg] = useState<boolean>(false);

  // Background Customization
  const [bgType, setBgType] = useState<"solid" | "gradient" | "wireframe" | "image">("solid");
  const [solidColor, setSolidColor] = useState<string>("#0f172a");
  const [gradientDirection, setGradientDirection] = useState<"linear" | "radial" | "split" | "multi">("linear");
  const [gradientFrom, setGradientFrom] = useState<string>("#0f172a");
  const [gradientTo, setGradientTo] = useState<string>("#1e1b4b");
  const [gradientVia, setGradientVia] = useState<string>("#3b0764");
  const [wireframeStyle, setWireframeStyle] = useState<"cyber" | "blueprint" | "grid" | "perspective">("cyber");
  const [bgImageUrl, setBgImageUrl] = useState<string>("");

  useEffect(() => {
    if (defaultToolId) setToolId(defaultToolId);
  }, [defaultToolId]);

  if (!isOpen) return null;

  // Filter Presets
  const filteredPresets = PROJECT_PRESETS.filter((p) => {
    if (selectedCategory === "all") return true;
    if (selectedCategory === "social") return ["facebook", "linkedin", "x", "instagram", "tiktok", "youtube", "fiverr", "github", "opengraph"].includes(p.category);
    return p.category === selectedCategory;
  });

  // Calculate pixel dimensions for custom
  const pxWidth = convertUnitsToPixels(customWidth, customUnit, customDpi);
  const pxHeight = convertUnitsToPixels(customHeight, customUnit, customDpi);
  const activeWidth = activeTab === "presets" ? selectedPreset.width : pxWidth;
  const activeHeight = activeTab === "presets" ? selectedPreset.height : pxHeight;
  const activeRatio = calculateAspectRatio(activeWidth, activeHeight);

  // Select Preset handler
  const handleSelectPreset = (preset: ProjectPreset) => {
    setSelectedPreset(preset);
    setProjectType(preset.projectType);
    if (preset.projectType === "Video") {
      setToolId("video-editor");
    } else {
      setToolId("designer");
    }
  };

  // Preset Icon Map
  const renderCategoryIcon = (catName: string) => {
    switch (catName) {
      case "facebook": return <Facebook className="w-4 h-4 text-blue-500" />;
      case "linkedin": return <Linkedin className="w-4 h-4 text-sky-500" />;
      case "x": return <Twitter className="w-4 h-4 text-gray-300" />;
      case "youtube": return <Youtube className="w-4 h-4 text-red-500" />;
      case "instagram": return <Instagram className="w-4 h-4 text-pink-500" />;
      case "tiktok": return <Video className="w-4 h-4 text-cyan-400" />;
      case "fiverr": return <Briefcase className="w-4 h-4 text-emerald-400" />;
      case "github": return <Github className="w-4 h-4 text-white" />;
      case "opengraph": return <Share2 className="w-4 h-4 text-amber-400" />;
      case "website": return <Layout className="w-4 h-4 text-indigo-400" />;
      case "blog": return <FileText className="w-4 h-4 text-purple-400" />;
      case "store": return <ShoppingBag className="w-4 h-4 text-emerald-500" />;
      case "portfolio": return <Briefcase className="w-4 h-4 text-yellow-400" />;
      default: return <Sparkles className="w-4 h-4 text-neon-cyan" />;
    }
  };

  // Submit & Create Project
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();

    // Determine default fallback title if blank
    let finalTitle = title.trim();
    if (!finalTitle) {
      if (activeTab === "presets") {
        finalTitle = `${selectedPreset.platform} ${selectedPreset.name}`;
      } else {
        finalTitle = `Custom ${activeWidth}x${activeHeight} Design`;
      }
    }

    // Build Background Configuration for DesignState
    let backgroundConfig: any = {
      type: bgType === "solid" ? "solid" : bgType === "gradient" ? "gradient" : bgType === "wireframe" ? "pattern" : "image",
      solidColor: transparentBg ? "transparent" : solidColor,
      gradientFrom: bgType === "gradient" ? gradientFrom : undefined,
      gradientTo: bgType === "gradient" ? gradientTo : undefined,
      gradientVia: bgType === "gradient" && gradientDirection === "multi" ? gradientVia : undefined,
      gradientDirection: gradientDirection === "radial" ? "radial" : "to-br",
      pattern: bgType === "wireframe" ? (wireframeStyle === "blueprint" ? "grid" : wireframeStyle === "perspective" ? "cyber" : "grid") : "none",
      patternColor: "rgba(0, 245, 255, 0.25)",
      patternOpacity: bgType === "wireframe" ? 0.6 : 0,
      imageUrl: bgType === "image" ? bgImageUrl : undefined,
      imageFit: "cover",
    };

    // Check if selected preset matches a template composition in DESIGN_TEMPLATES
    const matchedTemplate = DESIGN_TEMPLATES.find(
      (t) => t.id === selectedPreset.id || t.state.preset === selectedPreset.id
    );

    let compositionElements: CanvasElement[] = [
      {
        id: `el-badge-${Date.now()}`,
        name: "Category Badge",
        type: "badge",
        visible: true,
        locked: false,
        x: 8,
        y: 12,
        text: `${selectedPreset.platform.toUpperCase()} // ${selectedPreset.projectType.toUpperCase()}`,
        bg: "rgba(0, 245, 255, 0.15)",
        textColor: "#00f5ff",
        borderColor: "rgba(0, 245, 255, 0.4)",
        borderRadius: 8,
        fontSize: 11,
        zIndex: 10,
      },
      {
        id: `el-title-${Date.now()}`,
        name: "Project Headline",
        type: "text",
        visible: true,
        locked: false,
        x: 8,
        y: 24,
        text: finalTitle,
        fontSize: 32,
        fontFamily: "Orbitron",
        fontWeight: "bold",
        color: "#ffffff",
        textAlign: "left",
        zIndex: 11,
      },
      {
        id: `el-sub-${Date.now()}`,
        name: "Project Subtitle",
        type: "text",
        visible: true,
        locked: false,
        x: 8,
        y: 52,
        text: "Custom editable composition created in Version 1 Designer. Drag, resize, swap images, or customize layout.",
        fontSize: 13,
        fontFamily: "Inter",
        color: "#94a3b8",
        textAlign: "left",
        lineHeight: 1.5,
        zIndex: 12,
      },
      {
        id: `el-img-${Date.now()}`,
        name: "Image Frame Placeholder",
        type: "image",
        visible: true,
        locked: false,
        x: 52,
        y: 12,
        width: 42,
        height: 76,
        url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
        fitMode: "cover",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.2)",
        shadowGlow: "cyan",
        zIndex: 5,
      },
      {
        id: `el-btn-${Date.now()}`,
        name: "Action CTA Button",
        type: "button",
        visible: true,
        locked: false,
        x: 8,
        y: 76,
        text: "EXPLORE SHOWCASE",
        bgGradient: "linear-gradient(90deg, #00f5ff, #a855f7)",
        textColor: "#000000",
        borderRadius: 10,
        fontSize: 12,
        zIndex: 14,
      },
    ];

    if (matchedTemplate && matchedTemplate.state.elements) {
      compositionElements = matchedTemplate.state.elements.map((el) => ({
        ...el,
        id: `${el.id}-${Date.now()}`,
      }));
    }

    // Initial Design State Payload
    const initialDesignData = {
      title: finalTitle,
      preset: activeTab === "presets" ? selectedPreset.id : "custom",
      width: activeWidth,
      height: activeHeight,
      unit: customUnit,
      dpi: customDpi,
      projectType,
      allowTransparentBackground: transparentBg,
      background: matchedTemplate ? matchedTemplate.state.background : backgroundConfig,
      showCyberBorders: bgType === "wireframe" || (matchedTemplate ? matchedTemplate.state.showCyberBorders : false),
      showGlassPanel: matchedTemplate ? matchedTemplate.state.showGlassPanel : false,
      glassOpacity: matchedTemplate ? matchedTemplate.state.glassOpacity : 0.3,
      glassBlur: matchedTemplate ? matchedTemplate.state.glassBlur : 10,
      elements: compositionElements,
    };

    createProject(
      finalTitle,
      toolId,
      initialDesignData,
      selectedFolderId || undefined,
      `${projectType} (${activeWidth}x${activeHeight}px)`
    );

    setActiveToolId(toolId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-sans">
      <div className="relative w-full max-w-5xl bg-neutral-900 border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div className="px-6 py-5 bg-neutral-950 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-neon-purple to-neon-cyan text-black">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-white uppercase tracking-wider flex items-center gap-2">
                Create New Project
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-neon-cyan text-xs font-mono lowercase">
                  v2.5
                </span>
              </h2>
              <p className="text-xs text-gray-400 font-mono">
                Select a platform preset or configure custom dimensions & background style.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY CONTENT - GRID */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT 7 COLS: PRESET VS CUSTOM TABS & CONFIG */}
          <div className="lg:col-span-7 space-y-5">
            {/* TAB SELECTOR */}
            <div className="flex p-1 bg-black/50 border border-white/10 rounded-2xl">
              <button
                type="button"
                onClick={() => setActiveTab("presets")}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === "presets"
                    ? "bg-gradient-to-r from-neon-purple to-neon-pink text-white shadow-lg"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Layout className="w-4 h-4" />
                <span>Platform Presets</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("custom")}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === "custom"
                    ? "bg-gradient-to-r from-neon-purple to-neon-pink text-white shadow-lg"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Maximize2 className="w-4 h-4" />
                <span>Custom Canvas</span>
              </button>
            </div>

            {/* PRESETS TAB */}
            {activeTab === "presets" && (
              <div className="space-y-4">
                {/* CATEGORY CHIPS */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 custom-scrollbar">
                  {[
                    { id: "all", label: "All" },
                    { id: "social", label: "Social Media" },
                    { id: "facebook", label: "Facebook" },
                    { id: "linkedin", label: "LinkedIn" },
                    { id: "x", label: "X / Twitter" },
                    { id: "youtube", label: "YouTube" },
                    { id: "instagram", label: "Instagram" },
                    { id: "tiktok", label: "TikTok" },
                    { id: "fiverr", label: "Fiverr" },
                    { id: "github", label: "GitHub" },
                    { id: "opengraph", label: "OpenGraph" },
                    { id: "website", label: "Website" },
                    { id: "blog", label: "Blog" },
                    { id: "store", label: "Store" },
                    { id: "portfolio", label: "Portfolio" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all border ${
                        selectedCategory === cat.id
                          ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan font-bold"
                          : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* PRESETS GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[320px] overflow-y-auto custom-scrollbar pr-1">
                  {filteredPresets.map((preset) => {
                    const isSelected = selectedPreset.id === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleSelectPreset(preset)}
                        className={`p-3.5 rounded-2xl text-left border transition-all flex flex-col justify-between gap-2 relative group ${
                          isSelected
                            ? "bg-neon-purple/15 border-neon-purple shadow-[0_0_20px_rgba(168,85,247,0.3)] text-white"
                            : "bg-black/40 border-white/10 hover:border-white/30 text-gray-300"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            {renderCategoryIcon(preset.category)}
                            <span className="font-display font-bold text-xs uppercase tracking-wider text-white">
                              {preset.name}
                            </span>
                          </div>
                          <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-mono text-neon-cyan">
                            {preset.aspectRatio}
                          </span>
                        </div>

                        <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed font-sans">
                          {preset.description}
                        </p>

                        <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 pt-1 border-t border-white/5">
                          <span>{preset.platform}</span>
                          <span className="font-bold text-white">
                            {preset.width} × {preset.height} px
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CUSTOM CANVAS TAB */}
            {activeTab === "custom" && (
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1">
                      Width ({customUnit})
                    </label>
                    <input
                      type="number"
                      min={10}
                      max={10000}
                      value={customWidth}
                      onChange={(e) => setCustomWidth(Math.max(1, parseInt(e.target.value) || 100))}
                      className="w-full px-3 py-2 bg-neutral-900 border border-white/15 rounded-xl text-white font-mono text-xs focus:border-neon-cyan outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1">
                      Height ({customUnit})
                    </label>
                    <input
                      type="number"
                      min={10}
                      max={10000}
                      value={customHeight}
                      onChange={(e) => setCustomHeight(Math.max(1, parseInt(e.target.value) || 100))}
                      className="w-full px-3 py-2 bg-neutral-900 border border-white/15 rounded-xl text-white font-mono text-xs focus:border-neon-cyan outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1">
                      Unit
                    </label>
                    <select
                      value={customUnit}
                      onChange={(e) => setCustomUnit(e.target.value as CanvasUnit)}
                      className="w-full px-3 py-2 bg-neutral-900 border border-white/15 rounded-xl text-white font-mono text-xs focus:border-neon-cyan outline-none"
                    >
                      <option value="px">Pixels (px)</option>
                      <option value="in">Inches (in)</option>
                      <option value="cm">Centimeters (cm)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1">
                      Resolution (DPI)
                    </label>
                    <select
                      value={customDpi}
                      onChange={(e) => setCustomDpi(parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-neutral-900 border border-white/15 rounded-xl text-white font-mono text-xs focus:border-neon-cyan outline-none"
                    >
                      <option value={72}>72 DPI (Screen & Web)</option>
                      <option value={150}>150 DPI (Medium Quality)</option>
                      <option value={300}>300 DPI (High Res & Print)</option>
                    </select>
                  </div>

                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-gray-300">
                      <input
                        type="checkbox"
                        checked={transparentBg}
                        onChange={(e) => setTransparentBg(e.target.checked)}
                        className="w-4 h-4 rounded bg-neutral-900 border-white/20 text-neon-cyan focus:ring-0"
                      />
                      <span>Transparent Canvas</span>
                    </label>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs font-mono">
                  <span className="text-gray-400">Calculated Pixel Output:</span>
                  <span className="font-bold text-neon-cyan">
                    {pxWidth} × {pxHeight} px ({activeRatio})
                  </span>
                </div>
              </div>
            )}

            {/* BACKGROUND SELECTION */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Palette className="w-4 h-4 text-neon-purple" />
                  <span>Canvas Background</span>
                </span>
                <span className="text-[11px] font-mono text-gray-400">
                  {bgType.toUpperCase()}
                </span>
              </div>

              {/* BG TYPE SELECTOR */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: "solid", label: "Solid Color" },
                  { id: "gradient", label: "Gradient" },
                  { id: "wireframe", label: "Wireframe / Grid" },
                  { id: "image", label: "Image" },
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setBgType(type.id as any)}
                    className={`py-2 px-2 rounded-xl text-[11px] font-mono font-semibold transition-all text-center border ${
                      bgType === type.id
                        ? "bg-neon-purple/20 border-neon-purple text-white"
                        : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>

              {/* BG OPTIONS CONTROLS */}
              {bgType === "solid" && (
                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="color"
                    value={solidColor}
                    onChange={(e) => setSolidColor(e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border border-white/20"
                  />
                  <div className="flex-1 flex gap-2">
                    {["#000000", "#0f172a", "#1e1b4b", "#022c22", "#3b0764", "#ffffff"].map((hex) => (
                      <button
                        key={hex}
                        type="button"
                        onClick={() => setSolidColor(hex)}
                        style={{ backgroundColor: hex }}
                        className="w-7 h-7 rounded-lg border border-white/20 hover:scale-110 transition-transform"
                      />
                    ))}
                  </div>
                  <input
                    type="text"
                    value={solidColor}
                    onChange={(e) => setSolidColor(e.target.value)}
                    className="w-24 px-2 py-1.5 bg-neutral-900 border border-white/15 rounded-xl text-xs font-mono text-white text-center"
                  />
                </div>
              )}

              {bgType === "gradient" && (
                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono text-gray-400 mb-1">Color From</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={gradientFrom}
                          onChange={(e) => setGradientFrom(e.target.value)}
                          className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border border-white/20"
                        />
                        <input
                          type="text"
                          value={gradientFrom}
                          onChange={(e) => setGradientFrom(e.target.value)}
                          className="flex-1 px-2 py-1 bg-neutral-900 border border-white/15 rounded-lg text-xs font-mono text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-gray-400 mb-1">Color To</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={gradientTo}
                          onChange={(e) => setGradientTo(e.target.value)}
                          className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border border-white/20"
                        />
                        <input
                          type="text"
                          value={gradientTo}
                          onChange={(e) => setGradientTo(e.target.value)}
                          className="flex-1 px-2 py-1 bg-neutral-900 border border-white/15 rounded-lg text-xs font-mono text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {["linear", "radial", "multi"].map((dir) => (
                      <button
                        key={dir}
                        type="button"
                        onClick={() => setGradientDirection(dir as any)}
                        className={`flex-1 py-1 rounded-lg text-[10px] font-mono capitalize border ${
                          gradientDirection === dir
                            ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan"
                            : "bg-white/5 border-white/10 text-gray-400"
                        }`}
                      >
                        {dir}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {bgType === "wireframe" && (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  {[
                    { id: "cyber", name: "Cyber Grid" },
                    { id: "blueprint", name: "Blueprint Technical" },
                    { id: "grid", name: "Technical Matrix" },
                    { id: "perspective", name: "Perspective Lines" },
                  ].map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setWireframeStyle(style.id as any)}
                      className={`p-2.5 rounded-xl border text-xs font-mono text-left transition-all ${
                        wireframeStyle === style.id
                          ? "bg-neon-cyan/20 border-neon-cyan text-white"
                          : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                      }`}
                    >
                      {style.name}
                    </button>
                  ))}
                </div>
              )}

              {bgType === "image" && (
                <div className="space-y-2 pt-2">
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={bgImageUrl}
                    onChange={(e) => setBgImageUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/15 rounded-xl text-xs font-mono text-white placeholder-gray-500"
                  />
                  <p className="text-[10px] font-mono text-gray-400">
                    Enter image URL or select from Asset Library after project creation.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT 5 COLS: METADATA & PREVIEW SUMMARY */}
          <div className="lg:col-span-5 space-y-5 flex flex-col justify-between">
            <div className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-4">
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-neon-cyan flex items-center gap-2">
                <Sliders className="w-4 h-4" />
                <span>Project Metadata</span>
              </h3>

              {/* TITLE */}
              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  placeholder={
                    activeTab === "presets"
                      ? `${selectedPreset.platform} ${selectedPreset.name}`
                      : "Untitled Custom Design"
                  }
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/15 rounded-xl text-white font-sans text-xs focus:border-neon-cyan outline-none"
                />
              </div>

              {/* PROJECT TYPE */}
              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1">
                  Project Classification
                </label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value as ProjectType)}
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/15 rounded-xl text-white font-mono text-xs focus:border-neon-cyan outline-none"
                >
                  <option value="Image Design">Image Design</option>
                  <option value="Video">Video Project</option>
                  <option value="Social Media">Social Media Graphic</option>
                  <option value="Website Graphic">Website Graphic</option>
                  <option value="Blog Graphic">Blog Graphic</option>
                  <option value="Store Graphic">Store Graphic</option>
                  <option value="Portfolio Graphic">Portfolio Graphic</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>

              {/* TARGET WORKSPACE / TOOL */}
              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1">
                  Editor Suite
                </label>
                <select
                  value={toolId}
                  onChange={(e) => setToolId(e.target.value as StudioToolId)}
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/15 rounded-xl text-white font-mono text-xs focus:border-neon-cyan outline-none"
                >
                  <option value="designer">Vector Designer & Suite</option>
                  <option value="video-editor">Multi-Track Video Editor</option>
                  <option value="image-editor">Image Retouch Editor</option>
                  <option value="thumbnail-creator">YouTube Thumbnail Creator</option>
                </select>
              </div>

              {/* FOLDER TARGET */}
              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1">
                  Folder Destination
                </label>
                <select
                  value={selectedFolderId}
                  onChange={(e) => setSelectedFolderId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/15 rounded-xl text-white font-mono text-xs focus:border-neon-cyan outline-none"
                >
                  <option value="">General Workspace</option>
                  {folders.map((f) => (
                    <option key={f.id} value={f.id}>
                      📁 {f.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* PREVIEW BOX */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-white/10 space-y-3">
              <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block">
                Target Canvas Summary
              </span>

              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-gray-400">Dimensions:</span>
                <span className="font-bold text-white">
                  {activeWidth} × {activeHeight} px
                </span>
              </div>

              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-gray-400">Aspect Ratio:</span>
                <span className="font-bold text-neon-cyan">{activeRatio}</span>
              </div>

              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-gray-400">Target Tool:</span>
                <span className="font-bold text-neon-purple uppercase">{toolId}</span>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 font-mono text-xs uppercase font-bold transition-all"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleCreate}
                className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-neon-purple via-neon-pink to-cyan-400 text-white font-display font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Create Workspace</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

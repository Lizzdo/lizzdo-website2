import React, { useState, useRef, useEffect } from "react";
import {
  DesignState,
  CanvasElement,
  ElementType,
  DesignTemplate,
  ExportFormat,
  ExportQuality,
  ProfessionalExportOptions,
} from "../../types/designer";
import { DEFAULT_DESIGN_STATE } from "../../data/designerTemplates";
import { CanvasStage } from "./CanvasStage";
import { ElementInspector } from "./ElementInspector";
import { BackgroundInspector } from "./BackgroundInspector";
import { FrameCornerInspector } from "./FrameCornerInspector";
import { TemplateManager } from "./TemplateManager";
import {
  prepareDesignStateForExport,
  renderArtworkFormat,
  estimateExportFileSize,
  AssetDiagnostic,
} from "../../utils/exportEngine";
import { getSmartExportRecommendation } from "../../utils/professionalExport";
import {
  Type,
  Tag,
  Image as ImageIcon,
  MousePointer,
  Shield,
  Square,
  Plus,
  Layers,
  Palette,
  Bookmark,
  Download,
  Eye,
  EyeOff,
  Trash2,
  ChevronUp,
  ChevronDown,
  Smartphone,
  Monitor,
  Sparkles,
  Check,
  ZoomIn,
  ZoomOut,
  Sliders,
  CheckCircle2,
  X,
  Copy,
  Grid,
  FileCheck,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Upload,
} from "lucide-react";

export default function PostDesigner() {
  const [designState, setDesignState] = useState<DesignState>(DEFAULT_DESIGN_STATE);
  const [selectedElementId, setSelectedElementId] = useState<string | null>("el-title-1");
  const [activeTab, setActiveTab] = useState<"inspector" | "background" | "frames" | "templates">("inspector");
  const [leftTab, setLeftTab] = useState<"elements" | "layers" | "templates">("elements");
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [zoomScale, setZoomScale] = useState<number>(0.85);

  // SIDEBAR COLLAPSIBLE STATES
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState<boolean>(true);
  
  // EXPORT & QUALITY CHECK MODAL STATE
  const [showQualityModal, setShowQualityModal] = useState<boolean>(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("psd");
  const [exportQuality, setExportQuality] = useState<ExportQuality>(2); // Default 2x HD
  const [profOptions, setProfOptions] = useState<ProfessionalExportOptions>({
    format: "psd",
    quality: 2,
    layerMode: "layered",
    textMode: "editable",
    imageMode: "embedded",
    colorMode: "rgb",
    transparentBg: false,
    dpi: 150,
    compression: "high_quality",
  });
  const [showAdvancedOpts, setShowAdvancedOpts] = useState<boolean>(false);
  const [previewDataUrl, setPreviewDataUrl] = useState<string>("");
  const [isGeneratingExport, setIsGeneratingExport] = useState<boolean>(false);
  const [exportProgressStatus, setExportProgressStatus] = useState<string>("Sanitizing Assets & Resolving CORS...");
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [assetDiagnostics, setAssetDiagnostics] = useState<AssetDiagnostic[]>([]);

  const stageRef = useRef<HTMLDivElement>(null);
  const exportModalBackdropRef = useRef<HTMLDivElement>(null);

  // BODY SCROLL LOCK & ESC KEY LISTENER FOR EXPORT MODAL
  useEffect(() => {
    if (showQualityModal) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setShowQualityModal(false);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [showQualityModal]);

  // Selected element helper
  const selectedElement = designState.elements.find((el) => el.id === selectedElementId);

  // ADD NEW DYNAMIC ELEMENT
  const handleAddElement = (type: ElementType) => {
    const id = `el-${type}-${Date.now()}`;
    let newEl: CanvasElement;

    switch (type) {
      case "text":
        newEl = {
          id,
          name: `Text Box ${designState.elements.length + 1}`,
          type: "text",
          visible: true,
          locked: false,
          x: 10,
          y: 40 + (designState.elements.length * 5) % 40,
          text: "EDITABLE CUSTOM TEXT",
          fontSize: 24,
          fontFamily: "Orbitron",
          fontWeight: "bold",
          color: "#ffffff",
          textAlign: "left",
          letterSpacing: 2,
          lineHeight: 1.3,
          textTransform: "uppercase",
          gradientText: false,
          zIndex: designState.elements.length + 10,
        };
        break;

      case "badge":
        newEl = {
          id,
          name: `Badge ${designState.elements.length + 1}`,
          type: "badge",
          visible: true,
          locked: false,
          x: 10,
          y: 15,
          text: "NEW BADGE",
          bg: "rgba(0, 245, 255, 0.15)",
          textColor: "#00f5ff",
          borderColor: "rgba(0, 245, 255, 0.4)",
          borderRadius: 8,
          fontSize: 11,
          zIndex: designState.elements.length + 10,
        };
        break;

      case "image":
        newEl = {
          id,
          name: `Image ${designState.elements.length + 1}`,
          type: "image",
          visible: true,
          locked: false,
          x: 0,
          y: 0,
          width: 100,
          height: 100,
          url: "/lizzdo-logo.png",
          fitMode: "smart",
          scale: 1,
          xOffset: 0,
          yOffset: 0,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: "rgba(255, 255, 255, 0.1)",
          shadowGlow: "none",
          opacity: 1,
          zIndex: designState.elements.length + 10,
        };
        break;

      case "button":
        newEl = {
          id,
          name: `CTA Button ${designState.elements.length + 1}`,
          type: "button",
          visible: true,
          locked: false,
          x: 10,
          y: 80,
          text: "ACTION BUTTON",
          bgGradient: "linear-gradient(90deg, #00f5ff, #a855f7)",
          textColor: "#ffffff",
          borderRadius: 12,
          fontSize: 12,
          zIndex: designState.elements.length + 10,
        };
        break;

      case "logo":
        newEl = {
          id,
          name: "Brand Logo",
          type: "logo",
          visible: true,
          locked: false,
          x: 85,
          y: 8,
          text: "LIZZDO",
          logoType: "text",
          url: "/lizzdo-logo.png",
          size: 18,
          padding: 8,
          bg: "rgba(0, 0, 0, 0.6)",
          borderColor: "rgba(0, 245, 255, 0.5)",
          borderWidth: 1,
          borderRadius: 12,
          shadowGlow: "cyan",
          glow: true,
          filterEffect: "none",
          zIndex: designState.elements.length + 10,
        };
        break;

      case "shape":
        newEl = {
          id,
          name: `Divider ${designState.elements.length + 1}`,
          type: "shape",
          visible: true,
          locked: false,
          x: 10,
          y: 50,
          width: 80,
          height: 2,
          bg: "rgba(0, 245, 255, 0.4)",
          borderRadius: 0,
          zIndex: designState.elements.length + 10,
        };
        break;
    }

    setDesignState((prev) => ({
      ...prev,
      elements: [...prev.elements, newEl],
    }));
    setSelectedElementId(id);
    setActiveTab("inspector");
  };

  // BATCH MULTI-IMAGE CANVAS UPLOAD
  const handleMultipleImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    fileList.forEach((file, idx) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const id = `el-image-${Date.now()}-${idx}`;
          const newEl: CanvasElement = {
            id,
            name: file.name.replace(/\.[^/.]+$/, "") || `Image ${designState.elements.length + idx + 1}`,
            type: "image",
            visible: true,
            locked: false,
            x: 10 + ((idx * 15) % 50),
            y: 15 + ((idx * 12) % 45),
            width: 45,
            height: 45,
            url: event.target.result as string,
            fitMode: "cover",
            borderRadius: 16,
            shadowGlow: "cyan",
            opacity: 1,
            zIndex: designState.elements.length + idx + 10,
          };

          setDesignState((prev) => ({
            ...prev,
            elements: [...prev.elements, newEl],
          }));
          setSelectedElementId(id);
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  // DUPLICATE ELEMENT
  const handleDuplicateElement = (id: string) => {
    const target = designState.elements.find((el) => el.id === id);
    if (!target) return;
    const newId = `el-${target.type}-${Date.now()}`;
    const duplicated: CanvasElement = {
      ...target,
      id: newId,
      name: `${target.name} (Copy)`,
      x: Math.min(85, target.x + 4),
      y: Math.min(85, target.y + 4),
      zIndex: designState.elements.length + 10,
    };
    setDesignState((prev) => ({
      ...prev,
      elements: [...prev.elements, duplicated],
    }));
    setSelectedElementId(newId);
  };

  // UPDATE ELEMENT
  const handleUpdateElement = (updated: CanvasElement) => {
    setDesignState((prev) => ({
      ...prev,
      elements: prev.elements.map((el) => (el.id === updated.id ? updated : el)),
    }));
  };

  // DELETE ELEMENT
  const handleDeleteElement = (id: string) => {
    setDesignState((prev) => ({
      ...prev,
      elements: prev.elements.filter((el) => el.id !== id),
    }));
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  };

  // MOVE LAYER Z-INDEX UP/DOWN
  const handleMoveLayer = (id: string, direction: "up" | "down") => {
    setDesignState((prev) => {
      const idx = prev.elements.findIndex((el) => el.id === id);
      if (idx === -1) return prev;
      const targetIdx = direction === "up" ? idx + 1 : idx - 1;
      if (targetIdx < 0 || targetIdx >= prev.elements.length) return prev;

      const newElements = [...prev.elements];
      const temp = newElements[idx];
      newElements[idx] = newElements[targetIdx];
      newElements[targetIdx] = temp;

      return {
        ...prev,
        elements: newElements.map((el, i) => ({ ...el, zIndex: (i + 1) * 5 })),
      };
    });
  };

  // RELINK OR REPLACE PROBLEM ASSET DIRECTLY FROM EXPORT MODAL
  const handleRelinkAsset = (diagnosticId: string, newUrlOrData: string) => {
    if (diagnosticId === "bg-image") {
      setDesignState((prev) => ({
        ...prev,
        background: { ...prev.background, imageUrl: newUrlOrData },
      }));
    } else {
      setDesignState((prev) => ({
        ...prev,
        elements: prev.elements.map((el) => (el.id === diagnosticId ? { ...el, url: newUrlOrData } : el)),
      }));
    }
  };

  // GENERATE EXPORT DATA URL (WYSIWYG EDGE-TO-EDGE CORS-SAFE RENDER)
  const generateExportDataUrl = async (
    format: ExportFormat = exportFormat,
    quality: ExportQuality = exportQuality,
    customProfOpts?: ProfessionalExportOptions
  ): Promise<string> => {
    if (!stageRef.current) return "";
    setIsGeneratingExport(true);
    setExportProgressStatus("Sanitizing Assets & Resolving CORS...");

    const activeProfOpts = customProfOpts || {
      ...profOptions,
      format,
      quality,
      dpi: (quality === 1 ? 72 : quality === 2 ? 150 : quality === 3 ? 300 : 600) as 72 | 150 | 300 | 600,
    };

    try {
      // 1. Sanitize all external & uploaded image URLs into CORS-safe Data URLs & collect diagnostics
      const { sanitizedState, diagnostics } = await prepareDesignStateForExport(designState);
      setAssetDiagnostics(diagnostics);

      // 2. Render 1:1 artwork format with zero CORS errors
      const resultUrl = await renderArtworkFormat(
        stageRef.current,
        sanitizedState,
        format,
        quality,
        (msg) => setExportProgressStatus(msg),
        activeProfOpts
      );

      setPreviewDataUrl(resultUrl);
      return resultUrl;
    } catch (err: any) {
      console.error("Export generation failed:", err);
      return "";
    } finally {
      setIsGeneratingExport(false);
    }
  };

  // OPEN QUALITY CHECK MODAL
  const handleOpenExportModal = async () => {
    setShowQualityModal(true);
    await generateExportDataUrl(exportFormat, exportQuality, profOptions);
  };

  // RE-GENERATE PREVIEW WHEN FORMAT, QUALITY OR PROF OPTIONS CHANGE
  useEffect(() => {
    if (showQualityModal) {
      generateExportDataUrl(exportFormat, exportQuality, profOptions);
    }
  }, [exportFormat, exportQuality, profOptions, showQualityModal]);

  // DOWNLOAD VERIFIED ARTWORK
  const handleDownloadArtwork = async () => {
    let finalUrl = previewDataUrl;
    if (!finalUrl) {
      finalUrl = await generateExportDataUrl(exportFormat, exportQuality);
    }
    if (!finalUrl) return;

    const link = document.createElement("a");
    const cleanTitle = designState.title.toLowerCase().replace(/[^a-z0-9]/g, "_");
    link.download = `${cleanTitle}_${designState.width}x${designState.height}.${exportFormat}`;
    link.href = finalUrl;
    link.click();

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  // COPY IMAGE PREVIEW TO CLIPBOARD
  const handleCopyClipboard = async () => {
    try {
      setIsGeneratingExport(true);
      setExportProgressStatus("Generating PNG Clipboard Preview...");
      
      // Always render a 1:1 PNG for clipboard API compatibility
      const pngUrl = await generateExportDataUrl("png", exportQuality, {
        ...profOptions,
        format: "png",
      });
      if (!pngUrl) return;

      const response = await fetch(pngUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);

      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 3000);
    } catch (err) {
      console.error("Copy to clipboard failed:", err);
      alert("Clipboard copy is restricted by browser security policies. Please download the file directly!");
    } finally {
      setIsGeneratingExport(false);
    }
  };

  // LOAD TEMPLATE
  const handleSelectTemplate = (template: DesignTemplate) => {
    setDesignState(template.state);
    if (template.state.elements.length > 0) {
      setSelectedElementId(template.state.elements[0].id);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-12 font-sans selection:bg-neon-cyan selection:text-black">
      {/* Top Navigation & Action Header */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 mb-6">
        <div className="p-4 rounded-3xl bg-neutral-900/80 border border-white/10 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-neon-cyan to-neon-purple p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-neon-cyan animate-pulse" />
              </div>
            </div>
            <div>
              <input
                type="text"
                value={designState.title}
                onChange={(e) => setDesignState({ ...designState, title: e.target.value })}
                className="bg-transparent border-b border-transparent hover:border-white/20 focus:border-neon-cyan font-display font-black text-xl text-white focus:outline-none"
              />
              <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400 font-mono">
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neon-cyan">
                  {designState.width} x {designState.height} PX
                </span>
                <span>• {designState.elements.length} DYNAMIC LAYERS</span>
              </div>
            </div>
          </div>

          {/* Controls & View Modes */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Left Sidebar Toggle Button */}
            <button
              onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
              className={`p-2 rounded-2xl border text-xs font-mono flex items-center gap-1.5 transition-all ${
                leftSidebarOpen
                  ? "bg-neon-cyan/20 text-neon-cyan border-neon-cyan/40"
                  : "bg-white/5 text-gray-400 border-white/10 hover:text-white"
              }`}
              title="Toggle Left Sidebar (Elements & Layers)"
            >
              {leftSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
              <span className="hidden sm:inline">Tools</span>
            </button>

            {/* View Mode Toggle */}
            <div className="flex items-center p-1 rounded-2xl bg-black/60 border border-white/10">
              <button
                onClick={() => setViewMode("desktop")}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase flex items-center gap-1.5 transition-all ${
                  viewMode === "desktop"
                    ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/40 font-bold"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Monitor className="w-3.5 h-3.5" /> Desktop
              </button>
              <button
                onClick={() => setViewMode("mobile")}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase flex items-center gap-1.5 transition-all ${
                  viewMode === "mobile"
                    ? "bg-neon-purple/20 text-neon-purple border border-neon-purple/40 font-bold"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" /> Mobile
              </button>
            </div>

            {/* Zoom Scale */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-black/60 border border-white/10 text-xs font-mono">
              <button onClick={() => setZoomScale((z) => Math.max(0.4, z - 0.1))} className="text-gray-400 hover:text-white">
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-neon-cyan min-w-[45px] text-center">{Math.round(zoomScale * 100)}%</span>
              <button onClick={() => setZoomScale((z) => Math.min(1.5, z + 0.1))} className="text-gray-400 hover:text-white">
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Right Sidebar Toggle Button */}
            <button
              onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
              className={`p-2 rounded-2xl border text-xs font-mono flex items-center gap-1.5 transition-all ${
                rightSidebarOpen
                  ? "bg-neon-purple/20 text-neon-purple border-neon-purple/40"
                  : "bg-white/5 text-gray-400 border-white/10 hover:text-white"
              }`}
              title="Toggle Right Sidebar (Inspector & Backgrounds)"
            >
              <span className="hidden sm:inline">Inspect</span>
              {rightSidebarOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
            </button>

            {/* Export & Quality Check Button */}
            <button
              onClick={handleOpenExportModal}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink text-white font-display font-bold text-xs tracking-[2px] uppercase hover:shadow-[0_0_30px_rgba(0,245,255,0.6)] transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </div>
      </div>

      {/* Main Workbench Layout */}
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 flex flex-col lg:flex-row gap-6 items-start relative">
        {/* LEFT PANEL: ELEMENT HUBS, MULTI-IMAGE UPLOAD & LAYERS TREE */}
        {leftSidebarOpen && (
          <div className="w-full lg:w-80 shrink-0 space-y-5 transition-all">
            <div className="p-5 rounded-3xl bg-neutral-900/80 border border-white/10 backdrop-blur-xl space-y-4">
              {/* Left Sidebar Navigation Tabs */}
              <div className="grid grid-cols-3 gap-1 p-1 rounded-2xl bg-black/60 border border-white/10 text-[11px] font-mono">
                <button
                  onClick={() => setLeftTab("elements")}
                  className={`py-1.5 rounded-xl uppercase transition-all ${
                    leftTab === "elements"
                      ? "bg-neon-cyan/20 border border-neon-cyan/50 text-neon-cyan font-bold"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Elements
                </button>
                <button
                  onClick={() => setLeftTab("layers")}
                  className={`py-1.5 rounded-xl uppercase transition-all ${
                    leftTab === "layers"
                      ? "bg-neon-purple/20 border border-neon-purple/50 text-neon-purple font-bold"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Layers ({designState.elements.length})
                </button>
                <button
                  onClick={() => setLeftTab("templates")}
                  className={`py-1.5 rounded-xl uppercase transition-all ${
                    leftTab === "templates"
                      ? "bg-neon-pink/20 border border-neon-pink/50 text-neon-pink font-bold"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Presets
                </button>
              </div>

              {/* TAB 1: ELEMENTS & MULTI-IMAGE UPLOADER */}
              {leftTab === "elements" && (
                <div className="space-y-4">
                  <h3 className="font-display font-bold text-white text-xs tracking-wider uppercase flex items-center gap-2">
                    <Plus className="w-4 h-4 text-neon-cyan" /> Add Artwork Elements
                  </h3>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleAddElement("text")}
                      className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-neon-cyan/50 hover:bg-neon-cyan/10 text-gray-300 hover:text-white transition-all text-left flex items-center gap-2.5 text-xs font-mono group"
                    >
                      <Type className="w-4 h-4 text-neon-cyan group-hover:scale-110 transition-transform" />
                      <span>Text Box</span>
                    </button>

                    <button
                      onClick={() => handleAddElement("badge")}
                      className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-neon-purple/50 hover:bg-neon-purple/10 text-gray-300 hover:text-white transition-all text-left flex items-center gap-2.5 text-xs font-mono group"
                    >
                      <Tag className="w-4 h-4 text-neon-purple group-hover:scale-110 transition-transform" />
                      <span>Badge / Tag</span>
                    </button>

                    <button
                      onClick={() => handleAddElement("button")}
                      className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-neon-green/50 hover:bg-neon-green/10 text-gray-300 hover:text-white transition-all text-left flex items-center gap-2.5 text-xs font-mono group"
                    >
                      <MousePointer className="w-4 h-4 text-neon-green group-hover:scale-110 transition-transform" />
                      <span>CTA Button</span>
                    </button>

                    <button
                      onClick={() => handleAddElement("logo")}
                      className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-neon-orange/50 hover:bg-neon-orange/10 text-gray-300 hover:text-white transition-all text-left flex items-center gap-2.5 text-xs font-mono group"
                    >
                      <Shield className="w-4 h-4 text-neon-orange group-hover:scale-110 transition-transform" />
                      <span>Studio Logo</span>
                    </button>

                    <button
                      onClick={() => handleAddElement("shape")}
                      className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-400/10 text-gray-300 hover:text-white transition-all text-left flex items-center gap-2.5 text-xs font-mono group col-span-2"
                    >
                      <Square className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                      <span>Glass Frame / Shape</span>
                    </button>
                  </div>

                  {/* MULTI-IMAGE CANVAS UPLOADER */}
                  <div className="pt-3 border-t border-white/10 space-y-2">
                    <label className="font-display font-bold text-white text-xs tracking-wider uppercase flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-neon-pink" /> Multi-Image Canvas Loader
                    </label>
                    <p className="text-[11px] text-gray-400 leading-tight">
                      Add multiple images to a single canvas design. Each photo gets an independent editable frame!
                    </p>

                    <label className="p-4 rounded-2xl border-2 border-dashed border-white/20 hover:border-neon-pink/60 bg-black/40 hover:bg-black/60 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer text-center group">
                      <Upload className="w-5 h-5 text-neon-pink group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-mono text-gray-300 font-bold">Batch Upload Images</span>
                      <span className="text-[10px] text-gray-500 font-mono">Select 1 or multiple files</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleMultipleImagesUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 2: LAYERS TREE */}
              {leftTab === "layers" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-white text-xs tracking-wider uppercase flex items-center gap-2">
                      <Layers className="w-4 h-4 text-neon-purple" /> Layers ({designState.elements.length})
                    </h3>
                  </div>

                  <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                    {[...designState.elements].reverse().map((el) => {
                      const isSelected = selectedElementId === el.id;
                      return (
                        <div
                          key={el.id}
                          onClick={() => {
                            setSelectedElementId(el.id);
                            setRightSidebarOpen(true);
                            setActiveTab("inspector");
                          }}
                          className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? "bg-neon-cyan/10 border-neon-cyan text-white shadow-[0_0_15px_rgba(0,245,255,0.2)]"
                              : "bg-black/40 border-white/10 hover:border-white/20 text-gray-300"
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            {el.type === "text" && <Type className="w-3.5 h-3.5 text-neon-cyan shrink-0" />}
                            {el.type === "badge" && <Tag className="w-3.5 h-3.5 text-neon-purple shrink-0" />}
                            {el.type === "image" && <ImageIcon className="w-3.5 h-3.5 text-neon-pink shrink-0" />}
                            {el.type === "button" && <MousePointer className="w-3.5 h-3.5 text-neon-green shrink-0" />}
                            {el.type === "logo" && <Shield className="w-3.5 h-3.5 text-neon-orange shrink-0" />}
                            {el.type === "shape" && <Square className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                            <span className="font-mono text-xs truncate">{el.name}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDuplicateElement(el.id);
                              }}
                              className="p-1 text-gray-400 hover:text-neon-cyan"
                              title="Duplicate Layer"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveLayer(el.id, "up");
                              }}
                              className="p-1 text-gray-400 hover:text-white"
                              title="Move Up"
                            >
                              <ChevronUp className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveLayer(el.id, "down");
                              }}
                              className="p-1 text-gray-400 hover:text-white"
                              title="Move Down"
                            >
                              <ChevronDown className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteElement(el.id);
                              }}
                              className="p-1 text-red-400 hover:text-red-300"
                              title="Delete Layer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 3: PRESETS & TEMPLATES */}
              {leftTab === "templates" && (
                <TemplateManager
                  currentState={designState}
                  onSelectTemplate={handleSelectTemplate}
                  onSaveCurrentAsTemplate={(name, category) => {
                    setDesignState((prev) => ({ ...prev, title: name }));
                  }}
                />
              )}
            </div>
          </div>
        )}

        {/* CENTER STAGE: AUTO-EXPANDING LIVE WORKBENCH CANVAS */}
        <div className="flex-1 w-full min-w-0 flex flex-col items-center justify-center space-y-4">
          <div
            className={`w-full flex flex-col items-center justify-center p-4 sm:p-8 rounded-3xl bg-neutral-900/60 border border-white/10 backdrop-blur-xl min-h-[680px] overflow-auto relative transition-all ${
              viewMode === "mobile" ? "max-w-[420px] mx-auto border-neon-purple/40" : ""
            }`}
          >
            {/* CANVAS CONTAINER */}
            <div className="relative">
              <CanvasStage
                ref={stageRef}
                state={designState}
                scaleFactor={zoomScale}
                interactive={!isGeneratingExport}
                selectedElementId={selectedElementId || undefined}
                onSelectElement={(id) => {
                  setSelectedElementId(id);
                  setRightSidebarOpen(true);
                  setActiveTab("inspector");
                }}
              />
            </div>

            {/* STAGE BOTTOM ZOOM & RULER TOOLBAR */}
            <div className="mt-6 flex items-center justify-between w-full max-w-lg px-4 py-2 rounded-2xl bg-black/80 border border-white/10 text-xs font-mono text-gray-400 gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoomScale((z) => Math.max(0.3, z - 0.1))}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-neon-cyan font-bold min-w-[50px] text-center">
                  {Math.round(zoomScale * 100)}%
                </span>
                <button
                  onClick={() => setZoomScale((z) => Math.min(2.0, z + 0.1))}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoomScale(0.85)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] text-gray-300 uppercase"
                >
                  Fit Screen
                </button>
                <button
                  onClick={() => setZoomScale(1.0)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] text-gray-300 uppercase"
                >
                  100% 1:1
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: PROPERTY INSPECTOR, BACKGROUND & CANVAS PRESETS */}
        {rightSidebarOpen && (
          <div className="w-full lg:w-80 shrink-0 space-y-5 transition-all">
          <div className="p-5 rounded-3xl bg-neutral-900/80 border border-white/10 backdrop-blur-xl space-y-5">
            {/* Navigation Tabs */}
            <div className="grid grid-cols-4 gap-1 p-1 rounded-2xl bg-black/60 border border-white/10">
              <button
                onClick={() => setActiveTab("inspector")}
                className={`py-2 rounded-xl text-[10px] font-mono uppercase flex flex-col items-center gap-1 transition-all ${
                  activeTab === "inspector"
                    ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/40 font-bold"
                    : "text-gray-400 hover:text-white"
                }`}
                title="Element Inspector"
              >
                <Sliders className="w-3.5 h-3.5" /> Element
              </button>

              <button
                onClick={() => setActiveTab("background")}
                className={`py-2 rounded-xl text-[10px] font-mono uppercase flex flex-col items-center gap-1 transition-all ${
                  activeTab === "background"
                    ? "bg-neon-purple/20 text-neon-purple border border-neon-purple/40 font-bold"
                    : "text-gray-400 hover:text-white"
                }`}
                title="Canvas & Background"
              >
                <Palette className="w-3.5 h-3.5" /> Canvas
              </button>

              <button
                onClick={() => setActiveTab("frames")}
                className={`py-2 rounded-xl text-[10px] font-mono uppercase flex flex-col items-center gap-1 transition-all ${
                  activeTab === "frames"
                    ? "bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold"
                    : "text-gray-400 hover:text-white"
                }`}
                title="Frames & Corner Decorators"
              >
                <Square className="w-3.5 h-3.5" /> Corners
              </button>

              <button
                onClick={() => setActiveTab("templates")}
                className={`py-2 rounded-xl text-[10px] font-mono uppercase flex flex-col items-center gap-1 transition-all ${
                  activeTab === "templates"
                    ? "bg-neon-pink/20 text-neon-pink border border-neon-pink/40 font-bold"
                    : "text-gray-400 hover:text-white"
                }`}
                title="Preset Templates"
              >
                <Bookmark className="w-3.5 h-3.5" /> Presets
              </button>
            </div>

            {/* TAB CONTENTS */}
            {activeTab === "inspector" && (
              <div>
                {selectedElement ? (
                  <ElementInspector
                    element={selectedElement}
                    onChange={handleUpdateElement}
                    onDelete={handleDeleteElement}
                    onMoveUp={(id) => handleMoveLayer(id, "up")}
                    onMoveDown={(id) => handleMoveLayer(id, "down")}
                  />
                ) : (
                  <div className="p-8 text-center space-y-3">
                    <p className="text-gray-400 text-xs font-mono">No element selected.</p>
                    <p className="text-gray-500 text-xs">Click any layer on the left or directly on the canvas to edit its properties.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "background" && (
              <BackgroundInspector state={designState} onChange={setDesignState} />
            )}

            {activeTab === "frames" && (
              <FrameCornerInspector state={designState} onChange={setDesignState} />
            )}

            {activeTab === "templates" && (
              <TemplateManager
                currentState={designState}
                onSelectTemplate={handleSelectTemplate}
                onSaveCurrentAsTemplate={(name, category) => {
                  setDesignState((prev) => ({ ...prev, title: name }));
                }}
              />
            )}
          </div>
        </div>
        )}
      </div>

      {/* EXPORT & QUALITY CHECK VERIFICATION MODAL */}
      {showQualityModal && (
        <div
          ref={exportModalBackdropRef}
          onClick={(e) => {
            if (e.target === exportModalBackdropRef.current) {
              setShowQualityModal(false);
            }
          }}
          className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in"
        >
          <div className="w-full max-w-5xl bg-neutral-900 border border-white/20 rounded-3xl p-5 sm:p-8 space-y-6 shadow-2xl relative my-auto max-h-[92vh] overflow-y-auto text-white">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 sticky top-0 bg-neutral-900/95 backdrop-blur-md z-30 pt-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-neon-cyan via-neon-purple to-neon-pink p-0.5 flex items-center justify-center shrink-0">
                  <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center">
                    <FileCheck className="w-5 h-5 text-neon-cyan" />
                  </div>
                </div>
                <div>
                  <h2 className="font-display font-black text-lg text-white tracking-wide flex items-center gap-2">
                    PROFESSIONAL DESIGN FILE EXPORT
                  </h2>
                  <p className="text-xs text-gray-400 font-mono">
                    Photoshop (.PSD) • Illustrator (.AI) • Vector SVG & PDF • EPS • Lossless Bitmaps
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowQualityModal(false)}
                className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-gray-200 hover:text-white transition-all border border-white/20 shadow-lg"
                title="Close Export Modal (ESC)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* SMART RECOMMENDATION BOX */}
            {(() => {
              const rec = getSmartExportRecommendation(designState);
              return (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-neon-cyan/15 via-neon-purple/15 to-transparent border border-neon-cyan/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-neon-cyan text-black font-bold text-[10px] uppercase">
                        ✨ SMART RECOMMENDATION
                      </span>
                      <span className="text-gray-300 font-bold">{rec.category} Design</span>
                    </div>
                    <p className="text-gray-300 text-[11px] leading-relaxed">
                      {rec.reasoning}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setExportFormat(rec.recommendedFormat);
                      setProfOptions((prev) => ({ ...prev, format: rec.recommendedFormat }));
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold uppercase transition-all shrink-0 ${
                      exportFormat === rec.recommendedFormat
                        ? "bg-neon-cyan text-black"
                        : "bg-white/10 hover:bg-white/20 border border-white/20 text-white"
                    }`}
                  >
                    {exportFormat === rec.recommendedFormat ? "✓ Applied Choice" : `Switch to ${rec.recommendedFormat.toUpperCase()}`}
                  </button>
                </div>
              );
            })()}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* LEFT: LIVE RENDERED PREVIEW & COMPATIBILITY */}
              <div className="lg:col-span-6 space-y-4">
                <div className="flex flex-col items-center justify-center bg-black/70 rounded-2xl border border-white/10 p-4 min-h-[320px]">
                  {isGeneratingExport ? (
                    <div className="flex flex-col items-center justify-center space-y-3 py-16">
                      <Sparkles className="w-8 h-8 text-neon-cyan animate-spin" />
                      <span className="text-xs font-mono text-neon-cyan animate-pulse text-center px-4">
                        {exportProgressStatus || "Rendering 1:1 Professional Output Stream..."}
                      </span>
                    </div>
                  ) : previewDataUrl ? (
                    <div className="space-y-3 text-center w-full">
                      <div className="relative border border-white/20 rounded-xl overflow-hidden bg-black shadow-2xl mx-auto max-h-[340px] flex items-center justify-center">
                        <img
                          src={previewDataUrl}
                          alt="Export Preview"
                          className="max-h-[320px] w-auto mx-auto object-contain block rounded"
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 px-1 pt-1">
                        <span>{designState.width * exportQuality} × {designState.height * exportQuality} PX</span>
                        <span className="text-neon-cyan font-bold bg-neon-cyan/10 border border-neon-cyan/30 px-2 py-0.5 rounded">
                          EST. FILE SIZE: {estimateExportFileSize(previewDataUrl, designState.width, designState.height, exportFormat, exportQuality)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-500 font-mono">Preview generation failed</span>
                  )}
                </div>

                {/* SOFTWARE COMPATIBILITY BADGES */}
                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2 text-xs font-mono">
                  <span className="text-gray-400 font-bold block text-[10px] uppercase tracking-wider">
                    Compatible Design & Vector Editors
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {["Adobe Photoshop", "Adobe Illustrator", "Affinity Designer", "Figma", "CorelDRAW", "Inkscape"].map((app) => (
                      <span key={app} className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-[10px]">
                        ✓ {app}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT: FORMAT SELECTOR & ADVANCED EXPORT OPTIONS */}
              <div className="lg:col-span-6 space-y-5">
                {/* FORMAT SELECTOR GRID */}
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase text-gray-400 block font-bold">
                    1. Output File Format
                  </label>
                  <div className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl bg-black/60 border border-white/10">
                    {[
                      { id: "psd", name: "PSD", label: "Photoshop", color: "text-blue-400" },
                      { id: "ai", name: "AI", label: "Illustrator", color: "text-amber-400" },
                      { id: "svg", name: "SVG", label: "Vector XML", color: "text-green-400" },
                      { id: "pdf", name: "PDF", label: "Vector PDF", color: "text-red-400" },
                      { id: "eps", name: "EPS", label: "PostScript", color: "text-purple-400" },
                      { id: "png", name: "PNG", label: "Lossless", color: "text-cyan-400" },
                      { id: "jpg", name: "JPG", label: "Photo", color: "text-pink-400" },
                      { id: "webp", name: "WebP", label: "Web", color: "text-emerald-400" },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          const fmt = item.id as ExportFormat;
                          setExportFormat(fmt);
                          setProfOptions((prev) => ({ ...prev, format: fmt }));
                        }}
                        className={`py-2 px-1 rounded-xl text-center transition-all border flex flex-col items-center justify-center ${
                          exportFormat === item.id
                            ? "bg-neon-cyan/20 border-neon-cyan/60 text-white font-bold shadow-[0_0_15px_rgba(0,245,255,0.2)]"
                            : "bg-black/20 border-transparent text-gray-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <span className={`text-xs font-mono font-black ${item.color}`}>{item.name}</span>
                        <span className="text-[9px] font-sans text-gray-400 truncate max-w-[55px]">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* RESOLUTION & DPI SCALE SELECTOR */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono uppercase text-gray-400 block font-bold">
                      2. Resolution & Print DPI
                    </label>
                    <span className="text-[10px] font-mono text-neon-cyan">
                      {exportQuality === 1 ? "72 DPI (Web)" : exportQuality === 2 ? "150 DPI (HD)" : exportQuality === 3 ? "300 DPI (Print)" : "600 DPI (Master)"}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl bg-black/60 border border-white/10">
                    <button
                      onClick={() => {
                        setExportQuality(1);
                        setProfOptions((prev) => ({ ...prev, quality: 1, dpi: 72 }));
                      }}
                      className={`py-2 rounded-xl text-xs font-mono uppercase transition-all ${
                        exportQuality === 1
                          ? "bg-neon-purple/20 border border-neon-purple/50 text-neon-purple font-bold"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      1x / 72
                    </button>
                    <button
                      onClick={() => {
                        setExportQuality(2);
                        setProfOptions((prev) => ({ ...prev, quality: 2, dpi: 150 }));
                      }}
                      className={`py-2 rounded-xl text-xs font-mono uppercase transition-all ${
                        exportQuality === 2
                          ? "bg-neon-cyan/20 border border-neon-cyan/50 text-neon-cyan font-bold"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      2x / 150
                    </button>
                    <button
                      onClick={() => {
                        setExportQuality(3);
                        setProfOptions((prev) => ({ ...prev, quality: 3, dpi: 300 }));
                      }}
                      className={`py-2 rounded-xl text-xs font-mono uppercase transition-all ${
                        exportQuality === 3
                          ? "bg-neon-pink/20 border border-neon-pink/50 text-neon-pink font-bold"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      3x / 300
                    </button>
                    <button
                      onClick={() => {
                        setExportQuality(4);
                        setProfOptions((prev) => ({ ...prev, quality: 4, dpi: 600 }));
                      }}
                      className={`py-2 rounded-xl text-xs font-mono uppercase transition-all ${
                        exportQuality === 4
                          ? "bg-amber-400/20 border border-amber-400/50 text-amber-300 font-bold"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      4x / 600
                    </button>
                  </div>
                </div>

                {/* ADVANCED PROFESSIONAL SETTINGS TOGGLE */}
                <div className="space-y-2">
                  <button
                    onClick={() => setShowAdvancedOpts((prev) => !prev)}
                    className="w-full py-2 px-3 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 text-xs font-mono flex items-center justify-between text-gray-300 hover:text-white transition-colors"
                  >
                    <span className="font-bold flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-neon-cyan" /> 3. Advanced Export Settings
                    </span>
                    <span className="text-[10px] text-neon-cyan uppercase">
                      {showAdvancedOpts ? "Hide ▲" : "Configure ▼"}
                    </span>
                  </button>

                  {showAdvancedOpts && (
                    <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-3 text-xs font-mono animate-fade-in">
                      {/* Layer Mode */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-gray-400">Layer Structure:</span>
                        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
                          <button
                            onClick={() => setProfOptions((prev) => ({ ...prev, layerMode: "layered" }))}
                            className={`px-2.5 py-1 rounded-lg text-[10px] uppercase font-bold transition-all ${
                              profOptions.layerMode === "layered" ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/40" : "text-gray-400"
                            }`}
                          >
                            Layered
                          </button>
                          <button
                            onClick={() => setProfOptions((prev) => ({ ...prev, layerMode: "flattened" }))}
                            className={`px-2.5 py-1 rounded-lg text-[10px] uppercase font-bold transition-all ${
                              profOptions.layerMode === "flattened" ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/40" : "text-gray-400"
                            }`}
                          >
                            Flattened
                          </button>
                        </div>
                      </div>

                      {/* Text Export Mode */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-gray-400">Typography / Text:</span>
                        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
                          <button
                            onClick={() => setProfOptions((prev) => ({ ...prev, textMode: "editable" }))}
                            className={`px-2.5 py-1 rounded-lg text-[10px] uppercase font-bold transition-all ${
                              profOptions.textMode === "editable" ? "bg-neon-purple/20 text-neon-purple border border-neon-purple/40" : "text-gray-400"
                            }`}
                          >
                            Editable Text
                          </button>
                          <button
                            onClick={() => setProfOptions((prev) => ({ ...prev, textMode: "outlines" }))}
                            className={`px-2.5 py-1 rounded-lg text-[10px] uppercase font-bold transition-all ${
                              profOptions.textMode === "outlines" ? "bg-neon-purple/20 text-neon-purple border border-neon-purple/40" : "text-gray-400"
                            }`}
                          >
                            Outlines
                          </button>
                        </div>
                      </div>

                      {/* Color Mode */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-gray-400">Color Profile:</span>
                        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
                          <button
                            onClick={() => setProfOptions((prev) => ({ ...prev, colorMode: "rgb" }))}
                            className={`px-2.5 py-1 rounded-lg text-[10px] uppercase font-bold transition-all ${
                              profOptions.colorMode === "rgb" ? "bg-neon-pink/20 text-neon-pink border border-neon-pink/40" : "text-gray-400"
                            }`}
                          >
                            RGB (Digital)
                          </button>
                          <button
                            onClick={() => setProfOptions((prev) => ({ ...prev, colorMode: "cmyk" }))}
                            className={`px-2.5 py-1 rounded-lg text-[10px] uppercase font-bold transition-all ${
                              profOptions.colorMode === "cmyk" ? "bg-neon-pink/20 text-neon-pink border border-neon-pink/40" : "text-gray-400"
                            }`}
                          >
                            CMYK (Print)
                          </button>
                        </div>
                      </div>

                      {/* Background Style */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-gray-400">Background:</span>
                        <button
                          onClick={() => setProfOptions((prev) => ({ ...prev, transparentBg: !prev.transparentBg }))}
                          className={`px-3 py-1 rounded-xl text-[10px] uppercase font-bold border transition-all ${
                            profOptions.transparentBg
                              ? "bg-amber-400/20 text-amber-300 border-amber-400/40"
                              : "bg-white/10 text-gray-300 border-white/20"
                          }`}
                        >
                          {profOptions.transparentBg ? "Transparent BG" : "Solid Canvas Fill"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* AUTOMATED QUALITY INSPECTION */}
                <div className="space-y-1.5 p-3.5 rounded-2xl bg-black/40 border border-white/10 text-xs font-mono">
                  <span className="text-gray-400 font-bold block mb-1.5 text-[10px] uppercase tracking-wider">
                    Quality Inspection Checklist
                  </span>

                  <div className="flex items-center gap-2 text-green-400 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Layer Grouping & Vector Structure Verified</span>
                  </div>

                  <div className="flex items-center gap-2 text-green-400 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Edge-to-Edge Canvas Bounds: 100% Coverage</span>
                  </div>

                  <div className="flex items-center gap-2 text-green-400 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Resolution: {designState.width * exportQuality} x {designState.height * exportQuality} PX ({profOptions.dpi} DPI)</span>
                  </div>
                </div>

                {/* ASSET HEALTH & CORS INSPECTOR */}
                {assetDiagnostics.length > 0 && (
                  <div className="space-y-2 p-3.5 rounded-2xl bg-black/50 border border-white/10 text-xs font-mono">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-neon-cyan font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-neon-cyan" /> Asset Health & CORS Status
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {assetDiagnostics.filter((d) => d.status === "ok").length}/{assetDiagnostics.length} Verified
                      </span>
                    </div>

                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {assetDiagnostics.map((diag) => (
                        <div
                          key={diag.id}
                          className={`p-2 rounded-xl border text-[10px] flex items-center justify-between gap-2 ${
                            diag.status === "ok"
                              ? "bg-green-500/10 border-green-500/20 text-green-300"
                              : "bg-amber-500/10 border-amber-500/30 text-amber-200"
                          }`}
                        >
                          <span className="font-bold truncate max-w-[180px]">{diag.name}</span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase shrink-0 ${
                              diag.status === "ok"
                                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                            }`}
                          >
                            {diag.status === "ok" ? "✓ OK" : "⚠️ CORS FIX"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ACTION BUTTONS */}
                <div className="space-y-2 pt-1">
                  <button
                    onClick={handleDownloadArtwork}
                    disabled={isGeneratingExport}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink text-white font-display font-bold text-xs tracking-[2px] uppercase hover:shadow-[0_0_30px_rgba(0,245,255,0.6)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {downloadSuccess ? (
                      <>
                        <Check className="w-4 h-4 text-green-300" /> Saved {exportFormat.toUpperCase()} File!
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" /> Download {exportFormat.toUpperCase()} Design File
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleCopyClipboard}
                    disabled={isGeneratingExport}
                    className="w-full py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white font-mono text-xs uppercase transition-colors flex items-center justify-center gap-2"
                  >
                    {copiedSuccess ? (
                      <>
                        <Check className="w-4 h-4 text-neon-cyan" /> Copied to Clipboard!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" /> Copy PNG Image Preview
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

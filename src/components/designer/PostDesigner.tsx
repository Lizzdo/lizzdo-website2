import React, { useState, useRef, useEffect, useCallback } from "react";
import { useStudio } from "../../context/StudioContext";
import { getStorageItem, setStorageItem } from "../../utils/storage";
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
import { Canvas } from "./Canvas";
import { PrepareExportModal } from "./PrepareExportModal";
import { ShortcutsModal } from "./ShortcutsModal";
import { VersionHistoryModal } from "./VersionHistoryModal";
import { ImageCropperModal } from "./ImageCropperModal";
import { ElementInspector } from "./ElementInspector";
import { BackgroundInspector } from "./BackgroundInspector";
import { FrameCornerInspector } from "./FrameCornerInspector";
import { TemplateManager } from "./TemplateManager";
import { LayersPanel } from "./LayersPanel";
import { TopMenuBar } from "./TopMenuBar";
import { LeftToolRail, ToolMode } from "./LeftToolRail";
import { ExpandedLeftSidebar } from "./ExpandedLeftSidebar";
import { BottomStatusBar } from "./BottomStatusBar";
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
  Maximize2,
  Minimize2,
  Layout,
  RefreshCw,
} from "lucide-react";

export default function PostDesigner() {
  const { currentProject, updateProject, exportProjectJSON } = useStudio();

  const getInitialDesign = (): DesignState => {
    if (currentProject && currentProject.data) {
      return {
        ...DEFAULT_DESIGN_STATE,
        ...currentProject.data,
        id: currentProject.id || DEFAULT_DESIGN_STATE.id,
        title: currentProject.title || DEFAULT_DESIGN_STATE.title,
        width: currentProject.width || currentProject.data.width || 1200,
        height: currentProject.height || currentProject.data.height || 1200,
      };
    }
    const saved = getStorageItem("lizzdo_current_design_project");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.elements) return parsed;
      } catch (e) {}
    }
    return DEFAULT_DESIGN_STATE;
  };

  const [designState, setDesignState] = useState<DesignState>(getInitialDesign);
  
  // HISTORY UNDO/REDO STACK
  const [historyStack, setHistoryStack] = useState<DesignState[]>([getInitialDesign()]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const updateStateAndHistory = useCallback((newState: DesignState) => {
    setDesignState(newState);
    setHistoryStack((prev) => {
      const sliced = prev.slice(0, historyIndex + 1);
      return [...sliced, newState];
    });
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setDesignState(historyStack[prevIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < historyStack.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setDesignState(historyStack[nextIndex]);
    }
  };

  const [selectedElementId, setSelectedElementId] = useState<string | null>("el-title-1");
  const [activeRightTab, setActiveRightTab] = useState<"inspector" | "background" | "frames" | "layers">("inspector");
  const [activeTool, setActiveTool] = useState<ToolMode>("select");
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [zoomScale, setZoomScale] = useState<number>(0.85);

  // SIDEBAR COLLAPSIBLE STATES
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // MOUSE POSITION ON CANVAS
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // MULTI-PAGE / ARTBOARD STATE
  const [activePage, setActivePage] = useState<number>(1);
  const [pageCount, setPageCount] = useState<number>(1);

  // EXPORT & QUALITY CHECK MODAL STATE
  const [showQualityModal, setShowQualityModal] = useState<boolean>(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState<boolean>(false);
  const [showSnapshotsModal, setShowSnapshotsModal] = useState<boolean>(false);
  const [showCropperModal, setShowCropperModal] = useState<boolean>(false);
  const [autosaveNotice, setAutosaveNotice] = useState<boolean>(false);

  // AUTOSAVE PROJECT STATE TO STUDIO CONTEXT & LOCALSTORAGE
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        setStorageItem("lizzdo_current_design_project", JSON.stringify(designState));
        if (currentProject?.id) {
          updateProject(currentProject.id, {
            data: designState,
            width: designState.width,
            height: designState.height,
            title: designState.title,
          });
        }
        setAutosaveNotice(true);
        const hideTimer = setTimeout(() => setAutosaveNotice(false), 1500);
        return () => clearTimeout(hideTimer);
      } catch (e) {
        console.error("Autosave failed", e);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [designState, currentProject?.id, updateProject]);

  // RESTORE AUTOSAVED PROJECT ON FIRST LOAD
  useEffect(() => {
    const saved = getStorageItem("lizzdo_current_design_project");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.elements) {
          setDesignState(parsed);
          setHistoryStack([parsed]);
          if (parsed.elements.length > 0) {
            setSelectedElementId(parsed.elements[0].id);
          }
        }
      } catch (e) {
        console.error("Restore failed", e);
      }
    }
  }, []);

  // GLOBAL KEYBOARD SHORTCUTS
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isInputFocused =
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          (activeElement as HTMLElement).isContentEditable);

      if (isInputFocused) return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        handleRedo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "d") {
        e.preventDefault();
        if (selectedElementId) handleDuplicateElement(selectedElementId);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        setShowSnapshotsModal(true);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a") {
        e.preventDefault();
        if (designState.elements.length > 0) {
          setSelectedElementId(designState.elements[0].id);
        }
      } else if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedElementId) {
          e.preventDefault();
          handleDeleteElement(selectedElementId);
        }
      } else if (e.key === "Escape") {
        setSelectedElementId(null);
        setShowShortcutsModal(false);
        setShowSnapshotsModal(false);
      } else if (e.key === "?") {
        e.preventDefault();
        setShowShortcutsModal(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [designState, selectedElementId, historyIndex, historyStack]);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("png");
  const [exportQuality, setExportQuality] = useState<ExportQuality>(2);
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
  const workspaceRef = useRef<HTMLDivElement>(null);
  const exportModalBackdropRef = useRef<HTMLDivElement>(null);

  // FULLSCREEN TOGGLE HANDLER
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      workspaceRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // BODY SCROLL LOCK FOR EXPORT MODAL
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

  // SELECTED ELEMENT HELPER
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
          y: 40 + ((designState.elements.length * 5) % 40),
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

    const updated = {
      ...designState,
      elements: [...designState.elements, newEl],
    };
    updateStateAndHistory(updated);
    setSelectedElementId(id);
    setActiveRightTab("inspector");
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

          setDesignState((prev) => {
            const updated = {
              ...prev,
              elements: [...prev.elements, newEl],
            };
            return updated;
          });
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
    const updated = {
      ...designState,
      elements: [...designState.elements, duplicated],
    };
    updateStateAndHistory(updated);
    setSelectedElementId(newId);
  };

  // UPDATE ELEMENT
  const handleUpdateElement = (updated: CanvasElement) => {
    const updatedState = {
      ...designState,
      elements: designState.elements.map((el) => (el.id === updated.id ? updated : el)),
    };
    setDesignState(updatedState);
  };

  // DELETE ELEMENT
  const handleDeleteElement = (id: string) => {
    const updated = {
      ...designState,
      elements: designState.elements.filter((el) => el.id !== id),
    };
    updateStateAndHistory(updated);
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  };

  // MOVE LAYER Z-INDEX UP/DOWN/TOP/BOTTOM & REORDER
  const handleMoveLayer = (id: string, direction: "up" | "down") => {
    const idx = designState.elements.findIndex((el) => el.id === id);
    if (idx === -1) return;
    const targetIdx = direction === "up" ? idx + 1 : idx - 1;
    if (targetIdx < 0 || targetIdx >= designState.elements.length) return;

    const newElements = [...designState.elements];
    const temp = newElements[idx];
    newElements[idx] = newElements[targetIdx];
    newElements[targetIdx] = temp;

    const updated = {
      ...designState,
      elements: newElements.map((el, i) => ({ ...el, zIndex: (i + 1) * 5 })),
    };
    updateStateAndHistory(updated);
  };

  const handleMoveLayerToTop = (id: string) => {
    const idx = designState.elements.findIndex((el) => el.id === id);
    if (idx === -1 || idx === designState.elements.length - 1) return;
    const item = designState.elements[idx];
    const rest = designState.elements.filter((el) => el.id !== id);
    const newElements = [...rest, item].map((el, i) => ({ ...el, zIndex: (i + 1) * 5 }));
    updateStateAndHistory({ ...designState, elements: newElements });
  };

  const handleMoveLayerToBottom = (id: string) => {
    const idx = designState.elements.findIndex((el) => el.id === id);
    if (idx === -1 || idx === 0) return;
    const item = designState.elements[idx];
    const rest = designState.elements.filter((el) => el.id !== id);
    const newElements = [item, ...rest].map((el, i) => ({ ...el, zIndex: (i + 1) * 5 }));
    updateStateAndHistory({ ...designState, elements: newElements });
  };

  const handleReorderLayers = (draggedId: string, targetId: string) => {
    const draggedIdx = designState.elements.findIndex((el) => el.id === draggedId);
    const targetIdx = designState.elements.findIndex((el) => el.id === targetId);
    if (draggedIdx === -1 || targetIdx === -1 || draggedIdx === targetIdx) return;

    const newElements = [...designState.elements];
    const [removed] = newElements.splice(draggedIdx, 1);
    newElements.splice(targetIdx, 0, removed);

    const updated = {
      ...designState,
      elements: newElements.map((el, i) => ({ ...el, zIndex: (i + 1) * 5 })),
    };
    updateStateAndHistory(updated);
  };

  // RELINK ASSET
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

  // GENERATE EXPORT DATA URL
  const generateExportDataUrl = async (
    format: ExportFormat = exportFormat,
    quality: ExportQuality = exportQuality,
    customProfOpts?: ProfessionalExportOptions
  ): Promise<string> => {
    setIsGeneratingExport(true);
    setExportProgressStatus("Rendering Artwork Preview...");

    const activeProfOpts = customProfOpts || {
      ...profOptions,
      format,
      quality,
      dpi: (quality === 1 ? 72 : quality === 2 ? 150 : quality === 3 ? 300 : 600) as 72 | 150 | 300 | 600,
    };

    try {
      const { sanitizedState, diagnostics } = await prepareDesignStateForExport(designState);
      setAssetDiagnostics(diagnostics);

      // 1. Generate PNG visual preview for the modal image container
      const previewUrl = await renderArtworkFormat(
        stageRef.current,
        sanitizedState,
        "png",
        quality,
        (msg) => setExportProgressStatus(msg),
        { ...activeProfOpts, format: "png" }
      );

      setPreviewDataUrl(previewUrl);

      // 2. If target format is not PNG, generate target binary/vector format
      if (format !== "png") {
        const targetUrl = await renderArtworkFormat(
          stageRef.current,
          sanitizedState,
          format,
          quality,
          undefined,
          activeProfOpts
        );
        return targetUrl;
      }

      return previewUrl;
    } catch (err: any) {
      console.error("Export generation failed:", err);
      return "";
    } finally {
      setIsGeneratingExport(false);
    }
  };

  // OPEN QUALITY CHECK MODAL
  const handleOpenExportModal = () => {
    setShowQualityModal(true);
    setIsGeneratingExport(true);
    setExportProgressStatus("Rendering Artwork Preview...");
  };

  // RE-GENERATE PREVIEW WHEN FORMAT OR QUALITY CHANGES
  useEffect(() => {
    if (showQualityModal) {
      generateExportDataUrl(exportFormat, exportQuality);
    }
  }, [exportFormat, exportQuality, showQualityModal]);

  // DOWNLOAD ARTWORK
  const handleDownloadArtwork = async () => {
    if (!stageRef.current) return;
    setIsGeneratingExport(true);
    setExportProgressStatus(`Generating ${exportFormat.toUpperCase()} Download File...`);

    try {
      const { sanitizedState } = await prepareDesignStateForExport(designState);
      const activeProfOpts = {
        ...profOptions,
        format: exportFormat,
        quality: exportQuality,
        dpi: (exportQuality === 1 ? 72 : exportQuality === 2 ? 150 : exportQuality === 3 ? 300 : 600) as 72 | 150 | 300 | 600,
      };

      const finalUrl = await renderArtworkFormat(
        stageRef.current,
        sanitizedState,
        exportFormat,
        exportQuality,
        (msg) => setExportProgressStatus(msg),
        activeProfOpts
      );

      if (!finalUrl) return;

      const link = document.createElement("a");
      const cleanTitle = (designState.title || "artwork").toLowerCase().replace(/[^a-z0-9]/g, "_");
      link.download = `${cleanTitle}_${designState.width}x${designState.height}.${exportFormat}`;
      link.href = finalUrl;
      link.click();

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setIsGeneratingExport(false);
    }
  };

  // COPY IMAGE PREVIEW TO CLIPBOARD
  const handleCopyClipboard = async () => {
    try {
      setIsGeneratingExport(true);
      setExportProgressStatus("Generating PNG Clipboard Preview...");

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
    updateStateAndHistory(template.state);
    if (template.state.elements.length > 0) {
      setSelectedElementId(template.state.elements[0].id);
    }
  };

  // PRESET CANVAS FORMAT CHANGE
  const handlePresetChange = (presetId: string) => {
    const updated = { ...designState, preset: presetId };
    updateStateAndHistory(updated);
  };

  // TRACK MOUSE MOVEMENT ON CANVAS FOR BOTTOM STATUS BAR
  const handleMouseMoveCanvas = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    setMousePos({ x, y });
  };

  return (
    <div
      ref={workspaceRef}
      className={`w-full h-full bg-neutral-950 text-white flex flex-col select-none overflow-hidden font-sans relative ${
        theme === "light" ? "bg-gray-100 text-gray-900" : ""
      }`}
    >
      {/* 1. TOP MENU BAR */}
      <TopMenuBar
        title={designState.title}
        onTitleChange={(title) => updateStateAndHistory({ ...designState, title })}
        presetId={designState.preset}
        onPresetChange={handlePresetChange}
        zoomScale={zoomScale}
        onZoomChange={setZoomScale}
        leftSidebarOpen={leftSidebarOpen}
        onToggleLeftSidebar={() => setLeftSidebarOpen(!leftSidebarOpen)}
        rightSidebarOpen={rightSidebarOpen}
        onToggleRightSidebar={() => setRightSidebarOpen(!rightSidebarOpen)}
        onOpenExport={handleOpenExportModal}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < historyStack.length - 1}
        theme={theme}
        onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        onAddElement={handleAddElement}
        showGrid={designState.showGrid}
        showGuides={designState.showSafeMargins}
        onToggleGrid={() =>
          updateStateAndHistory({ ...designState, showGrid: !designState.showGrid })
        }
        onToggleGuides={() =>
          updateStateAndHistory({
            ...designState,
            showSafeMargins: !designState.showSafeMargins,
          })
        }
        onOpenShortcuts={() => setShowShortcutsModal(true)}
        onOpenSnapshots={() => setShowSnapshotsModal(true)}
      />

      {/* 2. MAIN FULL-SCREEN WORKSPACE BODY */}
      <div className="flex-1 flex min-h-0 relative overflow-hidden">
        {/* LEFT EDITING TOOL RAIL */}
        <LeftToolRail
          activeTool={activeTool}
          onSelectTool={setActiveTool}
          onAddElement={handleAddElement}
        />

        {/* EXPANDED LEFT SIDEBAR (Panels & Assets) */}
        {leftSidebarOpen && (
          <ExpandedLeftSidebar
            state={designState}
            onChangeState={updateStateAndHistory}
            selectedElementId={selectedElementId}
            onSelectElement={setSelectedElementId}
            onAddElement={handleAddElement}
            onMultipleImagesUpload={handleMultipleImagesUpload}
            onDuplicateElement={handleDuplicateElement}
            onDeleteElement={handleDeleteElement}
            onMoveLayer={handleMoveLayer}
            onSelectTemplate={handleSelectTemplate}
          />
        )}

        {/* CENTER STAGE CANVAS WORKSPACE */}
        <div
          onMouseMove={handleMouseMoveCanvas}
          className="flex-1 flex flex-col items-center justify-between p-4 overflow-auto relative bg-neutral-900/60 custom-scrollbar"
        >
          {/* ARTBOARD / PAGES TAB BAR */}
          <div className="flex items-center gap-2 bg-black/60 border border-white/10 rounded-2xl px-3 py-1.5 text-xs font-mono text-gray-400 z-10 shrink-0 mb-2">
            <span className="text-gray-500 font-bold uppercase text-[10px]">Artboard:</span>
            {Array.from({ length: pageCount }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActivePage(i + 1)}
                className={`px-2.5 py-1 rounded-xl uppercase transition-all ${
                  activePage === i + 1
                    ? "bg-neon-cyan/20 border border-neon-cyan/50 text-neon-cyan font-bold"
                    : "hover:bg-white/10 hover:text-white"
                }`}
              >
                Page {i + 1}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPageCount((c) => c + 1)}
              className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-neon-cyan"
              title="Add New Artboard Page"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* CANVAS CONTAINER */}
          <div className="flex-1 flex items-center justify-center relative w-full my-auto">
            <Canvas
              ref={stageRef}
              state={designState}
              scaleFactor={zoomScale}
              interactive={!isGeneratingExport}
              selectedElementId={selectedElementId || undefined}
              onSelectElement={(id) => {
                setSelectedElementId(id);
                setRightSidebarOpen(true);
                setActiveRightTab("inspector");
              }}
              onUpdateElement={(id, updates) => {
                const target = designState.elements.find((e) => e.id === id);
                if (target) handleUpdateElement({ ...target, ...updates });
              }}
              onZoomChange={setZoomScale}
              snapToGrid={designState.showGrid}
            />
          </div>
        </div>

        {/* RIGHT PROPERTY INSPECTOR SIDEBAR */}
        {rightSidebarOpen && (
          <div className="w-80 bg-neutral-900 border-l border-white/10 flex flex-col h-full overflow-hidden shrink-0 select-none z-20 text-xs font-sans">
            {/* INSPECTOR TAB HEADER */}
            <div className="grid grid-cols-4 gap-1 p-1.5 bg-black/60 border-b border-white/10 text-[10px] font-mono shrink-0">
              <button
                type="button"
                onClick={() => setActiveRightTab("inspector")}
                className={`py-2 rounded-xl uppercase transition-all flex flex-col items-center justify-center gap-1 ${
                  activeRightTab === "inspector"
                    ? "bg-neon-cyan/20 border border-neon-cyan/50 text-neon-cyan font-bold"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Element</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveRightTab("background")}
                className={`py-2 rounded-xl uppercase transition-all flex flex-col items-center justify-center gap-1 ${
                  activeRightTab === "background"
                    ? "bg-neon-purple/20 border border-neon-purple/50 text-neon-purple font-bold"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Canvas</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveRightTab("frames")}
                className={`py-2 rounded-xl uppercase transition-all flex flex-col items-center justify-center gap-1 ${
                  activeRightTab === "frames"
                    ? "bg-neon-pink/20 border border-neon-pink/50 text-neon-pink font-bold"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Corners</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveRightTab("layers")}
                className={`py-2 rounded-xl uppercase transition-all flex flex-col items-center justify-center gap-1 ${
                  activeRightTab === "layers"
                    ? "bg-amber-400/20 border border-amber-400/50 text-amber-300 font-bold"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Layers</span>
              </button>
            </div>

            {/* TAB CONTENT */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {activeRightTab === "inspector" && (
                <ElementInspector
                  element={selectedElement || null}
                  onChange={handleUpdateElement}
                  onDelete={handleDeleteElement}
                  onMoveUp={(id) => handleMoveLayer(id, "up")}
                  onMoveDown={(id) => handleMoveLayer(id, "down")}
                  onOpenCropper={() => setShowCropperModal(true)}
                />
              )}

              {activeRightTab === "background" && (
                <BackgroundInspector
                  state={designState}
                  onChange={(newState) => updateStateAndHistory(newState)}
                />
              )}

              {activeRightTab === "frames" && (
                <FrameCornerInspector
                  state={designState}
                  onChange={(newState) => updateStateAndHistory(newState)}
                />
              )}

              {activeRightTab === "layers" && (
                <LayersPanel
                  state={designState}
                  selectedElementId={selectedElementId}
                  onSelectElement={setSelectedElementId}
                  onUpdateElement={handleUpdateElement}
                  onDuplicateElement={handleDuplicateElement}
                  onDeleteElement={handleDeleteElement}
                  onMoveLayer={handleMoveLayer}
                  onMoveLayerToTop={handleMoveLayerToTop}
                  onMoveLayerToBottom={handleMoveLayerToBottom}
                  onReorderLayers={handleReorderLayers}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3. BOTTOM STATUS BAR */}
      <BottomStatusBar
        state={designState}
        selectedElement={selectedElement}
        zoomScale={zoomScale}
        mousePos={mousePos}
      />

      {/* 4. PREPARE EXPORT & FIDELITY MODAL */}
      <PrepareExportModal
        isOpen={showQualityModal}
        onClose={() => setShowQualityModal(false)}
        designState={designState}
      />

      {/* SHORTCUTS MODAL */}
      <ShortcutsModal
        isOpen={showShortcutsModal}
        onClose={() => setShowShortcutsModal(false)}
      />

      {/* VERSION HISTORY & SNAPSHOTS MODAL */}
      <VersionHistoryModal
        isOpen={showSnapshotsModal}
        onClose={() => setShowSnapshotsModal(false)}
        currentState={designState}
        onRestoreState={(restoredState) => updateStateAndHistory(restoredState)}
      />

      {/* NON-DESTRUCTIVE IMAGE CROPPER MODAL */}
      {selectedElement && selectedElement.type === "image" && (
        <ImageCropperModal
          isOpen={showCropperModal}
          onClose={() => setShowCropperModal(false)}
          element={selectedElement}
          onApplyCrop={(crop) => {
            handleUpdateElement({ ...selectedElement, crop });
            setShowCropperModal(false);
          }}
        />
      )}
    </div>
  );
}

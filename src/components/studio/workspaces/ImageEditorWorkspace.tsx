import React, { useState, useEffect, useCallback } from "react";
import { useStudio } from "../../../context/StudioContext";
import {
  ImageEditorTool,
  ColorAdjustments,
  TransformSettings,
  CropRect,
  ImageEffectSettings,
  BackgroundSettings,
  ImageLayer,
  ImageEditorHistorySnapshot,
} from "../../../types/imageEditor";
import {
  DEFAULT_ADJUSTMENTS,
  DEFAULT_TRANSFORM,
  DEFAULT_CROP,
  DEFAULT_EFFECTS,
  DEFAULT_BACKGROUND,
} from "../../../utils/imageProcessing";

import { ImageEditorToolbar } from "../image-editor/ImageEditorToolbar";
import { ImageEditorSidebar } from "../image-editor/ImageEditorSidebar";
import { ImageCanvas } from "../image-editor/ImageCanvas";
import { ExportModal } from "../image-editor/ExportModal";
import { ImageEditorHistoryPanel } from "../image-editor/ImageEditorHistoryPanel";

export function ImageEditorWorkspace() {
  const { createProject, currentProject, addNotification } = useStudio();

  const initialImg =
    currentProject?.data?.src ||
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80";

  const [activeImgUrl, setActiveImgUrl] = useState<string>(initialImg);
  const [activeTool, setActiveTool] = useState<ImageEditorTool>("adjust");

  // Canvas Dimensions
  const [canvasWidth] = useState(1200);
  const [canvasHeight] = useState(800);
  const [zoom, setZoom] = useState(0.85);

  // Canvas Display Toggles
  const [isPanMode, setIsPanMode] = useState(false);
  const [showRulers, setShowRulers] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [showSafeMargins, setShowSafeMargins] = useState(false);

  // Core Non-Destructive State
  const [adjustments, setAdjustments] = useState<ColorAdjustments>(DEFAULT_ADJUSTMENTS);
  const [transform, setTransform] = useState<TransformSettings>(DEFAULT_TRANSFORM);
  const [crop, setCrop] = useState<CropRect>(DEFAULT_CROP);
  const [effects, setEffects] = useState<ImageEffectSettings>(DEFAULT_EFFECTS);
  const [background, setBackground] = useState<BackgroundSettings>(DEFAULT_BACKGROUND);

  // Layers Stack
  const [layers, setLayers] = useState<ImageLayer[]>([
    {
      id: "primary-photo",
      name: "Primary Photo",
      type: "image",
      visible: true,
      locked: false,
      opacity: 1,
      blendMode: "source-over",
      x: 0,
      y: 0,
      width: 1200,
      height: 800,
      rotation: 0,
      src: initialImg,
    },
  ]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>("primary-photo");

  // Modals & Panels
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState(false);

  // Undo / Redo History Stack
  const [history, setHistory] = useState<ImageEditorHistorySnapshot[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Push History Snapshot
  const pushHistorySnapshot = useCallback(
    (description: string) => {
      const snapshot: ImageEditorHistorySnapshot = {
        id: `snap-${Date.now()}`,
        timestamp: Date.now(),
        description,
        layers,
        adjustments,
        transform,
        crop,
        effects,
        background,
        canvas: { width: canvasWidth, height: canvasHeight },
      };

      setHistory((prev) => {
        const sliced = prev.slice(0, historyIndex + 1);
        return [...sliced, snapshot];
      });
      setHistoryIndex((prev) => prev + 1);
    },
    [
      historyIndex,
      layers,
      adjustments,
      transform,
      crop,
      effects,
      background,
      canvasWidth,
      canvasHeight,
    ]
  );

  // Initial Snapshot
  useEffect(() => {
    if (history.length === 0) {
      pushHistorySnapshot("Initial Project Load");
    }
  }, []);

  // Undo / Redo Actions
  const handleUndo = () => {
    if (historyIndex > 0) {
      const targetIdx = historyIndex - 1;
      const snap = history[targetIdx];
      setLayers(snap.layers);
      setAdjustments(snap.adjustments);
      setTransform(snap.transform);
      setCrop(snap.crop);
      setEffects(snap.effects);
      setBackground(snap.background);
      setHistoryIndex(targetIdx);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const targetIdx = historyIndex + 1;
      const snap = history[targetIdx];
      setLayers(snap.layers);
      setAdjustments(snap.adjustments);
      setTransform(snap.transform);
      setCrop(snap.crop);
      setEffects(snap.effects);
      setBackground(snap.background);
      setHistoryIndex(targetIdx);
    }
  };

  const handleResetAll = () => {
    setAdjustments(DEFAULT_ADJUSTMENTS);
    setTransform(DEFAULT_TRANSFORM);
    setCrop(DEFAULT_CROP);
    setEffects(DEFAULT_EFFECTS);
    setBackground(DEFAULT_BACKGROUND);
    pushHistorySnapshot("Reset All Edits");
  };

  const handleApplyPresetFilter = (preset: string) => {
    if (preset === "cyberpunk") {
      setAdjustments((a) => ({ ...a, contrast: 25, saturation: 40, hue: -15 }));
      setEffects((e) => ({
        ...e,
        glow: { enabled: true, color: "#a855f7", radius: 20, intensity: 0.9 },
      }));
    } else if (preset === "vintage") {
      setAdjustments((a) => ({ ...a, temperature: 30, saturation: -20, contrast: 15 }));
      setEffects((e) => ({ ...e, sepia: 40 }));
    } else if (preset === "bw") {
      setEffects((e) => ({ ...e, blackAndWhite: true }));
    } else if (preset === "normal") {
      setAdjustments(DEFAULT_ADJUSTMENTS);
      setEffects(DEFAULT_EFFECTS);
    }
    pushHistorySnapshot(`Applied ${preset} preset`);
  };

  const handleSendToDesigner = () => {
    createProject("Retouched Image Project", "designer", {
      width: canvasWidth,
      height: canvasHeight,
      elements: layers.map((l) => ({
        id: l.id,
        type: l.type === "image" ? "image" : l.type === "text" ? "text" : "shape",
        name: l.name,
        x: l.x,
        y: l.y,
        width: l.width,
        height: l.height,
        rotation: l.rotation,
        opacity: l.opacity,
        src: l.src,
        text: l.text,
      })),
    });

    addNotification(
      "Sent to Designer",
      "Opened retouched canvas layout inside Designer workspace.",
      "info"
    );
  };

  return (
    <div className="flex-1 bg-black text-white flex flex-col overflow-hidden font-sans select-none">
      {/* TOP TOOLBAR */}
      <ImageEditorToolbar
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onReset={handleResetAll}
        zoom={zoom}
        setZoom={setZoom}
        isPanMode={isPanMode}
        setIsPanMode={setIsPanMode}
        showRulers={showRulers}
        setShowRulers={setShowRulers}
        showGrid={showGrid}
        setShowGrid={setShowGrid}
        showSafeMargins={showSafeMargins}
        setShowSafeMargins={setShowSafeMargins}
        onOpenHistory={() => setIsHistoryPanelOpen(true)}
        onOpenExport={() => setIsExportModalOpen(true)}
        onSendToDesigner={handleSendToDesigner}
      />

      {/* MAIN WORKSPACE BODY: LEFT SIDEBAR + INTERACTIVE CANVAS */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        <ImageEditorSidebar
          activeTool={activeTool}
          adjustments={adjustments}
          setAdjustments={setAdjustments}
          transform={transform}
          setTransform={setTransform}
          crop={crop}
          setCrop={setCrop}
          effects={effects}
          setEffects={setEffects}
          background={background}
          setBackground={setBackground}
          layers={layers}
          setLayers={setLayers}
          selectedLayerId={selectedLayerId}
          setSelectedLayerId={setSelectedLayerId}
          activeImgUrl={activeImgUrl}
          setActiveImgUrl={setActiveImgUrl}
          onApplyPreset={handleApplyPresetFilter}
        />

        <ImageCanvas
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
          zoom={zoom}
          setZoom={setZoom}
          isPanMode={isPanMode}
          showRulers={showRulers}
          showGrid={showGrid}
          showSafeMargins={showSafeMargins}
          adjustments={adjustments}
          transform={transform}
          crop={crop}
          setCrop={setCrop}
          effects={effects}
          background={background}
          layers={layers}
          setLayers={setLayers}
          selectedLayerId={selectedLayerId}
          setSelectedLayerId={setSelectedLayerId}
          isCropToolActive={activeTool === "crop"}
        />
      </div>

      {/* MODALS */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        width={canvasWidth}
        height={canvasHeight}
        layers={layers}
        background={background}
        adjustments={adjustments}
        effects={effects}
        crop={crop}
        onSendToDesigner={handleSendToDesigner}
      />

      <ImageEditorHistoryPanel
        isOpen={isHistoryPanelOpen}
        onClose={() => setIsHistoryPanelOpen(false)}
        history={history}
        currentIndex={historyIndex}
        onRestoreIndex={(idx) => {
          setHistoryIndex(idx);
          const snap = history[idx];
          if (snap) {
            setLayers(snap.layers);
            setAdjustments(snap.adjustments);
            setTransform(snap.transform);
            setCrop(snap.crop);
            setEffects(snap.effects);
            setBackground(snap.background);
          }
          setIsHistoryPanelOpen(false);
        }}
      />
    </div>
  );
}

import React, { useRef, useState, useEffect } from "react";
import {
  ColorAdjustments,
  TransformSettings,
  CropRect,
  ImageEffectSettings,
  BackgroundSettings,
  ImageLayer,
} from "../../../types/imageEditor";
import { getCssFilterString, renderBackgroundOnCanvas } from "../../../utils/imageProcessing";

interface ImageCanvasProps {
  canvasWidth: number;
  canvasHeight: number;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  isPanMode: boolean;
  showRulers: boolean;
  showGrid: boolean;
  showSafeMargins: boolean;
  adjustments: ColorAdjustments;
  transform: TransformSettings;
  crop: CropRect;
  setCrop: React.Dispatch<React.SetStateAction<CropRect>>;
  effects: ImageEffectSettings;
  background: BackgroundSettings;
  layers: ImageLayer[];
  setLayers: React.Dispatch<React.SetStateAction<ImageLayer[]>>;
  selectedLayerId: string | null;
  setSelectedLayerId: (id: string | null) => void;
  isCropToolActive: boolean;
}

export function ImageCanvas({
  canvasWidth,
  canvasHeight,
  zoom,
  setZoom,
  isPanMode,
  showRulers,
  showGrid,
  showSafeMargins,
  adjustments,
  transform,
  crop,
  setCrop,
  effects,
  background,
  layers,
  setLayers,
  selectedLayerId,
  setSelectedLayerId,
  isCropToolActive,
}: ImageCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);

  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDraggingPan, setIsDraggingPan] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  // Layer dragging
  const [draggingLayerId, setDraggingLayerId] = useState<string | null>(null);
  const [layerDragOffset, setLayerDragOffset] = useState({ x: 0, y: 0 });

  // Render canvas background whenever background settings change
  useEffect(() => {
    const canvas = bgCanvasRef.current;
    if (!canvas) return;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      renderBackgroundOnCanvas(ctx, canvasWidth, canvasHeight, background);
    }
  }, [canvasWidth, canvasHeight, background]);

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.05 : 0.95;
      setZoom((z) => Math.max(0.2, Math.min(4, z * zoomFactor)));
    } else {
      setPan((p) => ({
        x: p.x - e.deltaX * 0.8,
        y: p.y - e.deltaY * 0.8,
      }));
    }
  };

  // Pan Mouse Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isPanMode || e.button === 1 || e.shiftKey) {
      setIsDraggingPan(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setCursorPos({
        x: Math.round((e.clientX - rect.left) / zoom),
        y: Math.round((e.clientY - rect.top) / zoom),
      });
    }

    if (isDraggingPan) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }

    // Handle Layer Dragging
    if (draggingLayerId) {
      setLayers((prev) =>
        prev.map((l) =>
          l.id === draggingLayerId
            ? {
                ...l,
                x: (e.clientX - layerDragOffset.x) / zoom,
                y: (e.clientY - layerDragOffset.y) / zoom,
              }
            : l
        )
      );
    }
  };

  const handleMouseUp = () => {
    setIsDraggingPan(false);
    setDraggingLayerId(null);
  };

  const filterString = getCssFilterString(adjustments, effects);

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`flex-1 bg-neutral-900 relative overflow-hidden flex items-center justify-center font-sans select-none ${
        isPanMode || isDraggingPan ? "cursor-grab active:cursor-grabbing" : "cursor-crosshair"
      }`}
    >
      {/* TOP PIXEL RULER */}
      {showRulers && (
        <div className="absolute top-0 left-8 right-0 h-6 bg-neutral-950 border-b border-white/10 z-30 flex items-center overflow-hidden font-mono text-[9px] text-gray-500 pointer-events-none">
          <div
            className="flex items-center"
            style={{ transform: `translateX(${pan.x}px)` }}
          >
            {Array.from({ length: 40 }).map((_, i) => (
              <div key={i} className="w-20 border-r border-white/10 h-3 flex items-end pl-1 shrink-0">
                {i * 100}
              </div>
            ))}
          </div>
          {/* CURSOR GUIDE LINE */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-neon-purple shadow-sm transition-all"
            style={{ left: `${cursorPos.x * zoom + pan.x}px` }}
          />
        </div>
      )}

      {/* LEFT PIXEL RULER */}
      {showRulers && (
        <div className="absolute top-6 left-0 bottom-0 w-8 bg-neutral-950 border-r border-white/10 z-30 flex flex-col items-center overflow-hidden font-mono text-[9px] text-gray-500 pointer-events-none">
          <div
            className="flex flex-col items-center"
            style={{ transform: `translateY(${pan.y}px)` }}
          >
            {Array.from({ length: 40 }).map((_, i) => (
              <div key={i} className="h-20 border-b border-white/10 w-full flex items-end justify-center pb-1 shrink-0">
                {i * 100}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CANVAS STAGE ARTBOARD CONTAINER */}
      <div
        className="relative transition-transform duration-75 ease-out shadow-2xl rounded-xl overflow-hidden border border-white/15"
        style={{
          width: canvasWidth,
          height: canvasHeight,
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: "center center",
        }}
      >
        {/* BACKGROUND CANVAS LAYER */}
        <canvas
          ref={bgCanvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
        />

        {/* ALIGNMENT GRID OVERLAY */}
        {showGrid && (
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        )}

        {/* SAFE MARGINS OVERLAY */}
        {showSafeMargins && (
          <div className="absolute inset-8 border-2 border-dashed border-cyan-400/50 pointer-events-none z-10 flex items-start justify-end p-2 font-mono text-[10px] text-cyan-400 font-bold">
            SAFE MARGIN
          </div>
        )}

        {/* LAYERS COMPOSITOR */}
        {layers.map((layer) => {
          if (!layer.visible) return null;

          const isSelected = selectedLayerId === layer.id;

          return (
            <div
              key={layer.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedLayerId(layer.id);
              }}
              onMouseDown={(e) => {
                if (!layer.locked && !isPanMode) {
                  setDraggingLayerId(layer.id);
                  setLayerDragOffset({
                    x: e.clientX - layer.x * zoom,
                    y: e.clientY - layer.y * zoom,
                  });
                }
              }}
              className={`absolute transition-all ${
                isSelected ? "ring-2 ring-neon-purple shadow-xl z-20" : "z-10 hover:ring-1 hover:ring-white/40"
              }`}
              style={{
                left: layer.x,
                top: layer.y,
                width: layer.width,
                height: layer.height,
                opacity: layer.opacity,
                transform: `rotate(${layer.rotation + transform.rotate}deg) scaleX(${
                  transform.flipH ? -1 : 1
                }) scaleY(${transform.flipV ? -1 : 1})`,
                transformOrigin: "center center",
              }}
            >
              {/* IMAGE LAYER */}
              {layer.type === "image" && layer.src && (
                <img
                  src={layer.src}
                  alt={layer.name}
                  style={{ filter: filterString }}
                  className="w-full h-full object-cover rounded-lg pointer-events-none"
                  referrerPolicy="no-referrer"
                />
              )}

              {/* TEXT LAYER */}
              {layer.type === "text" && (
                <div
                  style={{
                    fontFamily: layer.fontFamily,
                    fontSize: `${layer.fontSize}px`,
                    fontWeight: layer.fontWeight,
                    color: layer.textColor,
                    textAlign: layer.textAlign,
                  }}
                  className="w-full h-full flex items-center justify-center p-2 leading-none font-bold select-none text-center"
                >
                  {layer.text}
                </div>
              )}

              {/* SHAPE LAYER */}
              {layer.type === "shape" && (
                <div
                  style={{
                    backgroundColor: layer.fillColor,
                    borderColor: layer.strokeColor,
                    borderWidth: `${layer.strokeWidth || 0}px`,
                    borderRadius: layer.shapeType === "circle" ? "9999px" : `${layer.cornerRadius || 12}px`,
                  }}
                  className="w-full h-full shadow-lg"
                />
              )}

              {/* SELECTION HANDLE CONTROLS */}
              {isSelected && (
                <>
                  <div className="absolute -top-2 -left-2 w-3.5 h-3.5 rounded-full bg-white border-2 border-neon-purple shadow-md" />
                  <div className="absolute -top-2 -right-2 w-3.5 h-3.5 rounded-full bg-white border-2 border-neon-purple shadow-md" />
                  <div className="absolute -bottom-2 -left-2 w-3.5 h-3.5 rounded-full bg-white border-2 border-neon-purple shadow-md" />
                  <div className="absolute -bottom-2 -right-2 w-3.5 h-3.5 rounded-full bg-white border-2 border-neon-purple shadow-md" />
                </>
              )}
            </div>
          );
        })}

        {/* CROP OVERLAY BOX */}
        {isCropToolActive && (
          <div
            className="absolute border-2 border-neon-pink bg-neon-pink/10 shadow-[0_0_20px_rgba(236,72,153,0.4)] z-30 cursor-move"
            style={{
              left: `${crop.x}%`,
              top: `${crop.y}%`,
              width: `${crop.width}%`,
              height: `${crop.height}%`,
            }}
          >
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none border border-white/30">
              <div className="border-r border-b border-white/20" />
              <div className="border-r border-b border-white/20" />
              <div className="border-b border-white/20" />
              <div className="border-r border-b border-white/20" />
              <div className="border-r border-b border-white/20" />
              <div className="border-b border-white/20" />
            </div>

            {/* CROP HANDLES */}
            <div className="absolute -top-2 -left-2 w-4 h-4 bg-neon-pink border-2 border-white rounded" />
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-neon-pink border-2 border-white rounded" />
            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-neon-pink border-2 border-white rounded" />
            <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-neon-pink border-2 border-white rounded" />
          </div>
        )}
      </div>
    </div>
  );
}

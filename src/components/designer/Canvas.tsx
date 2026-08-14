import React, { forwardRef, useState, useRef, useEffect } from "react";
import { CanvasStage } from "./CanvasStage";
import { TextTool } from "./TextTool";
import { ToolMode } from "./LeftToolRail";
import { DesignState, CanvasElement } from "../../types/designer";
import {
  Copy,
  Scissors,
  Clipboard,
  Trash2,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Layers,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Download,
  RotateCw,
  Move,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Grid,
  Magnet,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignVerticalJustifyStart as AlignTop,
  AlignVerticalJustifyCenter as AlignMiddle,
  AlignVerticalJustifyEnd as AlignBottom,
  FolderPlus,
  FolderMinus,
  Edit3,
} from "lucide-react";

interface CanvasProps {
  state: DesignState;
  scaleFactor?: number;
  interactive?: boolean;
  selectedElementId?: string | null;
  selectedElementIds?: string[];
  onSelectElement?: (id: string, multi?: boolean) => void;
  onSelectMultipleElements?: (ids: string[]) => void;
  onUpdateElement?: (id: string, updates: Partial<CanvasElement>) => void;
  onUpdateElements?: (updates: { id: string; changes: Partial<CanvasElement> }[]) => void;
  onDeleteElement?: (id: string) => void;
  onDuplicateElement?: (id: string) => void;
  onZoomChange?: (zoom: number) => void;
  snapToGrid?: boolean;
  gridSize?: number;
  onExportSelected?: (id: string) => void;
  activeTool?: ToolMode;
  onAddElement?: (element: CanvasElement) => void;
  editingElementId?: string | null;
  onSetEditingElementId?: (id: string | null) => void;
}

interface ContextMenuState {
  x: number;
  y: number;
  elementId: string | null;
}

export const Canvas = forwardRef<HTMLDivElement, CanvasProps>(
  (
    {
      state,
      scaleFactor = 1,
      interactive = true,
      selectedElementId,
      selectedElementIds = [],
      onSelectElement,
      onSelectMultipleElements,
      onUpdateElement,
      onDeleteElement,
      onDuplicateElement,
      onZoomChange,
      snapToGrid = true,
      gridSize = 10,
      onExportSelected,
      activeTool,
      onAddElement,
      editingElementId,
      onSetEditingElementId,
    },
    ref
  ) => {
    // Pan & Zoom state
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [canvasRotation, setCanvasRotation] = useState(0);
    const startPanRef = useRef({ x: 0, y: 0 });

    // Drag selection marquee
    const [isMarqueeSelecting, setIsMarqueeSelecting] = useState(false);
    const [marqueeStart, setMarqueeStart] = useState({ x: 0, y: 0 });
    const [marqueeCurrent, setMarqueeCurrent] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    // Context Menu state
    const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

    // Element Dragging & Transform state
    const [draggingElementId, setDraggingElementId] = useState<string | null>(null);
    const [transformHandle, setTransformHandle] = useState<"drag" | "rotate" | "nw" | "ne" | "sw" | "se" | "n" | "s" | "e" | "w" | null>(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [transformStart, setTransformStart] = useState<{ x: number; y: number; w: number; h: number; rot: number; mouseX: number; mouseY: number } | null>(null);
    const [liveCoords, setLiveCoords] = useState<{ x: number; y: number; w?: number; h?: number; rot?: number } | null>(null);
    const [activeSmartGuides, setActiveSmartGuides] = useState<{ x?: number; y?: number }>({});
    const [comparingBeforeAfter, setComparingBeforeAfter] = useState<boolean>(false);

    // Clipboard buffer
    const [clipboardElement, setClipboardElement] = useState<CanvasElement | null>(null);

    // Renaming modal state
    const [renamingId, setRenamingId] = useState<string | null>(null);
    const [renameValue, setRenameValue] = useState("");

    // Active selection array normalize
    const activeSelectedIds = selectedElementIds.length > 0 ? selectedElementIds : selectedElementId ? [selectedElementId] : [];
    const primarySelectedId = activeSelectedIds[0] || null;
    const primarySelectedElement = state.elements.find((el) => el.id === primarySelectedId);

    // Handle Wheel Zoom & Pan
    const handleWheel = (e: React.WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.05 : 0.05;
        const newZoom = Math.min(Math.max(scaleFactor + delta, 0.2), 3.0);
        onZoomChange?.(newZoom);
      } else if (isPanning || e.shiftKey) {
        setPanOffset((prev) => ({
          x: prev.x - e.deltaX,
          y: prev.y - e.deltaY,
        }));
      }
    };

    // Close Context Menu on click outside
    useEffect(() => {
      const handleGlobalClick = () => setContextMenu(null);
      window.addEventListener("click", handleGlobalClick);
      return () => window.removeEventListener("click", handleGlobalClick);
    }, []);

    // Handle Mouse Down on Canvas Container (Marquee selection or Panning or Deselect)
    const handleMouseDown = (e: React.MouseEvent) => {
      if (e.button === 2) return; // Right click handled separately

      if (e.button === 1 || (e.button === 0 && e.altKey)) {
        // Pan canvas
        setIsPanning(true);
        startPanRef.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
        return;
      }

      // If active tool is text, let TextTool handle canvas clicking & dragging
      if (activeTool === "text") {
        return;
      }

      // Check if clicking directly on empty canvas container
      const target = e.target as HTMLElement;
      const isCanvasBg = target.closest("#lizzdo-designer-canvas") && !target.closest("[data-element-id]");

      if (isCanvasBg) {
        if (!e.shiftKey) {
          onSelectElement?.("");
          onSelectMultipleElements?.([]);
        }

        // Start drag marquee selection
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const startX = e.clientX - rect.left;
          const startY = e.clientY - rect.top;
          setIsMarqueeSelecting(true);
          setMarqueeStart({ x: startX, y: startY });
          setMarqueeCurrent({ x: startX, y: startY });
        }
      }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
      if (isPanning) {
        setPanOffset({
          x: e.clientX - startPanRef.current.x,
          y: e.clientY - startPanRef.current.y,
        });
        return;
      }

      if (isMarqueeSelecting && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const curX = e.clientX - rect.left;
        const curY = e.clientY - rect.top;
        setMarqueeCurrent({ x: curX, y: curY });

        // Calculate intersecting elements
        const minX = Math.min(marqueeStart.x, curX);
        const maxX = Math.max(marqueeStart.x, curX);
        const minY = Math.min(marqueeStart.y, curY);
        const maxY = Math.max(marqueeStart.y, curY);

        const canvasRect = containerRef.current.querySelector("#lizzdo-designer-canvas")?.getBoundingClientRect();
        if (canvasRect) {
          const hitIds: string[] = [];
          state.elements.forEach((el) => {
            const elNode = containerRef.current?.querySelector(`[data-element-id="${el.id}"]`);
            if (elNode) {
              const elRect = elNode.getBoundingClientRect();
              const elMinX = elRect.left - rect.left;
              const elMaxX = elRect.right - rect.left;
              const elMinY = elRect.top - rect.top;
              const elMaxY = elRect.bottom - rect.top;

              if (elMinX < maxX && elMaxX > minX && elMinY < maxY && elMaxY > minY) {
                hitIds.push(el.id);
              }
            }
          });
          if (hitIds.length > 0) {
            onSelectMultipleElements?.(hitIds);
          }
        }
      }

      // Handle element transform (position, resize handles, or rotation)
      if (draggingElementId && primarySelectedElement && !primarySelectedElement.locked && transformStart) {
        const canvasNode = containerRef.current?.querySelector("#lizzdo-designer-canvas");
        if (canvasNode) {
          const rect = canvasNode.getBoundingClientRect();
          const dxPercent = ((e.clientX - transformStart.mouseX) / rect.width) * 100;
          const dyPercent = ((e.clientY - transformStart.mouseY) / rect.height) * 100;

          if (transformHandle === "drag") {
            let newX = transformStart.x + dxPercent;
            let newY = transformStart.y + dyPercent;

            // Smart Guides & Snapping
            const guides: { x?: number; y?: number } = {};
            if (snapToGrid) {
              if (Math.abs(newX - 50) < 2) {
                newX = 50;
                guides.x = 50;
              }
              if (Math.abs(newY - 50) < 2) {
                newY = 50;
                guides.y = 50;
              }
            }

            setActiveSmartGuides(guides);
            const finalX = Math.round(newX * 10) / 10;
            const finalY = Math.round(newY * 10) / 10;

            setLiveCoords({ x: finalX, y: finalY, w: primarySelectedElement.width, h: primarySelectedElement.height });
            onUpdateElement?.(draggingElementId, { x: finalX, y: finalY });
          } else if (transformHandle === "rotate") {
            // Compute rotation angle around element center
            const centerX = rect.left + ((transformStart.x + (transformStart.w / 2)) / 100) * rect.width;
            const centerY = rect.top + ((transformStart.y + (transformStart.h / 2)) / 100) * rect.height;
            const rad = Math.atan2(e.clientY - centerY, e.clientX - centerX);
            let deg = Math.round((rad * 180) / Math.PI + 90);
            if (deg < 0) deg += 360;

            // Snap rotation if Shift held
            if (e.shiftKey) {
              deg = Math.round(deg / 15) * 15;
            }

            setLiveCoords({ x: transformStart.x, y: transformStart.y, w: transformStart.w, h: transformStart.h, rot: deg });
            onUpdateElement?.(draggingElementId, { rotation: deg });
          } else if (transformHandle) {
            // Resize handles (nw, ne, sw, se, n, s, e, w)
            let newX = transformStart.x;
            let newY = transformStart.y;
            let newW = transformStart.w;
            let newH = transformStart.h;

            if (transformHandle.includes("e")) {
              newW = Math.max(2, transformStart.w + dxPercent);
            }
            if (transformHandle.includes("s")) {
              newH = Math.max(2, transformStart.h + dyPercent);
            }
            if (transformHandle.includes("w")) {
              const possibleW = Math.max(2, transformStart.w - dxPercent);
              newX = transformStart.x + (transformStart.w - possibleW);
              newW = possibleW;
            }
            if (transformHandle.includes("n")) {
              const possibleH = Math.max(2, transformStart.h - dyPercent);
              newY = transformStart.y + (transformStart.h - possibleH);
              newH = possibleH;
            }

            // Aspect Ratio Locking if requested or Shift key held
            if (primarySelectedElement.aspectRatioLocked || e.shiftKey) {
              const initialRatio = transformStart.w / transformStart.h;
              if (transformHandle === "e" || transformHandle === "w" || transformHandle === "se" || transformHandle === "sw") {
                newH = newW / initialRatio;
              } else {
                newW = newH * initialRatio;
              }
            }

            const finalW = Math.round(newW * 10) / 10;
            const finalH = Math.round(newH * 10) / 10;
            const finalX = Math.round(newX * 10) / 10;
            const finalY = Math.round(newY * 10) / 10;

            setLiveCoords({ x: finalX, y: finalY, w: finalW, h: finalH });
            onUpdateElement?.(draggingElementId, {
              x: finalX,
              y: finalY,
              width: finalW,
              height: finalH,
            });
          }
        }
      }
    };

    const handleMouseUp = () => {
      setIsPanning(false);
      setIsMarqueeSelecting(false);
      setDraggingElementId(null);
      setTransformHandle(null);
      setTransformStart(null);
      setLiveCoords(null);
      setActiveSmartGuides({});
    };

    // Right-click Context Menu trigger
    const handleContextMenu = (e: React.MouseEvent) => {
      e.preventDefault();
      const target = e.target as HTMLElement;
      const elementNode = target.closest("[data-element-id]");
      const clickedId = elementNode?.getAttribute("data-element-id") || null;

      if (clickedId) {
        onSelectElement?.(clickedId);
      }

      setContextMenu({
        x: e.clientX,
        y: e.clientY,
        elementId: clickedId,
      });
    };

    // Context Menu Actions
    const handleCopy = () => {
      if (primarySelectedElement) {
        setClipboardElement(primarySelectedElement);
      }
      setContextMenu(null);
    };

    const handlePaste = () => {
      if (clipboardElement) {
        onDuplicateElement?.(clipboardElement.id);
      }
      setContextMenu(null);
    };

    const handleDuplicate = () => {
      if (primarySelectedId) {
        onDuplicateElement?.(primarySelectedId);
      }
      setContextMenu(null);
    };

    const handleDelete = () => {
      if (primarySelectedId) {
        onDeleteElement?.(primarySelectedId);
      }
      setContextMenu(null);
    };

    const handleToggleLock = () => {
      if (primarySelectedElement) {
        onUpdateElement?.(primarySelectedElement.id, { locked: !primarySelectedElement.locked });
      }
      setContextMenu(null);
    };

    const handleToggleVisibility = () => {
      if (primarySelectedElement) {
        onUpdateElement?.(primarySelectedElement.id, { visible: !primarySelectedElement.visible });
      }
      setContextMenu(null);
    };

    const handleLayerOrder = (direction: "up" | "down") => {
      if (primarySelectedElement) {
        const currentZ = primarySelectedElement.zIndex || 10;
        onUpdateElement?.(primarySelectedElement.id, {
          zIndex: direction === "up" ? currentZ + 5 : Math.max(1, currentZ - 5),
        });
      }
      setContextMenu(null);
    };

    // Alignment Handlers for Selected Element(s)
    const handleAlign = (type: "left" | "center" | "right" | "top" | "middle" | "bottom") => {
      if (!primarySelectedElement) return;
      let newX = primarySelectedElement.x;
      let newY = primarySelectedElement.y;

      switch (type) {
        case "left":
          newX = 5;
          break;
        case "center":
          newX = 50;
          break;
        case "right":
          newX = 80;
          break;
        case "top":
          newY = 5;
          break;
        case "middle":
          newY = 50;
          break;
        case "bottom":
          newY = 80;
          break;
      }

      onUpdateElement?.(primarySelectedElement.id, { x: newX, y: newY });
      setContextMenu(null);
    };

    return (
      <div
        ref={containerRef}
        className="relative w-full h-full flex items-center justify-center overflow-hidden select-none cursor-default bg-neutral-950"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onContextMenu={handleContextMenu}
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) rotate(${canvasRotation}deg)`,
          transformOrigin: "center center",
        }}
      >
        {/* CANVAS STAGE */}
        <div className="relative flex items-center justify-center">
          <CanvasStage
            ref={ref}
            state={{
              ...state,
              showGrid: state.showGrid || snapToGrid,
            }}
            scaleFactor={scaleFactor}
            interactive={interactive}
            selectedElementId={primarySelectedId || undefined}
            onSelectElement={(id) => {
              onSelectElement?.(id);
            }}
          />

          {/* TEXT TOOL COMPONENT FOR POINT & PARAGRAPH TEXT, DOUBLE-CLICK INLINE EDITING & DIRECT MANIPULATION */}
          <TextTool
            active={activeTool === "text"}
            state={state}
            scaleFactor={scaleFactor}
            canvasContainerRef={containerRef}
            canvasStageRef={ref as any}
            selectedElementId={primarySelectedId}
            onSelectElement={(id) => onSelectElement?.(id)}
            onUpdateElement={(id, updates) => onUpdateElement?.(id, updates)}
            onAddElement={(el) => onAddElement?.(el)}
            onDeleteElement={onDeleteElement}
            onDuplicateElement={onDuplicateElement}
            snapToGrid={snapToGrid}
            gridSize={gridSize}
            editingElementId={editingElementId}
            onSetEditingElementId={onSetEditingElementId}
          />

          {/* SELECTION OVERLAY WITH INTERACTIVE RESIZE & ROTATE HANDLES FOR NON-TEXT ELEMENTS */}
          {primarySelectedElement && !["text", "badge", "button", "logo"].includes(primarySelectedElement.type) && (
            <div
              className="absolute pointer-events-none z-40 border-2 border-neon-cyan shadow-[0_0_15px_rgba(0,245,255,0.4)]"
              style={{
                left: `${primarySelectedElement.x}%`,
                top: `${primarySelectedElement.y}%`,
                width: `${primarySelectedElement.width || 20}%`,
                height: `${primarySelectedElement.height || 20}%`,
                transform: `rotate(${primarySelectedElement.rotation || 0}deg)`,
                transformOrigin: "center center",
              }}
            >
              {/* TOP ROTATION HANDLE STALK & BUTTON */}
              {!primarySelectedElement.locked && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-auto cursor-grab active:cursor-grabbing">
                  <div
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setDraggingElementId(primarySelectedElement.id);
                      setTransformHandle("rotate");
                      setTransformStart({
                        x: primarySelectedElement.x,
                        y: primarySelectedElement.y,
                        w: primarySelectedElement.width || 20,
                        h: primarySelectedElement.height || 20,
                        rot: primarySelectedElement.rotation || 0,
                        mouseX: e.clientX,
                        mouseY: e.clientY,
                      });
                    }}
                    className="w-6 h-6 rounded-full bg-neon-cyan text-black flex items-center justify-center shadow-lg hover:scale-125 transition-transform"
                    title="Drag to Rotate (Hold Shift to snap 15°)"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </div>
                  <div className="w-0.5 h-3 bg-neon-cyan" />
                </div>
              )}

              {/* 8 RESIZE HANDLES (CORNER & EDGE) */}
              {!primarySelectedElement.locked && (
                <>
                  {["nw", "ne", "sw", "se", "n", "s", "e", "w"].map((handle) => {
                    let positionClasses = "";
                    let cursorClass = "";
                    switch (handle) {
                      case "nw": positionClasses = "-top-1.5 -left-1.5"; cursorClass = "cursor-nwse-resize"; break;
                      case "ne": positionClasses = "-top-1.5 -right-1.5"; cursorClass = "cursor-nesw-resize"; break;
                      case "sw": positionClasses = "-bottom-1.5 -left-1.5"; cursorClass = "cursor-nesw-resize"; break;
                      case "se": positionClasses = "-bottom-1.5 -right-1.5"; cursorClass = "cursor-nwse-resize"; break;
                      case "n": positionClasses = "-top-1.5 left-1/2 -translate-x-1/2"; cursorClass = "cursor-ns-resize"; break;
                      case "s": positionClasses = "-bottom-1.5 left-1/2 -translate-x-1/2"; cursorClass = "cursor-ns-resize"; break;
                      case "e": positionClasses = "top-1/2 -right-1.5 -translate-y-1/2"; cursorClass = "cursor-ew-resize"; break;
                      case "w": positionClasses = "top-1/2 -left-1.5 -translate-y-1/2"; cursorClass = "cursor-ew-resize"; break;
                    }
                    return (
                      <div
                        key={handle}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          setDraggingElementId(primarySelectedElement.id);
                          setTransformHandle(handle as any);
                          setTransformStart({
                            x: primarySelectedElement.x,
                            y: primarySelectedElement.y,
                            w: primarySelectedElement.width || 20,
                            h: primarySelectedElement.height || 20,
                            rot: primarySelectedElement.rotation || 0,
                            mouseX: e.clientX,
                            mouseY: e.clientY,
                          });
                        }}
                        className={`absolute w-3 h-3 bg-white border-2 border-neon-cyan rounded-sm shadow-md pointer-events-auto hover:scale-150 transition-transform ${positionClasses} ${cursorClass}`}
                        title={`Resize ${handle.toUpperCase()}`}
                      />
                    );
                  })}
                </>
              )}

              {/* REAL-TIME DIMENSION & POSITION BADGE */}
              <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md text-neon-cyan font-mono text-[10px] px-2 py-0.5 rounded border border-neon-cyan/40 shadow-xl whitespace-nowrap">
                {Math.round(primarySelectedElement.width || 20)}% × {Math.round(primarySelectedElement.height || 20)}% | X:{Math.round(primarySelectedElement.x)}%, Y:{Math.round(primarySelectedElement.y)}%
              </div>

              {/* FLOATING QUICK ACTIONS BAR */}
              <div className="absolute -top-12 left-0 flex items-center gap-1 bg-neutral-900/90 backdrop-blur-xl border border-white/20 rounded-xl p-1 shadow-2xl pointer-events-auto whitespace-nowrap">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateElement?.(primarySelectedElement.id, { x: 50 - (primarySelectedElement.width || 20) / 2, y: 50 - (primarySelectedElement.height || 20) / 2 });
                  }}
                  className="px-2 py-1 hover:bg-white/10 rounded text-[10px] font-mono text-gray-200 hover:text-neon-cyan flex items-center gap-1"
                  title="Center on Canvas"
                >
                  <AlignCenter className="w-3 h-3 text-neon-cyan" /> Center
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateElement?.(primarySelectedElement.id, { flipX: !primarySelectedElement.flipX });
                  }}
                  className="px-2 py-1 hover:bg-white/10 rounded text-[10px] font-mono text-gray-200 hover:text-neon-purple flex items-center gap-1"
                  title="Flip Horizontal"
                >
                  Flip H
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicateElement?.(primarySelectedElement.id);
                  }}
                  className="px-2 py-1 hover:bg-white/10 rounded text-[10px] font-mono text-gray-200 hover:text-emerald-400 flex items-center gap-1"
                  title="Duplicate Object"
                >
                  <Copy className="w-3 h-3 text-emerald-400" /> Dup
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateElement?.(primarySelectedElement.id, { locked: !primarySelectedElement.locked });
                  }}
                  className="px-2 py-1 hover:bg-white/10 rounded text-[10px] font-mono text-gray-200 flex items-center gap-1"
                  title={primarySelectedElement.locked ? "Unlock" : "Lock"}
                >
                  {primarySelectedElement.locked ? <Unlock className="w-3 h-3 text-emerald-400" /> : <Lock className="w-3 h-3 text-amber-400" />}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteElement?.(primarySelectedElement.id);
                  }}
                  className="px-2 py-1 hover:bg-red-500/20 rounded text-[10px] font-mono text-red-400 flex items-center gap-1"
                  title="Delete Object"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* LIVE TRANSFORM COORDINATES BADGE */}
          {liveCoords && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-neon-cyan text-black font-mono font-bold text-xs px-3 py-1 rounded-full shadow-2xl z-50 flex items-center gap-2 animate-bounce">
              <Move className="w-3.5 h-3.5" />
              <span>
                X: {liveCoords.x}% | Y: {liveCoords.y}%
              </span>
            </div>
          )}

          {/* ACTIVE SMART GUIDES OVERLAY */}
          {activeSmartGuides.x !== undefined && (
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-neon-cyan shadow-[0_0_12px_#00f5ff] z-50 pointer-events-none" />
          )}
          {activeSmartGuides.y !== undefined && (
            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-neon-cyan shadow-[0_0_12px_#00f5ff] z-50 pointer-events-none" />
          )}
        </div>

        {/* MARQUEE SELECTION BOX */}
        {isMarqueeSelecting && (
          <div
            className="absolute border border-neon-cyan bg-neon-cyan/15 rounded pointer-events-none z-50"
            style={{
              left: Math.min(marqueeStart.x, marqueeCurrent.x),
              top: Math.min(marqueeStart.y, marqueeCurrent.y),
              width: Math.abs(marqueeCurrent.x - marqueeStart.x),
              height: Math.abs(marqueeCurrent.y - marqueeStart.y),
            }}
          />
        )}

        {/* FLOATING CANVAS QUICK NAVIGATION BAR */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-neutral-900/90 backdrop-blur-xl border border-white/15 rounded-2xl px-3 py-1.5 shadow-2xl z-40 flex items-center gap-2 text-xs font-mono text-gray-300">
          <button
            type="button"
            onClick={() => {
              setPanOffset({ x: 0, y: 0 });
              setCanvasRotation(0);
              onZoomChange?.(1.0);
            }}
            className="px-2 py-1 hover:bg-white/10 hover:text-white rounded-lg transition-all flex items-center gap-1 text-[11px]"
            title="Reset Pan & Zoom (100% Fit)"
          >
            <RefreshCw className="w-3 h-3 text-neon-cyan" /> Fit Center
          </button>

          <div className="h-4 w-px bg-white/15" />

          <button
            type="button"
            onClick={() => onZoomChange?.(Math.max(0.2, (scaleFactor || 1) - 0.1))}
            className="p-1 hover:bg-white/10 hover:text-neon-cyan rounded-lg"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <span className="font-bold text-neon-cyan min-w-[42px] text-center">
            {Math.round((scaleFactor || 1) * 100)}%
          </span>

          <button
            type="button"
            onClick={() => onZoomChange?.(Math.min(3.0, (scaleFactor || 1) + 0.1))}
            className="p-1 hover:bg-white/10 hover:text-neon-cyan rounded-lg"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-white/15" />

          <button
            type="button"
            onClick={() => setCanvasRotation((prev) => (prev + 90) % 360)}
            className="p-1 hover:bg-white/10 hover:text-neon-purple rounded-lg"
            title="Rotate View Canvas (90°)"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          {canvasRotation !== 0 && (
            <span className="text-[10px] text-neon-purple font-bold">{canvasRotation}°</span>
          )}
        </div>

        {/* RIGHT CLICK CONTEXT MENU */}
        {contextMenu && (
          <div
            className="fixed z-50 w-56 rounded-2xl bg-neutral-900/95 border border-white/20 shadow-2xl backdrop-blur-xl py-2 text-xs font-mono text-gray-200 space-y-1 animate-in fade-in zoom-in-95 duration-100"
            style={{ left: contextMenu.x, top: contextMenu.y }}
            onClick={(e) => e.stopPropagation()}
          >
            {primarySelectedElement ? (
              <>
                <div className="px-3 py-1 border-b border-white/10 font-bold text-neon-cyan text-[11px] truncate flex items-center justify-between">
                  <span>{primarySelectedElement.name}</span>
                  <span className="text-[9px] text-gray-500 uppercase">{primarySelectedElement.type}</span>
                </div>

                {/* ALIGNMENT TOOLS STRIP */}
                <div className="px-2 py-1 grid grid-cols-6 gap-1 bg-black/40 rounded-xl mx-2 my-1">
                  <button
                    onClick={() => handleAlign("left")}
                    className="p-1 hover:bg-white/10 rounded hover:text-neon-cyan flex justify-center"
                    title="Align Left"
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleAlign("center")}
                    className="p-1 hover:bg-white/10 rounded hover:text-neon-cyan flex justify-center"
                    title="Horizontal Center"
                  >
                    <AlignCenter className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleAlign("right")}
                    className="p-1 hover:bg-white/10 rounded hover:text-neon-cyan flex justify-center"
                    title="Align Right"
                  >
                    <AlignRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleAlign("top")}
                    className="p-1 hover:bg-white/10 rounded hover:text-neon-cyan flex justify-center"
                    title="Align Top"
                  >
                    <AlignTop className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleAlign("middle")}
                    className="p-1 hover:bg-white/10 rounded hover:text-neon-cyan flex justify-center"
                    title="Vertical Center"
                  >
                    <AlignMiddle className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleAlign("bottom")}
                    className="p-1 hover:bg-white/10 rounded hover:text-neon-cyan flex justify-center"
                    title="Align Bottom"
                  >
                    <AlignBottom className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={handleDuplicate}
                  className="w-full px-3 py-1.5 hover:bg-white/10 flex items-center justify-between hover:text-white"
                >
                  <span className="flex items-center gap-2">
                    <Copy className="w-3.5 h-3.5 text-neon-cyan" /> Duplicate
                  </span>
                  <span className="text-[10px] text-gray-500">Ctrl+D</span>
                </button>

                <button
                  onClick={handleCopy}
                  className="w-full px-3 py-1.5 hover:bg-white/10 flex items-center justify-between hover:text-white"
                >
                  <span className="flex items-center gap-2">
                    <Copy className="w-3.5 h-3.5 text-neon-purple" /> Copy
                  </span>
                  <span className="text-[10px] text-gray-500">Ctrl+C</span>
                </button>

                <button
                  onClick={handleToggleLock}
                  className="w-full px-3 py-1.5 hover:bg-white/10 flex items-center justify-between hover:text-white"
                >
                  <span className="flex items-center gap-2">
                    {primarySelectedElement.locked ? (
                      <>
                        <Unlock className="w-3.5 h-3.5 text-emerald-400" /> Unlock Element
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5 text-amber-400" /> Lock Element
                      </>
                    )}
                  </span>
                </button>

                <button
                  onClick={handleToggleVisibility}
                  className="w-full px-3 py-1.5 hover:bg-white/10 flex items-center justify-between hover:text-white"
                >
                  <span className="flex items-center gap-2">
                    {primarySelectedElement.visible ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-gray-400" /> Hide Layer
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5 text-neon-cyan" /> Show Layer
                      </>
                    )}
                  </span>
                </button>

                <button
                  onClick={() => handleLayerOrder("up")}
                  className="w-full px-3 py-1.5 hover:bg-white/10 flex items-center justify-between hover:text-white"
                >
                  <span className="flex items-center gap-2">
                    <ArrowUp className="w-3.5 h-3.5 text-neon-cyan" /> Bring Forward
                  </span>
                </button>

                <button
                  onClick={() => handleLayerOrder("down")}
                  className="w-full px-3 py-1.5 hover:bg-white/10 flex items-center justify-between hover:text-white"
                >
                  <span className="flex items-center gap-2">
                    <ArrowDown className="w-3.5 h-3.5 text-neon-purple" /> Send Backward
                  </span>
                </button>

                {onExportSelected && (
                  <button
                    onClick={() => {
                      onExportSelected(primarySelectedElement.id);
                      setContextMenu(null);
                    }}
                    className="w-full px-3 py-1.5 hover:bg-neon-cyan/20 text-neon-cyan flex items-center gap-2 font-bold"
                  >
                    <Download className="w-3.5 h-3.5" /> Export Selected Layer
                  </button>
                )}

                <div className="border-t border-white/10 pt-1">
                  <button
                    onClick={handleDelete}
                    className="w-full px-3 py-1.5 hover:bg-red-500/20 text-red-400 hover:text-red-300 flex items-center justify-between font-bold"
                  >
                    <span className="flex items-center gap-2">
                      <Trash2 className="w-3.5 h-3.5" /> Delete Element
                    </span>
                    <span className="text-[10px] text-gray-500">Del</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="px-3 py-1 border-b border-white/10 font-bold text-gray-400 text-[11px]">
                  Canvas Workspace
                </div>
                {clipboardElement && (
                  <button
                    onClick={handlePaste}
                    className="w-full px-3 py-1.5 hover:bg-white/10 flex items-center justify-between hover:text-white"
                  >
                    <span className="flex items-center gap-2">
                      <Clipboard className="w-3.5 h-3.5 text-emerald-400" /> Paste Layer
                    </span>
                    <span className="text-[10px] text-gray-500">Ctrl+V</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    if (state.elements.length > 0) {
                      onSelectMultipleElements?.(state.elements.map((el) => el.id));
                    }
                    setContextMenu(null);
                  }}
                  className="w-full px-3 py-1.5 hover:bg-white/10 flex items-center justify-between hover:text-white"
                >
                  <span className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-neon-cyan" /> Select All Objects
                  </span>
                  <span className="text-[10px] text-gray-500">Ctrl+A</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    );
  }
);

Canvas.displayName = "Canvas";

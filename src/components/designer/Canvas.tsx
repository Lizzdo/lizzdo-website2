import React, { forwardRef, useState, useRef, useEffect } from "react";
import { CanvasStage } from "./CanvasStage";
import { TextTool } from "./TextTool";
import { ToolMode } from "./LeftToolRail";
import { DesignState, CanvasElement } from "../../types/designer";
import { detectAlphaBounds } from "../../utils/imageProcessing";
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
  ChevronsUp,
  ChevronsDown,
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
  FolderOpen,
  FolderMinus,
  SlidersHorizontal,
  Edit3,
} from "lucide-react";

interface CanvasProps {
  state: DesignState;
  scaleFactor?: number;
  interactive?: boolean;
  selectedElementId?: string | null;
  selectedElementIds?: string[];
  onSelectElement?: (id: string | null, multi?: boolean) => void;
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
  onGroupSelected?: () => void;
  onUngroupSelected?: () => void;
  onMoveLayer?: (id: string, direction: "up" | "down") => void;
  onMoveLayerToTop?: (id: string) => void;
  onMoveLayerToBottom?: (id: string) => void;
  onAlignSelected?: (type: "left" | "center-h" | "right" | "top" | "center-v" | "bottom") => void;
  onDistributeSelected?: (type: "horizontal" | "vertical") => void;
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
      onUpdateElements,
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
      onGroupSelected,
      onUngroupSelected,
      onMoveLayer,
      onMoveLayerToTop,
      onMoveLayerToBottom,
      onAlignSelected,
      onDistributeSelected,
    },
    ref
  ) => {
    // Pan & Zoom state
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [canvasRotation, setCanvasRotation] = useState(0);
    const startPanRef = useRef({ x: 0, y: 0 });

    // Visual aids toggles
    const [showRulers, setShowRulers] = useState(false);
    const [showGuides, setShowGuides] = useState(true);
    const [snappingEnabled, setSnappingEnabled] = useState(snapToGrid);

    // Drag selection marquee
    const [isMarqueeSelecting, setIsMarqueeSelecting] = useState(false);
    const [marqueeStart, setMarqueeStart] = useState({ x: 0, y: 0 });
    const [marqueeCurrent, setMarqueeCurrent] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    // Context Menu state
    const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

    // Element Dragging & Transform state
    const [draggingElementId, setDraggingElementId] = useState<string | null>(null);
    const [transformHandle, setTransformHandle] = useState<
      "drag" | "drag-multi" | "rotate" | "nw" | "ne" | "sw" | "se" | "n" | "s" | "e" | "w" | null
    >(null);
    const [transformStart, setTransformStart] = useState<{
      x: number;
      y: number;
      w: number;
      h: number;
      rot: number;
      mouseX: number;
      mouseY: number;
      multiInitial?: Array<{ id: string; x: number; y: number; w: number; h: number }>;
    } | null>(null);
    const [liveCoords, setLiveCoords] = useState<{ x: number; y: number; w?: number; h?: number; rot?: number } | null>(null);
    const [activeSmartGuides, setActiveSmartGuides] = useState<{
      x?: number;
      y?: number;
      label?: string;
    }>({});

    // Clipboard buffer
    const [clipboardElements, setClipboardElements] = useState<CanvasElement[]>([]);

    // Active selection array normalize
    const activeSelectedIds = selectedElementIds.length > 0 ? selectedElementIds : selectedElementId ? [selectedElementId] : [];
    const primarySelectedId = activeSelectedIds[0] || null;
    const primarySelectedElement = state.elements.find((el) => el.id === primarySelectedId);
    const selectedElements = state.elements.filter((el) => activeSelectedIds.includes(el.id));

    // Multi-selection collective bounding box calculation
    let groupBounds = { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };
    if (selectedElements.length > 1) {
      const minX = Math.min(...selectedElements.map((el) => el.x));
      const minY = Math.min(...selectedElements.map((el) => el.y));
      const maxX = Math.max(...selectedElements.map((el) => el.x + (el.width ?? 20)));
      const maxY = Math.max(...selectedElements.map((el) => el.y + (el.height ?? 20)));
      groupBounds = {
        minX,
        minY,
        maxX,
        maxY,
        width: Math.max(1, maxX - minX),
        height: Math.max(1, maxY - minY),
      };
    }

    // Handle Wheel Zoom & Pan
    const handleWheel = (e: React.WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.05 : 0.05;
        const newZoom = Math.min(Math.max(scaleFactor + delta, 0.2), 3.0);
        onZoomChange?.(newZoom);
      } else if (isPanning || e.shiftKey || activeTool === "hand") {
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

      if (e.button === 1 || (e.button === 0 && e.altKey) || activeTool === "hand") {
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

      if (isCanvasBg || target === containerRef.current) {
        if (!e.shiftKey) {
          onSelectElement?.(null);
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
        return;
      }

      // MULTI-ELEMENT COLLECTIVE DRAGGING
      if (transformHandle === "drag-multi" && transformStart?.multiInitial && selectedElements.length > 1) {
        const canvasNode = containerRef.current?.querySelector("#lizzdo-designer-canvas");
        if (canvasNode) {
          const rect = canvasNode.getBoundingClientRect();
          let dxPercent = ((e.clientX - transformStart.mouseX) / rect.width) * 100;
          let dyPercent = ((e.clientY - transformStart.mouseY) / rect.height) * 100;

          // Axis locking with Shift key
          if (e.shiftKey) {
            if (Math.abs(dxPercent) > Math.abs(dyPercent)) {
              dyPercent = 0;
            } else {
              dxPercent = 0;
            }
          }

          // Smart guides for multi-group
          const guides: { x?: number; y?: number; label?: string } = {};
          if (snappingEnabled) {
            const currentGroupCenterX = transformStart.x + dxPercent + transformStart.w / 2;
            const currentGroupCenterY = transformStart.y + dyPercent + transformStart.h / 2;

            if (Math.abs(currentGroupCenterX - 50) < 1.5) {
              dxPercent = 50 - transformStart.w / 2 - transformStart.x;
              guides.x = 50;
              guides.label = "Canvas Center X";
            }
            if (Math.abs(currentGroupCenterY - 50) < 1.5) {
              dyPercent = 50 - transformStart.h / 2 - transformStart.y;
              guides.y = 50;
              guides.label = "Canvas Center Y";
            }
          }
          setActiveSmartGuides(guides);

          transformStart.multiInitial.forEach((init) => {
            const finalX = Math.round((init.x + dxPercent) * 10) / 10;
            const finalY = Math.round((init.y + dyPercent) * 10) / 10;
            onUpdateElement?.(init.id, { x: finalX, y: finalY });
          });

          setLiveCoords({
            x: Math.round((transformStart.x + dxPercent) * 10) / 10,
            y: Math.round((transformStart.y + dyPercent) * 10) / 10,
            w: Math.round(transformStart.w * 10) / 10,
            h: Math.round(transformStart.h * 10) / 10,
          });
        }
        return;
      }

      // SINGLE ELEMENT TRANSFORM (position, resize handles, or rotation)
      if (draggingElementId && primarySelectedElement && !primarySelectedElement.locked && transformStart) {
        const canvasNode = containerRef.current?.querySelector("#lizzdo-designer-canvas");
        if (canvasNode) {
          const rect = canvasNode.getBoundingClientRect();
          let dxPercent = ((e.clientX - transformStart.mouseX) / rect.width) * 100;
          let dyPercent = ((e.clientY - transformStart.mouseY) / rect.height) * 100;

          if (transformHandle === "drag") {
            // Axis locking if Shift key held
            if (e.shiftKey) {
              if (Math.abs(dxPercent) > Math.abs(dyPercent)) {
                dyPercent = 0;
              } else {
                dxPercent = 0;
              }
            }

            let newX = transformStart.x + dxPercent;
            let newY = transformStart.y + dyPercent;
            const elW = primarySelectedElement.width ?? 20;
            const elH = primarySelectedElement.height ?? 20;
            const elCenterX = newX + elW / 2;
            const elCenterY = newY + elH / 2;

            // Smart Guides & Dynamic Snapping
            const guides: { x?: number; y?: number; label?: string } = {};
            if (snappingEnabled) {
              // Snap to Canvas Center X (50%)
              if (Math.abs(elCenterX - 50) < 1.5) {
                newX = 50 - elW / 2;
                guides.x = 50;
                guides.label = "Center X";
              }
              // Snap to Canvas Center Y (50%)
              if (Math.abs(elCenterY - 50) < 1.5) {
                newY = 50 - elH / 2;
                guides.y = 50;
                guides.label = "Center Y";
              }
              // Snap to Canvas Edges
              if (Math.abs(newX) < 1.2) {
                newX = 0;
                guides.x = 0;
              }
              if (Math.abs(newX + elW - 100) < 1.2) {
                newX = 100 - elW;
                guides.x = 100;
              }
              if (Math.abs(newY) < 1.2) {
                newY = 0;
                guides.y = 0;
              }
              if (Math.abs(newY + elH - 100) < 1.2) {
                newY = 100 - elH;
                guides.y = 100;
              }

              // Snap to Other Elements
              state.elements.forEach((other) => {
                if (other.id === primarySelectedElement.id || !other.visible) return;
                const otherW = other.width ?? 20;
                const otherH = other.height ?? 20;
                const otherCenterX = other.x + otherW / 2;
                const otherCenterY = other.y + otherH / 2;

                // Center align snap
                if (Math.abs(elCenterX - otherCenterX) < 1.5) {
                  newX = otherCenterX - elW / 2;
                  guides.x = otherCenterX;
                  guides.label = `Aligned with ${other.name}`;
                }
                if (Math.abs(elCenterY - otherCenterY) < 1.5) {
                  newY = otherCenterY - elH / 2;
                  guides.y = otherCenterY;
                  guides.label = `Aligned with ${other.name}`;
                }
                // Edge snap
                if (Math.abs(newX - other.x) < 1.2) {
                  newX = other.x;
                  guides.x = other.x;
                }
                if (Math.abs(newY - other.y) < 1.2) {
                  newY = other.y;
                  guides.y = other.y;
                }
              });
            }

            setActiveSmartGuides(guides);
            const finalX = Math.round(newX * 10) / 10;
            const finalY = Math.round(newY * 10) / 10;

            setLiveCoords({ x: finalX, y: finalY, w: elW, h: elH });
            onUpdateElement?.(draggingElementId, { x: finalX, y: finalY });
          } else if (transformHandle === "rotate") {
            // Compute rotation angle around element center
            const centerX = rect.left + ((transformStart.x + transformStart.w / 2) / 100) * rect.width;
            const centerY = rect.top + ((transformStart.y + transformStart.h / 2) / 100) * rect.height;
            const rad = Math.atan2(e.clientY - centerY, e.clientX - centerX);
            let deg = Math.round((rad * 180) / Math.PI + 90);
            if (deg < 0) deg += 360;

            // Snap rotation: 15° with Shift, or 0/45/90/180/270 degrees when close
            if (e.shiftKey) {
              deg = Math.round(deg / 15) * 15;
            } else {
              const cardinals = [0, 45, 90, 135, 180, 225, 270, 315, 360];
              for (const card of cardinals) {
                if (Math.abs(deg - card) <= 3) {
                  deg = card % 360;
                  break;
                }
              }
            }

            setLiveCoords({ x: transformStart.x, y: transformStart.y, w: transformStart.w, h: transformStart.h, rot: deg });
            onUpdateElement?.(draggingElementId, { rotation: deg });
          } else if (transformHandle) {
            // 8 RESIZE HANDLES (nw, ne, sw, se, n, s, e, w)
            let newX = transformStart.x;
            let newY = transformStart.y;
            let newW = transformStart.w;
            let newH = transformStart.h;

            const isCenterScale = e.altKey;
            const isProportional = primarySelectedElement.aspectRatioLocked ? !e.shiftKey : e.shiftKey;
            const initialRatio = transformStart.w / transformStart.h;

            if (transformHandle.includes("e")) {
              newW = Math.max(2, transformStart.w + (isCenterScale ? dxPercent * 2 : dxPercent));
              if (isCenterScale) newX = transformStart.x - (newW - transformStart.w) / 2;
            }
            if (transformHandle.includes("s")) {
              newH = Math.max(2, transformStart.h + (isCenterScale ? dyPercent * 2 : dyPercent));
              if (isCenterScale) newY = transformStart.y - (newH - transformStart.h) / 2;
            }
            if (transformHandle.includes("w")) {
              const delta = isCenterScale ? dxPercent * 2 : dxPercent;
              newW = Math.max(2, transformStart.w - delta);
              if (isCenterScale) {
                newX = transformStart.x - (newW - transformStart.w) / 2;
              } else {
                newX = transformStart.x + (transformStart.w - newW);
              }
            }
            if (transformHandle.includes("n")) {
              const delta = isCenterScale ? dyPercent * 2 : dyPercent;
              newH = Math.max(2, transformStart.h - delta);
              if (isCenterScale) {
                newY = transformStart.y - (newH - transformStart.h) / 2;
              } else {
                newY = transformStart.y + (transformStart.h - newH);
              }
            }

            // Aspect ratio constraint
            if (isProportional) {
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
        if (e.shiftKey || e.ctrlKey || e.metaKey) {
          if (!activeSelectedIds.includes(clickedId)) {
            onSelectMultipleElements?.([...activeSelectedIds, clickedId]);
          }
        } else if (!activeSelectedIds.includes(clickedId)) {
          onSelectElement?.(clickedId);
        }
      }

      setContextMenu({
        x: e.clientX,
        y: e.clientY,
        elementId: clickedId,
      });
    };

    // Context Menu Actions
    const handleCopy = () => {
      if (selectedElements.length > 0) {
        setClipboardElements(selectedElements);
      } else if (primarySelectedElement) {
        setClipboardElements([primarySelectedElement]);
      }
      setContextMenu(null);
    };

    const handleCut = () => {
      handleCopy();
      if (selectedElements.length > 1) {
        selectedElements.forEach((el) => onDeleteElement?.(el.id));
      } else if (primarySelectedId) {
        onDeleteElement?.(primarySelectedId);
      }
      setContextMenu(null);
    };

    const handlePaste = () => {
      if (clipboardElements.length > 0) {
        clipboardElements.forEach((el) => {
          onDuplicateElement?.(el.id);
        });
      }
      setContextMenu(null);
    };

    const handleDuplicate = () => {
      if (selectedElements.length > 1) {
        selectedElements.forEach((el) => onDuplicateElement?.(el.id));
      } else if (primarySelectedId) {
        onDuplicateElement?.(primarySelectedId);
      }
      setContextMenu(null);
    };

    const handleDelete = () => {
      if (selectedElements.length > 1) {
        selectedElements.forEach((el) => onDeleteElement?.(el.id));
      } else if (primarySelectedId) {
        onDeleteElement?.(primarySelectedId);
      }
      setContextMenu(null);
    };

    const handleToggleLock = () => {
      if (selectedElements.length > 1) {
        const nextLock = !selectedElements.every((el) => el.locked);
        selectedElements.forEach((el) => onUpdateElement?.(el.id, { locked: nextLock }));
      } else if (primarySelectedElement) {
        onUpdateElement?.(primarySelectedElement.id, { locked: !primarySelectedElement.locked });
      }
      setContextMenu(null);
    };

    const handleToggleVisibility = () => {
      if (selectedElements.length > 1) {
        const nextVisible = !selectedElements.every((el) => el.visible);
        selectedElements.forEach((el) => onUpdateElement?.(el.id, { visible: nextVisible }));
      } else if (primarySelectedElement) {
        onUpdateElement?.(primarySelectedElement.id, { visible: !primarySelectedElement.visible });
      }
      setContextMenu(null);
    };

    // Auto-detect alpha bounds on PNG cutouts
    const handleAutoTrimAlpha = async (element: CanvasElement) => {
      const src = element.url || element.src;
      if (!src) return;
      try {
        const bounds = await detectAlphaBounds(src);
        if (bounds) {
          onUpdateElement?.(element.id, {
            crop: {
              enabled: true,
              x: bounds.x,
              y: bounds.y,
              width: bounds.width,
              height: bounds.height,
            },
          });
        }
      } catch (err) {
        console.error("Alpha bounds trim failed:", err);
      }
    };

    return (
      <div
        ref={containerRef}
        className={`relative w-full h-full flex items-center justify-center overflow-hidden select-none bg-neutral-950 ${
          activeTool === "hand" ? (isPanning ? "cursor-grabbing" : "cursor-grab") : "cursor-default"
        }`}
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
        {/* CANVAS RULERS (HORIZONTAL & VERTICAL) */}
        {showRulers && (
          <>
            <div className="absolute top-0 left-0 right-0 h-5 bg-neutral-900/90 border-b border-white/10 flex items-center text-[9px] font-mono text-gray-500 z-30 pointer-events-none px-6">
              <div className="flex justify-between w-full">
                <span>0%</span>
                <span>25%</span>
                <span className="text-neon-cyan font-bold">50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>
            <div className="absolute top-5 left-0 bottom-0 w-5 bg-neutral-900/90 border-r border-white/10 flex flex-col justify-between items-center text-[9px] font-mono text-gray-500 z-30 pointer-events-none py-6">
              <span>0%</span>
              <span>25%</span>
              <span className="text-neon-cyan font-bold">50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </>
        )}

        {/* CANVAS STAGE */}
        <div className="relative flex items-center justify-center">
          <CanvasStage
            ref={ref}
            state={{
              ...state,
              showGrid: state.showGrid || (snapToGrid && snappingEnabled),
              showGuides: state.showGuides && showGuides,
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
            snapToGrid={snappingEnabled}
            gridSize={gridSize}
            editingElementId={editingElementId}
            onSetEditingElementId={onSetEditingElementId}
          />

          {/* MULTI-SELECTION COLLECTIVE BOUNDING BOX & HANDLES */}
          {selectedElements.length > 1 && (
            <div
              className="absolute pointer-events-none z-40 border-2 border-dashed border-neon-cyan shadow-[0_0_20px_rgba(0,245,255,0.3)] bg-neon-cyan/5"
              style={{
                left: `${groupBounds.minX}%`,
                top: `${groupBounds.minY}%`,
                width: `${groupBounds.width}%`,
                height: `${groupBounds.height}%`,
              }}
            >
              {/* GROUP DRAG HIT AREA */}
              <div
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setTransformHandle("drag-multi");
                  setTransformStart({
                    x: groupBounds.minX,
                    y: groupBounds.minY,
                    w: groupBounds.width,
                    h: groupBounds.height,
                    rot: 0,
                    mouseX: e.clientX,
                    mouseY: e.clientY,
                    multiInitial: selectedElements.map((el) => ({
                      id: el.id,
                      x: el.x,
                      y: el.y,
                      w: el.width ?? 20,
                      h: el.height ?? 20,
                    })),
                  });
                }}
                className="absolute inset-0 cursor-move pointer-events-auto"
                title="Drag to Move Selected Group (Hold Shift to lock axis)"
              />

              {/* 4 CORNER RESIZE HANDLES FOR MULTI-SELECTION */}
              {["nw", "ne", "sw", "se"].map((handle) => {
                let positionClasses = "";
                let cursorClass = "";
                switch (handle) {
                  case "nw":
                    positionClasses = "-top-2 -left-2";
                    cursorClass = "cursor-nwse-resize";
                    break;
                  case "ne":
                    positionClasses = "-top-2 -right-2";
                    cursorClass = "cursor-nesw-resize";
                    break;
                  case "sw":
                    positionClasses = "-bottom-2 -left-2";
                    cursorClass = "cursor-nesw-resize";
                    break;
                  case "se":
                    positionClasses = "-bottom-2 -right-2";
                    cursorClass = "cursor-nwse-resize";
                    break;
                }
                return (
                  <div
                    key={handle}
                    className={`absolute w-3.5 h-3.5 bg-white border-2 border-neon-cyan rounded-sm shadow-md pointer-events-auto hover:scale-150 transition-transform ${positionClasses} ${cursorClass}`}
                  />
                );
              })}

              {/* FLOATING MULTI-SELECTION ACTION BAR */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-neutral-900/95 backdrop-blur-xl border border-white/20 rounded-xl p-1.5 shadow-2xl pointer-events-auto whitespace-nowrap z-50">
                <span className="text-[10px] font-mono font-bold text-neon-cyan px-2 py-0.5 bg-neon-cyan/10 rounded">
                  {selectedElements.length} OBJECTS
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onGroupSelected?.();
                  }}
                  className="px-2 py-1 hover:bg-neon-cyan/20 rounded text-[10px] font-mono text-gray-200 hover:text-neon-cyan flex items-center gap-1 transition-all"
                  title="Group Elements (Ctrl+G)"
                >
                  <FolderPlus className="w-3 h-3 text-neon-cyan" /> Group
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAlignSelected?.("center-h");
                  }}
                  className="px-2 py-1 hover:bg-white/10 rounded text-[10px] font-mono text-gray-200 flex items-center gap-1"
                  title="Align Center Horizontal"
                >
                  <AlignCenter className="w-3 h-3 text-emerald-400" /> Center
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDistributeSelected?.("horizontal");
                  }}
                  className="px-2 py-1 hover:bg-white/10 rounded text-[10px] font-mono text-gray-200 flex items-center gap-1"
                  title="Distribute Evenly"
                >
                  <SlidersHorizontal className="w-3 h-3 text-neon-purple" /> Distribute
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDuplicate();
                  }}
                  className="px-2 py-1 hover:bg-white/10 rounded text-[10px] font-mono text-gray-200 flex items-center gap-1"
                  title="Duplicate All"
                >
                  <Copy className="w-3 h-3 text-amber-400" /> Duplicate
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                  className="px-2 py-1 hover:bg-red-500/20 rounded text-[10px] font-mono text-red-400 flex items-center gap-1"
                  title="Delete Selected Group"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* SINGLE-ELEMENT SELECTION OVERLAY WITH 8 RESIZE HANDLES & ROTATION STALK */}
          {primarySelectedElement && selectedElements.length <= 1 && editingElementId !== primarySelectedElement.id && (
            <div
              className={`absolute pointer-events-none z-40 border-2 ${
                primarySelectedElement.locked
                  ? "border-amber-400/80 shadow-[0_0_12px_rgba(251,191,36,0.3)]"
                  : "border-neon-cyan shadow-[0_0_15px_rgba(0,245,255,0.4)]"
              }`}
              style={{
                left: `${primarySelectedElement.x}%`,
                top: `${primarySelectedElement.y}%`,
                width: `${primarySelectedElement.width || 20}%`,
                height: `${primarySelectedElement.height || 20}%`,
                transform: `rotate(${primarySelectedElement.rotation || 0}deg)`,
                transformOrigin: "center center",
              }}
            >
              {/* DIRECT DRAG HIT AREA */}
              {!primarySelectedElement.locked && (
                <div
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setDraggingElementId(primarySelectedElement.id);
                    setTransformHandle("drag");
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
                  className="absolute inset-0 cursor-move pointer-events-auto"
                  title="Drag to Move Object (Hold Shift to lock axis)"
                />
              )}

              {/* TOP ROTATION HANDLE STALK & BUTTON */}
              {!primarySelectedElement.locked && (
                <div className="absolute -top-9 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-auto cursor-grab active:cursor-grabbing">
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
                    className="w-6 h-6 rounded-full bg-neon-cyan text-black flex items-center justify-center shadow-lg hover:scale-125 transition-transform border border-white/40"
                    title="Drag to Rotate (Hold Shift to snap 15°, or release near 0°/45°/90°)"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </div>
                  <div className="w-0.5 h-3 bg-neon-cyan shadow-[0_0_8px_#00f5ff]" />
                </div>
              )}

              {/* 8 RESIZE HANDLES (CORNER & EDGE) */}
              {!primarySelectedElement.locked && (
                <>
                  {["nw", "ne", "sw", "se", "n", "s", "e", "w"].map((handle) => {
                    let positionClasses = "";
                    let cursorClass = "";
                    switch (handle) {
                      case "nw":
                        positionClasses = "-top-1.5 -left-1.5";
                        cursorClass = "cursor-nwse-resize";
                        break;
                      case "ne":
                        positionClasses = "-top-1.5 -right-1.5";
                        cursorClass = "cursor-nesw-resize";
                        break;
                      case "sw":
                        positionClasses = "-bottom-1.5 -left-1.5";
                        cursorClass = "cursor-nesw-resize";
                        break;
                      case "se":
                        positionClasses = "-bottom-1.5 -right-1.5";
                        cursorClass = "cursor-nwse-resize";
                        break;
                      case "n":
                        positionClasses = "-top-1.5 left-1/2 -translate-x-1/2";
                        cursorClass = "cursor-ns-resize";
                        break;
                      case "s":
                        positionClasses = "-bottom-1.5 left-1/2 -translate-x-1/2";
                        cursorClass = "cursor-ns-resize";
                        break;
                      case "e":
                        positionClasses = "top-1/2 -right-1.5 -translate-y-1/2";
                        cursorClass = "cursor-ew-resize";
                        break;
                      case "w":
                        positionClasses = "top-1/2 -left-1.5 -translate-y-1/2";
                        cursorClass = "cursor-ew-resize";
                        break;
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
                        title={`Resize ${handle.toUpperCase()} (Hold Shift: Proportional, Hold Alt: From Center)`}
                      />
                    );
                  })}
                </>
              )}

              {/* REAL-TIME DIMENSION & POSITION BADGE */}
              <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 bg-black/85 backdrop-blur-md text-neon-cyan font-mono text-[10px] px-2 py-0.5 rounded border border-neon-cyan/40 shadow-xl whitespace-nowrap pointer-events-none">
                {Math.round(primarySelectedElement.width || 20)}% × {Math.round(primarySelectedElement.height || 20)}% | X:{Math.round(primarySelectedElement.x)}%, Y:{Math.round(primarySelectedElement.y)}%
                {primarySelectedElement.rotation ? ` | ${primarySelectedElement.rotation}°` : ""}
              </div>

              {/* FLOATING QUICK ACTIONS BAR */}
              <div className="absolute -top-12 left-0 flex items-center gap-1 bg-neutral-900/95 backdrop-blur-xl border border-white/20 rounded-xl p-1 shadow-2xl pointer-events-auto whitespace-nowrap z-50">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const w = primarySelectedElement.width || 20;
                    const h = primarySelectedElement.height || 20;
                    onUpdateElement?.(primarySelectedElement.id, {
                      x: Math.round(((100 - w) / 2) * 10) / 10,
                      y: Math.round(((100 - h) / 2) * 10) / 10,
                    });
                  }}
                  className="px-2 py-1 hover:bg-white/10 rounded text-[10px] font-mono text-gray-200 hover:text-neon-cyan flex items-center gap-1"
                  title="Center on Canvas"
                >
                  <AlignCenter className="w-3 h-3 text-neon-cyan" /> Center
                </button>

                {primarySelectedElement.type === "image" && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAutoTrimAlpha(primarySelectedElement);
                    }}
                    className="px-2 py-1 hover:bg-neon-purple/20 rounded text-[10px] font-mono text-neon-purple flex items-center gap-1"
                    title="Auto-Detect Non-Transparent Cutout Bounds"
                  >
                    <Scissors className="w-3 h-3" /> Alpha Bounds
                  </button>
                )}

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
                  title="Duplicate Object (Ctrl+D)"
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
                  title={primarySelectedElement.locked ? "Unlock Object" : "Lock Object"}
                >
                  {primarySelectedElement.locked ? (
                    <Unlock className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Lock className="w-3 h-3 text-amber-400" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteElement?.(primarySelectedElement.id);
                  }}
                  className="px-2 py-1 hover:bg-red-500/20 rounded text-[10px] font-mono text-red-400 flex items-center gap-1"
                  title="Delete Object (Del)"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* LIVE TRANSFORM COORDINATES BADGE */}
          {liveCoords && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-neon-cyan text-black font-mono font-bold text-xs px-3 py-1 rounded-full shadow-2xl z-50 flex items-center gap-2 animate-pulse">
              <Move className="w-3.5 h-3.5" />
              <span>
                X: {liveCoords.x}% | Y: {liveCoords.y}% {liveCoords.w && `| ${liveCoords.w}% × ${liveCoords.h}%`}
                {liveCoords.rot !== undefined && ` | ${liveCoords.rot}°`}
              </span>
            </div>
          )}

          {/* ACTIVE SMART GUIDES OVERLAY */}
          {showGuides && activeSmartGuides.x !== undefined && (
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-neon-cyan shadow-[0_0_12px_#00f5ff] z-50 pointer-events-none"
              style={{ left: `${activeSmartGuides.x}%` }}
            >
              {activeSmartGuides.label && (
                <span className="absolute top-2 left-1 bg-black/80 text-neon-cyan text-[9px] font-mono px-1 rounded">
                  {activeSmartGuides.label}
                </span>
              )}
            </div>
          )}
          {showGuides && activeSmartGuides.y !== undefined && (
            <div
              className="absolute left-0 right-0 h-0.5 bg-neon-cyan shadow-[0_0_12px_#00f5ff] z-50 pointer-events-none"
              style={{ top: `${activeSmartGuides.y}%` }}
            >
              {activeSmartGuides.label && (
                <span className="absolute left-2 top-1 bg-black/80 text-neon-cyan text-[9px] font-mono px-1 rounded">
                  {activeSmartGuides.label}
                </span>
              )}
            </div>
          )}
        </div>

        {/* MARQUEE SELECTION BOX */}
        {isMarqueeSelecting && (
          <div
            className="absolute border border-neon-cyan bg-neon-cyan/15 rounded pointer-events-none z-50 shadow-[0_0_15px_rgba(0,245,255,0.2)]"
            style={{
              left: Math.min(marqueeStart.x, marqueeCurrent.x),
              top: Math.min(marqueeStart.y, marqueeCurrent.y),
              width: Math.abs(marqueeCurrent.x - marqueeStart.x),
              height: Math.abs(marqueeCurrent.y - marqueeStart.y),
            }}
          />
        )}

        {/* FLOATING CANVAS CONTROLS & RULERS/GUIDES/SNAPPING TOOLBAR */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-neutral-900/95 backdrop-blur-xl border border-white/15 rounded-2xl px-3 py-1.5 shadow-2xl z-40 flex items-center gap-2 text-xs font-mono text-gray-300">
          <button
            type="button"
            onClick={() => {
              setPanOffset({ x: 0, y: 0 });
              setCanvasRotation(0);
              onZoomChange?.(1.0);
            }}
            className="px-2 py-1 hover:bg-white/10 hover:text-white rounded-lg transition-all flex items-center gap-1 text-[11px]"
            title="Reset Pan & Zoom (100% Fit Center)"
          >
            <RefreshCw className="w-3 h-3 text-neon-cyan" /> Fit Center
          </button>

          <div className="h-4 w-px bg-white/15" />

          {/* ZOOM CONTROLS */}
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

          {/* SNAPPING TOGGLE */}
          <button
            type="button"
            onClick={() => setSnappingEnabled((prev) => !prev)}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all flex items-center gap-1 ${
              snappingEnabled
                ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan"
                : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
            }`}
            title="Smart Snapping to Centers & Edges"
          >
            <Sparkles className="w-3 h-3" /> Snap {snappingEnabled ? "ON" : "OFF"}
          </button>

          {/* GUIDES TOGGLE */}
          <button
            type="button"
            onClick={() => setShowGuides((prev) => !prev)}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all flex items-center gap-1 ${
              showGuides
                ? "bg-neon-purple/20 border-neon-purple text-neon-purple"
                : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
            }`}
            title="Toggle Smart Guide Lines"
          >
            Guides {showGuides ? "ON" : "OFF"}
          </button>

          {/* RULERS TOGGLE */}
          <button
            type="button"
            onClick={() => setShowRulers((prev) => !prev)}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all flex items-center gap-1 ${
              showRulers
                ? "bg-emerald-400/20 border-emerald-400 text-emerald-400"
                : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
            }`}
            title="Toggle Precision Rulers"
          >
            Rulers
          </button>

          <div className="h-4 w-px bg-white/15" />

          {/* CANVAS ROTATION VIEW */}
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
            className="fixed z-50 w-60 rounded-2xl bg-neutral-900/98 border border-white/20 shadow-2xl backdrop-blur-xl py-2 text-xs font-mono text-gray-200 space-y-1 animate-in fade-in zoom-in-95 duration-100"
            style={{ left: contextMenu.x, top: contextMenu.y }}
            onClick={(e) => e.stopPropagation()}
          >
            {primarySelectedElement ? (
              <>
                <div className="px-3 py-1.5 border-b border-white/10 font-bold text-neon-cyan text-[11px] truncate flex items-center justify-between">
                  <span>
                    {selectedElements.length > 1 ? `${selectedElements.length} Objects Selected` : primarySelectedElement.name}
                  </span>
                  <span className="text-[9px] text-gray-500 uppercase">{primarySelectedElement.type}</span>
                </div>

                {/* ALIGNMENT TOOLS STRIP */}
                <div className="px-2 py-1 grid grid-cols-6 gap-1 bg-black/50 rounded-xl mx-2 my-1">
                  <button
                    onClick={() => {
                      onAlignSelected?.("left");
                      setContextMenu(null);
                    }}
                    className="p-1 hover:bg-white/10 rounded hover:text-neon-cyan flex justify-center"
                    title="Align Left"
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      onAlignSelected?.("center-h");
                      setContextMenu(null);
                    }}
                    className="p-1 hover:bg-white/10 rounded hover:text-neon-cyan flex justify-center"
                    title="Horizontal Center"
                  >
                    <AlignCenter className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      onAlignSelected?.("right");
                      setContextMenu(null);
                    }}
                    className="p-1 hover:bg-white/10 rounded hover:text-neon-cyan flex justify-center"
                    title="Align Right"
                  >
                    <AlignRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      onAlignSelected?.("top");
                      setContextMenu(null);
                    }}
                    className="p-1 hover:bg-white/10 rounded hover:text-neon-cyan flex justify-center"
                    title="Align Top"
                  >
                    <AlignTop className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      onAlignSelected?.("center-v");
                      setContextMenu(null);
                    }}
                    className="p-1 hover:bg-white/10 rounded hover:text-neon-cyan flex justify-center"
                    title="Vertical Center"
                  >
                    <AlignMiddle className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      onAlignSelected?.("bottom");
                      setContextMenu(null);
                    }}
                    className="p-1 hover:bg-white/10 rounded hover:text-neon-cyan flex justify-center"
                    title="Align Bottom"
                  >
                    <AlignBottom className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* GROUP / UNGROUP OPTION */}
                {selectedElements.length > 1 && (
                  <button
                    onClick={() => {
                      onGroupSelected?.();
                      setContextMenu(null);
                    }}
                    className="w-full px-3 py-1.5 hover:bg-white/10 flex items-center justify-between hover:text-neon-cyan font-bold"
                  >
                    <span className="flex items-center gap-2">
                      <FolderPlus className="w-3.5 h-3.5 text-neon-cyan" /> Group Objects
                    </span>
                    <span className="text-[10px] text-gray-500">Ctrl+G</span>
                  </button>
                )}

                {primarySelectedElement.type === "group" && (
                  <button
                    onClick={() => {
                      onUngroupSelected?.();
                      setContextMenu(null);
                    }}
                    className="w-full px-3 py-1.5 hover:bg-white/10 flex items-center justify-between hover:text-neon-purple font-bold"
                  >
                    <span className="flex items-center gap-2">
                      <FolderOpen className="w-3.5 h-3.5 text-neon-purple" /> Ungroup Objects
                    </span>
                    <span className="text-[10px] text-gray-500">Ctrl+Shift+G</span>
                  </button>
                )}

                {/* CUT / COPY / PASTE */}
                <button
                  onClick={handleCut}
                  className="w-full px-3 py-1.5 hover:bg-white/10 flex items-center justify-between hover:text-white"
                >
                  <span className="flex items-center gap-2">
                    <Scissors className="w-3.5 h-3.5 text-neon-pink" /> Cut
                  </span>
                  <span className="text-[10px] text-gray-500">Ctrl+X</span>
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

                {clipboardElements.length > 0 && (
                  <button
                    onClick={handlePaste}
                    className="w-full px-3 py-1.5 hover:bg-white/10 flex items-center justify-between hover:text-white"
                  >
                    <span className="flex items-center gap-2">
                      <Clipboard className="w-3.5 h-3.5 text-emerald-400" /> Paste
                    </span>
                    <span className="text-[10px] text-gray-500">Ctrl+V</span>
                  </button>
                )}

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
                  onClick={() => {
                    onMoveLayer?.(primarySelectedElement.id, "up");
                    setContextMenu(null);
                  }}
                  className="w-full px-3 py-1.5 hover:bg-white/10 flex items-center justify-between hover:text-white"
                >
                  <span className="flex items-center gap-2">
                    <ArrowUp className="w-3.5 h-3.5 text-neon-cyan" /> Bring Forward
                  </span>
                  <span className="text-[10px] text-gray-500">Ctrl+]</span>
                </button>

                <button
                  onClick={() => {
                    onMoveLayer?.(primarySelectedElement.id, "down");
                    setContextMenu(null);
                  }}
                  className="w-full px-3 py-1.5 hover:bg-white/10 flex items-center justify-between hover:text-white"
                >
                  <span className="flex items-center gap-2">
                    <ArrowDown className="w-3.5 h-3.5 text-neon-purple" /> Send Backward
                  </span>
                  <span className="text-[10px] text-gray-500">Ctrl+[</span>
                </button>

                <button
                  onClick={() => {
                    onMoveLayerToTop?.(primarySelectedElement.id);
                    setContextMenu(null);
                  }}
                  className="w-full px-3 py-1.5 hover:bg-white/10 flex items-center justify-between hover:text-white"
                >
                  <span className="flex items-center gap-2">
                    <ChevronsUp className="w-3.5 h-3.5 text-cyan-400" /> Bring to Front
                  </span>
                  <span className="text-[10px] text-gray-500">Ctrl+Shift+]</span>
                </button>

                <button
                  onClick={() => {
                    onMoveLayerToBottom?.(primarySelectedElement.id);
                    setContextMenu(null);
                  }}
                  className="w-full px-3 py-1.5 hover:bg-white/10 flex items-center justify-between hover:text-white"
                >
                  <span className="flex items-center gap-2">
                    <ChevronsDown className="w-3.5 h-3.5 text-cyan-400" /> Send to Back
                  </span>
                  <span className="text-[10px] text-gray-500">Ctrl+Shift+[</span>
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
                <div className="px-3 py-1.5 border-b border-white/10 font-bold text-gray-400 text-[11px]">
                  Canvas Workspace
                </div>
                {clipboardElements.length > 0 && (
                  <button
                    onClick={handlePaste}
                    className="w-full px-3 py-1.5 hover:bg-white/10 flex items-center justify-between hover:text-white font-bold"
                  >
                    <span className="flex items-center gap-2">
                      <Clipboard className="w-3.5 h-3.5 text-emerald-400" /> Paste Objects
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

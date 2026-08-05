import React, { forwardRef, useState, useRef, useEffect } from "react";
import { CanvasStage } from "./CanvasStage";
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
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [liveCoords, setLiveCoords] = useState<{ x: number; y: number; w?: number; h?: number } | null>(null);
    const [activeSmartGuides, setActiveSmartGuides] = useState<{ x?: number; y?: number }>({});

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

      // Handle element position drag
      if (draggingElementId && primarySelectedElement && !primarySelectedElement.locked) {
        const canvasNode = containerRef.current?.querySelector("#lizzdo-designer-canvas");
        if (canvasNode) {
          const rect = canvasNode.getBoundingClientRect();
          let newX = ((e.clientX - rect.left - dragOffset.x) / rect.width) * 100;
          let newY = ((e.clientY - rect.top - dragOffset.y) / rect.height) * 100;

          // Clamp
          newX = Math.max(-10, Math.min(110, newX));
          newY = Math.max(-10, Math.min(110, newY));

          // Snap to Center Guides
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

          setLiveCoords({ x: finalX, y: finalY });
          onUpdateElement?.(draggingElementId, { x: finalX, y: finalY });
        }
      }
    };

    const handleMouseUp = () => {
      setIsPanning(false);
      setIsMarqueeSelecting(false);
      setDraggingElementId(null);
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

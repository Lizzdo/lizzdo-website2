import React, { useState, useRef, useEffect, useCallback } from "react";
import { CanvasElement, DesignState } from "../../types/designer";
import { getFontFamilyWithFallback } from "../../utils/fontLoader";
import {
  Type,
  RotateCw,
  Edit3,
  Check,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Copy,
  Trash2,
  Lock,
  Unlock,
  Maximize2,
  Sparkles,
  Move,
  CaseUpper,
  CaseLower,
} from "lucide-react";

export interface TextToolProps {
  active: boolean;
  state: DesignState;
  scaleFactor: number;
  canvasContainerRef: React.RefObject<HTMLDivElement>;
  canvasStageRef?: React.RefObject<HTMLDivElement>;
  selectedElementId?: string | null;
  onSelectElement: (id: string) => void;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  onAddElement: (element: CanvasElement) => void;
  onDeleteElement?: (id: string) => void;
  onDuplicateElement?: (id: string) => void;
  snapToGrid?: boolean;
  gridSize?: number;
  editingElementId?: string | null;
  onSetEditingElementId?: (id: string | null) => void;
}

export function TextTool({
  active,
  state,
  scaleFactor,
  canvasContainerRef,
  canvasStageRef,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  onAddElement,
  onDeleteElement,
  onDuplicateElement,
  snapToGrid = false,
  gridSize = 10,
  editingElementId: externalEditingId,
  onSetEditingElementId: externalSetEditingId,
}: TextToolProps) {
  // Local or external editing state
  const [internalEditingId, setInternalEditingId] = useState<string | null>(null);
  const editingId = externalEditingId !== undefined ? externalEditingId : internalEditingId;
  const setEditingId = useCallback(
    (id: string | null) => {
      if (externalSetEditingId) externalSetEditingId(id);
      else setInternalEditingId(id);
    },
    [externalSetEditingId]
  );

  // Click & Drag creation state
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isDraggingNewBox, setIsDraggingNewBox] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number; clientX: number; clientY: number } | null>(null);
  const [currentPoint, setCurrentPoint] = useState<{ x: number; y: number } | null>(null);

  // Direct Manipulation Transform state
  const [transformHandle, setTransformHandle] = useState<
    "drag" | "rotate" | "scale" | "nw" | "ne" | "sw" | "se" | "n" | "s" | "e" | "w" | null
  >(null);
  const [transformStart, setTransformStart] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
    rot: number;
    fontSize: number;
    mouseX: number;
    mouseY: number;
  } | null>(null);
  const [liveAngle, setLiveAngle] = useState<number | null>(null);
  const [liveFontSize, setLiveFontSize] = useState<number | null>(null);

  // Inline editor input ref & local buffer
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const [localTextVal, setLocalTextVal] = useState("");

  const selectedElement = state.elements.find((el) => el.id === selectedElementId);
  const isSelectedText = selectedElement && (
    selectedElement.type === "text" ||
    selectedElement.type === "badge" ||
    selectedElement.type === "button" ||
    selectedElement.type === "logo"
  );
  const editingElement = state.elements.find((el) => el.id === editingId);

  // Sync local text buffer when entering editing mode
  useEffect(() => {
    if (editingElement) {
      setLocalTextVal(editingElement.text || "");
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.focus();
          editorRef.current.select();
        }
      }, 30);
    }
  }, [editingId, editingElement]);

  // Convert client coordinates to canvas percentage (0-100%)
  const getCanvasPercentages = (clientX: number, clientY: number) => {
    const stageEl =
      canvasStageRef?.current ||
      canvasContainerRef.current?.querySelector("#lizzdo-designer-canvas") as HTMLElement;

    if (!stageEl) {
      return { x: 50, y: 50 };
    }

    const rect = stageEl.getBoundingClientRect();
    const rawX = ((clientX - rect.left) / rect.width) * 100;
    const rawY = ((clientY - rect.top) / rect.height) * 100;

    let x = Math.max(0, Math.min(100, rawX));
    let y = Math.max(0, Math.min(100, rawY));

    if (snapToGrid) {
      const step = 5;
      x = Math.round(x / step) * step;
      y = Math.round(y / step) * step;
    }

    return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
  };

  // 1. CANVAS MOUSE DOWN (FOR NEW POINT TEXT OR DRAG PARAGRAPH BOX)
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    if (!active) return;

    // Check if clicked directly on an existing element handle or editor
    const target = e.target as HTMLElement;
    if (target.closest(".text-tool-handle") || target.closest(".text-tool-editor")) {
      return;
    }

    // If clicking on an existing text element, select it
    const elementNode = target.closest("[data-element-id]");
    if (elementNode) {
      const id = elementNode.getAttribute("data-element-id");
      if (id) {
        onSelectElement(id);
        return;
      }
    }

    const { x, y } = getCanvasPercentages(e.clientX, e.clientY);
    setIsMouseDown(true);
    setIsDraggingNewBox(false);
    setStartPoint({ x, y, clientX: e.clientX, clientY: e.clientY });
    setCurrentPoint({ x, y });
  };

  // 2. CANVAS MOUSE MOVE
  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    // Handle new text creation drag
    if (isMouseDown && startPoint && active) {
      const dist = Math.hypot(e.clientX - startPoint.clientX, e.clientY - startPoint.clientY);
      if (dist > 6) {
        setIsDraggingNewBox(true);
        const { x, y } = getCanvasPercentages(e.clientX, e.clientY);
        setCurrentPoint({ x, y });
      }
      return;
    }

    // Handle Direct Manipulation Transforms (Resize, Rotate, Scale, Move)
    if (transformHandle && selectedElement && !selectedElement.locked && transformStart) {
      const stageEl =
        canvasStageRef?.current ||
        canvasContainerRef.current?.querySelector("#lizzdo-designer-canvas") as HTMLElement;
      if (!stageEl) return;

      const rect = stageEl.getBoundingClientRect();
      const dxPercent = ((e.clientX - transformStart.mouseX) / rect.width) * 100;
      const dyPercent = ((e.clientY - transformStart.mouseY) / rect.height) * 100;

      if (transformHandle === "rotate") {
        // Compute center in screen pixels
        const centerX = rect.left + ((transformStart.x + transformStart.w / 2) / 100) * rect.width;
        const centerY = rect.top + ((transformStart.y + transformStart.h / 2) / 100) * rect.height;
        const rad = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        let deg = Math.round((rad * 180) / Math.PI + 90);
        if (deg < 0) deg += 360;

        // Snap to 15 degrees if shift held
        if (e.shiftKey) {
          deg = Math.round(deg / 15) * 15;
        }

        setLiveAngle(deg);
        onUpdateElement(selectedElement.id, { rotation: deg });
      } else if (transformHandle === "scale") {
        // Direct Scale Mode: Scale both font size and dimensions proportionately
        const initialDiag = Math.hypot(transformStart.w, transformStart.h);
        const newW = Math.max(8, transformStart.w + dxPercent);
        const newH = Math.max(4, transformStart.h + dyPercent);
        const newDiag = Math.hypot(newW, newH);
        const scaleRatio = newDiag / (initialDiag || 1);

        const newFontSize = Math.max(10, Math.min(240, Math.round(transformStart.fontSize * scaleRatio)));
        setLiveFontSize(newFontSize);

        onUpdateElement(selectedElement.id, {
          width: Math.round(newW * 10) / 10,
          height: Math.round(newH * 10) / 10,
          fontSize: newFontSize,
        });
      } else if (transformHandle === "drag") {
        // Move element
        let newX = transformStart.x + dxPercent;
        let newY = transformStart.y + dyPercent;

        if (snapToGrid) {
          if (Math.abs(newX - 50) < 2) newX = 50;
          if (Math.abs(newY - 50) < 2) newY = 50;
        }

        onUpdateElement(selectedElement.id, {
          x: Math.round(newX * 10) / 10,
          y: Math.round(newY * 10) / 10,
        });
      } else {
        // Box resize handles (nw, ne, sw, se, n, s, e, w)
        let newX = transformStart.x;
        let newY = transformStart.y;
        let newW = transformStart.w;
        let newH = transformStart.h;

        if (transformHandle.includes("e")) {
          newW = Math.max(4, transformStart.w + dxPercent);
        }
        if (transformHandle.includes("s")) {
          newH = Math.max(2, transformStart.h + dyPercent);
        }
        if (transformHandle.includes("w")) {
          const possibleW = Math.max(4, transformStart.w - dxPercent);
          newX = transformStart.x + (transformStart.w - possibleW);
          newW = possibleW;
        }
        if (transformHandle.includes("n")) {
          const possibleH = Math.max(2, transformStart.h - dyPercent);
          newY = transformStart.y + (transformStart.h - possibleH);
          newH = possibleH;
        }

        // Keep aspect ratio if shift key is pressed
        if (e.shiftKey || selectedElement.aspectRatioLocked) {
          const ratio = transformStart.w / (transformStart.h || 1);
          if (transformHandle === "e" || transformHandle === "w" || transformHandle === "se" || transformHandle === "sw") {
            newH = newW / ratio;
          } else {
            newW = newH * ratio;
          }
        }

        onUpdateElement(selectedElement.id, {
          x: Math.round(newX * 10) / 10,
          y: Math.round(newY * 10) / 10,
          width: Math.round(newW * 10) / 10,
          height: Math.round(newH * 10) / 10,
        });
      }
    }
  };

  // 3. CANVAS MOUSE UP
  const handleCanvasMouseUp = () => {
    // Commit new text creation
    if (isMouseDown && startPoint && active) {
      if (!isDraggingNewBox || !currentPoint) {
        // CLICK-TO-PLACE POINT TEXT
        const newEl: CanvasElement = {
          id: `text-point-${Date.now()}`,
          type: "text",
          textType: "point",
          name: "Point Text",
          text: "Type your text",
          fontFamily: "Orbitron",
          fontWeight: "700",
          fontSize: 32,
          color: "#00f5ff",
          letterSpacing: 2,
          lineHeight: 1.2,
          x: Math.max(2, Math.min(85, startPoint.x)),
          y: Math.max(2, Math.min(85, startPoint.y)),
          width: 45,
          height: 10,
          zIndex: (state.elements.length + 1) * 5,
          visible: true,
          locked: false,
          autoWrap: false,
        };

        onAddElement(newEl);
        onSelectElement(newEl.id);
        setEditingId(newEl.id);
      } else {
        // CLICK-AND-DRAG PARAGRAPH TEXT BOX
        const boxX = Math.min(startPoint.x, currentPoint.x);
        const boxY = Math.min(startPoint.y, currentPoint.y);
        const boxW = Math.max(10, Math.abs(currentPoint.x - startPoint.x));
        const boxH = Math.max(6, Math.abs(currentPoint.y - startPoint.y));

        const newEl: CanvasElement = {
          id: `text-para-${Date.now()}`,
          type: "text",
          textType: "paragraph",
          name: "Paragraph Box",
          text: "Double-click to edit paragraph text. Lizzdo Studio typography engine supports kerning, leading, multi-stop gradients, and responsive text reflow.",
          fontFamily: "Inter",
          fontWeight: "400",
          fontSize: 16,
          color: "#ffffff",
          letterSpacing: 0,
          lineHeight: 1.5,
          textAlign: "left",
          x: Math.round(boxX * 10) / 10,
          y: Math.round(boxY * 10) / 10,
          width: Math.round(boxW * 10) / 10,
          height: Math.round(boxH * 10) / 10,
          zIndex: (state.elements.length + 1) * 5,
          visible: true,
          locked: false,
          autoWrap: true,
        };

        onAddElement(newEl);
        onSelectElement(newEl.id);
        setEditingId(newEl.id);
      }
    }

    // Reset creation and transform states
    setIsMouseDown(false);
    setIsDraggingNewBox(false);
    setStartPoint(null);
    setCurrentPoint(null);
    setTransformHandle(null);
    setTransformStart(null);
    setLiveAngle(null);
    setLiveFontSize(null);
  };

  // DOUBLE-CLICK ON ELEMENT TO ENTER INLINE EDITING
  const handleDoubleClickElement = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const el = state.elements.find((item) => item.id === id);
    if (el && (el.type === "text" || el.type === "badge" || el.type === "button" || el.type === "logo")) {
      onSelectElement(id);
      setEditingId(id);
    }
  };

  // COMMIT INLINE TEXT EDITING
  const commitInlineEditing = useCallback(() => {
    if (editingElement) {
      onUpdateElement(editingElement.id, { text: localTextVal });
    }
    setEditingId(null);
  }, [editingElement, localTextVal, onUpdateElement, setEditingId]);

  // CANCEL INLINE TEXT EDITING
  const cancelInlineEditing = useCallback(() => {
    setEditingId(null);
  }, [setEditingId]);

  // Global double-click listener on canvas stage for text elements
  useEffect(() => {
    const handleGlobalDoubleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const elNode = target.closest("[data-element-id]");
      if (elNode) {
        const id = elNode.getAttribute("data-element-id");
        if (id) {
          const el = state.elements.find((item) => item.id === id);
          if (el && (el.type === "text" || el.type === "badge" || el.type === "button" || el.type === "logo")) {
            onSelectElement(id);
            setEditingId(id);
          }
        }
      }
    };

    const container = canvasContainerRef.current;
    if (container) {
      container.addEventListener("dblclick", handleGlobalDoubleClick);
      return () => container.removeEventListener("dblclick", handleGlobalDoubleClick);
    }
  }, [canvasContainerRef, onSelectElement, setEditingId, state.elements]);

  // Enter key when text element is selected opens inline editor
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !editingId && isSelectedText && selectedElement && !selectedElement.locked) {
        const activeTag = (document.activeElement?.tagName || "").toUpperCase();
        if (!["INPUT", "TEXTAREA", "SELECT"].includes(activeTag)) {
          e.preventDefault();
          setEditingId(selectedElement.id);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editingId, isSelectedText, selectedElement, setEditingId]);

  return (
    <div
      className="absolute inset-0 pointer-events-none z-30 select-none overflow-visible"
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleCanvasMouseMove}
      onMouseUp={handleCanvasMouseUp}
    >
      {/* 1. CREATION INTERACTION LAYER (WHEN TEXT TOOL IS ACTIVE IN TOOL RAIL) */}
      {active && (
        <div
          className="absolute inset-0 pointer-events-auto cursor-text z-20"
          title="Click to place Point Text, or Click & Drag to create a Paragraph Box"
        >
          {/* LIVE DRAG PREVIEW RECTANGLE */}
          {isDraggingNewBox && startPoint && currentPoint && (
            <div
              className="absolute border-2 border-dashed border-neon-cyan bg-neon-cyan/10 rounded-lg pointer-events-none shadow-[0_0_20px_rgba(0,245,255,0.4)] animate-pulse"
              style={{
                left: `${Math.min(startPoint.x, currentPoint.x)}%`,
                top: `${Math.min(startPoint.y, currentPoint.y)}%`,
                width: `${Math.abs(currentPoint.x - startPoint.x)}%`,
                height: `${Math.abs(currentPoint.y - startPoint.y)}%`,
              }}
            >
              <div className="absolute -top-7 left-0 bg-neutral-900/90 border border-neon-cyan/50 text-neon-cyan text-[10px] font-mono px-2 py-0.5 rounded shadow-lg flex items-center gap-1.5 whitespace-nowrap">
                <Type className="w-3 h-3 text-neon-cyan" />
                <span>
                  Paragraph Box: {Math.round(Math.abs(currentPoint.x - startPoint.x))}% ×{" "}
                  {Math.round(Math.abs(currentPoint.y - startPoint.y))}%
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. DIRECT MANIPULATION HANDLES (WHEN TEXT ELEMENT IS SELECTED & NOT INLINE EDITING) */}
      {isSelectedText && selectedElement && !editingId && (
        <div
          className="absolute pointer-events-none z-40 border-2 border-neon-cyan shadow-[0_0_15px_rgba(0,245,255,0.4)] text-tool-handle"
          style={{
            left: `${selectedElement.x}%`,
            top: `${selectedElement.y}%`,
            width: `${selectedElement.width || 25}%`,
            height: `${selectedElement.height || 10}%`,
            transform: `rotate(${selectedElement.rotation || 0}deg)`,
            transformOrigin: "center center",
          }}
          onDoubleClick={(e) => handleDoubleClickElement(selectedElement.id, e)}
        >
          {/* ROTATION HANDLE STALK & KNOB */}
          {!selectedElement.locked && (
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-auto cursor-grab active:cursor-grabbing text-tool-handle">
              <div
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setTransformHandle("rotate");
                  setTransformStart({
                    x: selectedElement.x,
                    y: selectedElement.y,
                    w: selectedElement.width || 25,
                    h: selectedElement.height || 10,
                    rot: selectedElement.rotation || 0,
                    fontSize: selectedElement.fontSize || 16,
                    mouseX: e.clientX,
                    mouseY: e.clientY,
                  });
                }}
                className="w-6 h-6 rounded-full bg-neon-cyan text-black flex items-center justify-center shadow-lg hover:scale-125 transition-transform"
                title="Drag to Rotate (Hold Shift for 15° increments)"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </div>
              <div className="w-0.5 h-3 bg-neon-cyan" />
            </div>
          )}

          {/* 8 BOX RESIZE HANDLES (CORNER & EDGE) */}
          {!selectedElement.locked && (
            <>
              {(["nw", "ne", "sw", "se", "n", "s", "e", "w"] as const).map((handle) => {
                let posClasses = "";
                let cursorClass = "";
                switch (handle) {
                  case "nw": posClasses = "-top-1.5 -left-1.5"; cursorClass = "cursor-nwse-resize"; break;
                  case "ne": posClasses = "-top-1.5 -right-1.5"; cursorClass = "cursor-nesw-resize"; break;
                  case "sw": posClasses = "-bottom-1.5 -left-1.5"; cursorClass = "cursor-nesw-resize"; break;
                  case "se": posClasses = "-bottom-1.5 -right-1.5"; cursorClass = "cursor-nwse-resize"; break;
                  case "n": posClasses = "-top-1.5 left-1/2 -translate-x-1/2"; cursorClass = "cursor-ns-resize"; break;
                  case "s": posClasses = "-bottom-1.5 left-1/2 -translate-x-1/2"; cursorClass = "cursor-ns-resize"; break;
                  case "e": posClasses = "top-1/2 -right-1.5 -translate-y-1/2"; cursorClass = "cursor-ew-resize"; break;
                  case "w": posClasses = "top-1/2 -left-1.5 -translate-y-1/2"; cursorClass = "cursor-ew-resize"; break;
                }
                return (
                  <div
                    key={handle}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setTransformHandle(handle);
                      setTransformStart({
                        x: selectedElement.x,
                        y: selectedElement.y,
                        w: selectedElement.width || 25,
                        h: selectedElement.height || 10,
                        rot: selectedElement.rotation || 0,
                        fontSize: selectedElement.fontSize || 16,
                        mouseX: e.clientX,
                        mouseY: e.clientY,
                      });
                    }}
                    className={`absolute w-3 h-3 bg-white border-2 border-neon-cyan rounded-sm shadow-md pointer-events-auto hover:scale-150 transition-transform ${posClasses} ${cursorClass} text-tool-handle`}
                    title={`Resize Text Frame ${handle.toUpperCase()}`}
                  />
                );
              })}
            </>
          )}

          {/* DEDICATED DIRECT SCALE HANDLE (PROPORTIONALLY SCALES FONT SIZE & BOX) */}
          {!selectedElement.locked && (
            <div
              onMouseDown={(e) => {
                e.stopPropagation();
                setTransformHandle("scale");
                setTransformStart({
                  x: selectedElement.x,
                  y: selectedElement.y,
                  w: selectedElement.width || 25,
                  h: selectedElement.height || 10,
                  rot: selectedElement.rotation || 0,
                  fontSize: selectedElement.fontSize || 16,
                  mouseX: e.clientX,
                  mouseY: e.clientY,
                });
              }}
              className="absolute -bottom-3 -right-3 w-5 h-5 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple text-black flex items-center justify-center pointer-events-auto cursor-nwse-resize shadow-xl hover:scale-125 transition-transform border border-white text-tool-handle"
              title="Direct Font Scale: Drag diagonally to scale font size & frame in real-time"
            >
              <Maximize2 className="w-2.5 h-2.5 text-white stroke-[2.5]" />
            </div>
          )}

          {/* LIVE HUD STATUS BADGE */}
          <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 bg-black/85 backdrop-blur-md text-neon-cyan font-mono text-[10px] px-2 py-0.5 rounded border border-neon-cyan/40 shadow-xl whitespace-nowrap flex items-center gap-1.5 pointer-events-none">
            <span className="text-gray-400">
              {selectedElement.textType === "paragraph" ? "Paragraph" : "Point Text"}:
            </span>
            <span className="font-bold text-white">
              {liveFontSize || selectedElement.fontSize || 16}px
            </span>
            <span className="text-gray-400">|</span>
            <span>{selectedElement.fontFamily || "Orbitron"}</span>
            {liveAngle !== null && (
              <>
                <span className="text-gray-400">|</span>
                <span className="text-amber-300 font-bold">{liveAngle}°</span>
              </>
            )}
          </div>

          {/* FLOATING QUICK TYPOGRAPHY ACTIONS TOOLBAR */}
          <div className="absolute -top-12 left-0 flex items-center gap-1 bg-neutral-900/95 backdrop-blur-xl border border-white/20 rounded-xl p-1 shadow-2xl pointer-events-auto whitespace-nowrap text-tool-handle">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setEditingId(selectedElement.id);
              }}
              className="px-2 py-1 bg-neon-cyan/20 hover:bg-neon-cyan/30 text-neon-cyan rounded text-[10px] font-mono font-bold flex items-center gap-1 border border-neon-cyan/40"
              title="Double-click canvas or press Enter to edit inline"
            >
              <Edit3 className="w-3 h-3" /> Edit Text
            </button>

            <div className="w-[1px] h-4 bg-white/20 mx-0.5" />

            {/* Quick Font Size +/- */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const cur = selectedElement.fontSize || 16;
                onUpdateElement(selectedElement.id, { fontSize: Math.max(8, cur - 2) });
              }}
              className="w-5 h-5 hover:bg-white/10 rounded text-[10px] font-mono text-gray-200 flex items-center justify-center"
              title="Decrease Font Size (-2px)"
            >
              A-
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const cur = selectedElement.fontSize || 16;
                onUpdateElement(selectedElement.id, { fontSize: Math.min(240, cur + 2) });
              }}
              className="w-5 h-5 hover:bg-white/10 rounded text-[10px] font-mono text-gray-200 flex items-center justify-center font-bold"
              title="Increase Font Size (+2px)"
            >
              A+
            </button>

            <div className="w-[1px] h-4 bg-white/20 mx-0.5" />

            {/* Formatting Toggles */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const isBold =
                  selectedElement.fontWeight === "bold" ||
                  selectedElement.fontWeight === "700" ||
                  selectedElement.fontWeight === 700;
                onUpdateElement(selectedElement.id, { fontWeight: isBold ? "400" : "700" });
              }}
              className={`p-1 rounded text-gray-200 hover:text-white ${
                selectedElement.fontWeight === "bold" ||
                selectedElement.fontWeight === "700" ||
                selectedElement.fontWeight === 700
                  ? "bg-neon-purple/40 text-neon-purple"
                  : "hover:bg-white/10"
              }`}
              title="Toggle Bold"
            >
              <Bold className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onUpdateElement(selectedElement.id, {
                  fontStyle: selectedElement.fontStyle === "italic" ? "normal" : "italic",
                });
              }}
              className={`p-1 rounded text-gray-200 hover:text-white ${
                selectedElement.fontStyle === "italic" ? "bg-neon-purple/40 text-neon-purple" : "hover:bg-white/10"
              }`}
              title="Toggle Italic"
            >
              <Italic className="w-3 h-3" />
            </button>

            {/* Alignments */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onUpdateElement(selectedElement.id, { textAlign: "left" });
              }}
              className={`p-1 rounded ${
                selectedElement.textAlign === "left" || !selectedElement.textAlign
                  ? "bg-neon-cyan/30 text-neon-cyan"
                  : "text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
              title="Align Left"
            >
              <AlignLeft className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onUpdateElement(selectedElement.id, { textAlign: "center" });
              }}
              className={`p-1 rounded ${
                selectedElement.textAlign === "center"
                  ? "bg-neon-cyan/30 text-neon-cyan"
                  : "text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
              title="Align Center"
            >
              <AlignCenter className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onUpdateElement(selectedElement.id, { textAlign: "right" });
              }}
              className={`p-1 rounded ${
                selectedElement.textAlign === "right"
                  ? "bg-neon-cyan/30 text-neon-cyan"
                  : "text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
              title="Align Right"
            >
              <AlignRight className="w-3 h-3" />
            </button>

            <div className="w-[1px] h-4 bg-white/20 mx-0.5" />

            {/* Duplicate */}
            {onDuplicateElement && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicateElement(selectedElement.id);
                }}
                className="p-1 hover:bg-white/10 rounded text-emerald-400"
                title="Duplicate Text Element"
              >
                <Copy className="w-3 h-3" />
              </button>
            )}

            {/* Delete */}
            {onDeleteElement && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteElement(selectedElement.id);
                }}
                className="p-1 hover:bg-red-500/20 rounded text-red-400"
                title="Delete Text Element"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. INLINE WYSIWYG TEXT EDITING OVERLAY */}
      {editingElement && (
        <div
          className="absolute z-50 text-tool-editor pointer-events-auto"
          style={{
            left: `${editingElement.x}%`,
            top: `${editingElement.y}%`,
            width: `${editingElement.width || 25}%`,
            minHeight: `${editingElement.height || 10}%`,
            transform: `rotate(${editingElement.rotation || 0}deg)`,
            transformOrigin: "center center",
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* FLOATING INLINE EDITING CONTROL BAR */}
          <div className="absolute -top-11 left-0 flex items-center gap-2 bg-neutral-900/95 border border-neon-cyan/60 rounded-xl px-2.5 py-1 shadow-2xl text-[10px] font-mono whitespace-nowrap">
            <span className="flex items-center gap-1 text-neon-cyan font-bold">
              <span className="w-2 h-2 rounded-full bg-neon-cyan animate-ping" />
              Editing Text Mode
            </span>
            <div className="w-[1px] h-3 bg-white/20" />
            <span className="text-gray-400">Esc to finish • Shift+Enter for new line</span>
            <button
              type="button"
              onClick={commitInlineEditing}
              className="ml-2 px-2 py-0.5 bg-neon-cyan text-black font-bold rounded-lg flex items-center gap-1 hover:scale-105 transition-transform"
            >
              <Check className="w-3 h-3" /> Done
            </button>
          </div>

          {/* INLINE TEXTAREA WITH EXACT STYLES */}
          <textarea
            ref={editorRef}
            value={localTextVal}
            onChange={(e) => {
              setLocalTextVal(e.target.value);
              // Live update state
              onUpdateElement(editingElement.id, { text: e.target.value });
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.preventDefault();
                commitInlineEditing();
              } else if (e.key === "Enter") {
                if (editingElement.textType === "point" && !e.shiftKey) {
                  e.preventDefault();
                  commitInlineEditing();
                } else if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                  e.preventDefault();
                  commitInlineEditing();
                }
              }
            }}
            onBlur={() => {
              commitInlineEditing();
            }}
            className="w-full h-full min-h-[48px] bg-black/70 backdrop-blur-sm border-2 border-neon-cyan rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 resize-none shadow-2xl"
            style={{
              fontFamily: getFontFamilyWithFallback(editingElement.fontFamily),
              fontWeight:
                editingElement.fontWeight === "black"
                  ? 900
                  : editingElement.fontWeight === "bold" || editingElement.fontWeight === "700"
                  ? 700
                  : 400,
              fontStyle: editingElement.fontStyle || "normal",
              fontSize: `${editingElement.fontSize || 16}px`,
              color: editingElement.color || "#ffffff",
              textAlign: editingElement.textAlign || "left",
              letterSpacing: `${editingElement.letterSpacing || 0}px`,
              lineHeight: editingElement.lineHeight || 1.3,
              textTransform: editingElement.textTransform || "none",
            }}
            placeholder="Type text..."
          />
        </div>
      )}
    </div>
  );
}

import React, { useRef } from "react";
import { V2Artboard } from "../../types/designerV2";
import { CanvasElement, DesignState } from "../../types/designer";
import { FrameCornerDecorationRenderer } from "../designer/FrameCornerDecorationRenderer";

interface ArtboardRendererV2Props {
  artboard: V2Artboard;
  isSelectedArtboard: boolean;
  selectedElementId: string | null;
  showWireframe: boolean;
  showGrid: boolean;
  scaleFactor: number;
  onSelectArtboard: (artboardId: string) => void;
  onSelectElement: (elementId: string | null) => void;
  onUpdateElementPosition: (artboardId: string, elementId: string, deltaX: number, deltaY: number) => void;
}

export default function ArtboardRendererV2({
  artboard,
  isSelectedArtboard,
  selectedElementId,
  showWireframe,
  showGrid,
  scaleFactor,
  onSelectArtboard,
  onSelectElement,
  onUpdateElementPosition,
}: ArtboardRendererV2Props) {
  const { state, width, height, title } = artboard;
  const isDraggingRef = useRef(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const activeDragElementId = useRef<string | null>(null);

  // Background style computation
  const getBackgroundStyle = (): React.CSSProperties => {
    const bg = state.background;
    if (state.allowTransparentBackground) {
      return { backgroundColor: "transparent" };
    }

    if (bg.type === "solid") {
      return { backgroundColor: bg.solidColor || "#0a0e27" };
    }

    if (bg.type === "gradient") {
      const from = bg.gradientFrom || "#0a0e27";
      const via = bg.gradientVia ? `, ${bg.gradientVia}` : "";
      const to = bg.gradientTo || "#050814";
      return {
        background: `linear-gradient(135deg, ${from}${via}, ${to})`,
      };
    }

    if (bg.type === "radial") {
      const from = bg.gradientFrom || "#0a0e27";
      const to = bg.gradientTo || "#050814";
      return {
        background: `radial-gradient(circle at center, ${from}, ${to})`,
      };
    }

    if (bg.type === "mesh") {
      const c1 = bg.meshColor1 || "#00f5ff";
      const c2 = bg.meshColor2 || "#a855f7";
      const c3 = bg.meshColor3 || "#ff006e";
      return {
        backgroundColor: bg.solidColor || "#0a0e27",
        backgroundImage: `radial-gradient(at 0% 0%, ${c1}44 0px, transparent 50%), radial-gradient(at 100% 100%, ${c2}44 0px, transparent 50%), radial-gradient(at 50% 50%, ${c3}33 0px, transparent 50%)`,
      };
    }

    if (bg.type === "image" && bg.imageUrl) {
      return {
        backgroundImage: `url(${bg.imageUrl})`,
        backgroundSize: bg.imageFit || "cover",
        backgroundPosition: bg.imagePosition || "center",
        filter: `brightness(${bg.brightness ?? 100}%) contrast(${bg.contrast ?? 100}%) blur(${bg.imageBlur ?? 0}px)`,
      };
    }

    return { backgroundColor: "#0a0e27" };
  };

  // Font family helper
  const getFontFamily = (font?: string) => {
    switch (font) {
      case "Orbitron":
        return "'Orbitron', sans-serif";
      case "Rajdhani":
        return "'Rajdhani', sans-serif";
      case "Space Mono":
        return "'Space Mono', monospace";
      case "Inter":
      default:
        return "'Inter', sans-serif";
    }
  };

  // Handle Element Mouse Down (Drag)
  const handleElementMouseDown = (e: React.MouseEvent, elId: string) => {
    e.stopPropagation();
    onSelectArtboard(artboard.id);
    onSelectElement(elId);

    isDraggingRef.current = true;
    activeDragElementId.current = elId;
    dragStartPos.current = { x: e.clientX, y: e.clientY };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingRef.current || !activeDragElementId.current) return;
      const dx = (moveEvent.clientX - dragStartPos.current.x) / scaleFactor;
      const dy = (moveEvent.clientY - dragStartPos.current.y) / scaleFactor;

      const pctDx = (dx / width) * 100;
      const pctDy = (dy / height) * 100;

      onUpdateElementPosition(artboard.id, activeDragElementId.current, pctDx, pctDy);
      dragStartPos.current = { x: moveEvent.clientX, y: moveEvent.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      activeDragElementId.current = null;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const sortedElements = [...(state.elements || [])].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

  return (
    <div
      onClick={() => {
        onSelectArtboard(artboard.id);
        onSelectElement(null);
      }}
      className={`relative select-none transition-shadow ${
        isSelectedArtboard
          ? "ring-2 ring-neon-cyan shadow-[0_0_30px_rgba(0,245,255,0.3)]"
          : "ring-1 ring-white/10 hover:ring-white/30"
      }`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      {/* Artboard Title Tag */}
      <div className="absolute -top-7 left-0 flex items-center gap-2 pointer-events-auto">
        <span className="text-[11px] font-mono font-bold text-neon-cyan bg-black/90 border border-neon-cyan/40 px-2.5 py-0.5 rounded-t-md tracking-wider flex items-center gap-1.5 shadow-md">
          <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse"></span>
          {title} ({width}×{height}px)
        </span>
      </div>

      {/* Main Artboard Background Stage */}
      <div
        id={`artboard-stage-${artboard.id}`}
        className="w-full h-full relative overflow-hidden rounded-xl shadow-2xl"
        style={getBackgroundStyle()}
      >
        {/* Optional Grid Overlay */}
        {showGrid && (
          <div
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(0, 245, 255, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 245, 255, 0.1) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />
        )}

        {/* Blueprint Wireframe Overlay */}
        {showWireframe && (
          <div className="absolute inset-0 pointer-events-none z-30 border border-neon-purple/40 bg-neon-purple/5">
            <div className="absolute inset-4 border border-dashed border-neon-purple/30" />
            <div className="absolute top-2 left-2 text-[9px] font-mono text-neon-purple/80 uppercase tracking-widest">
              [BLUEPRINT WIREFRAME OVERLAY]
            </div>
            <div className="absolute top-0 bottom-0 left-1/2 border-r border-dashed border-neon-purple/20" />
            <div className="absolute left-0 right-0 top-1/2 border-b border-dashed border-neon-purple/20" />
          </div>
        )}

        {/* Glassmorphism Inner Container Panel */}
        {state.showGlassPanel && (
          <div
            className="absolute inset-4 rounded-xl border border-white/15 pointer-events-none z-1"
            style={{
              backgroundColor: `rgba(10, 14, 39, ${state.glassOpacity ?? 0.3})`,
              backdropFilter: `blur(${state.glassBlur ?? 10}px)`,
            }}
          />
        )}

        {/* Frame & Corner Decoration System */}
        <FrameCornerDecorationRenderer
          cornerDecorations={state.cornerDecorations}
          frameConfig={state.frameConfig}
          width={width}
          height={height}
          containerScale={1}
        />

        {/* Rendered Elements */}
        <div className="absolute inset-0 z-10 pointer-events-auto">
          {sortedElements.map((el) => {
            if (!el.visible) return null;
            const isSelected = isSelectedArtboard && selectedElementId === el.id;

            return (
              <div
                key={el.id}
                onMouseDown={(e) => handleElementMouseDown(e, el.id)}
                className={`absolute cursor-grab active:cursor-grabbing transition-all ${
                  isSelected ? "ring-2 ring-neon-cyan shadow-[0_0_15px_rgba(0,245,255,0.5)] z-40" : ""
                }`}
                style={{
                  left: `${el.x}%`,
                  top: `${el.y}%`,
                  width: el.width ? `${el.width}%` : "auto",
                  height: el.height ? `${el.height}%` : "auto",
                  transform: el.rotation ? `rotate(${el.rotation}deg)` : "none",
                  opacity: el.opacity ?? 1,
                  zIndex: el.zIndex || 1,
                }}
              >
                {/* Text Layer */}
                {el.type === "text" && (
                  <div
                    style={{
                      fontFamily: getFontFamily(el.fontFamily),
                      fontSize: `${el.fontSize || 24}px`,
                      fontWeight: el.fontWeight || "normal",
                      color: el.gradientText ? "transparent" : el.color || "#ffffff",
                      backgroundImage: el.gradientText
                        ? "linear-gradient(135deg, #00f5ff, #a855f7, #ff006e)"
                        : "none",
                      WebkitBackgroundClip: el.gradientText ? "text" : "border-box",
                      textAlign: el.textAlign || "left",
                      letterSpacing: `${el.letterSpacing || 0}px`,
                      lineHeight: el.lineHeight || 1.2,
                    }}
                    className="w-full h-full select-none leading-tight"
                  >
                    {el.text || "Sample Text"}
                  </div>
                )}

                {/* Badge Layer */}
                {el.type === "badge" && (
                  <div
                    style={{
                      backgroundColor: el.bg || "rgba(0, 245, 255, 0.15)",
                      color: el.textColor || "#00f5ff",
                      borderColor: el.borderColor || "#00f5ff",
                      borderRadius: `${el.borderRadius || 8}px`,
                    }}
                    className="w-full h-full border px-3 py-1 flex items-center justify-center font-mono font-bold text-xs uppercase tracking-wider backdrop-blur-md shadow-md"
                  >
                    {el.text || "BADGE"}
                  </div>
                )}

                {/* Button Layer */}
                {el.type === "button" && (
                  <div
                    style={{
                      borderRadius: `${el.borderRadius || 12}px`,
                    }}
                    className="w-full h-full bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink text-white font-display font-bold text-xs uppercase tracking-widest flex items-center justify-center shadow-[0_0_20px_rgba(0,245,255,0.4)]"
                  >
                    {el.text || "ACTION BUTTON"}
                  </div>
                )}

                {/* Image Layer */}
                {el.type === "image" && (
                  <div
                    className="w-full h-full relative overflow-hidden"
                    style={{
                      borderRadius: `${el.borderRadius || 12}px`,
                      border: el.borderWidth ? `${el.borderWidth}px solid ${el.borderColor || "rgba(255,255,255,0.2)"}` : "none",
                    }}
                  >
                    {el.url ? (
                      <img
                        src={el.url}
                        alt={el.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full bg-black/60 border border-dashed border-neon-cyan/50 rounded-xl flex items-center justify-center text-neon-cyan font-mono text-xs">
                        Image Layer
                      </div>
                    )}
                  </div>
                )}

                {/* Shape Layer */}
                {el.type === "shape" && (
                  <div
                    style={{
                      backgroundColor: el.bg || "rgba(0, 245, 255, 0.2)",
                      borderColor: el.borderColor || "#00f5ff",
                      borderRadius: `${el.borderRadius || 8}px`,
                    }}
                    className="w-full h-full border backdrop-blur-sm"
                  />
                )}

                {/* Selection Handle Dots */}
                {isSelected && (
                  <>
                    <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-neon-cyan border border-black rounded-full" />
                    <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-neon-cyan border border-black rounded-full" />
                    <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-neon-cyan border border-black rounded-full" />
                    <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-neon-cyan border border-black rounded-full" />
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

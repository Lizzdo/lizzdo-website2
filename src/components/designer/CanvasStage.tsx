import React, { forwardRef } from "react";
import { DesignState, CanvasElement } from "../../types/designer";

interface CanvasStageProps {
  state: DesignState;
  scaleFactor?: number;
  interactive?: boolean;
  selectedElementId?: string;
  onSelectElement?: (elementId: string) => void;
}

export const CanvasStage = forwardRef<HTMLDivElement, CanvasStageProps>(
  ({ state, scaleFactor = 1, interactive = true, selectedElementId, onSelectElement }, ref) => {
    const {
      width,
      height,
      background,
      elements = [],
      showCyberBorders,
      showGlassPanel,
      glassOpacity,
      glassBlur,
      showGuides,
      showGrid,
      showSafeMargins,
      allowTransparentBackground,
    } = state;

    // Pattern background style generator
    const getPatternSvg = () => {
      switch (background.pattern) {
        case "grid":
          return `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0z' fill='none'/%3E%3Cpath d='M0 40h40M40 0v40' fill='none' stroke='rgba(0, 245, 255, ${background.patternOpacity})' stroke-width='1'/%3E%3C/svg%3E")`;
        case "scanline":
          return `linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, ${background.patternOpacity * 0.8}) 50%)`;
        case "dots":
          return `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1.5' fill='rgba(255, 255, 255, ${background.patternOpacity})'/%3E%3C/svg%3E")`;
        case "hexagons":
          return `url("data:image/svg+xml,%3Csvg width='28' height='49' viewBox='0 0 28 49' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l13-7.5z' fill='none' stroke='rgba(168, 85, 247, ${background.patternOpacity})' stroke-width='1'/%3E%3C/svg%3E")`;
        default:
          return "none";
      }
    };

    // Shadow glow mapping
    const getGlowShadow = (glowType?: string) => {
      switch (glowType) {
        case "cyan":
          return "0 0 35px rgba(0, 245, 255, 0.5)";
        case "purple":
          return "0 0 35px rgba(168, 85, 247, 0.5)";
        case "pink":
          return "0 0 35px rgba(255, 0, 110, 0.5)";
        case "orange":
          return "0 0 35px rgba(255, 149, 0, 0.5)";
        default:
          return "none";
      }
    };

    // Font family mapping
    const getFontFamily = (font?: string) => {
      switch (font) {
        case "Orbitron":
          return "var(--font-display), 'Orbitron', sans-serif";
        case "Rajdhani":
          return "var(--font-future), 'Rajdhani', sans-serif";
        case "Space Mono":
          return "var(--font-mono), 'Space Mono', monospace";
        case "Inter":
        default:
          return "var(--font-sans), 'Inter', sans-serif";
      }
    };

    // Sorted elements by zIndex
    const sortedElements = [...elements].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

    return (
      /* OUTER DISPLAY VIEWPORT FRAME (SCALES VISUALLY IN EDITOR WITH ROUNDED BORDERS & DROP SHADOW) */
      <div
        style={{
          width: `${width * scaleFactor}px`,
          height: `${height * scaleFactor}px`,
          position: "relative",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 25px 60px -15px rgba(0,0,0,0.9), 0 0 1px 1px rgba(255,255,255,0.1)",
        }}
        className="select-none font-sans transition-all duration-200"
      >
        {/* INTERMEDIATE TRANSFORM CONTAINER */}
        <div
          style={{
            width: `${width}px`,
            height: `${height}px`,
            transform: `scale(${scaleFactor})`,
            transformOrigin: "top left",
          }}
        >
          {/* PRISTINE UNTRANSFORMED CANVAS ROOT (TARGETED BY HTML-TO-IMAGE FOR 100% EDGE-TO-EDGE EXPORT) */}
          <div
            ref={ref}
            id="lizzdo-designer-canvas"
            style={{
              width: `${width}px`,
              height: `${height}px`,
              position: "relative",
              overflow: "hidden",
              margin: 0,
              padding: 0,
              borderRadius: allowTransparentBackground ? "16px" : "0px",
              backgroundColor: allowTransparentBackground ? "transparent" : (background.solidColor || "#0a0e27"),
              backgroundImage:
                allowTransparentBackground
                  ? "none"
                  : background.type === "gradient"
                  ? `linear-gradient(${
                      background.gradientDirection === "to-r"
                        ? "90deg"
                        : background.gradientDirection === "to-br"
                        ? "135deg"
                        : background.gradientDirection === "to-b"
                        ? "180deg"
                        : "45deg"
                    }, ${background.gradientFrom || "#020617"}, ${background.gradientTo || "#0f172a"})`
                  : background.type === "image" && background.imageUrl
                  ? `url(${background.imageUrl})`
                  : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Background Image Layer if set */}
            {!allowTransparentBackground && background.type === "image" && background.imageUrl && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url(${background.imageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  opacity: background.imageOpacity ?? 0.8,
                  filter: `blur(${background.imageBlur || 0}px)`,
                  pointerEvents: "none",
                  zIndex: 0,
                }}
              />
            )}

            {/* Pattern Overlay */}
            {!allowTransparentBackground && background.pattern && background.pattern !== "none" && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: getPatternSvg(),
                  backgroundSize: background.pattern === "scanline" ? "100% 4px" : "auto",
                  pointerEvents: "none",
                  zIndex: 1,
                }}
              />
            )}

            {/* Glass Panel Overlay if enabled */}
            {showGlassPanel && (
              <div
                style={{
                  position: "absolute",
                  inset: "16px",
                  borderRadius: "20px",
                  backgroundColor: `rgba(10, 14, 39, ${glassOpacity ?? 0.3})`,
                  backdropFilter: `blur(${glassBlur ?? 12}px)`,
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  pointerEvents: "none",
                  zIndex: 2,
                }}
              />
            )}

            {/* Cyber Neon Corner Accents */}
            {showCyberBorders && (
              <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 50 }}>
                {/* Top Left */}
                <div style={{ position: "absolute", top: 12, left: 12, width: 24, height: 24, borderTop: "2px solid #00f5ff", borderLeft: "2px solid #00f5ff" }} />
                {/* Top Right */}
                <div style={{ position: "absolute", top: 12, right: 12, width: 24, height: 24, borderTop: "2px solid #00f5ff", borderRight: "2px solid #00f5ff" }} />
                {/* Bottom Left */}
                <div style={{ position: "absolute", bottom: 12, left: 12, width: 24, height: 24, borderBottom: "2px solid #00f5ff", borderLeft: "2px solid #00f5ff" }} />
                {/* Bottom Right */}
                <div style={{ position: "absolute", bottom: 12, right: 12, width: 24, height: 24, borderBottom: "2px solid #00f5ff", borderRight: "2px solid #00f5ff" }} />
              </div>
            )}

            {/* EDITOR GUIDES & SAFE MARGIN OVERLAYS (HIDDEN ON EXPORT) */}
            {showGuides && (
              <div data-export-hide="true" className="pointer-events-none absolute inset-0 z-40">
                {/* Vertical Center Guide */}
                <div className="absolute top-0 bottom-0 left-1/2 w-px border-r border-dashed border-neon-cyan/70" />
                <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] font-mono text-neon-cyan bg-black/80 px-1.5 py-0.5 rounded border border-neon-cyan/40">
                  CENTER X
                </span>

                {/* Horizontal Center Guide */}
                <div className="absolute left-0 right-0 top-1/2 h-px border-b border-dashed border-neon-cyan/70" />
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] font-mono text-neon-cyan bg-black/80 px-1.5 py-0.5 rounded border border-neon-cyan/40">
                  CENTER Y
                </span>
              </div>
            )}

            {showSafeMargins && (
              <div data-export-hide="true" className="pointer-events-none absolute inset-[5%] border border-dashed border-amber-400/60 z-40 rounded-lg">
                <span className="absolute top-1 left-2 text-[9px] font-mono text-amber-300 bg-black/80 px-1.5 py-0.5 rounded">
                  SAFE EXPORT MARGIN (5%)
                </span>
              </div>
            )}

            {showGrid && (
              <div data-export-hide="true" className="pointer-events-none absolute inset-0 z-40">
                <div className="absolute top-1/3 left-0 right-0 h-px border-b border-dashed border-white/20" />
                <div className="absolute top-2/3 left-0 right-0 h-px border-b border-dashed border-white/20" />
                <div className="absolute left-1/3 top-0 bottom-0 w-px border-r border-dashed border-white/20" />
                <div className="absolute left-2/3 top-0 bottom-0 w-px border-r border-dashed border-white/20" />
              </div>
            )}

            {/* DYNAMIC ELEMENTS LAYER */}
            {sortedElements.map((el) => {
              if (!el.visible) return null;
              const isSelected = selectedElementId === el.id;

              const selectionStyle =
                interactive && isSelected
                  ? "ring-2 ring-neon-cyan ring-offset-2 ring-offset-black transition-all"
                  : interactive
                  ? "hover:ring-1 hover:ring-neon-cyan/50 transition-all cursor-pointer"
                  : "";

              // IMAGE ELEMENT
              if (el.type === "image") {
                const objectFitValue =
                  el.fitMode === "contain"
                    ? "contain"
                    : el.fitMode === "fill"
                    ? "fill"
                    : "cover";

                return (
                  <div
                    key={el.id}
                    style={{
                      position: "absolute",
                      left: `${el.x}%`,
                      top: `${el.y}%`,
                      width: el.width ? `${el.width}%` : "100%",
                      height: el.height ? `${el.height}%` : "100%",
                      overflow: "hidden",
                      borderRadius: `${el.borderRadius ?? 16}px`,
                      border: `${el.borderWidth || 0}px solid ${el.borderColor || "rgba(255,255,255,0.1)"}`,
                      boxShadow: getGlowShadow(el.shadowGlow),
                      opacity: el.opacity ?? 1,
                      zIndex: el.zIndex || 10,
                    }}
                    onClick={() => interactive && onSelectElement?.(el.id)}
                    className={selectionStyle}
                  >
                    {/* Ambient Blurred Background if Contain mode */}
                    {el.fitMode === "contain" && el.url && (
                      <img
                        src={el.url}
                        alt=""
                        style={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          filter: "blur(20px)",
                          opacity: 0.35,
                          transform: "scale(1.2)",
                          pointerEvents: "none",
                        }}
                        referrerPolicy="no-referrer"
                      />
                    )}

                    {el.url && (
                      <img
                        src={el.url}
                        alt={el.name}
                        style={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: objectFitValue,
                          transform: `scale(${el.scale || 1}) translate(${el.xOffset || 0}px, ${el.yOffset || 0}px) rotate(${el.rotation || 0}deg)`,
                          transformOrigin: "center",
                          transition: "transform 0.1s ease-out",
                        }}
                        referrerPolicy="no-referrer"
                      />
                    )}

                    {/* Selection Label Badge */}
                    {interactive && isSelected && (
                      <div
                        data-export-hide="true"
                        className="absolute bottom-2 left-2 bg-neon-cyan text-black text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow z-50 pointer-events-none"
                      >
                        IMAGE: {el.name}
                      </div>
                    )}
                  </div>
                );
              }

              // BADGE / TAG ELEMENT
              if (el.type === "badge") {
                return (
                  <div
                    key={el.id}
                    style={{
                      position: "absolute",
                      left: `${el.x}%`,
                      top: `${el.y}%`,
                      zIndex: el.zIndex || 20,
                      padding: "6px 14px",
                      borderRadius: `${el.borderRadius || 8}px`,
                      backgroundColor: el.bg || "rgba(0, 245, 255, 0.15)",
                      color: el.textColor || "#00f5ff",
                      border: `1px solid ${el.borderColor || "rgba(0, 245, 255, 0.4)"}`,
                      fontSize: `${el.fontSize || 11}px`,
                      fontFamily: "var(--font-mono), 'Space Mono', monospace",
                      fontWeight: 700,
                      letterSpacing: "2px",
                      textTransform: "uppercase",
                      backdropFilter: "blur(8px)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                      opacity: el.opacity ?? 1,
                    }}
                    onClick={() => interactive && onSelectElement?.(el.id)}
                    className={selectionStyle}
                  >
                    {el.text}
                  </div>
                );
              }

              // TEXT ELEMENT
              if (el.type === "text") {
                return (
                  <div
                    key={el.id}
                    style={{
                      position: "absolute",
                      left: `${el.x}%`,
                      top: `${el.y}%`,
                      zIndex: el.zIndex || 30,
                      width: "88%",
                      fontFamily: getFontFamily(el.fontFamily),
                      fontWeight: el.fontWeight === "black" ? 900 : el.fontWeight === "bold" ? 700 : 400,
                      fontSize: `${el.fontSize || 16}px`,
                      color: el.color || "#ffffff",
                      textAlign: el.textAlign || "left",
                      letterSpacing: `${el.letterSpacing || 0}px`,
                      lineHeight: el.lineHeight || 1.3,
                      textTransform: el.textTransform || "none",
                      textShadow: "0 2px 10px rgba(0,0,0,0.8)",
                      opacity: el.opacity ?? 1,
                      ...(el.gradientText
                        ? {
                            background: "linear-gradient(45deg, #00f5ff, #a855f7, #ff006e)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }
                        : {}),
                    }}
                    onClick={() => interactive && onSelectElement?.(el.id)}
                    className={selectionStyle}
                  >
                    {el.text}
                  </div>
                );
              }

              // BUTTON ELEMENT
              if (el.type === "button") {
                return (
                  <div
                    key={el.id}
                    style={{
                      position: "absolute",
                      left: `${el.x}%`,
                      top: `${el.y}%`,
                      zIndex: el.zIndex || 40,
                      padding: "12px 28px",
                      borderRadius: `${el.borderRadius || 12}px`,
                      background: el.bgGradient || "linear-gradient(90deg, #00f5ff, #a855f7)",
                      color: el.textColor || "#ffffff",
                      fontFamily: "var(--font-display), 'Orbitron', sans-serif",
                      fontWeight: 800,
                      fontSize: `${el.fontSize || 12}px`,
                      letterSpacing: "2px",
                      textTransform: "uppercase",
                      boxShadow: "0 0 25px rgba(0, 245, 255, 0.4)",
                      opacity: el.opacity ?? 1,
                    }}
                    onClick={() => interactive && onSelectElement?.(el.id)}
                    className={selectionStyle}
                  >
                    {el.text}
                  </div>
                );
              }

              // LOGO ELEMENT
              if (el.type === "logo") {
                return (
                  <div
                    key={el.id}
                    style={{
                      position: "absolute",
                      left: `${el.x}%`,
                      top: `${el.y}%`,
                      transform: "translate(-50%, -50%)",
                      zIndex: el.zIndex || 45,
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      opacity: el.opacity ?? 1,
                    }}
                    onClick={() => interactive && onSelectElement?.(el.id)}
                    className={selectionStyle}
                  >
                    {el.url ? (
                      <img src={el.url} alt="Logo" style={{ height: `${(el.size || 20) * 1.5}px` }} />
                    ) : (
                      <div
                        style={{
                          height: `${(el.size || 20) * 1.5}px`,
                          padding: "0 12px",
                          borderRadius: "8px",
                          backgroundColor: "rgba(0, 0, 0, 0.6)",
                          border: "1px solid rgba(0, 245, 255, 0.5)",
                          color: "#00f5ff",
                          fontFamily: "var(--font-display), 'Orbitron', sans-serif",
                          fontWeight: 900,
                          fontSize: `${el.size || 20}px`,
                          letterSpacing: "3px",
                          textShadow: el.glow ? "0 0 10px rgba(0, 245, 255, 0.8)" : "none",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {el.text || "LIZZDO"}
                      </div>
                    )}
                  </div>
                );
              }

              // SHAPE / DIVIDER ELEMENT
              if (el.type === "shape") {
                return (
                  <div
                    key={el.id}
                    style={{
                      position: "absolute",
                      left: `${el.x}%`,
                      top: `${el.y}%`,
                      width: el.width ? `${el.width}%` : "50%",
                      height: el.height ? `${el.height}px` : "2px",
                      backgroundColor: el.bg || "rgba(0, 245, 255, 0.5)",
                      borderRadius: `${el.borderRadius || 0}px`,
                      zIndex: el.zIndex || 5,
                      opacity: el.opacity ?? 1,
                    }}
                    onClick={() => interactive && onSelectElement?.(el.id)}
                    className={selectionStyle}
                  />
                );
              }

              return null;
            })}
          </div>
        </div>
      </div>
    );
  }
);

CanvasStage.displayName = "CanvasStage";

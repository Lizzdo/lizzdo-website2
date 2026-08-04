import React, { forwardRef } from "react";
import { DesignState, CanvasElement } from "../../types/designer";
import { FrameCornerDecorationRenderer } from "./FrameCornerDecorationRenderer";

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
      const pColor = background.patternColor || "rgba(0, 245, 255, 0.4)";
      const op = background.patternOpacity ?? 0.3;
      switch (background.pattern) {
        case "grid":
          return `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0z' fill='none'/%3E%3Cpath d='M0 40h40M40 0v40' fill='none' stroke='${encodeURIComponent(
            pColor
          )}' stroke-opacity='${op}' stroke-width='1'/%3E%3C/svg%3E")`;
        case "scanline":
          return `linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, ${op * 0.8}) 50%)`;
        case "dots":
          return `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1.5' fill='${encodeURIComponent(
            pColor
          )}' fill-opacity='${op}'/%3E%3C/svg%3E")`;
        case "hexagons":
          return `url("data:image/svg+xml,%3Csvg width='28' height='49' viewBox='0 0 28 49' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l13-7.5z' fill='none' stroke='${encodeURIComponent(
            pColor
          )}' stroke-opacity='${op}' stroke-width='1'/%3E%3C/svg%3E")`;
        case "circuit":
          return `url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10h20v20H0zM30 30h20v20H30z' fill='none' stroke='${encodeURIComponent(
            pColor
          )}' stroke-opacity='${op}' stroke-width='1'/%3E%3Ccircle cx='20' cy='10' r='3' fill='${encodeURIComponent(
            pColor
          )}' fill-opacity='${op}'/%3E%3C/svg%3E")`;
        case "cross":
          return `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 0v24M0 12h24' fill='none' stroke='${encodeURIComponent(
            pColor
          )}' stroke-opacity='${op}' stroke-width='1'/%3E%3C/svg%3E")`;
        case "cyber":
          return `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M15 0 L30 15 L15 30 L0 15 Z' fill='none' stroke='${encodeURIComponent(
            pColor
          )}' stroke-opacity='${op}' stroke-width='1'/%3E%3C/svg%3E")`;
        case "noise":
          return `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)' opacity='${
            op * 0.25
          }'/%3E%3C/svg%3E")`;
        default:
          return "none";
      }
    };

    // Calculate background CSS dynamically
    const getBackgroundCss = () => {
      if (allowTransparentBackground) return { backgroundColor: "transparent", backgroundImage: "none" };

      const type = background.type || "gradient";
      const from = background.gradientFrom || "#020617";
      const via = background.gradientVia;
      const to = background.gradientTo || "#0f172a";

      if (type === "solid") {
        return {
          backgroundColor: background.solidColor || "#0a0e27",
          backgroundImage: "none",
        };
      }

      if (type === "gradient") {
        const angle =
          background.gradientAngle !== undefined
            ? `${background.gradientAngle}deg`
            : background.gradientDirection === "to-r"
            ? "90deg"
            : background.gradientDirection === "to-br"
            ? "135deg"
            : background.gradientDirection === "to-b"
            ? "180deg"
            : background.gradientDirection === "to-bl"
            ? "225deg"
            : "45deg";

        const stops = via ? `${from}, ${via}, ${to}` : `${from}, ${to}`;
        return {
          backgroundColor: from,
          backgroundImage: `linear-gradient(${angle}, ${stops})`,
        };
      }

      if (type === "radial") {
        const shape = background.radialShape || "circle";
        const pos = background.radialPosition || "center";
        const stops = via ? `${from}, ${via}, ${to}` : `${from}, ${to}`;
        return {
          backgroundColor: from,
          backgroundImage: `radial-gradient(${shape} at ${pos}, ${stops})`,
        };
      }

      if (type === "mesh") {
        const c1 = background.meshColor1 || "#00f5ff";
        const c2 = background.meshColor2 || "#a855f7";
        const c3 = background.meshColor3 || "#ff006e";
        const c4 = background.meshColor4 || "#020617";
        return {
          backgroundColor: background.solidColor || "#0a0e27",
          backgroundImage: `radial-gradient(at 0% 0%, ${c1} 0px, transparent 50%), radial-gradient(at 100% 0%, ${c2} 0px, transparent 50%), radial-gradient(at 100% 100%, ${c3} 0px, transparent 50%), radial-gradient(at 0% 100%, ${c4} 0px, transparent 50%)`,
        };
      }

      if (type === "glass") {
        return {
          backgroundColor: background.solidColor || "#090d20",
          backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.02) 100%)`,
        };
      }

      if (type === "image" && background.imageUrl) {
        return {
          backgroundColor: background.solidColor || "#000000",
          backgroundImage: `url(${background.imageUrl})`,
          backgroundSize: background.imageFit || "cover",
          backgroundPosition: background.imagePosition || "center",
        };
      }

      return {
        backgroundColor: background.solidColor || "#0a0e27",
        backgroundImage: "none",
      };
    };

    // Filter effect for Logo
    const getLogoFilter = (effect?: string) => {
      switch (effect) {
        case "invert":
          return "invert(1) brightness(1.8)";
        case "grayscale":
          return "grayscale(1) brightness(1.2)";
        case "cyan-tint":
          return "drop-shadow(0 0 10px #00f5ff) sepia(1) hue-rotate(130deg) saturate(3)";
        case "purple-tint":
          return "drop-shadow(0 0 10px #a855f7) sepia(1) hue-rotate(220deg) saturate(3)";
        case "gold-tint":
          return "drop-shadow(0 0 10px #ffb703) sepia(1) hue-rotate(340deg) saturate(4)";
        case "brightness-boost":
          return "brightness(1.5) contrast(1.2)";
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
              ...getBackgroundCss(),
              filter: `brightness(${background.brightness ?? 100}%) contrast(${background.contrast ?? 100}%) blur(${background.blur ?? 0}px)`,
            }}
          >
            {/* Color Overlay Layer if configured */}
            {!allowTransparentBackground && background.overlayColor && (background.overlayOpacity ?? 0) > 0 && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: background.overlayColor,
                  opacity: background.overlayOpacity,
                  pointerEvents: "none",
                  zIndex: 1,
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
                  zIndex: 2,
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

            {/* Frame Library & Customizable Corner Frame Decorations */}
            <FrameCornerDecorationRenderer
              cornerDecorations={state.cornerDecorations}
              frameConfig={state.frameConfig}
              showCyberBordersFallback={showCyberBorders}
            />

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
              <div
                data-export-hide="true"
                className="pointer-events-none absolute border-2 border-dashed border-amber-400/70 z-40 rounded-xl bg-amber-400/5 shadow-[0_0_15px_rgba(251,191,36,0.15)]"
                style={{ inset: `${state.safeMarginPct || 5}%` }}
              >
                <div className="absolute top-1.5 left-2 flex items-center gap-1.5">
                  <span className="text-[9px] font-mono text-amber-300 bg-black/90 px-2 py-0.5 rounded border border-amber-400/40 font-bold uppercase tracking-wider">
                    SAFE EXPORT MARGIN ({state.safeMarginPct || 5}%)
                  </span>
                </div>
                {state.safeNote && (
                  <div className="absolute bottom-1.5 left-2 right-2 flex justify-end">
                    <span className="text-[9px] font-mono text-amber-200/90 bg-black/90 px-2 py-0.5 rounded border border-amber-400/30 line-clamp-1 max-w-[90%]">
                      ⚠️ {state.safeNote}
                    </span>
                  </div>
                )}
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
                    data-element-id={el.id}
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
                        crossOrigin="anonymous"
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
                        crossOrigin="anonymous"
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
                    data-element-id={el.id}
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
                    data-element-id={el.id}
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
                    data-element-id={el.id}
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
                const logoSize = el.size || 24;
                const isImageLogo = el.logoType === "image" || (el.url && el.logoType !== "text");

                return (
                  <div
                    key={el.id}
                    data-element-id={el.id}
                    style={{
                      position: "absolute",
                      left: `${el.x}%`,
                      top: `${el.y}%`,
                      transform: "translate(-50%, -50%)",
                      zIndex: el.zIndex || 45,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      opacity: el.opacity ?? 1,
                      padding: `${el.padding ?? 0}px`,
                      borderRadius: `${el.borderRadius ?? 12}px`,
                      backgroundColor: el.bg || "transparent",
                      border: el.borderWidth ? `${el.borderWidth}px solid ${el.borderColor || "rgba(0, 245, 255, 0.4)"}` : "none",
                      boxShadow: el.shadowGlow && el.shadowGlow !== "none" ? getGlowShadow(el.shadowGlow) : el.glow ? "0 0 20px rgba(0, 245, 255, 0.6)" : "none",
                      backdropFilter: el.bg && el.bg !== "transparent" ? "blur(12px)" : "none",
                    }}
                    onClick={() => interactive && onSelectElement?.(el.id)}
                    className={selectionStyle}
                  >
                    {isImageLogo && el.url ? (
                      <img
                        src={el.url}
                        alt={el.name || "Logo"}
                        crossOrigin="anonymous"
                        style={{
                          height: `${logoSize * 1.5}px`,
                          width: "auto",
                          maxHeight: "180px",
                          objectFit: "contain",
                          filter: getLogoFilter(el.filterEffect),
                          transition: "all 0.2s ease-out",
                        }}
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div
                        style={{
                          padding: "4px 12px",
                          color: el.textColor || el.color || "#00f5ff",
                          fontFamily: getFontFamily(el.fontFamily || "Orbitron"),
                          fontWeight: 900,
                          fontSize: `${logoSize}px`,
                          letterSpacing: `${el.letterSpacing || 3}px`,
                          textTransform: "uppercase",
                          textShadow: el.glow ? "0 0 12px rgba(0, 245, 255, 0.8)" : "0 2px 8px rgba(0,0,0,0.8)",
                          display: "flex",
                          alignItems: "center",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {el.text || "LIZZDO"}
                      </div>
                    )}

                    {interactive && isSelected && (
                      <div
                        data-export-hide="true"
                        className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-neon-cyan text-black text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shadow z-50 pointer-events-none whitespace-nowrap"
                      >
                        LOGO: {el.name || "Brand"}
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

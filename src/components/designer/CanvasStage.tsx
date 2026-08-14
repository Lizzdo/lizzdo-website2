import React, { forwardRef } from "react";
import { DesignState, CanvasElement, WatermarkConfig } from "../../types/designer";
import { FrameCornerDecorationRenderer } from "./FrameCornerDecorationRenderer";
import { getCanvasElementCssFilter } from "../../utils/imageProcessing";
import { getFontFamilyWithFallback } from "../../utils/fontLoader";

interface CanvasStageProps {
  state: DesignState;
  scaleFactor?: number;
  interactive?: boolean;
  selectedElementId?: string | null;
  selectedElementIds?: string[];
  onSelectElement?: (elementId: string) => void;
}

// SVG VECTOR HELPERS
function getDrawPathSvg(points?: Array<{ x: number; y: number }>) {
  if (!points || points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y} L ${points[0].x + 0.1} ${points[0].y + 0.1}`;
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length - 1; i++) {
    const xc = (points[i].x + points[i + 1].x) / 2;
    const yc = (points[i].y + points[i + 1].y) / 2;
    d += ` Q ${points[i].x} ${points[i].y}, ${xc} ${yc}`;
  }
  d += ` L ${points[points.length - 1].x} ${points[points.length - 1].y}`;
  return d;
}

function getVectorPathSvg(pathPoints?: Array<any>, pathData?: string, closed?: boolean) {
  if (pathData) return pathData;
  if (!pathPoints || pathPoints.length === 0) return "";
  let d = `M ${pathPoints[0].x} ${pathPoints[0].y}`;
  for (let i = 1; i < pathPoints.length; i++) {
    const prev = pathPoints[i - 1];
    const curr = pathPoints[i];
    if (prev.handleOut || curr.handleIn) {
      const h1x = prev.handleOut ? prev.handleOut.x : prev.x;
      const h1y = prev.handleOut ? prev.handleOut.y : prev.y;
      const h2x = curr.handleIn ? curr.handleIn.x : curr.x;
      const h2y = curr.handleIn ? curr.handleIn.y : curr.y;
      d += ` C ${h1x} ${h1y}, ${h2x} ${h2y}, ${curr.x} ${curr.y}`;
    } else {
      d += ` L ${curr.x} ${curr.y}`;
    }
  }
  if (closed) d += " Z";
  return d;
}

function getDashArray(style?: string, width: number = 2) {
  if (style === "dashed") return `${width * 3} ${width * 2}`;
  if (style === "dotted") return `${width} ${width * 1.5}`;
  return "none";
}

export const CanvasStage = forwardRef<HTMLDivElement, CanvasStageProps>(
  (
    {
      state,
      scaleFactor = 1,
      interactive = true,
      selectedElementId,
      selectedElementIds = [],
      onSelectElement,
    },
    ref
  ) => {
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
          return "'Orbitron', sans-serif";
        case "Rajdhani":
          return "'Rajdhani', sans-serif";
        case "Space Mono":
          return "'Space Mono', monospace";
        case "Playfair Display":
          return "'Playfair Display', serif";
        case "Plus Jakarta Sans":
          return "'Plus Jakarta Sans', sans-serif";
        case "Inter":
        default:
          return font || "'Inter', sans-serif";
      }
    };

    // Object drop shadow CSS string generator
    const getElementShadowStyle = (el: CanvasElement) => {
      if (el.shadow?.enabled) {
        const { color, blur, spread, offsetX, offsetY, opacity } = el.shadow;
        return `${offsetX}px ${offsetY}px ${blur}px ${spread}px ${color || "rgba(0,0,0,0.5)"}`;
      }
      return "none";
    };

    // Clip path generator for masking
    const getMaskClipPath = (mask?: CanvasElement["mask"]) => {
      if (!mask || !mask.enabled || mask.shape === "none") return "none";
      switch (mask.shape) {
        case "circle":
          return "circle(50% at 50% 50%)";
        case "ellipse":
          return "ellipse(50% 40% at 50% 50%)";
        case "rounded":
          return "inset(0% round 16px)";
        case "star":
          return "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)";
        case "hexagon":
          return "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)";
        case "triangle":
          return "polygon(50% 0%, 0% 100%, 100% 100%)";
        default:
          return "none";
      }
    };

    // Sorted elements by zIndex
    const sortedElements = [...elements].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

    return (
      /* OUTER DISPLAY VIEWPORT FRAME */
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
          {/* PRISTINE UNTRANSFORMED CANVAS ROOT */}
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

            {/* EDITOR GUIDES & SAFE MARGIN OVERLAYS */}
            {showGuides && (
              <div data-export-hide="true" className="pointer-events-none absolute inset-0 z-40">
                <div className="absolute top-0 bottom-0 left-1/2 w-px border-r border-dashed border-neon-cyan/70" />
                <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] font-mono text-neon-cyan bg-black/80 px-1.5 py-0.5 rounded border border-neon-cyan/40">
                  CENTER X
                </span>
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
              if (el.visible === false) return null;
              const isSelected = selectedElementId === el.id || selectedElementIds.includes(el.id);

              const selectionStyle =
                interactive && isSelected
                  ? "ring-2 ring-neon-cyan ring-offset-2 ring-offset-black transition-all"
                  : interactive
                  ? "hover:ring-1 hover:ring-neon-cyan/50 transition-all cursor-pointer"
                  : "";

              const elementBoxShadow = getElementShadowStyle(el) !== "none" ? getElementShadowStyle(el) : getGlowShadow(el.shadowGlow);

              // IMAGE ELEMENT
              if (el.type === "image") {
                const cr = el.cornerRadii;
                const borderRadiusStyle =
                  cr && !cr.disabled
                    ? `${cr.topLeft}px ${cr.topRight}px ${cr.bottomRight}px ${cr.bottomLeft}px`
                    : `${el.borderRadius ?? 16}px`;

                const frameShape = el.frame?.shape || "rectangle";
                let frameRadiusStyle = borderRadiusStyle;
                if (frameShape === "circle") {
                  frameRadiusStyle = "50%";
                } else if (frameShape === "oval") {
                  frameRadiusStyle = "50% / 50%";
                }

                const borderObj = el.border;
                const borderStyleStr = borderObj?.enabled
                  ? `${borderObj.width || 2}px ${borderObj.style || "solid"} ${borderObj.color || "#00f5ff"}`
                  : el.borderWidth
                  ? `${el.borderWidth}px solid ${el.borderColor || "rgba(255,255,255,0.1)"}`
                  : "none";
                const borderOpacity = borderObj?.enabled ? (borderObj.opacity ?? 1) : 1;

                const frameFit = el.frame?.fit || (el.fitMode === "contain" ? "contain" : el.fitMode === "fill" ? "fill" : "cover");
                const objectFitValue = frameFit === "contain" ? "contain" : frameFit === "fill" ? "fill" : "cover";

                const zoom = (el.frame?.zoom || el.scale || 1) * (el.mask?.zoom || 1);
                const offsetX = (el.frame?.offsetX || el.xOffset || 0) + (el.mask?.offsetX || 0);
                const offsetY = (el.frame?.offsetY || el.yOffset || 0) + (el.mask?.offsetY || 0);
                const flipXScale = el.flipX ? -1 : 1;
                const flipYScale = el.flipY ? -1 : 1;
                const imgRotation = (el.frame?.rotation || el.rotation || 0) + (el.mask?.rotation || 0);

                const filterString = getCanvasElementCssFilter(el);

                let extraDropShadows = "";
                if (el.outline?.enabled) {
                  const oW = el.outline.width || 4;
                  const oC = el.outline.color || "#ffffff";
                  const oSoft = el.outline.softness || 0;
                  extraDropShadows += ` drop-shadow(${oW}px 0px ${oSoft}px ${oC}) drop-shadow(-${oW}px 0px ${oSoft}px ${oC}) drop-shadow(0px ${oW}px ${oSoft}px ${oC}) drop-shadow(0px -${oW}px ${oSoft}px ${oC})`;
                }
                if (el.subjectGlow?.enabled) {
                  const gColor = el.subjectGlow.color || "#00f5ff";
                  const gBlur = el.subjectGlow.blur ?? 25;
                  extraDropShadows += ` drop-shadow(0px 0px ${gBlur}px ${gColor})`;
                  if ((el.subjectGlow.intensity ?? 80) > 50) {
                    extraDropShadows += ` drop-shadow(0px 0px ${Math.round(gBlur * 0.5)}px ${gColor})`;
                  }
                }
                if (el.subjectShadow?.enabled) {
                  const sColor = el.subjectShadow.color || "rgba(0,0,0,0.75)";
                  const sBlur = el.subjectShadow.blur ?? 25;
                  const sDist = el.subjectShadow.distance ?? 20;
                  const rad = ((el.subjectShadow.angle ?? 90) * Math.PI) / 180;
                  const offX = Math.round(Math.cos(rad) * sDist);
                  const offY = Math.round(Math.sin(rad) * sDist);
                  extraDropShadows += ` drop-shadow(${offX}px ${offY}px ${sBlur}px ${sColor})`;
                }

                const combinedImgFilter =
                  (filterString !== "brightness(100%) contrast(100%) saturate(100%) blur(0px)" ? filterString : "") +
                  extraDropShadows;

                const crop = el.crop;
                const cropStyle =
                  crop && crop.enabled
                    ? {
                        clipPath: `inset(${crop.y}% ${100 - (crop.x + crop.width)}% ${100 - (crop.y + crop.height)}% ${crop.x}%)`,
                      }
                    : {};

                const maskClipPath = getMaskClipPath(el.mask);

                const hasGradientBorder = el.gradientBorder?.enabled;
                const gbColor1 = el.gradientBorder?.color1 || "#00f5ff";
                const gbColor2 = el.gradientBorder?.color2 || "#a855f7";
                const gbColor3 = el.gradientBorder?.color3;
                const gbStops = gbColor3 ? `${gbColor1}, ${gbColor2}, ${gbColor3}` : `${gbColor1}, ${gbColor2}`;
                const gbAngle = el.gradientBorder?.angle || 135;
                const gbWidth = el.gradientBorder?.width || 4;
                const gbGlow = el.gradientBorder?.glow;

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
                      borderRadius: frameRadiusStyle,
                      border: hasGradientBorder ? "none" : borderStyleStr,
                      background: hasGradientBorder ? `linear-gradient(${gbAngle}deg, ${gbStops})` : "transparent",
                      padding: hasGradientBorder ? `${gbWidth}px` : "0px",
                      opacity: (el.opacity ?? 1) * borderOpacity,
                      boxShadow: hasGradientBorder && gbGlow ? `0 0 20px ${gbColor1}80, ${elementBoxShadow}` : elementBoxShadow,
                      zIndex: el.zIndex || 10,
                      clipPath: maskClipPath !== "none" ? maskClipPath : (cropStyle.clipPath || "none"),
                      backdropFilter: el.backdropBlur ? `blur(${el.backdropBlur}px)` : "none",
                    }}
                    onClick={() => interactive && onSelectElement?.(el.id)}
                    className={selectionStyle}
                  >
                    {/* Inner wrapper if gradient border is enabled */}
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        borderRadius: hasGradientBorder ? `calc(${frameRadiusStyle} - ${gbWidth}px)` : frameRadiusStyle,
                        overflow: "hidden",
                      }}
                    >
                      {/* Ambient Blurred Background if Contain mode */}
                      {frameFit === "contain" && el.url && (
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
                            filter: combinedImgFilter.trim() || "none",
                            transform: `scale(${zoom * flipXScale}, ${zoom * flipYScale}) translate(${offsetX}px, ${offsetY}px) rotate(${imgRotation}deg)`,
                            transformOrigin: "center",
                            transition: "transform 0.1s ease-out, filter 0.1s ease-out",
                          }}
                          referrerPolicy="no-referrer"
                        />
                      )}

                      {/* Shader / Lighting Effect Overlay */}
                      {el.shaderPreset === "soft-light" && (
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background: "radial-gradient(circle at 50% 20%, rgba(255,255,255,0.25) 0%, transparent 70%)",
                            mixBlendMode: "soft-light",
                            pointerEvents: "none",
                          }}
                        />
                      )}
                      {el.shaderPreset === "rim-light" && (
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background: "radial-gradient(circle at 85% 15%, rgba(0,245,255,0.45) 0%, transparent 60%)",
                            mixBlendMode: "screen",
                            pointerEvents: "none",
                          }}
                        />
                      )}
                      {(el.shaderPreset === "neon-glow" || el.shaderPreset === "cyberpunk") && (
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background: "linear-gradient(135deg, rgba(0,245,255,0.35) 0%, transparent 50%, rgba(255,0,110,0.35) 100%)",
                            mixBlendMode: "overlay",
                            pointerEvents: "none",
                          }}
                        />
                      )}
                      {el.shaderPreset === "bloom" && (
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4) 0%, transparent 60%)",
                            mixBlendMode: "screen",
                            pointerEvents: "none",
                          }}
                        />
                      )}
                      {el.shaderPreset === "spotlight" && (
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background: "conic-gradient(from 180deg at 50% 0%, rgba(255,255,255,0.35) 0deg, transparent 60deg, transparent 300deg, rgba(255,255,255,0.35) 360deg)",
                            mixBlendMode: "soft-light",
                            pointerEvents: "none",
                          }}
                        />
                      )}
                      {el.shaderPreset === "holographic" && (
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background: "linear-gradient(45deg, rgba(255,0,0,0.25), rgba(0,255,0,0.25), rgba(0,0,255,0.25), rgba(255,0,255,0.25))",
                            mixBlendMode: "color-dodge",
                            opacity: 0.45,
                            pointerEvents: "none",
                          }}
                        />
                      )}
                      {el.shaderPreset === "metallic" && (
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background: "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.45) 50%, transparent 70%)",
                            mixBlendMode: "hard-light",
                            opacity: 0.5,
                            pointerEvents: "none",
                          }}
                        />
                      )}
                      {el.shaderPreset === "glass" && (
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%)",
                            backdropFilter: "blur(2px)",
                            pointerEvents: "none",
                          }}
                        />
                      )}
                    </div>

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
                      borderRadius: `${el.borderRadius ?? 8}px`,
                      backgroundColor: el.bg || "rgba(0, 245, 255, 0.15)",
                      color: el.textColor || "#00f5ff",
                      border: `1px solid ${el.borderColor || "rgba(0, 245, 255, 0.4)"}`,
                      fontSize: `${el.fontSize || 11}px`,
                      fontFamily: "var(--font-mono), 'Space Mono', monospace",
                      fontWeight: 700,
                      letterSpacing: "2px",
                      textTransform: "uppercase",
                      backdropFilter: "blur(8px)",
                      boxShadow: elementBoxShadow !== "none" ? elementBoxShadow : "0 4px 12px rgba(0,0,0,0.3)",
                      opacity: el.opacity ?? 1,
                    }}
                    onClick={() => interactive && onSelectElement?.(el.id)}
                    className={selectionStyle}
                  >
                    {el.text}
                  </div>
                );
              }

              // WATERMARK ELEMENT
              if (el.type === "watermark") {
                const cfg: WatermarkConfig = el.watermarkConfig || { type: "text" };
                const wType = cfg.type || "text";
                const isTiled = cfg.tiledEnabled || wType === "tiled";
                const scale = (cfg.scale ?? 100) / 100;
                const opacity = cfg.opacity ?? el.opacity ?? 0.35;
                const blendMode = (cfg.blendMode || "normal") as any;
                const textColor = cfg.color || el.color || "#ffffff";
                const textVal = cfg.watermarkText || el.text || "LIZZDO STUDIO";
                const rotation = cfg.rotation ?? el.rotation ?? 0;

                const shadowParts: string[] = [];
                if (cfg.shadowEnabled) {
                  shadowParts.push(
                    `${cfg.shadowX ?? 0}px ${cfg.shadowY ?? 2}px ${cfg.shadowBlur ?? 8}px rgba(0,0,0,${cfg.shadowOpacity ?? 0.6})`
                  );
                }
                if (cfg.glowEnabled) {
                  shadowParts.push(
                    `0 0 ${cfg.glowBlur || 15}px ${cfg.glowColor || "#00f5ff"}`
                  );
                }
                const combinedShadow = shadowParts.length > 0 ? shadowParts.join(", ") : "none";

                const outlineCss = cfg.outlineEnabled
                  ? `${cfg.outlineWidth || 2}px ${cfg.outlineColor || "#ffffff"}`
                  : "none";

                const watermarkTextStyle: React.CSSProperties = {
                  fontFamily: getFontFamily(cfg.fontFamily || el.fontFamily || "Space Grotesk"),
                  fontSize: `${(cfg.fontSize || el.fontSize || 22) * scale}px`,
                  fontWeight: cfg.fontWeight || el.fontWeight || "bold",
                  fontStyle: cfg.fontStyle || "normal",
                  textDecoration: cfg.textDecoration || "none",
                  textTransform: cfg.textTransform || "uppercase",
                  letterSpacing: `${cfg.letterSpacing ?? 4}px`,
                  lineHeight: cfg.lineHeight || 1.2,
                  textAlign: cfg.textAlign || "center",
                  textShadow: combinedShadow,
                  WebkitTextStroke: outlineCss,
                  whiteSpace: "nowrap",
                  userSelect: "none",
                  ...(cfg.gradientEnabled
                    ? {
                        background: `linear-gradient(${cfg.gradientAngle || 135}deg, ${cfg.gradientColor1 || "#00f5ff"}, ${cfg.gradientColor2 || "#a855f7"})`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }
                    : {
                        color: textColor,
                      }),
                };

                if (isTiled) {
                  const density = cfg.tiledDensity || 1;
                  const repeatCount = Math.round(30 * density);
                  const tileAngle = cfg.tiledRotation ?? -30;

                  return (
                    <div
                      key={el.id}
                      data-element-id={el.id}
                      style={{
                        position: "absolute",
                        inset: "-20%",
                        width: "140%",
                        height: "140%",
                        pointerEvents: interactive ? "auto" : "none",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: `${cfg.tiledSpacingY || 50}px ${cfg.tiledSpacingX || 70}px`,
                        justifyContent: "space-around",
                        alignContent: "space-around",
                        transform: `rotate(${tileAngle}deg)`,
                        transformOrigin: "center",
                        opacity: opacity,
                        mixBlendMode: blendMode,
                        zIndex: el.zIndex || 900,
                        overflow: "hidden",
                      }}
                      onClick={() => interactive && onSelectElement?.(el.id)}
                      className={selectionStyle}
                    >
                      {Array.from({ length: repeatCount }).map((_, idx) => (
                        <div key={idx} style={watermarkTextStyle}>
                          {wType === "logo" && cfg.logoUrl ? (
                            <img
                              src={cfg.logoUrl}
                              alt="Watermark Logo"
                              className="h-8 object-contain"
                              style={{ opacity }}
                            />
                          ) : (
                            textVal
                          )}
                        </div>
                      ))}
                    </div>
                  );
                }

                return (
                  <div
                    key={el.id}
                    data-element-id={el.id}
                    style={{
                      position: "absolute",
                      left: `${el.x}%`,
                      top: `${el.y}%`,
                      transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                      zIndex: el.zIndex || 900,
                      opacity: opacity,
                      mixBlendMode: blendMode,
                      cursor: interactive ? "pointer" : "default",
                      pointerEvents: interactive ? "auto" : "none",
                    }}
                    onClick={() => interactive && onSelectElement?.(el.id)}
                    className={selectionStyle}
                  >
                    {wType === "logo" && (cfg.logoUrl || el.url) ? (
                      <img
                        src={cfg.logoUrl || el.url}
                        alt="Logo Watermark"
                        crossOrigin="anonymous"
                        style={{
                          maxHeight: `${(cfg.fontSize || 40) * scale}px`,
                          width: "auto",
                          objectFit: "contain",
                          filter: combinedShadow !== "none" ? `drop-shadow(${combinedShadow})` : "none",
                        }}
                      />
                    ) : (
                      <div style={watermarkTextStyle}>{textVal}</div>
                    )}
                  </div>
                );
              }

              // TEXT ELEMENT (TYPOGRAPHY STUDIO RENDERER)
              if (el.type === "text") {
                // 1. Font Family & Weight
                const fontFamilyCss = getFontFamilyWithFallback(el.fontFamily);
                const fontWeightCss =
                  typeof el.fontWeight === "number"
                    ? el.fontWeight
                    : el.fontWeight === "black"
                    ? 900
                    : el.fontWeight === "bold"
                    ? 700
                    : el.fontWeight === "semibold"
                    ? 600
                    : el.fontWeight === "light"
                    ? 300
                    : el.fontWeight === "thin"
                    ? 100
                    : parseInt(el.fontWeight || "400") || 400;

                // 2. Text Shadows, 3D Extrusion & Neon Glow Combined
                const shadowParts: string[] = [];

                // Drop Shadow
                if (el.textShadow?.enabled) {
                  const ts = el.textShadow;
                  shadowParts.push(
                    `${ts.offsetX || 0}px ${ts.offsetY || 0}px ${ts.blur || 0}px ${
                      ts.color || "rgba(0,0,0,0.8)"
                    }`
                  );
                }

                // Neon Glow
                if (el.textGlow?.enabled) {
                  const glow = el.textGlow;
                  const gColor = glow.color || "#00f5ff";
                  const gBlur = glow.blur || 15;
                  shadowParts.push(`0 0 ${gBlur}px ${gColor}`);
                  shadowParts.push(`0 0 ${gBlur * 2}px ${gColor}`);
                }

                // 3D Extrusion
                if (el.textEffect?.preset === "3d" && el.textEffect?.threeD?.enabled) {
                  const td = el.textEffect.threeD;
                  const depth = td.depth || 6;
                  const color = td.color || "#1e293b";
                  const dir = td.direction || "diagonal-right";

                  let stepX = 1;
                  let stepY = 1;
                  if (dir === "top") {
                    stepX = 0;
                    stepY = -1;
                  }
                  if (dir === "bottom") {
                    stepX = 0;
                    stepY = 1;
                  }
                  if (dir === "left") {
                    stepX = -1;
                    stepY = 0;
                  }
                  if (dir === "right") {
                    stepX = 1;
                    stepY = 0;
                  }
                  if (dir === "diagonal-left") {
                    stepX = -1;
                    stepY = 1;
                  }

                  for (let i = 1; i <= depth; i++) {
                    shadowParts.push(`${i * stepX}px ${i * stepY}px 0px ${color}`);
                  }
                  if (td.shadowColor) {
                    shadowParts.push(
                      `${depth * stepX + 2}px ${depth * stepY + 4}px 8px ${td.shadowColor}`
                    );
                  }
                }

                // Glitch Offset Shadow
                if (el.textEffect?.preset === "glitch") {
                  const offset = el.textEffect.glitchOffset || 3;
                  shadowParts.push(`-${offset}px 0 0 #00f5ff`);
                  shadowParts.push(`${offset}px 0 0 #ff006e`);
                }

                const combinedTextShadow = shadowParts.length > 0 ? shadowParts.join(", ") : "none";

                // 3. Stroke / Outline
                const tStroke = el.textStroke;
                const strokeCss = tStroke?.enabled
                  ? `${tStroke.width || 1}px ${tStroke.color || "#000000"}`
                  : "none";

                // 4. Background Badge Style
                const tBg = el.textBg;
                const textBgStyle: React.CSSProperties = tBg?.enabled
                  ? {
                      backgroundColor: tBg.color || "rgba(0,0,0,0.6)",
                      paddingTop: `${tBg.paddingTop ?? tBg.padding ?? 8}px`,
                      paddingRight: `${tBg.paddingRight ?? tBg.padding ?? 16}px`,
                      paddingBottom: `${tBg.paddingBottom ?? tBg.padding ?? 8}px`,
                      paddingLeft: `${tBg.paddingLeft ?? tBg.padding ?? 16}px`,
                      borderRadius: `${tBg.borderRadius || 12}px`,
                      border: tBg.borderEnabled
                        ? `${tBg.borderWidth || 1}px solid ${
                            tBg.borderColor || "rgba(255,255,255,0.2)"
                          }`
                        : "none",
                      backdropFilter: tBg.type === "glass" ? "blur(12px)" : "none",
                    }
                  : {};

                // 5. Gradient Text CSS
                let gradientCss = {};
                if (el.gradientText) {
                  const tg = el.textGradient;
                  let gradientString = "linear-gradient(45deg, #00f5ff, #a855f7, #ff006e)";
                  if (tg && tg.colorStops && tg.colorStops.length > 0) {
                    const stops = tg.colorStops
                      .map((s) => `${s.color} ${s.offset}%`)
                      .join(", ");
                    if (tg.type === "radial") {
                      gradientString = `radial-gradient(circle, ${stops})`;
                    } else if (tg.type === "angular") {
                      gradientString = `conic-gradient(from ${tg.angle || 0}deg, ${stops})`;
                    } else {
                      gradientString = `linear-gradient(${tg.angle || 90}deg, ${stops})`;
                    }
                  }
                  gradientCss = {
                    background: gradientString,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  };
                }

                // 6. Curved Text / Arc SVG Renderer
                if (el.textCurve?.enabled && el.text) {
                  const curve = el.textCurve;
                  const curveAmount = curve.amount || 40;
                  const pathId = `text-path-${el.id}`;
                  const pathD =
                    curve.curveType === "arc-down"
                      ? `M 10,20 Q 150,${20 + curveAmount * 1.5} 290,20`
                      : curve.curveType === "wave"
                      ? `M 10,50 Q 75,${50 - curveAmount} 150,50 T 290,50`
                      : `M 10,80 Q 150,${80 - curveAmount * 1.5} 290,80`;

                  return (
                    <div
                      key={el.id}
                      data-element-id={el.id}
                      style={{
                        position: "absolute",
                        left: `${el.x}%`,
                        top: `${el.y}%`,
                        zIndex: el.zIndex || 30,
                        width: el.width ? `${el.width}%` : "88%",
                        height: el.height ? `${el.height}%` : "auto",
                        opacity: el.opacity ?? 1,
                        transform: el.rotation ? `rotate(${el.rotation}deg)` : "none",
                        mixBlendMode: (el.blendMode as any) || "normal",
                        ...textBgStyle,
                      }}
                      onClick={() => interactive && onSelectElement?.(el.id)}
                      className={selectionStyle}
                    >
                      <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible">
                        <path id={pathId} d={pathD} fill="none" stroke="none" />
                        <text
                          fill={el.gradientText ? "url(#grad-" + el.id + ")" : el.color || "#ffffff"}
                          style={{
                            fontFamily: fontFamilyCss,
                            fontWeight: fontWeightCss,
                            fontSize: `${el.fontSize || 24}px`,
                            letterSpacing: `${el.letterSpacing || 0}px`,
                            textTransform: el.textTransform || "none",
                            filter:
                              combinedTextShadow !== "none"
                                ? `drop-shadow(${combinedTextShadow})`
                                : "none",
                          }}
                        >
                          <textPath href={`#${pathId}`} startOffset="50%" textAnchor="middle">
                            {el.text}
                          </textPath>
                        </text>
                      </svg>
                    </div>
                  );
                }

                return (
                  <div
                    key={el.id}
                    data-element-id={el.id}
                    style={{
                      position: "absolute",
                      left: `${el.x}%`,
                      top: `${el.y}%`,
                      zIndex: el.zIndex || 30,
                      width: el.width ? `${el.width}%` : "88%",
                      height: el.height ? `${el.height}%` : "auto",
                      fontFamily: fontFamilyCss,
                      fontWeight: fontWeightCss,
                      fontStyle: el.fontStyle || "normal",
                      textDecoration: el.textDecoration || "none",
                      fontSize: `${el.fontSize || 16}px`,
                      color: el.color || "#ffffff",
                      textAlign: el.textAlign || "left",
                      letterSpacing: `${el.letterSpacing || 0}px`,
                      lineHeight: el.lineHeight || 1.3,
                      textTransform: el.textTransform || "none",
                      textShadow: combinedTextShadow,
                      WebkitTextStroke: strokeCss,
                      whiteSpace: el.autoWrap === false ? "nowrap" : "normal",
                      wordBreak: el.autoWrap === false ? "keep-all" : "break-word",
                      opacity: el.opacity ?? 1,
                      mixBlendMode: (el.blendMode as any) || "normal",
                      transform: el.rotation ? `rotate(${el.rotation}deg)` : "none",
                      ...textBgStyle,
                      ...gradientCss,
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
                      borderRadius: `${el.borderRadius ?? 12}px`,
                      background: el.bgGradient || "linear-gradient(90deg, #00f5ff, #a855f7)",
                      color: el.textColor || "#ffffff",
                      fontFamily: "var(--font-display), 'Orbitron', sans-serif",
                      fontWeight: 800,
                      fontSize: `${el.fontSize || 12}px`,
                      letterSpacing: "2px",
                      textTransform: "uppercase",
                      boxShadow: elementBoxShadow !== "none" ? elementBoxShadow : "0 0 25px rgba(0, 245, 255, 0.4)",
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
                      boxShadow: elementBoxShadow !== "none" ? elementBoxShadow : el.glow ? "0 0 20px rgba(0, 245, 255, 0.6)" : "none",
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
                  </div>
                );
              }

              // FREEHAND DRAWING ELEMENT
              if (el.type === "draw") {
                const strokeD = getDrawPathSvg(el.drawPoints);
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
                      zIndex: el.zIndex || 15,
                      opacity: el.opacity ?? 1,
                      pointerEvents: interactive ? "auto" : "none",
                      transform: el.rotation ? `rotate(${el.rotation}deg)` : "none",
                    }}
                    onClick={() => interactive && onSelectElement?.(el.id)}
                    className={selectionStyle}
                  >
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <path
                        d={strokeD}
                        fill="none"
                        stroke={el.isEraser ? "#000000" : el.color || el.strokeColor || "#00f5ff"}
                        strokeWidth={el.brushSize || el.strokeWidth || 4}
                        strokeOpacity={el.strokeOpacity ?? 1}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{
                          filter: el.brushHardness && el.brushHardness < 0.8 ? `blur(${(1 - el.brushHardness) * 4}px)` : "none",
                        }}
                      />
                    </svg>
                  </div>
                );
              }

              // VECTOR PATH ELEMENT
              if (el.type === "path") {
                const pathD = getVectorPathSvg(el.pathPoints, el.pathData, el.pathClosed);
                const strokeW = el.strokeWidth ?? el.borderWidth ?? 2;
                const dash = getDashArray(el.borderStyle, strokeW);

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
                      zIndex: el.zIndex || 10,
                      opacity: el.opacity ?? 1,
                      transform: el.rotation ? `rotate(${el.rotation}deg)` : "none",
                      boxShadow: elementBoxShadow,
                    }}
                    onClick={() => interactive && onSelectElement?.(el.id)}
                    className={selectionStyle}
                  >
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <path
                        d={pathD}
                        fill={el.fillColor || "none"}
                        stroke={el.strokeColor || el.borderColor || "#00f5ff"}
                        strokeWidth={strokeW}
                        strokeDasharray={dash !== "none" ? dash : undefined}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                );
              }

              // VECTOR LINE / ARROW ELEMENT
              if (el.type === "line" || el.type === "arrow") {
                const strokeW = el.strokeWidth ?? el.borderWidth ?? 3;
                const strokeCol = el.strokeColor || el.color || el.borderColor || "#00f5ff";
                const dash = getDashArray(el.borderStyle, strokeW);
                const isArrow = el.type === "arrow" || el.arrowEndHead !== "none";

                return (
                  <div
                    key={el.id}
                    data-element-id={el.id}
                    style={{
                      position: "absolute",
                      left: `${el.x}%`,
                      top: `${el.y}%`,
                      width: el.width ? `${el.width}%` : "30%",
                      height: el.height ? `${el.height}%` : "10%",
                      zIndex: el.zIndex || 10,
                      opacity: el.opacity ?? 1,
                      transform: el.rotation ? `rotate(${el.rotation}deg)` : "none",
                    }}
                    onClick={() => interactive && onSelectElement?.(el.id)}
                    className={selectionStyle}
                  >
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <defs>
                        <marker
                          id={`arrow-head-${el.id}`}
                          viewBox="0 0 10 10"
                          refX="6"
                          refY="5"
                          markerWidth="6"
                          markerHeight="6"
                          orient="auto-start-reverse"
                        >
                          <path d="M 0 0 L 10 5 L 0 10 z" fill={strokeCol} />
                        </marker>
                      </defs>
                      <line
                        x1={el.lineStart?.x ?? 5}
                        y1={el.lineStart?.y ?? 50}
                        x2={el.lineEnd?.x ?? 95}
                        y2={el.lineEnd?.y ?? 50}
                        stroke={strokeCol}
                        strokeWidth={strokeW}
                        strokeDasharray={dash !== "none" ? dash : undefined}
                        strokeLinecap="round"
                        markerEnd={isArrow ? `url(#arrow-head-${el.id})` : undefined}
                      />
                    </svg>
                  </div>
                );
              }

              // VECTOR SHAPE ELEMENT
              if (el.type === "shape") {
                const shape = el.shapeType || "rect";
                const fg = el.fillGradient;
                const strokeW = el.strokeWidth ?? el.borderWidth ?? 0;
                const strokeCol = el.strokeColor || el.borderColor || "#00f5ff";
                const dash = getDashArray(el.borderStyle, strokeW);

                let fillStyle: React.CSSProperties = {
                  backgroundColor: el.fillColor || el.bg || "rgba(0, 245, 255, 0.5)",
                };

                if (fg && fg.enabled) {
                  const gradType = fg.type === "radial" ? "radial-gradient" : "linear-gradient";
                  const angle = fg.type === "radial" ? "circle" : `${fg.angle || 90}deg`;
                  const stops = fg.via ? `${fg.from}, ${fg.via}, ${fg.to}` : `${fg.from}, ${fg.to}`;
                  fillStyle = {
                    backgroundImage: `${gradType}(${angle}, ${stops})`,
                  };
                }

                // Custom corner radiiTL, TR, BR, BL if set
                let shapeRadius = `${el.borderRadius ?? 0}px`;
                if (el.cornerRadiusTL !== undefined || el.cornerRadiusTR !== undefined) {
                  shapeRadius = `${el.cornerRadiusTL ?? el.borderRadius ?? 0}px ${el.cornerRadiusTR ?? el.borderRadius ?? 0}px ${el.cornerRadiusBR ?? el.borderRadius ?? 0}px ${el.cornerRadiusBL ?? el.borderRadius ?? 0}px`;
                } else if (shape === "circle" || shape === "ellipse") {
                  shapeRadius = "50%";
                }

                // If complex shape like Star, Triangle, Polygon, Hexagon, render SVG
                if (shape === "triangle" || shape === "star" || shape === "polygon" || shape === "hexagon" || shape === "heart" || shape === "arrow") {
                  let pointsStr = "";
                  if (shape === "triangle") pointsStr = "50,5 95,95 5,95";
                  if (shape === "polygon" || shape === "hexagon") pointsStr = "50,5 90,25 90,75 50,95 10,75 10,25";
                  if (shape === "star") pointsStr = "50,5 63,35 95,38 71,60 78,92 50,75 22,92 29,60 5,38 37,35";
                  if (shape === "arrow") pointsStr = "5,35 60,35 60,10 95,50 60,90 60,65 5,65";

                  return (
                    <div
                      key={el.id}
                      data-element-id={el.id}
                      style={{
                        position: "absolute",
                        left: `${el.x}%`,
                        top: `${el.y}%`,
                        width: el.width ? `${el.width}%` : "20%",
                        height: el.height ? `${el.height}%` : "20%",
                        zIndex: el.zIndex || 5,
                        opacity: el.opacity ?? 1,
                        transform: el.rotation ? `rotate(${el.rotation}deg)` : "none",
                        boxShadow: elementBoxShadow,
                      }}
                      onClick={() => interactive && onSelectElement?.(el.id)}
                      className={selectionStyle}
                    >
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <polygon
                          points={pointsStr}
                          fill={el.fillColor || "rgba(0, 245, 255, 0.4)"}
                          stroke={strokeW > 0 ? strokeCol : "none"}
                          strokeWidth={strokeW}
                          strokeDasharray={dash !== "none" ? dash : undefined}
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  );
                }

                return (
                  <div
                    key={el.id}
                    data-element-id={el.id}
                    style={{
                      position: "absolute",
                      left: `${el.x}%`,
                      top: `${el.y}%`,
                      width: el.width ? `${el.width}%` : "50%",
                      height: el.height ? `${el.height}%` : "10px",
                      borderRadius: shapeRadius,
                      border: strokeW > 0 ? `${strokeW}px ${el.borderStyle || "solid"} ${strokeCol}` : "none",
                      boxShadow: elementBoxShadow,
                      zIndex: el.zIndex || 5,
                      opacity: el.opacity ?? 1,
                      transform: el.rotation ? `rotate(${el.rotation}deg)` : "none",
                      ...fillStyle,
                    }}
                    onClick={() => interactive && onSelectElement?.(el.id)}
                    className={selectionStyle}
                  />
                );
              }

              // GROUP ELEMENT
              if (el.type === "group") {
                return (
                  <div
                    key={el.id}
                    data-element-id={el.id}
                    style={{
                      position: "absolute",
                      left: `${el.x}%`,
                      top: `${el.y}%`,
                      width: el.width ? `${el.width}%` : "40%",
                      height: el.height ? `${el.height}%` : "40%",
                      zIndex: el.zIndex || 10,
                      opacity: el.opacity ?? 1,
                      transform: el.rotation ? `rotate(${el.rotation}deg)` : "none",
                    }}
                    onClick={() => interactive && onSelectElement?.(el.id)}
                    className={selectionStyle}
                  >
                    {/* Render group children */}
                    <div className="relative w-full h-full border border-dashed border-neon-cyan/40 rounded-xl bg-white/[0.02]">
                      <div className="absolute top-1 left-2 text-[9px] font-mono text-neon-cyan font-bold uppercase">
                        GROUP: {el.name}
                      </div>
                    </div>
                  </div>
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

import React, { forwardRef } from "react";
import { DesignState } from "../../types/designer";

interface CanvasStageProps {
  state: DesignState;
  scaleFactor?: number;
  interactive?: boolean;
  onElementClick?: (elementId: string) => void;
}

export const CanvasStage = forwardRef<HTMLDivElement, CanvasStageProps>(
  ({ state, scaleFactor = 1, interactive = true, onElementClick }, ref) => {
    const {
      width,
      height,
      background,
      image,
      texts,
      badges,
      cta,
      logo,
      showCyberBorders,
      showGlassPanel,
      glassOpacity,
      glassBlur,
    } = state;

    // Pattern background style
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
    const getGlowShadow = (glowType: string) => {
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
    const getFontFamily = (font: string) => {
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

    return (
      <div
        ref={ref}
        id="lizzdo-designer-canvas"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          transform: `scale(${scaleFactor})`,
          transformOrigin: "top left",
          position: "relative",
          overflow: "hidden",
          borderRadius: "24px",
          backgroundColor: background.solidColor,
          backgroundImage:
            background.type === "gradient"
              ? `linear-gradient(${
                  background.gradientDirection === "to-r"
                    ? "90deg"
                    : background.gradientDirection === "to-br"
                    ? "135deg"
                    : background.gradientDirection === "to-b"
                    ? "180deg"
                    : "45deg"
                }, ${background.gradientFrom}, ${background.gradientTo})`
              : background.type === "image" && background.imageUrl
              ? `url(${background.imageUrl})`
              : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          boxShadow: "0 25px 60px -15px rgba(0,0,0,0.9), 0 0 1px 1px rgba(255,255,255,0.1)",
        }}
        className="select-none font-sans"
      >
        {/* Pattern Overlay */}
        {background.pattern !== "none" && (
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
              backgroundColor: `rgba(10, 14, 39, ${glassOpacity})`,
              backdropFilter: `blur(${glassBlur}px)`,
              border: "1px solid rgba(255, 255, 255, 0.12)",
              pointerEvents: "none",
              zIndex: 2,
            }}
          />
        )}

        {/* Featured Image Layer */}
        {image.visible && image.url && (
          <div
            style={{
              position: "absolute",
              inset: "20px",
              overflow: "hidden",
              borderRadius: `${image.borderRadius}px`,
              border: `${image.borderWidth}px solid ${image.borderColor}`,
              boxShadow: getGlowShadow(image.shadowGlow),
              opacity: image.opacity,
              zIndex: 3,
            }}
            onClick={() => interactive && onElementClick?.("image")}
            className={interactive ? "cursor-pointer hover:ring-2 ring-cyan-400/50 transition-all" : ""}
          >
            {/* Ambient Blurred Background for Contain / Smart Mode */}
            {image.fitMode !== "cover" && image.url && (
              <img
                src={image.url}
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

            <img
              src={image.url}
              alt="Featured Asset"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit:
                  image.fitMode === "contain"
                    ? "contain"
                    : image.fitMode === "fill"
                    ? "fill"
                    : "cover",
                transform: `scale(${image.scale}) translate(${image.xOffset}px, ${image.yOffset}px) rotate(${image.rotation}deg)`,
                transformOrigin: "center",
                transition: "transform 0.1s ease-out",
              }}
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        {/* Cyber Neon Corner Accents */}
        {showCyberBorders && (
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 10 }}>
            {/* Top Left */}
            <div
              style={{
                position: "absolute",
                top: 12,
                left: 12,
                width: 24,
                height: 24,
                borderTop: "2px solid #00f5ff",
                borderLeft: "2px solid #00f5ff",
              }}
            />
            {/* Top Right */}
            <div
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                width: 24,
                height: 24,
                borderTop: "2px solid #00f5ff",
                borderRight: "2px solid #00f5ff",
              }}
            />
            {/* Bottom Left */}
            <div
              style={{
                position: "absolute",
                bottom: 12,
                left: 12,
                width: 24,
                height: 24,
                borderBottom: "2px solid #00f5ff",
                borderLeft: "2px solid #00f5ff",
              }}
            />
            {/* Bottom Right */}
            <div
              style={{
                position: "absolute",
                bottom: 12,
                right: 12,
                width: 24,
                height: 24,
                borderBottom: "2px solid #00f5ff",
                borderRight: "2px solid #00f5ff",
              }}
            />
          </div>
        )}

        {/* Brand Logo Layer */}
        {logo.visible && (
          <div
            style={{
              position: "absolute",
              left: `${logo.x}%`,
              top: `${logo.y}%`,
              transform: "translate(-50%, -50%)",
              zIndex: 12,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
            onClick={() => interactive && onElementClick?.("logo")}
            className={interactive ? "cursor-pointer hover:scale-105 transition-transform" : ""}
          >
            {logo.logoUrl ? (
              <img src={logo.logoUrl} alt="Logo" style={{ height: `${logo.size * 1.5}px` }} />
            ) : (
              <div
                style={{
                  height: `${logo.size * 1.5}px`,
                  padding: "0 12px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  border: "1px solid rgba(0, 245, 255, 0.5)",
                  color: "#00f5ff",
                  fontFamily: "var(--font-display), 'Orbitron', sans-serif",
                  fontWeight: 900,
                  fontSize: `${logo.size}px`,
                  letterSpacing: "3px",
                  textShadow: logo.glow ? "0 0 10px rgba(0, 245, 255, 0.8)" : "none",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {logo.text}
              </div>
            )}
          </div>
        )}

        {/* Badges & Tags Layer */}
        {badges.map((badge) => {
          if (!badge.visible) return null;
          return (
            <div
              key={badge.id}
              style={{
                position: "absolute",
                left: `${badge.x}%`,
                top: `${badge.y}%`,
                zIndex: 12,
                padding: "6px 14px",
                borderRadius: "8px",
                backgroundColor: badge.bg,
                color: badge.textColor,
                border: `1px solid ${badge.borderColor}`,
                fontSize: `${badge.fontSize}px`,
                fontFamily: "var(--font-mono), 'Space Mono', monospace",
                fontWeight: 700,
                letterSpacing: "2px",
                textTransform: "uppercase",
                backdropFilter: "blur(8px)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              }}
              onClick={() => interactive && onElementClick?.(badge.id)}
              className={interactive ? "cursor-pointer hover:scale-105 transition-transform" : ""}
            >
              {badge.text}
            </div>
          );
        })}

        {/* Text Elements Layer */}
        {texts.map((item) => {
          if (!item.visible) return null;
          return (
            <div
              key={item.id}
              style={{
                position: "absolute",
                left: `${item.x}%`,
                top: `${item.y}%`,
                zIndex: 14,
                width: "88%",
                fontFamily: getFontFamily(item.fontFamily),
                fontWeight: item.fontWeight === "black" ? 900 : item.fontWeight === "bold" ? 700 : 400,
                fontSize: `${item.fontSize}px`,
                color: item.color,
                textAlign: item.textAlign,
                letterSpacing: `${item.letterSpacing}px`,
                lineHeight: item.lineHeight,
                textTransform: item.textTransform,
                textShadow: "0 2px 10px rgba(0,0,0,0.8)",
                ...(item.gradientText
                  ? {
                      background: "linear-gradient(45deg, #00f5ff, #a855f7, #ff006e)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }
                  : {}),
              }}
              onClick={() => interactive && onElementClick?.(item.id)}
              className={interactive ? "cursor-pointer hover:opacity-90 transition-opacity" : ""}
            >
              {item.text}
            </div>
          );
        })}

        {/* CTA Button Layer */}
        {cta.visible && (
          <div
            style={{
              position: "absolute",
              left: `${cta.x}%`,
              top: `${cta.y}%`,
              zIndex: 15,
              padding: "12px 28px",
              borderRadius: `${cta.borderRadius}px`,
              background: cta.bgGradient,
              color: cta.textColor,
              fontFamily: "var(--font-display), 'Orbitron', sans-serif",
              fontWeight: 800,
              fontSize: `${cta.fontSize}px`,
              letterSpacing: "2px",
              textTransform: "uppercase",
              boxShadow: "0 0 25px rgba(0, 245, 255, 0.4)",
              cursor: interactive ? "pointer" : "default",
            }}
            onClick={() => interactive && onElementClick?.("cta")}
            className={interactive ? "hover:scale-105 transition-transform" : ""}
          >
            {cta.text}
          </div>
        )}
      </div>
    );
  }
);

CanvasStage.displayName = "CanvasStage";

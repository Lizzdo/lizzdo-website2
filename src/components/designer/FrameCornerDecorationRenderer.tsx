import React from "react";
import {
  CornerDecorationConfig,
  CornerStyle,
  FrameConfig,
  IndividualCornerConfig,
} from "../../types/designer";

interface Props {
  cornerDecorations?: CornerDecorationConfig;
  frameConfig?: FrameConfig;
  showCyberBordersFallback?: boolean;
}

export const CORNER_STYLE_LABELS: Record<CornerStyle, { name: string; category: string; description: string }> = {
  // 20 Primary Required Presets
  "minimal": { name: "Minimal", category: "Minimal", description: "Ultra-thin clean hairline corner angle" },
  "thin-line": { name: "Thin Line", category: "Minimal", description: "Fine dual offset accent lines" },
  "thick-border": { name: "Thick Border", category: "Industrial", description: "Bold solid corner accent block" },
  "cyber-hud": { name: "Cyber HUD", category: "Futuristic", description: "Sci-Fi tactical HUD target bracket with reticle ticks" },
  "blueprint": { name: "Blueprint", category: "Technical", description: "Engineering rule grid lines with measurement ticks" },
  "technical-drawing": { name: "Technical Drawing", category: "Technical", description: "Drafting crosshair with corner chamfer" },
  "gaming": { name: "Gaming", category: "Gaming", description: "Esports carbon shield with notched corner armor" },
  "sci-fi": { name: "Sci-Fi", category: "Futuristic", description: "High-tech energy conduit bracket with node rings" },
  "neon": { name: "Neon", category: "Glow", description: "Vivid radiant glowing neon arc with gradient aura" },
  "glass": { name: "Glass", category: "Modern", description: "Soft translucent frosted glass sleeve with highlight rim" },
  "premium-corporate": { name: "Premium Corporate", category: "Luxury", description: "Metallic champagne gold dual bevel corner" },
  "double-corner": { name: "Double Corner", category: "Classic", description: "Parallel concentric double wire brackets" },
  "rounded-corner": { name: "Rounded Corner", category: "Modern", description: "Smooth rounded capsule arc with soft drop shadow" },
  "square-corner": { name: "Square Corner", category: "Clean", description: "Precise right-angle square block with inner cutout" },
  "geometric": { name: "Geometric", category: "Luxury", description: "Rhombus diamond node with intersecting lines" },
  "futuristic": { name: "Futuristic", category: "Futuristic", description: "Multi-segmented rail with status indicator nodes" },
  "industrial": { name: "Industrial", category: "Industrial", description: "Stepped dual-notch heavy bracket" },
  "modern-ui": { name: "Modern UI", category: "Modern", description: "Clean capsule pill floating bars" },
  "elegant": { name: "Elegant", category: "Luxury", description: "Curved ornate scroll flourish" },
  "custom-blank": { name: "Custom Blank", category: "Blank", description: "Simple base target box ready for custom tuning" },

  // Legacy Aliases
  "cyber-bracket": { name: "Cyber Bracket", category: "Futuristic", description: "Classic tech L-bracket with endpoint dots" },
  "tech-cross": { name: "Tech Crosshair", category: "Futuristic", description: "Target crosshair with corner brackets" },
  "chamfer-notch": { name: "Chamfer Notch", category: "Industrial", description: "45° angled corner cut with notch" },
  "dots-bracket": { name: "Dots Matrix", category: "Minimal", description: "Dotted LED matrix corner bracket" },
  "minimal-angle": { name: "Minimal Angle", category: "Minimal", description: "Ultra-thin clean hairline angle" },
  "double-wire": { name: "Double Wire", category: "Technical", description: "Dual concentric parallel wire brackets" },
  "neon-glow": { name: "Neon Arc", category: "Glow", description: "Vivid rounded arc with radiant glow" },
  "orbit-ring": { name: "Orbit Ring", category: "HUD", description: "Circular reticle with crosshair ticks" },
  "heavy-bracket": { name: "Heavy Block", category: "Gaming", description: "Bold industrial corner block" },
  "frame-corner": { name: "Frame Sleeve", category: "Classic", description: "Traditional photo mount corner sleeve" },
  "arrow-corner": { name: "Corner Arrow", category: "HUD", description: "Inward pointing chevron arrow" },
  "segmented-rail": { name: "Segmented Rail", category: "Technical", description: "Dashed segmented corner rails" },
  "shield-corner": { name: "Shield Vertex", category: "Gaming", description: "Metallic shield emblem corner" },
  "diamond-corner": { name: "Diamond Node", category: "Luxury", description: "Rhombus diamond node emblem" },
  "target-reticle": { name: "Target Reticle", category: "HUD", description: "HUD target reticle with arcs" },
  "blueprint-grid": { name: "Blueprint Rule", category: "Blueprint", description: "Engineering rule tick-marks" },
  "dual-notch": { name: "Dual Notch", category: "Industrial", description: "Double-stepped notched corner bracket" },
  "modern-pill": { name: "Modern Capsule", category: "Modern", description: "Floating capsule pill corner bar" },
  "decorative-flourish": { name: "Ornate Flourish", category: "Luxury", description: "Elegant curved ornamental scroll" },
  "accent-dash": { name: "Triple Dash", category: "Minimal", description: "Offset triple dash accent bars" },
};

export const DEFAULT_CORNER_CONFIG: CornerDecorationConfig = {
  enabled: true,
  style: "cyber-hud",
  size: 36,
  length: 36,
  thickness: 3,
  color: "#00f5ff",
  borderColor: "rgba(0, 245, 255, 0.4)",
  glowColor: "rgba(0, 245, 255, 0.6)",
  glowSpread: 10,
  opacity: 1,
  angle: 0,
  inset: 12,
  offsetX: 0,
  offsetY: 0,
  radius: 0,
  borderStyle: "solid",
  syncAllCorners: true,
  tl: { enabled: true },
  tr: { enabled: true },
  bl: { enabled: true },
  br: { enabled: true },
};

export const DEFAULT_FRAME_CONFIG: FrameConfig = {
  preset: "none",
  enabled: false,
  width: 4,
  color: "#00f5ff",
  gradientFrom: "#00f5ff",
  gradientTo: "#a855f7",
  opacity: 0.9,
  radius: 12,
  glow: "0 0 20px rgba(0, 245, 255, 0.4)",
  animated: false,
  innerPadding: 0,
  borderStyle: "solid",
};

/**
 * Individual Corner Graphic SVG Generator
 */
export function SingleCornerSvg({
  cfg,
  position,
}: {
  cfg: IndividualCornerConfig;
  position: "tl" | "tr" | "bl" | "br";
}) {
  // If explicitly disabled, render nothing
  if (cfg.enabled === false) return null;

  const size = Math.max(12, cfg.size || 36);
  const armLen = Math.max(10, cfg.length ?? size);
  const thickness = Math.max(1, cfg.thickness || 3);
  const color = cfg.color || "#00f5ff";
  const borderColor = cfg.borderColor || color;
  const glowColor = cfg.glowColor || color;
  const glowSpread = cfg.glowSpread ?? 8;
  const opacity = cfg.opacity ?? 1;
  const blurVal = cfg.blur ?? 0;
  const borderStyle = cfg.borderStyle || "solid";
  const radius = cfg.radius ?? 0;
  const style = cfg.style || "cyber-hud";
  const extraAngle = cfg.angle || 0;

  // Base flip transform for 4 corners from top-left perspective
  const baseFlipMap: Record<string, string> = {
    tl: "none",
    tr: "scale(-1, 1)",
    bl: "scale(1, -1)",
    br: "scale(-1, -1)",
  };

  const dashArrayMap: Record<string, string> = {
    solid: "none",
    dashed: `${thickness * 2} ${thickness * 2}`,
    dotted: `${thickness} ${thickness * 1.5}`,
    double: "none",
  };

  // Shadow & Filter effects
  const filters: string[] = [];
  if (glowSpread > 0) {
    filters.push(`drop-shadow(0 0 ${glowSpread}px ${glowColor})`);
  }
  if (cfg.outerShadowColor) {
    const ox = cfg.outerShadowOffsetX ?? 2;
    const oy = cfg.outerShadowOffsetY ?? 2;
    const ob = cfg.outerShadowBlur ?? 6;
    filters.push(`drop-shadow(${ox}px ${oy}px ${ob}px ${cfg.outerShadowColor})`);
  }
  if (blurVal > 0) {
    filters.push(`blur(${blurVal}px)`);
  }

  const containerStyle: React.CSSProperties = {
    position: "absolute",
    width: `${size}px`,
    height: `${size}px`,
    opacity,
    pointerEvents: "none",
    zIndex: 50,
    filter: filters.length > 0 ? filters.join(" ") : undefined,
    transform: `translate(${cfg.offsetX || 0}px, ${cfg.offsetY || 0}px)`,
  };

  // Combine base flip with custom rotation angle
  const svgTransform = `${baseFlipMap[position]} rotate(${extraAngle}deg)`;

  const strokeDash = dashArrayMap[borderStyle] || "none";

  // SVG content renderer
  const renderSvgContent = () => {
    switch (style) {
      case "minimal":
      case "minimal-angle":
        return (
          <g>
            <path
              d={`M0 ${armLen} V${radius} A${radius} ${radius} 0 0 1 ${radius} 0 H${armLen}`}
              fill="none"
              stroke={color}
              strokeWidth={thickness}
              strokeDasharray={strokeDash}
              strokeLinecap="round"
            />
          </g>
        );

      case "thin-line":
      case "double-wire":
        return (
          <g>
            <path
              d={`M0 ${armLen} V0 H${armLen}`}
              fill="none"
              stroke={color}
              strokeWidth={thickness}
              strokeDasharray={strokeDash}
            />
            <path
              d={`M${thickness * 2.5} ${armLen} V${thickness * 2.5} H${armLen}`}
              fill="none"
              stroke={borderColor}
              strokeWidth={Math.max(1, thickness * 0.6)}
              strokeDasharray={strokeDash}
              opacity={0.8}
            />
          </g>
        );

      case "thick-border":
      case "heavy-bracket":
        return (
          <g>
            <path
              d={`M0 0 H${armLen} V${thickness * 2.5} H${thickness * 2.5} V${armLen} H0 Z`}
              fill={color}
              opacity={0.9}
            />
            <rect
              x={thickness * 0.5}
              y={thickness * 0.5}
              width={armLen - thickness}
              height={thickness * 1.5}
              fill={borderColor}
            />
          </g>
        );

      case "cyber-hud":
      case "tech-cross":
        return (
          <g>
            <path
              d={`M0 ${armLen} V0 H${armLen}`}
              fill="none"
              stroke={color}
              strokeWidth={thickness}
              strokeDasharray={strokeDash}
            />
            <circle cx="0" cy="0" r={thickness * 2} fill={color} />
            <line x1={armLen * 0.5} y1="0" x2={armLen * 0.5} y2={thickness * 2.5} stroke={borderColor} strokeWidth={thickness * 0.8} />
            <line x1="0" y1={armLen * 0.5} x2={thickness * 2.5} y2={armLen * 0.5} stroke={borderColor} strokeWidth={thickness * 0.8} />
            <circle cx={armLen} cy={thickness / 2} r={thickness * 1.2} fill={color} />
            <circle cx={thickness / 2} cy={armLen} r={thickness * 1.2} fill={color} />
          </g>
        );

      case "blueprint":
      case "blueprint-grid":
        return (
          <g>
            <path d={`M0 ${armLen} V0 H${armLen}`} fill="none" stroke={color} strokeWidth={thickness} strokeDasharray={strokeDash} />
            {[0.25, 0.5, 0.75].map((pct, i) => (
              <React.Fragment key={i}>
                <line x1={pct * armLen} y1="0" x2={pct * armLen} y2={thickness * 2.5} stroke={borderColor} strokeWidth={1.5} />
                <line x1="0" y1={pct * armLen} x2={thickness * 2.5} y2={pct * armLen} stroke={borderColor} strokeWidth={1.5} />
              </React.Fragment>
            ))}
          </g>
        );

      case "technical-drawing":
        return (
          <g>
            <path d={`M0 ${armLen} V${armLen * 0.35} L${armLen * 0.35} 0 H${armLen}`} fill="none" stroke={color} strokeWidth={thickness} strokeDasharray={strokeDash} />
            <circle cx="0" cy="0" r={thickness * 2.5} fill="none" stroke={borderColor} strokeWidth={thickness * 0.8} />
            <line x1="-5" y1="0" x2={armLen * 0.4} y2="0" stroke={color} strokeWidth={1} />
            <line x1="0" y1="-5" x2="0" y2={armLen * 0.4} stroke={color} strokeWidth={1} />
          </g>
        );

      case "gaming":
      case "shield-corner":
        return (
          <g>
            <polygon
              points={`0,0 ${armLen},0 ${armLen},${thickness * 3} ${thickness * 3},${armLen} 0,${armLen}`}
              fill={color}
              opacity={0.3}
              stroke={color}
              strokeWidth={thickness}
            />
            <path d={`M0 ${armLen} V0 H${armLen}`} fill="none" stroke={borderColor} strokeWidth={thickness * 1.2} />
            <circle cx={armLen * 0.25} cy={armLen * 0.25} r={thickness * 1.5} fill={color} />
          </g>
        );

      case "sci-fi":
      case "cyber-bracket":
        return (
          <g>
            <path d={`M0 ${armLen} V0 H${armLen}`} fill="none" stroke={color} strokeWidth={thickness} strokeDasharray={strokeDash} />
            <rect x="0" y="0" width={thickness * 2.5} height={thickness * 2.5} fill={borderColor} />
            <circle cx={armLen} cy={thickness / 2} r={thickness * 1.4} fill={color} />
            <circle cx={thickness / 2} cy={armLen} r={thickness * 1.4} fill={color} />
          </g>
        );

      case "neon":
      case "neon-glow":
        return (
          <g>
            <path
              d={`M0 ${armLen} A${armLen} ${armLen} 0 0 1 ${armLen} 0`}
              fill="none"
              stroke={color}
              strokeWidth={thickness * 1.5}
              strokeLinecap="round"
            />
            <circle cx="0" cy="0" r={thickness * 2} fill={borderColor} />
          </g>
        );

      case "glass":
        return (
          <g>
            <polygon points={`0,0 ${armLen},0 0,${armLen}`} fill={color} opacity={0.25} />
            <path d={`M0 ${armLen} L${armLen} 0`} stroke={borderColor} strokeWidth={thickness * 1.2} />
            <path d={`M0 ${armLen} V0 H${armLen}`} fill="none" stroke={color} strokeWidth={thickness} />
          </g>
        );

      case "premium-corporate":
      case "frame-corner":
        return (
          <g>
            <path d={`M0 ${armLen} V0 H${armLen}`} fill="none" stroke={color} strokeWidth={thickness} />
            <path
              d={`M${thickness * 2} ${armLen * 0.7} V${thickness * 2} H${armLen * 0.7}`}
              fill="none"
              stroke={borderColor}
              strokeWidth={thickness * 0.7}
            />
            <polygon points={`0,0 ${armLen * 0.35},0 0,${armLen * 0.35}`} fill={color} opacity={0.5} />
          </g>
        );

      case "double-corner":
        return (
          <g>
            <path d={`M0 ${armLen} V0 H${armLen}`} fill="none" stroke={color} strokeWidth={thickness} strokeDasharray={strokeDash} />
            <path d={`M${thickness * 3} ${armLen} V${thickness * 3} H${armLen}`} fill="none" stroke={borderColor} strokeWidth={thickness} strokeDasharray={strokeDash} />
          </g>
        );

      case "rounded-corner":
        return (
          <g>
            <path
              d={`M0 ${armLen} V${radius || armLen * 0.4} A${radius || armLen * 0.4} ${radius || armLen * 0.4} 0 0 1 ${radius || armLen * 0.4} 0 H${armLen}`}
              fill="none"
              stroke={color}
              strokeWidth={thickness}
              strokeLinecap="round"
            />
          </g>
        );

      case "square-corner":
        return (
          <g>
            <rect x="0" y="0" width={armLen * 0.5} height={armLen * 0.5} fill={color} opacity={0.25} />
            <path d={`M0 ${armLen} V0 H${armLen}`} fill="none" stroke={color} strokeWidth={thickness} />
            <rect x="0" y="0" width={thickness * 2} height={thickness * 2} fill={borderColor} />
          </g>
        );

      case "geometric":
      case "diamond-corner":
        return (
          <g>
            <polygon
              points={`0,${-armLen * 0.25} ${armLen * 0.25},0 0,${armLen * 0.25} ${-armLen * 0.25},0`}
              fill={color}
              transform={`translate(${armLen * 0.35}, ${armLen * 0.35})`}
            />
            <path d={`M0 ${armLen} V0 H${armLen}`} fill="none" stroke={color} strokeWidth={thickness} strokeDasharray={strokeDash} />
          </g>
        );

      case "futuristic":
      case "segmented-rail":
        return (
          <g>
            <line x1="0" y1="0" x2={armLen * 0.4} y2="0" stroke={color} strokeWidth={thickness} />
            <line x1={armLen * 0.5} y1="0" x2={armLen} y2="0" stroke={borderColor} strokeWidth={thickness} />
            <line x1="0" y1="0" x2="0" y2={armLen * 0.4} stroke={color} strokeWidth={thickness} />
            <line x1="0" y1={armLen * 0.5} x2="0" y2={armLen} stroke={borderColor} strokeWidth={thickness} />
            <rect x="0" y="0" width={thickness * 2.5} height={thickness * 2.5} fill={color} />
          </g>
        );

      case "industrial":
      case "dual-notch":
      case "chamfer-notch":
        return (
          <g>
            <path
              d={`M0 ${armLen} V${armLen * 0.6} H${armLen * 0.25} V${armLen * 0.25} H${armLen * 0.6} V0 H${armLen}`}
              fill="none"
              stroke={color}
              strokeWidth={thickness}
              strokeDasharray={strokeDash}
            />
          </g>
        );

      case "modern-ui":
      case "modern-pill":
        return (
          <g>
            <rect x="0" y="0" width={armLen * 0.85} height={thickness * 2.5} rx={thickness * 1.25} fill={color} />
            <rect x="0" y="0" width={thickness * 2.5} height={armLen * 0.85} rx={thickness * 1.25} fill={borderColor} />
          </g>
        );

      case "elegant":
      case "decorative-flourish":
        return (
          <g>
            <path
              d={`M0 ${armLen} C0 ${armLen * 0.3}, ${armLen * 0.3} 0, ${armLen} 0`}
              fill="none"
              stroke={color}
              strokeWidth={thickness}
            />
            <path
              d={`M0 ${armLen * 0.6} C0 ${armLen * 0.2}, ${armLen * 0.2} 0, ${armLen * 0.6} 0`}
              fill="none"
              stroke={borderColor}
              strokeWidth={thickness * 0.6}
              opacity={0.7}
            />
            <circle cx={armLen * 0.3} cy={armLen * 0.3} r={thickness * 1.5} fill={color} />
          </g>
        );

      case "custom-blank":
        return (
          <g>
            <rect x="0" y="0" width={armLen} height={armLen} fill="none" stroke={color} strokeWidth={thickness * 0.5} strokeDasharray="2 2" />
            <circle cx="0" cy="0" r={thickness * 1.5} fill={color} />
          </g>
        );

      default:
        return (
          <path d={`M0 ${armLen} V0 H${armLen}`} fill="none" stroke={color} strokeWidth={thickness} />
        );
    }
  };

  return (
    <div style={containerStyle}>
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${size} ${size}`}
        style={{
          transform: svgTransform,
          transformOrigin: "center center",
          overflow: "visible",
        }}
      >
        {renderSvgContent()}
      </svg>
    </div>
  );
}

export function FrameCornerDecorationRenderer({
  cornerDecorations,
  frameConfig,
  showCyberBordersFallback,
}: Props) {
  // Determine Corner Configuration
  const isCornerEnabled =
    cornerDecorations?.enabled ?? (showCyberBordersFallback ? true : false);

  const parentCornerCfg: CornerDecorationConfig = {
    ...DEFAULT_CORNER_CONFIG,
    ...cornerDecorations,
  };

  const defaultInset = parentCornerCfg.inset ?? 12;

  // Individual corner merged configs
  const getCornerConfig = (pos: "tl" | "tr" | "bl" | "br"): IndividualCornerConfig => {
    if (parentCornerCfg.syncAllCorners) return parentCornerCfg;
    const override = parentCornerCfg[pos] || {};
    return {
      ...parentCornerCfg,
      ...override,
    };
  };

  // Determine Frame Configuration
  const frame = {
    ...DEFAULT_FRAME_CONFIG,
    ...frameConfig,
  };

  const tlCfg = getCornerConfig("tl");
  const trCfg = getCornerConfig("tr");
  const blCfg = getCornerConfig("bl");
  const brCfg = getCornerConfig("br");

  const tlInset = tlCfg.inset ?? defaultInset;
  const trInset = trCfg.inset ?? defaultInset;
  const blInset = blCfg.inset ?? defaultInset;
  const brInset = brCfg.inset ?? defaultInset;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 45,
      }}
    >
      {/* 1. PROFESSIONAL FRAME LIBRARY RENDERER */}
      {frame.enabled && frame.preset !== "none" && (
        <div
          className={`absolute pointer-events-none transition-all ${
            frame.animated ? "animate-pulse" : ""
          }`}
          style={{
            inset: `${frame.innerPadding || 0}px`,
            borderRadius: `${frame.radius}px`,
            opacity: frame.opacity,
            zIndex: 40,
            ...(frame.preset === "glassmorphism"
              ? {
                  border: `${frame.width}px solid rgba(255, 255, 255, 0.25)`,
                  boxShadow: `inset 0 0 20px rgba(255, 255, 255, 0.2), ${frame.glow || "0 0 30px rgba(0, 245, 255, 0.3)"}`,
                  backdropFilter: "blur(12px)",
                }
              : frame.preset === "neon"
              ? {
                  border: `${frame.width}px solid ${frame.color}`,
                  boxShadow: `0 0 25px ${frame.color}, inset 0 0 15px ${frame.color}`,
                }
              : frame.preset === "gradient-borders"
              ? {
                  border: `${frame.width}px solid transparent`,
                  borderImage: `linear-gradient(135deg, ${frame.gradientFrom || "#00f5ff"}, ${frame.gradientTo || "#a855f7"}) 1`,
                }
              : frame.preset === "double-borders"
              ? {
                  border: `${frame.width}px double ${frame.color}`,
                  boxShadow: frame.glow,
                }
              : frame.preset === "blueprint"
              ? {
                  border: `${frame.width}px dashed ${frame.color || "#3b82f6"}`,
                  boxShadow: "inset 0 0 10px rgba(59, 130, 246, 0.3)",
                }
              : frame.preset === "hud"
              ? {
                  border: `${frame.width}px solid ${frame.color || "#00f5ff"}`,
                  boxShadow: "0 0 15px rgba(0, 245, 255, 0.4)",
                  borderStyle: frame.borderStyle || "solid",
                }
              : frame.preset === "premium-product"
              ? {
                  border: `${frame.width}px solid transparent`,
                  borderImage: "linear-gradient(135deg, #f59e0b, #fef3c7, #d97706) 1",
                  boxShadow: "0 10px 30px rgba(245, 158, 11, 0.2)",
                }
              : {
                  border: `${frame.width}px ${frame.borderStyle || "solid"} ${frame.color}`,
                  boxShadow: frame.glow,
                }),
          }}
        />
      )}

      {/* 2. CUSTOMIZABLE & DECOUPLED CORNER DECORATIONS */}
      {isCornerEnabled && (
        <>
          {/* Top-Left Corner */}
          <div style={{ position: "absolute", top: `${tlInset}px`, left: `${tlInset}px` }}>
            <SingleCornerSvg cfg={tlCfg} position="tl" />
          </div>

          {/* Top-Right Corner */}
          <div style={{ position: "absolute", top: `${trInset}px`, right: `${trInset}px` }}>
            <SingleCornerSvg cfg={trCfg} position="tr" />
          </div>

          {/* Bottom-Left Corner */}
          <div style={{ position: "absolute", bottom: `${blInset}px`, left: `${blInset}px` }}>
            <SingleCornerSvg cfg={blCfg} position="bl" />
          </div>

          {/* Bottom-Right Corner */}
          <div style={{ position: "absolute", bottom: `${brInset}px`, right: `${brInset}px` }}>
            <SingleCornerSvg cfg={brCfg} position="br" />
          </div>
        </>
      )}
    </div>
  );
}

import { DesignState } from "../types/designer";
import { V2Project, V2Artboard } from "../types/designerV2";

/**
 * Creates a brand-new blank V2 project with a single default artboard.
 */
export function createDefaultV2Project(title: string = "New Cyber Artboard"): V2Project {
  const artboardId = "artboard-" + Date.now();
  const defaultState: DesignState = {
    id: "state-" + Date.now(),
    title,
    preset: "website-hero",
    width: 1200,
    height: 630,
    background: {
      type: "gradient",
      solidColor: "#0a0e27",
      gradientFrom: "#0a0e27",
      gradientVia: "#121838",
      gradientTo: "#050814",
      gradientDirection: "to-br",
      pattern: "grid",
      patternColor: "rgba(0, 245, 255, 0.2)",
      patternOpacity: 0.3,
    },
    elements: [
      {
        id: "badge-1",
        name: "Category Badge",
        type: "badge",
        visible: true,
        locked: false,
        x: 8,
        y: 10,
        width: 22,
        height: 6,
        text: "LIZZDO DESIGNER PRO V2",
        bg: "rgba(0, 245, 255, 0.15)",
        textColor: "#00f5ff",
        borderColor: "#00f5ff",
        borderRadius: 8,
        zIndex: 1,
      },
      {
        id: "text-1",
        name: "Main Heading",
        type: "text",
        visible: true,
        locked: false,
        x: 8,
        y: 24,
        width: 80,
        height: 20,
        text: "NEXT-GEN DIGITAL ARTWORK",
        fontFamily: "Orbitron",
        fontWeight: "black",
        fontSize: 38,
        color: "#ffffff",
        gradientText: true,
        letterSpacing: 2,
        zIndex: 2,
      },
      {
        id: "text-2",
        name: "Subheading Text",
        type: "text",
        visible: true,
        locked: false,
        x: 8,
        y: 50,
        width: 70,
        height: 15,
        text: "Professional multi-artboard canvas engine with pixel-perfect vector & raster output.",
        fontFamily: "Rajdhani",
        fontWeight: "semibold",
        fontSize: 18,
        color: "#94a3b8",
        zIndex: 3,
      },
      {
        id: "btn-1",
        name: "Action Button",
        type: "button",
        visible: true,
        locked: false,
        x: 8,
        y: 72,
        width: 24,
        height: 10,
        text: "EXPLORE STUDIO",
        textColor: "#ffffff",
        borderRadius: 12,
        zIndex: 4,
      },
    ],
    showCyberBorders: true,
    showGlassPanel: true,
    glassOpacity: 0.3,
    glassBlur: 10,
    cornerDecorations: {
      enabled: true,
      syncAllCorners: true,
      style: "cyber-hud",
      size: 40,
      length: 40,
      thickness: 3,
      color: "#00f5ff",
      glowColor: "#00f5ff",
      glowSpread: 12,
      opacity: 0.9,
    },
    frameConfig: {
      preset: "cyber-ui",
      enabled: true,
      width: 2,
      color: "#00f5ff",
      opacity: 0.6,
      radius: 16,
    },
  };

  const initialArtboard: V2Artboard = {
    id: artboardId,
    title: title,
    x: 100,
    y: 100,
    width: 1200,
    height: 630,
    presetId: "website-hero",
    state: defaultState,
  };

  return {
    id: "proj-" + Date.now(),
    title: "Lizzdo Design Pro Project",
    version: "2.0",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    activeArtboardId: artboardId,
    artboards: [initialArtboard],
    brandKit: {
      name: "Cyber Neon",
      primaryColor: "#00f5ff",
      secondaryColor: "#a855f7",
      accentColor: "#ff006e",
      backgroundColor: "#0a0e27",
      textColor: "#ffffff",
      headingFont: "Orbitron",
      bodyFont: "Rajdhani",
    },
  };
}

/**
 * Migrates a V1 DesignState into a full V2 multi-artboard project.
 */
export function migrateV1ProjectToV2(v1State: DesignState): V2Project {
  const artboardId = "artboard-" + (v1State.id || Date.now());
  const sanitizedState: DesignState = {
    ...v1State,
    id: v1State.id || "state-" + Date.now(),
    title: v1State.title || "Migrated V1 Design",
    width: v1State.width || 1200,
    height: v1State.height || 630,
    elements: v1State.elements ? [...v1State.elements] : [],
  };

  const artboard: V2Artboard = {
    id: artboardId,
    title: sanitizedState.title,
    x: 100,
    y: 100,
    width: sanitizedState.width,
    height: sanitizedState.height,
    presetId: sanitizedState.preset || "custom",
    state: sanitizedState,
  };

  return {
    id: "proj-v2-" + Date.now(),
    title: sanitizedState.title + " (V2 Pro)",
    version: "2.0",
    createdAt: v1State.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    activeArtboardId: artboardId,
    artboards: [artboard],
  };
}

/**
 * Adds a new artboard to a V2 project (e.g. for multi-format social packs or portfolio sets).
 */
export function addArtboardToV2Project(
  project: V2Project,
  preset: { id: string; name: string; width: number; height: number }
): V2Project {
  const newArtboardId = "artboard-" + Date.now();
  const lastArtboard = project.artboards[project.artboards.length - 1];
  const nextX = lastArtboard ? lastArtboard.x + lastArtboard.width + 120 : 100;
  const nextY = lastArtboard ? lastArtboard.y : 100;

  const newArtboard: V2Artboard = {
    id: newArtboardId,
    title: `${preset.name} Artboard`,
    x: nextX,
    y: nextY,
    width: preset.width,
    height: preset.height,
    presetId: preset.id,
    state: {
      id: "state-" + Date.now(),
      title: `${preset.name} Artboard`,
      preset: preset.id,
      width: preset.width,
      height: preset.height,
      background: {
        type: "gradient",
        solidColor: "#0a0e27",
        gradientFrom: "#0a0e27",
        gradientVia: "#121838",
        gradientTo: "#050814",
        gradientDirection: "to-br",
        pattern: "grid",
        patternColor: "rgba(0, 245, 255, 0.2)",
        patternOpacity: 0.3,
      },
      elements: [
        {
          id: "badge-" + Date.now(),
          name: "Format Tag",
          type: "badge",
          visible: true,
          locked: false,
          x: 8,
          y: 8,
          width: 30,
          height: 8,
          text: preset.name.toUpperCase(),
          bg: "rgba(0, 245, 255, 0.15)",
          textColor: "#00f5ff",
          borderColor: "#00f5ff",
          borderRadius: 8,
          zIndex: 1,
        },
      ],
      showCyberBorders: true,
      showGlassPanel: true,
      glassOpacity: 0.3,
      glassBlur: 10,
    },
  };

  return {
    ...project,
    updatedAt: new Date().toISOString(),
    activeArtboardId: newArtboardId,
    artboards: [...project.artboards, newArtboard],
  };
}

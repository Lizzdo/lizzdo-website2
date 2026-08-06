import React, { createContext, useContext, useState, useEffect } from "react";
import { StudioToolId, StudioProject, StudioProjectStatus, SharedAsset, BrandKitData, StudioActivity, ActivityType } from "../types/studio";
import { BrandKitProfile } from "../types/brandKit";
import { DEFAULT_BRAND_KITS } from "../data/defaultBrandKits";
import { DEFAULT_DESIGN_STATE } from "../data/designerTemplates";
import { DesignState } from "../types/designer";

export interface StudioNotification {
  id: string;
  title: string;
  message: string;
  type: "success" | "info" | "error";
  category?: "exports" | "uploads" | "ai" | "autosave" | "shared" | "system" | "errors";
  timestamp: string;
  read: boolean;
}

interface StudioContextType {
  activeToolId: StudioToolId;
  setActiveToolId: (toolId: StudioToolId) => void;
  projects: StudioProject[];
  currentProjectId: string | null;
  setCurrentProjectId: (id: string | null) => void;
  currentProject: StudioProject | null;
  createProject: (title: string, toolId: StudioToolId, initialData?: any) => StudioProject;
  openProject: (projectId: string) => void;
  updateProject: (id: string, updatedData: Partial<StudioProject>) => void;
  duplicateProject: (id: string) => void;
  deleteProject: (id: string) => void;
  toggleFavoriteProject: (id: string) => void;
  renameProject: (id: string, newTitle: string) => void;
  updateProjectStatus: (id: string, status: StudioProjectStatus) => void;
  moveProject: (id: string, folder: string) => void;
  archiveProject: (id: string) => void;
  exportProject: (id: string, format?: string) => void;
  shareProject: (id: string) => void;
  importProjectJSON: (jsonStr: string) => StudioProject | null;
  exportProjectJSON: (id: string) => void;

  sharedAssets: SharedAsset[];
  uploadSharedAsset: (file: File) => Promise<SharedAsset>;

  // Activity Timeline
  activities: StudioActivity[];
  logActivity: (type: ActivityType, title: string, description: string, projectId?: string, toolId?: StudioToolId) => void;
  clearActivities: () => void;

  // Sidebar Controls
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  isSidebarPinned: boolean;
  setIsSidebarPinned: React.Dispatch<React.SetStateAction<boolean>>;

  // Multi-Brand Kit System
  brandKits: BrandKitProfile[];
  activeBrandId: string;
  activeBrandKit: BrandKitProfile;
  setActiveBrandId: (id: string) => void;
  createBrandKit: (name: string, companyName?: string) => BrandKitProfile;
  updateActiveBrandKit: (updated: Partial<BrandKitProfile>) => void;
  deleteBrandKit: (id: string) => void;
  applyBrandKitToDesign: (designState: DesignState, targetBrand?: BrandKitProfile) => DesignState;
  exportBrandKitJSON: (targetBrand?: BrandKitProfile) => void;
  exportBrandKitCSS: (targetBrand?: BrandKitProfile) => string;
  exportBrandKitDesignTokens: (targetBrand?: BrandKitProfile) => string;
  importBrandKitJSON: (jsonStr: string) => BrandKitProfile | null;

  // Legacy compat mapping
  brandKit: BrandKitData;
  updateBrandKit: (updated: Partial<BrandKitData>) => void;

  // Search, Modals, Recent Searches & Notifications
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  isSearchOpen: boolean;
  setIsSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isQuickActionOpen: boolean;
  setIsQuickActionOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isNotificationOpen: boolean;
  setIsNotificationOpen: React.Dispatch<React.SetStateAction<boolean>>;
  notifications: StudioNotification[];
  addNotification: (title: string, message: string, type?: "success" | "info" | "error", category?: StudioNotification["category"]) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;

  // Storage metrics
  storageUsage: {
    usedMB: number;
    totalMB: number;
    percentage: number;
  };
}

const INITIAL_PROJECTS: StudioProject[] = [
  {
    id: "proj-1",
    title: "Cyberpunk Instagram Reel Cover",
    toolId: "social-designer",
    width: 1080,
    height: 1920,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    status: "in_progress",
    favorite: true,
    tags: ["cyberpunk", "instagram", "social", "reel"],
    platform: "Instagram",
    fileSize: "2.8 MB",
    folder: "Social Campaigns",
    category: "Marketing",
    data: DEFAULT_DESIGN_STATE,
  },
  {
    id: "proj-2",
    title: "Futuristic Lizzdo Logo Concept",
    toolId: "logo-creator",
    width: 1000,
    height: 1000,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    status: "exported",
    favorite: true,
    tags: ["logo", "vector", "branding", "neon"],
    platform: "Universal",
    fileSize: "1.4 MB",
    folder: "Brand Identity",
    category: "Branding",
    data: {
      ...DEFAULT_DESIGN_STATE,
      title: "Futuristic Lizzdo Logo Concept",
      preset: "logo-square",
      width: 1000,
      height: 1000,
    },
  },
  {
    id: "proj-3",
    title: "YouTube Tech Review Thumbnail",
    toolId: "thumbnail-creator",
    width: 1280,
    height: 720,
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    status: "published",
    favorite: false,
    tags: ["youtube", "tech", "thumbnail", "badge"],
    platform: "YouTube",
    fileSize: "3.2 MB",
    folder: "YouTube Channel",
    category: "Video",
    data: {
      ...DEFAULT_DESIGN_STATE,
      title: "YouTube Tech Review Thumbnail",
      preset: "youtube-thumb",
      width: 1280,
      height: 720,
    },
  },
  {
    id: "proj-4",
    title: "Lizzdo E-Commerce Promo Banner",
    toolId: "banner-creator",
    width: 1200,
    height: 628,
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    status: "draft",
    favorite: false,
    tags: ["banner", "promo", "ecommerce", "sale"],
    platform: "Web",
    fileSize: "1.9 MB",
    folder: "Marketing Banners",
    category: "E-Commerce",
    data: {
      ...DEFAULT_DESIGN_STATE,
      title: "Lizzdo E-Commerce Promo Banner",
      width: 1200,
      height: 628,
    },
  },
];

const INITIAL_ASSETS: SharedAsset[] = [
  {
    id: "asset-1",
    name: "Lizzdo Primary Logo",
    type: "logo",
    url: "/lizzdo-logo.png",
    category: "Brand Logos",
    tags: ["logo", "lizzdo", "cyan"],
    sizeStr: "240 KB",
    createdAt: new Date().toISOString(),
  },
  {
    id: "asset-2",
    name: "Cyber Neon Background Grid",
    type: "image",
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    category: "Textures",
    tags: ["grid", "neon", "cyan", "background"],
    sizeStr: "1.4 MB",
    createdAt: new Date().toISOString(),
  },
];

const StudioContext = createContext<StudioContextType | null>(null);

export function StudioProvider({ children }: { children: React.ReactNode }) {
  const [activeToolId, setActiveToolId] = useState<StudioToolId>("dashboard");
  const [projects, setProjects] = useState<StudioProject[]>(() => {
    try {
      const saved = localStorage.getItem("lizzdo_studio_projects");
      return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
    }
  });

  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

  const [sharedAssets, setSharedAssets] = useState<SharedAsset[]>(() => {
    try {
      const saved = localStorage.getItem("lizzdo_studio_assets");
      return saved ? JSON.parse(saved) : INITIAL_ASSETS;
    } catch {
      return INITIAL_ASSETS;
    }
  });

  // BRAND KITS STATE
  const [brandKits, setBrandKits] = useState<BrandKitProfile[]>(() => {
    try {
      const saved = localStorage.getItem("lizzdo_studio_brandkits_v2");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Failed to load brandkits:", e);
    }
    return DEFAULT_BRAND_KITS;
  });

  const [activeBrandId, setActiveBrandId] = useState<string>(() => {
    try {
      const savedId = localStorage.getItem("lizzdo_active_brand_id");
      if (savedId && DEFAULT_BRAND_KITS.some((b) => b.id === savedId)) return savedId;
    } catch (e) {}
    return DEFAULT_BRAND_KITS[0].id;
  });

  // Active Brand Profile
  const activeBrandKit =
    brandKits.find((b) => b.id === activeBrandId) || brandKits[0] || DEFAULT_BRAND_KITS[0];

  // Search, Quick Action, Notification State
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("lizzdo_studio_recent_searches");
      return saved ? JSON.parse(saved) : ["Neon Logo", "Instagram Reel", "Thumbnail", "Brand Kit"];
    } catch {
      return ["Neon Logo", "Instagram Reel", "Thumbnail", "Brand Kit"];
    }
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Sidebar controls
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isSidebarPinned, setIsSidebarPinned] = useState<boolean>(true);

  // Activities Log State
  const [activities, setActivities] = useState<StudioActivity[]>(() => {
    try {
      const saved = localStorage.getItem("lizzdo_studio_activities");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: "act-1",
        type: "project_created",
        title: "Project Created",
        description: "Created Cyberpunk Instagram Reel Cover",
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        projectId: "proj-1",
        toolId: "social-designer",
      },
      {
        id: "act-2",
        type: "ai_generated",
        title: "AI Graphic Generated",
        description: "Generated 8K Futuristic Cyber City Artwork",
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
        toolId: "ai-generator",
      },
      {
        id: "act-3",
        type: "export_completed",
        title: "Export Completed",
        description: "Exported Futuristic Lizzdo Logo Concept in Ultra HD SVG & PNG",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        projectId: "proj-2",
        toolId: "logo-creator",
      },
      {
        id: "act-4",
        type: "asset_uploaded",
        title: "Asset Uploaded",
        description: "Uploaded Cyber Neon Background Grid to Vault",
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
    ];
  });

  const logActivity = (
    type: ActivityType,
    title: string,
    description: string,
    projectId?: string,
    toolId?: StudioToolId
  ) => {
    const newAct: StudioActivity = {
      id: `act-${Date.now()}`,
      type,
      title,
      description,
      timestamp: new Date().toISOString(),
      projectId,
      toolId,
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  const clearActivities = () => setActivities([]);

  const addRecentSearch = (query: string) => {
    if (!query || query.trim().length < 2) return;
    const clean = query.trim();
    setRecentSearches((prev) => [clean, ...prev.filter((q) => q.toLowerCase() !== clean.toLowerCase())].slice(0, 8));
  };

  const clearRecentSearches = () => setRecentSearches([]);

  const [notifications, setNotifications] = useState<StudioNotification[]>([
    {
      id: "notif-1",
      title: "Studio Operating System V3 Initialized",
      message: "Complete Brand Kit & Design System is ready across all tools.",
      type: "success",
      category: "system",
      timestamp: new Date().toISOString(),
      read: false,
    },
    {
      id: "notif-2",
      title: "Autosave Active",
      message: "All 4 workspace projects auto-saved to local persistence vault.",
      type: "info",
      category: "autosave",
      timestamp: new Date(Date.now() - 600000).toISOString(),
      read: false,
    },
  ]);

  const addNotification = (
    title: string,
    message: string,
    type: "success" | "info" | "error" = "info",
    category: StudioNotification["category"] = "system"
  ) => {
    const newNotif: StudioNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      category,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const currentProject = projects.find((p) => p.id === currentProjectId) || null;

  // Storage metrics calculation
  const storageUsage = {
    usedMB: Math.round((projects.length * 2.4 + sharedAssets.length * 1.5 + 12.8) * 10) / 10,
    totalMB: 1000,
    percentage: Math.min(100, Math.round(((projects.length * 2.4 + sharedAssets.length * 1.5 + 12.8) / 1000) * 100)),
  };

  // Persistence Effects
  useEffect(() => {
    try {
      localStorage.setItem("lizzdo_studio_projects", JSON.stringify(projects));
    } catch (e) {}
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem("lizzdo_studio_assets", JSON.stringify(sharedAssets));
    } catch (e) {}
  }, [sharedAssets]);

  useEffect(() => {
    try {
      localStorage.setItem("lizzdo_studio_brandkits_v2", JSON.stringify(brandKits));
    } catch (e) {}
  }, [brandKits]);

  useEffect(() => {
    try {
      localStorage.setItem("lizzdo_active_brand_id", activeBrandId);
    } catch (e) {}
  }, [activeBrandId]);

  useEffect(() => {
    try {
      localStorage.setItem("lizzdo_studio_activities", JSON.stringify(activities));
    } catch (e) {}
  }, [activities]);

  useEffect(() => {
    try {
      localStorage.setItem("lizzdo_studio_recent_searches", JSON.stringify(recentSearches));
    } catch (e) {}
  }, [recentSearches]);

  // BRAND KIT ACTIONS
  const createBrandKit = (name: string, companyName = ""): BrandKitProfile => {
    const newKit: BrandKitProfile = {
      ...DEFAULT_BRAND_KITS[0],
      id: `brand-${Date.now()}`,
      brandName: name,
      companyName: companyName || `${name} Corp`,
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setBrandKits((prev) => [newKit, ...prev]);
    setActiveBrandId(newKit.id);
    addNotification("Brand Kit Created", `Switched to new Brand Kit "${name}"`, "success", "system");
    return newKit;
  };

  const updateActiveBrandKit = (updated: Partial<BrandKitProfile>) => {
    setBrandKits((prev) =>
      prev.map((b) =>
        b.id === activeBrandId
          ? { ...b, ...updated, updatedAt: new Date().toISOString() }
          : b
      )
    );
  };

  const deleteBrandKit = (id: string) => {
    if (brandKits.length <= 1) {
      addNotification("Cannot Delete", "You must keep at least one Brand Kit profile.", "error", "system");
      return;
    }
    const remaining = brandKits.filter((b) => b.id !== id);
    setBrandKits(remaining);
    if (activeBrandId === id) {
      setActiveBrandId(remaining[0].id);
    }
    addNotification("Brand Kit Deleted", "Brand profile removed successfully.", "info", "system");
  };

  // AUTOMATIC BRAND APPLICATION TO CANVAS
  const applyBrandKitToDesign = (
    designState: DesignState,
    targetBrand: BrandKitProfile = activeBrandKit
  ): DesignState => {
    const primaryColor = targetBrand.colors.primary;
    const secondaryColor = targetBrand.colors.secondary;
    const backgroundColor = targetBrand.colors.background;
    const textColor = targetBrand.colors.text;

    const headingFont = targetBrand.typography.heading.fontFamily;
    const bodyFont = targetBrand.typography.body.fontFamily;
    const buttonFont = targetBrand.typography.button.fontFamily;

    const primaryLogo =
      targetBrand.logoVariants.find((l) => l.type === "Primary Logo")?.url ||
      targetBrand.logoVariants[0]?.url ||
      "/lizzdo-logo.png";

    // Update Elements
    const updatedElements = designState.elements.map((el) => {
      if (el.type === "text") {
        const textEl = el as any;
        const fontSize = textEl.fontSize || 16;
        let newFont = bodyFont;
        let newColor = textColor;

        if (fontSize >= 28) {
          newFont = headingFont;
          newColor = primaryColor;
        } else if (textEl.text?.toLowerCase().includes("button") || textEl.text?.toLowerCase().includes("cta")) {
          newFont = buttonFont;
          newColor = primaryColor;
        }

        return {
          ...textEl,
          fontFamily: newFont,
          color: newColor,
        };
      }

      if (el.type === "shape") {
        const shapeEl = el as any;
        return {
          ...shapeEl,
          bg: primaryColor,
        };
      }

      if (el.type === "image" && (el.name.toLowerCase().includes("logo") || (el as any).isLogo)) {
        return {
          ...el,
          src: primaryLogo,
          url: primaryLogo,
        };
      }

      return el;
    });

    // Check Watermark
    let finalElements = updatedElements;
    if (targetBrand.watermark.enabled) {
      const existingWmIndex = finalElements.findIndex((el) => el.name === "Brand Watermark");
      const wmText = targetBrand.watermark.customText || targetBrand.brandName;

      const wmElement = {
        id: `wm-${Date.now()}`,
        name: "Brand Watermark",
        type: "text",
        visible: true,
        locked: true,
        x: designState.width - 260,
        y: designState.height - 60,
        width: 240,
        height: 40,
        rotation: 0,
        opacity: targetBrand.watermark.opacity,
        text: wmText,
        fontSize: 16,
        fontFamily: headingFont,
        color: primaryColor,
        alignment: "top-left",
      };

      if (existingWmIndex >= 0) {
        finalElements[existingWmIndex] = wmElement as any;
      } else {
        finalElements = [...finalElements, wmElement as any];
      }
    }

    return {
      ...designState,
      background: {
        ...designState.background,
        solidColor: backgroundColor,
      },
      elements: finalElements,
    };
  };

  // EXPORT BRAND KIT JSON, CSS, DESIGN TOKENS
  const exportBrandKitJSON = (targetBrand = activeBrandKit) => {
    const dataStr =
      "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(targetBrand, null, 2));
    const dl = document.createElement("a");
    dl.setAttribute("href", dataStr);
    dl.setAttribute("download", `${targetBrand.brandName.toLowerCase().replace(/\s+/g, "_")}_brandkit.json`);
    document.body.appendChild(dl);
    dl.click();
    dl.remove();
    addNotification("Brand Kit Exported", `Saved ${targetBrand.brandName} JSON file`, "success", "exports");
  };

  const exportBrandKitCSS = (targetBrand = activeBrandKit) => {
    return `:root {
  /* Brand ${targetBrand.brandName} Design Tokens */
  --brand-primary: ${targetBrand.colors.primary};
  --brand-secondary: ${targetBrand.colors.secondary};
  --brand-accent: ${targetBrand.colors.accent};
  --brand-background: ${targetBrand.colors.background};
  --brand-surface: ${targetBrand.colors.surface};
  --brand-text: ${targetBrand.colors.text};
  --brand-success: ${targetBrand.colors.success};
  --brand-warning: ${targetBrand.colors.warning};
  --brand-error: ${targetBrand.colors.error};
  --brand-info: ${targetBrand.colors.info};

  --font-display: '${targetBrand.typography.display.fontFamily}', sans-serif;
  --font-heading: '${targetBrand.typography.heading.fontFamily}', sans-serif;
  --font-body: '${targetBrand.typography.body.fontFamily}', sans-serif;
  --font-button: '${targetBrand.typography.button.fontFamily}', sans-serif;
  --font-caption: '${targetBrand.typography.caption.fontFamily}', monospace;
}`;
  };

  const exportBrandKitDesignTokens = (targetBrand = activeBrandKit) => {
    const tokens = {
      color: {
        primary: { value: targetBrand.colors.primary },
        secondary: { value: targetBrand.colors.secondary },
        accent: { value: targetBrand.colors.accent },
        background: { value: targetBrand.colors.background },
        surface: { value: targetBrand.colors.surface },
        text: { value: targetBrand.colors.text },
      },
      typography: {
        heading: { fontFamily: { value: targetBrand.typography.heading.fontFamily } },
        body: { fontFamily: { value: targetBrand.typography.body.fontFamily } },
      },
    };
    return JSON.stringify(tokens, null, 2);
  };

  const importBrandKitJSON = (jsonStr: string): BrandKitProfile | null => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && parsed.brandName && parsed.colors) {
        const imported: BrandKitProfile = {
          ...parsed,
          id: `brand-imported-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setBrandKits((prev) => [imported, ...prev]);
        setActiveBrandId(imported.id);
        addNotification("Brand Kit Imported", `Successfully imported "${imported.brandName}"`, "success", "system");
        return imported;
      }
    } catch (err) {
      addNotification("Import Error", "Invalid Brand Kit JSON format", "error", "errors");
    }
    return null;
  };

  // Legacy compat brandKit mapping
  const legacyBrandKit: BrandKitData = {
    brandName: activeBrandKit.brandName,
    tagline: activeBrandKit.tagline,
    primaryColor: activeBrandKit.colors.primary,
    secondaryColor: activeBrandKit.colors.secondary,
    accentColors: [activeBrandKit.colors.accent, activeBrandKit.colors.success, activeBrandKit.colors.warning],
    neutralColors: [activeBrandKit.colors.background, activeBrandKit.colors.surface, activeBrandKit.colors.text],
    headingFont: activeBrandKit.typography.heading.fontFamily,
    bodyFont: activeBrandKit.typography.body.fontFamily,
    logoVariants: activeBrandKit.logoVariants.map((l) => ({ id: l.id, name: l.name, url: l.url })),
  };

  const updateLegacyBrandKit = (updated: Partial<BrandKitData>) => {
    updateActiveBrandKit({
      brandName: updated.brandName !== undefined ? updated.brandName : activeBrandKit.brandName,
      tagline: updated.tagline !== undefined ? updated.tagline : activeBrandKit.tagline,
      colors: {
        ...activeBrandKit.colors,
        primary: updated.primaryColor || activeBrandKit.colors.primary,
        secondary: updated.secondaryColor || activeBrandKit.colors.secondary,
      },
      typography: {
        ...activeBrandKit.typography,
        heading: {
          ...activeBrandKit.typography.heading,
          fontFamily: updated.headingFont || activeBrandKit.typography.heading.fontFamily,
        },
        body: {
          ...activeBrandKit.typography.body,
          fontFamily: updated.bodyFont || activeBrandKit.typography.body.fontFamily,
        },
      },
    });
  };

  // Project Actions
  const createProject = (title: string, toolId: StudioToolId, initialData?: any): StudioProject => {
    const newProj: StudioProject = {
      id: `proj-${Date.now()}`,
      title,
      toolId,
      width: initialData?.width || 1200,
      height: initialData?.height || 1200,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "draft",
      favorite: false,
      tags: [toolId.split("-")[0], "new"],
      platform: "Universal",
      fileSize: "1.2 MB",
      folder: "General",
      category: "Studio",
      data: initialData || DEFAULT_DESIGN_STATE,
    };
    setProjects((prev) => [newProj, ...prev]);
    setCurrentProjectId(newProj.id);
    setActiveToolId(toolId);
    logActivity("project_created", "Project Created", `Created "${title}"`, newProj.id, toolId);
    addNotification("Project Created", `Started blank workspace for "${title}"`, "success", "system");
    return newProj;
  };

  const openProject = (projectId: string) => {
    const proj = projects.find((p) => p.id === projectId);
    if (proj) {
      setCurrentProjectId(proj.id);
      setActiveToolId(proj.toolId);
      logActivity("project_updated", "Project Opened", `Opened "${proj.title}"`, proj.id, proj.toolId);
    }
  };

  const updateProject = (id: string, updatedData: Partial<StudioProject>) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, ...updatedData, updatedAt: new Date().toISOString() } : p
      )
    );
  };

  const toggleFavoriteProject = (id: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextFav = !p.favorite;
          addNotification(
            nextFav ? "Starred Project" : "Unstarred Project",
            `${nextFav ? "Added" : "Removed"} "${p.title}" ${nextFav ? "to" : "from"} favorites`,
            "info",
            "system"
          );
          return { ...p, favorite: nextFav, updatedAt: new Date().toISOString() };
        }
        return p;
      })
    );
  };

  const renameProject = (id: string, newTitle: string) => {
    if (!newTitle || !newTitle.trim()) return;
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, title: newTitle.trim(), updatedAt: new Date().toISOString() } : p
      )
    );
    addNotification("Project Renamed", `Updated title to "${newTitle.trim()}"`, "success", "system");
  };

  const updateProjectStatus = (id: string, status: StudioProjectStatus) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status, updatedAt: new Date().toISOString() } : p
      )
    );
    addNotification("Status Updated", `Project status set to ${status.replace("_", " ").toUpperCase()}`, "info", "system");
  };

  const moveProject = (id: string, folder: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, folder, updatedAt: new Date().toISOString() } : p))
    );
    addNotification("Project Moved", `Moved project into "${folder}"`, "info", "system");
  };

  const archiveProject = (id: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const isArchived = p.status === "archived";
          const newStatus: StudioProjectStatus = isArchived ? "draft" : "archived";
          addNotification(
            isArchived ? "Project Restored" : "Project Archived",
            `${isArchived ? "Restored" : "Archived"} "${p.title}"`,
            "info",
            "system"
          );
          return { ...p, status: newStatus, updatedAt: new Date().toISOString() };
        }
        return p;
      })
    );
  };

  const exportProject = (id: string, format = "PNG") => {
    const proj = projects.find((p) => p.id === id);
    if (!proj) return;
    updateProjectStatus(id, "exported");
    logActivity("export_completed", "Export Completed", `Exported "${proj.title}" as high-res ${format}`, proj.id, proj.toolId);
    addNotification("Export Successful", `Downloaded high-res ${format} for "${proj.title}"`, "success", "exports");
  };

  const shareProject = (id: string) => {
    const proj = projects.find((p) => p.id === id);
    if (!proj) return;
    const shareUrl = `${window.location.origin}/studio?project=${proj.id}`;
    navigator.clipboard?.writeText(shareUrl);
    addNotification("Share Link Copied", `Project link for "${proj.title}" copied to clipboard`, "success", "shared");
  };

  const exportProjectJSON = (id: string) => {
    const proj = projects.find((p) => p.id === id);
    if (!proj) return;
    const dataStr =
      "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(proj, null, 2));
    const dl = document.createElement("a");
    dl.setAttribute("href", dataStr);
    dl.setAttribute("download", `${proj.title.toLowerCase().replace(/\s+/g, "_")}_studio.json`);
    document.body.appendChild(dl);
    dl.click();
    dl.remove();
    addNotification("Project Exported", `Saved "${proj.title}" JSON project file`, "success", "exports");
  };

  const importProjectJSON = (jsonStr: string): StudioProject | null => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && parsed.title && parsed.toolId) {
        const imported: StudioProject = {
          ...parsed,
          id: `proj-imp-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setProjects((prev) => [imported, ...prev]);
        setCurrentProjectId(imported.id);
        setActiveToolId(imported.toolId);
        logActivity("project_created", "Project Imported", `Imported project "${imported.title}"`, imported.id, imported.toolId);
        addNotification("Project Imported", `Successfully imported "${imported.title}"`, "success", "system");
        return imported;
      }
    } catch (e) {
      addNotification("Import Failed", "Invalid project JSON file structure.", "error", "errors");
    }
    return null;
  };

  const duplicateProject = (id: string) => {
    const target = projects.find((p) => p.id === id);
    if (!target) return;
    const duplicated: StudioProject = {
      ...target,
      id: `proj-${Date.now()}`,
      title: `${target.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "draft",
    };
    setProjects((prev) => [duplicated, ...prev]);
    logActivity("project_created", "Project Duplicated", `Cloned "${target.title}"`, duplicated.id, duplicated.toolId);
    addNotification("Project Duplicated", `Created copy "${duplicated.title}"`, "success", "system");
  };

  const deleteProject = (id: string) => {
    const target = projects.find((p) => p.id === id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (currentProjectId === id) setCurrentProjectId(null);
    if (target) {
      addNotification("Project Deleted", `Deleted "${target.title}"`, "info", "system");
    }
  };

  const uploadSharedAsset = (file: File): Promise<SharedAsset> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        const newAsset: SharedAsset = {
          id: `asset-${Date.now()}`,
          name: file.name.replace(/\.[^/.]+$/, ""),
          type: "image",
          url,
          category: "User Uploads",
          tags: ["upload", "local", "image"],
          sizeStr: `${(file.size / 1024).toFixed(0)} KB`,
          createdAt: new Date().toISOString(),
        };
        setSharedAssets((prev) => [newAsset, ...prev]);
        logActivity("asset_uploaded", "Asset Uploaded", `Uploaded file "${file.name}" to Asset Vault`);
        addNotification("Asset Uploaded", `File "${file.name}" added to shared assets`, "success", "uploads");
        resolve(newAsset);
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <StudioContext.Provider
      value={{
        activeToolId,
        setActiveToolId,
        projects,
        currentProjectId,
        setCurrentProjectId,
        currentProject,
        createProject,
        openProject,
        updateProject,
        duplicateProject,
        deleteProject,
        toggleFavoriteProject,
        renameProject,
        updateProjectStatus,
        moveProject,
        archiveProject,
        exportProject,
        shareProject,
        importProjectJSON,
        exportProjectJSON,
        sharedAssets,
        uploadSharedAsset,

        // Activities
        activities,
        logActivity,
        clearActivities,

        // Sidebar Controls
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        isSidebarPinned,
        setIsSidebarPinned,

        // Brand Kit System
        brandKits,
        activeBrandId,
        activeBrandKit,
        setActiveBrandId,
        createBrandKit,
        updateActiveBrandKit,
        deleteBrandKit,
        applyBrandKitToDesign,
        exportBrandKitJSON,
        exportBrandKitCSS,
        exportBrandKitDesignTokens,
        importBrandKitJSON,

        // Legacy compat
        brandKit: legacyBrandKit,
        updateBrandKit: updateLegacyBrandKit,

        // Search, Modals, Recent Searches & Notifications
        searchQuery,
        setSearchQuery,
        recentSearches,
        addRecentSearch,
        clearRecentSearches,
        isSearchOpen,
        setIsSearchOpen,
        isQuickActionOpen,
        setIsQuickActionOpen,
        isNotificationOpen,
        setIsNotificationOpen,
        notifications,
        addNotification,
        markNotificationRead,
        clearAllNotifications,

        // Storage Usage
        storageUsage,
      }}
    >
      {children}
    </StudioContext.Provider>
  );
}

export function useStudio() {
  const ctx = useContext(StudioContext);
  if (!ctx) {
    throw new Error("useStudio must be used within a StudioProvider");
  }
  return ctx;
}

import React, { createContext, useContext, useState, useEffect } from "react";
import JSZip from "jszip";
import {
  StudioToolId,
  StudioProject,
  StudioProjectStatus,
  StudioFolder,
  ProjectVersion,
  ProjectAssetLink,
  ExportRecord,
  UnsavedRecoveryDraft,
  SharedAsset,
  BrandKitData,
  StudioActivity,
  ActivityType,
} from "../types/studio";
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

export const DEFAULT_STUDIO_FOLDERS: StudioFolder[] = [
  { id: "folder-portfolio", name: "Portfolio", parentId: null, color: "#a855f7", icon: "Briefcase", favorite: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), description: "Showcase & Client Portfolio Items" },
  { id: "folder-blog", name: "Blog", parentId: null, color: "#3b82f6", icon: "BookOpen", favorite: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), description: "Editorial & Article Graphics" },
  { id: "folder-store", name: "Store", parentId: null, color: "#10b981", icon: "ShoppingBag", favorite: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), description: "E-Commerce & Product Visuals" },
  { id: "folder-branding", name: "Branding", parentId: null, color: "#ec4899", icon: "Award", favorite: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), description: "Logos, Brand Systems & Guidelines" },
  { id: "folder-marketing", name: "Marketing", parentId: null, color: "#f59e0b", icon: "Target", favorite: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), description: "Ad Banners & Campaign Materials" },
  { id: "folder-social", name: "Social Media", parentId: null, color: "#06b6d4", icon: "Share2", favorite: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), description: "Instagram, YouTube, TikTok Covers" },
  { id: "folder-videos", name: "Videos", parentId: null, color: "#8b5cf6", icon: "Video", favorite: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), description: "Video Projects & Motion Clips" },
  { id: "folder-templates", name: "Templates", parentId: null, color: "#14b8a6", icon: "LayoutTemplate", favorite: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), description: "Reusable Layouts & Master Presets" },
  { id: "folder-client", name: "Client Projects", parentId: null, color: "#f43f5e", icon: "Users", favorite: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), description: "External Client Deliverables" },
  { id: "folder-personal", name: "Personal Projects", parentId: null, color: "#84cc16", icon: "User", favorite: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), description: "Personal Experiments & Ideas" },
  { id: "folder-drafts", name: "Drafts", parentId: null, color: "#6b7280", icon: "FileText", favorite: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), description: "Unfinished Explorations" },
  { id: "folder-archive", name: "Archive", parentId: null, color: "#4b5563", icon: "Archive", favorite: false, archived: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), description: "Archived & Deprecated Work" },
];

interface StudioContextType {
  activeToolId: StudioToolId;
  setActiveToolId: (toolId: StudioToolId) => void;
  projects: StudioProject[];
  currentProjectId: string | null;
  setCurrentProjectId: (id: string | null) => void;
  currentProject: StudioProject | null;
  
  // Project Actions
  createProject: (title: string, toolId: StudioToolId, initialData?: any, folderId?: string, description?: string) => StudioProject;
  openProject: (projectId: string) => void;
  updateProject: (id: string, updatedData: Partial<StudioProject>) => void;
  duplicateProject: (id: string) => void;
  deleteProject: (id: string) => void; // Soft Delete (moves to recycle bin)
  restoreProjectFromTrash: (id: string) => void;
  permanentlyDeleteProject: (id: string) => void;
  emptyRecycleBin: () => void;
  toggleFavoriteProject: (id: string) => void;
  togglePinProject: (id: string) => void;
  renameProject: (id: string, newTitle: string) => void;
  updateProjectStatus: (id: string, status: StudioProjectStatus) => void;
  moveProject: (id: string, folderNameOrId: string) => void;
  archiveProject: (id: string) => void;
  exportProject: (id: string, format?: string) => void;
  shareProject: (id: string) => void;
  
  // Folder & Workspace Management
  folders: StudioFolder[];
  createFolder: (name: string, parentId?: string | null, color?: string, icon?: string, description?: string) => StudioFolder;
  updateFolder: (id: string, updated: Partial<StudioFolder>) => void;
  deleteFolder: (id: string, deleteContents?: boolean) => void;
  toggleFavoriteFolder: (id: string) => void;
  duplicateFolder: (id: string) => void;
  moveFolder: (id: string, newParentId: string | null) => void;

  // Version Control
  createVersionCheckpoint: (projectId: string, note?: string) => ProjectVersion | null;
  restoreVersion: (projectId: string, versionId: string) => void;
  duplicateVersionAsProject: (projectId: string, versionId: string) => StudioProject | null;

  // Auto-Save & Recovery System
  lastAutoSaveTime: string | null;
  recoveryDrafts: UnsavedRecoveryDraft[];
  triggerManualAutoSave: () => void;
  restoreRecoveryDraft: (projectId: string) => void;
  discardRecoveryDraft: (projectId: string) => void;

  // Package Import / Export
  exportProjectJSON: (id: string) => void;
  importProjectJSON: (jsonStr: string) => StudioProject | null;
  exportProjectZIP: (id: string) => Promise<void>;
  exportFullStudioBackupZIP: () => Promise<void>;
  importProjectPackageZIP: (file: File) => Promise<StudioProject | null>;

  // Asset Relinking & Compression
  relinkProjectAsset: (projectId: string, assetId: string, newUrl: string) => void;
  compressProjectAssets: (projectId: string) => void;

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
  duplicateBrandKit: (id: string) => BrandKitProfile | null;
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
    description: "High-octane futuristic social media story and reel cover layout with animated neon text overlays.",
    toolId: "social-designer",
    width: 1080,
    height: 1920,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    status: "in_progress",
    favorite: true,
    isPinned: true,
    isDeleted: false,
    tags: ["cyberpunk", "instagram", "social", "reel"],
    platform: "Instagram",
    fileSize: "2.8 MB",
    folder: "Social Media",
    folderId: "folder-social",
    category: "Marketing",
    owner: "Lizzdo Creative Studio",
    version: "1.2.0",
    presetName: "Instagram Story 1080x1920",
    versions: [
      {
        id: "v-1.0",
        versionNumber: "1.0.0",
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        note: "Initial base layout setup",
        isCheckpoint: true,
        author: "Studio Designer",
        dataSnapshot: DEFAULT_DESIGN_STATE,
      },
      {
        id: "v-1.2",
        versionNumber: "1.2.0",
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
        note: "Added neon glow layers and typography fine-tuning",
        isCheckpoint: true,
        author: "Studio Designer",
        dataSnapshot: DEFAULT_DESIGN_STATE,
      },
    ],
    exportHistory: [
      { id: "exp-1", format: "PNG", timestamp: new Date(Date.now() - 3600000 * 6).toISOString(), sizeStr: "2.8 MB", resolution: "1080x1920" },
    ],
    linkedAssets: [
      { id: "link-1", name: "Cyber Neon Grid", type: "image", url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80", sizeStr: "1.4 MB", isMissing: false },
    ],
    data: DEFAULT_DESIGN_STATE,
  },
  {
    id: "proj-2",
    title: "Futuristic Lizzdo Logo Concept",
    description: "Vector emblem with glowing neon paths and cybernetic geometric shapes for Lizzdo branding.",
    toolId: "logo-creator",
    width: 1000,
    height: 1000,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    status: "exported",
    favorite: true,
    isPinned: false,
    isDeleted: false,
    tags: ["logo", "vector", "branding", "neon"],
    platform: "Universal",
    fileSize: "1.4 MB",
    folder: "Branding",
    folderId: "folder-branding",
    category: "Branding",
    owner: "Brand Lead",
    version: "2.0.0",
    presetName: "Square Logo 1000x1000",
    versions: [
      {
        id: "v-2.0",
        versionNumber: "2.0.0",
        timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
        note: "Vector logo finalized with high contrast brandkit colors",
        isCheckpoint: true,
        author: "Brand Lead",
        dataSnapshot: {
          ...DEFAULT_DESIGN_STATE,
          title: "Futuristic Lizzdo Logo Concept",
          preset: "logo-square",
          width: 1000,
          height: 1000,
        },
      },
    ],
    exportHistory: [
      { id: "exp-2", format: "SVG", timestamp: new Date(Date.now() - 86400000 * 1).toISOString(), sizeStr: "1.4 MB", resolution: "1000x1000" },
    ],
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
    description: "Eye-catching high click-through rate YouTube video thumbnail featuring badge overlays.",
    toolId: "thumbnail-creator",
    width: 1280,
    height: 720,
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    status: "published",
    favorite: false,
    isPinned: false,
    isDeleted: false,
    tags: ["youtube", "tech", "thumbnail", "badge"],
    platform: "YouTube",
    fileSize: "3.2 MB",
    folder: "Videos",
    folderId: "folder-videos",
    category: "Video",
    owner: "Content Producer",
    version: "1.0.1",
    presetName: "YouTube Thumbnail 1280x720",
    versions: [
      {
        id: "v-1.0",
        versionNumber: "1.0.0",
        timestamp: new Date(Date.now() - 86400000 * 6).toISOString(),
        note: "Initial thumbnail draft",
        isCheckpoint: true,
        author: "Content Producer",
        dataSnapshot: DEFAULT_DESIGN_STATE,
      },
    ],
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
    description: "Wide web banner campaign layout highlighting seasonal discounts and cyber product shots.",
    toolId: "banner-creator",
    width: 1200,
    height: 628,
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    status: "draft",
    favorite: false,
    isPinned: false,
    isDeleted: false,
    tags: ["banner", "promo", "ecommerce", "sale"],
    platform: "Web",
    fileSize: "1.9 MB",
    folder: "Marketing",
    folderId: "folder-marketing",
    category: "E-Commerce",
    owner: "Marketing Manager",
    version: "0.9.0",
    presetName: "Facebook Web Banner 1200x628",
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
      const saved = localStorage.getItem("lizzdo_studio_projects_v2");
      if (saved) return JSON.parse(saved);
      const oldSaved = localStorage.getItem("lizzdo_studio_projects");
      return oldSaved ? JSON.parse(oldSaved) : INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
    }
  });

  const [folders, setFolders] = useState<StudioFolder[]>(() => {
    try {
      const saved = localStorage.getItem("lizzdo_studio_folders");
      return saved ? JSON.parse(saved) : DEFAULT_STUDIO_FOLDERS;
    } catch {
      return DEFAULT_STUDIO_FOLDERS;
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

  const activeBrandKit =
    brandKits.find((b) => b.id === activeBrandId) || brandKits[0] || DEFAULT_BRAND_KITS[0];

  // Auto-Save & Recovery State
  const [lastAutoSaveTime, setLastAutoSaveTime] = useState<string | null>(null);
  const [recoveryDrafts, setRecoveryDrafts] = useState<UnsavedRecoveryDraft[]>(() => {
    try {
      const saved = localStorage.getItem("lizzdo_studio_recovery_drafts");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

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
      title: "Project Manager V5 Initialized",
      message: "Complete folder hierarchy, recovery vault, version control & ZIP export ready.",
      type: "success",
      category: "system",
      timestamp: new Date().toISOString(),
      read: false,
    },
    {
      id: "notif-2",
      title: "Autosave Engine Active",
      message: "Projects auto-saved to local persistence vault with recovery fallback.",
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
    usedMB: Math.round((projects.length * 2.4 + sharedAssets.length * 1.5 + folders.length * 0.1 + 12.8) * 10) / 10,
    totalMB: 1000,
    percentage: Math.min(100, Math.round(((projects.length * 2.4 + sharedAssets.length * 1.5 + 12.8) / 1000) * 100)),
  };

  // Persistence Effects
  useEffect(() => {
    try {
      localStorage.setItem("lizzdo_studio_projects_v2", JSON.stringify(projects));
    } catch (e) {}
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem("lizzdo_studio_folders", JSON.stringify(folders));
    } catch (e) {}
  }, [folders]);

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

  useEffect(() => {
    try {
      localStorage.setItem("lizzdo_studio_recovery_drafts", JSON.stringify(recoveryDrafts));
    } catch (e) {}
  }, [recoveryDrafts]);

  // BACKGROUND AUTO-SAVE ENGINE FOR CURRENT PROJECT
  useEffect(() => {
    if (!currentProject || currentProject.isDeleted) return;

    const interval = setInterval(() => {
      const nowStr = new Date().toISOString();
      setLastAutoSaveTime(nowStr);

      // Save a local recovery draft snapshot
      setRecoveryDrafts((prev) => {
        const filtered = prev.filter((d) => d.projectId !== currentProject.id);
        return [
          {
            projectId: currentProject.id,
            projectTitle: currentProject.title,
            savedAt: nowStr,
            dataSnapshot: currentProject.data,
          },
          ...filtered,
        ].slice(0, 10);
      });
    }, 25000); // auto-save draft snapshot every 25s

    return () => clearInterval(interval);
  }, [currentProject]);

  const triggerManualAutoSave = () => {
    if (!currentProject) return;
    const nowStr = new Date().toISOString();
    updateProject(currentProject.id, {
      updatedAt: nowStr,
      autoSaveTimestamp: nowStr,
      hasUnsavedChanges: false,
    });
    setLastAutoSaveTime(nowStr);
    addNotification("Auto-Save Completed", `Project "${currentProject.title}" saved.`, "info", "autosave");
  };

  const restoreRecoveryDraft = (projectId: string) => {
    const draft = recoveryDrafts.find((d) => d.projectId === projectId);
    if (!draft) return;

    updateProject(projectId, {
      data: draft.dataSnapshot,
      updatedAt: new Date().toISOString(),
      hasUnsavedChanges: false,
    });

    addNotification("Draft Restored", `Restored unsaved session for "${draft.projectTitle}"`, "success", "autosave");
    discardRecoveryDraft(projectId);
  };

  const discardRecoveryDraft = (projectId: string) => {
    setRecoveryDrafts((prev) => prev.filter((d) => d.projectId !== projectId));
  };

  // FOLDER & WORKSPACE MANAGEMENT
  const createFolder = (
    name: string,
    parentId: string | null = null,
    color = "#a855f7",
    icon = "Folder",
    description = ""
  ): StudioFolder => {
    const newFolder: StudioFolder = {
      id: `folder-${Date.now()}`,
      name: name.trim() || "Untitled Folder",
      parentId,
      color,
      icon,
      favorite: false,
      archived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      description,
    };
    setFolders((prev) => [newFolder, ...prev]);
    addNotification("Folder Created", `Created folder "${newFolder.name}"`, "success", "system");
    return newFolder;
  };

  const updateFolder = (id: string, updated: Partial<StudioFolder>) => {
    setFolders((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updated, updatedAt: new Date().toISOString() } : f))
    );
  };

  const deleteFolder = (id: string, deleteContents = false) => {
    const targetFolder = folders.find((f) => f.id === id);
    if (!targetFolder) return;

    if (deleteContents) {
      // Soft-delete projects in this folder
      setProjects((prev) =>
        prev.map((p) =>
          p.folderId === id || p.folder === targetFolder.name
            ? { ...p, isDeleted: true, deletedAt: new Date().toISOString() }
            : p
        )
      );
    } else {
      // Move projects to 'General' folder
      setProjects((prev) =>
        prev.map((p) =>
          p.folderId === id || p.folder === targetFolder.name
            ? { ...p, folder: "General", folderId: undefined }
            : p
        )
      );
    }

    setFolders((prev) => prev.filter((f) => f.id !== id && f.parentId !== id));
    addNotification("Folder Removed", `Deleted folder "${targetFolder.name}"`, "info", "system");
  };

  const toggleFavoriteFolder = (id: string) => {
    setFolders((prev) =>
      prev.map((f) => (f.id === id ? { ...f, favorite: !f.favorite, updatedAt: new Date().toISOString() } : f))
    );
  };

  const duplicateFolder = (id: string) => {
    const target = folders.find((f) => f.id === id);
    if (!target) return;
    const newFolder: StudioFolder = {
      ...target,
      id: `folder-${Date.now()}`,
      name: `${target.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setFolders((prev) => [newFolder, ...prev]);
    addNotification("Folder Duplicated", `Cloned folder "${target.name}"`, "success", "system");
  };

  const moveFolder = (id: string, newParentId: string | null) => {
    if (id === newParentId) return;
    setFolders((prev) =>
      prev.map((f) => (f.id === id ? { ...f, parentId: newParentId, updatedAt: new Date().toISOString() } : f))
    );
  };

  // VERSION CONTROL METHODS
  const createVersionCheckpoint = (projectId: string, note = "Manual Checkpoint"): ProjectVersion | null => {
    const proj = projects.find((p) => p.id === projectId);
    if (!proj) return null;

    const existingVersions = proj.versions || [];
    const major = existingVersions.length + 1;
    const versionNum = `${major}.0.0`;

    const newVersion: ProjectVersion = {
      id: `v-${Date.now()}`,
      versionNumber: versionNum,
      timestamp: new Date().toISOString(),
      note: note.trim() || "Manual Checkpoint",
      isCheckpoint: true,
      author: proj.owner || "You",
      dataSnapshot: JSON.parse(JSON.stringify(proj.data)),
    };

    const updatedVersions = [newVersion, ...existingVersions];
    updateProject(projectId, {
      version: versionNum,
      versions: updatedVersions,
    });

    logActivity("project_updated", "Version Checkpoint Created", `Saved ${versionNum} for "${proj.title}"`, proj.id, proj.toolId);
    addNotification("Version Checkpoint", `Created version ${versionNum} snapshot`, "success", "system");
    return newVersion;
  };

  const restoreVersion = (projectId: string, versionId: string) => {
    const proj = projects.find((p) => p.id === projectId);
    if (!proj || !proj.versions) return;

    const versionToRestore = proj.versions.find((v) => v.id === versionId);
    if (!versionToRestore) return;

    // Create a safety backup checkpoint of current state before restore
    createVersionCheckpoint(projectId, `Pre-restore auto snapshot before restoring ${versionToRestore.versionNumber}`);

    updateProject(projectId, {
      data: JSON.parse(JSON.stringify(versionToRestore.dataSnapshot)),
      updatedAt: new Date().toISOString(),
    });

    logActivity("project_updated", "Version Restored", `Restored version ${versionToRestore.versionNumber} on "${proj.title}"`, proj.id, proj.toolId);
    addNotification("Version Restored", `Restored "${proj.title}" to ${versionToRestore.versionNumber}`, "success", "system");
  };

  const duplicateVersionAsProject = (projectId: string, versionId: string): StudioProject | null => {
    const proj = projects.find((p) => p.id === projectId);
    if (!proj || !proj.versions) return null;

    const versionToClone = proj.versions.find((v) => v.id === versionId);
    if (!versionToClone) return null;

    return createProject(
      `${proj.title} (${versionToClone.versionNumber})`,
      proj.toolId,
      versionToClone.dataSnapshot,
      proj.folderId,
      `Cloned from version ${versionToClone.versionNumber} of ${proj.title}`
    );
  };

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

  const duplicateBrandKit = (id: string): BrandKitProfile | null => {
    const target = brandKits.find((b) => b.id === id) || activeBrandKit;
    if (!target) return null;

    const cloned: BrandKitProfile = {
      ...JSON.parse(JSON.stringify(target)),
      id: `brand-${Date.now()}`,
      brandName: `${target.brandName} (Copy)`,
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setBrandKits((prev) => [cloned, ...prev]);
    setActiveBrandId(cloned.id);
    addNotification("Brand Kit Duplicated", `Cloned "${target.brandName}" as "${cloned.brandName}"`, "success", "system");
    return cloned;
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

  // PROJECT ACTIONS
  const createProject = (
    title: string,
    toolId: StudioToolId,
    initialData?: any,
    folderId?: string,
    description = ""
  ): StudioProject => {
    const matchingFolder = folders.find((f) => f.id === folderId);
    const folderName = matchingFolder ? matchingFolder.name : "General";

    const initialVersion: ProjectVersion = {
      id: `v-${Date.now()}`,
      versionNumber: "1.0.0",
      timestamp: new Date().toISOString(),
      note: "Project Creation Snapshot",
      isCheckpoint: true,
      author: "You",
      dataSnapshot: initialData || DEFAULT_DESIGN_STATE,
    };

    const newProj: StudioProject = {
      id: `proj-${Date.now()}`,
      title: title.trim() || "Untitled Studio Project",
      description,
      toolId,
      width: initialData?.width || 1200,
      height: initialData?.height || 1200,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "draft",
      favorite: false,
      isPinned: false,
      isDeleted: false,
      tags: [toolId.split("-")[0], "new"],
      platform: "Universal",
      fileSize: "1.2 MB",
      folder: folderName,
      folderId,
      category: "Studio",
      owner: "You",
      version: "1.0.0",
      brandKitId: activeBrandId,
      versions: [initialVersion],
      exportHistory: [],
      linkedAssets: [],
      data: initialData || DEFAULT_DESIGN_STATE,
    };

    setProjects((prev) => [newProj, ...prev]);
    setCurrentProjectId(newProj.id);
    setActiveToolId(toolId);
    logActivity("project_created", "Project Created", `Created "${newProj.title}"`, newProj.id, toolId);
    addNotification("Project Created", `Started blank workspace for "${newProj.title}"`, "success", "system");
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

  const togglePinProject = (id: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextPinned = !p.isPinned;
          addNotification(
            nextPinned ? "Pinned Project" : "Unpinned Project",
            `${nextPinned ? "Pinned" : "Unpinned"} "${p.title}" on dashboard`,
            "info",
            "system"
          );
          return { ...p, isPinned: nextPinned, updatedAt: new Date().toISOString() };
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

  const moveProject = (id: string, folderNameOrId: string) => {
    const matchingFolder = folders.find((f) => f.id === folderNameOrId || f.name.toLowerCase() === folderNameOrId.toLowerCase());
    const folderName = matchingFolder ? matchingFolder.name : folderNameOrId;
    const folderId = matchingFolder ? matchingFolder.id : undefined;

    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, folder: folderName, folderId, updatedAt: new Date().toISOString() } : p))
    );
    addNotification("Project Moved", `Moved project into "${folderName}"`, "info", "system");
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

  // SOFT DELETE (MOVE TO RECYCLE BIN)
  const deleteProject = (id: string) => {
    const target = projects.find((p) => p.id === id);
    if (!target) return;

    setProjects((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, isDeleted: true, deletedAt: new Date().toISOString() }
          : p
      )
    );

    if (currentProjectId === id) setCurrentProjectId(null);

    logActivity("project_updated", "Project Soft-Deleted", `Moved "${target.title}" to Recycle Bin`, target.id, target.toolId);
    addNotification("Moved to Recycle Bin", `"${target.title}" can be restored from Recycle Bin`, "info", "system");
  };

  // RESTORE FROM RECYCLE BIN
  const restoreProjectFromTrash = (id: string) => {
    const target = projects.find((p) => p.id === id);
    if (!target) return;

    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isDeleted: false, deletedAt: undefined } : p))
    );

    addNotification("Project Restored", `Restored "${target.title}" from Recycle Bin`, "success", "system");
  };

  // PERMANENT DELETE
  const permanentlyDeleteProject = (id: string) => {
    const target = projects.find((p) => p.id === id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (currentProjectId === id) setCurrentProjectId(null);
    if (target) {
      addNotification("Permanent Delete", `Permanently removed "${target.title}"`, "info", "system");
    }
  };

  const emptyRecycleBin = () => {
    const deletedCount = projects.filter((p) => p.isDeleted).length;
    setProjects((prev) => prev.filter((p) => !p.isDeleted));
    addNotification("Recycle Bin Emptied", `Permanently deleted ${deletedCount} project(s)`, "info", "system");
  };

  const exportProject = (id: string, format = "PNG") => {
    const proj = projects.find((p) => p.id === id);
    if (!proj) return;

    const newRecord: ExportRecord = {
      id: `exp-${Date.now()}`,
      format,
      timestamp: new Date().toISOString(),
      sizeStr: proj.fileSize || "2.4 MB",
      resolution: `${proj.width}x${proj.height}`,
    };

    updateProject(id, {
      status: "exported",
      exportHistory: [newRecord, ...(proj.exportHistory || [])],
    });

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

  // PACKAGE IMPORT / EXPORT (ZIP & JSON)
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
    addNotification("Project JSON Exported", `Saved "${proj.title}" JSON project file`, "success", "exports");
  };

  const exportProjectZIP = async (id: string) => {
    const proj = projects.find((p) => p.id === id);
    if (!proj) return;

    try {
      const zip = new JSZip();
      
      // Project Manifest
      zip.file("project.json", JSON.stringify(proj, null, 2));
      zip.file("layers_data.json", JSON.stringify(proj.data || {}, null, 2));
      zip.file("version_history.json", JSON.stringify(proj.versions || [], null, 2));
      zip.file("linked_assets.json", JSON.stringify(proj.linkedAssets || [], null, 2));
      zip.file("brand_kit.json", JSON.stringify(activeBrandKit, null, 2));

      // Readme instructions
      const readmeText = `Studio.Lizzdo.com Project Package\n\nProject: ${proj.title}\nTool: ${proj.toolId}\nOwner: ${proj.owner || "You"}\nCreated: ${proj.createdAt}\nLast Modified: ${proj.updatedAt}\n\nThis ZIP package contains complete vector elements, version history, brandkit metadata, and export history ready to re-import into Studio.Lizzdo.com.`;
      zip.file("README.txt", readmeText);

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const dlUrl = URL.createObjectURL(zipBlob);
      const dl = document.createElement("a");
      dl.setAttribute("href", dlUrl);
      dl.setAttribute("download", `${proj.title.toLowerCase().replace(/\s+/g, "_")}_package.lizzdo.zip`);
      document.body.appendChild(dl);
      dl.click();
      dl.remove();
      URL.revokeObjectURL(dlUrl);

      addNotification("ZIP Package Exported", `Downloaded complete project archive for "${proj.title}"`, "success", "exports");
    } catch (e) {
      addNotification("ZIP Export Error", "Failed to compile ZIP archive.", "error", "errors");
    }
  };

  const exportFullStudioBackupZIP = async () => {
    try {
      const zip = new JSZip();
      
      const backupManifest = {
        app: "Studio.Lizzdo.com",
        version: "5.0.0",
        exportedAt: new Date().toISOString(),
        totalProjects: projects.length,
        totalFolders: folders.length,
        totalBrandKits: brandKits.length,
      };

      zip.file("manifest.json", JSON.stringify(backupManifest, null, 2));
      zip.file("projects.json", JSON.stringify(projects, null, 2));
      zip.file("folders.json", JSON.stringify(folders, null, 2));
      zip.file("brandkits.json", JSON.stringify(brandKits, null, 2));
      zip.file("assets.json", JSON.stringify(sharedAssets, null, 2));

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const dlUrl = URL.createObjectURL(zipBlob);
      const dl = document.createElement("a");
      dl.setAttribute("href", dlUrl);
      dl.setAttribute("download", `lizzdo_studio_full_backup_${Date.now()}.zip`);
      document.body.appendChild(dl);
      dl.click();
      dl.remove();
      URL.revokeObjectURL(dlUrl);

      addNotification("Full Studio Backup Exported", "Master ZIP archive created successfully.", "success", "exports");
    } catch (e) {
      addNotification("Backup Error", "Failed to generate master backup ZIP.", "error", "errors");
    }
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
          isDeleted: false,
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

  const importProjectPackageZIP = async (file: File): Promise<StudioProject | null> => {
    try {
      if (file.name.endsWith(".json")) {
        const text = await file.text();
        return importProjectJSON(text);
      }

      const zip = await JSZip.loadAsync(file);
      const projFile = zip.file("project.json");

      if (projFile) {
        const projText = await projFile.async("string");
        const parsed = JSON.parse(projText);

        const imported: StudioProject = {
          ...parsed,
          id: `proj-zip-${Date.now()}`,
          title: parsed.title ? `${parsed.title} (Imported)` : "Imported Package",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isDeleted: false,
        };

        setProjects((prev) => [imported, ...prev]);
        setCurrentProjectId(imported.id);
        setActiveToolId(imported.toolId);
        addNotification("Package Imported", `Extracted and loaded "${imported.title}" ZIP archive`, "success", "system");
        return imported;
      } else {
        addNotification("Invalid ZIP Package", "No project.json manifest found in ZIP file.", "error", "errors");
      }
    } catch (e) {
      addNotification("Package Import Error", "Failed to read ZIP archive package.", "error", "errors");
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
      isDeleted: false,
      versions: target.versions ? [...target.versions] : [],
    };

    setProjects((prev) => [duplicated, ...prev]);
    logActivity("project_created", "Project Duplicated", `Cloned "${target.title}"`, duplicated.id, duplicated.toolId);
    addNotification("Project Duplicated", `Created copy "${duplicated.title}"`, "success", "system");
  };

  // ASSET RELINKING & COMPRESSION
  const relinkProjectAsset = (projectId: string, assetId: string, newUrl: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const updatedLinks = (p.linkedAssets || []).map((link) =>
            link.id === assetId ? { ...link, url: newUrl, isMissing: false } : link
          );
          return { ...p, linkedAssets: updatedLinks, updatedAt: new Date().toISOString() };
        }
        return p;
      })
    );
    addNotification("Asset Relinked", "Updated project asset source path.", "success", "system");
  };

  const compressProjectAssets = (projectId: string) => {
    const proj = projects.find((p) => p.id === projectId);
    if (!proj) return;

    // Simulate asset vector optimization & size reduction
    updateProject(projectId, {
      fileSize: "1.1 MB (Compressed 45%)",
    });

    addNotification("Storage Optimized", `Compressed assets for "${proj.title}" (saved ~1.3 MB)`, "success", "system");
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
        restoreProjectFromTrash,
        permanentlyDeleteProject,
        emptyRecycleBin,
        toggleFavoriteProject,
        togglePinProject,
        renameProject,
        updateProjectStatus,
        moveProject,
        archiveProject,
        exportProject,
        shareProject,

        // Folder & Workspace Management
        folders,
        createFolder,
        updateFolder,
        deleteFolder,
        toggleFavoriteFolder,
        duplicateFolder,
        moveFolder,

        // Version Control
        createVersionCheckpoint,
        restoreVersion,
        duplicateVersionAsProject,

        // Auto Save & Recovery
        lastAutoSaveTime,
        recoveryDrafts,
        triggerManualAutoSave,
        restoreRecoveryDraft,
        discardRecoveryDraft,

        // Package Import/Export
        exportProjectJSON,
        importProjectJSON,
        exportProjectZIP,
        exportFullStudioBackupZIP,
        importProjectPackageZIP,

        // Asset Relinking & Compression
        relinkProjectAsset,
        compressProjectAssets,

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
        duplicateBrandKit,
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

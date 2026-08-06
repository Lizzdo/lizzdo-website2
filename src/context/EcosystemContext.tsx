import React, { createContext, useContext, useState, useEffect } from "react";
import {
  ExtendedTemplateMeta,
  MARKETPLACE_TEMPLATES,
} from "../data/templateMarketplaceData";
import {
  ExtendedAssetMeta,
  INITIAL_MARKETPLACE_ASSETS,
  AssetType,
} from "../data/assetLibraryData";
import { DesignState } from "../types/designer";

export interface FolderItem {
  path: string;
  name: string;
  color?: string;
  favorite?: boolean;
  archived?: boolean;
}

export interface AssetCollection {
  id: string;
  name: string;
  description: string;
  folders: string[];
  templateIds: string[];
  assetIds: string[];
  createdAt: string;
  updatedAt: string;
}

interface EcosystemContextType {
  // Templates State
  templates: ExtendedTemplateMeta[];
  favoriteTemplateIds: string[];
  toggleFavoriteTemplate: (id: string) => void;
  saveCustomTemplate: (
    name: string,
    category: any,
    designState: DesignState,
    tags?: string[],
    style?: any
  ) => ExtendedTemplateMeta;

  // Assets State
  assets: ExtendedAssetMeta[];
  favoriteAssetIds: string[];
  toggleFavoriteAsset: (id: string) => void;
  uploadAssetFile: (file: File, category?: string, folderPath?: string) => Promise<ExtendedAssetMeta>;
  duplicateAsset: (assetId: string) => void;
  renameAsset: (assetId: string, newName: string) => void;
  deleteAsset: (assetId: string) => void;
  replaceAssetFile: (assetId: string, file: File) => Promise<void>;
  optimizeAsset: (assetId: string) => void;

  // Folder Management
  folders: FolderItem[];
  currentFolder: string;
  setCurrentFolder: (path: string) => void;
  createFolder: (path: string, color?: string) => void;
  renameFolder: (oldPath: string, newPath: string) => void;
  deleteFolder: (path: string) => void;
  toggleFavoriteFolder: (path: string) => void;
  setFolderColor: (path: string, color: string) => void;

  // Bulk Operations
  selectedAssetIds: string[];
  setSelectedAssetIds: React.Dispatch<React.SetStateAction<string[]>>;
  toggleSelectAsset: (assetId: string) => void;
  selectAllAssets: (filteredAssetIds: string[]) => void;
  clearSelectedAssets: () => void;
  bulkDeleteAssets: () => void;
  bulkTagAssets: (tags: string[]) => void;
  bulkMoveToCollection: (collectionId: string) => void;
  bulkMoveToFolder: (folderPath: string) => void;
  bulkRenameAssets: (prefix: string, suffix?: string) => void;
  bulkOptimizeAssets: () => void;

  // Collections
  collections: AssetCollection[];
  createCollection: (name: string, description?: string) => AssetCollection;
  deleteCollection: (id: string) => void;
  addAssetToCollection: (assetId: string, collectionId: string) => void;
  removeAssetFromCollection: (assetId: string, collectionId: string) => void;
  createFolderInCollection: (collectionId: string, folderName: string) => void;

  // Active Filters & Smart Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedStyle: string;
  setSelectedStyle: (style: string) => void;
  selectedOrientation: string;
  setSelectedOrientation: (orientation: string) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  selectedTagPills: string[];
  toggleTagPill: (tag: string) => void;
  sortOrder: string;
  setSortOrder: (sort: string) => void;
  showFavoritesOnly: boolean;
  setShowFavoritesOnly: (show: boolean) => void;
  resetAllFilters: () => void;
}

const STORAGE_KEYS = {
  TEMPLATES: "lizzdo_studio_custom_templates_v1",
  FAV_TEMPLATES: "lizzdo_studio_fav_templates_v1",
  ASSETS: "lizzdo_studio_custom_assets_v1",
  FAV_ASSETS: "lizzdo_studio_fav_assets_v1",
  COLLECTIONS: "lizzdo_studio_collections_v1",
  FOLDERS: "lizzdo_studio_folders_v1",
};

const DEFAULT_COLLECTIONS: AssetCollection[] = [
  {
    id: "col-1",
    name: "Cyberpunk Campaign 2026",
    description: "Assets and banner presets for the neon launch launch kit",
    folders: ["/Backgrounds", "/Icons", "/Banners"],
    templateIds: ["tmpl-portfolio-1", "tmpl-social-1", "tmpl-gaming-1"],
    assetIds: ["asset-img-1", "asset-icon-1", "asset-grad-1"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "col-2",
    name: "SaaS Enterprise Rebrand",
    description: "Corporate dark theme UI elements, typography, and slides",
    folders: ["/Logos", "/Slides", "/Wireframes"],
    templateIds: ["tmpl-landing-1", "tmpl-pres-1", "tmpl-case-1"],
    assetIds: ["asset-wire-1", "asset-ui-1", "asset-font-1"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const EcosystemContext = createContext<EcosystemContextType | undefined>(undefined);

export const EcosystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Templates state
  const [templates, setTemplates] = useState<ExtendedTemplateMeta[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
      if (saved) {
        const custom = JSON.parse(saved);
        return [...MARKETPLACE_TEMPLATES, ...custom];
      }
    } catch (e) {
      console.warn("Failed to load custom templates:", e);
    }
    return MARKETPLACE_TEMPLATES;
  });

  const [favoriteTemplateIds, setFavoriteTemplateIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAV_TEMPLATES);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return ["tmpl-portfolio-1", "tmpl-social-1", "tmpl-landing-1"];
  });

  // Assets state
  const [assets, setAssets] = useState<ExtendedAssetMeta[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ASSETS);
      if (saved) {
        const custom = JSON.parse(saved);
        return [...INITIAL_MARKETPLACE_ASSETS, ...custom];
      }
    } catch (e) {
      console.warn("Failed to load custom assets:", e);
    }
    return INITIAL_MARKETPLACE_ASSETS;
  });

  const [favoriteAssetIds, setFavoriteAssetIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAV_ASSETS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return ["asset-img-1", "asset-icon-1", "asset-grad-1"];
  });

  // Collections state
  const [collections, setCollections] = useState<AssetCollection[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COLLECTIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_COLLECTIONS;
  });

  // Folders state
  const [folders, setFolders] = useState<FolderItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FOLDERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      { path: "/Backgrounds", name: "Backgrounds", color: "#00f5ff" },
      { path: "/Icons", name: "Icons", color: "#a855f7" },
      { path: "/Logos", name: "Logos", color: "#f59e0b" },
      { path: "/Brand Assets", name: "Brand Assets", color: "#f43f5e" },
      { path: "/Videos", name: "Videos", color: "#3b82f6" },
      { path: "/Audio", name: "Audio", color: "#10b981" },
      { path: "/Templates", name: "Templates", color: "#ec4899" },
      { path: "/Mockups", name: "Mockups", color: "#8b5cf6" },
      { path: "/Portfolio Images", name: "Portfolio Images", color: "#06b6d4" },
      { path: "/Store Images", name: "Store Images", color: "#eab308" },
    ];
  });

  const [currentFolder, setCurrentFolder] = useState<string>("All");

  // Selection state
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStyle, setSelectedStyle] = useState("All Styles");
  const [selectedOrientation, setSelectedOrientation] = useState("All Orientations");
  const [selectedColor, setSelectedColor] = useState("All Colors");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedTagPills, setSelectedTagPills] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<string>("newest");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAV_TEMPLATES, JSON.stringify(favoriteTemplateIds));
  }, [favoriteTemplateIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAV_ASSETS, JSON.stringify(favoriteAssetIds));
  }, [favoriteAssetIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(collections));
  }, [collections]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(folders));
  }, [folders]);

  // FAVORITES HANDLERS
  const toggleFavoriteTemplate = (id: string) => {
    setFavoriteTemplateIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleFavoriteAsset = (id: string) => {
    setFavoriteAssetIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // FOLDER HANDLERS
  const createFolder = (path: string, color = "#00f5ff") => {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    const name = cleanPath.split("/").pop() || "Folder";
    if (!folders.some((f) => f.path === cleanPath)) {
      setFolders((prev) => [...prev, { path: cleanPath, name, color }]);
    }
  };

  const renameFolder = (oldPath: string, newPath: string) => {
    const cleanNew = newPath.startsWith("/") ? newPath : `/${newPath}`;
    const newName = cleanNew.split("/").pop() || "Folder";
    setFolders((prev) =>
      prev.map((f) => (f.path === oldPath ? { ...f, path: cleanNew, name: newName } : f))
    );
    setAssets((prev) =>
      prev.map((a) => (a.folderPath === oldPath ? { ...a, folderPath: cleanNew } : a))
    );
  };

  const deleteFolder = (path: string) => {
    setFolders((prev) => prev.filter((f) => f.path !== path));
    setAssets((prev) =>
      prev.map((a) => (a.folderPath === path ? { ...a, folderPath: "/Root" } : a))
    );
    if (currentFolder === path) {
      setCurrentFolder("All");
    }
  };

  const toggleFavoriteFolder = (path: string) => {
    setFolders((prev) =>
      prev.map((f) => (f.path === path ? { ...f, favorite: !f.favorite } : f))
    );
  };

  const setFolderColor = (path: string, color: string) => {
    setFolders((prev) => prev.map((f) => (f.path === path ? { ...f, color } : f)));
  };

  // ASSET FILE UPLOAD & REPLACEMENT HANDLERS
  const uploadAssetFile = async (
    file: File,
    category = "User Uploads",
    folderPath = "/Uploads"
  ): Promise<ExtendedAssetMeta> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        let assetType: AssetType = "Images";

        if (file.type.includes("svg")) assetType = "SVG Icons";
        else if (file.type.includes("video")) assetType = "Videos";
        else if (file.type.includes("audio")) assetType = "Audio";
        else if (file.type.includes("pdf")) assetType = "PDF & Documents";
        else if (file.type.includes("json")) assetType = "Lottie & Motion";
        else if (file.name.endsWith(".psd") || file.name.endsWith(".ai")) assetType = "PSD & Design Files";
        else if (file.name.endsWith(".ttf") || file.name.endsWith(".woff") || file.name.endsWith(".otf")) assetType = "Fonts";

        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);

        const newAsset: ExtendedAssetMeta = {
          id: `asset-user-${Date.now()}`,
          name: file.name.replace(/\.[^/.]+$/, ""),
          type: assetType,
          category,
          tags: ["user", "upload", file.type.split("/")[1] || "media"],
          url: dataUrl,
          folderPath,
          sizeStr: `${sizeMB} MB`,
          sizeBytes: file.size,
          dimensions: file.type.startsWith("image") ? "1920x1080" : "N/A",
          createdAt: new Date().toISOString().split("T")[0],
          usageCount: 0,
          colorPalette: ["#00f5ff", "#10b981", "#a855f7"],
          format: file.name.split(".").pop()?.toUpperCase() || "BIN",
          mimeType: file.type,
          optimized: true,
        };

        setAssets((prev) => {
          const next = [newAsset, ...prev];
          const userOnly = next.filter((a) => a.id.startsWith("asset-user-"));
          localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(userOnly));
          return next;
        });

        resolve(newAsset);
      };
      reader.readAsDataURL(file);
    });
  };

  const replaceAssetFile = async (assetId: string, file: File): Promise<void> => {
    const updated = await uploadAssetFile(file);
    setAssets((prev) =>
      prev.map((a) =>
        a.id === assetId
          ? {
              ...a,
              url: updated.url,
              sizeStr: updated.sizeStr,
              sizeBytes: updated.sizeBytes,
              format: updated.format,
              mimeType: updated.mimeType,
            }
          : a
      )
    );
  };

  const optimizeAsset = (assetId: string) => {
    setAssets((prev) =>
      prev.map((a) =>
        a.id === assetId
          ? {
              ...a,
              optimized: true,
              originalSizeStr: a.originalSizeStr || a.sizeStr,
              sizeStr: `${((a.sizeBytes || 1000000) * 0.65 / 1048576).toFixed(2)} MB`,
            }
          : a
      )
    );
  };

  const duplicateAsset = (assetId: string) => {
    const target = assets.find((a) => a.id === assetId);
    if (!target) return;
    const dup: ExtendedAssetMeta = {
      ...target,
      id: `asset-user-${Date.now()}`,
      name: `${target.name} (Copy)`,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setAssets((prev) => [dup, ...prev]);
  };

  const renameAsset = (assetId: string, newName: string) => {
    setAssets((prev) =>
      prev.map((a) => (a.id === assetId ? { ...a, name: newName } : a))
    );
  };

  const deleteAsset = (assetId: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== assetId));
    setSelectedAssetIds((prev) => prev.filter((id) => id !== assetId));
  };

  // BULK OPERATIONS
  const toggleSelectAsset = (assetId: string) => {
    setSelectedAssetIds((prev) =>
      prev.includes(assetId) ? prev.filter((id) => id !== assetId) : [...prev, assetId]
    );
  };

  const selectAllAssets = (filteredAssetIds: string[]) => {
    setSelectedAssetIds(filteredAssetIds);
  };

  const clearSelectedAssets = () => {
    setSelectedAssetIds([]);
  };

  const bulkDeleteAssets = () => {
    setAssets((prev) => prev.filter((a) => !selectedAssetIds.includes(a.id)));
    clearSelectedAssets();
  };

  const bulkTagAssets = (newTags: string[]) => {
    setAssets((prev) =>
      prev.map((a) =>
        selectedAssetIds.includes(a.id)
          ? { ...a, tags: Array.from(new Set([...a.tags, ...newTags])) }
          : a
      )
    );
  };

  const bulkMoveToFolder = (folderPath: string) => {
    setAssets((prev) =>
      prev.map((a) => (selectedAssetIds.includes(a.id) ? { ...a, folderPath } : a))
    );
    clearSelectedAssets();
  };

  const bulkRenameAssets = (prefix: string, suffix = "") => {
    setAssets((prev) =>
      prev.map((a, idx) =>
        selectedAssetIds.includes(a.id)
          ? { ...a, name: `${prefix}_${idx + 1}${suffix ? `_${suffix}` : ""}` }
          : a
      )
    );
  };

  const bulkOptimizeAssets = () => {
    setAssets((prev) =>
      prev.map((a) =>
        selectedAssetIds.includes(a.id)
          ? {
              ...a,
              optimized: true,
              sizeStr: `${((a.sizeBytes || 1000000) * 0.65 / 1048576).toFixed(2)} MB`,
            }
          : a
      )
    );
    clearSelectedAssets();
  };

  const bulkMoveToCollection = (collectionId: string) => {
    setCollections((prev) =>
      prev.map((col) =>
        col.id === collectionId
          ? {
              ...col,
              assetIds: Array.from(new Set([...col.assetIds, ...selectedAssetIds])),
            }
          : col
      )
    );
    clearSelectedAssets();
  };

  // COLLECTIONS HANDLERS
  const createCollection = (name: string, description = ""): AssetCollection => {
    const newCol: AssetCollection = {
      id: `col-${Date.now()}`,
      name,
      description,
      folders: ["/Default"],
      templateIds: [],
      assetIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCollections((prev) => [newCol, ...prev]);
    return newCol;
  };

  const deleteCollection = (id: string) => {
    setCollections((prev) => prev.filter((col) => col.id !== id));
  };

  const addAssetToCollection = (assetId: string, collectionId: string) => {
    setCollections((prev) =>
      prev.map((col) =>
        col.id === collectionId
          ? { ...col, assetIds: Array.from(new Set([...col.assetIds, assetId])) }
          : col
      )
    );
  };

  const removeAssetFromCollection = (assetId: string, collectionId: string) => {
    setCollections((prev) =>
      prev.map((col) =>
        col.id === collectionId
          ? { ...col, assetIds: col.assetIds.filter((id) => id !== assetId) }
          : col
      )
    );
  };

  const createFolderInCollection = (collectionId: string, folderName: string) => {
    const path = folderName.startsWith("/") ? folderName : `/${folderName}`;
    setCollections((prev) =>
      prev.map((col) =>
        col.id === collectionId
          ? { ...col, folders: Array.from(new Set([...col.folders, path])) }
          : col
      )
    );
  };

  const toggleTagPill = (tag: string) => {
    setSelectedTagPills((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const resetAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedStyle("All Styles");
    setSelectedOrientation("All Orientations");
    setSelectedColor("All Colors");
    setSelectedType("All");
    setSelectedTagPills([]);
    setCurrentFolder("All");
    setSortOrder("newest");
    setShowFavoritesOnly(false);
  };

  return (
    <EcosystemContext.Provider
      value={{
        templates,
        favoriteTemplateIds,
        toggleFavoriteTemplate,
        saveCustomTemplate,
        assets,
        favoriteAssetIds,
        toggleFavoriteAsset,
        uploadAssetFile,
        replaceAssetFile,
        optimizeAsset,
        duplicateAsset,
        renameAsset,
        deleteAsset,
        folders,
        currentFolder,
        setCurrentFolder,
        createFolder,
        renameFolder,
        deleteFolder,
        toggleFavoriteFolder,
        setFolderColor,
        selectedAssetIds,
        setSelectedAssetIds,
        toggleSelectAsset,
        selectAllAssets,
        clearSelectedAssets,
        bulkDeleteAssets,
        bulkTagAssets,
        bulkMoveToCollection,
        bulkMoveToFolder,
        bulkRenameAssets,
        bulkOptimizeAssets,
        collections,
        createCollection,
        deleteCollection,
        addAssetToCollection,
        removeAssetFromCollection,
        createFolderInCollection,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedStyle,
        setSelectedStyle,
        selectedOrientation,
        setSelectedOrientation,
        selectedColor,
        setSelectedColor,
        selectedType,
        setSelectedType,
        selectedTagPills,
        toggleTagPill,
        sortOrder,
        setSortOrder,
        showFavoritesOnly,
        setShowFavoritesOnly,
        resetAllFilters,
      }}
    >
      {children}
    </EcosystemContext.Provider>
  );
};

export const useEcosystem = () => {
  const context = useContext(EcosystemContext);
  if (!context) {
    throw new Error("useEcosystem must be used within an EcosystemProvider");
  }
  return context;
};


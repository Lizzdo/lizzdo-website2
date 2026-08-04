import React, { createContext, useContext, useState, useEffect } from "react";
import { StudioToolId, StudioProject, SharedAsset, BrandKitData } from "../types/studio";
import { DEFAULT_DESIGN_STATE } from "../data/designerTemplates";

interface StudioContextType {
  activeToolId: StudioToolId;
  setActiveToolId: (toolId: StudioToolId) => void;
  projects: StudioProject[];
  currentProjectId: string | null;
  setCurrentProjectId: (id: string | null) => void;
  createProject: (title: string, toolId: StudioToolId, initialData?: any) => StudioProject;
  openProject: (projectId: string) => void;
  updateProject: (id: string, updatedData: Partial<StudioProject>) => void;
  duplicateProject: (id: string) => void;
  deleteProject: (id: string) => void;
  sharedAssets: SharedAsset[];
  uploadSharedAsset: (file: File) => Promise<SharedAsset>;
  brandKit: BrandKitData;
  updateBrandKit: (updated: Partial<BrandKitData>) => void;
}

const DEFAULT_BRAND_KIT: BrandKitData = {
  brandName: "LIZZDO Creative",
  tagline: "Empowering Next-Gen Digital Creators",
  primaryColor: "#00f5ff",
  secondaryColor: "#a855f7",
  accentColors: ["#f43f5e", "#f59e0b", "#10b981"],
  neutralColors: ["#0a0e27", "#12183a", "#ffffff"],
  headingFont: "Orbitron",
  bodyFont: "Rajdhani",
  logoVariants: [
    { id: "logo-cyan", name: "Cyan Cyber Logo", url: "/lizzdo-logo.png" },
    { id: "logo-white", name: "Monochrome White Logo", url: "/lizzdo-logo.png" },
  ],
};

const INITIAL_PROJECTS: StudioProject[] = [
  {
    id: "proj-1",
    title: "Cyberpunk Instagram Reel Cover",
    toolId: "social-designer",
    width: 1080,
    height: 1920,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
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
    title: "AI Character Portrait render #04",
    toolId: "ai-generator",
    width: 1024,
    height: 1024,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
    data: {
      prompt: "Cyberpunk glowing neon hacker girl, ultra realistic 8k render, octane render",
      style: "Cyberpunk",
      aspectRatio: "1:1",
    },
  },
  {
    id: "proj-5",
    title: "Store Hero Banner - Summer Sale",
    toolId: "store-designer",
    width: 1920,
    height: 1080,
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    data: DEFAULT_DESIGN_STATE,
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
  {
    id: "asset-3",
    name: "Futuristic Abstract Sphere",
    type: "image",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    category: "Illustrations",
    tags: ["3d", "sphere", "gradient", "purple"],
    sizeStr: "2.1 MB",
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

  const [brandKit, setBrandKit] = useState<BrandKitData>(() => {
    try {
      const saved = localStorage.getItem("lizzdo_studio_brandkit");
      return saved ? JSON.parse(saved) : DEFAULT_BRAND_KIT;
    } catch {
      return DEFAULT_BRAND_KIT;
    }
  });

  // Save projects to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("lizzdo_studio_projects", JSON.stringify(projects));
    } catch (e) {
      console.warn("Could not save projects to localStorage", e);
    }
  }, [projects]);

  // Save assets to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("lizzdo_studio_assets", JSON.stringify(sharedAssets));
    } catch (e) {
      console.warn("Could not save assets to localStorage", e);
    }
  }, [sharedAssets]);

  // Save BrandKit to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("lizzdo_studio_brandkit", JSON.stringify(brandKit));
    } catch (e) {
      console.warn("Could not save brandkit to localStorage", e);
    }
  }, [brandKit]);

  const createProject = (title: string, toolId: StudioToolId, initialData?: any): StudioProject => {
    const newProj: StudioProject = {
      id: `proj-${Date.now()}`,
      title,
      toolId,
      width: initialData?.width || 1200,
      height: initialData?.height || 1200,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      data: initialData || DEFAULT_DESIGN_STATE,
    };
    setProjects((prev) => [newProj, ...prev]);
    setCurrentProjectId(newProj.id);
    setActiveToolId(toolId);
    return newProj;
  };

  const openProject = (projectId: string) => {
    const proj = projects.find((p) => p.id === projectId);
    if (proj) {
      setCurrentProjectId(proj.id);
      setActiveToolId(proj.toolId);
    }
  };

  const updateProject = (id: string, updatedData: Partial<StudioProject>) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, ...updatedData, updatedAt: new Date().toISOString() } : p
      )
    );
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
    };
    setProjects((prev) => [duplicated, ...prev]);
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (currentProjectId === id) setCurrentProjectId(null);
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
        resolve(newAsset);
      };
      reader.readAsDataURL(file);
    });
  };

  const updateBrandKit = (updated: Partial<BrandKitData>) => {
    setBrandKit((prev) => ({ ...prev, ...updated }));
  };

  return (
    <StudioContext.Provider
      value={{
        activeToolId,
        setActiveToolId,
        projects,
        currentProjectId,
        setCurrentProjectId,
        createProject,
        openProject,
        updateProject,
        duplicateProject,
        deleteProject,
        sharedAssets,
        uploadSharedAsset,
        brandKit,
        updateBrandKit,
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

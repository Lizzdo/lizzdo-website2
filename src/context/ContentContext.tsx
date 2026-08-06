import React, { createContext, useContext, useState, useEffect } from "react";
import { getCollection, sortByOrder } from "../lib/content";

export interface PortfolioItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnail: string;
  gallery: string[];
  categories: string[];
  body: string;
  published: boolean;
  featured?: boolean;
  client?: string;
  date?: string;
  software?: string[];
  tags?: string[];
  order?: number;
}

export interface BlogPostItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnail: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
  body: string;
  published: boolean;
  tags?: string[];
  order?: number;
}

export interface StoreProductItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  sale_price?: number;
  video?: string;
  thumbnail: string;
  gallery?: string[];
  category: string[];
  body: string;
  published: boolean;
  downloadUrl?: string;
  salesCount?: number;
  rating?: number;
  order?: number;
}

interface ContentContextType {
  // Portfolio
  portfolioItems: PortfolioItem[];
  addPortfolioItem: (item: Omit<PortfolioItem, "id">) => PortfolioItem;
  updatePortfolioItem: (id: string, updates: Partial<PortfolioItem>) => void;
  deletePortfolioItem: (id: string) => void;
  togglePublishPortfolio: (id: string) => void;
  toggleFeaturedPortfolio: (id: string) => void;
  resetPortfolioItems: () => void;
  exportPortfolioJSON: (id: string) => void;

  // Blog
  blogPosts: BlogPostItem[];
  addBlogPost: (post: Omit<BlogPostItem, "id">) => BlogPostItem;
  updateBlogPost: (id: string, updates: Partial<BlogPostItem>) => void;
  deleteBlogPost: (id: string) => void;
  togglePublishBlog: (id: string) => void;
  resetBlogPosts: () => void;
  exportBlogJSON: (id: string) => void;

  // Store
  storeProducts: StoreProductItem[];
  addStoreProduct: (product: Omit<StoreProductItem, "id">) => StoreProductItem;
  updateStoreProduct: (id: string, updates: Partial<StoreProductItem>) => void;
  deleteStoreProduct: (id: string) => void;
  togglePublishStoreProduct: (id: string) => void;
  resetStoreProducts: () => void;
  exportStoreJSON: (id: string) => void;
}

const STORAGE_KEYS = {
  PORTFOLIO: "lizzdo_portfolio_content_v2",
  BLOG: "lizzdo_blog_content_v2",
  STORE: "lizzdo_store_content_v2",
};

const ContentContext = createContext<ContentContextType | undefined>(undefined);

// Initial default fallback loaders from JSON glob
function loadInitialPortfolio(): PortfolioItem[] {
  try {
    const raw = getCollection(import.meta.glob("../content/portfolio/*.json", { eager: true }));
    return raw.map((file: any) => ({
      id: file.slug || `port-${Date.now()}`,
      slug: file.slug || "untitled-project",
      title: file.title || "Untitled Portfolio Project",
      description: file.description || "",
      thumbnail: file.thumbnail || "/lizzdo-logo.png",
      gallery: Array.isArray(file.gallery) ? file.gallery : [file.thumbnail || "/lizzdo-logo.png"],
      categories: Array.isArray(file.categories) ? file.categories : ["3D MODELING"],
      body: file.body || "",
      published: file.published !== false,
      featured: !!file.featured,
      client: file.client || "",
      date: file.date || new Date().toISOString().split("T")[0],
      software: Array.isArray(file.software) ? file.software : ["Blender", "Unreal Engine"],
      tags: Array.isArray(file.tags) ? file.tags : ["3d", "render"],
      order: file.order || 0,
    }));
  } catch (e) {
    return [
      {
        id: "archviz-penthouse-render",
        slug: "archviz-penthouse-render",
        title: "ARCHVIZ PENTHOUSE RENDER",
        description: "A fully interactive, ray-traced architectural visualization of a futuristic penthouse.",
        thumbnail: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
        gallery: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop"],
        categories: ["UNREAL ENGINE 5", "3D MODELING"],
        body: "### Challenge\nThe real estate firm required a walkthrough of an unbuilt property that looked indistinguishable from a photograph.",
        published: true,
        featured: true,
        client: "Aura Real Estate",
        date: "2026-03-15",
        software: ["Unreal Engine 5", "3ds Max", "V-Ray"],
        tags: ["architecture", "raytracing", "vr"],
        order: 1,
      },
      {
        id: "neon-city-cyberpunk-rig",
        slug: "neon-city-cyberpunk-rig",
        title: "NEON CITY CYBERPUNK RIG",
        description: "Game-ready low-poly cyberpunk character with custom facial rig and 4K PBR material maps.",
        thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop",
        gallery: ["https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop"],
        categories: ["CHARACTER RIGGING", "GAME ASSETS"],
        body: "### Cyberpunk Rigging Specifications\nFull facial blendshapes and IK/FK switching for Unreal Engine 5 & Unity.",
        published: true,
        featured: true,
        client: "CyberStudio Tokyo",
        date: "2026-04-01",
        software: ["Blender", "Substance Painter", "ZBrush"],
        tags: ["cyberpunk", "rigging", "character"],
        order: 2,
      },
    ];
  }
}

function loadInitialBlog(): BlogPostItem[] {
  try {
    const raw = getCollection(import.meta.glob("../content/blog/*.json", { eager: true }));
    return raw.map((file: any) => ({
      id: file.slug || `blog-${Date.now()}`,
      slug: file.slug || "untitled-article",
      title: file.title || "Untitled Blog Post",
      description: file.description || file.excerpt || "",
      thumbnail: file.thumbnail || "/lizzdo-logo.png",
      date: file.date ? new Date(file.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "April 2026",
      author: file.author || "LIZZDO Studio",
      category: Array.isArray(file.category) ? file.category[0] : file.category || "Technology",
      readTime: file.readTime || "5 min read",
      body: file.body || "",
      published: file.published !== false,
      tags: Array.isArray(file.tags) ? file.tags : ["3d", "tech"],
      order: file.order || 0,
    }));
  } catch (e) {
    return [
      {
        id: "future-of-3d-modeling-2026",
        slug: "future-of-3d-modeling-2026",
        title: "The Future of 3D Modeling in 2026",
        description: "How AI and real-time rendering are revolutionizing the way we create digital assets.",
        thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
        date: "April 10, 2026",
        author: "Tahir Khan",
        category: "Technology",
        readTime: "6 min read",
        body: "<p>The landscape of 3D modeling is shifting faster than ever. Real-time ray tracing and neural topology are setting new industry standards.</p>",
        published: true,
        order: 1,
      },
    ];
  }
}

function loadInitialStore(): StoreProductItem[] {
  try {
    const raw = getCollection(import.meta.glob("../content/store/*.json", { eager: true }));
    return raw.map((file: any) => ({
      id: file.slug || `store-${Date.now()}`,
      slug: file.slug || "untitled-product",
      title: file.title || "Untitled Store Product",
      description: file.description || "",
      price: typeof file.price === "number" ? file.price : 29.99,
      sale_price: file.sale_price,
      video: file.video || "",
      thumbnail: file.thumbnail || "/lizzdo-logo.png",
      gallery: Array.isArray(file.gallery) ? file.gallery : [file.thumbnail || "/lizzdo-logo.png"],
      category: Array.isArray(file.category) ? file.category : ["3D MODELS"],
      body: file.body || "",
      published: file.published !== false,
      downloadUrl: file.downloadUrl || "/assets/download-sample.zip",
      salesCount: file.salesCount || Math.floor(Math.random() * 80) + 12,
      rating: file.rating || 4.9,
      order: file.order || 0,
    }));
  } catch (e) {
    return [
      {
        id: "sci-fi-modular-corridors",
        slug: "sci-fi-modular-corridors",
        title: "Sci-Fi Modular Corridors Pack",
        description: "A huge pack of 45+ modular sci-fi corridors, airlocks, and interactive props.",
        price: 59.99,
        sale_price: 39.99,
        thumbnail: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1200&auto=format&fit=crop",
        gallery: ["https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1200&auto=format&fit=crop"],
        category: ["3D ASSETS", "UNREAL ENGINE"],
        body: "Modular 3D asset pack designed for high-performance Sci-Fi environments.",
        published: true,
        salesCount: 142,
        rating: 4.95,
        order: 1,
      },
    ];
  }
}

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Portfolio State
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PORTFOLIO);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return loadInitialPortfolio();
  });

  // Blog State
  const [blogPosts, setBlogPosts] = useState<BlogPostItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BLOG);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return loadInitialBlog();
  });

  // Store State
  const [storeProducts, setStoreProducts] = useState<StoreProductItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STORE);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return loadInitialStore();
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PORTFOLIO, JSON.stringify(portfolioItems));
  }, [portfolioItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BLOG, JSON.stringify(blogPosts));
  }, [blogPosts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STORE, JSON.stringify(storeProducts));
  }, [storeProducts]);

  // Portfolio Handlers
  const addPortfolioItem = (item: Omit<PortfolioItem, "id">): PortfolioItem => {
    const newItem: PortfolioItem = {
      ...item,
      id: item.slug || `port-${Date.now()}`,
    };
    setPortfolioItems((prev) => [newItem, ...prev]);
    return newItem;
  };

  const updatePortfolioItem = (id: string, updates: Partial<PortfolioItem>) => {
    setPortfolioItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deletePortfolioItem = (id: string) => {
    setPortfolioItems((prev) => prev.filter((item) => item.id !== id));
  };

  const togglePublishPortfolio = (id: string) => {
    setPortfolioItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, published: !item.published } : item))
    );
  };

  const toggleFeaturedPortfolio = (id: string) => {
    setPortfolioItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, featured: !item.featured } : item))
    );
  };

  const resetPortfolioItems = () => {
    localStorage.removeItem(STORAGE_KEYS.PORTFOLIO);
    setPortfolioItems(loadInitialPortfolio());
  };

  const exportPortfolioJSON = (id: string) => {
    const target = portfolioItems.find((p) => p.id === id);
    if (!target) return;
    const jsonStr = JSON.stringify(target, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${target.slug}.json`;
    link.click();
  };

  // Blog Handlers
  const addBlogPost = (post: Omit<BlogPostItem, "id">): BlogPostItem => {
    const newPost: BlogPostItem = {
      ...post,
      id: post.slug || `blog-${Date.now()}`,
    };
    setBlogPosts((prev) => [newPost, ...prev]);
    return newPost;
  };

  const updateBlogPost = (id: string, updates: Partial<BlogPostItem>) => {
    setBlogPosts((prev) =>
      prev.map((post) => (post.id === id ? { ...post, ...updates } : post))
    );
  };

  const deleteBlogPost = (id: string) => {
    setBlogPosts((prev) => prev.filter((post) => post.id !== id));
  };

  const togglePublishBlog = (id: string) => {
    setBlogPosts((prev) =>
      prev.map((post) => (post.id === id ? { ...post, published: !post.published } : post))
    );
  };

  const resetBlogPosts = () => {
    localStorage.removeItem(STORAGE_KEYS.BLOG);
    setBlogPosts(loadInitialBlog());
  };

  const exportBlogJSON = (id: string) => {
    const target = blogPosts.find((b) => b.id === id);
    if (!target) return;
    const jsonStr = JSON.stringify(target, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${target.slug}.json`;
    link.click();
  };

  // Store Handlers
  const addStoreProduct = (product: Omit<StoreProductItem, "id">): StoreProductItem => {
    const newProduct: StoreProductItem = {
      ...product,
      id: product.slug || `store-${Date.now()}`,
    };
    setStoreProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateStoreProduct = (id: string, updates: Partial<StoreProductItem>) => {
    setStoreProducts((prev) =>
      prev.map((prod) => (prod.id === id ? { ...prod, ...updates } : prod))
    );
  };

  const deleteStoreProduct = (id: string) => {
    setStoreProducts((prev) => prev.filter((prod) => prod.id !== id));
  };

  const togglePublishStoreProduct = (id: string) => {
    setStoreProducts((prev) =>
      prev.map((prod) => (prod.id === id ? { ...prod, published: !prod.published } : prod))
    );
  };

  const resetStoreProducts = () => {
    localStorage.removeItem(STORAGE_KEYS.STORE);
    setStoreProducts(loadInitialStore());
  };

  const exportStoreJSON = (id: string) => {
    const target = storeProducts.find((s) => s.id === id);
    if (!target) return;
    const jsonStr = JSON.stringify(target, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${target.slug}.json`;
    link.click();
  };

  return (
    <ContentContext.Provider
      value={{
        portfolioItems,
        addPortfolioItem,
        updatePortfolioItem,
        deletePortfolioItem,
        togglePublishPortfolio,
        toggleFeaturedPortfolio,
        resetPortfolioItems,
        exportPortfolioJSON,

        blogPosts,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        togglePublishBlog,
        resetBlogPosts,
        exportBlogJSON,

        storeProducts,
        addStoreProduct,
        updateStoreProduct,
        deleteStoreProduct,
        togglePublishStoreProduct,
        resetStoreProducts,
        exportStoreJSON,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useContent must be used within a ContentProvider");
  }
  return context;
};

import React, { useState } from "react";
import { useContent, PortfolioItem } from "../../../context/ContentContext";
import { useStudio } from "../../../context/StudioContext";
import {
  FolderGit2,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  Star,
  Download,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  X,
  Palette,
  Image,
  Globe,
  Github,
  Video,
  AlertTriangle,
  LayoutGrid,
} from "lucide-react";

export function PortfolioBuilderWorkspace() {
  const {
    portfolioItems,
    addPortfolioItem,
    updatePortfolioItem,
    deletePortfolioItem,
    togglePublishPortfolio,
    toggleFeaturedPortfolio,
    exportPortfolioJSON,
    resetPortfolioItems,
  } = useContent();

  const { setActiveToolId, addNotification } = useStudio();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Omit<PortfolioItem, "id">>({
    slug: "",
    title: "",
    description: "",
    thumbnail: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
    ],
    categories: ["3D MODELING"],
    body: "",
    published: true,
    featured: false,
    client: "",
    date: new Date().toISOString().split("T")[0],
    software: ["Blender", "Unreal Engine 5"],
    tags: ["3d", "render"],
    order: 1,
  });

  const categoriesList = ["ALL", "3D MODELING", "UNREAL ENGINE 5", "CHARACTER RIGGING", "GAME ASSETS", "ARCHVIZ"];

  const filteredItems = portfolioItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.client && item.client.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory =
      selectedCategory === "ALL" ||
      (item.categories && item.categories.includes(selectedCategory));
    return matchesSearch && matchesCategory;
  });

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      slug: `project-${Date.now().toString().slice(-4)}`,
      title: "",
      description: "",
      thumbnail: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
      ],
      categories: ["3D MODELING"],
      body: "### Project Overview\n\nDetailed breakdown of the project challenge, creative methodology, and technical execution.",
      published: true,
      featured: false,
      client: "Client Studio",
      date: new Date().toISOString().split("T")[0],
      software: ["Blender", "Unreal Engine 5"],
      tags: ["3d", "render"],
      order: portfolioItems.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    setFormData({
      slug: item.slug,
      title: item.title,
      description: item.description,
      thumbnail: item.thumbnail,
      gallery: item.gallery || [item.thumbnail],
      categories: item.categories || ["3D MODELING"],
      body: item.body || "",
      published: item.published,
      featured: !!item.featured,
      client: item.client || "",
      date: item.date || new Date().toISOString().split("T")[0],
      software: item.software || [],
      tags: item.tags || [],
      order: item.order || 1,
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingItem) {
      updatePortfolioItem(editingItem.id, formData);
      addNotification("Portfolio Item Updated", `Saved changes to "${formData.title}"`, "success");
    } else {
      addPortfolioItem(formData);
      addNotification("Portfolio Item Created", `Added "${formData.title}" to portfolio CMS`, "success");
    }
    setIsModalOpen(false);
  };

  const handleOpenInDesigner = (item: PortfolioItem) => {
    addNotification("Opening in Designer", `Loading assets for ${item.title} into Designer V2 canvas`, "info");
    setActiveToolId("designer");
  };

  return (
    <div className="flex-1 bg-black text-white p-6 overflow-y-auto custom-scrollbar font-sans select-none space-y-8">
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl bg-neutral-900 border border-white/10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-cyan/20 to-blue-600/20 border border-neon-cyan/30 flex items-center justify-center shrink-0">
            <FolderGit2 className="w-7 h-7 text-neon-cyan" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-neon-cyan px-2 py-0.5 rounded bg-neon-cyan/10 border border-neon-cyan/20">
                CMS MODULE
              </span>
              <span className="text-xs text-gray-400 font-mono">
                {portfolioItems.length} Total Projects
              </span>
            </div>
            <h1 className="font-display text-2xl font-bold text-white tracking-wide uppercase mt-1">
              Portfolio Management Hub
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            type="button"
            onClick={resetPortfolioItems}
            className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 font-mono text-xs uppercase tracking-wider transition-all"
          >
            Reset Sample Data
          </button>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="flex-1 md:flex-initial px-5 py-2.5 rounded-xl bg-neon-cyan text-black font-display font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Project
          </button>
        </div>
      </div>

      {/* FILTER & SEARCH STRIP */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by title, client..."
            className="w-full bg-neutral-900 border border-white/10 rounded-2xl py-2.5 pl-11 pr-4 text-xs font-future text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan/50 transition-colors"
          />
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 custom-scrollbar">
          {categoriesList.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-mono text-[10px] uppercase tracking-wider whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? "bg-neon-cyan/20 text-neon-cyan border-neon-cyan shadow-[0_0_10px_rgba(0,245,255,0.2)]"
                  : "bg-neutral-900 text-gray-400 border-white/10 hover:border-white/20 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* PORTFOLIO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group relative bg-neutral-900 rounded-3xl border border-white/10 overflow-hidden hover:border-neon-cyan/50 transition-all flex flex-col"
          >
            {/* THUMBNAIL WITH SMART OVERLAYS */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

              {/* Status Badges */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => togglePublishPortfolio(item.id)}
                  className={`px-2.5 py-1 rounded-full font-mono text-[9px] uppercase tracking-wider font-bold border ${
                    item.published
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                      : "bg-amber-500/20 text-amber-400 border-amber-500/40"
                  }`}
                >
                  {item.published ? "Published" : "Draft"}
                </button>
                {item.featured && (
                  <span className="px-2 py-0.5 rounded-full bg-neon-purple/20 text-neon-purple border border-neon-purple/40 font-mono text-[9px] uppercase tracking-wider flex items-center gap-1 font-bold">
                    <Star className="w-2.5 h-2.5 fill-neon-purple" /> Featured
                  </span>
                )}
              </div>

              {/* Categories */}
              <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
                {item.categories?.map((cat) => (
                  <span
                    key={cat}
                    className="px-2 py-0.5 rounded bg-black/60 border border-white/20 text-[9px] font-mono text-gray-300 uppercase"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            {/* CONTENT DETAILS */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs text-gray-400 font-mono mb-1">
                  <span>{item.client || "Self Project"}</span>
                  <span>{item.date}</span>
                </div>
                <h3 className="font-display font-bold text-lg text-white group-hover:text-neon-cyan transition-colors line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-xs font-future line-clamp-2 mt-1">
                  {item.description}
                </p>
              </div>

              {/* Software Tags */}
              {item.software && item.software.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {item.software.map((sw) => (
                    <span
                      key={sw}
                      className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-mono text-neon-cyan/80"
                    >
                      {sw}
                    </span>
                  ))}
                </div>
              )}

              {/* TOOLBAR ACTIONS */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(item)}
                    title="Edit Item"
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleFeaturedPortfolio(item.id)}
                    title="Toggle Featured"
                    className={`p-2 rounded-xl border transition-colors ${
                      item.featured
                        ? "bg-neon-purple/20 border-neon-purple/40 text-neon-purple"
                        : "bg-white/5 border-transparent text-gray-400 hover:text-white"
                    }`}
                  >
                    <Star className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => exportPortfolioJSON(item.id)}
                    title="Download JSON Package"
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <a
                    href={`/portfolio/${item.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    title="Preview Live Page"
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenInDesigner(item)}
                    className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-neon-purple/20 to-pink-500/20 border border-neon-purple/30 text-neon-purple font-mono text-[9px] uppercase tracking-wider hover:opacity-90 flex items-center gap-1"
                  >
                    <Palette className="w-3 h-3" /> Designer V2
                  </button>
                  <button
                    type="button"
                    onClick={() => deletePortfolioItem(item.id)}
                    title="Delete Project"
                    className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-neutral-900 border border-white/10 rounded-3xl p-6 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h2 className="font-display font-bold text-xl text-white uppercase flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-neon-cyan" />
                {editingItem ? "Edit Portfolio Item" : "Create New Portfolio Item"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        title: e.target.value,
                        slug: e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
                      })
                    }
                    placeholder="e.g. Cyberpunk Character Rig"
                    className="w-full bg-black border border-white/10 rounded-xl p-3 text-xs font-future text-white focus:outline-none focus:border-neon-cyan"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full bg-black border border-white/10 rounded-xl p-3 text-xs font-mono text-gray-300 focus:outline-none focus:border-neon-cyan"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase mb-1">
                    Client Name
                  </label>
                  <input
                    type="text"
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    placeholder="e.g. CyberStudio Tokyo"
                    className="w-full bg-black border border-white/10 rounded-xl p-3 text-xs font-future text-white focus:outline-none focus:border-neon-cyan"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase mb-1">
                    Completion Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-black border border-white/10 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-neon-cyan"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Summary of the project..."
                  className="w-full bg-black border border-white/10 rounded-xl p-3 text-xs font-future text-white focus:outline-none focus:border-neon-cyan"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">
                  Featured Thumbnail Image URL
                </label>
                <input
                  type="text"
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  className="w-full bg-black border border-white/10 rounded-xl p-3 text-xs font-mono text-gray-300 focus:outline-none focus:border-neon-cyan"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">
                  Software Used (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.software?.join(", ")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      software: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  placeholder="Blender, Unreal Engine 5, ZBrush"
                  className="w-full bg-black border border-white/10 rounded-xl p-3 text-xs font-future text-white focus:outline-none focus:border-neon-cyan"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">
                  Detailed Case Study (Markdown)
                </label>
                <textarea
                  rows={5}
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  placeholder="Markdown content..."
                  className="w-full bg-black border border-white/10 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-neon-cyan"
                />
              </div>

              {/* SEO PREVIEW & CHECK */}
              <div className="p-4 rounded-2xl bg-black border border-white/10 space-y-2">
                <span className="font-mono text-[10px] text-neon-cyan uppercase font-bold block">
                  SEO Metadata Validation
                </span>
                {!formData.description ? (
                  <p className="text-amber-400 text-xs flex items-center gap-1 font-mono">
                    <AlertTriangle className="w-3.5 h-3.5" /> Missing meta description for search engine previews.
                  </p>
                ) : (
                  <p className="text-emerald-400 text-xs flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" /> SEO title & description ready.
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.published}
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                      className="rounded bg-black border-white/20 text-neon-cyan focus:ring-0"
                    />
                    <span className="text-xs font-mono uppercase text-gray-300">Published</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="rounded bg-black border-white/20 text-neon-purple focus:ring-0"
                    />
                    <span className="text-xs font-mono uppercase text-gray-300">Featured</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-neon-cyan text-black font-display font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(0,245,255,0.4)]"
                >
                  Save Portfolio Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

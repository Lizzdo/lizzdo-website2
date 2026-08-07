import React, { useState } from "react";
import { useContent, BlogPostItem } from "../../../context/ContentContext";
import { useStudio } from "../../../context/StudioContext";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  Download,
  Clock,
  User,
  Calendar,
  X,
  Palette,
  AlertTriangle,
  CheckCircle2,
  Share2,
} from "lucide-react";

export function BlogDesignerWorkspace() {
  const {
    blogPosts,
    addBlogPost,
    updateBlogPost,
    deleteBlogPost,
    togglePublishBlog,
    exportBlogJSON,
    resetBlogPosts,
  } = useContent();

  const { setActiveToolId, addNotification } = useStudio();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [editingPost, setEditingPost] = useState<BlogPostItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Omit<BlogPostItem, "id">>({
    slug: "",
    title: "",
    description: "",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
    date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    author: "LIZZDO Studio",
    category: "Technology",
    readTime: "5 min read",
    body: "",
    published: true,
    tags: ["3d", "rendering"],
    order: 1,
  });

  const categoriesList = ["ALL", "Technology", "Tutorials", "3D Pipeline", "Industry News"];

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "ALL" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate estimated reading time automatically
  const calculateReadTime = (text: string) => {
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  const handleOpenCreate = () => {
    setEditingPost(null);
    setFormData({
      slug: `article-${Date.now().toString().slice(-4)}`,
      title: "",
      description: "",
      thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      author: "LIZZDO Team",
      category: "Technology",
      readTime: "4 min read",
      body: "### Introduction\n\nExploring the next frontier of 3D modeling and real-time graphics pipelines.\n\n```ts\n// Example Code Snippet\nconst renderPipeline = new RaytracingEngine();\n```\n",
      published: true,
      tags: ["3d", "graphics"],
      order: blogPosts.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (post: BlogPostItem) => {
    setEditingPost(post);
    setFormData({
      slug: post.slug,
      title: post.title,
      description: post.description,
      thumbnail: post.thumbnail,
      date: post.date,
      author: post.author,
      category: post.category,
      readTime: post.readTime,
      body: post.body,
      published: post.published,
      tags: post.tags || [],
      order: post.order || 1,
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const readTimeCalc = calculateReadTime(formData.body);
    const finalData = { ...formData, readTime: readTimeCalc };

    if (editingPost) {
      updateBlogPost(editingPost.id, finalData);
      addNotification("Blog Article Updated", `Saved changes to "${formData.title}"`, "success");
    } else {
      addBlogPost(finalData);
      addNotification("Blog Article Created", `Published "${formData.title}" to blog CMS`, "success");
    }
    setIsModalOpen(false);
  };

  const handleOpenInDesigner = (post: BlogPostItem) => {
    addNotification("Opening in Designer", `Loading article banner templates for "${post.title}"`, "info");
    setActiveToolId("designer");
  };

  return (
    <div className="flex-1 bg-black text-white p-6 overflow-y-auto custom-scrollbar font-sans select-none space-y-8">
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl bg-neutral-900 border border-white/10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500/20 to-neon-purple/20 border border-pink-500/30 flex items-center justify-center shrink-0">
            <FileText className="w-7 h-7 text-pink-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-pink-400 px-2 py-0.5 rounded bg-pink-500/10 border border-pink-500/20">
                CMS BLOG SUITE
              </span>
              <span className="text-xs text-gray-400 font-mono">
                {blogPosts.length} Articles
              </span>
            </div>
            <h1 className="font-display text-2xl font-bold text-white tracking-wide uppercase mt-1">
              Blog & Article Designer
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            type="button"
            onClick={resetBlogPosts}
            className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 font-mono text-xs uppercase tracking-wider transition-all"
          >
            Reset Sample Posts
          </button>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="flex-1 md:flex-initial px-5 py-2.5 rounded-xl bg-pink-500 text-white font-display font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Write Article
          </button>
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles by title, author, keyword..."
            className="w-full bg-neutral-900 border border-white/10 rounded-2xl py-2.5 pl-11 pr-4 text-xs font-future text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 custom-scrollbar">
          {categoriesList.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-mono text-[10px] uppercase tracking-wider whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? "bg-pink-500/20 text-pink-400 border-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.2)]"
                  : "bg-neutral-900 text-gray-400 border-white/10 hover:border-white/20 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ARTICLES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="group relative bg-neutral-900 rounded-3xl border border-white/10 overflow-hidden hover:border-pink-500/50 transition-all flex flex-col"
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
              <img
                src={post.thumbnail}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

              <div className="absolute top-3 left-3">
                <button
                  type="button"
                  onClick={() => togglePublishBlog(post.id)}
                  className={`px-2.5 py-1 rounded-full font-mono text-[9px] uppercase tracking-wider font-bold border ${
                    post.published
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                      : "bg-amber-500/20 text-amber-400 border-amber-500/40"
                  }`}
                >
                  {post.published ? "Published" : "Draft"}
                </button>
              </div>

              <div className="absolute bottom-3 left-3">
                <span className="px-2 py-0.5 rounded bg-pink-500/20 border border-pink-500/30 text-[9px] font-mono text-pink-300 uppercase">
                  {post.category}
                </span>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs text-gray-400 font-mono mb-2">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 text-pink-400" /> {post.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-pink-400" /> {post.readTime}
                  </span>
                </div>
                <h3 className="font-display font-bold text-lg text-white group-hover:text-pink-400 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-400 text-xs font-future line-clamp-2 mt-2">
                  {post.description}
                </p>
              </div>

              {/* TOOLBAR ACTIONS */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(post)}
                    title="Edit Post"
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => exportBlogJSON(post.id)}
                    title="Download Article JSON"
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <a
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    title="Preview Article Page"
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenInDesigner(post)}
                    className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-pink-400 font-mono text-[9px] uppercase tracking-wider hover:opacity-90 flex items-center gap-1"
                  >
                    <Palette className="w-3 h-3" /> Design Cover
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteBlogPost(post.id)}
                    title="Delete Post"
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
                <FileText className="w-5 h-5 text-pink-400" />
                {editingPost ? "Edit Article" : "Write New Article"}
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
                    Article Title *
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
                    placeholder="e.g. Next-Gen Raytracing Workflows"
                    className="w-full bg-black border border-white/10 rounded-xl p-3 text-xs font-future text-white focus:outline-none focus:border-pink-500"
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
                    className="w-full bg-black border border-white/10 rounded-xl p-3 text-xs font-mono text-gray-300 focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase mb-1">
                    Author
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full bg-black border border-white/10 rounded-xl p-3 text-xs font-future text-white focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-black border border-white/10 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-pink-500"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Tutorials">Tutorials</option>
                    <option value="3D Pipeline">3D Pipeline</option>
                    <option value="Industry News">Industry News</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase mb-1">
                    Publish Date
                  </label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-black border border-white/10 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">
                  Featured Image URL
                </label>
                <input
                  type="text"
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  className="w-full bg-black border border-white/10 rounded-xl p-3 text-xs font-mono text-gray-300 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">
                  Excerpt / Meta Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Short description for social cards & SEO..."
                  className="w-full bg-black border border-white/10 rounded-xl p-3 text-xs font-future text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">
                  Article Body (Markdown & Code blocks)
                </label>
                <textarea
                  rows={6}
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  placeholder="Markdown content..."
                  className="w-full bg-black border border-white/10 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="rounded bg-black border-white/20 text-pink-500 focus:ring-0"
                  />
                  <span className="text-xs font-mono uppercase text-gray-300">Publish Article Immediately</span>
                </label>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-pink-500 text-white font-display font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(236,72,153,0.4)]"
                >
                  Save Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

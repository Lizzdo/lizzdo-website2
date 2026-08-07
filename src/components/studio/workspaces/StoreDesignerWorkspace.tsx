import React, { useState } from "react";
import { useContent, StoreProductItem } from "../../../context/ContentContext";
import { useStudio } from "../../../context/StudioContext";
import {
  ShoppingBag,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  Download,
  Tag,
  DollarSign,
  X,
  Palette,
  CheckCircle2,
  AlertTriangle,
  Package,
} from "lucide-react";

export function StoreDesignerWorkspace() {
  const {
    storeProducts,
    addStoreProduct,
    updateStoreProduct,
    deleteStoreProduct,
    togglePublishStoreProduct,
    exportStoreJSON,
    resetStoreProducts,
  } = useContent();

  const { setActiveToolId, addNotification } = useStudio();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [editingProduct, setEditingProduct] = useState<StoreProductItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Omit<StoreProductItem, "id">>({
    slug: "",
    title: "",
    description: "",
    price: 39.99,
    sale_price: 29.99,
    video: "",
    thumbnail: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1200&auto=format&fit=crop",
    ],
    category: ["3D ASSETS"],
    body: "",
    published: true,
    downloadUrl: "/assets/download-sample.zip",
    salesCount: 42,
    rating: 4.9,
    order: 1,
  });

  const categoriesList = ["ALL", "3D ASSETS", "UNREAL ENGINE", "CHARACTER RIGS", "LIGHTING PRESETS"];

  const filteredProducts = storeProducts.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "ALL" ||
      (product.category && product.category.includes(selectedCategory));
    return matchesSearch && matchesCategory;
  });

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData({
      slug: `product-${Date.now().toString().slice(-4)}`,
      title: "",
      description: "",
      price: 49.99,
      sale_price: 34.99,
      video: "",
      thumbnail: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1200&auto=format&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1200&auto=format&fit=crop",
      ],
      category: ["3D ASSETS"],
      body: "### Product Overview\nHigh quality 3D asset package fully optimized for real-time game engines.",
      published: true,
      downloadUrl: "/assets/download-sample.zip",
      salesCount: 0,
      rating: 5.0,
      order: storeProducts.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: StoreProductItem) => {
    setEditingProduct(product);
    setFormData({
      slug: product.slug,
      title: product.title,
      description: product.description,
      price: product.price,
      sale_price: product.sale_price,
      video: product.video || "",
      thumbnail: product.thumbnail,
      gallery: product.gallery || [product.thumbnail],
      category: product.category || ["3D ASSETS"],
      body: product.body || "",
      published: product.published,
      downloadUrl: product.downloadUrl || "",
      salesCount: product.salesCount || 0,
      rating: product.rating || 4.9,
      order: product.order || 1,
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingProduct) {
      updateStoreProduct(editingProduct.id, formData);
      addNotification("Product Updated", `Saved changes to "${formData.title}"`, "success");
    } else {
      addStoreProduct(formData);
      addNotification("Product Created", `Added "${formData.title}" to store CMS`, "success");
    }
    setIsModalOpen(false);
  };

  const handleOpenInDesigner = (product: StoreProductItem) => {
    addNotification("Opening in Designer", `Loading product mockup templates for "${product.title}"`, "info");
    setActiveToolId("designer");
  };

  return (
    <div className="flex-1 bg-black text-white p-6 overflow-y-auto custom-scrollbar font-sans select-none space-y-8">
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl bg-neutral-900 border border-white/10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-orange/20 to-amber-500/20 border border-neon-orange/30 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-7 h-7 text-neon-orange" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-neon-orange px-2 py-0.5 rounded bg-neon-orange/10 border border-neon-orange/20">
                E-COMMERCE CMS
              </span>
              <span className="text-xs text-gray-400 font-mono">
                {storeProducts.length} Digital Assets
              </span>
            </div>
            <h1 className="font-display text-2xl font-bold text-white tracking-wide uppercase mt-1">
              Store Product Designer & CMS
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            type="button"
            onClick={resetStoreProducts}
            className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 font-mono text-xs uppercase tracking-wider transition-all"
          >
            Reset Sample Store
          </button>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="flex-1 md:flex-initial px-5 py-2.5 rounded-xl bg-neon-orange text-black font-display font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(255,107,0,0.4)] transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add New Asset
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
            placeholder="Search store products by title, price..."
            className="w-full bg-neutral-900 border border-white/10 rounded-2xl py-2.5 pl-11 pr-4 text-xs font-future text-white placeholder-gray-500 focus:outline-none focus:border-neon-orange/50 transition-colors"
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
                  ? "bg-neon-orange/20 text-neon-orange border-neon-orange shadow-[0_0_10px_rgba(255,107,0,0.2)]"
                  : "bg-neutral-900 text-gray-400 border-white/10 hover:border-white/20 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((prod) => (
          <div
            key={prod.id}
            className="group relative bg-neutral-900 rounded-3xl border border-white/10 overflow-hidden hover:border-neon-orange/50 transition-all flex flex-col"
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
              <img
                src={prod.thumbnail}
                alt={prod.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

              <div className="absolute top-3 left-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => togglePublishStoreProduct(prod.id)}
                  className={`px-2.5 py-1 rounded-full font-mono text-[9px] uppercase tracking-wider font-bold border ${
                    prod.published
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                      : "bg-amber-500/20 text-amber-400 border-amber-500/40"
                  }`}
                >
                  {prod.published ? "Available" : "Draft"}
                </button>
              </div>

              {/* Price Tag */}
              <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/80 backdrop-blur-md px-3 py-1 rounded-xl border border-neon-orange/40 font-display font-bold text-xs text-neon-orange">
                {prod.sale_price ? (
                  <>
                    <span>${prod.sale_price}</span>
                    <span className="text-[10px] text-gray-500 line-through ml-1">${prod.price}</span>
                  </>
                ) : (
                  <span>${prod.price}</span>
                )}
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-display font-bold text-lg text-white group-hover:text-neon-orange transition-colors line-clamp-1">
                  {prod.title}
                </h3>
                <p className="text-gray-400 text-xs font-future line-clamp-2 mt-1">
                  {prod.description}
                </p>
              </div>

              {/* TOOLBAR ACTIONS */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(prod)}
                    title="Edit Product"
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => exportStoreJSON(prod.id)}
                    title="Download Product JSON"
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <a
                    href={`/store/${prod.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    title="Preview Store Page"
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenInDesigner(prod)}
                    className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-neon-orange/20 to-amber-500/20 border border-neon-orange/30 text-neon-orange font-mono text-[9px] uppercase tracking-wider hover:opacity-90 flex items-center gap-1"
                  >
                    <Palette className="w-3 h-3" /> Mockup Creator
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteStoreProduct(prod.id)}
                    title="Delete Product"
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
                <ShoppingBag className="w-5 h-5 text-neon-orange" />
                {editingProduct ? "Edit Product Asset" : "Create Store Product Asset"}
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
                    Product Title *
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
                    placeholder="e.g. Sci-Fi Modular Corridors"
                    className="w-full bg-black border border-white/10 rounded-xl p-3 text-xs font-future text-white focus:outline-none focus:border-neon-orange"
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
                    className="w-full bg-black border border-white/10 rounded-xl p-3 text-xs font-mono text-gray-300 focus:outline-none focus:border-neon-orange"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase mb-1">
                    Regular Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-black border border-white/10 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-neon-orange"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase mb-1">
                    Sale Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.sale_price || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sale_price: e.target.value ? parseFloat(e.target.value) : undefined,
                      })
                    }
                    placeholder="Optional discount price"
                    className="w-full bg-black border border-white/10 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-neon-orange"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">
                  Thumbnail Image URL
                </label>
                <input
                  type="text"
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  className="w-full bg-black border border-white/10 rounded-xl p-3 text-xs font-mono text-gray-300 focus:outline-none focus:border-neon-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">
                  Digital Asset Download Package URL
                </label>
                <input
                  type="text"
                  value={formData.downloadUrl}
                  onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
                  placeholder="/assets/my-asset-pack.zip"
                  className="w-full bg-black border border-white/10 rounded-xl p-3 text-xs font-mono text-gray-300 focus:outline-none focus:border-neon-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Short product overview..."
                  className="w-full bg-black border border-white/10 rounded-xl p-3 text-xs font-future text-white focus:outline-none focus:border-neon-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">
                  Full Technical Overview (Markdown)
                </label>
                <textarea
                  rows={5}
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  placeholder="Polycount, texture resolutions, rig details..."
                  className="w-full bg-black border border-white/10 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-neon-orange"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="rounded bg-black border-white/20 text-neon-orange focus:ring-0"
                  />
                  <span className="text-xs font-mono uppercase text-gray-300">Available in Public Store</span>
                </label>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-neon-orange text-black font-display font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(255,107,0,0.4)]"
                >
                  Save Store Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingCart, Eye, X, Check, ArrowRight, Package, Download, Search } from "lucide-react";
import DocumentHead from "../components/DocumentHead";
import EstimatorCTA from "../components/EstimatorCTA";
import SmartCardImage from "../components/SmartCardImage";

const toArray = (val: any) => {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') return val.split(',').map(s => s.trim()).filter(Boolean);
  return [];
};

import { getSingle } from "../lib/content";
import { useContent } from "../context/ContentContext";

export default function Store() {
  const pageData = useMemo(() => getSingle(import.meta.glob("../content/pages/store.json", { eager: true })), []);
  const navigate = useNavigate();
  const { storeProducts } = useContent();
  const [activeFilters, setActiveFilters] = useState<string[]>(["ALL"]);
  const [searchQuery, setSearchQuery] = useState("");

  const { products, storeCategories } = useMemo(() => {
    const formattedItems = storeProducts
      .filter((f) => f.published !== false)
      .map((file) => ({
        id: file.id || file.slug,
        title: file.title,
        slug: file.slug,
        category: (() => { const arr = toArray(file.category); return arr.length ? arr : ["UNCATEGORIZED"]; })(),
        desc: file.description,
        price: file.price || 0,
        sale_price: file.sale_price,
        image: file.thumbnail || "/lizzdo-logo.png",
      }));
    
    const computedCats = new Set<string>();
    computedCats.add("ALL");
    formattedItems.forEach((p) => {
      p.category.forEach((cat: string) => {
        computedCats.add(cat);
      });
    });
    return { products: formattedItems, storeCategories: Array.from(computedCats) };
  }, [storeProducts]);

  const toggleFilter = (cat: string) => {
    setActiveFilters((prev) => {
      if (cat === "ALL") return ["ALL"];
      
      const newFilters = prev.filter((f) => f !== "ALL");
      
      if (newFilters.includes(cat)) {
        const filtered = newFilters.filter((f) => f !== cat);
        return filtered.length === 0 ? ["ALL"] : filtered;
      } else {
        return [...newFilters, cat];
      }
    });
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.desc.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = activeFilters.includes("ALL") || 
                          (p.category && p.category.some((cat: string) => activeFilters.includes(cat)));
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex flex-col">
      <DocumentHead title="Asset Store | Buy 3D Models, Rigs & Presets | LIZZDO" description="Shop premium, production-ready 3D models, character rigs, and cinematic lighting presets from the LIZZDO digital asset store." />

      {/* Hero Section */}
      <section className="py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="container mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <span className="font-mono text-xs tracking-[4px] text-neon-orange uppercase">
              // DIGITAL MARKETPLACE
            </span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="font-display text-5xl md:text-7xl font-black mb-8">
            {pageData?.headline?.split(" ").slice(0, -1).join(" ")} <span className="text-neon-orange">{pageData?.headline?.split(" ").slice(-1).join(" ")}</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-future text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            {pageData?.subtitle}
          </motion.p>
        </div>
      </section>

      {/* Filter & Search Section */}
      <section className="py-12 px-6 border-y border-white/5">
        <div className="container mx-auto">
          <div className="flex flex-col items-center gap-10">
            {/* Search Bar */}
            <div className="relative w-full max-w-2xl">
              <Search className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-neon-orange" size={18} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search assets..." 
                className="w-full bg-white/5 border border-white/10 rounded-full py-4 md:py-5 pl-12 md:pl-16 pr-6 text-white font-future focus:outline-none focus:border-neon-orange/50 transition-colors placeholder:text-gray-600"
              />
            </div>
            
            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-3">
              {storeCategories.map((cat) => {
                const isActive = activeFilters.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => toggleFilter(cat)}
                    className={`px-6 py-2.5 rounded-xl font-display text-[10px] tracking-[2px] transition-all border relative overflow-hidden group ${
                      isActive
                        ? "bg-neon-orange/10 border-neon-orange text-neon-orange shadow-[0_0_15px_rgba(255,107,0,0.2)]"
                        : "border-white/10 text-white/50 hover:border-white/30"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-store-glow"
                        className="absolute inset-0 bg-neon-orange/5 pointer-events-none"
                        initial={false}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      {cat}
                      {isActive && cat !== "ALL" && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-1.5 h-1.5 rounded-full bg-neon-orange shadow-[0_0_5px_#ff6b00]"
                        />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Store Grid */}
      <section className="py-24 px-6 pb-32">
        <div className="container mx-auto">
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="glass-panel flex flex-col rounded-[2rem] overflow-hidden group border border-white/5 bg-slate-950 hover:border-white/20 transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                >
                  <Link to={`/store/${product.slug}`} className="flex-1 flex flex-col">
                    <SmartCardImage
                      src={product.image}
                      alt={product.title}
                      aspectRatio="4/3"
                      fit="smart"
                      overlay={
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center pointer-events-auto">
                          <div className="w-14 h-14 rounded-full bg-neon-orange flex items-center justify-center shadow-[0_0_20px_rgba(255,107,0,0.6)]">
                            <Eye className="text-black" size={24} />
                          </div>
                        </div>
                      }
                    />

                    <div className="p-8 flex flex-col flex-1 h-full">
                      <div className="flex gap-2 mb-4 overflow-hidden text-ellipsis whitespace-nowrap">
                        {product.category?.slice(0,2).map((cat: string) => (
                          <span key={cat} className="font-mono text-[8px] tracking-[2px] px-2 py-1 rounded bg-white/5 text-neon-orange border border-neon-orange/20 shrink-0">
                            {cat}
                          </span>
                        ))}
                      </div>
                      
                      <h3 className="font-display text-2xl font-bold text-white group-hover:text-neon-orange transition-colors mb-3 line-clamp-2">
                        {product.title}
                      </h3>
                      
                      <p className="text-gray-400 font-future text-sm leading-relaxed line-clamp-2 mb-6">
                        {product.desc}
                      </p>

                      <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {product.sale_price ? (
                            <>
                              <span className="font-display text-2xl font-bold text-neon-orange">${product.sale_price}</span>
                              <span className="font-display text-sm text-gray-500 line-through">${product.price}</span>
                            </>
                          ) : (
                            <span className="font-display text-2xl font-bold text-white">${product.price}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>

                  <div className="px-8 pb-8 pt-4 border-t border-white/5 shrink-0 bg-slate-900/50">
                    <Link to={`/store/${product.slug}`} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-neon-orange hover:text-black hover:shadow-[0_0_20px_rgba(255,107,0,0.4)] text-white text-xs font-display tracking-[2px] transition-all uppercase">
                      View Details <ArrowRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Estimator CTA Banner */}
      <EstimatorCTA
        title="NEED CUSTOM 3D MODELS OR GAME ASSETS?"
        subtitle="Can't find exact pre-built store assets? Calculate an instant budget estimate for custom-made 3D assets, rigs, or environments."
        buttonText="Estimate Custom Assets"
        variant="banner"
      />
    </div>
  );
}

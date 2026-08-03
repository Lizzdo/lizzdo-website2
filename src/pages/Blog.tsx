import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight, Search, X } from "lucide-react";
import DocumentHead from "../components/DocumentHead";
import EstimatorCTA from "../components/EstimatorCTA";
import SmartCardImage from "../components/SmartCardImage";
const toArray = (val: any) => {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') return val.split(',').map(s => s.trim()).filter(Boolean);
  return [];
};
import { getSingle, getCollection, sortByOrder } from "../lib/content";

export default function Blog() {
  const pageData = useMemo(() => getSingle(import.meta.glob('../content/pages/blog.json', { eager: true })), []);
  
  const loadedPosts = useMemo(() => {
    const rawItems = getCollection(import.meta.glob('../content/blog/*.json', { eager: true }));
    return rawItems
      .filter((file: any) => file.published !== false)
      .sort(sortByOrder)
      .map((file: any) => ({
        id: file.slug,
        slug: file.slug,
        title: file.title,
        category: (Array.isArray(file.category) ? file.category[0] : file.category) || "Uncategorized",
        excerpt: file.description || file.excerpt || "",
        date: new Date(file.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) || "",
        image: file.thumbnail || "/lizzdo-logo.png",
        readTime: file.readTime || "5 min read",
        author: file.author || "Team",
      }));
  }, []);
  
  const [activeFilters, setActiveFilters] = useState<string[]>(["ALL"]);
  const [searchQuery, setSearchQuery] = useState("");
  
  const blogCategories = useMemo(() => {
    const cats = new Set<string>();
    cats.add("ALL");
    loadedPosts.forEach(post => {
      cats.add(post.category);
    });
    return Array.from(cats);
  }, []);

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

  const filteredPosts = useMemo(() => {
    return loadedPosts.filter(post => {
      const searchMatch = searchQuery === "" || 
                          post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      
      const categoryMatch = activeFilters.includes("ALL") || 
                            activeFilters.includes(post.category);

      return searchMatch && categoryMatch;
    });
  }, [activeFilters, searchQuery]);

  return (
    <div className="flex flex-col">
      <DocumentHead title="LIZZDO Blog | 3D Design, Web Dev & Industry Insights" description="Read the latest insights from LIZZDO on 3D modeling trends, game engine evolution, AI integrations, and web development best practices." />

      {/* Hero Section */}
      <section className="py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="container mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <span className="font-mono text-xs tracking-[4px] text-neon-cyan uppercase">
              // LIZZDO STUDIO BLOG
            </span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="font-display text-5xl md:text-7xl font-black mb-8 uppercase">
            {pageData?.headline?.split(' ').slice(0, -1).join(' ')} <span className="holo-text">{pageData?.headline?.split(' ').slice(-1).join(' ')}</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-future text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-12">
            {pageData?.subtitle}
          </motion.p>

          {/* Search Bar */}
          <div className="relative w-full max-w-2xl mx-auto">
            <Search className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-neon-cyan" size={18} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 md:pl-16 pr-6 text-white placeholder:text-gray-500 focus:outline-none focus:border-neon-cyan transition-all font-future text-sm "
            />
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 px-6 border-y border-white/5 bg-black/40  ">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            {blogCategories.map((cat) => {
              const isActive = activeFilters.includes(cat);
              return (
                <button
                  key={cat}
                  onClick={() => toggleFilter(cat)}
                  className={`px-5 py-2 rounded-xl font-display text-[10px] tracking-[2px] transition-all border relative overflow-hidden group uppercase ${
                    isActive
                      ? "bg-neon-cyan/10 border-neon-cyan text-neon-cyan shadow-[0_0_15px_rgba(0,245,255,0.2)]"
                      : "border-white/10 text-white/50 hover:border-white/30"
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {cat}
                    {isActive && cat !== "ALL" && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-1.5 h-1.5 rounded-full bg-neon-cyan shadow-[0_0_5px_#00f5ff]"
                      />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
          
          {!activeFilters.includes("ALL") && (
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setActiveFilters(["ALL"])}
              className="text-[10px] font-mono text-neon-pink hover:text-white transition-colors uppercase tracking-[2px] flex items-center gap-2 shrink-0"
            >
              <X size={12} /> Clear Filters
            </motion.button>
          )}
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-24 px-6 pb-32">
        <div className="container mx-auto max-w-7xl">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-20 border border-white/5 rounded-3xl glass-panel">
              <Search className="mx-auto text-gray-500 mb-4" size={40} />
              <h3 className="font-display text-xl text-white mb-2">No posts found</h3>
              <p className="font-future text-gray-500 text-sm">We couldn't find any articles matching your search or filters.</p>
              <button 
                onClick={() => {
                  setSearchQuery("");
                  setActiveFilters(["ALL"]);
                }}
                className="mt-6 font-mono text-xs text-neon-cyan uppercase tracking-[2px] hover:text-white transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredPosts.map((post) => (
                  <motion.article
                    key={post.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    className="glass-panel flex flex-col rounded-3xl overflow-hidden group border border-white/5 hover:border-white/20 transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] bg-slate-950/50"
                  >
                    <Link to={`/blog/${post.slug || post.id}`} className="flex flex-col h-full">
                      <SmartCardImage
                        src={post.image}
                        alt={post.title}
                        aspectRatio="16/10"
                        fit="smart"
                        overlay={
                          <div className="absolute top-4 left-4 pointer-events-auto">
                            <span className="px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-white font-display text-[10px] tracking-[2px] uppercase">
                              {post.category}
                            </span>
                          </div>
                        }
                      />
                      
                      <div className="p-8 flex flex-col flex-1">
                        <div className="flex items-center gap-6 text-xs font-mono text-gray-500 mb-6">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-neon-cyan" />
                            {post.date}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock size={14} className="text-neon-cyan" />
                            {post.readTime}
                          </div>
                        </div>
                        
                        <h3 className="font-display text-2xl font-bold text-white group-hover:text-neon-cyan transition-colors mb-4 line-clamp-2 leading-tight">
                          {post.title}
                        </h3>
                        
                        <p className="text-gray-400 font-future text-sm leading-relaxed mb-8 line-clamp-3">
                          {post.excerpt}
                        </p>
                        
                        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                          <span className="text-sm font-future text-gray-300">
                            By {post.author}
                          </span>
                          <span className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-neon-cyan transition-colors group-hover:shadow-[0_0_15px_rgba(0,245,255,0.4)] text-white group-hover:text-black">
                            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* Estimator CTA Banner */}
      <EstimatorCTA
        title="PLANNING A NEW DIGITAL PROJECT?"
        subtitle="Get instant pricing estimates for 3D modeling, web apps, mobile solutions, or AI workflows discussed in our articles."
        buttonText="Estimate My Project"
        variant="banner"
      />
    </div>
  );
}

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ArrowRight, Eye, Calendar, User, LayoutGrid } from "lucide-react";
import DocumentHead from "../components/DocumentHead";
import { Link } from "react-router-dom";
import EstimatorCTA from "../components/EstimatorCTA";
import SmartCardImage from "../components/SmartCardImage";

const toArray = (val: any) => {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') return val.split(',').map(s => s.trim()).filter(Boolean);
  return [];
};

import { getSingle, getCollection, sortByOrder } from "../lib/content";

export default function Portfolio() {
  const pageData = useMemo(() => getSingle(import.meta.glob("../content/pages/portfolio.json", { eager: true })), []);
  const [activeFilters, setActiveFilters] = useState<string[]>(["ALL"]);

  const { projects, categories } = useMemo(() => {
    const items = getCollection(import.meta.glob('../content/portfolio/*.json', { eager: true }));
    const formattedItems = items.filter((f: any) => f.published !== false).sort(sortByOrder).map((file: any) => ({
      id: file.slug,
      title: file.title,
      slug: file.slug,
      category: (() => { const arr = toArray(file.categories); return arr.length ? arr : ["UNCATEGORIZED"]; })(),
      desc: file.description,
      color: "from-neon-cyan/20 to-transparent",
      image: file.thumbnail || "/lizzdo-logo.png",
      software: toArray(file.software),
      clientName: file.client || "",
      tags: toArray(file.tags),
      date: file.date || ""
    }));
    
    const computedCats = new Set<string>();
    computedCats.add("ALL");
    formattedItems.forEach((p: any) => {
      p.category.forEach((cat: string) => {
        computedCats.add(cat);
      });
    });
    return { projects: formattedItems, categories: Array.from(computedCats) };
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

  const filteredProjects = projects.filter((p) => {
    if (activeFilters.includes("ALL")) return true;
    return p.category.some((cat: string) => activeFilters.includes(cat));
  });

  return (
    <div className="flex flex-col">
      <DocumentHead title="Portfolio | LIZZDO 3D & Digital Projects" description="View LIZZDO portfolio of premium 3D visualizations, Roblox environments, Unity assets, and custom web development projects delivered to global clients." />

      {/* Hero Section */}
      <section className="py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="container mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <span className="font-mono text-xs tracking-[4px] text-neon-cyan uppercase">
              // PROJECT GALLERY
            </span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="font-display text-5xl md:text-7xl font-black mb-8">
            {pageData?.headline?.split(" ").slice(0, -1).join(" ")} <span className="holo-text">{pageData?.headline?.split(" ").slice(-1).join(" ")}</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-future text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            {pageData?.subtitle}
          </motion.p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-12 px-6 border-y border-white/5">
        <div className="container mx-auto">
          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((cat) => {
                const isActive = activeFilters.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => toggleFilter(cat)}
                    className={`px-6 py-2 rounded-xl font-display text-[10px] tracking-[2px] transition-all border relative overflow-hidden group ${
                      isActive
                        ? "bg-neon-cyan/10 border-neon-cyan text-neon-cyan shadow-[0_0_15px_rgba(0,245,255,0.2)]"
                        : "border-white/10 text-white/50 hover:border-white/30"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-glow"
                        className="absolute inset-0 bg-neon-cyan/5 pointer-events-none"
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setActiveFilters(["ALL"])}
                className="text-[10px] font-mono text-neon-pink hover:text-white transition-colors uppercase tracking-[2px] flex items-center gap-2"
              >
                <X size={12} /> Clear all filters
              </motion.button>
            )}
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-24 px-6 pb-32">
        <div className="container mx-auto">
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="glass-panel flex flex-col rounded-3xl overflow-hidden group border border-white/5 bg-slate-950 hover:border-white/20 transition-colors"
                >
                  <Link to={`/portfolio/${project.slug}`} className="flex-1 flex flex-col">
                    <SmartCardImage
                      src={project.image}
                      alt={project.title}
                      aspectRatio="4/3"
                      fit="smart"
                      overlay={
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center pointer-events-auto">
                          <div className="w-14 h-14 rounded-full bg-neon-cyan flex items-center justify-center shadow-[0_0_20px_rgba(0,245,255,0.6)]">
                            <Eye className="text-black" size={24} />
                          </div>
                        </div>
                      }
                    />
                    
                    <div className="p-8 flex flex-col flex-1 h-full">
                      <div className="flex flex-wrap gap-2 mb-5">
                        {project.category.map((cat: string) => (
                          <span key={cat} className="font-mono text-[9px] tracking-[2px] px-2 py-1 rounded bg-white/5 text-neon-cyan border border-neon-cyan/20">
                            {cat}
                          </span>
                        ))}
                      </div>
                      
                      <h3 className="font-display text-2xl font-bold text-white group-hover:text-neon-cyan transition-colors mb-4 line-clamp-2">
                        {project.title}
                      </h3>
                      
                      <p className="text-gray-400 font-future text-sm leading-relaxed mb-6 line-clamp-3">
                        {project.desc}
                      </p>

                      <div className="mt-auto pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
                        {(project.clientName || project.date) && (
                           <div className="col-span-2 flex items-center gap-4 text-xs font-mono text-gray-500">
                             {project.clientName && (
                               <div className="flex items-center gap-1.5 truncate">
                                 <User size={14} />
                                 <span className="truncate">{project.clientName}</span>
                               </div>
                             )}
                             {project.date && (
                               <div className="flex items-center gap-1.5 shrink-0">
                                 <Calendar size={14} />
                                 <span>{new Date(project.date).getFullYear()}</span>
                               </div>
                             )}
                           </div>
                        )}
                        
                        {project.software?.length > 0 && (
                          <div className="col-span-2 flex flex-wrap gap-2 mt-2">
                            {project.software.slice(0, 3).map((sw: string) => (
                              <span key={sw} className="px-2 py-1 rounded text-[10px] uppercase font-mono text-gray-400 bg-white/5">
                                {sw}
                              </span>
                            ))}
                            {project.software.length > 3 && (
                               <span className="px-2 py-1 rounded text-[10px] uppercase font-mono text-gray-400 bg-white/5">
                                 +{project.software.length - 3}
                               </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>

                  <div className="px-8 pb-8 pt-4 border-t border-white/5 shrink-0 bg-slate-900/50">
                    <Link to={`/portfolio/${project.slug}`} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-neon-cyan hover:text-black hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] text-white text-xs font-display tracking-[2px] transition-all uppercase">
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
        title="INSPIRED BY OUR PORTFOLIO WORK?"
        subtitle="Calculate an instant estimate for your 3D asset, game environment, or high-tech web software project."
        buttonText="Estimate My Project"
        variant="banner"
      />
    </div>
  );
}

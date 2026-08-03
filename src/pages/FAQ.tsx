import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, ChevronDown, Info, Globe, ShoppingCart, Cpu, Bot, Smartphone, Cloud, 
  Gamepad2, MonitorPlay, SquareTerminal, Swords, Box, User, Package, Building, 
  Film, Printer, Shirt, Hexagon, Layout, Server, Wrench, FileText
} from "lucide-react";
import DocumentHead from "../components/DocumentHead";
import { getSingle } from "../lib/content";
import { getCollection, sortByOrder } from "../lib/content";
import Markdown from "react-markdown";

type FAQItem = { question: string; answer: string; };

// Map string icon names to Lucide components
const IconMap: Record<string, React.FC<any>> = {
  Info, Globe, ShoppingCart, Cpu, Bot, Smartphone, Cloud, Gamepad2, MonitorPlay, 
  SquareTerminal, Swords, Box, UserSquircle: User, Package, Building, Film, Printer, 
  Shirt, Hexagon, Layout, Server, Wrench, FileText
};

export default function FAQ() {
  const pageData = useMemo(() => getSingle(import.meta.glob('../content/pages/faq.json', { eager: true })), []);
  
  const loadedFaqData = useMemo(() => {
    const rawFaqs = getCollection(import.meta.glob('../content/faq/*.json', { eager: true }));
    const filteredFaqs = rawFaqs.filter((f: any) => f.published !== false);
    const sortedFaqs = filteredFaqs.sort(sortByOrder);
    const grouped = sortedFaqs.reduce((acc: any, faq: any) => {
       const cat = faq.category || "General";
       if (!acc[cat]) {
         acc[cat] = {
           id: cat.toLowerCase().replace(/\s+/g, '-'),
           name: cat,
           icon: "Info",
           items: []
         };
       }
       acc[cat].items.push({ question: faq.question, answer: faq.answer });
       return acc;
    }, {});
    return Object.values(grouped);
  }, []);
  
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filter FAQs based on search and category
  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase();
    
    return loadedFaqData.map((category: any) => {
      const filteredItems = category.items.filter((item: FAQItem) => 
        item.question.toLowerCase().includes(query) || 
        item.answer.toLowerCase().includes(query)
      );
      
      return {
        ...category,
        items: filteredItems
      };
    }).filter(category => {
      const hasItems = category.items && category.items.length > 0;
      const matchesCategory = activeCategory === "ALL" || category.id === activeCategory;
      return hasItems && matchesCategory;
    });
  }, [loadedFaqData, activeCategory, searchQuery]);

  return (
    <div className="flex flex-col">
      <DocumentHead title="FAQ | Frequently Asked Questions | LIZZDO" description="Find answers to common questions about LIZZDO services, 3D workflow, project timelines, and web development processes." />

      {/* Hero Section */}
      <section className="py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="container mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <span className="font-mono text-xs tracking-[4px] text-neon-cyan uppercase">
              // GOT QUESTIONS?
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
              placeholder="Search questions or keywords..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 md:pl-16 pr-6 text-white placeholder:text-gray-500 focus:outline-none focus:border-neon-cyan transition-all font-future text-sm backdrop-blur-sm"
            />
          </div>
        </div>
      </section>

      <section className="py-12 px-6 pb-32">
        <div className="container mx-auto max-w-6xl flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4 shrink-0">
            <div className="sticky top-24 space-y-2">
              <button
                onClick={() => setActiveCategory("ALL")}
                className={`w-full text-left px-4 py-3 rounded-xl font-display text-xs tracking-[1px] transition-all flex items-center gap-3 ${
                  activeCategory === "ALL" 
                    ? "bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 shadow-[0_0_15px_rgba(0,245,255,0.1)]" 
                    : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <Layout size={16} />
                All Questions
              </button>
              
              {loadedFaqData.map((category: any) => {
                const IconComponent = IconMap[category.icon] || Info;
                const isActive = activeCategory === category.id;
                
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl font-display text-xs tracking-[1px] transition-all flex items-center gap-3 ${
                      isActive 
                        ? "bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 shadow-[0_0_15px_rgba(0,245,255,0.1)]" 
                        : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <IconComponent size={16} />
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:w-3/4 flex-grow">
            {filteredData.length === 0 ? (
              <div className="text-center py-20 border border-white/5 rounded-3xl glass-panel">
                <Search className="mx-auto text-gray-500 mb-4" size={40} />
                <h3 className="font-display text-xl text-white mb-2">No results found</h3>
                <p className="font-future text-gray-500 text-sm">We couldn't find any FAQs matching "{searchQuery}"</p>
                <button 
                  onClick={() => setSearchQuery("")}
                  className="mt-6 font-mono text-xs text-neon-cyan uppercase tracking-[2px] hover:text-white transition-colors"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="space-y-16">
                {filteredData.map((category) => (
                  <div key={category.id} className="scroll-mt-32" id={category.id}>
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-neon-cyan">
                        {React.createElement(IconMap[category.icon] || Info, { size: 20 })}
                      </div>
                      <h2 className="font-display text-2xl md:text-3xl font-bold uppercase">{category.name}</h2>
                    </div>

                    <div className="space-y-4">
                      {category.items.map((item: any, index: number) => {
                        const itemId = `${category.id}-${index}`;
                        const isOpen = openItems[itemId];
                        
                        return (
                          <div 
                            key={itemId}
                            className={`glass-panel border rounded-2xl overflow-hidden transition-all duration-300 ${
                              isOpen ? "border-neon-cyan/30 shadow-[0_0_20px_rgba(0,245,255,0.05)]" : "border-white/5 hover:border-white/20"
                            }`}
                          >
                            <button
                              onClick={() => toggleItem(itemId)}
                              className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                            >
                              <h3 className="font-display text-sm md:text-base font-bold pr-8 text-white group-hover:text-neon-cyan transition-colors">
                                {item.question}
                              </h3>
                              <div className={`shrink-0 transition-transform duration-300 text-neon-cyan ${isOpen ? "rotate-180" : ""}`}>
                                <ChevronDown size={20} />
                              </div>
                            </button>
                            
                            <AnimatePresence>
                              {isOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <div className="px-6 pb-6 pt-0 border-t border-white/5">
                                    <div className="font-future text-gray-400 text-sm leading-relaxed mt-4 prose prose-invert prose-cyan max-w-none">
                                      <Markdown>{item.answer}</Markdown>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

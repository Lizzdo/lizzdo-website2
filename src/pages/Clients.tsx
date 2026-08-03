import { useState, useMemo } from "react";
// Trigger github sync
import { motion, AnimatePresence } from "motion/react";
import DocumentHead from "../components/DocumentHead";
import EstimatorCTA from "../components/EstimatorCTA";
import { getCollection, getSingle, sortByOrder } from "../lib/content";
import { 
  Users, Bot, Shield, Rocket, Flame, Sword, Sparkles, BookOpen, 
  Search, ShieldAlert, Cpu, Heart, Ship, Anchor, HelpCircle, 
  Play, Smartphone, Ghost, Video, Activity, Globe, Layers, 
  Trophy, ArrowLeft, ExternalLink, Zap, Info, ChevronRight, CheckCircle2
} from "lucide-react";

// Helper to resolve icon name to dynamic component
const iconMap: Record<string, any> = {
  Flame,
  Cpu,
  Sword,
  Sparkles,
  Rocket,
  Shield,
  Anchor,
  Bot,
  Layers,
  Play,
  ShieldAlert,
  Activity,
  Smartphone,
  BookOpen,
  Ghost,
  Video,
  Trophy,
  Heart,
  Ship,
  HelpCircle,
  Globe
};

function ClientIcon({ name, className = "text-neon-cyan", size = 24 }: { name: string; className?: string; size?: number }) {
  const IconComponent = iconMap[name] || HelpCircle;
  return <IconComponent className={className} size={size} />;
}

// Full 22 data matrix mapped under strict professional standards
const rawClients = getCollection(import.meta.glob('../content/clients/*.json', { eager: true }));
const clientsData = rawClients
  .filter((f: any) => f.published !== false)
  .sort(sortByOrder)
  .map((file: any) => ({
    ...file,
    name: file.title,
    company: file.company || "",
    category: file.category || "Uncategorized",
    iconName: file.iconName || "User",
    websiteLink: file.websiteLink || "",
    description: file.description || "",
    clientLogoUrl: file.clientLogoUrl || "",
    coverImage: file.coverImage || "",
    industry: file.industry || "",
    country: file.country || "",
    project: file.project || "",
    completionDate: file.completionDate || "",
    contactName: file.contactName || "",
    review: file.review || "",
    order: file.order || 0,
    featured: file.featured === true
  }));

const categories = ["ALL", ...Array.from(new Set(clientsData.map(c => c.category)))];


export default function Clients() {
  const pageData = useMemo(() => getSingle(import.meta.glob("../content/pages/clients.json", { eager: true })), []);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState<typeof clientsData[0] | null>(null);

  const filteredClients = useMemo(() => {
    return clientsData.filter(client => {
      const matchesCategory = activeCategory === "ALL" || client.category === activeCategory;
      const matchesSearch = 
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="flex flex-col min-h-screen bg-black text-white relative">
      <DocumentHead title="Our Clients | LIZZDO Studio Success Stories" description="See the amazing brands and creators we partner with. LIZZDO provides top-tier 3D and web development solutions for a global roster of clients." />
      {/* Grid background effect */}
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none z-0" />
      
      {/* Top ambient glow */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-neon-purple/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-neon-cyan/5 blur-[200px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 py-24 relative z-10 flex-grow">
        {/* Breadcrumb / Back button */}
        <div className="mb-12">
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
            <a 
              href="/portfolio" 
              className="inline-flex items-center gap-2 text-xs font-mono text-neon-cyan hover:text-white transition-colors duration-300 uppercase tracking-widest"
            >
              <ArrowLeft size={14} /> Back to Portfolio
            </a>
          </motion.div>
        </div>

        {/* Page Header */}
        <section className="mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <span className="px-4 py-1.5 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-[10px] font-bold uppercase tracking-[3px]">
              // CLIENT PARTNERSHIPS
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-6xl font-black mb-8 leading-tight max-w-5xl"
          >
            {pageData?.headline?.split(" ").slice(0, -2).join(" ")} <span className="holo-text">{pageData?.headline?.split(" ").slice(-2).join(" ")}</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-future text-lg md:text-xl text-gray-400 max-w-4xl leading-relaxed"
          >
            {pageData?.subtitle}
          </motion.p>
        </section>

        {/* Stats Dashboard */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 p-8 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-md"
        >
          <div className="text-center md:text-left border-r border-white/10 last:border-r-0 pr-4">
            <div className="font-display text-2xl md:text-4xl font-bold text-neon-cyan mb-1">1000+</div>
            <div className="font-mono text-[8.5px] uppercase tracking-[2px] text-gray-500">Corporate Partners</div>
          </div>
          <div className="text-center md:text-left border-r border-white/10 last:border-r-0 pr-4 pl-0 md:pl-4">
            <div className="font-display text-2xl md:text-4xl font-bold text-neon-purple mb-1">100%</div>
            <div className="font-mono text-[8.5px] uppercase tracking-[2px] text-gray-500">Topology Integrity</div>
          </div>
          <div className="text-center md:text-left border-r border-white/10 last:border-r-0 pr-4 pl-0 md:pl-4">
            <div className="font-display text-2xl md:text-4xl font-bold text-neon-green mb-1">98%</div>
            <div className="font-mono text-[8.5px] uppercase tracking-[2px] text-gray-500">Asset Footprint Optimization</div>
          </div>
          <div className="text-center md:text-left pl-0 md:pl-4">
            <div className="font-display text-2xl md:text-4xl font-bold text-neon-pink mb-1">Multi</div>
            <div className="font-mono text-[8.5px] uppercase tracking-[2px] text-gray-500">Engine Compatibility</div>
          </div>
        </motion.section>

        {/* Controls: Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-6 justify-between items-center mb-12">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 w-full lg:w-auto overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-xl text-xs font-display transition-all duration-300 tracking-[1.5px] uppercase shrink-0 border ${
                  activeCategory === cat
                    ? "bg-neon-cyan border-neon-cyan text-black font-bold shadow-[0_0_15px_rgba(0,245,255,0.4)]"
                    : "bg-white/5 border-white/10 text-white/70 hover:border-white/20 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input
              type="text"
              placeholder="Search specifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_15px_rgba(0,245,255,0.15)] transition-all font-future"
            />
          </div>
        </div>

        {/* Clients Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredClients.map((client, index) => (
              <motion.div
                layout
                key={client.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="group relative flex flex-col justify-between p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950 to-black hover:border-neon-cyan/40 transition-all duration-500 shadow-2xl overflow-hidden"
              >
                {/* Visual outline on hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-neon-cyan/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                
                {/* Card Top Branding / Identification */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-500 group-hover:bg-neon-cyan/10 group-hover:border-neon-cyan/20 group-hover:shadow-[0_0_15px_rgba(0,245,255,0.2)]">
                      <ClientIcon name={client.iconName} className="text-neon-cyan group-hover:scale-110 transition-transform duration-300" size={20} />
                    </div>
                    <span className="font-mono text-[9px] uppercase tracking-[2px] px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400">
                      {client.category}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold mb-1 tracking-[1px] group-hover:text-neon-cyan transition-colors duration-300 uppercase">
                    {client.name}
                  </h3>
                  <div className="font-future text-xs text-neon-purple tracking-[1px] uppercase mb-6">
                    {client.company}
                  </div>

                  {/* Spec Table representation - Clean Agency Spec Box */}
                  <div className="border border-white/10 rounded-2xl bg-black/40 overflow-hidden mb-6 text-xs font-future font-medium">
                    <div className="grid grid-cols-2 p-3 border-b border-white/10 bg-white/[0.01]">
                      <span className="text-gray-500">INDUSTRY</span>
                      <span className="text-gray-300 text-right uppercase tracking-[0.5px] truncate px-1" title={client.industry}>
                        {client.industry || "N/A"}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 p-3 border-b border-white/10">
                      <span className="text-gray-500">COUNTRY</span>
                      <span className="text-gray-300 text-right uppercase tracking-[0.5px] truncate px-1" title={client.country}>
                        {client.country || "N/A"}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 p-3 border-b border-white/10 bg-white/[0.01]">
                      <span className="text-gray-500">PROJECT</span>
                      <span className="text-gray-300 text-right uppercase tracking-[0.5px] truncate px-1" title={client.project}>
                        {client.project || "N/A"}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 p-3">
                      <span className="text-gray-500">COMPLETED</span>
                      <span className="text-neon-green text-right uppercase tracking-[0.5px] font-semibold truncate px-1">
                        {client.completionDate || "ONGOING"}
                      </span>
                    </div>
                  </div>

                  {/* Case Study Summary Paragraph */}
                  <div className="mb-6">
                    <h4 className="font-display text-[9px] text-gray-500 tracking-[2px] uppercase mb-2">Description</h4>
                    <p className="text-xs text-gray-400 font-future leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
                      {client.description}
                    </p>
                  </div>
                </div>

                {/* Achievements Preview / Trigger details */}
                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="font-mono text-[8px] text-gray-600 tracking-[1px] uppercase">
                    PROPERTIES VERIFIED
                  </span>
                  <button
                    onClick={() => setSelectedClient(client)}
                    className="inline-flex items-center gap-1.5 text-[10px] font-display text-neon-cyan hover:text-white transition-colors uppercase tracking-[2px]"
                  >
                    Specifications <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredClients.length === 0 && (
          <div className="text-center py-20">
            <Info className="mx-auto text-gray-600 mb-4" size={40} />
            <h3 className="font-display text-lg font-bold mb-2">NO RECORDS FOUND</h3>
            <p className="font-future text-gray-400 max-w-sm mx-auto">
              No partnerships match the search query inside the "{activeCategory}" category. Try adjusting your parameters.
            </p>
          </div>
        )}

        {/* Why Lizzdo Section */}
        <section className="mt-32 p-12 md:p-16 rounded-[3rem] border border-white/10 bg-gradient-to-tr from-slate-950/80 via-black to-slate-950/80 overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.8)]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-neon-cyan/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-neon-purple/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <span className="font-mono text-xs tracking-[4px] text-neon-purple uppercase mb-4 block">
                // STUDIO METRICS
              </span>
              <h2 className="font-display text-3xl md:text-5xl font-black mb-8 uppercase leading-tight">
                WHY LEADING CREATORS CHOOSE <span className="holo-text">LIZZDO</span>
              </h2>
              <p className="font-future text-base text-gray-400 leading-relaxed mb-6">
                Lizzdo Studio holds a unique multi-disciplinary position across modern digital media architectures. 
                We don't merely sculpt graphics — we actively program assets for execution, ensuring flawless alignment 
                with complex caging constraints, rigid budget parameters, and dynamic skin weight deformations.
              </p>
              <p className="font-future text-base text-gray-400 leading-relaxed mb-8">
                Whether supplying optimized custom clothing capsule collections, preparing high-poly collectibles 
                with watertight geometry constraints, or programming interactive blinking sub-rig elements, we treat 
                every contract as a premium partnership.
              </p>
              <a 
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-display font-bold uppercase text-xs tracking-[2px] hover:shadow-[0_0_30px_rgba(0,245,255,0.6)] transition-all button-glow"
              >
                Inquire For Partnership <Zap size={14} />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: "Universal Pipelines", desc: "Native compatibility across Roblox UGC regulations, Unity HDRP structures, and industrial STL parameters." },
                { title: "Zero Culling Errors", desc: "Advanced caging, double-sided render coordinates, and UV island calculations." },
                { title: "Skeletal Engineering", desc: "Bespoke kinematic rigs, custom eyelid controllers, and Mixamo automatic database alignments." },
                { title: "Watertight Solidities", desc: "Manifold verification systems translating render vectors directly to commercial FDM and Resin print-ready CAD solids." }
              ].map((value, i) => (
                <div key={i} className="p-6 rounded-2xl border border-white/5 bg-white/[0.01] hover:border-neon-cyan/20 transition-all duration-300">
                  <h4 className="font-display text-sm font-bold text-white mb-2 tracking-[1px] uppercase">
                    {value.title}
                  </h4>
                  <p className="text-xs text-gray-500 font-future leading-relaxed">
                    {value.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Estimator CTA Banner */}
        <div className="mt-20">
          <EstimatorCTA
            title="WANT TO BE OUR NEXT SUCCESS STORY?"
            subtitle="Calculate an instant estimate for your enterprise 3D asset, game development, or digital solution."
            buttonText="Estimate My Project"
            variant="banner"
          />
        </div>
      </div>

      {/* Dynamic Slideout Overlay Panel / Modal Details */}
      <AnimatePresence>
        {selectedClient && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedClient(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-gradient-to-b from-slate-950 to-black border border-neon-cyan/30 rounded-[2.5rem] p-8 md:p-10 shadow-[0_0_50px_rgba(0,245,255,0.25)] relative overflow-hidden"
            >
              {/* Abstract decorative layout lines */}
              <div className="absolute top-0 left-0 w-20 h-[1px] bg-neon-cyan" />
              <div className="absolute top-0 left-0 w-[1px] h-20 bg-neon-cyan" />
              <div className="absolute bottom-0 right-0 w-20 h-[1px] bg-neon-purple" />
              <div className="absolute bottom-0 right-0 w-[1px] h-20 bg-neon-purple" />

              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center">
                    <ClientIcon name={selectedClient.iconName} className="text-neon-cyan" size={24} />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-bold tracking-[1px] uppercase text-white">
                      {selectedClient.name}
                    </h3>
                    <p className="font-future text-xs text-neon-cyan uppercase tracking-[1.5px] mt-0.5">
                      {selectedClient.company}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedClient(null)}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/15 transition-all duration-300"
                >
                  ✕
                </button>
              </div>

              {/* Specs detailed overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-xs font-future">
                <div className="space-y-4">
                  {selectedClient.industry && (
                    <div>
                      <span className="text-gray-500 uppercase tracking-[1.5px] block mb-1">Industry</span>
                      <span className="text-gray-200 text-sm">{selectedClient.industry}</span>
                    </div>
                  )}
                  {selectedClient.country && (
                    <div>
                      <span className="text-gray-500 uppercase tracking-[1.5px] block mb-1">Country</span>
                      <span className="text-gray-200 text-sm">{selectedClient.country}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  {selectedClient.project && (
                    <div>
                      <span className="text-gray-500 uppercase tracking-[1.5px] block mb-1">Project Completed</span>
                      <span className="text-gray-200 text-sm">{selectedClient.project}</span>
                    </div>
                  )}
                  {selectedClient.completionDate && (
                    <div>
                      <span className="text-gray-500 uppercase tracking-[1.5px] block mb-1">Completion Date</span>
                      <span className="text-neon-green font-semibold text-sm">{selectedClient.completionDate}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Requirement detailed text */}
              {selectedClient.description && (
                <div className="mb-8">
                  <h4 className="font-display text-[10px] text-gray-500 tracking-[2.5px] uppercase mb-3">Project Description Summary</h4>
                  <p className="text-sm text-gray-300 font-future leading-relaxed">
                    {selectedClient.description}
                  </p>
                </div>
              )}
              
              {/* Client Review Section */}
              {selectedClient.review && (
                <div className="mb-8 p-6 bg-white/5 border border-white/10 rounded-2xl relative">
                  <div className="absolute top-4 right-4 text-neon-cyan/20">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
                  </div>
                  <div className="flex gap-1 text-neon-orange mb-3">
                    {[...Array(Math.floor(selectedClient.rating || 5))].map((_, i) => (
                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                    ))}
                  </div>
                  <p className="text-sm font-future text-gray-300 italic leading-relaxed">"{selectedClient.review}"</p>
                  {selectedClient.contactName && (
                    <div className="mt-4 text-xs font-mono text-gray-500 uppercase tracking-widest border-t border-white/5 pt-3">
                      — {selectedClient.contactName}
                    </div>
                  )}
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                {selectedClient.websiteLink && (
                  <a href={selectedClient.websiteLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-neon-cyan text-black hover:bg-white text-xs font-display font-bold uppercase tracking-[2px] transition-all">
                    VISIT WEBSITE <ExternalLink size={14} />
                  </a>
                )}
                <button
                  onClick={() => setSelectedClient(null)}
                  className="px-6 py-2.5 rounded-xl border border-white/10 hover:border-white/25 text-xs text-center font-display uppercase tracking-[2px] transition-all duration-300 ml-auto"
                >
                  Close Analysis
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

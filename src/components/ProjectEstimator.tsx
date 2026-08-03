import { useState, useMemo } from "react";
import { Calculator, Send, CheckCircle2, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { getCollection, getSingle, sortByOrder } from "../lib/content";
import { IconMapper } from "./IconMapper";

function parsePriceNumber(rawPrice: any, basePrice?: number): number {
  if (typeof basePrice === "number" && !isNaN(basePrice) && basePrice > 0) {
    return basePrice;
  }
  if (!rawPrice) return 500;
  if (typeof rawPrice === "number") return rawPrice;
  const digits = String(rawPrice).replace(/[^0-9.]/g, "");
  const parsed = parseFloat(digits);
  return isNaN(parsed) || parsed <= 0 ? 500 : parsed;
}

export default function ProjectEstimator() {
  const navigate = useNavigate();

  // Load Estimator Settings from CMS
  const estimatorSettings = useMemo(() => {
    return getSingle(import.meta.glob("../content/settings/estimator.json", { eager: true }));
  }, []);

  // Load Services from CMS
  const cmsServices = useMemo(() => {
    const rawServices = getCollection(import.meta.glob("../content/services/*.json", { eager: true }));
    return rawServices
      .filter((s: any) => s.published !== false)
      .sort(sortByOrder);
  }, []);

  // Fallback / Defaults for Config
  const badgeLabel = estimatorSettings?.badge || "INSTANT ESTIMATOR";
  const titlePrefix = estimatorSettings?.title_prefix || "PLAN YOUR";
  const titleHighlight = estimatorSettings?.title_highlight || "PROJECT";
  const subtitle = estimatorSettings?.subtitle || "Get an immediate estimate for your 3D and high-tech software requirements. Transparent pricing for premium digital assets and systems.";
  const disclaimer = estimatorSettings?.disclaimer || "*Final price confirmed after 30-min discovery call.";
  const currencySymbol = estimatorSettings?.currency_symbol || "$";
  const minFactor = estimatorSettings?.min_bound_factor ?? 0.85;
  const maxFactor = estimatorSettings?.max_bound_factor ?? 1.25;

  const complexities = useMemo(() => {
    if (estimatorSettings?.complexities?.length > 0) {
      return estimatorSettings.complexities;
    }
    return [
      { id: "low", title: "Basic / Low Poly", mult: 1.0, desc: "Simple Detail", icon: "Layers" },
      { id: "medium", title: "Standard / Custom", mult: 1.9, desc: "Highly Detailed", icon: "Cpu" },
      { id: "high", title: "Advanced / Premium", mult: 3.8, desc: "Enterprise Grade", icon: "Zap" },
    ];
  }, [estimatorSettings]);

  const timelines = useMemo(() => {
    if (estimatorSettings?.timelines?.length > 0) {
      return estimatorSettings.timelines;
    }
    return [
      { id: "flex", title: "Flexible", mult: 1.0, desc: "Standard Delivery", icon: "Clock" },
      { id: "standard", title: "Standard", mult: 1.2, desc: "Balanced Schedule", icon: "Calendar" },
      { id: "priority", title: "Priority", mult: 1.5, desc: "Fast Track Production", icon: "Zap" },
      { id: "rush", title: "Rush / Priority", mult: 2.0, desc: "Express Priority Processing", icon: "Zap" },
    ];
  }, [estimatorSettings]);

  // Selected state
  const [selectedSlug, setSelectedSlug] = useState<string>(() => cmsServices[0]?.slug || "3d-modeling");
  const [selectedCompId, setSelectedCompId] = useState<string>(() => complexities[1]?.id || "medium");
  const [selectedTimeId, setSelectedTimeId] = useState<string>(() => timelines[0]?.id || "flex");

  // Selected objects
  const currentService = cmsServices.find((s: any) => s.slug === selectedSlug) || cmsServices[0];
  const currentComp = complexities.find((c: any) => c.id === selectedCompId) || complexities[0];
  const currentTime = timelines.find((t: any) => t.id === selectedTimeId) || timelines[0];

  const basePrice = parsePriceNumber(currentService?.price, currentService?.base_price);
  const compMult = currentComp?.mult || 1.0;
  const timeMult = currentTime?.mult || 1.0;

  const calculatedTotal = basePrice * compMult * timeMult;
  const minPrice = Math.round(calculatedTotal * minFactor);
  const maxPrice = Math.round(calculatedTotal * maxFactor);

  const handleRequestQuote = () => {
    const serviceName = currentService?.title || "Custom Service";
    const compName = currentComp?.title || "Standard";
    const timeName = currentTime?.title || "Flexible";
    const estRange = `${currencySymbol}${minPrice.toLocaleString()} - ${currencySymbol}${maxPrice.toLocaleString()}`;

    navigate(`/contact?service=${encodeURIComponent(serviceName)}&complexity=${encodeURIComponent(compName)}&timeline=${encodeURIComponent(timeName)}&estimate=${encodeURIComponent(estRange)}`, {
      state: {
        service: serviceName,
        complexity: compName,
        timeline: timeName,
        estimate: estRange,
      }
    });
  };

  return (
    <section id="quote" className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(0,245,255,0.06),transparent_60%)]" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon-cyan/30 bg-neon-cyan/5 text-neon-cyan text-[10px] font-bold uppercase tracking-[3px] mb-6"
            >
              <Calculator size={14} />
              {badgeLabel}
            </motion.div>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
              {titlePrefix} <span className="text-neon-cyan">{titleHighlight}</span>
            </h2>
            <p className="text-gray-400 font-future tracking-wide max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
              {subtitle}
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            {/* Form Steps */}
            <div className="lg:col-span-8 space-y-8">
              <div className="glass-panel p-4 sm:p-8 md:p-10 rounded-[2rem] space-y-10 md:space-y-12">
                
                {/* Step 1: Select Service */}
                <div>
                  <div className="flex items-center gap-4 mb-6 md:mb-8">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neon-cyan/20 border border-neon-cyan/30 text-neon-cyan text-xs font-bold font-mono">
                      01
                    </span>
                    <h3 className="text-lg md:text-xl font-display font-bold uppercase tracking-widest text-white">
                      Service Category
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 md:gap-4">
                    {cmsServices.map((service: any) => {
                      const isSelected = selectedSlug === service.slug;
                      return (
                        <button
                          key={service.slug}
                          type="button"
                          onClick={() => setSelectedSlug(service.slug)}
                          className={`p-4 md:p-5 rounded-2xl border-2 transition-all group relative overflow-hidden flex flex-col items-center justify-center text-center min-h-[110px] ${
                            isSelected
                              ? "border-neon-cyan bg-neon-cyan/10 shadow-[0_0_20px_rgba(0,245,255,0.15)]"
                              : "border-white/5 bg-white/5 hover:border-neon-cyan/40 hover:bg-white/10"
                          }`}
                        >
                          <div className={`p-2 rounded-xl mb-2 inline-block ${isSelected ? 'text-neon-cyan' : 'text-gray-500 group-hover:text-neon-cyan'} transition-colors`}>
                            <IconMapper name={service.icon || 'Box'} size={22} />
                          </div>
                          <span className={`block font-bold text-[10px] md:text-xs uppercase tracking-wider leading-tight ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                            {service.title}
                          </span>
                          {service.price && (
                            <span className="text-[9px] text-gray-500 mt-1 font-mono">
                              {service.price}
                            </span>
                          )}
                          {isSelected && (
                            <motion.div layoutId="active-type" className="absolute top-2 right-2 text-neon-cyan">
                              <CheckCircle2 size={14} />
                            </motion.div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 2: Complexity Level */}
                <div>
                  <div className="flex items-center gap-4 mb-6 md:mb-8">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neon-purple/20 border border-neon-purple/30 text-neon-purple text-xs font-bold font-mono">
                      02
                    </span>
                    <h3 className="text-lg md:text-xl font-display font-bold uppercase tracking-widest text-white">
                      Complexity Level
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                    {complexities.map((c: any) => {
                      const isSelected = selectedCompId === c.id;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setSelectedCompId(c.id)}
                          className={`p-4 md:p-6 rounded-2xl border-2 transition-all text-left relative overflow-hidden group min-h-[100px] ${
                            isSelected
                              ? "border-neon-purple bg-neon-purple/10 shadow-[0_0_20px_rgba(191,0,255,0.15)]"
                              : "border-white/5 bg-white/5 hover:border-neon-purple/40 hover:bg-white/10"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className={`p-2 rounded-lg ${isSelected ? 'text-neon-purple' : 'text-gray-500 group-hover:text-neon-purple'} transition-colors`}>
                              <IconMapper name={c.icon || "Cpu"} size={18} />
                            </div>
                            {isSelected && (
                              <motion.div layoutId="active-comp" className="text-neon-purple">
                                <CheckCircle2 size={14} />
                              </motion.div>
                            )}
                          </div>
                          <h4 className={`font-bold text-[10px] md:text-xs uppercase tracking-wider ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                            {c.title}
                          </h4>
                          {c.desc && (
                            <p className="text-[9px] text-gray-500 mt-1 font-mono uppercase tracking-tighter leading-tight">
                              {c.desc}
                            </p>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 3: Time Constraints */}
                <div>
                  <div className="flex items-center gap-4 mb-6 md:mb-8">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neon-green/20 border border-neon-green/30 text-neon-green text-xs font-bold font-mono shrink-0">
                      03
                    </span>
                    <h3 className="text-lg md:text-xl font-display font-bold uppercase tracking-widest text-white">
                      Time Constraints
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    {timelines.map((t: any) => {
                      const isSelected = selectedTimeId === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setSelectedTimeId(t.id)}
                          className={`p-4 md:p-5 rounded-2xl border-2 transition-all flex flex-col justify-between text-left relative overflow-hidden group min-h-[90px] w-full ${
                            isSelected
                              ? "border-neon-green bg-neon-green/10 shadow-[0_0_20px_rgba(57,255,20,0.15)] ring-1 ring-neon-green/50"
                              : "border-white/10 bg-white/5 hover:border-neon-green/40 hover:bg-white/10"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full mb-2">
                            <span className={`font-bold text-xs uppercase tracking-wider ${isSelected ? 'text-neon-green' : 'text-white'}`}>
                              {t.title}
                            </span>
                            {isSelected && (
                              <CheckCircle2 size={16} className="text-neon-green shrink-0" />
                            )}
                          </div>
                          {t.desc && (
                            <p className="text-[10px] text-gray-400 font-mono uppercase leading-tight">
                              {t.desc}
                            </p>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>

            {/* Estimate Summary Panel */}
            <div className="lg:col-span-4 mt-8 lg:mt-0">
              <div className="sticky top-24 space-y-6">
                <div className="glass-panel p-6 md:p-8 rounded-[2rem] border-neon-cyan/30 bg-black/60 relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 w-36 h-36 bg-neon-cyan/10 rounded-full -translate-y-16 translate-x-16 blur-3xl" />
                  
                  <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-neon-cyan/20 border border-neon-cyan/40 flex items-center justify-center text-neon-cyan shrink-0">
                        <Zap size={20} />
                      </div>
                      <div>
                        <h2 className="font-display text-lg font-bold uppercase tracking-wider text-white">Summary</h2>
                        <span className="text-[9px] text-neon-cyan font-mono tracking-widest uppercase">Live Breakdown</span>
                      </div>
                    </div>
                  </div>

                  {/* Price Box - Primary Visual Focus */}
                  <div className="bg-black/60 rounded-2xl p-6 border border-neon-cyan/30 relative mb-6 text-center shadow-inner overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-neon-cyan/10 via-transparent to-neon-purple/10 pointer-events-none" />
                    <p className="text-[10px] uppercase text-gray-400 tracking-[3px] mb-3 font-mono font-bold">
                      ESTIMATED BUDGET WINDOW
                    </p>
                    <div className="text-3xl md:text-4xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-neon-purple leading-none py-1">
                      {currencySymbol}{minPrice.toLocaleString()} – {currencySymbol}{maxPrice.toLocaleString()}
                    </div>
                    <div className="flex items-center justify-center gap-4 mt-4 text-[10px] font-mono text-gray-400 uppercase tracking-widest pt-3 border-t border-white/10">
                      <span>MIN: {currencySymbol}{minPrice.toLocaleString()}</span>
                      <span className="text-neon-cyan">•</span>
                      <span>MAX: {currencySymbol}{maxPrice.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Selected Breakdown Items */}
                  <div className="space-y-2.5 mb-6">
                    <div className="flex justify-between items-center bg-white/5 p-3.5 rounded-xl border border-white/10">
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider font-mono">Service</span>
                      <span className="text-xs font-bold text-neon-cyan uppercase text-right truncate ml-2">
                        {currentService?.title}
                      </span>
                    </div>
                    <div className="flex justify-between items-center bg-white/5 p-3.5 rounded-xl border border-white/10">
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider font-mono">Complexity</span>
                      <span className="text-xs font-bold text-neon-purple uppercase text-right truncate ml-2">
                        {currentComp?.title}
                      </span>
                    </div>
                    <div className="flex justify-between items-center bg-white/5 p-3.5 rounded-xl border border-white/10">
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider font-mono">Timeline</span>
                      <span className="text-xs font-bold text-neon-green uppercase text-right truncate ml-2">
                        {currentTime?.title}
                      </span>
                    </div>
                    {currentService?.delivery_time && (
                      <div className="flex justify-between items-center bg-white/5 p-3.5 rounded-xl border border-white/10">
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider font-mono">Est. Duration</span>
                        <span className="text-xs font-bold text-white uppercase text-right truncate ml-2 font-mono">
                          {currentService.delivery_time}
                        </span>
                      </div>
                    )}
                  </div>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleRequestQuote}
                    className="w-full py-4.5 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink text-white font-display font-bold uppercase rounded-2xl flex items-center justify-center gap-3 transition-all tracking-widest text-xs shadow-[0_0_25px_rgba(0,245,255,0.3)] hover:shadow-[0_0_40px_rgba(0,245,255,0.6)] cursor-pointer"
                  >
                    Request Proposal
                    <Send size={16} />
                  </motion.button>
                  
                  <p className="text-[9px] text-gray-400 mt-4 text-center italic leading-relaxed uppercase tracking-wider font-mono">
                    {disclaimer}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

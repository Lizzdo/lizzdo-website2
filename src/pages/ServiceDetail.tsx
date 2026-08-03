import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, CheckCircle2, Zap, Layers, ChevronRight, Calculator } from "lucide-react";
import DocumentHead from "../components/DocumentHead";
import { getCollection, toArray } from "../lib/content";
import { IconMapper } from "../components/IconMapper";
import TechGrid from "../components/TechGrid";
import Markdown from "react-markdown";
import Lightbox from "../components/Lightbox";
import EstimatorCTA from "../components/EstimatorCTA";

export default function ServiceDetail() {
  const { slug } = useParams();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  
  const rawServices = useMemo(() => getCollection(import.meta.glob('../content/services/*.json', { eager: true })), []);
  
  const service = rawServices.find((s: any) => s.slug === slug);
  const relatedServices = useMemo(() => {
    if (!service) return [];
    return rawServices
      .filter((s: any) => s.slug !== slug && (s.category === service.category || s.published !== false))
      .slice(0, 3);
  }, [rawServices, service, slug]);
  
  if (!service) {
    return (
      <div className="flex flex-col min-h-[70vh] items-center justify-center text-center px-6">
        <DocumentHead title="Service Not Found" />
        <h1 className="font-display text-5xl md:text-7xl font-black mb-6 uppercase text-white">
          SERVICE <span className="holo-text">NOT FOUND</span>
        </h1>
        <p className="text-gray-400 font-future text-xl mb-10">
          The service you are looking for does not exist or has been removed.
        </p>
        <Link to="/services" className="inline-flex items-center gap-3 px-8 py-4 rounded-xl border border-white/10 hover:border-neon-cyan text-white hover:text-neon-cyan text-sm font-bold uppercase tracking-[2px] transition-all">
          <ArrowLeft size={16} /> Return to Services
        </Link>
      </div>
    );
  }

  const {
    title,
    description,
    body,
    category,
    icon,
    color,
    features,
    benefits,
    process,
    deliverables,
    tech,
    price,
    delivery_time,
    cta_text,
    cta_url,
    gallery,
    thumbnail,
    seo_title,
    seo_description
  } = service;
  
  const bgAccent = `bg-${color}/5`;
  const borderColor = `border-${color}/20`;
  const textColor = `text-${color}`;

  const parsedTech = toArray(tech).map((t: any) => ({
    ...t,
    svg: t.iconName ? <IconMapper name={t.iconName} size={20} /> : <div />
  }));

  const galleryImages = toArray(gallery).map((img: any) => typeof img === 'string' ? img : (img.image || img)).filter(Boolean);

  return (
    <div className="flex flex-col min-h-screen">
      <DocumentHead title={seo_title || title} description={seo_description || description} />
      
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="container mx-auto max-w-5xl relative z-10">
          <Link to="/services" className="inline-flex items-center gap-2 text-xs font-mono text-neon-cyan hover:text-white transition-colors mb-12 uppercase tracking-widest">
            <ArrowLeft size={14} /> Back to Services
          </Link>
          
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-16 h-16 rounded-2xl ${bgAccent} border ${borderColor} flex items-center justify-center ${textColor}`}>
               {icon && <IconMapper name={icon} size={32} />}
            </div>
            <span className={`px-4 py-1.5 rounded-full font-mono text-[9px] uppercase tracking-widest ${textColor} ${bgAccent} border ${borderColor}`}>
               {category}
            </span>
          </div>
          
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-5xl md:text-7xl font-black mb-8 uppercase text-white">
            {title}
          </motion.h1>
          
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-future text-xl text-gray-300 leading-relaxed mb-12">
            {description}
          </motion.p>
          
          {thumbnail && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="aspect-video rounded-3xl overflow-hidden border border-white/10 mb-16 relative">
              <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <div className="prose prose-invert prose-neon max-w-none font-future text-gray-300">
                 {body && <Markdown>{body}</Markdown>}
              </div>

              {benefits && benefits.length > 0 && (
                <div className="pt-8 border-t border-white/10">
                  <h3 className="font-display text-2xl font-bold uppercase mb-6 text-white tracking-wider flex items-center gap-3">
                    <Zap className={textColor} size={20} /> Key Benefits
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {toArray(benefits).map((benefit: any, idx: number) => (
                      <div key={idx} className="glass-panel p-5 rounded-2xl border border-white/5 flex items-start gap-3">
                        <CheckCircle2 className={`${textColor} shrink-0 mt-0.5`} size={18} />
                        <span className="font-future text-sm text-gray-200">{typeof benefit === 'string' ? benefit : benefit.title || benefit.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {process && process.length > 0 && (
                <div className="pt-8 border-t border-white/10">
                  <h3 className="font-display text-2xl font-bold uppercase mb-6 text-white tracking-wider flex items-center gap-3">
                    <Layers className={textColor} size={20} /> Development Process
                  </h3>
                  <div className="space-y-4">
                    {toArray(process).map((step: any, idx: number) => (
                      <div key={idx} className="glass-panel p-6 rounded-2xl border border-white/5 flex gap-4">
                        <div className={`w-8 h-8 rounded-full ${bgAccent} border ${borderColor} ${textColor} flex items-center justify-center font-mono font-bold text-xs shrink-0`}>
                          0{idx + 1}
                        </div>
                        <div>
                          <h4 className="font-display text-base font-bold text-white mb-1 uppercase">{step.step || step.title || `Phase ${idx + 1}`}</h4>
                          <p className="font-future text-sm text-gray-400">{step.description || step.desc || step}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {galleryImages.length > 0 && (
                <div className="pt-8 border-t border-white/10">
                  <h3 className="font-display text-2xl font-bold uppercase mb-6 text-white tracking-wider">Service Showcase Gallery</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {galleryImages.map((img: string, idx: number) => (
                      <div 
                        key={idx} 
                        className="aspect-video rounded-2xl overflow-hidden border border-white/10 cursor-pointer group relative bg-slate-900"
                        onClick={() => setLightboxIndex(idx)}
                      >
                        <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <div className="glass-panel p-8 rounded-3xl sticky top-32">
                <div className="mb-8">
                  <span className="font-mono text-[10px] tracking-[2px] text-gray-500 block mb-2 uppercase">Starting at</span>
                  <div className="font-display text-3xl font-bold text-white">{price || "Custom Quote"}</div>
                  {delivery_time && (
                    <span className="font-mono text-xs text-gray-400 mt-2 block">Est. Delivery: {delivery_time}</span>
                  )}
                </div>
                
                <h4 className="font-display text-sm font-bold uppercase mb-4 tracking-[1px]">Features</h4>
                <div className="space-y-3 mb-8">
                  {toArray(features).map((feature: any, i: number) => (
                    <div key={i} className="flex items-start gap-3 text-sm text-gray-300 font-future">
                      <CheckCircle2 className={textColor} size={16} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                
                {(deliverables && deliverables.length > 0) && (
                  <>
                    <h4 className="font-display text-sm font-bold uppercase mb-4 tracking-[1px]">Deliverables</h4>
                    <div className="space-y-3 mb-8">
                      {toArray(deliverables).map((item: any, i: number) => (
                        <div key={'d'+i} className="flex items-start gap-3 text-sm text-gray-300 font-future">
                          <CheckCircle2 className={textColor} size={16} />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                
                {parsedTech.length > 0 && (
                  <>
                    <h4 className="font-display text-sm font-bold uppercase mb-4 tracking-[1px]">Tech Stack</h4>
                    <div className="mb-8">
                      <TechGrid techs={parsedTech} />
                    </div>
                  </>
                )}
                
                <Link to={cta_url || "/contact"} className={`w-full block py-4 rounded-xl ${bgAccent} border ${borderColor} ${textColor} text-center font-display font-bold text-xs tracking-[2px] hover:bg-white hover:text-black hover:border-white transition-all`}>
                  {cta_text || "REQUEST QUOTE"}
                </Link>

                <div className="mt-6 pt-6 border-t border-white/10 text-center">
                  <Link to="/estimator" className="inline-flex items-center gap-2 text-xs font-display font-bold uppercase tracking-wider text-neon-cyan hover:text-white transition-colors">
                    <Calculator size={14} /> Calculate Budget Range
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Estimator CTA Banner */}
          <div className="mt-16">
            <EstimatorCTA
              title={`ESTIMATE YOUR ${title.toUpperCase()} BUDGET`}
              subtitle="Configure your desired complexity, deadline urgency, and features to calculate an instant cost range."
              variant="card"
            />
          </div>

          {/* Related Services */}
          {relatedServices.length > 0 && (
            <div className="mt-24 pt-16 border-t border-white/10">
              <h3 className="font-display text-2xl font-black mb-8 text-white uppercase tracking-widest">
                Related <span className="text-neon-cyan">Services</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedServices.map((rel: any) => (
                  <Link key={rel.slug} to={`/services/${rel.slug}`} className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-neon-cyan/40 transition-all group flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 rounded-full font-mono text-[9px] uppercase tracking-widest text-neon-cyan bg-neon-cyan/10 border border-neon-cyan/20">
                          {rel.category}
                        </span>
                        <ChevronRight size={18} className="text-gray-500 group-hover:text-neon-cyan group-hover:translate-x-1 transition-all" />
                      </div>
                      <h4 className="font-display font-bold text-lg text-white group-hover:text-neon-cyan transition-colors mb-2 uppercase">{rel.title}</h4>
                      <p className="font-future text-xs text-gray-400 line-clamp-2">{rel.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Lightbox 
        images={galleryImages} 
        isOpen={lightboxIndex !== null} 
        initialIndex={lightboxIndex || 0} 
        onClose={() => setLightboxIndex(null)} 
      />
    </div>
  );
}

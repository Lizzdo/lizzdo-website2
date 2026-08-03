import { useMemo } from "react";
import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import DocumentHead from "../components/DocumentHead";
import TechGrid, { TechItem } from "../components/TechGrid";
import { IconMapper } from "../components/IconMapper";
import EstimatorCTA from "../components/EstimatorCTA";
import { getCollection, getSingle, toArray, sortByOrder } from "../lib/content";

export default function Services() {
  const pageData = useMemo(() => getSingle(import.meta.glob('../content/pages/services.json', { eager: true })), []);
  const rawServices = useMemo(() => {
    const srvs = getCollection(import.meta.glob('../content/services/*.json', { eager: true }));
    return srvs.sort(sortByOrder);
  }, []);

  const { workflow, trustSections } = pageData || {};

  const services = rawServices.filter((s: any) => s.published !== false).map((service: any) => {
    return {
      ...service,
      color: `text-${service.color}`,
      bgAccent: `bg-${service.color}/5`,
      borderColor: `border-${service.color}/20`,
      hoverShadow: `hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]`,
      tech: toArray(service.tech).map((t: any) => ({
        ...t,
        svg: t.iconName ? <IconMapper name={t.iconName} size={20} /> : <div />
      }))
    };
  });

  return (
    <div className="flex flex-col">
      <DocumentHead title="LIZZDO Services | 3D Modeling, Game Assets & Web Development" description="Explore LIZZDO services. We specialize in high-quality 3D modeling, Unity and Roblox game development, and custom web applications for modern brands." />
      {/* Hero Section */}
      <section className="py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <span className="font-mono text-xs tracking-[4px] text-neon-cyan uppercase">
              // SERVICE CATALOG
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="font-display text-5xl md:text-7xl font-black mb-8"
          >
            OUR <span className="holo-text">EXPERTISE</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-future text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
          >
            Specialized 3D disciplines engineered for the next generation of digital experiences. 
            Transparent pricing, clear deliverables, and obsessive quality.
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <motion.div
                key={service.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`glass-panel p-8 rounded-3xl flex flex-col h-full border ${service.borderColor} hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(255,255,255,0.05)] ${service.hoverShadow} transition-all duration-500 relative z-10 group overflow-hidden`}
              >
                {/* Background Glow Image Option */}
                {service.thumbnail && (
                  <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none">
                     <img src={service.thumbnail} alt={service.title} className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000" />
                  </div>
                )}

                {/* Absolute Category Badge */}
                <div className="absolute top-6 right-6 z-10 pointer-events-none">
                  <span className={`px-4 py-1.5 rounded-full font-mono text-[9px] uppercase tracking-widest ${service.color} ${service.bgAccent} border ${service.borderColor}`}>
                    {service.category}
                  </span>
                </div>

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-8 mt-6">
                    <div className={`w-14 h-14 rounded-2xl ${service.bgAccent} border ${service.borderColor} flex items-center justify-center ${service.color} group-hover:scale-110 transition-transform duration-500`}>
                      {service.icon && <IconMapper name={service.icon} size={28} />}
                    </div>
                    <span className="font-mono text-[10px] tracking-[2px] text-gray-500">
                      {service.price}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-bold mb-1 tracking-[1px] uppercase">
                      {service.title}
                    </h3>
                    <p className={`font-mono text-[10px] uppercase tracking-widest mb-4 ${service.color}`}>[{service.slug}]</p>
                  </div>
                  <p className="text-gray-400 font-future mb-8 leading-relaxed text-sm">
                    {service.description || "Default description"}
                  </p>
                
                <div className="flex-grow flex flex-col mb-8">
                  <div className="space-y-3 mb-6">
                    {toArray(service.features).map((feature: any) => (
                      <div key={feature} className="flex items-center gap-3 text-xs text-gray-300">
                        <CheckCircle2 className={`${service.color}`} size={14} />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <TechGrid techs={service.tech as TechItem[]} />
                </div>

                <Link
                  to={`/services/${service.slug}`}
                  className={`w-full py-4 rounded-xl border ${service.borderColor} text-center font-display font-bold text-xs tracking-[2px] hover:bg-white hover:text-black transition-all`}
                >
                  VIEW DETAILS
                </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 px-6 bg-black/30 relative overflow-hidden">
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-20">
            <span className="font-mono text-xs tracking-[4px] text-neon-purple uppercase mb-4 block">
              // METHODOLOGY
            </span>
            <h2 className="font-display text-4xl md:text-6xl font-bold">
              OUR PROCESS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
            {toArray(workflow).sort(sortByOrder).map((step: any, i: number) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="relative flex flex-col items-center text-center group"
              >
                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center font-display text-2xl font-black text-white mb-8 shadow-[0_0_30px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-500 z-10`}>
                  {step.step}
                </div>
                <h3 className="font-display text-xl font-bold mb-4 tracking-[2px]">
                  {step.title}
                </h3>
                <p className="text-gray-400 font-future text-sm leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Preview or Trust Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {toArray(trustSections).sort(sortByOrder).map((section: any) => (
              <div key={section.title} className="space-y-6">
                <h3 className={`text-2xl font-display font-bold ${section.color} flex items-center gap-3`}>
                  {section.icon && <IconMapper name={section.icon} size={24} />}
                  {section.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {section.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Estimator CTA Banner */}
      <EstimatorCTA
        title="NEED A TAILORED SERVICE ESTIMATE?"
        subtitle="Combine 3D modeling, game development, mobile apps, or web development into a single custom budget estimate."
        buttonText="Estimate My Project"
        variant="banner"
      />
    </div>
  );
}

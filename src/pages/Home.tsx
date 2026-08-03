import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight,
  Cpu,
  Calendar,
  Clock,
  ChevronDown,
  Calculator
} from "lucide-react";
import ThreeHero from "../components/ThreeHero";
import ProjectEstimator from "../components/ProjectEstimator";
import DocumentHead from "../components/DocumentHead";
import SmartCardImage from "../components/SmartCardImage";
import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { getSingle, getCollection, toArray, sortByOrder } from "../lib/content";
import Markdown from "react-markdown";
import { IconMapper } from "../components/IconMapper";

export default function Home() { // CMS connected
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const pageData = useMemo(() => getSingle(import.meta.glob('../content/pages/home.json', { eager: true })), []);
  
  const allServices = useMemo(() => {
    const srvs = getCollection(import.meta.glob('../content/services/*.json', { eager: true }));
    return srvs.sort(sortByOrder);
  }, []);
  const allProjects = useMemo(() => getCollection(import.meta.glob('../content/portfolio/*.json', { eager: true })), []);
  const allPosts = useMemo(() => getCollection(import.meta.glob('../content/blog/*.json', { eager: true })), []);
  const allClients = useMemo(() => getCollection(import.meta.glob('../content/clients/*.json', { eager: true })), []);
  const allTestimonials = useMemo(() => getCollection(import.meta.glob('../content/testimonials/*.json', { eager: true })), []);
  const allFaqs = useMemo(() => getCollection(import.meta.glob('../content/faq/*.json', { eager: true })), []);

  const { 
    hero, 
    statistics, 
    featured_services, 
    featured_portfolio, 
    featured_clients,
    testimonials, 
    faqs: faqs_section,
    featured_blog,
    cta 
  } = pageData || {};

  // Sort and filter latest
  const posts = featured_blog?.blog_list?.length > 0 
    ? featured_blog.blog_list.map((slug: string) => allPosts.find((p: any) => p.slug === slug)).filter(Boolean)
    : allPosts.sort(sortByOrder).slice(0, 3);

  let projects = featured_portfolio?.portfolio_list?.length > 0
    ? featured_portfolio.portfolio_list.map((slug: string) => allProjects.find((p: any) => p.slug === slug)).filter(Boolean)
    : allProjects.filter((p: any) => p.published !== false && p.featured === true).slice(0, 3);
    
  if (projects.length === 0) {
    projects = allProjects.filter((p: any) => p.published !== false).slice(0, 3);
  }

  let services = featured_services?.services_list?.length > 0
    ? featured_services.services_list.map((slug: string) => allServices.find((s: any) => s.slug === slug)).filter(Boolean)
    : allServices.filter((s: any) => s.published !== false && s.featured === true).slice(0, 8);
    
  if (services.length === 0) {
    services = allServices.filter((s: any) => s.published !== false).slice(0, 8);
  }

  let faqs = faqs_section?.faqs_list?.length > 0
    ? faqs_section.faqs_list.map((slug: string) => allFaqs.find((f: any) => f.slug === slug)).filter(Boolean)
    : allFaqs.filter((f: any) => f.published !== false && f.featured === true).sort(sortByOrder).slice(0, 6);
    
  if (faqs.length === 0) {
    faqs = allFaqs.filter((f: any) => f.published !== false).sort(sortByOrder).slice(0, 6);
  }

  const featuredClients = featured_clients?.clients_list?.length > 0
    ? featured_clients.clients_list.map((slug: string) => allClients.find((c: any) => c.slug === slug)).filter(Boolean)
    : allClients.filter((c: any) => c.featured === true).slice(0, 5);
    
  if (featuredClients.length === 0) {
    featuredClients.push(...allClients.slice(0, 5));
  }

  let testimonialsList = toArray(testimonials?.list || []).sort(sortByOrder);
  if (testimonialsList.length === 0) {
    testimonialsList = allTestimonials.slice(0, 3);
  }

  if (!pageData) return <div className="p-20 text-center text-white">Loading...</div>;

  return (
    <div className="flex flex-col">
      <DocumentHead title="LIZZDO | Premier 3D Design, Animation & Web Development Studio" description="LIZZDO is a global creative studio specializing in stunning 3D animation, game development, and custom web applications. Bring your digital vision to life." />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <ThreeHero />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon-cyan/30 bg-neon-cyan/5 text-neon-cyan text-[10px] font-bold uppercase tracking-[3px] mb-8"
          >
            <Cpu size={14} className="animate-pulse" />
            Next-Gen Digital Studio
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-display font-black leading-tight mb-8 uppercase"
          >
            {hero?.highlight ? (
              <>
                {hero.headline} <br />
                <span className="holo-text">{hero.highlight}</span>
              </>
            ) : (
              <>
                {hero?.headline?.split(' ').slice(0, -2).join(' ')} <br />
                <span className="holo-text">{hero?.headline?.split(' ').slice(-2).join(' ')}</span>
              </>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-future tracking-wide"
          >
            {hero?.description || hero?.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            {hero?.secondary_btn && (
              <Link
                to={hero.secondary_url}
                className="px-10 py-4 rounded-xl bg-white text-black font-display font-bold uppercase text-sm tracking-[2px] hover:bg-neon-cyan transition-all"
              >
                {hero.secondary_btn}
              </Link>
            )}
            <Link
              to={hero?.primary_url || "/contact"}
              className="px-10 py-4 rounded-xl border-2 border-neon-cyan text-neon-cyan font-display font-bold uppercase text-sm tracking-[2px] hover:bg-neon-cyan/10 transition-all flex items-center gap-2"
            >
              {hero?.primary_btn || "Order Custom Work"}
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-white/5 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {toArray(statistics).sort(sortByOrder).map((stat: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-display font-black text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-[10px] uppercase tracking-[3px] text-neon-cyan font-mono flex items-center justify-center gap-2">
                  {stat.icon && <IconMapper name={stat.icon} size={14} />}
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 uppercase">
              {featured_services?.title || "PREMIUM SERVICES"}
            </h2>
            <div className="cyber-line max-w-xs mx-auto mb-6" />
            <p className="text-gray-400 font-future tracking-wide mb-6">{featured_services?.subtitle}</p>
            {featured_services?.btn_text && featured_services?.btn_url && (
              <Link to={featured_services.btn_url} className="inline-flex px-8 py-3 rounded-xl border border-white/10 hover:border-neon-cyan text-xs font-bold uppercase tracking-widest transition-all">
                {featured_services.btn_text}
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service: any, i: number) => (
              <motion.div
                key={service.slug || i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel p-8 rounded-3xl group"
              >
                <div className={`w-14 h-14 bg-neon-cyan/10 text-neon-cyan rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                  <IconMapper name={service.icon || 'Box'} size={32} />
                </div>
                <h3 className="text-xl font-display font-bold mb-4">{service.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  {service.description}
                </p>
                <Link to={`/services/${service.slug}`} className="text-neon-cyan text-xs font-bold uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
                  Learn More <ArrowRight size={14} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Portfolio Preview */}
      <section id="portfolio" className="py-32 bg-black/30">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 uppercase">
                {featured_portfolio?.title || "FEATURED WORKS"}
              </h2>
              <p className="text-gray-400 font-future tracking-wide">{featured_portfolio?.subtitle}</p>
            </div>
            <Link to={featured_portfolio?.btn_url || "/portfolio"} className="px-8 py-3 rounded-xl border border-white/10 hover:border-neon-purple text-xs font-bold uppercase tracking-widest transition-all">
              {featured_portfolio?.btn_text || "View All Projects"}
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.length > 0 ? projects.map((project: any) => (
              <motion.div
                key={project.slug}
                whileHover={{ y: -10 }}
                className="glass-panel rounded-3xl overflow-hidden group cursor-pointer flex flex-col h-full"
              >
                <Link to={`/portfolio/${project.slug}`} className="block relative overflow-hidden flex-1">
                  <SmartCardImage
                    src={project.thumbnail || project.image || "/lizzdo-logo.png"}
                    alt={project.title}
                    aspectRatio="video"
                    fit="smart"
                    overlay={
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent flex flex-col justify-end p-6">
                        <span className="text-[10px] font-bold text-neon-cyan uppercase tracking-widest mb-2 block">
                          Featured Project
                        </span>
                        <h3 className="text-xl font-display font-bold text-white group-hover:text-neon-cyan transition-colors line-clamp-1">{project.title}</h3>
                      </div>
                    }
                  />
                </Link>
              </motion.div>
            )) : (
              [1, 2, 3].map((item) => (
                <div key={item} className="aspect-video glass-panel rounded-3xl animate-pulse" />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Estimate Your Project CTA Section */}
      <section id="quote" className="py-24 md:py-32 bg-black/40 relative overflow-hidden border-y border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,245,255,0.08),transparent_70%)]" />
        <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon-cyan/30 bg-neon-cyan/10 text-neon-cyan text-[10px] font-bold uppercase tracking-[3px] mb-6 shadow-[0_0_20px_rgba(0,245,255,0.15)]"
          >
            <Calculator size={14} />
            INSTANT ESTIMATOR TOOL
          </motion.div>
          
          <h2 className="text-3xl md:text-5xl font-display font-black mb-6 tracking-tight">
            ESTIMATE YOUR <span className="text-neon-cyan">PROJECT BUDGET</span>
          </h2>
          
          <p className="text-gray-300 font-future text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Planning a 3D project, website, mobile app, AI solution, game, or custom software? Get an instant estimate before requesting a quote.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/estimator"
              className="w-full sm:w-auto px-8 py-5 rounded-2xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-display font-bold uppercase text-xs tracking-[2px] shadow-[0_0_25px_rgba(0,245,255,0.3)] hover:shadow-[0_0_40px_rgba(0,245,255,0.6)] hover:scale-105 transition-all flex items-center justify-center gap-3"
            >
              Estimate My Project
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

            {/* Featured Clients Section */}
      <section className="py-20 border-y border-white/5 bg-black/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <span className="font-mono text-xs tracking-[4px] text-neon-cyan uppercase mb-4 block">// TRUSTED BY</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold uppercase">{featured_clients?.title || "OUR PARTNERS"}</h2>
            <p className="text-gray-400 font-future mt-4">{featured_clients?.subtitle}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all">
            {featuredClients.map((client: any, i: number) => (
              <div key={i} className="text-xl font-display font-bold text-gray-500 uppercase flex items-center gap-2">
                 {client.clientLogoUrl ? <img src={client.clientLogoUrl} alt={client.title} className="h-8 object-contain" /> : null}
                 {client.title}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="font-mono text-xs tracking-[4px] text-neon-purple uppercase mb-4 block">// CLIENT SUCCESS</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold uppercase">{testimonials?.title || "TESTIMONIALS"}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonialsList.map((test: any, i: number) => (
              <div key={i} className="glass-panel p-8 rounded-3xl">
                <p className="text-gray-400 font-future mb-6 italic">"{test.quote}"</p>
                <div className="flex items-center gap-4">
                  {test.thumbnail && <img src={test.thumbnail} alt={test.author} className="w-12 h-12 rounded-full object-cover" />}
                  <div>
                    <h4 className="font-display font-bold text-white uppercase">{test.author}</h4>
                    <p className="text-xs text-neon-cyan font-mono">{test.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Preview Section */}
      <section className="py-32 bg-black/30 relative">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <span className="font-mono text-xs tracking-[4px] text-neon-cyan uppercase mb-4 block">// KNOWLEDGE BASE</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              {faqs_section?.title?.split(" ").slice(0, -1).join(" ")} <span className="text-neon-cyan">{faqs_section?.title?.split(" ").slice(-1).join(" ")}</span>
            </h2>
            <p className="text-gray-400 font-future max-w-2xl mx-auto">
              {faqs_section?.subtitle}
            </p>
          </div>

          <div className="space-y-4 mb-16">
            {faqs.map((faq: any, i: number) => {
              const isOpen = openFaq === faq.slug;
              return (
                <motion.div
                  key={faq.slug || i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`glass-panel overflow-hidden border p-1 rounded-2xl transition-all duration-300 ${
                    isOpen ? "border-neon-cyan/50 bg-white/[0.03] shadow-[0_0_30px_-5px_rgba(0,255,255,0.1)]" : "border-white/5 hover:border-white/10"
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : faq.slug)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left group transition-colors rounded-xl focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className={`font-display font-bold text-lg pr-8 transition-colors ${isOpen ? "text-neon-cyan" : "text-white group-hover:text-neon-cyan/80"}`}>
                      {faq.question}
                    </span>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 flex-shrink-0 ${isOpen ? "border-neon-cyan bg-neon-cyan/10 text-neon-cyan" : "border-white/10 bg-white/5 group-hover:border-neon-cyan/50 group-hover:bg-neon-cyan/5 text-gray-400"}`}>
                      <ChevronDown 
                        className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                        size={20}
                      />
                    </div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-2 text-gray-400 font-future leading-relaxed prose prose-invert max-w-none">
                          <div className="w-12 h-1 bg-neon-cyan/20 rounded-full mb-4"></div>
                          <Markdown>{faq.answer}</Markdown>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center">
            <Link 
              to={faqs_section?.btn_url || "/faq"} 
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30 hover:bg-neon-cyan hover:text-dark-navy text-xs font-bold uppercase tracking-widest transition-all shadow-[0_0_20px_-5px_rgba(0,255,255,0.3)] hover:shadow-[0_0_30px_0px_rgba(0,255,255,0.5)]"
            >
              {faqs_section?.btn_text || "View All FAQs"} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Blogs Section */}
      <section className="py-32 bg-slate-950/50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div>
              <span className="font-mono text-xs tracking-[4px] text-neon-cyan uppercase mb-4 block">// INSIGHTS</span>
              <h2 className="text-4xl md:text-5xl font-display font-bold">
                {featured_blog?.title?.split(" ").slice(0, -2).join(" ")} <span className="text-neon-cyan">{featured_blog?.title?.split(" ").slice(-2).join(" ")}</span>
              </h2>
            </div>
            <Link to={featured_blog?.btn_url || "/blog"} className="px-8 py-3 rounded-xl border border-white/10 hover:border-neon-cyan text-xs font-bold uppercase tracking-widest transition-all">
              {featured_blog?.btn_text || "Read All Articles"}
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.length > 0 ? (
              posts.map((post: any, i: number) => (
                <motion.article
                  key={post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-panel rounded-3xl overflow-hidden group flex flex-col h-full"
                >
                  <Link to={`/blog/${post.slug}`} className="block relative overflow-hidden">
                    <SmartCardImage
                      src={post.thumbnail || post.image || "/lizzdo-logo.png"}
                      alt={post.title}
                      aspectRatio="video"
                      fit="smart"
                    />
                  </Link>
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex items-center gap-4 text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-4">
                      <span className="flex items-center gap-1.5"><Calendar size={12} /> {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span className="flex items-center gap-1.5"><Clock size={12} /> 5 min read</span>
                    </div>
                    <h3 className="font-display text-lg font-bold mb-4 group-hover:text-neon-cyan transition-colors leading-tight">
                      <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <Link 
                      to={`/blog/${post.slug}`} 
                      className="inline-flex items-center gap-2 text-neon-cyan text-[10px] font-bold uppercase tracking-widest group/link mt-auto"
                    >
                      Read More <ArrowRight size={12} className="group-hover/link:translate-x-2 transition-transform" />
                    </Link>
                  </div>
                </motion.article>
              ))
            ) : (
              <div className="col-span-full py-10 text-center">
                <p className="font-mono text-gray-500 uppercase tracking-widest text-sm">No transmissions found.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto glass-panel p-12 md:p-20 rounded-[3rem] relative overflow-hidden">
            {cta?.bg_image && <img src={cta.bg_image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink z-10" />
            <h2 className="text-4xl md:text-6xl font-display font-black mb-8 uppercase relative z-10">
              {cta?.headline?.split(' ').slice(0, -1).join(' ')} <span className="holo-text">{cta?.headline?.split(' ').slice(-1).join(' ')}</span>
            </h2>
            <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto relative z-10">
              {cta?.description || cta?.subtitle}
            </p>
            <Link
              to={cta?.btn_url || "/contact"}
              className="inline-flex items-center gap-3 px-12 py-5 rounded-2xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-display font-bold text-xl uppercase tracking-[2px] hover:shadow-[0_0_30px_rgba(0,245,255,0.4)] transition-all relative z-10"
            >
              {cta?.btn_text || "Start Your Project"}
              <ArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

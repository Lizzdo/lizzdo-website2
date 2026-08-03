import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, X, ExternalLink, Github, Download, CheckCircle2, LayoutGrid, ChevronLeft, ChevronRight, Play, Calculator } from "lucide-react";
import DocumentHead from "../components/DocumentHead";
import SmartCardImage from "../components/SmartCardImage";
import ReactMarkdown from "react-markdown";
import Lightbox from "../components/Lightbox";
import VideoPlayer from "../components/VideoPlayer";
import EstimatorCTA from "../components/EstimatorCTA";
import { getCollection, sortByOrder } from "../lib/content";


const toArray = (val: any) => {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') return val.split(',').map(s => s.trim()).filter(Boolean);
  return [];
};

export default function Project() {
  const { slug } = useParams();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const { project, relatedProjects, allProjects } = useMemo(() => {
    const rawItems = getCollection(import.meta.glob('../content/portfolio/*.json', { eager: true }));
    const items = rawItems.filter((f: any) => f.published !== false).sort(sortByOrder).map((file: any) => ({
      id: file.slug,
      title: file.title,
      slug: file.slug,
      category: (() => { const arr = toArray(file.categories); return arr.length ? arr : ["UNCATEGORIZED"]; })(),
      desc: file.description,
      body: file.body,
      image: file.thumbnail || "/lizzdo-logo.png",
      gallery: toArray(file.gallery),
      tags: toArray(file.tags),
      software: toArray(file.software),
      technologies: toArray(file.technologies),
      client: file.client || "",
      industry: file.industry || "",
      date: file.date || "",
      duration: file.duration || "",
      role: file.role || "",
      goals: file.goals || "",
      challenges: file.challenges || "",
      solution: file.solution || "",
      results: file.results || "",
      website: file.website || "",
      github: file.github || "",
      download_link: file.download_link || "",
      video: file.video || "",
      videos: toArray(file.videos).map(v => typeof v === 'string' ? v : (v.url || '')),
      seo_title: file.seo_title || "",
      seo_description: file.seo_description || "",
      status: file.status || ""
    }));
    
    const found = items.find((p) => p.slug === slug);
    let related: any[] = [];
    if (found) {
      related = items.filter(p => 
        p.slug !== slug && 
        (
          (p.category && found.category && p.category.some((c: string) => found.category.includes(c))) || 
          (p.tags && found.tags && p.tags.some((t: string) => found.tags.includes(t)))
        )
      ).slice(0, 3);
    }
    return { project: found || null, relatedProjects: related, allProjects: items };
  }, [slug]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [slug]);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black px-6 text-center">
        <DocumentHead title="Project Not Found" />
        <h1 className="font-display text-4xl md:text-6xl font-black mb-6 holo-text uppercase">Project Not Found</h1>
        <p className="text-gray-400 font-future text-lg mb-8 max-w-lg">The project you are looking for does not exist or has been removed.</p>
        <Link to="/portfolio" className="px-8 py-4 bg-neon-cyan text-black font-display font-bold text-sm tracking-[2px] uppercase rounded-xl hover:shadow-[0_0_30px_rgba(0,245,255,0.4)] transition-all flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Portfolio
        </Link>
      </div>
    );
  }

  const currentIndex = allProjects.findIndex(p => p.slug === project.slug);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

  return (
    <div className="flex flex-col bg-black min-h-screen">
      <DocumentHead 
        title={project.seo_title || project.title} 
        description={project.seo_description || project.desc} 
      />

      {/* Hero Header */}
      <section className="relative pt-32 pb-24 px-6 md:px-12 border-b border-white/5 bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex gap-2 mb-6">
            {project.category.map((cat: string) => (
              <span key={cat} className="font-mono text-[10px] tracking-[3px] px-3 py-1.5 rounded-md bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30 uppercase">
                {cat}
              </span>
            ))}
          </div>
          
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-black mb-8 holo-text uppercase leading-tight max-w-4xl">
            {project.title}
          </h1>
          
          <p className="text-gray-300 font-future text-xl md:text-2xl leading-relaxed max-w-3xl mb-12">
            {project.desc}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-white/10">
            {project.client && (
              <div>
                <span className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">Client</span>
                <span className="text-sm font-future text-gray-200">{project.client}</span>
              </div>
            )}
            
            
            
            {project.status && (
              <div>
                <span className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">Status</span>
                <span className="text-sm font-future text-neon-cyan">{project.status}</span>
              </div>
            )}
            
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="px-6 md:px-12 -mt-12 relative z-20">
        <div className="container mx-auto max-w-6xl">
          <div className="aspect-video w-full rounded-2xl md:rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.8)] relative bg-slate-900 group">
            <img 
              src={project.image} 
              alt={project.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            {(project.videos && project.videos.length > 0) && (
              <a href={project.videos[0]} target="_blank" rel="noreferrer" className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all">
                <div className="w-20 h-20 rounded-full bg-neon-cyan text-black flex items-center justify-center pl-1 shadow-[0_0_40px_rgba(0,245,255,0.6)] group-hover:scale-110 transition-transform">
                  <Play size={32} />
                </div>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 px-6 md:px-12">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-24">
          
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-16">
            
            {project.body && (
              <div className="prose prose-invert prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:text-white prose-p:font-future prose-p:text-gray-300 prose-a:text-neon-cyan">
                <ReactMarkdown>{project.body}</ReactMarkdown>
              </div>
            )}
            
            {project.goals && (
              <div className="mt-12">
                <h3 className="font-display text-2xl font-bold mb-4 text-white uppercase tracking-widest">Goals</h3>
                <p className="font-future text-gray-300 leading-relaxed">{project.goals}</p>
              </div>
            )}
            {project.challenges && (
              <div className="mt-8">
                <h3 className="font-display text-2xl font-bold mb-4 text-white uppercase tracking-widest">Challenges</h3>
                <p className="font-future text-gray-300 leading-relaxed">{project.challenges}</p>
              </div>
            )}
            {project.solution && (
              <div className="mt-8">
                <h3 className="font-display text-2xl font-bold mb-4 text-white uppercase tracking-widest">Solution</h3>
                <p className="font-future text-gray-300 leading-relaxed">{project.solution}</p>
              </div>
            )}
            {project.results && (
              <div className="mt-8">
                <h3 className="font-display text-2xl font-bold mb-4 text-white uppercase tracking-widest">Results</h3>
                <p className="font-future text-gray-300 leading-relaxed">{project.results}</p>
              </div>
            )}
            
            {project.video && (
              <div className="mt-12">
                <h3 className="font-display text-2xl font-bold mb-6 text-white uppercase tracking-widest">Project Showcase Video</h3>
                <VideoPlayer url={project.video} title={`${project.title} Video`} />
              </div>
            )}
            {project.videos && project.videos.length > 0 && (
              <div className="mt-12 space-y-6">
                <h3 className="font-display text-2xl font-bold mb-6 text-white uppercase tracking-widest">Additional Videos</h3>
                {project.videos.map((vidUrl: string, idx: number) => (
                  <VideoPlayer key={idx} url={vidUrl} title={`${project.title} Video ${idx + 1}`} />
                ))}
              </div>
            )}

            

            

            

            

            

          </div>

          {/* Right Column: Sidebar */}
          <div className="space-y-12">
            
            {/* Action Buttons */}
            <div className="flex flex-col gap-4">
              {project.website && (
                <a href={project.website} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-6 py-4 rounded-xl border border-white/10 hover:border-neon-cyan text-white hover:text-neon-cyan transition-colors group">
                  <span className="font-display font-bold text-xs tracking-[2px] uppercase">Visit Website</span>
                  <ExternalLink size={16} className="group-hover:scale-110 transition-transform" />
                </a>
              )}
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-6 py-4 rounded-xl border border-white/10 hover:border-white text-white transition-colors group">
                  <span className="font-display font-bold text-xs tracking-[2px] uppercase">Source Code</span>
                  <Github size={16} className="group-hover:scale-110 transition-transform" />
                </a>
              )}
              {project.download_link && (
                <a href={project.download_link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-6 py-4 rounded-xl border border-white/10 hover:border-neon-pink text-white hover:text-neon-pink transition-colors group">
                  <span className="font-display font-bold text-xs tracking-[2px] uppercase">Download Files</span>
                  <Download size={16} className="group-hover:scale-110 transition-transform" />
                </a>
              )}
            </div>
            
            {(project.client || project.industry || project.date || project.duration || project.role) && (
              <div className="grid grid-cols-2 gap-6 py-8 border-y border-white/10 mt-8 mb-8">
                {project.client && (
                  <div>
                    <h4 className="font-mono text-[10px] tracking-[2px] text-gray-500 mb-1 uppercase">Client</h4>
                    <p className="font-future font-bold text-white text-sm">{project.client}</p>
                  </div>
                )}
                {project.industry && (
                  <div>
                    <h4 className="font-mono text-[10px] tracking-[2px] text-gray-500 mb-1 uppercase">Industry</h4>
                    <p className="font-future font-bold text-white text-sm">{project.industry}</p>
                  </div>
                )}
                {project.date && (
                  <div>
                    <h4 className="font-mono text-[10px] tracking-[2px] text-gray-500 mb-1 uppercase">Date</h4>
                    <p className="font-future font-bold text-white text-sm">{project.date}</p>
                  </div>
                )}
                {project.duration && (
                  <div>
                    <h4 className="font-mono text-[10px] tracking-[2px] text-gray-500 mb-1 uppercase">Duration</h4>
                    <p className="font-future font-bold text-white text-sm">{project.duration}</p>
                  </div>
                )}
                {project.role && (
                  <div className="col-span-2">
                    <h4 className="font-mono text-[10px] tracking-[2px] text-gray-500 mb-1 uppercase">Role</h4>
                    <p className="font-future font-bold text-white text-sm">{project.role}</p>
                  </div>
                )}
              </div>
            )}
            
            {project.software && project.software.length > 0 && (
                <div className="mb-8">
                  <h4 className="font-display text-xs tracking-[3px] text-gray-500 mb-4 uppercase">Software Used</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.software.map((t: string) => (
                      <span key={t} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono text-gray-300 uppercase">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
            {project.technologies && project.technologies.length > 0 && (
                <div className="mb-8">
                  <h4 className="font-display text-xs tracking-[3px] text-gray-500 mb-4 uppercase">Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((t: string) => (
                      <span key={t} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono text-gray-300 uppercase">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {project.tags && project.tags.length > 0 && (
                <div className="mb-8">
                  <h4 className="font-display text-xs tracking-[3px] text-gray-500 mb-4 uppercase">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((t: string) => (
                      <span key={t} className="text-xs font-future text-gray-400 hover:text-neon-cyan transition-colors cursor-pointer">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {/* Estimator Mini CTA in Sidebar */}
            <div className="pt-6 border-t border-white/10">
              <Link to="/estimator" className="flex items-center justify-between p-4 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan hover:text-black transition-all group">
                <div className="flex items-center gap-3">
                  <Calculator size={18} />
                  <span className="font-display font-bold text-xs uppercase tracking-wider">Estimate Similar Project</span>
                </div>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="py-24 px-6 md:px-12 bg-slate-950 border-t border-white/5">
          <div className="container mx-auto max-w-6xl">
            <h2 className="font-display text-3xl font-black mb-12 text-white uppercase tracking-widest text-center">
              Project <span className="text-neon-cyan">Gallery</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {project.gallery.map((item: any, idx: number) => {
                const img = typeof item === 'string' ? item : item?.image;
                if (!img) return null;
                return (
                  <div 
                    key={idx} 
                    className={`relative bg-slate-900 rounded-2xl overflow-hidden cursor-pointer group border border-white/5 ${idx % 3 === 0 ? 'sm:col-span-2 aspect-[21/9]' : 'aspect-video'}`}
                    onClick={() => setLightboxIndex(idx)}
                  >
                    <img 
                      src={img} 
                      alt={`Gallery ${idx + 1}`} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" 
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/10 text-white">
                        <LayoutGrid size={20} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Navigation & Related */}
      <section className="py-24 px-6 md:px-12">
        <div className="container mx-auto max-w-6xl space-y-24">
          
          {/* Next / Prev Project */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-y border-white/10 py-12">
            {prevProject ? (
              <Link to={`/portfolio/${prevProject.slug}`} className="group flex items-center gap-6 text-left w-full md:w-auto">
                <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all shrink-0">
                  <ArrowLeft size={20} />
                </div>
                <div>
                  <span className="block font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-1">Previous Project</span>
                  <span className="font-display text-lg md:text-xl font-bold text-white group-hover:text-neon-cyan transition-colors line-clamp-1">{prevProject.title}</span>
                </div>
              </Link>
            ) : <div className="w-full md:w-auto" />}

            <Link to="/portfolio" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-neon-cyan hover:text-black transition-all shrink-0 group">
              <LayoutGrid size={20} className="group-hover:scale-90 transition-transform" />
            </Link>

            {nextProject ? (
              <Link to={`/portfolio/${nextProject.slug}`} className="group flex flex-row-reverse md:flex-row items-center gap-6 text-right w-full md:w-auto justify-end">
                <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all shrink-0">
                  <ArrowRight size={20} />
                </div>
                <div>
                  <span className="block font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-1">Next Project</span>
                  <span className="font-display text-lg md:text-xl font-bold text-white group-hover:text-neon-cyan transition-colors line-clamp-1">{nextProject.title}</span>
                </div>
              </Link>
            ) : <div className="w-full md:w-auto" />}
          </div>

          {/* Related Projects */}
          {relatedProjects.length > 0 && (
            <div>
              <h3 className="font-display text-2xl font-black mb-12 text-white uppercase tracking-widest text-center">
                Related <span className="text-neon-cyan">Projects</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedProjects.map((p) => (
                  <Link key={p.slug} to={`/portfolio/${p.slug}`} className="group flex flex-col glass-panel rounded-2xl overflow-hidden border border-white/5 bg-slate-950 hover:border-white/20 transition-all">
                    <SmartCardImage
                      src={p.image}
                      alt={p.title}
                      aspectRatio="4/3"
                      fit="smart"
                    />
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex gap-2 mb-3 overflow-hidden text-ellipsis whitespace-nowrap">
                        {p.category.slice(0, 2).map((cat: string) => (
                          <span key={cat} className="font-mono text-[8px] tracking-[2px] px-2 py-1 rounded bg-white/5 text-neon-cyan border border-neon-cyan/20 shrink-0">
                            {cat}
                          </span>
                        ))}
                      </div>
                      <h4 className="font-display text-lg font-bold text-white group-hover:text-neon-cyan transition-colors mb-2 line-clamp-2">{p.title}</h4>
                      <p className="font-future text-xs text-gray-400 line-clamp-2 mt-auto">{p.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* Lightbox */}
      <Lightbox 
        images={project.gallery ? project.gallery.map((item: any) => typeof item === 'string' ? item : (item?.image || item)).filter(Boolean) : []} 
        isOpen={lightboxIndex !== null} 
        initialIndex={lightboxIndex || 0} 
        onClose={() => setLightboxIndex(null)} 
      />

    </div>
  );
}

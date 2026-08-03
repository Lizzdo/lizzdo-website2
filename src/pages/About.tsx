import { useState, useMemo } from "react";
import { motion } from "motion/react";
import DocumentHead from "../components/DocumentHead";
import EstimatorCTA from "../components/EstimatorCTA";
import { getSingle, getCollection, toArray, sortByOrder } from "../lib/content";
import { IconMapper } from "../components/IconMapper";
import Markdown from "react-markdown";

export default function About() {
  const pageData = useMemo(() => getSingle(import.meta.glob('../content/pages/about.json', { eager: true })), []);
  const allTeamMembers = useMemo(() => {
    const members = getCollection(import.meta.glob('../content/team/*.json', { eager: true }));
    return members.sort(sortByOrder);
  }, []);

  const { 
    company, story, mission, vision, stats, values,
    company_info, mission_section, vision_section, story_section, timeline
  } = pageData || {};

  return (
    <div className="flex flex-col">
      <DocumentHead title="About LIZZDO | 3D Design & Web Development Agency" description="Learn about LIZZDO Digital Studio, our mission, vision, and the expert team building next-generation 3D models, game assets, and digital experiences globally." />
      {/* Hero Section */}
      <section className="py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="container mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <span className="font-mono text-xs tracking-[4px] text-neon-cyan uppercase">
              // THE STUDIO
            </span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="font-display text-5xl md:text-7xl font-black mb-8 uppercase">
            {company_info?.name || company?.headline?.split(' ').slice(0, -1).join(' ')} <span className="holo-text">{company_info?.tagline || company?.headline?.split(' ').slice(-1).join(' ')}</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-future text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            {company_info?.short_desc || company?.subtitle}
          </motion.p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 px-6 bg-black/30">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="font-mono text-xs tracking-[4px] text-neon-purple uppercase mb-4 block">
              // OUR ORIGIN
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-8 uppercase">
              {story_section?.heading || "CRAFTING REALITY"}
            </h2>
            <div className="space-y-6 text-gray-400 font-future leading-relaxed">
              {(story_section?.content || story) && <div className="prose prose-invert prose-neon max-w-none mb-6"><Markdown>{story_section?.content || story}</Markdown></div>}
              {(mission_section?.description || mission) && <div className="prose prose-invert prose-neon max-w-none mb-6"><h3>{mission_section?.heading || "Our Mission"}</h3><Markdown>{mission_section?.description || mission}</Markdown></div>}
              {(vision_section?.description || vision) && <div className="prose prose-invert prose-neon max-w-none"><h3>{vision_section?.heading || "Our Vision"}</h3><Markdown>{vision_section?.description || vision}</Markdown></div>}
            </div>
            <div className="grid grid-cols-2 gap-8 mt-12">
              {toArray(stats).sort(sortByOrder).map((stat: any) => (
                <div key={stat.label}>
                  <div className="font-display text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="font-mono text-[10px] tracking-[2px] text-gray-500 uppercase">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative group">
            {/* Ambient Background Glow Orbs */}
            <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 rounded-[3rem] blur-2xl opacity-40 group-hover:opacity-75 transition-opacity duration-1000" />
            
            <div className="aspect-square rounded-[3rem] overflow-hidden border border-white/10 relative z-10 bg-slate-950 flex items-center justify-center p-6 transition-all duration-500 group-hover:border-neon-cyan/30 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
              {/* Futuristic Cyber HUD Overlay */}
              <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-neon-cyan z-20 rounded-tl-2xl transition-all duration-300 group-hover:translate-x-[-4px] group-hover:translate-y-[-4px] group-hover:shadow-[0_0_15px_rgba(0,245,255,0.5)]" />
              <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-neon-cyan z-20 rounded-tr-2xl transition-all duration-300 group-hover:translate-x-[4px] group-hover:translate-y-[-4px] group-hover:shadow-[0_0_15px_rgba(0,245,255,0.5)]" />
              <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-neon-purple z-20 rounded-bl-2xl transition-all duration-300 group-hover:translate-x-[-4px] group-hover:translate-y-[4px] group-hover:shadow-[0_0_15px_rgba(191,0,255,0.5)]" />
              <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-neon-purple z-20 rounded-br-2xl transition-all duration-300 group-hover:translate-x-[4px] group-hover:translate-y-[4px] group-hover:shadow-[0_0_15px_rgba(191,0,255,0.5)]" />
              
              {/* Telemetry Tracking Text */}
              <div className="absolute top-6 left-6 z-20 pointer-events-none opacity-30 group-hover:opacity-70 transition-opacity text-[8px] tracking-[4px] text-neon-cyan select-none font-mono">
                HUD_ACTIVE_LZZD.SYS
              </div>
              <div className="absolute bottom-6 right-6 z-20 pointer-events-none opacity-30 group-hover:opacity-70 transition-opacity text-[8px] tracking-[4px] text-neon-purple select-none font-mono">
                OPTIMIZED_MESH_100%
              </div>

              {/* Scanning Laser Beam */}
              <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse z-20 pointer-events-none top-1/2" />
              
              {/* Scanline CRT overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.25)_50%)] bg-[size:100%_4px] opacity-20 pointer-events-none z-20 rounded-[3rem]" />

              <img loading="lazy"
                src={company_info?.image || company?.image || "/lizzdo-logo.png"}
                alt={company_info?.name || company?.headline}
                className="w-full h-full object-contain opacity-90 group-hover:opacity-100 scale-[0.98] group-hover:scale-100 filter saturate-[1.3] contrast-[1.1] brightness-[1.15] drop-shadow-[0_0_30px_rgba(0,245,255,0.25)] transition-all duration-700 select-none pointer-events-none z-10"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-15 pointer-events-none mix-blend-multiply opacity-80" />
            </div>
            
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-neon-cyan/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-neon-purple/10 blur-[100px] rounded-full pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <span className="font-mono text-xs tracking-[4px] text-neon-pink uppercase mb-4 block">
              // CORE VALUES
            </span>
            <h2 className="font-display text-4xl md:text-6xl font-bold uppercase">WHAT DRIVES US</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {toArray(values).sort(sortByOrder).map((val: any, i: number) => (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-10 rounded-3xl border border-white/5 bg-white/5 hover:border-neon-cyan/30 transition-all group"
              >
                <div className="text-neon-cyan mb-6 group-hover:scale-110 transition-transform">
                  <IconMapper name={val.icon} size={32} />
                </div>
                <h4 className="font-display text-lg font-bold mb-4 tracking-[1px] uppercase">{val.title}</h4>
                <p className="text-gray-500 font-future text-sm leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

            {/* Timeline Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <span className="font-mono text-xs tracking-[4px] text-neon-cyan uppercase mb-4 block">
              // OUR JOURNEY
            </span>
            <h2 className="font-display text-4xl md:text-6xl font-bold uppercase">TIMELINE</h2>
          </div>
          <div className="max-w-4xl mx-auto space-y-12">
            {toArray(timeline || pageData?.timeline).sort(sortByOrder).map((item: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col md:flex-row gap-6 md:gap-12 items-start"
              >
                <div className="md:w-1/4 shrink-0">
                  <span className="font-display text-3xl font-bold text-neon-cyan">{item.year}</span>
                </div>
                <div className="md:w-3/4 pb-12 md:pb-0 border-l border-white/10 pl-6 md:border-none md:pl-0 relative">
                  <div className="absolute top-2 -left-[5px] w-2.5 h-2.5 rounded-full bg-neon-cyan md:hidden" />
                  <h4 className="font-display text-xl font-bold mb-4">{item.title}</h4>
                  <p className="text-gray-500 font-future leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 px-6 bg-black/30">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <span className="font-mono text-xs tracking-[4px] text-neon-green uppercase mb-4 block">
              // THE TEAM
            </span>
            <h2 className="font-display text-4xl md:text-6xl font-bold uppercase">MEET OUR EXPERTS</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 max-w-7xl mx-auto">
            {allTeamMembers.filter((m: any) => m.active !== false).map((member: any, i: number) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group text-center flex flex-col items-center"
              >
                <div className="w-48 h-48 rounded-full overflow-hidden mb-8 relative border-2 border-white/10 group-hover:border-neon-cyan transition-colors p-2">
                  <img loading="lazy"
                    src={member.thumbnail || "/lizzdo-logo.png"}
                    alt={member.name}
                    className="w-full h-full object-cover rounded-full grayscale group-hover:grayscale-0 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h4 className="font-display text-xl font-bold mb-1 tracking-[1px] group-hover:text-neon-cyan transition-colors">
                  {member.name}
                </h4>
                <div className="font-mono text-[10px] tracking-[2px] text-neon-cyan mb-4 uppercase">
                  {member.role}
                </div>
                
                <p className="text-gray-500 font-future text-sm leading-relaxed max-w-xs mb-4">
                  {member.bio}
                </p>
                {((member.socials && member.socials.length > 0) || member.linkedin || member.github || member.instagram || member.email || member.website) && (
                  <div className="flex flex-wrap justify-center items-center gap-3">
                    {member.socials?.map((social: any, j: number) => (
                      <a key={'social-'+j} href={social.url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-neon-cyan transition-colors">
                        <IconMapper name={social.icon || 'Link'} size={18} />
                      </a>
                    ))}
                    {member.linkedin && (
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-neon-cyan transition-colors">
                        <IconMapper name="Linkedin" size={18} />
                      </a>
                    )}
                    {member.github && (
                      <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-neon-cyan transition-colors">
                        <IconMapper name="Github" size={18} />
                      </a>
                    )}
                    {member.instagram && (
                      <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-neon-cyan transition-colors">
                        <IconMapper name="Instagram" size={18} />
                      </a>
                    )}
                    {member.website && (
                      <a href={member.website} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-neon-cyan transition-colors">
                        <IconMapper name="Globe" size={18} />
                      </a>
                    )}
                    {member.email && (
                      <a href={`mailto:${member.email}`} className="text-gray-500 hover:text-neon-cyan transition-colors">
                        <IconMapper name="Mail" size={18} />
                      </a>
                    )}
                  </div>
                )}
              </motion.div>

            ))}
          </div>
        </div>
      </section>

      {/* Estimator CTA Banner */}
      <EstimatorCTA
        title="READY TO COLLABORATE WITH OUR TEAM?"
        subtitle="Calculate an instant estimate for your next 3D, web development, mobile app, or game production."
        buttonText="Estimate My Project"
        variant="banner"
      />
    </div>
  );
}

const fs = require('fs');

let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

content = content.replace(
  /const posts = allPosts[^]*?const testimonialsList = allTestimonials\.slice\(0, 3\);/,
  `const posts = featured_blog?.blog_list?.length > 0 
    ? featured_blog.blog_list.map((slug: string) => allPosts.find((p: any) => p.slug === slug)).filter(Boolean)
    : allPosts.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3);

  const projects = featured_portfolio?.portfolio_list?.length > 0
    ? featured_portfolio.portfolio_list.map((slug: string) => allProjects.find((p: any) => p.slug === slug)).filter(Boolean)
    : allProjects.filter((p: any) => p.featured !== false).slice(0, 3);

  const services = featured_services?.services_list?.length > 0
    ? featured_services.services_list.map((slug: string) => allServices.find((s: any) => s.slug === slug)).filter(Boolean)
    : allServices.slice(0, 8);

  const faqs = faqs_section?.faqs_list?.length > 0
    ? faqs_section.faqs_list.map((slug: string) => allFaqs.find((f: any) => f.slug === slug)).filter(Boolean)
    : allFaqs.sort((a: any, b: any) => (a.order || 0) - (b.order || 0)).slice(0, 6);

  const featuredClients = featured_clients?.clients_list?.length > 0
    ? featured_clients.clients_list.map((slug: string) => allClients.find((c: any) => c.slug === slug)).filter(Boolean)
    : allClients.slice(0, 5);

  let testimonialsList = toArray(testimonials?.list || []);
  if (testimonialsList.length === 0) {
    testimonialsList = allTestimonials.slice(0, 3);
  }`
);

content = content.replace(
  /\{hero\?\.headline\?\.split\(' '\)\.slice\(0, -2\)\.join\(' '\)\} <br \/>\s*<span className="holo-text">\{hero\?\.headline\?\.split\(' '\)\.slice\(-2\)\.join\(' '\)\}<\/span>/,
  `{hero?.highlight ? (
              <>
                {hero.headline} <br />
                <span className="holo-text">{hero.highlight}</span>
              </>
            ) : (
              <>
                {hero?.headline?.split(' ').slice(0, -2).join(' ')} <br />
                <span className="holo-text">{hero?.headline?.split(' ').slice(-2).join(' ')}</span>
              </>
            )}`
);

content = content.replace(
  /\{hero\?\.subtitle\}/,
  `{hero?.description || hero?.subtitle}`
);

// Stat icon mapping
content = content.replace(
  /\{stat\.value\}\s*<\/div>\s*<div className="text-\[10px\] uppercase tracking-\[3px\] text-neon-cyan font-mono">\s*\{stat\.label\}\s*<\/div>/,
  `{stat.value}
                </div>
                <div className="text-[10px] uppercase tracking-[3px] text-neon-cyan font-mono flex items-center justify-center gap-2">
                  {stat.icon && <IconMapper name={stat.icon} size={14} />}
                  {stat.label}
                </div>`
);

// CTA Section bg image
content = content.replace(
  /<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink" \/>/,
  `{cta?.bg_image && <img src={cta.bg_image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink z-10" />`
);

content = content.replace(
  /<h2 className="text-4xl md:text-6xl font-display font-black mb-8 uppercase">/,
  `<h2 className="text-4xl md:text-6xl font-display font-black mb-8 uppercase relative z-10">`
);

content = content.replace(
  /<p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto">/,
  `<p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto relative z-10">`
);

content = content.replace(
  /className="inline-flex items-center gap-3 px-12 py-5 rounded-2xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-display font-bold text-xl uppercase tracking-\[2px\] hover:shadow-\[0_0_30px_rgba\(0,245,255,0\.4\)\] transition-all"/,
  `className="inline-flex items-center gap-3 px-12 py-5 rounded-2xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-display font-bold text-xl uppercase tracking-[2px] hover:shadow-[0_0_30px_rgba(0,245,255,0.4)] transition-all relative z-10"`
);

content = content.replace(
  /\{cta\?\.subtitle\}/,
  `{cta?.description || cta?.subtitle}`
);

// Fix services button if they have it
content = content.replace(
  /<p className="text-gray-400 font-future tracking-wide">\{featured_services\?\.subtitle\}<\/p>\s*<\/div>\s*<div className="grid/,
  `<p className="text-gray-400 font-future tracking-wide mb-6">{featured_services?.subtitle}</p>
            {featured_services?.btn_text && featured_services?.btn_url && (
              <Link to={featured_services.btn_url} className="inline-flex px-8 py-3 rounded-xl border border-white/10 hover:border-neon-cyan text-xs font-bold uppercase tracking-widest transition-all">
                {featured_services.btn_text}
              </Link>
            )}
          </div>

          <div className="grid`
);

// Fix portfolio button if they have it
content = content.replace(
  /<Link to="\/portfolio" className="px-8 py-3 rounded-xl border border-white\/10 hover:border-neon-purple text-xs font-bold uppercase tracking-widest transition-all">\s*View All Projects\s*<\/Link>/,
  `<Link to={featured_portfolio?.btn_url || "/portfolio"} className="px-8 py-3 rounded-xl border border-white/10 hover:border-neon-purple text-xs font-bold uppercase tracking-widest transition-all">
              {featured_portfolio?.btn_text || "View All Projects"}
            </Link>`
);

// Fix faqs button if they have it
content = content.replace(
  /<Link \s*to="\/faq" \s*className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-neon-cyan\/10 text-neon-cyan border border-neon-cyan\/30 hover:bg-neon-cyan hover:text-dark-navy text-xs font-bold uppercase tracking-widest transition-all shadow-\[0_0_20px_-5px_rgba\(0,255,255,0\.3\)\] hover:shadow-\[0_0_30px_0px_rgba\(0,255,255,0\.5\)\]"\s*>\s*View All FAQs <ArrowRight size=\{14\} \/>\s*<\/Link>/,
  `<Link 
              to={faqs_section?.btn_url || "/faq"} 
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30 hover:bg-neon-cyan hover:text-dark-navy text-xs font-bold uppercase tracking-widest transition-all shadow-[0_0_20px_-5px_rgba(0,255,255,0.3)] hover:shadow-[0_0_30px_0px_rgba(0,255,255,0.5)]"
            >
              {faqs_section?.btn_text || "View All FAQs"} <ArrowRight size={14} />
            </Link>`
);

// Fix blog button if they have it
content = content.replace(
  /<Link to="\/blog" className="px-8 py-3 rounded-xl border border-white\/10 hover:border-neon-cyan text-xs font-bold uppercase tracking-widest transition-all">\s*Read All Articles\s*<\/Link>/,
  `<Link to={featured_blog?.btn_url || "/blog"} className="px-8 py-3 rounded-xl border border-white/10 hover:border-neon-cyan text-xs font-bold uppercase tracking-widest transition-all">
              {featured_blog?.btn_text || "Read All Articles"}
            </Link>`
);

fs.writeFileSync('src/pages/Home.tsx', content);

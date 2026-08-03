const fs = require('fs');

let content = fs.readFileSync('src/pages/ServiceDetail.tsx', 'utf8');

content = content.replace(
  /if \(!service\) \{\s*return <Navigate to="\/services" replace \/>;\s*\}/,
  `if (!service) {
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
  }`
);

// We need to add deliverables, gallery images, etc. to ServiceDetail.tsx, 
// let's just make sure the basic requirements requested are met:
// "Every service must have its own working page... Load the correct service information"
// Let's add Deliverables section and CTA url replacement
content = content.replace(
  /const \{\s*title,\s*description,\s*body,\s*category,\s*icon,\s*color,\s*features,\s*tech,\s*price,\s*thumbnail,\s*seo_title,\s*seo_description\s*\} = service;/,
  `const {
    title,
    description,
    body,
    category,
    icon,
    color,
    features,
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
  } = service;`
);

content = content.replace(
  /<Link to="\/contact" className=\{`w-full block py-4 rounded-xl \$\{bgAccent\} border \$\{borderColor\} \$\{textColor\} text-center font-display font-bold text-xs tracking-\[2px\] hover:bg-white hover:text-black hover:border-white transition-all`\}>\s*REQUEST QUOTE\s*<\/Link>/,
  `<Link to={cta_url || "/contact"} className={\`w-full block py-4 rounded-xl \${bgAccent} border \${borderColor} \${textColor} text-center font-display font-bold text-xs tracking-[2px] hover:bg-white hover:text-black hover:border-white transition-all\`}>
                  {cta_text || "REQUEST QUOTE"}
                </Link>`
);

content = content.replace(
  /<h4 className="font-display text-sm font-bold uppercase mb-4 tracking-\[1px\]">Tech Stack<\/h4>\s*<div className="mb-8">\s*<TechGrid techs=\{parsedTech\} \/>\s*<\/div>/,
  `{(deliverables && deliverables.length > 0) && (
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
                <h4 className="font-display text-sm font-bold uppercase mb-4 tracking-[1px]">Tech Stack</h4>
                <div className="mb-8">
                  <TechGrid techs={parsedTech} />
                </div>`
);

content = content.replace(
  /\{body && <Markdown>\{body\}<\/Markdown>\}/,
  `{body && <Markdown>{body}</Markdown>}
                 
                 {gallery && gallery.length > 0 && (
                   <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
                     {toArray(gallery).map((img: any, idx: number) => (
                       <img key={idx} src={img.image || img} alt="" className="w-full h-auto rounded-2xl border border-white/10" />
                     ))}
                   </div>
                 )}`
);

fs.writeFileSync('src/pages/ServiceDetail.tsx', content);
console.log("Updated ServiceDetail.tsx");

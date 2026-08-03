const fs = require('fs');
let content = fs.readFileSync('src/pages/Product.tsx', 'utf8');

// Replace Button URLs
content = content.replace(
  /<button \n                onClick=\{handleBuy\}\n                className="w-full py-5 rounded-2xl bg-neon-orange text-black font-display font-bold uppercase text-lg tracking-\[2px\] hover:shadow-\[0_0_40px_rgba\(255,107,0,0\.4\)\] transition-all flex items-center justify-center gap-3"\n              >\n                <ShoppingCart size=\{24\} \/> Buy Now\n              <\/button>/,
  `{product.buy_url ? (
                <a 
                  href={product.buy_url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-5 rounded-2xl bg-neon-orange text-black font-display font-bold uppercase text-lg tracking-[2px] hover:shadow-[0_0_40px_rgba(255,107,0,0.4)] transition-all flex items-center justify-center gap-3"
                >
                  <ShoppingCart size={24} /> Buy Now
                </a>
              ) : (
                <button 
                  onClick={handleBuy}
                  className="w-full py-5 rounded-2xl bg-neon-orange text-black font-display font-bold uppercase text-lg tracking-[2px] hover:shadow-[0_0_40px_rgba(255,107,0,0.4)] transition-all flex items-center justify-center gap-3"
                >
                  <ShoppingCart size={24} /> Buy Now
                </button>
              )}`
);

content = content.replace(
  /\{product\.download \? \([\s\S]*?Customization\n                  <\/Link>\n                \)\}/,
  `{product.demo_url ? (
                  <a href={product.demo_url} target="_blank" rel="noreferrer" className="w-full py-4 rounded-xl border border-neon-cyan text-neon-cyan font-display font-bold uppercase text-sm tracking-[2px] hover:bg-neon-cyan hover:text-black hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] transition-all flex items-center justify-center gap-2">
                    <Download size={18} /> Demo
                  </a>
                ) : (
                  <Link to={product.customization_url || "/contact"} className="w-full py-4 rounded-xl border border-neon-cyan text-neon-cyan font-display font-bold uppercase text-sm tracking-[2px] hover:bg-neon-cyan hover:text-black hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] transition-all flex items-center justify-center gap-2">
                    <Settings size={18} /> Customize
                  </Link>
                )}`
);

// Replace metadata mapping
content = content.replace(
  /\{product\.type && \([\s\S]*?\{product\.status && \(/,
  `{product.product_type && (
                <div>
                  <span className="flex items-center gap-2 text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2"><Box size={12} /> Type</span>
                  <span className="text-sm font-future text-gray-200">{product.product_type}</span>
                </div>
              )}
              {product.sku && (
                <div>
                  <span className="flex items-center gap-2 text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2"><Tag size={12} /> SKU</span>
                  <span className="text-sm font-future text-gray-200">{product.sku}</span>
                </div>
              )}
              {product.format && (
                <div>
                  <span className="flex items-center gap-2 text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2"><Package size={12} /> Format</span>
                  <span className="text-sm font-future text-neon-green">{product.format}</span>
                </div>
              )}
              {product.status && (`
);

content = content.replace(
  /\{product\.body && \([\s\S]*?<\/div>\n            \)\}/,
  `{product.body && (
              <div>
                <h2 className="font-display text-2xl font-bold mb-8 text-white uppercase tracking-wider flex items-center gap-4">
                  <span className="w-8 h-[1px] bg-neon-orange"></span> Overview
                </h2>
                <div className="prose prose-invert prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:text-white prose-p:font-future prose-p:text-gray-300 prose-a:text-neon-orange">
                  <ReactMarkdown>{product.body}</ReactMarkdown>
                </div>
              </div>
            )}
            
            {product.video && (
               <div className="aspect-video w-full rounded-2xl overflow-hidden border border-white/10 mt-12 bg-black">
                 {product.video.includes('youtube.com') || product.video.includes('youtu.be') ? (
                   <iframe src={product.video.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')} className="w-full h-full" allowFullScreen allow="autoplay; encrypted-media" />
                 ) : product.video.includes('vimeo.com') ? (
                   <iframe src={product.video.replace('vimeo.com/', 'player.vimeo.com/video/')} className="w-full h-full" allowFullScreen allow="autoplay; encrypted-media" />
                 ) : (
                   <video src={product.video} controls className="w-full h-full" />
                 )}
               </div>
            )}
            
            {product.requirements && (
              <div className="mt-12">
                <h2 className="font-display text-2xl font-bold mb-8 text-white uppercase tracking-wider flex items-center gap-4">
                  <span className="w-8 h-[1px] bg-neon-orange"></span> Requirements
                </h2>
                <div className="prose prose-invert prose-lg max-w-none">
                  <ReactMarkdown>{product.requirements}</ReactMarkdown>
                </div>
              </div>
            )}`
);

content = content.replace(
  /\{product\.tags && product\.tags\.length > 0 && \(/,
  `{product.features && product.features.length > 0 && (
              <div className="mb-8">
                <h4 className="font-display text-xs tracking-[3px] text-gray-500 mb-4 uppercase">Features</h4>
                <ul className="space-y-3">
                  {product.features.map((f: string) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-gray-300 font-future">
                      <CheckCircle2 className="text-neon-orange shrink-0" size={16} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {product.included_files && product.included_files.length > 0 && (
              <div className="mb-8">
                <h4 className="font-display text-xs tracking-[3px] text-gray-500 mb-4 uppercase">Included Files</h4>
                <div className="flex flex-wrap gap-2">
                  {product.included_files.map((f: string) => (
                    <span key={f} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono text-gray-300 uppercase">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {product.compatibility && product.compatibility.length > 0 && (
              <div className="mb-8">
                <h4 className="font-display text-xs tracking-[3px] text-gray-500 mb-4 uppercase">Compatibility</h4>
                <div className="flex flex-wrap gap-2">
                  {product.compatibility.map((c: string) => (
                    <span key={c} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono text-gray-300 uppercase">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {product.tags && product.tags.length > 0 && (`
);

content = content.replace(
  /images=\{allMedia\}/,
  `images={allMedia.map((m: any) => typeof m === 'string' ? m : (m?.image || m))}`
);

fs.writeFileSync('src/pages/Product.tsx', content);
console.log("Updated Product.tsx UI");

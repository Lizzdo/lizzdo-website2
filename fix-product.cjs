const fs = require('fs');

let content = fs.readFileSync('src/pages/Product.tsx', 'utf8');

// Replace videos
content = content.replace(/product\.video/g, 'product.videos && product.videos.length > 0');
content = content.replace(/media\.push\(product\.video\)/g, 'product.videos.forEach(v => media.push(v))');

content = content.replace(/\{!product\.videos && product\.videos\.length > 0 && \(/g, '{(!product.videos || product.videos.length === 0) && (');

// Remove buy_url block
content = content.replace(/if \(product\.buy_url\) \{\s+window\.open\(product\.buy_url, '_blank'\);\s+\}/g, '');

// Update Download logic
content = content.replace(
  /\{product\.download \? \([\s\S]*?<\/a>\s*\) : \([\s\S]*?<\/button>\s*\)\}/,
  `{product.downloads && product.downloads.length > 0 ? (
      <a href={product.downloads[0]} download className="w-full py-4 rounded-xl border border-neon-cyan text-neon-cyan font-display font-bold uppercase text-sm tracking-[2px] hover:bg-neon-cyan hover:text-black hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] transition-all flex items-center justify-center gap-2">
        <Download size={18} /> Download Asset
      </a>
    ) : (
      <button onClick={handleAddToCart} className="w-full py-4 rounded-xl bg-neon-orange text-black font-display font-bold uppercase text-sm tracking-[2px] hover:shadow-[0_0_30px_rgba(255,107,0,0.4)] transition-all flex items-center justify-center gap-2">
        <ShoppingCart size={18} /> Add to Cart
      </button>
    )}`
);

// Remove documentation block entirely
content = content.replace(/\{product\.documentation \? \([\s\S]*?<\/a>\s*\) : null\}/, '');

// Replace technical specs section
const oldSpecsStart = content.indexOf('{product.type && (');
const oldSpecsEnd = content.indexOf('</div>', oldSpecsStart); // wait this is tricky with regex.

// Let's just use string replacement for the grid
const specsRegex = /<div className="grid grid-cols-2 gap-4">[\s\S]*?<\/div>\s*<\/div>\s*<div className="glass-panel p-8 rounded-3xl border border-white\/5 bg-slate-900\/50">/m;
const newSpecs = `<div className="grid grid-cols-2 gap-4">
              {product.format && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-display text-gray-500 uppercase tracking-[2px]">Format</span>
                  <span className="text-sm font-future text-gray-200">{product.format}</span>
                </div>
              )}
              {product.polygons && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-display text-gray-500 uppercase tracking-[2px]">Polygons</span>
                  <span className="text-sm font-future text-gray-200">{product.polygons}</span>
                </div>
              )}
              {product.license && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-display text-gray-500 uppercase tracking-[2px]">License</span>
                  <span className="text-sm font-future text-gray-200">{product.license}</span>
                </div>
              )}
              {product.videos && product.videos.length > 0 && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-display text-gray-500 uppercase tracking-[2px]">Preview</span>
                  <a href={product.videos[0]} target="_blank" rel="noreferrer" className="text-sm font-future text-neon-cyan hover:underline">Watch Video</a>
                </div>
              )}
              <div className="flex flex-col gap-1 col-span-2">
                <span className="text-xs font-display text-gray-500 uppercase tracking-[2px]">Attributes</span>
                <div className="flex gap-4 mt-2">
                  <span className={\`text-xs font-future \${product.textures ? 'text-neon-green' : 'text-gray-500'}\`}>Textures: {product.textures ? 'Yes' : 'No'}</span>
                  <span className={\`text-xs font-future \${product.rigged ? 'text-neon-green' : 'text-gray-500'}\`}>Rigged: {product.rigged ? 'Yes' : 'No'}</span>
                  <span className={\`text-xs font-future \${product.animated ? 'text-neon-green' : 'text-gray-500'}\`}>Animated: {product.animated ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="glass-panel p-8 rounded-3xl border border-white/5 bg-slate-900/50">`;
content = content.replace(specsRegex, newSpecs);


// Removing unused sections: Requirements, Installation, Features, Included, Software Compatibility, Formats
content = content.replace(/\{product\.requirements && \([\s\S]*?<\/div>\s*\)\}/, '');
content = content.replace(/\{product\.installation && \([\s\S]*?<\/div>\s*\)\}/, '');
content = content.replace(/\{product\.features && product\.features\.length > 0 && \([\s\S]*?<\/div>\s*\)\}/, '');
content = content.replace(/\{product\.included && product\.included\.length > 0 && \([\s\S]*?<\/div>\s*\)\}/, '');
content = content.replace(/\{product\.software_compatibility && product\.software_compatibility\.length > 0 && \([\s\S]*?<\/div>\s*\)\}/, '');
content = content.replace(/\{product\.formats && product\.formats\.length > 0 && \([\s\S]*?<\/div>\s*\)\}/, '');


fs.writeFileSync('src/pages/Product.tsx', content);

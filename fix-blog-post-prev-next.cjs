const fs = require('fs');
let content = fs.readFileSync('src/pages/BlogPost.tsx', 'utf8');

// Add ArrowRight if missing
if (!content.includes('ArrowRight')) {
  content = content.replace(/ArrowLeft, Share2/, 'ArrowLeft, ArrowRight, Share2');
}

const replacement = `
  const abstractContent = post.excerpt || post.body.replace(/<[^>]*>?/gm, '').substring(0, 150) + "...";
  
  const currentIndex = post._allPosts.findIndex((p: any) => p.slug === post.slug);
  const prevPost = currentIndex > 0 ? post._allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < post._allPosts.length - 1 && currentIndex !== -1 ? post._allPosts[currentIndex + 1] : null;

  return (`;

content = content.replace(/const abstractContent = post\.excerpt \|\| post\.body\.replace\(\/<\[\^>\]\*\>\?\/gm, ''\)\.substring\(0, 150\) \+ "\.\.\.";\s*return \(/, replacement);

const prevNextReplacement = `
              </div>

              {/* Prev / Next Posts */}
              <div className="mt-16 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
                {prevPost ? (
                  <Link to={\`/blog/\${prevPost.slug}\`} className="group flex items-center gap-4 text-left w-full md:w-auto">
                    <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white group-hover:bg-neon-cyan group-hover:text-black transition-all shrink-0">
                      <ArrowLeft size={16} />
                    </div>
                    <div>
                      <span className="block font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-1">Previous</span>
                      <span className="font-display text-sm md:text-base font-bold text-white group-hover:text-neon-cyan transition-colors line-clamp-1">{prevPost.title}</span>
                    </div>
                  </Link>
                ) : <div className="w-full md:w-auto" />}
                
                {nextPost ? (
                  <Link to={\`/blog/\${nextPost.slug}\`} className="group flex flex-row-reverse md:flex-row items-center gap-4 text-right w-full md:w-auto justify-end">
                    <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white group-hover:bg-neon-cyan group-hover:text-black transition-all shrink-0">
                      <ArrowRight size={16} />
                    </div>
                    <div>
                      <span className="block font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-1">Next</span>
                      <span className="font-display text-sm md:text-base font-bold text-white group-hover:text-neon-cyan transition-colors line-clamp-1">{nextPost.title}</span>
                    </div>
                  </Link>
                ) : <div className="w-full md:w-auto" />}
              </div>
            </div>`;

content = content.replace(/<\/div>\n            <\/div>\n            \{\/\* Sidebar \*\/\}/, prevNextReplacement + '\n            {/* Sidebar */}');

fs.writeFileSync('src/pages/BlogPost.tsx', content);
console.log("Updated BlogPost.tsx with Prev/Next");

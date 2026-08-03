const fs = require('fs');

let content = fs.readFileSync('src/pages/BlogPost.tsx', 'utf8');

content = content.replace(
  /\{\["#3DModeling", "#GameDev", "#FutureTech"\]\.map\(tag => \([\s\S]*?<\/span>\s*\)\)\}/m,
  `{post.tags && post.tags.map((tag: string) => (
                    <span key={tag} className="text-[10px] font-mono text-neon-cyan/60">
                      #{tag.replace(/^#/, '')}
                    </span>
                  ))}`
);

fs.writeFileSync('src/pages/BlogPost.tsx', content);


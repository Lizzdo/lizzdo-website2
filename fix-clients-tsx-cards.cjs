const fs = require('fs');
let content = fs.readFileSync('src/pages/Clients.tsx', 'utf8');

const regex = /<div className="grid grid-cols-2 p-3 border-b border-white\/10 bg-white\/\[0\.01\]">[\s\S]*?<\/div>\s*<\/div>\s*\{\/\* Case Study Summary Paragraph \*\/\}\s*<div className="mb-6">\s*<h4 className="font-display text-\[9px\] text-gray-500 tracking-\[2px\] uppercase mb-2">Requirement Profile<\/h4>\s*<p className="text-xs text-gray-400 font-future leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-300">\s*\{client\.requirements\}\s*<\/p>\s*<\/div>/;

const replacement = `<div className="grid grid-cols-2 p-3 border-b border-white/10 bg-white/[0.01]">
                      <span className="text-gray-500">INDUSTRY</span>
                      <span className="text-gray-300 text-right uppercase tracking-[0.5px] truncate px-1" title={client.industry}>
                        {client.industry || "N/A"}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 p-3 border-b border-white/10">
                      <span className="text-gray-500">COUNTRY</span>
                      <span className="text-gray-300 text-right uppercase tracking-[0.5px] truncate px-1" title={client.country}>
                        {client.country || "N/A"}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 p-3 border-b border-white/10 bg-white/[0.01]">
                      <span className="text-gray-500">PROJECT</span>
                      <span className="text-gray-300 text-right uppercase tracking-[0.5px] truncate px-1" title={client.project}>
                        {client.project || "N/A"}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 p-3">
                      <span className="text-gray-500">COMPLETED</span>
                      <span className="text-neon-green text-right uppercase tracking-[0.5px] font-semibold truncate px-1">
                        {client.completionDate || "ONGOING"}
                      </span>
                    </div>
                  </div>

                  {/* Case Study Summary Paragraph */}
                  <div className="mb-6">
                    <h4 className="font-display text-[9px] text-gray-500 tracking-[2px] uppercase mb-2">Description</h4>
                    <p className="text-xs text-gray-400 font-future leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
                      {client.description}
                    </p>
                  </div>`;

if (regex.test(content)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync('src/pages/Clients.tsx', content);
  console.log("Updated Clients.tsx cards");
} else {
  console.log("Could not find card logic in Clients.tsx");
}

const fs = require('fs');

let content = fs.readFileSync('src/pages/Clients.tsx', 'utf8');

// Replace the inside of the modal
const modalStart = '{/* Specs detailed overview */}';
const modalEnd = '{/* View Case Study CTA */}';

const modalNewContent = `{/* Specs detailed overview */}
              <div className="mb-8">
                <h4 className="font-display text-[10px] text-gray-500 tracking-[2.5px] uppercase mb-3">About the Project</h4>
                <p className="text-sm text-gray-300 font-future leading-relaxed">
                  {selectedClient.description}
                </p>
              </div>

              {/* Client Review Section */}
              {selectedClient.review && (
                <div className="mb-8 p-6 bg-white/5 border border-white/10 rounded-2xl relative">
                  <div className="absolute top-4 right-4 text-neon-cyan/20">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
                  </div>
                  <p className="text-gray-300 font-future text-sm italic leading-relaxed relative z-10">"{selectedClient.review}"</p>
                </div>
              )}
              
              {/* External Links */}
              {selectedClient.websiteLink && (
                <div className="flex gap-4">
                  <a href={selectedClient.websiteLink} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl border border-neon-cyan/50 text-neon-cyan font-display font-bold uppercase text-xs tracking-[2px] hover:bg-neon-cyan/10 transition-colors">
                    <ExternalLink size={16} /> Client Website
                  </a>
                </div>
              )}
`;

content = content.replace(new RegExp(modalStart.replace(/[.*+?^$\{}()|[\]\\]/g, '\\$&') + '[\\s\\S]*?' + modalEnd.replace(/[.*+?^$\{}()|[\]\\]/g, '\\$&')), modalNewContent);

fs.writeFileSync('src/pages/Clients.tsx', content);


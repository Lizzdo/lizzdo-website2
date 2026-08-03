const fs = require('fs');
let content = fs.readFileSync('src/pages/Project.tsx', 'utf8');

const mainBodyRegex = /\{project\.body && \([\s\S]*?<\/div>\s*\)\}/;
const newMainBody = `{project.body && (
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
               <div className="aspect-video w-full rounded-2xl overflow-hidden border border-white/10 mt-12 bg-black">
                 {project.video.includes('youtube.com') || project.video.includes('youtu.be') ? (
                   <iframe src={project.video.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')} className="w-full h-full" allowFullScreen allow="autoplay; encrypted-media" />
                 ) : project.video.includes('vimeo.com') ? (
                   <iframe src={project.video.replace('vimeo.com/', 'player.vimeo.com/video/')} className="w-full h-full" allowFullScreen allow="autoplay; encrypted-media" />
                 ) : (
                   <video src={project.video} controls className="w-full h-full" />
                 )}
               </div>
            )}`;
            
content = content.replace(mainBodyRegex, newMainBody);

const sidebarRegex = /<div className="flex flex-col gap-4">[\s\S]*?\{project\.tags && project\.tags\.length > 0 && \(/;

const newSidebar = `<div className="flex flex-col gap-4">
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

            {project.tags && project.tags.length > 0 && (`;
            
content = content.replace(sidebarRegex, newSidebar);

// Also need to fix the Lightbox props to handle video URLs if they exist in gallery
// Right now Lightbox gets strings. 
content = content.replace(
  /images=\{project\.gallery \? project\.gallery\.map\(\(item: any\) => typeof item === 'string' \? item : item\?\.image\)\.filter\(Boolean\) : \[\]\}/,
  `images={project.gallery ? project.gallery.map((item: any) => typeof item === 'string' ? item : (item?.image || item)).filter(Boolean) : []}`
);


fs.writeFileSync('src/pages/Project.tsx', content);
console.log("Updated Project.tsx render function");

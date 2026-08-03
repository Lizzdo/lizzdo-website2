const fs = require('fs');
let content = fs.readFileSync('src/pages/Contact.tsx', 'utf8');

const replacement = `                  </div>
                  
                  {pageData?.hours && (
                    <div className="flex items-start gap-6 group">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      </div>
                      <div>
                        <h4 className="font-display text-sm font-bold mb-2 tracking-[1px]">BUSINESS HOURS</h4>
                        <p className="text-gray-400 font-future text-sm leading-relaxed">
                          {pageData.hours.split('\\n').map((line: string, i: number) => <React.Fragment key={i}>{line}<br/></React.Fragment>)}
                        </p>
                      </div>
                    </div>
                  )}

                </div>`;

content = content.replace(/                  <\/div>\n                <\/div>/, replacement);

fs.writeFileSync('src/pages/Contact.tsx', content);


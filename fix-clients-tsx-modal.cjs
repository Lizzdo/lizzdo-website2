const fs = require('fs');
let content = fs.readFileSync('src/pages/Clients.tsx', 'utf8');

const regex = /\{\/\* Specs detailed overview \*\/\}([\s\S]*?)\{\/\* Client Review Section \*\/\}/;

const replacement = `{/* Specs detailed overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-xs font-future">
                <div className="space-y-4">
                  {selectedClient.industry && (
                    <div>
                      <span className="text-gray-500 uppercase tracking-[1.5px] block mb-1">Industry</span>
                      <span className="text-gray-200 text-sm">{selectedClient.industry}</span>
                    </div>
                  )}
                  {selectedClient.country && (
                    <div>
                      <span className="text-gray-500 uppercase tracking-[1.5px] block mb-1">Country</span>
                      <span className="text-gray-200 text-sm">{selectedClient.country}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  {selectedClient.project && (
                    <div>
                      <span className="text-gray-500 uppercase tracking-[1.5px] block mb-1">Project Completed</span>
                      <span className="text-gray-200 text-sm">{selectedClient.project}</span>
                    </div>
                  )}
                  {selectedClient.completionDate && (
                    <div>
                      <span className="text-gray-500 uppercase tracking-[1.5px] block mb-1">Completion Date</span>
                      <span className="text-neon-green font-semibold text-sm">{selectedClient.completionDate}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Requirement detailed text */}
              {selectedClient.description && (
                <div className="mb-8">
                  <h4 className="font-display text-[10px] text-gray-500 tracking-[2.5px] uppercase mb-3">Project Description Summary</h4>
                  <p className="text-sm text-gray-300 font-future leading-relaxed">
                    {selectedClient.description}
                  </p>
                </div>
              )}
              
              {/* Client Review Section */}`;

if (regex.test(content)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync('src/pages/Clients.tsx', content);
  console.log("Updated Clients.tsx modal details");
} else {
  console.log("Could not find modal details logic in Clients.tsx");
}

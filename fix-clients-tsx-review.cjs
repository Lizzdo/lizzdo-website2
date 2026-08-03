const fs = require('fs');
let content = fs.readFileSync('src/pages/Clients.tsx', 'utf8');

const regex = /<p className="text-sm font-future text-gray-300 italic leading-relaxed">"\{selectedClient\.review\}"<\/p>/;

const replacement = `<p className="text-sm font-future text-gray-300 italic leading-relaxed">"{selectedClient.review}"</p>
                  {selectedClient.contactName && (
                    <div className="mt-4 text-xs font-mono text-gray-500 uppercase tracking-widest border-t border-white/5 pt-3">
                      — {selectedClient.contactName}
                    </div>
                  )}`;

if (regex.test(content)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync('src/pages/Clients.tsx', content);
  console.log("Updated Clients.tsx review section");
} else {
  console.log("Could not find review section in Clients.tsx");
}

const fs = require('fs');
let content = fs.readFileSync('src/pages/Clients.tsx', 'utf8');

// Fix mapping to use what's available
content = content.replace(/const clientsData = getCollection\([\s\S]*?\}\)\)\.sort/m, 
`const clientsData = getCollection(import.meta.glob('../content/clients/*.json', { eager: true })).map((file: any) => ({
  name: file.title,
  company: file.company || "",
  category: file.category || "Uncategorized",
  iconName: file.iconName || "User",
  websiteLink: file.websiteLink || "",
  description: file.description || "",
  clientLogoUrl: file.clientLogoUrl || "",
  review: file.review || "",
  order: file.order || 0
})).sort`);

// Fix filter search
content = content.replace(/client\.requirements\.toLowerCase\(\)\.includes\(searchQuery\.toLowerCase\(\)\) \|\|[\s\S]*?client\.software\.toLowerCase\(\)\.includes\(searchQuery\.toLowerCase\(\)\);/,
`client.description.toLowerCase().includes(searchQuery.toLowerCase());`);

// Fix the list view rendering where it expects platform/software/engagementType etc
content = content.replace(/<div className="grid grid-cols-2 gap-4 mt-6">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/button>/m,
`<div className="mt-4 text-sm text-gray-400 font-future line-clamp-3">
  {client.description}
</div>
</div>
</div>
</div>
</button>`);

// Fix the modal view details
content = content.replace(/<div className="grid grid-cols-2 gap-6 mb-8">[\s\S]*?<\/div>\s*<div className="mb-8">/m,
`<div className="mb-8">
  <h4 className="text-neon-cyan font-mono text-[10px] uppercase tracking-[2px] mb-3">About</h4>
  <p className="text-gray-300 font-future text-sm leading-relaxed">{selectedClient.description}</p>
</div>
<div className="mb-8">`);

// Actually the modal has more sections like Requirements, Achievements, etc. let's check
fs.writeFileSync('src/pages/Clients.tsx', content);


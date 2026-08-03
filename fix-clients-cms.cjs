const fs = require('fs');

let content = fs.readFileSync('src/pages/Clients.tsx', 'utf8');

// Replace custom import logic with getCollection
if (!content.includes('getCollection')) {
    content = content.replace(/import DocumentHead from "\.\.\/components\/DocumentHead";/, 'import DocumentHead from "../components/DocumentHead";\nimport { getCollection, getSingle } from "../lib/content";');
}

// Replace the clientsData setup
content = content.replace(/const clientFiles = import\.meta\.glob\('\.\.\/content\/clients\/\*\.json', \{ eager: true \}\);\nconst clientsData = Object\.values\(clientFiles\)\.map\(\(file: any\) => \(\{\n[\s\S]*?review: file\.review \|\| undefined\n\}\)\);/, 
  `const clientsData = getCollection(import.meta.glob('../content/clients/*.json', { eager: true })).map((file: any) => ({
  name: file.title,
  company: file.company,
  category: file.category || "Uncategorized",
  platform: file.platform,
  software: file.software,
  engagementType: file.engagementType,
  milestoneStatus: file.milestoneStatus,
  iconName: file.iconName,
  requirements: file.requirements,
  achievements: file.achievements || [],
  websiteLink: file.websiteLink,
  clientLogoUrl: file.clientLogoUrl,
  rating: file.rating,
  review: file.review,
  order: file.order || 0
})).sort((a: any, b: any) => a.order - b.order);`);

fs.writeFileSync('src/pages/Clients.tsx', content);


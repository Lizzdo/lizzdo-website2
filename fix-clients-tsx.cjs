const fs = require('fs');
let content = fs.readFileSync('src/pages/Clients.tsx', 'utf8');

const regex = /const clientsData = getCollection\(import\.meta\.glob\('\.\.\/content\/clients\/\*\.json', \{ eager: true \}\)\)\.map\(\(file: any\) => \(\{[\s\S]*?\}\)\)\.sort\(\(a: any, b: any\) => a\.order - b\.order\);/;

const replacement = `const rawClients = getCollection(import.meta.glob('../content/clients/*.json', { eager: true }));
const clientsData = rawClients
  .filter((f: any) => f.published !== false)
  .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
  .map((file: any) => ({
    ...file,
    name: file.title,
    company: file.company || "",
    category: file.category || "Uncategorized",
    iconName: file.iconName || "User",
    websiteLink: file.websiteLink || "",
    description: file.description || "",
    clientLogoUrl: file.clientLogoUrl || "",
    coverImage: file.coverImage || "",
    industry: file.industry || "",
    country: file.country || "",
    project: file.project || "",
    completionDate: file.completionDate || "",
    contactName: file.contactName || "",
    review: file.review || "",
    order: file.order || 0,
    featured: file.featured === true
  }));`;

if (regex.test(content)) {
  content = content.replace(regex, replacement);
  
  // also make category list dynamic
  const categoryRegex = /const categories = \["ALL", "Roblox UGC", "Unity Engine", "3D Printing", "Web & Animation", "Web & App Dev", "AI & Data Science"\];/;
  const categoryReplacement = `const categories = ["ALL", ...Array.from(new Set(clientsData.map(c => c.category)))];`;
  content = content.replace(categoryRegex, categoryReplacement);
  
  fs.writeFileSync('src/pages/Clients.tsx', content);
  console.log("Updated Clients.tsx mapping");
} else {
  console.log("Could not find clientsData logic in Clients.tsx");
}

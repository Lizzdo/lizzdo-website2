const fs = require('fs');
let content = fs.readFileSync('src/pages/Clients.tsx', 'utf8');

// Fix Duplicate identifier
content = content.replace(/import \{ getSingle \} from "\.\.\/lib\/content";\s*import \{ getSingle \} from "\.\.\/lib\/content";/g, 'import { getSingle } from "../lib/content";');
content = content.replace(/import \{ getSingle \} from "\.\.\/lib\/content";/g, 'import { getSingle, getCollection } from "../lib/content";');
content = content.replace(/import \{ getCollection \} from "\.\.\/lib\/content";/g, '');

content = content.replace(/import \{ getSingle, getCollection \} from "\.\.\/lib\/content";\s*import \{ getSingle, getCollection \} from "\.\.\/lib\/content";/g, 'import { getSingle, getCollection } from "../lib/content";');


// We need to restore the mapping to just map everything, so typescript stops complaining!
content = content.replace(
  /const clientsData = getCollection\(import\.meta\.glob\('\.\.\/content\/clients\/\*\.json', \{ eager: true \}\)\)\.map\(\(file: any\) => \(\{[\s\S]*?\}\)\)\.sort/m,
  `const clientsData = getCollection(import.meta.glob('../content/clients/*.json', { eager: true })).map((file: any) => ({
  ...file,
  name: file.title,
  company: file.company || "",
  category: file.category || "Uncategorized",
  iconName: file.iconName || "User",
  websiteLink: file.websiteLink || "",
  description: file.description || "",
  clientLogoUrl: file.clientLogoUrl || "",
  review: file.review || "",
  order: file.order || 0
})).sort`
);

fs.writeFileSync('src/pages/Clients.tsx', content);

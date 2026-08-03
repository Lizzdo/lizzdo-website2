const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const regex = /const featuredClients = featured_clients\?\.clients_list\?\.length > 0\n    \? featured_clients\.clients_list\.map\(\(slug: string\) => allClients\.find\(\(c: any\) => c\.slug === slug\)\)\.filter\(Boolean\)\n    : allClients\.slice\(0, 5\);/;

const replacement = `const featuredClients = featured_clients?.clients_list?.length > 0
    ? featured_clients.clients_list.map((slug: string) => allClients.find((c: any) => c.slug === slug)).filter(Boolean)
    : allClients.filter((c: any) => c.featured === true).slice(0, 5);
    
  if (featuredClients.length === 0) {
    featuredClients.push(...allClients.slice(0, 5));
  }`;

if (regex.test(content)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync('src/pages/Home.tsx', content);
  console.log("Updated Home.tsx featured clients logic");
} else {
  console.log("Could not find featuredClients logic in Home.tsx");
}

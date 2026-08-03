const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

content = content.replace(
  /const services = featured_services\?\.[^]*?slice\(0, 8\)\)\;\s*\}/,
  `let services = featured_services?.services_list?.length > 0
    ? featured_services.services_list.map((slug: string) => allServices.find((s: any) => s.slug === slug)).filter(Boolean)
    : allServices.filter((s: any) => s.published !== false && s.featured === true).slice(0, 8);
    
  if (services.length === 0) {
    services = allServices.filter((s: any) => s.published !== false).slice(0, 8);
  }`
);

fs.writeFileSync('src/pages/Home.tsx', content);
console.log("Updated Home.tsx properly");

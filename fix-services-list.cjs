const fs = require('fs');

let content = fs.readFileSync('src/pages/Services.tsx', 'utf8');

content = content.replace(
  /const services = rawServices\.map\(\(service: any\) => \{/,
  `const services = rawServices.filter((s: any) => s.published !== false).map((service: any) => {`
);

fs.writeFileSync('src/pages/Services.tsx', content);
console.log("Updated Services.tsx filter");

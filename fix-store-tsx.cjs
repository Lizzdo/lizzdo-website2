const fs = require('fs');
let content = fs.readFileSync('src/pages/Store.tsx', 'utf8');

content = content.replace(
  /const formattedItems = items\.map\(\(file: any\) => \(\{/,
  `const formattedItems = items.filter((f: any) => f.published !== false).sort((a: any, b: any) => (a.order || 0) - (b.order || 0)).map((file: any) => ({`
);

fs.writeFileSync('src/pages/Store.tsx', content);
console.log("Updated Store.tsx");

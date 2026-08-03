const fs = require('fs');

let content = fs.readFileSync('src/pages/About.tsx', 'utf8');
content = content.replace(
  /\{toArray\(timeline \|\| pageData\?\.timeline\)\.map/,
  `{toArray(timeline || pageData?.timeline).sort((a: any, b: any) => (a.order || 0) - (b.order || 0)).map`
);

fs.writeFileSync('src/pages/About.tsx', content);
console.log("Updated timeline sort");

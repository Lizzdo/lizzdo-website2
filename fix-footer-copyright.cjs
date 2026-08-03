const fs = require('fs');
let content = fs.readFileSync('src/components/Footer.tsx', 'utf8');

content = content.replace(
  /© \{new Date\(\)\.getFullYear\(\)\} \{globalData\?\.site_name \|\| "LIZZDO"\} • ALL RIGHTS RESERVED/,
  `{globalData?.copyright || \`© \${new Date().getFullYear()} \${globalData?.site_name || "LIZZDO"} • ALL RIGHTS RESERVED\`}`
);

fs.writeFileSync('src/components/Footer.tsx', content);


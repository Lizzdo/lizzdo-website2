const fs = require('fs');

let content = fs.readFileSync('src/pages/Contact.tsx', 'utf8');
content = content.replace(/const XIcon = \(\{.*?\}\) => \([\s\S]*?<\/svg>\n\);\n\nconst BehanceIcon = \(\{.*?\}\) => \([\s\S]*?<\/svg>\n\);/g, '');
fs.writeFileSync('src/pages/Contact.tsx', content);

let content2 = fs.readFileSync('src/components/Footer.tsx', 'utf8');
content2 = content2.replace(/const XIcon = \(\{.*?\}\) => \([\s\S]*?<\/svg>\n\);\n\nconst BehanceIcon = \(\{.*?\}\) => \([\s\S]*?<\/svg>\n\);/g, '');
fs.writeFileSync('src/components/Footer.tsx', content2);

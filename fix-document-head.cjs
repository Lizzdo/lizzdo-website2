const fs = require('fs');
let content = fs.readFileSync('src/components/DocumentHead.tsx', 'utf8');

content = content.replace(/globalData\?\.seo\?\.default_title/g, "globalData?.default_title");
content = content.replace(/globalData\?\.seo\?\.default_description/g, "globalData?.default_description");
content = content.replace(/globalData\?\.seo\?\.default_og_image/g, "globalData?.default_og_image");

fs.writeFileSync('src/components/DocumentHead.tsx', content);
console.log("Updated DocumentHead.tsx");

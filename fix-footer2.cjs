const fs = require('fs');

let content = fs.readFileSync('src/components/Footer.tsx', 'utf8');
content = content.replace(/alt=\{globalData\?.site_name \|\| "\{globalData\?.site_name \|\| "LIZZDO"\}"\}/g, `alt={globalData?.site_name || "LIZZDO"}`);
content = content.replace(/\{\(globalData\?.site_name \|\| "\{globalData\?.site_name \|\| "LIZZDO"\}"\)\.substring\(0, 1\)\}/g, `{(globalData?.site_name || "LIZZDO").substring(0, 1)}`);
content = content.replace(/globalData\?.footer\?.description/g, 'globalData?.footer_text');
fs.writeFileSync('src/components/Footer.tsx', content);


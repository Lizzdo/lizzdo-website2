const fs = require('fs');
let content = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

content = content.replace(/alt=\{globalData\?.site_name \|\| "\{globalData\?.site_name \|\| "LIZZDO"\}"\}/g, `alt={globalData?.site_name || "LIZZDO"}`);
content = content.replace(/\{\(globalData\?.site_name \|\| "\{globalData\?.site_name \|\| "LIZZDO"\}"\)\.substring\(0, 1\)\}/g, `{(globalData?.site_name || "LIZZDO").substring(0, 1)}`);

fs.writeFileSync('src/components/Navbar.tsx', content);

const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

content = content.replace(/<link rel="icon"[^>]*>/g, '');
content = content.replace(/<link rel="shortcut icon"[^>]*>/g, '');
content = content.replace(/<link rel="apple-touch-icon"[^>]*>/g, '');

fs.writeFileSync('index.html', content);
console.log("Updated index.html to rely on Helmet for favicon");

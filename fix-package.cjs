const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.scripts.build = "vite build && vite build --ssr src/entry-server.tsx --outDir dist/server && node prerender.js && node -e \"import('fs').then(fs => fs.copyFileSync('dist/index.html', 'dist/404.html'))\"";
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));

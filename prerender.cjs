const fs = require('fs');
const path = require('path');
const domain = 'https://lizzdo.com';
const today = new Date().toISOString().split('T')[0];
const staticRoutes = [
  '/',
  '/about',
  '/services',
  '/portfolio',
  '/store',
  '/blog',
  '/clients',
  '/faq',
  '/contact',
  '/checkout'
];

// Function to read JSON slugs
function getSlugs(dir) {
  const dirPath = path.join(__dirname, 'src/content', dir);
  if (!fs.existsSync(dirPath)) return [];
  return fs.readdirSync(dirPath)
    .filter(file => file.endsWith('.json'))
    .map(file => {
       const content = JSON.parse(fs.readFileSync(path.join(dirPath, file), 'utf8'));
       return content.slug || file.replace('.json', '');
    });
}

const dynamicRoutes = [
  { prefix: '/services', items: getSlugs('services') },
  { prefix: '/portfolio', items: getSlugs('portfolio') },
  { prefix: '/store', items: getSlugs('store') },
  { prefix: '/blog', items: getSlugs('blog') }
];

const routesToPrerender = [...staticRoutes];
let urls = [];

staticRoutes.forEach(route => {
  urls.push(`  <url>
    <loc>${domain}${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`);
});

dynamicRoutes.forEach(({prefix, items}) => {
  items.forEach(slug => {
    const route = `${prefix}/${slug}`;
    routesToPrerender.push(route);
    urls.push(`  <url>
    <loc>${domain}${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`);
  });
});

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

fs.writeFileSync(path.join(__dirname, 'public', 'sitemap.xml'), sitemap);
console.log('Sitemap generated!');

// Run prerender
const template = fs.readFileSync(path.resolve(__dirname, 'dist/index.html'), 'utf-8');
const { render } = require('./dist/server/entry-server.cjs');

(async () => {
  for (const url of routesToPrerender) {
    try {
      const { html: appHtml, helmet } = await render(url);
      const html = template
        .replace('<!--ssr-outlet-->', appHtml)
        .replace(
          '<!--ssr-head-->',
          (helmet?.title?.toString() || '') +
          (helmet?.meta?.toString() || '') +
          (helmet?.link?.toString() || '')
        );

      const filePath = path.join(__dirname, 'dist', url === '/' ? 'index.html' : `${url}.html`);
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(filePath, html);
      console.log(`Prerendered: ${url}`);
    } catch (e) {
      console.error(`Error prerendering ${url}:`, e);
    }
  }
})();

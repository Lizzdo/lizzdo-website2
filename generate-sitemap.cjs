const fs = require('fs');
const path = require('path');

const domain = 'https://lizzdo.com';
const today = new Date().toISOString().split('T')[0];

const staticRoutes = [
  '',
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

let urls = staticRoutes.map(route => `
  <url>
    <loc>${domain}${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
  </url>
`);

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

dynamicRoutes.forEach(({prefix, items}) => {
  items.forEach(slug => {
    urls.push(`
  <url>
    <loc>${domain}${prefix}/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
    `);
  });
});

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('')}
</urlset>`;

fs.writeFileSync(path.join(__dirname, 'public', 'sitemap.xml'), sitemap);
console.log('Sitemap generated!');

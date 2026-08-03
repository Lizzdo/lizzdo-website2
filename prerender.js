import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  '/checkout',
  '/estimator',
  '/legal/terms-of-service',
  '/legal/privacy-policy',
  '/legal/data-compliance',
  '/legal/cookie-policy',
  '/legal/acceptable-use',
  '/legal/disclaimer'
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
const { render } = await import('./dist/server/entry-server.js');

for (const url of routesToPrerender) {
  try {
    let { html: appHtml } = await render(url);
    
    // React 19 hoists tags to the front of renderToString output.
    const rootIndex = appHtml.indexOf('<div class="min-h-screen relative">');
    let extractedHead = '';
    if (rootIndex > 0) {
      extractedHead = appHtml.substring(0, rootIndex);
      appHtml = appHtml.substring(rootIndex);
    }
    
    const headContent = extractedHead;

    const html = template
      .replace('<!--ssr-outlet-->', appHtml)
      .replace('<!--ssr-head-->', headContent);

    const filePath = path.join(__dirname, 'dist', url === '/' ? 'index.html' : `${url}/index.html`);
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

const fs = require('fs');
let content = fs.readFileSync('src/pages/Product.tsx', 'utf8');

const mapRegex = /const items = rawItems\.map\(\(file: any\) => \(\{[\s\S]*?seo_description: file\.seo_description \|\| ""\s*\}\)\);/;
const newMap = `const items = rawItems.filter((f: any) => f.published !== false).sort((a: any, b: any) => (a.order || 0) - (b.order || 0)).map((file: any) => ({
        id: file.slug,
        title: file.title,
        slug: file.slug,
        category: (() => { const arr = toArray(file.category); return arr.length ? arr : ["UNCATEGORIZED"]; })(),
        desc: file.description,
        body: file.body,
        price: file.price || 0,
        sale_price: file.sale_price,
        image: file.thumbnail || "https://images.unsplash.com/photo-1594921946029-79848cf69c73?q=80&w=1000",
        gallery: toArray(file.gallery),
        video: file.video || "",
        tags: toArray(file.tags),
        product_type: file.product_type || "",
        sku: file.sku || "",
        version: file.version || "",
        file_size: file.file_size || "",
        format: file.format || "",
        compatibility: toArray(file.compatibility),
        requirements: file.requirements || "",
        features: toArray(file.features),
        included_files: toArray(file.included_files),
        documentation: file.documentation || "",
        installation: file.installation || "",
        demo_url: file.demo_url || "",
        external_url: file.external_url || "",
        buy_url: file.buy_url || "",
        customization_url: file.customization_url || "",
        seo_title: file.seo_title || "",
        seo_description: file.seo_description || "",
        downloads: toArray(file.downloads).map(d => typeof d === 'string' ? d : (d.link || '')),
        videos: toArray(file.videos).map(v => typeof v === 'string' ? v : (v.url || '')),
        polygons: file.polygons || "",
        textures: file.textures === true,
        rigged: file.rigged === true,
        animated: file.animated === true,
        license: file.license || "Commercial License"
      }));`;

content = content.replace(mapRegex, newMap);
fs.writeFileSync('src/pages/Product.tsx', content);
console.log("Updated Product.tsx mapping");

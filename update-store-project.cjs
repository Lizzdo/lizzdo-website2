const fs = require('fs');

// Update Store.tsx
let contentStore = fs.readFileSync('src/pages/Store.tsx', 'utf8');

// Ensure import { getCollection } from "../lib/content";
if (!contentStore.includes('getCollection') && contentStore.includes('getSingle')) {
    contentStore = contentStore.replace(/import \{ getSingle \} from "\.\.\/lib\/content";/, 'import { getSingle, getCollection } from "../lib/content";');
} else if (!contentStore.includes('getCollection')) {
    contentStore = contentStore.replace(/import DocumentHead/, 'import { getCollection } from "../lib/content";\nimport DocumentHead');
}

contentStore = contentStore.replace(
  /const loadProducts = async \(\) => \{[\s\S]*?loadProducts\(\);\n  \}, \[\]\);/m,
  `const loadProducts = () => {
      const items = getCollection(import.meta.glob('../content/store/*.json', { eager: true }));
      const formattedItems = items.map((file: any) => ({
        id: file.slug,
        title: file.title,
        slug: file.slug,
        category: (() => { const arr = toArray(file.category); return arr.length ? arr : ["UNCATEGORIZED"]; })(),
        desc: file.description,
        price: file.price || 0,
        sale_price: file.sale_price,
        image: file.thumbnail || "https://images.unsplash.com/photo-1594921946029-79848cf69c73?q=80&w=1000",
      }));
      
      const computedCats = new Set<string>();
      computedCats.add("ALL");
      formattedItems.forEach((p: any) => {
        p.category.forEach((cat: string) => {
          computedCats.add(cat);
        });
      });
      setStoreCategories(Array.from(computedCats));
      setProducts(formattedItems);
    };
    loadProducts();
  }, []);`
);

fs.writeFileSync('src/pages/Store.tsx', contentStore);


// Update Product.tsx
let contentProduct = fs.readFileSync('src/pages/Product.tsx', 'utf8');

if (!contentProduct.includes('getCollection') && contentProduct.includes('getSingle')) {
    contentProduct = contentProduct.replace(/import \{ getSingle \} from "\.\.\/lib\/content";/, 'import { getSingle, getCollection } from "../lib/content";');
} else if (!contentProduct.includes('getCollection')) {
    contentProduct = contentProduct.replace(/import DocumentHead/, 'import { getCollection } from "../lib/content";\nimport DocumentHead');
}

contentProduct = contentProduct.replace(
  /const loadProduct = \(\) => \{[\s\S]*?loadProduct\(\);\n    window\.scrollTo/m,
  `const loadProduct = () => {
      setLoading(true);
      const rawItems = getCollection(import.meta.glob('../content/store/*.json', { eager: true }));
      const items = rawItems.map((file: any) => ({
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
        tags: toArray(file.tags),
        downloads: toArray(file.downloads).map(d => typeof d === 'string' ? d : (d.link || '')),
        videos: toArray(file.videos).map(v => typeof v === 'string' ? v : (v.url || '')),
        format: file.format || "",
        polygons: file.polygons || "",
        textures: file.textures === true,
        rigged: file.rigged === true,
        animated: file.animated === true,
        license: file.license || "Commercial License",
        seo_title: file.seo_title || "",
        seo_description: file.seo_description || ""
      }));
      
      setAllProducts(items);
      const found = items.find((p) => p.slug === slug);
      if (found) {
        setProduct(found);
        
        // Find related safely
        const related = items.filter(p => 
          p.slug !== slug && 
          (p.category && found.category && p.category.some((c: string) => found.category.includes(c)))
        ).slice(0, 3);
        setRelatedProducts(related);
      } else {
        setProduct(null);
      }
      setLoading(false);
    };
    
    loadProduct();
    window.scrollTo`
);

fs.writeFileSync('src/pages/Product.tsx', contentProduct);


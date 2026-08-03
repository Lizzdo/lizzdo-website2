const fs = require('fs');
let content = fs.readFileSync('src/pages/Product.tsx', 'utf8');

content = content.replace(
  /const allMedia = useMemo\(\(\) => \{[\s\S]*?return media;\n  \}, \[product\]\);/,
  `const allMedia = useMemo(() => {
    if (!product) return [];
    let media: string[] = [];
    if (product.video) media.push(product.video);
    if (product.videos && product.videos.length > 0) { product.videos.forEach((v: string) => { if (!media.includes(v)) media.push(v); }); }
    if (product.image && !media.includes(product.image)) media.push(product.image);
    if (product.gallery && product.gallery.length > 0) {
      product.gallery.forEach((item: any) => {
        const url = typeof item === 'string' ? item : item?.image;
        if (url && !media.includes(url)) media.push(url);
      });
    }
    return media;
  }, [product]);`
);

fs.writeFileSync('src/pages/Product.tsx', content);
console.log("Updated Product.tsx allMedia logic");

const fs = require('fs');

let content = fs.readFileSync('src/pages/Product.tsx', 'utf8');

content = content.replace(/if \(product\.videos && product\.videos\.length > 0\) media\.push\(product\.videos && product\.videos\.length > 0\);/g, `if (product.videos && product.videos.length > 0) { product.videos.forEach((v: string) => media.push(v)); }`);

content = content.replace(/href=\{product\.videos && product\.videos\.length > 0\}/g, `href={product.videos[0]}`);

fs.writeFileSync('src/pages/Product.tsx', content);


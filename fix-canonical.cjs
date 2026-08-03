const fs = require('fs');
let content = fs.readFileSync('src/components/DocumentHead.tsx', 'utf8');

// Insert canonical URL logic
if (!content.includes('canonical')) {
    content = content.replace(/const finalImage = image \|\| defaultImage;/, `const finalImage = image || defaultImage;\n  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';`);
    content = content.replace(/<\/Helmet>/, `      {currentUrl && <link rel="canonical" href={currentUrl} />}\n    </Helmet>`);
    fs.writeFileSync('src/components/DocumentHead.tsx', content);
    console.log('Fixed canonical URL');
}

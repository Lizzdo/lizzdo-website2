const fs = require('fs');
let content = fs.readFileSync('src/components/DocumentHead.tsx', 'utf8');

// Insert Twitter Card logic
if (!content.includes('twitter:card')) {
    content = content.replace(/<\/Helmet>/, `      <meta name="twitter:card" content="summary_large_image" />\n      <meta name="twitter:title" content={finalTitle} />\n      <meta name="twitter:description" content={finalDescription} />\n      {finalImage && <meta name="twitter:image" content={finalImage} />}\n    </Helmet>`);
    fs.writeFileSync('src/components/DocumentHead.tsx', content);
    console.log('Fixed twitter card');
}

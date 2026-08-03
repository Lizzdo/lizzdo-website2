const fs = require('fs');
let content = fs.readFileSync('src/components/DocumentHead.tsx', 'utf8');

const jsonLd = `
      {/* Schema.org Structured Data */}
      <script type="application/ld+json">
        {\`
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "\${siteTitle}",
            "url": "https://lizzdo.com",
            "logo": "\${globalData?.logo || ''}",
            "sameAs": [
              \${(globalData?.social || []).map((s) => \`"\${s.url}"\`).join(', ')}
            ]
          }
        \`}
      </script>
`;

content = content.replace(/\{.*?Schema\.org Structured Data.*<\/script>/s, jsonLd.trim());
fs.writeFileSync('src/components/DocumentHead.tsx', content);

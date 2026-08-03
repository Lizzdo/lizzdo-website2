const fs = require('fs');
let content = fs.readFileSync('src/pages/BlogPost.tsx', 'utf8');

const regex = /const rawItems = getCollection\(import\.meta\.glob\('\.\.\/content\/blog\/\*\.json', \{ eager: true \}\)\);\n      const items = rawItems\.map\(\(file: any\) => \(\{[\s\S]*?\}\)\);/;

const replacement = `const rawItems = getCollection(import.meta.glob('../content/blog/*.json', { eager: true }));
      const items = rawItems
        .filter((file: any) => file.published !== false)
        .map((file: any) => ({
          id: file.slug,
          slug: file.slug,
          title: file.title,
          category: (Array.isArray(file.category) ? file.category[0] : file.category) || "Uncategorized",
          excerpt: file.description || file.excerpt || "",
          body: file.body || "",
          date: new Date(file.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) || "",
          image: file.thumbnail || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000",
          readTime: file.readTime || "5 min read",
          author: file.author || "Team",
          seo_title: file.seo_title || "",
          seo_description: file.seo_description || "",
          tags: file.tags || []
        }));`;

if (regex.test(content)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync('src/pages/BlogPost.tsx', content);
  console.log("Updated BlogPost.tsx mapping");
} else {
  console.log("Could not find loadedPosts logic in BlogPost.tsx");
}

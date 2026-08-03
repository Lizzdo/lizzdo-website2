const fs = require('fs');
let content = fs.readFileSync('src/pages/Blog.tsx', 'utf8');

const regex = /const loadedPosts = useMemo\(\(\) => \{[\s\S]*?rawItems\.map\(\(file: any\) => \(\{[\s\S]*?\}\)\);\n  \}, \[\]\);/;

const replacement = `const loadedPosts = useMemo(() => {
    const rawItems = getCollection(import.meta.glob('../content/blog/*.json', { eager: true }));
    return rawItems
      .filter((file: any) => file.published !== false)
      .sort((a: any, b: any) => {
        if (a.order !== b.order && a.order !== undefined && b.order !== undefined) {
          return (a.order || 0) - (b.order || 0);
        }
        return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
      })
      .map((file: any) => ({
        id: file.slug,
        slug: file.slug,
        title: file.title,
        category: (Array.isArray(file.category) ? file.category[0] : file.category) || "Uncategorized",
        excerpt: file.description || file.excerpt || "",
        date: new Date(file.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) || "",
        image: file.thumbnail || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000",
        readTime: file.readTime || "5 min read",
        author: file.author || "Team",
      }));
  }, []);`;

if (regex.test(content)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync('src/pages/Blog.tsx', content);
  console.log("Updated Blog.tsx mapping");
} else {
  console.log("Could not find loadedPosts logic in Blog.tsx");
}

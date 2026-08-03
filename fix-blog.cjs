const fs = require('fs');

let content = fs.readFileSync('src/pages/Blog.tsx', 'utf8');

if (!content.includes('getCollection')) {
    content = content.replace(/import \{ getSingle \} from "\.\.\/lib\/content";/, 'import { getSingle, getCollection } from "../lib/content";');
}

content = content.replace(
  /const loadedPosts = useMemo\(\(\) => \{[\s\S]*?\}, \[\]\);/m,
  `const loadedPosts = useMemo(() => {
    const rawItems = getCollection(import.meta.glob('../content/blog/*.json', { eager: true }));
    return rawItems.map((file: any) => ({
      id: file.slug,
      slug: file.slug,
      title: file.title,
      category: file.category || "Uncategorized",
      excerpt: file.description || file.excerpt || "",
      date: file.date || "",
      image: file.thumbnail || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000",
      readTime: file.readTime || "5 min read",
      author: file.author || "Team",
    }));
  }, []);`
);

fs.writeFileSync('src/pages/Blog.tsx', content);


const fs = require('fs');
const filepath = 'src/data/blogData.ts';

const content = `import { getCollection } from "../lib/content";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: string;
  image: string;
  readTime: string;
}

const rawBlogPosts = getCollection(import.meta.glob('../content/blog/*.json', { eager: true }));

export const blogPosts: BlogPost[] = rawBlogPosts.map((post: any) => {
  return {
    id: post.slug || 'unknown',
    title: post.title || 'Untitled',
    slug: post.slug || 'unknown',
    excerpt: post.description || '',
    content: post.body || '',
    date: new Date(post.date || Date.now()).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }),
    author: post.author || 'Unknown',
    category: post.category || 'Uncategorized',
    image: post.thumbnail || "/lizzdo-logo.png",
    readTime: post.readTime || "5 min read"
  };
});
`;

fs.writeFileSync(filepath, content);

import { getCollection } from "../lib/content";

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

export const blogPosts: BlogPost[] = rawBlogPosts.map((post: any) => ({
  id: post.slug,
  title: post.title || 'Untitled',
  slug: post.slug,
  excerpt: post.description || '',
  content: post.body || '',
  date: post.date ? new Date(post.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }) : new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
  author: post.author || 'Unknown',
  category: post.category || 'Uncategorized',
  image: post.thumbnail || "/lizzdo-logo.png",
  readTime: post.readTime || "5 min read"
}));

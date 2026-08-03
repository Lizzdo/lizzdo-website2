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

const blogFiles: any = {};

export const blogPosts: BlogPost[] = Object.keys(blogFiles)
  .map((key) => {
    const post = blogFiles[key] as any;
    return {
      ...post,
      id: post.slug || key.split('/').pop()?.replace('.json', '') || 'unknown',
    };
  })
  .sort((a,b) => 0);

const fs = require('fs');

let content = fs.readFileSync('src/pages/BlogPost.tsx', 'utf8');

content = content.replace(
  /const loadPost = async \(\) => \{[\s\S]*?setIsLoading\(false\);\n    \};/m,
  `const loadPost = () => {
      const rawItems = getCollection(import.meta.glob('../content/blog/*.json', { eager: true }));
      const items = rawItems.map((file: any) => ({
        id: file.slug,
        slug: file.slug,
        title: file.title,
        category: file.category || "Uncategorized",
        excerpt: file.description || file.excerpt || "",
        body: file.body || "",
        date: file.date || "",
        image: file.thumbnail || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000",
        readTime: file.readTime || "5 min read",
        author: file.author || "Team",
        seo_title: file.seo_title || "",
        seo_description: file.seo_description || "",
        tags: file.tags || []
      }));
      
      const foundPost = items.find(p => p.slug === id);
      if (foundPost) {
        setPost({...foundPost, _allPosts: items});
      } else {
        navigate('/blog');
      }
      setIsLoading(false);
    };`
);
content = content.replace(/post\.content\.replace/g, 'post.body.replace');

fs.writeFileSync('src/pages/BlogPost.tsx', content);


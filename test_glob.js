const blogFiles = {
  '../content/blog/post1.json': { default: { title: 'Post 1', date: '2024-01-01', order: 2 } },
  '../content/blog/post2.json': { default: { title: 'Post 2', date: '2024-01-02', order: 1 } }
};

const res = Object.keys(blogFiles)
  .map((key) => {
    const post = blogFiles[key];
    return {
      ...post,
      id: post.slug || key.split('/').pop()?.replace('.json', '') || 'unknown',
    };
  });
console.log(JSON.stringify(res, null, 2));

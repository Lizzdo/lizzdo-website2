const fs = require('fs');
let content = fs.readFileSync('src/pages/BlogPost.tsx', 'utf8');

const regexNotFound = /if \(!post\) return null;/;
const notFoundReplacement = `if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black px-6 text-center">
        <DocumentHead title="Blog Post Not Found" />
        <h1 className="font-display text-4xl md:text-6xl font-black mb-6 holo-text uppercase">Blog Post Not Found</h1>
        <p className="text-gray-400 font-future text-lg mb-8 max-w-lg">The blog post you are looking for does not exist or has been removed.</p>
        <Link to="/blog" className="px-8 py-4 bg-neon-cyan text-black font-display font-bold text-sm tracking-[2px] uppercase rounded-xl hover:shadow-[0_0_30px_rgba(0,245,255,0.4)] transition-all flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Blog
        </Link>
      </div>
    );
  }`;

content = content.replace(regexNotFound, notFoundReplacement);

const regexNavigate = /navigate\('\/blog'\);/;
const navigateReplacement = `setPost(null);`;

content = content.replace(regexNavigate, navigateReplacement);

fs.writeFileSync('src/pages/BlogPost.tsx', content);
console.log("Updated BlogPost.tsx Not Found state");

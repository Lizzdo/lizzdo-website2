import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Calendar, User, Clock, ArrowLeft, ArrowRight, Share2, Facebook, Twitter, Linkedin } from "lucide-react";
import DocumentHead from "../components/DocumentHead";
import { getCollection } from "../lib/content";
import Markdown from "react-markdown";
import { useMemo } from "react";
import EstimatorCTA from "../components/EstimatorCTA";

export default function BlogPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const post = useMemo(() => {
    const rawItems = getCollection(import.meta.glob('../content/blog/*.json', { eager: true }));
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
        image: file.thumbnail || "/lizzdo-logo.png",
        readTime: file.readTime || "5 min read",
        author: file.author || "Team",
        seo_title: file.seo_title || "",
        seo_description: file.seo_description || "",
        tags: file.tags || []
      }));
    
    const foundPost = items.find(p => p.slug === id);
    if (foundPost) {
      return { ...foundPost, _allPosts: items };
    }
    return null;
  }, [id]);
  
  if (!post) {
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
  }

  
  const abstractContent = post.excerpt || post.body.replace(/<[^>]*>?/gm, '').substring(0, 150) + "...";
  
  const currentIndex = post._allPosts.findIndex((p: any) => p.slug === post.slug);
  const prevPost = currentIndex > 0 ? post._allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < post._allPosts.length - 1 && currentIndex !== -1 ? post._allPosts[currentIndex + 1] : null;

  return (
    <div className="flex flex-col">
      <DocumentHead title={post.title} description={abstractContent} />
      {/* Hero Header */}
      <section className="relative h-[40vh] md:h-[60vh] min-h-[300px] md:min-h-[400px] flex items-end pb-10 md:pb-20 px-6">
        <div className="absolute inset-0 z-0">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>
        
        <div className="container mx-auto relative z-10">
          <Link to="/blog" className="inline-flex items-center gap-2 text-neon-cyan text-xs font-bold uppercase tracking-widest mb-8 hover:gap-4 transition-all">
            <ArrowLeft size={14} /> Back to Blog
          </Link>
          <div className="max-w-4xl">
            <span className="px-4 py-1.5 rounded-full bg-neon-cyan/20 border border-neon-cyan/30 text-neon-cyan text-[10px] font-bold uppercase tracking-[3px] mb-6 inline-block">
              {post.category}
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-black mb-8 leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-8 text-xs text-gray-400 font-mono uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center">
                  <User size={14} className="text-neon-cyan" />
                </div>
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-neon-purple" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-neon-pink" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-6 pb-32">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <article className="prose prose-invert prose-cyan max-w-none font-future text-lg leading-relaxed text-gray-300">
                <Markdown>{post.body}</Markdown>
              </article>

              <div className="mt-20 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Share this:</span>
                  <div className="flex gap-2">
                    {[Facebook, Twitter, Linkedin, Share2].map((Icon, i) => (
                      <button key={i} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-neon-cyan/20 hover:border-neon-cyan transition-all text-gray-400 hover:text-neon-cyan">
                        <Icon size={18} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-4">
                  {post.tags && post.tags.map((tag: string) => (
                    <span key={tag} className="text-[10px] font-mono text-neon-cyan/60">
                      #{tag.replace(/^#/, '')}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-12">
              <div className="glass-panel p-8 rounded-3xl border border-white/10">
                <h4 className="font-display text-sm font-bold mb-6 tracking-[2px] text-neon-cyan uppercase">Newsletter</h4>
                <p className="text-xs text-gray-400 font-future mb-6 leading-relaxed">
                  Get the latest 3D insights and studio updates delivered to your inbox.
                </p>
                <input 
                  type="email" 
                  placeholder="your@email.com" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs placeholder:text-gray-600 focus:outline-none focus:border-neon-cyan mb-4 transition-all"
                />
                <button className="w-full py-3 rounded-xl bg-neon-cyan text-black font-display font-bold uppercase text-[10px] tracking-[2px] hover:bg-white transition-all">
                  Subscribe
                </button>
              </div>

              <div className="space-y-6">
                <h4 className="font-display text-sm font-bold tracking-[2px] text-neon-purple uppercase">Related Posts</h4>
                <div className="space-y-6">
                  {post._allPosts.filter((p: any) => p.id !== post.id).slice(0, 2).map(p => (
                    <Link key={p.id} to={`/blog/${p.id}`} className="group block">
                      <div className="aspect-video rounded-2xl overflow-hidden mb-3 border border-white/10">
                        <img src={p.image} alt={p.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                      </div>
                      <h5 className="font-display text-xs font-bold leading-tight group-hover:text-neon-cyan transition-colors line-clamp-2">
                        {p.title}
                      </h5>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Estimator Sidebar Banner */}
              <EstimatorCTA
                title="READY TO BUILD?"
                subtitle="Calculate an instant estimate for your next project."
                buttonText="Estimate Budget"
                variant="card"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

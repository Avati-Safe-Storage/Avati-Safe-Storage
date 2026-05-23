import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchBlogPostBySlug, fetchBlogPosts } from "../../actions";
import { Calendar, User, Tag, ArrowLeft, PhoneCall, ShieldCheck, Clock, MapPin } from "lucide-react";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await fetchBlogPostBySlug(slug);
  if (!post) {
    return {
      title: "Article Not Found | Avati Safe Storage",
      description: "The requested article does not exist or has been moved.",
    };
  }
  return {
    title: `${post.title} | Avati Safe Storage Blog`,
    description: post.excerpt || `Read the latest storage advice about ${post.category || "logistics"} from Avati Safe Storage.`,
  };
}

// Generate static routes for the most popular articles at build time (improves caching and speed)
export async function generateStaticParams() {
  const posts = await fetchBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await fetchBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const publishedDate = new Date(post.created_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#000000] text-[#f5f5f0] font-sans selection:bg-[#D4AF37] selection:text-black">
      {/* Article Header Hero */}
      <header className="relative py-16 md:py-24 bg-gradient-to-b from-[#0B1F3A]/40 to-[#000000] border-b border-white/5 overflow-hidden">
        {/* Subtle decorative mesh background */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] rounded-full bg-[#D4AF37] blur-[140px] animate-pulse"></div>
        </div>

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          {/* Back button */}
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-xs font-bold text-[#f5f5f0]/60 hover:text-[#D4AF37] mb-8 transition-colors group uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" /> Back to Articles
          </Link>

          {/* Category */}
          {post.category && (
            <span className="inline-block px-3 py-1 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/25 text-[#D4AF37] text-xs font-black uppercase tracking-widest mb-6">
              {post.category}
            </span>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-8 leading-tight text-[#f5f5f0]">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-y-4 gap-x-6 text-xs text-[#f5f5f0]/50 border-t border-white/5 pt-6">
            <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-[#D4AF37]" /> Written by Avati Expert Team</span>
            <span className="hidden md:inline text-white/10">•</span>
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-[#D4AF37]" /> {publishedDate}</span>
            <span className="hidden md:inline text-white/10">•</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#D4AF37]" /> 4 min read</span>
            <span className="hidden md:inline text-white/10">•</span>
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-[#D4AF37]" /> Bangalore, Karnataka</span>
          </div>
        </div>
      </header>

      {/* Main Grid: Content Column & Sidebar */}
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* LEFT COLUMN: Main Post Content (Prose styled) */}
          <article className="lg:col-span-8 flex flex-col">
            {/* Featured Image */}
            {post.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={post.image_url} 
                alt={post.title} 
                className="w-full h-[300px] md:h-[450px] object-cover rounded-2xl border border-white/5 shadow-2xl mb-12"
              />
            )}

            {/* Markdown/HTML rendered content with CSS custom styled variables */}
            <div 
              className="prose prose-invert prose-gold max-w-none 
                text-[#f5f5f0]/80 text-base md:text-lg leading-relaxed 
                prose-headings:text-[#f5f5f0] prose-headings:font-extrabold prose-headings:tracking-tight
                prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-white/5 prose-h2:pb-3
                prose-h3:text-xl prose-h3:md:text-2xl prose-h3:mt-8 prose-h3:mb-4
                prose-p:mb-6 prose-p:leading-relaxed
                prose-a:text-[#D4AF37] prose-a:underline hover:prose-a:text-[#FFD700] prose-a:transition-colors
                prose-strong:text-[#f5f5f0] prose-strong:font-bold
                prose-code:text-[#D4AF37] prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6 prose-ul:space-y-2
                prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-6 prose-ol:space-y-2
                prose-blockquote:border-l-4 prose-blockquote:border-[#D4AF37] prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-[#f5f5f0]/90 prose-blockquote:bg-white/[0.02] prose-blockquote:py-4 prose-blockquote:pr-4 prose-blockquote:rounded-r-xl prose-blockquote:my-8"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>

          {/* RIGHT COLUMN: Sticky Premium Sidebar */}
          <aside className="lg:col-span-4 lg:self-start lg:sticky lg:top-8 space-y-8">
            
            {/* Widget: "Get a Quote" Call To Action */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0B1F3A]/60 to-black border border-[#D4AF37]/25 p-8 shadow-[0_0_30px_rgba(212,175,55,0.1)]">
              {/* Highlight background light */}
              <div className="absolute top-0 right-0 w-[150px] h-[150px] rounded-full bg-[#D4AF37]/5 blur-[50px] pointer-events-none"></div>
              
              <div className="inline-flex items-center justify-center p-3 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              
              <h3 className="text-2xl font-extrabold text-[#f5f5f0] mb-3">
                Need Secure Storage?
              </h3>
              
              <p className="text-[#f5f5f0]/70 text-sm leading-relaxed mb-6">
                Avati Safe Storage provides premium, 24/7 CCTV-monitored warehouse and personal storage facilities in Bangalore. Custom pricing options tailored to your logistics requirements.
              </p>
              
              <div className="space-y-4 border-t border-white/5 pt-6">
                <p className="text-xs text-[#f5f5f0]/40 font-bold uppercase tracking-wider">
                  Call our Bangalore Office
                </p>
                <a 
                  href="tel:+918095589888" 
                  className="flex items-center justify-center gap-3 w-full py-4 px-5 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] hover:from-[#FFD700] hover:to-[#D4AF37] text-black font-extrabold rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.25)] hover:shadow-[0_0_30px_rgba(212,175,55,0.45)] hover:-translate-y-0.5 transition-all text-base md:text-lg duration-200"
                >
                  <PhoneCall className="w-5 h-5 animate-bounce" /> +91 80955 89888
                </a>
              </div>
              
              <div className="mt-4 text-center">
                <span className="inline-block text-[11px] text-[#f5f5f0]/50">
                  Instant Support • Safe & Insured Storage
                </span>
              </div>
            </div>

            {/* Quick Facts Card */}
            <div className="rounded-2xl bg-white/[0.02] border border-white/[0.05] p-6 space-y-4">
              <h4 className="font-bold text-sm text-[#f5f5f0] uppercase tracking-wider border-b border-white/5 pb-3">
                Why Choose Avati?
              </h4>
              <ul className="space-y-3 text-xs text-[#f5f5f0]/70">
                <li className="flex items-start gap-2">
                  <span className="text-[#D4AF37] font-extrabold">✓</span>
                  <span><strong>Zero Damage Guarantee:</strong> Multi-layer industrial wrapping.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#D4AF37] font-extrabold">✓</span>
                  <span><strong>24/7 Surveillance:</strong> High-definition CCTV and round-the-clock guards.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#D4AF37] font-extrabold">✓</span>
                  <span><strong>Flexible Terms:</strong> Store from 1 month to multiple years.</span>
                </li>
              </ul>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}

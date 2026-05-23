import Link from "next/link";
import { fetchBlogPosts } from "../actions";
import { Calendar, Tag, ArrowRight, ShieldCheck, MapPin } from "lucide-react";

export const metadata = {
  title: "Expert Storage Tips & Logistics Guides | Avati Safe Storage Blog",
  description:
    "Discover the best advice on household storage, packing, relocation services, and warehouse safety from Avati Safe Storage in Bangalore.",
};

export default async function BlogListPage() {
  const posts = await fetchBlogPosts();

  return (
    <div className="min-h-screen bg-[#000000] text-[#f5f5f0] selection:bg-[#D4AF37] selection:text-black font-sans">
      {/* Dynamic Animated Mesh Grid Header Background */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#0B1F3A]/40 to-[#000000] py-20 lg:py-28 border-b border-white/5">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-[-10%] left-[-20%] w-[60%] h-[60%] rounded-full bg-[#D4AF37] blur-[150px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#0B1F3A] blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-6">
            <ShieldCheck className="w-3.5 h-3.5" /> Secure Storage Intelligence
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Avati Safe Storage <span className="text-[#D4AF37]">Insights</span>
          </h1>
          <p className="max-w-2xl mx-auto text-base md:text-lg text-[#f5f5f0]/70 leading-relaxed">
            Professional advice, packing checklists, and household storage strategies curated by Bangalore's premier logistics and warehousing experts.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-xs text-[#f5f5f0]/50">
            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#D4AF37]" /> Bangalore HQ</span>
            <span>•</span>
            <span>Enterprise-Grade Security</span>
            <span>•</span>
            <span>Household & Business Storage</span>
          </div>
        </div>
      </div>

      {/* Main Blog Post Grid Section */}
      <main className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        {posts.length === 0 ? (
          <div className="text-center py-20 bg-white/5 border border-white/5 rounded-2xl p-8 max-w-lg mx-auto">
            <Tag className="w-12 h-12 text-[#D4AF37]/60 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No Articles Available</h3>
            <p className="text-[#f5f5f0]/60 mb-6">We're cooking up some amazing logistics, relocation, and warehouse storage guides. Please check back soon!</p>
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-bold rounded-lg shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all hover:-translate-y-0.5"
            >
              Go to Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article 
                key={post.id} 
                className="group flex flex-col bg-white/[0.03] border border-white/[0.07] hover:border-[#D4AF37]/30 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_30px_rgba(0,0,0,0.4)]"
              >
                {/* Image Wrapper */}
                <div className="relative h-56 bg-white/5 overflow-hidden border-b border-white/5">
                  {post.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={post.image_url} 
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0B1F3A]/20 to-[#D4AF37]/10">
                      <ShieldCheck className="w-16 h-16 text-[#D4AF37]/20" />
                    </div>
                  )}
                  {post.category && (
                    <span className="absolute top-4 left-4 inline-block px-2.5 py-1 rounded bg-[#D4AF37] text-black text-[10px] font-black uppercase tracking-widest z-10 shadow-lg">
                      {post.category}
                    </span>
                  )}
                </div>

                {/* Card Body */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    {/* Date */}
                    <div className="flex items-center gap-1.5 text-xs text-[#f5f5f0]/50 mb-3">
                      <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>
                        {new Date(post.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-[#f5f5f0] group-hover:text-[#D4AF37] line-clamp-2 leading-snug mb-3 transition-colors duration-200">
                      <Link href={`/blog/${post.slug}`} className="outline-none">
                        {post.title}
                      </Link>
                    </h2>

                    {/* Excerpt */}
                    <p className="text-[#f5f5f0]/70 text-sm leading-relaxed mb-6 line-clamp-3">
                      {post.excerpt || "Learn professional storage tips and tricks in this exclusive article from Bangalore's leading logistics enterprise."}
                    </p>
                  </div>

                  {/* Read More Link */}
                  <Link 
                    href={`/blog/${post.slug}`} 
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D4AF37] group-hover:text-[#FFD700] transition-colors mt-auto uppercase tracking-wider"
                  >
                    Read Article <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// ============================================================
//  Avati Safe Storage — Premium Blog Pages
//  CMS-driven blog list and post pages with Navy & Gold theme.
//  Content fetched from Zoho Creator (or local fallback).
// ============================================================

import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Clock, Calendar, User, ChevronRight, Phone, Mail, 
  MapPin, Shield, CheckCircle, Tag, Share2, ArrowRight, Bookmark, 
  Search, Sparkles, MessageCircle, AlertCircle, CalendarDays, BookOpen,
  ArrowUpRight
} from 'lucide-react';
import { getCMS } from '../../lib/cms';
import type { BlogPost } from '../../lib/cms';
import { useSEO } from '../../lib/seo/seoManager';
import { buildArticleSchema } from '../../lib/seo/schemaBuilder';
import { BASE_URL } from '../../lib/pseo/locationData';
import { useTheme } from '../App';

// ── Blog List Page ────────────────────────────────────────────
export function BlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { dark } = useTheme();

  useSEO({
    title: 'Storage Tips & Guides | Avati Safe Storage Blog',
    description: 'Expert tips on self-storage, household packing, business warehousing, and relocation logistics from the Avati Safe Storage team in Bangalore.',
    canonical: `${BASE_URL}/blog`,
    og: { type: 'website' },
  });

  useEffect(() => {
    getCMS().getBlogPosts(1, 20).then(setPosts).finally(() => setLoading(false));
  }, []);

  // Extract unique categories for filtering tabs
  const categories = useMemo(() => {
    const cats = new Set<string>();
    posts.forEach(p => {
      if (p.category) cats.add(p.category);
    });
    return ['All', ...Array.from(cats)];
  }, [posts]);

  // Filter posts by search query and category
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.tags && post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
      
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, selectedCategory]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[var(--bg-primary)]">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-[#D4AF37]/20 border-t-[#D4AF37] animate-spin" />
          <div className="absolute inset-2 rounded-full border-4 border-[var(--border-color)] border-b-[#0b1f3a] animate-spin animate-duration-1000" style={{ animationDirection: 'reverse' }} />
        </div>
        <p className="mt-6 text-sm font-bold tracking-widest text-[#D4AF37] uppercase animate-pulse">Loading Avati Insights...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans relative overflow-hidden pt-20">
      
      {/* ── Animated background mesh blobs matching main Hero ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
        <div className="mesh-blob-1 absolute w-[70vw] h-[70vw] max-w-[700px] max-h-[700px] -top-[10%] -left-[10%] rounded-full opacity-60"
          style={{ background: `radial-gradient(circle, rgba(212,175,55,${dark ? '0.08' : '0.04'}) 0%, transparent 70%)`, filter: 'blur(56px)' }}
        />
        <div className="mesh-blob-2 absolute w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] top-[30%] -right-[10%] rounded-full opacity-50"
          style={{ background: `radial-gradient(circle, rgba(11,31,58,${dark ? '0.35' : '0.03'}) 0%, transparent 70%)`, filter: 'blur(64px)' }}
        />
      </div>

      {/* Dot grid texture */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, var(--gold) 1px, transparent 0)',
          backgroundSize: '40px 40px',
          opacity: dark ? 0.03 : 0.02,
        }}
      />

      {/* ── HERO BANNER SECTION ── */}
      <header className="relative z-10 border-b border-[var(--border-color)] bg-[var(--bg-glass)] backdrop-blur-md py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border"
            style={{ backgroundColor: 'var(--gold-surface)', borderColor: 'var(--gold-border)', color: 'var(--gold-dim)' }}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            Avati Storage Insights
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] text-[var(--text-primary)]"
          >
            Insights & <span style={{ color: '#D4AF37' }}>Storage Blog</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto text-[var(--text-secondary)] leading-relaxed"
          >
            Expert recommendations on secure personal, household, and corporate storage spaces in Bangalore. Learn professional packing methods, organization hacks, and scale your logistics seamlessly.
          </motion.p>

          {/* Search bar inside Hero */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-md mx-auto relative mt-8"
          >
            <div className="relative">
              <input 
                type="text"
                placeholder="Search storage tips, categories, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/50 shadow-md transition-all placeholder:text-[var(--text-muted)]"
              />
              <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-4 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#D4AF37] hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </header>

      {/* ── CORE CONTENT AREA ── */}
      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        
        {/* Category Tabs Filter */}
        {categories.length > 2 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12 select-none border-b border-[var(--border-color)] pb-6">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                    active 
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black shadow-md' 
                      : 'bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[#D4AF37]/50 text-[var(--text-secondary)] hover:text-[#D4AF37]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}

        {/* Blog Posts Grid */}
        <AnimatePresence mode="popLayout">
          {filteredPosts.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="text-center py-20 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] max-w-lg mx-auto"
            >
              <AlertCircle className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
              <h3 className="text-lg font-extrabold mb-1">No matching articles found</h3>
              <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto mb-6">
                We couldn't find any post matching your current search parameters. Try searching general phrases like "packing", "choosing", or "ecommerce".
              </p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                className="px-4 py-2 border border-[#D4AF37] hover:bg-[#D4AF37]/10 text-xs font-black uppercase tracking-wider rounded-xl text-[#D4AF37] transition-all"
              >
                Reset Search Filters
              </button>
            </motion.div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch"
            >
              {filteredPosts.map((post, idx) => (
                <motion.article
                  key={post.id}
                  layoutId={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: Math.min(idx * 0.05, 0.3) }}
                  className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden hover:border-[#D4AF37]/50 shadow-md flex flex-col justify-between hover:-translate-y-1.5 transition-all duration-300 group"
                >
                  <div>
                    {/* Cover image container */}
                    <div className="relative aspect-video overflow-hidden bg-slate-900 select-none">
                      {post.coverImageUrl ? (
                        <img
                          src={post.coverImageUrl}
                          alt={post.title}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#0b1f3a] to-[#D4AF37]/20 flex items-center justify-center">
                          <BookOpen className="w-10 h-10 text-[#D4AF37]/40" />
                        </div>
                      )}
                      
                      {/* Premium Category Badge over cover image */}
                      {post.category && (
                        <span className="absolute top-4 left-4 inline-flex px-3 py-1 bg-black/85 backdrop-blur-md rounded-lg text-[9px] font-black uppercase tracking-widest text-[#D4AF37] border border-[#D4AF37]/20">
                          {post.category}
                        </span>
                      )}

                      {/* Insured Badge for visual premium touch */}
                      {post.featured && (
                        <span className="absolute top-4 right-4 inline-flex items-center gap-1 px-2.5 py-1 bg-[#D4AF37] rounded-lg text-[9px] font-black uppercase tracking-wider text-black shadow">
                          <Shield className="w-3 h-3 fill-black/10" /> Featured
                        </span>
                      )}
                    </div>

                    {/* Metadata & Title */}
                    <div className="p-6 space-y-4">
                      <div className="flex items-center gap-4 text-[10px] text-[var(--text-muted)] font-semibold select-none">
                        <span className="flex items-center gap-1">
                          <CalendarDays className="w-3.5 h-3.5 text-[#D4AF37]" />
                          {post.publishedAt}
                        </span>
                        {post.readTimeMinutes && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                            {post.readTimeMinutes} Min Read
                          </span>
                        )}
                      </div>

                      <h2 className="text-lg font-extrabold text-[var(--text-primary)] leading-snug group-hover:text-[#D4AF37] transition-colors">
                        <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                      </h2>

                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Card bottom CTA */}
                  <div className="px-6 pb-6 pt-4 border-t border-[var(--border-color)] flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wide text-[var(--text-muted)]">
                      By {post.authorName ?? 'Avati Expert'}
                    </span>
                    <Link 
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-widest text-[#D4AF37] hover:text-[#FFD700] transition-colors"
                    >
                      Read Article <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Newsletter CTA Section ── */}
        <section className="mt-24 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-8 md:p-12 relative overflow-hidden select-none">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#D4AF37]/5 blur-[96px] pointer-events-none" />
          <div className="max-w-3xl mx-auto text-center space-y-6 relative z-10">
            <Shield className="w-8 h-8 text-[#D4AF37] mx-auto" />
            <h3 className="text-xl sm:text-2xl font-black text-[var(--text-primary)]">Get monthly storage advice delivered fresh</h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed max-w-xl mx-auto">
              Join 1,200+ Bangalore residents who receive our monthly wrap-up of space management hacks, packing guides, and exclusive Avati promo discounts.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input 
                type="email" 
                required
                placeholder="Enter your email address..."
                className="flex-1 px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-xs focus:outline-none focus:border-[#D4AF37]"
              />
              <button 
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] hover:brightness-105 text-black font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all"
              >
                Subscribe Now
              </button>
            </form>
          </div>
        </section>

      </main>
    </div>
  );
}

// ── Blog Post Page ────────────────────────────────────────────
export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [popularPosts, setPopularPosts] = useState<BlogPost[]>([]);
  const { dark } = useTheme();

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getCMS().getBlogPost(slug)
      .then(p => {
        if (!p) setNotFound(true);
        else setPost(p);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  // Fetch related/popular articles for sidebar checklist
  useEffect(() => {
    getCMS().getBlogPosts(1, 4).then(all => {
      // Filter out current active post
      setPopularPosts(all.filter(p => p.slug !== slug).slice(0, 3));
    });
  }, [slug]);

  // SEO — applied once post loads
  useSEO(post ? {
    title: post.metaTitle ?? `${post.title} | Avati Safe Storage`,
    description: post.metaDescription ?? post.excerpt,
    canonical: `${BASE_URL}/blog/${post.slug}`,
    schema: buildArticleSchema(post),
    og: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      imageUrl: post.coverImageUrl,
      publishedTime: post.publishedAt,
    },
  } : {
    title: loading ? 'Loading Article... | Avati Safe Storage' : '404 — Post Not Found | Avati Safe Storage',
    description: '',
    noIndex: true,
  });

  const handleShare = () => {
    if (navigator.share && post) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Article link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[var(--bg-primary)]">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-[#D4AF37]/20 border-t-[#D4AF37] animate-spin" />
        </div>
        <p className="mt-6 text-sm font-bold tracking-widest text-[#D4AF37] uppercase animate-pulse">Retrieving article...</p>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 bg-[var(--bg-primary)] text-center relative pt-20">
        <AlertCircle className="w-16 h-16 text-[#D4AF37] mb-6" />
        <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">Storage article not found</h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)] max-w-sm">
          The article you are looking for may have been archived or moved to a different url.
        </p>
        <Link 
          to="/blog" 
          className="mt-8 inline-flex items-center gap-2 px-5 py-3 border border-[#D4AF37] hover:bg-[#D4AF37]/10 text-xs font-black uppercase tracking-widest text-[#D4AF37] rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Storage Insights
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans relative overflow-hidden pt-24 pb-20">
      
      {/* Background soft mesh blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
        <div className="mesh-blob-1 absolute w-[50vw] h-[50vw] max-w-[500px] -top-[10%] left-[20%] rounded-full opacity-40"
          style={{ background: `radial-gradient(circle, rgba(212,175,55,${dark ? '0.06' : '0.03'}) 0%, transparent 70%)`, filter: 'blur(64px)' }}
        />
        <div className="mesh-blob-2 absolute w-[50vw] h-[50vw] max-w-[500px] bottom-[20%] -left-[10%] rounded-full opacity-40"
          style={{ background: `radial-gradient(circle, rgba(11,31,58,${dark ? '0.3' : '0.02'}) 0%, transparent 70%)`, filter: 'blur(72px)' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* ── BREADCRUMBS NAVIGATION ── */}
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-8 select-none">
          <Link to="/" className="hover:text-[#D4AF37] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-[#D4AF37]/70" />
          <Link to="/blog" className="hover:text-[#D4AF37] transition-colors">Blog</Link>
          <ChevronRight className="w-3 h-3 text-[#D4AF37]/70" />
          {post.category && (
            <>
              <span className="text-[#D4AF37]">{post.category}</span>
              <ChevronRight className="w-3 h-3 text-[#D4AF37]/70" />
            </>
          )}
          <span className="text-[var(--text-secondary)] line-clamp-1 max-w-[200px]">{post.title}</span>
        </nav>

        {/* ── 2-COLUMN PREMIUM DESKTOP GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* COLUMN 1: Article Main Content (75% / 8 columns) */}
          <article className="lg:col-span-8 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 sm:p-10 shadow-sm relative">
            
            <header className="space-y-4 pb-6 border-b border-[var(--border-color)]">
              {post.category && (
                <span className="inline-flex px-3 py-1 bg-[#D4AF37]/10 rounded-lg text-[9px] font-black uppercase tracking-widest text-[#D4AF37] border border-[#D4AF37]/25">
                  {post.category}
                </span>
              )}

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-snug text-[var(--text-primary)]">
                {post.title}
              </h1>

              {/* Author & Read Time Meta */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[var(--text-muted)] pt-2 font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#0b1f3a] border border-[#D4AF37]/30 flex items-center justify-center text-[9px] font-black text-[#D4AF37]">
                    {post.authorName ? post.authorName.charAt(0) : 'A'}
                  </div>
                  <span>By <strong className="text-[var(--text-secondary)]">{post.authorName ?? 'Avati Safe Storage'}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 select-none">
                  <CalendarDays className="w-4 h-4 text-[#D4AF37]" />
                  <span>{post.publishedAt}</span>
                </div>
                {post.readTimeMinutes && (
                  <div className="flex items-center gap-1.5 select-none">
                    <Clock className="w-4 h-4 text-[#D4AF37]" />
                    <span>{post.readTimeMinutes} Min Read</span>
                  </div>
                )}
              </div>
            </header>

            {/* Main Cover Image */}
            {post.coverImageUrl && (
              <div className="my-8 aspect-video rounded-xl overflow-hidden shadow-lg border border-[var(--border-color)] bg-slate-900 select-none">
                <img
                  src={post.coverImageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* ARTICLE CONTENT (Vanilla rich text styles styled matching global premium) */}
            <div 
              className="text-[var(--text-secondary)] leading-[1.85] text-sm sm:text-base space-y-6 pt-2 
                prose prose-invert max-w-none 
                prose-headings:text-[var(--text-primary)] prose-headings:font-black prose-headings:tracking-tight 
                prose-h3:text-lg sm:prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:border-l-2 prose-h3:border-[#D4AF37] prose-h3:pl-3
                prose-h4:text-base sm:prose-h4:text-lg prose-h4:mt-6 prose-h4:mb-2 prose-h4:text-[#D4AF37]
                prose-p:mb-5 prose-p:leading-relaxed
                prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2 prose-ul:my-4
                prose-li:text-[var(--text-secondary)]
                prose-strong:text-[var(--text-primary)] prose-strong:font-extrabold"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Social Share & Tags Footer */}
            <footer className="mt-12 pt-8 border-t border-[var(--border-color)] space-y-6">
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <Tag className="w-4 h-4 text-[#D4AF37] mr-1" />
                  {post.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="px-2.5 py-1 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[10px] font-semibold text-[var(--text-muted)]"
                    >
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between gap-4 flex-wrap bg-[var(--bg-primary)] p-4 rounded-xl border border-[var(--border-color)]">
                <div>
                  <h4 className="text-xs font-black uppercase text-[#D4AF37]">Share this storage guide</h4>
                  <p className="text-[10px] text-[var(--text-muted)]">Help friends pack and store smarter!</p>
                </div>
                <button 
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] hover:brightness-105 text-black font-extrabold text-xs uppercase tracking-widest rounded-lg transition-all shadow-md select-none"
                >
                  <Share2 className="w-3.5 h-3.5" /> Share Article
                </button>
              </div>
            </footer>

          </article>

          {/* COLUMN 2: Sticky Right Sidebar (25% / 4 columns) */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-6 self-start">
            
            {/* Widget 1: Premium Booking Desk & Quote CTA Card */}
            <div className="bg-gradient-to-br from-[#0B1F3A] to-[#122A4E] border border-[#D4AF37]/35 rounded-2xl p-6 shadow-xl relative overflow-hidden text-white select-none">
              {/* Gold light reflections */}
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#D4AF37]/10 blur-2xl pointer-events-none" />
              
              <div className="flex items-center gap-2 mb-4 border-b border-[#D4AF37]/20 pb-3">
                <Shield className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">
                  Avati Bangalore Booking
                </h3>
              </div>

              <h4 className="text-lg font-black tracking-tight leading-snug mb-2">
                Need secure storage space in Bangalore?
              </h4>
              
              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                Calculate your required warehouse volume and get an instant itemized estimate with doorstep packing and shipping included!
              </p>

              {/* Unique bullet features */}
              <ul className="space-y-3 mb-6">
                {[
                  "Professional 3-Layer Packing",
                  "24/7 Monitored CCTV Vaults",
                  "Insured Storage Facilities",
                  "No Lock-in Contracts"
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs font-bold text-slate-200">
                    <CheckCircle className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {/* Call Hotline & Get Quote CTA button stack */}
              <div className="space-y-2.5">
                <Link 
                  to="/get-quote"
                  className="w-full py-3 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] hover:brightness-105 text-black font-extrabold text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.98]"
                >
                  <Sparkles className="w-4 h-4" /> Calculate Free Quote
                </Link>
                
                <a 
                  href="tel:+918095589888"
                  className="w-full py-2.5 bg-black/40 hover:bg-black/60 border border-[#D4AF37]/30 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  <Phone className="w-4 h-4 text-[#D4AF37]" /> Call Desk: +91 80955 89888
                </a>

                <a 
                  href="https://wa.me/918095589888?text=Hi!%20I'd%20like%20to%20inquire%20about%20Avati%20storage%20services."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] font-extrabold text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-[#25D366]/10" /> Chat on WhatsApp
                </a>
              </div>

              <div className="mt-5 text-[9px] text-center text-slate-400 border-t border-[#D4AF37]/15 pt-3">
                * Serving Whitefield, Koramangala, Indiranagar, HSR & all of Bangalore.
              </div>
            </div>

            {/* Widget 2: Related Insights Checklist */}
            {popularPosts.length > 0 && (
              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-5 border-b border-[var(--border-color)] pb-3 select-none">
                  <Bookmark className="w-4.5 h-4.5 text-[#D4AF37]" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">
                    Popular Insights
                  </h3>
                </div>

                <div className="space-y-4">
                  {popularPosts.map((pop) => (
                    <div 
                      key={pop.id}
                      className="group flex flex-col gap-1 border-b border-[var(--border-color)] last:border-b-0 pb-3.5 last:pb-0"
                    >
                      {pop.category && (
                        <span className="text-[9px] font-black uppercase text-[#D4AF37] tracking-wider select-none">
                          {pop.category}
                        </span>
                      )}
                      <h4 className="text-xs font-bold text-[var(--text-secondary)] group-hover:text-[#D4AF37] transition-colors leading-snug">
                        <Link to={`/blog/${pop.slug}`}>{pop.title}</Link>
                      </h4>
                      <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] pt-1 select-none">
                        <span>{pop.publishedAt}</span>
                        <span className="inline-flex items-center gap-0.5 text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity">
                          Read <ArrowUpRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Widget 3: Secure Badge Coordinates */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 shadow-sm text-center select-none">
              <MapPin className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
              <h4 className="text-xs font-black uppercase text-[var(--text-primary)]">Avati Safe Storage Facility</h4>
              <p className="text-[10px] text-[var(--text-muted)] leading-relaxed mt-1">
                NRI Layout, Kalkere, Horamavu Post, Bangalore, Karnataka - 560043
              </p>
            </div>

          </aside>

        </div>

      </div>
    </div>
  );
}


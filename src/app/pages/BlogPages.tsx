// ============================================================
//  Avati Safe Storage — Blog Pages
//  CMS-driven blog list and post pages.
//  Content fetched from Zoho Creator (or local fallback).
// ============================================================

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { getCMS } from '../../lib/cms';
import type { BlogPost } from '../../lib/cms';
import { useSEO } from '../../lib/seo/seoManager';
import { buildArticleSchema } from '../../lib/seo/schemaBuilder';
import { BASE_URL } from '../../lib/pseo/locationData';

// ── Blog List Page ────────────────────────────────────────────
export function BlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useSEO({
    title: 'Storage Tips & Guides | Avati Safe Storage Blog',
    description: 'Expert tips on storage, packing, relocation, and home organisation from the Avati Safe Storage team in Bangalore.',
    canonical: `${BASE_URL}/blog`,
    og: { type: 'website' },
  });

  useEffect(() => {
    getCMS().getBlogPosts().then(setPosts).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '40vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <div style={{ width: 36, height: 36, border: '3px solid rgba(212,175,55,0.2)', borderTopColor: '#D4AF37', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <section style={{ background: 'var(--bg-primary)', minHeight: '60vh', padding: '5rem 1.5rem' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h1 style={{ color: 'var(--text-primary)', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', marginBottom: '0.5rem' }}>
          Storage Tips & Guides
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>
          Expert advice on storage, packing, and relocation from our team.
        </p>

        {posts.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No blog posts yet. Check back soon.</p>
        ) : (
          <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {posts.map(post => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                style={{ textDecoration: 'none' }}
              >
                <article
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 16,
                    overflow: 'hidden',
                    transition: 'border-color 0.2s, transform 0.2s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = '#D4AF37';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-color)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  }}
                >
                  {post.coverImageUrl && (
                    <img
                      src={post.coverImageUrl}
                      alt={post.title}
                      loading="lazy"
                      style={{ width: '100%', height: 180, objectFit: 'cover' }}
                    />
                  )}
                  <div style={{ padding: '1.25rem' }}>
                    {post.category && (
                      <span style={{ color: 'var(--gold)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        {post.category}
                      </span>
                    )}
                    <h2 style={{ color: 'var(--text-primary)', fontSize: '1.125rem', margin: '0.5rem 0', lineHeight: 1.4 }}>
                      {post.title}
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                      {post.excerpt}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <span>{post.publishedAt}</span>
                      {post.readTimeMinutes && <span>{post.readTimeMinutes} min read</span>}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ── Blog Post Page ────────────────────────────────────────────
export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    getCMS().getBlogPost(slug)
      .then(p => {
        if (!p) setNotFound(true);
        else setPost(p);
      })
      .finally(() => setLoading(false));
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
    title: loading ? 'Loading... | Avati Safe Storage Blog' : '404 — Post Not Found | Avati',
    description: '',
    noIndex: true,
  });

  if (loading) {
    return (
      <div style={{ minHeight: '40vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <div style={{ width: 36, height: 36, border: '3px solid rgba(212,175,55,0.2)', borderTopColor: '#D4AF37', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 1.5rem', background: 'var(--bg-primary)', textAlign: 'center' }}>
        <h1 style={{ color: 'var(--text-primary)' }}>Post not found</h1>
        <Link to="/blog" style={{ color: 'var(--gold)', marginTop: '1rem' }}>← Back to Blog</Link>
      </div>
    );
  }

  return (
    <article style={{ background: 'var(--bg-primary)', minHeight: '60vh', padding: '4rem 1.5rem' }}>
      <div style={{ maxWidth: 780, margin: '0 auto' }}>
        <Link to="/blog" style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textDecoration: 'none' }}>
          ← All Articles
        </Link>

        {post.category && (
          <p style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '1.5rem' }}>
            {post.category}
          </p>
        )}

        <h1 style={{ color: 'var(--text-primary)', fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', lineHeight: 1.3, margin: '0.75rem 0 1rem' }}>
          {post.title}
        </h1>

        <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>
          <span>By {post.authorName ?? 'Avati Safe Storage'}</span>
          <span>·</span>
          <span>{post.publishedAt}</span>
          {post.readTimeMinutes && <><span>·</span><span>{post.readTimeMinutes} min read</span></>}
        </div>

        {post.coverImageUrl && (
          <img
            src={post.coverImageUrl}
            alt={post.title}
            style={{ width: '100%', borderRadius: 12, marginBottom: '2rem', objectFit: 'cover', maxHeight: 400 }}
          />
        )}

        <div
          style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1rem' }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </article>
  );
}

// ============================================================
//  Blog Listing Component (Sanity GROQ Fetching)
//  Path: avati-website/src/app/components/BlogListing.tsx
// ============================================================

import { useState, useEffect } from 'react';
import { sanityClient } from '../../utils/sanityClient';
import { BookOpen, Calendar, ArrowRight, Search } from 'lucide-react';

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  metaTitle?: string;
  metaDescription?: string;
  imageUrl?: string;
}

export function BlogListing() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    async function fetchPosts() {
      try {
        const query = `*[_type == "post"] | order(_createdAt desc) {
          _id,
          title,
          slug,
          metaTitle,
          metaDescription,
          "imageUrl": coverImage.asset->url
        }`;
        const data = await sanityClient.fetch<Post[]>(query);
        setPosts(data || []);
      } catch (err) {
        console.error('[BlogListing] Error fetching posts from Sanity:', err);
        setError('Could not load blog posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (post.metaDescription && post.metaDescription.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto">
      {/* Header Block */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold tracking-tight mb-4" style={{ color: 'var(--text-primary)' }}>
          Avati Safe Storage <span style={{ color: 'var(--gold)' }}>Blog</span>
        </h2>
        <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
          Expert tips on self-storage, packing tutorials, and relocation guides in Bangalore.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="relative max-w-md mx-auto mb-12">
        <input 
          type="text" 
          placeholder="Search articles..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-full border focus:ring-2 focus:ring-amber-500 transition-all outline-none"
          style={{
            background: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)',
          }}
        />
        <Search className="absolute left-4 top-3.5 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
      </div>

      {/* Main Content Grid */}
      {loading ? (
        // Skeleton Loader
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((n) => (
            <div key={n} className="rounded-2xl border animate-pulse overflow-hidden" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}>
              <div className="h-52 bg-neutral-800" />
              <div className="p-6 space-y-4">
                <div className="h-4 bg-neutral-800 rounded w-1/4" />
                <div className="h-6 bg-neutral-800 rounded w-3/4" />
                <div className="h-4 bg-neutral-800 rounded w-5/6" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-400 font-medium">{error}</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <p style={{ color: 'var(--text-muted)' }}>No articles found matching "{searchQuery}".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article 
              key={post._id}
              className="rounded-2xl border overflow-hidden flex flex-col group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
              style={{ 
                background: 'var(--bg-card)', 
                borderColor: 'var(--border-color)',
              }}
            >
              {/* Image Box */}
              <div className="h-52 w-full overflow-hidden relative bg-neutral-900">
                {post.imageUrl ? (
                  <img 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="w-12 h-12" style={{ color: 'var(--text-muted)' }} />
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5" style={{ color: 'var(--gold)' }}>
                  <Calendar className="w-3.5 h-3.5" /> Storage Guides
                </div>
              </div>

              {/* Text Card Content */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-amber-500 transition-colors" style={{ color: 'var(--text-primary)' }}>
                  {post.title}
                </h3>
                <p className="text-sm line-clamp-3 mb-6 flex-1" style={{ color: 'var(--text-muted)' }}>
                  {post.metaDescription || 'Read our latest insights on moving, packaging, and securing your commercial or household assets in Bangalore.'}
                </p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t font-semibold text-sm group-hover:translate-x-1 transition-transform" style={{ borderColor: 'var(--border-color)', color: 'var(--gold)' }}>
                  Read Article <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
export default BlogListing;

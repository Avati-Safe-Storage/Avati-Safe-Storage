import React, { useState } from 'react';
import { 
  FileText, Plus, Search, Calendar, Eye, Trash2, 
  X, Save, CheckCircle, AlertCircle, RefreshCw, Link as LinkIcon 
} from 'lucide-react';

interface LocalBlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image_url: string;
  created_at: string;
}

// Initial mock blog posts mapping to current database content for initial loading
const INITIAL_BLOG_POSTS: LocalBlogPost[] = [
  {
    id: "1",
    slug: "secure-household-storage-bangalore",
    title: "How to Safely Pack and Store Household Items in Bangalore",
    excerpt: "Expert advice on selecting the right boxes, packing delicate items, and choosing a secure storage facility.",
    content: "<p>Moving or decluttering your home can be an overwhelming task. Selecting a premium, safe household storage facility is critical to ensuring your assets remain undamaged. At Avati Safe Storage, we provide multi-layer protection and round-the-clock security.</p><h2>1. Select Premium Packing Materials</h2><p>Always use heavy-duty double-walled cardboard boxes, high-quality bubble wraps, and strong sealing tapes. Never compromise on wrapping delicate glassware.</p>",
    category: "Household Storage",
    image_url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800",
    created_at: "2026-05-20T10:30:00Z"
  },
  {
    id: "2",
    slug: "business-warehousing-logistics-optimization",
    title: "Optimizing Business Warehousing and Logistics Operations",
    excerpt: "Discover how commercial enterprise storage can reduce operations costs and streamline delivery fulfillment.",
    content: "<p>Efficient warehouse operations are the backbone of any successful retail or e-commerce enterprise. Learn how modern storage schemes can optimize your supply chain.</p>",
    category: "Business Warehousing",
    image_url: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&q=80&w=800",
    created_at: "2026-05-18T14:15:00Z"
  }
];

export default function BlogManagement() {
  const [posts, setPosts] = useState<LocalBlogPost[]>(INITIAL_BLOG_POSTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewPost, setPreviewPost] = useState<LocalBlogPost | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('Household Storage');
  const [imageUrl, setImageUrl] = useState('');
  const [content, setContent] = useState('');
  
  // Feedback Status
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Dynamic slug generator as user types the title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    // Convert to URL friendly slug automatically
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // remove special chars
      .replace(/\s+/g, '-')         // replace spaces with dashes
      .replace(/-+/g, '-');        // replace multiple dashes
    setSlug(generatedSlug);
  };

  const handleResetForm = () => {
    setTitle('');
    setSlug('');
    setExcerpt('');
    setCategory('Household Storage');
    setImageUrl('');
    setContent('');
    setFeedback(null);
  };

  const handlePublishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim() || !content.trim()) {
      setFeedback({ type: 'error', message: 'Please fill in all required fields (*).' });
      return;
    }

    setIsSaving(true);
    setFeedback(null);

    // Simulate API call to cloudflare backend endpoint
    setTimeout(() => {
      // Check for duplicate slug
      const isDuplicate = posts.some(p => p.slug === slug.trim().toLowerCase());
      if (isDuplicate) {
        setFeedback({ type: 'error', message: 'A post with this URL slug already exists. Please choose a unique slug.' });
        setIsSaving(false);
        return;
      }

      const newPost: LocalBlogPost = {
        id: (posts.length + 1).toString(),
        slug: slug.trim().toLowerCase(),
        title: title.trim(),
        excerpt: excerpt.trim() || "Exclusive blog post containing premium storage guides and relocation advice from Avati.",
        content: content.trim(),
        category,
        image_url: imageUrl.trim() || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
        created_at: new Date().toISOString()
      };

      setPosts([newPost, ...posts]);
      setFeedback({ type: 'success', message: 'Your blog post has been successfully saved to D1!' });
      setIsSaving(false);
      
      // Close modal on success after delay
      setTimeout(() => {
        setIsModalOpen(false);
        handleResetForm();
      }, 1500);
    }, 1000);
  };

  const handleDeletePost = (id: string) => {
    if (window.confirm("Are you sure you want to delete this blog post from D1 database?")) {
      setPosts(posts.filter(p => p.id !== id));
    }
  };

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 select-none font-sans text-brand-text">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-brand-border pb-5">
        <div>
          <h1 className="text-2xl font-black tracking-wide text-brand-text flex items-center gap-2">
            <span className="text-brand-gold">VAULT</span> BLOG MANAGER
          </h1>
          <p className="text-brand-muted mt-1 text-sm">Create, update, and manage articles published on the Avati Safe Storage blog catalog.</p>
        </div>
        
        <button 
          onClick={() => { handleResetForm(); setIsModalOpen(true); }}
          className="inline-flex items-center justify-center gap-2 vault-btn-gold px-5 py-3 rounded-xl shadow-lg transition-all active:scale-[0.98] cursor-pointer"
        >
          <Plus className="w-5 h-5 text-black" /> Create New Post
        </button>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between vault-glass p-4 rounded-xl shadow-lg">
        <div className="relative w-full md:w-80">
          <Search className="w-5 h-5 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search articles by title..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 vault-input rounded-xl text-sm transition-all"
          />
        </div>

        <div className="flex gap-2 self-stretch md:self-auto overflow-x-auto hide-scrollbar pb-1 md:pb-0">
          {['All', 'Household Storage', 'Business Warehousing', 'Packing Guides', 'Office Relocation'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${
                selectedCategory === cat 
                  ? 'bg-brand-gold text-black border-brand-gold shadow-[0_0_12px_rgba(212,175,55,0.25)]' 
                  : 'bg-brand-light text-brand-muted border-brand-border hover:text-brand-text hover:bg-brand-surface'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Posts Dashboard Grid */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-20 vault-glass rounded-2xl p-8 shadow-lg">
          <FileText className="w-12 h-12 text-brand-gold/45 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-brand-text">No blog posts found</h3>
          <p className="text-brand-muted mt-1 max-w-sm mx-auto text-sm">Try adjusting your search terms or create a brand new blog post above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPosts.map((post) => (
            <div key={post.id} className="vault-card rounded-2xl overflow-hidden flex flex-col justify-between group">
              
              {/* Image & Category overlay */}
              <div className="h-48 bg-brand-light relative overflow-hidden">
                <img 
                  src={post.image_url} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-4 left-4 inline-block px-2.5 py-1 rounded bg-brand-dark/90 border border-brand-gold/30 text-brand-gold text-[10px] font-black uppercase tracking-wider shadow">
                  {post.category}
                </span>
              </div>

              {/* Card content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-brand-muted mb-2">
                    <Calendar className="w-3.5 h-3.5 text-brand-gold" />
                    <span>{new Date(post.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <h3 className="font-extrabold text-brand-text text-lg leading-snug group-hover:text-brand-gold transition-colors">{post.title}</h3>
                  <p className="text-sm text-brand-muted mt-2 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                  
                  <div className="flex items-center gap-1 text-[11px] text-brand-gold/80 mt-3 font-semibold font-mono">
                    <LinkIcon className="w-3 h-3 text-brand-gold" />
                    <span className="underline break-all">/blog/{post.slug}</span>
                  </div>
                </div>

                {/* Actions bottom row */}
                <div className="flex items-center justify-end gap-3 border-t border-brand-border pt-4 mt-6">
                  <button 
                    onClick={() => setPreviewPost(post)}
                    className="p-2 text-brand-text hover:text-black bg-brand-light hover:bg-brand-gold border border-brand-border rounded-lg transition-all cursor-pointer"
                    title="Preview Post"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeletePost(post.id)}
                    className="p-2 text-red-400 hover:text-white hover:bg-red-600 bg-red-950/20 border border-red-900/30 hover:border-red-600 rounded-lg transition-all cursor-pointer"
                    title="Delete Post"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* CREATE NEW POST MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-brand-surface rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border border-brand-border animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-brand-border flex items-center justify-between bg-brand-light text-brand-text">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-brand-gold" />
                <h2 className="text-lg font-black tracking-wide">COMPOSE BLOG POST</h2>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-brand-muted hover:text-brand-text cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body (Scrollable form) */}
            <form onSubmit={handlePublishSubmit} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
              
              {/* Notification Banner */}
              {feedback && (
                <div className={`p-4 rounded-xl flex items-start gap-3 border ${
                  feedback.type === 'success' 
                    ? 'bg-green-950/30 border-green-900/50 text-green-400' 
                    : 'bg-red-950/30 border-red-900/50 text-red-400'
                }`}>
                  {feedback.type === 'success' ? <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
                  <span className="text-sm font-semibold">{feedback.message}</span>
                </div>
              )}

              {/* Title & Slug Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-brand-gold uppercase tracking-wider">
                    Post Title <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="e.g. 5 Packing Tips for Safe Storage"
                    required
                    className="w-full vault-input rounded-xl px-4 py-3 text-sm transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-brand-gold uppercase tracking-wider">
                    URL Slug (Auto-generated) <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                    placeholder="e.g. 5-packing-tips"
                    required
                    className="w-full vault-input rounded-xl px-4 py-3 text-sm transition-all font-mono"
                  />
                </div>
              </div>

              {/* Category & Image URL Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-brand-gold uppercase tracking-wider">Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-brand-light border border-brand-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold text-brand-text transition-all"
                  >
                    <option value="Household Storage">Household Storage</option>
                    <option value="Business Warehousing">Business Warehousing</option>
                    <option value="Packing Guides">Packing Guides</option>
                    <option value="Office Relocation">Office Relocation</option>
                    <option value="General Safety">General Safety</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-brand-gold uppercase tracking-wider">Featured Cover Image URL</label>
                  <input 
                    type="url" 
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full vault-input rounded-xl px-4 py-3 text-sm transition-all"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-brand-gold uppercase tracking-wider">Excerpt (Summary)</label>
                <input 
                  type="text" 
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Short, inviting summary displayed on cards listing..."
                  className="w-full vault-input rounded-xl px-4 py-3 text-sm transition-all"
                />
              </div>

              {/* Content Textarea */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-brand-gold uppercase tracking-wider">
                  Post Content (HTML/Prose Supported) <span className="text-red-500">*</span>
                </label>
                <textarea 
                  rows={10}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write the full post contents using standard paragraphs and headings..."
                  required
                  className="w-full vault-input rounded-xl p-4 text-sm transition-all font-mono leading-relaxed"
                />
              </div>

              {/* Footer Modal Actions */}
              <div className="flex items-center justify-end gap-3 border-t border-brand-border pt-6 mt-8">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-brand-border text-brand-muted hover:bg-brand-light hover:text-brand-text rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 vault-btn-gold text-black font-extrabold rounded-xl text-sm shadow-lg transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 text-black" /> Publish to D1
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* VIEW POST PREVIEW MODAL */}
      {previewPost && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-brand-surface rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col border border-brand-border animate-in fade-in duration-200">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-brand-border flex items-center justify-between bg-brand-light">
              <span className="inline-block px-2.5 py-0.5 rounded bg-brand-gold/15 border border-brand-gold/35 text-brand-gold text-[10px] font-black uppercase tracking-widest">
                {previewPost.category}
              </span>
              <button 
                onClick={() => setPreviewPost(null)}
                className="p-1 hover:bg-brand-border rounded-lg transition-colors text-brand-muted hover:text-brand-text cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
              
              {/* Title & Metadata */}
              <div>
                <h1 className="text-2xl font-extrabold text-brand-text">{previewPost.title}</h1>
                <div className="flex items-center gap-3 text-xs text-brand-muted mt-2 pb-4 border-b border-brand-border">
                  <span>Published on: {new Date(previewPost.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  <span>•</span>
                  <span>Author: Avati Expert Team</span>
                </div>
              </div>

              {/* Cover Image */}
              {previewPost.image_url && (
                <img 
                  src={previewPost.image_url} 
                  alt={previewPost.title} 
                  className="w-full h-64 object-cover rounded-xl border border-brand-border"
                />
              )}

              {/* Excerpt Banner */}
              <div className="bg-brand-light p-4 border-l-4 border-brand-gold rounded-r-xl italic text-brand-muted text-sm">
                "{previewPost.excerpt}"
              </div>

              {/* Rich Body Content */}
              <div 
                className="prose prose-invert prose-sm text-brand-text leading-relaxed font-sans max-w-none prose-headings:text-brand-gold prose-a:text-brand-gold"
                dangerouslySetInnerHTML={{ __html: previewPost.content }}
              />
            </div>

            {/* Footer Modal Actions */}
            <div className="p-4 border-t border-brand-border flex justify-end bg-brand-light">
              <button
                onClick={() => setPreviewPost(null)}
                className="px-5 py-2 bg-brand-surface hover:bg-brand-border text-brand-text hover:text-brand-gold text-xs font-semibold rounded-lg border border-brand-border transition-colors cursor-pointer"
              >
                Close Preview
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );

}

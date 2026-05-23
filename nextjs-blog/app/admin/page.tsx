"use server";

import React from "react";
import { insertBlogPost } from "../actions";
import { redirect } from "next/navigation";
import { ArrowLeft, Save, PlusCircle, CheckCircle, AlertCircle, FileText } from "lucide-react";
import Link from "next/link";

export default async function AdminPublishPage() {
  // Simple inline Server Action handler inside page component
  async function handlePublish(formData: FormData) {
    "use server";

    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const excerpt = formData.get("excerpt") as string;
    const category = formData.get("category") as string;
    const image_url = formData.get("image_url") as string;
    const content = formData.get("content") as string;

    const result = await insertBlogPost({
      title,
      slug,
      excerpt,
      category,
      image_url,
      content,
    });

    if (result.success) {
      redirect("/blog");
    } else {
      // In a real-world Server Component, you'd pass errors down or use useActionState (React 19).
      // Redirecting with a query parameter is the simplest, most robust standard pattern.
      const errorParam = encodeURIComponent(result.error || "Failed to publish post");
      redirect(`/admin?error=${errorParam}`);
    }
  }

  return (
    <div className="min-h-screen bg-[#090909] text-[#f5f5f0] font-sans py-12 px-6 select-none selection:bg-[#D4AF37] selection:text-black">
      <div className="max-w-4xl mx-auto">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#D4AF37]/10 border border-[#D4AF37]/25 text-[#D4AF37] rounded-xl shadow-lg">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">Avati Publisher</h1>
              <p className="text-xs text-[#f5f5f0]/50 mt-0.5">Publish high-SEO articles directly to Cloudflare D1</p>
            </div>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#f5f5f0]/60 hover:text-[#D4AF37] transition-all group uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" /> View Live Blog
          </Link>
        </div>

        {/* Publisher Form Card */}
        <div className="bg-[#111] border border-white/[0.05] rounded-2xl p-8 md:p-10 shadow-2xl">
          <form action={handlePublish} className="space-y-6">
            
            {/* Title & Slug Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="title" className="block text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                  Post Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="e.g. 5 Packing Tips for Safe Storage"
                  required
                  className="w-full bg-white/[0.03] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-[#f5f5f0] placeholder:text-[#f5f5f0]/30 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="slug" className="block text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                  URL Slug <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  placeholder="e.g. 5-packing-tips-safe-storage"
                  required
                  className="w-full bg-white/[0.03] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-[#f5f5f0] placeholder:text-[#f5f5f0]/30 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                />
              </div>
            </div>

            {/* Category & Image URL Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="category" className="block text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  className="w-full bg-[#151515] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-[#f5f5f0] focus:outline-none focus:border-[#D4AF37] transition-all"
                >
                  <option value="Household Storage">Household Storage</option>
                  <option value="Business Warehousing">Business Warehousing</option>
                  <option value="Packing Guides">Packing Guides</option>
                  <option value="Office Relocation">Office Relocation</option>
                  <option value="General Safety">General Safety</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="image_url" className="block text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                  Featured Cover Image URL
                </label>
                <input
                  type="url"
                  id="image_url"
                  name="image_url"
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-white/[0.03] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-[#f5f5f0] placeholder:text-[#f5f5f0]/30 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div className="space-y-2">
              <label htmlFor="excerpt" className="block text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                Post Excerpt (Brief Summary)
              </label>
              <input
                type="text"
                id="excerpt"
                name="excerpt"
                placeholder="A brief summary displaying on the blog card listing page to attract readers..."
                className="w-full bg-white/[0.03] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-[#f5f5f0] placeholder:text-[#f5f5f0]/30 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
              />
            </div>

            {/* Content Textarea */}
            <div className="space-y-2">
              <label htmlFor="content" className="block text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                Article Content (HTML or Markdown Supported) <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                name="content"
                rows={12}
                placeholder="Write your article body here. You can use standard HTML paragraph tags, subheadings, and tables for dynamic formatting..."
                required
                className="w-full bg-white/[0.03] border border-white/[0.1] rounded-xl p-4 text-sm text-[#f5f5f0] placeholder:text-[#f5f5f0]/30 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all font-mono leading-relaxed"
              ></textarea>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 border-t border-white/5 pt-6 mt-8">
              <button
                type="reset"
                className="px-5 py-3 border border-white/10 hover:border-white/20 text-sm font-semibold rounded-xl transition-all cursor-pointer"
              >
                Clear Fields
              </button>
              
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] hover:from-[#FFD700] hover:to-[#D4AF37] text-black font-extrabold rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:-translate-y-0.5 transition-all text-sm cursor-pointer"
              >
                <Save className="w-4 h-4" /> Save & Publish
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

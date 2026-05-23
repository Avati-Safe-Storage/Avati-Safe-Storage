"use server";

import { getDb, BlogPost } from "../lib/db";
import { revalidatePath } from "next/cache";

/**
 * Fetch all posts from the Cloudflare D1 database.
 * Orders posts from newest to oldest.
 */
export async function fetchBlogPosts(): Promise<BlogPost[]> {
  try {
    const db = getDb();
    const { results } = await db
      .prepare("SELECT * FROM posts ORDER BY created_at DESC")
      .all<BlogPost>();
    return results || [];
  } catch (error) {
    console.error("Error fetching blog posts from D1:", error);
    return [];
  }
}

/**
 * Fetch a single blog post by its unique URL slug.
 */
export async function fetchBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!slug) return null;
  try {
    const db = getDb();
    const post = await db
      .prepare("SELECT * FROM posts WHERE slug = ? LIMIT 1")
      .bind(slug)
      .first<BlogPost>();
    return post || null;
  } catch (error) {
    console.error(`Error fetching blog post by slug (${slug}):`, error);
    return null;
  }
}

export interface CreatePostInput {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  category?: string;
  image_url?: string;
}

/**
 * Insert a new blog post into the Cloudflare D1 database.
 * Validates inputs and revalidates blog layout caches.
 */
export async function insertBlogPost(input: CreatePostInput): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Basic Server-side Validation
    if (!input.title || !input.title.trim()) {
      return { success: false, error: "Title is required" };
    }
    if (!input.slug || !input.slug.trim()) {
      return { success: false, error: "Slug is required" };
    }
    if (!input.content || !input.content.trim()) {
      return { success: false, error: "Content is required" };
    }

    // Standardise slug (lowercase, dashes)
    const formattedSlug = input.slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-_]/g, "-")
      .replace(/-+/g, "-");

    const db = getDb();

    // Check if slug already exists to prevent SQLite constraint failures
    const existing = await db
      .prepare("SELECT id FROM posts WHERE slug = ? LIMIT 1")
      .bind(formattedSlug)
      .first();

    if (existing) {
      return { success: false, error: "A blog post with this slug already exists" };
    }

    // 2. Perform SQLite insertion
    await db
      .prepare(
        `INSERT INTO posts (slug, title, excerpt, content, category, image_url) 
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .bind(
        formattedSlug,
        input.title.trim(),
        input.excerpt?.trim() || null,
        input.content.trim(),
        input.category?.trim() || "General",
        input.image_url?.trim() || null
      )
      .run();

    // 3. Purge Caches for dynamic blog pages
    revalidatePath("/blog");
    revalidatePath(`/blog/${formattedSlug}`);

    return { success: true };
  } catch (error: any) {
    console.error("Error inserting blog post:", error);
    return { success: false, error: error.message || "Failed to save blog post" };
  }
}

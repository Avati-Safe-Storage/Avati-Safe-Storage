import { getRequestContext } from '@cloudflare/next-on-pages';

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image_url: string;
  created_at: string;
}

/**
 * Robust database utility to interact with Cloudflare D1
 * Supports both production context and local fallback during development.
 */
export function getDb() {
  try {
    const context = getRequestContext();
    if (context && context.env && context.env.DB) {
      return context.env.DB;
    }
  } catch (error) {
    console.warn("Could not retrieve Cloudflare RequestContext. Falling back to process.env.DB or local bindings.", error);
  }

  // Fallback to global process.env binding (often used by Next.js integrations or custom local dev configurations)
  const db = (process.env as any).DB;
  if (!db) {
    throw new Error(
      "D1 Database binding 'DB' is missing. Please ensure wrangler.toml is configured and Next.js is running inside a Cloudflare Workers/Pages environment."
    );
  }

  return db;
}

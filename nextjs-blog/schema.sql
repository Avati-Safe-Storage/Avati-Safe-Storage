-- Cloudflare D1 Schema for Avati Blog
-- Run this schema using Wrangler:
-- npx wrangler d1 execute avati_blog --local --file=./schema.sql
-- npx wrangler d1 execute avati_blog --remote --file=./schema.sql

CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL, -- Stores rich Markdown or HTML content
  category TEXT,
  image_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Index on slug for high-speed lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_posts_slug ON posts (slug);

// ============================================================
//  Avati Safe Storage — API Response Cache
//  Lightweight in-memory + localStorage cache with TTL.
//  Used by all CMS and Zoho API calls to reduce redundant requests.
// ============================================================

const CACHE_PREFIX = 'avati_cache_';

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

// In-memory layer (faster than localStorage for within-session hits)
const memoryCache = new Map<string, CacheEntry<unknown>>();

// ── Core operations ──────────────────────────────────────────

export function cacheGet<T>(key: string): T | null {
  const fullKey = CACHE_PREFIX + key;
  const now = Date.now();

  // 1. Check memory first
  const memEntry = memoryCache.get(fullKey) as CacheEntry<T> | undefined;
  if (memEntry && memEntry.expiresAt > now) {
    return memEntry.data;
  }

  // 2. Fall back to localStorage
  try {
    const raw = localStorage.getItem(fullKey);
    if (!raw) return null;
    const entry: CacheEntry<T> = JSON.parse(raw);
    if (entry.expiresAt <= now) {
      localStorage.removeItem(fullKey);
      return null;
    }
    // Warm memory cache
    memoryCache.set(fullKey, entry);
    return entry.data;
  } catch {
    return null;
  }
}

export function cacheSet<T>(key: string, data: T, ttlMs: number = 5 * 60 * 1000): void {
  const fullKey = CACHE_PREFIX + key;
  const entry: CacheEntry<T> = { data, expiresAt: Date.now() + ttlMs };

  // Write to both layers
  memoryCache.set(fullKey, entry);
  try {
    localStorage.setItem(fullKey, JSON.stringify(entry));
  } catch {
    // localStorage quota exceeded — memory-only is fine
  }
}

export function cacheInvalidate(key: string): void {
  const fullKey = CACHE_PREFIX + key;
  memoryCache.delete(fullKey);
  try { localStorage.removeItem(fullKey); } catch {}
}

export function cacheInvalidatePrefix(prefix: string): void {
  const fullPrefix = CACHE_PREFIX + prefix;
  // Clear memory
  for (const k of memoryCache.keys()) {
    if (k.startsWith(fullPrefix)) memoryCache.delete(k);
  }
  // Clear localStorage
  try {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(fullPrefix));
    keys.forEach(k => localStorage.removeItem(k));
  } catch {}
}

// ── Cache TTL presets ────────────────────────────────────────
export const TTL = {
  FIVE_MINUTES:   5  * 60 * 1000,
  THIRTY_MINUTES: 30 * 60 * 1000,
  ONE_HOUR:       60 * 60 * 1000,
  ONE_DAY:        24 * 60 * 60 * 1000,
} as const;

// ── Cached fetch helper ──────────────────────────────────────
export async function cachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMs: number = TTL.FIVE_MINUTES,
): Promise<T> {
  const cached = cacheGet<T>(key);
  if (cached !== null) return cached;
  const data = await fetcher();
  cacheSet(key, data, ttlMs);
  return data;
}

// ============================================================
//  Avati Safe Storage — Reusable Hooks
//  useLocalStorage: typed localStorage with React state sync
//  useApi: generic data fetching with loading/error/cache
// ============================================================

import { useState, useEffect, useCallback, useRef } from 'react';
import { cachedFetch, cacheInvalidate } from '../cache/apiCache';

// ── useLocalStorage ──────────────────────────────────────────
/**
 * Typed localStorage with React state synchronisation.
 * Drop-in replacement for the `useStickyState` pattern in QuotationSystem.
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T | (() => T),
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) return JSON.parse(stored) as T;
    } catch {}
    return typeof defaultValue === 'function'
      ? (defaultValue as () => T)()
      : defaultValue;
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);

  return [value, setValue];
}

// ── useApi ───────────────────────────────────────────────────
export interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Generic data-fetching hook with loading/error state and optional caching.
 * Compatible with Next.js data-fetching patterns for future migration.
 *
 * @param fetcher  Async function returning data
 * @param options  cacheKey (enables caching), ttlMs, deps array
 */
export function useApi<T>(
  fetcher: () => Promise<T>,
  options?: {
    cacheKey?: string;
    ttlMs?: number;
    deps?: React.DependencyList;
    enabled?: boolean;
  },
): UseApiResult<T> {
  const { cacheKey, ttlMs, deps = [], enabled = true } = options ?? {};
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const run = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    try {
      const result = cacheKey
        ? await cachedFetch(cacheKey, () => fetcherRef.current(), ttlMs)
        : await fetcherRef.current();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [cacheKey, ttlMs, enabled, ...deps]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { run(); }, [run]);

  const refetch = useCallback(() => {
    if (cacheKey) cacheInvalidate(cacheKey);
    run();
  }, [cacheKey, run]);

  return { data, loading, error, refetch };
}

// ── useScrollToTop ────────────────────────────────────────────
export function useScrollToTop(): void {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);
}

// ── useIntersectionObserver ──────────────────────────────────
export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options?: IntersectionObserverInit,
): boolean {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1, ...options },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, options]);
  return isVisible;
}

// ============================================================
//  Dynamic SEO Injection Hook
//  Path: avati-website/src/hooks/useSEO.ts
// ============================================================

import { useEffect } from 'react';

const DEFAULT_TITLE = 'Best Storage Space in Bangalore | Avati Safe Storage';
const DEFAULT_DESCRIPTION = '#1 self storage facility in Bangalore. Pest-free, 24/7 CCTV household & office storage from ₹999/mo. Free doorstep pickup across 50+ areas. Get instant quote!';

export function useSEO(metaTitle?: string, metaDescription?: string) {
  useEffect(() => {
    try {
      // 1. Title tag updates
      const finalTitle = metaTitle?.trim() || DEFAULT_TITLE;
      document.title = finalTitle;

      // 2. Meta description tag updates
      let metaDescEl = document.querySelector('meta[name="description"]');
      
      if (!metaDescEl) {
        metaDescEl = document.createElement('meta');
        metaDescEl.setAttribute('name', 'description');
        document.head.appendChild(metaDescEl);
      }

      const finalDesc = metaDescription?.trim() || DEFAULT_DESCRIPTION;
      metaDescEl.setAttribute('content', finalDesc);
    } catch (err) {
      // Fail silently behind the scenes without interrupting the user experience
      console.warn('[useSEO] Failed to inject dynamic SEO header attributes:', err);
    }
  }, [metaTitle, metaDescription]);
}
export default useSEO;

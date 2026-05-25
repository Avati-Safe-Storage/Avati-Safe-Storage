// ============================================================
//  Avati Safe Storage — CMS Client Factory
//  Selects the active adapter based on environment configuration.
//  Falls back to local adapter when Zoho Creator is not yet set up.
//
//  To activate Zoho Creator:
//    Set VITE_CMS_PROVIDER=zoho-creator in your environment
//    Set VITE_ZOHO_CREATOR_ACCOUNT_ID and VITE_ZOHO_CREATOR_APP_NAME
// ============================================================

import type { CMSClient } from './cmsTypes';
import { LocalCMSAdapter } from './localAdapter';
import { ZohoCreatorAdapter } from './zohoCreatorAdapter';

export type { CMSClient };
export type {
  PricingPlan, FAQEntry, Testimonial,
  ServiceArea, HomeBanner, BlogPost,
} from './cmsTypes';

// ── Singleton CMS client ─────────────────────────────────────
let _cms: CMSClient | null = null;

function createCMSClient(): CMSClient {
  const provider = import.meta.env.VITE_CMS_PROVIDER as string | undefined;
  const accountId = import.meta.env.VITE_ZOHO_CREATOR_ACCOUNT_ID as string | undefined;
  const appName   = import.meta.env.VITE_ZOHO_CREATOR_APP_NAME as string | undefined;

  if (provider === 'zoho-creator' && accountId && appName) {
    console.info('[CMS] Using Zoho Creator adapter');
    return new ZohoCreatorAdapter();
  }

  // Default: local fallback (preserves current hardcoded content)
  if (provider === 'zoho-creator') {
    console.warn('[CMS] zoho-creator selected but VITE_ZOHO_CREATOR_ACCOUNT_ID/APP_NAME missing — falling back to local adapter');
  }
  return new LocalCMSAdapter();
}

/** Get (or lazily initialize) the active CMS client */
export function getCMS(): CMSClient {
  if (!_cms) _cms = createCMSClient();
  return _cms;
}

/** Force re-initialize the CMS client (useful for tests / provider switching) */
export function resetCMS(): void {
  _cms = null;
}

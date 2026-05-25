import { defineConfig, type Plugin } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

/** Dev-only proxy for Zoho form submit (mirrors functions/api/zoho-form-submit.ts). */
function zohoFormDevProxy(): Plugin {
  const ZOHO_RECORDS_URL =
    'https://forms.zohopublic.in/avatisafestorage1/form/Contactdetails/formperma/1d2Scw-4Eanc9NE1BnuHC0VwRFl8nlDx-362SOYaalI/records';
  const QUOTE_METHOD_TO_RADIO: Record<string, string> = {
    inventory: 'Live Quotation',
    upload: 'Upload 360 Video',
    visit: 'Book Survey',
  };

  return {
    name: 'zoho-form-dev-proxy',
    configureServer(server) {
      server.middlewares.use('/api/zoho-form-submit', async (req, res) => {
        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
          res.end();
          return;
        }
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end();
          return;
        }

        const chunks: Buffer[] = [];
        for await (const chunk of req) chunks.push(chunk as Buffer);
        const body = JSON.parse(Buffer.concat(chunks).toString()) as {
          name?: string;
          phone?: string;
          email?: string;
          quoteMethod?: string;
          referrer?: string;
        };

        const zohoRes = await fetch(ZOHO_RECORDS_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/zoho.forms-v1+json',
          },
          body: JSON.stringify({
            SingleLine: 'Avati Website Lead',
            SingleLine1: (body.name ?? '').trim(),
            PhoneNumber: (body.phone ?? '').trim(),
            SingleLine2: (body.email ?? '').trim(),
            Radio: QUOTE_METHOD_TO_RADIO[body.quoteMethod ?? ''] ?? 'Live Quotation',
            REFERRER_NAME: body.referrer ?? 'http://localhost:5173/get-quote',
          }),
          signal: AbortSignal.timeout(6_000),
        });

        const text = await zohoRes.text();
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');

        let parsed: { encoded_string?: string } = {};
        try {
          parsed = JSON.parse(text) as { encoded_string?: string };
        } catch {
          res.statusCode = 502;
          res.end(JSON.stringify({ success: false, error: 'Zoho Forms returned an unexpected response.' }));
          return;
        }

        if (zohoRes.ok && parsed.encoded_string) {
          res.statusCode = 200;
          res.end(JSON.stringify({ success: true, recordId: parsed.encoded_string }));
        } else {
          res.statusCode = 502;
          res.end(JSON.stringify({ success: false, error: 'Zoho Forms rejected the submission.' }));
        }
      });
    },
  };
}

export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    zohoFormDevProxy(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
      'react/compiler-runtime': path.resolve(__dirname, './src/compiler-stub.ts'),
    },
  },


  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  build: {
    // Raise the warning limit to reduce noise (our chunks are intentionally split)
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Manual chunk splitting for optimal long-term caching
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // React core — smallest possible initial bundle
            if (id.includes('react-dom') || id.includes('react/')) return 'react-core';
            // Router
            if (id.includes('react-router')) return 'router';
            // Animation library (heavy)
            if (id.includes('motion') || id.includes('framer')) return 'motion';
            // Lucide icons (large icon set)
            if (id.includes('lucide')) return 'icons';
            // Radix UI primitives
            if (id.includes('@radix-ui')) return 'radix';
            // Charts / recharts
            if (id.includes('recharts') || id.includes('d3-')) return 'charts';
            // Everything else from node_modules
            return 'vendor';
          }
        },
        // Named assets for better caching
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
      },
    },
    // Enable minification
    minify: 'esbuild',
    // Target modern browsers for smaller output
    target: 'es2020',
    // Generate source maps for debugging (disable in prod if not needed)
    sourcemap: false,
    // CSS code splitting
    cssCodeSplit: true,
  },
})

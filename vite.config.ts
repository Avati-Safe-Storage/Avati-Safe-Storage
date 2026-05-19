import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
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


import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { componentTagger } from "lovable-tagger";

// Detect preview mode from environment variables or URL pattern
const isPreview = process.env.VITE_APP_PREVIEW === 'true' || 
                 (process.env.NODE_ENV !== 'production') ||
                 (typeof process.env.PREVIEW !== 'undefined') ||
                 (typeof process.env.LOVABLE_PREVIEW !== 'undefined');

console.log(`Building in ${isPreview ? 'preview' : process.env.NODE_ENV} mode`);

// Environment detection
const isProduction = process.env.NODE_ENV === 'production' && !isPreview;

// Updated CSP for development and production with localhost support for extensions
const devCSP = `default-src 'self'; connect-src 'self' wss://*.lovable.ai https://*.lovable.ai https://*.supabase.co wss://*.supabase.co https://*.stripe.com https://*.netlify.app vitals.vercel-insights.com https://ingesteer.services-prod.nsvcs.net http://localhost:* https://localhost:*; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.stripe.com https://m.stripe.network https://cdn.gpteng.co https://vitals.vercel-insights.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; frame-src 'self' https://*.stripe.com https://*.supabase.co; media-src 'self' data:; object-src 'none'; worker-src 'self' blob:;`;

const prodCSP = `default-src 'self'; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.stripe.com vitals.vercel-insights.com https://ingesteer.services-prod.nsvcs.net; script-src 'self' 'unsafe-inline' https://*.stripe.com https://m.stripe.network https://cdn.gpteng.co https://vitals.vercel-insights.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; frame-src 'self' https://*.stripe.com https://*.supabase.co; media-src 'self' data:; object-src 'none'; worker-src 'self' blob:;`;

export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      // Optimize React plugin
      jsxImportSource: undefined,
      tsDecorators: false
      // Removed invalid 'fastRefresh' option
    }),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: ['react', 'react-dom', 'framer-motion']
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'framer-motion',
      'react-router-dom',
      '@tanstack/react-query',
      'sonner',
      '@stripe/stripe-js'
    ],
    esbuildOptions: {
      target: 'es2020', // Modern target for better tree-shaking
    }
  },
  define: {
    'import.meta.env.MODE': JSON.stringify(mode),
    'import.meta.env.DEV': mode === 'development' || isPreview,
    'import.meta.env.VITE_APP_PREVIEW': JSON.stringify(isPreview ? 'true' : 'false'),
    'import.meta.env.DEBUG': JSON.stringify(!isProduction || isPreview ? 'true' : undefined),
    // Ensure WebSocket token is properly defined for HMR
    '__WS_TOKEN__': JSON.stringify(''),
    // Remove any references to process.env
    'process.env': '{}',
  },
  build: {
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari13'],
    cssCodeSplit: true, // Split CSS for better caching
    reportCompressedSize: false, // Disable for faster builds
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-slot', '@radix-ui/react-tabs'],
          'motion-vendor': ['framer-motion'],
          'query-vendor': ['@tanstack/react-query'],
          'stripe-vendor': ['@stripe/stripe-js'],
          // Additional chunks
          'form-vendor': ['react-hook-form', 'zod'],
          'date-vendor': ['date-fns']
        },
        // Optimize chunk size
        chunkFileNames: isProduction ? 'assets/[hash].js' : 'assets/[name]-[hash].js',
        entryFileNames: isProduction ? 'assets/[hash].js' : 'assets/[name]-[hash].js',
        assetFileNames: isProduction ? 'assets/[hash][extname]' : 'assets/[name]-[hash][extname]',
      }
    },
    sourcemap: !isProduction || isPreview,
    minify: isProduction && !isPreview,
    // Add image optimization for production builds
    assetsInlineLimit: 4096, // 4kb - small images will be inlined
  },
  server: {
    host: "::",
    port: 8080,
    strictPort: true,
    // Simplified HMR config - let Vite handle WebSocket tokens automatically
    hmr: {
      port: 8080,
    },
    // Add headers for CORS and caching during development
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Content-Security-Policy': devCSP
    }
  },
  preview: {
    // Optimize preview server
    port: 8080,
    strictPort: true,
    headers: {
      'Cache-Control': 'public, max-age=600',
      'Access-Control-Allow-Origin': '*',
      'Content-Security-Policy': prodCSP
    }
  }
}));

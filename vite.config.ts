
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { visualizer } from "rollup-plugin-visualizer";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    mode === 'development' && visualizer({
      template: "treemap",
      open: true,
      gzipSize: true,
      brotliSize: true,
      filename: "bundle-analysis.html"
    })
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
      define: {
        global: 'globalThis'
      },
      supported: {
        'async-await': true,
        'arrow-functions': true,
        'default-param-last': true,
        'destructuring': true,
        'dynamic-import': true,
        'for-of': true,
        'import-meta': true,
        'nullish-coalescing': true,
        'optional-chaining': true,
      }
    }
  },
  build: {
    target: ['es2015', 'edge88', 'firefox78', 'chrome87', 'safari13'],
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-slot', '@radix-ui/react-tabs'],
          'motion-vendor': ['framer-motion'],
          'query-vendor': ['@tanstack/react-query'],
          'stripe-vendor': ['@stripe/stripe-js']
        }
      }
    },
    sourcemap: true,
    commonjsOptions: {
      transformMixedEsModules: true
    }
  },
  server: {
    host: "::",
    port: 8080,
    strictPort: true,
    hmr: {
      clientPort: 443,
      protocol: 'wss'
    },
    headers: {
      'Content-Security-Policy': `
        default-src 'self' https://*.stripe.com https://*.supabase.co;
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.stripe.com https://*.supabase.co blob:;
        style-src 'self' 'unsafe-inline';
        img-src 'self' data: https://*.stripe.com https://*.supabase.co;
        connect-src 'self' https://*.stripe.com https://*.supabase.co wss://*.supabase.co https://*.lovableproject.com wss://*.lovableproject.com;
        frame-src 'self' https://*.stripe.com;
        worker-src 'self' blob:;
        preload-src 'self';
      `.replace(/\s+/g, ' ').trim()
    }
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
}));

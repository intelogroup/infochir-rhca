
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

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
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
    ]
  },
  define: {
    'import.meta.env.MODE': JSON.stringify(mode),
    'import.meta.env.DEV': mode === 'development' || isPreview,
    'import.meta.env.VITE_APP_PREVIEW': JSON.stringify(isPreview ? 'true' : 'false'),
    'import.meta.env.DEBUG': JSON.stringify(!isProduction || isPreview ? 'true' : undefined),
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
    sourcemap: !isProduction || isPreview,
    minify: isProduction && !isPreview
  },
  server: {
    host: "::",
    port: 8080,
    strictPort: true,
    hmr: {
      clientPort: 443,
      protocol: 'wss'
    }
  }
}));

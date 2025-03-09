
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
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
    sourcemap: false
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
});

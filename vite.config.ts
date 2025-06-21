import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 5175,
    host: true, // Listen on all addresses
    strictPort: true, // Exit if port is already in use
    cors: true
  },
  preview: {
    port: 5175,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Optimize for production
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'editor-vendor': ['react-quill', '@monaco-editor/react'],
          'ui-vendor': ['lucide-react', 'recharts']
        }
      }
    }
  }
});

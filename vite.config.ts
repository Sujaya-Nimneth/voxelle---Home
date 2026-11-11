/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        // theme-neutral/fonts.css @imports Figtree from the Google Fonts CDN.
        // Redirect it to a self-hosted @font-face so the app keeps its zero-CDN
        // privacy promise without hand-editing the generated astryx-themes module.
        find: /^@astryxdesign\/theme-neutral\/fonts\.css$/,
        replacement: fileURLToPath(new URL('./src/styles/astryx-fonts.css', import.meta.url))
      }
    ]
  },
  // Relative base so the built app works from any subpath (GitHub Pages repo scope).
  base: './',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/react-dom') || /node_modules\/react\//.test(id)) {
            return 'react';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'icons';
          }
          return undefined;
        }
      }
    }
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    include: ['src/**/*.{test,spec}.{ts,tsx}']
  }
});

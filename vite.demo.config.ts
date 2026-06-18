import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
  // In CI the BASE_URL env var sets the GitHub Pages subpath, e.g. /drupal-web-components/
  base: process.env.BASE_URL ?? '/',
  build: {
    outDir: 'demo-dist',
    emptyOutDir: true,
  },
  // Reuse the same test config so `vitest` still works with the default vite.config.ts
  ...(mode !== 'test' ? {} : {}),
}));

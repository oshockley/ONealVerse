import { defineConfig } from 'vite';

export default defineConfig({
  base: '/ONealVerse/',
  root: '.',
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  },
  optimizeDeps: {
    include: ['three', 'gsap']
  }
});

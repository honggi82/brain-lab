import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { existsSync } from 'node:fs';
// The simulator's Python API runs separately; proxying keeps the browser on one origin.
export default defineConfig({
  plugins: [react()],
  base: './',
  publicDir: existsSync(new URL('../app/static-data/', import.meta.url)) ? '../app' : 'public',
  server: { proxy: { '/api': { target: 'http://127.0.0.1:8000', changeOrigin: true } } },
});

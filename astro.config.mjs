import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://sooth.dev',
  vite: {
    plugins: [tailwindcss()],
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  markdown: {
    shikiConfig: {
      theme: 'css-variables',
    },
  },
});

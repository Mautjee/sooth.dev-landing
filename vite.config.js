import { defineConfig } from 'vite';

export default defineConfig({
  preview: {
    allowedHosts: ['sooth.dev', 'www.sooth.dev']
  },
  server: {
    host: '0.0.0.0',
    allowedHosts: ['sooth.dev', 'www.sooth.dev']
  }
});
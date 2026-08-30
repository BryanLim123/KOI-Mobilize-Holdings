import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  // Empty in production: the deployed site reads the committed content snapshot
  // rather than calling an API that is not deployed with it.
  const apiUrl = env.VITE_API_URL || '';

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(apiUrl),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    json: {
      // site-content.json is imported as a single fallback object, not tree-shaken
      stringify: false,
    },
  };
});

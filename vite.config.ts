import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    // GitHub Pages base path - 如果倉庫名稱不是根目錄，請修改此處
    // 例如：如果倉庫名是 'monthly-allocator'，則 base 應該是 '/monthly-allocator/'
    // 如果使用自定義域名或倉庫名是 'username.github.io'，則 base 應該是 '/'
    const base = process.env.GITHUB_PAGES === 'true' ? '/monthly-allocator/' : '/';
    
    return {
      base: base,
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        outDir: 'dist',
        assetsDir: 'assets',
      }
    };
});

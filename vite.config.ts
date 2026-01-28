import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), basicSsl()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 3000,
      host: true,
      proxy: {
        '/api/weather': {
          target: 'http://apis.data.go.kr',
          changeOrigin: true,
          rewrite: (proxyPath) => {
            const stripped = proxyPath.replace(/^\/api\/weather/, '');
            const separator = stripped.includes('?') ? '&' : '?';
            return `${stripped}${separator}serviceKey=${env.KMA_API_KEY}`;
          },
        },
      },
    },
  };
});

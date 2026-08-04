import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv, Plugin} from 'vite';

const imageProxyPlugin = (): Plugin => ({
  name: 'image-proxy-middleware',
  configureServer(server) {
    server.middlewares.use('/api/proxy-image', async (req, res) => {
      try {
        const reqUrl = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
        const targetUrl = reqUrl.searchParams.get('url');
        if (!targetUrl) {
          res.statusCode = 400;
          return res.end('Missing target image url');
        }

        const fetchResponse = await fetch(targetUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          },
        });

        if (!fetchResponse.ok) {
          res.statusCode = fetchResponse.status;
          return res.end(`Failed to fetch upstream image: ${fetchResponse.statusText}`);
        }

        const contentType = fetchResponse.headers.get('content-type') || 'image/jpeg';
        const arrayBuffer = await fetchResponse.arrayBuffer();

        res.setHeader('Content-Type', contentType);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.end(Buffer.from(arrayBuffer));
      } catch (err: any) {
        res.statusCode = 500;
        res.end(`Image proxy server error: ${err.message || 'Unknown error'}`);
      }
    });
  },
});

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss(), imageProxyPlugin()],
    
    base: '/',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});

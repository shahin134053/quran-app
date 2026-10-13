import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        hmr: false,
      },
      optimizeDeps: {
        include: ['react', 'react-dom', 'lucide-react', 'framer-motion', 'firebase/firestore', 'firebase/app', 'qrcode.react', 'jspdf', 'html2canvas'],
      },
      plugins: [
        tailwindcss(),
        react(),
        VitePWA({
          registerType: 'autoUpdate',
          devOptions: {
            enabled: true,
            type: 'module'
          },
          workbox: {
            maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
            cleanupOutdatedCaches: true,
            globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
            runtimeCaching: [
              {
                urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'google-fonts-cache',
                  expiration: {
                    maxEntries: 10,
                    maxAgeSeconds: 60 * 60 * 24 * 365,
                  },
                  cacheableResponse: {
                    statuses: [0, 200],
                  },
                },
              },
              {
                urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'gstatic-fonts-cache',
                  expiration: {
                    maxEntries: 10,
                    maxAgeSeconds: 60 * 60 * 24 * 365,
                  },
                  cacheableResponse: {
                    statuses: [0, 200],
                  },
                },
              },
            ],
          },
          includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg', 'icon.svg'],
          manifest: {
            id: '/',
            name: 'আল- শাহিন ( Shahin) Quran',
            short_name: 'আল-শাহিন',
            description: 'A premium, modern Islamic Quran app featuring multilingual support, audio recitation, offline reading, and daily prayer reminders.',
            theme_color: '#10b981',
            background_color: '#ffffff',
            display: 'standalone',
            start_url: '/',
            scope: '/',
            icons: [
              {
                src: 'icon.svg',
                sizes: '192x192 512x512',
                type: 'image/svg+xml',
                purpose: 'any'
              },
              {
                src: 'icon.svg',
                sizes: '512x512',
                type: 'image/svg+xml',
                purpose: 'maskable'
              }
            ]
          }
        })
      ],
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
        chunkSizeWarningLimit: 3000,
        emptyOutDir: true,
        sourcemap: false
      }
    };
});

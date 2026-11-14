import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: process.env.BASE_PATH || './',
  plugins: [VitePWA({
    registerType: 'prompt',
    includeAssets: ['icons/*.png'],
    manifest: {
      name: 'Stories – myter och berättelser',
      short_name: 'Stories',
      lang: 'sv',
      start_url: './',
      scope: './',
      display: 'standalone',
      background_color: '#efdfb7',
      theme_color: '#796342',
      icons: [
        { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,jpg,woff2}'],
      runtimeCaching: [
        { urlPattern: /^https:\/\/fonts\.googleapis\.com\//, handler: 'StaleWhileRevalidate', options: { cacheName: 'stories-font-css' } },
        { urlPattern: /^https:\/\/fonts\.gstatic\.com\//, handler: 'CacheFirst', options: { cacheName: 'stories-fonts', expiration: { maxEntries: 12, maxAgeSeconds: 31536000 }, cacheableResponse: { statuses: [0, 200] } } },
        { urlPattern: /^https:\/\/(blog\.tcea\.org|res\.cloudinary\.com)\//, handler: 'CacheFirst', options: { cacheName: 'stories-images', expiration: { maxEntries: 10, maxAgeSeconds: 2592000 }, cacheableResponse: { statuses: [0, 200] } } },
      ],
    },
  })],
});

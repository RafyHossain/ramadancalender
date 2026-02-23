import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt', // 'autoUpdate' থেকে 'prompt' করা হলো যাতে ইউজারকে নোটিফিকেশন দেখানো যায়
      injectRegister: 'script',

      includeAssets: [
        'favicon.ico',
        'ramadanlogo.png',
        'ramadan_data.json'
      ],

      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,json}'],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.endsWith('.json'),
            handler: 'StaleWhileRevalidate', 
            options: {
              cacheName: 'json-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 30 
              }
            }
          }
        ]
      },

      manifest: {
        name: 'Ramadan 2026',
        short_name: 'Ramadan',
        start_url: '/',
        display: 'standalone',
        background_color: '#0f172a',
        theme_color: '#0f172a',
        icons: [
          {
            src: 'ramadanlogo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'ramadanlogo.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
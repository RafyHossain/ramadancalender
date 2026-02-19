import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Ramadan 2026 - Sehri & Iftar Time',
        short_name: 'Ramadan 2026',
        description: 'Bangladesh Sehri & Iftar Time Schedule',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: '/ramadanlogo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/ramadanlogo.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})

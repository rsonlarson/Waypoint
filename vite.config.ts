import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  base: '/',
  server: {
    port: 8080
  },
  plugins: [
    react(),
    tsconfigPaths(),
    VitePWA({
      injectRegister: 'auto',
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png'],
      strategies: 'generateSW',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      },
      manifest: {
        name: 'Waypoint',
        short_name: 'Waypoint',
        description: 'Plan rides. Find your crew. Get there together.',
        id: '/',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#0f172a',
        icons: [
          {
            src: '/icons/waypoint-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/waypoint-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/icons/waypoint-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    })
  ]
})

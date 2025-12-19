import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    tsconfigPaths(),
    VitePWA({
      injectRegister: false,
      strategies: 'generateSW',

      manifest: {
        name: 'PowderPool',
        short_name: 'PowderPool',
        description: 'Ski carpooling made easy',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#0f172a',
        icons: [
          {
            src: '/pwa-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})

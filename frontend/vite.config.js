import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '')
  const rawApiUrl = env.VITE_API_URL || 'http://localhost:8000'

  let apiOrigin = 'http://localhost:8000'
  try {
    apiOrigin = new URL(rawApiUrl).origin
  } catch {
    apiOrigin = 'http://localhost:8000'
  }

  const escapedOrigin = apiOrigin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['apple-touch-icon.png'],
        manifest: {
          name: 'Scholr',
          short_name: 'Scholr',
          description: 'Learn while you scroll',
          theme_color: '#ffffff',
          background_color: '#ffffff',
          display: 'standalone',
          orientation: 'portrait',
          scope: '/',
          start_url: '/',
          icons: [
            {
              src: 'icons/icon-192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'icons/icon-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
          runtimeCaching: [
            {
              urlPattern: new RegExp(`^${escapedOrigin}/api/.*`, 'i'),
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24,
                },
              },
            },
          ],
        },
      }),
    ],
    root: __dirname,
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
  }
})

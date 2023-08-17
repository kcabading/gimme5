import path from "path"
import react from "@vitejs/plugin-react-swc"
import { defineConfig } from "vite"
import { VitePWA } from 'vite-plugin-pwa'
 
export default defineConfig({
  plugins: [
    react(), 
    VitePWA({ 
      injectRegister: 'auto',
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching:[{
            urlPattern: ({url}) => {
              return url.pathname.startsWith("/")
            },
            handler: "CacheFirst" as const,
            options: {
              cacheName: "api-cache",
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
        }]
      },
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'Gimme5 - Laro ng mga Henyo',
        short_name: 'Gimme5',
        description: 'Makipagtagisan ng Talino',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })],
  define: {
    global: {},
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      find: './runtimeConfig',
      replacement: './runtimeConfig.browser', // ensures browser compatible version of AWS JS SDK is used
    },
  },
})
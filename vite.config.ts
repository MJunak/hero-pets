import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/hero-pets/',
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Hero Pets',
        short_name: 'Hero Pets',
        description: 'Werde ein Superheld oder ein Superhelden-Tier!',
        theme_color: '#2b3a67',
        background_color: '#2b3a67',
        display: 'standalone',
        orientation: 'landscape',
        start_url: '/hero-pets/',
        scope: '/hero-pets/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webmanifest}']
      }
    })
  ],
  server: {
    host: true
  }
});

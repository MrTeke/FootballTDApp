import { defineConfig } from 'vite'

const capacitorExternals = ['@capacitor-community/admob', '@capacitor/app']

export default defineConfig({
  base: './',
  plugins: [
    {
      name: 'capacitor-native-stub',
      resolveId(id) {
        if (capacitorExternals.includes(id)) return id
      },
      load(id) {
        if (capacitorExternals.includes(id)) return 'export default {}; export const AdMob = null;'
      }
    }
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      // Capacitor native plugins — provided at runtime on device
      external: capacitorExternals,
    },
  },
  server: {
    port: 5173,
    open: true,
  }
})

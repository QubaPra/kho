import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    // Pakuj wszystko do jednego HTML (JS, CSS, assety w miarę możliwości)
    viteSingleFile(),
  ],
  server: {
    port: 5173,
  },
  // Uwaga: baza pozostaje dla hostingu na GitHub Pages. W przypadku użycia pliku lokalnie można zmienić na './'.
  base: '/kapitula',
  build: {
    // Zmniejsza liczbę wyjściowych plików CSS (i ułatwia inline)
    cssCodeSplit: false,
    // Inline'uj zasoby binarne jako data URI (SVG, PNG, itd.)
    assetsInlineLimit: 100_000_000, // ~100 MB, praktycznie wszystko
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
})

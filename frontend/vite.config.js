import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import ghPages from 'vite-plugin-gh-pages';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    ghPages()],
  server: {
    port: 5173,
  },
  base: '/KHO/',
})

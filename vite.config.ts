import path from "path";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import pages from 'vite-plugin-pages'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/movie-book-frontend/',
  plugins: [
    react(),
    pages({ dirs: './src/pages' })
  ],
  resolve: {
    alias: {
    "@": path.resolve(__dirname, "./src"),
  },
},
})

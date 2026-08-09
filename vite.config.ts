import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { wallpapersPlugin } from './vite-plugin-wallpapers.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), wallpapersPlugin()],
  // Use relative asset URLs in build output.
  base: './',
})

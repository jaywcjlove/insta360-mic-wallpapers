import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { wallpapersPlugin } from './vite-plugin-wallpapers.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), wallpapersPlugin()],
  // GitHub Pages project site: https://<user>.github.io/<repo>/
  base: '/insta360-mic-wallpapers/',
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages project site: https://<user>.github.io/<repo>/
  base: '/insta360-mic-wallpapers/',
})

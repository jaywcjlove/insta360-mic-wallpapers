/// <reference types="vite/client" />

declare module 'virtual:wallpapers' {
  export type WallpaperMeta = {
    id: string
    title: string
    category: string
    file: string
    width: number
    height: number
  }
  const wallpapers: WallpaperMeta[]
  export default wallpapers
}

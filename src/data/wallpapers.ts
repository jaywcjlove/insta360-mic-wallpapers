import catalog from './wallpapers.json'

export type Wallpaper = {
  id: string
  title: string
  category: string
  colors: string[]
  file: string
  width: number
  height: number
}

export type WallpaperItem = Wallpaper & {
  x: number
  y: number
  scale: number
  rotation: number
}

export const CATEGORIES = [
  { id: 'all', label: '全部' },
  { id: 'icon', label: '图标' },
  { id: 'pattern', label: '图案' },
  { id: 'label', label: '标签' },
  { id: 'solid', label: '纯色' },
  { id: 'minimal', label: '极简' },
] as const

export const wallpapers = catalog as Wallpaper[]

/** Scatter items across a large virtual canvas (thiings-style grid with jitter). */
export function layoutWallpapers(
  items: Wallpaper[],
  opts?: { cols?: number; cellW?: number; cellH?: number; seed?: number }
): WallpaperItem[] {
  const cols = opts?.cols ?? 8
  const cellW = opts?.cellW ?? 200
  const cellH = opts?.cellH ?? 190
  const seed = opts?.seed ?? 42

  // Simple deterministic PRNG
  let s = seed
  const rand = () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }

  return items.map((item, i) => {
    const col = i % cols
    const row = Math.floor(i / cols)
    const jitterX = (rand() - 0.5) * 48
    const jitterY = (rand() - 0.5) * 40
    const scale = 0.92 + rand() * 0.2
    const rotation = (rand() - 0.5) * 6

    return {
      ...item,
      x: col * cellW + jitterX + 80,
      y: row * cellH + jitterY + 80,
      scale,
      rotation,
    }
  })
}

export function wallpaperUrl(file: string): string {
  const base = import.meta.env.BASE_URL || '/'
  const normalized = base.endsWith('/') ? base : `${base}/`
  return `${normalized}${file.replace(/^\//, '')}`
}

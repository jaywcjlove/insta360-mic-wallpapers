import catalog from 'virtual:wallpapers'

export type Wallpaper = {
  id: string
  title: string
  category: string
  file: string
  width: number
  height: number
}

/** One placed instance on the infinite grid (uniform size). */
export type WallpaperItem = Wallpaper & {
  key: string
  col: number
  row: number
  x: number
  y: number
}

/** Fixed cell size — all wallpapers render at the same visual size. */
export const CELL_W = 160
export const CELL_H = 176
/** Extra cells rendered outside the viewport while panning. */
export const GRID_PAD = 3

export const wallpapers = catalog as Wallpaper[]

/** Build category chips from filenames (`名称[分类].ext`). */
export function buildCategories(items: Wallpaper[]) {
  const set = new Set<string>()
  for (const w of items) {
    if (w.category) set.add(w.category)
  }
  const cats = [...set].sort((a, b) => a.localeCompare(b, 'zh-CN'))
  return [
    { id: 'all', label: '全部' },
    ...cats.map((c) => ({ id: c, label: c })),
  ]
}

/** Deterministic wallpaper pick for a grid cell (same cell → same wallpaper). */
export function wallpaperAt(pool: Wallpaper[], col: number, row: number): Wallpaper {
  const n = pool.length
  if (n === 0) {
    throw new Error('wallpaper pool is empty')
  }
  let h = Math.imul(col | 0, 374761393) + Math.imul(row | 0, 668265263)
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  const idx = Math.abs(h) % n
  return pool[idx]!
}

/**
 * Build only the grid cells that intersect the current viewport (plus padding).
 * Panning regenerates cells so the canvas always looks filled.
 */
export function visibleWallpapers(
  pool: Wallpaper[],
  pan: { x: number; y: number; scale: number },
  viewport: { width: number; height: number }
): WallpaperItem[] {
  if (pool.length === 0 || viewport.width <= 0 || viewport.height <= 0) {
    return []
  }

  const { x: px, y: py, scale } = pan
  const left = -px / scale
  const top = -py / scale
  const right = (viewport.width - px) / scale
  const bottom = (viewport.height - py) / scale

  const col0 = Math.floor(left / CELL_W) - GRID_PAD
  const row0 = Math.floor(top / CELL_H) - GRID_PAD
  const col1 = Math.ceil(right / CELL_W) + GRID_PAD
  const row1 = Math.ceil(bottom / CELL_H) + GRID_PAD

  const maxCols = 48
  const maxRows = 36
  const cols = Math.min(col1 - col0, maxCols)
  const rows = Math.min(row1 - row0, maxRows)
  const startCol = col0 + Math.floor((col1 - col0 - cols) / 2)
  const startRow = row0 + Math.floor((row1 - row0 - rows) / 2)

  const items: WallpaperItem[] = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const col = startCol + c
      const row = startRow + r
      const wp = wallpaperAt(pool, col, row)
      items.push({
        ...wp,
        key: `${col}:${row}:${wp.id}`,
        col,
        row,
        x: col * CELL_W,
        y: row * CELL_H,
      })
    }
  }
  return items
}

/** Encode path segments so filenames like `name[分类].png` work in URLs. */
export function wallpaperUrl(file: string): string {
  const base = import.meta.env.BASE_URL || '/'
  const normalized = base.endsWith('/') ? base : `${base}/`
  const path = file
    .replace(/^\//, '')
    .split('/')
    .map((seg) => encodeURIComponent(seg))
    .join('/')
  return `${normalized}${path}`
}

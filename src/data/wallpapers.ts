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

/** Filter by category chip and a case-insensitive title / id / category query. */
export function filterWallpapers(
  items: Wallpaper[],
  category: string,
  query: string
): Wallpaper[] {
  const q = query.trim().toLowerCase()
  return items.filter((w) => {
    if (category !== 'all' && w.category !== category) return false
    if (!q) return true
    return (
      w.title.toLowerCase().includes(q) ||
      w.id.toLowerCase().includes(q) ||
      w.category.toLowerCase().includes(q)
    )
  })
}

const ORTHO = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
] as const

/** Euclidean modulo so negative columns/rows wrap into 0..n-1. */
function emod(a: number, n: number): number {
  return ((a % n) + n) % n
}

function hash32(col: number, row: number, salt: number): number {
  let h =
    Math.imul(col | 0, 374761393) ^
    Math.imul(row | 0, 668265263) ^
    Math.imul(salt | 0, 1597334677)
  h = Math.imul(h ^ (h >>> 16), 2246822519)
  h = Math.imul(h ^ (h >>> 13), 3266489917)
  return h ^ (h >>> 16)
}

function higherPriority(c1: number, r1: number, c2: number, r2: number): boolean {
  const p1 = hash32(c1, r1, 1) >>> 0
  const p2 = hash32(c2, r2, 1) >>> 0
  if (p1 !== p2) return p1 > p2
  if (c1 !== c2) return c1 > c2
  return r1 > r2
}

/**
 * Index in 0..n-1. Same (col, row) always wins the same wallpaper.
 * Orthogonal neighbors differ whenever n >= 2.
 *
 * n < 5: a 4-regular grid can starve greedy coloring, so use a lattice.
 * n >= 5: hash-pick, then yield to higher-priority neighbors that already claimed that wallpaper.
 */
function indexAt(
  col: number,
  row: number,
  n: number,
  memo: Map<string, number>
): number {
  if (n <= 1) return 0
  if (n < 5) return emod(col + row, n)

  const key = `${col},${row}`
  const hit = memo.get(key)
  if (hit !== undefined) return hit

  const taken = new Set<number>()
  for (const [dc, dr] of ORTHO) {
    const nc = col + dc
    const nr = row + dr
    if (higherPriority(nc, nr, col, row)) {
      taken.add(indexAt(nc, nr, n, memo))
    }
  }

  const preferred = (hash32(col, row, 2) >>> 0) % n
  let idx = preferred
  for (let i = 0; i < n; i++) {
    idx = (preferred + i) % n
    if (!taken.has(idx)) break
  }
  memo.set(key, idx)
  return idx
}

/** Deterministic wallpaper pick for a grid cell (same cell → same wallpaper). */
export function wallpaperAt(pool: Wallpaper[], col: number, row: number): Wallpaper {
  const n = pool.length
  if (n === 0) {
    throw new Error('wallpaper pool is empty')
  }
  return pool[indexAt(col, row, n, new Map())]!
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

  const n = pool.length
  const items: WallpaperItem[] = []
  const memo = new Map<string, number>()
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const col = startCol + c
      const row = startRow + r
      const wp = pool[indexAt(col, row, n, memo)]!
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

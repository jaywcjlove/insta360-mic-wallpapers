import fs from 'node:fs'
import path from 'node:path'
import type { Plugin } from 'vite'

const VIRTUAL_ID = 'virtual:wallpapers'
const RESOLVED_ID = '\0' + VIRTUAL_ID

export type ScannedWallpaper = {
  id: string
  title: string
  category: string
  file: string
  width: number
  height: number
}

/**
 * Filename convention: `名称[分类].png`
 * e.g. bauhaus-2[头像].png → title "bauhaus-2", category "头像"
 * Without brackets → category "其他"
 */
export function parseWallpaperFilename(filename: string): ScannedWallpaper | null {
  const m = filename.match(/^(.+?)\.(png|jpe?g|webp)$/i)
  if (!m) return null

  const stem = m[1]!
  const catMatch = stem.match(/^(.*?)\[([^\]]+)\]$/)
  const rawName = (catMatch ? catMatch[1]! : stem).trim()
  const category = (catMatch ? catMatch[2]! : '其他').trim() || '其他'
  if (!rawName) return null

  // id without brackets for stable keys; file keeps original name for public URL
  const id = rawName
  const title = rawName.replace(/[-_]+/g, ' ').trim()

  return {
    id,
    title,
    category,
    file: `wallpapers/${filename}`,
    width: 240,
    height: 208,
  }
}

function scan(dir: string): ScannedWallpaper[] {
  if (!fs.existsSync(dir)) return []
  const files = fs
    .readdirSync(dir)
    .filter((f) => /\.(png|jpe?g|webp)$/i.test(f) && !f.startsWith('.'))
    .sort((a, b) => a.localeCompare(b, 'en'))

  const list: ScannedWallpaper[] = []
  const seen = new Set<string>()

  for (const file of files) {
    const item = parseWallpaperFilename(file)
    if (!item) continue
    // Disambiguate duplicate ids
    let key = item.id
    let n = 2
    while (seen.has(key)) {
      key = `${item.id}-${n++}`
    }
    seen.add(key)
    list.push({ ...item, id: key })
  }

  return list
}

/** Scan public/wallpapers at dev/build time — drop files in, refresh to pick up. */
export function wallpapersPlugin(wallpapersDir = 'public/wallpapers'): Plugin {
  const absDir = path.resolve(wallpapersDir)

  return {
    name: 'wallpapers-from-public',
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID
    },
    load(id) {
      if (id !== RESOLVED_ID) return
      const data = scan(absDir)
      return `export default ${JSON.stringify(data, null, 2)}`
    },
    configureServer(server) {
      const reload = () => {
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID)
        if (mod) {
          server.moduleGraph.invalidateModule(mod)
          server.ws.send({ type: 'full-reload' })
        }
      }
      server.watcher.add(absDir)
      server.watcher.on('add', (file) => {
        if (file.startsWith(absDir)) reload()
      })
      server.watcher.on('unlink', (file) => {
        if (file.startsWith(absDir)) reload()
      })
      server.watcher.on('change', (file) => {
        if (file.startsWith(absDir)) reload()
      })
    },
  }
}

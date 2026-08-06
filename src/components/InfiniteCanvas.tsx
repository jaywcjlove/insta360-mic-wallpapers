import { useCallback, useLayoutEffect, useMemo, useState } from 'react'
import type { Wallpaper, WallpaperItem } from '../data/wallpapers'
import { CELL_H, CELL_W, visibleWallpapers } from '../data/wallpapers'
import { usePanCanvas } from '../hooks/usePanCanvas'
import { WallpaperCard } from './WallpaperCard'

type Props = {
  wallpapers: Wallpaper[]
  onSelect: (item: WallpaperItem) => void
}

function useViewportSize(rootId: string) {
  const [size, setSize] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  }))

  useLayoutEffect(() => {
    const el = document.getElementById(rootId)
    if (!el) return

    const update = () => {
      setSize({ width: el.clientWidth, height: el.clientHeight })
    }
    update()

    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [rootId])

  return size
}

export function InfiniteCanvas({ wallpapers, onSelect }: Props) {
  const initial = useMemo(() => {
    const w = typeof window !== 'undefined' ? window.innerWidth : 1200
    const h = typeof window !== 'undefined' ? window.innerHeight : 800
    return {
      x: w * 0.5 - CELL_W * 0.5,
      y: h * 0.45 - CELL_H * 0.5,
      scale: 1,
    }
  }, [])

  const {
    pan,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    didDrag,
  } = usePanCanvas({ initial })

  const viewport = useViewportSize('infinite-canvas-root')

  const items = useMemo(
    () => visibleWallpapers(wallpapers, pan, viewport),
    [wallpapers, pan, viewport]
  )

  const handleSelect = useCallback(
    (item: WallpaperItem) => {
      onSelect(item)
    },
    [onSelect]
  )

  return (
    <div
      id="infinite-canvas-root"
      className="canvas-root"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
    >
      <div className="canvas-grid" aria-hidden="true" />

      <div
        className="canvas-world"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${pan.scale})`,
        }}
      >
        {items.map((item) => (
          <WallpaperCard
            key={item.key}
            item={item}
            onSelect={handleSelect}
            didDrag={didDrag}
          />
        ))}
      </div>

      <div className="canvas-hint" aria-hidden="true">
        拖拽或滚轮移动 · 点击壁纸下载
      </div>
    </div>
  )
}

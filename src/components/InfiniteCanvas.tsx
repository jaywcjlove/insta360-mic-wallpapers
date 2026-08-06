import { useEffect, useMemo } from 'react'
import type { Wallpaper, WallpaperItem } from '../data/wallpapers'
import { layoutWallpapers } from '../data/wallpapers'
import { usePanCanvas } from '../hooks/usePanCanvas'
import { WallpaperCard } from './WallpaperCard'

type Props = {
  wallpapers: Wallpaper[]
  onSelect: (item: WallpaperItem) => void
  onRegisterReset?: (reset: () => void) => void
}

export function InfiniteCanvas({ wallpapers, onSelect, onRegisterReset }: Props) {
  // Center initial view roughly on the first few cards
  const initial = useMemo(
    () => ({
      x: typeof window !== 'undefined' ? window.innerWidth * 0.15 : 120,
      y: typeof window !== 'undefined' ? window.innerHeight * 0.18 : 100,
      scale: 1,
    }),
    []
  )

  const { pan, onPointerDown, onPointerMove, onPointerUp, didDrag, reset } =
    usePanCanvas({ initial, minScale: 0.4, maxScale: 2 })

  useEffect(() => {
    onRegisterReset?.(reset)
  }, [reset, onRegisterReset])

  const items = useMemo(() => layoutWallpapers(wallpapers), [wallpapers])

  const handleSelect = (item: WallpaperItem) => {
    // Ignore click if user was panning
    if (didDrag()) return
    onSelect(item)
  }

  return (
    <div
      id="infinite-canvas-root"
      className="canvas-root"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div className="canvas-grid" aria-hidden="true" />

      <div
        className="canvas-world"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${pan.scale})`,
        }}
      >
        {items.map((item) => (
          <WallpaperCard key={item.id} item={item} onSelect={handleSelect} />
        ))}
      </div>

      <div className="canvas-hint" aria-hidden="true">
        拖拽移动画布 · 滚轮缩放 · 点击壁纸下载
      </div>
    </div>
  )
}

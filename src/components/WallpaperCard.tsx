import type { WallpaperItem } from '../data/wallpapers'
import { wallpaperUrl } from '../data/wallpapers'

type Props = {
  item: WallpaperItem
  onSelect: (item: WallpaperItem) => void
  /** When true, the parent treated this press as a pan — ignore click. */
  didDrag: () => boolean
}

/** Fixed-size card so every wallpaper appears uniform on the infinite grid. */
export function WallpaperCard({ item, onSelect, didDrag }: Props) {
  return (
    <div
      role="button"
      tabIndex={0}
      className="wp-card"
      data-wp-key={item.key}
      style={{
        left: item.x,
        top: item.y,
      }}
      onClick={(e) => {
        e.stopPropagation()
        e.preventDefault()
        // Click fires after pointerup; skip if user panned
        if (didDrag()) return
        onSelect(item)
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(item)
        }
      }}
      aria-label={`下载壁纸 ${item.title}`}
    >
      <div className="wp-card-ring">
        <img
          src={wallpaperUrl(item.file)}
          alt={item.title}
          width={item.width}
          height={item.height}
          draggable={false}
          loading="lazy"
          decoding="async"
        />
      </div>
      <span className="wp-card-title">{item.title}</span>
    </div>
  )
}

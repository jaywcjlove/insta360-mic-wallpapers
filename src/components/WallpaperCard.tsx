import type { WallpaperItem } from '../data/wallpapers'
import { wallpaperUrl } from '../data/wallpapers'

type Props = {
  item: WallpaperItem
  onSelect: (item: WallpaperItem) => void
}

/** Card is a div so canvas pan can start on top of it (buttons capture quirks). */
export function WallpaperCard({ item, onSelect }: Props) {
  return (
    <div
      role="button"
      tabIndex={0}
      className="wp-card"
      style={{
        left: item.x,
        top: item.y,
        transform: `scale(${item.scale}) rotate(${item.rotation}deg)`,
      }}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(item)
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(item)
        }
      }}
      aria-label={`查看壁纸 ${item.title}`}
    >
      <div className="wp-card-ring">
        <img
          src={wallpaperUrl(item.file)}
          alt={item.title}
          width={item.width}
          height={item.height}
          draggable={false}
          loading="lazy"
        />
      </div>
      <span className="wp-card-title">{item.title}</span>
    </div>
  )
}

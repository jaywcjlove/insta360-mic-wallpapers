import { useEffect } from 'react'
import type { Wallpaper } from '../data/wallpapers'
import { wallpaperUrl } from '../data/wallpapers'

type Props = {
  wallpaper: Wallpaper | null
  onClose: () => void
}

export function WallpaperModal({ wallpaper, onClose }: Props) {
  useEffect(() => {
    if (!wallpaper) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [wallpaper, onClose])

  if (!wallpaper) return null

  const url = wallpaperUrl(wallpaper.file)
  const filename = `${wallpaper.id}-240x208.png`

  const download = async () => {
    try {
      const res = await fetch(url)
      const blob = await res.blob()
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = filename
      a.click()
      URL.revokeObjectURL(a.href)
    } catch {
      // Fallback: open in new tab
      window.open(url, '_blank')
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="modal-close" onClick={onClose} aria-label="关闭">
          ×
        </button>

        <div className="modal-preview">
          <div className="device-frame">
            <img src={url} alt={wallpaper.title} width={240} height={208} />
            <div className="device-buttons" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>

        <div className="modal-body">
          <h2 id="modal-title">{wallpaper.title}</h2>
          <p className="modal-meta">
            {wallpaper.width} × {wallpaper.height} · PNG · 6 色墨水屏优化
          </p>

          <div className="color-swatches" aria-label="使用色彩">
            {wallpaper.colors.map((c) => (
              <span
                key={c}
                className="swatch"
                style={{ background: c }}
                title={c}
              />
            ))}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-primary" onClick={download}>
              下载 PNG
            </button>
            <a className="btn btn-ghost" href={url} target="_blank" rel="noreferrer">
              新窗口打开
            </a>
          </div>

          <p className="modal-hint">
            在 Insta360 App → 自定义壁纸 中上传此图片即可使用。
            底部按键区域请勿放置关键信息。
          </p>
        </div>
      </div>
    </div>
  )
}

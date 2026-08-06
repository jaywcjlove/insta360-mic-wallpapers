import { useEffect, useMemo } from 'react'
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

  // Lock body scroll while open
  useEffect(() => {
    if (!wallpaper) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [wallpaper])

  const url = useMemo(
    () => (wallpaper ? wallpaperUrl(wallpaper.file) : ''),
    [wallpaper]
  )

  if (!wallpaper) return null

  // Clean download filename (no brackets / path)
  const downloadName = `${wallpaper.id.replace(/[^\w\u4e00-\u9fff-]+/g, '-')}-240x208.png`

  const download = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const blob = await res.blob()
      const objectUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = objectUrl
      a.download = downloadName
      a.rel = 'noopener'
      document.body.appendChild(a)
      a.click()
      a.remove()
      // Delay revoke so the browser can start the download
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1500)
    } catch {
      // Same-origin fallback: open the image (user can save)
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="presentation"
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
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
            {wallpaper.width} × {wallpaper.height} · PNG · {wallpaper.category}
          </p>

          <div className="modal-actions">
            <button type="button" className="btn btn-primary" onClick={download}>
              下载 PNG
            </button>
            <a
              className="btn btn-ghost"
              href={url}
              download={downloadName}
              target="_blank"
              rel="noreferrer"
            >
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

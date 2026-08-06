import { useCallback, useEffect, useRef, useState } from 'react'

export type PanState = {
  x: number
  y: number
  scale: number
}

type Options = {
  minScale?: number
  maxScale?: number
  initial?: Partial<PanState>
}

/**
 * Click-drag pan + pinch/wheel zoom for an infinite canvas.
 * Mirrors the interaction model of sites like thiings.co.
 */
export function usePanCanvas(opts: Options = {}) {
  const minScale = opts.minScale ?? 0.35
  const maxScale = opts.maxScale ?? 2.2
  const [pan, setPan] = useState<PanState>({
    x: opts.initial?.x ?? 0,
    y: opts.initial?.y ?? 0,
    scale: opts.initial?.scale ?? 1,
  })

  const dragging = useRef(false)
  const last = useRef({ x: 0, y: 0 })
  const moved = useRef(false)
  const panRef = useRef(pan)
  panRef.current = pan

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    // Only primary button / touch; ignore UI chrome
    if (e.button !== 0 && e.pointerType === 'mouse') return
    const t = e.target as HTMLElement
    if (t.closest('.topbar, .footer, .modal-backdrop, .guide-backdrop, .btn, .chip')) {
      return
    }
    dragging.current = true
    moved.current = false
    last.current = { x: e.clientX, y: e.clientY }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return
    const dx = e.clientX - last.current.x
    const dy = e.clientY - last.current.y
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) moved.current = true
    last.current = { x: e.clientX, y: e.clientY }
    setPan((p) => ({ ...p, x: p.x + dx, y: p.y + dy }))
  }, [])

  const onPointerUp = useCallback(() => {
    dragging.current = false
  }, [])

  const didDrag = useCallback(() => moved.current, [])

  const zoomAt = useCallback(
    (clientX: number, clientY: number, factor: number, rect: DOMRect) => {
      setPan((p) => {
        const next = Math.min(maxScale, Math.max(minScale, p.scale * factor))
        if (next === p.scale) return p
        // Keep point under cursor stable
        const ox = clientX - rect.left
        const oy = clientY - rect.top
        const wx = (ox - p.x) / p.scale
        const wy = (oy - p.y) / p.scale
        return {
          scale: next,
          x: ox - wx * next,
          y: oy - wy * next,
        }
      })
    },
    [minScale, maxScale]
  )

  // Wheel zoom (bind on container)
  useEffect(() => {
    const el = document.getElementById('infinite-canvas-root')
    if (!el) return

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const rect = el.getBoundingClientRect()
      const factor = e.deltaY > 0 ? 0.92 : 1.08
      zoomAt(e.clientX, e.clientY, factor, rect)
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [zoomAt])

  const reset = useCallback(() => {
    setPan({
      x: opts.initial?.x ?? 0,
      y: opts.initial?.y ?? 0,
      scale: opts.initial?.scale ?? 1,
    })
  }, [opts.initial?.x, opts.initial?.y, opts.initial?.scale])

  return {
    pan,
    setPan,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    didDrag,
    reset,
    zoomAt,
  }
}

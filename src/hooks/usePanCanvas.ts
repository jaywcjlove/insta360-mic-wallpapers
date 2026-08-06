import { useCallback, useEffect, useRef, useState } from 'react'

export type PanState = {
  x: number
  y: number
  scale: number
}

type Options = {
  initial?: Partial<PanState>
  /** Movement (px) before a press counts as pan, not click. */
  dragThreshold?: number
}

/**
 * Drag to pan + wheel to scroll (not zoom).
 * Click is preserved: pan only starts after the drag threshold.
 */
export function usePanCanvas(opts: Options = {}) {
  const threshold = opts.dragThreshold ?? 6
  const [pan, setPan] = useState<PanState>({
    x: opts.initial?.x ?? 0,
    y: opts.initial?.y ?? 0,
    scale: opts.initial?.scale ?? 1,
  })

  const pressing = useRef(false)
  const panning = useRef(false)
  const moved = useRef(false)
  const origin = useRef({ x: 0, y: 0 })
  const last = useRef({ x: 0, y: 0 })
  const pointerId = useRef<number | null>(null)

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return
    const t = e.target as HTMLElement
    if (t.closest('.topbar, .footer, .modal-backdrop, .guide-backdrop, .btn, .chip')) {
      return
    }
    // Don't capture yet — wait until real drag so clicks still work on cards
    pressing.current = true
    panning.current = false
    moved.current = false
    pointerId.current = e.pointerId
    origin.current = { x: e.clientX, y: e.clientY }
    last.current = { x: e.clientX, y: e.clientY }
  }, [])

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!pressing.current) return

      const dxFromOrigin = e.clientX - origin.current.x
      const dyFromOrigin = e.clientY - origin.current.y
      const dist = Math.hypot(dxFromOrigin, dyFromOrigin)

      if (!panning.current) {
        if (dist < threshold) return
        // Crossed threshold → start pan, capture for reliable tracking
        panning.current = true
        moved.current = true
        try {
          ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
        } catch {
          /* ignore */
        }
      }

      const dx = e.clientX - last.current.x
      const dy = e.clientY - last.current.y
      last.current = { x: e.clientX, y: e.clientY }
      setPan((p) => ({ ...p, x: p.x + dx, y: p.y + dy }))
    },
    [threshold]
  )

  const endPress = useCallback((e?: React.PointerEvent) => {
    if (
      e &&
      panning.current &&
      pointerId.current != null &&
      (e.currentTarget as HTMLElement).hasPointerCapture?.(pointerId.current)
    ) {
      try {
        ;(e.currentTarget as HTMLElement).releasePointerCapture(pointerId.current)
      } catch {
        /* ignore */
      }
    }
    pressing.current = false
    panning.current = false
    pointerId.current = null
  }, [])

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      endPress(e)
    },
    [endPress]
  )

  const onPointerCancel = useCallback(
    (e: React.PointerEvent) => {
      moved.current = true // cancel pending click
      endPress(e)
    },
    [endPress]
  )

  /** True if the last gesture was a pan (click handlers should no-op). */
  const didDrag = useCallback(() => moved.current, [])

  // Wheel = scroll pan
  useEffect(() => {
    const el = document.getElementById('infinite-canvas-root')
    if (!el) return

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()

      let { deltaX, deltaY } = e
      if (e.deltaMode === 1) {
        deltaX *= 16
        deltaY *= 16
      } else if (e.deltaMode === 2) {
        deltaX *= el.clientWidth
        deltaY *= el.clientHeight
      }

      if (e.shiftKey && deltaX === 0) {
        deltaX = deltaY
        deltaY = 0
      }

      setPan((p) => ({
        ...p,
        x: p.x - deltaX,
        y: p.y - deltaY,
      }))
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  return {
    pan,
    setPan,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    didDrag,
  }
}

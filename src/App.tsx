import { useCallback, useMemo, useRef, useState } from 'react'
import { Header } from './components/Header'
import { InfiniteCanvas } from './components/InfiniteCanvas'
import { GuidePanel } from './components/GuidePanel'
import { WallpaperModal } from './components/WallpaperModal'
import {
  CATEGORIES,
  wallpapers as allWallpapers,
  type WallpaperItem,
} from './data/wallpapers'
import './App.css'

function App() {
  const [category, setCategory] = useState('all')
  const [selected, setSelected] = useState<WallpaperItem | null>(null)
  const [guideOpen, setGuideOpen] = useState(false)
  const resetViewRef = useRef<(() => void) | null>(null)

  const filtered = useMemo(() => {
    if (category === 'all') return allWallpapers
    return allWallpapers.filter((w) => w.category === category)
  }, [category])

  const registerReset = useCallback((fn: () => void) => {
    resetViewRef.current = fn
  }, [])

  return (
    <div className="app">
      <Header
        count={filtered.length}
        category={category}
        onCategory={setCategory}
        categories={CATEGORIES}
        onOpenGuide={() => setGuideOpen(true)}
        onResetView={() => resetViewRef.current?.()}
      />

      <InfiniteCanvas
        wallpapers={filtered}
        onSelect={setSelected}
        onRegisterReset={registerReset}
      />

      <WallpaperModal wallpaper={selected} onClose={() => setSelected(null)} />
      <GuidePanel open={guideOpen} onClose={() => setGuideOpen(false)} />

      <footer className="footer">
        <span>Insta360 Mic Pro · 1.22″ 6-Color E-Ink · 240×208</span>
        <a
          href="https://github.com/jaywcjlove/insta360-mic-wallpapers"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
      </footer>
    </div>
  )
}

export default App

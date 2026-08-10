type Props = {
  count: number
  category: string
  onCategory: (id: string) => void
  categories: readonly { id: string; label: string }[]
  onOpenGuide: () => void
}

export function Header({
  count,
  category,
  onCategory,
  categories,
  onOpenGuide,
}: Props) {
  return (
    <header className="topbar">
      <div className="topbar-brand">
        <div className="logo-mark" aria-hidden="true">
          <span className="logo-dot red" />
          <span className="logo-dot yellow" />
          <span className="logo-dot blue" />
          <span className="logo-dot green" />
        </div>
        <div>
          <h1>Mic Pro Wallpapers</h1>
          <p className="tagline">Insta360 水墨屏壁纸 · {count} 张</p>
        </div>
      </div>

      <nav className="category-nav" aria-label="分类">
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            className={category === c.id ? 'chip active' : 'chip'}
            onClick={() => onCategory(c.id)}
          >
            {c.label}
          </button>
        ))}
      </nav>

      <div className="topbar-actions">
        <a href="https://github.com/jaywcjlove/insta360-mic-wallpapers/upload/main/public/wallpapers" className="btn btn-primary btn-sm" target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" style={{ fontSize: '1.3em' }}>
            <path d="M0 0h24v24H0z" stroke="none"/>
            <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M7 9l5-5 5 5m-5-5v12"/>
          </svg>
          提交壁纸
        </a>
        <button type="button" className="btn btn-primary btn-sm" onClick={onOpenGuide}>
          设计指南
        </button>
        <a href="https://github.com/jaywcjlove/insta360-mic-wallpapers/" className="btn btn-primary btn-sm" target="_blank" rel="noopener noreferrer" style={{ fontSize: '1.3em' }}>
          <svg viewBox="0 0 1024 1024" height="1em" width="1em">
            <path fill="currentColor" d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 212.9a127.5 127.5 0 0 1 38.1 91v112.5c.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z"/>
          </svg>
        </a>
      </div>
    </header>
  )
}

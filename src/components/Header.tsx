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
        <button type="button" className="btn btn-primary btn-sm" onClick={onOpenGuide}>
          设计指南
        </button>
      </div>
    </header>
  )
}

type Props = {
  open: boolean
  onClose: () => void
}

export function GuidePanel({ open, onClose }: Props) {
  if (!open) return null

  return (
    <div className="guide-backdrop" onClick={onClose} role="presentation">
      <aside
        className="guide-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="guide-header">
          <h2 id="guide-title">水墨屏设计指南</h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="关闭">
            ×
          </button>
        </header>

        <div className="guide-body">
          <section>
            <h3>硬件参数</h3>
            <ul>
              <li>
                <strong>屏幕</strong>：1.22 英寸 6 色电子墨水屏
              </li>
              <li>
                <strong>色彩</strong>：黑 · 白 · 红 · 黄 · 蓝 · 绿
              </li>
              <li>
                <strong>分辨率</strong>：240 × 208
              </li>
              <li>
                <strong>形态</strong>：圆形显示区域，底部为物理按键图标区
              </li>
            </ul>
          </section>

          <section>
            <h3>图片格式</h3>
            <ul>
              <li>支持 <strong>JPG / PNG</strong> 静态图</li>
              <li>官方不强制尺寸；App 会自动缩放裁切</li>
              <li>
                ✅ 推荐画布：<strong>240 × 208</strong>，主体居中于圆形区域
              </li>
            </ul>
          </section>

          <section>
            <h3>色彩与设计</h3>
            <ul>
              <li>仅能显示 6 种固定墨水色，无渐变与丰富过渡</li>
              <li>复杂照片会严重失真；人像、渐变易糊、锯齿明显</li>
              <li>
                <strong>高对比度</strong>图案、Logo、简约图形效果最佳
              </li>
              <li>
                不要把关键图文放在画面<strong>最底部</strong>（按键标识遮挡）
              </li>
              <li>
                墨水屏有残影：尽量避免大面积纯色长期常驻
              </li>
            </ul>
          </section>

          <section>
            <h3>本站色板</h3>
            <div className="palette">
              {[
                ['#000000', '黑'],
                ['#FFFFFF', '白'],
                ['#E53935', '红'],
                ['#FDD835', '黄'],
                ['#1E88E5', '蓝'],
                ['#43A047', '绿'],
              ].map(([hex, name]) => (
                <div key={hex} className="palette-item">
                  <span className="swatch lg" style={{ background: hex }} />
                  <span>{name}</span>
                  <code>{hex}</code>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3>如何使用</h3>
            <ol>
              <li>在本站下载 PNG 壁纸</li>
              <li>打开 Insta360 App，连接 Mic Pro 发射器</li>
              <li>进入「自定义壁纸」，从相册上传图片</li>
            </ol>
          </section>

          <section>
            <h3>贡献壁纸命名</h3>
            <p>
              将图片放入 <code>public/wallpapers/</code>，文件名格式：
            </p>
            <p>
              <code>名称[分类].png</code>
            </p>
            <p>例如 <code>bauhaus-2[图案].png</code> → 名称「bauhaus 2」、分类「图案」。</p>
          </section>
        </div>
      </aside>
    </div>
  )
}

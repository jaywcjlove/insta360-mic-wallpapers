# Insta360 Mic Pro 水墨屏壁纸

面向 [Insta360 Mic Pro](https://www.insta360.com/product/insta360-mic-pro) 发射器 **1.22″ 6 色电子墨水屏** 的壁纸下载站。

在线预览（GitHub Pages）：部署后访问  
`https://jaywcjlove.github.io/insta360-mic-wallpapers/`

## 功能

- **无边际画布**：壁纸铺在可拖拽画布上（参考 [thiings.co](https://www.thiings.co/things)）
- **拖拽平移 / 滚轮缩放 / 点击下载**
- **36 张** 按 6 色墨水屏优化的 240×208 PNG
- **设计指南**：硬件参数、构图与用色提醒

## 屏幕规格

| 项目 | 参数 |
|------|------|
| 屏幕 | 1.22 英寸 6 色电子墨水（黑、白、红、黄、蓝、绿） |
| 分辨率 | 240 × 208 |
| 形态 | 圆形可视区，底部为物理按键图标区 |
| 格式 | JPG / PNG（本站提供 PNG） |

### 设计注意

- 仅 6 种固定墨水色，无真实渐变；复杂照片会失真
- 高对比度 Logo、简约图形效果最好
- **关键内容勿放最底部**（按键标识遮挡）
- 墨水屏有残影，避免大面积纯色长期常驻

## 本地开发

```bash
npm install
npm run generate   # 重新生成 public/wallpapers 与目录 JSON
npm run dev
```

## 构建与发布到 gh-pages

```bash
npm run build      # 输出到 dist/
npm run deploy     # 推送到 gh-pages 分支
```

`deploy` 使用 [gh-pages](https://www.npmjs.com/package/gh-pages)，将 `dist` 发布到仓库的 `gh-pages` 分支。  
请在 GitHub 仓库 **Settings → Pages** 中选择 **Deploy from a branch → gh-pages / (root)**。

`vite.config.ts` 中 `base` 已设为 `/insta360-mic-wallpapers/`，与仓库名一致。若 fork 到其他仓库名，请同步修改 `base`。

## 项目结构

```
public/wallpapers/     # 240×208 PNG
scripts/generate-wallpapers.mjs
src/
  components/          # 画布、卡片、弹窗、指南
  data/wallpapers.json # 壁纸元数据（由 generate 生成）
  hooks/usePanCanvas.ts
```

## 如何把壁纸装到 Mic Pro

1. 下载本站 PNG
2. 用 Insta360 App 连接发射器
3. 进入 **自定义壁纸**，从相册上传

## License

壁纸与站点代码可自由使用；Insta360 为注册商标，与本站无官方关联。

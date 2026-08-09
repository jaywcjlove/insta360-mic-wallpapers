# Insta360 Mic Pro 水墨屏壁纸

面向 [Insta360 Mic Pro](https://www.insta360.com/product/insta360-mic-pro) 发射器 **1.22″ 6 色电子墨水屏** 的壁纸下载站。

在线预览：https://jaywcjlove.github.io/insta360-mic-wallpapers/

## 功能

- **无边际画布**：壁纸铺满可拖拽 / 滚轮滚动的画布
- **点击下载** PNG（240×208、6 色墨水优化）
- **设计指南**：硬件参数、构图与用色提醒

## 添加壁纸

把图片放进 `public/wallpapers/`，按文件名自动解析 **名称** 与 **分类**：

```
名称[分类].png
```

示例：

| 文件名 | 显示名称 | 分类 |
|--------|----------|------|
| `bauhaus-2[图案].png` | bauhaus 2 | 图案 |
| `我的Logo[头像].png` | 我的Logo | 头像 |
| `plain.png` | plain | 其他 |

支持扩展名：`png` / `jpg`。推荐尺寸 **240×208**。

开发时新增/删除文件后会自动刷新列表，无需手写 JSON。

## 屏幕规格

| 项目 | 参数 |
|------|------|
| 屏幕 | 1.22 英寸 6 色电子墨水（黑、白、红、黄、蓝、绿） |
| 分辨率 | 240 × 208 |
| 形态 | 圆形可视区，底部为物理按键图标区 |
| 格式 | JPG / PNG |

### 设计注意

- 仅 6 种固定墨水色，无真实渐变；复杂照片会失真
- 高对比度 Logo、简约图形效果最好
- **关键内容勿放最底部**（按键标识遮挡）
- 墨水屏有残影，避免大面积纯色长期常驻

## 本地开发

```bash
npm install
npm run dev
```

## 构建与发布

```bash
npm run build      # 输出到 dist/
npm run deploy     # 推送到 gh-pages 分支
```

`vite.config.ts` 中 `base` 为 `./`，构建产物使用相对资源路径。

## 如何把壁纸装到 Mic Pro

1. 下载本站 PNG  
2. 用 Insta360 App 连接发射器  
3. 进入 **自定义壁纸**，从相册上传  

## License

壁纸与站点代码可自由使用；Insta360 为注册商标，与本站无官方关联。

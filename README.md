Insta360 Mic Pro E-Ink Screen Wallpapers
===

[![Chinese](https://jaywcjlove.github.io/sb/lang/chinese.svg)](./README-zh.md)
[![Buy me a coffee](https://img.shields.io/badge/Buy_Me_a_Coffee-ffdd00?logo=buy-me-a-coffee&logoColor=black)](https://jaywcjlove.github.io/#/sponsor)
[![Follow On X](https://img.shields.io/badge/Follow%20on%20X-333333?logo=x&logoColor=white)](https://x.com/jaywcjlove)


![](https://github.com/user-attachments/assets/3d2d1025-1a41-4479-a52a-84552f945040)

A wallpaper download site for the [Insta360 Mic Pro](https://www.insta360.com/product/insta360-mic-pro) wireless microphone with a **1.22-inch 6-color e-ink display**.

Live preview: https://jaywcjlove.github.io/insta360-mic-wallpapers/

## Features

- **Infinite canvas**: wallpapers fill a draggable / scrollable canvas
- **Click to download** PNG files (240x208, optimized for 6-color e-ink)
- **Design guide**: hardware specs, composition, and color usage tips

## Add Wallpapers

Put images into `public/wallpapers/`. The app automatically parses the **name** and **category** from the filename:

```
name[category].png
```

Examples:

| Filename | Display Name | Category |
|--------|----------|------|
| `bauhaus-2[Pattern].png` | bauhaus 2 | Pattern |
| `MyLogo[Avatar].png` | MyLogo | Avatar |
| `plain.png` | plain | Other |

Supported extensions: `png` / `jpg`. Recommended size: **240x208**.

When you add or remove files during development, the list refreshes automatically. No manual JSON is needed.

## Screen Specifications

| Item | Spec |
|------|------|
| Display | 1.22-inch 6-color e-ink (black, white, red, yellow, blue, green) |
| Resolution | 240 x 208 |
| Shape | Circular visible area with a physical button icon area at the bottom |
| Format | JPG / PNG |

### Design Notes

- Only 6 fixed ink colors are available, with no true gradients; complex photos may lose detail.
- High-contrast logos and simple graphics work best.
- **Do not place key content at the bottom** (it may be blocked by button indicators).
- E-ink ghosting can occur, so avoid leaving large solid-color areas on screen for long periods.

## Local Development

```bash
npm install
npm run dev
```

## Build and Deploy

```bash
npm run build      # output to dist/
npm run deploy     # push to gh-pages branch
```

In `vite.config.ts`, `base` is set to `./`, so the build output uses relative asset paths.

## How to Install Wallpapers on Mic Pro

1. Download a PNG from this site.
2. Connect the transmitter using the Insta360 app.
3. Go to **Custom Wallpaper** and upload from your photo library.

## License

Wallpapers and site code are free to use. Insta360 is a registered trademark and this project is not officially affiliated.

# Remotion Adobe Stock Motion Graphics Factory 🎬🚀

Programmatic motion graphics generation pipeline built with **Remotion**, **React**, and **TypeScript** designed to mass-produce 4K commercial stock video assets for **Adobe Stock Contributor**.

![Preview Frame](out/test_preview.png)

---

## 🌟 Key Highlights

- **Adheres to 100% of Adobe Stock Technical Video Guidelines**:
  - Native **3840 x 2160 (UHD 4K)** resolution at 30/60 fps.
  - **Zero Audio Track** (`--audio-codec=none`) to prevent moderation rejection.
  - High-profile H.264 video encoding at visually lossless quality (CRF 16).
- **Mathematical Seamless Looping**: Built using periodic circular trigonometric math ($\sin$/$\cos$), ensuring frame 0 and frame $N$ match with $0.00\%$ deviation for stutter-free looping.
- **Parametric Variations (1 Component $\rightarrow$ Multiple Assets)**: Generate multiple color themes (Cyan Blue, Gold Luxury, Matrix Green, Synthwave Magenta) from a single master React component.
- **Automated Adobe Stock CSV Metadata Generator**: Automatically generates upload-ready CSV files containing titles (<70 characters), prioritized first-10 search keywords, and category IDs.
- **Cloud CI/CD with GitHub Actions**: Offload 4K video rendering to GitHub Actions without consuming local CPU/GPU resources.

---

## 📁 Project Structure

```
├── .github/workflows/
│   └── render-stock.yml       # Cloud render pipeline via GitHub Actions
├── scripts/
│   ├── generate-csv.mjs       # Adobe Stock bulk metadata CSV exporter
│   └── render-batch.mjs       # Automated batch renderer across all presets
├── src/
│   ├── compositions/
│   │   └── CyberGrid.tsx      # Top-selling 4K perspective cyber grid loop
│   ├── Root.tsx               # Remotion composition registry
│   ├── index.ts               # Remotion root entrypoint
│   └── presets.ts             # Color themes, props, and Adobe Stock metadata
├── remotion.config.ts         # Global render configuration
├── package.json
└── tsconfig.json
```

---

## 🚀 Quickstart Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Launch Remotion Studio (Visual Preview)
To interactively preview, scrub timelines, and tweak colors in real time:
```bash
npm start
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 3. Render All Presets & Generate Metadata CSV
To render all 4K video variations and produce the companion metadata CSV:
```bash
npm run render:all
```
All `.mp4` video files and `adobe_stock_metadata.csv` will be output into the `out/` directory.

### 4. Uploading to Adobe Stock
1. Log in to the [Adobe Stock Contributor Portal](https://contributor.stock.adobe.com/).
2. Drag and drop the rendered `.mp4` files from the `out/` folder into the Upload section.
3. Upload `out/adobe_stock_metadata.csv` to auto-fill titles, categories, and ordered keywords for all clips in 1 click.

---

## ☁️ GitHub Actions Cloud Rendering

You can trigger a cloud render directly on GitHub:
1. Go to your repository's **Actions** tab.
2. Select the **Render Adobe Stock Videos** workflow.
3. Click **Run workflow**.
4. Once completed, download the rendered video pack artifact.

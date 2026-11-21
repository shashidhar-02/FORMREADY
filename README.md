# FormReady-https://formready-gdv4g2xn7-shashidhars-projects-fc7b2114.vercel.app/

> **“Your form rejected the file? Fix it here.”**  
> No signup. No subscription. No watermark. No upload. Your files stay strictly in your browser.

FormReady is an open-source, browser-first file preparation utility designed for students, job applicants, and citizens whose photos, signatures, or documents are rejected by online portals due to strict file size limits, dimension mismatches, or packaging issues.

---

## 🌟 Key Features

- **Exact Maximum Target-Size Compression**: Binary-search quality adjustment with progressive dimension downscaling and a 3–4% safety margin. A 50 KB target yields ~48.8 KB—never 50.2 KB.
- **Dedicated Signature Fixer**: Automatically detects and trims excessive white paper margins from phone camera photos, enhances ink stroke contrast, and fits 10 KB or 20 KB portal thresholds.
- **Passport & Application Photo Maker**: Crop to 35×45mm, 1:1 square, or 4:5 ratios with an interactive face alignment guide and instant 8-photo printable 4×6 sheet generation.
- **Full In-Browser PDF Suite**: Convert multiple JPG/PNG scans to a single PDF with custom page order and rotation, merge PDFs, extract/split page ranges, and compress PDF streams using `pdf-lib`.
- **Application Presets Directory**: Verified requirements for UPSC, SSC, IBPS, NEET UG, JEE Main, GATE, US Visa DS-160, and Indian Passport Seva with source verification notices.
- **Multilingual Support**: Built-in instant switching between English, Hindi (हिन्दी), and Telugu (తెలుగు).
- **100% Client-Side Privacy**: Operates entirely within the visitor's browser using HTML5 Canvas, ImageBitmap, and WebAssembly. Zero backend API routes, zero server uploads, zero trackers.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (tested on Node v20 and v24)
- npm or pnpm

### Installation

```bash
git clone https://github.com/your-username/formready.git
cd formready
npm install
```

### Local Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running Automated Tests

```bash
# Run unit & network privacy audit tests
npm test

# Run Playwright E2E tests
npm run test:e2e
```

### Production Build & Static Export

FormReady is configured with `output: "export"` for serverless, zero-backend deployment directly to Vercel, Cloudflare Pages, or GitHub Pages:

```bash
npm run build
```

The resulting static export is written to `out/`.

---

## 🔒 Privacy & Security Model

FormReady has **zero file-processing API endpoints**.

To verify:

1. Open DevTools (`F12`) -> **Network** tab.
2. Compress or convert any file.
3. Observe that zero network payloads or image bytes leave your machine.
4. The application continues functioning in Airplane mode or offline.

For further details, consult [PRIVACY.md](file:///d:/formready/PRIVACY.md) and [ARCHITECTURE.md](file:///d:/formready/ARCHITECTURE.md).

---

## 📜 Documentation

- [System Architecture](file:///d:/formready/ARCHITECTURE.md)
- [Privacy Model](file:///d:/formready/PRIVACY.md)
- [Contributing Guide](file:///d:/formready/CONTRIBUTING.md)
- [Security Policy](file:///d:/formready/SECURITY.md)
- [Changelog](file:///d:/formready/CHANGELOG.md)

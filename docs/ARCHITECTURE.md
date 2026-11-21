# FormReady — Architecture & Engineering Documentation

> **Version**: 1.0.0 · **Last Updated**: November 2026  
> **Status**: Production · **License**: MIT

---

## Table of Contents

- [High-Level Design (HLD)](#high-level-design-hld)
- [Low-Level Design (LLD)](#low-level-design-lld)
- [Security Architecture](#security-architecture)
- [Performance & Caching Strategy](#performance--caching-strategy)
- [Engineering Practices](#engineering-practices)
- [DevSecOps Pipeline](#devsecops-pipeline)

---

## High-Level Design (HLD)

### System Context Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER'S DEVICE                            │
│                                                                 │
│  ┌────────────┐   ┌──────────────────────────────────────────┐  │
│  │  Browser   │   │          FormReady Application           │  │
│  │  (Chrome/  │◄──│                                          │  │
│  │  Firefox/  │   │  ┌──────────┐  ┌───────────────────────┐ │  │
│  │  Safari/   │   │  │  React   │  │  Processing Engine    │ │  │
│  │  Edge)     │   │  │  UI      │  │  ┌─────────────────┐  │ │  │
│  │            │   │  │  Layer   │  │  │ Canvas API      │  │ │  │
│  │            │   │  │          │  │  │ Blob API        │  │ │  │
│  │            │   │  │          │  │  │ pdf-lib (WASM)  │  │ │  │
│  │            │   │  │          │  │  │ ImageBitmap     │  │ │  │
│  │            │   │  │          │  │  │ File/FileReader │  │ │  │
│  │            │   │  │          │  │  └─────────────────┘  │ │  │
│  │            │   │  └──────────┘  └───────────────────────┘ │  │
│  └────────────┘   └──────────────────────────────────────────┘  │
│                                                                 │
│  🔒 ZERO DATA LEAVES THIS BOX                                   │
└─────────────────────────────────────────────────────────────────┘

                        ▲ Initial page load only
                        │ (HTML + JS + CSS)
                        │
            ┌───────────┴──────────────┐
            │   Vercel CDN (Edge)      │
            │   Static Export Host     │
            │   Security Headers       │
            │   HSTS + CSP + CORP      │
            │   Cache-Control          │
            └──────────────────────────┘
```

### Core Architecture Principles

| Principle                   | Implementation                                                                                                             |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Zero-Upload Privacy**     | All file processing uses browser-native APIs (Canvas, Blob, File, pdf-lib). No files ever leave the client device.         |
| **Static-First Delivery**   | `output: "export"` generates pre-rendered HTML. No server functions, no API routes, no SSR.                                |
| **Offline-Capable**         | Service Worker caches all static assets. Processing works without internet after initial load.                             |
| **Defense-in-Depth**        | CSP, HSTS, X-Frame-Options, CORP, COEP, Permissions-Policy via Vercel headers.                                             |
| **Progressive Enhancement** | Core compression works on any browser with Canvas support. Advanced features (clipboard paste, camera) degrade gracefully. |

### Technology Stack

| Layer            | Technology                              | Purpose                                   |
| ---------------- | --------------------------------------- | ----------------------------------------- |
| Framework        | Next.js 16 (App Router)                 | Static site generation, routing, metadata |
| UI               | React 19 + TypeScript                   | Type-safe component architecture          |
| Styling          | Tailwind CSS v4 + PostCSS               | Utility-first CSS, dark mode, responsive  |
| Image Processing | HTML5 Canvas + createImageBitmap        | Decode, resize, compress, format-convert  |
| PDF Processing   | pdf-lib (browser WASM)                  | Merge, split, reorder, compress PDFs      |
| Icons            | Lucide React                            | Consistent, tree-shakable icon library    |
| Testing          | Vitest + jsdom                          | Unit tests, privacy audits                |
| E2E Testing      | Playwright                              | Browser automation tests                  |
| Hosting          | Vercel (Static Export)                  | Edge CDN, security headers, auto-deploy   |
| CI/CD            | GitHub Actions                          | Type check, test, build, security scan    |
| Code Quality     | Husky + lint-staged + Prettier + ESLint | Pre-commit hooks, formatting, linting     |

---

## Low-Level Design (LLD)

### Component Architecture

```
src/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout (ThemeProvider, LanguageProvider, Header, Footer)
│   ├── page.tsx                  # Landing page (hero, compressor tool, trust strip, FAQ)
│   ├── compress-image/           # Generic compressor page
│   ├── compress-image-to-{N}kb/  # SEO-targeted compression pages (10kb–1mb)
│   ├── resize-signature/         # Signature fixer page
│   ├── resize-photo/             # Passport/document photo page
│   ├── jpg-to-pdf/               # Images → PDF converter page
│   ├── merge-pdf/                # PDF merge/split page
│   ├── split-pdf/                # PDF page extraction
│   ├── compress-pdf/             # PDF compression page
│   ├── convert-image/            # Format conversion page
│   ├── presets/                   # Exam portal presets browser
│   ├── privacy/                  # Privacy guarantee page
│   ├── about/                    # Architecture & about page
│   ├── robots.ts                 # Dynamic robots.txt generation
│   └── sitemap.ts                # Dynamic sitemap.xml generation
│
├── components/                   # Reusable client components
│   ├── GlobalSearch.tsx          # Command palette (Ctrl+K) search
│   ├── Header.tsx                # Navigation, theme toggle, language selector
│   ├── Footer.tsx                # Sitemap links, privacy badge, clear data
│   ├── DropZone.tsx              # Drag-and-drop + file picker + clipboard paste
│   ├── ImageCompressorTool.tsx   # Binary-search compression engine UI
│   ├── SignatureFixerTool.tsx    # Auto-trim, contrast boost, ink enhancement
│   ├── PassportPhotoTool.tsx     # Aspect ratio crop, face guide overlay
│   ├── JpgToPdfTool.tsx          # Multi-image → PDF bundler
│   ├── PdfMergeSplitTool.tsx     # PDF merge/split/reorder
│   ├── PdfCompressTool.tsx       # PDF size optimization
│   ├── ImageResizeTool.tsx       # Exact dimension resize
│   ├── ImageConvertTool.tsx      # Format conversion (JPG↔PNG↔WebP)
│   ├── PresetSelector.tsx        # Exam portal preset cards
│   ├── ValidationBadge.tsx       # Pass/fail verification display
│   ├── PrivacyModal.tsx          # Privacy explanation modal
│   ├── SeoContentSection.tsx     # SEO content wrapper
│   └── SizeCompressorPage.tsx    # Template for /compress-image-to-{N}kb pages
│
├── context/                      # React Context providers
│   ├── ThemeContext.tsx           # System/dark/light theme + prefers-color-scheme listener
│   └── LanguageContext.tsx        # English/Hindi/Telugu runtime language switching
│
├── lib/                          # Pure logic (no React)
│   ├── image-compressor.ts       # Binary-search JPEG/WebP quality compression engine
│   ├── compressor-orchestrator.ts# High-level orchestration for multi-step compression
│   ├── signature-detector.ts     # Ink detection, whitespace trimming, contrast boost
│   ├── passport-sheet.ts         # 8-photo print sheet generator
│   ├── pdf-service.ts            # pdf-lib wrapper for merge/split/compress
│   ├── constants.ts              # Tool routes, portal presets, SEO metadata
│   └── translations.ts           # i18n dictionary (en, hi, te)
│
└── types/
    └── index.ts                  # TypeScript interfaces and type definitions
```

### Image Compression Algorithm (Binary Search)

```
function compressImageToTarget(image, targetMaxBytes, format):

    // Phase 1: Dimension reduction if image is very large
    if image.width * image.height > 4_000_000:
        scale = sqrt(4_000_000 / (image.width * image.height))
        image = resize(image, scale)

    // Phase 2: Binary search on quality parameter
    low = 0.05
    high = 0.95
    bestBlob = null
    safeTarget = targetMaxBytes * 0.96  // 4% safety margin

    for iteration in 1..20:
        mid = (low + high) / 2
        blob = canvas.toBlob(format, quality=mid)

        if blob.size <= safeTarget:
            bestBlob = blob
            low = mid   // try higher quality
        else:
            high = mid  // try lower quality

        if abs(blob.size - safeTarget) / safeTarget < 0.02:
            break  // within 2% tolerance

    // Phase 3: If quality floor reached and still too large, reduce dimensions
    if bestBlob is null or bestBlob.size > targetMaxBytes:
        reduce dimensions by 10%
        recurse

    // Phase 4: Final verification
    assert bestBlob.size <= targetMaxBytes
    return { blob: bestBlob, metadata: { size, width, height, quality, format } }
```

### Data Flow: File Upload → Validated Download

```
sequenceDiagram
    participant U as User
    participant DZ as DropZone
    participant CT as CompressorTool
    participant IC as ImageCompressor
    participant CV as Canvas API
    participant VB as ValidationBadge

    U->>DZ: Drop/paste/select file
    DZ->>CT: onFileSelect(File)
    CT->>IC: loadImageElement(File)
    IC->>CV: createImageBitmap(File)
    CV-->>IC: ImageBitmap
    IC-->>CT: HTMLImageElement

    U->>CT: Set target (50 KB, JPG, 600×400)
    U->>CT: Click "Compress & Validate"

    CT->>IC: compressImageToTarget(img, options)

    loop Binary Search (max 20 iterations)
        IC->>CV: canvas.toBlob(format, quality)
        CV-->>IC: Blob (actual bytes)
        IC->>IC: Compare blob.size vs target
        IC->>IC: Adjust quality bounds
    end

    IC-->>CT: CompressionResult { blob, size, quality, dims }
    CT->>CT: validateOutput(result, requirements)
    CT->>VB: Display validation report

    alt All checks pass
        VB-->>U: ✓ Ready for Portal Submission
        CT-->>U: 🎉 Confetti + Download button
    else Validation warning
        VB-->>U: ⚠ Check Requirements
    end

    U->>CT: Click Download
    CT->>CT: URL.createObjectURL(blob)
    CT-->>U: Browser downloads file
```

---

## Security Architecture

### Zero-Trust File Processing Model

```
┌──────────────────────────────────────────────────────────────┐
│                    TRUST BOUNDARY                            │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                 User's Browser                        │  │
│  │                                                        │  │
│  │  File Input ──► ArrayBuffer ──► Canvas ──► Blob ──► DL │  │
│  │                                                        │  │
│  │  ❌ No fetch() to external origins                     │  │
│  │  ❌ No XMLHttpRequest                                  │  │
│  │  ❌ No navigator.sendBeacon                            │  │
│  │  ❌ No WebSocket connections                           │  │
│  │  ❌ No third-party scripts                             │  │
│  │  ❌ No cookies / tracking pixels                       │  │
│  │  ❌ No server-side processing                          │  │
│  │                                                        │  │
│  │  ✅ localStorage (theme/language preferences only)     │  │
│  │  ✅ Service Worker (offline caching only)              │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Defense Layers

| Layer             | Control                | Implementation                                      |
| ----------------- | ---------------------- | --------------------------------------------------- |
| **Transport**     | HSTS Preload           | `max-age=63072000; includeSubDomains; preload`      |
| **Content**       | CSP                    | `default-src 'self'`; inline scripts for theme only |
| **Framing**       | X-Frame-Options        | `DENY` — prevents clickjacking                      |
| **MIME**          | X-Content-Type-Options | `nosniff` — prevents MIME confusion                 |
| **Isolation**     | COOP/CORP/COEP         | Same-origin isolation for SharedArrayBuffer         |
| **Permissions**   | Permissions-Policy     | Camera (self only), no mic/geo/payment              |
| **Referrer**      | Referrer-Policy        | `strict-origin-when-cross-origin`                   |
| **Dependencies**  | npm audit              | Weekly automated CVE scanning                       |
| **Secrets**       | Gitleaks               | Pre-push secret leak detection                      |
| **SAST**          | CodeQL                 | Weekly static analysis for JS/TS vulnerabilities    |
| **Privacy Audit** | Vitest                 | Automated tests verify zero-upload architecture     |

---

## Performance & Caching Strategy

### Caching Tiers (Google-style Multi-Layer)

```
Request ──► Service Worker Cache (instant, offline)
              │
              ├── Cache Hit ──► Serve from SW cache (0ms latency)
              │
              └── Cache Miss ──► Vercel CDN Edge (< 50ms)
                                   │
                                   ├── Edge Hit ──► Serve from edge POP
                                   │
                                   └── Edge Miss ──► Origin (static files)
```

| Asset Type                           | Cache Strategy           | TTL                      | Rationale                              |
| ------------------------------------ | ------------------------ | ------------------------ | -------------------------------------- |
| `_next/static/*` (hashed JS/CSS)     | `immutable`              | 1 year                   | Content-addressed, never changes       |
| Static assets (images, fonts, icons) | `stale-while-revalidate` | 1 day + 7 day stale      | Balance freshness and speed            |
| HTML pages                           | `no-cache`               | Revalidate on each visit | Vercel handles ISR/static revalidation |
| Service Worker                       | `no-cache`               | Always fresh             | Must update to bust old caches         |

### Core Web Vitals Targets

| Metric                              | Target  | Strategy                                                         |
| ----------------------------------- | ------- | ---------------------------------------------------------------- |
| **LCP** (Largest Contentful Paint)  | < 1.5s  | Pre-rendered HTML, font preload, critical CSS inlined by Next.js |
| **FID** (First Input Delay)         | < 50ms  | No heavy JS on main thread; compression runs via Canvas (async)  |
| **CLS** (Cumulative Layout Shift)   | < 0.05  | Fixed dimensions on containers, font-display: swap               |
| **TTFB** (Time to First Byte)       | < 100ms | Vercel edge CDN, static export, no SSR computation               |
| **INP** (Interaction to Next Paint) | < 100ms | React 19 concurrent features, useTransition for heavy UI updates |

### Offline Support

The Service Worker (`public/sw.js`) implements:

1. **Install**: Pre-cache the app shell (HTML, CSS, JS bundles)
2. **Activate**: Clean up old versioned caches
3. **Fetch**: Cache-first for static assets, network-first for navigation

---

## Engineering Practices

### Pre-commit Quality Gate

```
git commit
    │
    ▼
┌─────────────────────┐
│  Husky Pre-commit    │
│                     │
│  1. lint-staged     │
│     ├── Prettier    │  ← Format *.ts, *.tsx, *.json, *.md, *.css
│     └── ESLint      │  ← Fix linting issues in *.ts, *.tsx
│                     │
│  2. tsc --noEmit    │  ← Full TypeScript type check
│                     │
│  ❌ Reject if any   │
│     step fails      │
└─────────────────────┘
    │
    ▼
  Commit accepted
```

### CI/CD Pipeline

```
Push to main / PR
    │
    ▼
┌───────────────────────────────────────────────────────┐
│                 GitHub Actions CI                      │
│                                                       │
│  ┌─────────────┐  ┌──────────┐  ┌──────────────────┐ │
│  │ Quality Gate │  │ Unit     │  │ Security Audit   │ │
│  │             │  │ Tests    │  │                  │ │
│  │ • Prettier  │  │          │  │ • npm audit      │ │
│  │ • ESLint    │  │ • Vitest │  │ • Gitleaks       │ │
│  │ • tsc       │  │ • 19     │  │ • CodeQL         │ │
│  │             │  │   tests  │  │                  │ │
│  └──────┬──────┘  └────┬─────┘  └────────┬─────────┘ │
│         │              │                  │           │
│         └──────────────┼──────────────────┘           │
│                        ▼                              │
│              ┌──────────────────┐                     │
│              │ Production Build │                     │
│              │                  │                     │
│              │ • next build     │                     │
│              │ • 34 static pages│                     │
│              │ • CSS bundle     │                     │
│              │ • Artifact upload│                     │
│              └──────────────────┘                     │
│                        │                              │
│                        ▼                              │
│              ┌──────────────────┐                     │
│              │ Lighthouse Audit │                     │
│              │ Perf > 90        │                     │
│              │ A11y > 90        │                     │
│              │ SEO  > 90        │                     │
│              └──────────────────┘                     │
└───────────────────────────────────────────────────────┘
    │
    ▼
┌────────────────────┐
│ Vercel Auto-Deploy │
│ (GitHub App)       │
└────────────────────┘
```

### Branch Protection Rules (Recommended)

| Rule                        | Setting                                          |
| --------------------------- | ------------------------------------------------ |
| Require PR reviews          | 1 approval minimum                               |
| Require status checks       | `quality-gate`, `unit-tests`, `production-build` |
| Require branches up to date | Yes                                              |
| Restrict force pushes       | No force push to main                            |
| Require signed commits      | Recommended                                      |

---

## DevSecOps Practices

### Supply Chain Security

1. **Lock file integrity**: `npm ci` enforces exact versions from `package-lock.json`
2. **Dependency auditing**: Weekly automated `npm audit` via GitHub Actions schedule
3. **Minimal dependencies**: Only 6 production dependencies (canvas-confetti, lucide-react, next, pdf-lib, react, react-dom)
4. **No server-side code**: Zero API routes, zero server actions, zero middleware processing user data

### Privacy Verification (Automated)

The Vitest privacy audit suite (`tests/privacy-audit.test.ts`) automatically verifies:

- No `fetch()` calls to external origins in source code
- No `XMLHttpRequest` usage
- No `navigator.sendBeacon` usage
- No tracking pixels or analytics scripts
- No server-side file processing code
- CSP headers exist in `vercel.json`

### Incident Response

Since FormReady processes zero user data server-side:

- **Data breach risk**: Zero — no user data is stored or transmitted
- **Service availability**: Vercel CDN with 99.99% SLA + offline Service Worker fallback
- **Dependency vulnerability**: Automated weekly scans with alerting

---

_This document is auto-maintained. Last verified against codebase: November 2026._

# FormReady System Architecture

FormReady is an open-source, client-first web utility engineered to fix rejected application files without relying on cloud computation.

## Core Architectural Invariants

1. **Zero-Server Processing Boundary**: No file payload, image byte buffer, or document stream ever crosses the network boundary to a server.
2. **Local-First Pipeline**: Execution leverages modern browser standards:
   - **Canvas 2D API**: High-performance pixel decoding, bilinear downscaling, and background painting.
   - **createImageBitmap & Blob**: Memory-efficient image handling with automated EXIF orientation normalization.
   - **pdf-lib**: Pure client-side PDF document manipulation, merging, reordering, and object stream compression.
3. **Binary Search Convergence**: Image compression uses a binary-search algorithm over quality factors combined with safety margin enforcement (3-4% below target max size).
4. **Transparent Auditability**: The application has zero API routes in `src/app/api`, zero tracking beacons, and zero telemetry analytics.

## Directory Structure

- `src/app/`: Next.js App Router static pages and SEO metadata.
- `src/components/`: Modular interactive tools (Image Compressor, Signature Fixer, Passport Photo Maker, PDF Suite).
- `src/lib/`: Core computational logic (image compression, signature bounds detection, PDF compilation).
- `src/types/`: TypeScript data contracts and preset schemas.
- `tests/`: Automated unit tests verifying dimension geometry, whitespace detection, and network privacy integrity.
- `e2e/`: End-to-end integration tests with Playwright.

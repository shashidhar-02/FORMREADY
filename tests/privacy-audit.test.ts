import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

/**
 * Recursively collect all files under `dir` matching the given extensions.
 */
function collectFiles(dir: string, exts: string[]): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectFiles(fullPath, exts));
    } else if (exts.some((ext) => entry.name.endsWith(ext))) {
      results.push(fullPath);
    }
  }
  return results;
}

describe('Network Privacy & Zero-Upload Audit', () => {
  const projectRoot = process.cwd();
  const srcDir = path.resolve(projectRoot, 'src');

  // ── Existing tests (unchanged) ────────────────────────────────────

  it('guarantees NO API routes exist in src/app/api', () => {
    const apiDir = path.join(srcDir, 'app', 'api');
    const apiExists = fs.existsSync(apiDir);
    if (apiExists) {
      const files = fs.readdirSync(apiDir);
      expect(files.length).toBe(0);
    } else {
      expect(apiExists).toBe(false);
    }
  });

  it('verifies core file-processing libraries make ZERO network calls (no fetch, XMLHttpRequest, sendBeacon)', () => {
    const libFiles = [
      'image-compressor.ts',
      'pdf-service.ts',
      'signature-detector.ts',
      'passport-sheet.ts',
    ];

    for (const file of libFiles) {
      const filePath = path.join(srcDir, 'lib', file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        expect(content).not.toMatch(/fetch\s*\(/);
        expect(content).not.toMatch(/XMLHttpRequest/);
        expect(content).not.toMatch(/navigator\.sendBeacon/);
        expect(content).not.toMatch(/axios/);
      }
    }
  });

  it('verifies no telemetry or tracking libraries exist in package.json', () => {
    const pkgPath = path.resolve(projectRoot, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };

    const bannedTrackers = [
      'google-analytics',
      '@google-analytics',
      'mixpanel',
      'posthog-js',
      'segment',
      '@amplitude',
      'hotjar',
      'sentry',
      '@sentry',
      'facebook-pixel',
    ];

    for (const tracker of bannedTrackers) {
      expect(allDeps[tracker]).toBeUndefined();
    }
  });

  it('verifies that global fetch is never triggered with file bytes', async () => {
    // Intercept any accidental fetch invocation
    const originalFetch = global.fetch;
    let fetchCalled = false;

    global.fetch = async (...args: Parameters<typeof fetch>) => {
      fetchCalled = true;
      throw new Error(`CRITICAL PRIVACY VIOLATION: Network fetch attempted to ${args[0]}`);
    };

    try {
      // Import and run purely local calculation
      const { calculateTargetDimensions } = await import('@/lib/image-compressor');
      const dims = calculateTargetDimensions(1000, 500, { width: 500 });
      expect(dims.width).toBe(500);
      expect(fetchCalled).toBe(false);
    } finally {
      global.fetch = originalFetch;
    }
  });

  // ── New: deep source-wide privacy scans ────────────────────────────

  it('ensures no fetch() calls to external origins in any source file', () => {
    const sourceFiles = collectFiles(srcDir, ['.ts', '.tsx']);

    // Pattern: fetch("https://... or fetch('http://... or fetch(`http
    // Allows fetch with relative paths or no arg (type stubs).
    const externalFetchPattern = /fetch\s*\(\s*['"`]https?:\/\/(?!localhost|127\.0\.0\.1)/;

    for (const file of sourceFiles) {
      // Skip the SW registration utility (it registers /sw.js locally)
      if (file.includes('register-sw')) continue;

      const content = fs.readFileSync(file, 'utf-8');
      const relativePath = path.relative(projectRoot, file);
      expect(externalFetchPattern.test(content), `External fetch() found in ${relativePath}`).toBe(
        false,
      );
    }
  });

  it('ensures no XMLHttpRequest usage anywhere in source', () => {
    const sourceFiles = collectFiles(srcDir, ['.ts', '.tsx']);

    for (const file of sourceFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const relativePath = path.relative(projectRoot, file);
      expect(
        /new\s+XMLHttpRequest|XMLHttpRequest\s*\(/.test(content),
        `XMLHttpRequest found in ${relativePath}`,
      ).toBe(false);
    }
  });

  it('ensures no navigator.sendBeacon usage anywhere in source', () => {
    const sourceFiles = collectFiles(srcDir, ['.ts', '.tsx']);

    for (const file of sourceFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const relativePath = path.relative(projectRoot, file);
      expect(
        /navigator\.sendBeacon/.test(content),
        `navigator.sendBeacon found in ${relativePath}`,
      ).toBe(false);
    }
  });

  it('ensures no tracking pixels or analytics scripts in source', () => {
    const sourceFiles = collectFiles(srcDir, ['.ts', '.tsx']);

    const trackingPatterns = [
      /google-analytics\.com/,
      /googletagmanager\.com/,
      /gtag\s*\(/,
      /ga\s*\(\s*['"]send/,
      /fbq\s*\(/,
      /facebook\.net\/en_US\/fbevents/,
      /hotjar\.com/,
      /mixpanel\.track/,
      /posthog\.capture/,
      /amplitude\.getInstance/,
      /segment\.track/,
      /analytics\.identify/,
      /pixel\.gif/i,
      /tracking[_-]?pixel/i,
    ];

    for (const file of sourceFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const relativePath = path.relative(projectRoot, file);

      for (const pattern of trackingPatterns) {
        expect(
          pattern.test(content),
          `Tracking/analytics pattern ${pattern} found in ${relativePath}`,
        ).toBe(false);
      }
    }
  });

  it('verifies CSP header exists in vercel.json', () => {
    const vercelJsonPath = path.resolve(projectRoot, 'vercel.json');
    expect(fs.existsSync(vercelJsonPath), 'vercel.json must exist at project root').toBe(true);

    const vercelConfig = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf-8'));

    // Find the global headers block (source: "/(.*)")
    const globalHeaders = vercelConfig.headers?.find(
      (h: { source: string }) => h.source === '/(.*)',
    );
    expect(globalHeaders, 'vercel.json must have a global headers block for /(.*)').toBeDefined();

    const headerKeys: string[] = globalHeaders.headers.map((h: { key: string }) => h.key);

    const requiredSecurityHeaders = [
      'Content-Security-Policy',
      'X-Content-Type-Options',
      'X-Frame-Options',
      'Strict-Transport-Security',
      'Referrer-Policy',
      'Permissions-Policy',
    ];

    for (const required of requiredSecurityHeaders) {
      expect(
        headerKeys.includes(required),
        `vercel.json is missing security header: ${required}`,
      ).toBe(true);
    }
  });
});

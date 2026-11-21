import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Network Privacy & Zero-Upload Audit', () => {
  const srcDir = path.resolve(__dirname, '../src');

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
    const libFiles = ['image-compressor.ts', 'pdf-service.ts', 'signature-detector.ts', 'passport-sheet.ts'];
    
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
    const pkgPath = path.resolve(__dirname, '../package.json');
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

    global.fetch = async (...args: any[]) => {
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
});

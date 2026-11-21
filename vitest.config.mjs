import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'url';
import zlib from 'node:zlib';

// Polyfill node:zlib for older Node environments (<22.12) to prevent undici decompress.js
// TypeError: Cannot read properties of undefined (reading 'bind')
if (typeof zlib.createZstdDecompress !== 'function') {
  zlib.createZstdDecompress = function () {};
}
if (!zlib.constants) {
  zlib.constants = {};
}
if (typeof zlib.constants.ZSTD_d_windowLogMax === 'undefined') {
  zlib.constants.ZSTD_d_windowLogMax = 23;
}

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['e2e/**', 'node_modules/**', '.next/**'],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});

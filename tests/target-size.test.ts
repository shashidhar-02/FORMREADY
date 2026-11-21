import { describe, it, expect } from 'vitest';
import { validateOutput, formatBytes } from '@/lib/image-compressor';
import { CompressionResult } from '@/types';

describe('Target Size & Quality Validation Logic', () => {
  it('passes validation when file is strictly under limit', () => {
    const mockResult: CompressionResult = {
      blob: new Blob(['x'.repeat(49152)]), // 48 KB
      url: 'blob:fake',
      width: 400,
      height: 500,
      bytes: 49152,
      format: 'image/jpeg',
      iterations: 3,
      isUnderLimit: true,
      qualityUsed: 0.82,
      dimensionsAdjusted: false,
    };

    const targetLimit = 51200; // 50 KB
    const report = validateOutput(mockResult, {
      maxBytes: targetLimit,
      width: 400,
      height: 500,
      expectedFormat: 'image/jpeg',
    });

    expect(report.isValid).toBe(true);
    expect(report.items.every((item) => item.passed)).toBe(true);
  });

  it('strictly rejects files that exceed target limit even by 1 byte', () => {
    const mockResult: CompressionResult = {
      blob: new Blob(['x'.repeat(51201)]), // 50 KB + 1 byte
      url: 'blob:fake',
      width: 400,
      height: 500,
      bytes: 51201,
      format: 'image/jpeg',
      iterations: 6,
      isUnderLimit: false,
      qualityUsed: 0.1,
      dimensionsAdjusted: true,
    };

    const targetLimit = 51200; // 50 KB
    const report = validateOutput(mockResult, {
      maxBytes: targetLimit,
    });

    expect(report.isValid).toBe(false);
    const sizeItem = report.items.find((i) => i.label === 'File Size');
    expect(sizeItem?.passed).toBe(false);
  });

  it('correctly formats bytes into KB and MB strings', () => {
    expect(formatBytes(500)).toBe('500 B');
    expect(formatBytes(51200)).toBe('50.0 KB');
    expect(formatBytes(1048576)).toBe('1.00 MB');
    expect(formatBytes(2500000)).toBe('2.38 MB');
  });
});

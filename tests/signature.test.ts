import { describe, it, expect } from 'vitest';
import { findSignatureBounds, getLuminance } from '@/lib/signature-detector';

describe('Signature Whitespace and Stroke Detection', () => {
  it('correctly calculates luminance for pure colors', () => {
    // Pure white: 255
    expect(Math.round(getLuminance(255, 255, 255))).toBe(255);
    // Pure black: 0
    expect(Math.round(getLuminance(0, 0, 0))).toBe(0);
    // Dark ink (e.g. 30, 30, 60)
    expect(getLuminance(30, 30, 60)).toBeLessThan(100);
  });

  it('detects tight bounding box around drawn strokes', () => {
    const width = 100;
    const height = 100;
    const data = new Uint8ClampedArray(width * height * 4);

    // Initialize all pixels to pure white paper (255, 255, 255, 255)
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
      data[i + 3] = 255;
    }

    // Draw simulated signature stroke from (20, 30) to (70, 60)
    for (let y = 30; y <= 60; y++) {
      for (let x = 20; x <= 70; x++) {
        // Draw a diagonal line
        if (Math.abs((y - 30) - (x - 20) * 0.6) < 2) {
          const idx = (y * width + x) * 4;
          data[idx] = 10;     // dark R
          data[idx + 1] = 10; // dark G
          data[idx + 2] = 20; // dark B
          data[idx + 3] = 255;
        }
      }
    }

    const imgData = {
      width,
      height,
      data,
      colorSpace: 'srgb' as PredefinedColorSpace,
    } as ImageData;

    const bounds = findSignatureBounds(imgData, 200);

    // The signature was drawn between x: 20..70 and y: 30..60
    expect(bounds.x).toBeGreaterThanOrEqual(19);
    expect(bounds.x).toBeLessThanOrEqual(22);
    expect(bounds.y).toBeGreaterThanOrEqual(29);
    expect(bounds.y).toBeLessThanOrEqual(32);
    expect(bounds.width).toBeGreaterThanOrEqual(45);
    expect(bounds.height).toBeGreaterThanOrEqual(25);
  });

  it('handles completely blank/white image gracefully', () => {
    const width = 50;
    const height = 50;
    const data = new Uint8ClampedArray(width * height * 4).fill(255);
    const imgData = { width, height, data, colorSpace: 'srgb' } as unknown as ImageData;

    const bounds = findSignatureBounds(imgData, 200);
    expect(bounds.x).toBe(0);
    expect(bounds.y).toBe(0);
    expect(bounds.width).toBe(50);
    expect(bounds.height).toBe(50);
  });
});

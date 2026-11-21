import { describe, it, expect } from 'vitest';
import { calculateTargetDimensions } from '@/lib/image-compressor';

describe('Dimension Calculations', () => {
  it('returns original dimensions when no spec provided', () => {
    const res = calculateTargetDimensions(1000, 800);
    expect(res.width).toBe(1000);
    expect(res.height).toBe(800);
    expect(res.scaleFactor).toBe(1.0);
  });

  it('scales by percentage correctly', () => {
    const res = calculateTargetDimensions(1200, 800, { scalePercent: 50 });
    expect(res.width).toBe(600);
    expect(res.height).toBe(400);
    expect(res.scaleFactor).toBe(0.5);
  });

  it('locks aspect ratio when only width is provided', () => {
    const res = calculateTargetDimensions(1000, 500, { width: 500 });
    expect(res.width).toBe(500);
    expect(res.height).toBe(250);
  });

  it('locks aspect ratio when only height is provided', () => {
    const res = calculateTargetDimensions(1000, 500, { height: 200 });
    expect(res.width).toBe(400);
    expect(res.height).toBe(200);
  });

  it('fits inside box maintaining aspect ratio', () => {
    // 1000x500 (2:1 aspect) into 300x300 box -> should become 300x150
    const res = calculateTargetDimensions(1000, 500, {
      width: 300,
      height: 300,
      lockAspectRatio: true,
      fitMode: 'fit-inside',
    });
    expect(res.width).toBe(300);
    expect(res.height).toBe(150);
  });

  it('supports exact dimensions when aspect ratio lock is false', () => {
    const res = calculateTargetDimensions(1000, 500, {
      width: 200,
      height: 230,
      lockAspectRatio: false,
    });
    expect(res.width).toBe(200);
    expect(res.height).toBe(230);
  });
});

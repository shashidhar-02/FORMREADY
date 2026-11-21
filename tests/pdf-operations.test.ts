import { describe, it, expect } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { PAGE_SIZES } from '@/lib/pdf-service';

describe('PDF Service & Page Geometry Operations', () => {
  it('defines correct standard point dimensions for A4 and Letter at 72 DPI', () => {
    // A4: 595.28 x 841.89 points
    expect(PAGE_SIZES.A4.width).toBeCloseTo(595.28, 1);
    expect(PAGE_SIZES.A4.height).toBeCloseTo(841.89, 1);

    // Letter: 612 x 792 points
    expect(PAGE_SIZES.Letter.width).toBe(612.0);
    expect(PAGE_SIZES.Letter.height).toBe(792.0);
  });

  it('creates and parses a multi-page PDF document in memory', async () => {
    const doc = await PDFDocument.create();
    const page1 = doc.addPage([595.28, 841.89]);
    const page2 = doc.addPage([595.28, 841.89]);

    expect(doc.getPageCount()).toBe(2);

    const pdfBytes = await doc.save();
    expect(pdfBytes.byteLength).toBeGreaterThan(50);

    // Reload document to verify parsing
    const reloaded = await PDFDocument.load(pdfBytes);
    expect(reloaded.getPageCount()).toBe(2);
  });

  it('can copy pages between documents for merging and splitting', async () => {
    const srcDoc1 = await PDFDocument.create();
    srcDoc1.addPage([600, 600]);

    const srcDoc2 = await PDFDocument.create();
    srcDoc2.addPage([600, 600]);
    srcDoc2.addPage([600, 600]);

    const mergedDoc = await PDFDocument.create();

    const pages1 = await mergedDoc.copyPages(srcDoc1, [0]);
    const pages2 = await mergedDoc.copyPages(srcDoc2, [0, 1]);

    pages1.forEach((p) => mergedDoc.addPage(p));
    pages2.forEach((p) => mergedDoc.addPage(p));

    expect(mergedDoc.getPageCount()).toBe(3);
  });
});

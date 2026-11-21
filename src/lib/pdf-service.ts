import { PDFDocument, degrees } from 'pdf-lib';
import { PdfConversionOptions, PdfImageItem } from '@/types';

/**
 * Standard page dimensions in points (72 DPI)
 */
export const PAGE_SIZES = {
  A4: { width: 595.28, height: 841.89 },
  Letter: { width: 612.0, height: 792.0 },
};

/**
 * Helper to convert an image File or Blob to JPEG bytes for embedding in PDF.
 */
async function getNormalizedJpgBytes(file: File, quality: number = 0.85): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        async (blob) => {
          if (!blob) {
            reject(new Error('Failed to generate image bytes'));
            return;
          }
          const buf = await blob.arrayBuffer();
          resolve(new Uint8Array(buf));
        },
        'image/jpeg',
        quality,
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to load image: ${file.name}`));
    };
    img.src = url;
  });
}

/**
 * Converts a sequence of image files into a single PDF document.
 */
export async function imagesToPdf(
  images: PdfImageItem[],
  options: PdfConversionOptions,
): Promise<Blob> {
  if (images.length === 0) {
    throw new Error('At least one image is required to generate a PDF.');
  }

  const pdfDoc = await PDFDocument.create();

  for (const item of images) {
    const jpgBytes = await getNormalizedJpgBytes(item.file, options.imageQuality);
    const embeddedImg = await pdfDoc.embedJpg(jpgBytes);

    let imgWidth = embeddedImg.width;
    let imgHeight = embeddedImg.height;

    // Apply rotation if item has rotation (90, 180, 270)
    const isRotatedQuarter = item.rotation === 90 || item.rotation === 270;
    const effectiveWidth = isRotatedQuarter ? imgHeight : imgWidth;
    const effectiveHeight = isRotatedQuarter ? imgWidth : imgHeight;

    let pageWidth: number;
    let pageHeight: number;

    if (options.pageSize === 'Fit') {
      pageWidth = effectiveWidth + options.marginMm * 5.67;
      pageHeight = effectiveHeight + options.marginMm * 5.67;
    } else {
      const base = PAGE_SIZES[options.pageSize];
      const isLandscape =
        options.orientation === 'landscape' ||
        (options.orientation === 'auto' && effectiveWidth > effectiveHeight);

      pageWidth = isLandscape ? base.height : base.width;
      pageHeight = isLandscape ? base.width : base.height;
    }

    const marginPt = (options.marginMm / 25.4) * 72; // mm to points
    const availWidth = Math.max(10, pageWidth - marginPt * 2);
    const availHeight = Math.max(10, pageHeight - marginPt * 2);

    // Compute fitted dimensions
    const scale = Math.min(availWidth / effectiveWidth, availHeight / effectiveHeight, 1.0);
    const drawWidth = effectiveWidth * scale;
    const drawHeight = effectiveHeight * scale;

    const page = pdfDoc.addPage([pageWidth, pageHeight]);

    const drawX = marginPt + (availWidth - drawWidth) / 2;
    const drawY = marginPt + (availHeight - drawHeight) / 2;

    if (item.rotation === 0) {
      page.drawImage(embeddedImg, {
        x: drawX,
        y: drawY,
        width: drawWidth,
        height: drawHeight,
      });
    } else {
      // Rotated image placement
      page.drawImage(embeddedImg, {
        x: drawX + (isRotatedQuarter ? drawWidth : 0),
        y: drawY,
        width: isRotatedQuarter ? drawHeight : drawWidth,
        height: isRotatedQuarter ? drawWidth : drawHeight,
        rotate: degrees(item.rotation),
      });
    }
  }

  const pdfBytes = await pdfDoc.save();
  const arrayBuffer = pdfBytes.buffer.slice(
    pdfBytes.byteOffset,
    pdfBytes.byteOffset + pdfBytes.byteLength,
  ) as ArrayBuffer;
  return new Blob([arrayBuffer], { type: 'application/pdf' });
}

/**
 * Merges multiple PDF files into one combined PDF.
 */
export async function mergePdfFiles(files: File[]): Promise<Blob> {
  if (files.length < 2) {
    throw new Error('Please select at least 2 PDF files to merge.');
  }

  const mergedDoc = await PDFDocument.create();

  for (const file of files) {
    const fileBytes = await file.arrayBuffer();
    const doc = await PDFDocument.load(fileBytes, { ignoreEncryption: true });
    const copiedPages = await mergedDoc.copyPages(doc, doc.getPageIndices());
    copiedPages.forEach((page) => mergedDoc.addPage(page));
  }

  const mergedBytes = await mergedDoc.save();
  const arrayBuffer = mergedBytes.buffer.slice(
    mergedBytes.byteOffset,
    mergedBytes.byteOffset + mergedBytes.byteLength,
  ) as ArrayBuffer;
  return new Blob([arrayBuffer], { type: 'application/pdf' });
}

/**
 * Splits / extracts pages from a PDF file.
 */
export async function extractPdfPages(file: File, pageIndicesToKeep: number[]): Promise<Blob> {
  if (pageIndicesToKeep.length === 0) {
    throw new Error('Please select at least one page to extract.');
  }

  const fileBytes = await file.arrayBuffer();
  const srcDoc = await PDFDocument.load(fileBytes, { ignoreEncryption: true });
  const newDoc = await PDFDocument.create();

  const copiedPages = await newDoc.copyPages(srcDoc, pageIndicesToKeep);
  copiedPages.forEach((page) => newDoc.addPage(page));

  const resultBytes = await newDoc.save();
  const arrayBuffer = resultBytes.buffer.slice(
    resultBytes.byteOffset,
    resultBytes.byteOffset + resultBytes.byteLength,
  ) as ArrayBuffer;
  return new Blob([arrayBuffer], { type: 'application/pdf' });
}

/**
 * Rotates specific pages in a PDF file.
 */
export async function rotatePdfPages(
  file: File,
  rotations: Record<number, number>, // pageIndex -> degrees (e.g. 90, 180, 270)
): Promise<Blob> {
  const fileBytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(fileBytes, { ignoreEncryption: true });

  const pages = doc.getPages();
  pages.forEach((page, idx) => {
    const addRotation = rotations[idx];
    if (addRotation) {
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees((currentRotation + addRotation) % 360));
    }
  });

  const bytes = await doc.save();
  const arrayBuffer = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer;
  return new Blob([arrayBuffer], { type: 'application/pdf' });
}

/**
 * Browser-side PDF compression & optimization.
 * Optimizes PDF streams and structure without sending to a server.
 */
export async function compressPdfDocument(
  file: File,
  qualityFactor: number = 0.8,
): Promise<{ blob: Blob; originalSize: number; newSize: number; reductionPercent: number }> {
  const fileBytes = await file.arrayBuffer();
  const originalSize = file.size;

  const doc = await PDFDocument.load(fileBytes, {
    ignoreEncryption: true,
    updateMetadata: false,
  });

  // Re-encode with object stream compression
  const compressedBytes = await doc.save({
    useObjectStreams: true,
    addDefaultPage: false,
  });

  const arrayBuffer = compressedBytes.buffer.slice(
    compressedBytes.byteOffset,
    compressedBytes.byteOffset + compressedBytes.byteLength,
  ) as ArrayBuffer;
  const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
  const newSize = blob.size;
  const reductionPercent = Math.max(0, Math.round(((originalSize - newSize) / originalSize) * 100));

  return {
    blob,
    originalSize,
    newSize,
    reductionPercent,
  };
}

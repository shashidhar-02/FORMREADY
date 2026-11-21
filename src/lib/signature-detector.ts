/**
 * FormReady Signature Processor:
 * 1. Automatically locates non-paper ink strokes to trim excessive white borders.
 * 2. Provides thresholding & contrast enhancement to remove yellow/shadowy background from phone photos.
 */

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SignatureProcessOptions {
  autoTrim?: boolean;
  contrastBoost?: boolean;
  paddingPercent?: number; // e.g. 0.05 (5%)
  darknessThreshold?: number; // 0-255, default ~215
}

/**
 * Calculates luminance for an RGB tuple (standard Rec. 601)
 */
export function getLuminance(r: number, g: number, b: number): number {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

/**
 * Finds the tight bounding box around the ink strokes in an ImageData buffer.
 */
export function findSignatureBounds(imageData: ImageData, threshold: number = 220): BoundingBox {
  const { width, height, data } = imageData;
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const a = data[idx + 3];

      // If pixel is sufficiently opaque and darker than threshold (i.e. ink)
      if (a > 50) {
        const lum = getLuminance(r, g, b);
        if (lum < threshold) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
  }

  // If no strokes were detected (e.g. completely white image), return full bounds
  if (maxX === -1 || maxY === -1 || minX >= maxX || minY >= maxY) {
    return { x: 0, y: 0, width, height };
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };
}

/**
 * Crops and optionally contrast-enhances a signature canvas.
 */
export function processSignatureCanvas(
  sourceCanvas: HTMLCanvasElement,
  options: SignatureProcessOptions = {},
): HTMLCanvasElement {
  const {
    autoTrim = true,
    contrastBoost = true,
    paddingPercent = 0.06,
    darknessThreshold = 215,
  } = options;

  const ctx = sourceCanvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return sourceCanvas;

  const srcWidth = sourceCanvas.width;
  const srcHeight = sourceCanvas.height;
  const imgData = ctx.getImageData(0, 0, srcWidth, srcHeight);

  let cropBox: BoundingBox = { x: 0, y: 0, width: srcWidth, height: srcHeight };

  if (autoTrim) {
    const rawBounds = findSignatureBounds(imgData, darknessThreshold);
    // Add margin padding
    const padX = Math.round(rawBounds.width * paddingPercent);
    const padY = Math.round(rawBounds.height * paddingPercent);

    const x = Math.max(0, rawBounds.x - padX);
    const y = Math.max(0, rawBounds.y - padY);
    const right = Math.min(srcWidth, rawBounds.x + rawBounds.width + padX);
    const bottom = Math.min(srcHeight, rawBounds.y + rawBounds.height + padY);

    cropBox = {
      x,
      y,
      width: Math.max(1, right - x),
      height: Math.max(1, bottom - y),
    };
  }

  // Create destination canvas
  const outCanvas = document.createElement('canvas');
  outCanvas.width = cropBox.width;
  outCanvas.height = cropBox.height;
  const outCtx = outCanvas.getContext('2d');
  if (!outCtx) return sourceCanvas;

  // Draw background white first
  outCtx.fillStyle = '#FFFFFF';
  outCtx.fillRect(0, 0, cropBox.width, cropBox.height);

  // Draw cropped slice
  outCtx.drawImage(
    sourceCanvas,
    cropBox.x,
    cropBox.y,
    cropBox.width,
    cropBox.height,
    0,
    0,
    cropBox.width,
    cropBox.height,
  );

  // If contrast boost requested, clean up paper shadows and deepen ink
  if (contrastBoost) {
    const outImgData = outCtx.getImageData(0, 0, cropBox.width, cropBox.height);
    const data = outImgData.data;
    const len = data.length;

    for (let i = 0; i < len; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const lum = getLuminance(r, g, b);

      if (lum > darknessThreshold) {
        // Boost light grayish/yellow paper to pure crisp white
        data[i] = 255;
        data[i + 1] = 255;
        data[i + 2] = 255;
      } else {
        // Deepen ink contrast smoothly
        const ratio = lum / darknessThreshold; // 0 to 1
        const factor = Math.pow(ratio, 1.4); // non-linear gamma curve
        data[i] = Math.round(r * factor);
        data[i + 1] = Math.round(g * factor);
        data[i + 2] = Math.round(b * factor);
      }
    }
    outCtx.putImageData(outImgData, 0, 0);
  }

  return outCanvas;
}

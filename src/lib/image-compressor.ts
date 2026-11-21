import {
  CompressionOptions,
  CompressionResult,
  DimensionSpec,
  ImageFormat,
  ValidationReport,
} from '@/types';

/**
 * Calculates target dimensions preserving or modifying aspect ratio as specified.
 */
export function calculateTargetDimensions(
  origWidth: number,
  origHeight: number,
  spec?: DimensionSpec
): { width: number; height: number; scaleFactor: number } {
  if (!spec) {
    return { width: origWidth, height: origHeight, scaleFactor: 1.0 };
  }

  const { width, height, lockAspectRatio = true, fitMode = 'fit-inside', scalePercent } = spec;

  // Percentage scaling
  if (scalePercent && scalePercent > 0) {
    const scale = scalePercent / 100;
    return {
      width: Math.max(1, Math.round(origWidth * scale)),
      height: Math.max(1, Math.round(origHeight * scale)),
      scaleFactor: scale,
    };
  }

  // If neither width nor height is provided
  if (!width && !height) {
    return { width: origWidth, height: origHeight, scaleFactor: 1.0 };
  }

  // Exact dimensions without aspect ratio lock
  if (width && height && !lockAspectRatio) {
    return {
      width: Math.round(width),
      height: Math.round(height),
      scaleFactor: Math.min(width / origWidth, height / origHeight),
    };
  }

  // Aspect ratio lock or single dimension supplied
  if (width && !height) {
    const scale = width / origWidth;
    return {
      width: Math.round(width),
      height: Math.max(1, Math.round(origHeight * scale)),
      scaleFactor: scale,
    };
  }

  if (height && !width) {
    const scale = height / origHeight;
    return {
      width: Math.max(1, Math.round(origWidth * scale)),
      height: Math.round(height),
      scaleFactor: scale,
    };
  }

  if (width && height) {
    if (fitMode === 'crop-to-fill') {
      const scale = Math.max(width / origWidth, height / origHeight);
      return {
        width: Math.round(width),
        height: Math.round(height),
        scaleFactor: scale,
      };
    } else {
      // fit-inside
      const scale = Math.min(width / origWidth, height / origHeight);
      return {
        width: Math.max(1, Math.round(origWidth * scale)),
        height: Math.max(1, Math.round(origHeight * scale)),
        scaleFactor: scale,
      };
    }
  }

  return { width: origWidth, height: origHeight, scaleFactor: 1.0 };
}

/**
 * Loads an image from a File or Blob, normalizing orientation.
 */
export async function loadImageElement(fileOrBlob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(fileOrBlob);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to decode image. File may be corrupt or an unsupported format.'));
    };
    img.src = url;
  });
}

/**
 * Converts a Canvas to a Blob asynchronously with given format and quality.
 */
export async function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: ImageFormat,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas toBlob failed to produce a valid image file.'));
        }
      },
      format,
      quality
    );
  });
}

/**
 * Robust target-size compression algorithm:
 * 1. Decode image & determine base dimensions.
 * 2. Set safety margin (aiming for 96% of targetMaxBytes so we never hit 50.1 KB on 50 KB limit).
 * 3. Binary search on compression quality (min 0.05, max 0.98).
 * 4. If lowest quality (0.05) is still larger than maxBytes, progressively downscale dimensions.
 * 5. Re-run binary search on downscaled canvas.
 * 6. Guarantee: Blob is verified <= targetMaxBytes before returning isUnderLimit=true.
 */
export async function compressImageToTarget(
  source: HTMLCanvasElement | HTMLImageElement,
  options: CompressionOptions = {}
): Promise<CompressionResult> {
  const {
    targetMaxBytes,
    targetFormat = 'image/jpeg',
    dimensions,
    backgroundColor = '#FFFFFF',
  } = options;

  const srcWidth = source instanceof HTMLCanvasElement ? source.width : source.naturalWidth;
  const srcHeight = source instanceof HTMLCanvasElement ? source.height : source.naturalHeight;

  // Compute initial target dimensions
  let currentTargetDim = calculateTargetDimensions(srcWidth, srcHeight, dimensions);
  let curWidth = currentTargetDim.width;
  let curHeight = currentTargetDim.height;

  // Maximum dimension cap to protect mobile devices from out-of-memory crashes
  const MAX_SAFE_DIM = 4096;
  if (curWidth > MAX_SAFE_DIM || curHeight > MAX_SAFE_DIM) {
    const scale = Math.min(MAX_SAFE_DIM / curWidth, MAX_SAFE_DIM / curHeight);
    curWidth = Math.max(1, Math.round(curWidth * scale));
    curHeight = Math.max(1, Math.round(curHeight * scale));
  }

  // Prepare work canvas
  const workCanvas = document.createElement('canvas');
  workCanvas.width = curWidth;
  workCanvas.height = curHeight;
  const ctx = workCanvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    throw new Error('Could not obtain 2D rendering context from browser canvas.');
  }

  // Draw background (essential for transparent PNGs converted to JPEG)
  if (targetFormat === 'image/jpeg') {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, curWidth, curHeight);
  }

  ctx.drawImage(source, 0, 0, curWidth, curHeight);

  // If no targetMaxBytes is specified, compress with standard high quality
  if (!targetMaxBytes || targetMaxBytes <= 0) {
    const finalQuality = options.quality ?? 0.88;
    const blob = await canvasToBlob(workCanvas, targetFormat, finalQuality);
    const url = URL.createObjectURL(blob);
    return {
      blob,
      url,
      width: curWidth,
      height: curHeight,
      bytes: blob.size,
      format: targetFormat,
      iterations: 1,
      isUnderLimit: true,
      qualityUsed: finalQuality,
      dimensionsAdjusted: false,
    };
  }

  // Safety target: aim for 96% of targetMaxBytes (4% buffer)
  const safetyTargetBytes = Math.floor(targetMaxBytes * 0.96);
  let totalIterations = 0;
  let dimensionsAdjusted = false;

  // Outer loop: if lowest quality is still over target, downscale canvas
  const MAX_RESIZE_ATTEMPTS = 6;
  let bestUnderLimitBlob: Blob | null = null;
  let bestUnderLimitQuality = 0.5;

  for (let resizeAttempt = 0; resizeAttempt < MAX_RESIZE_ATTEMPTS; resizeAttempt++) {
    // If not first attempt, downscale canvas dimensions by 15%
    if (resizeAttempt > 0) {
      dimensionsAdjusted = true;
      curWidth = Math.max(20, Math.floor(curWidth * 0.85));
      curHeight = Math.max(20, Math.floor(curHeight * 0.85));
      workCanvas.width = curWidth;
      workCanvas.height = curHeight;

      if (targetFormat === 'image/jpeg') {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, curWidth, curHeight);
      }
      ctx.drawImage(source, 0, 0, curWidth, curHeight);
    }

    // Binary search on quality between minQ and maxQ
    let lowQ = 0.05;
    let highQ = 0.98;
    let lastBlob: Blob | null = null;
    let lastQ = 0.85;

    for (let i = 0; i < 7; i++) {
      totalIterations++;
      const midQ = (lowQ + highQ) / 2;
      lastQ = midQ;
      const candidateBlob = await canvasToBlob(workCanvas, targetFormat, midQ);
      lastBlob = candidateBlob;

      if (candidateBlob.size <= targetMaxBytes) {
        // Safe! Record this as valid
        bestUnderLimitBlob = candidateBlob;
        bestUnderLimitQuality = midQ;

        if (candidateBlob.size >= safetyTargetBytes) {
          // Perfectly in sweet spot! (between safetyTargetBytes and targetMaxBytes)
          break;
        }
        // Can afford higher quality
        lowQ = midQ;
      } else {
        // Exceeded limit: decrease quality
        highQ = midQ;
      }
    }

    // If we found a candidate safely under targetMaxBytes, we are done!
    if (bestUnderLimitBlob && bestUnderLimitBlob.size <= targetMaxBytes) {
      break;
    }
  }

  // Final check: if we found a valid blob under the limit
  if (bestUnderLimitBlob && bestUnderLimitBlob.size <= targetMaxBytes) {
    const url = URL.createObjectURL(bestUnderLimitBlob);
    return {
      blob: bestUnderLimitBlob,
      url,
      width: curWidth,
      height: curHeight,
      bytes: bestUnderLimitBlob.size,
      format: targetFormat,
      iterations: totalIterations,
      isUnderLimit: true,
      targetMaxBytes,
      qualityUsed: Math.round(bestUnderLimitQuality * 100) / 100,
      dimensionsAdjusted,
    };
  }

  // If all attempts failed to get under limit (extremely tiny target like < 2 KB for large photo)
  // return the smallest achieved blob with explicit isUnderLimit: false
  const fallbackBlob = await canvasToBlob(workCanvas, targetFormat, 0.05);
  const url = URL.createObjectURL(fallbackBlob);
  return {
    blob: fallbackBlob,
    url,
    width: curWidth,
    height: curHeight,
    bytes: fallbackBlob.size,
    format: targetFormat,
    iterations: totalIterations,
    isUnderLimit: fallbackBlob.size <= targetMaxBytes,
    targetMaxBytes,
    qualityUsed: 0.05,
    dimensionsAdjusted,
  };
}

/**
 * Validates output against portal expectations.
 */
export function validateOutput(
  result: CompressionResult,
  targetSpec?: {
    maxBytes?: number;
    width?: number;
    height?: number;
    expectedFormat?: ImageFormat;
  }
): ValidationReport {
  const items: ValidationReport['items'] = [];
  let isValid = true;

  if (targetSpec?.maxBytes) {
    const targetKB = (targetSpec.maxBytes / 1024).toFixed(1) + ' KB';
    const actualKB = (result.bytes / 1024).toFixed(1) + ' KB';
    const passed = result.bytes <= targetSpec.maxBytes;
    if (!passed) isValid = false;
    items.push({
      label: 'File Size',
      target: `≤ ${targetKB}`,
      actual: actualKB,
      passed,
    });
  }

  if (targetSpec?.width) {
    const passed = Math.abs(result.width - targetSpec.width) <= 2;
    if (!passed) isValid = false;
    items.push({
      label: 'Width',
      target: `${targetSpec.width}px`,
      actual: `${result.width}px`,
      passed,
    });
  }

  if (targetSpec?.height) {
    const passed = Math.abs(result.height - targetSpec.height) <= 2;
    if (!passed) isValid = false;
    items.push({
      label: 'Height',
      target: `${targetSpec.height}px`,
      actual: `${result.height}px`,
      passed,
    });
  }

  if (targetSpec?.expectedFormat) {
    const passed = result.format === targetSpec.expectedFormat;
    if (!passed) isValid = false;
    items.push({
      label: 'Format',
      target: targetSpec.expectedFormat.replace('image/', '').toUpperCase(),
      actual: result.format.replace('image/', '').toUpperCase(),
      passed,
    });
  }

  return { isValid, items };
}

/**
 * Format bytes into human readable KB / MB string.
 */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

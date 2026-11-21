import { CompressionOptions, CompressionResult } from '@/types';
import { compressImageToTarget, loadImageElement } from './image-compressor';

/**
 * High-level image compressor orchestrator:
 * Accepts a File or Blob, loads it safely with orientation normalization,
 * runs the target-size algorithm, and provides cancellation and progress callbacks.
 */
export async function processImageFile(
  file: File | Blob,
  options: CompressionOptions,
  onProgress?: (stage: string) => void,
): Promise<CompressionResult> {
  onProgress?.('Decoding image...');
  const img = await loadImageElement(file);

  onProgress?.('Calculating dimensions & quality target...');
  const result = await compressImageToTarget(img, options);

  onProgress?.('Verification complete');
  return result;
}

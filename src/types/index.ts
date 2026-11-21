export type ImageFormat = 'image/jpeg' | 'image/png' | 'image/webp';

export interface TargetSizeSpec {
  maxBytes: number;
  minBytes?: number;
  safetyMarginPercent?: number; // default 3% (0.03)
}

export interface DimensionSpec {
  width?: number;
  height?: number;
  lockAspectRatio?: boolean;
  fitMode?: 'exact' | 'fit-inside' | 'crop-to-fill' | 'scale-percent';
  scalePercent?: number;
}

export interface CompressionOptions {
  targetMaxBytes?: number;
  targetFormat?: ImageFormat;
  dimensions?: DimensionSpec;
  quality?: number; // initial quality (0.05 to 1.0)
  autoTrimWhitespace?: boolean;
  contrastBoost?: boolean;
  backgroundColor?: string;
}

export interface CompressionResult {
  blob: Blob;
  url: string;
  width: number;
  height: number;
  bytes: number;
  format: ImageFormat;
  iterations: number;
  isUnderLimit: boolean;
  targetMaxBytes?: number;
  qualityUsed: number;
  dimensionsAdjusted: boolean;
}

export interface ValidationItem {
  label: string;
  target: string;
  actual: string;
  passed: boolean;
}

export interface ValidationReport {
  isValid: boolean;
  items: ValidationItem[];
}

export type PresetCategory =
  | 'govt-exam'
  | 'college-admission'
  | 'scholarship'
  | 'job-portal'
  | 'visa-passport'
  | 'generic-size';

export interface PortalPreset {
  id: string;
  name: string;
  shortName: string;
  category: PresetCategory;
  description: string;
  isOfficialVerified: boolean;
  sourceUrl?: string;
  verifiedAt?: string;
  maxBytes: number;
  minBytes?: number;
  width?: number;
  height?: number;
  aspectRatio?: string; // e.g. "3.5:4.5" or "1:1"
  format: 'JPG' | 'PNG' | 'PDF';
  notes: string;
  country?: string;
  targetType: 'photo' | 'signature' | 'document' | 'thumb';
}

export interface PdfMergeItem {
  id: string;
  file: File;
  name: string;
  sizeBytes: number;
  pageCount?: number;
}

export interface PdfImageItem {
  id: string;
  file: File;
  previewUrl: string;
  rotation: number; // 0, 90, 180, 270
  width: number;
  height: number;
  name: string;
}

export interface PdfConversionOptions {
  pageSize: 'A4' | 'Letter' | 'Fit';
  orientation: 'portrait' | 'landscape' | 'auto';
  marginMm: number; // 0, 5, 10, 15, 20
  imageQuality: number; // 0.6 to 0.95
  compressPdf: boolean;
}

export type SupportedLanguage = 'en' | 'hi' | 'te';

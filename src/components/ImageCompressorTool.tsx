'use client';

import React, { useState } from 'react';
import {
  Download,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  Lock,
  Unlock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { DropZone } from './DropZone';
import { ValidationBadge } from './ValidationBadge';
import { PresetSelector } from './PresetSelector';
import {
  compressImageToTarget,
  loadImageElement,
  validateOutput,
  formatBytes,
} from '@/lib/image-compressor';
import { CompressionResult, ImageFormat, PortalPreset, ValidationReport } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import confetti from 'canvas-confetti';

interface ImageCompressorToolProps {
  initialTargetKB?: number;
  initialFormat?: ImageFormat;
  presetFilter?: 'photo' | 'signature' | 'document';
  pageHeading?: string;
  pageSubheading?: string;
  fixedTarget?: boolean;
}

export function ImageCompressorTool({
  initialTargetKB = 50,
  initialFormat = 'image/jpeg',
  presetFilter,
  pageHeading,
  pageSubheading,
  fixedTarget = false,
}: ImageCompressorToolProps) {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [targetKB, setTargetKB] = useState<number>(initialTargetKB);
  const [format, setFormat] = useState<ImageFormat>(initialFormat);

  // Dimensions state
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customWidth, setCustomWidth] = useState<string>('');
  const [customHeight, setCustomHeight] = useState<string>('');
  const [lockAspect, setLockAspect] = useState(true);
  const [aspectRatioVal, setAspectRatioVal] = useState<number>(1);

  // Status & Results
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [validation, setValidation] = useState<ValidationReport | null>(null);
  const [errorDetails, setErrorDetails] = useState<{
    whatHappened: string;
    whatToTry: string;
  } | null>(null);

  // Selected preset tracking
  const [activePreset, setActivePreset] = useState<PortalPreset | null>(null);

  const handleFileSelect = async (files: File[]) => {
    if (!files || files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    setErrorDetails(null);
    setResult(null);
    setValidation(null);

    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);

    try {
      const img = await loadImageElement(selected);
      setCustomWidth(img.naturalWidth.toString());
      setCustomHeight(img.naturalHeight.toString());
      setAspectRatioVal(img.naturalWidth / img.naturalHeight);
    } catch {
      // ignore
    }
  };

  const handleWidthChange = (val: string) => {
    setCustomWidth(val);
    const num = parseFloat(val);
    if (!isNaN(num) && lockAspect && aspectRatioVal > 0) {
      setCustomHeight(Math.round(num / aspectRatioVal).toString());
    }
  };

  const handleHeightChange = (val: string) => {
    setCustomHeight(val);
    const num = parseFloat(val);
    if (!isNaN(num) && lockAspect && aspectRatioVal > 0) {
      setCustomWidth(Math.round(num * aspectRatioVal).toString());
    }
  };

  const handleApplyPreset = (preset: PortalPreset) => {
    setActivePreset(preset);
    setTargetKB(Math.round(preset.maxBytes / 1024));
    if (preset.format === 'PNG') setFormat('image/png');
    else if (preset.format === 'JPG') setFormat('image/jpeg');

    if (preset.width && preset.height) {
      setCustomWidth(preset.width.toString());
      setCustomHeight(preset.height.toString());
      setAspectRatioVal(preset.width / preset.height);
      setShowAdvanced(true);
    }
  };

  const handleCompress = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgressMsg('Analyzing & optimizing...');
    setErrorDetails(null);

    try {
      const img = await loadImageElement(file);

      const targetBytes = targetKB > 0 ? targetKB * 1024 : undefined;
      const widthNum = customWidth ? parseInt(customWidth, 10) : undefined;
      const heightNum = customHeight ? parseInt(customHeight, 10) : undefined;

      const compResult = await compressImageToTarget(img, {
        targetMaxBytes: targetBytes,
        targetFormat: format,
        dimensions: {
          width: widthNum,
          height: heightNum,
          lockAspectRatio: lockAspect,
          fitMode: 'fit-inside',
        },
      });

      setResult(compResult);

      const valReport = validateOutput(compResult, {
        maxBytes: targetBytes,
        width: widthNum,
        height: heightNum,
        expectedFormat: format,
      });
      setValidation(valReport);

      if (valReport.isValid) {
        try {
          confetti({
            particleCount: 35,
            spread: 60,
            origin: { y: 0.8 },
            disableForReducedMotion: true,
          });
        } catch {
          // ignore
        }
      }
    } catch (err: any) {
      setErrorDetails({
        whatHappened:
          err?.message || 'The browser encountered an error while processing the image.',
        whatToTry:
          'Ensure the file is not corrupted. If the target size is extremely small (e.g. < 5 KB), try reducing dimensions or setting a slightly higher target.',
      });
    } finally {
      setIsProcessing(false);
      setProgressMsg('');
    }
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const a = document.createElement('a');
    a.href = result.url;
    const ext = format === 'image/png' ? 'png' : format === 'image/webp' ? 'webp' : 'jpg';
    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || 'formready_image';
    a.download = `${baseName}_${Math.round(result.bytes / 1024)}kb.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleClear = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (result?.url) URL.revokeObjectURL(result.url);
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    setValidation(null);
    setErrorDetails(null);
    setActivePreset(null);
  };

  return (
    <div className="space-y-8">
      {/* Tool Header */}
      {pageHeading && (
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {pageHeading}
          </h1>
          {pageSubheading && (
            <p className="text-base text-slate-600 dark:text-slate-400">{pageSubheading}</p>
          )}
        </div>
      )}

      {/* Main Card with Psychological Visual Appeal */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 sm:p-8 shadow-md shadow-slate-900/5 space-y-6">
        {/* Upload Zone */}
        <DropZone
          accept="image/jpeg,image/png,image/webp"
          onFileSelect={handleFileSelect}
          selectedFile={file}
          previewUrl={previewUrl}
          onClear={handleClear}
        />

        {/* Compression Controls */}
        {file && (
          <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Target File Size */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="target-kb"
                    className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                  >
                    {t('target_size_label', 'Maximum File Size Target')}
                  </label>
                  <span className="font-mono text-sm font-bold text-sky-600 dark:text-sky-400">
                    ≤ {targetKB} KB
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    id="target-kb-range"
                    aria-label="Target file size in KB"
                    min="5"
                    max="1024"
                    step="5"
                    value={targetKB}
                    disabled={fixedTarget}
                    onChange={(e) => setTargetKB(Number(e.target.value))}
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                  <div className="flex items-center gap-1 shrink-0">
                    <input
                      type="number"
                      id="target-kb"
                      min="2"
                      max="5000"
                      value={targetKB}
                      disabled={fixedTarget}
                      onChange={(e) => setTargetKB(Math.max(1, Number(e.target.value)))}
                      className="w-20 px-2.5 py-1.5 text-sm font-mono font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-center"
                    />
                    <span className="text-xs font-medium text-slate-500">KB</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">
                  {t(
                    'target_size_note',
                    'Target safety margin: FormReady automatically aims ~3-4% below target to ensure strict portal acceptance.',
                  )}
                </p>
              </div>

              {/* Target Format */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                  {t('target_format_label', 'Output Format')}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['image/jpeg', 'image/png', 'image/webp'] as ImageFormat[]).map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setFormat(fmt)}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                        format === fmt
                          ? 'border-sky-600 bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 shadow-xs'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                      }`}
                    >
                      {fmt === 'image/jpeg' ? 'JPG / JPEG' : fmt === 'image/png' ? 'PNG' : 'WebP'}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-400">
                  {t(
                    'target_format_note',
                    'Govt exam portals almost universally require JPG/JPEG.',
                  )}
                </p>
              </div>
            </div>

            {/* Optional Dimensions Drawer */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <span className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-sky-500" />
                  <span>{t('exact_dims_label', 'Optional Exact Dimensions (Width × Height)')}</span>
                </span>
                {showAdvanced ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {showAdvanced && (
                <div className="p-4 space-y-4 bg-white dark:bg-slate-900">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="custom-width"
                        className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1"
                      >
                        {t('width_label', 'Width (pixels)')}
                      </label>
                      <input
                        type="number"
                        id="custom-width"
                        value={customWidth}
                        onChange={(e) => handleWidthChange(e.target.value)}
                        placeholder="e.g. 600"
                        className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="custom-height"
                        className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1"
                      >
                        {t('height_label', 'Height (pixels)')}
                      </label>
                      <input
                        type="number"
                        id="custom-height"
                        value={customHeight}
                        onChange={(e) => handleHeightChange(e.target.value)}
                        placeholder="e.g. 600"
                        className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setLockAspect(!lockAspect)}
                      className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-sky-600"
                    >
                      {lockAspect ? (
                        <Lock className="w-4 h-4 text-sky-600" />
                      ) : (
                        <Unlock className="w-4 h-4 text-slate-400" />
                      )}
                      <span>{t('lock_aspect_ratio', 'Lock aspect ratio')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Error Message Display */}
            {errorDetails && (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-rose-800 dark:text-rose-200 text-sm">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>Processing Issue</span>
                </div>
                <div>
                  <p className="font-semibold text-rose-700 dark:text-rose-300">What happened:</p>
                  <p className="text-rose-600 dark:text-rose-400">{errorDetails.whatHappened}</p>
                </div>
                <div>
                  <p className="font-semibold text-rose-700 dark:text-rose-300">
                    What you can try:
                  </p>
                  <p className="text-rose-600 dark:text-rose-400">{errorDetails.whatToTry}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleCompress}
                disabled={isProcessing}
                className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-sm shadow-md shadow-sky-600/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{progressMsg || 'Processing...'}</span>
                  </>
                ) : (
                  <>
                    <FileCheck2 className="w-5 h-5" />
                    <span>
                      {t('btn_compress_validate', 'Compress & Validate')} (≤ {targetKB} KB)
                    </span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleClear}
                className="w-full sm:w-auto px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                {t('btn_reset', 'Reset')}
              </button>
            </div>
          </div>
        )}

        {/* Compression Result & Verification Panel */}
        {result && validation && (
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-6 animate-in fade-in duration-300">
            {/* Validation Breakdown Badge */}
            <ValidationBadge report={validation} />

            {/* Comparison Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Original */}
              <div className="p-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-center space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  {t('original_image', 'Original Image')}
                </span>
                {previewUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewUrl}
                    alt="Original before compression"
                    className="max-h-48 mx-auto object-contain rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xs"
                  />
                )}
                <div className="pt-1 text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {formatBytes(file?.size || 0)}
                  </span>
                </div>
              </div>

              {/* Compressed Output */}
              <div className="p-4 rounded-3xl border-2 border-emerald-400 dark:border-emerald-600 bg-emerald-50/30 dark:bg-emerald-950/20 text-center space-y-2 shadow-sm">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t('compressed_output', 'Compressed Output')}</span>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={result.url}
                  alt="Compressed output result"
                  className="max-h-48 mx-auto object-contain rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900 shadow-sm"
                />
                <div className="pt-1 text-xs space-y-0.5">
                  <div className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                    {formatBytes(result.bytes)}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Dimensions: {result.width} × {result.height} px
                  </div>
                  {file && file.size > 0 && (
                    <span className="inline-block text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      {t('reduced_by', 'Reduced by')}{' '}
                      {Math.max(0, Math.round(((file.size - result.bytes) / file.size) * 100))}%
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Direct Instant Download Area */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-500/15 via-sky-500/10 to-indigo-500/15 border border-emerald-300 dark:border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
              <div>
                <p className="font-extrabold text-slate-900 dark:text-white text-base">
                  {t('status_ready_submission', 'Ready for Portal Submission')}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Size: {formatBytes(result.bytes)} • Format:{' '}
                  {result.format.replace('image/', '').toUpperCase()}
                </p>
              </div>

              <button
                type="button"
                onClick={handleDownload}
                className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 transition"
              >
                <Download className="w-4 h-4" />
                <span>{t('btn_download_file', 'Download File')}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Preset Chooser section below main card */}
      <div className="space-y-3 pt-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <span>{t('presets_title', 'Quick Application & Exam Portals')}</span>
        </h3>
        <PresetSelector
          onSelectPreset={handleApplyPreset}
          selectedPresetId={activePreset?.id}
          filterType={presetFilter}
        />
      </div>
    </div>
  );
}

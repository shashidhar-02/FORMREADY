'use client';

import React, { useState } from 'react';
import {
  Download,
  Crop,
  Sliders,
  CheckCircle2,
  RefreshCw,
  FileCheck2,
  Sparkles,
  Scissors,
} from 'lucide-react';
import { DropZone } from './DropZone';
import { ValidationBadge } from './ValidationBadge';
import {
  processSignatureCanvas,
  findSignatureBounds,
} from '@/lib/signature-detector';
import {
  compressImageToTarget,
  loadImageElement,
  validateOutput,
  formatBytes,
} from '@/lib/image-compressor';
import { CompressionResult, ImageFormat, ValidationReport } from '@/types';
import confetti from 'canvas-confetti';

interface SignatureFixerToolProps {
  initialTargetKB?: number;
  pageHeading?: string;
  pageSubheading?: string;
}

export function SignatureFixerTool({
  initialTargetKB = 20,
  pageHeading = 'Signature Fixer for Online Forms',
  pageSubheading = 'Auto-trim white borders, remove shadows from phone photos, and fit exact 20 KB portal requirements.',
}: SignatureFixerToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Signature enhancement settings
  const [autoTrim, setAutoTrim] = useState(true);
  const [contrastBoost, setContrastBoost] = useState(true);
  const [targetKB, setTargetKB] = useState(initialTargetKB);
  const [targetWidth, setTargetWidth] = useState('140');
  const [targetHeight, setTargetHeight] = useState('60');
  const [useExactDims, setUseExactDims] = useState(false);
  const [format, setFormat] = useState<ImageFormat>('image/jpeg');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [validation, setValidation] = useState<ValidationReport | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileSelect = (files: File[]) => {
    if (!files || files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setResult(null);
    setValidation(null);
    setErrorMsg(null);
  };

  const handleFixSignature = async () => {
    if (!file) return;

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const img = await loadImageElement(file);

      // Create base canvas
      const baseCanvas = document.createElement('canvas');
      baseCanvas.width = img.naturalWidth;
      baseCanvas.height = img.naturalHeight;
      const ctx = baseCanvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context unavailable');
      ctx.drawImage(img, 0, 0);

      // Process signature: auto-crop white borders + contrast boost
      const processedCanvas = processSignatureCanvas(baseCanvas, {
        autoTrim,
        contrastBoost,
        paddingPercent: 0.06,
        darknessThreshold: 215,
      });

      // Target sizing & dimensions
      const widthNum = useExactDims && targetWidth ? parseInt(targetWidth, 10) : undefined;
      const heightNum = useExactDims && targetHeight ? parseInt(targetHeight, 10) : undefined;
      const maxBytes = targetKB > 0 ? targetKB * 1024 : undefined;

      const compResult = await compressImageToTarget(processedCanvas, {
        targetMaxBytes: maxBytes,
        targetFormat: format,
        dimensions: {
          width: widthNum,
          height: heightNum,
          lockAspectRatio: !useExactDims,
          fitMode: useExactDims ? 'fit-inside' : undefined,
        },
      });

      setResult(compResult);

      const valReport = validateOutput(compResult, {
        maxBytes,
        width: widthNum,
        height: heightNum,
        expectedFormat: format,
      });
      setValidation(valReport);

      if (valReport.isValid) {
        try {
          confetti({
            particleCount: 25,
            spread: 50,
            origin: { y: 0.8 },
            disableForReducedMotion: true,
          });
        } catch {
          // ignore
        }
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error occurred while processing signature.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const a = document.createElement('a');
    a.href = result.url;
    const ext = format === 'image/png' ? 'png' : 'jpg';
    a.download = `signature_fixed_${Math.round(result.bytes / 1024)}kb.${ext}`;
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
  };

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {pageHeading}
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400">
          {pageSubheading}
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-8 shadow-sm space-y-6">
        <DropZone
          accept="image/jpeg,image/png,image/webp"
          onFileSelect={handleFileSelect}
          selectedFile={file}
          previewUrl={previewUrl}
          onClear={handleClear}
          title="Drop signature photo here or browse"
          subtitle="Take a phone snapshot of your signature on paper. We auto-crop borders & clean the background."
        />

        {file && (
          <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            {/* Auto enhancement toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                <input
                  type="checkbox"
                  checked={autoTrim}
                  onChange={(e) => setAutoTrim(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-sky-600 accent-sky-600 cursor-pointer"
                />
                <div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Scissors className="w-4 h-4 text-sky-500" />
                    <span>Auto-Trim White Borders</span>
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Detects ink strokes and removes empty paper around your signature.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                <input
                  type="checkbox"
                  checked={contrastBoost}
                  onChange={(e) => setContrastBoost(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-sky-600 accent-sky-600 cursor-pointer"
                />
                <div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Clean Background & Ink Boost</span>
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Removes phone lighting shadows and turns paper into crisp clean white.
                  </p>
                </div>
              </label>
            </div>

            {/* Target KB & Exact Dims */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Max File Size
                  </span>
                  <span className="font-mono text-sm font-bold text-sky-600 dark:text-sky-400">
                    ≤ {targetKB} KB
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="5"
                    max="100"
                    step="5"
                    value={targetKB}
                    onChange={(e) => setTargetKB(Number(e.target.value))}
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                  <span className="font-mono text-sm font-bold px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    {targetKB} KB
                  </span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  {[10, 20, 30, 50].map((kb) => (
                    <button
                      key={kb}
                      type="button"
                      onClick={() => setTargetKB(kb)}
                      className={`text-xs px-2.5 py-1 rounded-lg border font-medium ${
                        targetKB === kb
                          ? 'border-sky-600 bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {kb} KB
                    </button>
                  ))}
                </div>
              </div>

              {/* Exact dimensions */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Exact Dimensions (Portal Specs)
                  </span>
                  <label className="flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useExactDims}
                      onChange={(e) => setUseExactDims(e.target.checked)}
                      className="rounded text-sky-600 accent-sky-600"
                    />
                    <span>Enforce Exact W×H</span>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-0.5">Width (px)</label>
                    <input
                      type="number"
                      value={targetWidth}
                      disabled={!useExactDims}
                      onChange={(e) => setTargetWidth(e.target.value)}
                      className="w-full px-3 py-1.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 disabled:opacity-40"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-0.5">Height (px)</label>
                    <input
                      type="number"
                      value={targetHeight}
                      disabled={!useExactDims}
                      onChange={(e) => setTargetHeight(e.target.value)}
                      className="w-full px-3 py-1.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 disabled:opacity-40"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
                  <span>Common:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setUseExactDims(true);
                      setTargetWidth('140');
                      setTargetHeight('60');
                    }}
                    className="underline hover:text-sky-500"
                  >
                    140×60 (SSC/IBPS)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUseExactDims(true);
                      setTargetWidth('280');
                      setTargetHeight('120');
                    }}
                    className="underline hover:text-sky-500"
                  >
                    280×120 (NEET)
                  </button>
                </div>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 text-xs rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                {errorMsg}
              </div>
            )}

            {/* Action button */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleFixSignature}
                disabled={isProcessing}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-600/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing Signature...</span>
                  </>
                ) : (
                  <>
                    <FileCheck2 className="w-5 h-5" />
                    <span>Fix & Clean Signature (≤ {targetKB} KB)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {result && validation && (
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-6">
            <ValidationBadge report={validation} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-center space-y-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                  Original Photo
                </span>
                {previewUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewUrl}
                    alt="Original raw signature"
                    className="max-h-36 mx-auto object-contain rounded-xl border border-slate-200 dark:border-slate-700 bg-white"
                  />
                )}
                <div className="text-xs font-mono text-slate-600">
                  {formatBytes(file?.size || 0)}
                </div>
              </div>

              <div className="p-4 rounded-2xl border-2 border-emerald-300 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/20 text-center space-y-2">
                <div className="flex items-center justify-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Cleaned & Cropped Signature</span>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={result.url}
                  alt="Processed signature"
                  className="max-h-36 mx-auto object-contain rounded-xl border border-emerald-200 bg-white p-2 shadow-sm"
                />
                <div className="text-xs space-y-0.5">
                  <div className="font-mono font-bold text-slate-900 dark:text-white">
                    {formatBytes(result.bytes)}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Dimensions: {result.width} × {result.height} px
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-sky-500/10 to-indigo-500/10 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">
                  Signature verified under {targetKB} KB
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  White borders removed • Clean contrast • Ready for portal
                </p>
              </div>

              <button
                type="button"
                onClick={handleDownload}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition"
              >
                <Download className="w-4 h-4" />
                <span>Download Signature</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

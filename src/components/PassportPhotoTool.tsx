'use client';

import React, { useState, useRef } from 'react';
import {
  Download,
  Crop,
  Layers,
  Sparkles,
  FileCheck2,
  RefreshCw,
  Printer,
  CheckCircle2,
} from 'lucide-react';
import { DropZone } from './DropZone';
import { ValidationBadge } from './ValidationBadge';
import { generatePhotoSheet } from '@/lib/passport-sheet';
import {
  compressImageToTarget,
  loadImageElement,
  validateOutput,
  formatBytes,
} from '@/lib/image-compressor';
import { CompressionResult, ImageFormat, ValidationReport } from '@/types';
import confetti from 'canvas-confetti';

interface PassportPhotoToolProps {
  pageHeading?: string;
  pageSubheading?: string;
}

export function PassportPhotoTool({
  pageHeading = 'Passport & ID Photo Preparation',
  pageSubheading = 'Crop to standard ratios, align with face guidelines, fit portal KB limits, and generate printable sheets.',
}: PassportPhotoToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Settings
  const [aspectRatio, setAspectRatio] = useState<'3.5:4.5' | '1:1' | '3:4' | '4:5' | '2:3'>('3.5:4.5');
  const [bgColor, setBgColor] = useState<'original' | '#FFFFFF' | '#F0F9FF' | '#F3F4F6'>('original');
  const [showFaceGuide, setShowFaceGuide] = useState(true);
  const [targetKB, setTargetKB] = useState(50);
  const [outputFormat, setOutputFormat] = useState<ImageFormat>('image/jpeg');

  // Sheet generation state
  const [sheetResultUrl, setSheetResultUrl] = useState<string | null>(null);

  // Processing & results
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [validation, setValidation] = useState<ValidationReport | null>(null);

  const handleFileSelect = (files: File[]) => {
    if (!files || files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setResult(null);
    setSheetResultUrl(null);
    setValidation(null);
  };

  const handleProcessPhoto = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const img = await loadImageElement(file);

      // Determine aspect ratio multiplier
      let targetRatio = 3.5 / 4.5; // ~0.777
      if (aspectRatio === '1:1') targetRatio = 1.0;
      else if (aspectRatio === '3:4') targetRatio = 3 / 4;
      else if (aspectRatio === '4:5') targetRatio = 4 / 5;
      else if (aspectRatio === '2:3') targetRatio = 2 / 3;

      // Calculate crop from center to achieve target ratio
      const origW = img.naturalWidth;
      const origH = img.naturalHeight;
      const currentRatio = origW / origH;

      let cropW = origW;
      let cropH = origH;
      let startX = 0;
      let startY = 0;

      if (currentRatio > targetRatio) {
        // Image is wider than target ratio: crop width
        cropW = Math.round(origH * targetRatio);
        startX = Math.round((origW - cropW) / 2);
      } else {
        // Image is taller than target ratio: crop height
        cropH = Math.round(origW / targetRatio);
        startY = Math.round((origH - cropH) / 2);
      }

      // Base canvas with crop
      const canvas = document.createElement('canvas');
      canvas.width = cropW;
      canvas.height = cropH;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context unavailable');

      // If background color replacement selected, fill background
      if (bgColor !== 'original') {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, cropW, cropH);
      }

      ctx.drawImage(img, startX, startY, cropW, cropH, 0, 0, cropW, cropH);

      // Target size compression
      const maxBytes = targetKB > 0 ? targetKB * 1024 : undefined;
      const compResult = await compressImageToTarget(canvas, {
        targetMaxBytes: maxBytes,
        targetFormat: outputFormat,
      });

      setResult(compResult);

      const valReport = validateOutput(compResult, {
        maxBytes,
        expectedFormat: outputFormat,
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
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateSheet = async () => {
    if (!result) return;
    const img = await loadImageElement(result.blob);
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(img, 0, 0);

    const sheetCanvas = generatePhotoSheet(canvas, {
      paperSize: '4x6',
      copies: 8,
      showCutLines: true,
    });

    sheetCanvas.toBlob((blob) => {
      if (blob) {
        setSheetResultUrl(URL.createObjectURL(blob));
      }
    }, 'image/jpeg', 0.95);
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const a = document.createElement('a');
    a.href = result.url;
    a.download = `passport_photo_${Math.round(result.bytes / 1024)}kb.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadSheet = () => {
    if (!sheetResultUrl) return;
    const a = document.createElement('a');
    a.href = sheetResultUrl;
    a.download = `passport_4x6_photo_sheet.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleClear = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (result?.url) URL.revokeObjectURL(result.url);
    if (sheetResultUrl) URL.revokeObjectURL(sheetResultUrl);
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    setSheetResultUrl(null);
    setValidation(null);
  };

  return (
    <div className="space-y-8">
      {/* Title */}
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
          title="Drop portrait or passport photo here"
          subtitle="Align your face using our visual guide. FormReady compresses strictly to portal specifications."
        />

        {file && (
          <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            {/* Guide overlay preview */}
            <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
              <div className="relative inline-block overflow-hidden rounded-2xl border border-slate-300 dark:border-slate-600 shadow-md">
                {previewUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewUrl}
                    alt="Photo alignment view"
                    className="max-h-72 object-contain"
                  />
                )}

                {/* Face Alignment Oval Overlay */}
                {showFaceGuide && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-36 h-48 sm:w-44 sm:h-56 rounded-[50%] border-2 border-dashed border-sky-400 bg-sky-500/10 shadow-[0_0_0_9999px_rgba(0,0,0,0.35)] flex flex-col items-center justify-between py-4">
                      <span className="text-[10px] font-bold text-white bg-sky-600/90 px-2 py-0.5 rounded-full shadow">
                        Top of Head
                      </span>
                      <span className="text-[10px] font-bold text-white bg-sky-600/90 px-2 py-0.5 rounded-full shadow">
                        Chin Line
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showFaceGuide}
                    onChange={(e) => setShowFaceGuide(e.target.checked)}
                    className="rounded text-sky-600 accent-sky-600"
                  />
                  <span>Show Face Oval Alignment Guide</span>
                </label>
              </div>
            </div>

            {/* Aspect Ratio & Size Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Aspect Ratio */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Aspect Ratio
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: '3.5:4.5', label: '35×45 mm (India/EU)' },
                    { id: '1:1', label: '1:1 Square (US Visa)' },
                    { id: '3:4', label: '3:4 Portrait' },
                    { id: '4:5', label: '4:5 (NEET/JEE)' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setAspectRatio(item.id as any)}
                      className={`p-2.5 rounded-xl border text-left font-medium transition ${
                        aspectRatio === item.id
                          ? 'border-sky-600 bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Background Color Tint */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Background Color
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'original', label: 'Original' },
                    { id: '#FFFFFF', label: 'Clean White' },
                    { id: '#F0F9FF', label: 'Light Blue' },
                    { id: '#F3F4F6', label: 'Light Gray' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setBgColor(item.id as any)}
                      className={`p-2.5 rounded-xl border text-left font-medium transition ${
                        bgColor === item.id
                          ? 'border-sky-600 bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target KB limit */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Target Max KB
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[20, 50, 100, 200].map((kb) => (
                    <button
                      key={kb}
                      type="button"
                      onClick={() => setTargetKB(kb)}
                      className={`p-2.5 rounded-xl border text-center font-bold font-mono transition ${
                        targetKB === kb
                          ? 'border-sky-600 bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      ≤ {kb} KB
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action button */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleProcessPhoto}
                disabled={isProcessing}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-600/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Preparing Photo...</span>
                  </>
                ) : (
                  <>
                    <FileCheck2 className="w-5 h-5" />
                    <span>Crop & Compress Photo (≤ {targetKB} KB)</span>
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

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={result.url}
                  alt="Processed passport photo"
                  className="w-16 h-20 object-cover rounded-xl border border-emerald-300 shadow-sm"
                />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">
                    Passport Photo Ready
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatBytes(result.bytes)} • {result.width}×{result.height}px
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition flex items-center justify-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Photo</span>
                </button>

                <button
                  type="button"
                  onClick={handleGenerateSheet}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-sky-300 dark:border-sky-700 bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-bold text-xs hover:bg-sky-100 transition flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Sheet (8 Photos)</span>
                </button>
              </div>
            </div>

            {/* Printable Sheet View if generated */}
            {sheetResultUrl && (
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Printer className="w-4 h-4 text-sky-500" />
                    <span>Printable 4×6 Photo Sheet (8 passport tiles with cut lines)</span>
                  </span>
                  <button
                    onClick={handleDownloadSheet}
                    className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Sheet</span>
                  </button>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={sheetResultUrl}
                  alt="Printable 4x6 sheet preview"
                  className="max-h-56 mx-auto rounded-xl border border-slate-300 dark:border-slate-700 shadow"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

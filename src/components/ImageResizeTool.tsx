'use client';

import React, { useState, useEffect } from 'react';
import { Download, Lock, Unlock, RefreshCw, FileCheck2, Sliders, CheckCircle2 } from 'lucide-react';
import { DropZone } from './DropZone';
import { ValidationBadge } from './ValidationBadge';
import {
  compressImageToTarget,
  loadImageElement,
  validateOutput,
  formatBytes,
} from '@/lib/image-compressor';
import { CompressionResult, ImageFormat, ValidationReport } from '@/types';
import confetti from 'canvas-confetti';

export function ImageResizeTool() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Dimension settings
  const [width, setWidth] = useState<string>('600');
  const [height, setHeight] = useState<string>('600');
  const [lockAspect, setLockAspect] = useState(true);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [scalePercent, setScalePercent] = useState<number>(100);
  const [resizeMode, setResizeMode] = useState<'dimensions' | 'percent'>('dimensions');
  const [fitMode, setFitMode] = useState<'fit-inside' | 'crop-to-fill' | 'exact'>('fit-inside');
  const [format, setFormat] = useState<ImageFormat>('image/jpeg');

  // Processing & Results
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [validation, setValidation] = useState<ValidationReport | null>(null);

  const handleFileSelect = async (files: File[]) => {
    if (!files || files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);
    setResult(null);
    setValidation(null);

    try {
      const img = await loadImageElement(selected);
      setWidth(img.naturalWidth.toString());
      setHeight(img.naturalHeight.toString());
      setAspectRatio(img.naturalWidth / img.naturalHeight);
    } catch {
      // ignore
    }
  };

  const handleWidthChange = (val: string) => {
    setWidth(val);
    const num = parseFloat(val);
    if (!isNaN(num) && lockAspect && aspectRatio > 0) {
      setHeight(Math.round(num / aspectRatio).toString());
    }
  };

  const handleHeightChange = (val: string) => {
    setHeight(val);
    const num = parseFloat(val);
    if (!isNaN(num) && lockAspect && aspectRatio > 0) {
      setWidth(Math.round(num * aspectRatio).toString());
    }
  };

  const handleResize = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const img = await loadImageElement(file);

      const widthNum = resizeMode === 'dimensions' && width ? parseInt(width, 10) : undefined;
      const heightNum = resizeMode === 'dimensions' && height ? parseInt(height, 10) : undefined;

      const compResult = await compressImageToTarget(img, {
        targetFormat: format,
        dimensions: {
          width: widthNum,
          height: heightNum,
          lockAspectRatio: lockAspect,
          fitMode,
          scalePercent: resizeMode === 'percent' ? scalePercent : undefined,
        },
      });

      setResult(compResult);

      const valReport = validateOutput(compResult, {
        width: widthNum,
        height: heightNum,
        expectedFormat: format,
      });
      setValidation(valReport);

      try {
        confetti({
          particleCount: 20,
          spread: 50,
          origin: { y: 0.8 },
          disableForReducedMotion: true,
        });
      } catch {
        // ignore
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const a = document.createElement('a');
    a.href = result.url;
    const ext = format === 'image/png' ? 'png' : format === 'image/webp' ? 'webp' : 'jpg';
    a.download = `resized_${result.width}x${result.height}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Image Resizer for Online Forms
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400">
          Resize image width and height to exact pixel specifications without distortion or quality
          loss.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-8 shadow-sm space-y-6">
        <DropZone
          accept="image/jpeg,image/png,image/webp"
          onFileSelect={handleFileSelect}
          selectedFile={file}
          previewUrl={previewUrl}
          onClear={() => {
            setFile(null);
            setResult(null);
          }}
          title="Drop image here to resize"
          subtitle="Resize photos, signatures, or documents to exact portal pixel dimensions."
        />

        {file && (
          <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            {/* Mode Toggle: Dimensions vs Percentage */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setResizeMode('dimensions')}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                  resizeMode === 'dimensions'
                    ? 'border-sky-600 bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                Exact Dimensions (Pixels)
              </button>
              <button
                type="button"
                onClick={() => setResizeMode('percent')}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                  resizeMode === 'percent'
                    ? 'border-sky-600 bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                Percentage Scale (%)
              </button>
            </div>

            {resizeMode === 'dimensions' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Width (px)
                    </label>
                    <input
                      type="number"
                      value={width}
                      onChange={(e) => handleWidthChange(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Height (px)
                    </label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => handleHeightChange(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setLockAspect(!lockAspect)}
                    className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-sky-600"
                  >
                    {lockAspect ? (
                      <Lock className="w-4 h-4 text-sky-600" />
                    ) : (
                      <Unlock className="w-4 h-4 text-slate-400" />
                    )}
                    <span>Lock Aspect Ratio</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Scale Percentage
                  </span>
                  <span className="font-mono text-sm font-bold text-sky-600">{scalePercent}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="200"
                  value={scalePercent}
                  onChange={(e) => setScalePercent(Number(e.target.value))}
                  className="w-full accent-sky-600"
                />
              </div>
            )}

            {/* Format choice */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Output Format
              </span>
              <div className="flex items-center gap-2">
                {(['image/jpeg', 'image/png', 'image/webp'] as ImageFormat[]).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setFormat(fmt)}
                    className={`px-4 py-2 text-xs font-bold rounded-xl border transition ${
                      format === fmt
                        ? 'border-sky-600 bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {fmt.replace('image/', '').toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Resize button */}
            <button
              type="button"
              onClick={handleResize}
              disabled={isProcessing}
              className="w-full py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-bold text-sm shadow transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Resizing Image...</span>
                </>
              ) : (
                <>
                  <FileCheck2 className="w-5 h-5" />
                  <span>
                    Resize to {width} × {height} px
                  </span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Result & Download */}
        {result && validation && (
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-6">
            <ValidationBadge report={validation} />

            <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">
                  Image Resized Successfully
                </p>
                <p className="text-xs text-slate-500">
                  {result.width} × {result.height} px • {formatBytes(result.bytes)}
                </p>
              </div>

              <button
                type="button"
                onClick={handleDownload}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition"
              >
                <Download className="w-4 h-4" />
                <span>Download Resized Image</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

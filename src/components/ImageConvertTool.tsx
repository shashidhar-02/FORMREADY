'use client';

import React, { useState } from 'react';
import { Download, RefreshCw, FileCheck2, ArrowRight } from 'lucide-react';
import { DropZone } from './DropZone';
import { compressImageToTarget, loadImageElement, formatBytes } from '@/lib/image-compressor';
import { CompressionResult, ImageFormat } from '@/types';
import confetti from 'canvas-confetti';

export function ImageConvertTool() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState<ImageFormat>('image/jpeg');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<CompressionResult | null>(null);

  const handleFileSelect = (files: File[]) => {
    if (!files || files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setResult(null);
  };

  const handleConvert = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const img = await loadImageElement(file);
      const res = await compressImageToTarget(img, {
        targetFormat,
        quality: 0.92,
      });

      setResult(res);
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
    const ext =
      targetFormat === 'image/png' ? 'png' : targetFormat === 'image/webp' ? 'webp' : 'jpg';
    a.download = `converted_${file.name.substring(0, file.name.lastIndexOf('.')) || 'image'}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-8">
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Image Format Converter
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400">
          Convert instantly between JPG, PNG, and WebP format without uploading to a server.
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
          title="Drop image here to convert"
          subtitle="Supports PNG, JPG, JPEG, and WebP formats."
        />

        {file && (
          <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Choose Target Format
              </span>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'image/jpeg', label: 'JPG / JPEG', desc: 'Standard for all exam portals' },
                  { id: 'image/png', label: 'PNG', desc: 'Lossless quality & transparency' },
                  { id: 'image/webp', label: 'WebP', desc: 'Modern high compression' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTargetFormat(item.id as any)}
                    className={`p-3 rounded-2xl border text-left transition ${
                      targetFormat === item.id
                        ? 'border-sky-600 bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="font-bold text-sm">{item.label}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleConvert}
              disabled={isProcessing}
              className="w-full py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-bold text-sm shadow transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Converting...</span>
                </>
              ) : (
                <>
                  <FileCheck2 className="w-5 h-5" />
                  <span>Convert to {targetFormat.replace('image/', '').toUpperCase()}</span>
                </>
              )}
            </button>
          </div>
        )}

        {result && (
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-6">
            <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">
                  Converted to {result.format.replace('image/', '').toUpperCase()}
                </p>
                <p className="text-xs text-slate-500">
                  {formatBytes(result.bytes)} • {result.width} × {result.height} px
                </p>
              </div>

              <button
                type="button"
                onClick={handleDownload}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition"
              >
                <Download className="w-4 h-4" />
                <span>Download {result.format.replace('image/', '').toUpperCase()}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

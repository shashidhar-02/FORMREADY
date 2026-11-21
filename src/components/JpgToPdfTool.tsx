'use client';

import React, { useState } from 'react';
import {
  FileText,
  RotateCw,
  ArrowUp,
  ArrowDown,
  Trash2,
  Download,
  Plus,
  RefreshCw,
  FileCheck2,
} from 'lucide-react';
import { DropZone } from './DropZone';
import { imagesToPdf } from '@/lib/pdf-service';
import { formatBytes } from '@/lib/image-compressor';
import { PdfImageItem, PdfConversionOptions } from '@/types';
import confetti from 'canvas-confetti';

export function JpgToPdfTool() {
  const [items, setItems] = useState<PdfImageItem[]>([]);
  const [pageSize, setPageSize] = useState<'A4' | 'Letter' | 'Fit'>('A4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape' | 'auto'>('auto');
  const [marginMm, setMarginMm] = useState<number>(10);
  const [imageQuality, setImageQuality] = useState<number>(0.85);

  const [isGenerating, setIsGenerating] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleAddFiles = (files: File[]) => {
    const newItems: PdfImageItem[] = files.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      previewUrl: URL.createObjectURL(file),
      rotation: 0,
      width: 0,
      height: 0,
      name: file.name,
    }));
    setItems((prev) => [...prev, ...newItems]);
    setResultBlob(null);
    setResultUrl(null);
  };

  const handleRotate = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, rotation: (item.rotation + 90) % 360 } : item
      )
    );
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[targetIdx];
    newItems[targetIdx] = temp;
    setItems(newItems);
  };

  const handleRemove = (id: string) => {
    setItems((prev) => {
      const removed = prev.find((it) => it.id === id);
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return prev.filter((it) => it.id !== id);
    });
  };

  const handleGeneratePdf = async () => {
    if (items.length === 0) return;

    setIsGenerating(true);
    try {
      const blob = await imagesToPdf(items, {
        pageSize,
        orientation,
        marginMm,
        imageQuality,
        compressPdf: true,
      });

      setResultBlob(blob);
      setResultUrl(URL.createObjectURL(blob));

      try {
        confetti({
          particleCount: 25,
          spread: 60,
          origin: { y: 0.8 },
          disableForReducedMotion: true,
        });
      } catch {
        // ignore
      }
    } catch (err: any) {
      alert(`PDF generation failed: ${err?.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = `formready_document_${items.length}_pages.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Convert JPG & PNG to Single PDF
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400">
          Reorder pages, rotate sideways photos, set margins, and bundle multiple certificates into one clean PDF.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-8 shadow-sm space-y-6">
        <DropZone
          accept="image/jpeg,image/png,image/webp"
          multiple={true}
          onFileSelect={handleAddFiles}
          title="Drop multiple images or browse"
          subtitle="Select marksheets, certificates, IDs, or photographs to combine."
        />

        {items.length > 0 && (
          <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            {/* Header with page count */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {items.length} {items.length === 1 ? 'Page' : 'Pages'} Selected
              </span>
              <button
                type="button"
                onClick={() => setItems([])}
                className="text-xs text-rose-600 hover:underline"
              >
                Clear all
              </button>
            </div>

            {/* Reorderable list of image pages */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-3 flex flex-col justify-between space-y-2 relative group"
                >
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Page {idx + 1}</span>
                    <span>{formatBytes(item.file.size)}</span>
                  </div>

                  <div className="h-40 flex items-center justify-center overflow-hidden rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.previewUrl}
                      alt={`Page ${idx + 1}`}
                      style={{ transform: `rotate(${item.rotation}deg)` }}
                      className="max-h-full max-w-full object-contain transition-transform duration-200"
                    />
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 truncate max-w-full">
                    {item.name}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMove(idx, 'up')}
                        disabled={idx === 0}
                        aria-label="Move page up"
                        className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMove(idx, 'down')}
                        disabled={idx === items.length - 1}
                        aria-label="Move page down"
                        className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRotate(item.id)}
                      className="flex items-center gap-1 text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:text-sky-600 px-2 py-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700"
                    >
                      <RotateCw className="w-3 h-3" />
                      <span>{item.rotation}°</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemove(item.id)}
                      aria-label="Remove page"
                      className="p-1 rounded text-slate-400 hover:text-rose-500 hover:bg-slate-200 dark:hover:bg-slate-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Layout Options */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Page Size
                </label>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                >
                  <option value="A4">A4 Standard (Govt Forms)</option>
                  <option value="Letter">US Letter</option>
                  <option value="Fit">Fit to Image</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Orientation
                </label>
                <select
                  value={orientation}
                  onChange={(e) => setOrientation(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                >
                  <option value="auto">Auto (Match Image)</option>
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Margins
                </label>
                <select
                  value={marginMm}
                  onChange={(e) => setMarginMm(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                >
                  <option value={0}>No Margins (0 mm)</option>
                  <option value={5}>Narrow (5 mm)</option>
                  <option value={10}>Standard (10 mm)</option>
                  <option value={20}>Wide (20 mm)</option>
                </select>
              </div>
            </div>

            {/* Generate button */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleGeneratePdf}
                disabled={isGenerating}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-600/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Compiling PDF Document...</span>
                  </>
                ) : (
                  <>
                    <FileCheck2 className="w-5 h-5" />
                    <span>Create PDF ({items.length} Pages)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* PDF Download Area */}
        {resultBlob && (
          <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">
                  PDF Generated Successfully
                </p>
                <p className="text-xs text-slate-500">
                  {formatBytes(resultBlob.size)} • {items.length} Pages • Form Ready
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownload}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { FileText, Download, RefreshCw, CheckCircle2, AlertCircle, Minimize2 } from 'lucide-react';
import { DropZone } from './DropZone';
import { compressPdfDocument } from '@/lib/pdf-service';
import { formatBytes } from '@/lib/image-compressor';
import confetti from 'canvas-confetti';

export function PdfCompressTool() {
  const [file, setFile] = useState<File | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [result, setResult] = useState<{
    blob: Blob;
    url: string;
    originalSize: number;
    newSize: number;
    reductionPercent: number;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileSelect = (files: File[]) => {
    if (!files || files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    setResult(null);
    setErrorMsg(null);
  };

  const handleCompress = async () => {
    if (!file) return;
    setIsCompressing(true);
    setErrorMsg(null);

    try {
      const res = await compressPdfDocument(file);
      const url = URL.createObjectURL(res.blob);
      setResult({
        ...res,
        url,
      });

      if (res.reductionPercent > 0) {
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
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Compression failed');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const a = document.createElement('a');
    a.href = result.url;
    a.download = `compressed_${file.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Browser-Based PDF Compressor
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400">
          Optimize PDF object streams and structure locally without uploading your documents to a
          remote server.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-8 shadow-sm space-y-6">
        <DropZone
          accept="application/pdf"
          onFileSelect={handleFileSelect}
          selectedFile={file}
          onClear={() => {
            setFile(null);
            setResult(null);
          }}
          title="Drop PDF file here to compress"
          subtitle="FormReady performs structural stream optimization directly in your browser."
        />

        {file && (
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleCompress}
              disabled={isCompressing}
              className="w-full py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-bold text-sm shadow transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isCompressing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Compressing PDF locally...</span>
                </>
              ) : (
                <>
                  <Minimize2 className="w-4 h-4" />
                  <span>Compress PDF ({formatBytes(file.size)})</span>
                </>
              )}
            </button>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 text-xs rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
            {errorMsg}
          </div>
        )}

        {/* Results Panel */}
        {result && (
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-6 animate-in fade-in">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-500 block">Original Size</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-base">
                  {formatBytes(result.originalSize)}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-500 block">Output Size</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-base">
                  {formatBytes(result.newSize)}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-500 block">Reduction</span>
                <span className="font-mono font-bold text-sky-600 dark:text-sky-400 text-base">
                  {result.reductionPercent > 0 ? `-${result.reductionPercent}%` : 'Optimized'}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-500 block">Status</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                  ✓ Ready
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">
                  PDF Compressed Locally
                </p>
                <p className="text-xs text-slate-500">
                  Streams packed with object streams • No cloud server upload
                </p>
              </div>

              <button
                type="button"
                onClick={handleDownload}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition"
              >
                <Download className="w-4 h-4" />
                <span>Download Compressed PDF</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

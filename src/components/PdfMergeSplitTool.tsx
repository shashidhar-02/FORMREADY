'use client';

import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Download,
  RefreshCw,
  Scissors,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { DropZone } from './DropZone';
import { mergePdfFiles, extractPdfPages } from '@/lib/pdf-service';
import { formatBytes } from '@/lib/image-compressor';
import { PDFDocument } from 'pdf-lib';
import confetti from 'canvas-confetti';

interface PdfMergeSplitToolProps {
  mode: 'merge' | 'split';
}

export function PdfMergeSplitTool({ mode }: PdfMergeSplitToolProps) {
  // Merge state
  const [mergeFiles, setMergeFiles] = useState<File[]>([]);

  // Split state
  const [splitFile, setSplitFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pageRangeInput, setPageRangeInput] = useState<string>('1');

  // Common processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleMergeFilesAdd = (files: File[]) => {
    setMergeFiles((prev) => [...prev, ...files]);
    setResultBlob(null);
    setResultUrl(null);
  };

  const handleSplitFileAdd = async (files: File[]) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setSplitFile(file);
    setResultBlob(null);
    setResultUrl(null);
    setErrorMsg(null);

    try {
      const buf = await file.arrayBuffer();
      const doc = await PDFDocument.load(buf, { ignoreEncryption: true });
      const count = doc.getPageCount();
      setTotalPages(count);
      setPageRangeInput(count > 1 ? `1-${count}` : '1');
    } catch (err: any) {
      setErrorMsg(`Could not read PDF: ${err?.message}`);
    }
  };

  const handleMoveMergeFile = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= mergeFiles.length) return;
    const updated = [...mergeFiles];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setMergeFiles(updated);
  };

  const handleRemoveMergeFile = (index: number) => {
    setMergeFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleExecuteMerge = async () => {
    if (mergeFiles.length < 2) return;
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const blob = await mergePdfFiles(mergeFiles);
      setResultBlob(blob);
      setResultUrl(URL.createObjectURL(blob));
      confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.8 },
        disableForReducedMotion: true,
      });
    } catch (err: any) {
      setErrorMsg(err?.message || 'Merge failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const parsePageRange = (input: string, max: number): number[] => {
    const pages = new Set<number>();
    const parts = input.split(',').map((p) => p.trim());

    for (const part of parts) {
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-').map((s) => s.trim());
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end)) {
          for (let p = Math.max(1, start); p <= Math.min(max, end); p++) {
            pages.add(p - 1); // 0-based
          }
        }
      } else {
        const p = parseInt(part, 10);
        if (!isNaN(p) && p >= 1 && p <= max) {
          pages.add(p - 1);
        }
      }
    }
    return Array.from(pages).sort((a, b) => a - b);
  };

  const handleExecuteSplit = async () => {
    if (!splitFile || totalPages === 0) return;
    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const indices = parsePageRange(pageRangeInput, totalPages);
      if (indices.length === 0) {
        throw new Error(`Invalid page range. Choose page numbers between 1 and ${totalPages}.`);
      }

      const blob = await extractPdfPages(splitFile, indices);
      setResultBlob(blob);
      setResultUrl(URL.createObjectURL(blob));
      confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.8 },
        disableForReducedMotion: true,
      });
    } catch (err: any) {
      setErrorMsg(err?.message || 'Split failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = mode === 'merge' ? 'merged_document.pdf' : 'split_document.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {mode === 'merge' ? 'Merge Multiple PDF Documents' : 'Split & Extract PDF Pages'}
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400">
          {mode === 'merge'
            ? 'Combine multiple PDF certificates and application forms into one single document.'
            : 'Extract selected pages from a multi-page PDF directly in your browser without uploading.'}
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-8 shadow-sm space-y-6">
        {mode === 'merge' ? (
          // Merge UI
          <>
            <DropZone
              accept="application/pdf"
              multiple={true}
              onFileSelect={handleMergeFilesAdd}
              title="Drop PDF files here to merge"
              subtitle="Select two or more PDF files to combine."
            />

            {mergeFiles.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {mergeFiles.length} PDFs Added
                  </span>
                  <button
                    type="button"
                    onClick={() => setMergeFiles([])}
                    className="text-xs text-rose-600 hover:underline"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-2">
                  {mergeFiles.map((f, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <span className="font-bold text-slate-400">#{idx + 1}</span>
                        <FileText className="w-4 h-4 text-sky-500 shrink-0" />
                        <span className="font-medium text-slate-900 dark:text-white truncate">
                          {f.name}
                        </span>
                        <span className="text-slate-400 shrink-0">({formatBytes(f.size)})</span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleMoveMergeFile(idx, 'up')}
                          disabled={idx === 0}
                          aria-label="Move file up"
                          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveMergeFile(idx, 'down')}
                          disabled={idx === mergeFiles.length - 1}
                          aria-label="Move file down"
                          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveMergeFile(idx)}
                          aria-label="Remove file"
                          className="p-1 text-slate-400 hover:text-rose-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleExecuteMerge}
                  disabled={isProcessing || mergeFiles.length < 2}
                  className="w-full py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Merging Documents...</span>
                    </>
                  ) : (
                    <>
                      <Layers className="w-4 h-4" />
                      <span>Merge {mergeFiles.length} PDFs</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          // Split UI
          <>
            <DropZone
              accept="application/pdf"
              multiple={false}
              onFileSelect={handleSplitFileAdd}
              selectedFile={splitFile}
              onClear={() => {
                setSplitFile(null);
                setTotalPages(0);
                setResultBlob(null);
              }}
              title="Drop PDF here to split or extract"
              subtitle="Choose the PDF from which you need specific pages."
            />

            {splitFile && totalPages > 0 && (
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      Document Page Count:{' '}
                      <strong className="text-slate-900 dark:text-white">{totalPages} Pages</strong>
                    </span>
                    <span className="text-slate-400">
                      Total size: {formatBytes(splitFile.size)}
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Pages to Extract (e.g. 1, 3-5)
                    </label>
                    <input
                      type="text"
                      value={pageRangeInput}
                      onChange={(e) => setPageRangeInput(e.target.value)}
                      placeholder="e.g. 1-2, 5"
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Enter individual page numbers separated by commas, or ranges with hyphens.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleExecuteSplit}
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Extracting Pages...</span>
                    </>
                  ) : (
                    <>
                      <Scissors className="w-4 h-4" />
                      <span>Extract Selected Pages</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}

        {errorMsg && (
          <div className="p-3 text-xs rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
            {errorMsg}
          </div>
        )}

        {/* Result & Download */}
        {resultBlob && (
          <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">
                  {mode === 'merge' ? 'PDFs Merged Successfully' : 'Pages Extracted Successfully'}
                </p>
                <p className="text-xs text-slate-500">
                  {formatBytes(resultBlob.size)} • Verified client-side
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

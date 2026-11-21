'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { UploadCloud, Camera, Image as ImageIcon, FileText, X } from 'lucide-react';
import { formatBytes } from '@/lib/image-compressor';
import { useLanguage } from '@/context/LanguageContext';

interface DropZoneProps {
  accept?: string;
  multiple?: boolean;
  onFileSelect: (files: File[]) => void;
  selectedFile?: File | null;
  onClear?: () => void;
  title?: string;
  subtitle?: string;
  previewUrl?: string | null;
  allowCamera?: boolean;
}

export function DropZone({
  accept = 'image/jpeg,image/png,image/webp,application/pdf',
  multiple = false,
  onFileSelect,
  selectedFile,
  onClear,
  title,
  subtitle,
  previewUrl,
  allowCamera = true,
}: DropZoneProps) {
  const { t } = useLanguage();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (files: FileList | File[] | null) => {
      if (!files || files.length === 0) return;
      const fileList = Array.from(files);
      if (multiple) {
        onFileSelect(fileList);
      } else {
        onFileSelect([fileList[0]]);
      }
    },
    [multiple, onFileSelect]
  );

  // Global paste handler (Ctrl+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (!e.clipboardData) return;
      const items = e.clipboardData.items;
      const pastedFiles: File[] = [];

      for (let i = 0; i < items.length; i++) {
        if (items[i].kind === 'file') {
          const file = items[i].getAsFile();
          if (file) pastedFiles.push(file);
        }
      }

      if (pastedFiles.length > 0) {
        handleFiles(pastedFiles);
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [handleFiles]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {allowCamera && (
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      )}

      {selectedFile && !multiple ? (
        // File is selected view
        <div className="relative rounded-2xl border-2 border-sky-300 dark:border-sky-800 bg-sky-50/50 dark:bg-sky-950/20 p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt="Selected preview"
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-sky-100 dark:bg-sky-900/60 flex items-center justify-center text-sky-600 dark:text-sky-300">
                {selectedFile.type.includes('pdf') ? (
                  <FileText className="w-8 h-8" />
                ) : (
                  <ImageIcon className="w-8 h-8" />
                )}
              </div>
            )}
            <div className="overflow-hidden">
              <p className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base truncate max-w-xs sm:max-w-md">
                {selectedFile.name}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {formatBytes(selectedFile.size)}
                </span>
                <span className="text-xs text-slate-500 uppercase">
                  {selectedFile.type.replace('image/', '').replace('application/', '')}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-2 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            >
              Change File
            </button>
            {onClear && (
              <button
                onClick={onClear}
                aria-label="Remove selected file"
                className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      ) : (
        // Drop area
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200 p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-3 ${
            isDragging
              ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 scale-[1.01]'
              : 'border-slate-300 dark:border-slate-700 hover:border-sky-400 dark:hover:border-sky-600 bg-white dark:bg-slate-900/80 shadow-sm'
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-100 dark:border-sky-900 flex items-center justify-center text-sky-600 dark:text-sky-400 mb-1">
            <UploadCloud className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {title || t('drop_title', 'Drop file here')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md">
              {subtitle || t('drop_subtitle', 'or click to browse from device, or paste from clipboard (Ctrl+V)')}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-medium text-xs sm:text-sm shadow-sm transition">
              Choose File
            </span>

            {allowCamera && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  cameraInputRef.current?.click();
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium text-xs sm:text-sm transition"
              >
                <Camera className="w-4 h-4 text-slate-500" />
                <span>Camera</span>
              </button>
            )}
          </div>

          <p className="text-[11px] text-slate-400 mt-1">
            Supports JPG, PNG, WebP, PDF • Never uploaded to any server
          </p>
        </div>
      )}
    </div>
  );
}

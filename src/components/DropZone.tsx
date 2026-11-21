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
    [multiple, onFileSelect],
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
        // File selected preview card
        <div className="relative rounded-3xl border-2 border-sky-400/60 dark:border-sky-500/50 bg-gradient-to-r from-sky-50/60 to-indigo-50/40 dark:from-sky-950/30 dark:to-indigo-950/20 p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt="Selected preview"
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-2xl border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xs"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-sky-100 dark:bg-sky-900/60 flex items-center justify-center text-sky-600 dark:text-sky-300">
                {selectedFile.type.includes('pdf') ? (
                  <FileText className="w-8 h-8" />
                ) : (
                  <ImageIcon className="w-8 h-8" />
                )}
              </div>
            )}
            <div className="overflow-hidden">
              <p className="font-bold text-slate-900 dark:text-white text-sm sm:text-base truncate max-w-xs sm:max-w-md">
                {selectedFile.name}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                  {formatBytes(selectedFile.size)}
                </span>
                <span className="text-xs text-slate-500 uppercase font-medium">
                  {selectedFile.type.replace('image/', '').replace('application/', '')}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-xs transition"
            >
              {t('btn_change_file', 'Change File')}
            </button>
            {onClear && (
              <button
                onClick={onClear}
                aria-label="Remove selected file"
                className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      ) : (
        // Drop area with inviting, high-trust psychological design
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`group relative cursor-pointer rounded-3xl border-2 border-dashed transition-all duration-300 p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-3.5 ${
            isDragging
              ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 scale-[1.01] shadow-lg shadow-sky-500/10'
              : 'border-slate-300/80 dark:border-slate-700/80 hover:border-sky-400 dark:hover:border-sky-500 bg-white/80 dark:bg-slate-900/60 hover:bg-sky-50/20 dark:hover:bg-sky-950/20 shadow-xs'
          }`}
        >
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/25 group-hover:scale-110 transition-transform duration-300">
            <UploadCloud className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
              {title || t('drop_title', 'Drop image here or choose file')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              {subtitle ||
                t(
                  'drop_subtitle',
                  'Supports JPG, PNG, WebP. Analyzed & compressed strictly in your browser.',
                )}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
            <span className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-600/25 transition">
              {t('btn_choose_file', 'Choose File')}
            </span>

            {allowCamera && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  cameraInputRef.current?.click();
                }}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-semibold text-xs sm:text-sm transition"
              >
                <Camera className="w-4 h-4 text-slate-500" />
                <span>{t('btn_camera', 'Camera')}</span>
              </button>
            )}
          </div>

          <p className="text-[11px] text-slate-400 font-medium">
            {t('drop_note', 'Supports JPG, PNG, WebP, PDF • Never uploaded to any server')}
          </p>
        </div>
      )}
    </div>
  );
}

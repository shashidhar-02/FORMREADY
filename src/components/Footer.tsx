'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, FileCheck2, Trash2, Heart, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export function Footer() {
  const { t } = useLanguage();
  const [clearedMsg, setClearedMsg] = useState(false);

  const handleClearData = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      setClearedMsg(true);
      setTimeout(() => setClearedMsg(false), 3000);
    } catch {
      // ignore
    }
  };

  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
        {/* Brand & Privacy Statement */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-lg">
            <div className="w-7 h-7 rounded-lg bg-sky-600 flex items-center justify-center text-white">
              <FileCheck2 className="w-4 h-4" />
            </div>
            Form<span className="text-sky-600 dark:text-sky-400">Ready</span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
            {t(
              'footer_desc',
              'The browser-first file preparation utility for government examinations, college admissions, visas, and recruitment portals.',
            )}
          </p>
          <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>{t('footer_privacy', 'Zero server uploads. 100% client-side execution.')}</span>
          </div>
          <div className="pt-1">
            <button
              onClick={handleClearData}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition"
              title="Clears saved preferences from browser storage"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>
                {clearedMsg
                  ? 'Local storage cleared!'
                  : t('clear_local_data', 'Clear local data & preferences')}
              </span>
            </button>
          </div>
        </div>

        {/* Compression Tools */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
            Compress Images
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/compress-image" className="hover:text-sky-600 dark:hover:text-sky-400">
                Target Size Compressor
              </Link>
            </li>
            <li>
              <Link
                href="/compress-image-to-20kb"
                className="hover:text-sky-600 dark:hover:text-sky-400"
              >
                Compress to 20 KB
              </Link>
            </li>
            <li>
              <Link
                href="/compress-image-to-50kb"
                className="hover:text-sky-600 dark:hover:text-sky-400"
              >
                Compress to 50 KB
              </Link>
            </li>
            <li>
              <Link
                href="/compress-image-to-100kb"
                className="hover:text-sky-600 dark:hover:text-sky-400"
              >
                Compress to 100 KB
              </Link>
            </li>
            <li>
              <Link
                href="/compress-image-to-200kb"
                className="hover:text-sky-600 dark:hover:text-sky-400"
              >
                Compress to 200 KB
              </Link>
            </li>
            <li>
              <Link
                href="/compress-image-to-500kb"
                className="hover:text-sky-600 dark:hover:text-sky-400"
              >
                Compress to 500 KB
              </Link>
            </li>
          </ul>
        </div>

        {/* Edit & Photos */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
            Photo & Signature
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/resize-signature" className="hover:text-sky-600 dark:hover:text-sky-400">
                Signature Auto-Trim
              </Link>
            </li>
            <li>
              <Link
                href="/signature-to-20kb"
                className="hover:text-sky-600 dark:hover:text-sky-400"
              >
                Signature to 20 KB
              </Link>
            </li>
            <li>
              <Link href="/resize-photo" className="hover:text-sky-600 dark:hover:text-sky-400">
                Passport Photo Resizer
              </Link>
            </li>
            <li>
              <Link href="/resize-image" className="hover:text-sky-600 dark:hover:text-sky-400">
                Exact Dimension Resize
              </Link>
            </li>
            <li>
              <Link href="/convert-image" className="hover:text-sky-600 dark:hover:text-sky-400">
                Format Converter (JPG/PNG)
              </Link>
            </li>
          </ul>
        </div>

        {/* PDF Tools & Legal */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
            PDF Suite & Legal
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/jpg-to-pdf" className="hover:text-sky-600 dark:hover:text-sky-400">
                Images to PDF
              </Link>
            </li>
            <li>
              <Link href="/merge-pdf" className="hover:text-sky-600 dark:hover:text-sky-400">
                Merge PDF Files
              </Link>
            </li>
            <li>
              <Link href="/split-pdf" className="hover:text-sky-600 dark:hover:text-sky-400">
                Split & Reorder PDF
              </Link>
            </li>
            <li>
              <Link href="/compress-pdf" className="hover:text-sky-600 dark:hover:text-sky-400">
                Compress PDF
              </Link>
            </li>
            <li>
              <Link
                href="/privacy"
                className="hover:text-sky-600 dark:hover:text-sky-400 font-semibold text-slate-900 dark:text-white"
              >
                Privacy Guarantee
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-sky-600 dark:hover:text-sky-400">
                About & Architecture
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-100 dark:border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <p>© {new Date().getFullYear()} FormReady. Released under the MIT License.</p>
        <p className="flex items-center gap-1 text-slate-500">
          Built for privacy-first public utility. Works offline once loaded.
        </p>
      </div>
    </footer>
  );
}

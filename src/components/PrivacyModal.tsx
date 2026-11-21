'use client';

import React from 'react';
import { ShieldCheck, Lock, X, CheckCircle, ServerOff, Cpu, HardDrive } from 'lucide-react';
import Link from 'next/link';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3
              id="privacy-modal-title"
              className="text-xl font-bold text-slate-900 dark:text-white"
            >
              Zero-Upload Architecture
            </h3>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" /> 100% Client-Side Processing
            </p>
          </div>
        </div>

        <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
          <p className="font-medium text-slate-900 dark:text-slate-100">
            “Your files are processed strictly in this browser. FormReady does not upload your files
            to a processing server.”
          </p>

          <div className="grid grid-cols-1 gap-2.5 pt-2">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <ServerOff className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900 dark:text-white text-xs">
                  No Server Endpoints
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  We do not have backend API routes or file storage. Files never touch a cloud
                  server.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <Cpu className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900 dark:text-white text-xs">
                  Your Device Does the Work
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Image compression, PDF merging, and signature trimming run via browser Canvas and
                  WebAssembly.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <HardDrive className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900 dark:text-white text-xs">
                  No Tracking or Accounts
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  No cookies, no analytics tracking, no sign-up forms, and no watermarks.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <Link
            href="/privacy"
            onClick={onClose}
            className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
          >
            Read Full Privacy Audit →
          </Link>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-sky-600 dark:hover:bg-sky-500 text-xs font-medium rounded-lg transition"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
}

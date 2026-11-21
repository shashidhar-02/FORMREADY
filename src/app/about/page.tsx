import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  FileCheck2,
  CheckCircle2,
  Lock,
  Zap,
  Globe,
  ArrowRight,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About FormReady - The Browser-First Utility',
  description:
    'Learn about FormReady, an open-source public utility designed to fix rejected online application photos, signatures, and PDFs without server uploads.',
  alternates: {
    canonical: 'https://formready.vercel.app/about',
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 text-xs font-semibold">
          <FileCheck2 className="w-4 h-4 text-sky-600" />
          <span>Open-Source Public Utility</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          About FormReady
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Built for students, job applicants, and citizens whose documents are rejected by online portals due to incorrect dimensions, file sizes, or formats.
        </p>
      </div>

      <div className="prose dark:prose-invert max-w-none space-y-6 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          The Problem We Solve
        </h2>
        <p>
          Every day, millions of applicants attempting to submit forms for government examinations (UPSC, SSC, Railways, State PSCs), university admissions (NEET, JEE, CUET), visas, and corporate jobs face cryptic rejection errors:
        </p>
        <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-700 dark:text-slate-300">
          <li><strong>“File size exceeds 50 KB limit”</strong></li>
          <li><strong>“Signature dimensions must be exactly 140x60 pixels”</strong></li>
          <li><strong>“Upload one consolidated PDF instead of multiple images”</strong></li>
          <li><strong>“Invalid format: JPG required (got PNG or WebP)”</strong></li>
          <li><strong>“Signature is too faint or has excessive white paper margins”</strong></li>
        </ul>
        <p>
          Conventional online converters either demand signups, slap watermarks, lock downloads behind paywalls, or upload confidential personal identification documents to unverified cloud servers.
        </p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-4">
          The FormReady Solution
        </h2>
        <p>
          FormReady operates with a strict, non-negotiable architecture: <strong>all processing happens inside your browser.</strong> Vercel is used solely to host static HTML, CSS, and JavaScript bundles. Zero bytes of your photos, signatures, or marksheet PDFs ever reach a remote server.
        </p>

        <div className="p-6 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            Core Principles
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>No signup or accounts</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>No subscription or paywalls</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>No watermarks</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>No server uploads</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Works offline once loaded</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Open-source under MIT License</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Metadata } from 'next';
import {
  ShieldCheck,
  ServerOff,
  Cpu,
  HardDrive,
  EyeOff,
  FileCheck2,
  Lock,
  Code,
  CheckCircle,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy & Zero-Upload Security Model - FormReady',
  description:
    'FormReady is built on a 100% client-side privacy model. Zero file uploads, no database, no advertising tracking, no account requirements.',
  alternates: {
    canonical: 'https://formready.vercel.app/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Auditable Client-Only Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Privacy Policy & Architecture
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          We believe personal identification documents, handwritten signatures, and academic certificates should never be uploaded to third-party conversion servers.
        </p>
      </div>

      {/* Core Privacy Guarantees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mb-3">
            <ServerOff className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            1. Zero File Uploads
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            FormReady has NO file-processing backend API routes. When you select or drag a file, it is decoded solely inside your browser using HTML5 Canvas, ImageBitmap, and WebAssembly.
          </p>
        </div>

        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center mb-3">
            <HardDrive className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            2. No Database for Uploaded Files
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Because files are never transmitted across the network, there is no cloud bucket (S3/GCS), database, or temporary storage folder where files could be intercepted or retained.
          </p>
        </div>

        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mb-3">
            <EyeOff className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            3. No Advertising Trackers or Cookies
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            FormReady does not run Google Analytics, Meta Pixel, Hotjar, or third-party behavioral trackers. No cookies are used to track your activity across sessions.
          </p>
        </div>

        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mb-3">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            4. No Third-Party AI APIs
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Your photos and signatures are never forwarded to OpenAI, Google Cloud Vision, or any remote AI API. Algorithms run deterministically on local device hardware.
          </p>
        </div>
      </div>

      {/* Detailed Technical Explanation */}
      <section className="p-6 sm:p-8 rounded-3xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Code className="w-5 h-5 text-sky-500" />
          <span>How to Audit & Verify Local Processing</span>
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          You don’t have to take our word for it. You can inspect the network requests yourself in any browser:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          <li>Open your browser Developer Tools (<kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border">F12</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border">Ctrl+Shift+I</kbd>).</li>
          <li>Navigate to the <strong>Network</strong> tab.</li>
          <li>Drag or select a 5 MB image or PDF and click <strong>Compress</strong>.</li>
          <li>Notice that <strong>zero outbound network requests</strong> are initiated during compression, cropping, or PDF merging.</li>
          <li>You can also disconnect from Wi-Fi or turn on Airplane Mode: FormReady continues working seamlessly offline.</li>
        </ol>
      </section>

      {/* Local Storage & Preferences */}
      <section className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Browser Cache & Local Settings
        </h2>
        <p className="leading-relaxed">
          FormReady stores non-sensitive user interface preferences (such as your preferred language: English, Hindi, or Telugu, and light/dark theme preference) in your browser’s standard <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono">localStorage</code>. No uploaded photos or documents are ever permanently saved to browser storage unless you explicitly choose to download them.
        </p>
        <p className="leading-relaxed">
          You can clear all stored preferences at any time by clicking <strong>“Clear local data”</strong> in the footer.
        </p>
      </section>
    </div>
  );
}

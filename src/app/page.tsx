import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle,
  Zap,
  Lock,
  ArrowRight,
  FileCheck2,
  FileText,
  Sliders,
  Sparkles,
  Scissors,
  Layers,
  Minimize2,
} from 'lucide-react';
import { ImageCompressorTool } from '@/components/ImageCompressorTool';
import { TOOL_ROUTES } from '@/lib/constants';

export default function HomePage() {
  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-4 pt-4 sm:pt-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 text-xs font-semibold shadow-xs">
          <Zap className="w-3.5 h-3.5 text-sky-500 shrink-0" />
          <span>Zero Server Uploads • Instant Browser Processing</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
          Your form rejected the file? <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-500">
            Fix it here.
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
          No signup. No subscription. No watermark. No upload. <br />
          Your photos, signatures, and documents stay strictly in your browser.
        </p>

        {/* Quick tool pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
          <Link
            href="/compress-image-to-20kb"
            className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-500 font-medium transition"
          >
            Compress to 20 KB
          </Link>
          <Link
            href="/compress-image-to-50kb"
            className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-500 font-medium transition"
          >
            Compress to 50 KB
          </Link>
          <Link
            href="/resize-signature"
            className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-500 font-medium transition"
          >
            Signature Auto-Trim
          </Link>
          <Link
            href="/resize-photo"
            className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-500 font-medium transition"
          >
            Passport Photo
          </Link>
          <Link
            href="/jpg-to-pdf"
            className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-500 font-medium transition"
          >
            JPG to PDF
          </Link>
        </div>
      </section>

      {/* Main Interactive Tool right on landing page */}
      <section className="max-w-4xl mx-auto">
        <ImageCompressorTool
          initialTargetKB={50}
          initialFormat="image/jpeg"
        />
      </section>

      {/* Trust & Privacy Strip */}
      <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 sm:p-10 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                100% Client-Side Privacy
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Zero bytes leave your browser. Processing runs in browser memory using HTML5 Canvas & WebAssembly.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Binary-Search Target Guarantee
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                We never guess quality. Our algorithm iterates until the actual file size is safely below your portal limit.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Instant & Free Forever
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                No login walls, no payment requests, no watermarks, and works offline once loaded.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="space-y-8 max-w-4xl mx-auto">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            How FormReady Solves File Rejections
          </h2>
          <p className="text-sm text-slate-500 max-w-lg mx-auto">
            Solve government examination, university, and visa portal rejections in under 30 seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            {
              num: '1',
              title: 'Upload or Paste',
              desc: 'Drag your rejected photo, phone snapshot, signature, or PDF. Even paste from clipboard (Ctrl+V).',
            },
            {
              num: '2',
              title: 'Choose Target',
              desc: 'Select your portal requirement (e.g. 50 KB, 20 KB, UPSC, SSC, NEET, or custom dimensions).',
            },
            {
              num: '3',
              title: 'Exact Verification',
              desc: 'FormReady adjusts quality and dimensions iteratively, validating actual byte size before you download.',
            },
            {
              num: '4',
              title: 'Download & Submit',
              desc: 'Get a clean, portal-compliant JPG or PDF that will not get rejected by automated validators.',
            },
          ].map((item) => (
            <div
              key={item.num}
              className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs space-y-2"
            >
              <span className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs flex items-center justify-center">
                {item.num}
              </span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">{item.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Tools Grid */}
      <section className="space-y-8 max-w-5xl mx-auto">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            All File Preparation Tools
          </h2>
          <p className="text-sm text-slate-500">
            Dedicated utilities engineered for specific portal rejection reasons.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOOL_ROUTES.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-sky-500 dark:hover:border-sky-500 transition shadow-xs group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition">
                  {tool.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {tool.desc}
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-sky-600 dark:text-sky-400">
                <span>Open Tool</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-500">
            Everything you need to know about preparing your application files safely.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'How does FormReady compress files without uploading them to a server?',
              a: 'FormReady uses the HTML5 Canvas API and WebAssembly directly in your web browser. When you select a photo, your computer or phone decodes the image, runs the optimization algorithms locally in memory, and creates the downloadable file. Zero bytes are uploaded.',
            },
            {
              q: 'Why did my government application form reject my file even though it looked right?',
              a: 'Online portals use strict automated validators. Common reasons for rejection include: file size being even 0.1 KB over the limit (e.g. 50.4 KB when 50 KB was required), wrong MIME type (PNG instead of JPG), dimensions slightly off aspect ratio, or phone EXIF rotation metadata causing sideways display.',
            },
            {
              q: 'What is the target safety margin in FormReady?',
              a: 'When you choose a target such as 50 KB, FormReady aims approximately 3-4% below that ceiling (e.g. 48.5 KB - 49.2 KB). This prevents file system cluster rounding or portal parser variance from causing a rejection.',
            },
            {
              q: 'Can FormReady fix faint or shadowy signatures taken from a phone camera?',
              a: 'Yes! Our Signature Fixer includes an auto-trim algorithm that removes excessive white paper margins and boosts contrast, converting shadows and yellowish phone paper into clean pure white while sharpening black or blue ink strokes.',
            },
            {
              q: 'Will this work on a mobile phone without internet after loading?',
              a: 'Yes. Once the web application is loaded in your browser, all image compression and signature processing continues functioning completely offline because no server backend is required.',
            },
          ].map((faq, idx) => (
            <details
              key={idx}
              className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 transition cursor-pointer"
            >
              <summary className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white list-none flex items-center justify-between">
                <span>{faq.q}</span>
                <span className="text-sky-500 group-open:rotate-180 transition-transform">
                  ↓
                </span>
              </summary>
              <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

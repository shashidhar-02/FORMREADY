'use client';

import React, { useState } from 'react';
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
  ChevronDown,
  Clock,
  Sparkle,
} from 'lucide-react';
import { ImageCompressorTool } from '@/components/ImageCompressorTool';
import { TOOL_ROUTES } from '@/lib/constants';
import { useLanguage } from '@/context/LanguageContext';

export default function HomePage() {
  const { t } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const steps = [
    {
      num: '1',
      title: t('step1_title', 'Upload or Paste'),
      desc: t('step1_desc', 'Drag your rejected photo, phone snapshot, signature, or PDF. Even paste from clipboard (Ctrl+V).'),
    },
    {
      num: '2',
      title: t('step2_title', 'Choose Target'),
      desc: t('step2_desc', 'Select your portal requirement (e.g. 50 KB, 20 KB, UPSC, SSC, NEET, or custom dimensions).'),
    },
    {
      num: '3',
      title: t('step3_title', 'Exact Verification'),
      desc: t('step3_desc', 'FormReady adjusts quality and dimensions iteratively, validating actual byte size before you download.'),
    },
    {
      num: '4',
      title: t('step4_title', 'Download & Submit'),
      desc: t('step4_desc', 'Get a clean, portal-compliant JPG or PDF that will not get rejected by automated validators.'),
    },
  ];

  const faqs = [
    {
      q: t('faq1_q', 'How does FormReady compress files without uploading them to a server?'),
      a: t('faq1_a', 'FormReady uses the HTML5 Canvas API and WebAssembly directly in your web browser. When you select a photo, your computer or phone decodes the image, runs the optimization algorithms locally in memory, and creates the downloadable file. Zero bytes are uploaded.'),
    },
    {
      q: t('faq2_q', 'Why did my government application form reject my file even though it looked right?'),
      a: t('faq2_a', 'Online portals use strict automated validators. Common reasons for rejection include: file size being even 0.1 KB over the limit (e.g. 50.4 KB when 50 KB was required), wrong MIME type (PNG instead of JPG), dimensions slightly off aspect ratio, or phone EXIF rotation metadata causing sideways display.'),
    },
    {
      q: t('faq3_q', 'What is the target safety margin in FormReady?'),
      a: t('faq3_a', 'When you choose a target such as 50 KB, FormReady aims approximately 3-4% below that ceiling (e.g. 48.5 KB - 49.2 KB). This prevents file system cluster rounding or portal parser variance from causing a rejection.'),
    },
    {
      q: t('faq4_q', 'Can FormReady fix faint or shadowy signatures taken from a phone camera?'),
      a: t('faq4_a', 'Yes! Our Signature Fixer includes an auto-trim algorithm that removes excessive white paper margins and boosts contrast, converting shadows and yellowish phone paper into clean pure white while sharpening black or blue ink strokes.'),
    },
    {
      q: t('faq5_q', 'Will this work on a mobile phone without internet after loading?'),
      a: t('faq5_a', 'Yes. Once the web application is loaded in your browser, all image compression and signature processing continues functioning completely offline because no server backend is required.'),
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 relative overflow-hidden">
      {/* Psychological Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[350px] bg-gradient-to-tr from-sky-400/15 via-indigo-500/10 to-teal-400/10 blur-3xl pointer-events-none rounded-full -z-10" />

      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-5 pt-4 sm:pt-8 relative">
        {/* Micro-badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50/90 dark:bg-sky-950/70 border border-sky-200/80 dark:border-sky-800 text-sky-800 dark:text-sky-300 text-xs font-semibold shadow-xs backdrop-blur-xs">
          <Zap className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0 animate-pulse" />
          <span>{t('hero_badge', 'Zero Server Uploads • Instant Browser Processing')}</span>
        </div>

        {/* Primary Tagline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12]">
          {t('hero_tagline_1', 'Your form rejected the file?')} <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-500 dark:from-sky-400 dark:via-indigo-400 dark:to-teal-300">
            {t('hero_tagline_2', 'Fix it here.')}
          </span>
        </h1>

        {/* Subtitle with High-Trust Reassurance */}
        <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
          {t('hero_subtitle_1', 'No signup. No subscription. No watermark. No upload.')} <br />
          <span className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">
            {t('hero_subtitle_2', 'Your photos, signatures, and documents stay strictly in your browser.')}
          </span>
        </p>

        {/* Quick Emergency Solution Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
          <Link
            href="/compress-image-to-20kb"
            className="px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-sky-500 dark:hover:border-sky-500 hover:shadow-xs font-semibold text-slate-700 dark:text-slate-200 transition"
          >
            {t('pill_compress_20', 'Compress to 20 KB')}
          </Link>
          <Link
            href="/compress-image-to-50kb"
            className="px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-sky-500 dark:hover:border-sky-500 hover:shadow-xs font-semibold text-slate-700 dark:text-slate-200 transition"
          >
            {t('pill_compress_50', 'Compress to 50 KB')}
          </Link>
          <Link
            href="/resize-signature"
            className="px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-sky-500 dark:hover:border-sky-500 hover:shadow-xs font-semibold text-slate-700 dark:text-slate-200 transition"
          >
            {t('pill_sig_trim', 'Signature Auto-Trim')}
          </Link>
          <Link
            href="/resize-photo"
            className="px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-sky-500 dark:hover:border-sky-500 hover:shadow-xs font-semibold text-slate-700 dark:text-slate-200 transition"
          >
            {t('pill_passport_photo', 'Passport Photo')}
          </Link>
          <Link
            href="/jpg-to-pdf"
            className="px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-sky-500 dark:hover:border-sky-500 hover:shadow-xs font-semibold text-slate-700 dark:text-slate-200 transition"
          >
            {t('pill_jpg_pdf', 'JPG to PDF')}
          </Link>
        </div>
      </section>

      {/* Main Interactive Tool immediately on landing page */}
      <section className="max-w-4xl mx-auto relative z-10">
        <ImageCompressorTool
          initialTargetKB={50}
          initialFormat="image/jpeg"
        />
      </section>

      {/* Trust & Psychological Peace-of-Mind Strip */}
      <section className="rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-900/90 dark:to-slate-950/90 p-6 sm:p-10 shadow-sm backdrop-blur-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 shadow-xs">
              <Lock className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {t('trust_privacy_title', '100% Client-Side Privacy')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {t('trust_privacy_desc', 'Zero bytes leave your browser. Processing runs in browser memory using HTML5 Canvas & WebAssembly.')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200/80 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0 shadow-xs">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {t('trust_guarantee_title', 'Binary-Search Target Guarantee')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {t('trust_guarantee_desc', 'We never guess quality. Our algorithm iterates until the actual file size is safely below your portal limit.')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 shadow-xs">
              <Zap className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {t('trust_free_title', 'Instant & Free Forever')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {t('trust_free_desc', 'No login walls, no payment requests, no watermarks, and works offline once loaded.')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="space-y-8 max-w-4xl mx-auto">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {t('how_title', 'How FormReady Solves File Rejections')}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            {t('how_subtitle', 'Solve government examination, university, and visa portal rejections in under 30 seconds.')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((item) => (
            <div
              key={item.num}
              className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs space-y-2 hover:border-sky-300 dark:hover:border-sky-700 transition"
            >
              <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 font-bold text-xs flex items-center justify-center">
                {item.num}
              </div>
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
            {t('popular_tools_title', 'All File Preparation Tools')}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t('popular_tools_subtitle', 'Dedicated utilities engineered for specific portal rejection reasons.')}
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
                <span>{t('btn_open_tool', 'Open Tool')}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ Section - Interactive Accordion */}
      <section className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {t('faq_title', 'Frequently Asked Questions')}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t('faq_subtitle', 'Everything you need to know about preparing your application files safely.')}
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs transition"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-4 sm:p-5 font-semibold text-sm sm:text-base text-slate-900 dark:text-white flex items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition"
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-sky-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

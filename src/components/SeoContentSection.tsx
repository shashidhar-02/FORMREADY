import React from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  AlertTriangle,
  CheckCircle,
  FileText,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

export interface FaqItem {
  question: string;
  answer: string;
}

export interface SeoContentProps {
  toolName: string;
  targetRequirement: string;
  description: string;
  steps: string[];
  commonMistakes: { mistake: string; solution: string }[];
  faqs: FaqItem[];
  relatedTools: { href: string; title: string; desc: string }[];
  softwareSchemaName?: string;
}

export function SeoContentSection({
  toolName,
  targetRequirement,
  description,
  steps,
  commonMistakes,
  faqs,
  relatedTools,
  softwareSchemaName,
}: SeoContentProps) {
  // Construct FAQ Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: softwareSchemaName || `${toolName} - FormReady`,
    operatingSystem: 'Any (Web Browser)',
    applicationCategory: 'UtilityApplication',
    offers: {
      '@type': 'Offer',
      price: '0.00',
      priceCurrency: 'USD',
    },
    description,
  };

  return (
    <div className="space-y-12 mt-16 pt-12 border-t border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />

      {/* Explanatory Article */}
      <section className="space-y-4 max-w-4xl">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          How to prepare files for {targetRequirement}
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-400">
          {description}
        </p>
      </section>

      {/* Step-by-Step Instructions */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Step-by-Step Instructions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-2"
            >
              <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 font-bold text-sm flex items-center justify-center">
                0{idx + 1}
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200">
                {step}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Common Mistakes */}
      {commonMistakes && commonMistakes.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <span>Why Application Portals Reject Files & How to Fix Them</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {commonMistakes.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-amber-200/70 dark:border-amber-900/40 bg-amber-50/30 dark:bg-amber-950/20 space-y-2 text-xs sm:text-sm"
              >
                <p className="font-bold text-amber-900 dark:text-amber-200">✗ {item.mistake}</p>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  ✓ <strong className="text-slate-900 dark:text-slate-200">Solution:</strong>{' '}
                  {item.solution}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQ Accordion */}
      {faqs && faqs.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-sky-500" />
            <span>Frequently Asked Questions</span>
          </h3>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 transition-all duration-200 cursor-pointer"
              >
                <summary className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white list-none flex items-center justify-between">
                  <span>{faq.question}</span>
                  <span className="text-sky-500 group-open:rotate-180 transition-transform">↓</span>
                </summary>
                <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Related Tools */}
      {relatedTools && relatedTools.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Related File Preparation Utilities
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedTools.map((tool, idx) => (
              <Link
                key={idx}
                href={tool.href}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-sky-500 transition group flex flex-col justify-between"
              >
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-sky-600 transition">
                    {tool.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{tool.desc}</p>
                </div>
                <span className="mt-3 text-xs font-semibold text-sky-600 dark:text-sky-400 flex items-center gap-1">
                  Use Tool{' '}
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Zero Upload Guarantee */}
      <section className="p-6 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-emerald-500 shrink-0" />
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Zero-Server Client Architecture
            </h4>
            <p className="text-xs text-slate-500">
              Your confidential documents, photos, and signatures never leave your browser.
              FormReady runs 100% locally on your machine.
            </p>
          </div>
        </div>
        <Link
          href="/privacy"
          className="shrink-0 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
        >
          View Privacy Audit →
        </Link>
      </section>
    </div>
  );
}

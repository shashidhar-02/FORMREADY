'use client';

import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { ValidationReport } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

interface ValidationBadgeProps {
  report: ValidationReport;
}

export function ValidationBadge({ report }: ValidationBadgeProps) {
  const { t } = useLanguage();
  const { isValid, items } = report;

  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 transition-all ${
        isValid
          ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/80 text-emerald-950 dark:text-emerald-100'
          : 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/80 text-amber-950 dark:text-amber-100'
      }`}
    >
      <div className="flex items-center justify-between gap-3 mb-3 pb-3 border-b border-emerald-200/60 dark:border-emerald-800/40">
        <div className="flex items-center gap-2">
          {isValid ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          )}
          <span className="font-bold text-sm sm:text-base">
            {isValid
              ? t('status_ready_submission', 'Ready for Portal Submission')
              : t('status_warning', 'Verification Warning')}
          </span>
        </div>
        <span
          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
            isValid
              ? 'bg-emerald-200/80 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
              : 'bg-amber-200/80 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
          }`}
        >
          {isValid ? t('status_verified', '✓ Verified') : t('status_warning', 'Check Requirements')}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between"
          >
            <span className="text-slate-500 dark:text-slate-400 font-medium">{item.label}</span>
            <div className="mt-1 flex items-baseline justify-between gap-1">
              <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                {item.actual}
              </span>
              <span className="text-[11px] text-slate-400">({item.target})</span>
            </div>
            <div className="mt-1.5 flex items-center gap-1 font-semibold text-[11px]">
              {item.passed ? (
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                  ✓ Valid
                </span>
              ) : (
                <span className="text-rose-600 dark:text-rose-400 flex items-center gap-0.5">
                  ✗ Exceeds target
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

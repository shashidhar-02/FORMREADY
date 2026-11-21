'use client';

import React, { useState } from 'react';
import { PORTAL_PRESETS } from '@/lib/constants';
import { PortalPreset, PresetCategory } from '@/types';
import { CheckCircle2, ShieldCheck, ExternalLink, HelpCircle, Sparkles } from 'lucide-react';

interface PresetSelectorProps {
  onSelectPreset: (preset: PortalPreset) => void;
  selectedPresetId?: string;
  filterType?: 'photo' | 'signature' | 'document';
}

export function PresetSelector({
  onSelectPreset,
  selectedPresetId,
  filterType,
}: PresetSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Portals' },
    { id: 'govt-exam', label: 'Govt Exams (UPSC/SSC)' },
    { id: 'job-portal', label: 'Banking & Jobs' },
    { id: 'college-admission', label: 'Entrance (NEET/JEE/GATE)' },
    { id: 'visa-passport', label: 'Passport & Visa' },
    { id: 'generic-size', label: 'Standard KB Limits' },
  ];

  const filtered = PORTAL_PRESETS.filter((p) => {
    if (filterType && p.targetType !== filterType && p.category !== 'generic-size') {
      return false;
    }
    if (selectedCategory !== 'all' && p.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === c.id
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Grid of Preset Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((preset) => {
          const isSelected = selectedPresetId === preset.id;
          return (
            <div
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className={`cursor-pointer rounded-2xl border p-4 text-left transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'border-sky-500 bg-sky-50/60 dark:bg-sky-950/40 ring-2 ring-sky-500 shadow-md'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                    {preset.name}
                  </h4>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                    ≤ {Math.round(preset.maxBytes / 1024)} KB
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                  {preset.description}
                </p>

                {/* Specs Pill row */}
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] mb-3">
                  {preset.width && preset.height && (
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {preset.width}×{preset.height}px
                    </span>
                  )}
                  {preset.aspectRatio && (
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {preset.aspectRatio}
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase">
                    {preset.format}
                  </span>
                </div>
              </div>

              {/* Verification Stamp */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                {preset.isOfficialVerified ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified ({preset.verifiedAt})</span>
                  </span>
                ) : (
                  <span className="text-slate-400 flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Generic preset</span>
                  </span>
                )}

                {preset.sourceUrl && (
                  <a
                    href={preset.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 flex items-center gap-0.5"
                    title="View official public notice"
                  >
                    <span>Notice</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

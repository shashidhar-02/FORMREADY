'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PORTAL_PRESETS } from '@/lib/constants';
import { PortalPreset } from '@/types';
import {
  ShieldCheck,
  HelpCircle,
  ExternalLink,
  ArrowRight,
  Sparkles,
  FileText,
  Search,
} from 'lucide-react';
import { ImageCompressorTool } from '@/components/ImageCompressorTool';

export default function PresetsPage() {
  const [selectedPreset, setSelectedPreset] = useState<PortalPreset>(PORTAL_PRESETS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Portals' },
    { id: 'govt-exam', label: 'Govt Exams (UPSC, SSC)' },
    { id: 'job-portal', label: 'Banking & Jobs (IBPS)' },
    { id: 'college-admission', label: 'Entrance Exams (NEET, JEE, GATE)' },
    { id: 'visa-passport', label: 'Passport & Visa' },
    { id: 'generic-size', label: 'Standard KB Sizes' },
  ];

  const filtered = PORTAL_PRESETS.filter((p) => {
    if (activeCategory !== 'all' && p.category !== activeCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.shortName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />
          <span>Application File Fixer • Source-Backed Requirements</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Application Presets Directory
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Verified file dimensions, file size ceilings, and format specifications for major
          competitive exams, admissions, and government portals.
        </p>
      </div>

      {/* Selected Preset Active Fixer Tool */}
      <div className="max-w-4xl mx-auto bg-slate-50 dark:bg-slate-900/60 border-2 border-sky-400 dark:border-sky-800 rounded-3xl p-5 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
              Active Preset
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {selectedPreset.name}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">{selectedPreset.notes}</p>
          </div>

          <div className="flex items-center gap-2">
            {selectedPreset.isOfficialVerified ? (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified ({selectedPreset.verifiedAt})</span>
              </span>
            ) : (
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Generic Preset</span>
              </span>
            )}
            {selectedPreset.sourceUrl && (
              <a
                href={selectedPreset.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-slate-500 hover:text-sky-600 flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <span>Notice</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        <ImageCompressorTool
          key={selectedPreset.id}
          initialTargetKB={Math.round(selectedPreset.maxBytes / 1024)}
          initialFormat={selectedPreset.format === 'PNG' ? 'image/png' : 'image/jpeg'}
        />
      </div>

      {/* Directory Search & Filters */}
      <div className="space-y-6 max-w-5xl mx-auto pt-6 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Browse All Portal Presets
          </h3>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search exam or portal..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                activeCategory === c.id
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Grid of presets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((preset) => (
            <div
              key={preset.id}
              onClick={() => {
                setSelectedPreset(preset);
                window.scrollTo({ top: 120, behavior: 'smooth' });
              }}
              className={`p-5 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                selectedPreset.id === preset.id
                  ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/40 ring-2 ring-sky-500'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {preset.name}
                  </h4>
                  <span className="font-mono text-xs font-bold text-sky-600">
                    ≤ {Math.round(preset.maxBytes / 1024)} KB
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400">{preset.description}</p>

                <div className="flex flex-wrap items-center gap-1.5 text-[11px] pt-1">
                  {preset.width && preset.height && (
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {preset.width}×{preset.height} px
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

              <div className="pt-3 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                {preset.isOfficialVerified ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified: {preset.verifiedAt}</span>
                  </span>
                ) : (
                  <span className="text-slate-400 flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Generic preset</span>
                  </span>
                )}

                <span className="text-sky-600 dark:text-sky-400 font-bold flex items-center gap-0.5">
                  Load <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

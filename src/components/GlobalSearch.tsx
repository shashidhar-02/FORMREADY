'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback, useDeferredValue } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import {
  Search,
  FileCheck2,
  Sparkles,
  X,
  ArrowRight,
  Wrench,
  GraduationCap,
  Command,
} from 'lucide-react';
import { PORTAL_PRESETS, TOOL_ROUTES } from '@/lib/constants';
import { useLanguage } from '@/context/LanguageContext';

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  category: 'tool' | 'preset';
  badge?: string;
}

/* ------------------------------------------------------------------ */
/*  Fuzzy scoring: title prefix > title substring > subtitle          */
/* ------------------------------------------------------------------ */

function fuzzyScore(item: SearchItem, query: string): number {
  const q = query.toLowerCase().trim();
  if (!q) return 0;

  const titleLower = item.title.toLowerCase();
  const subtitleLower = item.subtitle.toLowerCase();
  const badgeLower = item.badge?.toLowerCase() || '';

  let score = 0;

  if (titleLower.startsWith(q)) {
    score += 100;
  } else if (titleLower.includes(q)) {
    score += 60;
  }

  if (subtitleLower.includes(q)) {
    score += 25;
  }

  if (badgeLower.includes(q)) {
    score += 15;
  }

  return score;
}

/* ------------------------------------------------------------------ */
/*  SearchTrigger (standalone export for backward compatibility)      */
/* ------------------------------------------------------------------ */

export function SearchTrigger({ onClick }: { onClick: () => void }) {
  const { t } = useLanguage();

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-between gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/80 dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-800/80 transition-all duration-200 cursor-pointer shadow-xs group"
      aria-label="Open search command palette"
    >
      <div className="flex items-center gap-2 overflow-hidden">
        <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-sky-500 transition-colors shrink-0" />
        <span className="text-xs text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors truncate">
          {t('search_placeholder_short', 'Search tools & exam presets...')}
        </span>
      </div>
      <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 dark:text-slate-500 bg-slate-200/60 dark:bg-slate-800 rounded border border-slate-300/60 dark:border-slate-700 shrink-0">
        <span>Ctrl</span>
        <span>K</span>
      </kbd>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  GlobalSearch – Unified Command Palette with trigger + modal       */
/* ------------------------------------------------------------------ */

export function GlobalSearch() {
  const router = useRouter();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* ---------- Build searchable catalog (memoized) ---------- */
  const allItems = useMemo<SearchItem[]>(
    () => [
      ...TOOL_ROUTES.map((r) => ({
        id: r.href,
        title: r.title,
        subtitle: r.desc,
        href: r.href,
        category: 'tool' as const,
        badge: 'Tool',
      })),
      ...PORTAL_PRESETS.map((p) => ({
        id: `preset-${p.id}`,
        title: p.name,
        subtitle: `${p.format} • ≤ ${Math.round(p.maxBytes / 1024)} KB${p.width ? ` • ${p.width}×${p.height}px` : ''}`,
        href: `/presets?preset=${p.id}`,
        category: 'preset' as const,
        badge: p.isOfficialVerified ? `Verified ${p.verifiedAt}` : 'Preset',
      })),
    ],
    [],
  );

  /* ---------- Filter + Sort Results ---------- */
  const filtered = useMemo(() => {
    if (!deferredQuery.trim()) {
      return allItems.slice(0, 10);
    }

    return allItems
      .map((item) => ({ item, score: fuzzyScore(item, deferredQuery) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map(({ item }) => item);
  }, [allItems, deferredQuery]);

  const toolResults = useMemo(() => filtered.filter((i) => i.category === 'tool'), [filtered]);
  const presetResults = useMemo(() => filtered.filter((i) => i.category === 'preset'), [filtered]);
  const flatResults = useMemo(
    () => [...toolResults, ...presetResults],
    [toolResults, presetResults],
  );

  /* ---------- Handlers ---------- */
  const openPalette = useCallback(() => {
    setIsOpen(true);
    setQuery('');
    setSelectedIndex(0);
  }, []);

  const closePalette = useCallback(() => {
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(0);
  }, []);

  const handleSelect = useCallback(
    (item: SearchItem) => {
      closePalette();
      router.push(item.href);
    },
    [closePalette, router],
  );

  /* ---------- Global Keyboard Shortcuts ---------- */
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        closePalette();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen, closePalette]);

  /* ---------- Auto-focus Input ---------- */
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => searchInputRef.current?.focus(), 40);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  /* ---------- Keyboard Navigation in Modal ---------- */
  const handleKeyDownInInput = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, flatResults.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + flatResults.length) % Math.max(1, flatResults.length));
    } else if (e.key === 'Enter' && flatResults[selectedIndex]) {
      e.preventDefault();
      handleSelect(flatResults[selectedIndex]);
    }
  };

  /* ---------- Modal Dialog Content ---------- */
  const modalContent =
    isOpen && mounted ? (
      <div
        className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-150"
        onClick={closePalette}
        role="dialog"
        aria-modal="true"
        aria-label="Search tools and exam presets"
      >
        <div
          className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input Bar */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <Search className="w-5 h-5 text-sky-500 shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDownInInput}
              placeholder={t(
                'search_placeholder',
                'Search tools, presets (50KB, UPSC, SSC, PDF)...',
              )}
              className="flex-1 bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
              aria-label="Search"
              autoComplete="off"
              spellCheck={false}
            />
            {query ? (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  searchInputRef.current?.focus();
                }}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[11px] font-mono text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                Esc
              </kbd>
            )}
          </div>

          {/* Results List */}
          <div ref={listRef} className="max-h-[55vh] overflow-y-auto p-2 space-y-1">
            {flatResults.length > 0 ? (
              <>
                {/* Tools Section */}
                {toolResults.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      <Wrench className="w-3 h-3 text-sky-500" />
                      <span>Tools & Utilities</span>
                    </div>
                    {toolResults.map((item) => {
                      const idx = flatResults.indexOf(item);
                      const isSelected = selectedIndex === idx;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelect(item)}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          className={`w-full text-left px-3.5 py-2.5 rounded-2xl flex items-center justify-between gap-3 text-xs sm:text-sm transition-all duration-150 ${
                            isSelected
                              ? 'bg-sky-50 dark:bg-sky-950/70 text-sky-900 dark:text-sky-100 shadow-xs'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                          }`}
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div
                              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                                isSelected
                                  ? 'bg-sky-600 text-white'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              <FileCheck2 className="w-4 h-4" />
                            </div>
                            <div className="overflow-hidden">
                              <p className="font-bold truncate text-slate-900 dark:text-white">
                                {item.title}
                              </p>
                              <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                                {item.subtitle}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {item.badge && (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                {item.badge}
                              </span>
                            )}
                            <ArrowRight
                              className={`w-3.5 h-3.5 transition-transform ${
                                isSelected
                                  ? 'translate-x-0.5 text-sky-600 dark:text-sky-400'
                                  : 'text-slate-400 opacity-40'
                              }`}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Exam Presets Section */}
                {presetResults.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      <GraduationCap className="w-3 h-3 text-indigo-500" />
                      <span>Exam & Portal Presets</span>
                    </div>
                    {presetResults.map((item) => {
                      const idx = flatResults.indexOf(item);
                      const isSelected = selectedIndex === idx;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelect(item)}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          className={`w-full text-left px-3.5 py-2.5 rounded-2xl flex items-center justify-between gap-3 text-xs sm:text-sm transition-all duration-150 ${
                            isSelected
                              ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-900 dark:text-indigo-100 shadow-xs'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                          }`}
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div
                              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                                isSelected
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              <Sparkles className="w-4 h-4" />
                            </div>
                            <div className="overflow-hidden">
                              <p className="font-bold truncate text-slate-900 dark:text-white">
                                {item.title}
                              </p>
                              <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                                {item.subtitle}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {item.badge && (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                {item.badge}
                              </span>
                            )}
                            <ArrowRight
                              className={`w-3.5 h-3.5 transition-transform ${
                                isSelected
                                  ? 'translate-x-0.5 text-indigo-600 dark:text-indigo-400'
                                  : 'text-slate-400 opacity-40'
                              }`}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              <div className="py-12 text-center">
                <Search className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  No matching tools or presets for &ldquo;{deferredQuery}&rdquo;
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  Try searching &quot;50kb&quot;, &quot;upsc&quot;, &quot;signature&quot;, or
                  &quot;pdf&quot;
                </p>
              </div>
            )}
          </div>

          {/* Modal Footer Keyboard Hints */}
          <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 select-none">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">
                  ↑
                </kbd>
                <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">
                  ↓
                </kbd>
                <span className="hidden sm:inline">Navigate</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">
                  ↵
                </kbd>
                <span className="hidden sm:inline">Select</span>
              </span>
            </div>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">
                Esc
              </kbd>
              <span className="hidden sm:inline">Close</span>
            </span>
          </div>
        </div>
      </div>
    ) : null;

  return (
    <>
      <SearchTrigger onClick={openPalette} />
      {mounted && modalContent && createPortal(modalContent, document.body)}
    </>
  );
}

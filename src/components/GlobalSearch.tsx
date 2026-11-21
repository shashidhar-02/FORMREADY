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
  SlidersHorizontal,
  Zap,
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
  tags?: string[];
}

type FilterCategory = 'all' | 'tool' | 'preset';

/* ------------------------------------------------------------------ */
/*  Fuzzy scoring: title prefix > title substring > tags > subtitle   */
/* ------------------------------------------------------------------ */

function fuzzyScore(item: SearchItem, query: string): number {
  const q = query.toLowerCase().trim();
  if (!q) return 0;

  const titleLower = item.title.toLowerCase();
  const subtitleLower = item.subtitle.toLowerCase();
  const badgeLower = item.badge?.toLowerCase() || '';
  const tagsLower = (item.tags || []).join(' ').toLowerCase();

  let score = 0;

  if (titleLower.startsWith(q)) {
    score += 100;
  } else if (titleLower.includes(q)) {
    score += 65;
  }

  if (tagsLower.includes(q)) {
    score += 45;
  }

  if (subtitleLower.includes(q)) {
    score += 30;
  }

  if (badgeLower.includes(q)) {
    score += 20;
  }

  return score;
}

/* ------------------------------------------------------------------ */
/*  Highlight Matching Text Helper                                    */
/* ------------------------------------------------------------------ */

function HighlightText({ text, query }: { text: string; query: string }) {
  const trimmed = query.trim();
  if (!trimmed) return <>{text}</>;

  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            className="bg-sky-500/20 text-sky-600 dark:text-sky-300 font-semibold px-0.5 rounded-xs"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  SearchTrigger                                                     */
/* ------------------------------------------------------------------ */

export function SearchTrigger({ onClick }: { onClick: () => void }) {
  const { t } = useLanguage();
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setIsMac(/mac/i.test(navigator.userAgent || navigator.platform));
    }
  }, []);

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-between gap-2.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl sm:rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 hover:border-sky-400 dark:hover:border-sky-500 hover:bg-white dark:hover:bg-slate-800/90 hover:shadow-xs transition-all duration-200 cursor-pointer group"
      aria-label="Open search command palette"
      aria-haspopup="dialog"
    >
      <div className="flex items-center gap-2 overflow-hidden">
        <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-sky-500 transition-colors shrink-0" />
        <span className="text-xs text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors truncate hidden md:inline">
          {t('search_placeholder_short', 'Search tools & exam presets...')}
        </span>
        <span className="text-xs text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors truncate md:hidden">
          {t('search_short', 'Search tools...')}
        </span>
      </div>
      <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 dark:text-slate-500 bg-slate-200/50 dark:bg-slate-800 rounded border border-slate-300/60 dark:border-slate-700/80 group-hover:border-sky-300/60 dark:group-hover:border-sky-700/60 transition-colors shrink-0">
        <span>{isMac ? '⌘K' : 'Ctrl+K'}</span>
      </kbd>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  GlobalSearch Command Palette                                      */
/* ------------------------------------------------------------------ */

export function GlobalSearch() {
  const router = useRouter();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof navigator !== 'undefined') {
      setIsMac(/mac/i.test(navigator.userAgent || navigator.platform));
    }
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
        tags: [
          'compress',
          'photo',
          'signature',
          'pdf',
          'jpg',
          'converter',
          'resize',
          'dpi',
          'merge',
        ],
      })),
      ...PORTAL_PRESETS.map((p) => ({
        id: `preset-${p.id}`,
        title: p.name,
        subtitle: `${p.format} • ≤ ${Math.round(p.maxBytes / 1024)} KB${p.width ? ` • ${p.width}×${p.height}px` : ''}`,
        href: `/presets?preset=${p.id}`,
        category: 'preset' as const,
        badge: p.isOfficialVerified ? `Verified ${p.verifiedAt}` : 'Preset',
        tags: [
          'preset',
          'exam',
          'gov',
          'portal',
          p.format,
          `${Math.round(p.maxBytes / 1024)}kb`,
          p.id,
        ],
      })),
    ],
    [],
  );

  /* ---------- Quick Discovery Chips ---------- */
  const quickFilters = useMemo(
    () => [
      { label: '⚡ 50 KB Target', query: '50kb' },
      { label: '🖋️ Signature Fixer', query: 'signature' },
      { label: '📷 Passport Photo', query: 'photo' },
      { label: '📄 Merge PDF', query: 'pdf' },
      { label: '🏛️ UPSC / SSC', query: 'upsc' },
    ],
    [],
  );

  /* ---------- Filter + Sort Results ---------- */
  const filtered = useMemo(() => {
    let list = allItems;

    // Apply category filter tab
    if (activeCategory !== 'all') {
      list = list.filter((i) => i.category === activeCategory);
    }

    if (!deferredQuery.trim()) {
      return list.slice(0, 10);
    }

    return list
      .map((item) => ({ item, score: fuzzyScore(item, deferredQuery) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 14)
      .map(({ item }) => item);
  }, [allItems, deferredQuery, activeCategory]);

  const toolResults = useMemo(() => filtered.filter((i) => i.category === 'tool'), [filtered]);
  const presetResults = useMemo(() => filtered.filter((i) => i.category === 'preset'), [filtered]);
  const flatResults = useMemo(() => filtered, [filtered]);

  /* ---------- Handlers ---------- */
  const openPalette = useCallback(() => {
    setIsOpen(true);
    setQuery('');
    setActiveCategory('all');
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

  /* ---------- Global Keyboard & Custom Event Shortcuts ---------- */
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        closePalette();
      }
    };

    const handleCustomOpen = () => {
      openPalette();
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    window.addEventListener('open-global-search', handleCustomOpen);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
      window.removeEventListener('open-global-search', handleCustomOpen);
    };
  }, [isOpen, closePalette, openPalette]);

  /* ---------- Auto-focus Input ---------- */
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => searchInputRef.current?.focus(), 30);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  /* ---------- Keep selection in bounds when results change ---------- */
  useEffect(() => {
    setSelectedIndex(0);
  }, [deferredQuery, activeCategory]);

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
        className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-3 sm:px-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-150"
        onClick={closePalette}
        role="dialog"
        aria-modal="true"
        aria-label="Search tools and exam presets"
      >
        <div
          className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150 ring-1 ring-black/5 dark:ring-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Search Input Bar */}
          <div className="flex items-center gap-3 px-4 sm:px-5 py-3.5 sm:py-4 border-b border-slate-100 dark:border-slate-800">
            <Search className="w-5 h-5 text-sky-500 shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDownInInput}
              placeholder={t(
                'search_placeholder',
                'Search tools, presets (50KB, UPSC, SSC, PDF)...',
              )}
              className="flex-1 bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
              aria-label="Search tools and presets"
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
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[11px] font-mono text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700">
                Esc
              </kbd>
            )}
          </div>

          {/* Quick Filter Tabs & Suggestion Chips */}
          <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/60 flex items-center justify-between gap-2 overflow-x-auto text-xs no-scrollbar">
            {/* Category tabs */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setActiveCategory('all')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  activeCategory === 'all'
                    ? 'bg-sky-500 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('tool')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors flex items-center gap-1 ${
                  activeCategory === 'tool'
                    ? 'bg-sky-500 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                }`}
              >
                <Wrench className="w-3 h-3" />
                Tools
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('preset')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors flex items-center gap-1 ${
                  activeCategory === 'preset'
                    ? 'bg-indigo-500 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                }`}
              >
                <GraduationCap className="w-3 h-3" />
                Exam Presets
              </button>
            </div>

            {/* Quick chips (if no query) */}
            {!query && (
              <div className="hidden md:flex items-center gap-1.5 shrink-0">
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                  Quick:
                </span>
                {quickFilters.map((chip) => (
                  <button
                    key={chip.query}
                    type="button"
                    onClick={() => {
                      setQuery(chip.query);
                      searchInputRef.current?.focus();
                    }}
                    className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-[11px] text-slate-600 dark:text-slate-300 hover:border-sky-400 hover:text-sky-600 dark:hover:text-sky-400 transition cursor-pointer"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Results List */}
          <div
            ref={resultsContainerRef}
            className="max-h-[58vh] overflow-y-auto p-2 sm:p-2.5 space-y-1"
          >
            {flatResults.length > 0 ? (
              <>
                {/* Tools Section */}
                {toolResults.length > 0 && activeCategory !== 'preset' && (
                  <div className="mb-2">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      <Wrench className="w-3 h-3 text-sky-500" />
                      <span>Tools & Utilities ({toolResults.length})</span>
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
                          className={`w-full text-left px-3.5 py-2.5 rounded-xl sm:rounded-2xl flex items-center justify-between gap-3 text-xs sm:text-sm transition-all duration-150 cursor-pointer ${
                            isSelected
                              ? 'bg-sky-50 dark:bg-sky-950/70 text-sky-900 dark:text-sky-100 shadow-xs border-l-3 border-sky-500 pl-3'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                          }`}
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div
                              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                                isSelected
                                  ? 'bg-sky-600 text-white'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              <FileCheck2 className="w-4 h-4" />
                            </div>
                            <div className="overflow-hidden">
                              <p className="font-bold truncate text-slate-900 dark:text-white">
                                <HighlightText text={item.title} query={deferredQuery} />
                              </p>
                              <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                                <HighlightText text={item.subtitle} query={deferredQuery} />
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {item.badge && (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60">
                                {item.badge}
                              </span>
                            )}
                            <ArrowRight
                              className={`w-4 h-4 transition-transform ${
                                isSelected
                                  ? 'translate-x-0.5 text-sky-600 dark:text-sky-400 opacity-100'
                                  : 'text-slate-400 opacity-30'
                              }`}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Exam Presets Section */}
                {presetResults.length > 0 && activeCategory !== 'tool' && (
                  <div className="pt-1">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      <GraduationCap className="w-3 h-3 text-indigo-500" />
                      <span>Exam & Portal Presets ({presetResults.length})</span>
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
                          className={`w-full text-left px-3.5 py-2.5 rounded-xl sm:rounded-2xl flex items-center justify-between gap-3 text-xs sm:text-sm transition-all duration-150 cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-900 dark:text-indigo-100 shadow-xs border-l-3 border-indigo-500 pl-3'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                          }`}
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div
                              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                                isSelected
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              <Sparkles className="w-4 h-4" />
                            </div>
                            <div className="overflow-hidden">
                              <p className="font-bold truncate text-slate-900 dark:text-white">
                                <HighlightText text={item.title} query={deferredQuery} />
                              </p>
                              <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                                <HighlightText text={item.subtitle} query={deferredQuery} />
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {item.badge && (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                {item.badge}
                              </span>
                            )}
                            <ArrowRight
                              className={`w-4 h-4 transition-transform ${
                                isSelected
                                  ? 'translate-x-0.5 text-indigo-600 dark:text-indigo-400 opacity-100'
                                  : 'text-slate-400 opacity-30'
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
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                  No matching tools or presets for &ldquo;{deferredQuery}&rdquo;
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-xs mx-auto">
                  Try searching for &quot;50kb&quot;, &quot;upsc&quot;, &quot;signature&quot;,
                  &quot;passport&quot;, or &quot;pdf&quot;
                </p>
              </div>
            )}
          </div>

          {/* Modal Footer Keyboard Shortcuts & Privacy Indicator */}
          <div className="px-4 sm:px-5 py-2.5 sm:py-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/70 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 select-none">
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
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">
                  Esc
                </kbd>
                <span className="hidden sm:inline">Close</span>
              </span>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              <Zap className="w-3 h-3 text-emerald-500" />
              <span>100% In-Browser • 0ms Latency</span>
            </div>
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

'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback, useDeferredValue } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Search, FileCheck2, Sparkles, X, ArrowRight, Wrench, GraduationCap } from 'lucide-react';
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
/*  Fuzzy scoring: title matches rank higher than subtitle matches    */
/* ------------------------------------------------------------------ */

function fuzzyScore(item: SearchItem, query: string): number {
  const q = query.toLowerCase();
  const titleLower = item.title.toLowerCase();
  const subtitleLower = item.subtitle.toLowerCase();

  let score = 0;

  // Exact starts-with on title is best
  if (titleLower.startsWith(q)) score += 100;
  // Title includes
  else if (titleLower.includes(q)) score += 60;
  // Subtitle includes (lower weight)
  if (subtitleLower.includes(q)) score += 20;
  // Badge includes
  if (item.badge?.toLowerCase().includes(q)) score += 10;

  return score;
}

/* ------------------------------------------------------------------ */
/*  SearchTrigger – the compact pill rendered inside the Header       */
/* ------------------------------------------------------------------ */

export function SearchTrigger({ onClick }: { onClick: () => void }) {
  const { t } = useLanguage();

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/80 dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-800/80 transition-all duration-200 cursor-pointer group shadow-xs"
    >
      <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
      <span className="text-xs text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors hidden sm:inline">
        {t('search_placeholder_short', 'Search tools...')}
      </span>
      <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 dark:text-slate-500 bg-slate-200/60 dark:bg-slate-800 rounded border border-slate-300/60 dark:border-slate-700 ml-1">
        <span>Ctrl</span>
        <span>K</span>
      </kbd>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  GlobalSearch – the full command-palette modal                     */
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

  // Ensure portal only renders client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  /* ---------- Build the searchable items list (memoized) ---------- */
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

  /* ---------- Filtered + sorted results (uses deferredQuery) ------ */
  const filtered = useMemo(() => {
    if (deferredQuery.trim() === '') return allItems.slice(0, 10);

    return allItems
      .map((item) => ({ item, score: fuzzyScore(item, deferredQuery) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map(({ item }) => item);
  }, [allItems, deferredQuery]);

  /* ---------- Group results by category ---------- */
  const toolResults = useMemo(() => filtered.filter((i) => i.category === 'tool'), [filtered]);
  const presetResults = useMemo(() => filtered.filter((i) => i.category === 'preset'), [filtered]);

  /* -------- Flat list for keyboard nav across groups -------------- */
  const flatResults = useMemo(
    () => [...toolResults, ...presetResults],
    [toolResults, presetResults],
  );

  /* ---------- Open / close helpers ---------- */
  const openPalette = useCallback(() => {
    setIsOpen(true);
    setQuery('');
    setSelectedIndex(0);
    // Focus fires via the effect below
  }, []);

  const closePalette = useCallback(() => {
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(0);
  }, []);

  /* ---------- Selection handler ---------- */
  const handleSelect = useCallback(
    (item: SearchItem) => {
      closePalette();
      router.push(item.href);
    },
    [closePalette, router],
  );

  /* ---------- Global Ctrl+K / ⌘K listener ---------- */
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => {
          if (prev) {
            // toggle off
            closePalette();
            return false;
          }
          openPalette();
          return true;
        });
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [openPalette, closePalette]);

  /* ---------- Auto-focus input when modal opens ---------- */
  useEffect(() => {
    if (isOpen) {
      // Small delay so the DOM is painted
      const id = setTimeout(() => searchInputRef.current?.focus(), 30);
      return () => clearTimeout(id);
    }
  }, [isOpen]);

  /* ---------- Scroll active item into view ---------- */
  useEffect(() => {
    if (!listRef.current) return;
    const activeEl = listRef.current.querySelector('[data-active="true"]');
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  /* ---------- Reset selectedIndex when results change ---------- */
  useEffect(() => {
    setSelectedIndex(0);
  }, [deferredQuery]);

  /* ---------- Keyboard nav inside input ---------- */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const len = flatResults.length;
      if (len === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % len);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + len) % len);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (flatResults[selectedIndex]) handleSelect(flatResults[selectedIndex]);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closePalette();
      }
    },
    [flatResults, selectedIndex, handleSelect, closePalette],
  );

  /* ---------- Backdrop click ---------- */
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) closePalette();
    },
    [closePalette],
  );

  /* ---------- Render a single result row ---------- */
  const renderItem = (item: SearchItem, flatIdx: number) => {
    const isActive = selectedIndex === flatIdx;
    return (
      <button
        key={item.id}
        id={`search-option-${flatIdx}`}
        role="option"
        aria-selected={isActive}
        data-active={isActive}
        type="button"
        onClick={() => handleSelect(item)}
        onMouseEnter={() => setSelectedIndex(flatIdx)}
        className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between gap-3 text-sm transition-all duration-100 outline-none ${
          isActive
            ? 'bg-sky-50 dark:bg-sky-950/60 border-l-[3px] border-l-sky-500 pl-[9px]'
            : 'border-l-[3px] border-l-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50'
        }`}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
              isActive
                ? 'bg-sky-500/15 text-sky-600 dark:text-sky-400'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
            }`}
          >
            {item.category === 'tool' ? (
              <FileCheck2 className="w-4 h-4" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
          </div>
          <div className="overflow-hidden">
            <p
              className={`font-semibold truncate text-[13px] ${
                isActive ? 'text-sky-900 dark:text-sky-100' : 'text-slate-800 dark:text-slate-200'
              }`}
            >
              {item.title}
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
              {item.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {item.badge && (
            <span
              className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                isActive
                  ? 'bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}
            >
              {item.badge}
            </span>
          )}
          <ArrowRight
            className={`w-3.5 h-3.5 transition-all ${
              isActive
                ? 'text-sky-500 translate-x-0 opacity-100'
                : 'text-slate-300 -translate-x-1 opacity-0'
            }`}
          />
        </div>
      </button>
    );
  };

  /* ---------- Section header ---------- */
  const renderSectionHeader = (icon: React.ReactNode, label: string) => (
    <div className="flex items-center gap-2 px-3 pt-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 select-none">
      {icon}
      {label}
    </div>
  );

  /* ---------- Portal content ---------- */
  if (!mounted || !isOpen) {
    return null;
  }

  // Build the flat-index offset for presets (they come after tools)
  const presetIndexOffset = toolResults.length;

  const modalContent = (
    /* Frosted glass backdrop */
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-center pt-[12vh] sm:pt-[18vh] px-4"
      style={{
        backgroundColor: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Search tools and presets"
    >
      {/* Command palette card */}
      <div
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl shadow-black/20 dark:shadow-black/50 border border-slate-200/80 dark:border-slate-800 overflow-hidden"
        style={{
          animation: 'globalSearchFadeIn 150ms cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* Search input row */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0" />
          <input
            ref={searchInputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('search_placeholder', 'Search tools, presets (50KB, UPSC, SSC, PDF)...')}
            className="flex-1 bg-transparent text-base text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
            aria-label="Search"
            aria-controls="search-listbox"
            aria-activedescendant={
              flatResults.length > 0 ? `search-option-${selectedIndex}` : undefined
            }
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
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-1 text-[11px] font-mono text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              Esc
            </kbd>
          )}
        </div>

        {/* Results area */}
        <div
          ref={listRef}
          id="search-listbox"
          role="listbox"
          aria-label="Search results"
          className="max-h-[50vh] overflow-y-auto overscroll-contain p-1.5"
        >
          {flatResults.length > 0 ? (
            <>
              {/* Tools section */}
              {toolResults.length > 0 && (
                <>
                  {renderSectionHeader(<Wrench className="w-3 h-3" />, 'Tools')}
                  {toolResults.map((item, idx) => renderItem(item, idx))}
                </>
              )}

              {/* Presets section */}
              {presetResults.length > 0 && (
                <>
                  {renderSectionHeader(<GraduationCap className="w-3 h-3" />, 'Exam Presets')}
                  {presetResults.map((item, idx) => renderItem(item, presetIndexOffset + idx))}
                </>
              )}
            </>
          ) : (
            <div className="py-12 text-center">
              <Search className="w-8 h-8 text-slate-200 dark:text-slate-700 mx-auto mb-3" />
              <p className="text-sm text-slate-400 dark:text-slate-500">
                No results for &ldquo;{deferredQuery}&rdquo;
              </p>
              <p className="text-xs text-slate-300 dark:text-slate-600 mt-1">
                Try a different keyword
              </p>
            </div>
          )}
        </div>

        {/* Keyboard hints footer */}
        <div className="flex items-center justify-center gap-4 px-5 py-2.5 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500 select-none">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">
              ↑
            </kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">
              ↓
            </kbd>
            <span className="ml-0.5">Navigate</span>
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">
              ↵
            </kbd>
            <span className="ml-0.5">Open</span>
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">
              Esc
            </kbd>
            <span className="ml-0.5">Close</span>
          </span>
        </div>
      </div>

      {/* Keyframe animation injected once */}
      <style>{`
        @keyframes globalSearchFadeIn {
          from {
            opacity: 0;
            transform: scale(0.97) translateY(-8px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );

  return createPortal(modalContent, document.body);
}

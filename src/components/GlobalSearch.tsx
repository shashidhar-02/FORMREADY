'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  FileCheck2,
  FileText,
  Sliders,
  Sparkles,
  Scissors,
  Layers,
  ArrowRight,
  X,
  Command,
} from 'lucide-react';
import { PORTAL_PRESETS, TOOL_ROUTES } from '@/lib/constants';
import { useLanguage } from '@/context/LanguageContext';

interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  category: 'tool' | 'preset';
  badge?: string;
}

export function GlobalSearch() {
  const router = useRouter();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Compile all searchable tools and exam presets
  const allItems: SearchItem[] = [
    ...TOOL_ROUTES.map((t) => ({
      id: t.href,
      title: t.title,
      subtitle: t.desc,
      href: t.href,
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
  ];

  // Filter items based on query
  const filtered = query.trim() === ''
    ? allItems.slice(0, 8)
    : allItems.filter((item) => {
        const q = query.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q) ||
          item.badge?.toLowerCase().includes(q)
        );
      }).slice(0, 10);

  // Keyboard shortcut Ctrl+K / Cmd+K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        setTimeout(() => searchInputRef.current?.focus(), 50);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item: SearchItem) => {
    setIsOpen(false);
    setQuery('');
    router.push(item.href);
  };

  const handleKeyDownInInput = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault();
      handleSelect(filtered[selectedIndex]);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xs sm:max-w-sm md:max-w-md">
      {/* Search Input Box on Top */}
      <div
        onClick={() => {
          setIsOpen(true);
          searchInputRef.current?.focus();
        }}
        className={`relative flex items-center w-full px-3 py-1.5 rounded-xl border transition-all duration-200 cursor-text ${
          isOpen
            ? 'border-sky-500 bg-white dark:bg-slate-900 ring-2 ring-sky-500/20 shadow-sm'
            : 'border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-600'
        }`}
      >
        <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0 mr-2" />
        <input
          ref={searchInputRef}
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIndex(0);
            if (!isOpen) setIsOpen(true);
          }}
          onKeyDown={handleKeyDownInInput}
          placeholder={t('search_placeholder', 'Search tools, presets (50KB, UPSC, SSC, PDF)...')}
          className="w-full bg-transparent text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
        />

        {query ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setQuery('');
              searchInputRef.current?.focus();
            }}
            className="p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 dark:text-slate-500 bg-slate-200/60 dark:bg-slate-800 rounded border border-slate-300/60 dark:border-slate-700">
            <span>Ctrl</span><span>K</span>
          </kbd>
        )}
      </div>

      {/* Dropdown Results Box */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="p-2 border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-400 dark:text-slate-500 flex items-center justify-between px-3">
            <span>{query ? `Search results for "${query}"` : 'Popular Tools & Application Presets'}</span>
            <span className="text-[10px]">Use ↑↓ to navigate, Enter to open</span>
          </div>

          <div className="max-h-72 overflow-y-auto p-1.5 space-y-0.5">
            {filtered.length > 0 ? (
              filtered.map((item, idx) => {
                const isSelected = selectedIndex === idx;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between gap-3 text-xs transition ${
                      isSelected
                        ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-900 dark:text-sky-100'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className="w-6 h-6 rounded-lg bg-sky-100 dark:bg-sky-900/60 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                        {item.category === 'tool' ? (
                          <FileCheck2 className="w-3.5 h-3.5" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-semibold truncate">{item.title}</p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">{item.subtitle}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {item.badge && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {item.badge}
                        </span>
                      )}
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-60" />
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="py-6 text-center text-xs text-slate-400 dark:text-slate-500">
                No matching tools or presets found for &ldquo;{query}&rdquo;
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

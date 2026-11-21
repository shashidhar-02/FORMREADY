'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Moon, Sun, Laptop, Menu, X, FileCheck2 } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { PrivacyModal } from '@/components/PrivacyModal';
import { GlobalSearch } from '@/components/GlobalSearch';
import { SupportedLanguage } from '@/types';

export function Header() {
  const pathname = usePathname();
  const { theme, setTheme, isDark } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/compress-image', label: t('nav_compress', 'Compress') },
    { href: '/resize-signature', label: t('nav_signature', 'Signature Fixer') },
    { href: '/resize-photo', label: t('nav_photo', 'Photo & Passport') },
    { href: '/jpg-to-pdf', label: t('nav_jpg_to_pdf', 'Images to PDF') },
    { href: '/merge-pdf', label: t('nav_merge_pdf', 'Merge PDF') },
    { href: '/presets', label: t('nav_presets', 'Exam Presets') },
  ];

  const cycleTheme = () => {
    if (theme === 'system') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('light');
    } else {
      setTheme('system');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 sm:gap-6 shrink-0">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white group"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
                <FileCheck2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="flex items-center gap-0.5">
                Form<span className="text-sky-600 dark:text-sky-400">Ready</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1 text-xs sm:text-sm font-medium">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-2.5 py-1.5 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 font-semibold'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Global Search Bar */}
          <div className="flex-1 max-w-xs sm:max-w-sm md:max-w-md mx-1 sm:mx-2">
            <GlobalSearch />
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Persistent privacy badge */}
            <button
              onClick={() => setIsPrivacyOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 transition shadow-xs"
              title="Click to verify browser-only privacy model"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{t('badge_local_only', 'Processed locally')}</span>
            </button>

            {/* Language Selector */}
            <div className="relative hidden sm:flex items-center">
              <label htmlFor="lang-select" className="sr-only">
                Language
              </label>
              <select
                id="lang-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                aria-label="Select Interface Language"
                className="text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
                <option value="te">తెలుగు</option>
              </select>
            </div>

            {/* Theme Toggle aligned with system */}
            <button
              onClick={cycleTheme}
              aria-label={`Theme: ${theme}. Click to change.`}
              title={`Theme: ${theme === 'system' ? 'System (Auto-syncs with client OS)' : theme}`}
              className="flex items-center gap-1 px-2 py-1.5 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800 transition text-xs font-medium"
            >
              {theme === 'system' ? (
                <>
                  <Laptop className="w-3.5 h-3.5 text-sky-500" />
                  <span className="hidden sm:inline text-[11px]">
                    {t('theme_system', 'System')}
                  </span>
                </>
              ) : theme === 'dark' ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-sky-400" />
                  <span className="hidden sm:inline text-[11px]">{t('theme_dark', 'Dark')}</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span className="hidden sm:inline text-[11px]">{t('theme_light', 'Light')}</span>
                </>
              )}
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              className="xl:hidden p-1.5 sm:p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="xl:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-2 animate-in slide-in-from-top duration-200">
            <div className="grid grid-cols-2 gap-1 pb-2 border-b border-slate-100 dark:border-slate-800">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center justify-between pt-1 text-xs">
              <button
                onClick={() => {
                  setIsPrivacyOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t('badge_local_only', '100% Processed Locally')}</span>
              </button>

              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                className="text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded px-2 py-1"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
                <option value="te">తెలుగు</option>
              </select>
            </div>
          </div>
        )}
      </header>

      {/* Privacy Guarantee Explanation Modal */}
      <PrivacyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
    </>
  );
}

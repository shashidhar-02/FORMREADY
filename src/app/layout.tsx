import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'FormReady - Your form rejected the file? Fix it here.',
  description:
    'Free browser-first file utility for photos, signatures, and PDF documents rejected by online application portals. 100% processed locally. No signup, no upload, no watermark.',
  keywords: [
    'compress image to 50kb',
    'compress image to 20kb',
    'resize signature online form',
    'passport photo maker',
    'upsc photo resizer',
    'ssc signature resizer',
    'merge pdf browser',
    'jpg to pdf',
  ],
  authors: [{ name: 'FormReady Open Source Team' }],
  metadataBase: new URL('https://formready.vercel.app'),
  openGraph: {
    title: 'FormReady - Fix Rejected Application Files',
    description:
      'Browser-first utility to resize and compress photos, signatures, and PDFs for online government exam and job forms. Zero uploads.',
    url: 'https://formready.vercel.app',
    siteName: 'FormReady',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FormReady - Zero-Upload File Preparation Utility',
    description:
      'Your form rejected the file? Fix size, dimensions, format, and aspect ratio in your browser.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-full flex flex-col antialiased bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
        <ThemeProvider>
          <LanguageProvider>
            <Header />
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
              {children}
            </main>
            <Footer />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

import React from 'react';
import { Metadata } from 'next';
import { PdfCompressTool } from '@/components/PdfCompressTool';
import { SeoContentSection } from '@/components/SeoContentSection';

export const metadata: Metadata = {
  title: 'Compress PDF Online Free (Zero Upload) - FormReady',
  description:
    'Reduce PDF file size in your browser with object stream optimization. Zero server upload, honest Before/After comparison.',
  alternates: { canonical: 'https://formready.vercel.app/compress-pdf' },
};

export default function CompressPdfPage() {
  return (
    <div>
      <PdfCompressTool />

      <SeoContentSection
        toolName="Browser-Based PDF Compressor"
        targetRequirement="applications requiring PDF documents below strict file limits"
        description="Many government recruitment portals limit PDF file size to 1 MB, 500 KB, or 300 KB. FormReady optimizes PDF object streams and structure locally in your browser with pdf-lib, displaying transparent Before and After file size and reduction percentages without sending confidential files to remote servers."
        steps={[
          'Upload your PDF file.',
          'Click Compress PDF.',
          'Review the exact byte reduction and output size.',
          'Download your compressed PDF.',
        ]}
        commonMistakes={[
          {
            mistake:
              'Websites that generate compressed PDFs that are actually larger than the original.',
            solution:
              'FormReady only applies valid stream optimizations and displays verified byte counters.',
          },
        ]}
        faqs={[
          {
            question: 'Will text clarity in my document be affected?',
            answer:
              'No. Structural object stream compression is lossless and preserves sharp vector text.',
          },
        ]}
        relatedTools={[
          { href: '/merge-pdf', title: 'Merge PDF', desc: 'Combine multiple PDFs' },
          { href: '/jpg-to-pdf', title: 'JPG to PDF', desc: 'Convert image scans to PDF' },
        ]}
      />
    </div>
  );
}

import React from 'react';
import { Metadata } from 'next';
import { PdfMergeSplitTool } from '@/components/PdfMergeSplitTool';
import { SeoContentSection } from '@/components/SeoContentSection';

export const metadata: Metadata = {
  title: 'Split & Extract PDF Pages Online - FormReady',
  description:
    'Extract specific pages or page ranges from a PDF document directly in your browser. Zero uploads, 100% private.',
  alternates: { canonical: 'https://formready.vercel.app/split-pdf' },
};

export default function SplitPdfPage() {
  return (
    <div>
      <PdfMergeSplitTool mode="split" />

      <SeoContentSection
        toolName="Split & Extract PDF Pages"
        targetRequirement="portals requiring single certificate pages extracted from large PDF booklets"
        description="Extract only the necessary page (for example, just page 3 of a 20-page bank passbook or marksheet booklet) directly in your browser without uploading confidential financial or academic records to a third-party server."
        steps={[
          'Upload your multi-page PDF.',
          'Review the total page count.',
          'Type the page numbers or ranges to extract (e.g. 1, 3-5).',
          'Click Extract Selected Pages and download your split PDF.',
        ]}
        commonMistakes={[
          {
            mistake: 'Entering invalid page numbers greater than the total page count.',
            solution:
              'FormReady displays the exact total page count and validates your input range.',
          },
        ]}
        faqs={[
          {
            question: 'Can I extract multiple non-continuous pages?',
            answer: 'Yes! Separate single pages and ranges with commas (e.g. "1, 4, 7-9").',
          },
        ]}
        relatedTools={[
          { href: '/merge-pdf', title: 'Merge PDF', desc: 'Combine multiple PDFs' },
          { href: '/compress-pdf', title: 'Compress PDF', desc: 'Reduce PDF file size' },
        ]}
      />
    </div>
  );
}

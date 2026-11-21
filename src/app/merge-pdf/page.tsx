import React from 'react';
import { Metadata } from 'next';
import { PdfMergeSplitTool } from '@/components/PdfMergeSplitTool';
import { SeoContentSection } from '@/components/SeoContentSection';

export const metadata: Metadata = {
  title: 'Merge PDF Files Online Free - FormReady',
  description: 'Merge multiple PDF files into one document in your browser. Fast, private, zero server uploads, no watermark.',
  alternates: { canonical: 'https://formready.vercel.app/merge-pdf' },
};

export default function MergePdfPage() {
  return (
    <div>
      <PdfMergeSplitTool mode="merge" />

      <SeoContentSection
        toolName="Merge PDF Files"
        targetRequirement="applications requiring multiple PDF files combined into one document"
        description="Easily combine your resume, educational certificates, identity proofs, and experience letters into a single PDF document. Everything is processed directly on your device with pdf-lib, meaning your sensitive personal documents never leave your computer or phone."
        steps={[
          'Upload two or more PDF documents.',
          'Reorder files using the Up and Down arrows into your preferred sequence.',
          'Click Merge PDFs to combine all pages into one document.',
          'Download your combined PDF instantly.',
        ]}
        commonMistakes={[
          {
            mistake: 'Using cloud PDF mergers that store your sensitive identity documents on external servers.',
            solution: 'FormReady runs 100% in your browser. Zero bytes are uploaded.',
          },
        ]}
        faqs={[
          {
            question: 'Can I reorder the PDF files before merging?',
            answer: 'Yes! Simply use the up and down arrows on each file item to adjust the order.',
          },
        ]}
        relatedTools={[
          { href: '/split-pdf', title: 'Split PDF', desc: 'Extract pages from a PDF' },
          { href: '/jpg-to-pdf', title: 'JPG to PDF', desc: 'Convert images to PDF' },
          { href: '/compress-pdf', title: 'Compress PDF', desc: 'Optimize PDF file size' },
        ]}
      />
    </div>
  );
}

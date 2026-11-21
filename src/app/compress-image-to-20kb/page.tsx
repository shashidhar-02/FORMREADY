import React from 'react';
import { Metadata } from 'next';
import { ImageCompressorTool } from '@/components/ImageCompressorTool';
import { SeoContentSection } from '@/components/SeoContentSection';

export const metadata: Metadata = {
  title: 'Compress Image to 20 KB Online - FormReady',
  description:
    'Compress signatures and photos strictly under 20 KB for SSC, IBPS, UPSC, and government application portals. Zero upload, 100% private in browser.',
  alternates: {
    canonical: 'https://formready.vercel.app/compress-image-to-20kb',
  },
};

export default function CompressImageTo20KBPage() {
  return (
    <div>
      <ImageCompressorTool
        initialTargetKB={20}
        pageHeading="Compress Image to 20 KB"
        pageSubheading="Strictly compress signatures and small thumbnail photos below the 20 KB threshold required by SSC, IBPS, and state recruitment portals."
        fixedTarget={true}
      />

      <SeoContentSection
        toolName="Compress Image to 20 KB"
        targetRequirement="applications requiring photos or signatures strictly under 20 KB"
        description="The 20 KB limit is one of the most stringent and common requirements across government recruitment portals like SSC (Staff Selection Commission) and IBPS banking exams. A high-resolution smartphone photo or scan is usually 2 MB to 5 MB—over 100 times larger than the portal allows. FormReady iteratively reduces file size using a binary-search algorithm while retaining stroke legibility for signatures and clear facial outlines for photos."
        steps={[
          'Upload your signature or small photo.',
          'FormReady automatically sets the ceiling to ≤ 20 KB (aiming for ~19.2 KB).',
          'Review the live output and verified status check.',
          'Download the compliant JPG and upload directly to your portal.',
        ]}
        commonMistakes={[
          {
            mistake: 'Signature image gets blurry when compressed.',
            solution:
              'Use our Signature Fixer to crop empty white borders first, then compress. By cutting out 80% of unused paper, the signature stays sharp even under 20 KB.',
          },
          {
            mistake: 'Portal rejects because file is 20.2 KB.',
            solution:
              'FormReady applies a safety margin so your output will be around 19.1–19.6 KB, never exceeding 20.0 KB.',
          },
        ]}
        faqs={[
          {
            question: 'Which portals require 20 KB file limits?',
            answer:
              'Staff Selection Commission (SSC CGL/CHSL signatures: 10-20 KB), IBPS Bank PO/Clerk signatures (10-20 KB), and many State PSC application forms require files below 20 KB.',
          },
          {
            question: 'Will my signature remain legible?',
            answer:
              'Yes. FormReady automatically optimizes JPEG quantisation tables to maintain high edge contrast for black and blue ink strokes.',
          },
        ]}
        relatedTools={[
          {
            href: '/resize-signature',
            title: 'Signature Fixer',
            desc: 'Auto-trim white borders and boost ink contrast',
          },
          {
            href: '/compress-image-to-50kb',
            title: 'Compress to 50 KB',
            desc: 'For passport photos',
          },
          {
            href: '/compress-image-to-10kb',
            title: 'Compress to 10 KB',
            desc: 'For strict 10 KB thumb impressions',
          },
        ]}
      />
    </div>
  );
}

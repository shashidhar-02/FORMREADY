import React from 'react';
import { Metadata } from 'next';
import { SignatureFixerTool } from '@/components/SignatureFixerTool';
import { SeoContentSection } from '@/components/SeoContentSection';

export const metadata: Metadata = {
  title: 'Resize & Clean Signature for Online Forms - FormReady',
  description: 'Auto-trim white borders from signature snapshots, remove paper shadows, and fit 10 KB to 20 KB portal limits. 100% in browser.',
  alternates: { canonical: 'https://formready.vercel.app/resize-signature' },
};

export default function ResizeSignaturePage() {
  return (
    <div>
      <SignatureFixerTool
        initialTargetKB={20}
        pageHeading="Signature Fixer for Online Forms"
        pageSubheading="Take a photo of your signature with your phone. FormReady automatically crops excessive white paper, boosts ink contrast, and fits strict 10–20 KB portal limits."
      />

      <SeoContentSection
        toolName="Signature Auto-Trimmer & Resizer"
        targetRequirement="online forms requiring clean scanned signatures under 20 KB"
        description="When applying for exams (SSC, UPSC, IBPS, NEET) from a smartphone, applicants usually photograph their handwritten signature on paper. The camera photo is usually 3 MB to 5 MB, contains uneven room lighting and paper shadows, and the signature itself is a tiny squiggle surrounded by empty white borders. Portals reject these for being oversized or illegible. FormReady automatically locates the ink strokes, crops the excess paper, cleans shadows to pure white, and compresses the final file safely below 20 KB."
        steps={[
          'Sign on clean white paper with a black or dark blue pen.',
          'Take a photo with your phone and upload it here.',
          'FormReady automatically detects ink bounds, trims excess paper borders, and cleans background shadows.',
          'Verify the resulting size (e.g. ≤ 20 KB) and download the portal-ready JPG.',
        ]}
        commonMistakes={[
          {
            mistake: 'Signature looks too small inside a giant white canvas.',
            solution:
              'Enable "Auto-Trim White Borders" to automatically crop away 80% of empty margins and focus on the ink strokes.',
          },
          {
            mistake: 'Phone camera shadow makes paper look grey or yellow, failing portal review.',
            solution:
              'Our "Clean Background & Ink Boost" thresholding algorithm whitens paper and deepens ink strokes to pure crisp contrast.',
          },
        ]}
        faqs={[
          {
            question: 'What are the official signature dimensions for SSC and IBPS?',
            answer:
              'SSC CGL/CHSL requires a signature of approximately 140×60 pixels (4 cm × 2 cm) between 10 KB and 20 KB. IBPS PO/Clerk also specifies 140×60 pixels in black ink.',
          },
          {
            question: 'Does FormReady store my signature?',
            answer:
              'Never. Your signature is processed exclusively inside your browser\'s memory. FormReady has no server upload endpoints or database.',
          },
        ]}
        relatedTools={[
          { href: '/signature-to-20kb', title: 'Signature to 20 KB', desc: 'Direct 20 KB preset' },
          { href: '/resize-photo', title: 'Passport Photo Resizer', desc: 'Format your application photo' },
          { href: '/compress-image-to-20kb', title: 'Compress to 20 KB', desc: 'Standard 20 KB compressor' },
        ]}
      />
    </div>
  );
}

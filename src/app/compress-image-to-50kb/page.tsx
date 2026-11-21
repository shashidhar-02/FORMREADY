import React from 'react';
import { Metadata } from 'next';
import { ImageCompressorTool } from '@/components/ImageCompressorTool';
import { SeoContentSection } from '@/components/SeoContentSection';

export const metadata: Metadata = {
  title: 'Compress Image to 50 KB Online - FormReady',
  description:
    'Compress passport photos and identity documents strictly under 50 KB for online applications. Verified client-side without uploading to a server.',
  alternates: {
    canonical: 'https://formready.vercel.app/compress-image-to-50kb',
  },
};

export default function CompressImageTo50KBPage() {
  return (
    <div>
      <ImageCompressorTool
        initialTargetKB={50}
        pageHeading="Compress Image to 50 KB"
        pageSubheading="Target strictly under 50 KB for passport photographs, college application forms, and job recruitment portals."
        fixedTarget={true}
      />

      <SeoContentSection
        toolName="Compress Image to 50 KB"
        targetRequirement="examination and university portals requiring photos under 50 KB"
        description="The 50 KB file size limit is the most universal requirement across Indian competitive exams (SSC CGL/MTS, IBPS, Railways RRB) and global college portals. FormReady adjusts quality and dimensions iteratively, stopping only when the resulting file size is confirmed under 50 KB (typically 48.2 KB to 49.3 KB)."
        steps={[
          'Upload or drag your passport photo or document.',
          'The target limit is preset to 50 KB.',
          'FormReady tests multiple compression levels in your browser in milliseconds.',
          'Inspect the verified output and download your compliant file.',
        ]}
        commonMistakes={[
          {
            mistake: 'Using generic compression websites that output 50.8 KB.',
            solution:
              'FormReady validates actual blob bytes in browser memory. It never flags success if the file exceeds 50 KB.',
          },
          {
            mistake: 'Distorted face when resizing.',
            solution:
              'FormReady maintains aspect ratio lock automatically so your facial proportions remain natural.',
          },
        ]}
        faqs={[
          {
            question: 'Why do portals set a 50 KB limit?',
            answer:
              'Server storage and rapid download speeds for admit cards require portals to enforce strict file size caps on millions of applicant photos.',
          },
          {
            question: 'Is my photo private?',
            answer:
              'Yes, completely. FormReady runs on your device; no photo is sent over the internet.',
          },
        ]}
        relatedTools={[
          { href: '/resize-photo', title: 'Passport Photo Resizer', desc: 'Crop to 35x45mm or 1:1 square' },
          { href: '/compress-image-to-20kb', title: 'Compress to 20 KB', desc: 'For signatures & thumbnails' },
          { href: '/compress-image-to-100kb', title: 'Compress to 100 KB', desc: 'For certificates & IDs' },
        ]}
      />
    </div>
  );
}

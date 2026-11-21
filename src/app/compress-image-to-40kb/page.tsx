import React from 'react';
import { Metadata } from 'next';
import { SizeCompressorPage } from '@/components/SizeCompressorPage';

export const metadata: Metadata = {
  title: 'Compress Image to 40 KB Online - FormReady',
  description:
    'Compress photos and certificates under 40 KB for recruitment portals. Zero uploads.',
  alternates: { canonical: 'https://formready.vercel.app/compress-image-to-40kb' },
};

export default function Compress40KBPage() {
  return (
    <SizeCompressorPage
      targetKB={40}
      title="Compress Image to 40 KB"
      subtitle="Compress photos and documents safely below 40 KB without visual distortion."
      targetDescription="Several state public service commissions and entrance exams enforce an upper threshold of 40 KB for applicant passport photos."
      typicalUses="State PSC applications, police recruitments, and scholarship forms requiring under 40 KB."
    />
  );
}

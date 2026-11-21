import React from 'react';
import { Metadata } from 'next';
import { SizeCompressorPage } from '@/components/SizeCompressorPage';

export const metadata: Metadata = {
  title: 'Compress Image Under 1 MB Online - FormReady',
  description:
    'Easily compress high-resolution photos and documents under 1 MB directly in your browser. Zero uploads.',
  alternates: { canonical: 'https://formready.vercel.app/compress-image-under-1mb' },
};

export default function CompressUnder1MBPage() {
  return (
    <SizeCompressorPage
      targetKB={1024}
      title="Compress Image Under 1 MB"
      subtitle="Ensure your photo or document is verified under the 1 MB ceiling before submitting to online portals."
      targetDescription="Compressing under 1 MB is essential for portals that return 'File size exceeds 1 MB limit' on standard phone photos."
      typicalUses="Bank account opening, passport renewal forms, and competitive exam document uploads."
    />
  );
}

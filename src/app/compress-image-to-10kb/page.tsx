import React from 'react';
import { Metadata } from 'next';
import { SizeCompressorPage } from '@/components/SizeCompressorPage';

export const metadata: Metadata = {
  title: 'Compress Image to 10 KB Online - FormReady',
  description: 'Compress signatures and thumb impressions strictly under 10 KB for exam applications. Zero upload, 100% in-browser.',
  alternates: { canonical: 'https://formready.vercel.app/compress-image-to-10kb' },
};

export default function Compress10KBPage() {
  return (
    <SizeCompressorPage
      targetKB={10}
      title="Compress Image to 10 KB"
      subtitle="Ultra-compact compression for strict thumb impression and signature requirements."
      targetDescription="A 10 KB limit is commonly enforced for left thumb impressions (LTI) and compact signatures in recruitment exams like SSC and state police services."
      typicalUses="Thumb impressions, small signature boxes, and identity cards requiring less than 10 KB."
    />
  );
}

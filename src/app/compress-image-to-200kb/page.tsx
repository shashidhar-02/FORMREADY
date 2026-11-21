import React from 'react';
import { Metadata } from 'next';
import { SizeCompressorPage } from '@/components/SizeCompressorPage';

export const metadata: Metadata = {
  title: 'Compress Image to 200 KB Online - FormReady',
  description: 'Compress photos and certificates under 200 KB for UPSC, GATE, and NEET UG.',
  alternates: { canonical: 'https://formready.vercel.app/compress-image-to-200kb' },
};

export default function Compress200KBPage() {
  return (
    <SizeCompressorPage
      targetKB={200}
      title="Compress Image to 200 KB"
      subtitle="Safely compress photos and certificates strictly under 200 KB for UPSC, GATE, and NEET."
      targetDescription="200 KB is the official upper ceiling for candidate passport photos in GATE (GOAPS) and NEET UG, as well as category certificates."
      typicalUses="GATE applications, NEET UG postcard/passport photo uploads, and UPSC Civil Services certificates."
    />
  );
}

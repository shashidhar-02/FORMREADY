import React from 'react';
import { Metadata } from 'next';
import { SizeCompressorPage } from '@/components/SizeCompressorPage';

export const metadata: Metadata = {
  title: 'Compress Image to 150 KB Online - FormReady',
  description: 'Compress scanned documents and photos strictly under 150 KB. 100% private in browser.',
  alternates: { canonical: 'https://formready.vercel.app/compress-image-to-150kb' },
};

export default function Compress150KBPage() {
  return (
    <SizeCompressorPage
      targetKB={150}
      title="Compress Image to 150 KB"
      subtitle="Reduce scanned document and certificate file sizes below 150 KB with razor-sharp text clarity."
      targetDescription="Many scholarship and university admission portals cap uploaded grade reports and caste/income certificates at 150 KB."
      typicalUses="National Scholarship Portal (NSP), state scholarship portals, and university degree verification uploads."
    />
  );
}

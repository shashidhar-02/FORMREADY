import React from 'react';
import { Metadata } from 'next';
import { SizeCompressorPage } from '@/components/SizeCompressorPage';

export const metadata: Metadata = {
  title: 'Compress Image to 500 KB Online - FormReady',
  description:
    'Compress scanned documents and photos strictly under 500 KB for online registrations. Zero upload.',
  alternates: { canonical: 'https://formready.vercel.app/compress-image-to-500kb' },
};

export default function Compress500KBPage() {
  return (
    <SizeCompressorPage
      targetKB={500}
      title="Compress Image to 500 KB"
      subtitle="Reduce high-resolution scans and multi-page document images below 500 KB with pristine quality."
      targetDescription="500 KB allows high-resolution document scans to be uploaded to government tenders, passport portals, and visa applications without pixelation."
      typicalUses="Government tenders, corporate registrations, property documents, and high-res certificate scans."
    />
  );
}

import React from 'react';
import { Metadata } from 'next';
import { SizeCompressorPage } from '@/components/SizeCompressorPage';

export const metadata: Metadata = {
  title: 'Compress Image to 1 MB Online - FormReady',
  description:
    'Compress images and documents strictly under 1 MB (1024 KB) for portal attachments.',
  alternates: { canonical: 'https://formready.vercel.app/compress-image-to-1mb' },
};

export default function Compress1MBPage() {
  return (
    <SizeCompressorPage
      targetKB={1024}
      title="Compress Image to 1 MB"
      subtitle="Reduce multi-megabyte smartphone camera photos strictly under the 1 MB attachment limit."
      targetDescription="Many job recruitment websites, tax portals, and enterprise tender platforms limit image attachments strictly to 1 MB (1024 KB)."
      typicalUses="Job application resume photos, GST/Tax document uploads, and tender attachment portals."
    />
  );
}

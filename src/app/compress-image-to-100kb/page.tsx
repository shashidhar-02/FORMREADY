import React from 'react';
import { Metadata } from 'next';
import { SizeCompressorPage } from '@/components/SizeCompressorPage';

export const metadata: Metadata = {
  title: 'Compress Image to 100 KB Online - FormReady',
  description: 'Compress ID proofs, passport photos, and certificates under 100 KB for govt portals.',
  alternates: { canonical: 'https://formready.vercel.app/compress-image-to-100kb' },
};

export default function Compress100KBPage() {
  return (
    <SizeCompressorPage
      targetKB={100}
      title="Compress Image to 100 KB"
      subtitle="Compress certificates, ID cards, and photos safely under 100 KB with crystal-clear legibility."
      targetDescription="100 KB is the standard threshold for certificate uploads, Passport Seva Kendra photos, PAN card applications, and identity proofs."
      typicalUses="Passport Seva India, NSDL PAN applications, voter ID registrations, and scanned educational certificates."
    />
  );
}

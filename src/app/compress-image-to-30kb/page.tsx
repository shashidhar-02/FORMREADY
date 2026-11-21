import React from 'react';
import { Metadata } from 'next';
import { SizeCompressorPage } from '@/components/SizeCompressorPage';

export const metadata: Metadata = {
  title: 'Compress Image to 30 KB Online - FormReady',
  description: 'Compress signatures and photos strictly under 30 KB for NEET UG, JEE Main, and entrance exams.',
  alternates: { canonical: 'https://formready.vercel.app/compress-image-to-30kb' },
};

export default function Compress30KBPage() {
  return (
    <SizeCompressorPage
      targetKB={30}
      title="Compress Image to 30 KB"
      subtitle="Safely compress signatures and documents under 30 KB for NTA NEET, JEE Main, and entrance portals."
      targetDescription="National Testing Agency (NTA) portals specify signature limits of 4 KB to 30 KB for NEET UG and JEE Main."
      typicalUses="NTA NEET UG signatures, JEE Main application forms, and university entrance registration forms."
    />
  );
}

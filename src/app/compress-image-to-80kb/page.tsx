import React from 'react';
import { Metadata } from 'next';
import { SizeCompressorPage } from '@/components/SizeCompressorPage';

export const metadata: Metadata = {
  title: 'Compress Image to 80 KB Online - FormReady',
  description:
    'Compress photos and certificates under 80 KB for online forms. 100% browser-side processing.',
  alternates: { canonical: 'https://formready.vercel.app/compress-image-to-80kb' },
};

export default function Compress80KBPage() {
  return (
    <SizeCompressorPage
      targetKB={80}
      title="Compress Image to 80 KB"
      subtitle="Reduce photo and document size strictly under 80 KB for application submissions."
      targetDescription="University application portals and public recruitment tenders frequently enforce an 80 KB cap on profile photos and marksheets."
      typicalUses="College admissions, university registrations, and tender application attachments."
    />
  );
}

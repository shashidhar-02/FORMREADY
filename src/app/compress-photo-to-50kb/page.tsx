import React from 'react';
import { Metadata } from 'next';
import { SizeCompressorPage } from '@/components/SizeCompressorPage';

export const metadata: Metadata = {
  title: 'Compress Photo to 50 KB Online - FormReady',
  description:
    'Compress candidate passport photo to 50 KB for online examination and job applications. Zero upload, verified locally.',
  alternates: { canonical: 'https://formready.vercel.app/compress-photo-to-50kb' },
};

export default function CompressPhotoTo50KBPage() {
  return (
    <SizeCompressorPage
      targetKB={50}
      title="Compress Photo to 50 KB"
      subtitle="Specially tuned for candidate passport photos required by SSC, IBPS, Railways, and college admissions."
      targetDescription="Online portals reject photos when the file size is slightly above 50 KB or when the photo is over-compressed to an unreadable blur. FormReady balances edge definition and file size."
      typicalUses="Government competitive exams, university admission portals, and staff selection recruitments."
    />
  );
}

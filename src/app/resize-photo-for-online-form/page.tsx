import React from 'react';
import { Metadata } from 'next';
import { PassportPhotoTool } from '@/components/PassportPhotoTool';
import { SeoContentSection } from '@/components/SeoContentSection';

export const metadata: Metadata = {
  title: 'Resize Photo for Online Form Submissions - FormReady',
  description: 'Fix rejected photos for online examination, college, and job portals. Resize, align face, and compress under portal limits.',
  alternates: { canonical: 'https://formready.vercel.app/resize-photo-for-online-form' },
};

export default function ResizePhotoForOnlineFormPage() {
  return (
    <div>
      <PassportPhotoTool
        pageHeading="Resize Photo for Online Forms"
        pageSubheading="Fix rejected application photos. Set exact aspect ratio, center your face, and ensure file size stays strictly below portal limits."
      />

      <SeoContentSection
        toolName="Online Form Photo Resizer"
        targetRequirement="all government exam and college portals"
        description="Portal photo uploaders frequently fail with errors such as 'Image dimensions incorrect', 'File exceeds maximum KB', or 'Face coverage insufficient'. FormReady lets you center your facial features, crop to required portal proportions, and compress the file safely below the byte ceiling in one step."
        steps={[
          'Upload your existing passport photo or snapshot.',
          'Position face within the guide.',
          'Select desired aspect ratio and maximum KB.',
          'Download and submit without risk of rejection.',
        ]}
        commonMistakes={[
          {
            mistake: 'Photo looks stretched or squished.',
            solution: 'Crop from center with a fixed aspect ratio instead of distorting pixels.',
          },
        ]}
        faqs={[
          {
            question: 'Will this work for SSC, UPSC, and IBPS?',
            answer: 'Yes, presets and controls match the requirements for SSC, UPSC, IBPS, and state exams.',
          },
        ]}
        relatedTools={[
          { href: '/resize-signature', title: 'Signature Fixer', desc: 'Trim and clean signatures' },
          { href: '/compress-image-to-50kb', title: 'Compress to 50 KB', desc: 'Standard 50 KB limit' },
        ]}
      />
    </div>
  );
}

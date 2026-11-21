import React from 'react';
import { Metadata } from 'next';
import { PassportPhotoTool } from '@/components/PassportPhotoTool';
import { SeoContentSection } from '@/components/SeoContentSection';

export const metadata: Metadata = {
  title: 'Passport Photo Maker & Resizer Online - FormReady',
  description:
    'Create standard 35x45mm and 2x2 inch passport photos in your browser with alignment guide and 4x6 printable grid. Zero uploads.',
  alternates: { canonical: 'https://formready.vercel.app/passport-photo' },
};

export default function PassportPhotoPage() {
  return (
    <div>
      <PassportPhotoTool
        pageHeading="Passport Photo Maker"
        pageSubheading="Prepare compliant passport and visa photos with face framing guidance and instant printable 4×6 photo sheets."
      />

      <SeoContentSection
        toolName="Passport Photo Maker"
        targetRequirement="passport and visa applications worldwide"
        description="Create compliant passport and ID photos without visiting a studio or paying for subscriptions. FormReady works 100% in your browser to crop, frame, adjust background color, and format photos for Indian Passport Seva, US Visa (DS-160), UK Passport, and Schengen Visas."
        steps={[
          'Upload a frontal portrait against a plain background.',
          'Align face with the oval guide overlay.',
          'Choose your target aspect ratio (35×45mm or 1:1 square).',
          'Download individual photo or an 8-photo printable 4×6 sheet.',
        ]}
        commonMistakes={[
          {
            mistake: 'Shadows behind ears or under chin.',
            solution:
              'Choose our clean white or light gray background tint to clean up uneven wall shadows.',
          },
        ]}
        faqs={[
          {
            question: 'Can I print the 4x6 sheet at standard photo printers?',
            answer:
              'Yes! The 4×6 sheet is rendered at 300 DPI and can be printed at any local pharmacy or photo lab.',
          },
        ]}
        relatedTools={[
          {
            href: '/resize-signature',
            title: 'Signature Fixer',
            desc: 'Auto-trim and clean signatures',
          },
          {
            href: '/compress-image-to-100kb',
            title: 'Compress to 100 KB',
            desc: 'Standard passport portal limit',
          },
        ]}
      />
    </div>
  );
}

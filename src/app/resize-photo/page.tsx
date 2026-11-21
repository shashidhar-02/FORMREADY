import React from 'react';
import { Metadata } from 'next';
import { PassportPhotoTool } from '@/components/PassportPhotoTool';
import { SeoContentSection } from '@/components/SeoContentSection';

export const metadata: Metadata = {
  title: 'Passport & Photo Resizer for Online Forms - FormReady',
  description: 'Crop and resize passport photos to 35x45mm, 1:1, or 4:5 ratios with face alignment guide and optional 4x6 printable sheets.',
  alternates: { canonical: 'https://formready.vercel.app/resize-photo' },
};

export default function ResizePhotoPage() {
  return (
    <div>
      <PassportPhotoTool
        pageHeading="Passport & Application Photo Resizer"
        pageSubheading="Crop to 35×45mm, 1:1 square, or 4:5 ratios, align your face with the guide overlay, and fit portal KB limits."
      />

      <SeoContentSection
        toolName="Passport & Application Photo Resizer"
        targetRequirement="applications requiring passport-format photos"
        description="Whether you are submitting an online application for UPSC, SSC, NEET, US Visa DS-160, or Indian Passport Seva, photos must follow strict framing rules. FormReady provides an interactive face oval guide to center your head and chin, crop to exact proportions (35x45 mm, 2x2 inch, etc.), and generate an optional 4x6 inch printable sheet with 8 copies."
        steps={[
          'Upload your portrait or phone selfie.',
          'Align your head and chin within the dashed face oval guide.',
          'Select your aspect ratio (35×45mm, 1:1 square, 3:4, or 4:5).',
          'Choose your target KB limit and download your compliant photo.',
        ]}
        commonMistakes={[
          {
            mistake: 'Photo rejected due to non-neutral background.',
            solution:
              'Select "Clean White" or "Light Blue" background tint to neutralize busy backgrounds.',
          },
          {
            mistake: 'Face is too small inside the frame.',
            solution:
              'Ensure your face occupies 70% to 80% of the vertical frame height as guided by the overlay.',
          },
        ]}
        faqs={[
          {
            question: 'What is the standard passport photo ratio in India?',
            answer:
              'The standard size is 3.5 cm width by 4.5 cm height (35×45 mm), which is approximately a 7:9 ratio. For US Visa, a 1:1 square ratio is required.',
          },
          {
            question: 'Can I print these at a photo kiosk or studio?',
            answer:
              'Yes! Click "Print Sheet (8 Photos)" to download a high-resolution 4×6 inch image containing 8 passport tiles complete with dashed cut guides.',
          },
        ]}
        relatedTools={[
          { href: '/resize-signature', title: 'Signature Fixer', desc: 'Trim white borders & boost contrast' },
          { href: '/compress-image-to-50kb', title: 'Compress to 50 KB', desc: 'Strict 50 KB limit for exam photos' },
          { href: '/jpg-to-pdf', title: 'JPG to PDF', desc: 'Combine ID photos and marksheets into PDF' },
        ]}
      />
    </div>
  );
}

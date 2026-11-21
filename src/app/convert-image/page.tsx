import React from 'react';
import { Metadata } from 'next';
import { ImageConvertTool } from '@/components/ImageConvertTool';
import { SeoContentSection } from '@/components/SeoContentSection';

export const metadata: Metadata = {
  title: 'Convert Image Format (JPG, PNG, WebP) - FormReady',
  description: 'Convert images instantly between JPG, PNG, and WebP format directly in your browser. Zero uploads, no watermark.',
  alternates: { canonical: 'https://formready.vercel.app/convert-image' },
};

export default function ConvertImagePage() {
  return (
    <div>
      <ImageConvertTool />

      <SeoContentSection
        toolName="Image Format Converter"
        targetRequirement="online application portals requiring strict JPG or PNG file formats"
        description="Many government portals reject WebP or PNG files with errors like 'Upload JPG only'. FormReady converts images directly in your browser using native HTML5 Canvas encoding, completely eliminating upload delays."
        steps={[
          'Upload or paste your image.',
          'Choose your desired format (JPG, PNG, or WebP).',
          'Click Convert and download your new image file.',
        ]}
        commonMistakes={[
          {
            mistake: 'Simply changing the file extension from .png to .jpg in File Explorer.',
            solution: 'Portals verify the binary file header (magic bytes). FormReady properly encodes the image structure to valid JPEG.',
          },
        ]}
        faqs={[
          {
            question: 'Why do forms reject PNG and WebP files?',
            answer: 'Legacy portal backends often only have JPEG decoders installed and enforce strict MIME-type checks.',
          },
        ]}
        relatedTools={[
          { href: '/compress-image', title: 'Compress Image', desc: 'Target exact file size in KB' },
          { href: '/resize-photo', title: 'Passport Photo Resizer', desc: 'Crop to standard proportions' },
        ]}
      />
    </div>
  );
}

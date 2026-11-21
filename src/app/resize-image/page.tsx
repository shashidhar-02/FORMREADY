import React from 'react';
import { Metadata } from 'next';
import { ImageResizeTool } from '@/components/ImageResizeTool';
import { SeoContentSection } from '@/components/SeoContentSection';

export const metadata: Metadata = {
  title: 'Resize Image Dimensions Online - FormReady',
  description:
    'Resize image width and height to exact pixel dimensions, percentage, or aspect ratio. Zero uploads, 100% in browser.',
  alternates: { canonical: 'https://formready.vercel.app/resize-image' },
};

export default function ResizeImagePage() {
  return (
    <div>
      <ImageResizeTool />

      <SeoContentSection
        toolName="Universal Image Resizer"
        targetRequirement="applications requiring exact width and height pixel dimensions"
        description="Many application portals reject images if the width or height does not match exact parameters (for example, exactly 200x230 px or 600x600 px). FormReady resizes and scales images with high-quality bicubic interpolation directly in your browser without sending your personal photos to a remote server."
        steps={[
          'Upload or drag your image.',
          'Enter exact target Width and Height in pixels, or choose percentage scale.',
          'Toggle aspect ratio lock to preserve or adjust image shape.',
          'Click Resize and download your pixel-perfect image.',
        ]}
        commonMistakes={[
          {
            mistake: 'Stretching an image and making faces look distorted.',
            solution:
              'Always keep aspect ratio lock enabled unless your portal specifically requires fixed rectangular dimensions.',
          },
          {
            mistake: 'Uploading a 4000x3000 phone camera photo that fails dimension validation.',
            solution:
              'Resize to standard portal specs (e.g. 600x600 px for visa, 200x230 px for exam photo).',
          },
        ]}
        faqs={[
          {
            question: 'Will resizing change the file format?',
            answer: 'You can choose to keep the original format or export as JPG, PNG, or WebP.',
          },
          {
            question: 'Can I resize by percentage instead of pixels?',
            answer:
              'Yes, switch to "Percentage Scale" mode to reduce or enlarge the image by any percentage from 10% to 200%.',
          },
        ]}
        relatedTools={[
          {
            href: '/resize-photo',
            title: 'Passport Photo Resizer',
            desc: 'Standard 35x45mm and 1:1 ratios',
          },
          {
            href: '/resize-signature',
            title: 'Signature Fixer',
            desc: 'Auto-trim whitespace and resize signature',
          },
          {
            href: '/compress-image',
            title: 'Compress Image',
            desc: 'Target exact file size in KB',
          },
        ]}
      />
    </div>
  );
}

import React from 'react';
import { Metadata } from 'next';
import { ImageCompressorTool } from '@/components/ImageCompressorTool';
import { SeoContentSection } from '@/components/SeoContentSection';

export const metadata: Metadata = {
  title: 'Compress Image to Exact File Size (KB/MB) - FormReady',
  description:
    'Compress any image to an exact maximum file size (10 KB to 1 MB) in your browser. Target-size binary search guarantees your file never exceeds portal limits. Zero uploads.',
  alternates: {
    canonical: 'https://formready.vercel.app/compress-image',
  },
};

export default function CompressImagePage() {
  return (
    <div>
      <ImageCompressorTool
        pageHeading="Compress Image to Exact File Size"
        pageSubheading="Target an exact maximum file size in KB or MB with browser-side binary-search optimization. Your image stays on your device."
        initialTargetKB={50}
      />

      <SeoContentSection
        toolName="Universal Image Target Size Compressor"
        targetRequirement="online application portals requiring strict KB limits"
        description="Many government exams, college application forms, and job recruitment portals automatically reject image uploads that exceed their binary file size limit by even a fraction of a kilobyte. FormReady solves this with a multi-step binary-search compression algorithm that adjusts encoding quality and progressively downscales dimensions if needed, verifying that the actual output Blob is safely under your target ceiling before download."
        steps={[
          'Upload your JPG, PNG, or WebP photo, signature, or scanned certificate.',
          'Set your maximum file size target in KB (e.g. 20 KB, 50 KB, 100 KB).',
          'Optionally configure exact width and height pixel constraints.',
          'Click Compress & Validate to verify the exact output size, then download immediately.',
        ]}
        commonMistakes={[
          {
            mistake: 'Portal rejects file because size is 50.4 KB on a 50 KB limit.',
            solution:
              'Standard photo editors often overshoot limits because JPEG file size varies with visual detail. FormReady incorporates a 3-4% safety margin so a 50 KB target produces ~48.8 KB.',
          },
          {
            mistake: 'Lowering quality too much makes text or face unreadable.',
            solution:
              'FormReady uses binary search to find the highest possible visual quality that still meets your byte target.',
          },
        ]}
        faqs={[
          {
            question: 'Will FormReady ever produce a file larger than the target limit?',
            answer:
              'No. The system will never claim success unless the resulting browser Blob is strictly less than or equal to your specified maximum target size.',
          },
          {
            question: 'Are my images uploaded to any server or AI model?',
            answer:
              'No. All processing happens entirely within your browser using HTML5 Canvas APIs. Zero network requests containing image bytes are made.',
          },
        ]}
        relatedTools={[
          {
            href: '/compress-image-to-20kb',
            title: 'Compress to 20 KB',
            desc: 'Target 20 KB for signatures & thumbs',
          },
          {
            href: '/compress-image-to-50kb',
            title: 'Compress to 50 KB',
            desc: 'Target 50 KB for application photos',
          },
          {
            href: '/resize-photo',
            title: 'Passport Photo Maker',
            desc: 'Crop to 35x45mm or 1:1 square',
          },
        ]}
      />
    </div>
  );
}

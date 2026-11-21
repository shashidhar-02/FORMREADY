import React from 'react';
import { ImageCompressorTool } from './ImageCompressorTool';
import { SeoContentSection } from './SeoContentSection';

interface SizeCompressorPageProps {
  targetKB: number;
  title: string;
  subtitle: string;
  targetDescription: string;
  typicalUses: string;
}

export function SizeCompressorPage({
  targetKB,
  title,
  subtitle,
  targetDescription,
  typicalUses,
}: SizeCompressorPageProps) {
  return (
    <div>
      <ImageCompressorTool
        initialTargetKB={targetKB}
        pageHeading={title}
        pageSubheading={subtitle}
        fixedTarget={true}
      />

      <SeoContentSection
        toolName={`Compress Image to ${targetKB >= 1000 ? '1 MB' : `${targetKB} KB`}`}
        targetRequirement={`portals requiring files strictly under ${targetKB >= 1000 ? '1 MB' : `${targetKB} KB`}`}
        description={targetDescription}
        steps={[
          'Upload or drag your image, photo, or scanned document.',
          `FormReady automatically targets strictly below ${targetKB >= 1000 ? '1 MB' : `${targetKB} KB`}.`,
          'Our binary-search engine calculates the optimal balance between visual quality and byte size.',
          'Verify the resulting size in the validation badge and download immediately.',
        ]}
        commonMistakes={[
          {
            mistake: `File size ends up slightly above ${targetKB >= 1000 ? '1 MB' : `${targetKB} KB`}.`,
            solution:
              `FormReady incorporates an automatic safety margin so a ${targetKB} KB target produces ~${Math.floor(targetKB * 0.96)} KB, safely below portal filters.`,
          },
          {
            mistake: 'Image dimensions cause distortion on portal preview.',
            solution:
              'FormReady preserves the exact original aspect ratio unless you explicitly ask for custom width and height.',
          },
        ]}
        faqs={[
          {
            question: `What types of applications require ${targetKB >= 1000 ? '1 MB' : `${targetKB} KB`} files?`,
            answer: typicalUses,
          },
          {
            question: 'Is any file data uploaded to a server?',
            answer:
              'No. All processing happens 100% locally in your web browser. Your confidential files never touch an external server.',
          },
        ]}
        relatedTools={[
          { href: '/compress-image-to-20kb', title: 'Compress to 20 KB', desc: 'For signatures & thumbnails' },
          { href: '/compress-image-to-50kb', title: 'Compress to 50 KB', desc: 'For passport photos' },
          { href: '/compress-image-to-100kb', title: 'Compress to 100 KB', desc: 'For certificates & IDs' },
        ]}
      />
    </div>
  );
}

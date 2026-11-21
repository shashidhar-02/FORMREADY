import React from 'react';
import { Metadata } from 'next';
import { SignatureFixerTool } from '@/components/SignatureFixerTool';
import { SeoContentSection } from '@/components/SeoContentSection';

export const metadata: Metadata = {
  title: 'Compress Signature to 20 KB Online - FormReady',
  description:
    'Crop and compress signatures strictly below 20 KB for online examination applications. 100% private, no signup, zero upload.',
  alternates: { canonical: 'https://formready.vercel.app/signature-to-20kb' },
};

export default function SignatureTo20KBPage() {
  return (
    <div>
      <SignatureFixerTool
        initialTargetKB={20}
        pageHeading="Compress Signature to 20 KB"
        pageSubheading="Target strictly under 20 KB. Auto-crop empty white margins and enhance ink clarity for SSC, IBPS, and state recruitment portals."
      />

      <SeoContentSection
        toolName="Signature to 20 KB Tool"
        targetRequirement="applications requiring signatures strictly below 20 KB"
        description="Many recruitment portals like SSC and IBPS strictly forbid signatures larger than 20 KB. FormReady trims whitespace first so visual quality is not compromised when reaching 19 KB."
        steps={[
          'Upload your signature image.',
          'Review the auto-trimmed signature preview.',
          'The 20 KB target is automatically applied with a 3% safety margin.',
          'Download and submit directly to your application form.',
        ]}
        commonMistakes={[
          {
            mistake: 'Failing portal validation because file is 20.3 KB.',
            solution: 'FormReady targets ~19.2 KB so your signature is safely below 20 KB.',
          },
        ]}
        faqs={[
          {
            question: 'Will my signature look pixelated?',
            answer:
              'No. By cropping empty whitespace before compression, the signature remains crisp and sharp.',
          },
        ]}
        relatedTools={[
          {
            href: '/resize-signature',
            title: 'Signature Fixer',
            desc: 'Custom dimensions and threshold controls',
          },
          {
            href: '/compress-image-to-50kb',
            title: 'Compress Photo to 50 KB',
            desc: 'Standard exam photo limit',
          },
        ]}
      />
    </div>
  );
}

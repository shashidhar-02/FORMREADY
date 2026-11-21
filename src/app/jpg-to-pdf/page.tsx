import React from 'react';
import { Metadata } from 'next';
import { JpgToPdfTool } from '@/components/JpgToPdfTool';
import { SeoContentSection } from '@/components/SeoContentSection';

export const metadata: Metadata = {
  title: 'Convert JPG and PNG to PDF Online - FormReady',
  description: 'Combine multiple photos, certificates, and ID documents into a single clean PDF in your browser. Reorder pages, rotate, and set margins. Zero uploads.',
  alternates: { canonical: 'https://formready.vercel.app/jpg-to-pdf' },
};

export default function JpgToPdfPage() {
  return (
    <div>
      <JpgToPdfTool />

      <SeoContentSection
        toolName="JPG to PDF Converter"
        targetRequirement="portals requiring a single consolidated PDF document instead of multiple image uploads"
        description="When application portals demand 'Upload all semesters in a single PDF' or 'Upload consolidated certificates as one PDF', applicants often struggle with sideways scans, giant file sizes, and wrong page orders. FormReady lets you drag and drop multiple JPG or PNG images, reorder them intuitively, rotate sideways snapshots, set A4 page margins, and produce a clean, lightweight PDF directly in your browser without uploading your sensitive records to any server."
        steps={[
          'Select or drag multiple JPG, JPEG, or PNG images.',
          'Reorder pages with Up/Down buttons to match the required document sequence.',
          'Rotate sideways photos to 90°, 180°, or 270° orientation.',
          'Choose A4, Letter, or Fit size and click Create PDF.',
        ]}
        commonMistakes={[
          {
            mistake: 'Sideways phone photos embedded in PDF sideways.',
            solution:
              'Use the 90° rotation button on each page tile to ensure all document text reads upright.',
          },
          {
            mistake: 'Resulting PDF file size exceeds portal attachment limit.',
            solution:
              'FormReady automatically optimizes embedded image streams and allows setting standard margins to keep file size low.',
          },
        ]}
        faqs={[
          {
            question: 'Can I add multiple pages in different orientations?',
            answer:
              'Yes! You can set Orientation to "Auto" so portrait images remain portrait and landscape certificates remain landscape.',
          },
          {
            question: 'Is there a limit on how many images I can convert?',
            answer:
              'You can combine dozens of images. Because processing runs in your browser using WebAssembly and pdf-lib, performance depends only on your device memory.',
          },
        ]}
        relatedTools={[
          { href: '/merge-pdf', title: 'Merge PDF', desc: 'Combine multiple existing PDF files' },
          { href: '/split-pdf', title: 'Split PDF', desc: 'Extract specific pages from a PDF' },
          { href: '/compress-pdf', title: 'Compress PDF', desc: 'Reduce PDF file size' },
        ]}
      />
    </div>
  );
}

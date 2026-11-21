import { PortalPreset } from '@/types';

export const PORTAL_PRESETS: PortalPreset[] = [
  // --- UPSC (Union Public Service Commission, India) ---
  {
    id: 'upsc-photo',
    name: 'UPSC Civil Services Photo',
    shortName: 'UPSC Photo',
    category: 'govt-exam',
    description: 'Recent passport photo for UPSC Civil Services / NDA / CDS online applications.',
    isOfficialVerified: true,
    sourceUrl: 'https://upsconline.nic.in/ora/instructions.php',
    verifiedAt: '2025-01-15',
    maxBytes: 307200, // 300 KB
    minBytes: 20480,  // 20 KB
    width: 550,
    height: 550,
    aspectRatio: '1:1',
    format: 'JPG',
    notes: 'Official requirement: 20 KB to 300 KB, min 350x350 to max 1000x1000 pixels. Must show 3/4 face coverage with name and date printed on photo.',
    country: 'India',
    targetType: 'photo',
  },
  {
    id: 'upsc-signature',
    name: 'UPSC Civil Services Signature',
    shortName: 'UPSC Signature',
    category: 'govt-exam',
    description: 'Scanned signature on white paper with black ballpoint pen.',
    isOfficialVerified: true,
    sourceUrl: 'https://upsconline.nic.in/ora/instructions.php',
    verifiedAt: '2025-01-15',
    maxBytes: 307200, // 300 KB
    minBytes: 20480,  // 20 KB
    width: 550,
    height: 550,
    aspectRatio: '1:1',
    format: 'JPG',
    notes: 'Official requirement: 20 KB to 300 KB. Black ink on white paper, clearly visible without shadows.',
    country: 'India',
    targetType: 'signature',
  },

  // --- SSC (Staff Selection Commission, India) ---
  {
    id: 'ssc-photo',
    name: 'SSC (CGL / CHSL / MTS) Photo',
    shortName: 'SSC Photo',
    category: 'govt-exam',
    description: 'Passport size photograph for SSC examinations.',
    isOfficialVerified: true,
    sourceUrl: 'https://ssc.gov.in/notice-board',
    verifiedAt: '2025-02-01',
    maxBytes: 51200, // 50 KB
    minBytes: 20480, // 20 KB
    width: 140,
    height: 190,
    aspectRatio: '3.5:4.5',
    format: 'JPG',
    notes: 'Official requirement: 20 KB to 50 KB. Dimensions ~3.5 cm width x 4.5 cm height (approx 100x120px to 200x230px). Plain light/white background.',
    country: 'India',
    targetType: 'photo',
  },
  {
    id: 'ssc-signature',
    name: 'SSC (CGL / CHSL / MTS) Signature',
    shortName: 'SSC Signature',
    category: 'govt-exam',
    description: 'Scanned signature for SSC recruitment applications.',
    isOfficialVerified: true,
    sourceUrl: 'https://ssc.gov.in/notice-board',
    verifiedAt: '2025-02-01',
    maxBytes: 20480, // 20 KB
    minBytes: 10240, // 10 KB
    width: 140,
    height: 60,
    aspectRatio: '4.0:2.0',
    format: 'JPG',
    notes: 'Official requirement: 10 KB to 20 KB. Image dimensions ~4.0 cm width x 2.0 cm height (~140x60 pixels).',
    country: 'India',
    targetType: 'signature',
  },

  // --- IBPS (Institute of Banking Personnel Selection) ---
  {
    id: 'ibps-photo',
    name: 'IBPS Bank PO / Clerk Photo',
    shortName: 'IBPS Photo',
    category: 'job-portal',
    description: 'Photograph for IBPS PO, Clerk, SO, and RRB recruitments.',
    isOfficialVerified: true,
    sourceUrl: 'https://www.ibps.in',
    verifiedAt: '2025-01-20',
    maxBytes: 51200, // 50 KB
    minBytes: 20480, // 20 KB
    width: 200,
    height: 230,
    aspectRatio: '200:230',
    format: 'JPG',
    notes: 'Official requirement: 20 KB to 50 KB. Recommended dimensions: 200 x 230 pixels. Light/white background.',
    country: 'India',
    targetType: 'photo',
  },
  {
    id: 'ibps-signature',
    name: 'IBPS Bank PO / Clerk Signature',
    shortName: 'IBPS Signature',
    category: 'job-portal',
    description: 'Signature on white paper with black ink pen.',
    isOfficialVerified: true,
    sourceUrl: 'https://www.ibps.in',
    verifiedAt: '2025-01-20',
    maxBytes: 20480, // 20 KB
    minBytes: 10240, // 10 KB
    width: 140,
    height: 60,
    aspectRatio: '140:60',
    format: 'JPG',
    notes: 'Official requirement: 10 KB to 20 KB. Dimensions 140 x 60 pixels. Running handwriting (no capital letters).',
    country: 'India',
    targetType: 'signature',
  },

  // --- NTA NEET & JEE Main ---
  {
    id: 'nta-neet-photo',
    name: 'NTA NEET UG Passport Photo',
    shortName: 'NEET Photo',
    category: 'college-admission',
    description: 'Passport photograph for NEET UG / JEE Main application.',
    isOfficialVerified: true,
    sourceUrl: 'https://exams.nta.ac.in/NEET/',
    verifiedAt: '2025-02-10',
    maxBytes: 204800, // 200 KB
    minBytes: 10240,  // 10 KB
    width: 400,
    height: 500,
    aspectRatio: '4:5',
    format: 'JPG',
    notes: 'Official requirement: 10 KB to 200 KB. White background with 80% face coverage showing ears clearly.',
    country: 'India',
    targetType: 'photo',
  },
  {
    id: 'nta-neet-signature',
    name: 'NTA NEET UG Signature',
    shortName: 'NEET Signature',
    category: 'college-admission',
    description: 'Running hand signature on white paper with black ballpoint pen.',
    isOfficialVerified: true,
    sourceUrl: 'https://exams.nta.ac.in/NEET/',
    verifiedAt: '2025-02-10',
    maxBytes: 30720, // 30 KB
    minBytes: 4096,  // 4 KB
    width: 280,
    height: 120,
    aspectRatio: '7:3',
    format: 'JPG',
    notes: 'Official requirement: 4 KB to 30 KB. Must be clearly readable against white background.',
    country: 'India',
    targetType: 'signature',
  },

  // --- GATE (Graduate Aptitude Test in Engineering) ---
  {
    id: 'gate-photo',
    name: 'GATE Exam Photo',
    shortName: 'GATE Photo',
    category: 'college-admission',
    description: 'Photograph for GATE online application portal (GOAPS).',
    isOfficialVerified: true,
    sourceUrl: 'https://gate.iitk.ac.in',
    verifiedAt: '2024-09-01',
    maxBytes: 204800, // 200 KB
    minBytes: 20480,  // 20 KB
    width: 480,
    height: 640,
    aspectRatio: '3.5:4.5',
    format: 'JPG',
    notes: 'Official requirement: 20 KB to 200 KB. Minimum aspect ratio 0.66 to 0.89. White background.',
    country: 'India',
    targetType: 'photo',
  },
  {
    id: 'gate-signature',
    name: 'GATE Exam Signature',
    shortName: 'GATE Signature',
    category: 'college-admission',
    description: 'Signature in rectangular box for GATE application.',
    isOfficialVerified: true,
    sourceUrl: 'https://gate.iitk.ac.in',
    verifiedAt: '2024-09-01',
    maxBytes: 204800, // 200 KB
    minBytes: 5120,   // 5 KB
    width: 320,
    height: 100,
    aspectRatio: '3.2:1',
    format: 'JPG',
    notes: 'Official requirement: 5 KB to 200 KB. Dark blue or black ink on clean white paper.',
    country: 'India',
    targetType: 'signature',
  },

  // --- Passport Seva India ---
  {
    id: 'passport-seva-india',
    name: 'Passport Seva Kendra Photo',
    shortName: 'Indian Passport',
    category: 'visa-passport',
    description: 'Standard Indian Passport size photo specifications.',
    isOfficialVerified: true,
    sourceUrl: 'https://www.passportindia.gov.in',
    verifiedAt: '2025-01-10',
    maxBytes: 102400, // 100 KB
    minBytes: 10240,  // 10 KB
    width: 413,
    height: 531,
    aspectRatio: '3.5:4.5',
    format: 'JPG',
    notes: 'Standard 35mm x 45mm dimension. 70-80% face view, plain light/white background, natural skin tone.',
    country: 'India',
    targetType: 'photo',
  },

  // --- US Visa (DS-160) ---
  {
    id: 'us-visa-ds160',
    name: 'US Visa (DS-160 / Diversity Visa)',
    shortName: 'US Visa (DS-160)',
    category: 'visa-passport',
    description: 'Photo specs for US Department of State online visa application.',
    isOfficialVerified: true,
    sourceUrl: 'https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/photos.html',
    verifiedAt: '2025-01-05',
    maxBytes: 245760, // 240 KB
    minBytes: 10240,
    width: 600,
    height: 600,
    aspectRatio: '1:1',
    format: 'JPG',
    notes: 'Official requirement: Max 240 KB. Square aspect ratio (min 600x600 px to max 1200x1200px). Off-white or white background, neutral expression.',
    country: 'United States',
    targetType: 'photo',
  },

  // --- Generic Presets (Clearly labeled as generic) ---
  {
    id: 'generic-10kb',
    name: 'Generic 10 KB Strict',
    shortName: 'Strict 10 KB',
    category: 'generic-size',
    description: 'Compressed to strictly under 10 KB for portals with tight size limits.',
    isOfficialVerified: false,
    maxBytes: 10240, // 10 KB
    format: 'JPG',
    notes: 'Generic preset — adjust to your portal\'s instructions. Tested to ensure resulting blob is safely under 10.0 KB.',
    targetType: 'document',
  },
  {
    id: 'generic-20kb',
    name: 'Generic 20 KB Limit',
    shortName: 'Under 20 KB',
    category: 'generic-size',
    description: 'Compress image or signature strictly below 20 KB.',
    isOfficialVerified: false,
    maxBytes: 20480, // 20 KB
    format: 'JPG',
    notes: 'Generic preset — adjust to your portal\'s instructions. Common requirement for government signatures.',
    targetType: 'signature',
  },
  {
    id: 'generic-50kb',
    name: 'Generic 50 KB Limit',
    shortName: 'Under 50 KB',
    category: 'generic-size',
    description: 'Standard passport photo and document compressed strictly below 50 KB.',
    isOfficialVerified: false,
    maxBytes: 51200, // 50 KB
    format: 'JPG',
    notes: 'Generic preset — adjust to your portal\'s instructions. Extremely popular for university & job forms.',
    targetType: 'photo',
  },
  {
    id: 'generic-100kb',
    name: 'Generic 100 KB Limit',
    shortName: 'Under 100 KB',
    category: 'generic-size',
    description: 'Photo or certificate compressed strictly below 100 KB.',
    isOfficialVerified: false,
    maxBytes: 102400, // 100 KB
    format: 'JPG',
    notes: 'Generic preset — adjust to your portal\'s instructions.',
    targetType: 'document',
  },
  {
    id: 'generic-200kb',
    name: 'Generic 200 KB Limit',
    shortName: 'Under 200 KB',
    category: 'generic-size',
    description: 'High-quality document or photo strictly below 200 KB.',
    isOfficialVerified: false,
    maxBytes: 204800, // 200 KB
    format: 'JPG',
    notes: 'Generic preset — adjust to your portal\'s instructions.',
    targetType: 'document',
  },
  {
    id: 'generic-500kb',
    name: 'Generic 500 KB Limit',
    shortName: 'Under 500 KB',
    category: 'generic-size',
    description: 'Scanned document or certificate strictly below 500 KB.',
    isOfficialVerified: false,
    maxBytes: 512000, // 500 KB
    format: 'JPG',
    notes: 'Generic preset — adjust to your portal\'s instructions.',
    targetType: 'document',
  },
  {
    id: 'generic-1mb',
    name: 'Generic 1 MB Limit',
    shortName: 'Under 1 MB',
    category: 'generic-size',
    description: 'Document or PDF attachment compressed strictly below 1 MB (1024 KB).',
    isOfficialVerified: false,
    maxBytes: 1048576, // 1 MB
    format: 'JPG',
    notes: 'Generic preset — adjust to your portal\'s instructions.',
    targetType: 'document',
  },
];

export const TOOL_ROUTES = [
  { href: '/compress-image', title: 'Compress Image', desc: 'Target exact KB size (10KB to 1MB) with zero backend.' },
  { href: '/compress-image-to-20kb', title: 'Compress to 20 KB', desc: 'Target exact 20 KB limit for signatures & thumbnails.' },
  { href: '/compress-image-to-50kb', title: 'Compress to 50 KB', desc: 'Target exact 50 KB limit for entrance & job photos.' },
  { href: '/compress-image-to-100kb', title: 'Compress to 100 KB', desc: 'Target exact 100 KB limit for exam documents.' },
  { href: '/compress-image-to-200kb', title: 'Compress to 200 KB', desc: 'Target exact 200 KB limit for certificates & IDs.' },
  { href: '/resize-image', title: 'Resize Image', desc: 'Change dimensions, aspect ratio, or percentage scale.' },
  { href: '/resize-photo', title: 'Passport & Photo Resizer', desc: 'Crop to 35x45mm, 1:1, 4:5 with background tint.' },
  { href: '/resize-signature', title: 'Signature Fixer', desc: 'Auto-trim whitespace borders and enhance contrast.' },
  { href: '/jpg-to-pdf', title: 'JPG to PDF', desc: 'Combine multiple photos & scans into a single clean PDF.' },
  { href: '/merge-pdf', title: 'Merge PDF', desc: 'Combine multiple PDF documents in your browser.' },
  { href: '/split-pdf', title: 'Split & Reorder PDF', desc: 'Extract, delete, rotate, or reorder PDF pages.' },
  { href: '/compress-pdf', title: 'Compress PDF', desc: 'Reduce PDF file size without uploading.' },
  { href: '/convert-image', title: 'Convert Image Format', desc: 'Convert instantly between JPG, PNG, and WebP.' },
];

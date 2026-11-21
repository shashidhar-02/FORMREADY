/**
 * Generates a printable photo grid sheet (e.g. 4x6 inch or A4) with cut guidelines.
 */

export interface SheetOptions {
  paperSize: '4x6' | 'A4';
  copies: number; // e.g. 6, 8, 12
  dpi?: number; // default 300 DPI
  showCutLines?: boolean;
}

export function generatePhotoSheet(
  photoCanvas: HTMLCanvasElement,
  options: SheetOptions,
): HTMLCanvasElement {
  const { paperSize = '4x6', copies = 6, dpi = 300, showCutLines = true } = options;

  // Dimensions in pixels at 300 DPI
  // 4x6 inches: 1200 x 1800 pixels
  // A4: 8.27 x 11.69 inches -> 2480 x 3508 pixels
  let sheetWidth = paperSize === '4x6' ? 1200 : 2480;
  let sheetHeight = paperSize === '4x6' ? 1800 : 3508;

  // Let's orient sheet in landscape if copies fit better
  if (copies <= 8 && sheetWidth < sheetHeight && paperSize === '4x6') {
    // 1800 x 1200 landscape
    sheetWidth = 1800;
    sheetHeight = 1200;
  }

  const sheetCanvas = document.createElement('canvas');
  sheetCanvas.width = sheetWidth;
  sheetCanvas.height = sheetHeight;
  const ctx = sheetCanvas.getContext('2d');
  if (!ctx) return photoCanvas;

  // Fill sheet with crisp white paper background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, sheetWidth, sheetHeight);

  // Determine grid layout (e.g. 2 rows x 3 cols = 6, or 2 rows x 4 cols = 8)
  const cols = copies > 6 ? 4 : 3;
  const rows = Math.ceil(copies / cols);

  // Desired photo tile dimension (standard 35mm x 45mm is approx 413 x 531 px at 300 DPI)
  // 2x2 inch is 600 x 600 px at 300 DPI
  const photoAspect = photoCanvas.width / photoCanvas.height;

  const cellWidth = Math.floor(sheetWidth / cols);
  const cellHeight = Math.floor(sheetHeight / rows);

  // Maximum allowed dimension within cell allowing margins
  const marginX = Math.floor(cellWidth * 0.1);
  const marginY = Math.floor(cellHeight * 0.1);
  const maxTileW = cellWidth - marginX * 2;
  const maxTileH = cellHeight - marginY * 2;

  let tileW = maxTileW;
  let tileH = Math.round(tileW / photoAspect);
  if (tileH > maxTileH) {
    tileH = maxTileH;
    tileW = Math.round(tileH * photoAspect);
  }

  let placed = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (placed >= copies) break;

      const cellX = c * cellWidth;
      const cellY = r * cellHeight;

      const x = cellX + Math.floor((cellWidth - tileW) / 2);
      const y = cellY + Math.floor((cellHeight - tileH) / 2);

      // Draw photo
      ctx.drawImage(photoCanvas, x, y, tileW, tileH);

      // Draw optional thin cut guideline
      if (showCutLines) {
        ctx.strokeStyle = '#D1D5DB'; // subtle gray border
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]); // dashed cut guide
        ctx.strokeRect(x - 1, y - 1, tileW + 2, tileH + 2);
        ctx.setLineDash([]);
      }

      placed++;
    }
  }

  return sheetCanvas;
}

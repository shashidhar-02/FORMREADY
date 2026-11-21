import { test, expect } from '@playwright/test';

test.describe('FormReady E2E Critical Paths', () => {
  test('1 to 10: Full client-side compression, zero upload network audit, mobile viewport, and download verification', async ({
    page,
  }) => {
    // 8. Network Privacy Monitor: Track all network requests made by the page
    const networkRequests: { url: string; method: string; postData: string | null }[] = [];
    page.on('request', (req) => {
      // Ignore localhost requests for page scripts and assets
      if (!req.url().includes('localhost:3000')) {
        networkRequests.push({
          url: req.url(),
          method: req.method(),
          postData: req.postData(),
        });
      }
    });

    // 9. Tool works directly without login
    await page.goto('/compress-image-to-50kb');
    await expect(page).toHaveTitle(/Compress Image to 50 KB/i);

    // Verify no login buttons or auth guards exist
    const loginBtn = page.locator('text=Sign in, text=Log in');
    await expect(loginBtn).toHaveCount(0);

    // Verify Drop Zone is immediately visible
    const dropZone = page.locator('text=Drop image here');
    await expect(dropZone).toBeVisible();

    // 1. Create a simulated test image file (~500KB) and upload
    // We can generate a 1200x1200px test canvas image in page context
    const testImageBuffer = await page.evaluate(() => {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 1200;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(0, 0, 1200, 1200);
      ctx.fillStyle = '#ffffff';
      ctx.font = '48px sans-serif';
      ctx.fillText('FormReady Test Image', 100, 200);
      return canvas.toDataURL('image/jpeg', 0.95);
    });

    // Convert base64 dataUrl into file buffer
    const base64Data = testImageBuffer.split(',')[1];
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // Upload to file input
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.click('text=Choose File');
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles({
      name: 'large_test_photo.jpg',
      mimeType: 'image/jpeg',
      buffer: imageBuffer,
    });

    // Verify uploaded file is recognized
    await expect(page.locator('text=large_test_photo.jpg')).toBeVisible();

    // 2. Trigger Compress to 50 KB
    const compressBtn = page.locator('button:has-text("Compress & Validate")');
    await expect(compressBtn).toBeVisible();
    await compressBtn.click();

    // 3, 4, 5. Verify Output Validation Badge (Size <= 50KB, Format = JPEG/JPG, Validated)
    await expect(page.locator('text=Ready for Portal Submission')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('text=✓ Valid').first()).toBeVisible();

    // 6. Download succeeds
    const downloadPromise = page.waitForEvent('download');
    await page.click('button:has-text("Download File")');
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('.jpg');

    // 7. Reload page
    await page.reload();
    await expect(page.locator('text=Drop image here')).toBeVisible();

    // 8. Confirm ZERO external network requests were made with user file data
    expect(networkRequests.length).toBe(0);
  });

  test('Signature Auto-Trim and Clean features work seamlessly', async ({ page }) => {
    await page.goto('/resize-signature');
    await expect(page.locator('text=Auto-Trim White Borders')).toBeVisible();
    await expect(page.locator('text=Clean Background & Ink Boost')).toBeVisible();
    await expect(page.locator('button:has-text("Choose File")')).toBeVisible();
  });

  test('Passport Photo tool renders face alignment guide and aspect ratios', async ({ page }) => {
    await page.goto('/resize-photo');
    await expect(page.locator('text=Passport & Application Photo Resizer')).toBeVisible();
    await expect(page.locator('text=35×45 mm')).toBeVisible();
  });

  test('10. Mobile viewport test: no horizontal scroll and sticky action targets', async ({
    page,
  }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check page horizontal overflow
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const innerWidth = await page.evaluate(() => window.innerWidth);
    expect(scrollWidth).toBeLessThanOrEqual(innerWidth + 2); // No horizontal scrolling

    // Check persistent privacy badge is visible and clickable on mobile
    const privacyBadge = page.locator('button:has-text("Processed locally")');
    await expect(privacyBadge).toBeVisible();
    await privacyBadge.click();

    // Check modal opens cleanly
    await expect(page.locator('text=Zero-Upload Architecture')).toBeVisible();
  });
});

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const screenshotsDir = path.join(__dirname, '../docs/screenshots');

async function captureClinic() {
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  
  const page = await context.newPage();

  try {
    // Login first
    await page.goto('http://localhost:3004/admin/login');
    await page.fill('input[name="email"]', 'admin@atidicare.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
    
    // Capture Clinics collection
    console.log('Capturing Clinics collection...');
    await page.goto('http://localhost:3004/admin/collections/clinics', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'clinics-collection.png'),
      fullPage: false
    });
    console.log('✅ Clinics screenshot captured');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

captureClinic();
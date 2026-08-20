import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create screenshots directory
const screenshotsDir = path.join(__dirname, '../docs/screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

async function captureScreenshot(page, url, filename, description) {
  try {
    console.log(`Capturing: ${description}...`);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ 
      path: path.join(screenshotsDir, filename),
      fullPage: false
    });
    console.log(`✅ ${description} captured`);
    return true;
  } catch (error) {
    console.log(`❌ Failed to capture ${description}: ${error.message}`);
    return false;
  }
}

async function captureScreenshots() {
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  
  const page = await context.newPage();
  page.setDefaultTimeout(20000);

  try {
    console.log('Starting screenshot capture for admin manual...\n');

    // 1. Login Screen
    await captureScreenshot(page, 'http://localhost:3003/admin', '01-login-screen.png', 'Login screen');

    // Try to login
    console.log('Attempting login...');
    try {
      await page.fill('input[name="email"]', 'admin@ktree.com', { timeout: 5000 });
      await page.fill('input[name="password"]', 'Admin@123456', { timeout: 5000 });
      await page.click('button[type="submit"]', { timeout: 5000 });
      await page.waitForTimeout(3000);
      console.log('✅ Login successful');
    } catch (error) {
      console.log('❌ Login failed, continuing with available pages...');
    }

    // 2. Dashboard/Current State
    await captureScreenshot(page, 'http://localhost:3003/admin', 'current-state.png', 'Dashboard overview');

    // 3. Collections
    const collections = [
      { url: 'http://localhost:3003/admin/collections/pages', file: '04-pages.png', name: 'Pages collection' },
      { url: 'http://localhost:3003/admin/collections/posts', file: '05-posts.png', name: 'Posts collection' },
      { url: 'http://localhost:3003/admin/collections/treatments', file: '06-treatments.png', name: 'Treatments collection' },
      { url: 'http://localhost:3003/admin/collections/media', file: '07-media.png', name: 'Media library' },
      { url: 'http://localhost:3003/admin/collections/users', file: 'users-management.png', name: 'Users management' },
      { url: 'http://localhost:3003/admin/collections/faqs', file: 'faqs-collection.png', name: 'FAQs collection' },
      { url: 'http://localhost:3003/admin/collections/testimonials', file: 'testimonials-collection.png', name: 'Testimonials' },
      { url: 'http://localhost:3003/admin/collections/locations', file: 'locations-collection.png', name: 'Locations' },
      { url: 'http://localhost:3003/admin/collections/categories', file: 'categories-collection.png', name: 'Categories' }
    ];

    for (const collection of collections) {
      await captureScreenshot(page, collection.url, collection.file, collection.name);
    }

    // 4. Global Settings
    const globals = [
      { url: 'http://localhost:3003/admin/globals/site-settings', file: '08-site-settings.png', name: 'Site Settings' },
      { url: 'http://localhost:3003/admin/globals/navigation', file: 'navigation-settings.png', name: 'Navigation settings' },
      { url: 'http://localhost:3003/admin/globals/footer', file: 'footer-settings.png', name: 'Footer settings' }
    ];

    for (const global of globals) {
      await captureScreenshot(page, global.url, global.file, global.name);
    }

    // 5. Create forms (if accessible)
    const createForms = [
      { url: 'http://localhost:3003/admin/collections/pages/create', file: 'page-create-form.png', name: 'Create Page form' },
      { url: 'http://localhost:3003/admin/collections/posts/create', file: 'post-create-form.png', name: 'Create Post form' },
      { url: 'http://localhost:3003/admin/collections/treatments/create', file: 'treatment-create-form.png', name: 'Create Treatment form' }
    ];

    for (const form of createForms) {
      const captured = await captureScreenshot(page, form.url, form.file, form.name);
      
      // Try to add some sample data if we successfully loaded the form
      if (captured && form.file === 'page-create-form.png') {
        try {
          await page.fill('input[name="title"]', 'About Us', { timeout: 2000 });
          await page.fill('input[name="slug"]', 'about-us', { timeout: 2000 });
          await page.screenshot({ 
            path: path.join(screenshotsDir, 'page-form-filled.png'),
            fullPage: false
          });
          console.log('✅ Captured filled page form');
        } catch (e) {
          // Ignore errors when filling forms
        }
      }
    }

    console.log('\n📸 Screenshot capture completed!');
    console.log(`📁 Screenshots saved to: ${screenshotsDir}`);
    
    // List captured screenshots
    const files = fs.readdirSync(screenshotsDir).filter(f => f.endsWith('.png'));
    console.log(`\n📊 Total screenshots captured: ${files.length}`);
    console.log('Files:');
    files.forEach(file => console.log(`  - ${file}`));
    
  } catch (error) {
    console.error('Fatal error:', error.message);
  } finally {
    await browser.close();
  }
}

// Run the capture
captureScreenshots().then(() => {
  process.exit(0);
}).catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
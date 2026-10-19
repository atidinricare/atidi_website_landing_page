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

async function captureScreenshots() {
  const browser = await chromium.launch({ 
    headless: true,  // Run in headless mode
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  
  const page = await context.newPage();
  page.setDefaultTimeout(30000);

  try {
    console.log('Starting screenshot capture process...');

    // 1. Login Screen (before login)
    console.log('1. Navigating to login page...');
    await page.goto('http://localhost:3003/admin/login', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    console.log('   Taking login screen screenshot...');
    await page.screenshot({ 
      path: path.join(screenshotsDir, '01-login-screen.png'),
      fullPage: false
    });

    // 2. Perform login
    console.log('2. Logging in...');
    await page.fill('input[name="email"]', 'admin@atidicare.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    // Wait for navigation after login
    console.log('   Waiting for login to complete...');
    try {
      await page.waitForURL('**/admin', { timeout: 10000 });
    } catch (e) {
      console.log('   Navigation timeout, checking URL...');
    }
    await page.waitForTimeout(3000);
    
    // Check if we're actually logged in
    const url = page.url();
    console.log('   Current URL after login:', url);
    
    // Check for admin dashboard elements
    const isLoggedIn = await page.$$eval('nav', navs => navs.length > 0) || 
                       !url.includes('/login');
    
    if (isLoggedIn) {
      console.log('✅ Successfully logged in!');
      
      // 3. Dashboard
      console.log('3. Capturing dashboard...');
      await page.goto('http://localhost:3003/admin', { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);
      await page.screenshot({ 
        path: path.join(screenshotsDir, 'current-state.png'),
        fullPage: false
      });

      // 4. Pages Collection
      console.log('4. Capturing Pages collection...');
      await page.goto('http://localhost:3003/admin/collections/pages', { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);
      await page.screenshot({ 
        path: path.join(screenshotsDir, '04-pages.png'),
        fullPage: false
      });

      // 5. Posts Collection
      console.log('5. Capturing Posts collection...');
      await page.goto('http://localhost:3003/admin/collections/posts', { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);
      await page.screenshot({ 
        path: path.join(screenshotsDir, '05-posts.png'),
        fullPage: false
      });

      // 6. Treatments Collection
      console.log('6. Capturing Treatments collection...');
      await page.goto('http://localhost:3003/admin/collections/treatments', { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);
      await page.screenshot({ 
        path: path.join(screenshotsDir, '06-treatments.png'),
        fullPage: false
      });

      // 7. Media Library
      console.log('7. Capturing Media library...');
      await page.goto('http://localhost:3003/admin/collections/media', { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);
      await page.screenshot({ 
        path: path.join(screenshotsDir, '07-media.png'),
        fullPage: false
      });

      // 8. Site Settings
      console.log('8. Capturing Site Settings...');
      await page.goto('http://localhost:3003/admin/globals/site-settings', { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);
      await page.screenshot({ 
        path: path.join(screenshotsDir, '08-site-settings.png'),
        fullPage: false
      });

      // 9. Users Management
      console.log('9. Capturing Users management...');
      await page.goto('http://localhost:3003/admin/collections/users', { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);
      await page.screenshot({ 
        path: path.join(screenshotsDir, 'users-management.png'),
        fullPage: false
      });

      // 10. FAQs Collection
      console.log('10. Capturing FAQs collection...');
      await page.goto('http://localhost:3003/admin/collections/faqs', { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);
      await page.screenshot({ 
        path: path.join(screenshotsDir, 'faqs-collection.png'),
        fullPage: false
      });

      // 11. Testimonials
      console.log('11. Capturing Testimonials...');
      await page.goto('http://localhost:3003/admin/collections/testimonials', { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);
      await page.screenshot({ 
        path: path.join(screenshotsDir, 'testimonials-collection.png'),
        fullPage: false
      });

      // 12. Locations
      console.log('12. Capturing Locations...');
      await page.goto('http://localhost:3003/admin/collections/locations', { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);
      await page.screenshot({ 
        path: path.join(screenshotsDir, 'locations-collection.png'),
        fullPage: false
      });

      // 13. Categories
      console.log('13. Capturing Categories...');
      await page.goto('http://localhost:3003/admin/collections/categories', { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);
      await page.screenshot({ 
        path: path.join(screenshotsDir, 'categories-collection.png'),
        fullPage: false
      });

      // 14. Navigation Settings
      console.log('14. Capturing Navigation settings...');
      await page.goto('http://localhost:3003/admin/globals/navigation', { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);
      await page.screenshot({ 
        path: path.join(screenshotsDir, 'navigation-settings.png'),
        fullPage: false
      });

      // 15. Footer Settings
      console.log('15. Capturing Footer settings...');
      await page.goto('http://localhost:3003/admin/globals/footer', { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);
      await page.screenshot({ 
        path: path.join(screenshotsDir, 'footer-settings.png'),
        fullPage: false
      });

      console.log('\n✅ All screenshots captured successfully!');
      console.log(`📁 Screenshots saved to: ${screenshotsDir}`);
      
    } else {
      console.log('❌ Login failed - still on login page');
    }

  } catch (error) {
    console.error('Error capturing screenshots:', error);
    
    // Capture error state
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'error-state.png'),
      fullPage: true
    });
  } finally {
    await browser.close();
  }
}

// Run the capture
captureScreenshots().then(() => {
  console.log('Process complete!');
  process.exit(0);
}).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
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
  console.log('Launching browser...');
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    ignoreHTTPSErrors: true
  });
  
  const page = await context.newPage();
  
  // Increase timeouts
  page.setDefaultTimeout(60000);
  page.setDefaultNavigationTimeout(60000);

  const screenshots = [];

  try {
    console.log('Starting screenshot capture...');
    
    // 1. Try to access the admin page
    console.log('Going to admin login page...');
    const response = await page.goto('http://localhost:3003/admin', {
      waitUntil: 'networkidle',
      timeout: 60000
    });
    
    if (!response) {
      console.log('No response from server');
      throw new Error('Server not responding');
    }
    
    console.log('Response status:', response.status());
    await page.waitForTimeout(3000);
    
    // Capture login screen
    console.log('Capturing login screen...');
    const loginScreenshot = path.join(screenshotsDir, '01-login-screen.png');
    await page.screenshot({ 
      path: loginScreenshot,
      fullPage: false
    });
    screenshots.push(loginScreenshot);
    console.log('✓ Login screen captured');

    // Check what's on the page
    const pageTitle = await page.title();
    console.log('Page title:', pageTitle);
    
    // Look for login form elements
    const emailField = await page.$('input[name="email"], input[type="email"], #email');
    const passwordField = await page.$('input[name="password"], input[type="password"], #password');
    
    if (emailField && passwordField) {
      console.log('Found login form fields');
      
      // Fill login form
      await page.fill('input[name="email"], input[type="email"], #email', 'admin@ktree.com');
      await page.fill('input[name="password"], input[type="password"], #password', 'Admin@123456');
      
      // Capture filled form
      const filledFormScreenshot = path.join(screenshotsDir, '02-login-filled.png');
      await page.screenshot({ 
        path: filledFormScreenshot,
        fullPage: false
      });
      screenshots.push(filledFormScreenshot);
      console.log('✓ Filled login form captured');
      
      // Try to submit
      const submitButton = await page.$('button[type="submit"], input[type="submit"], button:has-text("Login"), button:has-text("Sign In")');
      if (submitButton) {
        console.log('Found submit button, attempting login...');
        await submitButton.click();
        
        // Wait for navigation or error
        await page.waitForTimeout(5000);
        
        const currentUrl = page.url();
        console.log('Current URL after login attempt:', currentUrl);
        
        // Capture whatever state we're in
        const postLoginScreenshot = path.join(screenshotsDir, '03-after-login.png');
        await page.screenshot({ 
          path: postLoginScreenshot,
          fullPage: false
        });
        screenshots.push(postLoginScreenshot);
        console.log('✓ Post-login state captured');
      }
    } else {
      console.log('Login form not found, capturing current state');
      
      // Still capture what we can see
      const currentStateScreenshot = path.join(screenshotsDir, 'current-state.png');
      await page.screenshot({ 
        path: currentStateScreenshot,
        fullPage: true
      });
      screenshots.push(currentStateScreenshot);
    }
    
    // Try to navigate to different sections even if not logged in
    const routes = [
      { path: '/admin/collections/pages', name: '04-pages' },
      { path: '/admin/collections/posts', name: '05-posts' },
      { path: '/admin/collections/treatments', name: '06-treatments' },
      { path: '/admin/collections/media', name: '07-media' },
      { path: '/admin/globals/site-settings', name: '08-site-settings' }
    ];
    
    for (const route of routes) {
      try {
        console.log(`Trying to capture ${route.name}...`);
        await page.goto(`http://localhost:3003${route.path}`, {
          waitUntil: 'networkidle',
          timeout: 30000
        });
        await page.waitForTimeout(2000);
        
        const screenshotPath = path.join(screenshotsDir, `${route.name}.png`);
        await page.screenshot({ 
          path: screenshotPath,
          fullPage: false
        });
        screenshots.push(screenshotPath);
        console.log(`✓ ${route.name} captured`);
      } catch (err) {
        console.log(`✗ Could not capture ${route.name}:`, err.message);
      }
    }
    
  } catch (error) {
    console.error('Error during capture:', error.message);
    
    // Capture error state
    try {
      const errorScreenshot = path.join(screenshotsDir, 'error-state.png');
      await page.screenshot({ 
        path: errorScreenshot,
        fullPage: true
      });
      screenshots.push(errorScreenshot);
    } catch (screenshotError) {
      console.error('Could not capture error screenshot:', screenshotError.message);
    }
  } finally {
    await browser.close();
    console.log(`\n📸 Captured ${screenshots.length} screenshots`);
    console.log('Screenshots saved to:', screenshotsDir);
  }
  
  return screenshots;
}

// Run the capture
captureScreenshots().then((screenshots) => {
  console.log('\n✅ Screenshot capture complete!');
  console.log('Files created:');
  screenshots.forEach(file => console.log('  -', path.basename(file)));
  process.exit(0);
}).catch(error => {
  console.error('\n❌ Fatal error:', error.message);
  console.error(error.stack);
  process.exit(1);
});
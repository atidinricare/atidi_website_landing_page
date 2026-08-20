import { chromium } from 'playwright';

async function testLogin() {
  const browser = await chromium.launch({ 
    headless: true,  // Run headless
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  try {
    console.log('Navigating to admin login...');
    await page.goto('http://localhost:3003/admin/login');
    await page.waitForTimeout(2000);
    
    console.log('Looking for form fields...');
    
    // Check what fields are available
    const emailField = await page.$('input[name="email"]');
    const passwordField = await page.$('input[name="password"]');
    const submitButton = await page.$('button[type="submit"]');
    
    console.log('Email field found:', !!emailField);
    console.log('Password field found:', !!passwordField);
    console.log('Submit button found:', !!submitButton);
    
    if (emailField && passwordField && submitButton) {
      console.log('Filling in credentials...');
      await page.fill('input[name="email"]', 'admin@ktree.com');
      await page.fill('input[name="password"]', 'Admin@123456');
      
      console.log('Clicking submit...');
      await page.click('button[type="submit"]');
      
      console.log('Waiting for response...');
      await page.waitForTimeout(5000);
      
      const newUrl = page.url();
      console.log('New URL:', newUrl);
      
      // Check for error messages
      const errorMessage = await page.$('.error, .alert, [role="alert"]');
      if (errorMessage) {
        const errorText = await errorMessage.textContent();
        console.log('Error message found:', errorText);
      }
      
      // Check page content
      const pageContent = await page.textContent('body');
      if (pageContent.includes('Invalid') || pageContent.includes('incorrect')) {
        console.log('Login error detected in page content');
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

testLogin();
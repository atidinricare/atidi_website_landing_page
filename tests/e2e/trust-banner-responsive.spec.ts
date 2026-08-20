import { test, expect } from '@playwright/test'

const viewports = [
  { name: 'desktop-1920', width: 1920, height: 1080 },
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'desktop-1366', width: 1366, height: 768 },
  { name: 'desktop-1280', width: 1280, height: 800 },
  { name: 'laptop-1200', width: 1200, height: 800 },
  { name: 'tablet-landscape-1024', width: 1024, height: 768 },
  { name: 'tablet-900', width: 900, height: 1024 },
  { name: 'tablet-portrait-768', width: 768, height: 1024 },
  { name: 'mobile-640', width: 640, height: 900 },
  { name: 'mobile-480', width: 480, height: 844 },
  { name: 'mobile-400', width: 400, height: 844 },
  { name: 'mobile-375', width: 375, height: 812 },
  { name: 'mobile-360', width: 360, height: 740 },
  { name: 'mobile-320', width: 320, height: 568 },
]

const BASE = process.env.BASE_URL || 'http://localhost:11000'

for (const vp of viewports) {
  test(`TrustBanner layout at ${vp.name} (${vp.width}x${vp.height})`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height })
    await page.goto(BASE, { waitUntil: 'networkidle' })

    // Wait for trust banner to be visible
    const trustSection = page.locator('section').filter({ has: page.locator('text=Certified Hospitals') }).first()
    await trustSection.scrollIntoViewIfNeeded()
    await page.waitForTimeout(2000)

    // Screenshot the trust banner area
    await trustSection.screenshot({
      path: `test-results/trust-banner-${vp.name}.png`,
    })

    // Check that all stat numbers are visible and not clipped
    const numbers = ['121', '80%', '24/7', '100%']
    for (const num of numbers) {
      const el = trustSection.locator(`text="${num}"`).first()
      await expect(el).toBeVisible()

      // Check the element is not overflowing its container
      const box = await el.boundingBox()
      expect(box).not.toBeNull()
      if (box) {
        expect(box.width).toBeGreaterThan(0)
        expect(box.height).toBeGreaterThan(0)
      }
    }

    // Check titles are visible
    const titles = ['Certified Hospitals', 'Cost Savings', 'USA Support', 'Digital Records']
    for (const title of titles) {
      const el = trustSection.locator(`text="${title}"`).first()
      await expect(el).toBeVisible()
    }

    // Check "As Featured In" text
    await expect(trustSection.locator('text=As Featured In')).toBeVisible()

    // Check media logos
    const logos = ['Times of India', 'Entrepreneur', 'The Economic Times', 'Business Standard', 'YourStory']
    for (const logo of logos) {
      const el = trustSection.locator(`text="${logo}"`).first()
      await expect(el).toBeVisible()
    }

    // Check for overflow issues - stat items shouldn't overflow their parent
    const items = trustSection.locator('[class*="item"]')
    const itemCount = await items.count()

    const sectionBox = await trustSection.boundingBox()
    if (sectionBox) {
      for (let i = 0; i < itemCount; i++) {
        const itemBox = await items.nth(i).boundingBox()
        if (itemBox) {
          // Item should not extend beyond the section bounds horizontally
          const itemRight = itemBox.x + itemBox.width
          const sectionRight = sectionBox.x + sectionBox.width
          expect(itemRight).toBeLessThanOrEqual(sectionRight + 2) // 2px tolerance
        }
      }
    }
  })
}

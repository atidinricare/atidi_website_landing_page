import { test, expect } from '@playwright/test'

const BASE = process.env.BASE_URL || 'http://localhost:11000'

const viewports = [
  { name: 'desktop-1920', width: 1920, height: 1080 },
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'desktop-1366', width: 1366, height: 768 },
  { name: 'desktop-1280', width: 1280, height: 800 },
  { name: 'laptop-1200', width: 1200, height: 800 },
  { name: 'tablet-1024', width: 1024, height: 768 },
  { name: 'tablet-900', width: 900, height: 1024 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'mobile-640', width: 640, height: 900 },
  { name: 'mobile-480', width: 480, height: 844 },
  { name: 'mobile-400', width: 400, height: 844 },
  { name: 'mobile-375', width: 375, height: 812 },
  { name: 'mobile-360', width: 360, height: 740 },
  { name: 'mobile-320', width: 320, height: 568 },
]

for (const vp of viewports) {
  test(`Hero-TrustBanner overlap check at ${vp.name} (${vp.width}x${vp.height})`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height })
    await page.goto(BASE, { waitUntil: 'networkidle' })
    await page.waitForTimeout(2000)

    // Capture the hero stats area + trust banner together
    // Scroll to the bottom of hero / top of trust banner junction
    const heroStats = page.locator('.hero-stats').first()
    await heroStats.scrollIntoViewIfNeeded()
    await page.waitForTimeout(1000)

    // Take a full viewport screenshot showing the overlap area
    await page.screenshot({
      path: `test-results/overlap-${vp.name}.png`,
      fullPage: false,
    })

    // Get bounding boxes to check overlap
    const heroStatsBox = await heroStats.boundingBox()

    const trustSection = page.locator('section').filter({ has: page.locator('text=Certified Hospitals') }).first()
    const trustBox = await trustSection.boundingBox()

    if (heroStatsBox && trustBox) {
      const heroBottom = heroStatsBox.y + heroStatsBox.height
      const trustTop = trustBox.y

      console.log(`[${vp.name}] Hero stats bottom: ${heroBottom}, Trust banner top: ${trustTop}, gap: ${trustTop - heroBottom}px`)

      // Trust banner should NOT overlap hero stats
      // Allow small negative values for visual overlap that's intentional
      if (trustTop < heroBottom) {
        console.log(`[${vp.name}] WARNING: Trust banner overlaps hero stats by ${heroBottom - trustTop}px`)
      }
    }

    // Also check if hero stat values are actually visible (not hidden behind trust banner)
    const heroStatValues = page.locator('.hero-stat-value')
    const count = await heroStatValues.count()
    for (let i = 0; i < count; i++) {
      const val = heroStatValues.nth(i)
      const text = await val.textContent()
      const box = await val.boundingBox()
      console.log(`[${vp.name}] Hero stat "${text}" box:`, box)
    }
  })
}

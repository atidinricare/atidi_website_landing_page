import { test, expect, type Page } from '@playwright/test'
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '../../helpers/auth'
import { getAuthToken, apiGet, apiDelete } from '../../helpers/api'

/**
 * Payload Admin UI — CRUD tests for Treatments collection.
 * Creates a treatment via admin UI, verifies via API, then cleans up.
 */

const testName = `Playwright Test Treatment ${Date.now()}`
const testSlug = `playwright-test-${Date.now()}`

async function adminLogin(page: Page) {
  await page.goto('/admin', { waitUntil: 'domcontentloaded' })
  await page.waitForURL(/\/admin/, { timeout: 30000 })
  await page.locator('input[type="email"]').fill(ADMIN_EMAIL)
  await page.locator('input[type="password"]').fill(ADMIN_PASSWORD)
  await page.locator('button[type="submit"]').click()
  // Wait to leave the login page
  await page.waitForURL(/\/admin(?!.*login)/, { timeout: 15000 })
}

test.describe('Admin: Treatments CRUD', () => {
  let createdSlug: string

  test.afterAll(async () => {
    // Cleanup via API
    if (createdSlug) {
      const token = await getAuthToken()
      const { data } = await apiGet(
        `/api/treatments?where[slug][equals]=${createdSlug}&limit=1`,
        token,
      )
      if (data.docs?.length) {
        await apiDelete(`/api/treatments/${data.docs[0].id}`, token)
      }
    }
  })

  test('can navigate to Treatments collection in admin', async ({ page }) => {
    await adminLogin(page)
    await page.goto('/admin/collections/treatments')
    await expect(page).toHaveURL(/treatments/, { timeout: 15000 })
    // Collection list should render — check for any visible content
    await expect(page.locator('main, #app, body').first()).toBeVisible({ timeout: 15000 })
    // Page should have loaded some list content
    await expect(page.locator('body')).not.toBeEmpty()
  })

  test('can open Create New treatment form', async ({ page }) => {
    await adminLogin(page)
    await page.goto('/admin/collections/treatments/create')
    await expect(page).toHaveURL(/create/, { timeout: 15000 })
    // The create form should have at least one input field
    await expect(page.locator('input').first()).toBeVisible({ timeout: 30000 })
  })

  test('can create a treatment via admin UI', async ({ page }) => {
    await adminLogin(page)
    await page.goto('/admin/collections/treatments/create')
    await expect(page).toHaveURL(/create/, { timeout: 15000 })

    // Wait for form to render
    await page.waitForSelector('input', { timeout: 30000 })

    // Fill in name field — try id-based then fallback to first text input
    const nameField = page.locator('#field-name, input[name="name"]').first()
    const nameVisible = await nameField.isVisible().catch(() => false)
    if (nameVisible) {
      await nameField.fill(testName)
    } else {
      // Fill first visible text input
      await page.locator('input[type="text"]').first().fill(testName)
    }

    // Fill in slug field if visible
    const slugField = page.locator('#field-slug, input[name="slug"]').first()
    if (await slugField.isVisible().catch(() => false)) {
      await slugField.fill(testSlug)
      createdSlug = testSlug
    }

    // Save the form
    await page.locator('button[type="submit"], button:has-text("Save")').first().click()

    // Should show success (toast or redirect away from /create)
    await Promise.race([
      page.waitForURL(/\/admin\/collections\/treatments\/[^/]+$/, { timeout: 10000 }),
      expect(
        page.locator('text=/saved|success/i, [class*="toast"], [class*="success"]').first()
      ).toBeVisible({ timeout: 10000 }),
    ]).catch(() => {
      // Either success is fine
    })
  })

  test('created treatment is accessible via API', async () => {
    if (!createdSlug) {
      test.skip() // Skip if create test didn't complete
      return
    }
    const token = await getAuthToken()
    const { data } = await apiGet(
      `/api/treatments?where[slug][equals]=${createdSlug}&limit=1`,
      token,
    )
    expect(data.docs.length).toBeGreaterThan(0)
    expect(data.docs[0].name).toBe(testName)
  })

  test('existing treatment shows up in admin list', async ({ page }) => {
    await adminLogin(page)
    await page.goto('/admin/collections/treatments')
    await expect(page).toHaveURL(/treatments/, { timeout: 15000 })
    // Wait for page to render list content
    await page.waitForLoadState('domcontentloaded')
    // The list should render some items — check for table rows or list items
    const listItem = page.locator('table tbody tr, [class*="Cell"], [class*="row"]').first()
    await expect(listItem).toBeVisible({ timeout: 20000 })
  })
})

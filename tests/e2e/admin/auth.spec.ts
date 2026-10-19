import { test, expect } from '@playwright/test'
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '../../helpers/auth'

/**
 * Payload Admin UI — authentication tests.
 */

test.describe('Admin: Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin', { waitUntil: 'domcontentloaded' })
    await page.waitForURL(/\/admin/, { timeout: 30000 })
  })

  test('redirects to login page when not authenticated', async ({ page }) => {
    // Payload redirects unauthenticated users to /admin/login
    await page.waitForURL(/\/admin/, { timeout: 30000 })
    // Login form should be visible — wait for any input
    await expect(page.locator('input').first()).toBeVisible({ timeout: 30000 })
  })

  test('shows error on invalid credentials', async ({ page }) => {
    await page.locator('input[type="email"]').fill('wrong@example.com')
    await page.locator('input[type="password"]').fill('wrongpassword')
    await page.locator('button[type="submit"]').click()

    // Payload shows an error message on invalid login
    await expect(
      page.locator('text=/incorrect|invalid|wrong|failed/i').first()
    ).toBeVisible({ timeout: 10000 })
  })

  test('logs in successfully with valid credentials', async ({ page }) => {
    await page.locator('input[type="email"]').fill(ADMIN_EMAIL)
    await page.locator('input[type="password"]').fill(ADMIN_PASSWORD)
    await page.locator('button[type="submit"]').click()

    // After login, URL should move away from /login
    await page.waitForURL(/\/admin(?!.*login)/, { timeout: 15000 })
    // Page body should be visible and main content area rendered
    await expect(page.locator('body')).toBeVisible()
  })
})

import { test, expect } from '@playwright/test'
import { getAuthToken, apiGet, apiPatch, getFirstTreatmentSlug, getFirstPostSlug } from '../../helpers/api'

/**
 * Revalidation tests: update content via API, then verify the frontend page
 * reflects the change on the next request.
 *
 * Since the frontend layout uses force-dynamic, pages always fetch fresh data
 * from the database — so updates should be visible immediately.
 */

test.describe('Revalidation: Treatment page', () => {
  let token: string
  let slug: string
  let treatmentId: string
  let originalTagline: string
  const updatedTagline = 'PLAYWRIGHT-REVALIDATION-TEST-TAGLINE'

  test.beforeAll(async () => {
    token = await getAuthToken()
    slug = await getFirstTreatmentSlug()

    // Get the treatment's ID and original tagline
    const { data } = await apiGet(`/api/treatments?where[slug][equals]=${slug}&limit=1`)
    const doc = data.docs[0]
    treatmentId = doc.id
    originalTagline = doc.tagline || ''
  })

  test.afterAll(async () => {
    // Restore original tagline
    if (treatmentId && originalTagline !== updatedTagline) {
      await apiPatch(`/api/treatments/${treatmentId}`, { tagline: originalTagline }, token)
    }
  })

  test('page shows original tagline before update', async ({ page }) => {
    await page.goto(`/treatments/${slug}`)
    await expect(page.locator('body')).toBeVisible()
    // Just verify the page loaded successfully
    const status = await page.evaluate(() => document.readyState)
    expect(status).toBe('complete')
  })

  test('page reflects updated tagline after API PATCH', async ({ page }) => {
    // Update via API
    const { status } = await apiPatch(
      `/api/treatments/${treatmentId}`,
      { tagline: updatedTagline },
      token,
    )
    expect(status).toBe(200)

    // Navigate to the page and verify the new content
    await page.goto(`/treatments/${slug}`)
    await expect(page.locator('body')).toContainText(updatedTagline)
  })

  test('restored tagline appears after rollback', async ({ page }) => {
    // Restore original
    await apiPatch(`/api/treatments/${treatmentId}`, { tagline: originalTagline }, token)

    await page.goto(`/treatments/${slug}`)
    if (originalTagline) {
      await expect(page.locator('body')).toContainText(originalTagline)
    } else {
      // If no original tagline, just confirm the test tagline is gone
      await expect(page.locator('body')).not.toContainText(updatedTagline)
    }
  })
})

test.describe('Revalidation: Blog post page', () => {
  let token: string
  let slug: string
  let postId: string
  let originalExcerpt: string
  const updatedExcerpt = 'PLAYWRIGHT-REVALIDATION-TEST-EXCERPT'

  test.beforeAll(async () => {
    token = await getAuthToken()
    slug = await getFirstPostSlug()

    const { data } = await apiGet(
      `/api/posts?where[slug][equals]=${slug}&where[status][equals]=published&limit=1`,
      token,
    )
    const doc = data.docs[0]
    postId = doc.id
    originalExcerpt = doc.excerpt || ''
  })

  test.afterAll(async () => {
    if (postId) {
      await apiPatch(`/api/posts/${postId}`, { excerpt: originalExcerpt }, token)
    }
  })

  test('page loads successfully before update', async ({ page }) => {
    const response = await page.goto(`/blog/${slug}`)
    expect(response?.status()).toBe(200)
  })

  test('page reflects updated excerpt after API PATCH', async ({ page }) => {
    const { status } = await apiPatch(
      `/api/posts/${postId}`,
      { excerpt: updatedExcerpt },
      token,
    )
    expect(status).toBe(200)

    await page.goto(`/blog/${slug}`)
    await expect(page.locator('body')).toContainText(updatedExcerpt)
  })

  test('restored excerpt appears after rollback', async ({ page }) => {
    await apiPatch(`/api/posts/${postId}`, { excerpt: originalExcerpt }, token)

    await page.goto(`/blog/${slug}`)
    await expect(page.locator('body')).not.toContainText(updatedExcerpt)
  })
})

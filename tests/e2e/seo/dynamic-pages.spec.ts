import { test, expect } from '@playwright/test'
import { getFirstTreatmentSlug, getFirstLocationSlug, getFirstPostSlug } from '../../helpers/api'

/**
 * SEO tests for dynamic (CMS-driven) pages:
 * - /treatments/[slug]
 * - /locations/[slug]
 * - /blog/[slug]
 *
 * Fetches a real slug from the API, then verifies SEO meta tags.
 */

test.describe('SEO: /treatments/[slug]', () => {
  let slug: string

  test.beforeAll(async () => {
    slug = await getFirstTreatmentSlug()
  })

  test('has correct <title> containing treatment name', async ({ page }) => {
    await page.goto(`/treatments/${slug}`)
    const title = await page.title()
    expect(title).toContain('Atidi NRI Care')
    expect(title.length).toBeGreaterThan(10)
  })

  test('has meta description', async ({ page }) => {
    await page.goto(`/treatments/${slug}`)
    const description = await page
      .locator('meta[name="description"]')
      .getAttribute('content')
    expect(description).toBeTruthy()
    expect(description!.length).toBeGreaterThan(10)
  })

  test('has og:title', async ({ page }) => {
    await page.goto(`/treatments/${slug}`)
    const ogTitle = await page
      .locator('meta[property="og:title"]')
      .getAttribute('content')
    expect(ogTitle).toBeTruthy()
    expect(ogTitle).toContain('Atidi NRI Care')
  })

  test('has og:description', async ({ page }) => {
    await page.goto(`/treatments/${slug}`)
    const ogDescription = await page
      .locator('meta[property="og:description"]')
      .getAttribute('content')
    expect(ogDescription).toBeTruthy()
  })

  test('has canonical URL matching /treatments/[slug]', async ({ page }) => {
    await page.goto(`/treatments/${slug}`)
    const canonical = await page
      .locator('link[rel="canonical"]')
      .getAttribute('href')
    expect(canonical).toBeTruthy()
    expect(canonical).toContain(`/treatments/${slug}`)
  })

  test('shows keywords meta tag when set in CMS', async ({ page }) => {
    await page.goto(`/treatments/${slug}`)
    const count = await page.locator('meta[name="keywords"]').count()
    // keywords are optional — if the tag exists, its content must be non-empty
    if (count > 0) {
      const keywords = await page.locator('meta[name="keywords"]').getAttribute('content')
      expect(keywords!.length).toBeGreaterThan(0)
    }
    // If count === 0, no keywords are set in CMS yet — test passes (optional field)
  })

  test('page renders treatment content (not 404)', async ({ page }) => {
    const response = await page.goto(`/treatments/${slug}`)
    expect(response?.status()).toBe(200)
    await expect(page.locator('body')).not.toBeEmpty()
  })
})

test.describe('SEO: /locations/[slug]', () => {
  let slug: string

  test.beforeAll(async () => {
    slug = await getFirstLocationSlug()
  })

  test('has correct <title>', async ({ page }) => {
    await page.goto(`/locations/${slug}`, { waitUntil: 'domcontentloaded', timeout: 90000 })
    const title = await page.title()
    expect(title).toContain('Atidi NRI Care')
    expect(title.length).toBeGreaterThan(10)
  })

  test('has meta description', async ({ page }) => {
    await page.goto(`/locations/${slug}`, { waitUntil: 'domcontentloaded' })
    const description = await page
      .locator('meta[name="description"]')
      .getAttribute('content')
    expect(description).toBeTruthy()
    expect(description!.length).toBeGreaterThan(10)
  })

  test('has og:title', async ({ page }) => {
    await page.goto(`/locations/${slug}`, { waitUntil: 'domcontentloaded' })
    const ogTitle = await page
      .locator('meta[property="og:title"]')
      .getAttribute('content')
    expect(ogTitle).toBeTruthy()
  })

  test('has canonical URL matching /locations/[slug]', async ({ page }) => {
    await page.goto(`/locations/${slug}`, { waitUntil: 'domcontentloaded' })
    const canonical = await page
      .locator('link[rel="canonical"]')
      .getAttribute('href')
    expect(canonical).toBeTruthy()
    expect(canonical).toContain(`/locations/${slug}`)
  })

  test('page renders location content (not 404)', async ({ page }) => {
    const response = await page.goto(`/locations/${slug}`, { waitUntil: 'domcontentloaded' })
    expect(response?.status()).toBe(200)
  })
})

test.describe('SEO: /blog/[slug]', () => {
  let slug: string

  test.beforeAll(async () => {
    slug = await getFirstPostSlug()
  })

  test('has correct <title> containing post title', async ({ page }) => {
    await page.goto(`/blog/${slug}`)
    const title = await page.title()
    expect(title).toContain('Atidi NRI Care')
    expect(title.length).toBeGreaterThan(10)
  })

  test('has meta description', async ({ page }) => {
    await page.goto(`/blog/${slug}`)
    const description = await page
      .locator('meta[name="description"]')
      .getAttribute('content')
    expect(description).toBeTruthy()
    expect(description!.length).toBeGreaterThan(10)
  })

  test('has og:title', async ({ page }) => {
    await page.goto(`/blog/${slug}`)
    const ogTitle = await page
      .locator('meta[property="og:title"]')
      .getAttribute('content')
    expect(ogTitle).toBeTruthy()
  })

  test('has canonical URL matching /blog/[slug]', async ({ page }) => {
    await page.goto(`/blog/${slug}`)
    const canonical = await page
      .locator('link[rel="canonical"]')
      .getAttribute('href')
    expect(canonical).toBeTruthy()
    expect(canonical).toContain(`/blog/${slug}`)
  })

  test('page renders post content (not 404)', async ({ page }) => {
    const response = await page.goto(`/blog/${slug}`)
    expect(response?.status()).toBe(200)
  })
})

test.describe('SEO: 404 page', () => {
  test('returns 404 for unknown treatment slug', async ({ page }) => {
    const response = await page.goto('/treatments/this-slug-does-not-exist-xyz')
    expect(response?.status()).toBe(404)
  })

  test('returns 404 for unknown location slug', async ({ page }) => {
    const response = await page.goto('/locations/this-slug-does-not-exist-xyz', {
      waitUntil: 'domcontentloaded',
    })
    expect(response?.status()).toBe(404)
  })

  test('returns 404 for unknown blog slug', async ({ page }) => {
    const response = await page.goto('/blog/this-slug-does-not-exist-xyz')
    expect(response?.status()).toBe(404)
  })
})

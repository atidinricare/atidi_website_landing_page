import { test, expect } from '@playwright/test'

const BOOK_URL = 'https://app.atidinricare.com/'

test.describe('Website corrections v2', () => {
  test('sticky Book Appointment CTA is present on every frontend page', async ({ page }) => {
    const paths = ['/', '/treatments/dental-implants', '/locations/hyderabad', '/about-us', '/contact-us', '/blog']
    for (const path of paths) {
      await page.goto(path)
      const cta = page.getByTestId('book-appointment-float')
      await expect(cta, `CTA should be visible on ${path}`).toBeVisible()
      await expect(cta).toHaveAttribute('href', BOOK_URL)
      await expect(cta).toHaveAttribute('target', '_blank')
    }
  })

  test('US States Covered stat reads 10', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('US States Covered')).toBeVisible()
    await expect(page.getByText('10', { exact: true }).first()).toBeVisible()
  })

  test('Sign Up copy references the Atidi Customer app', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText(/Download the "Atidi Customer" app/)).toBeVisible()
  })

  test('FAQ lists the new opening question and drops the international-standard duplicate', async ({ page }) => {
    await page.goto('/#faq')
    await expect(page.getByRole('button', { name: /Is Atidi only for NRI patients\?/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /How do you ensure international-standard dental care\?/i })).toHaveCount(0)
  })

  test('US Office card on Contact Us shows the Malden address', async ({ page }) => {
    await page.goto('/contact-us')
    await expect(page.getByRole('heading', { name: 'India Office' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'US Office' })).toBeVisible()
    await expect(page.getByText('100 Kimball Street,')).toBeVisible()
    await expect(page.getByText('Malden, MA 02148,')).toBeVisible()
  })

  test('featured treatment card opens /treatments/[slug] in a new tab', async ({ page, context }) => {
    await page.goto('/')
    await page.locator('section#treatments').scrollIntoViewIfNeeded()

    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      page.getByRole('heading', { name: 'Dental Implants' }).first().click(),
    ])
    await newPage.waitForLoadState('domcontentloaded')
    expect(newPage.url()).toContain('/treatments/dental-implants')
    await newPage.close()
  })

  test('non-featured treatment card opens slide panel, not a new tab', async ({ page }) => {
    await page.goto('/')
    await page.locator('section#treatments').scrollIntoViewIfNeeded()

    const pagePromise = page.context().waitForEvent('page', { timeout: 1500 }).catch(() => null)
    await page.getByRole('heading', { name: 'Dental Veneers' }).first().click()
    const popup = await pagePromise
    expect(popup, 'clicking a non-featured treatment must not open a new tab').toBeNull()

    await expect(page.getByText('Dental Veneers')).toBeVisible()
  })

  test('empaneled clinic line is removed from India LocationDetail', async ({ page }) => {
    await page.goto('/locations/hyderabad')
    await expect(page.getByText(/empaneled clinic/i)).toHaveCount(0)
  })
})

import { test, expect } from '@playwright/test'

/**
 * SEO tests for all static frontend pages.
 * Verifies <title>, meta description, og:title, og:description, and canonical URL.
 */

const staticPages = [
  {
    path: '/',
    expectedTitle: 'Atidi NRI Care',
    expectedDescription: /NRI|dental|India/i,
  },
  {
    path: '/about-us',
    expectedTitle: 'About Us - Atidi NRI Care',
    expectedDescription: /Atidi NRI Care|dental|NRI/i,
    expectedCanonical: '/about-us',
  },
  {
    path: '/our-services',
    expectedTitle: 'Our Services - Atidi NRI Care',
    expectedDescription: /services|Atidi/i,
    expectedCanonical: '/our-services',
  },
  {
    path: '/clinics',
    expectedTitle: 'Our Clinics - Atidi NRI Care',
    expectedDescription: /clinics|dental|NRI/i,
    expectedCanonical: '/clinics',
  },
  {
    path: '/contact-us',
    expectedTitle: 'Contact Us - Atidi NRI Care',
    expectedDescription: /contact|Atidi|WhatsApp/i,
    expectedCanonical: '/contact-us',
  },
  {
    path: '/privacy-policy',
    expectedTitle: 'Privacy Policy - Atidi NRI Care',
    expectedDescription: /privacy/i,
    expectedCanonical: '/privacy-policy',
  },
  {
    path: '/terms-of-service',
    expectedTitle: 'Terms of Service - Atidi NRI Care',
    expectedDescription: /terms/i,
    expectedCanonical: '/terms-of-service',
  },
  {
    path: '/blog',
    expectedTitle: /Blog.*Atidi|Atidi.*Blog/i,
    expectedDescription: /blog|dental|NRI/i,
  },
]

for (const page of staticPages) {
  test.describe(`SEO: ${page.path}`, () => {
    test('has correct <title>', async ({ page: browserPage }) => {
      await browserPage.goto(page.path)
      const title = await browserPage.title()
      if (page.expectedTitle instanceof RegExp) {
        expect(title).toMatch(page.expectedTitle)
      } else {
        expect(title).toContain(page.expectedTitle)
      }
    })

    test('has meta description', async ({ page: browserPage }) => {
      await browserPage.goto(page.path)
      const description = await browserPage
        .locator('meta[name="description"]')
        .getAttribute('content')
      expect(description).toBeTruthy()
      if (page.expectedDescription) {
        expect(description).toMatch(page.expectedDescription)
      }
    })

    test('has og:title', async ({ page: browserPage }) => {
      await browserPage.goto(page.path)
      const ogTitle = await browserPage
        .locator('meta[property="og:title"]')
        .getAttribute('content')
      expect(ogTitle).toBeTruthy()
    })

    test('has og:description', async ({ page: browserPage }) => {
      await browserPage.goto(page.path)
      const ogDescription = await browserPage
        .locator('meta[property="og:description"]')
        .getAttribute('content')
      expect(ogDescription).toBeTruthy()
    })

    if (page.expectedCanonical) {
      test('has canonical URL', async ({ page: browserPage }) => {
        await browserPage.goto(page.path)
        const canonical = await browserPage
          .locator('link[rel="canonical"]')
          .getAttribute('href')
        expect(canonical).toBeTruthy()
        expect(canonical).toContain(page.expectedCanonical)
      })
    }
  })
}

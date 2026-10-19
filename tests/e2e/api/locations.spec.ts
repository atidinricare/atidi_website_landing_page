import { test, expect } from '@playwright/test'
import { getAuthToken, apiGet, apiPost, apiPatch, apiDelete } from '../../helpers/api'

/**
 * CRUD tests for the Locations collection via Payload REST API.
 */

test.describe('API: Locations CRUD', () => {
  let token: string
  let createdId: string
  const testSlug = `test-location-${Date.now()}`

  test.beforeAll(async () => {
    token = await getAuthToken()
  })

  test.afterAll(async () => {
    if (createdId) {
      await apiDelete(`/api/locations/${createdId}`, token)
    }
  })

  test('can list locations (public)', async () => {
    const { status, data } = await apiGet('/api/locations?limit=5')
    expect(status).toBe(200)
    expect(data.docs).toBeDefined()
    expect(Array.isArray(data.docs)).toBe(true)
    expect(data.totalDocs).toBeGreaterThan(0)
  })

  test('can create a new location', async () => {
    const { status, data } = await apiPost(
      '/api/locations',
      {
        city: 'Test City',
        slug: testSlug,
        state: 'Test State',
        country: 'India',
        type: 'treatment',
        tagline: 'A test location created by Playwright',
        coordinates: { lat: 17.38, lng: 78.46 },
      },
      token,
    )
    expect(status).toBe(201)
    expect(data.doc).toBeDefined()
    expect(data.doc.city).toBe('Test City')
    expect(data.doc.slug).toBe(testSlug)
    createdId = data.doc.id
  })

  test('can read the created location by ID', async () => {
    const { status, data } = await apiGet(`/api/locations/${createdId}`, token)
    expect(status).toBe(200)
    expect(data.id).toBe(createdId)
    expect(data.city).toBe('Test City')
  })

  test('can update location tagline', async () => {
    const { status, data } = await apiPatch(
      `/api/locations/${createdId}`,
      { tagline: 'Updated tagline by Playwright' },
      token,
    )
    expect(status).toBe(200)
    expect(data.doc.tagline).toBe('Updated tagline by Playwright')
  })

  test('can set SEO meta title via meta group', async () => {
    const { status, data } = await apiPatch(
      `/api/locations/${createdId}`,
      { meta: { title: 'Test City Dental Care - Atidi NRI Care' } },
      token,
    )
    expect(status).toBe(200)
    expect(data.doc.meta?.title).toBe('Test City Dental Care - Atidi NRI Care')
  })

  test('can delete the location', async () => {
    const { status } = await apiDelete(`/api/locations/${createdId}`, token)
    expect(status).toBe(200)
    createdId = ''
  })

  test('deleted location is no longer found', async () => {
    const { data } = await apiGet(
      `/api/locations?where[slug][equals]=${testSlug}&limit=1`,
    )
    expect(data.docs?.length ?? 0).toBe(0)
  })
})

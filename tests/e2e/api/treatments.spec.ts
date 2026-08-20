import { test, expect } from '@playwright/test'
import { getAuthToken, apiGet, apiPost, apiPatch, apiDelete } from '../../helpers/api'

/**
 * CRUD tests for the Treatments collection via Payload REST API.
 */

test.describe('API: Treatments CRUD', () => {
  let token: string
  let createdId: string
  const testSlug = `test-treatment-${Date.now()}`

  test.beforeAll(async () => {
    token = await getAuthToken()
  })

  test.afterAll(async () => {
    // Cleanup: delete the test treatment if it still exists
    if (createdId) {
      await apiDelete(`/api/treatments/${createdId}`, token)
    }
  })

  test('can list treatments (public)', async () => {
    const { status, data } = await apiGet('/api/treatments?limit=5')
    expect(status).toBe(200)
    expect(data.docs).toBeDefined()
    expect(Array.isArray(data.docs)).toBe(true)
    expect(data.totalDocs).toBeGreaterThan(0)
  })

  test('can create a new treatment', async () => {
    const { status, data } = await apiPost(
      '/api/treatments',
      {
        name: 'Test Treatment (Playwright)',
        slug: testSlug,
        tagline: 'A test treatment created by Playwright',
        featured: false,
        coordinates: { lat: 0, lng: 0 },
      },
      token,
    )
    expect(status).toBe(201)
    expect(data.doc).toBeDefined()
    expect(data.doc.name).toBe('Test Treatment (Playwright)')
    expect(data.doc.slug).toBe(testSlug)
    createdId = data.doc.id
  })

  test('can read the created treatment by ID', async () => {
    const { status, data } = await apiGet(`/api/treatments/${createdId}`, token)
    expect(status).toBe(200)
    expect(data.id).toBe(createdId)
    expect(data.name).toBe('Test Treatment (Playwright)')
    expect(data.slug).toBe(testSlug)
  })

  test('can read treatment by slug via where query', async () => {
    const { status, data } = await apiGet(
      `/api/treatments?where[slug][equals]=${testSlug}&limit=1`,
    )
    expect(status).toBe(200)
    expect(data.docs.length).toBe(1)
    expect(data.docs[0].slug).toBe(testSlug)
  })

  test('can update treatment tagline', async () => {
    const { status, data } = await apiPatch(
      `/api/treatments/${createdId}`,
      { tagline: 'Updated tagline by Playwright' },
      token,
    )
    expect(status).toBe(200)
    expect(data.doc.tagline).toBe('Updated tagline by Playwright')
  })

  test('updated field is persisted', async () => {
    const { status, data } = await apiGet(`/api/treatments/${createdId}`)
    expect(status).toBe(200)
    expect(data.tagline).toBe('Updated tagline by Playwright')
  })

  test('can set SEO meta title via meta group', async () => {
    const { status, data } = await apiPatch(
      `/api/treatments/${createdId}`,
      { meta: { title: 'Test Treatment SEO Title - Atidi NRI Care' } },
      token,
    )
    expect(status).toBe(200)
    expect(data.doc.meta?.title).toBe('Test Treatment SEO Title - Atidi NRI Care')
  })

  test('can delete the treatment', async () => {
    const { status } = await apiDelete(`/api/treatments/${createdId}`, token)
    expect(status).toBe(200)
    createdId = ''
  })

  test('deleted treatment is no longer found', async () => {
    // Query by slug instead of ID to avoid 500 on invalid ID format
    const { data } = await apiGet(
      `/api/treatments?where[slug][equals]=${testSlug}&limit=1`,
    )
    expect(data.docs?.length ?? 0).toBe(0)
  })
})

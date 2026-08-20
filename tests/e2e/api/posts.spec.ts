import { test, expect } from '@playwright/test'
import { getAuthToken, apiGet, apiPost, apiPatch, apiDelete } from '../../helpers/api'

/**
 * CRUD tests for the Posts collection via Payload REST API.
 * Note: Posts has no public read access — all requests require auth token.
 * Posts has drafts enabled — PATCH uses _status field.
 */

test.describe('API: Posts CRUD', () => {
  let token: string
  let authorId: number
  let createdId: string
  const testSlug = `test-post-${Date.now()}`

  test.beforeAll(async () => {
    token = await getAuthToken()
    // Get admin user ID to use as author
    const { data } = await apiGet('/api/users?limit=1', token)
    authorId = data.docs?.[0]?.id
  })

  test.afterAll(async () => {
    if (createdId) {
      await apiDelete(`/api/posts/${createdId}`, token)
    }
  })

  test('can list posts with auth token', async () => {
    const { status, data } = await apiGet('/api/posts?limit=5', token)
    expect(status).toBe(200)
    expect(data.docs).toBeDefined()
    expect(Array.isArray(data.docs)).toBe(true)
    expect(data.totalDocs).toBeGreaterThan(0)
  })

  test('listing posts without auth returns 403', async () => {
    const { status } = await apiGet('/api/posts?limit=1')
    expect(status).toBe(403)
  })

  test('can create a new post (draft)', async () => {
    const { status, data } = await apiPost(
      '/api/posts',
      {
        title: 'Test Post (Playwright)',
        slug: testSlug,
        excerpt: 'A test post created by Playwright automated tests.',
        _status: 'draft',
        author: authorId,
        publishedDate: new Date().toISOString(),
      },
      token,
    )
    expect(status).toBe(201)
    expect(data.doc).toBeDefined()
    expect(data.doc.title).toBe('Test Post (Playwright)')
    expect(data.doc.slug).toBe(testSlug)
    createdId = data.doc.id
  })

  test('can read the created post by ID', async () => {
    const { status, data } = await apiGet(`/api/posts/${createdId}`, token)
    expect(status).toBe(200)
    expect(data.id).toBe(createdId)
    expect(data.title).toBe('Test Post (Playwright)')
  })

  test('can update post excerpt', async () => {
    const { status, data } = await apiPatch(
      `/api/posts/${createdId}`,
      { excerpt: 'Updated excerpt by Playwright', _status: 'draft' },
      token,
    )
    expect(status).toBe(200)
    expect(data.doc.excerpt).toBe('Updated excerpt by Playwright')
  })

  test('can publish a post', async () => {
    const { status, data } = await apiPatch(
      `/api/posts/${createdId}`,
      { _status: 'published' },
      token,
    )
    expect(status).toBe(200)
    expect(data.doc._status ?? data.doc.status).toBe('published')
  })

  test('can set SEO meta title via meta group', async () => {
    const { status, data } = await apiPatch(
      `/api/posts/${createdId}`,
      { meta: { title: 'Test Post SEO Title - Atidi NRI Care' }, _status: 'published' },
      token,
    )
    expect(status).toBe(200)
    expect(data.doc.meta?.title).toBe('Test Post SEO Title - Atidi NRI Care')
  })

  test('can delete the post', async () => {
    const { status } = await apiDelete(`/api/posts/${createdId}`, token)
    expect(status).toBe(200)
    createdId = ''
  })
})

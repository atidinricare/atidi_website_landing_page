/**
 * Payload REST API helpers for Playwright tests.
 */

import { getAuthToken } from './auth'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3003'

export async function apiGet(path: string, token?: string) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `JWT ${token}`
  const res = await fetch(`${BASE_URL}${path}`, { headers })
  return { status: res.status, data: await res.json() }
}

export async function apiPost(path: string, body: object, token?: string) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `JWT ${token}`
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })
  return { status: res.status, data: await res.json() }
}

export async function apiPatch(path: string, body: object, token?: string) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `JWT ${token}`
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(body),
  })
  return { status: res.status, data: await res.json() }
}

export async function apiDelete(path: string, token?: string) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `JWT ${token}`
  const res = await fetch(`${BASE_URL}${path}`, { method: 'DELETE', headers })
  return { status: res.status, data: await res.json() }
}

/**
 * Returns the first available treatment slug from the public API.
 */
export async function getFirstTreatmentSlug(): Promise<string> {
  const { data } = await apiGet('/api/treatments?limit=1&depth=0')
  if (!data.docs?.length) throw new Error('No treatments found in database')
  return data.docs[0].slug
}

/**
 * Returns the first available location slug from the public API.
 */
export async function getFirstLocationSlug(): Promise<string> {
  const { data } = await apiGet('/api/locations?limit=1&depth=0')
  if (!data.docs?.length) throw new Error('No locations found in database')
  return data.docs[0].slug
}

/**
 * Returns the first published post slug. Uses auth token since Posts has no public read access.
 */
export async function getFirstPostSlug(): Promise<string> {
  const token = await getAuthToken()
  const { data } = await apiGet('/api/posts?limit=1&depth=0&where[status][equals]=published', token)
  if (!data.docs?.length) throw new Error('No published posts found in database')
  return data.docs[0].slug
}

export { getAuthToken, BASE_URL }

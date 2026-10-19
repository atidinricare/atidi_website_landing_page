/**
 * Authentication helper for Playwright tests.
 * Returns a JWT token by logging in via the Payload REST API.
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3003'
const ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL || 'admin@atidicare.com'
const ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD || 'admin123'

export async function getAuthToken(): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  })

  if (!res.ok) {
    throw new Error(`Login failed: ${res.status} ${await res.text()}`)
  }

  const data = await res.json()
  if (!data.token) {
    throw new Error(`No token in login response: ${JSON.stringify(data)}`)
  }

  return data.token
}

export { ADMIN_EMAIL, ADMIN_PASSWORD, BASE_URL }

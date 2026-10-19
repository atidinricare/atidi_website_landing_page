import { generateSecret as otplibGenerateSecret, generateURI, verifySync } from 'otplib'
import * as QRCode from 'qrcode'

/**
 * Generate a new 2FA secret for a user
 */
export function generateSecret(): string {
  return otplibGenerateSecret()
}

/**
 * Generate a QR code data URL for Google Authenticator setup
 */
export async function generateQRCode(
  email: string,
  secret: string,
  issuer: string = 'KTree CMS'
): Promise<string> {
  const otpauth = generateURI({
    secret,
    label: email,
    issuer,
    algorithm: 'sha1',
    digits: 6,
    period: 30,
  })
  return QRCode.toDataURL(otpauth)
}

/**
 * Verify a TOTP token against a secret
 */
export function verifyToken(token: string, secret: string): boolean {
  try {
    const result = verifySync({ token, secret })
    return result.valid
  } catch {
    return false
  }
}

/**
 * Generate backup codes for account recovery
 */
export function generateBackupCodes(count: number = 10): string[] {
  const codes: string[] = []
  for (let i = 0; i < count; i++) {
    // Generate 8-character alphanumeric codes
    const code = Math.random().toString(36).substring(2, 10).toUpperCase()
    codes.push(code)
  }
  return codes
}

/**
 * Verify a backup code and return remaining codes if valid
 */
export function verifyBackupCode(
  code: string,
  backupCodes: string[]
): { valid: boolean; remainingCodes: string[] } {
  const normalizedCode = code.toUpperCase().replace(/\s/g, '')
  const index = backupCodes.findIndex((c) => c === normalizedCode)

  if (index === -1) {
    return { valid: false, remainingCodes: backupCodes }
  }

  // Remove used code
  const remainingCodes = [...backupCodes]
  remainingCodes.splice(index, 1)

  return { valid: true, remainingCodes }
}

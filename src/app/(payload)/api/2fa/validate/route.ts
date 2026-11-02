import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { verifyToken, verifyBackupCode } from '@/lib/two-factor'
import { cookies } from 'next/headers'

/**
 * Validate 2FA code during login flow
 * This is called after successful password authentication
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { code, userId } = await request.json()

    if (!code || !userId) {
      return NextResponse.json(
        { error: 'Verification code and user ID are required' },
        { status: 400 }
      )
    }

    // Get user
    const user = await payload.findByID({
      collection: 'users',
      id: userId,
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if 2FA is enabled for this user
    if (!user.twoFactorEnabled || !user.twoFactorSecret) {
      return NextResponse.json(
        { error: '2FA is not enabled for this user' },
        { status: 400 }
      )
    }

    // Try TOTP verification first
    let isValid = verifyToken(code, user.twoFactorSecret)
    let usedBackupCode = false

    // If TOTP fails, try backup code
    if (!isValid && user.twoFactorBackupCodes) {
      const backupResult = verifyBackupCode(code, user.twoFactorBackupCodes as string[])
      if (backupResult.valid) {
        isValid = true
        usedBackupCode = true
        // Update remaining backup codes
        await payload.update({
          collection: 'users',
          id: user.id,
          data: {
            twoFactorBackupCodes: backupResult.remainingCodes,
          },
        })
      }
    }

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      usedBackupCode,
      remainingBackupCodes: usedBackupCode
        ? ((user.twoFactorBackupCodes as string[])?.length || 0) - 1
        : undefined,
    })
  } catch (error) {
    console.error('2FA validate error:', error)
    return NextResponse.json(
      { error: 'Failed to validate 2FA code' },
      { status: 500 }
    )
  }
}

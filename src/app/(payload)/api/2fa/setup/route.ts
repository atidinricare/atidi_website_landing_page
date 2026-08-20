import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { generateSecret, generateQRCode, generateBackupCodes } from '@/lib/two-factor'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const payload = await getPayload({ config })

    // Get the current user from the request
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify the token and get user
    const { user } = await payload.auth({ headers: new Headers({ Authorization: `JWT ${token}` }) })

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if 2FA is already enabled
    if (user.twoFactorEnabled) {
      return NextResponse.json(
        { error: '2FA is already enabled for this account' },
        { status: 400 }
      )
    }

    // Ensure user has an email
    if (!user.email) {
      return NextResponse.json(
        { error: 'User email is required for 2FA setup' },
        { status: 400 }
      )
    }

    // Generate new secret and backup codes
    const secret = generateSecret()
    const backupCodes = generateBackupCodes(10)
    const qrCode = await generateQRCode(user.email, secret, 'KTree CMS')

    // Store the secret temporarily (not enabled yet)
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        twoFactorSecret: secret,
        twoFactorBackupCodes: backupCodes,
      },
    })

    return NextResponse.json({
      qrCode,
      secret, // Show secret for manual entry
      backupCodes,
      message: 'Scan the QR code with Google Authenticator, then verify with a code',
    })
  } catch (error) {
    console.error('2FA setup error:', error)
    return NextResponse.json(
      { error: 'Failed to setup 2FA' },
      { status: 500 }
    )
  }
}

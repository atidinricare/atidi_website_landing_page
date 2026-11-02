import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { verifyToken, verifyBackupCode } from '@/lib/two-factor'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json(
        { error: 'Verification code is required to disable 2FA' },
        { status: 400 }
      )
    }

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

    // Check if 2FA is enabled
    if (!user.twoFactorEnabled) {
      return NextResponse.json(
        { error: '2FA is not enabled for this account' },
        { status: 400 }
      )
    }

    // Check if mandatory 2FA is enforced
    const siteSettings = await payload.findGlobal({ slug: 'site-settings' })
    if (siteSettings.security?.require2FA) {
      return NextResponse.json(
        { error: 'Cannot disable 2FA - mandatory 2FA is enforced by administrator' },
        { status: 403 }
      )
    }

    // Verify the code (either TOTP or backup code)
    let isValid = verifyToken(code, user.twoFactorSecret || '')

    if (!isValid && user.twoFactorBackupCodes) {
      const backupResult = verifyBackupCode(code, user.twoFactorBackupCodes as string[])
      isValid = backupResult.valid
    }

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      )
    }

    // Disable 2FA and clear secrets
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
        twoFactorBackupCodes: null,
      },
    })

    return NextResponse.json({
      success: true,
      message: '2FA has been disabled successfully',
    })
  } catch (error) {
    console.error('2FA disable error:', error)
    return NextResponse.json(
      { error: 'Failed to disable 2FA' },
      { status: 500 }
    )
  }
}

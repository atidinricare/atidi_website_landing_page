import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { verifyToken } from '@/lib/two-factor'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json(
        { error: 'Verification code is required' },
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

    // Check if secret exists
    if (!user.twoFactorSecret) {
      return NextResponse.json(
        { error: 'Please initiate 2FA setup first' },
        { status: 400 }
      )
    }

    // Verify the TOTP code
    const isValid = verifyToken(code, user.twoFactorSecret)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      )
    }

    // Enable 2FA
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        twoFactorEnabled: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: '2FA has been enabled successfully',
    })
  } catch (error) {
    console.error('2FA verify error:', error)
    return NextResponse.json(
      { error: 'Failed to verify 2FA code' },
      { status: 500 }
    )
  }
}

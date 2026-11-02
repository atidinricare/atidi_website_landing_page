import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'

/**
 * Get 2FA status for current user and system settings
 */
export async function GET() {
  try {
    const payload = await getPayload({ config })

    // Get the current user from the request
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')?.value

    if (!token) {
      // Return just system settings if not logged in
      const siteSettings = await payload.findGlobal({ slug: 'site-settings' })
      return NextResponse.json({
        systemRequires2FA: siteSettings.security?.require2FA || false,
        userHas2FA: false,
        isLoggedIn: false,
      })
    }

    // Verify the token and get user
    const { user } = await payload.auth({ headers: new Headers({ Authorization: `JWT ${token}` }) })

    if (!user) {
      const siteSettings = await payload.findGlobal({ slug: 'site-settings' })
      return NextResponse.json({
        systemRequires2FA: siteSettings.security?.require2FA || false,
        userHas2FA: false,
        isLoggedIn: false,
      })
    }

    // Get site settings
    const siteSettings = await payload.findGlobal({ slug: 'site-settings' })
    const systemRequires2FA = siteSettings.security?.require2FA || false
    const userHas2FA = user.twoFactorEnabled || false

    return NextResponse.json({
      systemRequires2FA,
      userHas2FA,
      isLoggedIn: true,
      needsSetup: systemRequires2FA && !userHas2FA,
      backupCodesCount: userHas2FA ? (user.twoFactorBackupCodes as string[])?.length || 0 : 0,
    })
  } catch (error) {
    console.error('2FA status error:', error)
    return NextResponse.json(
      { error: 'Failed to get 2FA status' },
      { status: 500 }
    )
  }
}

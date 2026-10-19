// Files that always load from /public/ — never from S3
const LOCAL_ONLY = [
  '/athidi.png',
  '/favicon.ico',
  '/AthidiLogo.png',
  '/AthidiLogo.webp',
]

/**
 * Resolves an image path to the correct URL based on S3/CDN configuration.
 *
 * - Local-only files → always returns the local path
 * - S3 configured → returns S3/CDN URL with /assets prefix
 * - S3 not configured → returns local path (fallback)
 *
 * @param localPath - The path relative to /public/ (e.g., "/hero.webp" or "/testimonials/img1.jpg")
 * @param assetBaseUrl - The base URL from site settings (S3, CloudFront, or custom CDN)
 */
export function getImageUrl(localPath: string, assetBaseUrl?: string): string {
  // Normalize path to start with /
  const normalizedPath = localPath.startsWith('/') ? localPath : `/${localPath}`

  // Local-only files — always from /public/
  if (LOCAL_ONLY.includes(normalizedPath)) {
    return normalizedPath
  }

  // If S3/CDN is configured, use it
  if (assetBaseUrl) {
    // Remove trailing slash from base URL
    const base = assetBaseUrl.replace(/\/+$/, '')
    return `${base}/assets${normalizedPath}`
  }

  // Fallback to local
  return normalizedPath
}

/**
 * Check if a path is in the local-only list
 */
export function isLocalOnly(localPath: string): boolean {
  const normalizedPath = localPath.startsWith('/') ? localPath : `/${localPath}`
  return LOCAL_ONLY.includes(normalizedPath)
}

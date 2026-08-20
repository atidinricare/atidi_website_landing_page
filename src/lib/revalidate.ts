import { revalidatePath, revalidateTag } from 'next/cache'

/**
 * Revalidation utility for on-demand cache invalidation
 * Called from Payload CMS hooks when content changes
 */

// Revalidate specific paths based on collection/global type
export const revalidateByType = (type: string, slug?: string) => {
  try {
    switch (type) {
      // Collections
      case 'treatments':
      case 'categories':
        revalidatePath('/')
        revalidatePath('/clinics')
        if (slug) {
          revalidatePath(`/treatments/${slug}`)
        }
        break

      case 'locations':
      case 'clinics':
        revalidatePath('/')
        revalidatePath('/clinics')
        if (slug) {
          revalidatePath(`/locations/${slug}`)
        }
        break

      case 'faqs':
        revalidatePath('/')
        break

      case 'testimonials':
        revalidatePath('/')
        break

      case 'posts':
        revalidatePath('/blog')
        if (slug) {
          revalidatePath(`/blog/${slug}`)
        }
        break

      case 'pages':
        if (slug) {
          revalidatePath(`/${slug}`)
        }
        revalidatePath('/')
        break

      // Globals
      case 'hero-content':
      case 'site-settings':
        revalidatePath('/')
        break

      case 'navigation':
      case 'footer':
      case 'tracking-settings':
        // These affect all pages - revalidate everything
        revalidatePath('/', 'layout')
        break

      default:
        // Fallback: revalidate homepage
        revalidatePath('/')
    }
  } catch (error) {
    // Silently fail during build/seed - revalidation only works at runtime
    console.log(`[Revalidation] Skipped for ${type} (not in request context)`)
  }
}

// Hook helper for collections
export const createRevalidateHook = (collectionSlug: string) => ({
  afterChange: [
    async ({ doc }: { doc: { slug?: string } }) => {
      revalidateByType(collectionSlug, doc?.slug)
      return doc
    },
  ],
  afterDelete: [
    async ({ doc }: { doc: { slug?: string } }) => {
      revalidateByType(collectionSlug, doc?.slug)
      return doc
    },
  ],
})

// Hook helper for globals
export const createGlobalRevalidateHook = (globalSlug: string) => ({
  afterChange: [
    async ({ doc }: { doc: unknown }) => {
      revalidateByType(globalSlug)
      return doc
    },
  ],
})

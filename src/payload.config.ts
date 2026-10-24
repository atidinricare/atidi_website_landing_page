import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor, LinkFeature, FixedToolbarFeature } from '@payloadcms/richtext-lexical'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { PayloadPluginCloudflarePurge } from 'payload-plugin-cloudflare-purge'
import { cloudfrontPurgePlugin } from './plugins/cloudfront-purge'
import { s3Storage } from '@payloadcms/storage-s3'
import { readStorageConfig } from './lib/storage-config'
import sharp from 'sharp'

const storageConfig = readStorageConfig()

// Collections
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Treatments } from './collections/Treatments'
import { Locations } from './collections/Locations'
import { Clinics } from './collections/Clinics'
import { Posts } from './collections/Posts'
import { FAQs } from './collections/FAQs'
import { Testimonials } from './collections/Testimonials'
import { Categories } from './collections/Categories'
import { Pages } from './collections/Pages'

// Globals
import { SiteSettings } from './globals/SiteSettings'
import { Navigation } from './globals/Navigation'
import { Footer } from './globals/Footer'
import { TrackingSettings } from './globals/TrackingSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

function getValidUrl(url?: string): string | undefined {
  if (!url || typeof url !== 'string') return undefined
  const trimmed = url.trim()
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) return undefined
  try {
    const parsed = new URL(trimmed)
    return parsed.origin
  } catch {
    return undefined
  }
}

const configuredServerUrl =
  getValidUrl(process.env.NEXT_PUBLIC_SERVER_URL) ||
  getValidUrl(process.env.SITE_URL) ||
  (process.env.NODE_ENV === 'production' ? 'https://athidi-payload-node-dev.ktree.org' : 'http://localhost:3000')

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || 'atidi-nri-care-default-secret-key',

  serverURL: configuredServerUrl,

  cors: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://localhost:3000',
    configuredServerUrl,
    'https://athidi-payload-node-dev.ktree.org',
  ].filter(Boolean) as string[],

  csrf: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://localhost:3000',
    configuredServerUrl,
    'https://athidi-payload-node-dev.ktree.org',
  ].filter(Boolean) as string[],

  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '- Atidi NRI Care',
      description: 'Atidi NRI Care Content Management System',
      icons: [{ url: '/admin-icon.png' }],
    },
    components: {
      graphics: {
        Logo: '@/components/admin/Logo',
        Icon: '@/components/admin/Icon',
      },
      providers: ['@/components/admin/TwoFactor/TwoFactorProvider'],
      views: {
        twoFactorSetup: {
          Component: '@/components/admin/TwoFactor/TwoFactorSetup',
          path: '/two-factor',
        },
      },
      afterNavLinks: ['@/components/admin/TwoFactor/TwoFactorNavLink'],
    },
  },

  i18n: {
    fallbackLanguage: 'en',
  },

  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      // The default config ships only the inline toolbar, which appears when
      // text is selected -- editors reported they could not find the alignment
      // controls at all. This adds a toolbar that is always visible.
      FixedToolbarFeature(),
      LinkFeature({
        // Enables internal links to these Payload collections in the rich text editor
        enabledCollections: ['pages', 'posts', 'treatments', 'locations'],
      }),
    ],
  }),

  collections: [
    Users,
    Media,
    Treatments,
    Locations,
    Clinics,
    Posts,
    FAQs,
    Testimonials,
    Categories,
    Pages,
  ],

  globals: [
    SiteSettings,
    Navigation,
    Footer,
    TrackingSettings,
  ],

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),

  sharp,

  plugins: [
    seoPlugin({
      collections: ['treatments', 'locations', 'posts', 'pages'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }) => `${(doc as any)?.name || (doc as any)?.title || ''} - Atidi NRI Care`,
      generateDescription: ({ doc }) => (doc as any)?.description || (doc as any)?.tagline || '',
      generateURL: ({ doc, collectionSlug }) => {
        const slug = (doc as any)?.slug || ''
        const base = configuredServerUrl || 'https://athidi-payload-node-dev.ktree.org'
        if (collectionSlug === 'pages') return slug === 'home' ? base : `${base}/${slug}`
        if (collectionSlug === 'posts') return `${base}/blog/${slug}`
        return `${base}/${collectionSlug}/${slug}`
      },
    }),
    // S3 storage - enabled/disabled via Site Settings > Storage (S3) tab
    ...(storageConfig.s3.enabled
      ? [
          s3Storage({
            collections: {
              media: {
                prefix: 'media',
              },
            },
            bucket: storageConfig.s3.bucket,
            config: {
              credentials: {
                accessKeyId: storageConfig.s3.accessKeyId,
                secretAccessKey: storageConfig.s3.secretAccessKey,
              },
              region: storageConfig.s3.region,
              ...(storageConfig.s3.endpoint ? { endpoint: storageConfig.s3.endpoint } : {}),
              forcePathStyle: storageConfig.s3.forcePathStyle,
            },
          }),
        ]
      : []),

    // Cloudflare CDN Cache Purge - enabled/disabled via Site Settings > CDN Settings tab
    ...(storageConfig.cdn.provider === 'cloudflare'
      ? [
          PayloadPluginCloudflarePurge({
            apiToken: storageConfig.cdn.cloudflare.apiToken,
            zoneId: storageConfig.cdn.cloudflare.zoneId,
            baseUrl: configuredServerUrl,
            enabled: process.env.NODE_ENV === 'production',
            collections: ['treatments', 'locations', 'clinics', 'posts', 'pages', 'media'],
            globals: ['site-settings', 'navigation', 'footer', 'hero-content', 'app-showcase'],
            events: ['afterChange', 'afterDelete'],
            urlBuilder: ({ collectionSlug, doc }) => {
              const baseUrl = configuredServerUrl;
              if (collectionSlug === 'treatments') return [`${baseUrl}/treatments/${doc.slug}`];
              if (collectionSlug === 'locations') return [`${baseUrl}/locations/${doc.slug}`];
              if (collectionSlug === 'posts') return [`${baseUrl}/blog/${doc.slug}`];
              if (collectionSlug === 'pages') return [`${baseUrl}/${doc.slug}`];
              return [baseUrl];
            },
          }),
        ]
      : []),

    // AWS CloudFront CDN Cache Purge - enabled/disabled via Site Settings > CDN Settings tab
    ...(storageConfig.cdn.provider === 'cloudfront'
      ? [
          cloudfrontPurgePlugin({
            enabled: process.env.NODE_ENV === 'production',
            distributionId: storageConfig.cdn.cloudfront.distributionId,
            region: storageConfig.cdn.cloudfront.region,
            accessKeyId: storageConfig.cdn.cloudfront.accessKeyId,
            secretAccessKey: storageConfig.cdn.cloudfront.secretAccessKey,
            collections: ['treatments', 'locations', 'clinics', 'posts', 'pages', 'media'],
            globals: ['site-settings', 'navigation', 'footer', 'hero-content', 'app-showcase'],
            events: ['create', 'update', 'delete'],
            buildPaths: ({ collection, doc }) => {
              if (collection === 'treatments') return [`/treatments/${doc.slug}`, '/treatments'];
              if (collection === 'locations') return [`/locations/${doc.slug}`, '/locations'];
              if (collection === 'posts') return [`/blog/${doc.slug}`, '/blog'];
              if (collection === 'pages') return [`/${doc.slug}`];
              return ['/', '/*'];
            },
          }),
        ]
      : []),
  ],

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  graphQL: {
    schemaOutputFile: path.resolve(dirname, 'generated-schema.graphql'),
  },
})

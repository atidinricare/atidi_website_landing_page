import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor, LinkFeature } from '@payloadcms/richtext-lexical'
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
import { HeroContent } from './globals/HeroContent'
import { TrackingSettings } from './globals/TrackingSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || 'atidi-nri-care-default-secret-key',

  cors: ['http://localhost:5173', 'http://localhost:3000'],

  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '- KTree CMS',
      description: 'Atidi NRI Care Content Management System',
      icons: [{ url: '/athidi.png' }],
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
    translations: {
      en: {
        general: {
          payloadSettings: 'KTree CMS Settings',
        },
      },
    },
  },

  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
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
    HeroContent,
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
            baseUrl: process.env.SITE_URL || 'https://athidi-payload-node-dev.ktree.org',
            enabled: process.env.NODE_ENV === 'production',
            collections: ['treatments', 'locations', 'clinics', 'posts', 'pages', 'media'],
            globals: ['site-settings', 'navigation', 'footer', 'hero-content'],
            events: ['afterChange', 'afterDelete'],
            urlBuilder: ({ collectionSlug, doc }) => {
              const baseUrl = process.env.SITE_URL || 'https://athidi-payload-node-dev.ktree.org';
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
            globals: ['site-settings', 'navigation', 'footer', 'hero-content'],
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

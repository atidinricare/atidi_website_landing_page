import type { GlobalConfig } from 'payload'
import { createGlobalRevalidateHook } from '@/lib/revalidate'
import { writeStorageConfig, type StorageConfig } from '@/lib/storage-config'
import { AWS_REGIONS } from '@/lib/aws-regions'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      async ({ doc }) => {
        // Persist storage settings to JSON config file
        if (doc?.storageSettings) {
          const s3 = doc.storageSettings.s3 || {}
          const cdn = doc.storageSettings.cdn || {}
          const config: StorageConfig = {
            s3: {
              enabled: s3.enabled || false,
              bucket: s3.bucket || '',
              region: s3.region || 'us-east-1',
              accessKeyId: s3.accessKeyId || '',
              secretAccessKey: s3.secretAccessKey || '',
              endpoint: s3.endpoint || '',
              forcePathStyle: s3.forcePathStyle ?? true,
              assetBaseUrl: s3.assetBaseUrl || '',
            },
            cdn: {
              provider: cdn.provider || 'none',
              cloudflare: {
                apiToken: cdn.cloudflareApiToken || '',
                zoneId: cdn.cloudflareZoneId || '',
              },
              cloudfront: {
                distributionId: cdn.cloudfrontDistributionId || '',
                region: cdn.cloudfrontRegion || 'us-east-1',
                accessKeyId: cdn.cloudfrontAccessKeyId || '',
                secretAccessKey: cdn.cloudfrontSecretAccessKey || '',
              },
            },
          }
          writeStorageConfig(config)
        }
        return doc
      },
      // Revalidate frontend
      ...(createGlobalRevalidateHook('site-settings').afterChange || []),
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            {
              name: 'siteName',
              type: 'text',
              required: true,
              label: 'Site Name',
            },
            {
              name: 'siteDescription',
              type: 'textarea',
              label: 'Site Description',
            },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              label: 'Logo',
            },
            {
              name: 'favicon',
              type: 'upload',
              relationTo: 'media',
              label: 'Favicon',
            },
            {
              name: 'contactEmail',
              type: 'email',
              label: 'Contact Email',
            },
            {
              name: 'contactPhone',
              type: 'text',
              label: 'Contact Phone',
            },
            {
              name: 'whatsappNumber',
              type: 'text',
              label: 'WhatsApp Number',
            },
            {
              name: 'socialLinks',
              type: 'group',
              label: 'Social Links',
              fields: [
                {
                  name: 'facebook',
                  type: 'text',
                  label: 'Facebook URL',
                },
                {
                  name: 'instagram',
                  type: 'text',
                  label: 'Instagram URL',
                },
                {
                  name: 'youtube',
                  type: 'text',
                  label: 'YouTube URL',
                },
                {
                  name: 'linkedin',
                  type: 'text',
                  label: 'LinkedIn URL',
                },
              ],
            },
            {
              name: 'announcement',
              type: 'group',
              label: 'Announcement',
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  label: 'Enabled',
                  defaultValue: false,
                },
                {
                  name: 'text',
                  type: 'text',
                  label: 'Announcement Text',
                },
                {
                  name: 'link',
                  type: 'text',
                  label: 'Announcement Link',
                },
              ],
            },
            {
              name: 'security',
              type: 'group',
              label: 'Security Settings',
              fields: [
                {
                  name: 'require2FA',
                  type: 'checkbox',
                  label: 'Require Two-Factor Authentication',
                  defaultValue: false,
                  admin: {
                    description: 'When enabled, all users must set up 2FA (Google Authenticator) to access the admin panel',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Storage (S3)',
          fields: [
            {
              name: 's3SyncButton',
              type: 'ui',
              admin: {
                components: {
                  Field: '@/components/admin/S3SyncButton',
                },
                condition: (data) => data?.storageSettings?.s3?.enabled,
              },
            },
            {
              name: 'storageSettings',
              type: 'group',
              label: ' ',
              admin: {
                description: 'Configure S3-compatible storage for media files. Changes require a server restart to take effect.',
              },
              fields: [
                {
                  name: 's3',
                  type: 'group',
                  label: 'S3 Storage',
                  fields: [
                    {
                      name: 'enabled',
                      type: 'checkbox',
                      label: 'Enable S3 Storage',
                      defaultValue: false,
                      admin: {
                        description: 'When enabled, media files will be stored in S3 instead of local disk. Requires server restart.',
                      },
                    },
                    {
                      name: 'bucket',
                      type: 'text',
                      label: 'S3 Bucket Name',
                      defaultValue: 'atidi-media',
                      admin: {
                        condition: (data) => data?.storageSettings?.s3?.enabled,
                      },
                    },
                    {
                      name: 'region',
                      type: 'select',
                      label: 'AWS Region',
                      defaultValue: 'us-east-1',
                      options: [...AWS_REGIONS],
                      admin: {
                        condition: (data) => data?.storageSettings?.s3?.enabled,
                      },
                    },
                    {
                      name: 'accessKeyId',
                      type: 'text',
                      label: 'Access Key ID',
                      admin: {
                        condition: (data) => data?.storageSettings?.s3?.enabled,
                      },
                    },
                    {
                      name: 'secretAccessKey',
                      type: 'text',
                      label: 'Secret Access Key',
                      admin: {
                        condition: (data) => data?.storageSettings?.s3?.enabled,
                      },
                    },
                    {
                      name: 'endpoint',
                      type: 'text',
                      label: 'S3 Endpoint URL',
                      admin: {
                        description: 'Custom endpoint for S3-compatible services (e.g., MinIO, DigitalOcean Spaces). Leave empty for AWS S3.',
                        condition: (data) => data?.storageSettings?.s3?.enabled,
                      },
                    },
                    {
                      name: 'forcePathStyle',
                      type: 'checkbox',
                      label: 'Force Path Style',
                      defaultValue: true,
                      admin: {
                        description: 'Enable for S3-compatible services like MinIO. Disable for standard AWS S3.',
                        condition: (data) => data?.storageSettings?.s3?.enabled,
                      },
                    },
                    {
                      name: 'assetBaseUrl',
                      type: 'text',
                      label: 'Asset Base URL',
                      admin: {
                        description: 'Base URL for serving static assets from S3/CloudFront/CDN. Example: https://your-bucket.s3.ap-south-1.amazonaws.com or https://d1234.cloudfront.net or https://cdn.yourdomain.com. Leave empty to auto-generate from bucket and region.',
                        condition: (data) => data?.storageSettings?.s3?.enabled,
                        placeholder: 'https://your-bucket.s3.region.amazonaws.com',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'CDN Settings',
          fields: [
            {
              name: 'cdnSettings',
              type: 'group',
              label: ' ',
              admin: {
                description: 'Configure CDN cache purging. When content is updated, the CDN cache will be automatically invalidated. Changes require a server restart.',
              },
              fields: [
                {
                  name: 'provider',
                  type: 'select',
                  label: 'CDN Provider',
                  defaultValue: 'none',
                  options: [
                    { label: 'None', value: 'none' },
                    { label: 'Cloudflare', value: 'cloudflare' },
                    { label: 'AWS CloudFront', value: 'cloudfront' },
                  ],
                },
                // Cloudflare fields
                {
                  name: 'cloudflareApiToken',
                  type: 'text',
                  label: 'Cloudflare API Token',
                  admin: {
                    condition: (data) => data?.cdnSettings?.provider === 'cloudflare',
                  },
                },
                {
                  name: 'cloudflareZoneId',
                  type: 'text',
                  label: 'Cloudflare Zone ID',
                  admin: {
                    condition: (data) => data?.cdnSettings?.provider === 'cloudflare',
                  },
                },
                // CloudFront fields
                {
                  name: 'cloudfrontDistributionId',
                  type: 'text',
                  label: 'CloudFront Distribution ID',
                  admin: {
                    condition: (data) => data?.cdnSettings?.provider === 'cloudfront',
                  },
                },
                {
                  name: 'cloudfrontRegion',
                  type: 'select',
                  label: 'AWS Region',
                  defaultValue: 'us-east-1',
                  options: [...AWS_REGIONS],
                  admin: {
                    condition: (data) => data?.cdnSettings?.provider === 'cloudfront',
                  },
                },
                {
                  name: 'cloudfrontAccessKeyId',
                  type: 'text',
                  label: 'AWS Access Key ID',
                  admin: {
                    condition: (data) => data?.cdnSettings?.provider === 'cloudfront',
                  },
                },
                {
                  name: 'cloudfrontSecretAccessKey',
                  type: 'text',
                  label: 'AWS Secret Access Key',
                  admin: {
                    condition: (data) => data?.cdnSettings?.provider === 'cloudfront',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

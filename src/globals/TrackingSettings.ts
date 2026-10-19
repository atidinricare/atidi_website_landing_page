import type { GlobalConfig } from 'payload'
import { createGlobalRevalidateHook } from '@/lib/revalidate'

export const TrackingSettings: GlobalConfig = {
  slug: 'tracking-settings',
  label: 'Tracking & Analytics',
  access: {
    read: () => true,
  },
  hooks: createGlobalRevalidateHook('tracking-settings'),
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Google',
          fields: [
            {
              name: 'gtmId',
              type: 'text',
              label: 'Google Tag Manager ID',
              admin: {
                placeholder: 'GTM-XXXXXXX',
                description: 'Your GTM Container ID (e.g., GTM-XXXXXXX)',
              },
            },
            {
              name: 'ga4Id',
              type: 'text',
              label: 'Google Analytics 4 ID',
              admin: {
                placeholder: 'G-XXXXXXXXXX',
                description: 'Your GA4 Measurement ID (e.g., G-XXXXXXXXXX)',
              },
            },
          ],
        },
        {
          label: 'Meta (Facebook)',
          fields: [
            {
              name: 'facebookPixelId',
              type: 'text',
              label: 'Facebook Pixel ID',
              admin: {
                placeholder: '1234567890',
                description: 'Your Facebook Pixel ID',
              },
            },
          ],
        },
        {
          label: 'Custom Scripts',
          fields: [
            {
              name: 'headScripts',
              type: 'textarea',
              label: 'Custom Head Scripts',
              admin: {
                description: 'Custom scripts to inject in the <head> section. Include full <script> tags.',
                rows: 8,
              },
            },
            {
              name: 'bodyStartScripts',
              type: 'textarea',
              label: 'Custom Body Start Scripts',
              admin: {
                description: 'Custom scripts to inject at the start of <body>. Used for GTM noscript fallback, etc.',
                rows: 8,
              },
            },
            {
              name: 'bodyEndScripts',
              type: 'textarea',
              label: 'Custom Body End Scripts',
              admin: {
                description: 'Custom scripts to inject at the end of <body>. Include full <script> tags.',
                rows: 8,
              },
            },
          ],
        },
      ],
    },
  ],
}

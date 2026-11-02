import type { GlobalConfig } from 'payload'
import { createGlobalRevalidateHook } from '@/lib/revalidate'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  access: {
    read: () => true,
  },
  hooks: createGlobalRevalidateHook('footer'),
  fields: [
    {
      name: 'tagline',
      type: 'text',
      label: 'Tagline',
    },
    {
      name: 'columns',
      type: 'array',
      label: 'Columns',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Column Title',
        },
        {
          name: 'links',
          type: 'array',
          label: 'Links',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              label: 'Label',
            },
            {
              name: 'url',
              type: 'text',
              required: true,
              label: 'URL',
            },
            {
              name: 'newTab',
              type: 'checkbox',
              label: 'Open in New Tab',
              defaultValue: false,
            },
          ],
        },
      ],
    },
    {
      name: 'bottomText',
      type: 'text',
      label: 'Bottom Text',
    },
    {
      name: 'legalLinks',
      type: 'array',
      label: 'Legal Links',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Label',
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          label: 'URL',
        },
      ],
    },
  ],
}

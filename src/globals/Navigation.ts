import type { GlobalConfig } from 'payload'
import { createGlobalRevalidateHook } from '@/lib/revalidate'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Navigation',
  access: {
    read: () => true,
  },
  hooks: createGlobalRevalidateHook('navigation'),
  fields: [
    {
      name: 'mainNav',
      type: 'array',
      label: 'Main Navigation',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Label',
        },
        {
          name: 'link',
          type: 'text',
          label: 'Link',
        },
        {
          name: 'type',
          type: 'select',
          label: 'Type',
          defaultValue: 'custom',
          options: [
            { label: 'Page', value: 'page' },
            { label: 'Custom', value: 'custom' },
            { label: 'Dropdown', value: 'dropdown' },
          ],
        },
        {
          name: 'children',
          type: 'array',
          label: 'Dropdown Children',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'dropdown',
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              label: 'Label',
            },
            {
              name: 'link',
              type: 'text',
              required: true,
              label: 'Link',
            },
          ],
        },
      ],
    },
    {
      name: 'ctaButton',
      type: 'group',
      label: 'CTA Button',
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Label',
        },
        {
          name: 'link',
          type: 'text',
          label: 'Link',
        },
      ],
    },
  ],
}

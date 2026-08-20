import type { GlobalConfig } from 'payload'
import { createGlobalRevalidateHook } from '@/lib/revalidate'

export const HeroContent: GlobalConfig = {
  slug: 'hero-content',
  label: 'Hero Content',
  access: {
    read: () => true,
  },
  hooks: createGlobalRevalidateHook('hero-content'),
  fields: [
    {
      name: 'headline',
      type: 'text',
      required: true,
      label: 'Headline',
    },
    {
      name: 'subheadline',
      type: 'textarea',
      label: 'Subheadline',
    },
    {
      name: 'ctaPrimary',
      type: 'group',
      label: 'Primary CTA',
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
    {
      name: 'ctaSecondary',
      type: 'group',
      label: 'Secondary CTA',
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
    {
      name: 'stats',
      type: 'array',
      label: 'Stats',
      fields: [
        {
          name: 'value',
          type: 'text',
          required: true,
          label: 'Value',
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Label',
        },
        {
          name: 'prefix',
          type: 'text',
          label: 'Prefix',
        },
        {
          name: 'suffix',
          type: 'text',
          label: 'Suffix',
        },
      ],
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Background Image',
    },
  ],
}

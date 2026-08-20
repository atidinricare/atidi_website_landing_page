import type { CollectionConfig } from 'payload'
import { createRevalidateHook } from '@/lib/revalidate'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'patientName',
    defaultColumns: ['patientName', 'treatment', 'status', 'updatedAt'],
  },
  hooks: createRevalidateHook('testimonials'),
  fields: [
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    },
    {
      name: 'patientName',
      type: 'text',
      required: true,
    },
    {
      name: 'location',
      type: 'text',
    },
    {
      name: 'treatment',
      type: 'relationship',
      relationTo: 'treatments',
    },
    {
      name: 'rating',
      type: 'number',
    },
    {
      name: 'quote',
      type: 'richText',
      required: true,
    },
    {
      name: 'videoUrl',
      type: 'text',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}

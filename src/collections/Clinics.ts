import type { CollectionConfig } from 'payload'
import { createRevalidateHook } from '@/lib/revalidate'

export const Clinics: CollectionConfig = {
  slug: 'clinics',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'location', 'status', 'updatedAt'],
  },
  hooks: createRevalidateHook('clinics'),
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
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'location',
      type: 'relationship',
      relationTo: 'locations',
      required: true,
    },
    {
      name: 'address',
      type: 'text',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'specialties',
      type: 'array',
      fields: [
        {
          name: 'specialty',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'rating',
      type: 'number',
    },
    {
      name: 'reviewCount',
      type: 'number',
    },
  ],
}

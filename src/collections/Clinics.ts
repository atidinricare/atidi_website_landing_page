import type { CollectionConfig } from 'payload'
import { createRevalidateHook } from '@/lib/revalidate'

export const Clinics: CollectionConfig = {
  slug: 'clinics',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'city', 'status', 'updatedAt'],
  },
  hooks: createRevalidateHook('clinics'),
  fields: [
    {
      name: 'status',
      type: 'select',
      defaultValue: 'published',
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
      name: 'city',
      type: 'text',
      label: 'City',
      admin: {
        description: 'City where this clinic is located (e.g. Hyderabad, Bangalore, Chennai)',
      },
    },
    {
      name: 'location',
      type: 'relationship',
      relationTo: 'locations',
      required: false,
      admin: {
        description: 'Optional link to a location hub if desired',
      },
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

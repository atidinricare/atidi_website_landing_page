import type { CollectionConfig } from 'payload'
import { createRevalidateHook } from '@/lib/revalidate'

export const Locations: CollectionConfig = {
  slug: 'locations',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'city',
    defaultColumns: ['city', 'country', 'type', 'status', 'opensInNewTab', 'updatedAt'],
  },
  hooks: createRevalidateHook('locations'),
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
      name: 'city',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: {
        description: 'URL-friendly identifier (e.g. hyderabad, new-jersey)',
      },
    },
    {
      name: 'state',
      type: 'text',
      required: true,
    },
    {
      name: 'stateCode',
      type: 'text',
      admin: {
        description: 'Optional, primarily for US locations',
      },
    },
    {
      name: 'country',
      type: 'select',
      required: true,
      options: [
        { label: 'India', value: 'India' },
        { label: 'USA', value: 'USA' },
      ],
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Treatment', value: 'treatment' },
        { label: 'Follow-up', value: 'followup' },
      ],
    },
    {
      name: 'tagline',
      type: 'text',
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'doctors',
      type: 'number',
      admin: {
        description: 'Number of doctors at this location',
      },
    },
    {
      name: 'facilities',
      type: 'array',
      fields: [
        {
          name: 'facility',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'fromAirport',
      type: 'text',
    },
    {
      name: 'services',
      type: 'array',
      admin: {
        description: 'Services offered, primarily for US follow-up locations',
      },
      fields: [
        {
          name: 'service',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'guarantee',
      type: 'text',
    },
    {
      name: 'emergencyLine',
      type: 'text',
    },
    {
      name: 'coordinates',
      type: 'group',
      fields: [
        {
          name: 'lat',
          type: 'number',
          required: true,
        },
        {
          name: 'lng',
          type: 'number',
          required: true,
        },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'opensInNewTab',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description:
          'If checked, clicking this location card opens the dedicated detail page in a new tab. If unchecked, clicking opens the side panel on the home page.',
      },
    },
  ],
}

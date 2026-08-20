import type { CollectionConfig } from 'payload'
import { createRevalidateHook } from '@/lib/revalidate'

export const Treatments: CollectionConfig = {
  slug: 'treatments',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'status', 'opensInNewTab', 'updatedAt'],
  },
  hooks: createRevalidateHook('treatments'),
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
      name: 'shortName',
      type: 'text',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Auto-generated from name',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
    },
    {
      name: 'icon',
      type: 'text',
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
      name: 'usaPriceMin',
      type: 'number',
    },
    {
      name: 'usaPriceMax',
      type: 'number',
    },
    {
      name: 'indiaPriceMin',
      type: 'number',
    },
    {
      name: 'indiaPriceMax',
      type: 'number',
    },
    {
      name: 'savingsPercent',
      type: 'number',
    },
    {
      name: 'procedure',
      type: 'array',
      fields: [
        {
          name: 'step',
          type: 'number',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
        },
      ],
    },
    {
      name: 'materials',
      type: 'array',
      fields: [
        {
          name: 'material',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'faqs',
      type: 'array',
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
        },
        {
          name: 'answer',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Main hero image for this treatment',
      },
    },
    {
      name: 'gallery',
      type: 'array',
      admin: {
        description: 'Additional images for treatment gallery (procedure photos, before/after, etc.)',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
    },
    {
      name: 'videos',
      type: 'array',
      admin: {
        description: 'Treatment awareness videos — YouTube links or uploaded videos',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'type',
          type: 'select',
          defaultValue: 'youtube',
          options: [
            { label: 'YouTube', value: 'youtube' },
            { label: 'Uploaded Video', value: 'upload' },
          ],
        },
        {
          name: 'youtubeUrl',
          type: 'text',
          admin: {
            description: 'Full YouTube URL (e.g. https://www.youtube.com/watch?v=...)',
            condition: (data, siblingData) => siblingData?.type === 'youtube',
          },
        },
        {
          name: 'videoFile',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Upload an MP4 or other video file',
            condition: (data, siblingData) => siblingData?.type === 'upload',
          },
        },
      ],
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
          'If checked, clicking this treatment card opens the dedicated detail page in a new tab. If unchecked, clicking opens the side panel on the home page.',
      },
    },
  ],
}

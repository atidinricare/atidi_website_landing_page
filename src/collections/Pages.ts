import type { CollectionConfig } from 'payload'
import { createRevalidateHook } from '@/lib/revalidate'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
  },
  versions: {
    drafts: true,
  },
  hooks: createRevalidateHook('pages'),
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL path, e.g. "about-us", "contact-us". Use "home" for the homepage.',
      },
    },
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
      name: 'layout',
      type: 'blocks',
      blocks: [
        // Hero block
        {
          slug: 'hero',
          labels: { singular: 'Hero', plural: 'Heroes' },
          fields: [
            { name: 'eyebrow', type: 'text' },
            { name: 'headline', type: 'text', required: true },
            { name: 'subheadline', type: 'textarea' },
            {
              name: 'ctaPrimary',
              type: 'group',
              fields: [
                { name: 'label', type: 'text' },
                { name: 'link', type: 'text' },
              ],
            },
            {
              name: 'ctaSecondary',
              type: 'group',
              fields: [
                { name: 'label', type: 'text' },
                { name: 'link', type: 'text' },
              ],
            },
            { name: 'backgroundImage', type: 'upload', relationTo: 'media' },
            {
              name: 'background',
              type: 'select',
              label: 'Background',
              defaultValue: 'dark',
              options: [
                { label: 'Dark', value: 'dark' },
                { label: 'Light', value: 'light' },
              ],
              admin: {
                description: 'Dark matches the Contact Us and About Us heroes. Light sits on the cream page background.',
              },
            },
          ],
        },

        // Rich content block (narrative, approach, intro sections)
        {
          slug: 'richContent',
          labels: { singular: 'Rich Content', plural: 'Rich Content Blocks' },
          fields: [
            { name: 'eyebrow', type: 'text' },
            { name: 'heading', type: 'text' },
            { name: 'content', type: 'richText' },
            {
              name: 'layout',
              type: 'select',
              defaultValue: 'full',
              options: [
                { label: 'Full Width', value: 'full' },
                { label: 'Two Column', value: 'twoColumn' },
                { label: 'With Sidebar Label', value: 'withSidebar' },
              ],
            },
            { name: 'sidebarLabel', type: 'text', admin: { condition: (_, siblingData) => siblingData?.layout === 'withSidebar' } },
          ],
        },

        // Highlight / turning point block
        {
          slug: 'highlight',
          labels: { singular: 'Highlight', plural: 'Highlights' },
          fields: [
            { name: 'text', type: 'richText', required: true },
            {
              name: 'style',
              type: 'select',
              defaultValue: 'borderLeft',
              options: [
                { label: 'Border Left', value: 'borderLeft' },
                { label: 'Centered', value: 'centered' },
                { label: 'Quote', value: 'quote' },
              ],
            },
          ],
        },

        // Stats grid block
        {
          slug: 'statsGrid',
          labels: { singular: 'Stats Grid', plural: 'Stats Grids' },
          fields: [
            {
              name: 'stats',
              type: 'array',
              minRows: 1,
              maxRows: 8,
              fields: [
                { name: 'value', type: 'text', required: true },
                { name: 'label', type: 'text', required: true },
              ],
            },
          ],
        },

        // Principles / numbered list block
        {
          slug: 'principlesList',
          labels: { singular: 'Principles List', plural: 'Principles Lists' },
          fields: [
            { name: 'heading', type: 'text' },
            {
              name: 'items',
              type: 'array',
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'description', type: 'richText' },
              ],
            },
          ],
        },

        // Contact cards block
        {
          slug: 'contactCards',
          labels: { singular: 'Contact Cards', plural: 'Contact Cards' },
          fields: [
            {
              name: 'theme',
              type: 'select',
              label: 'Card Style',
              defaultValue: 'light',
              options: [
                { label: 'Light cards on a light section', value: 'light' },
                { label: 'Dark cards on a dark section', value: 'dark' },
              ],
              admin: {
                description: 'Choose Dark to match the cards on the Contact Us page.',
              },
            },
            {
              name: 'cards',
              type: 'array',
              fields: [
                { name: 'icon', type: 'text', admin: { description: 'Lucide icon name, e.g. MapPin, Phone, Mail' } },
                { name: 'title', type: 'text', required: true },
                { name: 'content', type: 'richText', required: true },
                { name: 'link', type: 'text' },
                { name: 'linkLabel', type: 'text' },
              ],
            },
          ],
        },

        // Treatments reference block
        {
          slug: 'treatmentsBlock',
          labels: { singular: 'Treatments Section', plural: 'Treatments Sections' },
          fields: [
            { name: 'heading', type: 'text', defaultValue: 'Our Treatments' },
            { name: 'subheading', type: 'textarea' },
            { name: 'showFeaturedOnly', type: 'checkbox', defaultValue: true },
          ],
        },

        // Locations reference block
        {
          slug: 'locationsBlock',
          labels: { singular: 'Locations Section', plural: 'Locations Sections' },
          fields: [
            { name: 'heading', type: 'text', defaultValue: 'Our Locations' },
            { name: 'subheading', type: 'textarea' },
          ],
        },

        // FAQ reference block
        {
          slug: 'faqBlock',
          labels: { singular: 'FAQ Section', plural: 'FAQ Sections' },
          fields: [
            { name: 'heading', type: 'text', defaultValue: 'Frequently Asked Questions' },
            {
              name: 'faqs',
              type: 'relationship',
              relationTo: 'faqs',
              hasMany: true,
              admin: { description: 'Select specific FAQs, or leave empty to show all.' },
            },
          ],
        },

        // CTA block
        {
          slug: 'ctaBlock',
          labels: { singular: 'Call to Action', plural: 'Call to Actions' },
          fields: [
            { name: 'heading', type: 'text', required: true },
            { name: 'subheading', type: 'textarea' },
            {
              name: 'button',
              type: 'group',
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'link', type: 'text', required: true },
              ],
            },
            {
              name: 'style',
              type: 'select',
              defaultValue: 'standard',
              options: [
                { label: 'Standard', value: 'standard' },
                { label: 'Premium (with mockup)', value: 'premium' },
              ],
            },
          ],
        },

        // Legal content block (for privacy/terms)
        {
          slug: 'legalContent',
          labels: { singular: 'Legal Content', plural: 'Legal Content Blocks' },
          fields: [
            {
              name: 'sections',
              type: 'array',
              fields: [
                { name: 'icon', type: 'text', admin: { description: 'Lucide icon name' } },
                { name: 'title', type: 'text', required: true },
                {
                  name: 'items',
                  type: 'array',
                  fields: [
                    { name: 'heading', type: 'text', required: true },
                    { name: 'content', type: 'richText', required: true },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

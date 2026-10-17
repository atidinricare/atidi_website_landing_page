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
            {
              name: 'stats',
              type: 'array',
              label: 'Hero Stats',
              fields: [
                { name: 'value', type: 'text', required: true, label: 'Value' },
                { name: 'label', type: 'text', required: true, label: 'Label' },
                { name: 'prefix', type: 'text', label: 'Prefix' },
                { name: 'suffix', type: 'text', label: 'Suffix' },
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

        // Trust banner & featured in block
        {
          slug: 'trustBanner',
          labels: { singular: 'Trust Banner & Featured In', plural: 'Trust Banners' },
          fields: [
            {
              name: 'items',
              type: 'array',
              label: 'Trust Metrics / Cards',
              labels: { singular: 'Metric Card', plural: 'Metric Cards' },
              fields: [
                {
                  name: 'icon',
                  type: 'text',
                  label: 'Icon (hospital, savings, support, records)',
                  defaultValue: 'hospital',
                  admin: {
                    description: 'Choose icon: hospital, savings, support, or records',
                  },
                },
                { name: 'number', type: 'text', label: 'Number / Stat', required: true },
                { name: 'title', type: 'text', label: 'Title', required: true },
                { name: 'subtitle', type: 'text', label: 'Subtitle / Description' },
              ],
            },
            {
              name: 'mediaHeading',
              type: 'text',
              label: 'Media Section Heading',
              defaultValue: 'As Featured In',
            },
            {
              name: 'mediaLogos',
              type: 'array',
              label: 'Media Publications',
              labels: { singular: 'Publication', plural: 'Publications' },
              fields: [
                { name: 'name', type: 'text', required: true, label: 'Publication Name' },
                { name: 'image', type: 'upload', relationTo: 'media', label: 'Logo Image (Optional)' },
              ],
            },
          ],
        },

        // Treatments reference block
        {
          slug: 'treatmentsBlock',
          labels: { singular: 'Treatments Section', plural: 'Treatments Sections' },
          fields: [
            { name: 'eyebrow', type: 'text', label: 'Eyebrow / Badge', defaultValue: 'Treatments' },
            {
              name: 'heading',
              type: 'textarea',
              label: 'Heading',
              defaultValue: 'World-class\nprocedures,\n*fraction* of the\ncost.',
              admin: {
                description: 'Section heading. Use line breaks for multiple lines. Use *word* for italic highlight.',
              },
            },
            {
              name: 'subheading',
              type: 'textarea',
              label: 'Subheading',
              defaultValue: 'Click on treatment to see full details and procedure information',
            },
            { name: 'showFeaturedOnly', type: 'checkbox', defaultValue: true },
          ],
        },

        // Process / How It Works block
        {
          slug: 'howItWorksBlock',
          labels: { singular: 'Process Section', plural: 'Process Sections' },
          fields: [
            {
              name: 'eyebrow',
              type: 'text',
              label: 'Eyebrow / Badge',
              defaultValue: 'Process',
            },
            {
              name: 'title',
              type: 'textarea',
              label: 'Section Title',
              defaultValue: 'Three\nsimple\nsteps.',
              admin: {
                description: 'Section heading. Use line breaks for multiple lines.',
              },
            },
            {
              name: 'iconImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Travel Icon Image (Upload)',
            },
            {
              name: 'iconImageUrl',
              type: 'text',
              label: 'Icon Image URL (Fallback)',
              defaultValue: '/Suitcase_flight.png',
            },
            {
              name: 'bgNumber',
              type: 'text',
              label: 'Background Watermark Number',
              defaultValue: '03',
            },
            {
              name: 'steps',
              type: 'array',
              label: 'Process Steps',
              labels: { singular: 'Step', plural: 'Steps' },
              fields: [
                {
                  name: 'number',
                  type: 'text',
                  label: 'Step Number',
                  required: true,
                  defaultValue: '01',
                },
                {
                  name: 'title',
                  type: 'text',
                  label: 'Step Title',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Step Description',
                  required: true,
                },
                {
                  name: 'icon',
                  type: 'text',
                  label: 'Icon Name',
                  defaultValue: 'Calendar',
                  admin: {
                    description: 'Lucide icon name (e.g. Calendar, Building2, Home, CheckCircle, Shield, Clock, etc.)',
                  },
                },
              ],
            },
          ],
        },

        // Locations reference block
        {
          slug: 'locationsBlock',
          labels: { singular: 'Locations Section', plural: 'Locations Sections' },
          fields: [
            { name: 'eyebrow', type: 'text', label: 'Eyebrow / Badge', defaultValue: 'Our Network' },
            { name: 'heading', type: 'text', label: 'Heading', defaultValue: 'Treatment in India, follow-up in America.' },
            { name: 'subheading', type: 'textarea', label: 'Subheading / Description', defaultValue: 'Our network spans 23 South Indian cities and 10 USA states for seamless care continuity' },
            {
              type: 'row',
              fields: [
                { name: 'indiaCount', type: 'text', label: 'India Stat Number', defaultValue: '23' },
                { name: 'indiaLabel', type: 'text', label: 'India Stat Label', defaultValue: 'South Indian Cities' },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'usCount', type: 'text', label: 'USA Stat Number', defaultValue: '10' },
                { name: 'usLabel', type: 'text', label: 'USA Stat Label', defaultValue: 'USA States' },
              ],
            },
          ],
        },

        // Clinics reference block
        {
          slug: 'clinicsBlock',
          labels: { singular: 'Clinics Section', plural: 'Clinics Sections' },
          fields: [
            { name: 'heading', type: 'text', defaultValue: 'Partner Dental Hospitals & Clinics' },
            { name: 'subheading', type: 'textarea' },
          ],
        },

        // Testimonials reference block
        {
          slug: 'testimonialsBlock',
          labels: { singular: 'Testimonials Section', plural: 'Testimonials Sections' },
          fields: [
            { name: 'eyebrow', type: 'text', label: 'Eyebrow / Badge', defaultValue: 'Testimonials' },
            { name: 'heading', type: 'text', label: 'Heading', defaultValue: 'Their words,\ntheir journey.' },
            { name: 'subheading', type: 'textarea', label: 'Subheading / Description', defaultValue: 'Patients who travelled for treatment, in their own words' },
            { name: 'showFeaturedOnly', type: 'checkbox', label: 'Show Featured Testimonials Only', defaultValue: false },
          ],
        },

        // FAQ reference block
        {
          slug: 'faqBlock',
          labels: { singular: 'FAQ Section', plural: 'FAQ Sections' },
          fields: [
            { name: 'eyebrow', type: 'text', label: 'Eyebrow / Badge', defaultValue: 'FAQ' },
            { name: 'heading', type: 'text', label: 'Heading', defaultValue: 'Questions,\nanswered.' },
            { name: 'subheading', type: 'textarea', label: 'Subheading', defaultValue: 'Everything you need to know about your dental journey with us' },
            {
              type: 'row',
              fields: [
                {
                  name: 'bannerLine1',
                  type: 'text',
                  label: 'Care Banner Line 1',
                  defaultValue: 'Every step,',
                },
                {
                  name: 'bannerLine2',
                  type: 'text',
                  label: 'Care Banner Line 2 (Emphasized)',
                  defaultValue: 'cared for.',
                },
              ],
            },
            {
              name: 'bannerSubtitle',
              type: 'textarea',
              label: 'Care Banner Description',
              defaultValue: 'From consultation to return, our Care Manager will coordinate your entire dental journey so you can focus on what matters.',
            },
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
            { name: 'eyebrow', type: 'text', label: 'Eyebrow / Badge', defaultValue: 'Start Your Journey' },
            { name: 'heading', type: 'text', required: true, defaultValue: 'Ready to start your dental journey?' },
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
              defaultValue: 'premium',
              options: [
                { label: 'Standard', value: 'standard' },
                { label: 'Premium (with mockup)', value: 'premium' },
              ],
            },
            {
              name: 'screens',
              type: 'array',
              label: 'App Screenshots / Mockups',
              labels: {
                singular: 'App Screen',
                plural: 'App Screens',
              },
              admin: {
                condition: (_, siblingData) => siblingData?.style === 'premium',
                description: 'Screenshots displayed on the rotating phone mockup when Style is Premium.',
              },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Screen Image (Upload)',
                  admin: {
                    description: 'Upload screenshot from your device or choose from Media Library',
                  },
                },
                {
                  name: 'imageUrl',
                  type: 'text',
                  label: 'Image URL / Local Path (Fallback)',
                  admin: {
                    description: 'Direct URL or path like /appimage1.jpeg if not uploading to media',
                  },
                },
                {
                  name: 'label',
                  type: 'text',
                  label: 'Screen Label / Step',
                  defaultValue: '01',
                  admin: {
                    description: 'Short indicator label (e.g. 01, 02, or Reports, Booking)',
                  },
                },
                {
                  name: 'caption',
                  type: 'text',
                  label: 'Caption / Alt Text',
                },
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

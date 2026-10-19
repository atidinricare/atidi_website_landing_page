import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'viewer',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Viewer', value: 'viewer' },
      ],
    },
    {
      name: 'firstName',
      type: 'text',
    },
    {
      name: 'lastName',
      type: 'text',
    },
    // Two-Factor Authentication fields
    {
      name: 'twoFactorEnabled',
      type: 'checkbox',
      label: '2FA Enabled',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Two-factor authentication status',
      },
    },
    {
      name: 'twoFactorSecret',
      type: 'text',
      label: '2FA Secret',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'twoFactorBackupCodes',
      type: 'json',
      label: '2FA Backup Codes',
      admin: {
        hidden: true,
      },
    },
  ],
}

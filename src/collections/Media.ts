import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  hooks: {
    beforeOperation: [
      ({ args, req }) => {
        // After writing the file to S3, the cloud-storage plugin persists upload
        // metadata with an internal payload.update() that re-uses this same req.
        // The original ?uploadEdits[crop] query params are still attached, so
        // Payload decides it must re-crop and re-fetches the file over HTTP --
        // but that request runs outside the still-open transaction, cannot see
        // the uncommitted row, and 404s. The resulting error poisons the
        // transaction and the whole upload is rolled back, leaving the document
        // gone and an orphaned file in the bucket.
        //
        // The crop has already been applied by this point, so drop the edits for
        // that internal update only. req.context.skipCloudStorage is the flag the
        // plugin sets to mark it.
        if (req?.context?.skipCloudStorage && req.query && 'uploadEdits' in req.query) {
          delete (req.query as Record<string, unknown>).uploadEdits
        }

        return args
      },
    ],
  },
  upload: {
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 600,
        height: 400,
        position: 'centre',
      },
      {
        name: 'hero',
        width: 1920,
        height: 1080,
        position: 'centre',
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
}

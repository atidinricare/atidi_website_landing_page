import { CloudFrontClient, CreateInvalidationCommand } from '@aws-sdk/client-cloudfront'
import type { Config, Plugin } from 'payload'

interface CloudFrontPurgeConfig {
  enabled?: boolean
  distributionId: string
  region?: string
  accessKeyId?: string
  secretAccessKey?: string
  collections?: string[]
  globals?: string[]
  events?: ('create' | 'update' | 'delete')[]
  buildPaths?: (args: { collection?: string; global?: string; doc: any }) => string[]
}

export const cloudfrontPurgePlugin = (config: CloudFrontPurgeConfig): Plugin => {
  const {
    enabled = true,
    distributionId,
    region = 'us-east-1',
    accessKeyId,
    secretAccessKey,
    collections = [],
    globals = [],
    events = ['create', 'update', 'delete'],
    buildPaths = () => ['/*'],
  } = config

  if (!enabled || !distributionId) {
    return (incomingConfig: Config): Config => incomingConfig
  }

  const cloudfront = new CloudFrontClient({
    region,
    credentials: accessKeyId && secretAccessKey
      ? { accessKeyId, secretAccessKey }
      : undefined, // Uses default AWS credentials chain if not provided
  })

  const invalidateCache = async (paths: string[]) => {
    try {
      const command = new CreateInvalidationCommand({
        DistributionId: distributionId,
        InvalidationBatch: {
          CallerReference: `payload-${Date.now()}`,
          Paths: {
            Quantity: paths.length,
            Items: paths,
          },
        },
      })

      const response = await cloudfront.send(command)
      console.log(`[CloudFront] Cache invalidated for paths: ${paths.join(', ')}`)
      console.log(`[CloudFront] Invalidation ID: ${response.Invalidation?.Id}`)
      return response
    } catch (error) {
      console.error('[CloudFront] Cache invalidation failed:', error)
      throw error
    }
  }

  return (incomingConfig: Config): Config => {
    const modifiedCollections = incomingConfig.collections?.map((collection) => {
      if (!collections.includes(collection.slug)) {
        return collection
      }

      return {
        ...collection,
        hooks: {
          ...collection.hooks,
          afterChange: [
            ...(collection.hooks?.afterChange || []),
            async ({ doc, operation }: { doc: any; operation: 'create' | 'update' }) => {
              if (
                (operation === 'create' && events.includes('create')) ||
                (operation === 'update' && events.includes('update'))
              ) {
                const paths = buildPaths({ collection: collection.slug, doc })
                await invalidateCache(paths)
              }
              return doc
            },
          ],
          afterDelete: [
            ...(collection.hooks?.afterDelete || []),
            async ({ doc }: { doc: any }) => {
              if (events.includes('delete')) {
                const paths = buildPaths({ collection: collection.slug, doc })
                await invalidateCache(paths)
              }
              return doc
            },
          ],
        },
      }
    })

    const modifiedGlobals = incomingConfig.globals?.map((global) => {
      if (!globals.includes(global.slug)) {
        return global
      }

      return {
        ...global,
        hooks: {
          ...global.hooks,
          afterChange: [
            ...(global.hooks?.afterChange || []),
            async ({ doc }: { doc: any }) => {
              if (events.includes('update')) {
                const paths = buildPaths({ global: global.slug, doc })
                await invalidateCache(paths)
              }
              return doc
            },
          ],
        },
      }
    })

    return {
      ...incomingConfig,
      collections: modifiedCollections,
      globals: modifiedGlobals,
    }
  }
}

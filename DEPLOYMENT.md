# Deployment Guide - Atidi NRI Care

## Table of Contents
- [Environment Setup](#environment-setup)
- [Database Configuration](#database-configuration)
- [CDN Configuration](#cdn-configuration)
- [S3 Storage Configuration](#s3-storage-configuration)
- [Production Deployment](#production-deployment)
- [Troubleshooting](#troubleshooting)

---

## Environment Setup

### Required Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Database
DATABASE_URI=postgresql://user:password@localhost:5432/atidi

# Payload CMS
PAYLOAD_SECRET=your-secret-key-here

# Site URL
SITE_URL=https://your-domain.com
NODE_ENV=production
```

---

## Database Configuration

### PostgreSQL Setup

1. Create database:
```bash
createdb atidi
```

2. Run migrations:
```bash
npm run payload migrate
```

3. Check migration status:
```bash
npm run payload migrate:status
```

---

## CDN Configuration

The CMS supports two CDN providers for automatic cache purging when content changes:

### Option 1: Cloudflare CDN

**Plugin:** `payload-plugin-cloudflare-purge`

#### Setup Steps:

1. **Get Cloudflare Credentials:**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Navigate to: My Profile → API Tokens → Create Token
   - Use the "Edit zone DNS" template or create custom with:
     - Zone → Cache Purge → Purge
   - Copy the Zone ID from: Your domain → Overview → Right sidebar

2. **Add Environment Variables:**
```env
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
CLOUDFLARE_ZONE_ID=your_cloudflare_zone_id
```

3. **Enable Plugin in `src/payload.config.ts`:**
```typescript
import { PayloadPluginCloudflarePurge } from 'payload-plugin-cloudflare-purge'

// In plugins array:
PayloadPluginCloudflarePurge({
  cloudflareApiToken: process.env.CLOUDFLARE_API_TOKEN || '',
  cloudflareZoneId: process.env.CLOUDFLARE_ZONE_ID || '',
  enabled: process.env.NODE_ENV === 'production',
  collections: ['treatments', 'locations', 'clinics', 'posts', 'pages', 'media'],
  globals: ['site-settings', 'navigation', 'footer', 'hero-content'],
  events: ['create', 'update', 'delete'],
  buildUrl: ({ collection, doc }) => {
    const baseUrl = process.env.SITE_URL || 'https://athidi-payload-node-dev.ktree.org';
    if (collection === 'treatments') return `${baseUrl}/treatments/${doc.slug}`;
    if (collection === 'locations') return `${baseUrl}/locations/${doc.slug}`;
    if (collection === 'posts') return `${baseUrl}/blog/${doc.slug}`;
    if (collection === 'pages') return `${baseUrl}/${doc.slug}`;
    return baseUrl;
  },
}),
```

---

### Option 2: AWS CloudFront CDN

**Plugin:** Custom `cloudfrontPurgePlugin` (located at `src/plugins/cloudfront-purge.ts`)

#### Setup Steps:

1. **Get AWS Credentials:**
   - Go to [AWS CloudFront Console](https://console.aws.amazon.com/cloudfront)
   - Copy your Distribution ID
   - Create IAM user with CloudFront permissions:
     ```json
     {
       "Version": "2012-10-17",
       "Statement": [
         {
           "Effect": "Allow",
           "Action": "cloudfront:CreateInvalidation",
           "Resource": "arn:aws:cloudfront::YOUR_ACCOUNT_ID:distribution/YOUR_DISTRIBUTION_ID"
         }
       ]
     }
     ```

2. **Add Environment Variables:**
```env
AWS_CLOUDFRONT_DISTRIBUTION_ID=E1234ABCDEFGH
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

3. **Enable Plugin in `src/payload.config.ts`:**
```typescript
import { cloudfrontPurgePlugin } from './plugins/cloudfront-purge'

// In plugins array:
cloudfrontPurgePlugin({
  enabled: process.env.NODE_ENV === 'production',
  distributionId: process.env.AWS_CLOUDFRONT_DISTRIBUTION_ID || '',
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  collections: ['treatments', 'locations', 'clinics', 'posts', 'pages', 'media'],
  globals: ['site-settings', 'navigation', 'footer', 'hero-content'],
  events: ['create', 'update', 'delete'],
  buildPaths: ({ collection, doc }) => {
    if (collection === 'treatments') return [`/treatments/${doc.slug}`, '/treatments'];
    if (collection === 'locations') return [`/locations/${doc.slug}`, '/locations'];
    if (collection === 'posts') return [`/blog/${doc.slug}`, '/blog'];
    if (collection === 'pages') return [`/${doc.slug}`];
    return ['/', '/*'];
  },
}),
```

#### CloudFront Invalidation Notes:
- First 1,000 invalidation paths per month are free
- Wildcards (`/*`) count as one path
- Invalidations typically complete within 10-15 minutes

---

## S3 Storage Configuration

For media file storage using AWS S3:

### Environment Variables:
```env
S3_BUCKET=atidi-media
S3_ACCESS_KEY_ID=your_access_key
S3_SECRET_ACCESS_KEY=your_secret_key
S3_REGION=us-east-1
S3_ENDPOINT=https://s3.us-east-1.amazonaws.com
```

### Enable in `src/payload.config.ts`:
```typescript
import { s3Storage } from '@payloadcms/storage-s3'

// In plugins array:
s3Storage({
  collections: {
    media: {
      prefix: 'media',
    },
  },
  bucket: process.env.S3_BUCKET || 'atidi-media',
  config: {
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
    },
    region: process.env.S3_REGION || 'us-east-1',
    endpoint: process.env.S3_ENDPOINT,
    forcePathStyle: true,
  },
}),
```

---

## Production Deployment

### Build Steps:

```bash
# Install dependencies
npm install

# Generate types
npm run generate:types

# Build for production
npm run build

# Start production server
npm run start
```

### Docker Deployment:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "server.js"]
```

### Nginx Configuration:

```nginx
server {
    listen 80;
    server_name athidi-payload-node-dev.ktree.org;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Troubleshooting

### Cache Not Clearing

1. **Check CDN credentials are correct**
2. **Verify `NODE_ENV=production`** - CDN plugins only run in production
3. **Check server logs** for purge errors:
   ```bash
   tail -f /var/log/app.log | grep -i "cloudfront\|cloudflare"
   ```

### Database Migration Errors

```bash
# Check migration status
npm run payload migrate:status

# Fresh migration (WARNING: drops all data)
npm run payload migrate:fresh

# Push schema changes in development
npm run payload push
```

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules cache
rm -rf node_modules/.cache

# Reinstall dependencies
rm -rf node_modules && npm install
```

---

## Environment Variables Summary

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URI` | PostgreSQL connection string | Yes |
| `PAYLOAD_SECRET` | Secret key for Payload CMS | Yes |
| `SITE_URL` | Public URL of the site | Yes |
| `NODE_ENV` | Environment (development/production) | Yes |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token | If using Cloudflare |
| `CLOUDFLARE_ZONE_ID` | Cloudflare Zone ID | If using Cloudflare |
| `AWS_CLOUDFRONT_DISTRIBUTION_ID` | CloudFront Distribution ID | If using AWS |
| `AWS_REGION` | AWS Region | If using AWS |
| `AWS_ACCESS_KEY_ID` | AWS Access Key | If using AWS |
| `AWS_SECRET_ACCESS_KEY` | AWS Secret Key | If using AWS |
| `S3_BUCKET` | S3 Bucket name | If using S3 storage |
| `S3_ACCESS_KEY_ID` | S3 Access Key | If using S3 storage |
| `S3_SECRET_ACCESS_KEY` | S3 Secret Key | If using S3 storage |
| `S3_REGION` | S3 Region | If using S3 storage |
| `S3_ENDPOINT` | S3 Endpoint URL | If using S3 storage |

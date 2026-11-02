# Atidi NRI Care - KTree CMS Detailed Summary

## Repository & Setup

| Item | Value |
|------|-------|
| GitLab | https://prodgitlab.ktree.org/root/atidi-payload-node |
| Branch | dev |
| Local | c:\Users\Ismail\Desktop\Ismail\Athidicare\atidi-payload |

## Environment Variables (.env)

```env
DATABASE_URI=postgresql://athidi:athididev123@10.0.1.151:5432/athidi-node20-dev-dbv1
PAYLOAD_SECRET=atidi-nri-care-payload-secret-change-in-production
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

## Admin Panel

| Item | Value |
|------|-------|
| URL | http://localhost:3000/admin |
| Email | admin@atidicare.com |
| Password | admin123 |

## Project Structure

```
atidi-payload/
├── src/
│   ├── app/
│   │   ├── (frontend)/          # Public website routes
│   │   │   ├── page.tsx         # Homepage
│   │   │   ├── layout.tsx       # Frontend layout (Header, Footer, Tracking)
│   │   │   ├── globals.css      # All CSS styles
│   │   │   ├── about-us/
│   │   │   ├── contact-us/
│   │   │   ├── clinics/
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx     # Blog listing
│   │   │   │   └── [slug]/page.tsx  # Individual post
│   │   │   ├── privacy-policy/
│   │   │   └── terms-of-service/
│   │   ├── (payload)/           # CMS admin routes (auto-generated)
│   │   │   ├── admin/
│   │   │   └── api/
│   │   └── layout.tsx           # Root layout (fonts)
│   ├── collections/             # Payload CMS collections
│   │   ├── Users.ts
│   │   ├── Media.ts
│   │   ├── Categories.ts
│   │   ├── Treatments.ts
│   │   ├── Locations.ts
│   │   ├── Clinics.ts
│   │   ├── Posts.ts
│   │   ├── FAQs.ts
│   │   ├── Testimonials.ts
│   │   └── Pages.ts
│   ├── globals/                 # Payload CMS globals
│   │   ├── SiteSettings.ts
│   │   ├── Navigation.ts
│   │   ├── Footer.ts
│   │   ├── HeroContent.ts
│   │   └── TrackingSettings.ts
│   ├── components/              # React components
│   │   ├── HomePageClient.jsx
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── SearchBar.jsx
│   │   ├── Treatments.jsx
│   │   ├── Locations.jsx
│   │   ├── FAQ.jsx
│   │   ├── HowItWorks.jsx
│   │   ├── JourneyCTA.jsx
│   │   ├── TrustBanner.jsx
│   │   ├── TrackingScripts.jsx
│   │   ├── TrackingScriptsWrapper.jsx
│   │   ├── BlogPageClient.jsx
│   │   ├── BlogPostClient.jsx
│   │   ├── ClinicsPageClient.jsx
│   │   ├── AboutUsClient.jsx
│   │   ├── ContactUsClient.jsx
│   │   └── *.module.css         # CSS Modules for each component
│   ├── lib/
│   │   ├── data.ts              # Server-side data fetching functions
│   │   ├── adapters.ts          # Transform Payload docs to component props
│   │   └── revalidate.ts        # On-demand revalidation utilities
│   ├── seed/                    # Database seed scripts
│   │   ├── index.ts             # Main seed (categories, treatments, locations, clinics, testimonials)
│   │   ├── seed-globals.ts      # Seed all globals
│   │   ├── seed-faqs.ts         # Seed 7 FAQs
│   │   ├── seed-posts.ts        # Seed 3 blog posts
│   │   ├── seed-pages.ts        # Seed pages
│   │   ├── treatments-data.ts   # 24 treatments data
│   │   └── locations-data.ts    # 33 locations data
│   └── payload.config.ts        # Payload CMS configuration
├── public/                      # Static assets (images, videos)
├── .env                         # Environment variables
├── .env.example                 # Example env file
├── Dockerfile                   # Docker build
├── docker-compose.yml           # Docker compose
└── package.json
```

## Collections Detail

| Collection | Fields | Count |
|------------|--------|-------|
| Users | email, password, role | 1 admin |
| Media | file upload, alt text | - |
| Categories | name, slug, description, icon | 9 |
| Treatments | name, slug, category, description, benefits, duration, recovery, priceRange | 24 |
| Locations | city, state, country, type (india/us), coordinates, clinics (embedded) | 33 |
| Clinics | name, location (relation), address, phone, email, hours, services | 24 |
| Posts | title, slug, content (richText), excerpt, featuredImage, author, publishedDate | 3 |
| FAQs | question, answer, order | 7 |
| Testimonials | patientName, quote, location, rating, image | 8 |
| Pages | title, slug, content | 6 |

## Globals Detail

| Global | Fields | Purpose |
|--------|--------|---------|
| SiteSettings | siteName, siteDescription, contactEmail, contactPhone, whatsappNumber, socialLinks, announcement | Site-wide settings |
| Navigation | mainNav (array), ctaButton | Header navigation |
| Footer | tagline, columns (array of links), bottomText, legalLinks | Footer content |
| HeroContent | headline, subheadline, ctaPrimary, ctaSecondary, stats (array), backgroundImage | Homepage hero |
| TrackingSettings | gtmId, ga4Id, facebookPixelId, headScripts, bodyStartScripts, bodyEndScripts | Analytics & tracking |

## Data Fetching Functions (src/lib/data.ts)

```typescript
// Collections
getTreatments()      // Returns { featured, all, byCategory }
getLocations()       // Returns { india, us, all }
getFAQs()            // Returns FAQ array sorted by order
getPosts()           // Returns published posts
getPostBySlug(slug)  // Returns single post

// Globals
getHeroContent()     // Returns hero section data
getSiteSettings()    // Returns site settings
getFooter()          // Returns footer data
getTrackingSettings() // Returns tracking IDs & scripts
```

## Seeded Data Summary

| Data | Count | Details |
|------|-------|---------|
| Admin User | 1 | admin@atidicare.com |
| Categories | 9 | Restorative, Cosmetic, Endodontics, Periodontics, Orthodontics, Oral Surgery, Prosthodontics, Preventive, Pediatric |
| Treatments | 24 | Dental Implants, Veneers, Root Canal, Crowns, Bridges, Dentures, Teeth Whitening, etc. |
| Locations | 33 | 23 India (treatment centers) + 10 USA (follow-up care) |
| Clinics | 24 | Embedded in India locations (Hyderabad has 2, others have 1) |
| FAQs | 7 | Common questions about dental tourism |
| Testimonials | 8 | Patient reviews |
| Blog Posts | 3 | Dental implants guide, Cost savings, Questions to ask |
| Pages | 6 | Home, About Us, Contact Us, Clinics, Privacy Policy, Terms of Service |

## Commands Reference

```bash
# Development
npm run dev                              # Start dev server (port 3000)
npm run build                            # Production build
npm run start                            # Start production server

# Seeding
npm run seed                             # Main seed (categories, treatments, locations, clinics, testimonials)
npx tsx src/seed/seed-globals.ts         # Seed all 5 globals
npx tsx src/seed/seed-faqs.ts            # Seed 7 FAQs
npx tsx src/seed/seed-posts.ts           # Seed 3 blog posts
npx tsx src/seed/seed-pages.ts           # Seed 6 pages

# Payload
npx payload generate:importmap           # Regenerate import map after collection changes
```

## Dynamic Content Flow

```
Server Component (page.tsx)
    ↓
Fetch data via Payload Local API (data.ts)
    ↓
Pass props to Client Component (*Client.jsx)
    ↓
Render with Framer Motion animations
```

### Example - Homepage:

```
src/app/(frontend)/page.tsx
    → getTreatments(), getLocations(), getFAQs(), getHeroContent()
    → <HomePageClient {...props} />
```

## On-Demand Revalidation (Static Generation)

Pages are statically generated and cached **indefinitely** until content changes in the CMS. When content is updated in Payload CMS, the cache is automatically revalidated.

| Page | Strategy |
|------|----------|
| All Pages | Static (lifetime cache) - revalidates only on content change |

### How It Works

```
1. Page is statically generated at build time or first request
2. Cache persists indefinitely (no time-based expiry)
3. When content is updated in Payload CMS admin:
   → Payload hook triggers revalidatePath() or revalidateTag()
   → Cache is invalidated for affected pages
   → Next request regenerates the page with fresh data
```

### Implementation

**Revalidation Utility (src/lib/revalidate.ts):**
```typescript
import { revalidatePath } from 'next/cache'

// Revalidate specific paths based on collection/global type
export const revalidateByType = (type: string, slug?: string) => {
  switch (type) {
    case 'treatments':
    case 'categories':
      revalidatePath('/')
      revalidatePath('/clinics')
      break
    case 'posts':
      revalidatePath('/blog')
      if (slug) revalidatePath(`/blog/${slug}`)
      break
    // ... other types
  }
}

// Hook helpers for collections and globals
export const createRevalidateHook = (collectionSlug: string) => ({
  afterChange: [async ({ doc }) => { revalidateByType(collectionSlug, doc?.slug); return doc }],
  afterDelete: [async ({ doc }) => { revalidateByType(collectionSlug, doc?.slug); return doc }],
})

export const createGlobalRevalidateHook = (globalSlug: string) => ({
  afterChange: [async ({ doc }) => { revalidateByType(globalSlug); return doc }],
})
```

**In Collections (e.g., Treatments.ts):**
```typescript
import { createRevalidateHook } from '@/lib/revalidate'

export const Treatments: CollectionConfig = {
  slug: 'treatments',
  hooks: createRevalidateHook('treatments'),
  // ... fields
}
```

**In Globals (e.g., HeroContent.ts):**
```typescript
import { createGlobalRevalidateHook } from '@/lib/revalidate'

export const HeroContent: GlobalConfig = {
  slug: 'hero-content',
  hooks: createGlobalRevalidateHook('hero-content'),
  // ... fields
}
```

**In Pages (e.g., page.tsx):**
```typescript
// Static generation - revalidates on-demand when content changes in CMS
export const revalidate = false
```

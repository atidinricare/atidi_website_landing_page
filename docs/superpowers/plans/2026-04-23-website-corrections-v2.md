# Website Corrections v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the KTree client's batch of website corrections plus a per-record "open in new tab" toggle, sticky Book Appointment CTA, and US office address.

**Architecture:** Single feature branch `feat/website-corrections-v2`. One new boolean field (`opensInNewTab`) on Treatments and Locations. One migration that (a) adds the column, (b) publishes all rows, (c) sets `opensInNewTab` per record, (d) overwrites the `HeroContent` global's subheadline + US-states stat, (e) replaces the videos on the 5 client-specified treatments. Click handlers on the homepage choose `window.open(..., '_blank')` vs the existing `SlidePanel` based on the flag. Content fixes are local edits to JSX fallback strings + matching seed files. New `BookAppointmentFloat.jsx` mounted in the frontend layout gives a site-wide sticky CTA.

**Tech Stack:** Next.js 15 App Router, Payload CMS v3, Postgres via `@payloadcms/db-postgres`, React 19, Framer Motion, Playwright for E2E, lucide-react icons. CSS Modules.

**Spec:** `docs/superpowers/specs/2026-04-23-website-corrections-v2-design.md`.

---

## Preflight

- [ ] **Step 1: Confirm branch**

```bash
git status
git branch --show-current
```

Expected: on `feat/website-corrections-v2`, working tree clean apart from unrelated untracked files. If not on the branch:

```bash
git checkout feat/website-corrections-v2
```

- [ ] **Step 2: Sanity-run the existing test suite as a baseline**

```bash
npm run test:e2e -- --reporter=line
```

Expected: current suite (96 tests) passes. Note the pass count; we will preserve it at the end.

If Playwright requires browser install, run `npx playwright install chromium` once.

---

## Task 1: Add `opensInNewTab` field to Treatments + Locations collections

**Files:**
- Modify: `src/collections/Treatments.ts` (add field after `featured`)
- Modify: `src/collections/Locations.ts` (add field after `featured`)

- [ ] **Step 1: Add `opensInNewTab` to Treatments collection**

In `src/collections/Treatments.ts`, right after the `featured` field (line 193-197), add:

```ts
    {
      name: 'opensInNewTab',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description:
          'If checked, clicking this treatment card opens the dedicated detail page in a new tab. If unchecked, clicking opens the side panel on the home page.',
      },
    },
```

Also add `'opensInNewTab'` to `admin.defaultColumns` so it's visible in the admin list view:

```ts
    defaultColumns: ['name', 'category', 'status', 'opensInNewTab', 'updatedAt'],
```

- [ ] **Step 2: Add `opensInNewTab` to Locations collection**

In `src/collections/Locations.ts`, right after the `featured` field (line 141-144), add the same block:

```ts
    {
      name: 'opensInNewTab',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description:
          'If checked, clicking this location card opens the dedicated detail page in a new tab. If unchecked, clicking opens the side panel on the home page.',
      },
    },
```

Update `admin.defaultColumns`:

```ts
    defaultColumns: ['city', 'country', 'type', 'status', 'opensInNewTab', 'updatedAt'],
```

- [ ] **Step 3: Regenerate Payload types + import map**

Run:

```bash
npx payload generate:types
npx payload generate:importmap
```

Expected: `src/payload-types.ts` updated to include `opensInNewTab?: boolean | null` on both `Treatment` and `Location` interfaces. `src/app/(payload)/admin/importMap.js` regenerated without errors.

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/collections/Treatments.ts src/collections/Locations.ts
# Do NOT stage src/payload-types.ts — it is gitignored (generated file).
# Do NOT stage src/app/(payload)/admin/importMap.js unless Payload actually wrote new imports.
git commit -m "feat(cms): add opensInNewTab boolean to Treatments and Locations"
```

---

## Task 2: Migration — schema + publish + flag values + hero global + videos

**Files:**
- Create: `src/migrations/20260423_opens_in_new_tab.ts`
- Modify: `src/migrations/index.ts`

- [ ] **Step 1: Write the migration file**

Create `src/migrations/20260423_opens_in_new_tab.ts`:

```ts
import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

const FEATURED_TREATMENT_SLUGS = [
  'dental-implants',
  'smile-design',
  'invisalign-aligners',
  'root-canal',
  'wisdom-teeth',
]

const NEW_HERO_SUBHEADLINE =
  'ATIDI NRI CARE connects NRIs to verified top premium dental hospitals in India & USA. We provide world-class treatment in India with seamless follow-up care when you return to the USA. At Atidi dental treatments are 70–90% cheaper than in USA without compromising quality.'

const FEATURED_VIDEOS: Record<string, Array<{ title: string; url: string }>> = {
  'dental-implants': [
    { title: 'All-on-4 Implants Overview', url: 'https://youtube.com/shorts/2ZRWYZ59TYg' },
    { title: 'Dental Implant Procedure', url: 'https://youtu.be/D788vZWD7Mc' },
  ],
  'digital-smile-design': [
    { title: 'Digital Smile Design', url: 'https://youtu.be/nKjVUnQrt70' },
  ],
  'root-canal': [
    { title: 'Root Canal Treatment Explained', url: 'https://youtu.be/P3BJ6jR-_cI' },
    { title: 'Root Canal Procedure', url: 'https://youtu.be/4KbU1EG_6QQ' },
  ],
  'root-canal-treatment': [
    { title: 'Root Canal Treatment Explained', url: 'https://youtu.be/P3BJ6jR-_cI' },
    { title: 'Root Canal Procedure', url: 'https://youtu.be/4KbU1EG_6QQ' },
  ],
  invisalign: [
    { title: 'Invisalign Aligners', url: 'https://youtu.be/Cu1Cz3lAcwI' },
  ],
  'invisalign-aligners': [
    { title: 'Invisalign Aligners', url: 'https://youtu.be/Cu1Cz3lAcwI' },
  ],
  'wisdom-teeth': [
    { title: 'Wisdom Teeth Removal', url: 'https://youtu.be/_rmv3QFFHQk' },
  ],
  'wisdom-teeth-removal': [
    { title: 'Wisdom Teeth Removal', url: 'https://youtu.be/_rmv3QFFHQk' },
  ],
}

export async function up({ db, payload }: MigrateUpArgs): Promise<void> {
  // 1. Add opens_in_new_tab column to treatments + locations
  await db.execute(sql.raw(`
    ALTER TABLE "treatments"
      ADD COLUMN IF NOT EXISTS "opens_in_new_tab" boolean NOT NULL DEFAULT true;
    ALTER TABLE "locations"
      ADD COLUMN IF NOT EXISTS "opens_in_new_tab" boolean NOT NULL DEFAULT true;
  `))

  // 2. Publish all rows
  await db.execute(sql.raw(`
    UPDATE "treatments" SET "status" = 'published' WHERE "status" IS NULL OR "status" = 'draft';
    UPDATE "locations"  SET "status" = 'published' WHERE "status" IS NULL OR "status" = 'draft';
  `))

  // 3. Set opensInNewTab = true for 5 featured treatments (by slug), false for the rest.
  //    Locations stay at the default (true).
  const slugList = FEATURED_TREATMENT_SLUGS.map((s) => `'${s}'`).join(', ')
  await db.execute(sql.raw(`
    UPDATE "treatments" SET "opens_in_new_tab" = true  WHERE "slug" IN (${slugList});
    UPDATE "treatments" SET "opens_in_new_tab" = false WHERE "slug" NOT IN (${slugList});
  `))

  // 4. Update HeroContent global: new subheadline + US-states stat 8 → 10.
  //    Uses Payload Local API because globals have nested array data that's cleaner
  //    to update through the API than by hand-rolling JSON/SQL.
  try {
    const current = (await payload.findGlobal({ slug: 'hero-content' })) as any
    const updatedStats = (current?.stats ?? []).map((s: any) => {
      const label = (s?.label || '').toLowerCase()
      if (label.includes('us states') || label.includes('states covered')) {
        return { ...s, value: '10' }
      }
      return s
    })
    await payload.updateGlobal({
      slug: 'hero-content',
      data: {
        subheadline: NEW_HERO_SUBHEADLINE,
        stats: updatedStats,
      } as any,
    })
  } catch (err) {
    // Global may not exist yet in a fresh DB — that's fine, seeds will create it.
    console.warn('[migration 20260423] HeroContent update skipped:', (err as Error).message)
  }

  // 5. Replace videos on the 5 client-specified treatments.
  for (const slug of Object.keys(FEATURED_VIDEOS)) {
    try {
      const result = await payload.find({
        collection: 'treatments',
        where: { slug: { equals: slug } },
        limit: 1,
      })
      const doc = result.docs[0] as any
      if (!doc) continue
      const videos = FEATURED_VIDEOS[slug].map((v) => ({
        title: v.title,
        type: 'youtube',
        youtubeUrl: v.url,
      }))
      await payload.update({
        collection: 'treatments',
        id: doc.id,
        data: { videos } as any,
      })
    } catch (err) {
      console.warn(`[migration 20260423] Videos update skipped for ${slug}:`, (err as Error).message)
    }
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql.raw(`
    ALTER TABLE "treatments" DROP COLUMN IF EXISTS "opens_in_new_tab";
    ALTER TABLE "locations"  DROP COLUMN IF EXISTS "opens_in_new_tab";
  `))
}
```

- [ ] **Step 2: Register the migration**

Edit `src/migrations/index.ts` to add the new entry:

```ts
import * as migration_20260227_textarea_to_richtext from './20260227_textarea_to_richtext';
import * as migration_20260402_set_status_published from './20260402_set_status_published';
import * as migration_20260423_opens_in_new_tab from './20260423_opens_in_new_tab';

export const migrations = [
  {
    up: migration_20260227_textarea_to_richtext.up,
    down: migration_20260227_textarea_to_richtext.down,
    name: '20260227_textarea_to_richtext'
  },
  {
    up: migration_20260402_set_status_published.up,
    down: migration_20260402_set_status_published.down,
    name: '20260402_set_status_published'
  },
  {
    up: migration_20260423_opens_in_new_tab.up,
    down: migration_20260423_opens_in_new_tab.down,
    name: '20260423_opens_in_new_tab'
  },
];
```

- [ ] **Step 3: Run the migration against the dev DB**

```bash
npx payload migrate
```

Expected output includes `Running migration 20260423_opens_in_new_tab...` followed by `Done.`

- [ ] **Step 4: Verify the data state**

```bash
psql "$DATABASE_URI" -c "SELECT slug, opens_in_new_tab, status FROM treatments ORDER BY slug;"
psql "$DATABASE_URI" -c "SELECT slug, opens_in_new_tab, status FROM locations ORDER BY slug;" 2>/dev/null
```

Expected:
- Every treatment row has `status = 'published'`.
- `opens_in_new_tab = true` only for the 5 client-featured slugs (matched from the slug list above); `false` for all others.
- Every location row has `status = 'published'` and `opens_in_new_tab = true`.

If `psql` is not available, use `npx payload` admin or a quick Node one-liner to verify.

- [ ] **Step 5: Verify HeroContent + videos**

Open http://localhost:3000/admin → Globals → Hero Content. Confirm the subheadline matches the new text and the stat labelled "US States Covered" shows `10`.

Open http://localhost:3000/admin → Collections → Treatments → Dental Implants. Confirm the `videos` array now has the two YouTube URLs from the migration and no old entries. Spot-check one more of: Digital Smile Design, Root Canal, Invisalign, Wisdom Teeth.

- [ ] **Step 6: Commit**

```bash
git add src/migrations/20260423_opens_in_new_tab.ts src/migrations/index.ts
git commit -m "feat(cms): migration to publish all, set opensInNewTab, refresh hero global and featured videos"
```

---

## Task 3: Pipe `opensInNewTab` through adapters

**Files:**
- Modify: `src/lib/adapters.ts` (add `opensInNewTab` to both adapter return shapes)

- [ ] **Step 1: Update `adaptTreatment`**

In `src/lib/adapters.ts`, inside the object returned by `adaptTreatment` (around line 87 where `featured` lives), add below `featured`:

```ts
    featured: doc.featured || false,
    opensInNewTab: doc.opensInNewTab ?? true,
```

- [ ] **Step 2: Update `adaptLocation`**

Inside `adaptLocation`'s `base` object (around line 114), add below `featured`:

```ts
    featured: doc.featured || false,
    opensInNewTab: doc.opensInNewTab ?? true,
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/adapters.ts
git commit -m "feat(lib): pass opensInNewTab through treatment and location adapters"
```

---

## Task 4: Homepage click handlers — new tab vs slide panel

**Files:**
- Modify: `src/components/HomePageClient.jsx` (`handleSelectTreatment`, `handleSelectLocation`)
- Test: `tests/e2e/website-corrections.spec.ts` (created later in Task 14; routing assertions land there)

- [ ] **Step 1: Update `handleSelectTreatment`**

In `src/components/HomePageClient.jsx`, replace the existing `handleSelectTreatment` (around line 40) with:

```jsx
  const handleSelectTreatment = (treatment) => {
    if (treatment?.opensInNewTab) {
      if (typeof window !== 'undefined') {
        window.open(`/treatments/${treatment.id}`, '_blank', 'noopener,noreferrer')
      }
      return
    }
    setSelectedTreatment(treatment)
    setActivePanel('treatment')
  }
```

- [ ] **Step 2: Update `handleSelectLocation`**

Replace the existing `handleSelectLocation` (around line 45):

```jsx
  const handleSelectLocation = (location) => {
    if (location?.opensInNewTab) {
      if (typeof window !== 'undefined') {
        window.open(`/locations/${location.id}`, '_blank', 'noopener,noreferrer')
      }
      return
    }
    setSelectedLocation(location)
    setActivePanel('location')
  }
```

- [ ] **Step 3: Pass all treatments, not only featured, to `<Treatments>`**

The client wants all 24 treatments visible on the homepage grid. `featured: true` is already set on every treatment in the seed, but if `featured` were ever toggled in the admin we'd silently lose items. Change the homepage to pass `allTreatments` instead.

Edit `src/app/(frontend)/page.tsx` — change:

```tsx
      <HomePageClient
        featuredTreatments={treatments.featured}
```

to:

```tsx
      <HomePageClient
        featuredTreatments={treatments.all}
```

Leave the prop name `featuredTreatments` as-is to avoid noise; it now receives all published treatments.

- [ ] **Step 4: Manual smoke test**

```bash
npm run dev
```

Open http://localhost:3000 and verify:
- The treatments grid shows 24 cards (click "Load More" if needed — the existing grid starts at 20 and loads 4 more on click).
- Clicking a featured treatment (e.g. Dental Implants) opens `/treatments/dental-implants` in a new tab.
- Clicking a non-featured treatment (e.g. Teeth Whitening) opens the SlidePanel on the same page.
- Clicking any location card opens `/locations/<slug>` in a new tab (all locations default to `opensInNewTab = true`).
- Search bar dropdown: same behaviour on click for both treatments and locations.

Stop the dev server with Ctrl+C.

- [ ] **Step 5: Commit**

```bash
git add src/components/HomePageClient.jsx src/app/\(frontend\)/page.tsx
git commit -m "feat(home): route card clicks by opensInNewTab; show all published treatments"
```

---

## Task 5: Sticky "Book an Appointment" floating CTA

**Files:**
- Create: `src/components/BookAppointmentFloat.jsx`
- Create: `src/components/BookAppointmentFloat.module.css`
- Modify: `src/app/(frontend)/layout.tsx` (mount the new component)

- [ ] **Step 1: Create `BookAppointmentFloat.jsx`**

Create `src/components/BookAppointmentFloat.jsx`:

```jsx
'use client'

import { Calendar } from 'lucide-react'
import styles from './BookAppointmentFloat.module.css'

const APPOINTMENT_URL = 'https://app.atidinricare.com/'

const BookAppointmentFloat = () => {
  return (
    <a
      href={APPOINTMENT_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.float}
      aria-label="Book an appointment"
      data-testid="book-appointment-float"
    >
      <Calendar size={18} aria-hidden="true" />
      <span className={styles.label}>Book an Appointment</span>
    </a>
  )
}

export default BookAppointmentFloat
```

- [ ] **Step 2: Create matching CSS module**

Create `src/components/BookAppointmentFloat.module.css`:

```css
.float {
  position: fixed;
  left: 50%;
  bottom: calc(24px + env(safe-area-inset-bottom, 0px));
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 22px;
  border-radius: 999px;
  background: var(--color-primary, #c17f6b);
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  text-decoration: none;
  box-shadow:
    0 6px 18px rgba(0, 0, 0, 0.25),
    0 2px 4px rgba(0, 0, 0, 0.15);
  z-index: 950; /* below modals (1000), above content */
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.float:hover,
.float:focus-visible {
  transform: translateX(-50%) translateY(-2px);
  box-shadow:
    0 10px 24px rgba(0, 0, 0, 0.3),
    0 3px 6px rgba(0, 0, 0, 0.18);
  background: var(--color-primary-hover, #d4967f);
}

.float:focus-visible {
  outline: 2px solid #ffffff;
  outline-offset: 3px;
}

.label {
  line-height: 1;
}

@media print {
  .float {
    display: none;
  }
}

@media (max-width: 420px) {
  .float {
    padding: 10px 16px;
    font-size: 0.88rem;
  }
}
```

Note: the existing codebase uses `#c17f6b` as the primary accent (see `ContactUs.module.css:73,121`). If `--color-primary` is not already defined in `globals.css`, the fallback in this CSS (`#c17f6b`) applies. If it is defined, the variable wins.

- [ ] **Step 3: Mount in the frontend layout**

Edit `src/app/(frontend)/layout.tsx`. Add the import near the top with the other component imports:

```tsx
import BookAppointmentFloat from '@/components/BookAppointmentFloat'
```

In the JSX return, add `<BookAppointmentFloat />` next to `<WhatsAppFloat />`:

```tsx
      <WhatsAppFloat />
      <BookAppointmentFloat />
```

- [ ] **Step 4: Visual smoke test**

```bash
npm run dev
```

Open http://localhost:3000 and verify the pill sits bottom-center, does not overlap the bottom-right WhatsApp float, clicks open `https://app.atidinricare.com/` in a new tab, and is visible on:
- `/`
- `/treatments/dental-implants`
- `/locations/hyderabad` (or any India location)
- `/about-us`
- `/contact-us`
- `/blog`

Resize to 375px width (Chrome devtools → iPhone SE) and confirm the pill is readable, not clipped, and sits above the bottom safe-area on mobile. Stop the dev server.

- [ ] **Step 5: Commit**

```bash
git add src/components/BookAppointmentFloat.jsx src/components/BookAppointmentFloat.module.css src/app/\(frontend\)/layout.tsx
git commit -m "feat(ui): sticky Book an Appointment floating CTA on every frontend page"
```

---

## Task 6: FAQ rewrite

**Files:**
- Modify: `src/components/FAQ.jsx` (`fallbackFaqs`)
- Modify: `src/seed/seed-faqs.ts` (`correctFAQs`)

- [ ] **Step 1: Replace `fallbackFaqs` in `FAQ.jsx`**

Replace the entire `fallbackFaqs` array at the top of `src/components/FAQ.jsx` (lines 7-71) with:

```jsx
const fallbackFaqs = [
  {
    question: 'Is Atidi only for NRI patients?',
    answer: [
      "Not at all — Atidi is designed for everyone.",
      'While we initially set out to simplify access to trusted, high-quality dental care for NRIs, we quickly recognized that the same challenges — finding reliable clinics, transparent pricing, and consistent quality — are faced by patients across India.',
      'Atidi was built to address these gaps, making dependable, world-class dental care accessible to anyone who values trust, transparency, and excellence.',
    ],
  },
  {
    question: 'Why Atidi?',
    answer: [
      "If you're an NRI, finding a good dental hospital during a short trip to India can be difficult. Online reviews aren't always reliable, so getting a trusted recommendation matters.",
      'Atidi helps you connect with top-quality dental hospitals in India that follow international standards. We take care of everything — booking appointments, coordinating with clinics, keeping your records, and even follow-up care in the USA.',
      "With Atidi, you don't have to worry about being overcharged or getting unnecessary treatments. We offer fixed, transparent pricing with no hidden fees, and our care managers make sure you receive the right treatment.",
      'You also get 24/7 free teleconsultation with our dentists for any questions.',
    ],
  },
  {
    question: 'How do you ensure the quality of treatment?',
    answer: [
      'We carefully vet every partner clinic for infrastructure, hygiene protocols, and equipment standards to ensure a safe and reliable environment.',
      'Each procedure is overseen by our dedicated care managers, who monitor treatment quality and patient experience throughout the process.',
      'All treatments are performed by MDS-qualified dentists with advanced specialization, using high-quality, standardized materials that meet international benchmarks.',
    ],
  },
  {
    question: 'What happens if I need follow-up care after I return?',
    answer: [
      'All your dental records are securely digitized and accessible across our network of partner clinics, allowing you to visit any nearby affiliated clinic in the U.S. for continued care.',
      'We offer same-day appointments for our patients whenever possible, ensuring timely support.',
      'In addition, you have access to our 24/7 free teleconsultation service, where you can connect with a qualified dentist for follow-ups or any additional questions.',
    ],
  },
  {
    question: 'How does pricing compare internationally?',
    answer: [
      'Dental care in the United States can cost 70–90% more than equivalent treatments in India, without a corresponding difference in clinical outcomes.',
      'At our partner clinics, pricing is standardized, transparent, and determined by the quality of materials and clinical requirements. Each treatment plan is carefully overseen by our dedicated care managers to ensure absolute fairness, with no unnecessary procedures or inflated costs.',
      'There are no hidden charges — only clear, upfront pricing. Even after accounting for travel, most patients realize significant savings while receiving world-class care.',
    ],
  },
  {
    question: 'How long do treatments usually take?',
    answer: [
      'Treatment timelines vary depending on the complexity of the procedure. Many routine treatments can be completed within a single day, while more advanced procedures — such as dental implants or full-mouth rehabilitation — may take between 1 to 7 days, occasionally followed by a scheduled review visit.',
      'Our team works closely with you to design an efficient treatment plan, often allowing you to seamlessly combine care with travel.',
      'A detailed, personalized timeline is shared with you during your initial consultation, ensuring complete clarity before you begin.',
    ],
  },
  {
    question: 'Do you help coordinate everything for my visit?',
    answer: [
      'Yes — every aspect of your journey is thoughtfully coordinated for a seamless experience. Once your appointment is confirmed, you are assigned a dedicated care manager (a qualified dentist) who serves as your single point of contact throughout your treatment.',
      'Your care manager works closely with the clinic to ensure priority scheduling and a smooth, wait-free arrival. They also oversee each stage of your treatment to maintain the highest standards of quality and consistency.',
      'Our team remains available to you 24/7 via phone, email, or WhatsApp, ensuring you have continuous support at every step of your journey.',
    ],
  },
];
```

- [ ] **Step 2: Mirror the changes in `seed-faqs.ts`**

Replace the `correctFAQs` array in `src/seed/seed-faqs.ts` (lines 27-98) with:

```ts
const correctFAQs = [
  {
    question: 'Is Atidi only for NRI patients?',
    answer: [
      'Not at all — Atidi is designed for everyone.',
      'While we initially set out to simplify access to trusted, high-quality dental care for NRIs, we quickly recognized that the same challenges — finding reliable clinics, transparent pricing, and consistent quality — are faced by patients across India.',
      'Atidi was built to address these gaps, making dependable, world-class dental care accessible to anyone who values trust, transparency, and excellence.',
    ],
    order: 1,
  },
  {
    question: 'Why Atidi?',
    answer: [
      "If you're an NRI, finding a good dental hospital during a short trip to India can be difficult. Online reviews aren't always reliable, so getting a trusted recommendation matters.",
      'Atidi helps you connect with top-quality dental hospitals in India that follow international standards. We take care of everything — booking appointments, coordinating with clinics, keeping your records, and even follow-up care in the USA.',
      "With Atidi, you don't have to worry about being overcharged or getting unnecessary treatments. We offer fixed, transparent pricing with no hidden fees, and our care managers make sure you receive the right treatment.",
      'You also get 24/7 free teleconsultation with our dentists for any questions.',
    ],
    order: 2,
  },
  {
    question: 'How do you ensure the quality of treatment?',
    answer: [
      'We carefully vet every partner clinic for infrastructure, hygiene protocols, and equipment standards to ensure a safe and reliable environment.',
      'Each procedure is overseen by our dedicated care managers, who monitor treatment quality and patient experience throughout the process.',
      'All treatments are performed by MDS-qualified dentists with advanced specialization, using high-quality, standardized materials that meet international benchmarks.',
    ],
    order: 3,
  },
  {
    question: 'What happens if I need follow-up care after I return?',
    answer: [
      'All your dental records are securely digitized and accessible across our network of partner clinics, allowing you to visit any nearby affiliated clinic in the U.S. for continued care.',
      'We offer same-day appointments for our patients whenever possible, ensuring timely support.',
      'In addition, you have access to our 24/7 free teleconsultation service, where you can connect with a qualified dentist for follow-ups or any additional questions.',
    ],
    order: 4,
  },
  {
    question: 'How does pricing compare internationally?',
    answer: [
      'Dental care in the United States can cost 70–90% more than equivalent treatments in India, without a corresponding difference in clinical outcomes.',
      'At our partner clinics, pricing is standardized, transparent, and determined by the quality of materials and clinical requirements. Each treatment plan is carefully overseen by our dedicated care managers to ensure absolute fairness, with no unnecessary procedures or inflated costs.',
      'There are no hidden charges — only clear, upfront pricing. Even after accounting for travel, most patients realize significant savings while receiving world-class care.',
    ],
    order: 5,
  },
  {
    question: 'How long do treatments usually take?',
    answer: [
      'Treatment timelines vary depending on the complexity of the procedure. Many routine treatments can be completed within a single day, while more advanced procedures — such as dental implants or full-mouth rehabilitation — may take between 1 to 7 days, occasionally followed by a scheduled review visit.',
      'Our team works closely with you to design an efficient treatment plan, often allowing you to seamlessly combine care with travel.',
      'A detailed, personalized timeline is shared with you during your initial consultation, ensuring complete clarity before you begin.',
    ],
    order: 6,
  },
  {
    question: 'Do you help coordinate everything for my visit?',
    answer: [
      'Yes — every aspect of your journey is thoughtfully coordinated for a seamless experience. Once your appointment is confirmed, you are assigned a dedicated care manager (a qualified dentist) who serves as your single point of contact throughout your treatment.',
      'Your care manager works closely with the clinic to ensure priority scheduling and a smooth, wait-free arrival. They also oversee each stage of your treatment to maintain the highest standards of quality and consistency.',
      'Our team remains available to you 24/7 via phone, email, or WhatsApp, ensuring you have continuous support at every step of your journey.',
    ],
    order: 7,
  },
]
```

- [ ] **Step 3: Re-seed FAQs against the dev DB**

```bash
npx tsx src/seed/seed-faqs.ts
```

Expected: prints deletion of old FAQs and creation of 7 new FAQs with the new questions.

- [ ] **Step 4: Visual smoke test**

```bash
npm run dev
```

Open http://localhost:3000 and scroll to FAQ. Confirm: 7 questions, first one is "Is Atidi only for NRI patients?", the old "How do you ensure international-standard dental care?" is gone. Each answer expands to show the new bullet copy. Stop the dev server.

- [ ] **Step 5: Commit**

```bash
git add src/components/FAQ.jsx src/seed/seed-faqs.ts
git commit -m "feat(content): rewrite FAQs per KTree corrections, drop duplicate international-standard question"
```

---

## Task 7: HowItWorks "Sign Up" copy

**Files:**
- Modify: `src/components/HowItWorks.jsx:13`

- [ ] **Step 1: Update the Sign Up description**

In `src/components/HowItWorks.jsx` line 13, change:

```jsx
    description: 'Download the app & create your profile in seconds.',
```

to:

```jsx
    description: 'Download the "Atidi Customer" app & create your profile in seconds.',
```

- [ ] **Step 2: Commit**

```bash
git add src/components/HowItWorks.jsx
git commit -m "feat(content): update Sign Up copy to reference Atidi Customer app"
```

---

## Task 8: Remove "empaneled clinic" line from LocationDetail

**Files:**
- Modify: `src/components/LocationDetail.jsx` (lines 43-55 — India branch of `quickInfo`)

- [ ] **Step 1: Delete the empaneled-clinic render block**

In `src/components/LocationDetail.jsx` around lines 43-49, remove the entire India branch that renders the empaneled count. Replace the whole `.quickInfo` block so it only keeps the non-India (USA follow-up) branch:

```jsx
      {/* Quick Info */}
      {!isIndia && (
        <div className={styles.quickInfo}>
          <div className={styles.infoItem}>
            <Clock size={18} />
            <span>Same Day Appointment Guarantee</span>
          </div>
        </div>
      )}
```

Rationale: there is no remaining content to show in the India branch, so we skip the wrapper entirely for India locations.

- [ ] **Step 2: Remove the now-unused `MapPin` import if unused elsewhere in the file**

Check whether `MapPin` is still referenced in `LocationDetail.jsx`. If `MapPin` appears nowhere else, remove it from the lucide-react import line. If still used in any other block, leave it.

- [ ] **Step 3: Smoke test**

```bash
npm run dev
```

Open http://localhost:3000 and click a non-featured India location (e.g. Anantapur) to open the slide panel. Confirm no "1 empaneled clinic in ..." line. Check a USA location still shows the "Same Day Appointment Guarantee" line. Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add src/components/LocationDetail.jsx
git commit -m "feat(ui): remove empaneled clinic count line from LocationDetail"
```

---

## Task 9: Contact Us — India Office + US Office

**Files:**
- Modify: `src/components/ContactUsClient.jsx` (rename existing card, add second card)
- Modify: `src/components/ContactUs.module.css` (grid handles 5 cards cleanly)

- [ ] **Step 1: Rename the existing address card to "India Office"**

In `src/components/ContactUsClient.jsx` around line 49, change:

```jsx
            <h3 className={styles.cardTitle}>Office Address</h3>
            <p className={styles.cardText}>
              ATIDI NRIES CARE PRIVATE LIMITED
            </p>
```

to:

```jsx
            <h3 className={styles.cardTitle}>India Office</h3>
            <p className={styles.cardText}>
              ATIDI NRIES CARE PRIVATE LIMITED
            </p>
```

- [ ] **Step 2: Add a sibling "US Office" card**

Insert a new `<motion.div>` block immediately after the India Office card (after its closing `</motion.div>`):

```jsx
          {/* US Office */}
          <motion.div
            className={styles.card}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className={styles.cardIcon}>
              <MapPin size={24} />
            </div>
            <h3 className={styles.cardTitle}>US Office</h3>
            <p className={styles.cardText}>
              ATIDI NRIES CARE
            </p>
            <p className={styles.cardDetail}>
              100 Kimball Street,
              <br />
              Malden, MA 02148,
              <br />
              USA
            </p>
          </motion.div>
```

Bump the `transition.delay` on the subsequent Phone/Email/WhatsApp cards by `0.05` each so the staggered entrance still feels natural (0.25, 0.35, 0.45). Find `transition={{ duration: 0.6, delay: 0.2 }}` on the Phone card → change to `0.25`. Email card `0.3` → `0.35`. WhatsApp card `0.4` → `0.45`.

- [ ] **Step 3: Update grid to handle 5 cards**

In `src/components/ContactUs.module.css`, replace:

```css
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}
```

with:

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}
```

The `@media (max-width: 768px)` override already collapses to a single column — leave it alone.

- [ ] **Step 4: Smoke test**

```bash
npm run dev
```

Open http://localhost:3000/contact-us. Confirm:
- India Office card appears with the existing Hyderabad address.
- US Office card appears with the new Malden, MA address.
- Five cards total. On desktop (>=1100px) the grid is roughly 3+2 or 2+2+1 depending on viewport; on tablet (~768-1099px) 2 per row; on mobile single column.

Stop dev server.

- [ ] **Step 5: Commit**

```bash
git add src/components/ContactUsClient.jsx src/components/ContactUs.module.css
git commit -m "feat(content): add US Office address card to Contact Us"
```

---

## Task 10: Hero subheadline + US-states stat defaults

**Files:**
- Modify: `src/components/HomePageClient.jsx` (fallback strings)
- Modify: `src/seed/seed-globals.ts` (seeded HeroContent)
- Modify: `src/seed/seed-pages.ts` (homepage block referencing the same subheadline)

- [ ] **Step 1: Update fallback subheadline and US-states default in `HomePageClient.jsx`**

Around line 25, replace:

```jsx
  const subheadline = heroContent?.subheadline || "World-class treatment in India with seamless follow-up care when you return to the USA. US costs 300-500% more — without compromising quality."
```

with:

```jsx
  const subheadline = heroContent?.subheadline || "ATIDI NRI CARE connects NRIs to verified top premium dental hospitals in India & USA. We provide world-class treatment in India with seamless follow-up care when you return to the USA. At Atidi dental treatments are 70–90% cheaper than in USA without compromising quality."
```

Around line 28-32, replace the default stats `{ value: '8', label: 'US States Covered' }` with `{ value: '10', label: 'US States Covered' }`.

- [ ] **Step 2: Update seeded HeroContent global**

In `src/seed/seed-globals.ts` line 133 (`subheadline: 'World-class treatment ...'`), replace the string with the same new subheadline (use the em-dash and the updated wording exactly as above — `–` for en-dash in `70–90%` or a literal `–`). Also find the `stats` array seeded for HeroContent and change the US States Covered value from `'8'` to `'10'`.

If the `stats` block is not present in `seed-globals.ts`, skip the stats change here — it lives only in the admin and was already updated by the migration in Task 2.

- [ ] **Step 3: Update seeded homepage page reference**

In `src/seed/seed-pages.ts` line 43 (same old subheadline), replace with the new string.

- [ ] **Step 4: Smoke test**

```bash
npm run dev
```

Open http://localhost:3000. Confirm:
- Hero subheadline reads the new text.
- Hero stats strip shows `10  US States Covered`.

Stop dev server.

- [ ] **Step 5: Commit**

```bash
git add src/components/HomePageClient.jsx src/seed/seed-globals.ts src/seed/seed-pages.ts
git commit -m "feat(content): new hero subheadline and bump US States Covered to 10"
```

---

## Task 11: Treatments seed — add `opensInNewTab` flags (+ video stubs kept out)

**Files:**
- Modify: `src/seed/treatments-data.ts` (add `opensInNewTab` to each entry)
- Modify: `src/seed/index.ts` (pass `opensInNewTab` through when creating treatments, if not already generic)

- [ ] **Step 1: Add `opensInNewTab` field to the seed interface**

At the top of `src/seed/treatments-data.ts`, extend the `TreatmentSeedData` interface:

```ts
export interface TreatmentSeedData {
  id: string
  name: string
  shortName: string
  category: string
  icon: string
  tagline: string
  description: string
  usaPrice: { min: number; max: number }
  indiaPrice: { min: number; max: number }
  savingsPercent: number
  procedure: Array<{ step: number; title: string; description: string }>
  materials: string[]
  faqs: Array<{ question: string; answer: string }>
  featured: boolean
  opensInNewTab: boolean
}
```

- [ ] **Step 2: Set `opensInNewTab` per entry**

For these 5 slugs, set `opensInNewTab: true`:
- `dental-implants`
- `root-canal`
- `invisalign` (or whichever slug is present for Invisalign/Aligners)
- `wisdom-teeth` (or the Wisdom Teeth Removal slug present)
- `digital-smile-design`

For every other treatment in the array, set `opensInNewTab: false`.

Pattern for each entry: add the field at the bottom of the object right after `featured: true,`:

```ts
    featured: true,
    opensInNewTab: true, // or false
  },
```

Check slug spellings: grep `src/seed/treatments-data.ts` for `id: '` and mark each:

```bash
grep -n "id: '" src/seed/treatments-data.ts
```

Note the exact id for each record and apply the `true`/`false` assignment accordingly.

- [ ] **Step 3: Pipe it through `src/seed/index.ts`**

Open `src/seed/index.ts`. Find where each treatment is created via `payload.create({ collection: 'treatments', data: { ... } })`. If the spread is `...data` with the full seed shape, `opensInNewTab` will pass through automatically. If the object is built explicitly field by field, add `opensInNewTab: treatment.opensInNewTab` to the data object.

- [ ] **Step 4: Commit**

```bash
git add src/seed/treatments-data.ts src/seed/index.ts
git commit -m "feat(seed): add opensInNewTab flag to treatment seeds matching migration"
```

---

## Task 12: Locations seed — `opensInNewTab: true` on all

**Files:**
- Modify: `src/seed/locations-data.ts`
- Modify: `src/seed/index.ts` (if explicit field mapping is used)

- [ ] **Step 1: Extend the interface**

At the top of `src/seed/locations-data.ts`, add `opensInNewTab: boolean` to whatever interface the file exports (e.g. `LocationSeedData`).

- [ ] **Step 2: Add `opensInNewTab: true` to every location entry**

For each object in the exported locations array, append `opensInNewTab: true,` at the bottom next to `featured:` (or wherever fields end).

- [ ] **Step 3: Pipe through seed**

In `src/seed/index.ts`, if location creation uses explicit field mapping, add `opensInNewTab: location.opensInNewTab`. If it spreads the whole object, no change required.

- [ ] **Step 4: Commit**

```bash
git add src/seed/locations-data.ts src/seed/index.ts
git commit -m "feat(seed): default opensInNewTab=true on all location seeds"
```

---

## Task 13: Playwright spec — website corrections

**Files:**
- Create: `tests/e2e/website-corrections.spec.ts`

- [ ] **Step 1: Write the failing spec**

Create `tests/e2e/website-corrections.spec.ts`:

```ts
import { test, expect } from '@playwright/test'

const BOOK_URL = 'https://app.atidinricare.com/'

test.describe('Website corrections v2', () => {
  test('sticky Book Appointment CTA is present on every frontend page', async ({ page }) => {
    const paths = ['/', '/treatments/dental-implants', '/locations/hyderabad', '/about-us', '/contact-us', '/blog']
    for (const path of paths) {
      await page.goto(path)
      const cta = page.getByTestId('book-appointment-float')
      await expect(cta, `CTA should be visible on ${path}`).toBeVisible()
      await expect(cta).toHaveAttribute('href', BOOK_URL)
      await expect(cta).toHaveAttribute('target', '_blank')
    }
  })

  test('US States Covered stat reads 10', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('10', { exact: true }).first()).toBeVisible()
    await expect(page.getByText('US States Covered')).toBeVisible()
  })

  test('Sign Up copy references the Atidi Customer app', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Download the "Atidi Customer" app')).toBeVisible()
  })

  test('FAQ lists the new opening question', async ({ page }) => {
    await page.goto('/#faq')
    await expect(page.getByRole('button', { name: /Is Atidi only for NRI patients\?/i })).toBeVisible()
    // The removed duplicate must not appear.
    await expect(page.getByRole('button', { name: /How do you ensure international-standard dental care\?/i })).toHaveCount(0)
  })

  test('US Office card on Contact Us shows the Malden address', async ({ page }) => {
    await page.goto('/contact-us')
    await expect(page.getByRole('heading', { name: 'India Office' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'US Office' })).toBeVisible()
    await expect(page.getByText('100 Kimball Street,')).toBeVisible()
    await expect(page.getByText('Malden, MA 02148,')).toBeVisible()
  })

  test('featured treatment card opens /treatments/[slug] in a new tab', async ({ page, context }) => {
    await page.goto('/')
    // Scroll to the treatments section to ensure the card is in view.
    await page.locator('section#treatments').scrollIntoViewIfNeeded()

    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      page.getByRole('heading', { name: 'Dental Implants' }).first().click(),
    ])
    await newPage.waitForLoadState('domcontentloaded')
    expect(newPage.url()).toContain('/treatments/dental-implants')
    await newPage.close()
  })

  test('non-featured treatment card opens slide panel, not a new tab', async ({ page }) => {
    await page.goto('/')
    await page.locator('section#treatments').scrollIntoViewIfNeeded()

    // Pick a non-featured treatment that is guaranteed to be in the first 20 cards
    // (the grid shows 20 by default; "Dental Veneers" sorts alphabetically into the first 20
    // and is not in the FEATURED_TREATMENT_SLUGS list).
    const pagePromise = page.context().waitForEvent('page', { timeout: 1500 }).catch(() => null)
    await page.getByRole('heading', { name: 'Dental Veneers' }).first().click()
    const popup = await pagePromise
    expect(popup, 'clicking a non-featured treatment must not open a new tab').toBeNull()

    // The slide panel should be visible with the treatment name in it.
    await expect(page.getByText('Dental Veneers')).toBeVisible()
  })

  test('empaneled clinic line is removed from India LocationDetail', async ({ page }) => {
    await page.goto('/locations/hyderabad')
    await expect(page.getByText(/empaneled clinic/i)).toHaveCount(0)
  })
})
```

- [ ] **Step 2: Run the spec and watch it pass against the migrated dev DB**

```bash
npm run test:e2e -- tests/e2e/website-corrections.spec.ts --reporter=line
```

Expected: all tests pass. If any fail:
- Look at which assertion failed.
- Confirm the underlying task (2–10) was committed and the dev data reflects it.
- Re-run the Playwright test after fixing.

- [ ] **Step 3: Run the full test suite to make sure nothing regressed**

```bash
npm run test:e2e -- --reporter=line
```

Expected: previous pass count + 8 new tests, all green. If an old test fails because it asserted the old copy (e.g. "8 US States Covered", old hero subheadline, old FAQ question), update the old test to match the new copy and include that change in the commit.

- [ ] **Step 4: Commit**

```bash
git add tests/e2e/website-corrections.spec.ts
# include any old-spec fixups if they were needed
git commit -m "test(e2e): cover website corrections v2 — CTA, FAQ, addresses, new-tab routing"
```

---

## Task 14: Final verification and changelog note

**Files:**
- None new. Verification only.

- [ ] **Step 1: Run the full test suite once more**

```bash
npm run test:e2e -- --reporter=line
```

Expected: all tests pass (original 96 + 8 new = 104, assuming no old tests were rewritten; otherwise match the new baseline).

- [ ] **Step 2: Build the app to catch type errors**

```bash
npm run build
```

Expected: clean build. If Next.js complains about any missing fields, trace back to the collection/adapter change and fix.

- [ ] **Step 3: Manual end-to-end walkthrough**

```bash
npm run dev
```

Click through:
- Home: sticky CTA visible, hero subheadline new, 10 US States Covered, all 24 treatments load, Dental Implants opens new tab, Teeth Whitening opens slide panel, Invisalign/DSD/Root Canal/Wisdom Teeth open new tabs, search bar honours the flag for both treatments and locations.
- Any location card → opens `/locations/<slug>` in a new tab.
- Contact Us: both India Office + US Office cards visible.
- FAQ: new 7 questions in new order, no "international-standard" duplicate.
- HowItWorks: "Download the 'Atidi Customer' app ..." copy.
- Open one of the 5 featured treatment pages → videos render the new YouTube URLs (Dental Implants should have 2 videos; Root Canal should have 2; others 1).

Stop dev server.

- [ ] **Step 4: Verify the final branch state**

```bash
git log --oneline dev..HEAD
git status
```

Expected: a series of focused commits (one per task), clean working tree (apart from pre-existing untracked items).

- [ ] **Step 5: Hand off for review**

No further commit required in this plan. The branch `feat/website-corrections-v2` is ready for a pull request against `dev` with the design doc + this plan linked in the PR description.

---

## Rollback plan

If production shows regressions after deploy:

1. Revert the PR via GitHub "Revert" button (creates a revert commit on `dev`).
2. Run `npx payload migrate:down` once to drop the `opens_in_new_tab` column. Note the `down` handler only removes the column, not the content updates — HeroContent subheadline and videos would remain on the new values. Rolling those back requires re-seeding or manual admin edit.
3. Deploy the revert.

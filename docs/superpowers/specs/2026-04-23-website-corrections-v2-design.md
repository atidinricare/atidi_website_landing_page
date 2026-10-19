# Website Corrections v2 — Design

**Date:** 2026-04-23
**Branch:** `feat/website-corrections-v2` (off `dev`)
**Source:** KTree client PDF ("Website corrections 1.2") + two verbal additions (sticky Book Appointment CTA, open-in-new-tab behavior, US address).

---

## 1. Goals

Apply a batch of client corrections to the Atidi NRI Care public site:

- Rewrite hero subheadline and several FAQ entries.
- Publish all 24 treatments and all 33 locations (currently many are drafts).
- Let the admin control — per treatment and per location — whether a card click opens a dedicated detail page in a new tab, or the existing SlidePanel popup on the homepage.
- Replace client-supplied YouTube videos on 5 specific treatments.
- Small copy fixes (US states stat 8 → 10, Sign Up copy, remove "empaneled clinic" line).
- Add a sticky "Book an Appointment" floating button, present on every frontend page.
- Add the US office address to the Contact Us page.

---

## 2. Non-goals

- No redesign of treatment/location detail pages.
- No changes to `/treatments/[slug]` or `/locations/[slug]` page structure — those routes remain as they are and continue to be accessible by direct URL regardless of the `opensInNewTab` flag.
- No changes to seed scripts beyond data-value updates (no new seed files).
- No changes to analytics/tracking.
- No changes to the `featured` flag semantics.

---

## 3. Data-model change

### 3.1 New field

Add a single boolean field `opensInNewTab` to both the `Treatments` and `Locations` Payload collections.

```
opensInNewTab: boolean
  default: true
  admin-editable: yes (sidebar or main column next to `featured` / `status`)
  description (admin): "If on, clicking this card opens the dedicated detail page
                        in a new tab. If off, clicking opens the side panel on the
                        home page."
```

Behavior contract:
- `true` — clicking the card on homepage / search dropdown calls `window.open('/treatments/<slug>', '_blank', 'noopener,noreferrer')` (or `/locations/<slug>`).
- `false` — clicking the card opens the existing `SlidePanel` with `TreatmentDetail` / `LocationDetail`.

### 3.2 Migration

New file: `src/migrations/20260423_opens_in_new_tab.ts`.

The migration performs four operations in a single transaction:

1. **Schema:** add `opens_in_new_tab` boolean column to `treatments` and `locations` tables, default `true`, not nullable.
2. **Publish:** set `status = 'published'` on all rows in both tables (no-op for rows already published).
3. **Seed flag values:**
   - Treatments: `opens_in_new_tab = true` for slugs `dental-implants`, `digital-smile-design`, `invisalign`, `invisalign-aligners`, `root-canal`, `root-canal-treatment`, `wisdom-teeth`, `wisdom-teeth-removal`. For all other treatment rows → `false`. (Matcher uses the slug values actually present in the DB; both potential slug spellings are handled for robustness.)
   - Locations: all rows → `true`.
4. **HeroContent global update:** update the stored `HeroContent` global — replace the US-states stat value from `8` to `10`, and replace the `subheadline` with the new string from §6.1. Done via `payload.updateGlobal({ slug: 'hero-content', data: { ... } })` inside the migration, or a direct SQL update on the globals table — whichever is cleaner given Payload's global storage model. Also replace the YouTube video URLs on the 5 treatments (see §6.7) in the same migration so the change takes effect without re-seeding.

The migration is registered in `src/migrations/index.ts` after the current `20260402_set_status_published.ts`.

### 3.3 Seed file updates

`src/seed/treatments-data.ts` gains an `opensInNewTab: boolean` on each treatment entry, matching the values the migration sets. This keeps `npm run seed` idempotent with the migrated DB state.

`src/seed/locations-data.ts` gains `opensInNewTab: true` on all entries.

---

## 4. Click-routing change

### 4.1 Adapter output

`src/lib/adapters.ts`:
- `adaptTreatment(doc)` adds `opensInNewTab: doc.opensInNewTab ?? true` to the returned object.
- `adaptLocation(doc)` does the same.

### 4.2 Homepage handlers

`src/components/HomePageClient.jsx`:

```js
const handleSelectTreatment = (treatment) => {
  if (treatment.opensInNewTab) {
    window.open(`/treatments/${treatment.id}`, '_blank', 'noopener,noreferrer')
    return
  }
  setSelectedTreatment(treatment)
  setActivePanel('treatment')
}

const handleSelectLocation = (location) => {
  if (location.opensInNewTab) {
    window.open(`/locations/${location.id}`, '_blank', 'noopener,noreferrer')
    return
  }
  setSelectedLocation(location)
  setActivePanel('location')
}
```

`treatment.id` / `location.id` already hold the slug today (see `generateStaticParams` in `/treatments/[slug]/page.tsx`). No change needed to routing.

### 4.3 Search bar

`src/components/SearchBar.jsx` `handleSelect` receives the item and type and delegates to `onSelectTreatment` / `onSelectLocation` props — which are the same branching handlers above. No change needed inside `SearchBar` itself beyond confirming it passes the item through.

### 4.4 Other entry points to audit

- `src/components/Treatments.jsx` — calls `onSelectTreatment(treatment)` from card click; inherits the new behavior via the handler prop. No component change.
- `src/components/Locations.jsx` — same pattern, no change.
- `src/components/LocationCard.jsx`, `src/components/TreatmentCard.jsx` — confirm they also go through the same handler; if they render links directly, align them with the flag.

### 4.5 Homepage grid content

Homepage `<Treatments>` today is passed `featuredTreatments` (all 24 are `featured: true` in the seed, but only 5 are currently `published`). After the migration publishes all 24, `getTreatments()` returns all 24, so the homepage grid naturally shows all 24 without a code change. The `featured` flag semantics remain unchanged.

---

## 5. Sticky "Book an Appointment" CTA

New component: `src/components/BookAppointmentFloat.jsx` (+ `BookAppointmentFloat.module.css`).

**Layout & style:**
- `position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%)`.
- Rounded pill (border-radius: 999px), horizontal padding ~24px, vertical padding ~12px.
- Dark background with primary-orange accent, matching `.btn.btn-primary` look (read actual colors from `globals.css` when implementing — do not hardcode a new palette).
- `Calendar` icon from lucide-react + text "Book an Appointment".
- `target="_blank"`, `rel="noopener noreferrer"`, URL `https://app.atidinricare.com/`.
- `padding-bottom: env(safe-area-inset-bottom)` wrapper to clear mobile notches.
- `z-index` between content and the WhatsApp float (both visible, no overlap at bottom because WhatsApp float is bottom-right and this is bottom-center).
- Not shown on print.

**Mount point:** `src/app/(frontend)/layout.tsx` — rendered alongside `<WhatsAppFloat />`. This gives it coverage on every frontend page automatically.

**Accessibility:** `aria-label="Book an appointment"`, focus-visible ring, keyboard-activatable.

---

## 6. Content changes

### 6.1 Hero subheadline

File: `src/components/HomePageClient.jsx` (fallback string), `src/seed/seed-globals.ts`, `src/seed/seed-pages.ts`.

New copy (verbatim from the PDF, item 1):
> ATIDI NRI CARE connects NRIs to verified top premium dental hospitals in India & USA. We provide world-class treatment in India with seamless follow-up care when you return to the USA. At Atidi dental treatments are 70–90% cheaper than in USA without compromising quality.

### 6.2 US States Covered stat

Change default from `8` to `10` in `src/components/HomePageClient.jsx` and update the seeded value in `src/seed/seed-globals.ts`. **The live DB value in the `HeroContent` global is updated by the migration (§3.2 step 4)** so the change takes effect on deploy without a re-seed.

### 6.3 Sign Up copy

File: `src/components/HowItWorks.jsx:13`.

New: `Download the "Atidi Customer" app & create your profile in seconds.`

### 6.4 Empaneled clinic line

File: `src/components/LocationDetail.jsx:47`. Delete the line entirely (remove the surrounding `div` wrapper if it holds nothing else).

### 6.5 FAQ rewrite

Files: `src/components/FAQ.jsx` (`fallbackFaqs`), `src/seed/seed-faqs.ts`.

Drop the current "How do you ensure international-standard dental care?" entry (duplicate of the quality question). New ordered list:

1. **Is Atidi only for NRI patients?** — *"Not at all—Atidi is designed for everyone. While we initially set out to simplify access to trusted, high-quality dental care for NRIs, we quickly recognized that the same challenges—finding reliable clinics, transparent pricing, and consistent quality—are faced by patients across India. Atidi was built to address these gaps, making dependable, world-class dental care accessible to anyone who values trust, transparency, and excellence."*
2. **Why Atidi?** — (copy from PDF item 9; four bullets summarising trust, coordination, pricing, 24/7 teleconsult)
3. **How do you ensure the quality of treatment?** — (copy from PDF item 10; three bullets on vetting, care managers, MDS-qualified dentists)
4. **What happens if I need follow-up care after I return?** — (copy from PDF item 12; bullets on digitized records, US partner clinics, same-day appointments, 24/7 teleconsult)
5. **How does pricing compare internationally?** — (copy from PDF item 13; bullets on 70–90% savings, standardized pricing, no hidden fees)
6. **How long do treatments usually take?** — (copy from PDF item 14; routine within a day, advanced 1–7 days, personalized timeline)
7. **Do you help coordinate everything for my visit?** — (copy from PDF item 15; dedicated care manager, priority scheduling, 24/7 support)

Each answer is converted to the existing bullet-array shape (`answer: string[]`). For seed-faqs.ts (rich text), the same bullets are emitted as list items.

### 6.6 US office address on Contact Us

File: `src/components/ContactUsClient.jsx`.

Rename the existing "Office Address" card to "India Office" and add a sibling card "US Office":

> **US Office**
> ATIDI NRIES CARE
> 100 Kimball Street,
> Malden, MA 02148,
> USA

Same `MapPin` icon, same card component, same animation timing shifted by one index. Total cards in the grid become five — verify grid layout still looks balanced at the existing breakpoints; if not, adjust the grid template in `ContactUs.module.css` to `repeat(auto-fit, minmax(280px, 1fr))` or equivalent.

### 6.7 Treatment videos

File: `src/seed/treatments-data.ts` — update the `videos` array (or equivalent) for these 5 treatments, replacing all existing entries:

| Treatment | New video URLs |
|-----------|----------------|
| Dental Implants | `https://youtube.com/shorts/2ZRWYZ59TYg`, `https://youtu.be/D788vZWD7Mc` |
| Digital Smile Design | `https://youtu.be/nKjVUnQrt70` |
| Root Canal Treatment | `https://youtu.be/P3BJ6jR-_cI`, `https://youtu.be/4KbU1EG_6QQ` |
| Invisalign / Aligners | `https://youtu.be/Cu1Cz3lAcwI` |
| Wisdom Teeth Removal | `https://youtu.be/_rmv3QFFHQk` |

The existing `TreatmentDetail` video embedder already parses YouTube watch URLs, youtu.be short-links, and `/shorts/` URLs via the regex at `TreatmentDetail.jsx:17`, so no embedder change is needed.

The same migration (§3.2 step 4) writes these new video URLs directly onto the 5 treatment rows in the DB, so the change takes effect without a full re-seed.

---

## 7. File inventory

**New files**
- `src/components/BookAppointmentFloat.jsx`
- `src/components/BookAppointmentFloat.module.css`
- `src/migrations/20260423_opens_in_new_tab.ts`
- `tests/e2e/website-corrections.spec.ts`
- `docs/superpowers/specs/2026-04-23-website-corrections-v2-design.md` (this file)

**Modified files**
- `src/collections/Treatments.ts` — add `opensInNewTab` field
- `src/collections/Locations.ts` — add `opensInNewTab` field
- `src/migrations/index.ts` — register new migration
- `src/lib/adapters.ts` — pass `opensInNewTab` through
- `src/components/HomePageClient.jsx` — click handlers, hero subheadline, stat default
- `src/components/SearchBar.jsx` — confirm pass-through (minimal or no change)
- `src/components/HowItWorks.jsx` — Sign Up copy
- `src/components/LocationDetail.jsx` — remove empaneled line
- `src/components/FAQ.jsx` — new `fallbackFaqs` content
- `src/components/ContactUsClient.jsx` — India Office / US Office cards
- `src/components/ContactUs.module.css` — grid adjustment if needed
- `src/app/(frontend)/layout.tsx` — mount `<BookAppointmentFloat />`
- `src/seed/treatments-data.ts` — `opensInNewTab` + new videos on 5 entries
- `src/seed/locations-data.ts` — `opensInNewTab: true` on all entries (if file exists)
- `src/seed/seed-globals.ts` — hero subheadline, US states = 10
- `src/seed/seed-pages.ts` — hero subheadline (matching)
- `src/seed/seed-faqs.ts` — rewritten FAQ set

---

## 8. Testing plan

### 8.1 Automated (Playwright)

New spec `tests/e2e/website-corrections.spec.ts`:

- **Sticky CTA presence:** visit `/`, `/treatments/dental-implants`, `/contact-us`, `/about-us`, `/blog` — assert `a[aria-label="Book an appointment"]` is visible on each and has `target="_blank"` and the configured URL.
- **New-tab vs slide-panel routing:** on `/`, intercept `window.open`, click the Dental Implants card → expect `window.open` called with `/treatments/dental-implants`. Click a non-featured treatment (e.g., `teeth-whitening`) → expect `window.open` NOT called and the SlidePanel visible.
- **US address present:** visit `/contact-us`, assert the `100 Kimball Street` text appears.
- **Hero stat:** visit `/`, assert `10` appears next to "US States Covered".
- **Sign Up copy:** visit `/`, assert the updated HowItWorks copy appears.
- **Empaneled line gone:** open a location detail (via slide panel or direct page), assert no text matching `/empaneled/i` is present.

### 8.2 Regression

Full existing Playwright suite (96 tests) must continue to pass. Any test that previously asserted the 8-states-covered stat or old FAQ copy gets updated in the same PR.

### 8.3 Manual

- Dev server (`npm run dev`), click through homepage — verify grid shows all 24 treatments, search dropdown shows all 24, featured 5 open in new tab, other 19 open in slide panel.
- Click several location cards — all open in new tab.
- Sticky CTA visible and clickable on every page, does not overlap critical content on mobile (375px × 667px and 414px × 896px viewports).
- FAQ renders the new set; expanding each shows the new bullet copy.
- Contact Us shows both India Office and US Office cards; grid layout holds up at ≥768px and <768px.

---

## 9. Rollout & risks

### 9.1 Rollout order

1. Merge to `dev`.
2. Payload migrations run automatically on deploy — verify in deploy logs that `20260423_opens_in_new_tab` ran and set expected rows.
3. Post-deploy smoke: homepage grid count = 24, featured 5 open new tabs.

### 9.2 Risks

| Risk | Mitigation |
|------|------------|
| Wrong slug in migration skips a treatment | Migration matches by a set of candidate slug strings; logs which rows it updated; a follow-up seed run is idempotent. |
| Sticky CTA obscures important UI on narrow viewports | Positioned bottom-center above WhatsApp float; tested at 375px and 414px. |
| A re-seed overwrites admin-edited content | Seeds are only run intentionally via npm script; no automatic seed on deploy. |
| Production DB already has `opensInNewTab` column from a prior attempt | Migration is idempotent (`IF NOT EXISTS` on column add). |

---

## 10. Success criteria

- All 24 treatments and 33 locations render on the homepage and search.
- 5 featured treatments open `/treatments/<slug>` in a new tab on click; the other 19 open the SlidePanel on the same screen.
- All locations open `/locations/<slug>` in a new tab.
- Sticky "Book an Appointment" button appears on every frontend page and links to `https://app.atidinricare.com/`.
- Hero subheadline, FAQ set, Sign Up copy, and US states stat reflect the new copy.
- "Empaneled clinic" line is gone from location details.
- Videos on the 5 named treatments are replaced with the client-supplied YouTube URLs.
- US office address appears on Contact Us.
- Playwright suite (existing + new) passes.

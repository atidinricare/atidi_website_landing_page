/**
 * Creates the "Our Team" page (slug: our-team) using the Payload Local API.
 *
 * Page blocks span 17 relational tables, so this goes through Payload rather
 * than raw SQL — that keeps block ordering, Lexical encoding and cache
 * revalidation correct.
 *
 * Run with:  npx tsx scripts/seed-our-team-page.ts
 *            npx tsx scripts/seed-our-team-page.ts --force   (replace existing)
 *
 * The three team cards are deliberate placeholders — replace them in the admin
 * under Collections -> Pages -> Our Team.
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const para = (text: string) => ({
  type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textFormat: 0,
  children: [{ type: 'text', text, mode: 'normal', style: '', detail: 0, format: 0, version: 1 }],
})
const rt = (...paras: string[]) => ({
  root: { type: 'root', format: '', indent: 0, version: 1, direction: 'ltr', children: paras.map(para) },
})

const SLUG = 'our-team'
const force = process.argv.includes('--force')

const payload = await getPayload({ config })

const existing = await payload.find({ collection: 'pages', where: { slug: { equals: SLUG } }, limit: 5 })

if (existing.docs.length > 0 && !force) {
  console.log(`Page "${SLUG}" already exists (id ${existing.docs[0].id}). Pass --force to replace it.`)
  process.exit(0)
}

for (const doc of existing.docs) {
  await payload.delete({ collection: 'pages', id: doc.id })
  console.log(`Removed existing page id ${doc.id}`)
}

const doc = await payload.create({
  collection: 'pages',
  data: {
    title: 'Our Team',
    slug: SLUG,
    status: 'published',
    layout: [
      {
        blockType: 'hero',
        eyebrow: 'Who We Are',
        headline: 'The people behind your care.',
        subheadline:
          'Every Atidi journey is coordinated by a dedicated care manager and delivered by MDS-qualified specialists at our partner clinics.',
        ctaPrimary: { label: 'Book an Appointment', link: 'https://app.atidinricare.com/' },
        ctaSecondary: { label: 'Contact Us', link: '/contact-us' },
      },
      {
        blockType: 'richContent',
        layout: 'withSidebar',
        sidebarLabel: 'Our Approach',
        heading: 'Care that follows you home.',
        content: rt(
          'Atidi was built around a simple idea: travelling for treatment should not mean travelling alone. From your first consultation to your follow-up care after you return, the same team stays with you.',
          'Replace this text in the admin with your own introduction — this page is fully editable under Collections -> Pages -> Our Team.',
        ),
      },
      {
        blockType: 'principlesList',
        heading: 'How the team is structured',
        items: [
          { title: 'Care Managers', description: rt('A qualified dentist assigned as your single point of contact, coordinating scheduling, treatment and follow-up.') },
          { title: 'MDS-Qualified Specialists', description: rt('Every procedure is performed by specialists with advanced qualifications at vetted partner clinics.') },
          { title: 'US Follow-Up Network', description: rt('Affiliated clinics across the USA so your care continues seamlessly after you return.') },
        ],
      },
      {
        blockType: 'contactCards',
        cards: [
          { icon: 'Users', title: 'Team Member Name', content: rt('Role / specialisation. Replace this card in the admin with a real team member.'), link: '/contact-us', linkLabel: 'Get in touch' },
          { icon: 'Heart', title: 'Team Member Name', content: rt('Role / specialisation. Duplicate or remove cards as needed.'), link: '/contact-us', linkLabel: 'Get in touch' },
          { icon: 'Award', title: 'Team Member Name', content: rt('Role / specialisation. Icons are set per card in the admin.'), link: '/contact-us', linkLabel: 'Get in touch' },
        ],
      },
      {
        blockType: 'ctaBlock',
        style: 'premium',
        heading: 'Talk to a care manager',
        subheading: 'Free teleconsultation, available 24/7.',
        button: { label: 'Book an Appointment', link: 'https://app.atidinricare.com/' },
      },
    ],
  } as any,
})

console.log(`Created page "${SLUG}" (id ${doc.id}) — visit /${SLUG}`)
process.exit(0)

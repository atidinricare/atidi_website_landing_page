import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

const samplePosts = [
  {
    title: 'Everything You Need to Know About Dental Implants in India',
    slug: 'dental-implants-guide-india',
    excerpt: 'A comprehensive guide to getting dental implants in India — costs, procedure, recovery time, and why thousands of NRIs choose India for this life-changing treatment.',
    publishedDate: '2026-01-15',
    content: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [{ type: 'text', text: 'Dental implants have revolutionized the way we approach tooth replacement. Unlike dentures or bridges, implants provide a permanent solution that looks, feels, and functions like natural teeth. For NRIs considering dental tourism, India has emerged as a premier destination for high-quality implant procedures at a fraction of US costs.' }],
          },
          {
            type: 'heading',
            tag: 'h2',
            children: [{ type: 'text', text: 'Why Choose India for Dental Implants?' }],
          },
          {
            type: 'paragraph',
            children: [{ type: 'text', text: 'India offers world-class dental care with significant cost advantages. The same Nobel Biocare or Straumann implants that cost $3,000-$5,000 in the US are available in India for $500-$800, without compromising on quality or safety.' }],
          },
          {
            type: 'list',
            listType: 'bullet',
            children: [
              { type: 'listitem', children: [{ type: 'text', text: 'Same international-grade materials used worldwide' }] },
              { type: 'listitem', children: [{ type: 'text', text: 'MDS-qualified specialists with advanced training' }] },
              { type: 'listitem', children: [{ type: 'text', text: 'Modern facilities with digital X-ray and 3D CT scan' }] },
              { type: 'listitem', children: [{ type: 'text', text: 'Comprehensive warranties covering 5-10 years' }] },
            ],
          },
          {
            type: 'heading',
            tag: 'h2',
            children: [{ type: 'text', text: 'The Implant Procedure Timeline' }],
          },
          {
            type: 'paragraph',
            children: [{ type: 'text', text: 'A typical dental implant procedure in India requires 7-10 days for the initial visit. This includes consultation, imaging, implant placement, and initial healing. The crown is usually placed 3-6 months later during a follow-up visit.' }],
          },
          {
            type: 'quote',
            children: [{ type: 'text', text: 'I saved over $12,000 on my dental implants by going to India. The quality was outstanding — they used Nobel Biocare implants, the same brand my US dentist recommended.' }],
          },
          {
            type: 'heading',
            tag: 'h2',
            children: [{ type: 'text', text: 'What to Expect: Recovery and Aftercare' }],
          },
          {
            type: 'paragraph',
            children: [{ type: 'text', text: 'Recovery from implant surgery is straightforward. Most patients experience mild discomfort for 2-3 days, manageable with over-the-counter pain medication. You can return to normal activities within 24-48 hours, though you should avoid hard foods for the first week.' }],
          },
          {
            type: 'paragraph',
            children: [{ type: 'text', text: 'At Atidi, we ensure seamless follow-up care through our network of partner dentists across 10 US states. Your complete dental records are digitized and accessible, making it easy for any dentist to continue your care.' }],
          },
        ],
      },
    },
  },
  {
    title: '5 Questions to Ask Before Your Dental Tourism Trip',
    slug: 'questions-before-dental-tourism',
    excerpt: 'Planning a dental trip to India? Here are the essential questions you should ask to ensure a safe, successful experience.',
    publishedDate: '2026-01-22',
    content: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [{ type: 'text', text: 'Dental tourism can save you thousands of dollars, but it requires careful planning. Before booking your trip, make sure you have answers to these five critical questions.' }],
          },
          {
            type: 'heading',
            tag: 'h2',
            children: [{ type: 'text', text: '1. What are the dentist\'s qualifications?' }],
          },
          {
            type: 'paragraph',
            children: [{ type: 'text', text: 'Look for dentists with MDS (Master of Dental Surgery) qualifications and specialized training in your required procedure. At Atidi, all our partner dentists hold advanced degrees and many have international certifications.' }],
          },
          {
            type: 'heading',
            tag: 'h2',
            children: [{ type: 'text', text: '2. What materials will be used?' }],
          },
          {
            type: 'paragraph',
            children: [{ type: 'text', text: 'Insist on international-grade materials. For implants, this means brands like Nobel Biocare, Straumann, or Osstem. For crowns and veneers, look for E-max or zirconia options with proper certifications.' }],
          },
          {
            type: 'heading',
            tag: 'h2',
            children: [{ type: 'text', text: '3. What happens if something goes wrong?' }],
          },
          {
            type: 'paragraph',
            children: [{ type: 'text', text: 'Understand the warranty and follow-up care provisions. Reputable providers offer comprehensive warranties and have networks for post-treatment support in your home country.' }],
          },
          {
            type: 'heading',
            tag: 'h2',
            children: [{ type: 'text', text: '4. Can I see before-and-after photos?' }],
          },
          {
            type: 'paragraph',
            children: [{ type: 'text', text: 'Request to see cases similar to yours. Digital Smile Design technology can also show you a preview of your expected results before treatment begins.' }],
          },
          {
            type: 'heading',
            tag: 'h2',
            children: [{ type: 'text', text: '5. What\'s included in the quoted price?' }],
          },
          {
            type: 'paragraph',
            children: [{ type: 'text', text: 'Get a detailed breakdown. The price should include all procedure costs, materials, follow-up visits in India, and ideally, any necessary adjustments. Beware of hidden fees.' }],
          },
        ],
      },
    },
  },
  {
    title: 'Patient Story: How Sarah Saved $15,000 on Her Smile Makeover',
    slug: 'patient-story-sarah-smile-makeover',
    excerpt: 'Sarah from California needed extensive dental work. Here\'s how she transformed her smile in India while saving thousands.',
    publishedDate: '2026-02-01',
    content: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [{ type: 'text', text: 'When Sarah, a 45-year-old marketing executive from San Jose, received her dental treatment quote, she was shocked. The estimate for veneers, crowns, and a dental implant totaled over $22,000. That\'s when she started researching alternatives.' }],
          },
          {
            type: 'quote',
            children: [{ type: 'text', text: 'I was embarrassed about my smile for years. The US costs seemed impossible, but I was nervous about going abroad for dental work. Atidi changed everything.' }],
          },
          {
            type: 'heading',
            tag: 'h2',
            children: [{ type: 'text', text: 'Finding Atidi' }],
          },
          {
            type: 'paragraph',
            children: [{ type: 'text', text: 'Sarah discovered Atidi through a friend who had successfully completed her dental work in Hyderabad. After a video consultation and review of her dental records, she received a comprehensive treatment plan — all for $7,200, including premium E-max veneers and a Nobel Biocare implant.' }],
          },
          {
            type: 'heading',
            tag: 'h2',
            children: [{ type: 'text', text: 'The Treatment Experience' }],
          },
          {
            type: 'paragraph',
            children: [{ type: 'text', text: 'Sarah spent 10 days in India. The clinic arranged airport pickup, helped with hotel booking, and even suggested some sightseeing options. The dental team was professional, the facility was immaculate, and the treatment went exactly as planned.' }],
          },
          {
            type: 'paragraph',
            children: [{ type: 'text', text: '"The clinic was more advanced than my dentist\'s office back home," Sarah recalls. "They had 3D scanning, digital smile design — everything. And the attention to detail was incredible."' }],
          },
          {
            type: 'heading',
            tag: 'h2',
            children: [{ type: 'text', text: 'Life After Treatment' }],
          },
          {
            type: 'paragraph',
            children: [{ type: 'text', text: 'Six months later, Sarah\'s smile is still perfect. She had one minor adjustment done at a partner clinic in San Francisco, covered under her warranty. Her total savings? Over $15,000 — enough to fund a family vacation and still come out ahead.' }],
          },
        ],
      },
    },
  },
]

async function seedPosts() {
  console.log('Starting blog posts seed...\n')

  const payload = await getPayload({ config })

  // Get the admin user to set as author
  const usersResult = await payload.find({
    collection: 'users',
    limit: 1,
  })

  if (usersResult.docs.length === 0) {
    console.error('No users found. Please create a user first.')
    process.exit(1)
  }

  const adminUser = usersResult.docs[0]
  console.log(`Using author: ${adminUser.email}\n`)

  // Delete existing sample posts
  console.log('[1/2] Checking for existing posts...')
  for (const post of samplePosts) {
    const existing = await payload.find({
      collection: 'posts',
      where: { slug: { equals: post.slug } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      await payload.delete({
        collection: 'posts',
        id: existing.docs[0].id,
      })
      console.log(`  --> Deleted existing post: "${post.title.substring(0, 40)}..."`)
    }
  }

  // Create new posts
  console.log('\n[2/2] Creating new posts...')
  let count = 0
  for (const post of samplePosts) {
    await payload.create({
      collection: 'posts',
      data: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        publishedDate: post.publishedDate,
        content: post.content as any,
        author: adminUser.id,
        status: 'published',
      },
    })
    count++
    console.log(`  --> Created post: "${post.title.substring(0, 50)}..."`)
  }

  console.log(`\n============================================`)
  console.log(`  BLOG POSTS SEED COMPLETE: ${count} posts created`)
  console.log(`============================================\n`)

  process.exit(0)
}

seedPosts().catch((error) => {
  console.error('Seed failed:', error)
  process.exit(1)
})

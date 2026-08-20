// Atidi NRI Care - Payload CMS Seed Script
// Run with: npm run seed (or: npx tsx src/seed/index.ts)

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'
import { treatmentsData } from './treatments-data'
import { indiaLocationsData, usLocationsData } from './locations-data'

// Helper to convert plain text to Lexical rich text format
function toRichText(text: string) {
  return {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [{ type: 'text', text, version: 1 }],
          direction: 'ltr' as const,
          format: '' as const,
          indent: 0,
          version: 1,
        },
      ],
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }
}

// Category names to seed
const categoryNames = [
  'Restorative',
  'Cosmetic',
  'Endodontics',
  'Orthodontics',
  'Periodontics',
  'Comprehensive',
  'Oral Surgery',
  'Preventive',
  'Specialized',
  'Implantology',
]

// Sample FAQ data
const sampleFAQs = [
  {
    question: 'How much can I save on dental treatment in India?',
    answer: 'Patients typically save 60-80% compared to US prices. For example, a dental implant that costs $3,000-$5,000 in the US can cost $500-$800 in India, with the same quality materials and international-standard care.',
    category: 'pricing',
  },
  {
    question: 'Is the quality of dental care in India comparable to the US?',
    answer: 'Yes, our partner clinics use the same international-grade materials (Nobel Biocare, Straumann, E-max) and follow strict sterilization protocols. Many of our dentists have trained in the US, UK, or Europe and hold international certifications.',
    category: 'quality',
  },
  {
    question: 'How long do I need to stay in India for treatment?',
    answer: 'It depends on the treatment. Simple procedures like fillings or whitening require 1-2 days. Dental implants typically need 7-10 days for the initial visit, with a follow-up trip in 3-6 months. Full mouth makeovers may require 2-3 weeks.',
    category: 'travel',
  },
  {
    question: 'What about follow-up care after I return to the US?',
    answer: 'We have a network of partner dentists across 10 US states who provide follow-up care, adjustments, and emergency support. Minor corrections are covered free of charge. We guarantee a follow-up appointment within 24 hours of your call.',
    category: 'aftercare',
  },
  {
    question: 'Do you help with travel arrangements?',
    answer: 'Yes, our concierge team assists with travel planning, including airport pickup, hotel recommendations near our clinics, local transportation, and even sightseeing suggestions. We make your dental tourism experience seamless.',
    category: 'travel',
  },
  {
    question: 'What if something goes wrong after treatment?',
    answer: 'All our treatments come with warranties ranging from 2-10 years depending on the procedure. Our US partner network provides emergency care within 24 hours. For warranty claims, we cover the cost of correction either in India or through our US partners.',
    category: 'aftercare',
  },
  {
    question: 'How do I get started?',
    answer: 'Simply fill out our consultation form or call us. We will review your dental records (X-rays, photos), provide a detailed treatment plan with cost comparison, and help you plan your trip. The initial consultation is completely free.',
    category: 'general',
  },
  {
    question: 'Are the clinics clean and hygienic?',
    answer: 'Absolutely. All our partner clinics follow international sterilization standards, including autoclave sterilization, disposable supplies, HEPA air filtration, and regular third-party audits. Many clinics are JCI or NABH accredited.',
    category: 'quality',
  },
  {
    question: 'Can I see before and after photos?',
    answer: 'Yes, we have an extensive gallery of before-and-after cases for every treatment type. During your consultation, we can also show you cases similar to yours. With Digital Smile Design, you can preview your own results before treatment.',
    category: 'general',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept credit/debit cards, wire transfers, and digital payments. Payment plans are available for comprehensive treatments. There are no hidden fees — the price quoted includes all procedure costs, materials, and follow-up visits in India.',
    category: 'pricing',
  },
]

// Sample testimonial data
const sampleTestimonials = [
  {
    name: 'Rajesh Patel',
    location: 'New Jersey, USA',
    treatment: 'Dental Implants',
    rating: 5,
    text: 'I saved over $12,000 on my dental implants by going to Atidi Care in Hyderabad. The quality was outstanding — they used Nobel Biocare implants, the same brand my US dentist recommended. The entire experience was first-class.',
    featured: true,
  },
  {
    name: 'Priya Sharma',
    location: 'Texas, USA',
    treatment: 'Full Mouth Makeover',
    rating: 5,
    text: 'My full mouth makeover in India cost me a fraction of what I was quoted in Houston. The results are absolutely stunning. The team at Atidi coordinated everything from airport pickup to hotel booking. I cannot recommend them enough.',
    featured: true,
  },
  {
    name: 'Vikram Reddy',
    location: 'Virginia, USA',
    treatment: 'Root Canal + Crowns',
    rating: 5,
    text: 'I needed 3 root canals and crowns. In the US, I was looking at $7,500+. At Atidi in Hyderabad, I got everything done for under $1,500 with premium materials. The follow-up care in Virginia has been excellent.',
    featured: true,
  },
  {
    name: 'Anita Desai',
    location: 'New York, USA',
    treatment: 'Dental Veneers',
    rating: 5,
    text: 'I got 8 porcelain veneers at the Bangalore clinic. The smile design process was incredible — I could see my new smile before they even started. Saved about $15,000 compared to NYC prices. Worth every minute of the trip!',
    featured: true,
  },
  {
    name: 'Suresh Kumar',
    location: 'Connecticut, USA',
    treatment: 'All-on-4 Implants',
    rating: 5,
    text: 'All-on-4 implants for both arches would have cost me $60,000+ in the US. I got the same treatment in Hyderabad for $11,000 with the Nobel Biocare system. It has been 2 years and everything is perfect.',
    featured: true,
  },
  {
    name: 'Meera Iyer',
    location: 'Maryland, USA',
    treatment: 'Orthodontics',
    rating: 5,
    text: 'Started my clear aligner treatment in Chennai and the follow-up care in Maryland has been seamless. Atidi really has their coordination down. My teeth are almost perfectly aligned now!',
    featured: false,
  },
  {
    name: 'Arun Nair',
    location: 'Pennsylvania, USA',
    treatment: 'Dental Implants',
    rating: 5,
    text: 'Two implants placed at the Hyderabad clinic using Straumann implants. The surgeon was incredibly skilled and the clinic was more modern than many I have seen in the US. Great experience all around.',
    featured: false,
  },
  {
    name: 'Lakshmi Venkatesh',
    location: 'North Carolina, USA',
    treatment: 'Teeth Whitening + Veneers',
    rating: 5,
    text: 'Combined a family trip to India with dental work. Got whitening and 4 veneers done in Bangalore. The results are magazine-worthy! The Atidi team made it a stress-free experience.',
    featured: false,
  },
]

async function seed() {
  console.log('============================================')
  console.log('  Atidi NRI Care - Payload CMS Seed Script')
  console.log('============================================\n')

  // Initialize Payload
  console.log('[1/7] Initializing Payload CMS...')
  const payload = await getPayload({ config })
  console.log('  --> Payload initialized successfully.\n')

  // --------------------------------------------------
  // Step 1: Create admin user
  // --------------------------------------------------
  console.log('[2/7] Creating admin user...')
  try {
    await payload.create({
      collection: 'users',
      data: {
        email: 'admin@atidicare.com',
        password: 'admin123',
        role: 'admin',
      },
    })
    console.log('  --> Admin user created: admin@atidicare.com\n')
  } catch (error: any) {
    if (error?.message?.includes('duplicate') || error?.message?.includes('already exists') || error?.message?.includes('unique')) {
      console.log('  --> Admin user already exists, skipping.\n')
    } else {
      console.error('  --> Warning: Could not create admin user:', error?.message || error)
      console.log('  --> Continuing with seed...\n')
    }
  }

  // --------------------------------------------------
  // Step 2: Seed categories
  // --------------------------------------------------
  console.log('[3/7] Seeding categories...')
  const categoryMap: Record<string, string | number> = {}

  for (const categoryName of categoryNames) {
    try {
      // Check if category already exists
      const existing = await payload.find({
        collection: 'categories',
        where: { name: { equals: categoryName } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        categoryMap[categoryName] = existing.docs[0].id
        console.log(`  --> Category "${categoryName}" already exists (ID: ${existing.docs[0].id})`)
      } else {
        const category = await payload.create({
          collection: 'categories',
          data: {
            name: categoryName,
            slug: categoryName.toLowerCase().replace(/\s+/g, '-'),
          },
        })
        categoryMap[categoryName] = category.id
        console.log(`  --> Created category: "${categoryName}" (ID: ${category.id})`)
      }
    } catch (error: any) {
      console.error(`  --> Error creating category "${categoryName}":`, error?.message || error)
    }
  }
  console.log(`  --> ${Object.keys(categoryMap).length} categories processed.\n`)

  // --------------------------------------------------
  // Step 3: Seed treatments
  // --------------------------------------------------
  console.log('[4/7] Seeding treatments...')
  let treatmentCount = 0

  for (const treatment of treatmentsData) {
    try {
      // Check if treatment already exists
      const existing = await payload.find({
        collection: 'treatments',
        where: {
          slug: { equals: treatment.id },
        },
        limit: 1,
      })

      const categoryId = categoryMap[treatment.category]

      const treatmentData = {
        name: treatment.name,
        slug: treatment.id,
        shortName: treatment.shortName,
        category: categoryId as number | undefined,
        icon: treatment.icon,
        tagline: treatment.tagline,
        description: toRichText(treatment.description),
        usaPriceMin: treatment.usaPrice.min,
        usaPriceMax: treatment.usaPrice.max,
        indiaPriceMin: treatment.indiaPrice.min,
        indiaPriceMax: treatment.indiaPrice.max,
        savingsPercent: treatment.savingsPercent,
        procedure: treatment.procedure.map((step) => ({
          step: step.step,
          title: step.title,
          description: step.description,
        })),
        materials: treatment.materials.map((m) => ({ material: m })),
        faqs: treatment.faqs.map((faq) => ({
          question: faq.question,
          answer: faq.answer,
        })),
        featured: treatment.featured,
        opensInNewTab: treatment.opensInNewTab,
        status: 'published' as const,
      }

      if (existing.docs.length > 0) {
        await payload.update({
          collection: 'treatments',
          id: existing.docs[0].id,
          data: treatmentData,
        })
        console.log(`  --> Updated treatment: "${treatment.name}"`)
      } else {
        await payload.create({
          collection: 'treatments',
          data: treatmentData,
        })
        console.log(`  --> Created treatment: "${treatment.name}"`)
      }
      treatmentCount++
      console.log(`  --> Created treatment: "${treatment.name}"`)
    } catch (error: any) {
      console.error(`  --> Error creating treatment "${treatment.name}":`, error?.message || error)
    }
  }
  console.log(`  --> ${treatmentCount} treatments processed.\n`)

  // --------------------------------------------------
  // Step 4: Seed locations (India)
  // --------------------------------------------------
  console.log('[5/7] Seeding India locations...')
  let indiaLocationCount = 0
  let clinicCount = 0

  for (const location of indiaLocationsData) {
    try {
      // Check if location already exists
      const existing = await payload.find({
        collection: 'locations',
        where: {
          city: { equals: location.city },
        },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        console.log(`  --> Location "${location.city}" already exists, skipping.`)
        indiaLocationCount++
        continue
      }

      const createdLocation = await payload.create({
        collection: 'locations',
        data: {
          city: location.city,
          slug: location.id,
          state: location.state,
          country: location.country,
          type: location.type,
          tagline: location.tagline,
          description: toRichText(location.description),
          doctors: location.doctors,
          facilities: location.facilities.map((f) => ({ facility: f })),
          fromAirport: location.fromAirport,
          coordinates: {
            lat: location.coordinates.lat,
            lng: location.coordinates.lng,
          },
          featured: location.featured,
          opensInNewTab: location.opensInNewTab,
        },
      })
      indiaLocationCount++
      console.log(`  --> Created India location: "${location.city}" (ID: ${createdLocation.id})`)

      // Seed clinics for this India location
      for (const clinic of location.clinics) {
        try {
          const createdClinic = await payload.create({
            collection: 'clinics',
            data: {
              name: clinic.name,
              address: clinic.address,
              phone: clinic.phone,
              specialties: clinic.specialties.map((s) => ({ specialty: s })),
              rating: clinic.rating,
              reviewCount: clinic.reviewCount,
              location: createdLocation.id,
            },
          })
          clinicCount++
          console.log(`    --> Created clinic: "${clinic.name}" (ID: ${createdClinic.id})`)
        } catch (error: any) {
          console.error(`    --> Error creating clinic "${clinic.name}":`, error?.message || error)
        }
      }
    } catch (error: any) {
      console.error(`  --> Error creating location "${location.city}":`, error?.message || error)
    }
  }
  console.log(`  --> ${indiaLocationCount} India locations processed.`)
  console.log(`  --> ${clinicCount} clinics created.\n`)

  // --------------------------------------------------
  // Step 5: Seed locations (USA)
  // --------------------------------------------------
  console.log('[6/7] Seeding US locations...')
  let usLocationCount = 0

  for (const location of usLocationsData) {
    try {
      // Check if location already exists
      const existing = await payload.find({
        collection: 'locations',
        where: {
          city: { equals: location.city },
        },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        console.log(`  --> Location "${location.city}" already exists, skipping.`)
        usLocationCount++
        continue
      }

      await payload.create({
        collection: 'locations',
        data: {
          city: location.city,
          slug: location.id,
          state: location.state,
          stateCode: location.stateCode,
          country: location.country,
          type: location.type,
          tagline: location.tagline,
          description: toRichText(location.description),
          services: location.services.map((s) => ({ service: s })),
          guarantee: location.guarantee,
          emergencyLine: location.emergencyLine,
          coordinates: {
            lat: location.coordinates.lat,
            lng: location.coordinates.lng,
          },
          featured: location.featured,
          opensInNewTab: location.opensInNewTab,
        },
      })
      usLocationCount++
      console.log(`  --> Created US location: "${location.city}, ${location.stateCode}"`)
    } catch (error: any) {
      console.error(`  --> Error creating US location "${location.city}":`, error?.message || error)
    }
  }
  console.log(`  --> ${usLocationCount} US locations processed.\n`)

  // --------------------------------------------------
  // Step 6: Seed FAQs
  // --------------------------------------------------
  console.log('[7/7] Seeding FAQs and testimonials...')
  let faqCount = 0

  for (const faq of sampleFAQs) {
    try {
      const existing = await payload.find({
        collection: 'faqs',
        where: {
          question: { equals: faq.question },
        },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        console.log(`  --> FAQ already exists: "${faq.question.substring(0, 50)}..."`)
        faqCount++
        continue
      }

      await payload.create({
        collection: 'faqs',
        data: {
          question: faq.question,
          answer: toRichText(faq.answer),
          category: faq.category,
        },
      })
      faqCount++
      console.log(`  --> Created FAQ: "${faq.question.substring(0, 50)}..."`)
    } catch (error: any) {
      console.error(`  --> Error creating FAQ:`, error?.message || error)
    }
  }
  console.log(`  --> ${faqCount} FAQs processed.`)

  // --------------------------------------------------
  // Step 7: Seed Testimonials
  // --------------------------------------------------
  let testimonialCount = 0

  for (const testimonial of sampleTestimonials) {
    try {
      const existing = await payload.find({
        collection: 'testimonials',
        where: {
          patientName: { equals: testimonial.name },
        },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        console.log(`  --> Testimonial already exists: "${testimonial.name}"`)
        testimonialCount++
        continue
      }

      await payload.create({
        collection: 'testimonials',
        data: {
          patientName: testimonial.name,
          location: testimonial.location,
          rating: testimonial.rating,
          quote: toRichText(testimonial.text),
          featured: testimonial.featured,
        },
      })
      testimonialCount++
      console.log(`  --> Created testimonial: "${testimonial.name}"`)
    } catch (error: any) {
      console.error(`  --> Error creating testimonial for "${testimonial.name}":`, error?.message || error)
    }
  }
  console.log(`  --> ${testimonialCount} testimonials processed.\n`)

  // --------------------------------------------------
  // Summary
  // --------------------------------------------------
  console.log('============================================')
  console.log('            SEED COMPLETE')
  console.log('============================================')
  console.log(`  Categories:     ${Object.keys(categoryMap).length}`)
  console.log(`  Treatments:     ${treatmentCount}`)
  console.log(`  India locations: ${indiaLocationCount}`)
  console.log(`  US locations:    ${usLocationCount}`)
  console.log(`  Clinics:         ${clinicCount}`)
  console.log(`  FAQs:            ${faqCount}`)
  console.log(`  Testimonials:    ${testimonialCount}`)
  console.log('============================================\n')

  process.exit(0)
}

seed().catch((error) => {
  console.error('\n============================================')
  console.error('  SEED SCRIPT FAILED')
  console.error('============================================')
  console.error(error)
  process.exit(1)
})

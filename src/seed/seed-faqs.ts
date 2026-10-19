import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

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

async function seedFAQs() {
  console.log('Starting FAQ seed...\n')

  const payload = await getPayload({ config })

  // Step 1: Delete all existing FAQs
  console.log('[1/2] Deleting existing FAQs...')
  const existing = await payload.find({
    collection: 'faqs',
    limit: 100,
  })

  for (const faq of existing.docs) {
    await payload.delete({
      collection: 'faqs',
      id: faq.id,
    })
    console.log(`  --> Deleted FAQ: "${faq.question.substring(0, 40)}..."`)
  }
  console.log(`  --> ${existing.docs.length} FAQs deleted.\n`)

  // Step 2: Insert the correct 7 FAQs
  console.log('[2/2] Creating new FAQs...')
  for (const faq of correctFAQs) {
    // Convert answer array to newline-separated string for DB storage
    const answerText = faq.answer.map(point => `- ${point}`).join('\n')

    await payload.create({
      collection: 'faqs',
      data: {
        question: faq.question,
        answer: toRichText(answerText),
        order: faq.order,
      },
    })
    console.log(`  --> Created FAQ #${faq.order}: "${faq.question.substring(0, 40)}..."`)
  }

  console.log(`\n============================================`)
  console.log(`  FAQ SEED COMPLETE: ${correctFAQs.length} FAQs created`)
  console.log(`============================================\n`)

  process.exit(0)
}

seedFAQs().catch((error) => {
  console.error('Seed failed:', error)
  process.exit(1)
})

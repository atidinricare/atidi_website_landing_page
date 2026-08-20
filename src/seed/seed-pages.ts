// Atidi NRI Care - Pages Seed Script
// Migrates existing React page content into the Pages collection
// Run with: npx tsx src/seed/seed-pages.ts

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

// Helper: convert plain text paragraphs to Lexical rich text format
function toLexical(paragraphs: string[]) {
  return {
    root: {
      type: 'root',
      children: paragraphs.map((text) => ({
        type: 'paragraph',
        children: [{ type: 'text', text, format: 0, detail: 0, mode: 'normal', style: '', version: 1 }],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        textFormat: 0,
        version: 1,
      })),
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }
}

// ============================================
// PAGE DATA
// ============================================

const homePage = {
  title: 'Home',
  slug: 'home',
  status: 'published',
  layout: [
    {
      blockType: 'hero',
      headline: "Premium dental care for NRI's, without the premium price.",
      subheadline: 'ATIDI NRI CARE connects NRIs to verified top premium dental hospitals in India & USA. We provide world-class treatment in India with seamless follow-up care when you return to the USA. At Atidi dental treatments are 70–90% cheaper than in USA without compromising quality.',
      ctaPrimary: { label: 'Book an Appointment', link: 'https://app.atidinricare.com/' },
      ctaSecondary: { label: 'Watch Our Story', link: '#video' },
    },
    {
      blockType: 'statsGrid',
      stats: [
        { value: '24/7', label: 'Free Teleconsultation' },
        { value: '100%', label: 'Success Rate' },
        { value: '10', label: 'US States Covered' },
      ],
    },
    {
      blockType: 'treatmentsBlock',
      heading: 'Our Treatments',
      subheading: 'Comprehensive dental care at a fraction of US costs, with the same quality materials and international standards.',
      showFeaturedOnly: true,
    },
    {
      blockType: 'locationsBlock',
      heading: 'Our Locations',
      subheading: 'Treatment centers across India and follow-up care across the USA.',
    },
    {
      blockType: 'faqBlock',
      heading: 'Frequently Asked Questions',
    },
    {
      blockType: 'ctaBlock',
      heading: 'Ready to start your dental journey?',
      subheading: 'Book a free teleconsultation with our dental experts and get a personalized treatment plan.',
      button: { label: 'Book an Appointment', link: 'https://app.atidinricare.com/' },
      style: 'premium',
    },
  ],
}

const aboutPage = {
  title: 'About Us',
  slug: 'about-us',
  status: 'published',
  layout: [
    {
      blockType: 'richContent',
      eyebrow: 'About Atidi NRI Care',
      heading: "We couldn't find honest dental care across borders. So we built it.",
      layout: 'full',
    },
    {
      blockType: 'richContent',
      heading: 'The Problem',
      content: toLexical([
        "For NRIs visiting India, finding the right dentist has always been a gamble.",
        "You ask family, search online, get conflicting recommendations, and when you finally walk into a clinic, there's no way to verify the dentist's qualifications or whether the materials meet international standards.",
        "Then there's the pricing. The moment a clinic learns you're an NRI, costs quietly double. What should be a straightforward procedure turns into an opaque, overpriced experience with no accountability.",
        "And if something goes wrong after you return to the US? Finding a dentist willing to do follow-up work on a procedure they didn't perform, with no records to reference, is nearly impossible.",
      ]),
      layout: 'withSidebar',
      sidebarLabel: 'The Problem',
    },
    {
      blockType: 'highlight',
      text: 'We lived through all of this. And we knew there had to be a better way.',
      style: 'quote',
    },
    {
      blockType: 'richContent',
      heading: 'What Atidi does differently',
      content: toLexical([
        "Atidi NRI Care exists to remove the uncertainty from dental tourism. We've built a network of vetted clinics with MDS-qualified dentists, standardized pricing, and complete documentation, so every NRI gets the same quality of care regardless of which clinic they visit.",
        "When you return to the US, your treatment doesn't end. Our partner clinics across 10 states provide follow-up care with full access to your India records. Minor adjustments are covered. Appointments are guaranteed within 24 hours. And our support line never closes.",
      ]),
      layout: 'twoColumn',
    },
    {
      blockType: 'statsGrid',
      stats: [
        { value: '121+', label: 'partner clinics across India' },
        { value: '10', label: 'US states with follow-up care' },
        { value: '24hr', label: 'appointment guarantee in the US' },
        { value: '0', label: 'hidden fees, ever' },
      ],
    },
    {
      blockType: 'principlesList',
      heading: 'What We Stand For',
      items: [
        {
          title: 'Quality without compromise',
          description: 'Every dentist in our network holds an MDS qualification. Every clinic meets international infrastructure and hygiene standards. No exceptions.',
        },
        {
          title: 'One price for everyone',
          description: "No NRI markup. No surprise charges. Every treatment has a fixed, published rate. The same for a local patient or someone flying in from Texas.",
        },
        {
          title: 'Care that crosses borders',
          description: 'Your treatment records are digitized and shared with your US follow-up dentist. If something needs attention after you land, we handle it.',
        },
        {
          title: 'Always reachable',
          description: 'Our dental support line runs 24/7. Before your trip, during treatment, or three months after you return. We pick up.',
        },
      ],
    },
    {
      blockType: 'ctaBlock',
      heading: 'See the difference for yourself.',
      button: { label: 'Book an Appointment', link: 'https://app.atidinricare.com/' },
      style: 'standard',
    },
  ],
}

const contactPage = {
  title: 'Contact Us',
  slug: 'contact-us',
  status: 'published',
  layout: [
    {
      blockType: 'hero',
      eyebrow: 'Contact',
      headline: 'Get in touch.',
      subheadline: "Have questions about your dental journey? We're here to help.",
    },
    {
      blockType: 'contactCards',
      cards: [
        {
          icon: 'MapPin',
          title: 'Office Address',
          content: 'ATIDI NRIES CARE PRIVATE LIMITED\nH.NO.8-3-229/D/75, Road No. 36,\nAditya Enclave, Venkatagiri,\nJubilee Hills, Hyderabad,\nTelangana 500033',
        },
        {
          icon: 'Phone',
          title: 'Phone',
          content: '+91 90309 91859\nAvailable 24/7 for your queries',
          link: 'tel:+919030991859',
          linkLabel: 'Call Now',
        },
        {
          icon: 'Mail',
          title: 'Email',
          content: 'contact@atidinricare.com\nWe\'ll respond within 24 hours',
          link: 'mailto:contact@atidinricare.com',
          linkLabel: 'Send Email',
        },
        {
          icon: 'MessageCircle',
          title: 'WhatsApp',
          content: 'Quick responses on WhatsApp',
          link: 'https://wa.me/919030991859',
          linkLabel: 'Chat with us',
        },
      ],
    },
  ],
}

const clinicsPage = {
  title: 'Our Clinics',
  slug: 'clinics',
  status: 'published',
  layout: [
    {
      blockType: 'richContent',
      eyebrow: 'Our Clinics',
      heading: '121+ clinics. Every one vetted, verified, monitored.',
      layout: 'full',
    },
    {
      blockType: 'richContent',
      heading: 'Why our clinics stand apart',
      content: toLexical([
        "Every clinic in our network is carefully selected and continuously monitored. We don't list clinics, we partner with them. That means infrastructure audits, hygiene protocol reviews, and ongoing quality checks.",
        "The result: you walk into any Atidi partner clinic in India and receive the same standard of care you'd expect from the best practices anywhere in the world.",
      ]),
      layout: 'twoColumn',
    },
    {
      blockType: 'principlesList',
      heading: 'Our Standards',
      items: [
        {
          title: 'Rigorous vetting',
          description: 'Every partner clinic is audited for infrastructure, sterilization protocols, and equipment standards. We use modern equipment including digital X-ray, 3D CT scan, and CAD/CAM technology. Only clinics that meet international benchmarks make it into our network.',
        },
        {
          title: 'MDS-qualified specialists',
          description: 'Treatments are performed by dentists with MDS qualifications and advanced specialization. Our network includes specialists with years of experience in complex procedures, using premium, internationally certified dental materials.',
        },
        {
          title: 'Follow-up across borders',
          description: 'Your complete dental records are digitized and accessible through our patient portal. Partner clinics across 10 US states provide in-person follow-ups when you return. Remote consultations with your treating dentist are available for any post-treatment concerns.',
        },
      ],
    },
    {
      blockType: 'highlight',
      text: 'Strict sterilization protocols. Premium materials with international warranties. Complete documentation shared with your US provider. Minor adjustments covered at follow-up clinics. 24/7 support available.',
      style: 'centered',
    },
    {
      blockType: 'locationsBlock',
      heading: 'Our Locations',
      subheading: 'Treatment centers across India and follow-up care across the USA.',
    },
  ],
}

const privacyPage = {
  title: 'Privacy Policy',
  slug: 'privacy-policy',
  status: 'published',
  layout: [
    {
      blockType: 'hero',
      eyebrow: 'Legal',
      headline: 'Privacy Policy.',
      subheadline: 'Your privacy matters to us. This policy explains how we collect, use, and protect your personal information.',
    },
    {
      blockType: 'legalContent',
      sections: [
        {
          icon: 'FileText',
          title: 'Information We Collect',
          items: [
            {
              heading: 'Personal Information',
              content: 'When you use our services, we may collect personal information that you voluntarily provide, including your name, email address, phone number, postal address, date of birth, and medical/dental history relevant to your treatment.',
            },
            {
              heading: 'Health Information',
              content: 'To provide dental care services, we collect health-related information including dental records, X-rays, treatment plans, medical history, allergies, and current medications. This information is essential for delivering safe and effective dental care.',
            },
            {
              heading: 'Usage Data',
              content: 'We automatically collect certain information when you visit our website, including your IP address, browser type, device information, pages visited, time spent on pages, and referring URLs.',
            },
          ],
        },
        {
          icon: 'Settings',
          title: 'How We Use Your Information',
          items: [
            {
              heading: 'Service Delivery',
              content: 'We use your information to provide, maintain, and improve our dental care coordination services, including scheduling appointments, coordinating between treatment centers in India and follow-up care in the USA, and managing your patient records.',
            },
            {
              heading: 'Communication',
              content: 'We use your contact information to send appointment reminders, treatment updates, post-care instructions, and respond to your inquiries. With your consent, we may also send promotional communications about our services.',
            },
            {
              heading: 'Quality Improvement',
              content: 'We analyze usage patterns and feedback to improve our services, develop new features, and enhance user experience across our platforms.',
            },
          ],
        },
        {
          icon: 'Share2',
          title: 'Information Sharing',
          items: [
            {
              heading: 'Healthcare Providers',
              content: 'We share your health information with our partner dental clinics in India and the USA as necessary to coordinate your care. This sharing is essential for treatment continuity and is conducted in compliance with applicable healthcare privacy regulations.',
            },
            {
              heading: 'Service Providers',
              content: 'We may share information with trusted third-party service providers who assist us in operating our website, conducting our business, or servicing you. These parties are contractually obligated to keep your information confidential.',
            },
            {
              heading: 'Legal Requirements',
              content: 'We may disclose your information when required by law, court order, or government regulation, or when we believe disclosure is necessary to protect our rights, your safety, or the safety of others.',
            },
          ],
        },
        {
          icon: 'Shield',
          title: 'Data Security',
          items: [
            {
              heading: 'Protection Measures',
              content: 'We implement industry-standard security measures including encryption, secure servers, firewalls, and access controls to protect your personal and health information from unauthorized access, alteration, disclosure, or destruction.',
            },
            {
              heading: 'Data Storage',
              content: 'Your data is stored on secure servers with appropriate physical, technical, and administrative safeguards. We retain your information only for as long as necessary to fulfill the purposes outlined in this policy or as required by law.',
            },
          ],
        },
        {
          icon: 'User',
          title: 'Your Rights',
          items: [
            {
              heading: 'Access and Correction',
              content: 'You have the right to access, review, and request corrections to your personal information. You may also request a copy of your health records in accordance with applicable healthcare regulations.',
            },
            {
              heading: 'Opt-Out',
              content: 'You may opt out of receiving promotional communications from us at any time by following the unsubscribe instructions in our emails or contacting us directly. Note that you cannot opt out of service-related communications necessary for your care.',
            },
            {
              heading: 'Data Deletion',
              content: 'Subject to legal and regulatory requirements, you may request the deletion of your personal information. Certain health records may need to be retained as required by healthcare regulations.',
            },
          ],
        },
        {
          icon: 'Globe',
          title: 'International Data Transfers',
          items: [
            {
              heading: 'Cross-Border Transfers',
              content: 'As we coordinate care between India and the USA, your information may be transferred and stored in different countries. We ensure appropriate safeguards are in place to protect your information in compliance with applicable data protection laws.',
            },
            {
              heading: 'Consent',
              content: 'By using our services, you consent to the transfer of your information to India, the United States, and other countries where our partners and service providers are located.',
            },
          ],
        },
        {
          icon: 'RefreshCw',
          title: 'Policy Updates',
          items: [
            {
              heading: 'Changes to This Policy',
              content: "We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any material changes by posting the updated policy on our website and updating the 'Last Updated' date.",
            },
            {
              heading: 'Your Continued Use',
              content: 'Your continued use of our services after any changes to this Privacy Policy constitutes your acceptance of the updated policy.',
            },
          ],
        },
        {
          icon: 'Mail',
          title: 'Contact Us',
          items: [
            {
              heading: 'Questions or Concerns',
              content: 'If you have any questions about this Privacy Policy or our data practices, please contact us at privacy@atidinricare.com or call us at +91 90309 91859. You may also write to us at our registered address.',
            },
          ],
        },
      ],
    },
    {
      blockType: 'ctaBlock',
      heading: 'Have questions about your data?',
      subheading: 'Our team is here to help you understand how we protect your information.',
      button: { label: 'Contact Privacy Team', link: 'mailto:privacy@atidinricare.com' },
      style: 'standard',
    },
  ],
}

const termsPage = {
  title: 'Terms of Service',
  slug: 'terms-of-service',
  status: 'published',
  layout: [
    {
      blockType: 'hero',
      eyebrow: 'Legal',
      headline: 'Terms of Service.',
      subheadline: 'Please read these terms carefully before using our services. They govern your relationship with Atidi NRI Care.',
    },
    {
      blockType: 'legalContent',
      sections: [
        {
          icon: 'FileCheck',
          title: 'Acceptance of Terms',
          items: [
            {
              heading: 'Agreement',
              content: 'By accessing or using Atidi NRI Care services, website, or mobile applications, you agree to be bound by these Terms of Service. If you do not agree to all terms and conditions, you may not access or use our services.',
            },
            {
              heading: 'Eligibility',
              content: 'You must be at least 18 years of age to use our services. By using our services, you represent that you are at least 18 years old and have the legal capacity to enter into binding agreements. For patients under 18, a parent or legal guardian must agree to these terms on their behalf.',
            },
            {
              heading: 'Modifications',
              content: 'We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to our website. Your continued use of our services following any changes constitutes acceptance of the revised terms.',
            },
          ],
        },
        {
          icon: 'Stethoscope',
          title: 'Our Services',
          items: [
            {
              heading: 'Service Description',
              content: 'Atidi NRI Care provides dental care coordination services for Non-Resident Indians (NRIs), connecting patients with partner dental clinics in India for treatment and facilitating follow-up care through our partner network in the United States.',
            },
            {
              heading: 'Coordination Role',
              content: 'We act as a coordination and facilitation service between patients and independent dental healthcare providers. We are not a healthcare provider and do not practice dentistry. All dental treatments are provided by licensed, independent dental professionals at our partner clinics.',
            },
            {
              heading: 'No Medical Advice',
              content: 'Information provided through our website or services is for general informational purposes only and should not be considered medical or dental advice. Always consult with qualified healthcare professionals for medical decisions.',
            },
          ],
        },
        {
          icon: 'UserCheck',
          title: 'User Obligations',
          items: [
            {
              heading: 'Accurate Information',
              content: 'You agree to provide accurate, current, and complete information about yourself, including your medical and dental history. Providing false or misleading information may affect the quality of your care and constitutes a violation of these terms.',
            },
            {
              heading: 'Account Security',
              content: 'If you create an account with us, you are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use.',
            },
            {
              heading: 'Compliance',
              content: 'You agree to comply with all applicable laws, regulations, and these terms when using our services. You will not use our services for any unlawful purpose or in any way that could damage, disable, or impair our services.',
            },
          ],
        },
        {
          icon: 'CreditCard',
          title: 'Payments & Pricing',
          items: [
            {
              heading: 'Treatment Costs',
              content: 'Treatment costs are determined by our partner dental clinics and will be communicated to you before treatment begins. Prices are subject to change based on your specific dental needs, treatment complexity, and materials used.',
            },
            {
              heading: 'Coordination Fees',
              content: 'Atidi NRI Care may charge coordination fees for our services. All fees will be clearly disclosed before you incur any charges. Payment terms and accepted payment methods will be specified at the time of booking.',
            },
            {
              heading: 'Currency & Taxes',
              content: 'Prices may be displayed in multiple currencies for convenience. The final charge will be in the currency specified at checkout. You are responsible for any applicable taxes, duties, or fees imposed by your jurisdiction.',
            },
          ],
        },
        {
          icon: 'XCircle',
          title: 'Cancellation & Refunds',
          items: [
            {
              heading: 'Cancellation Policy',
              content: 'Cancellation policies vary by service and will be communicated at the time of booking. Early cancellation may entitle you to a full or partial refund, while late cancellations may incur fees as specified in your booking confirmation.',
            },
            {
              heading: 'Treatment Refunds',
              content: 'Refunds for dental treatments are subject to the policies of the treating clinic. As treatments are provided by independent healthcare providers, refund requests must be directed to and approved by the relevant clinic.',
            },
            {
              heading: 'Coordination Fee Refunds',
              content: 'Coordination fees may be refundable if you cancel before services are rendered. Once coordination services have been provided, these fees are generally non-refundable. Specific terms will be outlined in your service agreement.',
            },
          ],
        },
        {
          icon: 'AlertTriangle',
          title: 'Limitation of Liability',
          items: [
            {
              heading: 'Service Limitations',
              content: "Our services are provided 'as is' without warranties of any kind. We do not guarantee specific treatment outcomes, as results depend on individual patient factors and the professional judgment of treating dentists.",
            },
            {
              heading: 'Healthcare Disclaimer',
              content: 'Atidi NRI Care is not responsible for the actions, decisions, or outcomes of treatment provided by our partner dental clinics. Each clinic is an independent entity responsible for its own standard of care and treatment outcomes.',
            },
            {
              heading: 'Liability Cap',
              content: 'To the maximum extent permitted by law, our total liability for any claims arising from your use of our services shall not exceed the amount you paid to Atidi NRI Care in the 12 months preceding the claim.',
            },
          ],
        },
        {
          icon: 'LogOut',
          title: 'Termination',
          items: [
            {
              heading: 'Termination by You',
              content: 'You may stop using our services at any time. If you have ongoing treatments or bookings, you should follow the cancellation procedures outlined in your service agreements.',
            },
            {
              heading: 'Termination by Us',
              content: 'We may suspend or terminate your access to our services at any time, with or without cause, including for violation of these terms. We will make reasonable efforts to notify you of any termination.',
            },
            {
              heading: 'Effect of Termination',
              content: 'Upon termination, your right to use our services will immediately cease. Provisions of these terms that by their nature should survive termination will remain in effect, including liability limitations and dispute resolution provisions.',
            },
          ],
        },
        {
          icon: 'Scale',
          title: 'Dispute Resolution',
          items: [
            {
              heading: 'Governing Law',
              content: 'These terms shall be governed by and construed in accordance with the laws of India, without regard to conflict of law principles. For services provided in the USA, relevant US federal and state laws may also apply.',
            },
            {
              heading: 'Informal Resolution',
              content: 'Before initiating formal dispute resolution, you agree to contact us to attempt to resolve any dispute informally. We commit to working in good faith to resolve your concerns within 30 days.',
            },
            {
              heading: 'Arbitration',
              content: 'Any disputes not resolved informally shall be resolved through binding arbitration in accordance with applicable arbitration rules. The arbitration shall be conducted in Hyderabad, India, unless otherwise agreed.',
            },
          ],
        },
        {
          icon: 'Mail',
          title: 'Contact Information',
          items: [
            {
              heading: 'Questions',
              content: 'If you have any questions about these Terms of Service, please contact us at legal@atidinricare.com or call us at +91 90309 91859. You may also write to us at our registered office address.',
            },
          ],
        },
      ],
    },
    {
      blockType: 'ctaBlock',
      heading: 'Have questions about our terms?',
      subheading: 'Our legal team is available to help clarify any aspect of these terms.',
      button: { label: 'Contact Legal Team', link: 'mailto:legal@atidinricare.com' },
      style: 'standard',
    },
  ],
}

// ============================================
// SEED FUNCTION
// ============================================

const allPages = [homePage, aboutPage, contactPage, clinicsPage, privacyPage, termsPage]

async function seedPages() {
  console.log('============================================')
  console.log('  Atidi NRI Care - Pages Seed Script')
  console.log('============================================\n')

  console.log('[1/2] Initializing Payload CMS...')
  const payload = await getPayload({ config })
  console.log('  --> Payload initialized.\n')

  console.log('[2/2] Seeding pages...')
  let pageCount = 0

  for (const page of allPages) {
    try {
      // Check if page already exists
      const existing = await payload.find({
        collection: 'pages',
        where: { slug: { equals: page.slug } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        console.log(`  --> Page "${page.title}" already exists, skipping.`)
        pageCount++
        continue
      }

      await payload.create({
        collection: 'pages',
        data: page as any,
      })
      pageCount++
      console.log(`  --> Created page: "${page.title}" (/${page.slug})`)
    } catch (error: any) {
      console.error(`  --> Error creating page "${page.title}":`, error?.message || error)
    }
  }

  console.log(`\n============================================`)
  console.log(`  PAGES SEED COMPLETE: ${pageCount} pages`)
  console.log(`============================================\n`)

  process.exit(0)
}

seedPages().catch((error) => {
  console.error('\nPages seed failed:', error)
  process.exit(1)
})

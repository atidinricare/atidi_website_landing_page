/**
 * Extract plain text from a Lexical JSON richText value.
 * Falls back to the raw value if it's already a string (backwards compat).
 */
function lexicalToPlainText(value: any): string {
  if (!value || typeof value === 'string') return value || ''
  try {
    const nodes: any[] = value?.root?.children ?? []
    return nodes
      .map((node: any) => {
        if (node.type === 'paragraph' || node.type === 'heading') {
          return (node.children ?? []).map((c: any) => c.text ?? '').join('')
        }
        if (node.type === 'list') {
          return (node.children ?? [])
            .map((item: any) =>
              (item.children ?? []).map((c: any) => c.text ?? '').join('')
            )
            .join('\n')
        }
        return (node.children ?? []).map((c: any) => c.text ?? '').join('')
      })
      .filter(Boolean)
      .join('\n')
  } catch {
    return ''
  }
}

/**
 * Transform Payload treatment doc → frontend shape.
 *
 * Key mappings:
 * - slug → id (string)
 * - category relationship → category name string
 * - usaPriceMin/Max → usaPrice: { min, max }
 * - materials: [{ material }] → ["..."]
 * - image upload object → url string
 */
export function adaptTreatment(doc: any) {
  return {
    id: doc.slug,
    _payloadId: doc.id,
    name: doc.name,
    shortName: doc.shortName || '',
    category:
      typeof doc.category === 'object' && doc.category !== null
        ? doc.category.name
        : doc.category || '',
    icon: doc.icon || '',
    tagline: doc.tagline || '',
    description: lexicalToPlainText(doc.description),
    usaPrice: { min: doc.usaPriceMin || 0, max: doc.usaPriceMax || 0 },
    indiaPrice: { min: doc.indiaPriceMin || 0, max: doc.indiaPriceMax || 0 },
    savingsPercent: doc.savingsPercent || 0,
    procedure: (doc.procedure || []).map((step: any) => ({
      step: step.step,
      title: step.title,
      description: step.description || '',
    })),
    materials: (doc.materials || []).map((m: any) => m.material),
    faqs: (doc.faqs || []).map((faq: any) => ({
      question: faq.question,
      answer: faq.answer,
    })),
    image:
      typeof doc.image === 'object' && doc.image !== null
        ? doc.image.url
        : doc.image || '',
    gallery: (doc.gallery || []).map((item: any) => ({
      image:
        typeof item.image === 'object' && item.image !== null
          ? item.image.url
          : item.image || '',
      caption: item.caption || '',
    })),
    videos: (doc.videos || []).map((v: any) => ({
      title: v.title || '',
      type: v.type || 'youtube',
      url:
        v.type === 'upload'
          ? typeof v.videoFile === 'object' && v.videoFile !== null
            ? v.videoFile.url
            : v.videoFile || ''
          : v.youtubeUrl || '',
    })),
    featured: doc.featured || false,
    opensInNewTab: doc.opensInNewTab ?? true,
    meta: doc.meta || null,
  }
}

/**
 * Transform Payload location doc → frontend shape.
 * Clinics are fetched separately and merged in for India locations.
 */
export function adaptLocation(doc: any, clinics: any[] = []) {
  const slug = doc.slug || doc.city.toLowerCase().replace(/\s+/g, '-')
  const base = {
    id: slug,
    _payloadId: doc.id,
    slug,
    city: doc.city,
    state: doc.state,
    stateCode: doc.stateCode || undefined,
    country: doc.country,
    type: doc.type,
    tagline: doc.tagline || '',
    description: lexicalToPlainText(doc.description),
    coordinates: doc.coordinates || { lat: 0, lng: 0 },
    image:
      typeof doc.image === 'object' && doc.image !== null
        ? doc.image.url
        : doc.image || '',
    featured: doc.featured || false,
    opensInNewTab: doc.opensInNewTab ?? true,
    meta: doc.meta || null,
  }

  if (doc.type === 'treatment') {
    return {
      ...base,
      doctors: doc.doctors || 0,
      clinics: clinics.map((clinic) => ({
        name: clinic.name,
        address: clinic.address,
        phone: clinic.phone || '',
        specialties: (clinic.specialties || []).map((s: any) => s.specialty),
        rating: clinic.rating || 0,
        reviewCount: clinic.reviewCount || 0,
      })),
      facilities: (doc.facilities || []).map((f: any) => f.facility),
      fromAirport: doc.fromAirport || '',
    }
  }

  // USA follow-up location
  return {
    ...base,
    services: (doc.services || []).map((s: any) => s.service),
    guarantee: doc.guarantee || '',
    emergencyLine: doc.emergencyLine || '',
  }
}

/**
 * Transform Payload FAQ doc → frontend shape.
 * Frontend expects answer as array of strings (one per paragraph/list item).
 * Payload now stores answer as Lexical richText JSON.
 */
export function adaptFAQ(doc: any) {
  const text = lexicalToPlainText(doc.answer)
  const lines = text
    .split(/\n/)
    .map((line: string) => line.replace(/^[-*]\s*/, '').trim())
    .filter((line: string) => line.length > 0)

  return {
    question: doc.question,
    answer: lines.length > 1 ? lines : lines.length === 1 ? lines : [''],
  }
}

/**
 * Transform Payload testimonial doc → frontend shape.
 *
 * The quote is stored as Lexical richText; the carousel renders it as plain
 * paragraphs, so flatten it here the same way adaptFAQ does.
 */
export function adaptTestimonial(doc: any) {
  const quote = lexicalToPlainText(doc.quote)
    .split(/\n/)
    .map((line: string) => line.replace(/^[-*]\s*/, '').trim())
    .filter((line: string) => line.length > 0)

  const treatment = doc.treatment

  return {
    id: doc.id,
    patientName: doc.patientName,
    location: doc.location || '',
    treatment: typeof treatment === 'object' && treatment ? treatment.name : '',
    rating: typeof doc.rating === 'number' ? doc.rating : null,
    quote,
    videoUrl: doc.videoUrl || '',
    featured: Boolean(doc.featured),
  }
}

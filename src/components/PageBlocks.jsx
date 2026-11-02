'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  MapPin, Phone, Mail, Clock, Globe, Shield, Heart, Star,
  Users, Award, CheckCircle, ArrowUpRight,
} from 'lucide-react'
import RichText from './RichText'
import FAQ from './FAQ'
import styles from './PageBlocks.module.css'

// Icons the CMS can name in an "icon" field. Unknown names fall back to null
// so a typo in the admin never breaks the page.
const ICONS = {
  MapPin, Phone, Mail, Clock, Globe, Shield, Heart, Star,
  Users, Award, CheckCircle, ArrowUpRight,
}

const Icon = ({ name, size = 20 }) => {
  const Cmp = name ? ICONS[name] : null
  return Cmp ? <Cmp size={size} aria-hidden="true" /> : null
}

/* Internal links go through next/link; external and anchor links stay plain. */
const SmartLink = ({ href, className, children }) => {
  if (!href) return null
  const external = /^(https?:)?\/\//i.test(href) || href.startsWith('mailto:') || href.startsWith('tel:')
  if (external) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  )
}

/* ---------------------------------------------------------------- blocks */

const HeroBlock = ({ block }) => {
  const bg = typeof block.backgroundImage === 'object' ? block.backgroundImage?.url : null
  const light = block.background === 'light'

  return (
    <section className={`${styles.hero} ${light ? styles.heroLight : ''}`}>
      {bg && <div className={styles.heroImage} style={{ backgroundImage: `url(${bg})` }} />}
      <div className={light ? styles.heroOverlayLight : styles.heroOverlay} />
      <div className={styles.container}>
        <div className={styles.heroInner}>
          {block.eyebrow && <span className={styles.eyebrow}>{block.eyebrow}</span>}
          <h1 className={styles.heroHeadline}>{block.headline}</h1>
          {block.subheadline && <p className={styles.heroSub}>{block.subheadline}</p>}
          {(block.ctaPrimary?.label || block.ctaSecondary?.label) && (
            <div className={styles.heroCtas}>
              {block.ctaPrimary?.label && (
                <SmartLink href={block.ctaPrimary.link} className={styles.btnPrimary}>
                  {block.ctaPrimary.label}
                </SmartLink>
              )}
              {block.ctaSecondary?.label && (
                <SmartLink href={block.ctaSecondary.link} className={styles.btnSecondary}>
                  {block.ctaSecondary.label}
                </SmartLink>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

const RichContentBlock = ({ block }) => {
  const layout = block.layout || 'full'

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={`${styles.richWrap} ${styles[`rich_${layout}`]}`}>
          {layout === 'withSidebar' && (
            <aside className={styles.sidebarLabel}>{block.sidebarLabel}</aside>
          )}

          <div className={styles.richMain}>
            {block.eyebrow && <span className={styles.eyebrow}>{block.eyebrow}</span>}
            {block.heading && <h2 className={styles.heading}>{block.heading}</h2>}
            <div className={`${styles.prose} ${layout === 'twoColumn' ? styles.proseColumns : ''}`}>
              <RichText content={block.content} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const HighlightBlock = ({ block }) => (
  <section className={styles.sectionTight}>
    <div className={styles.container}>
      <div className={`${styles.highlight} ${styles[`hl_${block.style || 'borderLeft'}`]}`}>
        <div className={styles.prose}>
          <RichText content={block.text} />
        </div>
      </div>
    </div>
  </section>
)

const StatsGridBlock = ({ block }) => {
  const stats = block.stats || []
  if (stats.length === 0) return null

  return (
    <section className={styles.sectionDark}>
      <div className={styles.container}>
        <div className={styles.statsGrid}>
          {stats.map((stat, i) => (
            <div key={i} className={styles.stat}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const PrinciplesListBlock = ({ block }) => {
  const items = block.items || []
  if (items.length === 0) return null

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {block.heading && <h2 className={styles.heading}>{block.heading}</h2>}
        <ol className={styles.principles}>
          {items.map((item, i) => (
            <li key={i} className={styles.principle}>
              <span className={styles.principleNum}>{String(i + 1).padStart(2, '0')}</span>
              <div className={styles.principleBody}>
                <h3 className={styles.principleTitle}>{item.title}</h3>
                <div className={styles.prose}>
                  <RichText content={item.description} />
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

const ContactCardsBlock = ({ block }) => {
  const cards = block.cards || []
  if (cards.length === 0) return null

  const dark = block.theme === 'dark'

  return (
    <section className={dark ? styles.sectionDark : styles.section}>
      <div className={styles.container}>
        <div className={styles.cards}>
          {cards.map((card, i) => (
            <div key={i} className={`${styles.card} ${dark ? styles.cardDark : ''}`}>
              <span className={styles.cardIcon}><Icon name={card.icon} /></span>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <div className={styles.prose}>
                <RichText content={card.content} />
              </div>
              {card.link && (
                <SmartLink href={card.link} className={styles.cardLink}>
                  {card.linkLabel || 'Learn more'}
                  <ArrowUpRight size={14} aria-hidden="true" />
                </SmartLink>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const TreatmentsBlock = ({ block, treatments = [] }) => {
  const list = block.showFeaturedOnly ? treatments.filter((t) => t.featured) : treatments
  if (list.length === 0) return null

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {block.heading && <h2 className={styles.heading}>{block.heading}</h2>}
        {block.subheading && <p className={styles.subheading}>{block.subheading}</p>}
        <div className={styles.linkGrid}>
          {list.map((item) => (
            <Link key={item.id} href={`/treatments/${item.id}`} className={styles.linkCard}>
              <span className={styles.linkCardTitle}>{item.name}</span>
              {item.tagline && <span className={styles.linkCardMeta}>{item.tagline}</span>}
              <ArrowUpRight size={15} className={styles.linkCardArrow} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

const LocationsBlock = ({ block, locations = [] }) => {
  if (locations.length === 0) return null

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {block.heading && <h2 className={styles.heading}>{block.heading}</h2>}
        {block.subheading && <p className={styles.subheading}>{block.subheading}</p>}
        <div className={styles.linkGrid}>
          {locations.map((loc) => (
            <Link key={loc.id} href={`/locations/${loc.slug}`} className={styles.linkCard}>
              <span className={styles.linkCardTitle}>{loc.city}</span>
              <span className={styles.linkCardMeta}>
                {[loc.state, loc.country].filter(Boolean).join(', ')}
              </span>
              <ArrowUpRight size={15} className={styles.linkCardArrow} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

const ClinicsBlock = ({ block, clinics = [] }) => {
  const [selectedCity, setSelectedCity] = useState('all')

  if (!clinics || clinics.length === 0) return null

  // Extract unique cities directly from clinic data
  const cities = ['all', ...Array.from(new Set(clinics.map((c) => c.city).filter(Boolean)))]

  const filteredClinics = selectedCity === 'all'
    ? clinics
    : clinics.filter((c) => c.city === selectedCity)

  return (
    <section className={styles.section} id="clinics">
      <div className={styles.container}>
        <div className={styles.clinicsHeader}>
          {block.eyebrow && <span className={styles.eyebrow}>{block.eyebrow}</span>}
          <h2 className={styles.heading}>{block.heading || 'Partner Dental Hospitals & Clinics'}</h2>
          <p className={styles.subheading}>
            {block.subheading || 'Browse our network of vetted dental hospitals and specialized clinics across India.'}
          </p>
        </div>

        {/* City Filter Tabs */}
        {cities.length > 2 && (
          <div className={styles.cityFilterWrap}>
            {cities.map((city) => (
              <button
                key={city}
                type="button"
                className={`${styles.filterPill} ${selectedCity === city ? styles.filterPillActive : ''}`}
                onClick={() => setSelectedCity(city)}
              >
                {city === 'all' ? `All Clinics (${clinics.length})` : city}
              </button>
            ))}
          </div>
        )}

        {/* Clinics Grid - retrieved directly from clinics collection, no links to locations */}
        <div className={styles.clinicsGrid}>
          {filteredClinics.map((clinic) => (
            <div key={clinic.id} className={styles.clinicCard}>
              <div className={styles.clinicCardTop}>
                <div>
                  <h3 className={styles.clinicName}>{clinic.name}</h3>
                  {clinic.city && (
                    <span className={styles.clinicCityBadge}>
                      {clinic.city}
                    </span>
                  )}
                </div>
                {clinic.rating && (
                  <div className={styles.clinicRatingBadge}>
                    <Star size={13} fill="currentColor" />
                    <span>{Number(clinic.rating).toFixed(1)}</span>
                    {clinic.reviewCount && (
                      <span className={styles.clinicReviewCount}>({clinic.reviewCount})</span>
                    )}
                  </div>
                )}
              </div>

              {clinic.address && (
                <div className={styles.clinicInfoRow}>
                  <MapPin size={14} className={styles.clinicInfoIcon} />
                  <span>{clinic.address}</span>
                </div>
              )}

              {/* Clinic phone number hidden — patients book via Atidi platform */}
              {/* {clinic.phone && (
                <div className={styles.clinicInfoRow}>
                  <Phone size={14} className={styles.clinicInfoIcon} />
                  <a href={`tel:${clinic.phone.replace(/[^0-9+]/g, '')}`} className={styles.clinicPhoneLink}>
                    {clinic.phone}
                  </a>
                </div>
              )} */}

              {clinic.specialties && clinic.specialties.length > 0 && (
                <div className={styles.clinicSpecialtiesList}>
                  {clinic.specialties.slice(0, 4).map((spec, sIdx) => (
                    <span key={sIdx} className={styles.specialtyTag}>{spec}</span>
                  ))}
                  {clinic.specialties.length > 4 && (
                    <span className={styles.specialtyTag}>+{clinic.specialties.length - 4} more</span>
                  )}
                </div>
              )}

              <div className={styles.clinicCardAction}>
                <a
                  href="https://app.atidinricare.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.clinicBookBtn}
                >
                  Book Appointment <ArrowUpRight size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * Reuses the home page FAQ section. When the editor picked specific FAQs the
 * relationship arrives as full docs, so adapt them to the {question, answer[]}
 * shape FAQ expects; otherwise fall back to every FAQ on the site.
 */
const FaqBlock = ({ block, faqs = [] }) => {
  const picked = (block.faqs || [])
    .filter((f) => typeof f === 'object' && f !== null)
    .map((f) => {
      const match = faqs.find((x) => x.question === f.question)
      return match || { question: f.question, answer: [] }
    })

  const list = picked.length > 0 ? picked : faqs
  if (list.length === 0) return null

  return <FAQ faqs={list} />
}

const CtaBlock = ({ block }) => (
  <section className={`${styles.cta} ${block.style === 'premium' ? styles.ctaPremium : ''}`}>
    <div className={styles.container}>
      <div className={styles.ctaInner}>
        <h2 className={styles.ctaHeading}>{block.heading}</h2>
        {block.subheading && <p className={styles.ctaSub}>{block.subheading}</p>}
        {block.button?.label && (
          <SmartLink href={block.button.link} className={styles.btnPrimary}>
            {block.button.label}
          </SmartLink>
        )}
      </div>
      {block.style === 'premium' && <div className={styles.ctaGlow} />}
    </div>
  </section>
)

const LegalContentBlock = ({ block }) => {
  const sections = block.sections || []
  if (sections.length === 0) return null

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.legal}>
          {sections.map((sec, i) => (
            <div key={i} className={styles.legalSection}>
              <h2 className={styles.legalTitle}>
                <Icon name={sec.icon} size={18} />
                {sec.title}
              </h2>
              {(sec.items || []).map((item, j) => (
                <div key={j} className={styles.legalItem}>
                  <h3 className={styles.legalItemHeading}>{item.heading}</h3>
                  <div className={styles.prose}>
                    <RichText content={item.content} />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------- dispatcher */

const BLOCKS = {
  hero: HeroBlock,
  richContent: RichContentBlock,
  highlight: HighlightBlock,
  statsGrid: StatsGridBlock,
  principlesList: PrinciplesListBlock,
  contactCards: ContactCardsBlock,
  treatmentsBlock: TreatmentsBlock,
  locationsBlock: LocationsBlock,
  clinicsBlock: ClinicsBlock,
  faqBlock: FaqBlock,
  ctaBlock: CtaBlock,
  legalContent: LegalContentBlock,
}

/**
 * Renders a Pages `layout` blocks array. Unknown block types are skipped
 * rather than thrown, so adding a block in Payload before it has a renderer
 * degrades to a gap instead of a crashed page.
 */
const PageBlocks = ({ layout, treatments, locations, faqs, clinics, isClinicsPage }) => (
  <>
    {(layout || []).map((block, i) => {
      // If this is the clinics page and the block is locationsBlock,
      // route to clinicsBlock so partner clinics are retrieved directly instead of locations
      const effectiveType =
        isClinicsPage && block.blockType === 'locationsBlock'
          ? 'clinicsBlock'
          : block.blockType

      const Cmp = BLOCKS[effectiveType]
      if (!Cmp) return null
      return (
        <Cmp
          key={block.id || `${block.blockType}-${i}`}
          block={block}
          treatments={treatments}
          locations={locations}
          faqs={faqs}
          clinics={clinics}
        />
      )
    })}
  </>
)

export default PageBlocks

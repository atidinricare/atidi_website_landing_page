'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import RichText from './RichText'
import styles from './AboutUs.module.css'

const DEFAULT_PRINCIPLES = [
  {
    title: 'Quality without compromise',
    desc: 'Every dentist in our network holds an MDS qualification. Every clinic meets international infrastructure and hygiene standards. No exceptions.',
  },
  {
    title: 'One price for everyone',
    desc: 'No NRI markup. No surprise charges. Every treatment has a fixed, published rate. The same for a local patient or someone flying in from Texas.',
  },
  {
    title: 'Care that crosses borders',
    desc: 'Your treatment records are digitized and shared with your US follow-up dentist. If something needs attention after you land, we handle it.',
  },
  {
    title: 'Always reachable',
    desc: 'Our dental support line runs 24/7. Before your trip, during treatment, or three months after you return. We pick up.',
  },
]

const DEFAULT_STATS = [
  { value: '121+', label: 'partner clinics across India' },
  { value: '10', label: 'US states with follow-up care' },
  { value: '24hr', label: 'appointment guarantee in the US' },
  { value: '0', label: 'hidden fees, ever' },
]

/**
 * @param {{ data?: any }} props
 */
const AboutUsClient = ({ data }) => {
  // Extract values with fallbacks
  const eyebrow = data?.opening?.eyebrow || 'About Atidi NRI Care'
  const headline = data?.opening?.headline

  const narrativeMarker = data?.narrative?.marker || 'The problem'
  const narrativeContent = data?.narrative?.content

  const turnText = data?.turn?.text

  const approachTitle = data?.approach?.title
  const approachContent = data?.approach?.content

  const stats = data?.stats && data.stats.length > 0 ? data.stats : DEFAULT_STATS

  const principlesHeading = data?.principles?.heading || 'What we stand for'
  const principlesItems =
    data?.principles?.items && data.principles.items.length > 0
      ? data.principles.items
      : DEFAULT_PRINCIPLES

  const closingTitle = data?.closing?.title || 'See the difference for yourself.'
  const closingLabel = data?.closing?.ctaLabel || 'Book an appointment'
  const closingLink = data?.closing?.ctaLink || 'https://app.atidinricare.com/'

  return (
    <div className={styles.page}>
      {/* Opening */}
      <section className={styles.opening}>
        <motion.div
          className={styles.openingInner}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <p className={styles.openingEyebrow}>{eyebrow}</p>
          <h1 className={styles.openingHeadline}>
            {headline ? (
              headline.includes('So we built it') ? (
                <>
                  {headline.replace(/So we built it.*/i, '').trim()}
                  <br />
                  <em>So we built it.</em>
                </>
              ) : (
                headline
              )
            ) : (
              <>
                We couldn&apos;t find honest
                <br />
                dental care across borders.
                <br />
                <em>So we built it.</em>
              </>
            )}
          </h1>
        </motion.div>
      </section>

      {/* Narrative */}
      <section className={styles.narrative}>
        <div className={styles.narrativeGrid}>
          <motion.div
            className={styles.narrativeLeft}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className={styles.narrativeMarker}>{narrativeMarker}</span>
          </motion.div>
          <motion.div
            className={styles.narrativeRight}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            {narrativeContent ? (
              <RichText content={narrativeContent} />
            ) : (
              <>
                <p className={styles.narrativeLead}>
                  For NRIs visiting India, finding the right dentist has always been a gamble.
                </p>
                <p>
                  You ask family, search online, get conflicting recommendations, and when you
                  finally walk into a clinic, there&apos;s no way to verify the dentist&apos;s
                  qualifications or whether the materials meet international standards.
                </p>
                <p>
                  Then there&apos;s the pricing. The moment a clinic learns you&apos;re an NRI,
                  costs quietly double. What should be a straightforward procedure turns into an
                  opaque, overpriced experience with no accountability.
                </p>
                <p>
                  And if something goes wrong after you return to the US? Finding a dentist willing
                  to do follow-up work on a procedure they didn&apos;t perform, with no records to
                  reference, is nearly impossible.
                </p>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* Turning point */}
      <section className={styles.turnSection}>
        <motion.div
          className={styles.turnInner}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <div className={styles.turnText}>
            {turnText ? (
              <RichText content={turnText} />
            ) : (
              <p>
                We lived through all of this.
                <br />
                And we knew there had to be a better way.
              </p>
            )}
          </div>
        </motion.div>
      </section>

      {/* What we do differently — two-column */}
      <section className={styles.approach}>
        <div className={styles.approachGrid}>
          <motion.div
            className={styles.approachLeft}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className={styles.approachTitle}>
              {approachTitle || (
                <>
                  What Atidi
                  <br />
                  does differently
                </>
              )}
            </h2>
          </motion.div>
          <motion.div
            className={styles.approachRight}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            {approachContent ? (
              <RichText content={approachContent} />
            ) : (
              <>
                <p>
                  Atidi NRI Care exists to remove the uncertainty from dental tourism. We&apos;ve
                  built a network of vetted clinics with MDS-qualified dentists, standardized
                  pricing, and complete documentation, so every NRI gets the same quality of care
                  regardless of which clinic they visit.
                </p>
                <p>
                  When you return to the US, your treatment doesn&apos;t end. Our partner clinics
                  across 10 states provide follow-up care with full access to your India records.
                  Minor adjustments are covered. Appointments are guaranteed within 24 hours. And
                  our support line never closes.
                </p>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* Numbers — inline, not a grid */}
      <section className={styles.numbers}>
        <motion.div
          className={styles.numbersInner}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {stats.map((stat, idx) => (
            <div key={idx} className={styles.numberRow}>
              <span className={styles.num}>{stat.value}</span>
              <span className={styles.numLabel}>{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Principles — numbered stack */}
      <section className={styles.principles}>
        <div className={styles.principlesInner}>
          <motion.h2
            className={styles.principlesTitle}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {principlesHeading}
          </motion.h2>

          <div className={styles.principlesStack}>
            {principlesItems.map((item, index) => (
              <motion.div
                key={index}
                className={styles.principleRow}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.08 * index }}
              >
                <span className={styles.principleNum}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className={styles.principleBody}>
                  <h3>{item.title}</h3>
                  {typeof item.desc === 'object' || typeof item.description === 'object' ? (
                    <RichText content={item.description || item.desc} />
                  ) : (
                    <p>{item.desc || item.description}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className={styles.closing}>
        <motion.div
          className={styles.closingInner}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className={styles.closingTitle}>{closingTitle}</h2>
          <a
            href={closingLink}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.closingLink}
          >
            {closingLabel}
            <ArrowRight size={20} />
          </a>
        </motion.div>
      </section>
    </div>
  )
}

export default AboutUsClient

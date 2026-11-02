'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import RichText from './RichText'
import styles from './OurServices.module.css'

const DEFAULT_STEPS = [
  {
    step: '01',
    title: 'Application & Credential Verification',
    desc: 'Clinics submit documentation including dentist qualifications (MDS mandatory), infrastructure details, and equipment inventory. Our team verifies every certificate with issuing authorities.',
  },
  {
    step: '02',
    title: 'On-Site Infrastructure Audit',
    desc: 'A physical inspection of the facility covering treatment rooms, sterilization equipment (autoclave validation), X-ray and imaging capabilities, and patient comfort standards.',
  },
  {
    step: '03',
    title: 'Material & Supply Chain Review',
    desc: 'We verify that clinics use only international-grade materials — Nobel Biocare, Straumann, E-max, and equivalent brands. No compromises on material quality, ever.',
  },
  {
    step: '04',
    title: 'Pricing Standardization',
    desc: "Clinics agree to Atidi's standardized pricing structure. No NRI markup, no hidden charges. The same rate for every patient, published transparently.",
  },
  {
    step: '05',
    title: 'Ongoing Performance Monitoring',
    desc: 'Post-empanelment, clinics undergo quarterly reviews covering patient feedback, complication rates, and protocol adherence. Clinics that fall below standards are suspended.',
  },
]

const DEFAULT_STATS = [
  { value: '24/7', label: 'dental tele-support' },
  { value: '10', label: 'US states covered' },
  { value: '121+', label: 'vetted partner clinics' },
  { value: '5', label: 'step clinic vetting process' },
]

/**
 * @param {{ data?: any }} props
 */
const OurServicesClient = ({ data }) => {
  const openingEyebrow = data?.hero?.eyebrow || 'Our Services'
  const openingHeadline = data?.hero?.headline
  const openingSub = data?.hero?.subheadline

  const steps =
    data?.steps && data.steps.length > 0
      ? data.steps.map((st, i) => ({
          step: String(i + 1).padStart(2, '0'),
          title: (st.title || '').replace(/^\d+\.\s*/, ''),
          desc: st.description || st.desc,
        }))
      : DEFAULT_STEPS

  const stats = data?.stats && data.stats.length > 0 ? data.stats : DEFAULT_STATS

  const closingTitle = data?.closing?.title || 'Ready to experience the difference?'
  const closingLabel = data?.closing?.buttonLabel || 'Book a free consultation'
  const closingLink = data?.closing?.buttonLink || 'https://app.atidinricare.com/'

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
          <p className={styles.openingEyebrow}>{openingEyebrow}</p>
          <h1 className={styles.openingHeadline}>
            {openingHeadline ? (
              openingHeadline.includes('takes off') ? (
                <>
                  {openingHeadline.replace(/takes off.*/i, '').trim()}
                  <br />
                  <em>takes off.</em>
                </>
              ) : (
                openingHeadline
              )
            ) : (
              <>
                Dental care that doesn&apos;t
                <br />
                end when your flight
                <br />
                <em>takes off.</em>
              </>
            )}
          </h1>
          <p className={styles.openingSub}>
            {openingSub ||
              "From the first consultation call to your last follow-up visit in the US, Atidi NRI Care manages every step. Here's how we do it."}
          </p>
        </motion.div>
      </section>

      {/* Service 1: Tele Support */}
      <section className={styles.serviceSection}>
        <div className={styles.serviceGrid}>
          <motion.div
            className={styles.serviceLeft}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className={styles.serviceNum}>01</span>
            <h2 className={styles.serviceTitle}>
              {data?.service1?.title ? (
                data.service1.title
              ) : (
                <>
                  Tele Support
                  <br />
                  for Emergencies
                </>
              )}
            </h2>
          </motion.div>
          <motion.div
            className={styles.serviceRight}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            {data?.service1?.content ? (
              <RichText content={data.service1.content} />
            ) : (
              <>
                <p className={styles.serviceLead}>
                  Dental emergencies don&apos;t wait for office hours. Neither do we.
                </p>
                <p>
                  Our 24/7 tele-dental support line connects you directly with qualified dentists
                  who have access to your complete treatment history. Whether it&apos;s a sudden
                  sensitivity after an implant procedure, a crown that feels off, or post-operative
                  swelling that concerns you — help is one call away.
                </p>
                <p>
                  Unlike generic telemedicine platforms, our dental specialists know your exact
                  treatment plan, the materials used, and the procedures performed. They can
                  provide immediate guidance, prescribe medication when necessary, and coordinate
                  in-person follow-up with your nearest US partner clinic within 24 hours.
                </p>
              </>
            )}
            <div className={styles.highlights}>
              <div className={styles.highlight}>
                <span className={styles.highlightLabel}>Available</span>
                <span className={styles.highlightValue}>24/7, 365 days</span>
              </div>
              <div className={styles.highlight}>
                <span className={styles.highlightLabel}>Response time</span>
                <span className={styles.highlightValue}>Under 15 minutes</span>
              </div>
              <div className={styles.highlight}>
                <span className={styles.highlightLabel}>Languages</span>
                <span className={styles.highlightValue}>English, Hindi, Telugu</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Service 2: US Appointments */}
      <section className={styles.serviceSection}>
        <div className={styles.serviceGrid}>
          <motion.div
            className={styles.serviceLeft}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className={styles.serviceNum}>02</span>
            <h2 className={styles.serviceTitle}>
              {data?.service2?.title ? (
                data.service2.title
              ) : (
                <>
                  US-Based
                  <br />
                  Appointments,
                  <br />
                  Made Faster
                </>
              )}
            </h2>
          </motion.div>
          <motion.div
            className={styles.serviceRight}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            {data?.service2?.content ? (
              <RichText content={data.service2.content} />
            ) : (
              <>
                <p className={styles.serviceLead}>
                  Follow-up care in the US shouldn&apos;t mean starting over with a new dentist who
                  knows nothing about your treatment.
                </p>
                <p>
                  Our network spans 10 US states with partner dentists who are briefed on Atidi
                  protocols and have direct access to your treatment records from India. When you
                  need a follow-up — whether it&apos;s a routine check after implant placement, a
                  crown adjustment, or aligner monitoring — we schedule it for you.
                </p>
                <p>
                  You call us, not the clinic. We handle the scheduling, transfer your records, and
                  confirm the appointment. Most follow-ups are booked within 24 hours of your
                  request. For warranty-covered corrections, there&apos;s no additional cost to
                  you.
                </p>
                <p>
                  Our US partner clinics cover New Jersey, New York, Pennsylvania, Tennessee,
                  Virginia, Connecticut, Massachusetts, Maryland, North Carolina, and Texas — with
                  more states being added quarterly.
                </p>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* Accent break */}
      <section className={styles.accentBreak}>
        <motion.div
          className={styles.accentInner}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <div className={styles.accentText}>
            {data?.accent?.text ? (
              <RichText content={data.accent.text} />
            ) : (
              <>
                We don&apos;t just connect you to clinics.
                <br />
                We built the system that makes them accountable.
              </>
            )}
          </div>
        </motion.div>
      </section>

      {/* Service 3: Clinic Empanelment */}
      <section className={styles.serviceSection}>
        <div className={styles.serviceGrid}>
          <motion.div
            className={styles.serviceLeft}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className={styles.serviceNum}>03</span>
            <h2 className={styles.serviceTitle}>
              {data?.service3?.title ? (
                data.service3.title
              ) : (
                <>
                  Indian Clinic
                  <br />
                  Empanelment
                  <br />
                  Process
                </>
              )}
            </h2>
          </motion.div>
          <motion.div
            className={styles.serviceRight}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            {data?.service3?.content ? (
              <RichText content={data.service3.content} />
            ) : (
              <>
                <p className={styles.serviceLead}>
                  Not every clinic qualifies. That&apos;s the point.
                </p>
                <p>
                  Every clinic in the Atidi network goes through a rigorous 5-step empanelment
                  process before they can treat a single patient. We don&apos;t rely on
                  self-reported credentials or online reviews. Our team physically inspects every
                  facility, verifies every dentist&apos;s qualifications, and audits their
                  sterilization protocols against international standards.
                </p>
              </>
            )}
            <div className={styles.steps}>
              {steps.map((item, index) => (
                <motion.div
                  key={index}
                  className={styles.stepRow}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.08 * index }}
                >
                  <span className={styles.stepNum}>{item.step}</span>
                  <div className={styles.stepBody}>
                    <h3>{item.title}</h3>
                    {typeof item.desc === 'object' ? (
                      <RichText content={item.desc} />
                    ) : (
                      <p>{item.desc}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Service 4: 360 Dental Care */}
      <section className={styles.serviceSection}>
        <div className={styles.serviceGrid}>
          <motion.div
            className={styles.serviceLeft}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className={styles.serviceNum}>04</span>
            <h2 className={styles.serviceTitle}>
              {data?.service4?.title ? (
                data.service4.title
              ) : (
                <>
                  360° Dental
                  <br />
                  Care
                </>
              )}
            </h2>
          </motion.div>
          <motion.div
            className={styles.serviceRight}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            {data?.service4?.content ? (
              <RichText content={data.service4.content} />
            ) : (
              <>
                <p className={styles.serviceLead}>
                  From the moment you reach out to us until your last follow-up visit, every
                  touchpoint is managed.
                </p>
                <p>
                  360° Dental Care is our end-to-end model that covers every phase of your dental
                  journey. It begins with a free virtual consultation where we review your dental
                  records, X-rays, and photos. Our dental team creates a detailed treatment plan
                  with transparent pricing — no estimates, fixed costs.
                </p>
                <p>
                  When you&apos;re ready to travel, our concierge team assists with appointment
                  scheduling around your India visit. We arrange airport pickup, recommend partner
                  hotels near your clinic, and ensure your first appointment is confirmed before
                  you land.
                </p>
                <p>
                  During treatment, you receive digital documentation of every procedure — materials
                  used, X-rays taken, clinical notes. This complete record is shared with your
                  assigned US follow-up dentist before you even board your return flight.
                </p>
                <p>
                  Back in the US, your follow-up care is pre-arranged. Regular check-ins, scheduled
                  appointments, and our 24/7 support line ensure nothing falls through the cracks.
                  Warranty-covered corrections are handled at zero additional cost through our
                  partner network.
                </p>
              </>
            )}
            <div className={styles.highlights}>
              <div className={styles.highlight}>
                <span className={styles.highlightLabel}>Consultation</span>
                <span className={styles.highlightValue}>Free, virtual</span>
              </div>
              <div className={styles.highlight}>
                <span className={styles.highlightLabel}>Documentation</span>
                <span className={styles.highlightValue}>100% digital records</span>
              </div>
              <div className={styles.highlight}>
                <span className={styles.highlightLabel}>Warranty</span>
                <span className={styles.highlightValue}>2-10 years coverage</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Numbers */}
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

export default OurServicesClient

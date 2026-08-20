'use client'

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import styles from './AboutUs.module.css';

const AboutUsClient = () => {
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
          <p className={styles.openingEyebrow}>About Atidi NRI Care</p>
          <h1 className={styles.openingHeadline}>
            We couldn't find honest<br />
            dental care across borders.<br />
            <em>So we built it.</em>
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
            <span className={styles.narrativeMarker}>The problem</span>
          </motion.div>
          <motion.div
            className={styles.narrativeRight}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <p className={styles.narrativeLead}>
              For NRIs visiting India, finding the right dentist has always been a gamble.
            </p>
            <p>
              You ask family, search online, get conflicting recommendations, and when you finally walk into a clinic, there's no way to verify the dentist's qualifications or whether the materials meet international standards.
            </p>
            <p>
              Then there's the pricing. The moment a clinic learns you're an NRI, costs quietly double. What should be a straightforward procedure turns into an opaque, overpriced experience with no accountability.
            </p>
            <p>
              And if something goes wrong after you return to the US? Finding a dentist willing to do follow-up work on a procedure they didn't perform, with no records to reference, is nearly impossible.
            </p>
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
          <p className={styles.turnText}>
            We lived through all of this.<br />
            And we knew there had to be a better way.
          </p>
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
              What Atidi<br />does differently
            </h2>
          </motion.div>
          <motion.div
            className={styles.approachRight}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <p>
              Atidi NRI Care exists to remove the uncertainty from dental tourism. We've built a network of vetted clinics with MDS-qualified dentists, standardized pricing, and complete documentation, so every NRI gets the same quality of care regardless of which clinic they visit.
            </p>
            <p>
              When you return to the US, your treatment doesn't end. Our partner clinics across 10 states provide follow-up care with full access to your India records. Minor adjustments are covered. Appointments are guaranteed within 24 hours. And our support line never closes.
            </p>
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
          <div className={styles.numberRow}>
            <span className={styles.num}>121+</span>
            <span className={styles.numLabel}>partner clinics across India</span>
          </div>
          <div className={styles.numberRow}>
            <span className={styles.num}>10</span>
            <span className={styles.numLabel}>US states with follow-up care</span>
          </div>
          <div className={styles.numberRow}>
            <span className={styles.num}>24hr</span>
            <span className={styles.numLabel}>appointment guarantee in the US</span>
          </div>
          <div className={styles.numberRow}>
            <span className={styles.num}>0</span>
            <span className={styles.numLabel}>hidden fees, ever</span>
          </div>
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
            What we stand for
          </motion.h2>

          <div className={styles.principlesStack}>
            {[
              {
                title: 'Quality without compromise',
                desc: 'Every dentist in our network holds an MDS qualification. Every clinic meets international infrastructure and hygiene standards. No exceptions.'
              },
              {
                title: 'One price for everyone',
                desc: 'No NRI markup. No surprise charges. Every treatment has a fixed, published rate. The same for a local patient or someone flying in from Texas.'
              },
              {
                title: 'Care that crosses borders',
                desc: 'Your treatment records are digitized and shared with your US follow-up dentist. If something needs attention after you land, we handle it.'
              },
              {
                title: 'Always reachable',
                desc: 'Our dental support line runs 24/7. Before your trip, during treatment, or three months after you return. We pick up.'
              }
            ].map((item, index) => (
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
                  <p>{item.desc}</p>
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
          <h2 className={styles.closingTitle}>
            See the difference for yourself.
          </h2>
          <a
            href="https://app.atidinricare.com/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.closingLink}
          >
            Book an appointment
            <ArrowRight size={20} />
          </a>
        </motion.div>
      </section>
    </div>
  );
};

export default AboutUsClient;

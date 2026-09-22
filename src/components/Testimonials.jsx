'use client'
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ArrowLeft, ArrowRight, Play } from 'lucide-react';
import styles from './Testimonials.module.css';

/**
 * Home page testimonial carousel.
 *
 * Content comes from the Testimonials collection (status = Published).
 * Renders nothing at all when there is nothing published, so the home page
 * is unaffected until the first testimonial goes live.
 */
const Testimonials = ({ testimonials }) => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  const active = testimonials[index];
  const total = testimonials.length;
  const pad = (n) => String(n).padStart(2, '0');

  const go = (step) => {
    setDirection(step);
    setIndex((prev) => (prev + step + total) % total);
  };

  return (
    <section className={styles.section} id="testimonials">
      <div className={styles.bg} />
      <div className={styles.bgGradient} />

      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <motion.span
              className={styles.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Testimonials
            </motion.span>
            <motion.h2
              className={styles.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className={styles.titleLine1}>Their words<span className={styles.comma}>,</span></span>
              <span className={styles.titleLine2}><em>their journey</em><span className={styles.dot}>.</span></span>
            </motion.h2>
          </div>

          <motion.div
            className={styles.headerRight}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className={styles.subtitle}>
              Patients who travelled for treatment, in their own words
            </p>
            <div className={styles.counter}>
              <span className={styles.counterCurrent}>{pad(index + 1)}</span>
              <span className={styles.counterDivider}>/</span>
              <span className={styles.counterTotal}>{pad(total)}</span>
            </div>
          </motion.div>
        </div>

        {/* Quote card */}
        <motion.div
          className={styles.stage}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.article
              key={active.id ?? index}
              className={styles.card}
              custom={direction}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -40 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className={styles.quoteMark} aria-hidden="true">&ldquo;</span>

              {active.rating ? (
                <div className={styles.rating} aria-label={`Rated ${active.rating} out of 5`}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      size={15}
                      className={i < active.rating ? styles.starOn : styles.starOff}
                      aria-hidden="true"
                    />
                  ))}
                </div>
              ) : null}

              <blockquote className={styles.quote}>
                {active.quote.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </blockquote>

              <footer className={styles.attribution}>
                <div className={styles.who}>
                  <span className={styles.name}>{active.patientName}</span>
                  {active.location ? (
                    <span className={styles.meta}>{active.location}</span>
                  ) : null}
                </div>

                <div className={styles.tags}>
                  {active.treatment ? (
                    <span className={styles.treatment}>{active.treatment}</span>
                  ) : null}
                  {active.videoUrl ? (
                    <a
                      className={styles.videoLink}
                      href={active.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Play size={13} aria-hidden="true" />
                      Watch story
                    </a>
                  ) : null}
                </div>
              </footer>
            </motion.article>
          </AnimatePresence>

          {total > 1 && (
            <div className={styles.controls}>
              <button
                type="button"
                className={styles.navButton}
                onClick={() => go(-1)}
                aria-label="Previous testimonial"
              >
                <ArrowLeft size={17} />
              </button>
              <button
                type="button"
                className={styles.navButton}
                onClick={() => go(1)}
                aria-label="Next testimonial"
              >
                <ArrowRight size={17} />
              </button>
            </div>
          )}
        </motion.div>

        {/* Dots */}
        {total > 1 && (
          <div className={styles.dots}>
            {testimonials.map((item, i) => (
              <button
                key={item.id ?? i}
                type="button"
                className={`${styles.dotButton} ${i === index ? styles.dotActive : ''}`}
                onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i); }}
                aria-label={`Show testimonial ${i + 1} of ${total}`}
                aria-current={i === index}
              />
            ))}
          </div>
        )}
      </div>

      {/* Background text */}
      <motion.span
        className={styles.bgText}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.02 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
      >
        Stories
      </motion.span>
    </section>
  );
};

export default Testimonials;

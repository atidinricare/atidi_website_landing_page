'use client'
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Plus } from 'lucide-react';
import styles from './Treatments.module.css';

const INITIAL_COUNT = 20;
const LOAD_MORE_COUNT = 4;

const Treatments = ({ treatments, onSelectTreatment }) => {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  const visibleTreatments = treatments.slice(0, visibleCount);
  const hasMore = visibleCount < treatments.length;
  const remaining = treatments.length - visibleCount;

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + LOAD_MORE_COUNT, treatments.length));
  };

  return (
    <section className={styles.section} id="treatments">
      <div className={styles.bg} />
      <div className={styles.bgGradient} />

      <div className={styles.container}>
        {/* Header - Asymmetric Layout */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <motion.span
              className={styles.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Treatments
            </motion.span>
            <motion.h2
              className={styles.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className={styles.titleLine1}>World-class</span>
              <span className={styles.titleLine2}>procedures<span className={styles.comma}>,</span></span>
              <span className={styles.titleLine3}>
                <em>fraction</em> of the cost<span className={styles.dot}>.</span>
              </span>
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
              Click on treatment to see full details and procedure information
            </p>
{/* View all link hidden temporarily
            <a href="#" className={styles.viewAllLink}>
              <span>View all treatments</span>
              <ArrowUpRight size={14} />
            </a>
            */}
          </motion.div>
        </div>

        {/* Cards Grid */}
        <div className={styles.grid}>
          <AnimatePresence>
            {visibleTreatments.map((treatment, index) => (
              <motion.article
                key={treatment.id}
                className={styles.card}
                onClick={() => onSelectTreatment(treatment)}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: index < INITIAL_COUNT ? index * 0.1 : (index - visibleCount + LOAD_MORE_COUNT) * 0.1 }}
              >
                <div className={styles.cardInner}>
                  <div className={styles.cardTop}>
                    <div className={styles.cardMeta}>
                      <span className={styles.cardCategory}>{treatment.category}</span>
                      {/* Savings hidden temporarily
                      <span className={styles.cardSave}>{treatment.savingsPercent}%</span>
                      */}
                    </div>
                    <div className={styles.cardAction}>
                      <ArrowUpRight size={16} />
                    </div>
                  </div>

                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>{treatment.name}</h3>
                    <p className={styles.cardDesc}>{treatment.tagline}</p>
                  </div>

                  {/* Price hidden temporarily
                  <div className={styles.cardFooter}>
                    <span className={styles.priceLabel}>From</span>
                    <span className={styles.priceValue}>${treatment.indiaPrice.min}</span>
                  </div>
                  */}
                </div>

                <div className={styles.cardHoverLine} />
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {/* Load More Button */}
        {hasMore && (
          <motion.div
            className={styles.loadMoreWrapper}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <button className={styles.loadMoreBtn} onClick={handleLoadMore}>
              <Plus size={18} />
              <span>Load More Treatments</span>
              <span className={styles.loadMoreCount}>{remaining}</span>
            </button>
          </motion.div>
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
        CARE
      </motion.span>
    </section>
  );
};

export default Treatments;

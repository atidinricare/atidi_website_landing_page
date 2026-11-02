'use client'
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Plus } from 'lucide-react';
import styles from './Treatments.module.css';

const INITIAL_COUNT = 20;
const LOAD_MORE_COUNT = 4;

const Treatments = ({ treatments, treatmentsHeader, onSelectTreatment }) => {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  const visibleTreatments = treatments.slice(0, visibleCount);
  const hasMore = visibleCount < treatments.length;
  const remaining = treatments.length - visibleCount;

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + LOAD_MORE_COUNT, treatments.length));
  };

  const labelText = treatmentsHeader?.eyebrow || 'Treatments';
  const headingText = treatmentsHeader?.heading;
  const subtitleText =
    treatmentsHeader?.subheading ||
    'Click on treatment to see full details and procedure information';

  const formatLineHtml = (text) => {
    // 1. Replace *word* with <em>word</em>
    let html = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    // If "fraction" exists without asterisks, highlight it
    if (!html.includes('<em>')) {
      html = html.replace(/\bfraction\b/gi, '<em>$&</em>');
    }
    // 2. Wrap commas with styled comma
    html = html.replace(/,/g, `<span class="${styles.comma}">,</span>`);
    // 3. Wrap trailing period with styled dot
    html = html.replace(/\.$/, `<span class="${styles.dot}">.</span>`);
    return html;
  };

  const renderTitle = () => {
    let lines = [];
    if (headingText && headingText.trim()) {
      const raw = headingText.trim();
      if (raw.includes('\n')) {
        lines = raw.split('\n').map((l) => l.trim()).filter(Boolean);
      } else if (raw.toLowerCase().includes('procedures') && raw.toLowerCase().includes('cost')) {
        // Smart split if provided on a single line without newlines
        lines = [
          'World-class',
          'procedures,',
          '*fraction* of the',
          'cost.',
        ];
      } else {
        lines = [raw];
      }
    } else {
      lines = [
        'World-class',
        'procedures,',
        '*fraction* of the',
        'cost.',
      ];
    }

    return (
      <>
        {lines.map((line, idx) => {
          let cls = styles.titleLine1;
          if (idx === 1) cls = styles.titleLine2;
          else if (idx === 2) cls = styles.titleLine3;
          else if (idx >= 3) cls = styles.titleLine4;

          return (
            <span
              key={idx}
              className={cls}
              dangerouslySetInnerHTML={{
                __html: formatLineHtml(line),
              }}
            />
          );
        })}
      </>
    );
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
              {labelText}
            </motion.span>
            <motion.h2
              className={styles.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {renderTitle()}
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
              {subtitleText}
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

'use client'
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import styles from './TreatmentCard.module.css';

const TreatmentCard = ({ treatment, onClick, index = 0 }) => {
  return (
    <motion.article
      className={styles.card}
      onClick={onClick}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8 }}
    >
      <div className={styles.arrowIcon}>
        <ArrowUpRight size={16} />
      </div>
      <div className={styles.content}>
        <span className={styles.category}>{treatment.category}</span>
        <h3 className={styles.name}>{treatment.name}</h3>
        <p className={styles.tagline}>{treatment.tagline}</p>

      </div>

      <div className={styles.footer}>
        {/* Price hidden temporarily
        <div className={styles.price}>
          <span className={styles.priceLabel}>From</span>
          <span className={styles.priceValue}>${treatment.indiaPrice.min}</span>
        </div>
        */}
        <button className={styles.viewBtn}>
          <span>View Details</span>
          <ArrowRight size={16} />
        </button>
      </div>

      <div className={styles.hoverLine} />
    </motion.article>
  );
};

export default TreatmentCard;

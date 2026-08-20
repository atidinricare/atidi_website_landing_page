'use client'
import { motion } from 'framer-motion';
import { MapPin, Building2, Users, ArrowRight } from 'lucide-react';
import styles from './LocationCard.module.css';

const LocationCard = ({ location, onClick, index = 0 }) => {
  const isIndia = location.type === 'treatment';

  return (
    <motion.article
      className={`${styles.card} ${isIndia ? styles.india : styles.usa}`}
      onClick={onClick}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8 }}
    >
      <div className={styles.pinIcon}>
        <MapPin size={18} />
      </div>
      <div className={styles.badge}>
        {isIndia ? '🇮🇳' : '🇺🇸'}
        <span>{isIndia ? 'Treatment' : 'Follow-up'}</span>
      </div>

      <div className={styles.content}>
        <h3 className={styles.city}>
          {location.city}
          {location.stateCode && <span className={styles.stateCode}>, {location.stateCode}</span>}
        </h3>
        <p className={styles.tagline}>{location.tagline}</p>

        <div className={styles.stats}>
          {isIndia ? (
            <>
              <div className={styles.stat}>
                <Users size={16} />
                <span>{location.doctors} Dental Clinics</span>
              </div>
              <div className={styles.stat}>
                <Building2 size={16} />
                <span>{location.clinics?.length} Clinics</span>
              </div>
            </>
          ) : null}
        </div>
      </div>

      <button className={styles.viewBtn}>
        <span>Explore</span>
        <ArrowRight size={16} />
      </button>
    </motion.article>
  );
};

export default LocationCard;

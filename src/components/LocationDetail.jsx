'use client'
import { motion } from 'framer-motion';
import {
  Phone, CheckCircle,
  Plane, Clock, Calendar, ArrowRight, Shield
} from 'lucide-react';
import styles from './LocationDetail.module.css';

const LocationDetail = ({ location }) => {
  if (!location) return null;

  const isIndia = location.type === 'treatment';

  const usaServices = [
    { category: 'General Dentistry', items: 'Scalings, Fillings, Extractions etc.' },
    { category: 'Advanced Dental Services', items: 'Implants, Invisalign/Clear Aligners, Smile Makeover etc.' },
    { category: 'Follow-up & Post-Operative Care', items: 'Post-treatment checkups, adjustments, and ongoing care.' },
  ];

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <div className={`${styles.hero} ${isIndia ? styles.india : styles.usa}`}>
        <div className={styles.heroOverlay}>
          <div className={styles.locationBadge}>
            {isIndia ? '\u{1F1EE}\u{1F1F3}' : '\u{1F1FA}\u{1F1F8}'}
            <span>{isIndia ? 'Empaneled Hospital' : 'Empaneled Hospital'}</span>
          </div>
          <h1 className={styles.title}>
            {location.city}
            {location.stateCode && `, ${location.stateCode}`}
          </h1>
          <p className={styles.tagline}>
            {isIndia
              ? location.tagline
              : `For new or follow-up care across ${location.state || 'the state'}`}
          </p>
        </div>
      </div>

      {/* Quick Info */}
      {!isIndia && (
        <div className={styles.quickInfo}>
          <div className={styles.infoItem}>
            <Clock size={18} />
            <span>Same Day Appointment Guarantee</span>
          </div>
        </div>
      )}

      {/* Description */}
      <section className={styles.section}>
        {isIndia ? (
          <>
            <p className={styles.description}>{location.description}</p>
            <p className={styles.careManagerNote}>
              After booking, our care managers coordinate with both you and the hospital — handling appointment scheduling, treatment planning, records transfer, and follow-up arrangements so your dental journey is smooth and stress-free.
            </p>
          </>
        ) : (
          <p className={styles.description}>{location.description}</p>
        )}
      </section>

      {/* Facilities (India) / Services (USA - updated) */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          {isIndia ? 'Facilities' : 'Services Available'}
        </h2>
        {isIndia ? (
          <div className={styles.facilitiesList}>
            {location.facilities?.map((item, index) => (
              <motion.div
                key={index}
                className={styles.facilityItem}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index }}
              >
                <CheckCircle size={16} className={styles.facilityCheck} />
                <span>{item}</span>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className={styles.serviceCategories}>
            {usaServices.map((svc, index) => (
              <motion.div
                key={index}
                className={styles.serviceCategory}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index }}
              >
                <h4 className={styles.serviceCategoryTitle}>{svc.category}</h4>
                <p className={styles.serviceCategoryDesc}>{svc.items}</p>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Guarantee (USA only) */}
      {!isIndia && (
        <section className={styles.guarantee}>
          <Shield size={24} />
          <div>
            <h3>Same Day Appointment Guarantee</h3>
            <p>New or follow-up appointments will be guaranteed on same day or within 24 hours at any nearest partner clinic.</p>
          </div>
        </section>
      )}

      {/* Emergency Line */}
      {!isIndia && location.emergencyLine && (
        <section className={styles.emergency}>
          <Phone size={20} />
          <div>
            <span className={styles.emergencyLabel}>24/7 Emergency Line</span>
            <span className={styles.emergencyNumber}>{location.emergencyLine}</span>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className={styles.cta}>
        <h3>Ready to visit?</h3>
        <p>
          Book an appointment and our care managers will plan every step for your smooth dental journey.
        </p>
        <a href="https://app.atidinricare.com/" target="_blank" rel="noopener noreferrer" className={styles.ctaBtn}>
          <Calendar size={18} />
          Book an Appointment
          <ArrowRight size={18} />
        </a>
      </section>
    </div>
  );
};

export default LocationDetail;

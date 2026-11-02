'use client'
import { motion } from 'framer-motion';
import styles from './MediaLogos.module.css';

const mediaLogos = [
  { name: 'Times of India', className: 'timesOfIndia' },
  { name: 'Entrepreneur', className: 'entrepreneur' },
  { name: 'Forbes', className: 'forbes' },
  { name: 'The Economic Times', className: 'economicTimes' },
  { name: 'Business Standard', className: 'businessStandard' },
  { name: 'YourStory', className: 'yourStory' },
];

const MediaLogos = () => {
  return (
    <section className={styles.section}>
      <motion.div
        className={styles.container}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className={styles.heading}>As Featured In</span>
        <div className={styles.logos}>
          {mediaLogos.map((logo, index) => (
            <motion.div
              key={logo.name}
              className={`${styles.logo} ${styles[logo.className]}`}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + index * 0.05, duration: 0.4 }}
            >
              {logo.name}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default MediaLogos;

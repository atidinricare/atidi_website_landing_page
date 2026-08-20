'use client'
import { motion } from 'framer-motion';
import styles from './TrustBanner.module.css';

const mediaLogos = [
  { name: 'Times of India', className: 'timesOfIndia' },
  { name: 'Entrepreneur', className: 'entrepreneur' },
  { name: 'The Economic Times', className: 'economicTimes' },
  { name: 'Business Standard', className: 'businessStandard' },
  { name: 'YourStory', className: 'yourStory' },
];

// Custom SVG Line Icons
const HospitalIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="8" width="24" height="20" rx="1" />
    <path d="M4 14h24" />
    <path d="M12 8V4h8v4" />
    <path d="M16 18v6" />
    <path d="M13 21h6" />
  </svg>
);

const SavingsIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="16" cy="16" r="12" />
    <path d="M12 13c0-1.5 1.5-2.5 4-2.5s4 1 4 2.5c0 2-3 2.5-3 4.5" />
    <path d="M16 22v1" />
    <path d="M11 9l-3-3" />
    <path d="M21 9l3-3" />
  </svg>
);

const SupportIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="16" cy="16" r="12" />
    <circle cx="16" cy="16" r="5" />
    <path d="M16 4v3" />
    <path d="M16 25v3" />
    <path d="M4 16h3" />
    <path d="M25 16h3" />
  </svg>
);

const RecordsIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="4" width="20" height="24" rx="2" />
    <path d="M10 10h12" />
    <path d="M10 15h12" />
    <path d="M10 20h8" />
    <circle cx="20" cy="22" r="4" />
    <path d="M22 24l2 2" />
  </svg>
);

const trustItems = [
  {
    Icon: HospitalIcon,
    number: '121',
    title: 'Certified Hospitals',
    subtitle: 'Verified premium dental facilities'
  },
  {
    Icon: SavingsIcon,
    number: '80%',
    title: 'Cost Savings',
    subtitle: 'Compared to US treatment'
  },
  {
    Icon: SupportIcon,
    number: '24/7',
    title: 'USA Support',
    subtitle: 'Round-the-clock assistance'
  },
  {
    Icon: RecordsIcon,
    number: '100%',
    title: 'Digital Records',
    subtitle: 'Instant secure access'
  }
];

const cardVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const logoVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

const TrustBanner = () => {
  return (
    <section className={styles.section}>
      <motion.div
        className={styles.card}
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <div className={styles.grid}>
          {trustItems.map((item, index) => (
            <motion.div
              key={index}
              className={styles.item}
              variants={itemVariants}
            >
              <div className={styles.iconWrap}>
                <item.Icon />
              </div>
              <div className={styles.text}>
                <span className={styles.number}>{item.number}</span>
                <span className={styles.title}>{item.title}</span>
                <span className={styles.subtitle}>{item.subtitle}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Media Logos */}
        <motion.span className={styles.mediaHeading} variants={itemVariants}>
          As Featured In
        </motion.span>
        <div className={styles.mediaLogos}>
          {mediaLogos.map((logo, index) => (
            <motion.div
              key={logo.name}
              className={`${styles.logo} ${styles[logo.className]}`}
              variants={logoVariants}
            >
              {logo.name}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default TrustBanner;

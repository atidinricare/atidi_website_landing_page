'use client'
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import { getImageUrl } from '@/lib/image-url';
import styles from './JourneyCTA.module.css';

// Default fallback app screens to display if CMS has not yet configured any
const defaultAppScreens = [
  {
    id: 1,
    image: '/appimage4.jpeg',
    label: '01',
  },
  {
    id: 2,
    image: '/appimage3.jpeg',
    label: '02',
  },
  {
    id: 3,
    image: '/appimage2.jpeg',
    label: '03',
  },
  {
    id: 4,
    image: '/appimage1.jpeg',
    label: '04',
  },
];

const JourneyCTA = ({ ctaBlock, assetBaseUrl } = {}) => {
  const screens = (ctaBlock?.screens && ctaBlock.screens.length > 0)
    ? ctaBlock.screens
    : defaultAppScreens;

  const label = ctaBlock?.eyebrow || 'Start Your Journey';
  const title = ctaBlock?.heading || 'Ready to start your dental journey?';
  const description =
    ctaBlock?.subheading ||
    'Book a free teleconsultation with our dental experts and get a personalized treatment plan.';

  const ctaButton = {
    label: ctaBlock?.button?.label || 'Book an Appointment',
    link: ctaBlock?.button?.link || 'https://app.atidinricare.com/',
  };

  const [activeScreen, setActiveScreen] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-rotate screens
  useEffect(() => {
    if (isPaused || screens.length <= 1) return;

    const interval = setInterval(() => {
      setActiveScreen((prev) => (prev + 1) % screens.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused, screens.length]);

  const resolveImage = (imgSrc) => {
    if (!imgSrc) return '/appimage4.jpeg';
    if (
      imgSrc.startsWith('http://') ||
      imgSrc.startsWith('https://') ||
      imgSrc.startsWith('/api/media')
    ) {
      return imgSrc;
    }
    return getImageUrl(imgSrc, assetBaseUrl);
  };

  const renderTitle = () => {
    const formatted = title.includes('\n') ? (
      title.split('\n').map((line, i, arr) => (
        <span
          key={i}
          dangerouslySetInnerHTML={{
            __html: line.replace(/\*([^*]+)\*/g, '<em>$1</em>'),
          }}
        />
      ))
    ) : (
      <span
        dangerouslySetInnerHTML={{
          __html: title.replace(/\*([^*]+)\*/g, '<em>$1</em>'),
        }}
      />
    );

    const hasEndPunctuation = /[.?!]$/.test(title.trim());

    return (
      <>
        {formatted}
        {!hasEndPunctuation && <span className={styles.dot}>.</span>}
      </>
    );
  };

  return (
    <section className={styles.section}>
      {/* Background */}
      <div className={styles.bg} />
      <div className={styles.bgGradient} />

      <div className={styles.container}>
        {/* Left - Typography */}
        <div className={styles.left}>
          <motion.span
            className={styles.label}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {label}
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

          <motion.div
            className={styles.line}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />

          <motion.p
            className={styles.description}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {description}
          </motion.p>

          <motion.a
            href={ctaButton.link || 'https://app.atidinricare.com/'}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaButton}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Calendar size={16} />
            <span>{ctaButton.label || 'Book an Appointment'}</span>
            <ArrowRight size={14} className={styles.ctaArrow} />
          </motion.a>
        </div>

        {/* Right - App Screens */}
        <motion.div
          className={styles.right}
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Phone mockup */}
          <div className={styles.phoneFrame}>
            <div className={styles.phoneNotch} />
            <div className={styles.phoneScreen}>
              {screens.map((screen, idx) => (
                <motion.img
                  key={screen.id || idx}
                  src={resolveImage(screen.image)}
                  alt={screen.caption || `App screen ${idx + 1}`}
                  onError={(e) => {
                    if (e.target.src !== screen.image) {
                      e.target.src = screen.image || '/appimage4.jpeg';
                    }
                  }}
                  className={styles.appImage}
                  initial={false}
                  animate={{
                    opacity: activeScreen === idx ? 1 : 0,
                    scale: activeScreen === idx ? 1 : 1.02,
                  }}
                  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                />
              ))}
            </div>
            <div className={styles.phoneHomeBar} />
          </div>

          {/* Screen indicators */}
          {screens.length > 1 && (
            <div className={styles.indicators}>
              {screens.map((screen, idx) => (
                <button
                  key={screen.id || idx}
                  className={`${styles.indicator} ${activeScreen === idx ? styles.active : ''}`}
                  onClick={() => setActiveScreen(idx)}
                  aria-label={`View screen ${idx + 1}`}
                >
                  <span className={styles.indicatorNum}>
                    {screen.label || String(idx + 1).padStart(2, '0')}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Glow effect */}
          <div className={styles.phoneGlow} />
        </motion.div>
      </div>

      {/* Background text */}
      <motion.span
        className={styles.bgText}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.02 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
      >
        APP
      </motion.span>
    </section>
  );
};

export default JourneyCTA;


'use client'
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Calendar, Building2, Home, Sparkles } from 'lucide-react';
import { getImageUrl } from '@/lib/image-url';
import styles from './HowItWorks.module.css';

const steps = [
  {
    id: 1,
    number: '01',
    title: 'Sign Up',
    description: 'Download the "Atidi Customer" app & create your profile in seconds.',
    icon: Calendar,
  },
  {
    id: 2,
    number: '02',
    title: 'Book An Appointment',
    description: 'Select the hospital, date, time and book an appointment.',
    icon: Building2,
  },
  {
    id: 3,
    number: '03',
    title: 'Return Home',
    description: 'Follow-up care will be provided in USA.',
    icon: Home,
  },
];

// Animated counter for numbers
const AnimatedNumber = ({ number, isInView, delay }) => {
  const [displayNumber, setDisplayNumber] = useState('00');

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        let count = 0;
        const target = parseInt(number);
        const interval = setInterval(() => {
          count++;
          setDisplayNumber(count.toString().padStart(2, '0'));
          if (count >= target) {
            clearInterval(interval);
          }
        }, 80);
        return () => clearInterval(interval);
      }, delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [isInView, number, delay]);

  return <span>{displayNumber}</span>;
};

// Animated step component with premium effects
const AnimatedStep = ({ step, index, isInView }) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = step.icon;
  const stepRef = useRef(null);

  // Staggered delay based on index - more dramatic stagger
  const delay = 0.3 + index * 0.25;

  // Spring physics for hover
  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 30 });

  return (
    <motion.div
      ref={stepRef}
      className={`${styles.step} ${isHovered ? styles.stepHovered : ''}`}
      initial={{ opacity: 0, x: 100, filter: 'blur(10px)' }}
      animate={isInView ? { opacity: 1, x: 0, filter: 'blur(0px)' } : { opacity: 0, x: 100, filter: 'blur(10px)' }}
      transition={{
        duration: 1,
        delay,
        ease: [0.16, 1, 0.3, 1]
      }}
      onMouseEnter={() => {
        setIsHovered(true);
        x.set(12);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        x.set(0);
      }}
      style={{ x: springX }}
    >
      {/* Animated glow on hover */}
      <motion.div
        className={styles.stepGlow}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
        transition={{ duration: 0.4 }}
      />

      {/* Progress ring with number */}
      <div className={styles.numberWrapper}>
        {/* Outer glow ring */}
        <motion.div
          className={styles.ringGlow}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.8, delay: delay + 0.2 }}
        />

        <svg className={styles.progressRing} viewBox="0 0 60 60">
          {/* Background circle */}
          <circle
            cx="30"
            cy="30"
            r="26"
            fill="white"
            stroke="var(--mist)"
            strokeWidth="1.5"
          />
          {/* Animated progress circle - draws from top */}
          <motion.circle
            cx="30"
            cy="30"
            r="26"
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="163.36"
            strokeDashoffset="163.36"
            initial={{ strokeDashoffset: 163.36 }}
            animate={isInView ? { strokeDashoffset: 0 } : { strokeDashoffset: 163.36 }}
            transition={{
              duration: 1.5,
              delay: delay + 0.4,
              ease: [0.65, 0, 0.35, 1]
            }}
            style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }}
          />
          {/* Gradient definition */}
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--sage)" />
              <stop offset="100%" stopColor="var(--terracotta)" />
            </linearGradient>
          </defs>
        </svg>

        {/* Animated number with counter effect */}
        <motion.span
          className={styles.number}
          initial={{ scale: 0, opacity: 0, rotate: -90 }}
          animate={isInView ? { scale: 1, opacity: 1, rotate: 0 } : { scale: 0, opacity: 0, rotate: -90 }}
          transition={{
            duration: 0.6,
            delay: delay + 0.6,
            type: "spring",
            stiffness: 200
          }}
        >
          <AnimatedNumber number={step.number} isInView={isInView} delay={delay + 0.7} />
        </motion.span>
      </div>

      {/* Content with icon */}
      <div className={styles.content}>
        <div className={styles.titleRow}>
          <motion.h3
            className={styles.stepTitle}
            initial={{ y: 30, opacity: 0, skewY: 3 }}
            animate={isInView ? { y: 0, opacity: 1, skewY: 0 } : { y: 30, opacity: 0, skewY: 3 }}
            transition={{
              duration: 0.8,
              delay: delay + 0.2,
              ease: [0.16, 1, 0.3, 1]
            }}
          >
            {step.title}
          </motion.h3>
          <motion.div
            className={styles.stepIcon}
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={isInView ? { scale: 1, rotate: 0, opacity: 1 } : { scale: 0, rotate: -180, opacity: 0 }}
            transition={{
              duration: 0.8,
              delay: delay + 0.5,
              type: "spring",
              stiffness: 150,
              damping: 15
            }}
            whileHover={{
              scale: 1.2,
              rotate: 15,
              boxShadow: "0 8px 25px rgba(124, 152, 133, 0.4)"
            }}
          >
            <Icon size={18} />
            {/* Sparkle effect on hover */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  className={styles.sparkle}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Sparkles size={10} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Description with word-by-word reveal */}
        <motion.p
          className={styles.stepDesc}
          initial={{ y: 20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
          transition={{
            duration: 0.7,
            delay: delay + 0.35,
            ease: [0.16, 1, 0.3, 1]
          }}
        >
          {step.description}
        </motion.p>

        {/* Animated underline */}
        <motion.div
          className={styles.stepUnderline}
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{
            duration: 0.8,
            delay: delay + 0.6,
            ease: [0.16, 1, 0.3, 1]
          }}
        />
      </div>
    </motion.div>
  );
};

const HowItWorks = ({ assetBaseUrl } = {}) => {
  const sectionRef = useRef(null);
  const stepsRef = useRef(null);
  const isInView = useInView(stepsRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const lineWidth = useTransform(scrollYProgress, [0.1, 0.5], ["0%", "100%"]);

  return (
    <section className={styles.section} ref={sectionRef} id="how-it-works">
      <div className={styles.bg} />

      <div className={styles.container}>
        {/* Left side - Big typography */}
        <div className={styles.left}>
          <motion.img
            src={getImageUrl('/Suitcase_flight.png', assetBaseUrl)}
            alt="Travel icon"
            onError={(e) => { e.target.src = '/Suitcase_flight.png' }}
            className={styles.icon}
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <span className={styles.label}>Process</span>
          </motion.div>

          <h2 className={styles.title}>
            Three<br />
            simple<br />
            steps<span className={styles.dot}>.</span>
          </h2>

          <motion.div
            className={styles.line}
            style={{ width: lineWidth }}
          />
        </div>

        {/* Right side - Steps with timeline */}
        <div className={styles.right} ref={stepsRef}>
          {/* Vertical timeline */}
          <div className={styles.timeline}>
            <motion.div
              className={styles.timelineProgress}
              initial={{ scaleY: 0 }}
              animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>

          {steps.map((step, index) => (
            <AnimatedStep
              key={step.id}
              step={step}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>
      </div>

      {/* Large background number */}
      <motion.span
        className={styles.bgText}
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 0.02, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
      >
        03
      </motion.span>
    </section>
  );
};

export default HowItWorks;

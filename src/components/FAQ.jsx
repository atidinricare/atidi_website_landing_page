'use client'
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import styles from './FAQ.module.css';

const fallbackFaqs = [
  {
    question: 'Is Atidi only for NRI patients?',
    answer: [
      'Not at all — Atidi is designed for everyone.',
      'While we initially set out to simplify access to trusted, high-quality dental care for NRIs, we quickly recognized that the same challenges — finding reliable clinics, transparent pricing, and consistent quality — are faced by patients across India.',
      'Atidi was built to address these gaps, making dependable, world-class dental care accessible to anyone who values trust, transparency, and excellence.',
    ],
  },
  {
    question: 'Why Atidi?',
    answer: [
      "If you're an NRI, finding a good dental hospital during a short trip to India can be difficult. Online reviews aren't always reliable, so getting a trusted recommendation matters.",
      'Atidi helps you connect with top-quality dental hospitals in India that follow international standards. We take care of everything — booking appointments, coordinating with clinics, keeping your records, and even follow-up care in the USA.',
      "With Atidi, you don't have to worry about being overcharged or getting unnecessary treatments. We offer fixed, transparent pricing with no hidden fees, and our care managers make sure you receive the right treatment.",
      'You also get 24/7 free teleconsultation with our dentists for any questions.',
    ],
  },
  {
    question: 'How do you ensure the quality of treatment?',
    answer: [
      'We carefully vet every partner clinic for infrastructure, hygiene protocols, and equipment standards to ensure a safe and reliable environment.',
      'Each procedure is overseen by our dedicated care managers, who monitor treatment quality and patient experience throughout the process.',
      'All treatments are performed by MDS-qualified dentists with advanced specialization, using high-quality, standardized materials that meet international benchmarks.',
    ],
  },
  {
    question: 'What happens if I need follow-up care after I return?',
    answer: [
      'All your dental records are securely digitized and accessible across our network of partner clinics, allowing you to visit any nearby affiliated clinic in the U.S. for continued care.',
      'We offer same-day appointments for our patients whenever possible, ensuring timely support.',
      'In addition, you have access to our 24/7 free teleconsultation service, where you can connect with a qualified dentist for follow-ups or any additional questions.',
    ],
  },
  {
    question: 'How does pricing compare internationally?',
    answer: [
      'Dental care in the United States can cost 70–90% more than equivalent treatments in India, without a corresponding difference in clinical outcomes.',
      'At our partner clinics, pricing is standardized, transparent, and determined by the quality of materials and clinical requirements. Each treatment plan is carefully overseen by our dedicated care managers to ensure absolute fairness, with no unnecessary procedures or inflated costs.',
      'There are no hidden charges — only clear, upfront pricing. Even after accounting for travel, most patients realize significant savings while receiving world-class care.',
    ],
  },
  {
    question: 'How long do treatments usually take?',
    answer: [
      'Treatment timelines vary depending on the complexity of the procedure. Many routine treatments can be completed within a single day, while more advanced procedures — such as dental implants or full-mouth rehabilitation — may take between 1 to 7 days, occasionally followed by a scheduled review visit.',
      'Our team works closely with you to design an efficient treatment plan, often allowing you to seamlessly combine care with travel.',
      'A detailed, personalized timeline is shared with you during your initial consultation, ensuring complete clarity before you begin.',
    ],
  },
  {
    question: 'Do you help coordinate everything for my visit?',
    answer: [
      'Yes — every aspect of your journey is thoughtfully coordinated for a seamless experience. Once your appointment is confirmed, you are assigned a dedicated care manager (a qualified dentist) who serves as your single point of contact throughout your treatment.',
      'Your care manager works closely with the clinic to ensure priority scheduling and a smooth, wait-free arrival. They also oversee each stage of your treatment to maintain the highest standards of quality and consistency.',
      'Our team remains available to you 24/7 via phone, email, or WhatsApp, ensuring you have continuous support at every step of your journey.',
    ],
  },
];

const FAQ = ({ faqs: faqsProp } = {}) => {
  const [expandedIndex, setExpandedIndex] = useState(0);
  const activeFaqs = faqsProp && faqsProp.length > 0 ? faqsProp : fallbackFaqs;

  return (
    <section className={styles.section} id="faq">
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
              FAQ
            </motion.span>
            <motion.h2
              className={styles.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className={styles.titleLine1}>Questions<span className={styles.comma}>,</span></span>
              <span className={styles.titleLine2}><em>answered</em><span className={styles.dot}>.</span></span>
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
              Everything you need to know about your dental journey with us
            </p>
            <div className={styles.counter}>
              <span className={styles.counterCurrent}>0{expandedIndex + 1}</span>
              <span className={styles.counterDivider}>/</span>
              <span className={styles.counterTotal}>0{activeFaqs.length}</span>
            </div>
          </motion.div>
        </div>

        {/* FAQ Items */}
        <div className={styles.faqList}>
          {activeFaqs.map((faq, index) => (
            <motion.div
              key={index}
              className={`${styles.item} ${expandedIndex === index ? styles.active : ''}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <button
                className={styles.question}
                onClick={() => setExpandedIndex(expandedIndex === index ? -1 : index)}
                aria-expanded={expandedIndex === index}
              >
                <span className={styles.questionNum}>0{index + 1}</span>
                <span className={styles.questionText}>{faq.question}</span>
                <span className={styles.questionIcon}>
                  <ArrowUpRight size={18} />
                </span>
              </button>

              <AnimatePresence>
                {expandedIndex === index && (
                  <motion.div
                    className={styles.answer}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <div className={styles.answerInner}>
                      {faq.answer.map((point, i) => (
                        <motion.div
                          key={i}
                          className={styles.answerPoint}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.08 }}
                        >
                          <span className={styles.pointMarker} />
                          <span>{point}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className={styles.itemLine} />
            </motion.div>
          ))}
        </div>

        {/* Banner */}
        <motion.div
          className={styles.banner}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className={styles.bannerContent}>
            <div className={styles.bannerText}>
              <span className={styles.bannerLine1}>Every step,</span>
              <span className={styles.bannerLine2}><em>cared for</em><span className={styles.bannerDot}>.</span></span>
            </div>
            <p className={styles.bannerSubtitle}>
              From consultation to return, our Care Manager will coordinate your entire dental journey so you can focus on what matters.
            </p>
          </div>
          <div className={styles.bannerGlow} />
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
        FAQ
      </motion.span>
    </section>
  );
};

export default FAQ;

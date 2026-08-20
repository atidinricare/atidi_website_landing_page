'use client'

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Shield, Eye, Lock, Database, UserCheck, Bell, Globe, Mail } from 'lucide-react';
import styles from './LegalPages.module.css';

const PrivacyPolicyClient = () => {
  const sections = [
    {
      id: 'information-collection',
      icon: Database,
      title: 'Information We Collect',
      content: [
        {
          subtitle: 'Personal Information',
          text: 'When you use our services, we may collect personal information that you voluntarily provide, including your name, email address, phone number, postal address, date of birth, and medical/dental history relevant to your treatment.'
        },
        {
          subtitle: 'Health Information',
          text: 'To provide dental care services, we collect health-related information including dental records, X-rays, treatment plans, medical history, allergies, and current medications. This information is essential for delivering safe and effective dental care.'
        },
        {
          subtitle: 'Usage Data',
          text: 'We automatically collect certain information when you visit our website, including your IP address, browser type, device information, pages visited, time spent on pages, and referring URLs.'
        }
      ]
    },
    {
      id: 'information-use',
      icon: Eye,
      title: 'How We Use Your Information',
      content: [
        {
          subtitle: 'Service Delivery',
          text: 'We use your information to provide, maintain, and improve our dental care coordination services, including scheduling appointments, coordinating between treatment centers in India and follow-up care in the USA, and managing your patient records.'
        },
        {
          subtitle: 'Communication',
          text: 'We use your contact information to send appointment reminders, treatment updates, post-care instructions, and respond to your inquiries. With your consent, we may also send promotional communications about our services.'
        },
        {
          subtitle: 'Quality Improvement',
          text: 'We analyze usage patterns and feedback to improve our services, develop new features, and enhance user experience across our platforms.'
        }
      ]
    },
    {
      id: 'information-sharing',
      icon: UserCheck,
      title: 'Information Sharing',
      content: [
        {
          subtitle: 'Healthcare Providers',
          text: 'We share your health information with our partner dental clinics in India and the USA as necessary to coordinate your care. This sharing is essential for treatment continuity and is conducted in compliance with applicable healthcare privacy regulations.'
        },
        {
          subtitle: 'Service Providers',
          text: 'We may share information with trusted third-party service providers who assist us in operating our website, conducting our business, or servicing you. These parties are contractually obligated to keep your information confidential.'
        },
        {
          subtitle: 'Legal Requirements',
          text: 'We may disclose your information when required by law, court order, or government regulation, or when we believe disclosure is necessary to protect our rights, your safety, or the safety of others.'
        }
      ]
    },
    {
      id: 'data-security',
      icon: Lock,
      title: 'Data Security',
      content: [
        {
          subtitle: 'Protection Measures',
          text: 'We implement industry-standard security measures including encryption, secure servers, firewalls, and access controls to protect your personal and health information from unauthorized access, alteration, disclosure, or destruction.'
        },
        {
          subtitle: 'Data Storage',
          text: 'Your data is stored on secure servers with appropriate physical, technical, and administrative safeguards. We retain your information only for as long as necessary to fulfill the purposes outlined in this policy or as required by law.'
        }
      ]
    },
    {
      id: 'your-rights',
      icon: Shield,
      title: 'Your Rights',
      content: [
        {
          subtitle: 'Access and Correction',
          text: 'You have the right to access, review, and request corrections to your personal information. You may also request a copy of your health records in accordance with applicable healthcare regulations.'
        },
        {
          subtitle: 'Opt-Out',
          text: 'You may opt out of receiving promotional communications from us at any time by following the unsubscribe instructions in our emails or contacting us directly. Note that you cannot opt out of service-related communications necessary for your care.'
        },
        {
          subtitle: 'Data Deletion',
          text: 'Subject to legal and regulatory requirements, you may request the deletion of your personal information. Certain health records may need to be retained as required by healthcare regulations.'
        }
      ]
    },
    {
      id: 'international-transfers',
      icon: Globe,
      title: 'International Data Transfers',
      content: [
        {
          subtitle: 'Cross-Border Transfers',
          text: 'As we coordinate care between India and the USA, your information may be transferred and stored in different countries. We ensure appropriate safeguards are in place to protect your information in compliance with applicable data protection laws.'
        },
        {
          subtitle: 'Consent',
          text: 'By using our services, you consent to the transfer of your information to India, the United States, and other countries where our partners and service providers are located.'
        }
      ]
    },
    {
      id: 'updates',
      icon: Bell,
      title: 'Policy Updates',
      content: [
        {
          subtitle: 'Changes to This Policy',
          text: 'We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any material changes by posting the updated policy on our website and updating the "Last Updated" date.'
        },
        {
          subtitle: 'Your Continued Use',
          text: 'Your continued use of our services after any changes to this Privacy Policy constitutes your acceptance of the updated policy.'
        }
      ]
    },
    {
      id: 'contact',
      icon: Mail,
      title: 'Contact Us',
      content: [
        {
          subtitle: 'Questions or Concerns',
          text: 'If you have any questions about this Privacy Policy or our data practices, please contact us at privacy@atidinricare.com or call us at +91 90309 91859. You may also write to us at our registered address.'
        }
      ]
    }
  ];

  return (
    <div className={styles.legalPage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground} />
        <div className={styles.heroGradient} />

        <div className={styles.heroContent}>
          <motion.div
            className={styles.heroLabel}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Shield size={16} />
            <span>Legal</span>
          </motion.div>

          <motion.h1
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className={styles.titleLine1}>Privacy</span>
            <span className={styles.titleLine2}>Policy<span className={styles.dot}>.</span></span>
          </motion.h1>

          <motion.p
            className={styles.heroSubtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Your privacy matters to us. This policy explains how we collect, use, and protect your personal information.
          </motion.p>

          <motion.div
            className={styles.heroMeta}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <span>Last Updated: January 2026</span>
            <span className={styles.metaDivider}>|</span>
            <span>Effective: January 1, 2026</span>
          </motion.div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className={styles.tocSection}>
        <div className={styles.container}>
          <motion.div
            className={styles.tocCard}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className={styles.tocTitle}>Contents</h2>
            <nav className={styles.tocNav}>
              {sections.map((section, index) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={styles.tocItem}
                >
                  <span className={styles.tocNumber}>0{index + 1}</span>
                  <span className={styles.tocText}>{section.title}</span>
                </a>
              ))}
            </nav>
          </motion.div>
        </div>
      </section>

      {/* Content Sections */}
      <section className={styles.contentSection}>
        <div className={styles.container}>
          {sections.map((section, index) => (
            <motion.article
              key={section.id}
              id={section.id}
              className={styles.contentBlock}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
            >
              <div className={styles.sectionHeader}>
                <div className={styles.sectionIcon}>
                  <section.icon size={24} />
                </div>
                <div className={styles.sectionMeta}>
                  <span className={styles.sectionNumber}>0{index + 1}</span>
                  <h2 className={styles.sectionTitle}>{section.title}</h2>
                </div>
              </div>

              <div className={styles.sectionContent}>
                {section.content.map((item, i) => (
                  <div key={i} className={styles.contentItem}>
                    <h3 className={styles.contentSubtitle}>{item.subtitle}</h3>
                    <p className={styles.contentText}>{item.text}</p>
                  </div>
                ))}
              </div>

              {index < sections.length - 1 && <div className={styles.sectionDivider} />}
            </motion.article>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <motion.div
            className={styles.ctaCard}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>Have questions about your data?</h2>
              <p className={styles.ctaText}>
                Our team is here to help you understand how we protect your information.
              </p>
            </div>
            <div className={styles.ctaActions}>
              <a href="mailto:privacy@atidinricare.com" className={styles.ctaButton}>
                Contact Privacy Team
              </a>
              <Link href="/terms-of-service" className={styles.ctaLink}>
                View Terms of Service
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicyClient;

'use client'

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FileText, CheckCircle, AlertTriangle, Scale, Handshake, CreditCard, XCircle, RefreshCw, Mail } from 'lucide-react';
import styles from './LegalPages.module.css';

const TermsOfServiceClient = () => {
  const sections = [
    {
      id: 'acceptance',
      icon: CheckCircle,
      title: 'Acceptance of Terms',
      content: [
        {
          subtitle: 'Agreement',
          text: 'By accessing or using Atidi NRI Care services, website, or mobile applications, you agree to be bound by these Terms of Service. If you do not agree to all terms and conditions, you may not access or use our services.'
        },
        {
          subtitle: 'Eligibility',
          text: 'You must be at least 18 years of age to use our services. By using our services, you represent that you are at least 18 years old and have the legal capacity to enter into binding agreements. For patients under 18, a parent or legal guardian must agree to these terms on their behalf.'
        },
        {
          subtitle: 'Modifications',
          text: 'We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to our website. Your continued use of our services following any changes constitutes acceptance of the revised terms.'
        }
      ]
    },
    {
      id: 'services',
      icon: Handshake,
      title: 'Our Services',
      content: [
        {
          subtitle: 'Service Description',
          text: 'Atidi NRI Care provides dental care coordination services for Non-Resident Indians (NRIs), connecting patients with partner dental clinics in India for treatment and facilitating follow-up care through our partner network in the United States.'
        },
        {
          subtitle: 'Coordination Role',
          text: 'We act as a coordination and facilitation service between patients and independent dental healthcare providers. We are not a healthcare provider and do not practice dentistry. All dental treatments are provided by licensed, independent dental professionals at our partner clinics.'
        },
        {
          subtitle: 'No Medical Advice',
          text: 'Information provided through our website or services is for general informational purposes only and should not be considered medical or dental advice. Always consult with qualified healthcare professionals for medical decisions.'
        }
      ]
    },
    {
      id: 'user-obligations',
      icon: FileText,
      title: 'User Obligations',
      content: [
        {
          subtitle: 'Accurate Information',
          text: 'You agree to provide accurate, current, and complete information about yourself, including your medical and dental history. Providing false or misleading information may affect the quality of your care and constitutes a violation of these terms.'
        },
        {
          subtitle: 'Account Security',
          text: 'If you create an account with us, you are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use.'
        },
        {
          subtitle: 'Compliance',
          text: 'You agree to comply with all applicable laws, regulations, and these terms when using our services. You will not use our services for any unlawful purpose or in any way that could damage, disable, or impair our services.'
        }
      ]
    },
    {
      id: 'payments',
      icon: CreditCard,
      title: 'Payments & Pricing',
      content: [
        {
          subtitle: 'Treatment Costs',
          text: 'Treatment costs are determined by our partner dental clinics and will be communicated to you before treatment begins. Prices are subject to change based on your specific dental needs, treatment complexity, and materials used.'
        },
        {
          subtitle: 'Coordination Fees',
          text: 'Atidi NRI Care may charge coordination fees for our services. All fees will be clearly disclosed before you incur any charges. Payment terms and accepted payment methods will be specified at the time of booking.'
        },
        {
          subtitle: 'Currency & Taxes',
          text: 'Prices may be displayed in multiple currencies for convenience. The final charge will be in the currency specified at checkout. You are responsible for any applicable taxes, duties, or fees imposed by your jurisdiction.'
        }
      ]
    },
    {
      id: 'cancellation',
      icon: RefreshCw,
      title: 'Cancellation & Refunds',
      content: [
        {
          subtitle: 'Cancellation Policy',
          text: 'Cancellation policies vary by service and will be communicated at the time of booking. Early cancellation may entitle you to a full or partial refund, while late cancellations may incur fees as specified in your booking confirmation.'
        },
        {
          subtitle: 'Treatment Refunds',
          text: 'Refunds for dental treatments are subject to the policies of the treating clinic. As treatments are provided by independent healthcare providers, refund requests must be directed to and approved by the relevant clinic.'
        },
        {
          subtitle: 'Coordination Fee Refunds',
          text: 'Coordination fees may be refundable if you cancel before services are rendered. Once coordination services have been provided, these fees are generally non-refundable. Specific terms will be outlined in your service agreement.'
        }
      ]
    },
    {
      id: 'liability',
      icon: AlertTriangle,
      title: 'Limitation of Liability',
      content: [
        {
          subtitle: 'Service Limitations',
          text: 'Our services are provided "as is" without warranties of any kind. We do not guarantee specific treatment outcomes, as results depend on individual patient factors and the professional judgment of treating dentists.'
        },
        {
          subtitle: 'Healthcare Disclaimer',
          text: 'Atidi NRI Care is not responsible for the actions, decisions, or outcomes of treatment provided by our partner dental clinics. Each clinic is an independent entity responsible for its own standard of care and treatment outcomes.'
        },
        {
          subtitle: 'Liability Cap',
          text: 'To the maximum extent permitted by law, our total liability for any claims arising from your use of our services shall not exceed the amount you paid to Atidi NRI Care in the 12 months preceding the claim.'
        }
      ]
    },
    {
      id: 'termination',
      icon: XCircle,
      title: 'Termination',
      content: [
        {
          subtitle: 'Termination by You',
          text: 'You may stop using our services at any time. If you have ongoing treatments or bookings, you should follow the cancellation procedures outlined in your service agreements.'
        },
        {
          subtitle: 'Termination by Us',
          text: 'We may suspend or terminate your access to our services at any time, with or without cause, including for violation of these terms. We will make reasonable efforts to notify you of any termination.'
        },
        {
          subtitle: 'Effect of Termination',
          text: 'Upon termination, your right to use our services will immediately cease. Provisions of these terms that by their nature should survive termination will remain in effect, including liability limitations and dispute resolution provisions.'
        }
      ]
    },
    {
      id: 'disputes',
      icon: Scale,
      title: 'Dispute Resolution',
      content: [
        {
          subtitle: 'Governing Law',
          text: 'These terms shall be governed by and construed in accordance with the laws of India, without regard to conflict of law principles. For services provided in the USA, relevant US federal and state laws may also apply.'
        },
        {
          subtitle: 'Informal Resolution',
          text: 'Before initiating formal dispute resolution, you agree to contact us to attempt to resolve any dispute informally. We commit to working in good faith to resolve your concerns within 30 days.'
        },
        {
          subtitle: 'Arbitration',
          text: 'Any disputes not resolved informally shall be resolved through binding arbitration in accordance with applicable arbitration rules. The arbitration shall be conducted in Hyderabad, India, unless otherwise agreed.'
        }
      ]
    },
    {
      id: 'contact',
      icon: Mail,
      title: 'Contact Information',
      content: [
        {
          subtitle: 'Questions',
          text: 'If you have any questions about these Terms of Service, please contact us at legal@atidinricare.com or call us at +91 90309 91859. You may also write to us at our registered office address.'
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
            <Scale size={16} />
            <span>Legal</span>
          </motion.div>

          <motion.h1
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className={styles.titleLine1}>Terms of</span>
            <span className={styles.titleLine2}>Service<span className={styles.dot}>.</span></span>
          </motion.h1>

          <motion.p
            className={styles.heroSubtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Please read these terms carefully before using our services. They govern your relationship with Atidi NRI Care.
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
              <h2 className={styles.ctaTitle}>Have questions about our terms?</h2>
              <p className={styles.ctaText}>
                Our legal team is available to help clarify any aspect of these terms.
              </p>
            </div>
            <div className={styles.ctaActions}>
              <a href="mailto:legal@atidinricare.com" className={styles.ctaButton}>
                Contact Legal Team
              </a>
              <Link href="/privacy-policy" className={styles.ctaLink}>
                View Privacy Policy
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default TermsOfServiceClient;

'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import Locations from '@/components/Locations';
import SlidePanel from '@/components/SlidePanel';
import LocationDetail from '@/components/LocationDetail';
import styles from './ClinicsPage.module.css';

const ClinicsPageClient = ({ indiaLocations, usLocations }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const handleSelectLocation = (location) => {
    setSelectedLocation(location);
    setPanelOpen(true);
  };

  const closePanel = () => {
    setPanelOpen(false);
    setSelectedLocation(null);
  };

  return (
    <div className={styles.page}>
      {/* Opening */}
      <section className={styles.opening}>
        <motion.div
          className={styles.openingInner}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <p className={styles.openingEyebrow}>Our Clinics</p>
          <h1 className={styles.openingHeadline}>
            121+ clinics. Every one<br />
            <em>vetted, verified, monitored.</em>
          </h1>
        </motion.div>
      </section>

      {/* Intro — two-column */}
      <section className={styles.intro}>
        <div className={styles.introGrid}>
          <motion.div
            className={styles.introLeft}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className={styles.introTitle}>
              Why our clinics<br />stand apart
            </h2>
          </motion.div>
          <motion.div
            className={styles.introRight}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <p>
              Every clinic in our network is carefully selected and continuously monitored. We don't list clinics, we partner with them. That means infrastructure audits, hygiene protocol reviews, and ongoing quality checks.
            </p>
            <p>
              The result: you walk into any Atidi partner clinic in India and receive the same standard of care you'd expect from the best practices anywhere in the world.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Three pillars — numbered editorial rows */}
      <section className={styles.pillars}>
        <div className={styles.pillarsInner}>
          {[
            {
              title: 'Rigorous vetting',
              desc: 'Every partner clinic is audited for infrastructure, sterilization protocols, and equipment standards. We use modern equipment including digital X-ray, 3D CT scan, and CAD/CAM technology. Only clinics that meet international benchmarks make it into our network.'
            },
            {
              title: 'MDS-qualified specialists',
              desc: 'Treatments are performed by dentists with MDS qualifications and advanced specialization. Our network includes specialists with years of experience in complex procedures, using premium, internationally certified dental materials.'
            },
            {
              title: 'Follow-up across borders',
              desc: 'Your complete dental records are digitized and accessible through our patient portal. Partner clinics across 10 US states provide in-person follow-ups when you return. Remote consultations with your treating dentist are available for any post-treatment concerns.'
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              className={styles.pillarRow}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.08 * index }}
            >
              <span className={styles.pillarNum}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className={styles.pillarBody}>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Standards — inline quote style */}
      <section className={styles.standardsSection}>
        <motion.div
          className={styles.standardsInner}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className={styles.standardsQuote}>
            <p>
              Strict sterilization protocols. Premium materials with international warranties. Complete documentation shared with your US provider. Minor adjustments covered at follow-up clinics. 24/7 support available.
            </p>
          </div>
          <span className={styles.standardsCaption}>Our baseline. Not the exception.</span>
        </motion.div>
      </section>

      {/* Locations Section */}
      <Locations
        indiaLocations={indiaLocations}
        usLocations={usLocations}
        onSelectLocation={handleSelectLocation}
      />

      {/* Slide Panel for Location Details */}
      <SlidePanel
        isOpen={panelOpen && selectedLocation !== null}
        onClose={closePanel}
        title={selectedLocation?.city || 'Location Details'}
      >
        <LocationDetail location={selectedLocation} />
      </SlidePanel>
    </div>
  );
};

export default ClinicsPageClient;

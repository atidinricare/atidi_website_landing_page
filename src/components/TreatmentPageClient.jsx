'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import TreatmentDetail from './TreatmentDetail'
import styles from './TreatmentPage.module.css'

const TreatmentPageClient = ({ treatment }) => {
  if (!treatment) {
    return (
      <div className={styles.page}>
        <div className={styles.notFound}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className={styles.notFoundTitle}>Treatment not found</h1>
            <p className={styles.notFoundText}>
              The treatment you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/#treatments" className={styles.notFoundLink}>
              <ArrowLeft size={18} /> Back to Treatments
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.backNav}>
        <Link href="/#treatments" className={styles.backLink}>
          <ArrowLeft size={18} /> Back to Treatments
        </Link>
      </div>
      <div className={styles.detailWrapper}>
        <TreatmentDetail treatment={treatment} />
      </div>
    </div>
  )
}

export default TreatmentPageClient

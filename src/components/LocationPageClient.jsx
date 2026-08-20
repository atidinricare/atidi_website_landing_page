'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import LocationDetail from './LocationDetail'
import styles from './LocationPage.module.css'

const LocationPageClient = ({ location }) => {
  if (!location) {
    return (
      <div className={styles.page}>
        <div className={styles.notFound}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className={styles.notFoundTitle}>Location not found</h1>
            <p className={styles.notFoundText}>
              The location you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/clinics" className={styles.notFoundLink}>
              <ArrowLeft size={18} /> Back to Clinics
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.backNav}>
        <Link href="/clinics" className={styles.backLink}>
          <ArrowLeft size={18} /> Back to Clinics
        </Link>
      </div>
      <div className={styles.detailWrapper}>
        <LocationDetail location={location} />
      </div>
    </div>
  )
}

export default LocationPageClient

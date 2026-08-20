'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Play, X } from 'lucide-react'
import Image from 'next/image'
import { getImageUrl } from '@/lib/image-url'

// Components
import SearchBar from './SearchBar'
import SlidePanel from './SlidePanel'
import TreatmentDetail from './TreatmentDetail'
import LocationDetail from './LocationDetail'
import TrustBanner from './TrustBanner'
import Treatments from './Treatments'
import HowItWorks from './HowItWorks'
import Locations from './Locations'
import FAQ from './FAQ'
import JourneyCTA from './JourneyCTA'
import HeroMosaic from './HeroMosaic'

const HomePageClient = ({ featuredTreatments, allTreatments, indiaLocations, usLocations, allLocations, faqs, heroContent, siteSettings }) => {
  // Hero content with fallbacks
  const headline = heroContent?.headline || "Premium dental care for NRI's, without the premium price."
  const subheadline = heroContent?.subheadline || "ATIDI NRI CARE connects NRIs to verified top premium dental hospitals in India & USA. We provide world-class treatment in India with seamless follow-up care when you return to the USA. At Atidi dental treatments are 70–90% cheaper than in USA without compromising quality."
  const ctaPrimary = heroContent?.ctaPrimary || { label: 'Book an Appointment', link: 'https://app.atidinricare.com/' }
  const ctaSecondary = heroContent?.ctaSecondary || { label: 'Watch Our Story', link: '' }
  const heroStats = heroContent?.stats?.length > 0 ? heroContent.stats : [
    { value: '24/7', label: 'Free Teleconsultation' },
    { value: '100%', label: 'Success Rate' },
    { value: '10', label: 'US States Covered' },
  ]

  const [activePanel, setActivePanel] = useState(null)
  const [selectedTreatment, setSelectedTreatment] = useState(null)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [showStoryVideo, setShowStoryVideo] = useState(false)

  // Handlers
  const handleSelectTreatment = (treatment) => {
    if (treatment?.opensInNewTab) {
      if (typeof window !== 'undefined') {
        window.open(`/treatments/${treatment.id}`, '_blank', 'noopener,noreferrer')
      }
      return
    }
    setSelectedTreatment(treatment)
    setActivePanel('treatment')
  }

  const handleSelectLocation = (location) => {
    if (location?.opensInNewTab) {
      if (typeof window !== 'undefined') {
        window.open(`/locations/${location.id}`, '_blank', 'noopener,noreferrer')
      }
      return
    }
    setSelectedLocation(location)
    setActivePanel('location')
  }

  const closePanel = () => {
    setActivePanel(null)
    setSelectedTreatment(null)
    setSelectedLocation(null)
  }

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            dangerouslySetInnerHTML={{ __html: headline.replace(/\n/g, '<br />').replace(/\*([^*]+)\*/g, '<em>$1</em>') }}
          />
          <motion.p
            className="hero-description"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {subheadline}
          </motion.p>

          {/* Search Bar */}
          <motion.div
            className="hero-search"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <SearchBar
              treatments={featuredTreatments}
              allLocations={allLocations}
              onSelectTreatment={handleSelectTreatment}
              onSelectLocation={handleSelectLocation}
              isPanelOpen={activePanel !== null}
            />
          </motion.div>

          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <a href={ctaPrimary.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              <Calendar size={18} />
              {ctaPrimary.label}
            </a>
            <button className="btn btn-outline" onClick={() => setShowStoryVideo(true)}>
              <Play size={18} />
              {ctaSecondary.label}
            </button>
          </motion.div>

          <motion.div
            className="hero-stats"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
          >
            {heroStats.map((stat, index) => (
              <div key={index} className="hero-stat">
                <span className="hero-stat-value">
                  {stat.prefix}{stat.value}{stat.suffix}
                </span>
                <span className="hero-stat-label">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="hero-right">
          <HeroMosaic />
          <div className="hero-scroll">
            <span>Scroll</span>
            <div className="hero-scroll-line" />
          </div>
        </div>
      </section>

      {/* TRUST BANNER */}
      <TrustBanner />

      {/* TREATMENTS */}
      <Treatments
        treatments={featuredTreatments}
        onSelectTreatment={handleSelectTreatment}
      />

      {/* HOW IT WORKS */}
      <HowItWorks assetBaseUrl={siteSettings?.assetBaseUrl} />

      {/* LOCATIONS */}
      <Locations
        indiaLocations={indiaLocations}
        usLocations={usLocations}
        onSelectLocation={handleSelectLocation}
      />

      {/* FAQ */}
      <FAQ faqs={faqs} />

      {/* JOURNEY CTA */}
      <JourneyCTA assetBaseUrl={siteSettings?.assetBaseUrl} />

      {/* SLIDE PANEL - Treatment Detail */}
      <SlidePanel
        isOpen={activePanel === 'treatment' && selectedTreatment !== null}
        onClose={closePanel}
        title={selectedTreatment?.name || 'Treatment Details'}
      >
        <TreatmentDetail treatment={selectedTreatment} />
      </SlidePanel>

      {/* SLIDE PANEL - Location Detail */}
      <SlidePanel
        isOpen={activePanel === 'location' && selectedLocation !== null}
        onClose={closePanel}
        title={selectedLocation?.city || 'Location Details'}
      >
        <LocationDetail location={selectedLocation} />
      </SlidePanel>

      {/* STORY VIDEO MODAL */}
      <AnimatePresence>
        {showStoryVideo && (
          <motion.div
            className="video-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowStoryVideo(false)}
          >
            <motion.div
              className="video-modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="video-modal-close"
                onClick={() => setShowStoryVideo(false)}
                aria-label="Close video"
              >
                <X size={24} />
              </button>
              <div className="video-modal-wrapper">
                {ctaSecondary.link ? (
                  <iframe
                    src={ctaSecondary.link}
                    title="Our Story - Atidi NRI Care"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="video-modal-placeholder">
                    <p>Video coming soon</p>
                  </div>
                )}
              </div>
              <div className="video-modal-info">
                <h3>Our Story</h3>
                <p>Discover how Atidi NRI Care is transforming dental tourism for NRIs worldwide.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default HomePageClient

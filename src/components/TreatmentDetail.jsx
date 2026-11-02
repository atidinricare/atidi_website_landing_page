'use client'
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, ChevronDown, ChevronUp,
  CheckCircle, ArrowRight,
  Play, X, ChevronLeft, ChevronRight, Images
} from 'lucide-react';
import styles from './TreatmentDetail.module.css';

/**
 * Extract YouTube video ID from various URL formats.
 */
const getYouTubeId = (url) => {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
};

const TreatmentDetail = ({ treatment }) => {
  const [expandedFaq, setExpandedFaq] = useState(0);
  const [expandedStep, setExpandedStep] = useState(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeVideoIndex, setActiveVideoIndex] = useState(null);

  if (!treatment) return null;

  const formatPrice = (price) => {
    return `$${price.min.toLocaleString()} - $${price.max.toLocaleString()}`;
  };

  const savings = treatment.usaPrice.min - treatment.indiaPrice.min;

  const hasGallery = treatment.gallery && treatment.gallery.length > 0;
  const hasVideos = treatment.videos && treatment.videos.length > 0;

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroOverlay}>
          <span className={styles.category}>{treatment.category}</span>
          <h1 className={styles.title}>{treatment.name}</h1>
          <p className={styles.tagline}>{treatment.tagline}</p>
        </div>
      </div>

      {/* Description */}
      <section className={styles.section}>
        <p className={styles.description}>{treatment.description}</p>
      </section>

      {/* Image Gallery */}
      {hasGallery && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <Images size={20} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
            Treatment Gallery
          </h2>
          <div className={styles.gallery}>
            <div className={styles.galleryMain} onClick={() => setLightboxOpen(true)}>
              <img
                src={treatment.gallery[galleryIndex].image}
                alt={treatment.gallery[galleryIndex].caption || `${treatment.name} image ${galleryIndex + 1}`}
                className={styles.galleryImage}
              />
              {treatment.gallery[galleryIndex].caption && (
                <p className={styles.galleryCaption}>{treatment.gallery[galleryIndex].caption}</p>
              )}
              {treatment.gallery.length > 1 && (
                <>
                  <button
                    className={`${styles.galleryNav} ${styles.galleryPrev}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setGalleryIndex((prev) => (prev - 1 + treatment.gallery.length) % treatment.gallery.length);
                    }}
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    className={`${styles.galleryNav} ${styles.galleryNext}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setGalleryIndex((prev) => (prev + 1) % treatment.gallery.length);
                    }}
                    aria-label="Next image"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>
            {treatment.gallery.length > 1 && (
              <div className={styles.galleryThumbs}>
                {treatment.gallery.map((item, idx) => (
                  <button
                    key={idx}
                    className={`${styles.galleryThumb} ${idx === galleryIndex ? styles.galleryThumbActive : ''}`}
                    onClick={() => setGalleryIndex(idx)}
                  >
                    <img
                      src={item.image}
                      alt={item.caption || `Thumbnail ${idx + 1}`}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Lightbox */}
          <AnimatePresence>
            {lightboxOpen && (
              <motion.div
                className={styles.lightbox}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setLightboxOpen(false)}
              >
                <button className={styles.lightboxClose} onClick={() => setLightboxOpen(false)}>
                  <X size={24} />
                </button>
                <motion.img
                  src={treatment.gallery[galleryIndex].image}
                  alt={treatment.gallery[galleryIndex].caption || ''}
                  className={styles.lightboxImage}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.9 }}
                  onClick={(e) => e.stopPropagation()}
                />
                {treatment.gallery.length > 1 && (
                  <>
                    <button
                      className={`${styles.lightboxNav} ${styles.lightboxPrev}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setGalleryIndex((prev) => (prev - 1 + treatment.gallery.length) % treatment.gallery.length);
                      }}
                    >
                      <ChevronLeft size={28} />
                    </button>
                    <button
                      className={`${styles.lightboxNav} ${styles.lightboxNext}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setGalleryIndex((prev) => (prev + 1) % treatment.gallery.length);
                      }}
                    >
                      <ChevronRight size={28} />
                    </button>
                  </>
                )}
                <div className={styles.lightboxCounter}>
                  {galleryIndex + 1} / {treatment.gallery.length}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      )}

      {/* Videos */}
      {hasVideos && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <Play size={20} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
            Treatment Videos
          </h2>
          <div className={styles.videoGrid}>
            {treatment.videos.map((video, idx) => {
              const ytId = video.type === 'youtube' ? getYouTubeId(video.url) : null;
              return (
                <div key={idx} className={styles.videoCard}>
                  {video.type === 'youtube' && ytId ? (
                    activeVideoIndex === idx ? (
                      <div className={styles.videoEmbed}>
                        <iframe
                          src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1`}
                          title={video.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <button
                        className={styles.videoThumbnail}
                        onClick={() => setActiveVideoIndex(idx)}
                      >
                        <img
                          src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
                          alt={video.title}
                        />
                        <div className={styles.videoPlayBtn}>
                          <Play size={32} />
                        </div>
                      </button>
                    )
                  ) : (
                    <div className={styles.videoEmbed}>
                      <video controls preload="metadata">
                        <source src={video.url} />
                      </video>
                    </div>
                  )}
                  <p className={styles.videoTitle}>{video.title}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Price Comparison - Temporarily Hidden
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Price Comparison</h2>
        <div className={styles.priceComparison}>
          <div className={`${styles.priceBox} ${styles.usaPrice}`}>
            <span className={styles.priceLabel}>USA Average</span>
            <span className={styles.priceValue}>{formatPrice(treatment.usaPrice)}</span>
          </div>
          <div className={styles.priceVs}>vs</div>
          <div className={`${styles.priceBox} ${styles.indiaPrice}`}>
            <span className={styles.priceLabel}>Atidi Price</span>
            <span className={styles.priceValue}>{formatPrice(treatment.indiaPrice)}</span>
          </div>
        </div>
        <div className={styles.savingsBox}>
          <div className={styles.savingsContent}>
            <span className={styles.savingsLabel}>Your Savings</span>
            <span className={styles.savingsValue}>${savings.toLocaleString()}+</span>
          </div>
          <p className={styles.savingsNote}>
            + 24/7 USA follow-up care included
          </p>
        </div>
      </section>
      */}

      {/* Procedure Steps */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>The Procedure</h2>
        <div className={styles.procedure}>
          {treatment.procedure.map((step, index) => (
            <motion.div
              key={step.step}
              className={`${styles.stepCard} ${expandedStep === index ? styles.expanded : ''}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <button
                className={styles.stepHeader}
                onClick={() => setExpandedStep(expandedStep === index ? null : index)}
              >
                <div className={styles.stepNumber}>
                  <span>{String(step.step).padStart(2, '0')}</span>
                </div>
                <div className={styles.stepTitle}>{step.title}</div>
                <div className={styles.stepToggle}>
                  {expandedStep === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </button>
              <motion.div
                className={styles.stepContent}
                initial={false}
                animate={{
                  height: expandedStep === index ? 'auto' : 0,
                  opacity: expandedStep === index ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
              >
                <p>{step.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Materials */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Materials Used</h2>
        <div className={styles.materials}>
          {treatment.materials.map((material, index) => (
            <div key={index} className={styles.materialItem}>
              <CheckCircle size={16} className={styles.materialCheck} />
              <span>{material}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
        <div className={styles.faqList}>
          {treatment.faqs.map((faq, index) => (
            <div
              key={index}
              className={`${styles.faqItem} ${expandedFaq === index ? styles.active : ''}`}
            >
              <button
                className={styles.faqQuestion}
                onClick={() => setExpandedFaq(expandedFaq === index ? -1 : index)}
              >
                <span>{faq.question}</span>
                {expandedFaq === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              <motion.div
                className={styles.faqAnswer}
                initial={false}
                animate={{
                  height: expandedFaq === index ? 'auto' : 0,
                  opacity: expandedFaq === index ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
              >
                <p>{faq.answer}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h3>Ready to get started?</h3>
        <p>Book an appointment to discuss your treatment plan</p>
        <a href="https://app.atidinricare.com/" target="_blank" rel="noopener noreferrer" className={styles.ctaBtn}>
          <Calendar size={18} />
          Book an Appointment
          <ArrowRight size={18} />
        </a>
      </section>
    </div>
  );
};

export default TreatmentDetail;

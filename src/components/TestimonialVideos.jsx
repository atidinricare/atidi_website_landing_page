'use client'
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, CheckCircle2, X, Quote } from 'lucide-react';
import { getImageUrl } from '@/lib/image-url';
import styles from './TestimonialVideos.module.css';

// Testimonial data - real patient stories (Indian NRIs)
// Using local images from /testimonials folder
const testimonials = [
  {
    id: 1,
    name: 'Kunal',
    video: '/testimonials/kunal.mp4',
    thumbnail: '/testimonials/kunal.jpg',
    quote: "The entire experience was seamless. From booking to follow-up, everything exceeded my expectations.",
  },
  {
    id: 2,
    name: 'Priya',
    video: '/testimonials/priya.mp4',
    thumbnail: '/testimonials/img2.jpg',
    quote: "Saved $4,000 on my implants and got world-class care. The quality was better than what I found in the US.",
  },
  {
    id: 3,
    name: 'Anita',
    video: '/testimonials/anita.mp4',
    thumbnail: '/testimonials/img4.jpg',
    quote: "My care manager made everything so easy. I felt supported every step of the way.",
  },
  {
    id: 4,
    name: 'Vikram',
    video: '/testimonials/vikram.mp4',
    thumbnail: '/testimonials/img5.jpg',
    quote: "The follow-up care in California was exceptional. They had all my records ready.",
  },
  {
    id: 5,
    name: 'Deepa',
    video: '/testimonials/deepa.mp4',
    thumbnail: '/testimonials/img6.jpg',
    quote: "I was nervous about dental tourism, but Atidi made it feel safe and professional.",
  },
  {
    id: 6,
    name: 'Suresh',
    video: '/testimonials/suresh.mp4',
    thumbnail: '/testimonials/img7.jpg',
    quote: "Combined my treatment with visiting family. Best decision I ever made for my dental health.",
  },
  {
    id: 7,
    name: 'Meera',
    video: '/testimonials/meera.mp4',
    thumbnail: '/testimonials/img8.jpg',
    quote: "The clinic in Chennai was more advanced than anything I've seen in New Jersey.",
  },
  {
    id: 8,
    name: 'Arun',
    video: '/testimonials/arun.mp4',
    thumbnail: '/testimonials/img9.jpg',
    quote: "From veneers to crowns, they handled everything in one trip. Incredible efficiency.",
  },
  {
    id: 9,
    name: 'Kavitha',
    video: '/testimonials/kavitha.mp4',
    thumbnail: '/testimonials/img10.jpg',
    quote: "My smile transformation was worth every moment. The team genuinely cared about my results.",
  },
  {
    id: 10,
    name: 'Arjun',
    video: '/testimonials/arjun.mp4',
    thumbnail: '/testimonials/img11.jpg',
    quote: "The coordination between India and US clinics was flawless. Truly impressed.",
  },
  {
    id: 11,
    name: 'Lakshmi',
    video: '/testimonials/lakshmi.mp4',
    thumbnail: '/testimonials/img23.jpg',
    quote: "Got my root canal and crowns done in one week. Back home with a perfect smile.",
  },
  {
    id: 12,
    name: 'Rahul',
    video: '/testimonials/rahul.mp4',
    thumbnail: '/testimonials/Nonresident.jpg',
    quote: "The savings were incredible. Same quality, fraction of the price.",
  },
  {
    id: 13,
    name: 'Sunita',
    video: '/testimonials/sunita.mp4',
    thumbnail: '/testimonials/Nonresident2.jpg',
    quote: "Finally got the smile makeover I always wanted. Thank you Atidi!",
  },
  {
    id: 14,
    name: 'Karthik',
    video: '/testimonials/karthik.mp4',
    thumbnail: '/testimonials/img2.jpg',
    quote: "Professional from start to finish. The team answered all my questions patiently.",
  },
  {
    id: 15,
    name: 'Divya',
    video: '/testimonials/divya.mp4',
    thumbnail: '/testimonials/img4.jpg',
    quote: "Combining dental care with family visit was the smartest decision. Highly recommend!",
  },
];

// Split testimonials into 3 columns (5 each)
const column1 = [testimonials[0], testimonials[3], testimonials[6], testimonials[9], testimonials[12]];
const column2 = [testimonials[1], testimonials[4], testimonials[7], testimonials[10], testimonials[13]];
const column3 = [testimonials[2], testimonials[5], testimonials[8], testimonials[11], testimonials[14]];

const VideoCard = ({ testimonial, onPlay, onHover, onTouchStart, onTouchEnd }) => {
  return (
    <motion.div
      className={styles.videoCard}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => onHover(testimonial)}
      onTouchStart={() => onTouchStart && onTouchStart(testimonial)}
      onTouchEnd={() => onTouchEnd && onTouchEnd()}
    >
      <div className={styles.videoThumbnail}>
        <img
          src={getImageUrl(testimonial.thumbnail, assetBaseUrl)}
          onError={(e) => { e.target.src = testimonial.thumbnail }}
          alt={`${testimonial.name}'s testimonial`}
          loading="lazy"
        />
        <div className={styles.videoOverlay} />

        {/* Minimal play icon */}
        <button
          className={styles.playButton}
          onClick={() => onPlay(testimonial)}
          aria-label={`Play ${testimonial.name}'s video`}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <polygon points="9.5,7.5 9.5,16.5 16.5,12" />
          </svg>
        </button>
      </div>
      <div className={styles.videoBadge}>
        <span className={styles.badgeName}>{testimonial.name}</span>
        <span className={styles.badgeStatus}>
          Atidi Patient
          <CheckCircle2 size={10} />
        </span>
      </div>
    </motion.div>
  );
};

const ScrollColumn = ({ testimonials, direction = 'up', speed = 'normal', onPlay, onHover, onTouchStart, onTouchEnd }) => {
  // Duplicate testimonials for seamless loop
  const duplicatedTestimonials = [...testimonials, ...testimonials, ...testimonials];

  return (
    <div className={styles.scrollColumnWrapper}>
      <div
        className={`${styles.scrollColumn} ${styles[direction]} ${styles[speed]}`}
      >
        {duplicatedTestimonials.map((testimonial, index) => (
          <VideoCard
            key={`${testimonial.id}-${index}`}
            testimonial={testimonial}
            onPlay={onPlay}
            onHover={onHover}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          />
        ))}
      </div>
    </div>
  );
};

const TestimonialVideos = ({ assetBaseUrl } = {}) => {
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(0);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [hoveredTestimonial, setHoveredTestimonial] = useState(null);
  const [isHovering, setIsHovering] = useState(false);

  // Rotate quotes (only when not hovering)
  useEffect(() => {
    if (isHovering) return;

    const interval = setInterval(() => {
      setActiveQuoteIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isHovering]);

  const handlePlayVideo = (testimonial) => {
    setPlayingVideo(testimonial);
  };

  const handleHover = (testimonial) => {
    setHoveredTestimonial(testimonial);
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setHoveredTestimonial(null);
  };

  // Touch event handlers for mobile
  const handleTouchStart = (testimonial) => {
    setHoveredTestimonial(testimonial);
    setIsHovering(true);
  };

  const handleTouchEnd = () => {
    // Longer delay to keep scroll paused while interacting
    setTimeout(() => {
      setIsHovering(false);
      setHoveredTestimonial(null);
    }, 1500);
  };

  // Handle grid touch to pause scrolling
  const handleGridTouchStart = () => {
    setIsHovering(true);
  };

  const handleGridTouchEnd = () => {
    setTimeout(() => {
      setIsHovering(false);
      setHoveredTestimonial(null);
    }, 1500);
  };

  const closeVideoModal = () => {
    setPlayingVideo(null);
  };

  // Display either hovered testimonial or auto-rotating one
  const displayedTestimonial = hoveredTestimonial || testimonials[activeQuoteIndex];

  return (
    <section className={styles.testimonialSection}>
      {/* Background elements */}
      <div className={styles.bgGradient} />
      <div className={styles.bgNoise} />

      <div className={styles.container}>
        {/* Left: Scrolling Video Grid */}
        <div
          className={`${styles.videoGrid} ${isHovering ? styles.paused : ''}`}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleGridTouchStart}
          onTouchEnd={handleGridTouchEnd}
        >
          <ScrollColumn
            testimonials={column1}
            direction="up"
            speed="slow"
            onPlay={handlePlayVideo}
            onHover={handleHover}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          />
          <ScrollColumn
            testimonials={column2}
            direction="down"
            speed="medium"
            onPlay={handlePlayVideo}
            onHover={handleHover}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          />
          <ScrollColumn
            testimonials={column3}
            direction="up"
            speed="fast"
            onPlay={handlePlayVideo}
            onHover={handleHover}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          />
        </div>

        {/* Right: Content Block */}
        <div className={styles.content}>
          {/* Section Label */}
          <motion.span
            className={styles.sectionLabel}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Patient Stories
          </motion.span>

          {/* Main Headline - Split line typography */}
          <motion.h2
            className={styles.headline}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <span className={styles.headlineLine1}>Real patients<span className={styles.comma}>,</span></span>
            <span className={styles.headlineLine2}>real <em>transformations</em><span className={styles.dot}>.</span></span>
          </motion.h2>

          {/* Stats Row */}
          <motion.div
            className={styles.statsRow}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className={styles.statItem}>
              <span className={styles.statNumber}>100%</span>
              <span className={styles.statLabel}>recommend us</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span className={styles.statNumber}>60%</span>
              <span className={styles.statLabel}>average savings</span>
            </div>
          </motion.div>

          {/* Quote Block */}
          <motion.div
            className={styles.quoteBlock}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Quote className={styles.quoteIcon} size={32} />

            <AnimatePresence mode="wait">
              <motion.blockquote
                key={displayedTestimonial.id}
                className={styles.quote}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
              >
                "{displayedTestimonial.quote}"
              </motion.blockquote>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={`author-${displayedTestimonial.id}`}
                className={styles.quoteAuthor}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <span className={styles.authorName}>{displayedTestimonial.name}</span>
                <span className={styles.authorBadge}>
                  <CheckCircle2 size={12} />
                  Verified Patient
                </span>
              </motion.div>
            </AnimatePresence>

            {/* Quote indicators */}
            <div className={styles.quoteIndicators}>
              {testimonials.slice(0, 5).map((_, index) => (
                <button
                  key={index}
                  className={`${styles.indicator} ${activeQuoteIndex % 5 === index ? styles.active : ''}`}
                  onClick={() => setActiveQuoteIndex(index)}
                  aria-label={`Show quote ${index + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {playingVideo && (
          <motion.div
            className={styles.videoModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeVideoModal}
          >
            <motion.div
              className={styles.videoModalContent}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className={styles.modalClose}
                onClick={closeVideoModal}
                aria-label="Close video"
              >
                <X size={24} />
              </button>
              <video
                className={styles.modalVideo}
                autoPlay
                controls
                playsInline
              >
                <source src={playingVideo.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className={styles.modalInfo}>
                <div className={styles.modalHeader}>
                  <span className={styles.modalName}>{playingVideo.name}</span>
                  <span className={styles.modalBadge}>
                    <CheckCircle2 size={14} />
                    Atidi Patient
                  </span>
                </div>
                <p className={styles.modalQuote}>"{playingVideo.quote}"</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default TestimonialVideos;

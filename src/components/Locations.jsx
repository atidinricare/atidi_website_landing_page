'use client'
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ArrowUpRight, Plane, Stethoscope, Plus } from 'lucide-react';
import styles from './Locations.module.css';

const INITIAL_COUNT = 4;
const LOAD_MORE_COUNT = 4;

// Group locations by state with Andhra Pradesh first
const STATE_ORDER = ['Andhra Pradesh', 'Telangana', 'Karnataka', 'Tamil Nadu'];

const groupByState = (locations) => {
  const stateMap = {};

  locations.forEach(loc => {
    if (!stateMap[loc.state]) {
      stateMap[loc.state] = [];
    }
    stateMap[loc.state].push(loc);
  });

  // Use defined order, then any remaining states
  const orderedStates = [
    ...STATE_ORDER.filter(s => stateMap[s]),
    ...Object.keys(stateMap).filter(s => !STATE_ORDER.includes(s))
  ];

  return orderedStates.map(state => ({
    state,
    locations: stateMap[state]
  }));
};

const Locations = ({ indiaLocations, usLocations, onSelectLocation }) => {
  const [activeTab, setActiveTab] = useState('india');
  const [usaVisibleCount, setUsaVisibleCount] = useState(INITIAL_COUNT);

  const indiaGrouped = groupByState(indiaLocations);

  const usaLocations = usLocations.slice(0, usaVisibleCount);
  const usaHasMore = usaVisibleCount < usLocations.length;
  const usaRemaining = usLocations.length - usaVisibleCount;

  const handleLoadMore = () => {
    setUsaVisibleCount(prev => Math.min(prev + LOAD_MORE_COUNT, usLocations.length));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <section className={styles.section} id="locations">
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
              Our Network
            </motion.span>
            <motion.h2
              className={styles.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className={styles.titleLine1}>Treatment in India<span className={styles.comma}>,</span></span>
              <span className={styles.titleLine2}>follow-up in <em>America</em><span className={styles.dot}>.</span></span>
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
              <strong>Our network spans 23 South Indian cities and 10 USA states for seamless care continuity</strong>
            </p>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statValue}>23</span>
                <span className={styles.statLabel}>South Indian Cities</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.stat}>
                <span className={styles.statValue}>10</span>
                <span className={styles.statLabel}>USA States</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tab Switcher */}
        <motion.div
          className={styles.tabWrapper}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'india' ? styles.active : ''}`}
              onClick={() => handleTabChange('india')}
            >
              <Plane size={16} className={styles.tabIcon} />
              <span className={styles.tabFlag}>India</span>
              <span className={styles.tabLabel}>Empaneled Hospitals</span>
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'usa' ? styles.active : ''}`}
              onClick={() => handleTabChange('usa')}
            >
              <Stethoscope size={16} className={styles.tabIcon} />
              <span className={styles.tabFlag}>USA</span>
              <span className={styles.tabLabel}>Empaneled Hospitals</span>
            </button>
            <div
              className={styles.tabIndicator}
              style={{ transform: `translateX(${activeTab === 'india' ? '0' : '100%'})` }}
            />
          </div>
        </motion.div>

        {/* Location Cards */}
        <AnimatePresence mode="wait">
          {activeTab === 'india' ? (
            <motion.div
              key="india"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {indiaGrouped.map((group, groupIndex) => (
                <div key={group.state} className={styles.stateGroup}>
                  <motion.div
                    className={styles.stateHeader}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: groupIndex * 0.1 }}
                  >
                    <MapPin size={16} className={styles.stateIcon} />
                    <h3 className={styles.stateName}>{group.state}</h3>
                    <span className={styles.stateCount}>{group.locations.length} {group.locations.length === 1 ? 'city' : 'cities'}</span>
                  </motion.div>

                  <div className={styles.grid}>
                    {group.locations.map((location, index) => (
                      <motion.article
                        key={location.id}
                        className={`${styles.card} ${styles.indiaCard}`}
                        onClick={() => onSelectLocation(location)}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: groupIndex * 0.1 + index * 0.05 }}
                      >
                        <div className={styles.cardInner}>
                          <div className={styles.cardTop}>
                            <div className={styles.cardBadge}>
                              <span className={styles.badgeFlag}>🇮🇳</span>
                              <span className={styles.badgeText}>Treatment</span>
                            </div>
                            <div className={styles.cardAction}>
                              <ArrowUpRight size={16} />
                            </div>
                          </div>

                          <div className={styles.cardContent}>
                            <h3 className={styles.cardCity}>{location.city}</h3>
                            <p className={styles.cardTagline}>{location.tagline}</p>
                          </div>
                        </div>
                        <div className={styles.cardHoverLine} />
                      </motion.article>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="usa"
              className={styles.grid}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {usaLocations.map((location, index) => (
                <motion.article
                  key={location.id}
                  className={`${styles.card} ${styles.usaCard}`}
                  onClick={() => onSelectLocation(location)}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className={styles.cardInner}>
                    <div className={styles.cardTop}>
                      <div className={styles.cardBadge}>
                        <span className={styles.badgeFlag}>🇺🇸</span>
                        <span className={styles.badgeText}>Follow-up</span>
                      </div>
                      <div className={styles.cardAction}>
                        <ArrowUpRight size={16} />
                      </div>
                    </div>

                    <div className={styles.cardContent}>
                      <h3 className={styles.cardCity}>
                        {location.city}
                        {location.stateCode && (
                          <span className={styles.stateCode}>, {location.stateCode}</span>
                        )}
                      </h3>
                      <p className={styles.cardTagline}>{location.tagline}</p>
                    </div>
                  </div>
                  <div className={styles.cardHoverLine} />
                </motion.article>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Load More Button - USA only */}
        {activeTab === 'usa' && usaHasMore && (
          <motion.div
            className={styles.loadMoreWrapper}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <button className={styles.loadMoreBtn} onClick={handleLoadMore}>
              <Plus size={18} />
              <span>Load More Locations</span>
              <span className={styles.loadMoreCount}>{usaRemaining}</span>
            </button>
          </motion.div>
        )}
      </div>

      {/* Background text */}
      <motion.span
        className={styles.bgText}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.02 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
      >
        GLOBAL
      </motion.span>
    </section>
  );
};

export default Locations;

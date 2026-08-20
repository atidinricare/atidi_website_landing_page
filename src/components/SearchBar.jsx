'use client'
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, MapPin, Stethoscope, ChevronRight } from 'lucide-react';
import styles from './SearchBar.module.css';

const SearchBar = ({ treatments, allLocations, onSelectTreatment, onSelectLocation, isPanelOpen }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const inputRef = useRef(null);
  const mobileInputRef = useRef(null);
  const containerRef = useRef(null);

  // Filter results based on query
  const filteredTreatments = treatments.filter(t =>
    t.name.toLowerCase().includes(query.toLowerCase()) ||
    t.category.toLowerCase().includes(query.toLowerCase()) ||
    t.tagline.toLowerCase().includes(query.toLowerCase())
  );

  const filteredLocations = allLocations.filter(l =>
    l.city.toLowerCase().includes(query.toLowerCase()) ||
    l.state.toLowerCase().includes(query.toLowerCase()) ||
    l.tagline.toLowerCase().includes(query.toLowerCase())
  );

  // Close dropdown when clicking outside (skip if detail panel is open)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isPanelOpen) return;
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isPanelOpen]);

  // Focus mobile input when dropdown opens
  useEffect(() => {
    if (isOpen && mobileInputRef.current) {
      setTimeout(() => {
        mobileInputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  const handleSelect = (item, type) => {
    if (type === 'treatment') {
      onSelectTreatment(item);
    } else {
      onSelectLocation(item);
    }
    // On desktop, close search after selection; on mobile, keep open so user returns here
    if (window.innerWidth > 768) {
      setQuery('');
      setIsOpen(false);
    }
  };

  const getResults = () => {
    if (activeTab === 'all') {
      return {
        treatments: filteredTreatments.slice(0, 4),
        locations: filteredLocations.slice(0, 4)
      };
    } else if (activeTab === 'treatments') {
      return { treatments: filteredTreatments, locations: [] };
    } else {
      return { treatments: [], locations: filteredLocations };
    }
  };

  const results = getResults();
  const hasResults = results.treatments.length > 0 || results.locations.length > 0;

  return (
    <div className={styles.searchContainer} ref={containerRef}>
      <div className={styles.searchWrapper}>
        <div className={styles.searchIcon}>
          <Search size={20} />
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search treatments, locations..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className={styles.searchInput}
        />
        {query && (
          <button
            className={styles.clearBtn}
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
          >
            <X size={18} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile backdrop overlay */}
            <motion.div
              className={styles.mobileOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className={styles.dropdown}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Mobile search input (visible only on mobile) */}
              <div className={styles.mobileSearchWrapper}>
                <div className={styles.mobileSearchIcon}>
                  <Search size={18} />
                </div>
                <input
                  ref={mobileInputRef}
                  type="text"
                  placeholder="Search treatments, locations..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className={styles.mobileSearchInput}
                />
                {query ? (
                  <button
                    className={styles.mobileClearBtn}
                    onClick={() => {
                      setQuery('');
                      mobileInputRef.current?.focus();
                    }}
                  >
                    <X size={16} />
                  </button>
                ) : (
                  <button
                    className={styles.mobileClearBtn}
                    onClick={() => setIsOpen(false)}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              {/* Tabs */}
            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${activeTab === 'all' ? styles.active : ''}`}
                onClick={() => setActiveTab('all')}
              >
                All
              </button>
              <button
                className={`${styles.tab} ${activeTab === 'treatments' ? styles.active : ''}`}
                onClick={() => setActiveTab('treatments')}
              >
                <Stethoscope size={14} />
                Treatments
              </button>
              <button
                className={`${styles.tab} ${activeTab === 'locations' ? styles.active : ''}`}
                onClick={() => setActiveTab('locations')}
              >
                <MapPin size={14} />
                Locations
              </button>
            </div>

            {/* Results */}
            <div className={styles.results}>
              {!hasResults && query && (
                <div className={styles.noResults}>
                  <p>No results for "{query}"</p>
                  <span>Try searching for implants, veneers, Mumbai, California...</span>
                </div>
              )}

              {/* Treatments */}
              {results.treatments.length > 0 && (
                <div className={styles.resultSection}>
                  {activeTab === 'all' && (
                    <div className={styles.sectionLabel}>
                      <Stethoscope size={14} />
                      Treatments
                    </div>
                  )}
                  {results.treatments.map((treatment, index) => (
                    <motion.button
                      key={treatment.id}
                      className={styles.resultItem}
                      onClick={() => handleSelect(treatment, 'treatment')}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ x: 4 }}
                    >
                      <div className={styles.resultIcon}>
                        <Stethoscope size={18} />
                      </div>
                      <div className={styles.resultContent}>
                        <span className={styles.resultName}>{treatment.name}</span>
                        <span className={styles.resultMeta}>
                          {treatment.category} • Save {treatment.savingsPercent}%
                        </span>
                      </div>
                      <ChevronRight size={16} className={styles.resultArrow} />
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Locations */}
              {results.locations.length > 0 && (
                <div className={styles.resultSection}>
                  {activeTab === 'all' && (
                    <div className={styles.sectionLabel}>
                      <MapPin size={14} />
                      Locations
                    </div>
                  )}
                  {results.locations.map((location, index) => (
                    <motion.button
                      key={location.id}
                      className={styles.resultItem}
                      onClick={() => handleSelect(location, 'location')}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (results.treatments.length + index) * 0.05 }}
                      whileHover={{ x: 4 }}
                    >
                      <div className={`${styles.resultIcon} ${location.type === 'treatment' ? styles.india : styles.usa}`}>
                        <MapPin size={18} />
                      </div>
                      <div className={styles.resultContent}>
                        <span className={styles.resultName}>
                          {location.city}
                          {location.stateCode && `, ${location.stateCode}`}
                        </span>
                        <span className={styles.resultMeta}>
                          {location.type === 'treatment' ? '\u{1F1EE}\u{1F1F3} Treatment Center' : '\u{1F1FA}\u{1F1F8} Follow-up Network'}
                        </span>
                      </div>
                      <ChevronRight size={16} className={styles.resultArrow} />
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Quick Actions */}
              {!query && (
                <div className={styles.quickActions}>
                  <p className={styles.quickLabel}>Popular searches</p>
                  <div className={styles.quickTags}>
                    {['Dental Implants', 'Veneers', 'Mumbai', 'California'].map(tag => (
                      <button
                        key={tag}
                        className={styles.quickTag}
                        onClick={() => {
                          setQuery(tag);
                        }}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;

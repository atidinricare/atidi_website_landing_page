'use client'
import { useState } from 'react';
import { Palette, X, Check } from 'lucide-react';

/*
  Logo colors: Blue #3944BC, Orange #F58220 / #F26522
  Palettes split into two groups:
  1. Logo-based (derived from logo colors)
  2. General palettes (original options)
  Header styles: separate toggleable options
*/

const HEADER_STYLES = [
  {
    name: 'Original',
    desc: 'Transparent on hero, light on scroll',
    colors: {
      '--header-bg': 'transparent',
      '--header-text': '#ffffff',
      '--header-cta-bg': '#ffffff',
      '--header-cta-text': '#0F172A',
    },
    preview: ['transparent', '#ffffff'],
    isOriginal: true,
  },
  {
    name: 'White',
    desc: 'Clean white background',
    colors: {
      '--header-bg': '#FFFFFF',
      '--header-text': '#334155',
      '--header-cta-bg': '#D4715E',
      '--header-cta-text': '#ffffff',
    },
    preview: ['#FFFFFF', '#334155'],
  },
  {
    name: 'Warm White',
    desc: 'Current default',
    colors: {
      '--header-bg': '#FFFDF9',
      '--header-text': '#334155',
      '--header-cta-bg': '#D4715E',
      '--header-cta-text': '#ffffff',
    },
    preview: ['#FFFDF9', '#334155'],
  },
  {
    name: 'Light Blue',
    desc: 'Soft blue tint',
    colors: {
      '--header-bg': '#EEF0FA',
      '--header-text': '#1A1E3A',
      '--header-cta-bg': '#3944BC',
      '--header-cta-text': '#ffffff',
    },
    preview: ['#EEF0FA', '#1A1E3A'],
  },
  {
    name: 'Brand Blue',
    desc: 'Logo blue header',
    colors: {
      '--header-bg': '#3944BC',
      '--header-text': '#ffffff',
      '--header-cta-bg': '#F26522',
      '--header-cta-text': '#ffffff',
    },
    preview: ['#3944BC', '#ffffff'],
  },
  {
    name: 'Dark Navy',
    desc: 'Dark header with white text',
    colors: {
      '--header-bg': '#0F172A',
      '--header-text': '#ffffff',
      '--header-cta-bg': '#F26522',
      '--header-cta-text': '#ffffff',
    },
    preview: ['#0F172A', '#ffffff'],
  },
  {
    name: 'Light Cream',
    desc: 'Warm cream tone',
    colors: {
      '--header-bg': '#FAF5ED',
      '--header-text': '#3A3225',
      '--header-cta-bg': '#F58220',
      '--header-cta-text': '#ffffff',
    },
    preview: ['#FAF5ED', '#3A3225'],
  },
  {
    name: 'Light Grey',
    desc: 'Neutral grey',
    colors: {
      '--header-bg': '#F1F5F9',
      '--header-text': '#334155',
      '--header-cta-bg': '#3944BC',
      '--header-cta-text': '#ffffff',
    },
    preview: ['#F1F5F9', '#334155'],
  },
];

const SECTION_STYLES_DARK = [
  {
    name: 'Original',
    desc: 'Original dark navy',
    color: '#0a0f1a',
  },
  {
    name: 'Midnight',
    desc: 'Slightly lighter navy',
    color: '#0F172A',
  },
  {
    name: 'Deep Blue',
    desc: 'Brand blue dark',
    color: '#141838',
  },
  {
    name: 'Charcoal',
    desc: 'Neutral dark grey',
    color: '#1a1a2e',
  },
  {
    name: 'Dark Teal',
    desc: 'Teal-tinted dark',
    color: '#0d1b1e',
  },
  {
    name: 'Warm Dark',
    desc: 'Warm brown-black',
    color: '#1a1510',
  },
  {
    name: 'Pure Black',
    desc: 'High contrast',
    color: '#000000',
  },
  {
    name: 'Dark Purple',
    desc: 'Rich purple-dark',
    color: '#150f24',
  },
];

const HERO_STYLES = [
  {
    name: 'Original',
    desc: 'Original dark hero',
    colors: {
      '--hero-bg': 'var(--midnight)',
      '--hero-text': '#ffffff',
      '--hero-text-muted': 'var(--slate)',
    },
    preview: ['#0F172A', '#ffffff'],
  },
  {
    name: 'Light Grey',
    desc: 'Clean light grey',
    colors: {
      '--hero-bg': '#F1F5F9',
      '--hero-text': '#0F172A',
      '--hero-text-muted': '#64748B',
    },
    preview: ['#F1F5F9', '#0F172A'],
  },
  {
    name: 'Warm White',
    desc: 'Soft cream tone',
    colors: {
      '--hero-bg': '#FAF8F5',
      '--hero-text': '#0F172A',
      '--hero-text-muted': '#64748B',
    },
    preview: ['#FAF8F5', '#0F172A'],
  },
  {
    name: 'Light Cream',
    desc: 'Warm cream tone',
    colors: {
      '--hero-bg': '#FAF5ED',
      '--hero-text': '#0F172A',
      '--hero-text-muted': '#64748B',
    },
    preview: ['#FAF5ED', '#0F172A'],
  },
  {
    name: 'Snow',
    desc: 'Cool off-white',
    colors: {
      '--hero-bg': '#F8FAFC',
      '--hero-text': '#0F172A',
      '--hero-text-muted': '#64748B',
    },
    preview: ['#F8FAFC', '#0F172A'],
  },
  {
    name: 'White',
    desc: 'Pure white',
    colors: {
      '--hero-bg': '#FFFFFF',
      '--hero-text': '#0F172A',
      '--hero-text-muted': '#64748B',
    },
    preview: ['#FFFFFF', '#0F172A'],
  },
  {
    name: 'Light Blue',
    desc: 'Soft blue tint',
    colors: {
      '--hero-bg': '#EEF2FF',
      '--hero-text': '#1A1E3A',
      '--hero-text-muted': '#5D6180',
    },
    preview: ['#EEF2FF', '#1A1E3A'],
  },
];

const SECTION_STYLES_LIGHT = [
  {
    name: 'White',
    desc: 'Clean white',
    color: '#FFFFFF',
    isLight: true,
  },
  {
    name: 'Warm White',
    desc: 'Soft warm tone',
    color: '#FFFDF9',
    isLight: true,
  },
  {
    name: 'Light Cream',
    desc: 'Warm cream',
    color: '#FAF5ED',
    isLight: true,
  },
  {
    name: 'Snow',
    desc: 'Cool off-white',
    color: '#F8FAFC',
    isLight: true,
  },
  {
    name: 'Light Blue',
    desc: 'Soft blue tint',
    color: '#EEF2FF',
    isLight: true,
  },
  {
    name: 'Light Grey',
    desc: 'Neutral grey',
    color: '#F1F5F9',
    isLight: true,
  },
  {
    name: 'Sage Mist',
    desc: 'Soft green tint',
    color: '#F0F5F1',
    isLight: true,
  },
  {
    name: 'Blush',
    desc: 'Warm pink tint',
    color: '#FDF2F0',
    isLight: true,
  },
];

const THEMES = [
  // ---- Logo-based palettes ----
  {
    name: 'Brand Blue',
    desc: 'Logo blue as primary',
    group: 'logo',
    colors: {
      '--midnight': '#1A1E3A',
      '--navy': '#272C52',
      '--cream': '#F7F7FB',
      '--warm-white': '#FCFCFF',
      '--sage': '#3944BC',
      '--sage-light': '#6670D4',
      '--sage-dark': '#2A3394',
      '--terracotta': '#F26522',
      '--terracotta-dark': '#D9551A',
      '--terracotta-light': '#F69052',
      '--charcoal': '#2E3354',
      '--slate': '#5D6180',
      '--mist': '#DDDFF0',
      '--cloud': '#EEEFF7',
    },
    preview: ['#1A1E3A', '#F26522', '#3944BC', '#F7F7FB'],
  },
  {
    name: 'Brand Orange',
    desc: 'Logo orange as primary',
    group: 'logo',
    colors: {
      '--midnight': '#1C1408',
      '--navy': '#2E2414',
      '--cream': '#FDF9F3',
      '--warm-white': '#FFFCF6',
      '--sage': '#3944BC',
      '--sage-light': '#6670D4',
      '--sage-dark': '#2A3394',
      '--terracotta': '#F58220',
      '--terracotta-dark': '#DC7018',
      '--terracotta-light': '#F9A45C',
      '--charcoal': '#3A3225',
      '--slate': '#7A6F55',
      '--mist': '#EDE6D8',
      '--cloud': '#F6F2EA',
    },
    preview: ['#1C1408', '#F58220', '#3944BC', '#FDF9F3'],
  },
  {
    name: 'Blue & Teal',
    desc: 'Logo blue with teal accent',
    group: 'logo',
    colors: {
      '--midnight': '#0E1A2E',
      '--navy': '#162742',
      '--cream': '#F5F9FA',
      '--warm-white': '#FAFEFF',
      '--sage': '#1A9B8A',
      '--sage-light': '#4DC4B5',
      '--sage-dark': '#127A6C',
      '--terracotta': '#3944BC',
      '--terracotta-dark': '#2A3394',
      '--terracotta-light': '#6670D4',
      '--charcoal': '#243848',
      '--slate': '#567080',
      '--mist': '#D4E6EB',
      '--cloud': '#EAF3F5',
    },
    preview: ['#0E1A2E', '#3944BC', '#1A9B8A', '#F5F9FA'],
  },
  {
    name: 'Sunset',
    desc: 'Warm orange to deep coral',
    group: 'logo',
    colors: {
      '--midnight': '#1A1018',
      '--navy': '#2C1C28',
      '--cream': '#FDF8F5',
      '--warm-white': '#FFFCFA',
      '--sage': '#3944BC',
      '--sage-light': '#6670D4',
      '--sage-dark': '#2A3394',
      '--terracotta': '#E8522D',
      '--terracotta-dark': '#CF4020',
      '--terracotta-light': '#F07A5C',
      '--charcoal': '#3C2E38',
      '--slate': '#7A6672',
      '--mist': '#E8DDE2',
      '--cloud': '#F5EFF2',
    },
    preview: ['#1A1018', '#E8522D', '#3944BC', '#FDF8F5'],
  },
  {
    name: 'Navy & Gold',
    desc: 'Deep navy with golden accent',
    group: 'logo',
    colors: {
      '--midnight': '#0C1425',
      '--navy': '#14203A',
      '--cream': '#FAF9F4',
      '--warm-white': '#FFFEF8',
      '--sage': '#3944BC',
      '--sage-light': '#6670D4',
      '--sage-dark': '#2A3394',
      '--terracotta': '#D49B2A',
      '--terracotta-dark': '#BB8620',
      '--terracotta-light': '#E4BB5C',
      '--charcoal': '#283044',
      '--slate': '#5A6578',
      '--mist': '#DDE1E8',
      '--cloud': '#EEF0F4',
    },
    preview: ['#0C1425', '#D49B2A', '#3944BC', '#FAF9F4'],
  },

  // ---- General palettes ----
  {
    name: 'Original',
    desc: 'Warm editorial',
    group: 'general',
    colors: {
      '--midnight': '#0F172A',
      '--navy': '#1E293B',
      '--cream': '#FAF8F5',
      '--warm-white': '#FFFDF9',
      '--sage': '#7C9885',
      '--sage-light': '#A8C5B0',
      '--sage-dark': '#5A7563',
      '--terracotta': '#D4715E',
      '--terracotta-dark': '#C25D4A',
      '--terracotta-light': '#E8A090',
      '--charcoal': '#334155',
      '--slate': '#64748B',
      '--mist': '#E2E8F0',
      '--cloud': '#F1F5F9',
    },
    preview: ['#0F172A', '#D4715E', '#7C9885', '#FAF8F5'],
  },
  {
    name: 'Ocean Teal',
    desc: 'Fresh, tropical',
    group: 'general',
    colors: {
      '--midnight': '#0C1B2A',
      '--navy': '#142D42',
      '--cream': '#F5F9FA',
      '--warm-white': '#FAFEFF',
      '--sage': '#2A9D8F',
      '--sage-light': '#5EC4B6',
      '--sage-dark': '#1F7A6F',
      '--terracotta': '#E76F51',
      '--terracotta-dark': '#D45A3C',
      '--terracotta-light': '#F0947D',
      '--charcoal': '#264653',
      '--slate': '#5A7D8A',
      '--mist': '#D6E8EB',
      '--cloud': '#EBF4F5',
    },
    preview: ['#0C1B2A', '#E76F51', '#2A9D8F', '#F5F9FA'],
  },
  {
    name: 'Royal Blue',
    desc: 'Bold, corporate',
    group: 'general',
    colors: {
      '--midnight': '#0A1628',
      '--navy': '#162040',
      '--cream': '#F7F7FB',
      '--warm-white': '#FDFCFF',
      '--sage': '#4A6FA5',
      '--sage-light': '#7B9FCC',
      '--sage-dark': '#34567E',
      '--terracotta': '#E85D3A',
      '--terracotta-dark': '#D14825',
      '--terracotta-light': '#F28A6E',
      '--charcoal': '#2B3A55',
      '--slate': '#5E6F8A',
      '--mist': '#DDE3EE',
      '--cloud': '#EDF0F7',
    },
    preview: ['#0A1628', '#E85D3A', '#4A6FA5', '#F7F7FB'],
  },
  {
    name: 'Warm Gold',
    desc: 'Luxury, warm',
    group: 'general',
    colors: {
      '--midnight': '#1A1408',
      '--navy': '#2C2410',
      '--cream': '#FBF8F0',
      '--warm-white': '#FFFDF5',
      '--sage': '#8B7B3C',
      '--sage-light': '#B5A564',
      '--sage-dark': '#6B5E2B',
      '--terracotta': '#C4652A',
      '--terracotta-dark': '#A8521E',
      '--terracotta-light': '#D99060',
      '--charcoal': '#3D3525',
      '--slate': '#7A6F55',
      '--mist': '#E8E2D4',
      '--cloud': '#F3F0E6',
    },
    preview: ['#1A1408', '#C4652A', '#8B7B3C', '#FBF8F0'],
  },
  {
    name: 'Forest',
    desc: 'Natural, earthy',
    group: 'general',
    colors: {
      '--midnight': '#0B1A14',
      '--navy': '#14291F',
      '--cream': '#F5F8F5',
      '--warm-white': '#FBFDFB',
      '--sage': '#3D7A5A',
      '--sage-light': '#6AAE85',
      '--sage-dark': '#2C5C42',
      '--terracotta': '#CB6843',
      '--terracotta-dark': '#B05530',
      '--terracotta-light': '#DE9272',
      '--charcoal': '#2A3F33',
      '--slate': '#5A7566',
      '--mist': '#D6E5DC',
      '--cloud': '#EBF2ED',
    },
    preview: ['#0B1A14', '#CB6843', '#3D7A5A', '#F5F8F5'],
  },
  {
    name: 'Plum',
    desc: 'Premium, modern',
    group: 'general',
    colors: {
      '--midnight': '#1A0F24',
      '--navy': '#2B1A3A',
      '--cream': '#FAF7FC',
      '--warm-white': '#FEFCFF',
      '--sage': '#7E5C9B',
      '--sage-light': '#A885C5',
      '--sage-dark': '#5E4375',
      '--terracotta': '#D4625A',
      '--terracotta-dark': '#BE4E46',
      '--terracotta-light': '#E49088',
      '--charcoal': '#3A2E47',
      '--slate': '#6E5F82',
      '--mist': '#E3DCE9',
      '--cloud': '#F1EDF5',
    },
    preview: ['#1A0F24', '#D4625A', '#7E5C9B', '#FAF7FC'],
  },
  {
    name: 'Copper',
    desc: 'Elegant, grounded',
    group: 'general',
    colors: {
      '--midnight': '#1C1210',
      '--navy': '#2E201C',
      '--cream': '#FBF7F5',
      '--warm-white': '#FFFCFA',
      '--sage': '#8A6E5A',
      '--sage-light': '#B39680',
      '--sage-dark': '#6B5444',
      '--terracotta': '#B8572E',
      '--terracotta-dark': '#9E4522',
      '--terracotta-light': '#D08060',
      '--charcoal': '#3C302A',
      '--slate': '#7A6A5E',
      '--mist': '#E6DDD6',
      '--cloud': '#F2EDE8',
    },
    preview: ['#1C1210', '#B8572E', '#8A6E5A', '#FBF7F5'],
  },
  {
    name: 'Slate Blue',
    desc: 'Clean, professional',
    group: 'general',
    colors: {
      '--midnight': '#10141F',
      '--navy': '#1A2035',
      '--cream': '#F6F7FA',
      '--warm-white': '#FCFCFF',
      '--sage': '#5B7B95',
      '--sage-light': '#88A5BA',
      '--sage-dark': '#425D73',
      '--terracotta': '#D66B4E',
      '--terracotta-dark': '#C05638',
      '--terracotta-light': '#E69580',
      '--charcoal': '#2E3748',
      '--slate': '#5E6E82',
      '--mist': '#DCE1EA',
      '--cloud': '#EDF0F5',
    },
    preview: ['#10141F', '#D66B4E', '#5B7B95', '#F6F7FA'],
  },
];

const logoThemes = THEMES.filter(t => t.group === 'logo');
const generalThemes = THEMES.filter(t => t.group === 'general');

const ThemeSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState('Original');
  const [activeHeader, setActiveHeader] = useState('Warm White');
  const [activeSection, setActiveSection] = useState('Original');
  const [activeHero, setActiveHero] = useState('Original');

  const applySection = (section) => {
    const root = document.documentElement;
    root.style.setProperty('--section-dark', section.color);
    if (section.isLight) {
      root.style.setProperty('--section-text', '#0F172A');
      root.style.setProperty('--section-text-muted', '#64748B');
      root.style.setProperty('--section-text-subtle', '#94A3B8');
      root.style.setProperty('--section-border', '#E2E8F0');
      root.style.setProperty('--section-overlay', 'rgba(0, 0, 0, 0.03)');
      root.style.setProperty('--section-card-shadow', '0 1px 3px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.05)');
      root.style.setProperty('--section-accent-bg', '#0F172A');
      root.style.setProperty('--section-accent-text', '#ffffff');
    } else {
      root.style.setProperty('--section-text', '#ffffff');
      root.style.setProperty('--section-text-muted', 'rgba(255, 255, 255, 0.6)');
      root.style.setProperty('--section-text-subtle', 'rgba(255, 255, 255, 0.35)');
      root.style.setProperty('--section-border', 'rgba(255, 255, 255, 0.15)');
      root.style.setProperty('--section-overlay', 'rgba(255, 255, 255, 0.05)');
      root.style.setProperty('--section-card-shadow', 'none');
      root.style.setProperty('--section-accent-bg', '#ffffff');
      root.style.setProperty('--section-accent-text', '#0a0f1a');
    }
    setActiveSection(section.name);
  };

  const applyHero = (hero) => {
    const root = document.documentElement;
    Object.entries(hero.colors).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    setActiveHero(hero.name);
  };

  const applyTheme = (theme) => {
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    setActiveTheme(theme.name);
  };

  const applyHeader = (header) => {
    const root = document.documentElement;
    Object.entries(header.colors).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    // Toggle original mode (transparent hero header)
    if (header.isOriginal) {
      root.setAttribute('data-header-original', 'true');
    } else {
      root.removeAttribute('data-header-original');
    }
    setActiveHeader(header.name);
  };

  const renderThemeButton = (theme) => (
    <button
      key={theme.name}
      onClick={() => applyTheme(theme)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '8px 10px',
        border: activeTheme === theme.name
          ? '2px solid #3944BC'
          : '1px solid #E2E8F0',
        borderRadius: '10px',
        background: activeTheme === theme.name ? '#F0F0FA' : 'white',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        width: '100%',
        textAlign: 'left',
      }}
    >
      <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
        {theme.preview.map((color, i) => (
          <div
            key={i}
            style={{
              width: '18px',
              height: '18px',
              borderRadius: i === 0 ? '4px 0 0 4px' : i === 3 ? '0 4px 4px 0' : '0',
              background: color,
              border: '1px solid rgba(0,0,0,0.08)',
            }}
          />
        ))}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{ fontSize: '13px', fontWeight: activeTheme === theme.name ? 600 : 500, color: '#334155', display: 'block' }}>
          {theme.name}
        </span>
        <span style={{ fontSize: '10px', color: '#94A3B8', display: 'block' }}>
          {theme.desc}
        </span>
      </div>
      {activeTheme === theme.name && (
        <Check size={16} style={{ color: '#3944BC', flexShrink: 0 }} />
      )}
    </button>
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '90px',
          right: '24px',
          zIndex: 9998,
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: '#3944BC',
          color: 'white',
          border: '2px solid rgba(255,255,255,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(57,68,188,0.4)',
          transition: 'transform 0.2s ease',
          transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
        }}
      >
        {isOpen ? <X size={20} /> : <Palette size={20} />}
      </button>

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '150px',
            right: '24px',
            zIndex: 9997,
            width: '300px',
            maxHeight: '70vh',
            overflowY: 'auto',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 8px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
            padding: '16px',
          }}
        >
          {/* Header styles section */}
          <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#E85D3A', marginBottom: '8px' }}>
            Header Style
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
            {HEADER_STYLES.map((header) => (
              <button
                key={header.name}
                onClick={() => applyHeader(header)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 10px',
                  border: activeHeader === header.name
                    ? '2px solid #3944BC'
                    : '1px solid #E2E8F0',
                  borderRadius: '8px',
                  background: activeHeader === header.name ? '#F0F0FA' : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left',
                }}
                title={header.desc}
              >
                {/* Mini preview: bg + text color */}
                <div
                  style={{
                    width: '22px',
                    height: '16px',
                    borderRadius: '3px',
                    background: header.preview[0] === 'transparent'
                      ? 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%)'
                      : header.preview[0],
                    backgroundSize: header.preview[0] === 'transparent' ? '8px 8px' : 'auto',
                    backgroundPosition: header.preview[0] === 'transparent' ? '0 0, 4px 4px' : 'auto',
                    border: '1px solid rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '10px',
                      height: '2px',
                      borderRadius: '1px',
                      background: header.preview[1],
                    }}
                  />
                </div>
                <span style={{ fontSize: '11px', fontWeight: activeHeader === header.name ? 600 : 400, color: '#334155' }}>
                  {header.name}
                </span>
              </button>
            ))}
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: '#E2E8F0', margin: '4px 0 12px' }} />

          {/* Hero Style */}
          <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#3944BC', marginBottom: '8px' }}>
            Hero Section
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
            {HERO_STYLES.map((hero) => (
              <button
                key={hero.name}
                onClick={() => applyHero(hero)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 10px',
                  border: activeHero === hero.name
                    ? '2px solid #3944BC'
                    : '1px solid #E2E8F0',
                  borderRadius: '8px',
                  background: activeHero === hero.name ? '#F0F0FA' : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left',
                }}
                title={hero.desc}
              >
                <div
                  style={{
                    width: '22px',
                    height: '16px',
                    borderRadius: '3px',
                    background: hero.preview[0],
                    border: '1px solid rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '10px',
                      height: '2px',
                      borderRadius: '1px',
                      background: hero.preview[1],
                    }}
                  />
                </div>
                <span style={{ fontSize: '11px', fontWeight: activeHero === hero.name ? 600 : 400, color: '#334155' }}>
                  {hero.name}
                </span>
              </button>
            ))}
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: '#E2E8F0', margin: '4px 0 12px' }} />

          {/* Section backgrounds - Dark */}
          <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#7C9885', marginBottom: '8px' }}>
            Section Background — Dark
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
            {SECTION_STYLES_DARK.map((section) => (
              <button
                key={section.name}
                onClick={() => applySection(section)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 10px',
                  border: activeSection === section.name
                    ? '2px solid #3944BC'
                    : '1px solid #E2E8F0',
                  borderRadius: '8px',
                  background: activeSection === section.name ? '#F0F0FA' : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left',
                }}
                title={section.desc}
              >
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '4px',
                    background: section.color,
                    border: '1px solid rgba(0,0,0,0.15)',
                  }}
                />
                <span style={{ fontSize: '11px', fontWeight: activeSection === section.name ? 600 : 400, color: '#334155' }}>
                  {section.name}
                </span>
              </button>
            ))}
          </div>

          {/* Section backgrounds - Light */}
          <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4715E', marginBottom: '8px' }}>
            Section Background — Light
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
            {SECTION_STYLES_LIGHT.map((section) => (
              <button
                key={section.name}
                onClick={() => applySection(section)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 10px',
                  border: activeSection === section.name
                    ? '2px solid #3944BC'
                    : '1px solid #E2E8F0',
                  borderRadius: '8px',
                  background: activeSection === section.name ? '#F0F0FA' : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left',
                }}
                title={section.desc}
              >
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '4px',
                    background: section.color,
                    border: '1px solid rgba(0,0,0,0.15)',
                  }}
                />
                <span style={{ fontSize: '11px', fontWeight: activeSection === section.name ? 600 : 400, color: '#334155' }}>
                  {section.name}
                </span>
              </button>
            ))}
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: '#E2E8F0', margin: '4px 0 12px' }} />

          {/* Logo-based section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <img src="/athidi.png" alt="Atidi" style={{ height: '20px' }} />
            <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#3944BC' }}>
              Based on Logo
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
            {logoThemes.map(renderThemeButton)}
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: '#E2E8F0', margin: '4px 0 12px' }} />

          {/* General section */}
          <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#64748B', marginBottom: '8px' }}>
            Other Options
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {generalThemes.map(renderThemeButton)}
          </div>

          <p style={{ fontSize: '10px', color: '#94A3B8', marginTop: '10px', lineHeight: 1.4, textAlign: 'center' }}>
            Preview only. Will be removed after selection.
          </p>
        </div>
      )}
    </>
  );
};

export default ThemeSwitcher;

'use client'

const HeroMosaic = () => {
  return (
    <div className="hero-collage-wrap">
      <img
        className="hero-collage-bg"
        src="/athidi_care_life2.webp"
        alt="Atidi NRI Care — patients, doctors, and clinics"
        loading="eager"
        onError={(e) => { e.target.src = '/athidi_care_life2.webp' }}
      />
    </div>
  )
}

export default HeroMosaic

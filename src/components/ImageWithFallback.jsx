'use client'

import { useState, useCallback } from 'react'

/**
 * Image component that loads from S3/CDN with automatic fallback to local /public/.
 * If the S3/CDN image fails to load, it falls back to the original local path.
 */
export default function ImageWithFallback({ src, fallback, alt = '', ...props }) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasFailed, setHasFailed] = useState(false)

  const handleError = useCallback(() => {
    if (!hasFailed && fallback && fallback !== imgSrc) {
      setImgSrc(fallback)
      setHasFailed(true)
    }
  }, [hasFailed, fallback, imgSrc])

  return <img src={imgSrc} alt={alt} onError={handleError} {...props} />
}

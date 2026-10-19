'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Frontend error boundary caught:', error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-20 text-center">
      <span className="text-sm font-semibold tracking-wider text-rose-600 uppercase mb-2">
        Error
      </span>
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-serif">
        Something went wrong
      </h1>
      <p className="text-gray-600 max-w-md mb-8 text-base">
        An error occurred while loading this page. You can try refreshing or return to the home page.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={() => reset()}
          className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}


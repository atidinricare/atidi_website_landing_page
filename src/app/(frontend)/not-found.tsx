import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-20 text-center">
      <span className="text-sm font-semibold tracking-wider text-teal-600 uppercase mb-2">
        404 Error
      </span>
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-serif">
        Page Not Found
      </h1>
      <p className="text-gray-600 max-w-md mb-8 text-base">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition-colors"
      >
        Back to Home
      </Link>
    </div>
  )
}


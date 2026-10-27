/**
 * Renders a document's structured data as a JSON-LD script tag.
 *
 * The value comes from the SEO tab's "Structured Data" field, so it is author
 * controlled rather than generated. Accepts a single schema.org object or an
 * array of them, and also tolerates a JSON string, since pasting into a JSON
 * field can leave one.
 *
 * Renders nothing when the field is empty or unparseable, so a malformed paste
 * degrades to no structured data rather than a broken page.
 */
const JsonLd = ({ data }: { data: unknown }) => {
  if (!data) return null

  let value: unknown = data

  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return null
    try {
      value = JSON.parse(trimmed)
    } catch {
      return null
    }
  }

  if (typeof value !== 'object' || value === null) return null
  if (Array.isArray(value) && value.length === 0) return null
  if (!Array.isArray(value) && Object.keys(value as object).length === 0) return null

  let json: string
  try {
    json = JSON.stringify(value)
  } catch {
    return null
  }

  // `<` is escaped so a string inside the schema can never close the tag early.
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json.replace(/</g, '\\u003c') }}
    />
  )
}

export default JsonLd

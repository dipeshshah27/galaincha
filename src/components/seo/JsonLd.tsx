export type JsonLdValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | JsonLdValue[]
  | { [key: string]: JsonLdValue }

// `undefined` values are dropped by JSON.stringify, so optional fields can be
// spread in conditionally without polluting the output.
export type JsonLdObject = {
  '@context'?: string
  '@type': string
} & { [key: string]: JsonLdValue }

type Props = {
  data: JsonLdObject | JsonLdObject[]
}

// Renders a schema.org JSON-LD block. Stringifying our own typed objects (never
// user HTML) is the standard, safe way to emit structured data in React.
export function JsonLd({ data }: Props) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify of trusted, typed data is the canonical JSON-LD pattern.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

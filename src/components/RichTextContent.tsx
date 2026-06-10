import { RichText } from '@payloadcms/richtext-lexical/react'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

import { cn } from '@/lib/cn'

type Props = {
  data: DefaultTypedEditorState
  className?: string
}

export function RichTextContent({ data, className }: Props) {
  return <RichText data={data} className={cn('prose-rug', className)} />
}

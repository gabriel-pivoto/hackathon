import { cn } from '@/lib/utils'

interface Props {
  label: string
  value: React.ReactNode
  mono?: boolean
  className?: string
}

/** Linha rotulo/valor usada nas fichas tecnicas. */
export function MetaRow({ label, value, mono, className }: Props) {
  return (
    <div className={cn('flex items-baseline justify-between gap-4 py-2', className)}>
      <span className="shrink-0 label">{label}</span>
      <span className={cn('text-right text-sm font-medium', mono && 'font-mono tabular-nums')}>{value}</span>
    </div>
  )
}

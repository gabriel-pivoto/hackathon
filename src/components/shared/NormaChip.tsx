import { cn } from '@/lib/utils'

interface Props {
  codigo: string
  className?: string
  title?: string
}

/** Codigo de norma em pill mono. */
export function NormaChip({ codigo, className, title }: Props) {
  const ehPbqph = codigo.toUpperCase().includes('PBQP')
  return (
    <span
      title={title ?? codigo}
      className={cn(
        'inline-flex shrink-0 items-center rounded border px-1.5 py-0.5 font-mono text-[11px] font-medium tracking-tight',
        ehPbqph
          ? 'border-transparent bg-blue-400/[0.08] text-blue-400/90'
          : 'border-transparent bg-emerald-400/[0.08] text-emerald-400/90',
        className,
      )}
    >
      {codigo}
    </span>
  )
}

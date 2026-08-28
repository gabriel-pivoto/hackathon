import type { StatusBadgeKind } from '@/types'
import { cn } from '@/lib/utils'

const mapa: Record<StatusBadgeKind, { label: string; dot: string; wrap: string }> = {
  conforme: {
    label: 'Conforme',
    dot: 'bg-emerald-400',
    wrap: 'border-transparent bg-emerald-400/[0.08] text-emerald-400',
  },
  nao_conforme: {
    label: 'Não conforme',
    dot: 'bg-red-500',
    wrap: 'border-transparent bg-red-500/[0.08] text-red-500',
  },
  requer_analise: {
    label: 'Requer análise',
    dot: 'bg-amber-500',
    wrap: 'border-transparent bg-amber-500/[0.08] text-amber-500',
  },
  pendente: {
    label: 'Pendente',
    dot: 'bg-muted-foreground',
    wrap: 'border-transparent bg-muted text-muted-foreground',
  },
}

interface Props {
  status: StatusBadgeKind
  className?: string
  size?: 'sm' | 'default'
}

export function StatusBadge({ status, className, size = 'default' }: Props) {
  const cfg = mapa[status]
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 rounded border font-semibold tracking-tight',
        size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-[11px]',
        cfg.wrap,
        className,
      )}
    >
      <span className={cn('size-1.5 rounded-full', cfg.dot)} />
      {cfg.label}
    </span>
  )
}

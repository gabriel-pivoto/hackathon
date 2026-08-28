import type { Severidade } from '@/types'
import { cn } from '@/lib/utils'

const mapa: Record<Severidade, { label: string; cls: string }> = {
  baixa: { label: 'Baixa', cls: 'bg-muted text-muted-foreground' },
  media: { label: 'Média', cls: 'bg-blue-400/[0.08] text-blue-400' },
  alta: { label: 'Alta', cls: 'bg-amber-500/[0.08] text-amber-500' },
  critica: { label: 'Crítica', cls: 'bg-red-500/[0.12] text-red-500' },
}

export function SeveridadeBadge({ severidade, className }: { severidade: Severidade; className?: string }) {
  const cfg = mapa[severidade]
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded px-1.5 py-0.5 text-[11px] font-medium',
        cfg.cls,
        className,
      )}
    >
      {cfg.label}
    </span>
  )
}

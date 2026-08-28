import { cn } from '@/lib/utils'

interface ProgressProps {
  value: number
  className?: string
  barClassName?: string
  showValue?: boolean
  label?: string
}

/** Barra tecnica: fina, com o percentual em mono ao lado. */
export function Progress({ value, className, barClassName, showValue = false, label }: ProgressProps) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div className={cn('flex items-center gap-3', className)}>
      {label && <span className="text-xs text-muted-foreground shrink-0">{label}</span>}
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
        <div
          className={cn('h-full rounded-full bg-emerald-400 transition-[width] duration-700 ease-out', barClassName)}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showValue && (
        <span className="shrink-0 font-mono text-xs font-semibold tabular-nums">{pct}%</span>
      )}
    </div>
  )
}

import type { LucideIcon } from 'lucide-react'
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'

interface Props {
  title: string
  icon: LucideIcon
  value: string | number
  suffix?: string
  trend?: { valor: number; label: string; bomSeSobe?: boolean }
  progress?: number
  tone?: 'emerald' | 'red' | 'amber' | 'blue'
  className?: string
}

const tones = {
  emerald: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/25',
  red: 'text-red-500 bg-red-500/10 border-red-500/25',
  amber: 'text-amber-500 bg-amber-500/10 border-amber-500/25',
  blue: 'text-blue-400 bg-blue-400/10 border-blue-400/25',
}

export function KPICard({
  title,
  icon: Icon,
  value,
  suffix,
  trend,
  progress,
  tone = 'emerald',
  className,
}: Props) {
  const subiu = (trend?.valor ?? 0) > 0
  const parado = (trend?.valor ?? 0) === 0
  const bom = trend ? (trend.bomSeSobe === false ? !subiu : subiu) : true
  const TrendIcon = parado ? Minus : subiu ? ArrowUpRight : ArrowDownRight

  return (
    <div className={cn('tech-card group relative overflow-hidden p-6', className)}>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="flex items-start justify-between gap-3">
        <p className="label">{title}</p>
        <span className={cn('rounded border p-1.5', tones[tone])}>
          <Icon className="size-4" />
        </span>
      </div>

      <div className="mt-5 flex items-baseline gap-1">
        <span className="valor-tecnico text-[32px] font-semibold leading-none tracking-tight">
          {value}
        </span>
        {suffix && <span className="valor-tecnico text-lg text-muted-foreground">{suffix}</span>}
      </div>

      {trend && (
        <div className="mt-2.5 flex items-center gap-1.5 text-xs">
          <span
            className={cn(
              'inline-flex items-center gap-0.5 font-mono font-semibold',
              parado ? 'text-muted-foreground' : bom ? 'text-emerald-400' : 'text-red-500',
            )}
          >
            <TrendIcon className="size-3.5" />
            {trend.valor > 0 ? '+' : ''}
            {trend.valor}
          </span>
          <span className="text-muted-foreground">{trend.label}</span>
        </div>
      )}

      {progress !== undefined && !trend && <Progress value={progress} className="mt-5" />}
    </div>
  )
}

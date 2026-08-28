import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface Props {
  number: string
  title: string
  subtitle?: string
  actions?: ReactNode
  className?: string
}

/** Cabecalho com numero decorativo grande, no estilo das capas do guia. */
export function PageHeader({ number, title, subtitle, actions, className }: Props) {
  return (
    <header className={cn('mb-10 flex flex-wrap items-end justify-between gap-6', className)}>
      <div className="min-w-0">
        <span aria-hidden className="valor-tecnico block text-xs text-muted-foreground/60">
          {number}
        </span>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-[28px]">{title}</h1>
        {subtitle && (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground text-balance">
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  )
}

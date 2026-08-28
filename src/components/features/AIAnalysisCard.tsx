import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, FileText, Sparkles, Wrench } from 'lucide-react'
import type { AnaliseIA } from '@/types'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { NormaChip } from '@/components/shared/NormaChip'
import { SeveridadeBadge } from '@/components/shared/SeveridadeBadge'
import { cn } from '@/lib/utils'

interface Props {
  analise: AnaliseIA
  className?: string
  compact?: boolean
}

const bordaPorConformidade = {
  conforme: 'border-emerald-400/25',
  nao_conforme: 'border-red-500/25',
  requer_analise: 'border-amber-500/25',
} as const

/**
 * Resultado da analise da evidencia. A leitura em um golpe e:
 * o que e, se esta conforme e o que fazer. O embasamento normativo
 * continua disponivel, mas atras de um clique.
 */
export function AIAnalysisCard({ analise, className, compact }: Props) {
  const [detalhes, setDetalhes] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'overflow-hidden rounded-xl border bg-surface',
        bordaPorConformidade[analise.conformidade],
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 pt-5">
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Sparkles className="size-3.5 text-emerald-400" />
          Análise automática
          <span className="valor-tecnico text-muted-foreground/70">
            · {analise.confianca}% de confiança
          </span>
        </span>
        <StatusBadge status={analise.conformidade} />
      </div>

      <div className="space-y-5 p-6">
        <div>
          <h3 className="text-base font-semibold tracking-tight">{analise.elemento}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{analise.descricao}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <NormaChip codigo={analise.norma} />
          <SeveridadeBadge severidade={analise.severidade} />
          {analise.nivelDesempenho && (
            <span className="inline-flex items-center rounded bg-emerald-400/[0.08] px-1.5 py-0.5 text-[11px] font-medium text-emerald-400/90">
              Nível {analise.nivelDesempenho}
            </span>
          )}
        </div>

        <div className="rounded-lg bg-surface-2/50 p-4">
          <div className="flex items-start gap-2.5">
            <Wrench className="mt-0.5 size-4 shrink-0 text-emerald-400" />
            <div className="flex-1">
              <p className="label">Ação sugerida</p>
              <p className="mt-1.5 text-sm leading-relaxed">{analise.acaoSugerida}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Prazo sugerido:{' '}
                {analise.prazoSugeridoDias === 0
                  ? 'imediato'
                  : `${analise.prazoSugeridoDias} dia(s)`}
              </p>
            </div>
          </div>
        </div>

        {!compact && (
          <div>
            <button
              onClick={() => setDetalhes((d) => !d)}
              aria-expanded={detalhes}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ChevronDown
                className={cn('size-3.5 transition-transform', detalhes && 'rotate-180')}
              />
              Embasamento normativo
            </button>

            <AnimatePresence initial={false}>
              {detalhes && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 space-y-4 rounded-lg bg-surface-2/50 p-4">
                    <div className="flex items-start gap-2.5">
                      <FileText className="mt-0.5 size-4 shrink-0 text-blue-400" />
                      <div>
                        <p className="valor-tecnico text-[11px] text-blue-400">
                          {analise.itemNorma}
                        </p>
                        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                          {analise.requisito}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 border-t border-border/60 pt-3">
                      <span className="label-sm">Família {analise.familiaNorma}</span>
                      {analise.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  )
}

/** Skeleton exibido enquanto a "IA" processa a evidencia. */
export function AIAnalysisSkeleton({ etapa }: { etapa?: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-emerald-400/20 bg-surface">
      <div className="h-0.5 overflow-hidden bg-surface-2">
        <div className="h-full w-1/3 animate-shimmer bg-emerald-400" />
      </div>

      <div className="space-y-5 p-6">
        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
          <Sparkles className="size-3.5 animate-pulse-ring" />
          Analisando com IA...
        </span>

        {etapa && <p className="valor-tecnico text-[11px] text-muted-foreground">{etapa}</p>}

        <div className="space-y-2.5">
          <div className="skeleton h-5 w-3/5" />
          <div className="skeleton h-3 w-full" />
          <div className="skeleton h-3 w-full" />
          <div className="skeleton h-3 w-4/5" />
        </div>
        <div className="flex gap-2">
          <div className="skeleton h-5 w-24" />
          <div className="skeleton h-5 w-16" />
        </div>
        <div className="skeleton h-24 w-full" />
      </div>
    </div>
  )
}

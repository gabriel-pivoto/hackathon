import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, CircleDashed, XCircle } from 'lucide-react'
import type { ResultadoTeste, TesteNBR } from '@/types'
import { NormaChip } from '@/components/shared/NormaChip'
import { useRole } from '@/context/RoleContext'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn, formatDate } from '@/lib/utils'

const resultadoCfg: Record<ResultadoTeste, { label: string; icon: typeof CheckCircle2; cls: string }> = {
  aprovado: { label: 'Aprovado', icon: CheckCircle2, cls: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10' },
  reprovado: { label: 'Reprovado', icon: XCircle, cls: 'text-red-500 border-red-500/30 bg-red-500/10' },
  pendente: { label: 'Pendente', icon: CircleDashed, cls: 'text-muted-foreground border-border bg-surface-2' },
  em_execucao: { label: 'Em execução', icon: CircleDashed, cls: 'text-amber-500 border-amber-500/30 bg-amber-500/10' },
}

const nivelLabel = { M: 'Mínimo', I: 'Intermediário', S: 'Superior' } as const

export function TestCard({ teste }: { teste: TesteNBR }) {
  const cfg = resultadoCfg[teste.resultado]
  const Icon = cfg.icon
  const { podeExecutar } = useRole()

  const classe =
    'group tech-card flex flex-col overflow-hidden p-5 transition-all hover:border-emerald-400/40 hover:shadow-[0_12px_32px_-24px_rgba(0,0,0,0.5)]'

  // O gestor lê o resultado do ensaio, mas não abre a tela de execução.
  if (!podeExecutar) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn(classe, 'cursor-not-allowed opacity-90')}>{corpo(teste, cfg, Icon)}</div>
        </TooltipTrigger>
        <TooltipContent>
          Apenas engenheiros podem executar esta ação. Alterne de perfil para prosseguir.
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <Link to={`/obras/${teste.obraId}/testes/${teste.id}`} className={classe}>
      {corpo(teste, cfg, Icon)}
    </Link>
  )
}

function corpo(
  teste: TesteNBR,
  cfg: (typeof resultadoCfg)[ResultadoTeste],
  Icon: typeof CheckCircle2,
) {
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <span className="font-mono text-xs font-semibold tracking-widest text-muted-foreground">
          {teste.codigo}
        </span>
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-[11px] font-semibold',
            cfg.cls,
          )}
        >
          <Icon className="size-3" />
          {cfg.label}
        </span>
      </div>

      <h3 className="mt-3 font-semibold leading-snug tracking-tight">{teste.nome}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{teste.local}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <NormaChip codigo={teste.norma} />
        {teste.nivel && (
          <span className="inline-flex items-center gap-1 rounded border border-emerald-400/25 bg-emerald-400/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-400">
            NÍVEL {teste.nivel} · {nivelLabel[teste.nivel]}
          </span>
        )}
      </div>

      <div className="mt-4 border-t border-border/60 pt-4">
        {teste.valorMedido !== undefined ? (
          <div className="flex items-baseline justify-between gap-3">
            <div>
              <p className="label-sm">Valor medido</p>
              <p className="font-mono text-xl font-bold tabular-nums">
                {teste.valorMedido.toLocaleString('pt-BR')}{' '}
                <span className="text-sm font-normal text-muted-foreground">{teste.unidade}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="label-sm">Mínimo NBR</p>
              <p className="font-mono text-sm">{teste.criterioMinimo}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="label-sm">Critério mínimo</p>
              <p className="font-mono text-sm">{teste.criterioMinimo}</p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 opacity-0 transition-opacity group-hover:opacity-100">
              executar <ArrowRight className="size-3" />
            </span>
          </div>
        )}
      </div>

      {teste.executadoEm && (
        <p className="mt-3 font-mono text-[10px] text-muted-foreground">
          {teste.executadoPor} · {formatDate(teste.executadoEm)}
        </p>
      )}
    </>
  )
}

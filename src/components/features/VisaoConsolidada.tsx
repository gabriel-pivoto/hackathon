import { Link } from 'react-router-dom'
import { ArrowUpRight, Building2, Flame, TriangleAlert } from 'lucide-react'
import { obras, naoConformidades, testes } from '@/mocks/data'
import { useApp } from '@/context/AppContext'
import { SmartImage } from '@/components/shared/SmartImage'
import { SeveridadeBadge } from '@/components/shared/SeveridadeBadge'
import { NormaChip } from '@/components/shared/NormaChip'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn, daysUntil, relativeTime } from '@/lib/utils'

/**
 * Índice de risco do portfólio. Pondera NCs abertas, ensaios reprovados
 * e distância da conformidade em relação à meta contratual de 85%.
 */
function calcularRisco(obraId: string, conformidade: number, ncAbertas: number) {
  const reprovados = testes.filter((t) => t.obraId === obraId && t.resultado === 'reprovado').length
  const criticas = naoConformidades.filter(
    (n) => n.obraId === obraId && n.severidade === 'critica' && n.status !== 'fechada',
  ).length
  const bruto = Math.max(0, 85 - conformidade) * 2 + ncAbertas * 3 + reprovados * 8 + criticas * 6
  return Math.min(100, Math.round(bruto))
}

function faixaDeRisco(score: number) {
  if (score >= 60) return { label: 'Alto', cls: 'text-red-500 border-red-500/30 bg-red-500/10' }
  if (score >= 30) return { label: 'Médio', cls: 'text-amber-500 border-amber-500/30 bg-amber-500/10' }
  return { label: 'Baixo', cls: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10' }
}

export function VisaoConsolidada() {
  const { setObraAtualId, naoConformidades: ncs } = useApp()

  const ranking = obras
    .map((o) => ({ obra: o, risco: calcularRisco(o.id, o.conformidade, o.ncAbertas) }))
    .sort((a, b) => b.risco - a.risco)

  const criticas = ncs
    .filter((n) => n.severidade === 'critica' && n.status !== 'fechada')
    .sort((a, b) => daysUntil(a.prazo) - daysUntil(b.prazo))

  const totalUnidades = obras.reduce((s, o) => s + o.unidades, 0)
  const mediaConformidade = Math.round(
    obras.reduce((s, o) => s + o.conformidade, 0) / obras.length,
  )

  return (
    <section className="space-y-6">
      <Card>
        <CardHeader className="flex-row items-start justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="size-4 text-emerald-400" />
              Portfólio da construtora
            </CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              {obras.length} obras · {totalUnidades} unidades · conformidade média de{' '}
              {mediaConformidade}%
            </p>
          </div>
          <Link
            to="/obras"
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
          >
            ver obras <ArrowUpRight className="size-3" />
          </Link>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {ranking.map(({ obra, risco }, i) => {
            const faixa = faixaDeRisco(risco)
            return (
              <Link
                key={obra.id}
                to={`/obras/${obra.id}`}
                onClick={() => setObraAtualId(obra.id)}
                className="group overflow-hidden rounded-lg border transition-all hover:border-emerald-400/40"
              >
                <div className="relative h-24">
                  <SmartImage
                    src={obra.capa}
                    alt={obra.nome}
                    className="size-full transition-transform duration-500 group-hover:scale-105"
                    wrapperClassName="size-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900 to-navy-900/20" />
                  <span className="absolute left-2 top-2 rounded bg-navy-900/80 px-1.5 py-0.5 font-mono text-[10px] text-slate-300 backdrop-blur">
                    #{i + 1} em risco
                  </span>
                  <span
                    className={cn(
                      'absolute right-2 top-2 rounded border px-1.5 py-0.5 font-mono text-[10px] font-bold backdrop-blur',
                      faixa.cls,
                    )}
                  >
                    {faixa.label}
                  </span>
                  <p className="absolute inset-x-0 bottom-0 truncate px-3 pb-2 text-sm font-bold tracking-tight text-slate-50">
                    {obra.nome}
                  </p>
                </div>

                <div className="space-y-3 p-3">
                  <Progress value={obra.conformidade} label="Conform." showValue />
                  <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground">
                    <span className={obra.ncAbertas > 5 ? 'text-red-500' : undefined}>
                      {obra.ncAbertas} NCs abertas
                    </span>
                    <span>{obra.progresso}% executado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-surface-2">
                      <div
                        className={cn(
                          'h-full rounded-full',
                          risco >= 60 ? 'bg-red-500' : risco >= 30 ? 'bg-amber-500' : 'bg-emerald-400',
                        )}
                        style={{ width: `${risco}%` }}
                      />
                    </div>
                    <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
                      risco {risco}
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="size-4 text-red-500" />
            Alertas críticos consolidados
          </CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Não conformidades de severidade crítica em aberto, de todas as obras
          </p>
        </CardHeader>
        <CardContent className="space-y-2">
          {criticas.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Nenhum alerta crítico em aberto no portfólio.
            </p>
          )}
          {criticas.map((nc) => {
            const dias = daysUntil(nc.prazo)
            return (
              <Link
                key={nc.id}
                to={`/obras/${nc.obraId}/nao-conformidades`}
                className="flex flex-wrap items-center gap-3 rounded-md border p-3 transition-colors hover:border-red-500/40"
              >
                <TriangleAlert className="size-4 shrink-0 text-red-500" />
                <span className="font-mono text-[11px] text-muted-foreground">{nc.codigo}</span>
                <div className="min-w-[180px] flex-1">
                  <p className="text-sm font-medium leading-snug">{nc.titulo}</p>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    {obras.find((o) => o.id === nc.obraId)?.nome} · {nc.unidadeLabel} ·{' '}
                    {relativeTime(nc.abertaEm)}
                  </p>
                </div>
                <NormaChip codigo={nc.norma} />
                <SeveridadeBadge severidade={nc.severidade} />
                <span
                  className={cn(
                    'shrink-0 font-mono text-[11px]',
                    dias < 0 ? 'text-red-500' : dias <= 2 ? 'text-amber-500' : 'text-muted-foreground',
                  )}
                >
                  {dias < 0 ? `atrasada ${Math.abs(dias)} d` : `prazo ${dias} d`}
                </span>
              </Link>
            )
          })}
        </CardContent>
      </Card>
    </section>
  )
}

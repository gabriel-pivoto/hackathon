import { Link } from 'react-router-dom'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  ArrowUpRight,
  Building2,
  CalendarClock,
  FileText,
  FlaskConical,
  Plus,
  ShieldCheck,
  TriangleAlert,
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { useRole } from '@/context/RoleContext'
import { FilaReportes } from '@/components/features/FilaReportes'
import { VisaoConsolidada } from '@/components/features/VisaoConsolidada'
import {
  conformidadePorCategoria,
  evolucaoConformidade,
  feed,
  getTestesDaObra,
  obras,
} from '@/mocks/data'
import { KPICard } from '@/components/shared/KPICard'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { SeveridadeBadge } from '@/components/shared/SeveridadeBadge'
import { NormaChip } from '@/components/shared/NormaChip'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { daysUntil, relativeTime } from '@/lib/utils'

const iconePorTipo = {
  vistoria: ShieldCheck,
  teste: FlaskConical,
  nc: TriangleAlert,
  reporte: Building2,
  relatorio: FileText,
} as const

export function Dashboard() {
  const { obraAtual, obraAtualId, naoConformidades } = useApp()
  const { user, podeExecutar, ehGestor } = useRole()

  const ncsDaObra = naoConformidades.filter((n) => n.obraId === obraAtualId)
  const ncAbertas = ncsDaObra.filter((n) => n.status !== 'fechada')
  const testesPendentes = getTestesDaObra(obraAtualId).filter((t) => t.resultado === 'pendente')
  const vencendo = ncAbertas.filter((n) => {
    const d = daysUntil(n.prazo)
    return d >= 0 && d <= 2
  })

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        number="01"
        title={`Bom trabalho, ${user.nome.split(' ')[0]}.`}
        subtitle={
          ehGestor
            ? `${user.empresa} · visão consolidada de ${obras.length} obras`
            : `${obraAtual.nome} · ${obraAtual.cidade} · ${obraAtual.torres} torres, ${obraAtual.unidades} unidades`
        }
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to={`/relatorios/rel-2026-06`}>
                <FileText className="size-4" /> Relatórios
              </Link>
            </Button>
            {podeExecutar && (
              <Button asChild>
                <Link to={`/obras/${obraAtualId}/vistoria/nova`}>
                  <Plus className="size-4" /> Nova vistoria
                </Link>
              </Button>
            )}
          </>
        }
      />

      {ehGestor && <VisaoConsolidada />}

      <section className={`grid gap-4 sm:grid-cols-2 xl:grid-cols-4 ${ehGestor ? 'mt-10' : ''}`}>
        <KPICard
          title="Conformidade global"
          icon={ShieldCheck}
          value={obraAtual.conformidade}
          suffix="%"
          trend={{ valor: 4, label: 'vs. mês anterior' }}
          progress={obraAtual.conformidade}
        />
        <KPICard
          title="NCs abertas"
          icon={TriangleAlert}
          value={ncAbertas.length}
          tone="red"
          trend={{ valor: -3, label: 'vs. mês anterior', bomSeSobe: false }}
        />
        <KPICard
          title="Ensaios NBR pendentes"
          icon={FlaskConical}
          value={testesPendentes.length}
          tone="blue"
          trend={{ valor: 0, label: 'sem mudança' }}
        />
        <KPICard
          title="Prazos em 48 h"
          icon={CalendarClock}
          value={vencendo.length}
          tone="amber"
          trend={{ valor: 2, label: 'novos esta semana', bomSeSobe: false }}
        />
      </section>

      <section className="mt-10 grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Conformidade por categoria — NBR 15575</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Distribuição das verificações por eixo de desempenho
              </p>
            </div>
            <span className="hidden label-sm sm:block">
              % das verificações
            </span>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={conformidadePorCategoria} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis
                    dataKey="categoria"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    unit="%"
                  />
                  <Tooltip
                    cursor={{ fill: 'hsl(var(--muted) / 0.35)' }}
                    contentStyle={{
                      background: 'hsl(var(--surface))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
                  />
                  <Bar dataKey="conforme" name="Conforme" fill="#10B981" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="naoConforme" name="Não conforme" fill="#EF4444" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="analise" name="Requer análise" fill="#F59E0B" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Evolução da conformidade</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">Meta contratual de 85%</p>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={evolucaoConformidade}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis
                    dataKey="mes"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    domain={[60, 100]}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    unit="%"
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(var(--surface))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="conformidade"
                    name="Conformidade"
                    stroke="#10B981"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#10B981' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="meta"
                    name="Meta"
                    stroke="#60A5FA"
                    strokeWidth={1.5}
                    strokeDasharray="5 4"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </section>

      {podeExecutar && (
        <section className="mt-10">
          <FilaReportes />
        </section>
      )}

      <section className="mt-10 grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Atividade recente</CardTitle>
            <Link
              to={`/obras/${obraAtualId}`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
            >
              ver tudo <ArrowUpRight className="size-3" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-1">
            {feed.slice(0, 5).map((item) => {
              const Icon = iconePorTipo[item.tipo]
              return (
                <Link
                  key={item.id}
                  to={item.link}
                  className="group flex items-start gap-3 rounded-md p-3 transition-colors hover:bg-muted/60"
                >
                  <span className="mt-0.5 rounded border bg-surface-2 p-1.5 text-muted-foreground group-hover:border-emerald-400/30 group-hover:text-emerald-400">
                    <Icon className="size-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold tracking-tight">{item.titulo}</p>
                      {item.conformidade && <StatusBadge status={item.conformidade} size="sm" />}
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">{item.descricao}</p>
                    <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                      {item.autor} · {relativeTime(item.quando)}
                    </p>
                  </div>
                </Link>
              )
            })}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Prazos críticos</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Não conformidades vencendo nas próximas 48 h
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {vencendo.length === 0 && (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  Nenhum prazo crítico no momento.
                </p>
              )}
              {vencendo.map((nc) => (
                <Link
                  key={nc.id}
                  to={`/obras/${obraAtualId}/nao-conformidades`}
                  className="block rounded-md border p-3 transition-colors hover:border-amber-500/40"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-[11px] text-muted-foreground">{nc.codigo}</span>
                    <SeveridadeBadge severidade={nc.severidade} />
                  </div>
                  <p className="mt-1.5 text-sm font-medium leading-snug">{nc.titulo}</p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <NormaChip codigo={nc.norma} />
                    <span className="font-mono text-[11px] text-amber-500">
                      {daysUntil(nc.prazo) <= 0 ? 'vence hoje' : `${daysUntil(nc.prazo)} d`}
                    </span>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Progresso da obra</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={obraAtual.progresso} label="Execução" showValue />
              <Progress
                value={obraAtual.conformidade}
                label="Conformidade"
                showValue
                barClassName="bg-blue-400"
              />
              <Progress
                value={Math.round(((20 - testesPendentes.length) / 20) * 100)}
                label="Ensaios NBR"
                showValue
                barClassName="bg-amber-500"
              />
              <div className="border-t pt-4 font-mono text-[11px] text-muted-foreground">
                <p>entrega prevista: {new Date(obraAtual.previsaoEntrega).toLocaleDateString('pt-BR')}</p>
                <p className="mt-1">certificação: {obraAtual.nivelPbqph}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

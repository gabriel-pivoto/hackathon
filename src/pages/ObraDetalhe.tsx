import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import {
  Building2,
  Calendar,
  ChevronDown,
  Download,
  FileText,
  MapPin,
  Plus,
  Search,
  ShieldCheck,
} from 'lucide-react'
import { getObra, getTestesDaObra, getUnidadesDaObra, servicos } from '@/mocks/data'
import { equipe } from '@/mocks/users'
import { fotos } from '@/mocks/photos'
import { useApp } from '@/context/AppContext'
import { useRole } from '@/context/RoleContext'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { SmartImage } from '@/components/shared/SmartImage'
import { MetaRow } from '@/components/shared/MetaRow'
import { EmptyState } from '@/components/shared/EmptyState'
import { TestCard } from '@/components/features/TestCard'
import { KanbanNC } from '@/components/features/KanbanNC'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn, formatDate, relativeTime } from '@/lib/utils'

export function ObraDetalhe() {
  const { id = '' } = useParams()
  const obra = getObra(id)
  const { vistorias } = useApp()
  const { podeExecutar } = useRole()

  if (!obra) return <p className="text-muted-foreground">Obra não encontrada.</p>

  const vistoriasObra = vistorias.filter((v) => v.obraId === id)

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        number="02"
        title={obra.nome}
        subtitle={`${obra.endereco} · ${obra.cidade}`}
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to={`/relatorios/rel-2026-06`}>
                <FileText className="size-4" /> Relatórios
              </Link>
            </Button>
            {podeExecutar && (
              <Button asChild>
                <Link to={`/obras/${id}/vistoria/nova`}>
                  <Plus className="size-4" /> Nova vistoria
                </Link>
              </Button>
            )}
          </>
        }
      />

      <Tabs defaultValue="visao">
        <TabsList className="w-full justify-start sm:w-auto">
          <TabsTrigger value="visao">Visão geral</TabsTrigger>
          <TabsTrigger value="unidades">Unidades</TabsTrigger>
          <TabsTrigger value="vistorias">Vistorias</TabsTrigger>
          <TabsTrigger value="testes">Testes NBR 15575</TabsTrigger>
          <TabsTrigger value="ncs">Não conformidades</TabsTrigger>
          <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="visao">
          <VisaoGeral obraId={id} />
        </TabsContent>
        <TabsContent value="unidades">
          <Unidades obraId={id} />
        </TabsContent>
        <TabsContent value="vistorias">
          <ListaVistorias obraId={id} vistorias={vistoriasObra} />
        </TabsContent>
        <TabsContent value="testes">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {getTestesDaObra(id).map((t) => (
              <TestCard key={t.id} teste={t} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="ncs">
          <KanbanNC obraId={id} />
        </TabsContent>
        <TabsContent value="relatorios">
          <Relatorios />
        </TabsContent>
      </Tabs>
    </div>
  )
}

/* ------------------------------------------------------------- visão geral */

function VisaoGeral({ obraId }: { obraId: string }) {
  const obra = getObra(obraId)!
  const testes = getTestesDaObra(obraId)
  const aprovados = testes.filter((t) => t.resultado === 'aprovado').length

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="space-y-6">
        <Card className="overflow-hidden">
          <div className="relative h-56">
            <SmartImage
              src={obra.capa}
              alt={obra.nome}
              className="size-full"
              wrapperClassName="size-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-900 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 p-5">
              <div>
                <span className="text-[11px] font-medium text-emerald-400">
                  {obra.codigo} · {obra.nivelPbqph}
                </span>
                <p className="text-xl font-bold tracking-tight text-slate-50">{obra.construtora}</p>
              </div>
              <span className="font-mono text-xs text-slate-300">{obra.coordenadas}</span>
            </div>
          </div>
          <CardContent className="grid gap-6 pt-5 sm:grid-cols-2">
            <div className="space-y-4">
              <Progress value={obra.progresso} label="Execução" showValue />
              <Progress value={obra.conformidade} label="Conformidade" showValue barClassName="bg-blue-400" />
              <Progress
                value={Math.round((aprovados / testes.length) * 100)}
                label="Ensaios NBR"
                showValue
                barClassName="bg-amber-500"
              />
            </div>
            <div>
              <MetaRow label="Início" value={formatDate(obra.inicio)} mono />
              <MetaRow label="Entrega prevista" value={formatDate(obra.previsaoEntrega)} mono />
              <MetaRow label="Responsável" value={obra.responsavel} />
              <MetaRow label="Vistorias" value={obra.vistorias} mono />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="size-4 text-emerald-400" /> Implantação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative h-64 overflow-hidden rounded-md border">
              <SmartImage
                src={fotos.mapa}
                alt="Implantação do empreendimento"
                className="size-full opacity-60"
                wrapperClassName="size-full"
              />
              <div className="absolute inset-0 blueprint-grid" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="inline-flex items-center gap-2 rounded-md border border-emerald-400/40 bg-navy-900/85 px-3 py-2 font-mono text-xs text-emerald-400 backdrop-blur">
                  <MapPin className="size-3.5" /> {obra.coordenadas}
                </span>
              </div>
              <div className="absolute bottom-3 left-3 rounded bg-navy-900/85 px-2 py-1 font-mono text-[10px] text-slate-300 backdrop-blur">
                {obra.torres} torres · {obra.unidades} unidades
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <aside className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Equipe técnica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {equipe.map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 font-mono text-[11px] font-bold text-emerald-400">
                  {p.iniciais}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{p.nome}</p>
                  <p className="truncate font-mono text-[10px] text-muted-foreground">{p.cargo}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <ShieldCheck className="size-4 text-emerald-400" /> Conformidade normativa
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <MetaRow label="PBQP-H" value={obra.nivelPbqph} />
            <MetaRow label="NBR 15575" value={`${aprovados}/${testes.length} ensaios`} mono />
            <MetaRow label="NCs abertas" value={obra.ncAbertas} mono />
            <MetaRow label="Última auditoria" value="há 22 dias" />
          </CardContent>
        </Card>
      </aside>
    </div>
  )
}

/* ---------------------------------------------------------------- unidades */

function Unidades({ obraId }: { obraId: string }) {
  const unidades = getUnidadesDaObra(obraId)
  const [expandidos, setExpandidos] = useState<string[]>(['Torre A'])

  const arvore = useMemo(() => {
    const mapa = new Map<string, Map<number, typeof unidades>>()
    for (const u of unidades) {
      if (!mapa.has(u.torre)) mapa.set(u.torre, new Map())
      const andares = mapa.get(u.torre)!
      if (!andares.has(u.andar)) andares.set(u.andar, [])
      andares.get(u.andar)!.push(u)
    }
    return mapa
  }, [unidades])

  const statusLabel = {
    em_execucao: 'Em execução',
    em_vistoria: 'Em vistoria',
    liberada: 'Liberada',
  } as const

  return (
    <div className="space-y-4">
      {[...arvore.entries()].map(([torre, andares]) => {
        const aberto = expandidos.includes(torre)
        return (
          <Card key={torre}>
            <button
              onClick={() =>
                setExpandidos((a) => (aberto ? a.filter((t) => t !== torre) : [...a, torre]))
              }
              className="flex w-full items-center gap-3 p-5 text-left"
            >
              <Building2 className="size-4 text-emerald-400" />
              <span className="flex-1 font-semibold tracking-tight">{torre}</span>
              <span className="font-mono text-[11px] text-muted-foreground">
                {[...andares.values()].flat().length} unidades
              </span>
              <ChevronDown className={cn('size-4 transition-transform', aberto && 'rotate-180')} />
            </button>

            {aberto && (
              <CardContent className="space-y-4 border-t pt-5">
                {[...andares.entries()]
                  .sort((a, b) => b[0] - a[0])
                  .map(([andar, aptos]) => (
                    <div key={andar}>
                      <p className="mb-2 label-sm">
                        {andar}º pavimento
                      </p>
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                        {aptos.map((u) => (
                          <div
                            key={u.id}
                            className="rounded-md border p-3 transition-colors hover:border-emerald-400/40"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-mono text-sm font-semibold">{u.identificacao}</span>
                              {u.ncAbertas > 0 && (
                                <span className="rounded bg-red-500/15 px-1.5 py-0.5 font-mono text-[10px] font-bold text-red-500">
                                  {u.ncAbertas} NC
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-[11px] text-muted-foreground">{u.tipologia}</p>
                            <Progress value={u.conformidade} className="mt-3" showValue />
                            <p className="mt-2 font-mono text-[10px] text-muted-foreground">
                              {statusLabel[u.status]}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </CardContent>
            )}
          </Card>
        )
      })}
    </div>
  )
}

/* --------------------------------------------------------------- vistorias */

function ListaVistorias({
  obraId,
  vistorias,
}: {
  obraId: string
  vistorias: ReturnType<typeof useApp>['vistorias']
}) {
  const [busca, setBusca] = useState('')
  const [status, setStatus] = useState('todos')
  const [engenheiro, setEngenheiro] = useState('todos')
  const [servico, setServico] = useState('todos')

  const filtradas = vistorias.filter((v) => {
    if (status !== 'todos' && v.conformidade !== status) return false
    if (engenheiro !== 'todos' && v.engenheiro !== engenheiro) return false
    if (servico !== 'todos' && v.servico !== servico) return false
    if (busca && !`${v.unidadeLabel} ${v.servico} ${v.observacao}`.toLowerCase().includes(busca.toLowerCase()))
      return false
    return true
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por unidade, serviço ou observação..."
            className="h-9 pl-9"
          />
        </div>
        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="todos">Todos os status</option>
          <option value="conforme">Conforme</option>
          <option value="nao_conforme">Não conforme</option>
          <option value="requer_analise">Requer análise</option>
        </Select>
        <Select value={engenheiro} onChange={(e) => setEngenheiro(e.target.value)}>
          <option value="todos">Todos os engenheiros</option>
          {equipe.map((p) => (
            <option key={p.id} value={p.nome}>
              {p.nome}
            </option>
          ))}
        </Select>
        <Select value={servico} onChange={(e) => setServico(e.target.value)}>
          <option value="todos">Todos os serviços</option>
          {servicos.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </div>

      <p className="font-mono text-[11px] text-muted-foreground">
        {filtradas.length} de {vistorias.length} vistorias
      </p>

      {filtradas.length === 0 ? (
        <EmptyState
          icon={Search}
          title="Nenhuma vistoria encontrada"
          description="Ajuste os filtros para ver outros registros."
        />
      ) : (
        <div className="space-y-2">
          {filtradas.map((v) => (
            <Link
              key={v.id}
              to={`/obras/${obraId}/vistoria/${v.id}`}
              className="flex flex-wrap items-center gap-4 rounded-lg border bg-surface p-4 transition-colors hover:border-emerald-400/40"
            >
              <span className="font-mono text-sm font-bold">{v.unidadeLabel}</span>
              <div className="min-w-[180px] flex-1">
                <p className="text-sm font-medium">{v.servico}</p>
                <p className="line-clamp-1 text-xs text-muted-foreground">{v.observacao}</p>
              </div>
              <span className="font-mono text-[11px] text-muted-foreground">{v.engenheiro}</span>
              <span className="font-mono text-[11px] text-muted-foreground">{relativeTime(v.data)}</span>
              <span className="font-mono text-[11px] text-muted-foreground">
                {v.evidencias.length} ev.
              </span>
              <StatusBadge status={v.conformidade} size="sm" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

/* -------------------------------------------------------------- relatórios */

function Relatorios() {
  const relatorios = [
    { id: 'rel-2026-06', titulo: 'Relatório consolidado — junho', tipo: 'Consolidado', paginas: 24 },
    { id: 'rel-pbqph-06', titulo: 'Dossiê PBQP-H — SiAC Nível A', tipo: 'PBQP-H', paginas: 41 },
    { id: 'rel-nbr-06', titulo: 'Laudos NBR 15575 — ensaios executados', tipo: 'NBR 15575', paginas: 18 },
    { id: 'rel-nc-06', titulo: 'Tratativa de não conformidades', tipo: 'Consolidado', paginas: 12 },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {relatorios.map((r) => (
        <Card key={r.id} className="p-5">
          <div className="flex items-start justify-between gap-3">
            <span className="rounded border bg-surface-2 p-2 text-emerald-400">
              <FileText className="size-4" />
            </span>
            <span className="label-sm">
              {r.tipo}
            </span>
          </div>
          <p className="mt-4 font-semibold tracking-tight">{r.titulo}</p>
          <p className="mt-1 flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
            <Calendar className="size-3" /> {r.paginas} páginas · emitido há 5 dias
          </p>
          <div className="mt-4 flex gap-2">
            <Button size="sm" variant="outline" asChild>
              <Link to={`/relatorios/${r.id}`}>Visualizar</Link>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() =>
                toast.success('Download iniciado', { description: `${r.titulo}.pdf (${r.paginas} páginas)` })
              }
            >
              <Download className="size-4" /> Baixar PDF
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}

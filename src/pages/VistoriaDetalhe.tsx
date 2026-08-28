import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import {
  ArrowLeft,
  ClipboardList,
  Download,
  Hash,
  MapPin,
  ShieldCheck,
  TriangleAlert,
  User,
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { getObra } from '@/mocks/data'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { SeveridadeBadge } from '@/components/shared/SeveridadeBadge'
import { NormaChip } from '@/components/shared/NormaChip'
import { MetaRow } from '@/components/shared/MetaRow'
import { EvidenceItem } from '@/components/features/EvidenceItem'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDateTime } from '@/lib/utils'

export function VistoriaDetalhe() {
  const { id = '', vid = '' } = useParams()
  const { vistorias, naoConformidades } = useApp()
  const obra = getObra(id)
  const vistoria = vistorias.find((v) => v.id === vid)

  if (!obra || !vistoria) {
    return <p className="text-muted-foreground">Vistoria não encontrada.</p>
  }

  const ncs = naoConformidades.filter((n) => n.vistoriaId === vistoria.id)

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        to={`/obras/${id}`}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Voltar à obra
      </Link>

      <PageHeader
        number="04"
        title={`Vistoria ${vistoria.unidadeLabel}`}
        subtitle={`${vistoria.servico} · ${obra.nome}`}
        actions={
          <>
            {vistoria.checklistId && (
              <Button variant="outline" asChild>
                <Link to={`/obras/${id}/checklist/${vistoria.checklistId}`}>
                  <ClipboardList className="size-4" /> Ver checklist
                </Link>
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => toast.success('Relatório da vistoria gerado', { description: 'PDF pronto para download.' })}
            >
              <Download className="size-4" /> Exportar PDF
            </Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Linha do tempo das evidências</CardTitle>
              <StatusBadge status={vistoria.conformidade} />
            </CardHeader>
            <CardContent>
              <ol className="relative space-y-6 border-l border-border pl-6">
                {vistoria.evidencias.map((ev, i) => (
                  <li key={ev.id} className="relative">
                    <span className="absolute -left-[31px] top-4 flex size-4 items-center justify-center rounded-full border-2 border-background bg-emerald-400" />
                    <p className="mb-2 label-sm">
                      etapa {String(i + 1).padStart(2, '0')} · {formatDateTime(ev.timestamp)}
                    </p>
                    <EvidenceItem evidencia={ev} />
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {ncs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TriangleAlert className="size-4 text-red-500" />
                  Não conformidades geradas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {ncs.map((nc) => (
                  <Link
                    key={nc.id}
                    to={`/obras/${id}/nao-conformidades`}
                    className="block rounded-md border p-4 transition-colors hover:border-red-500/40"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-mono text-[11px] text-muted-foreground">{nc.codigo}</span>
                      <div className="flex items-center gap-2">
                        <SeveridadeBadge severidade={nc.severidade} />
                        <NormaChip codigo={nc.norma} />
                      </div>
                    </div>
                    <p className="mt-2 font-semibold leading-snug">{nc.titulo}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{nc.descricao}</p>
                    <p className="mt-2 font-mono text-[10px] text-muted-foreground">
                      responsável: {nc.responsavel} · prazo {new Date(nc.prazo).toLocaleDateString('pt-BR')}
                    </p>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Observação do engenheiro</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">{vistoria.observacao}</p>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Hash className="size-4 text-muted-foreground" /> Rastreabilidade
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <MetaRow label="ID" value={vistoria.id} mono />
              <MetaRow label="Unidade" value={vistoria.unidadeLabel} mono />
              <MetaRow label="Serviço" value={vistoria.servico} />
              <MetaRow label="Data" value={formatDateTime(vistoria.data)} mono />
              <MetaRow label="Evidências" value={vistoria.evidencias.length} mono />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <User className="size-4 text-muted-foreground" /> Responsável técnico
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="font-semibold">{vistoria.engenheiro}</p>
              <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                assinatura digital registrada
              </p>
              <div className="mt-4 flex items-start gap-2 border-t pt-4 font-mono text-[11px] text-muted-foreground">
                <MapPin className="mt-0.5 size-3 shrink-0" />
                {vistoria.evidencias[0]?.geo ?? obra.coordenadas}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <ShieldCheck className="size-4 text-emerald-400" /> Conformidade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <StatusBadge status={vistoria.conformidade} />
              <p className="text-xs leading-relaxed text-muted-foreground">
                Classificação consolidada a partir das análises individuais de cada evidência,
                considerando a evidência de menor conformidade como resultado da vistoria.
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}

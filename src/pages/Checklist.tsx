import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { ArrowLeft, Check, ClipboardCheck, Save, Sparkles } from 'lucide-react'
import type { Conformidade } from '@/types'
import { getObra } from '@/mocks/data'
import { useApp } from '@/context/AppContext'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { NormaChip } from '@/components/shared/NormaChip'
import { SmartImage } from '@/components/shared/SmartImage'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn, formatDateTime } from '@/lib/utils'

const opcoes: { valor: Conformidade; label: string }[] = [
  { valor: 'conforme', label: 'Conforme' },
  { valor: 'nao_conforme', label: 'Não conforme' },
  { valor: 'requer_analise', label: 'Requer análise' },
]

export function Checklist() {
  const { id = '', cid = '' } = useParams()
  const { checklists, atualizarItemChecklist } = useApp()
  const obra = getObra(id)
  const checklist = checklists.find((c) => c.id === cid)

  if (!obra || !checklist) {
    return <p className="text-muted-foreground">Checklist não encontrado.</p>
  }

  const confirmados = checklist.itens.filter((i) => i.confirmado).length
  const sugeridos = checklist.itens.filter((i) => i.sugeridoPorIA).length
  const progresso = Math.round((confirmados / checklist.itens.length) * 100)

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        to={`/obras/${id}`}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Voltar à obra
      </Link>

      <PageHeader
        number="07"
        title="Checklist digital"
        subtitle={`${checklist.servico} · ${checklist.unidadeLabel} · ${obra.nome}`}
        actions={
          <Button
            onClick={() =>
              toast.success('Checklist salvo', {
                description: `${confirmados} de ${checklist.itens.length} itens confirmados pelo engenheiro.`,
              })
            }
          >
            <Save className="size-4" /> Salvar checklist
          </Button>
        }
      />

      <Card className="mb-6">
        <CardContent className="grid gap-5 p-5 sm:grid-cols-[1fr_auto]">
          <div className="space-y-3">
            <Progress value={progresso} label="Confirmação do engenheiro" showValue />
            <p className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
              <Sparkles className="size-3 text-emerald-400" />
              {sugeridos} de {checklist.itens.length} itens foram pré-classificados pela IA a partir das
              evidências da vistoria
            </p>
          </div>
          <div className="flex items-center gap-6 sm:border-l sm:pl-6">
            <Numero valor={confirmados} label="confirmados" />
            <Numero valor={checklist.itens.length - confirmados} label="pendentes" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="size-4 text-emerald-400" /> Itens de verificação
          </CardTitle>
          <span className="font-mono text-[11px] text-muted-foreground">
            atualizado {formatDateTime(checklist.atualizadoEm)}
          </span>
        </CardHeader>
        <CardContent className="space-y-3">
          {checklist.itens.map((item, i) => (
            <div
              key={item.id}
              className={cn(
                'rounded-lg border p-4 transition-colors',
                item.confirmado ? 'border-emerald-400/30 bg-emerald-400/5' : 'bg-surface',
              )}
            >
              <div className="flex flex-col gap-4 sm:flex-row">
                {item.evidenciaThumb && (
                  <SmartImage
                    src={item.evidenciaThumb}
                    alt={`Evidência do item ${i + 1}`}
                    className="h-20 w-full rounded border object-cover sm:size-20"
                    wrapperClassName="h-20 w-full rounded border sm:size-20"
                  />
                )}

                <div className="min-w-0 flex-1 space-y-2.5">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="flex-1 text-sm font-medium leading-snug">
                      <span className="mr-2 font-mono text-xs text-muted-foreground">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {item.descricao}
                    </p>
                    <StatusBadge status={item.status} size="sm" />
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <NormaChip codigo={item.norma} />
                    {item.sugeridoPorIA && (
                      <span className="inline-flex items-center gap-1 rounded border border-emerald-400/25 bg-emerald-400/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400">
                        <Sparkles className="size-2.5" /> sugerido pela IA
                      </span>
                    )}
                    {item.confirmado && (
                      <span className="inline-flex items-center gap-1 rounded border border-border bg-surface-2 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                        <Check className="size-2.5" /> confirmado pelo engenheiro
                      </span>
                    )}
                  </div>

                  {item.observacao && (
                    <p className="rounded border-l-2 border-amber-500/50 bg-amber-500/5 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
                      {item.observacao}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <div className="flex rounded-md border p-0.5">
                      {opcoes.map((o) => (
                        <button
                          key={o.valor}
                          onClick={() =>
                            atualizarItemChecklist(checklist.id, item.id, {
                              status: o.valor,
                              sugeridoPorIA: o.valor === item.status && item.sugeridoPorIA,
                            })
                          }
                          className={cn(
                            'rounded px-2.5 py-1 text-[11px] font-medium transition-colors',
                            item.status === o.valor
                              ? 'bg-surface-2 text-foreground'
                              : 'text-muted-foreground hover:text-foreground',
                          )}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>

                    <Button
                      size="sm"
                      variant={item.confirmado ? 'ghost' : 'default'}
                      onClick={() => {
                        atualizarItemChecklist(checklist.id, item.id, {
                          confirmado: !item.confirmado,
                        })
                        toast(
                          item.confirmado
                            ? 'Confirmação removida do item'
                            : 'Item confirmado pelo engenheiro',
                        )
                      }}
                    >
                      <Check className="size-3.5" />
                      {item.confirmado ? 'Desfazer' : 'Confirmar'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function Numero({ valor, label }: { valor: number; label: string }) {
  return (
    <div className="text-center">
      <p className="font-mono text-2xl font-bold tabular-nums">{valor}</p>
      <p className="label-sm">{label}</p>
    </div>
  )
}

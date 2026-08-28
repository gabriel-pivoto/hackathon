import { useState } from 'react'
import { toast } from 'sonner'
import { CalendarClock, GripVertical, Search } from 'lucide-react'
import type { NaoConformidade, StatusNC } from '@/types'
import { useApp } from '@/context/AppContext'
import { useRole } from '@/context/RoleContext'
import { AcaoRestrita } from '@/components/guards/AcaoRestrita'
import { equipe } from '@/mocks/users'
import { SmartImage } from '@/components/shared/SmartImage'
import { SeveridadeBadge } from '@/components/shared/SeveridadeBadge'
import { NormaChip } from '@/components/shared/NormaChip'
import { MetaRow } from '@/components/shared/MetaRow'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn, daysUntil, formatDate } from '@/lib/utils'

const colunas: { id: StatusNC; titulo: string; cor: string }[] = [
  { id: 'aberta', titulo: 'Aberta', cor: 'bg-red-500' },
  { id: 'em_correcao', titulo: 'Em correção', cor: 'bg-amber-500' },
  { id: 'fechada', titulo: 'Fechada', cor: 'bg-emerald-400' },
]

export function KanbanNC({ obraId }: { obraId: string }) {
  const { naoConformidades, moverNC } = useApp()
  const { podeExecutar } = useRole()
  const [busca, setBusca] = useState('')
  const [severidade, setSeveridade] = useState('todas')
  const [responsavel, setResponsavel] = useState('todos')
  const [arrastando, setArrastando] = useState<string | null>(null)
  const [alvo, setAlvo] = useState<StatusNC | null>(null)
  const [detalhe, setDetalhe] = useState<NaoConformidade | null>(null)

  const filtradas = naoConformidades.filter((nc) => {
    if (nc.obraId !== obraId) return false
    if (severidade !== 'todas' && nc.severidade !== severidade) return false
    if (responsavel !== 'todos' && nc.responsavel !== responsavel) return false
    if (busca && !`${nc.codigo} ${nc.titulo} ${nc.unidadeLabel}`.toLowerCase().includes(busca.toLowerCase()))
      return false
    return true
  })

  function soltar(status: StatusNC) {
    if (!arrastando) return
    const nc = naoConformidades.find((n) => n.id === arrastando)
    setArrastando(null)
    setAlvo(null)
    if (!nc || nc.status === status) return
    moverNC(arrastando, status)
    toast.success(`${nc.codigo} movida`, {
      description: `Status alterado para "${colunas.find((c) => c.id === status)?.titulo}".`,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por código, título ou unidade..."
            className="h-9 pl-9"
          />
        </div>
        <Select value={severidade} onChange={(e) => setSeveridade(e.target.value)}>
          <option value="todas">Todas as severidades</option>
          <option value="critica">Crítica</option>
          <option value="alta">Alta</option>
          <option value="media">Média</option>
          <option value="baixa">Baixa</option>
        </Select>
        <Select value={responsavel} onChange={(e) => setResponsavel(e.target.value)}>
          <option value="todos">Todos os responsáveis</option>
          {equipe.map((p) => (
            <option key={p.id} value={p.nome}>
              {p.nome}
            </option>
          ))}
        </Select>
      </div>

      <p className="font-mono text-[11px] text-muted-foreground">
        {podeExecutar
          ? 'arraste os cards entre as colunas para atualizar o status'
          : 'visualização somente leitura — o gestor acompanha, o engenheiro trata'}
      </p>

      <div className="grid gap-4 lg:grid-cols-3">
        {colunas.map((col) => {
          const itens = filtradas.filter((nc) => nc.status === col.id)
          return (
            <div
              key={col.id}
              onDragOver={(e) => {
                e.preventDefault()
                setAlvo(col.id)
              }}
              onDragLeave={() => setAlvo((a) => (a === col.id ? null : a))}
              onDrop={() => soltar(col.id)}
              className={cn(
                'flex min-h-[400px] flex-col rounded-lg border bg-surface-2/30 p-3 transition-colors',
                alvo === col.id && 'border-emerald-400/50 bg-emerald-400/5',
              )}
            >
              <div className="mb-3 flex items-center gap-2 px-1">
                <span className={cn('size-2 rounded-full', col.cor)} />
                <span className="text-sm font-semibold tracking-tight">{col.titulo}</span>
                <span className="ml-auto font-mono text-[11px] text-muted-foreground">
                  {itens.length}
                </span>
              </div>

              <div className="flex-1 space-y-2">
                {itens.map((nc) => {
                  const dias = daysUntil(nc.prazo)
                  const atrasada = nc.status !== 'fechada' && dias < 0
                  return (
                    <article
                      key={nc.id}
                      draggable={podeExecutar}
                      onDragStart={() => podeExecutar && setArrastando(nc.id)}
                      onDragEnd={() => {
                        setArrastando(null)
                        setAlvo(null)
                      }}
                      onClick={() => setDetalhe(nc)}
                      className={cn(
                        'group cursor-pointer rounded-md border bg-surface p-3 transition-all hover:border-emerald-400/40',
                        !podeExecutar && 'cursor-default',
                        arrastando === nc.id && 'opacity-40',
                      )}
                    >
                      <div className="flex items-start gap-2">
                        {podeExecutar && (
                          <GripVertical className="mt-0.5 size-3.5 shrink-0 cursor-grab text-muted-foreground/40 group-hover:text-muted-foreground" />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="valor-tecnico text-[11px] text-muted-foreground">
                              {nc.codigo} · {nc.unidadeLabel}
                            </span>
                            <SeveridadeBadge severidade={nc.severidade} />
                          </div>
                          <p className="mt-1.5 text-sm font-medium leading-snug">{nc.titulo}</p>
                        </div>
                      </div>

                      <div className="mt-3 flex gap-3">
                        <SmartImage
                          src={nc.foto}
                          alt={nc.titulo}
                          className="size-12 shrink-0 rounded border object-cover"
                          wrapperClassName="size-12 shrink-0 rounded border"
                        />
                        <div className="min-w-0 flex-1 space-y-1.5">
                          <NormaChip codigo={nc.norma} />
                          <p
                            className={cn(
                              'valor-tecnico flex items-center gap-1 text-[11px]',
                              nc.status === 'fechada'
                                ? 'text-emerald-400'
                                : atrasada
                                  ? 'text-red-500'
                                  : dias <= 2
                                    ? 'text-amber-500'
                                    : 'text-muted-foreground',
                            )}
                          >
                            <CalendarClock className="size-3" />
                            {nc.status === 'fechada'
                              ? `fechada ${formatDate(nc.fechadaEm ?? nc.prazo)}`
                              : atrasada
                                ? `atrasada ${Math.abs(dias)} d`
                                : `prazo em ${dias} d`}
                          </p>
                        </div>
                      </div>


                    </article>
                  )
                })}

                {itens.length === 0 && (
                  <p className="rounded-md border border-dashed py-8 text-center text-xs text-muted-foreground">
                    nenhuma NC nesta coluna
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <Dialog open={!!detalhe} onOpenChange={(o) => !o && setDetalhe(null)}>
        <DialogContent>
          {detalhe && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{detalhe.codigo}</span>
                  <SeveridadeBadge severidade={detalhe.severidade} />
                  <NormaChip codigo={detalhe.norma} />
                </div>
                <DialogTitle>{detalhe.titulo}</DialogTitle>
                <DialogDescription>{detalhe.descricao}</DialogDescription>
              </DialogHeader>

              <SmartImage
                src={detalhe.foto}
                alt={detalhe.titulo}
                className="h-52 w-full rounded-md border object-cover"
                wrapperClassName="h-52 w-full rounded-md border"
              />

              <div className="rounded-md border bg-surface-2/40 p-4">
                <p className="label">
                  Ação corretiva
                </p>
                <p className="mt-1.5 text-sm leading-relaxed">{detalhe.acaoCorretiva}</p>
              </div>

              <div>
                <MetaRow label="Unidade" value={detalhe.unidadeLabel} mono />
                <MetaRow label="Responsável" value={detalhe.responsavel} />
                <MetaRow label="Aberta em" value={formatDate(detalhe.abertaEm)} mono />
                <MetaRow label="Prazo" value={formatDate(detalhe.prazo)} mono />
                <MetaRow
                  label="Origem"
                  value={
                    detalhe.origem === 'vistoria'
                      ? 'Vistoria em campo'
                      : detalhe.origem === 'teste'
                        ? 'Ensaio NBR 15575'
                        : 'Reporte de operário'
                  }
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {colunas
                  .filter((c) => c.id !== detalhe.status)
                  .map((c) => (
                    <AcaoRestrita key={c.id}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          moverNC(detalhe.id, c.id)
                          setDetalhe(null)
                          toast.success(`${detalhe.codigo} movida para "${c.titulo}"`)
                        }}
                      >
                        Mover para {c.titulo}
                      </Button>
                    </AcaoRestrita>
                  ))}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

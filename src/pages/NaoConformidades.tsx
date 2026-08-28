import { useParams } from 'react-router-dom'
import { getObra } from '@/mocks/data'
import { useApp } from '@/context/AppContext'
import { PageHeader } from '@/components/shared/PageHeader'
import { KanbanNC } from '@/components/features/KanbanNC'
import { daysUntil } from '@/lib/utils'

export function NaoConformidades() {
  const { id = '' } = useParams()
  const { naoConformidades } = useApp()
  const obra = getObra(id)

  if (!obra) return <p className="text-muted-foreground">Obra não encontrada.</p>

  const daObra = naoConformidades.filter((n) => n.obraId === id)
  const abertas = daObra.filter((n) => n.status !== 'fechada')
  const atrasadas = abertas.filter((n) => daysUntil(n.prazo) < 0)

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        number="06"
        title="Não conformidades"
        subtitle={`${obra.nome} · ${abertas.length} em aberto, ${atrasadas.length} com prazo vencido`}
        actions={
          <div className="flex gap-4 rounded-lg border bg-surface px-5 py-3">
            <Numero valor={daObra.filter((n) => n.status === 'aberta').length} label="abertas" cor="text-red-500" />
            <Numero valor={daObra.filter((n) => n.status === 'em_correcao').length} label="em correção" cor="text-amber-500" />
            <Numero valor={daObra.filter((n) => n.status === 'fechada').length} label="fechadas" cor="text-emerald-400" />
          </div>
        }
      />

      <KanbanNC obraId={id} />
    </div>
  )
}

function Numero({ valor, label, cor }: { valor: number; label: string; cor: string }) {
  return (
    <div className="text-center">
      <p className={`font-mono text-xl font-bold tabular-nums ${cor}`}>{valor}</p>
      <p className="label-sm">{label}</p>
    </div>
  )
}

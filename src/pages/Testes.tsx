import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Droplets, Hammer, Thermometer, Volume2 } from 'lucide-react'
import type { CategoriaNBR } from '@/types'
import { getObra, getTestesDaObra } from '@/mocks/data'
import { PageHeader } from '@/components/shared/PageHeader'
import { TestCard } from '@/components/features/TestCard'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

const categorias: {
  id: CategoriaNBR
  label: string
  icon: typeof Volume2
  descricao: string
  cor: string
}[] = [
  {
    id: 'acustico',
    label: 'Acústico',
    icon: Volume2,
    descricao: 'Isolamento de ruído aéreo e de impacto entre unidades',
    cor: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
  },
  {
    id: 'termico',
    label: 'Térmico',
    icon: Thermometer,
    descricao: 'Transmitância e capacidade térmica das vedações',
    cor: 'text-amber-500 border-amber-500/30 bg-amber-500/10',
  },
  {
    id: 'estanqueidade',
    label: 'Estanqueidade',
    icon: Droplets,
    descricao: 'Resistência à água em fachadas e áreas molhadas',
    cor: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
  },
  {
    id: 'estrutural',
    label: 'Estrutural',
    icon: Hammer,
    descricao: 'Resistência a impactos e deslocamentos sob carga',
    cor: 'text-red-500 border-red-500/30 bg-red-500/10',
  },
]

export function Testes() {
  const { id = '' } = useParams()
  const obra = getObra(id)
  const testes = getTestesDaObra(id)
  const [filtro, setFiltro] = useState<CategoriaNBR | 'todas'>('todas')

  if (!obra) return <p className="text-muted-foreground">Obra não encontrada.</p>

  const aprovados = testes.filter((t) => t.resultado === 'aprovado').length
  const reprovados = testes.filter((t) => t.resultado === 'reprovado').length
  const pendentes = testes.filter((t) => t.resultado === 'pendente').length
  const visiveis = filtro === 'todas' ? testes : testes.filter((t) => t.categoria === filtro)

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        number="05"
        title="Testes NBR 15575"
        subtitle={`${obra.nome} · ${aprovados} aprovados, ${reprovados} reprovados, ${pendentes} pendentes`}
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {categorias.map((cat) => {
          const daCategoria = testes.filter((t) => t.categoria === cat.id)
          const ok = daCategoria.filter((t) => t.resultado === 'aprovado').length
          const ativo = filtro === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => setFiltro(ativo ? 'todas' : cat.id)}
              className={cn(
                'tech-card p-5 text-left transition-all hover:border-emerald-400/40',
                ativo && 'border-emerald-400/50 ring-1 ring-emerald-400/20',
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <span className={cn('rounded border p-2', cat.cor)}>
                  <cat.icon className="size-4" />
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {ok}/{daCategoria.length}
                </span>
              </div>
              <p className="mt-4 font-bold tracking-tight">{cat.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{cat.descricao}</p>
              <Progress
                value={daCategoria.length ? (ok / daCategoria.length) * 100 : 0}
                className="mt-4"
              />
            </button>
          )
        })}
      </section>

      <div className="mt-8 flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold tracking-tight">
          {filtro === 'todas'
            ? 'Todos os ensaios'
            : `Ensaios — ${categorias.find((c) => c.id === filtro)?.label}`}
        </h2>
        {filtro !== 'todas' && (
          <button
            onClick={() => setFiltro('todas')}
            className="text-xs font-semibold text-emerald-400 hover:underline"
          >
            limpar filtro
          </button>
        )}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {visiveis.map((t) => (
          <TestCard key={t.id} teste={t} />
        ))}
      </div>
    </div>
  )
}

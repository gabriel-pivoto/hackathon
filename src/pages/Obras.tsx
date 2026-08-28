import { Link } from 'react-router-dom'
import { Building2, MapPin, TriangleAlert, Layers } from 'lucide-react'
import { obras } from '@/mocks/data'
import { PageHeader } from '@/components/shared/PageHeader'
import { SmartImage } from '@/components/shared/SmartImage'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { useApp } from '@/context/AppContext'

export function Obras() {
  const { setObraAtualId } = useApp()

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        number="02"
        title="Obras"
        subtitle="Empreendimentos sob gestão de qualidade da Construtora Vértice"
      />

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {obras.map((obra) => (
          <Link
            key={obra.id}
            to={`/obras/${obra.id}`}
            onClick={() => setObraAtualId(obra.id)}
            className="group tech-card overflow-hidden transition-all hover:border-emerald-400/40 hover:shadow-[0_16px_40px_-28px_rgba(0,0,0,0.55)]"
          >
            <div className="relative h-44 overflow-hidden">
              <SmartImage
                src={obra.capa}
                alt={obra.nome}
                className="size-full transition-transform duration-700 group-hover:scale-105"
                wrapperClassName="size-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <span className="text-[11px] font-medium text-emerald-400">
                  {obra.codigo}
                </span>
                <h2 className="text-lg font-bold leading-tight tracking-tight text-slate-50">
                  {obra.nome}
                </h2>
              </div>
              <Badge variant="emerald" className="absolute right-3 top-3 backdrop-blur">
                {obra.nivelPbqph}
              </Badge>
            </div>

            <div className="space-y-4 p-5">
              <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
                <MapPin className="mt-0.5 size-3.5 shrink-0" />
                <span>
                  {obra.endereco}
                  <br />
                  {obra.cidade}
                </span>
              </p>

              <Progress value={obra.conformidade} label="Conformidade" showValue />

              <div className="grid grid-cols-3 gap-2 border-t pt-4">
                <Metric icon={Building2} value={obra.torres} label="torres" />
                <Metric icon={Layers} value={obra.unidades} label="unidades" />
                <Metric
                  icon={TriangleAlert}
                  value={obra.ncAbertas}
                  label="NCs abertas"
                  destaque={obra.ncAbertas > 5}
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

function Metric({
  icon: Icon,
  value,
  label,
  destaque,
}: {
  icon: typeof Building2
  value: number
  label: string
  destaque?: boolean
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Icon className="size-3" />
        <span className="text-[11px]">{label}</span>
      </div>
      <p
        className={`mt-0.5 font-mono text-lg font-bold tabular-nums ${
          destaque ? 'text-red-500' : ''
        }`}
      >
        {value}
      </p>
    </div>
  )
}

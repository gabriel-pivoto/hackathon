import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { toast } from 'sonner'
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Loader2,
  MapPin,
  Play,
  Sparkles,
  XCircle,
} from 'lucide-react'
import { getObra, getTeste } from '@/mocks/data'
import { fotos } from '@/mocks/photos'
import { validarTeste, type ValidacaoTeste } from '@/mocks/ai'
import { useApp } from '@/context/AppContext'
import { PageHeader } from '@/components/shared/PageHeader'
import { NormaChip } from '@/components/shared/NormaChip'
import { MetaRow } from '@/components/shared/MetaRow'
import { SmartImage } from '@/components/shared/SmartImage'
import { SoundMeter } from '@/components/features/SoundMeter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

/** Extrai o valor numerico de um criterio como "≥ 45 dB" ou "U ≤ 3,7 W/m²K". */
function valorDoCriterio(criterio: string): number {
  const m = criterio.match(/(\d+(?:[.,]\d+)?)/)
  return m ? Number(m[1].replace(',', '.')) : 0
}

const nivelLabel = { M: 'Mínimo', I: 'Intermediário', S: 'Superior' } as const

export function TesteExecucao() {
  const { id = '', tid = '' } = useParams()
  const { usuario } = useApp()
  const obra = getObra(id)
  const teste = getTeste(tid)

  const [iniciado, setIniciado] = useState(false)
  const [inicioEm, setInicioEm] = useState<string | null>(null)
  const [medindo, setMedindo] = useState(false)
  const [valor, setValor] = useState('')
  const [evidencias, setEvidencias] = useState<string[]>([])
  const [validando, setValidando] = useState(false)
  const [resultado, setResultado] = useState<ValidacaoTeste | null>(null)

  if (!obra || !teste) return <p className="text-muted-foreground">Ensaio não encontrado.</p>

  const ehAcustico = teste.categoria === 'acustico'
  const maiorEhMelhor = teste.criterioMinimo.includes('≥')
  const limites = {
    minimo: valorDoCriterio(teste.criterioMinimo),
    intermediario: valorDoCriterio(teste.criterioIntermediario),
    superior: valorDoCriterio(teste.criterioSuperior),
  }
  // Valor que o sonômetro converge: reprova este ensaio de propósito na demo.
  const valorSimulado = teste.valorMedido ?? 42

  function iniciar() {
    setIniciado(true)
    setInicioEm(new Date().toISOString())
    setResultado(null)
    toast.success('Ensaio iniciado', {
      description: `Timestamp e geolocalização registrados · ${obra!.coordenadas}`,
    })
    if (ehAcustico) setMedindo(true)
  }

  async function validar() {
    const num = Number(valor.replace(',', '.'))
    if (!Number.isFinite(num)) {
      toast.error('Informe o valor medido antes de validar.')
      return
    }
    setValidando(true)
    setResultado(null)
    const r = await validarTeste(num, limites, maiorEhMelhor, {
      norma: teste!.norma,
      requisito: teste!.requisito,
      unidade: teste!.unidade,
    })
    setValidando(false)
    setResultado(r)
    if (r.aprovado) {
      toast.success(`Ensaio aprovado — nível ${r.nivel}`, { description: teste!.nome })
    } else {
      toast.error('Ensaio reprovado', { description: 'Não conformidade aberta automaticamente.' })
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        to={`/obras/${id}/testes`}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Voltar aos ensaios
      </Link>

      <PageHeader
        number="05"
        title={teste.nome}
        subtitle={`${teste.codigo} · ${teste.local} · ${obra.nome}`}
        actions={<NormaChip codigo={teste.norma} className="px-2.5 py-1 text-xs" />}
      />

      {/* Ficha técnica */}
      <Card>
        <CardHeader>
          <CardTitle>Ficha técnica do ensaio</CardTitle>
          <p className="text-sm text-muted-foreground">{teste.parte}</p>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-2">
          <div>
            <p className="label">
              Requisito normativo
            </p>
            <p className="mt-1.5 text-sm leading-relaxed">{teste.requisito}</p>

            <p className="mt-5 label">
              Método de ensaio
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{teste.metodoEnsaio}</p>

            <p className="mt-5 label">
              Equipamento
            </p>
            <p className="mt-1.5 font-mono text-xs text-muted-foreground">{teste.equipamento}</p>
          </div>

          <div>
            <p className="mb-2 label">
              Níveis de desempenho
            </p>
            <div className="space-y-2">
              <NivelRow nivel="M" label="Mínimo" criterio={teste.criterioMinimo} />
              <NivelRow nivel="I" label="Intermediário" criterio={teste.criterioIntermediario} />
              <NivelRow nivel="S" label="Superior" criterio={teste.criterioSuperior} />
            </div>
            <div className="mt-4">
              <MetaRow label="Unidade" value={teste.unidade} mono />
              <MetaRow label="Local" value={teste.local} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Procedimento */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Procedimento passo a passo</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-4">
            {teste.procedimento.map((p) => (
              <li key={p.ordem} className="flex gap-4">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10 font-mono text-[11px] font-bold text-emerald-400">
                  {p.ordem}
                </span>
                <div>
                  <p className="text-sm font-semibold tracking-tight">{p.titulo}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{p.descricao}</p>
                </div>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Execução */}
      <Card className="mt-6">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Execução</CardTitle>
          {inicioEm && (
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
              <Clock className="size-3" /> iniciado {new Date(inicioEm).toLocaleTimeString('pt-BR')}
            </span>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {!iniciado ? (
            <div className="flex flex-col items-center gap-4 rounded-lg border-2 border-dashed py-12 text-center">
              <span className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-4 text-emerald-400">
                <Play className="size-7" />
              </span>
              <div>
                <p className="text-base font-bold tracking-tight">Iniciar ensaio</p>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  O início registra o timestamp e a geolocalização do dispositivo, compondo a
                  rastreabilidade do laudo.
                </p>
              </div>
              <Button size="lg" onClick={iniciar}>
                <Play className="size-4" /> Iniciar teste
              </Button>
            </div>
          ) : (
            <>
              <div className="grid gap-3 sm:grid-cols-3">
                <Registro icon={Clock} label="Timestamp" valor={new Date(inicioEm!).toLocaleString('pt-BR')} />
                <Registro icon={MapPin} label="Geolocalização" valor={obra.coordenadas} />
                <Registro icon={FileText} label="Responsável" valor={usuario.nome} />
              </div>

              {ehAcustico && (
                <div>
                  <p className="mb-3 label">
                    Medição em campo
                  </p>
                  <SoundMeter
                    ativo={medindo}
                    valorFinal={valorSimulado}
                    duracaoMs={5000}
                    onFim={(v) => {
                      setMedindo(false)
                      setValor(String(v))
                      toast.success('Medição concluída', {
                        description: `Leitura estabilizada em ${v} ${teste.unidade}`,
                      })
                    }}
                  />
                  {!medindo && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={() => {
                        setValor('')
                        setResultado(null)
                        setMedindo(true)
                      }}
                    >
                      Repetir medição
                    </Button>
                  )}
                </div>
              )}

              <div>
                <p className="mb-3 label">
                  Registro fotográfico
                </p>
                <div className="flex flex-wrap gap-3">
                  {evidencias.map((f, i) => (
                    <SmartImage
                      key={i}
                      src={f}
                      alt={`Evidência ${i + 1} do ensaio`}
                      className="size-24 rounded-md border object-cover"
                      wrapperClassName="size-24 rounded-md border"
                    />
                  ))}
                  <button
                    onClick={() => {
                      const banco = [fotos.ensaioAcustico, fotos.ensaioTermico, fotos.estrutura, fotos.impermeabilizacao]
                      setEvidencias((a) => [...a, banco[a.length % banco.length]])
                      toast('Evidência anexada ao ensaio')
                    }}
                    className="flex size-24 flex-col items-center justify-center gap-1.5 rounded-md border-2 border-dashed text-muted-foreground transition-colors hover:border-emerald-400/50 hover:text-emerald-400"
                  >
                    <Camera className="size-5" />
                    <span className="text-[10px]">anexar</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-end gap-4">
                <div className="min-w-[200px] flex-1 space-y-1.5">
                  <label className="label">
                    Valor medido
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={valor}
                      onChange={(e) => setValor(e.target.value)}
                      placeholder="0,00"
                      inputMode="decimal"
                      className="font-mono text-lg"
                    />
                    <span className="font-mono text-sm text-muted-foreground">{teste.unidade}</span>
                  </div>
                </div>
                <Button size="lg" onClick={validar} disabled={validando || medindo || !valor}>
                  {validando ? (
                    <>
                      <Loader2 className="size-4 animate-spin" /> Validando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-4" /> Validar com IA
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Resultado */}
      <AnimatePresence>
        {validando && (
          <motion.div
            key="validando"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6 rounded-lg border border-emerald-400/25 bg-surface p-6"
          >
            <div className="flex items-center gap-2 text-emerald-400">
              <Sparkles className="size-4 animate-pulse-ring" />
              <span className="text-xs font-semibold">
                Confrontando o valor medido com os critérios da {teste.norma}...
              </span>
            </div>
            <div className="mt-5 space-y-3">
              <div className="skeleton h-4 w-1/3" />
              <div className="skeleton h-8 w-1/2" />
              <div className="skeleton h-3 w-full" />
              <div className="skeleton h-3 w-4/5" />
            </div>
          </motion.div>
        )}

        {resultado && !validando && (
          <motion.div
            key="resultado"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 space-y-6"
          >
            <div
              className={cn(
                'overflow-hidden rounded-lg border bg-surface',
                resultado.aprovado ? 'border-emerald-400/40' : 'border-red-500/40',
              )}
            >
              <div
                className={cn(
                  'flex flex-wrap items-center justify-between gap-4 border-b p-6',
                  resultado.aprovado ? 'bg-emerald-400/5' : 'bg-red-500/5',
                )}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={cn(
                      'rounded-lg border p-3',
                      resultado.aprovado
                        ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-400'
                        : 'border-red-500/30 bg-red-500/10 text-red-500',
                    )}
                  >
                    {resultado.aprovado ? (
                      <CheckCircle2 className="size-6" />
                    ) : (
                      <XCircle className="size-6" />
                    )}
                  </span>
                  <div>
                    <p className="text-xl font-extrabold tracking-tighter">
                      {resultado.aprovado ? 'Ensaio aprovado' : 'Ensaio reprovado'}
                    </p>
                    {resultado.nivel && (
                      <p className="mt-0.5 font-mono text-xs text-emerald-400">
                        nível {resultado.nivel} — {nivelLabel[resultado.nivel]}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono text-3xl font-bold tabular-nums">
                    {valor} <span className="text-base font-normal text-muted-foreground">{teste.unidade}</span>
                  </p>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    mínimo normativo: {teste.criterioMinimo}
                  </p>
                </div>
              </div>

              <div className="space-y-5 p-6">
                <div className="rounded-md border border-border/70 bg-surface-2/40 p-4">
                  <div className="flex items-start gap-2.5">
                    <FileText className="mt-0.5 size-4 shrink-0 text-blue-400" />
                    <div>
                      <p className="label">
                        Justificativa técnica
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed">{resultado.justificativa}</p>
                    </div>
                  </div>
                </div>

                {!resultado.aprovado && (
                  <div className="rounded-md border border-red-500/25 bg-red-500/5 p-4">
                    <p className="text-xs font-semibold text-red-500">
                      Não conformidade aberta automaticamente
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed">
                      Uma NC de severidade crítica foi criada e o responsável técnico do serviço foi
                      notificado por WhatsApp. O reensaio fica bloqueado até o registro da ação corretiva.
                    </p>
                  </div>
                )}

                <div className="grid gap-3 sm:grid-cols-3">
                  <MetaBox label="Confiança" valor={`${resultado.confianca}%`} />
                  <MetaBox label="Evidências" valor={`${evidencias.length} foto(s)`} />
                  <MetaBox label="Norma" valor={teste.norma} />
                </div>
              </div>
            </div>

            {/* Laudo */}
            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <div>
                  <CardTitle>Laudo de ensaio gerado</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Documento pronto para assinatura do responsável técnico
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() =>
                    toast.success('Download iniciado', {
                      description: `laudo-${teste.codigo.toLowerCase()}.pdf`,
                    })
                  }
                >
                  <Download className="size-4" /> Baixar PDF
                </Button>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border bg-surface-2/30 p-5 font-mono text-[11px] leading-relaxed text-muted-foreground">
                  <p className="text-foreground">LAUDO DE ENSAIO {teste.codigo}</p>
                  <p className="mt-3">obra ............ {obra.nome}</p>
                  <p>local ........... {teste.local}</p>
                  <p>norma ........... {teste.norma} — {teste.parte}</p>
                  <p>método .......... {teste.metodoEnsaio}</p>
                  <p>valor medido .... {valor} {teste.unidade}</p>
                  <p>
                    resultado ....... {resultado.aprovado ? `APROVADO (nível ${resultado.nivel})` : 'REPROVADO'}
                  </p>
                  <p>executado por ... {usuario.nome} — {usuario.registro}</p>
                  <p>data ............ {new Date(inicioEm!).toLocaleString('pt-BR')}</p>
                  <p>geo ............. {obra.coordenadas}</p>
                  <p className="mt-3 text-foreground">
                    hash ............ sha256:{teste.id.replace(/-/g, '')}a41f9c…
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function NivelRow({ nivel, label, criterio }: { nivel: 'M' | 'I' | 'S'; label: string; criterio: string }) {
  return (
    <div className="flex items-center gap-3 rounded-md border p-3">
      <span className="flex size-7 shrink-0 items-center justify-center rounded border border-emerald-400/30 bg-emerald-400/10 font-mono text-xs font-bold text-emerald-400">
        {nivel}
      </span>
      <span className="flex-1 text-sm">{label}</span>
      <span className="font-mono text-sm font-semibold">{criterio}</span>
    </div>
  )
}

function Registro({
  icon: Icon,
  label,
  valor,
}: {
  icon: typeof Clock
  label: string
  valor: string
}) {
  return (
    <div className="rounded-md border border-emerald-400/20 bg-emerald-400/5 p-3">
      <div className="flex items-center gap-1.5 text-emerald-400">
        <Icon className="size-3" />
        <span className="text-[11px]">{label}</span>
      </div>
      <p className="mt-1 font-mono text-xs">{valor}</p>
    </div>
  )
}

function MetaBox({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="rounded border border-border/70 px-3 py-2">
      <p className="label-sm">{label}</p>
      <p className="mt-1 font-mono text-sm font-semibold">{valor}</p>
    </div>
  )
}

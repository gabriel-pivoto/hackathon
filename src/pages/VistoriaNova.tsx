import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { toast } from 'sonner'
import {
  ArrowLeft,
  Camera,
  Check,
  CircleStop,
  Mic,
  Save,
  Sparkles,
  Square,
  Trash2,
} from 'lucide-react'
import type { AnaliseIA, Evidencia, TranscricaoAudio, Vistoria } from '@/types'
import { getObra, getUnidadesDaObra, servicos } from '@/mocks/data'
import { analisarFoto, fotosDaCaptura, transcreverAudio, type CenarioFoto } from '@/mocks/ai'
import { useApp } from '@/context/AppContext'
import { PageHeader } from '@/components/shared/PageHeader'
import { SmartImage } from '@/components/shared/SmartImage'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { AIAnalysisCard, AIAnalysisSkeleton } from '@/components/features/AIAnalysisCard'
import { AudioWaveform } from '@/components/features/AudioWaveform'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

type Etapa = 'contexto' | 'captura'

const etapasIA = [
  'enviando evidência para o modelo de visão...',
  'segmentando elementos construtivos...',
  'cruzando com a base normativa NBR 15575 e PBQP-H...',
  'calculando severidade e ação corretiva...',
]

export function VistoriaNova() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { usuario, adicionarVistoria } = useApp()
  const obra = getObra(id)
  const unidadesObra = getUnidadesDaObra(id)

  const [etapa, setEtapa] = useState<Etapa>('contexto')
  const [unidadeId, setUnidadeId] = useState(unidadesObra[0]?.id ?? '')
  const [servico, setServico] = useState(servicos[0])
  const [observacao, setObservacao] = useState('')
  const [evidencias, setEvidencias] = useState<Evidencia[]>([])

  // captura de foto
  const [seletorAberto, setSeletorAberto] = useState(false)
  const [analisando, setAnalisando] = useState(false)
  const [etapaIA, setEtapaIA] = useState(etapasIA[0])
  const [analiseAtual, setAnaliseAtual] = useState<{ cenario: CenarioFoto; analise: AnaliseIA } | null>(null)

  // captura de áudio
  const [gravando, setGravando] = useState(false)
  const [segundos, setSegundos] = useState(0)
  const [transcrevendo, setTranscrevendo] = useState(false)
  const [transcricaoAtual, setTranscricaoAtual] = useState<TranscricaoAudio | null>(null)
  const indiceAudio = useRef(0)

  const unidade = unidadesObra.find((u) => u.id === unidadeId)

  // Ciclo das mensagens de etapa enquanto a "IA" processa.
  useEffect(() => {
    if (!analisando && !transcrevendo) return
    let i = 0
    setEtapaIA(etapasIA[0])
    const timer = setInterval(() => {
      i = (i + 1) % etapasIA.length
      setEtapaIA(etapasIA[i])
    }, 750)
    return () => clearInterval(timer)
  }, [analisando, transcrevendo])

  // Cronômetro da gravação: para sozinho em 3 s e dispara a transcrição.
  useEffect(() => {
    if (!gravando) return
    const inicio = Date.now()
    const timer = setInterval(() => {
      const passados = (Date.now() - inicio) / 1000
      setSegundos(passados)
      if (passados >= 3) {
        clearInterval(timer)
        setGravando(false)
        void processarAudio()
      }
    }, 100)
    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gravando])

  async function escolherFoto(cenario: CenarioFoto) {
    setSeletorAberto(false)
    setAnalisando(true)
    setAnaliseAtual(null)
    const analise = await analisarFoto(cenario.key)
    setAnalisando(false)
    setAnaliseAtual({ cenario, analise })
    toast.success('Análise concluída', {
      description: `${analise.elemento} — ${analise.norma}`,
    })
  }

  async function processarAudio() {
    setTranscrevendo(true)
    setTranscricaoAtual(null)
    const t = await transcreverAudio(indiceAudio.current++)
    setTranscrevendo(false)
    setTranscricaoAtual(t)
    toast.success('Áudio transcrito e estruturado', {
      description: `${t.duracaoSeg}s de relato convertidos em não conformidade`,
    })
  }

  function anexarFoto() {
    if (!analiseAtual) return
    setEvidencias((atual) => [
      ...atual,
      {
        id: `ev-${Date.now()}`,
        tipo: 'foto',
        url: analiseAtual.cenario.foto,
        thumb: analiseAtual.cenario.foto,
        legenda: analiseAtual.analise.elemento,
        timestamp: new Date().toISOString(),
        geo: '-22.25191, -45.70318',
        autor: usuario.nome,
        analise: analiseAtual.analise,
      },
    ])
    setAnaliseAtual(null)
    toast('Evidência anexada à vistoria')
  }

  function anexarAudio() {
    if (!transcricaoAtual) return
    setEvidencias((atual) => [
      ...atual,
      {
        id: `ev-${Date.now()}`,
        tipo: 'audio',
        legenda: 'Relato de campo',
        duracaoSeg: transcricaoAtual.duracaoSeg,
        transcricao: transcricaoAtual.texto,
        timestamp: new Date().toISOString(),
        geo: '-22.25191, -45.70318',
        autor: usuario.nome,
        analise: transcricaoAtual.analise,
      },
    ])
    setTranscricaoAtual(null)
    setSegundos(0)
    toast('Áudio anexado à vistoria')
  }

  function salvar() {
    const naoConformes = evidencias.filter((e) => e.analise?.conformidade === 'nao_conforme')
    const analises = evidencias.filter((e) => e.analise?.conformidade === 'requer_analise')
    const conformidade: Vistoria['conformidade'] = naoConformes.length
      ? 'nao_conforme'
      : analises.length
        ? 'requer_analise'
        : 'conforme'

    const nova: Vistoria = {
      id: `vst-${Date.now()}`,
      obraId: id,
      unidadeId,
      unidadeLabel: unidade?.identificacao ?? '—',
      servico,
      engenheiro: usuario.nome,
      data: new Date().toISOString(),
      conformidade,
      evidencias,
      ncGeradas: naoConformes.map((e) => e.id),
      observacao: observacao || 'Sem observações adicionais do engenheiro.',
    }

    adicionarVistoria(nova)
    toast.success('Vistoria salva', {
      description: `${evidencias.length} evidência(s) registrada(s)${
        naoConformes.length ? ` · ${naoConformes.length} NC aberta(s)` : ''
      }`,
    })
    navigate(`/obras/${id}/vistoria/${nova.id}`)
  }

  if (!obra) return <p className="text-muted-foreground">Obra não encontrada.</p>

  const ocupado = analisando || transcrevendo || gravando

  return (
    <div className="mx-auto max-w-4xl">
      <button
        onClick={() => (etapa === 'captura' ? setEtapa('contexto') : navigate(`/obras/${id}`))}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> {etapa === 'captura' ? 'Voltar ao contexto' : 'Voltar à obra'}
      </button>

      <PageHeader
        number="03"
        title="Nova vistoria"
        subtitle={`${obra.nome} · registro de evidências com classificação automática de conformidade`}
      />

      <Passos etapa={etapa} temEvidencia={evidencias.length > 0} />

      {etapa === 'contexto' ? (
        <Card className="mt-8 animate-fade-up">
          <CardHeader>
            <CardTitle>1. Contexto da vistoria</CardTitle>
            <p className="text-sm text-muted-foreground">
              Selecione a unidade e o serviço controlado que será verificado.
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Campo label="Unidade">
                <Select
                  value={unidadeId}
                  onChange={(e) => setUnidadeId(e.target.value)}
                  className="h-10 w-full"
                >
                  {unidadesObra.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.torre} · {u.identificacao} — {u.tipologia}
                    </option>
                  ))}
                </Select>
              </Campo>

              <Campo label="Serviço controlado">
                <Select
                  value={servico}
                  onChange={(e) => setServico(e.target.value)}
                  className="h-10 w-full"
                >
                  {servicos.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Select>
              </Campo>
            </div>

            <Campo label="Observação do engenheiro (opcional)">
              <Textarea
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                placeholder="Contexto adicional, condições do ambiente, restrições de acesso..."
              />
            </Campo>

            <div className="rounded-md border border-dashed p-4 font-mono text-[11px] text-muted-foreground">
              <p>engenheiro: {usuario.nome} · {usuario.registro}</p>
              <p className="mt-1">geolocalização: {obra.coordenadas} (capturada no dispositivo)</p>
              <p className="mt-1">início: {new Date().toLocaleString('pt-BR')}</p>
            </div>

            <Button size="lg" className="w-full" onClick={() => setEtapa('captura')}>
              Iniciar captura de evidências
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-8 space-y-6 animate-fade-up">
          <Card>
            <CardHeader className="flex-row items-start justify-between gap-4">
              <div>
                <CardTitle>2. Captura de evidências</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  {unidade?.torre} · {unidade?.identificacao} — {servico}
                </p>
              </div>
              <span className="font-mono text-[11px] text-muted-foreground">
                {evidencias.length} anexada(s)
              </span>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <BotaoCaptura
                icon={Camera}
                titulo="Fotografar"
                descricao="A IA identifica o elemento e classifica a conformidade"
                onClick={() => setSeletorAberto(true)}
                disabled={ocupado}
              />
              <BotaoCaptura
                icon={gravando ? Square : Mic}
                titulo={gravando ? `Gravando · ${segundos.toFixed(1)}s` : 'Gravar áudio'}
                descricao={
                  gravando
                    ? 'Fale o que está vendo, a IA estrutura o relato'
                    : 'Relato de campo transcrito e estruturado'
                }
                onClick={() => {
                  setSegundos(0)
                  setGravando(true)
                }}
                disabled={ocupado}
                ativo={gravando}
              />
            </CardContent>
          </Card>

          <AnimatePresence mode="wait">
            {gravando && (
              <motion.div
                key="gravando"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="rounded-lg border border-red-500/30 bg-surface p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-red-500">
                    <span className="size-2 animate-pulse-ring rounded-full bg-red-500" />
                    gravando relato de campo
                  </span>
                  <span className="font-mono text-sm tabular-nums">{segundos.toFixed(1)}s</span>
                </div>
                <AudioWaveform ativo className="mt-4 h-14" cor="bg-red-500/70" />
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    setGravando(false)
                    void processarAudio()
                  }}
                >
                  <CircleStop className="size-4" /> Parar agora
                </Button>
              </motion.div>
            )}

            {(analisando || transcrevendo) && (
              <motion.div
                key="analisando"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <AIAnalysisSkeleton etapa={etapaIA} />
              </motion.div>
            )}

            {analiseAtual && !analisando && (
              <motion.div key="resultado-foto" className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-[220px_1fr]">
                  <SmartImage
                    src={analiseAtual.cenario.foto}
                    alt={analiseAtual.cenario.rotulo}
                    className="h-40 w-full rounded-md border object-cover"
                    wrapperClassName="h-40 w-full rounded-md border"
                  />
                  <AIAnalysisCard analise={analiseAtual.analise} compact />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={anexarFoto}>
                    <Check className="size-4" /> Anexar à vistoria
                  </Button>
                  <Button variant="ghost" onClick={() => setAnaliseAtual(null)}>
                    <Trash2 className="size-4" /> Descartar
                  </Button>
                </div>
              </motion.div>
            )}

            {transcricaoAtual && !transcrevendo && (
              <motion.div key="resultado-audio" className="space-y-4">
                <Card>
                  <CardHeader className="flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Sparkles className="size-4 text-emerald-400" /> Transcrição do áudio
                    </CardTitle>
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {transcricaoAtual.duracaoSeg}s
                    </span>
                  </CardHeader>
                  <CardContent>
                    <AudioWaveform barras={56} className="mb-4" />
                    <p className="rounded-md border bg-surface-2/40 p-4 text-sm italic leading-relaxed">
                      "{transcricaoAtual.texto}"
                    </p>
                  </CardContent>
                </Card>
                <AIAnalysisCard analise={transcricaoAtual.analise} />
                <div className="flex flex-wrap gap-2">
                  <Button onClick={anexarAudio}>
                    <Check className="size-4" /> Anexar à vistoria
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setTranscricaoAtual(null)
                      setSegundos(0)
                    }}
                  >
                    <Trash2 className="size-4" /> Descartar
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {evidencias.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Evidências anexadas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {evidencias.map((ev, i) => (
                  <div
                    key={ev.id}
                    className="flex items-center gap-3 rounded-md border p-3"
                  >
                    <span className="font-mono text-xs text-muted-foreground">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {ev.tipo === 'foto' ? (
                      <SmartImage
                        src={ev.url}
                        alt={ev.legenda}
                        className="size-11 rounded border object-cover"
                        wrapperClassName="size-11 rounded border"
                      />
                    ) : (
                      <span className="flex size-11 items-center justify-center rounded border bg-surface-2 text-muted-foreground">
                        <Mic className="size-4" />
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{ev.legenda}</p>
                      <p className="font-mono text-[10px] text-muted-foreground">
                        {ev.analise?.norma ?? 'sem classificação'}
                      </p>
                    </div>
                    {ev.analise && <StatusBadge status={ev.analise.conformidade} size="sm" />}
                    <button
                      onClick={() => setEvidencias((a) => a.filter((x) => x.id !== ev.id))}
                      className="text-muted-foreground transition-colors hover:text-red-500"
                      aria-label="Remover evidência"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-surface p-5">
            <p className="text-sm text-muted-foreground">
              {evidencias.length === 0
                ? 'Anexe ao menos uma evidência para salvar a vistoria.'
                : `${evidencias.length} evidência(s) prontas para registro no dossiê da unidade.`}
            </p>
            <Button size="lg" onClick={salvar} disabled={evidencias.length === 0 || ocupado}>
              <Save className="size-4" /> Salvar vistoria
            </Button>
          </div>
        </div>
      )}

      <Dialog open={seletorAberto} onOpenChange={setSeletorAberto}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Capturar foto</DialogTitle>
            <DialogDescription>
              Ambiente de demonstração: escolha uma das evidências pré-carregadas para simular a captura.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 sm:grid-cols-3">
            {fotosDaCaptura.map((f) => (
              <button
                key={f.key}
                onClick={() => escolherFoto(f)}
                className="group overflow-hidden rounded-md border text-left transition-all hover:border-emerald-400/50"
              >
                <SmartImage
                  src={f.foto}
                  alt={f.rotulo}
                  className="h-28 w-full transition-transform duration-500 group-hover:scale-105"
                  wrapperClassName="h-28 w-full"
                />
                <div className="p-3">
                  <p className="text-sm font-semibold leading-tight">{f.rotulo}</p>
                  <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">{f.ambiente}</p>
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="label">
        {label}
      </label>
      {children}
    </div>
  )
}

function BotaoCaptura({
  icon: Icon,
  titulo,
  descricao,
  onClick,
  disabled,
  ativo,
}: {
  icon: typeof Camera
  titulo: string
  descricao: string
  onClick: () => void
  disabled?: boolean
  ativo?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'group flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 text-center transition-all',
        ativo
          ? 'border-red-500/50 bg-red-500/5'
          : 'hover:border-emerald-400/50 hover:bg-emerald-400/5',
        disabled && !ativo && 'pointer-events-none opacity-40',
      )}
    >
      <span
        className={cn(
          'rounded-lg border p-4 transition-colors',
          ativo
            ? 'border-red-500/40 bg-red-500/10 text-red-500'
            : 'border-emerald-400/30 bg-emerald-400/10 text-emerald-400',
        )}
      >
        <Icon className="size-7" />
      </span>
      <span>
        <span className="block text-base font-bold tracking-tight">{titulo}</span>
        <span className="mt-1 block max-w-[26ch] text-xs text-muted-foreground">{descricao}</span>
      </span>
    </button>
  )
}

function Passos({ etapa, temEvidencia }: { etapa: Etapa; temEvidencia: boolean }) {
  const passos = [
    { id: 'contexto', label: 'Contexto' },
    { id: 'captura', label: 'Captura e análise' },
    { id: 'salvar', label: 'Registro' },
  ]
  const indiceAtual = etapa === 'contexto' ? 0 : temEvidencia ? 2 : 1

  return (
    <ol className="flex items-center gap-2 overflow-x-auto no-scrollbar">
      {passos.map((p, i) => {
        const concluido = i < indiceAtual
        const atual = i === indiceAtual
        return (
          <li key={p.id} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                'flex size-7 shrink-0 items-center justify-center rounded-full border font-mono text-[11px] font-semibold',
                concluido && 'border-emerald-400 bg-emerald-400 text-navy-900',
                atual && 'border-emerald-400 text-emerald-400',
                !concluido && !atual && 'border-border text-muted-foreground',
              )}
            >
              {concluido ? <Check className="size-3.5" /> : i + 1}
            </span>
            <span
              className={cn(
                'whitespace-nowrap text-xs font-medium',
                atual || concluido ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              {p.label}
            </span>
            {i < passos.length - 1 && (
              <span
                className={cn('h-px flex-1', concluido ? 'bg-emerald-400/50' : 'bg-border')}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}

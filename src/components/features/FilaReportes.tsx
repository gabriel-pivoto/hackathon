import { useState } from 'react'
import { toast } from 'sonner'
import {
  CheckCircle2,
  ClipboardCheck,
  Inbox,
  MessageCircle,
  MessageCircleQuestion,
  Mic,
  ShieldCheck,
  Trash2,
  TriangleAlert,
} from 'lucide-react'
import type { EnvioOperario } from '@/types'
import { useApp } from '@/context/AppContext'
import { NUMERO_WHATSAPP } from '@/mocks/envios'
import { SmartImage } from '@/components/shared/SmartImage'
import { AudioWaveform } from '@/components/features/AudioWaveform'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { relativeTime } from '@/lib/utils'

/**
 * Caixa de entrada do engenheiro. O operário não tem tela na plataforma:
 * ele manda foto, áudio ou texto pelo WhatsApp do ObraCheck, e a
 * mensagem cai aqui para virar não conformidade ou conferência de etapa.
 */
export function FilaReportes() {
  const { envios } = useApp()

  const problemas = envios.filter((e) => e.tipo === 'problema' && e.status === 'pendente')
  const etapas = envios.filter((e) => e.tipo === 'etapa' && e.status === 'pendente')

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="size-4 text-emerald-400" />
            Vindo do campo
          </CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Mensagens recebidas no WhatsApp{' '}
            <span className="valor-tecnico">{NUMERO_WHATSAPP}</span>
          </p>
        </div>
        {problemas.length + etapas.length > 0 && (
          <span className="rounded-full bg-amber-500/[0.12] px-2.5 py-1 text-[11px] font-medium text-amber-500">
            {problemas.length + etapas.length} pendente(s)
          </span>
        )}
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="problemas">
          <TabsList>
            <TabsTrigger value="problemas">
              Reportes de problema
              {problemas.length > 0 && (
                <span className="ml-1 valor-tecnico text-[11px] text-amber-500">
                  {problemas.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="etapas">
              Etapas para conferir
              {etapas.length > 0 && (
                <span className="ml-1 valor-tecnico text-[11px] text-emerald-400">
                  {etapas.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="problemas" className="mt-4 space-y-3">
            {problemas.length === 0 ? (
              <Vazio texto="Nenhum reporte de problema pendente." />
            ) : (
              problemas.map((e) => <CardReporte key={e.id} envio={e} />)
            )}
          </TabsContent>

          <TabsContent value="etapas" className="mt-4 space-y-3">
            {etapas.length === 0 ? (
              <Vazio texto="Nenhuma etapa aguardando conferência." />
            ) : (
              etapas.map((e) => <CardEtapa key={e.id} envio={e} />)
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function Vazio({ texto }: { texto: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed py-10 text-center">
      <Inbox className="size-5 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">{texto}</p>
    </div>
  )
}

function Cabecalho({ envio }: { envio: EnvioOperario }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-400/[0.12] text-[10px] font-semibold text-emerald-400">
        {envio.autor
          .split(' ')
          .map((p) => p[0])
          .slice(0, 2)
          .join('')}
      </span>
      <span className="text-sm font-semibold">{envio.autor}</span>
      <span className="text-[11px] text-muted-foreground">{envio.funcao}</span>
      <span className="ml-auto flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <MessageCircle className="size-3 text-emerald-400/70" />
        <span className="valor-tecnico">{envio.telefone}</span>
        <span aria-hidden>·</span>
        {relativeTime(envio.enviadoEm)}
      </span>
    </div>
  )
}

function Evidencias({ envio }: { envio: EnvioOperario }) {
  return (
    <div className="flex gap-3">
      {envio.foto && (
        <SmartImage
          src={envio.foto}
          alt={envio.comentario ?? 'Foto enviada pelo operário'}
          className="size-20 shrink-0 rounded-md border object-cover"
          wrapperClassName="size-20 shrink-0 rounded-md border"
        />
      )}

      <div className="min-w-0 flex-1 space-y-2">
        {envio.unidadeLabel && (
          <p className="valor-tecnico text-[11px] text-muted-foreground">{envio.unidadeLabel}</p>
        )}
        {envio.comentario && <p className="text-sm leading-relaxed">{envio.comentario}</p>}
        {envio.transcricao && (
          <div className="rounded-md bg-surface-2/50 p-2.5">
            <span className="mb-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Mic className="size-3" /> áudio · {envio.duracaoSeg}s · transcrito pela IA
            </span>
            <AudioWaveform barras={30} className="h-6" />
            <p className="mt-2 text-xs italic leading-relaxed text-muted-foreground">
              "{envio.transcricao}"
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function CardReporte({ envio }: { envio: EnvioOperario }) {
  const { atualizarEnvio } = useApp()
  const [ocupado, setOcupado] = useState(false)

  return (
    <article className="space-y-3 rounded-lg border border-amber-500/20 bg-surface p-4">
      <Cabecalho envio={envio} />
      <div className="flex items-center gap-1.5 text-amber-500">
        <TriangleAlert className="size-3.5" />
        <span className="text-xs font-semibold">Problema reportado</span>
      </div>
      <Evidencias envio={envio} />

      <div className="flex flex-wrap gap-2 border-t pt-3">
        <Button
          size="sm"
          disabled={ocupado}
          onClick={() => {
            setOcupado(true)
            const codigo = `NC-2026-${String(Math.floor(Math.random() * 400) + 50).padStart(3, '0')}`
            atualizarEnvio(envio.id, 'validado', codigo)
            toast.success(`${codigo} aberta a partir do reporte`, {
              description: `${envio.autor} recebe a confirmação no WhatsApp.`,
            })
          }}
        >
          <ShieldCheck className="size-3.5" /> Validar como NC
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={ocupado}
          onClick={() => {
            setOcupado(true)
            atualizarEnvio(envio.id, 'info_solicitada')
            toast('Pedido de informação enviado', {
              description: `${envio.autor} recebeu a pergunta no WhatsApp.`,
            })
          }}
        >
          <MessageCircleQuestion className="size-3.5" /> Pedir mais info
        </Button>
        <Button
          size="sm"
          variant="ghost"
          disabled={ocupado}
          onClick={() => {
            setOcupado(true)
            atualizarEnvio(envio.id, 'descartado')
            toast('Reporte descartado')
          }}
        >
          <Trash2 className="size-3.5" /> Descartar
        </Button>
      </div>
    </article>
  )
}

function CardEtapa({ envio }: { envio: EnvioOperario }) {
  const { atualizarEnvio } = useApp()
  const [ocupado, setOcupado] = useState(false)

  return (
    <article className="space-y-3 rounded-lg border border-emerald-400/20 bg-surface p-4">
      <Cabecalho envio={envio} />
      <div className="flex items-center gap-1.5 text-emerald-400">
        <CheckCircle2 className="size-3.5" />
        <span className="text-xs font-semibold">{envio.servico} concluída</span>
      </div>
      <Evidencias envio={envio} />

      <div className="flex flex-wrap gap-2 border-t pt-3">
        <Button
          size="sm"
          disabled={ocupado}
          onClick={() => {
            setOcupado(true)
            atualizarEnvio(envio.id, 'validado')
            toast.success('Etapa conferida e liberada', {
              description: `${envio.servico} — ${envio.unidadeLabel}`,
            })
          }}
        >
          <ClipboardCheck className="size-3.5" /> Conferir e liberar
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={ocupado}
          onClick={() => {
            setOcupado(true)
            atualizarEnvio(envio.id, 'info_solicitada')
            toast('Pedido de informação enviado', {
              description: `${envio.autor} recebeu a pergunta no WhatsApp.`,
            })
          }}
        >
          <MessageCircleQuestion className="size-3.5" /> Pedir mais info
        </Button>
      </div>
    </article>
  )
}

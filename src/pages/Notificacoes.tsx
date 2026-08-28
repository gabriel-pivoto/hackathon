import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import {
  ArrowUpRight,
  Bell,
  CheckCheck,
  Info,
  Mail,
  MessageCircle,
  Smartphone,
  TriangleAlert,
} from 'lucide-react'
import type { CanalNotificacao, Notificacao as TNotificacao, TipoNotificacao } from '@/types'
import { useApp } from '@/context/AppContext'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { WhatsAppPreview } from '@/components/features/WhatsAppPreview'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn, formatDateTime, relativeTime } from '@/lib/utils'

const tipoCfg: Record<TipoNotificacao, { label: string; icon: typeof Info; cls: string }> = {
  critica: { label: 'Crítica', icon: TriangleAlert, cls: 'text-red-500 border-red-500/30 bg-red-500/10' },
  alerta: { label: 'Alerta', icon: Bell, cls: 'text-amber-500 border-amber-500/30 bg-amber-500/10' },
  info: { label: 'Info', icon: Info, cls: 'text-blue-400 border-blue-400/30 bg-blue-400/10' },
}

const canalCfg: Record<CanalNotificacao, { label: string; icon: typeof Mail }> = {
  email: { label: 'E-mail', icon: Mail },
  whatsapp: { label: 'WhatsApp', icon: MessageCircle },
  in_app: { label: 'In-app', icon: Smartphone },
}

export function Notificacoes() {
  const { notificacoes, marcarComoLida, marcarTodasLidas, naoLidas } = useApp()
  const [tipo, setTipo] = useState('todos')
  const [canal, setCanal] = useState('todos')
  const [selecionada, setSelecionada] = useState<TNotificacao | null>(
    notificacoes.find((n) => n.whatsapp) ?? null,
  )

  const filtradas = notificacoes.filter((n) => {
    if (tipo !== 'todos' && n.tipo !== tipo) return false
    if (canal !== 'todos' && n.canal !== canal) return false
    return true
  })

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        number="08"
        title="Central de notificações"
        subtitle={`${notificacoes.length} eventos disparados · ${naoLidas} não lidos`}
        actions={
          <Button
            variant="outline"
            onClick={() => {
              marcarTodasLidas()
              toast.success('Todas as notificações foram marcadas como lidas')
            }}
            disabled={naoLidas === 0}
          >
            <CheckCheck className="size-4" /> Marcar todas como lidas
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Select value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="todos">Todos os tipos</option>
              <option value="critica">Crítica</option>
              <option value="alerta">Alerta</option>
              <option value="info">Info</option>
            </Select>
            <Select value={canal} onChange={(e) => setCanal(e.target.value)}>
              <option value="todos">Todos os canais</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="email">E-mail</option>
              <option value="in_app">In-app</option>
            </Select>
            <span className="ml-auto font-mono text-[11px] text-muted-foreground">
              {filtradas.length} de {notificacoes.length}
            </span>
          </div>

          {filtradas.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="Nenhuma notificação"
              description="Ajuste os filtros para ver outros eventos."
            />
          ) : (
            <div className="space-y-2">
              {filtradas.map((n) => {
                const cfgTipo = tipoCfg[n.tipo]
                const cfgCanal = canalCfg[n.canal]
                const Icon = cfgTipo.icon
                const CanalIcon = cfgCanal.icon
                const ativa = selecionada?.id === n.id
                return (
                  <article
                    key={n.id}
                    onClick={() => {
                      setSelecionada(n)
                      if (!n.lida) marcarComoLida(n.id)
                    }}
                    className={cn(
                      'cursor-pointer rounded-lg border bg-surface p-4 transition-colors hover:border-emerald-400/40',
                      ativa && 'border-emerald-400/50 ring-1 ring-emerald-400/15',
                      !n.lida && 'bg-emerald-400/[0.03]',
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <span className={cn('mt-0.5 shrink-0 rounded-md p-1.5', cfgTipo.cls)}>
                        <Icon className="size-3.5" />
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold tracking-tight">{n.titulo}</p>
                          {!n.lida && <span className="size-1.5 rounded-full bg-emerald-400" />}
                        </div>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{n.mensagem}</p>

                        <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <CanalIcon className="size-3" /> {cfgCanal.label}
                          </span>
                          <span aria-hidden>·</span>
                          <span>{n.destinatario}</span>
                          <span aria-hidden>·</span>
                          <span>{relativeTime(n.enviadaEm)}</span>
                        </div>
                      </div>

                      <Link
                        to={n.link}
                        onClick={(e) => e.stopPropagation()}
                        className="shrink-0 rounded p-1 text-muted-foreground transition-colors hover:text-emerald-400"
                        aria-label="Abrir evento de origem"
                      >
                        <ArrowUpRight className="size-4" />
                      </Link>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Prévia da mensagem</CardTitle>
              <p className="text-xs text-muted-foreground">
                Conteúdo exato entregue no canal do destinatário
              </p>
            </CardHeader>
            <CardContent>
              {selecionada?.whatsapp ? (
                <WhatsAppPreview
                  message={selecionada.whatsapp}
                  destinatario={selecionada.destinatario}
                  hora={new Date(selecionada.enviadaEm).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                />
              ) : selecionada ? (
                <div className="rounded-lg border bg-surface-2/40 p-4">
                  <p className="label-sm">
                    {canalCfg[selecionada.canal].label} · {selecionada.destinatario}
                  </p>
                  <p className="mt-3 font-semibold">{selecionada.titulo}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {selecionada.mensagem}
                  </p>
                  <p className="mt-4 border-t pt-3 font-mono text-[10px] text-muted-foreground">
                    {formatDateTime(selecionada.enviadaEm)}
                  </p>
                </div>
              ) : (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Selecione uma notificação para ver a mensagem entregue.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Distribuição por canal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {(['whatsapp', 'email', 'in_app'] as CanalNotificacao[]).map((c) => {
                const total = notificacoes.filter((n) => n.canal === c).length
                const cfg = canalCfg[c]
                const Icon = cfg.icon
                return (
                  <div key={c} className="flex items-center gap-3">
                    <Icon className="size-3.5 shrink-0 text-muted-foreground" />
                    <span className="flex-1 text-sm">{cfg.label}</span>
                    <span className="font-mono text-sm font-semibold tabular-nums">{total}</span>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}

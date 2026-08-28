import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Camera, FileText, HardHat, MessageCircle, Mic } from 'lucide-react'
import { getObraPorCodigo } from '@/mocks/data'
import { NUMERO_WHATSAPP } from '@/mocks/envios'
import { Logo } from '@/components/layout/Logo'
import { Button } from '@/components/ui/button'

/**
 * Destino do QR code afixado no canteiro. O operário não tem conta nem tela
 * na plataforma: esta página só identifica a obra e joga a conversa para o
 * WhatsApp do ObraCheck, já com a obra no texto da primeira mensagem.
 */
export function ReportarPublico() {
  const { obraCode = '' } = useParams()
  const obra = getObraPorCodigo(obraCode)

  const numeroLimpo = NUMERO_WHATSAPP.replace(/\D/g, '')
  const primeiraMensagem = encodeURIComponent(
    `Obra ${obraCode}${obra ? ` — ${obra.nome}` : ''}\n\nQuero reportar:`,
  )
  const linkWhatsApp = `https://wa.me/${numeroLimpo}?text=${primeiraMensagem}`

  return (
    <div className="relative mx-auto flex min-h-screen max-w-lg flex-col px-5 py-10">
      <header className="mb-10 flex items-center gap-3">
        <Logo className="size-8" />
        <div>
          <p className="text-lg font-extrabold tracking-tighter">ObraCheck</p>
          <p className="label-sm">canal do trabalhador</p>
        </div>
      </header>

      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-1 flex-col"
      >
        <div className="mb-8 rounded-xl border bg-surface p-4">
          <p className="text-[11px] font-medium text-emerald-400">{obraCode}</p>
          <p className="mt-1 font-bold tracking-tight">{obra?.nome ?? 'Obra não identificada'}</p>
          {obra && <p className="text-xs text-muted-foreground">{obra.cidade}</p>}
        </div>

        <h1 className="text-3xl font-extrabold tracking-tighter text-balance">
          Viu algo errado na obra?
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          Fale pelo WhatsApp, do jeito que você já usa. Não precisa baixar aplicativo, criar conta
          nem lembrar senha. O engenheiro responsável recebe na hora.
        </p>

        <Button asChild size="lg" className="mt-8 h-16 w-full text-base">
          <a href={linkWhatsApp} target="_blank" rel="noreferrer">
            <MessageCircle className="size-6" /> Abrir conversa no WhatsApp
          </a>
        </Button>

        <p className="mt-3 text-center text-sm text-muted-foreground">
          ou salve o número <span className="valor-tecnico">{NUMERO_WHATSAPP}</span>
        </p>

        <div className="mt-10">
          <p className="label mb-3">O que você pode mandar</p>
          <div className="grid grid-cols-3 gap-3">
            <Recurso icon={Camera} titulo="Foto" descricao="Mostre o problema" />
            <Recurso icon={Mic} titulo="Áudio" descricao="Explique falando" />
            <Recurso icon={FileText} titulo="Texto" descricao="Se preferir" />
          </div>
        </div>

        <p className="mt-10 flex items-center justify-center gap-2 text-center text-sm text-muted-foreground">
          <HardHat className="size-4 shrink-0" />
          Sua mensagem fica registrada com data, hora e obra.
        </p>
      </motion.main>
    </div>
  )
}

function Recurso({
  icon: Icon,
  titulo,
  descricao,
}: {
  icon: typeof Camera
  titulo: string
  descricao: string
}) {
  return (
    <div className="rounded-lg border bg-surface p-4">
      <Icon className="size-6 text-emerald-400" />
      <p className="mt-2.5 font-semibold tracking-tight">{titulo}</p>
      <p className="text-xs text-muted-foreground">{descricao}</p>
    </div>
  )
}

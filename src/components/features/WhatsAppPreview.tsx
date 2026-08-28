import { Check, CheckCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  message: string
  hora?: string
  destinatario?: string
  className?: string
}

/** Bubble de WhatsApp com o negrito do proprio app renderizado. */
export function WhatsAppPreview({ message, hora = '09:14', destinatario, className }: Props) {
  return (
    <div className={cn('rounded-lg border bg-[#0b141a] p-4', className)}>
      {destinatario && (
        <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-slate-500">
          para {destinatario}
        </p>
      )}
      <div className="flex justify-end">
        <div className="relative max-w-[85%] rounded-lg rounded-tr-none bg-[#005c4b] px-3 py-2 text-[13px] leading-relaxed text-slate-100 shadow">
          <p className="whitespace-pre-wrap break-words">{renderizarNegrito(message)}</p>
          <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-slate-300/70">
            <span className="font-mono">{hora}</span>
            <CheckCheck className="size-3 text-sky-400" />
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-500">
        <Check className="size-3" />
        <span className="font-mono">entregue via ObraCheck Notify</span>
      </div>
    </div>
  )
}

/** Converte *trecho* em <strong>, como o WhatsApp faz. */
function renderizarNegrito(texto: string) {
  return texto.split(/(\*[^*\n]+\*)/g).map((parte, i) =>
    parte.startsWith('*') && parte.endsWith('*') && parte.length > 2 ? (
      <strong key={i} className="font-semibold text-white">
        {parte.slice(1, -1)}
      </strong>
    ) : (
      <span key={i}>{parte}</span>
    ),
  )
}

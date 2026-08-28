import { cloneElement, isValidElement, type ReactElement } from 'react'
import { Lock } from 'lucide-react'
import { useRole } from '@/context/RoleContext'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

const AVISO = 'Apenas engenheiros podem executar esta ação. Alterne de perfil para prosseguir.'

interface Props {
  children: ReactElement<{ disabled?: boolean }>
  /** Sobrescreve a regra padrão (só engenheiro executa). */
  liberado?: boolean
  mensagem?: string
}

/**
 * Envolve um controle operacional. Quando o perfil atual nao pode executar,
 * desabilita o controle e explica o motivo num tooltip.
 */
export function AcaoRestrita({ children, liberado, mensagem = AVISO }: Props) {
  const { podeExecutar } = useRole()
  const permitido = liberado ?? podeExecutar

  if (permitido || !isValidElement(children)) return children

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {/* O span recebe os eventos: um elemento desabilitado nao dispara hover. */}
        <span className="inline-flex cursor-not-allowed">
          {cloneElement(children, { disabled: true })}
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <span className="flex items-start gap-2">
          <Lock className="mt-0.5 size-3 shrink-0 text-amber-500" />
          {mensagem}
        </span>
      </TooltipContent>
    </Tooltip>
  )
}

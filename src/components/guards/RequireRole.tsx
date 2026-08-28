import { useEffect, useRef } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { toast } from 'sonner'
import type { Role } from '@/types'
import { homeDoPerfil, useRole } from '@/context/RoleContext'
import { rotulosDePerfil } from '@/mocks/users'

interface Props {
  allowed: Role[]
  children: React.ReactNode
  /** Mensagem do toast exibido quando o acesso é negado. */
  mensagem?: string
}

/**
 * Redireciona para a home do perfil atual quando ele nao esta na lista permitida.
 * O toast dispara em efeito para nao avisar durante a renderizacao.
 */
export function RequireRole({ allowed, children, mensagem }: Props) {
  const { role } = useRole()
  const { pathname } = useLocation()
  const permitido = allowed.includes(role)
  const jaAvisou = useRef(false)

  useEffect(() => {
    if (permitido || jaAvisou.current) return
    jaAvisou.current = true
    toast.error('Acesso indisponível neste perfil', {
      description:
        mensagem ??
        `O perfil ${rotulosDePerfil[role].label} não executa esta ação. Alterne de perfil para prosseguir.`,
    })
  }, [permitido, role, mensagem, pathname])

  if (!permitido) return <Navigate to={homeDoPerfil(role)} replace />
  return <>{children}</>
}

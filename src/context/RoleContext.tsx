import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { PerfilUsuario, Role } from '@/types'
import { mockUsers } from '@/mocks/users'

interface RoleContextValue {
  role: Role
  setRole: (r: Role) => void
  user: PerfilUsuario
  /** Atalhos de leitura para não espalhar comparação de string pelas telas. */
  ehGestor: boolean
  /** Só o engenheiro executa ações operacionais (vistoriar, ensaiar, dar baixa). */
  podeExecutar: boolean
}

const CHAVE = 'obracheck.role'
const PERFIS: Role[] = ['engenheiro', 'gestor']

/**
 * Tela inicial de cada perfil, usada no seletor e nos guards de rota.
 * Os dois perfis restantes entram pelo dashboard, cada um com seu recorte.
 */
export function homeDoPerfil(_role: Role): string {
  return '/'
}

const Ctx = createContext<RoleContextValue | null>(null)

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>(() => {
    try {
      const salvo = localStorage.getItem(CHAVE) as Role | null
      return salvo && PERFIS.includes(salvo) ? salvo : 'engenheiro'
    } catch {
      return 'engenheiro'
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(CHAVE, role)
    } catch {
      /* modo privado: o perfil simplesmente nao persiste entre sessoes */
    }
  }, [role])

  const setRole = useCallback((r: Role) => setRoleState(r), [])

  const valor = useMemo<RoleContextValue>(
    () => ({
      role,
      setRole,
      user: mockUsers[role],
      ehGestor: role === 'gestor',
      podeExecutar: role === 'engenheiro',
    }),
    [role, setRole],
  )

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>
}

export function useRole() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useRole precisa estar dentro de <RoleProvider>')
  return ctx
}

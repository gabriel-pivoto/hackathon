import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ChevronDown } from 'lucide-react'
import type { Role } from '@/types'
import { homeDoPerfil, useRole } from '@/context/RoleContext'
import { mockUsers, rotulosDePerfil } from '@/mocks/users'
import { cn } from '@/lib/utils'

const PERFIS: Role[] = ['engenheiro', 'gestor']

/**
 * Seletor de perfil do header. Sempre visivel e sempre funcional: e o
 * controle que sustenta a narrativa da demo.
 */
export function RoleSwitcher({ compacto }: { compacto?: boolean }) {
  const { role, setRole } = useRole()
  const navigate = useNavigate()
  const [aberto, setAberto] = useState(false)
  const raiz = useRef<HTMLDivElement>(null)

  // Fecha ao clicar fora ou apertar Esc.
  useEffect(() => {
    if (!aberto) return
    const clique = (e: MouseEvent) => {
      if (!raiz.current?.contains(e.target as Node)) setAberto(false)
    }
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAberto(false)
    }
    document.addEventListener('mousedown', clique)
    document.addEventListener('keydown', tecla)
    return () => {
      document.removeEventListener('mousedown', clique)
      document.removeEventListener('keydown', tecla)
    }
  }, [aberto])

  function trocar(novo: Role) {
    setAberto(false)
    if (novo === role) return
    setRole(novo)
    navigate(homeDoPerfil(novo))
  }

  const atual = rotulosDePerfil[role]

  return (
    <div ref={raiz} className="relative">
      <button
        onClick={() => setAberto((a) => !a)}
        aria-haspopup="menu"
        aria-expanded={aberto}
        className={cn(
          'inline-flex items-center gap-2 rounded-full border border-navy-700 bg-navy-800 py-1.5 pl-3 pr-2 text-sm font-semibold text-slate-100 transition-colors hover:border-emerald-400/40',
          compacto && 'py-1 pl-2 pr-1.5 text-xs',
        )}
      >
        <span aria-hidden className={compacto ? 'text-sm' : 'text-base'}>
          {atual.emoji}
        </span>
        <span className={cn(compacto && 'sr-only sm:not-sr-only')}>{atual.label}</span>
        <ChevronDown
          className={cn('size-3.5 text-slate-400 transition-transform', aberto && 'rotate-180')}
        />
      </button>

      {aberto && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-lg border bg-surface shadow-2xl animate-fade-up"
        >
          <p className="border-b px-3 py-2 label-sm">
            visualizar como
          </p>
          {PERFIS.map((p) => {
            const cfg = rotulosDePerfil[p]
            const usuario = mockUsers[p]
            const ativo = p === role
            return (
              <button
                key={p}
                role="menuitem"
                onClick={() => trocar(p)}
                className={cn(
                  'flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors',
                  ativo ? 'bg-emerald-400/10' : 'hover:bg-muted',
                )}
              >
                <span aria-hidden className="text-xl">
                  {cfg.emoji}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className={cn('text-sm font-semibold', ativo && 'text-emerald-400')}>
                      {cfg.label}
                    </span>
                    {ativo && <Check className="size-3.5 text-emerald-400" />}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {usuario.nome} · {cfg.descricao}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

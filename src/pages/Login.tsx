import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Loader2, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Logo } from '@/components/layout/Logo'
import { BlueprintBackground } from '@/components/shared/BlueprintBackground'
import { usuarioLogado } from '@/mocks/users'

export function Login() {
  const navigate = useNavigate()
  const [carregando, setCarregando] = useState(false)

  function entrar(e: FormEvent) {
    e.preventDefault()
    setCarregando(true)
    setTimeout(() => navigate('/'), 700)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
      <BlueprintBackground className="fixed" />

      <div className="relative w-full max-w-sm animate-fade-up">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo className="size-12" />
          <h1 className="mt-4 text-3xl font-extrabold tracking-tighter">ObraCheck</h1>
          <p className="mt-2 text-sm text-muted-foreground text-balance">
            Gestão de qualidade e conformidade para PBQP-H e NBR 15575
          </p>
        </div>

        <form onSubmit={entrar} className="tech-card space-y-4 p-6">
          <div className="space-y-1.5">
            <label htmlFor="email" className="label">
              E-mail
            </label>
            <Input id="email" type="email" defaultValue={usuarioLogado.email} autoComplete="email" />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="senha" className="label">
                Senha
              </label>
              <button type="button" className="text-xs text-emerald-400 hover:underline">
                Esqueci a senha
              </button>
            </div>
            <Input id="senha" type="password" defaultValue="obracheck" autoComplete="current-password" />
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={carregando}>
            {carregando ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Entrando...
              </>
            ) : (
              <>
                Entrar <ArrowRight className="size-4" />
              </>
            )}
          </Button>

          <p className="flex items-center justify-center gap-1.5 pt-1 font-mono text-[10px] text-muted-foreground">
            <ShieldCheck className="size-3" />
            ambiente de demonstração · dados fictícios
          </p>
        </form>

        <p className="mt-6 text-center font-mono text-[11px] text-muted-foreground">
          Construtora Vértice · {usuarioLogado.registro}
        </p>
      </div>
    </div>
  )
}

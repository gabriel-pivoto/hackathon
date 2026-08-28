import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function NaoEncontrado() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center py-24 text-center">
      <span className="display-number text-[96px] text-emerald-400/20">404</span>
      <h1 className="mt-4 text-2xl font-extrabold tracking-tighter">Página não encontrada</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        O endereço acessado não existe nesta demonstração do ObraCheck.
      </p>
      <Button asChild className="mt-6">
        <Link to="/">
          <Compass className="size-4" /> Voltar ao dashboard
        </Link>
      </Button>
    </div>
  )
}

import { cn } from '@/lib/utils'

/** Grid decorativo de prancha tecnica, com vinheta radial para nao competir com o conteudo. */
export function BlueprintBackground({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      <div className="absolute inset-0 blueprint-grid-lg" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,transparent_25%,hsl(var(--background))_85%)]" />
    </div>
  )
}

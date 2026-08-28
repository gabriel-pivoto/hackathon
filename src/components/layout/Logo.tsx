import { cn } from '@/lib/utils'

/** Marca do ObraCheck: prumo e esquadro sobre grid tecnico. */
export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={cn('shrink-0', className)} aria-hidden>
      <rect x="1" y="1" width="30" height="30" rx="6" className="fill-emerald-400/10 stroke-emerald-400/40" strokeWidth="1.5" />
      <path d="M8 23V13.5L16 8l8 5.5V23" className="stroke-emerald-400" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <path d="m11.5 17.5 3 3 6-6.5" className="stroke-emerald-400" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

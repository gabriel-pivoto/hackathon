import { cva, type VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-[11px] font-semibold tracking-tight transition-colors',
  {
    variants: {
      variant: {
        default: 'border-border bg-surface-2 text-muted-foreground',
        emerald: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-400',
        red: 'border-red-500/30 bg-red-500/10 text-red-500',
        amber: 'border-amber-500/30 bg-amber-500/10 text-amber-500',
        blue: 'border-blue-400/30 bg-blue-400/10 text-blue-400',
        outline: 'border-border text-foreground',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}

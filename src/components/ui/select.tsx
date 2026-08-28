import * as React from 'react'
import { cn } from '@/lib/utils'

/** Select nativo estilizado: leve, acessivel e suficiente para os filtros da demo. */
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        'h-9 cursor-pointer appearance-none rounded-md border border-input bg-surface-2/50 bg-[length:14px] bg-[right_0.6rem_center] bg-no-repeat pl-3 pr-8 text-sm transition-colors focus-visible:border-emerald-400/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/20',
        className,
      )}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
      }}
      {...props}
    >
      {children}
    </select>
  ),
)
Select.displayName = 'Select'

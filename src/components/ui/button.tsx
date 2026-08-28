import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold tracking-tight transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-emerald-400 text-navy-900 hover:bg-emerald-300 shadow-[0_0_0_1px_rgba(16,185,129,0.4),0_8px_24px_-12px_rgba(16,185,129,0.7)]',
        outline: 'border border-border bg-transparent hover:bg-muted hover:border-emerald-400/40',
        secondary: 'bg-muted text-foreground hover:bg-surface-2',
        ghost: 'hover:bg-muted',
        danger: 'bg-red-500 text-white hover:bg-red-500/90',
        link: 'text-emerald-400 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2 [&_svg]:size-4',
        sm: 'h-8 px-3 text-xs [&_svg]:size-3.5',
        lg: 'h-12 px-6 text-base [&_svg]:size-5',
        icon: 'h-9 w-9 [&_svg]:size-4',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }

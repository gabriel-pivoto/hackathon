import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex h-10 items-center gap-1 overflow-x-auto no-scrollbar rounded-md border bg-surface-2/40 p-1',
      className,
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded px-3 py-1.5 text-sm font-medium text-muted-foreground transition-all hover:text-foreground focus-visible:outline-none data-[state=active]:bg-surface data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:ring-1 data-[state=active]:ring-emerald-400/25',
      className,
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn('mt-6 focus-visible:outline-none animate-fade-up', className)}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }

import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AppProvider, useApp } from '@/context/AppContext'
import { RoleProvider } from '@/context/RoleContext'
import { TooltipProvider } from '@/components/ui/tooltip'
import { router } from '@/router'

function Notificador() {
  const { tema } = useApp()
  return (
    <Toaster
      theme={tema}
      position="bottom-right"
      toastOptions={{
        style: {
          background: 'hsl(var(--surface))',
          border: '1px solid hsl(var(--border))',
          color: 'hsl(var(--foreground))',
        },
      }}
    />
  )
}

export default function App() {
  return (
    <RoleProvider>
      <AppProvider>
        <TooltipProvider delayDuration={200}>
          <RouterProvider router={router} />
          <Notificador />
        </TooltipProvider>
      </AppProvider>
    </RoleProvider>
  )
}

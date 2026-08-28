import { Outlet } from 'react-router-dom'
import { BlueprintBackground } from '@/components/shared/BlueprintBackground'

export function PublicLayout() {
  return (
    <div className="relative min-h-screen">
      <BlueprintBackground className="fixed" />
      <Outlet />
    </div>
  )
}

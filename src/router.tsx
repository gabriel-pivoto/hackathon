import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { RequireRole } from '@/components/guards/RequireRole'
import { Login } from '@/pages/Login'
import { Dashboard } from '@/pages/Dashboard'
import { Obras } from '@/pages/Obras'
import { ObraDetalhe } from '@/pages/ObraDetalhe'
import { VistoriaNova } from '@/pages/VistoriaNova'
import { VistoriaDetalhe } from '@/pages/VistoriaDetalhe'
import { Checklist } from '@/pages/Checklist'
import { Testes } from '@/pages/Testes'
import { TesteExecucao } from '@/pages/TesteExecucao'
import { NaoConformidades } from '@/pages/NaoConformidades'
import { Notificacoes } from '@/pages/Notificacoes'
import { ReportarPublico } from '@/pages/ReportarPublico'
import { Relatorio } from '@/pages/Relatorio'
import { NaoEncontrado } from '@/pages/NaoEncontrado'

/** Rotas de execução em campo: exclusivas do engenheiro. */
const soEngenheiro = (element: React.ReactNode) => (
  <RequireRole allowed={['engenheiro']}>{element}</RequireRole>
)

export const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  {
    element: <PublicLayout />,
    children: [{ path: '/reportar/:obraCode', element: <ReportarPublico /> }],
  },
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <Dashboard /> },
      { path: '/obras', element: <Obras /> },
      { path: '/obras/:id', element: <ObraDetalhe /> },
      { path: '/obras/:id/vistoria/nova', element: soEngenheiro(<VistoriaNova />) },
      { path: '/obras/:id/vistoria/:vid', element: <VistoriaDetalhe /> },
      { path: '/obras/:id/checklist/:cid', element: soEngenheiro(<Checklist />) },
      { path: '/obras/:id/testes', element: soEngenheiro(<Testes />) },
      { path: '/obras/:id/testes/:tid', element: soEngenheiro(<TesteExecucao />) },
      { path: '/obras/:id/nao-conformidades', element: <NaoConformidades /> },
      { path: '/notificacoes', element: <Notificacoes /> },
      { path: '/relatorios/:id', element: <Relatorio /> },
      { path: '/relatorios', element: <Navigate to="/relatorios/rel-2026-06" replace /> },
      { path: '*', element: <NaoEncontrado /> },
    ],
  },
])

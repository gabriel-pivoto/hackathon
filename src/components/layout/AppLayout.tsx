import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Bell,
  Building2,
  ClipboardList,
  FlaskConical,
  LayoutDashboard,
  FileText,
  LogOut,
  Menu,
  Moon,
  Plus,
  QrCode,
  Search,
  Sun,
  TriangleAlert,
  X,
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { useRole } from '@/context/RoleContext'
import { RoleSwitcher } from './RoleSwitcher'
import { obras } from '@/mocks/data'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { BlueprintBackground } from '@/components/shared/BlueprintBackground'
import { Logo } from './Logo'
import { cn } from '@/lib/utils'

export function AppLayout() {
  const { tema, alternarTema, obraAtual, obraAtualId, setObraAtualId, naoLidas, enviosPendentes } =
    useApp()
  const { user, podeExecutar, ehGestor } = useRole()
  const [menuAberto, setMenuAberto] = useState(false)
  const navigate = useNavigate()
  const { pathname } = useLocation()

  // O gestor acompanha o portfólio; os itens de execução saem do menu dele.
  const links = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { to: '/obras', label: 'Obras', icon: Building2 },
    ...(podeExecutar
      ? [{ to: `/obras/${obraAtualId}/testes`, label: 'Testes NBR 15575', icon: FlaskConical }]
      : []),
    {
      to: `/obras/${obraAtualId}/nao-conformidades`,
      label: ehGestor ? 'Não conformidades (leitura)' : 'Não conformidades',
      icon: TriangleAlert,
    },
    ...(podeExecutar
      ? [{ to: `/obras/${obraAtualId}/checklist/chk-001`, label: 'Checklists', icon: ClipboardList }]
      : []),
    { to: '/relatorios/rel-2026-06', label: 'Relatórios', icon: FileText },
    { to: '/notificacoes', label: 'Notificações', icon: Bell, badge: naoLidas },
  ]

  return (
    <div className="relative min-h-screen">
      <BlueprintBackground className="fixed" />

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-surface/95 backdrop-blur transition-transform lg:translate-x-0',
          menuAberto ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-5">
          <Link to="/" className="flex items-center gap-2.5" onClick={() => setMenuAberto(false)}>
            <Logo className="size-7" />
            <span className="text-lg font-extrabold tracking-tighter">ObraCheck</span>
          </Link>
          <button
            className="lg:hidden text-muted-foreground"
            onClick={() => setMenuAberto(false)}
            aria-label="Fechar menu"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="border-b p-4">
          <label className="mb-1.5 block label-sm">
            obra ativa
          </label>
          <Select
            value={obraAtualId}
            onChange={(e) => setObraAtualId(e.target.value)}
            className="h-9 w-full"
          >
            {obras.map((o) => (
              <option key={o.id} value={o.id}>
                {o.nome}
              </option>
            ))}
          </Select>
          <p className="mt-2 font-mono text-[10px] text-muted-foreground">
            {obraAtual.codigo} · {obraAtual.nivelPbqph}
          </p>
          {podeExecutar && enviosPendentes > 0 && (
            <p className="mt-2 rounded border border-amber-500/25 bg-amber-500/10 px-2 py-1 text-[10px] text-amber-500">
              {enviosPendentes} envio(s) de operário aguardando validação
            </p>
          )}
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.exact}
              onClick={() => setMenuAberto(false)}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive || (!l.exact && pathname.startsWith(l.to))
                    ? 'bg-emerald-400/10 text-emerald-400'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )
              }
            >
              <l.icon className="size-4 shrink-0" />
              <span className="flex-1 truncate">{l.label}</span>
              {!!l.badge && (
                <span className="rounded-full bg-red-500 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white">
                  {l.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="space-y-3 border-t p-4">
          <Link
            to={`/reportar/${obraAtual.codigo}`}
            onClick={() => setMenuAberto(false)}
            className="flex items-center gap-3 rounded-md border border-dashed p-3 text-xs text-muted-foreground transition-colors hover:border-emerald-400/40 hover:text-foreground"
          >
            <QrCode className="size-8 shrink-0 text-emerald-400" />
            <span>
              <span className="block font-semibold text-foreground">QR code do canteiro</span>
              Leva o operário ao WhatsApp
            </span>
          </Link>

          <div className="flex items-center gap-3 rounded-md p-2">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 font-mono text-xs font-bold text-emerald-400">
              {user.iniciais}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{user.nome}</p>
              <p className="truncate font-mono text-[10px] text-muted-foreground">{user.cargo}</p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="text-muted-foreground transition-colors hover:text-red-500"
              aria-label="Sair"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </aside>

      {menuAberto && (
        <div
          className="fixed inset-0 z-40 bg-navy-900/70 backdrop-blur-sm lg:hidden"
          onClick={() => setMenuAberto(false)}
        />
      )}

      {/* Conteúdo */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur-lg sm:px-6">
          <button
            className="lg:hidden text-muted-foreground"
            onClick={() => setMenuAberto(true)}
            aria-label="Abrir menu"
          >
            <Menu className="size-5" />
          </button>

          <div className="relative hidden max-w-sm flex-1 sm:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Buscar unidade, NC ou ensaio..."
              className="h-9 w-full rounded-md border border-input bg-surface-2/40 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus-visible:border-emerald-400/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/20"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={alternarTema} aria-label="Alternar tema">
              {tema === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>

            <Link
              to="/notificacoes"
              className="relative rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Notificações"
            >
              <Bell className="size-4" />
              {naoLidas > 0 && (
                <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-red-500 font-mono text-[9px] font-bold text-white">
                  {naoLidas}
                </span>
              )}
            </Link>

            {podeExecutar && (
              <Button asChild size="sm" className="hidden sm:inline-flex">
                <Link to={`/obras/${obraAtualId}/vistoria/nova`}>
                  <Plus className="size-4" /> Nova vistoria
                </Link>
              </Button>
            )}

            <RoleSwitcher />
          </div>
        </header>

        <main className="relative px-4 py-8 sm:px-6 lg:px-10">
          <Outlet />
        </main>
      </div>

      {/* FAB mobile: ação operacional, só para o engenheiro */}
      {podeExecutar && (
        <Link
          to={`/obras/${obraAtualId}/vistoria/nova`}
          className="fixed bottom-6 right-6 z-40 inline-flex size-14 items-center justify-center rounded-full bg-emerald-400 text-navy-900 shadow-[0_8px_30px_-6px_rgba(16,185,129,0.8)] transition-transform hover:scale-105 sm:hidden"
          aria-label="Nova vistoria"
        >
          <Plus className="size-6" />
        </Link>
      )}
    </div>
  )
}

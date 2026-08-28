import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type {
  Checklist,
  EnvioOperario,
  NaoConformidade,
  Notificacao,
  StatusEnvio,
  StatusNC,
  Vistoria,
} from '@/types'
import {
  checklists as checklistsSeed,
  naoConformidades as ncSeed,
  notificacoes as notifSeed,
  obras,
  vistorias as vistoriasSeed,
  OBRA_PRINCIPAL,
} from '@/mocks/data'
import { usuarioLogado } from '@/mocks/users'
import { enviosSeed } from '@/mocks/envios'

type Tema = 'dark' | 'light'

interface AppState {
  tema: Tema
  alternarTema: () => void
  usuario: typeof usuarioLogado
  obraAtualId: string
  setObraAtualId: (id: string) => void
  obraAtual: (typeof obras)[number]

  vistorias: Vistoria[]
  adicionarVistoria: (v: Vistoria) => void

  naoConformidades: NaoConformidade[]
  moverNC: (id: string, status: StatusNC) => void

  checklists: Checklist[]
  atualizarItemChecklist: (
    checklistId: string,
    itemId: string,
    patch: Partial<Checklist['itens'][number]>,
  ) => void

  notificacoes: Notificacao[]
  marcarComoLida: (id: string) => void
  marcarTodasLidas: () => void
  naoLidas: number

  /** Envios do app do operário: alimentam a fila de validação do engenheiro. */
  envios: EnvioOperario[]
  registrarEnvio: (e: EnvioOperario) => void
  atualizarEnvio: (id: string, status: StatusEnvio, ncGerada?: string) => void
  enviosPendentes: number
}

const Ctx = createContext<AppState | null>(null)

const CHAVE_TEMA = 'obracheck:tema'

export function AppProvider({ children }: { children: ReactNode }) {
  const [tema, setTema] = useState<Tema>(() => {
    try {
      return (localStorage.getItem(CHAVE_TEMA) as Tema) ?? 'dark'
    } catch {
      return 'dark'
    }
  })
  const [obraAtualId, setObraAtualId] = useState(OBRA_PRINCIPAL)
  const [vistorias, setVistorias] = useState<Vistoria[]>(vistoriasSeed)
  const [naoConformidades, setNaoConformidades] = useState<NaoConformidade[]>(ncSeed)
  const [checklists, setChecklists] = useState<Checklist[]>(checklistsSeed)
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>(notifSeed)
  // A fila fica só em memória de propósito: ela sobrevive à troca de perfil,
  // que é o que a demo precisa, e um F5 devolve o estado inicial com as datas
  // recalculadas. Persistir congelaria os "há 2 h" do seed no dia da gravação.
  const [envios, setEnvios] = useState<EnvioOperario[]>(enviosSeed)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', tema === 'dark')
    try {
      localStorage.setItem(CHAVE_TEMA, tema)
    } catch {
      /* modo privado: o tema simplesmente nao persiste */
    }
  }, [tema])

  const alternarTema = useCallback(() => setTema((t) => (t === 'dark' ? 'light' : 'dark')), [])

  const adicionarVistoria = useCallback((v: Vistoria) => {
    setVistorias((atual) => [v, ...atual])
  }, [])

  const moverNC = useCallback((id: string, status: StatusNC) => {
    setNaoConformidades((atual) =>
      atual.map((nc) =>
        nc.id === id
          ? { ...nc, status, fechadaEm: status === 'fechada' ? new Date().toISOString() : undefined }
          : nc,
      ),
    )
  }, [])

  const atualizarItemChecklist = useCallback<AppState['atualizarItemChecklist']>(
    (checklistId, itemId, patch) => {
      setChecklists((atual) =>
        atual.map((c) =>
          c.id !== checklistId
            ? c
            : {
                ...c,
                atualizadoEm: new Date().toISOString(),
                itens: c.itens.map((i) => (i.id === itemId ? { ...i, ...patch } : i)),
              },
        ),
      )
    },
    [],
  )

  const marcarComoLida = useCallback((id: string) => {
    setNotificacoes((atual) => atual.map((n) => (n.id === id ? { ...n, lida: true } : n)))
  }, [])

  const marcarTodasLidas = useCallback(() => {
    setNotificacoes((atual) => atual.map((n) => ({ ...n, lida: true })))
  }, [])

  const registrarEnvio = useCallback((e: EnvioOperario) => {
    setEnvios((atual) => [e, ...atual])
  }, [])

  const atualizarEnvio = useCallback<AppState['atualizarEnvio']>((id, status, ncGerada) => {
    setEnvios((atual) =>
      atual.map((e) => (e.id === id ? { ...e, status, ncGerada: ncGerada ?? e.ncGerada } : e)),
    )
  }, [])

  const valor = useMemo<AppState>(() => {
    const obraAtual = obras.find((o) => o.id === obraAtualId) ?? obras[0]
    return {
      tema,
      alternarTema,
      usuario: usuarioLogado,
      obraAtualId,
      setObraAtualId,
      obraAtual,
      vistorias,
      adicionarVistoria,
      naoConformidades,
      moverNC,
      checklists,
      atualizarItemChecklist,
      notificacoes,
      marcarComoLida,
      marcarTodasLidas,
      naoLidas: notificacoes.filter((n) => !n.lida).length,
      envios,
      registrarEnvio,
      atualizarEnvio,
      enviosPendentes: envios.filter((e) => e.status === 'pendente').length,
    }
  }, [
    tema,
    alternarTema,
    obraAtualId,
    vistorias,
    adicionarVistoria,
    naoConformidades,
    moverNC,
    checklists,
    atualizarItemChecklist,
    notificacoes,
    marcarComoLida,
    marcarTodasLidas,
    envios,
    registrarEnvio,
    atualizarEnvio,
  ])

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>
}

export function useApp() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useApp precisa estar dentro de <AppProvider>')
  return ctx
}

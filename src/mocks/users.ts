import type { PerfilUsuario, Role, Usuario } from '@/types'

export const usuarioLogado: Usuario = {
  id: 'u-001',
  nome: 'Carlos Silva',
  cargo: 'Gestor de Qualidade',
  registro: 'CREA-MG 148.302/D',
  email: 'carlos.silva@construtoravertice.com.br',
  telefone: '+55 35 99812-4477',
  avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80',
  iniciais: 'CS',
}

export const equipe: Usuario[] = [
  usuarioLogado,
  {
    id: 'u-002',
    nome: 'Marina Duarte',
    cargo: 'Engenheira Civil',
    registro: 'CREA-MG 201.884/D',
    email: 'marina.duarte@construtoravertice.com.br',
    telefone: '+55 35 99741-2210',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&q=80',
    iniciais: 'MD',
  },
  {
    id: 'u-003',
    nome: 'Rafael Nogueira',
    cargo: 'Mestre de Obras',
    registro: 'Matrícula 4471',
    email: 'rafael.nogueira@construtoravertice.com.br',
    telefone: '+55 35 99630-8891',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    iniciais: 'RN',
  },
  {
    id: 'u-004',
    nome: 'Juliana Prado',
    cargo: 'Técnica em Edificações',
    registro: 'CFT 33.910',
    email: 'juliana.prado@construtoravertice.com.br',
    telefone: '+55 35 99522-3345',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80',
    iniciais: 'JP',
  },
]

export const engenheiros = equipe.map((u) => u.nome)

/* ------------------------------------------------------------ perfis */

/** Identidade assumida em cada perfil do seletor do header. */
export const mockUsers: Record<Role, PerfilUsuario> = {
  engenheiro: {
    id: 'u2',
    role: 'engenheiro',
    nome: 'Carlos Silva',
    cargo: 'Gestor de Qualidade',
    registro: 'CREA-MG 148.302/D',
    email: 'carlos.silva@construtoravertice.com.br',
    telefone: '+55 35 99812-4477',
    avatar: usuarioLogado.avatar,
    iniciais: 'CS',
    obras: ['Residencial Vista Verde', 'Horizonte Sul — Fase 2'],
  },
  gestor: {
    id: 'u3',
    role: 'gestor',
    nome: 'Ana Rodrigues',
    cargo: 'Diretora de Operações',
    registro: 'CREA-MG 092.117/D',
    email: 'ana.rodrigues@construtoravertice.com.br',
    telefone: '+55 35 99205-6614',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    iniciais: 'AR',
    empresa: 'Construtora Vértice',
  },
}

export const rotulosDePerfil: Record<Role, { emoji: string; label: string; descricao: string }> = {
  engenheiro: {
    emoji: '👨‍💼',
    label: 'Engenheiro',
    descricao: 'Vistoria, ensaia e trata não conformidades',
  },
  gestor: {
    emoji: '🏢',
    label: 'Gestor',
    descricao: 'Acompanha o portfólio, sem executar em campo',
  },
}

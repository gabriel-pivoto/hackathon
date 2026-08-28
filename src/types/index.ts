export type Severidade = 'baixa' | 'media' | 'alta' | 'critica'
export type Conformidade = 'conforme' | 'nao_conforme' | 'requer_analise'
export type StatusNC = 'aberta' | 'em_correcao' | 'fechada'
export type CategoriaNBR = 'termico' | 'acustico' | 'estanqueidade' | 'estrutural'
export type NivelDesempenho = 'M' | 'I' | 'S'
export type ResultadoTeste = 'aprovado' | 'reprovado' | 'pendente' | 'em_execucao'
export type StatusBadgeKind = Conformidade | 'pendente'
export type NormaFamilia = 'NBR 15575' | 'PBQP-H'
export type TipoEvidencia = 'foto' | 'audio'
export type TipoNotificacao = 'critica' | 'alerta' | 'info'
export type CanalNotificacao = 'email' | 'whatsapp' | 'in_app'

export interface Usuario {
  id: string
  nome: string
  cargo: string
  registro: string
  email: string
  telefone: string
  avatar: string
  iniciais: string
}

export interface Obra {
  id: string
  nome: string
  codigo: string
  endereco: string
  cidade: string
  construtora: string
  capa: string
  torres: number
  unidades: number
  conformidade: number
  progresso: number
  inicio: string
  previsaoEntrega: string
  responsavel: string
  ncAbertas: number
  vistorias: number
  nivelPbqph: string
  coordenadas: string
}

export interface Unidade {
  id: string
  obraId: string
  torre: string
  andar: number
  identificacao: string
  tipologia: string
  conformidade: number
  ncAbertas: number
  status: 'em_execucao' | 'em_vistoria' | 'liberada'
}

export interface AnaliseIA {
  id: string
  elemento: string
  descricao: string
  conformidade: Conformidade
  norma: string
  familiaNorma: NormaFamilia
  itemNorma: string
  requisito: string
  severidade: Severidade
  acaoSugerida: string
  prazoSugeridoDias: number
  confianca: number
  nivelDesempenho?: NivelDesempenho
  tags: string[]
}

export interface Evidencia {
  id: string
  tipo: TipoEvidencia
  url?: string
  thumb?: string
  legenda: string
  duracaoSeg?: number
  transcricao?: string
  timestamp: string
  geo: string
  autor: string
  analise?: AnaliseIA
}

export interface Vistoria {
  id: string
  obraId: string
  unidadeId: string
  unidadeLabel: string
  servico: string
  engenheiro: string
  data: string
  conformidade: Conformidade
  evidencias: Evidencia[]
  ncGeradas: string[]
  checklistId?: string
  observacao: string
}

export interface NaoConformidade {
  id: string
  obraId: string
  codigo: string
  titulo: string
  descricao: string
  unidadeLabel: string
  severidade: Severidade
  status: StatusNC
  norma: string
  familiaNorma: NormaFamilia
  responsavel: string
  abertaEm: string
  prazo: string
  fechadaEm?: string
  origem: 'vistoria' | 'teste' | 'reporte_operario'
  vistoriaId?: string
  foto: string
  acaoCorretiva: string
}

export interface EtapaTeste {
  ordem: number
  titulo: string
  descricao: string
}

export interface TesteNBR {
  id: string
  obraId: string
  categoria: CategoriaNBR
  nome: string
  codigo: string
  norma: string
  parte: string
  requisito: string
  criterioMinimo: string
  criterioIntermediario: string
  criterioSuperior: string
  unidade: string
  metodoEnsaio: string
  local: string
  resultado: ResultadoTeste
  nivel?: NivelDesempenho
  valorMedido?: number
  executadoPor?: string
  executadoEm?: string
  justificativa?: string
  procedimento: EtapaTeste[]
  equipamento: string
}

export interface ItemChecklist {
  id: string
  descricao: string
  norma: string
  familiaNorma: NormaFamilia
  status: Conformidade
  sugeridoPorIA: boolean
  confirmado: boolean
  evidenciaThumb?: string
  observacao?: string
}

export interface Checklist {
  id: string
  obraId: string
  servico: string
  unidadeLabel: string
  responsavel: string
  atualizadoEm: string
  itens: ItemChecklist[]
}

export interface Notificacao {
  id: string
  tipo: TipoNotificacao
  canal: CanalNotificacao
  titulo: string
  mensagem: string
  destinatario: string
  enviadaEm: string
  lida: boolean
  link: string
  obraId: string
  whatsapp?: string
}

export interface AtividadeFeed {
  id: string
  tipo: 'vistoria' | 'teste' | 'nc' | 'reporte' | 'relatorio'
  titulo: string
  descricao: string
  autor: string
  quando: string
  link: string
  conformidade?: Conformidade
}

export interface TranscricaoAudio {
  id: string
  duracaoSeg: number
  texto: string
  analise: AnaliseIA
}

/* ------------------------------------------------------------- perfis */

export type Role = 'engenheiro' | 'gestor'

export interface PerfilUsuario extends Usuario {
  role: Role
  /** Obras sob responsabilidade do engenheiro. */
  obras?: string[]
  /** Construtora do gestor. */
  empresa?: string
}

export type TipoEnvio = 'etapa' | 'problema'
export type StatusEnvio = 'pendente' | 'validado' | 'info_solicitada' | 'descartado'

/**
 * Mensagem que o operário mandou pelo WhatsApp e que cai na fila de validação
 * do engenheiro. O operário não tem tela na plataforma: ele fala pelo número
 * do ObraCheck, mandando foto, áudio ou texto.
 */
export interface EnvioOperario {
  id: string
  tipo: TipoEnvio
  autor: string
  funcao: string
  /** Número de onde a mensagem chegou. */
  telefone: string
  obraId: string
  obraNome: string
  servico?: string
  unidadeLabel?: string
  foto?: string
  transcricao?: string
  duracaoSeg?: number
  /** Texto digitado na conversa. */
  comentario?: string
  enviadoEm: string
  status: StatusEnvio
  ncGerada?: string
}

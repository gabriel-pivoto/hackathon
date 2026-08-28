import type { AnaliseIA, TranscricaoAudio } from '@/types'
import { fotos } from './photos'

export interface CenarioFoto {
  key: string
  foto: string
  rotulo: string
  ambiente: string
  analise: AnaliseIA
}

/**
 * Cenarios pre-baked. Cada foto mockada tem um resultado de analise associado;
 * `analisarFoto` apenas espera e devolve o resultado correspondente.
 */
export const analisesPorFoto = {
  fissura: {
    key: 'fissura',
    foto: fotos.fissura,
    rotulo: 'Fissura em alvenaria',
    ambiente: 'Dormitório 1',
    analise: {
      id: 'ia-fissura',
      elemento: 'Alvenaria de vedação — interface com pilar',
      descricao:
        'Fissura vertical de aproximadamente 1,2 mm de abertura acompanhando a interface entre a alvenaria de vedação e o pilar de concreto, com desenvolvimento de cerca de 1,80 m a partir do peitoril. O padrão é compatível com movimentação diferencial entre estrutura e vedação, agravado pela ausência de tela de amarração.',
      conformidade: 'nao_conforme',
      norma: 'NBR 15575-4',
      familiaNorma: 'NBR 15575',
      itemNorma: '15575-4 / 9.2 — Resistência a solicitações de deformação estrutural',
      requisito:
        'Os sistemas de vedação vertical não podem apresentar fissuras que comprometam a estanqueidade, a segurança ou a aparência do sistema.',
      severidade: 'alta',
      acaoSugerida:
        'Abrir a fissura em V, aplicar tela de poliéster com argamassa polimérica e refazer o acabamento após 7 dias de cura. Verificar a amarração da alvenaria nas demais unidades do mesmo pavimento.',
      prazoSugeridoDias: 2,
      confianca: 94,
      tags: ['fissura', 'alvenaria', 'movimentação estrutural'],
    },
  },
  infiltracao: {
    key: 'infiltracao',
    foto: fotos.infiltracao,
    rotulo: 'Infiltração em banheiro',
    ambiente: 'Banheiro social',
    analise: {
      id: 'ia-infiltracao',
      elemento: 'Teto de área molhada — laje sob box',
      descricao:
        'Mancha de umidade ativa com aproximadamente 0,45 m² no teto do banheiro, com bordas escurecidas e início de descolamento da pintura. O posicionamento coincide com a projeção do box do pavimento superior, indicando falha na impermeabilização ou no rejuntamento do ralo.',
      conformidade: 'nao_conforme',
      norma: 'NBR 15575-6',
      familiaNorma: 'NBR 15575',
      itemNorma: '15575-6 / 11.2 — Estanqueidade à água de sistemas hidrossanitários',
      requisito:
        'Os sistemas hidrossanitários e as áreas molhadas devem ser estanques, sem permitir a passagem de água para ambientes contíguos ou pavimentos inferiores.',
      severidade: 'critica',
      acaoSugerida:
        'Interditar o uso do box superior, remover o revestimento, refazer a impermeabilização com manta asfáltica e executar ensaio de estanqueidade de 72 h antes de refechar. Emitir NC crítica com prazo de 24 h.',
      prazoSugeridoDias: 1,
      confianca: 97,
      tags: ['infiltração', 'estanqueidade', 'área molhada'],
    },
  },
  ceramica: {
    key: 'ceramica',
    foto: fotos.ceramica,
    rotulo: 'Assentamento cerâmico',
    ambiente: 'Cozinha',
    analise: {
      id: 'ia-ceramica',
      elemento: 'Revestimento cerâmico de parede',
      descricao:
        'Assentamento com juntas alinhadas e largura uniforme de 3 mm, sem desníveis perceptíveis entre placas adjacentes e sem falhas de rejunte. O padrão de aplicação da argamassa colante aparente nas bordas indica cobertura adequada do tardoz.',
      conformidade: 'conforme',
      norma: 'NBR 15575-3',
      familiaNorma: 'NBR 15575',
      itemNorma: '15575-3 / 13.3 — Adequação da aparência e durabilidade do revestimento',
      requisito:
        'O sistema de revestimento deve manter aderência, planeza e uniformidade de acabamento ao longo da vida útil de projeto.',
      severidade: 'baixa',
      acaoSugerida:
        'Liberar o serviço e registrar a evidência no dossiê da unidade. Manter o teste de percussão na amostragem seguinte.',
      prazoSugeridoDias: 0,
      confianca: 91,
      nivelDesempenho: 'I',
      tags: ['revestimento', 'cerâmica', 'acabamento'],
    },
  },
  eletrica: {
    key: 'eletrica',
    foto: fotos.eletrica,
    rotulo: 'Instalação elétrica exposta',
    ambiente: 'Shaft do hall',
    analise: {
      id: 'ia-eletrica',
      elemento: 'Instalação elétrica — emendas de condutores',
      descricao:
        'Condutores emendados com fita isolante fora de caixa de passagem, expostos no interior do shaft e sem identificação de circuito. A execução contraria o procedimento de execução de serviço aprovado no sistema de gestão da qualidade.',
      conformidade: 'nao_conforme',
      norma: 'PBQP-H / SiAC 4.2',
      familiaNorma: 'PBQP-H',
      itemNorma: 'SiAC 4.2 — Execução de serviços controlados conforme procedimento documentado',
      requisito:
        'Os serviços controlados devem ser executados conforme os procedimentos documentados do sistema de gestão da qualidade, com registro de inspeção.',
      severidade: 'media',
      acaoSugerida:
        'Refazer as emendas em caixa de passagem com conector apropriado, identificar os circuitos e reinspecionar. Reciclar a equipe no PES de instalações elétricas.',
      prazoSugeridoDias: 4,
      confianca: 89,
      tags: ['elétrica', 'PBQP-H', 'procedimento'],
    },
  },
  reboco: {
    key: 'reboco',
    foto: fotos.reboco,
    rotulo: 'Reboco irregular',
    ambiente: 'Sala de estar',
    analise: {
      id: 'ia-reboco',
      elemento: 'Revestimento de argamassa — parede interna',
      descricao:
        'A imagem sugere ondulação na superfície do reboco sob iluminação rasante, mas o ângulo de captura e a incidência de luz não permitem quantificar o desvio de planeza com confiança suficiente para classificar o item.',
      conformidade: 'requer_analise',
      norma: 'NBR 15575-1',
      familiaNorma: 'NBR 15575',
      itemNorma: '15575-1 / 15.1 — Adequação da aparência das superfícies',
      requisito:
        'As superfícies acabadas devem apresentar planeza compatível com o uso previsto, sem ondulações perceptíveis a olho nu em condições normais de iluminação.',
      severidade: 'baixa',
      acaoSugerida:
        'Agendar segunda inspeção com régua metálica de 2 m e iluminação rasante controlada, registrando o desvio máximo medido antes de classificar o item.',
      prazoSugeridoDias: 3,
      confianca: 61,
      tags: ['reboco', 'planeza', 'segunda inspeção'],
    },
  },
  estrutura: {
    key: 'estrutura',
    foto: fotos.estrutura,
    rotulo: 'Estrutura de concreto',
    ambiente: 'Laje do pavimento tipo',
    analise: {
      id: 'ia-estrutura',
      elemento: 'Estrutura de concreto armado — laje',
      descricao:
        'Superfície de concreto com textura homogênea, sem ninhos de concretagem, exsudação ou segregação aparente. As juntas de concretagem estão regulares e o acabamento superficial é compatível com a classe especificada.',
      conformidade: 'conforme',
      norma: 'NBR 15575-2',
      familiaNorma: 'NBR 15575',
      itemNorma: '15575-2 / 7.2 — Desempenho estrutural em uso',
      requisito:
        'O sistema estrutural deve atender aos estados-limite último e de serviço, sem falhas de execução que comprometam a durabilidade.',
      severidade: 'baixa',
      acaoSugerida: 'Liberar a etapa e manter o controle tecnológico do concreto na amostragem prevista.',
      prazoSugeridoDias: 0,
      confianca: 88,
      nivelDesempenho: 'M',
      tags: ['estrutura', 'concreto', 'laje'],
    },
  },
  fachada: {
    key: 'fachada',
    foto: fotos.fachada,
    rotulo: 'Fachada e cobertura',
    ambiente: 'Cobertura — fachada norte',
    analise: {
      id: 'ia-fachada',
      elemento: 'Cobertura — rufo metálico de arremate',
      descricao:
        'Sobreposição entre peças de rufo aparentemente inferior ao detalhamento de projeto, com junta visível e sem selante aplicado. Trecho vulnerável à infiltração sob chuva com vento.',
      conformidade: 'nao_conforme',
      norma: 'NBR 15575-5',
      familiaNorma: 'NBR 15575',
      itemNorma: '15575-5 / 11.2 — Estanqueidade à água da cobertura',
      requisito:
        'A cobertura deve ser estanque à água de chuva, inclusive nas regiões de arremate, encontro e transpasse de peças.',
      severidade: 'alta',
      acaoSugerida:
        'Substituir as peças garantindo 10 cm de sobreposição, selar as juntas com mastique de poliuretano e reinspecionar após a primeira chuva.',
      prazoSugeridoDias: 2,
      confianca: 86,
      tags: ['cobertura', 'rufo', 'estanqueidade'],
    },
  },
  impermeabilizacao: {
    key: 'impermeabilizacao',
    foto: fotos.impermeabilizacao,
    rotulo: 'Impermeabilização',
    ambiente: 'Área molhada',
    analise: {
      id: 'ia-imperm',
      elemento: 'Sistema de impermeabilização — manta asfáltica',
      descricao:
        'Manta asfáltica aplicada com arremate vertical de aproximadamente 30 cm nas paredes, emendas sobrepostas e biselamento dos cantos executado. Não há bolhas, descolamentos ou perfurações aparentes.',
      conformidade: 'conforme',
      norma: 'NBR 15575-3',
      familiaNorma: 'NBR 15575',
      itemNorma: '15575-3 / 11.1 — Estanqueidade de pisos de áreas molhadas',
      requisito:
        'O sistema de piso de área molhada deve ser estanque, com impermeabilização contínua e arremates adequados.',
      severidade: 'baixa',
      acaoSugerida: 'Liberar para o ensaio de estanqueidade de 72 h antes da execução do contrapiso.',
      prazoSugeridoDias: 0,
      confianca: 93,
      nivelDesempenho: 'I',
      tags: ['impermeabilização', 'manta', 'área molhada'],
    },
  },
  esquadria: {
    key: 'esquadria',
    foto: fotos.esquadria,
    rotulo: 'Esquadrias e vidros',
    ambiente: 'Sala — janela da fachada leste',
    analise: {
      id: 'ia-esquadria',
      elemento: 'Esquadria de alumínio com vidro laminado',
      descricao:
        'Esquadria nivelada e aprumada, com vedação de borracha íntegra no perímetro e calafetação externa contínua. O vidro laminado está identificado com a espessura especificada em projeto.',
      conformidade: 'conforme',
      norma: 'NBR 15575-4',
      familiaNorma: 'NBR 15575',
      itemNorma: '15575-4 / 10.2 — Estanqueidade à água das esquadrias',
      requisito:
        'As esquadrias externas devem impedir a penetração de água para o interior sob a ação de chuva dirigida.',
      severidade: 'baixa',
      acaoSugerida: 'Liberar o serviço e incluir a esquadria na amostragem do ensaio de chuva dirigida.',
      prazoSugeridoDias: 0,
      confianca: 90,
      nivelDesempenho: 'I',
      tags: ['esquadria', 'vedação', 'estanqueidade'],
    },
  },
  laje: {
    key: 'laje',
    foto: fotos.laje,
    rotulo: 'Alvenaria executada',
    ambiente: 'Dormitório 2',
    analise: {
      id: 'ia-laje',
      elemento: 'Alvenaria de vedação — prumo e esquadro',
      descricao:
        'Fiadas alinhadas com juntas de espessura uniforme, prumo aparentemente dentro da tolerância e telas de amarração visíveis nas fiadas de encontro com a estrutura.',
      conformidade: 'conforme',
      norma: 'PBQP-H / SiAC 7.5',
      familiaNorma: 'PBQP-H',
      itemNorma: 'SiAC 7.5 — Controle de execução de serviços controlados',
      requisito:
        'A execução do serviço controlado deve atender às tolerâncias definidas no procedimento de execução de serviço.',
      severidade: 'baixa',
      acaoSugerida: 'Liberar a etapa e registrar as medições de prumo na ficha de verificação de serviço.',
      prazoSugeridoDias: 0,
      confianca: 87,
      tags: ['alvenaria', 'prumo', 'PBQP-H'],
    },
  },
} satisfies Record<string, CenarioFoto>

export type FotoCenarioKey = keyof typeof analisesPorFoto

/** As 5 fotos oferecidas na tela de captura da vistoria. */
export const fotosDaCaptura: CenarioFoto[] = [
  analisesPorFoto.fissura,
  analisesPorFoto.infiltracao,
  analisesPorFoto.ceramica,
  analisesPorFoto.eletrica,
  analisesPorFoto.reboco,
]

/* ------------------------------------------------------------------ áudio */

export const transcricoes: TranscricaoAudio[] = [
  {
    id: 'tr-001',
    duracaoSeg: 27,
    texto:
      'Aqui é o Carlos, estou no dormitório um do apartamento A duzentos e um. Tem uma fissura acompanhando a junta entre a alvenaria e o pilar, deve ter uns um vírgula dois milímetros de abertura. Ela começa na altura do peitoril e sobe até encontrar a laje. Não tem tela de amarração nessa região, pelo que dá pra ver.',
    analise: {
      id: 'ia-audio-1',
      elemento: 'Alvenaria de vedação — interface com pilar P12',
      descricao:
        'O relato descreve fissura vertical na interface alvenaria/estrutura com abertura estimada em 1,2 mm e extensão do peitoril até a laje, associada à ausência de tela de amarração.',
      conformidade: 'nao_conforme',
      norma: 'NBR 15575-4',
      familiaNorma: 'NBR 15575',
      itemNorma: '15575-4 / 9.2 — Resistência a solicitações de deformação estrutural',
      requisito:
        'Os sistemas de vedação vertical não podem apresentar fissuras que comprometam a estanqueidade, a segurança ou a aparência.',
      severidade: 'alta',
      acaoSugerida:
        'Abrir a fissura em V, aplicar tela de poliéster com argamassa polimérica e verificar a amarração nas demais unidades do pavimento.',
      prazoSugeridoDias: 2,
      confianca: 92,
      tags: ['fissura', 'alvenaria', 'ausência de tela'],
    },
  },
  {
    id: 'tr-002',
    duracaoSeg: 19,
    texto:
      'Marina falando, banheiro do apartamento A cento e quatro. Tem uma mancha grande de umidade no teto, uns quarenta e cinco centímetros quadrados, e a tinta já está descolando na borda. A mancha está bem embaixo do box do apartamento de cima.',
    analise: {
      id: 'ia-audio-2',
      elemento: 'Teto de área molhada — laje sob box do pavimento superior',
      descricao:
        'O relato caracteriza infiltração ativa com descolamento de pintura, localizada na projeção do box superior, típica de falha de impermeabilização de área molhada.',
      conformidade: 'nao_conforme',
      norma: 'NBR 15575-6',
      familiaNorma: 'NBR 15575',
      itemNorma: '15575-6 / 11.2 — Estanqueidade à água de sistemas hidrossanitários',
      requisito:
        'As áreas molhadas devem ser estanques, sem permitir a passagem de água para pavimentos inferiores.',
      severidade: 'critica',
      acaoSugerida:
        'Interditar o box superior, refazer a impermeabilização e executar ensaio de estanqueidade de 72 h antes do refechamento.',
      prazoSugeridoDias: 1,
      confianca: 95,
      tags: ['infiltração', 'estanqueidade', 'interdição'],
    },
  },
  {
    id: 'tr-003',
    duracaoSeg: 15,
    texto:
      'Conferi o revestimento cerâmico da cozinha da B trezentos e dois. Juntas alinhadas, sem som cavo em nenhuma placa no teste de percussão, rejunte uniforme. Tá liberado pra próxima etapa.',
    analise: {
      id: 'ia-audio-3',
      elemento: 'Revestimento cerâmico de parede — cozinha',
      descricao:
        'O relato confirma alinhamento de juntas, ausência de som cavo no teste de percussão e uniformidade de rejunte, indicando aderência adequada do revestimento.',
      conformidade: 'conforme',
      norma: 'NBR 15575-3',
      familiaNorma: 'NBR 15575',
      itemNorma: '15575-3 / 13.3 — Adequação da aparência e durabilidade do revestimento',
      requisito:
        'O revestimento deve manter aderência e uniformidade de acabamento ao longo da vida útil de projeto.',
      severidade: 'baixa',
      acaoSugerida: 'Liberar o serviço e arquivar a evidência no dossiê da unidade.',
      prazoSugeridoDias: 0,
      confianca: 89,
      nivelDesempenho: 'I',
      tags: ['revestimento', 'percussão', 'liberado'],
    },
  },
]

/* --------------------------------------------------------------- runtime */

const espera = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

/** Simula a chamada de visao computacional sobre a foto escolhida. */
export async function analisarFoto(key: FotoCenarioKey | string): Promise<AnaliseIA> {
  await espera(2200 + Math.random() * 900)
  const cenario = analisesPorFoto[key as FotoCenarioKey] ?? analisesPorFoto.reboco
  return cenario.analise
}

/** Simula a transcricao e a estruturacao de um audio de campo. */
export async function transcreverAudio(indice = 0): Promise<TranscricaoAudio> {
  await espera(2400 + Math.random() * 800)
  return transcricoes[indice % transcricoes.length]
}

export interface ValidacaoTeste {
  aprovado: boolean
  nivel?: 'M' | 'I' | 'S'
  justificativa: string
  confianca: number
}

/**
 * Simula a validacao do valor medido de um ensaio contra os criterios da norma.
 * A comparacao usa a direcao do criterio (maior-melhor ou menor-melhor).
 */
export async function validarTeste(
  valor: number,
  limites: { minimo: number; intermediario: number; superior: number },
  maiorEhMelhor: boolean,
  contexto: { norma: string; requisito: string; unidade: string },
): Promise<ValidacaoTeste> {
  await espera(2300 + Math.random() * 700)

  const atende = (limite: number) => (maiorEhMelhor ? valor >= limite : valor <= limite)
  const fmt = (n: number) => `${n.toLocaleString('pt-BR')} ${contexto.unidade}`

  if (atende(limites.superior)) {
    return {
      aprovado: true,
      nivel: 'S',
      confianca: 96,
      justificativa: `O valor medido de ${fmt(valor)} atende ao nível Superior da ${contexto.norma}, cujo limite é ${fmt(limites.superior)}. O requisito "${contexto.requisito}" está plenamente satisfeito e o resultado pode ser usado como referência de desempenho do empreendimento.`,
    }
  }
  if (atende(limites.intermediario)) {
    return {
      aprovado: true,
      nivel: 'I',
      confianca: 94,
      justificativa: `O valor medido de ${fmt(valor)} atende ao nível Intermediário da ${contexto.norma} (limite de ${fmt(limites.intermediario)}), acima do mínimo normativo de ${fmt(limites.minimo)}. O requisito "${contexto.requisito}" está atendido.`,
    }
  }
  if (atende(limites.minimo)) {
    return {
      aprovado: true,
      nivel: 'M',
      confianca: 92,
      justificativa: `O valor medido de ${fmt(valor)} atende ao nível Mínimo da ${contexto.norma}, cujo limite é ${fmt(limites.minimo)}. O desempenho é aceitável, porém sem margem para o nível Intermediário (${fmt(limites.intermediario)}).`,
    }
  }
  return {
    aprovado: false,
    confianca: 95,
    justificativa: `O valor medido de ${fmt(valor)} não atende ao nível Mínimo da ${contexto.norma}, que exige ${fmt(limites.minimo)}. O requisito "${contexto.requisito}" está descumprido e uma não conformidade deve ser aberta com plano de ação e reensaio após a correção.`,
  }
}

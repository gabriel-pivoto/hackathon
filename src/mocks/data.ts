import type {
  AtividadeFeed,
  Checklist,
  NaoConformidade,
  Notificacao,
  Obra,
  TesteNBR,
  Unidade,
  Vistoria,
} from '@/types'
import { fotos } from './photos'
import { analisesPorFoto } from './ai'

/** Datas relativas ao "agora" para a demo nunca parecer velha. */
const dias = (n: number) => {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString()
}
const horas = (n: number) => {
  const d = new Date()
  d.setHours(d.getHours() + n)
  return d.toISOString()
}

export const OBRA_PRINCIPAL = 'obra-001'

export const obras: Obra[] = [
  {
    id: 'obra-001',
    nome: 'Residencial Vista Verde',
    codigo: 'VV-2024',
    endereco: 'Rua das Palmeiras, 480 — Bairro Santana',
    cidade: 'Santa Rita do Sapucaí / MG',
    construtora: 'Construtora Vértice',
    capa: fotos.obraVistaVerde,
    torres: 2,
    unidades: 40,
    conformidade: 87,
    progresso: 64,
    inicio: '2024-03-11T08:00:00.000Z',
    previsaoEntrega: '2026-11-20T08:00:00.000Z',
    responsavel: 'Carlos Silva',
    ncAbertas: 6,
    vistorias: 20,
    nivelPbqph: 'SiAC Nível A',
    coordenadas: '-22.2519, -45.7031',
  },
  {
    id: 'obra-002',
    nome: 'Parque das Acácias',
    codigo: 'PA-2025',
    endereco: 'Av. Wenceslau Braz, 1.220 — Centro',
    cidade: 'Itajubá / MG',
    construtora: 'Construtora Vértice',
    capa: fotos.obraParqueDasAcacias,
    torres: 3,
    unidades: 72,
    conformidade: 74,
    progresso: 38,
    inicio: '2025-01-20T08:00:00.000Z',
    previsaoEntrega: '2027-06-30T08:00:00.000Z',
    responsavel: 'Marina Duarte',
    ncAbertas: 11,
    vistorias: 34,
    nivelPbqph: 'SiAC Nível A',
    coordenadas: '-22.4256, -45.4528',
  },
  {
    id: 'obra-003',
    nome: 'Horizonte Sul — Fase 2',
    codigo: 'HS-2023',
    endereco: 'Rodovia MG-290, km 12 — Distrito Industrial',
    cidade: 'Pouso Alegre / MG',
    construtora: 'Construtora Vértice',
    capa: fotos.obraHorizonteSul,
    torres: 1,
    unidades: 24,
    conformidade: 93,
    progresso: 91,
    inicio: '2023-08-02T08:00:00.000Z',
    previsaoEntrega: '2026-02-15T08:00:00.000Z',
    responsavel: 'Carlos Silva',
    ncAbertas: 2,
    vistorias: 58,
    nivelPbqph: 'SiAC Nível A',
    coordenadas: '-22.2300, -45.9361',
  },
  {
    id: 'obra-004',
    nome: 'Núcleo Tech Empresarial',
    codigo: 'NT-2025',
    endereco: 'Rua Cel. José Alves, 77 — Vale do Sapucaí',
    cidade: 'Santa Rita do Sapucaí / MG',
    construtora: 'Construtora Vértice',
    capa: fotos.obraNucleoTech,
    torres: 1,
    unidades: 18,
    conformidade: 68,
    progresso: 22,
    inicio: '2025-09-15T08:00:00.000Z',
    previsaoEntrega: '2027-12-10T08:00:00.000Z',
    responsavel: 'Juliana Prado',
    ncAbertas: 9,
    vistorias: 12,
    nivelPbqph: 'SiAC Nível B',
    coordenadas: '-22.2480, -45.7099',
  },
]

/* ---------------------------------------------------------------- unidades */

const tipologias = ['2 dorm. — 58 m²', '2 dorm. c/ suíte — 66 m²', '3 dorm. — 74 m²']
const statusUnidade: Unidade['status'][] = ['em_execucao', 'em_vistoria', 'liberada']

export const unidades: Unidade[] = ['A', 'B'].flatMap((torre) =>
  Array.from({ length: 5 }, (_, andarIdx) => andarIdx + 1).flatMap((andar) =>
    Array.from({ length: 4 }, (_, aptoIdx) => {
      const numero = andar * 100 + aptoIdx + 1
      const seed = (torre.charCodeAt(0) + andar * 7 + aptoIdx * 13) % 100
      return {
        id: `un-${torre}${numero}`,
        obraId: OBRA_PRINCIPAL,
        torre: `Torre ${torre}`,
        andar,
        identificacao: `${torre}-${numero}`,
        tipologia: tipologias[(andar + aptoIdx) % 3],
        conformidade: 70 + (seed % 30),
        ncAbertas: seed % 7 === 0 ? 2 : seed % 5 === 0 ? 1 : 0,
        status: statusUnidade[(andar + aptoIdx) % 3],
      } satisfies Unidade
    }),
  ),
)

export const servicos = [
  'Alvenaria de vedação',
  'Revestimento cerâmico',
  'Impermeabilização',
  'Instalações elétricas',
  'Instalações hidrossanitárias',
  'Esquadrias e vidros',
  'Pintura interna',
  'Estrutura de concreto',
  'Cobertura e telhado',
  'Forro e gesso',
]

/* --------------------------------------------------------------- vistorias */

type SeedVistoria = {
  id: string
  unidade: string
  servico: string
  engenheiro: string
  data: string
  conformidade: Vistoria['conformidade']
  fotoKey: keyof typeof analisesPorFoto
  observacao: string
  ncGeradas?: string[]
  comAudio?: boolean
  checklistId?: string
}

const seedsVistoria: SeedVistoria[] = [
  { id: 'vst-001', unidade: 'A-201', servico: 'Alvenaria de vedação', engenheiro: 'Carlos Silva', data: horas(-3), conformidade: 'nao_conforme', fotoKey: 'fissura', observacao: 'Fissura mapeada na parede divisória do dormitório 1, próxima ao encontro com o pilar P12.', ncGeradas: ['nc-001'], comAudio: true, checklistId: 'chk-001' },
  { id: 'vst-002', unidade: 'A-104', servico: 'Impermeabilização', engenheiro: 'Marina Duarte', data: horas(-9), conformidade: 'nao_conforme', fotoKey: 'infiltracao', observacao: 'Mancha de umidade no teto do banheiro social, com origem provável no box do pavimento superior.', ncGeradas: ['nc-002'] },
  { id: 'vst-003', unidade: 'B-302', servico: 'Revestimento cerâmico', engenheiro: 'Carlos Silva', data: horas(-26), conformidade: 'conforme', fotoKey: 'ceramica', observacao: 'Assentamento uniforme, juntas alinhadas e sem som cavo no teste de percussão.', checklistId: 'chk-002' },
  { id: 'vst-004', unidade: 'B-101', servico: 'Instalações elétricas', engenheiro: 'Juliana Prado', data: horas(-30), conformidade: 'nao_conforme', fotoKey: 'eletrica', observacao: 'Emendas de condutores fora de caixa de passagem no shaft do hall.', ncGeradas: ['nc-003'] },
  { id: 'vst-005', unidade: 'A-403', servico: 'Pintura interna', engenheiro: 'Marina Duarte', data: dias(-2), conformidade: 'requer_analise', fotoKey: 'reboco', observacao: 'Reboco com ondulação perceptível sob luz rasante na sala de estar.', ncGeradas: ['nc-004'] },
  { id: 'vst-006', unidade: 'B-204', servico: 'Estrutura de concreto', engenheiro: 'Carlos Silva', data: dias(-3), conformidade: 'conforme', fotoKey: 'estrutura', observacao: 'Concretagem da laje do 2º pavimento dentro do previsto, sem ninhos aparentes.' },
  { id: 'vst-007', unidade: 'A-102', servico: 'Esquadrias e vidros', engenheiro: 'Juliana Prado', data: dias(-4), conformidade: 'conforme', fotoKey: 'esquadria', observacao: 'Esquadrias de alumínio com vedação íntegra e nivelamento conferido.' },
  { id: 'vst-008', unidade: 'B-405', servico: 'Cobertura e telhado', engenheiro: 'Carlos Silva', data: dias(-5), conformidade: 'nao_conforme', fotoKey: 'fachada', observacao: 'Rufo metálico com sobreposição inferior ao especificado no projeto executivo.', ncGeradas: ['nc-005'] },
  { id: 'vst-009', unidade: 'A-303', servico: 'Instalações hidrossanitárias', engenheiro: 'Marina Duarte', data: dias(-6), conformidade: 'conforme', fotoKey: 'impermeabilizacao', observacao: 'Teste de estanqueidade do ramal aprovado, sem queda de pressão em 24 h.' },
  { id: 'vst-010', unidade: 'B-103', servico: 'Alvenaria de vedação', engenheiro: 'Carlos Silva', data: dias(-7), conformidade: 'conforme', fotoKey: 'laje', observacao: 'Prumo e esquadro dentro da tolerância de 3 mm/m.' },
  { id: 'vst-011', unidade: 'A-205', servico: 'Forro e gesso', engenheiro: 'Juliana Prado', data: dias(-8), conformidade: 'conforme', fotoKey: 'reboco', observacao: 'Forro nivelado, sem trincas nas juntas de dilatação.' },
  { id: 'vst-012', unidade: 'B-401', servico: 'Revestimento cerâmico', engenheiro: 'Marina Duarte', data: dias(-9), conformidade: 'requer_analise', fotoKey: 'reboco', observacao: 'Variação de tonalidade entre lotes de placas cerâmicas na cozinha.', ncGeradas: ['nc-006'] },
  { id: 'vst-013', unidade: 'A-301', servico: 'Impermeabilização', engenheiro: 'Carlos Silva', data: dias(-11), conformidade: 'conforme', fotoKey: 'impermeabilizacao', observacao: 'Manta asfáltica com arremate de 30 cm nas paredes, conforme projeto.' },
  { id: 'vst-014', unidade: 'B-202', servico: 'Instalações elétricas', engenheiro: 'Juliana Prado', data: dias(-12), conformidade: 'conforme', fotoKey: 'eletrica', observacao: 'Identificação de circuitos no quadro conferida item a item.' },
  { id: 'vst-015', unidade: 'A-405', servico: 'Estrutura de concreto', engenheiro: 'Carlos Silva', data: dias(-14), conformidade: 'nao_conforme', fotoKey: 'fissura', observacao: 'Cobrimento de armadura insuficiente em viga V7 do pavimento tipo.', ncGeradas: ['nc-007'] },
  { id: 'vst-016', unidade: 'B-305', servico: 'Pintura interna', engenheiro: 'Marina Duarte', data: dias(-16), conformidade: 'conforme', fotoKey: 'ceramica', observacao: 'Segunda demão aplicada com cobertura uniforme.' },
  { id: 'vst-017', unidade: 'A-101', servico: 'Esquadrias e vidros', engenheiro: 'Juliana Prado', data: dias(-18), conformidade: 'conforme', fotoKey: 'esquadria', observacao: 'Vidros laminados 6 mm conferidos contra a especificação.' },
  { id: 'vst-018', unidade: 'B-104', servico: 'Instalações hidrossanitárias', engenheiro: 'Carlos Silva', data: dias(-20), conformidade: 'nao_conforme', fotoKey: 'infiltracao', observacao: 'Caimento de piso do box invertido, água acumulando fora do ralo.', ncGeradas: ['nc-008'] },
  { id: 'vst-019', unidade: 'A-404', servico: 'Cobertura e telhado', engenheiro: 'Marina Duarte', data: dias(-23), conformidade: 'conforme', fotoKey: 'fachada', observacao: 'Inclinação do telhado conferida em 30%, compatível com a telha especificada.' },
  { id: 'vst-020', unidade: 'B-203', servico: 'Forro e gesso', engenheiro: 'Carlos Silva', data: dias(-26), conformidade: 'conforme', fotoKey: 'laje', observacao: 'Fixação do forro com tirantes a cada 60 cm, conforme memorial.' },
]

const geoBase = ['-22.25191, -45.70318', '-22.25188, -45.70325', '-22.25196, -45.70311']

export const vistorias: Vistoria[] = seedsVistoria.map((s, i) => {
  const cenario = analisesPorFoto[s.fotoKey]
  const unidade = unidades.find((u) => u.identificacao === s.unidade)
  return {
    id: s.id,
    obraId: OBRA_PRINCIPAL,
    unidadeId: unidade?.id ?? `un-${s.unidade}`,
    unidadeLabel: s.unidade,
    servico: s.servico,
    engenheiro: s.engenheiro,
    data: s.data,
    conformidade: s.conformidade,
    observacao: s.observacao,
    ncGeradas: s.ncGeradas ?? [],
    checklistId: s.checklistId,
    evidencias: [
      {
        id: `${s.id}-ev-1`,
        tipo: 'foto' as const,
        url: cenario.foto,
        thumb: cenario.foto,
        legenda: cenario.analise.elemento,
        timestamp: s.data,
        geo: geoBase[i % geoBase.length],
        autor: s.engenheiro,
        analise: cenario.analise,
      },
      ...(s.comAudio
        ? [
            {
              id: `${s.id}-ev-2`,
              tipo: 'audio' as const,
              legenda: 'Relato de campo do engenheiro',
              duracaoSeg: 24,
              transcricao:
                'Estou no dormitório um do apartamento A duzentos e um. A fissura acompanha a junta entre a alvenaria e o pilar, abertura de mais ou menos um milímetro, começa na altura do peitoril e sobe até o encontro com a laje.',
              timestamp: s.data,
              geo: geoBase[i % geoBase.length],
              autor: s.engenheiro,
            },
          ]
        : []),
    ],
  }
})

/* ------------------------------------------------------- não-conformidades */

export const naoConformidades: NaoConformidade[] = [
  { id: 'nc-001', obraId: OBRA_PRINCIPAL, codigo: 'NC-2026-041', titulo: 'Fissura mapeada em alvenaria de vedação', descricao: 'Fissura de aproximadamente 1,2 mm na interface alvenaria/pilar P12, com desenvolvimento vertical de 1,80 m no dormitório 1.', unidadeLabel: 'A-201', severidade: 'alta', status: 'aberta', norma: 'NBR 15575-4', familiaNorma: 'NBR 15575', responsavel: 'Rafael Nogueira', abertaEm: horas(-3), prazo: dias(2), origem: 'vistoria', vistoriaId: 'vst-001', foto: fotos.fissura, acaoCorretiva: 'Abrir a fissura em V, aplicar tela de poliéster com argamassa polimérica e refazer o acabamento após 7 dias de cura.' },
  { id: 'nc-002', obraId: OBRA_PRINCIPAL, codigo: 'NC-2026-042', titulo: 'Infiltração no teto do banheiro social', descricao: 'Mancha de umidade ativa com 0,45 m² no teto, indicando falha de estanqueidade na impermeabilização do box superior.', unidadeLabel: 'A-104', severidade: 'critica', status: 'aberta', norma: 'NBR 15575-6', familiaNorma: 'NBR 15575', responsavel: 'Marina Duarte', abertaEm: horas(-9), prazo: dias(1), origem: 'vistoria', vistoriaId: 'vst-002', foto: fotos.infiltracao, acaoCorretiva: 'Remover o revestimento do box superior, refazer a impermeabilização com manta asfáltica e executar ensaio de estanqueidade por 72 h antes do fechamento.' },
  { id: 'nc-003', obraId: OBRA_PRINCIPAL, codigo: 'NC-2026-039', titulo: 'Emendas elétricas fora de caixa de passagem', descricao: 'Condutores emendados com fita isolante dentro do shaft, sem caixa de passagem e sem identificação de circuito.', unidadeLabel: 'B-101', severidade: 'media', status: 'em_correcao', norma: 'PBQP-H / SiAC 4.2', familiaNorma: 'PBQP-H', responsavel: 'Rafael Nogueira', abertaEm: horas(-30), prazo: dias(4), origem: 'vistoria', vistoriaId: 'vst-004', foto: fotos.eletrica, acaoCorretiva: 'Refazer as emendas em caixa de passagem com conector apropriado e registrar no procedimento de execução de serviço.' },
  { id: 'nc-004', obraId: OBRA_PRINCIPAL, codigo: 'NC-2026-037', titulo: 'Ondulação de reboco acima da tolerância', descricao: 'Desvio de planeza superior a 5 mm em régua de 2 m na parede da sala, identificado sob iluminação rasante.', unidadeLabel: 'A-403', severidade: 'baixa', status: 'em_correcao', norma: 'NBR 15575-1', familiaNorma: 'NBR 15575', responsavel: 'Juliana Prado', abertaEm: dias(-2), prazo: dias(6), origem: 'vistoria', vistoriaId: 'vst-005', foto: fotos.reboco, acaoCorretiva: 'Aplicar massa de regularização e conferir a planeza com régua metálica antes da pintura.' },
  { id: 'nc-005', obraId: OBRA_PRINCIPAL, codigo: 'NC-2026-034', titulo: 'Sobreposição insuficiente de rufo metálico', descricao: 'Sobreposição executada com 4 cm contra os 10 cm previstos no detalhamento de cobertura.', unidadeLabel: 'B-405', severidade: 'alta', status: 'em_correcao', norma: 'NBR 15575-5', familiaNorma: 'NBR 15575', responsavel: 'Rafael Nogueira', abertaEm: dias(-5), prazo: horas(36), origem: 'vistoria', vistoriaId: 'vst-008', foto: fotos.fachada, acaoCorretiva: 'Substituir as peças de rufo garantindo 10 cm de sobreposição e selar as juntas com mastique de poliuretano.' },
  { id: 'nc-006', obraId: OBRA_PRINCIPAL, codigo: 'NC-2026-031', titulo: 'Variação de tonalidade em placas cerâmicas', descricao: 'Duas tonalidades distintas na mesma parede da cozinha, sugerindo mistura de lotes de fabricação.', unidadeLabel: 'B-401', severidade: 'baixa', status: 'aberta', norma: 'PBQP-H / SiAC 7.4', familiaNorma: 'PBQP-H', responsavel: 'Juliana Prado', abertaEm: dias(-9), prazo: dias(8), origem: 'vistoria', vistoriaId: 'vst-012', foto: fotos.ceramica, acaoCorretiva: 'Separar os lotes na conferência de recebimento e substituir as placas da parede afetada por material de lote único.' },
  { id: 'nc-007', obraId: OBRA_PRINCIPAL, codigo: 'NC-2026-028', titulo: 'Cobrimento de armadura insuficiente na viga V7', descricao: 'Cobrimento medido de 15 mm contra os 25 mm exigidos para a classe de agressividade ambiental II.', unidadeLabel: 'A-405', severidade: 'critica', status: 'em_correcao', norma: 'NBR 15575-2', familiaNorma: 'NBR 15575', responsavel: 'Carlos Silva', abertaEm: dias(-14), prazo: dias(3), origem: 'vistoria', vistoriaId: 'vst-015', foto: fotos.estrutura, acaoCorretiva: 'Executar reforço com argamassa de reparo estrutural e emitir laudo de verificação assinado pelo calculista.' },
  { id: 'nc-008', obraId: OBRA_PRINCIPAL, codigo: 'NC-2026-025', titulo: 'Caimento de piso invertido no box', descricao: 'Água acumulando fora da área do ralo, com caimento contrário ao especificado em projeto hidráulico.', unidadeLabel: 'B-104', severidade: 'alta', status: 'fechada', norma: 'NBR 15575-3', familiaNorma: 'NBR 15575', responsavel: 'Rafael Nogueira', abertaEm: dias(-20), prazo: dias(-12), fechadaEm: dias(-13), origem: 'vistoria', vistoriaId: 'vst-018', foto: fotos.impermeabilizacao, acaoCorretiva: 'Piso demolido e refeito com caimento de 1,5% em direção ao ralo. Ensaio de escoamento aprovado.' },
  { id: 'nc-009', obraId: OBRA_PRINCIPAL, codigo: 'NC-2026-022', titulo: 'Ruído aéreo acima do limite entre unidades', descricao: 'Ensaio de isolamento acústico entre A-301 e A-302 registrou DnT,w de 42 dB, abaixo do mínimo normativo.', unidadeLabel: 'A-301', severidade: 'critica', status: 'aberta', norma: 'NBR 15575-3', familiaNorma: 'NBR 15575', responsavel: 'Marina Duarte', abertaEm: dias(-4), prazo: horas(40), origem: 'teste', foto: fotos.ensaioAcustico, acaoCorretiva: 'Revisar o preenchimento das juntas da parede geminada e reensaiar após a correção.' },
  { id: 'nc-010', obraId: OBRA_PRINCIPAL, codigo: 'NC-2026-019', titulo: 'Andaime sem guarda-corpo no 4º pavimento', descricao: 'Operário reportou pelo WhatsApp: plataforma de trabalho sem guarda-corpo em trecho da fachada norte.', unidadeLabel: 'Fachada Norte', severidade: 'critica', status: 'fechada', norma: 'PBQP-H / SiAC 6.1', familiaNorma: 'PBQP-H', responsavel: 'Rafael Nogueira', abertaEm: dias(-10), prazo: dias(-9), fechadaEm: dias(-9), origem: 'reporte_operario', foto: fotos.fachada, acaoCorretiva: 'Guarda-corpo instalado no mesmo dia e checklist de segurança do andaime revisado com a equipe.' },
  { id: 'nc-011', obraId: OBRA_PRINCIPAL, codigo: 'NC-2026-017', titulo: 'Argamassa colante fora do prazo de validade', descricao: 'Lote com validade vencida identificado no almoxarifado durante auditoria de recebimento de materiais.', unidadeLabel: 'Almoxarifado', severidade: 'media', status: 'fechada', norma: 'PBQP-H / SiAC 7.4', familiaNorma: 'PBQP-H', responsavel: 'Juliana Prado', abertaEm: dias(-24), prazo: dias(-20), fechadaEm: dias(-21), origem: 'vistoria', foto: fotos.ceramica, acaoCorretiva: 'Lote segregado e devolvido ao fornecedor. Controle de validade incluído na rotina semanal de estoque.' },
  { id: 'nc-012', obraId: OBRA_PRINCIPAL, codigo: 'NC-2026-014', titulo: 'Desempenho térmico abaixo do mínimo na fachada oeste', descricao: 'Transmitância térmica calculada em 3,9 W/m²K, acima do limite para a zona bioclimática 3.', unidadeLabel: 'Fachada Oeste', severidade: 'alta', status: 'em_correcao', norma: 'NBR 15575-4', familiaNorma: 'NBR 15575', responsavel: 'Carlos Silva', abertaEm: dias(-7), prazo: dias(5), origem: 'teste', foto: fotos.ensaioTermico, acaoCorretiva: 'Incluir camada de isolante térmico no sistema de vedação e recalcular a transmitância com o projetista.' },
  { id: 'nc-013', obraId: OBRA_PRINCIPAL, codigo: 'NC-2026-011', titulo: 'Serviço liberado sem registro fotográfico', descricao: 'Impermeabilização liberada sem o registro fotográfico obrigatório da etapa de aplicação da manta.', unidadeLabel: 'A-303', severidade: 'baixa', status: 'fechada', norma: 'PBQP-H / SiAC 8.2', familiaNorma: 'PBQP-H', responsavel: 'Marina Duarte', abertaEm: dias(-28), prazo: dias(-24), fechadaEm: dias(-25), origem: 'vistoria', foto: fotos.impermeabilizacao, acaoCorretiva: 'Registro refeito antes do fechamento do contrapiso e bloqueio de liberação sem foto ativado no sistema.' },
  { id: 'nc-014', obraId: OBRA_PRINCIPAL, codigo: 'NC-2026-009', titulo: 'Vazamento em registro de gaveta do banheiro', descricao: 'Operário reportou pelo WhatsApp: gotejamento contínuo no registro após teste de pressão.', unidadeLabel: 'B-202', severidade: 'media', status: 'em_correcao', norma: 'NBR 15575-6', familiaNorma: 'NBR 15575', responsavel: 'Rafael Nogueira', abertaEm: dias(-3), prazo: dias(4), origem: 'reporte_operario', foto: fotos.impermeabilizacao, acaoCorretiva: 'Substituir a vedação do registro e repetir o ensaio de pressão por 24 h.' },
  { id: 'nc-015', obraId: OBRA_PRINCIPAL, codigo: 'NC-2026-006', titulo: 'Esquadria sem vedação no batente', descricao: 'Folga de 8 mm entre o batente e a alvenaria permitindo passagem de água em chuva dirigida.', unidadeLabel: 'A-102', severidade: 'media', status: 'fechada', norma: 'NBR 15575-4', familiaNorma: 'NBR 15575', responsavel: 'Juliana Prado', abertaEm: dias(-31), prazo: dias(-26), fechadaEm: dias(-27), origem: 'vistoria', foto: fotos.esquadria, acaoCorretiva: 'Preenchimento com espuma de poliuretano e selagem externa com mastique. Ensaio de estanqueidade aprovado.' },
]

/* ------------------------------------------------------------ testes 15575 */

export const testes: TesteNBR[] = [
  {
    id: 'tst-001',
    obraId: OBRA_PRINCIPAL,
    categoria: 'acustico',
    nome: 'Isolamento de ruído aéreo entre unidades',
    codigo: 'ACU-01',
    norma: 'NBR 15575-3',
    parte: 'Parte 3 — Sistemas de pisos',
    requisito: 'Diferença padronizada de nível ponderada (DnT,w) entre unidades autônomas.',
    criterioMinimo: '≥ 45 dB',
    criterioIntermediario: '≥ 50 dB',
    criterioSuperior: '≥ 55 dB',
    unidade: 'dB',
    metodoEnsaio: 'ISO 16283-1 — medição de campo com fonte sonora dodecaédrica e analisador classe 1',
    local: 'Torre A — entre 301 e 302',
    resultado: 'pendente',
    equipamento: 'Sonômetro classe 1 + fonte dodecaédrica',
    procedimento: [
      { ordem: 1, titulo: 'Preparar o ambiente', descricao: 'Fechar portas e janelas dos dois ambientes e remover fontes de ruído próximas. Registrar temperatura e umidade relativa.' },
      { ordem: 2, titulo: 'Posicionar a fonte sonora', descricao: 'Instalar a fonte dodecaédrica no ambiente emissor em duas posições distintas, a pelo menos 0,7 m de qualquer superfície.' },
      { ordem: 3, titulo: 'Medir o nível no ambiente emissor', descricao: 'Registrar o nível de pressão sonora em cinco posições de microfone por posição de fonte.' },
      { ordem: 4, titulo: 'Medir o nível no ambiente receptor', descricao: 'Repetir as cinco posições de microfone no ambiente receptor, mantendo a distância mínima das superfícies.' },
      { ordem: 5, titulo: 'Medir ruído de fundo e reverberação', descricao: 'Registrar o ruído de fundo e o T20 do ambiente receptor para a correção do resultado.' },
      { ordem: 6, titulo: 'Calcular o DnT,w', descricao: 'Aplicar a curva de referência da ISO 717-1 sobre os valores por banda de terço de oitava.' },
    ],
  },
  {
    id: 'tst-002',
    obraId: OBRA_PRINCIPAL,
    categoria: 'acustico',
    nome: 'Ruído de impacto em sistema de piso',
    codigo: 'ACU-02',
    norma: 'NBR 15575-3',
    parte: 'Parte 3 — Sistemas de pisos',
    requisito: "Nível de pressão sonora de impacto padronizado ponderado (L'nT,w).",
    criterioMinimo: '≤ 80 dB',
    criterioIntermediario: '≤ 65 dB',
    criterioSuperior: '≤ 55 dB',
    unidade: 'dB',
    metodoEnsaio: 'ISO 16283-2 — máquina de impactos padronizada sobre a laje do ambiente emissor',
    local: 'Torre B — laje entre 202 e 102',
    resultado: 'aprovado',
    nivel: 'I',
    valorMedido: 62,
    executadoPor: 'Marina Duarte',
    executadoEm: dias(-12),
    justificativa:
      "O valor medido de 62 dB atende ao nível Intermediário da NBR 15575-3, que exige L'nT,w ≤ 65 dB. O contrapiso com manta acústica de 5 mm foi determinante para o resultado.",
    equipamento: 'Máquina de impactos padronizada + sonômetro classe 1',
    procedimento: [
      { ordem: 1, titulo: 'Posicionar a máquina de impactos', descricao: 'Instalar a máquina em quatro posições distintas sobre a laje do ambiente emissor.' },
      { ordem: 2, titulo: 'Medir no ambiente receptor', descricao: 'Registrar o nível de pressão sonora em cinco posições de microfone para cada posição da máquina.' },
      { ordem: 3, titulo: 'Corrigir pelo tempo de reverberação', descricao: 'Medir o T20 do ambiente receptor e normalizar os valores.' },
      { ordem: 4, titulo: "Calcular o L'nT,w", descricao: 'Aplicar a curva de referência da ISO 717-2.' },
    ],
  },
  {
    id: 'tst-003',
    obraId: OBRA_PRINCIPAL,
    categoria: 'termico',
    nome: 'Transmitância térmica de parede externa',
    codigo: 'TER-01',
    norma: 'NBR 15575-4',
    parte: 'Parte 4 — Vedações verticais',
    requisito: 'Transmitância térmica (U) do sistema de vedação vertical externa, zona bioclimática 3.',
    criterioMinimo: 'U ≤ 3,7 W/m²K',
    criterioIntermediario: 'U ≤ 2,5 W/m²K',
    criterioSuperior: 'U ≤ 2,0 W/m²K',
    unidade: 'W/m²K',
    metodoEnsaio: 'NBR 15220-2 — cálculo por camadas com verificação de campo por termografia',
    local: 'Fachada Oeste — Torre A',
    resultado: 'reprovado',
    valorMedido: 3.9,
    executadoPor: 'Carlos Silva',
    executadoEm: dias(-7),
    justificativa:
      'A transmitância verificada de 3,9 W/m²K ultrapassa o limite de 3,7 W/m²K exigido pelo nível Mínimo da NBR 15575-4 para a zona bioclimática 3. O sistema de vedação precisa de camada adicional de isolamento.',
    equipamento: 'Câmera termográfica + fluxímetro',
    procedimento: [
      { ordem: 1, titulo: 'Levantar as camadas do sistema', descricao: 'Conferir em obra a espessura real de cada camada da vedação contra o projeto.' },
      { ordem: 2, titulo: 'Calcular a resistência térmica', descricao: 'Somar as resistências de cada camada e as resistências superficiais interna e externa.' },
      { ordem: 3, titulo: 'Verificar por termografia', descricao: 'Registrar imagens térmicas da fachada em horário de maior incidência solar.' },
      { ordem: 4, titulo: 'Comparar com o limite normativo', descricao: 'Confrontar o U calculado com o limite da zona bioclimática do empreendimento.' },
    ],
  },
  {
    id: 'tst-004',
    obraId: OBRA_PRINCIPAL,
    categoria: 'termico',
    nome: 'Capacidade térmica de vedação externa',
    codigo: 'TER-02',
    norma: 'NBR 15575-4',
    parte: 'Parte 4 — Vedações verticais',
    requisito: 'Capacidade térmica (CT) do sistema de vedação vertical externa.',
    criterioMinimo: 'CT ≥ 130 kJ/m²K',
    criterioIntermediario: 'CT ≥ 160 kJ/m²K',
    criterioSuperior: 'CT ≥ 190 kJ/m²K',
    unidade: 'kJ/m²K',
    metodoEnsaio: 'NBR 15220-2 — cálculo a partir da densidade e do calor específico das camadas',
    local: 'Fachada Norte — Torre B',
    resultado: 'pendente',
    equipamento: 'Planilha normativa + ensaio de densidade em laboratório',
    procedimento: [
      { ordem: 1, titulo: 'Coletar amostras das camadas', descricao: 'Retirar amostras representativas de bloco, argamassa e revestimento.' },
      { ordem: 2, titulo: 'Determinar densidade e calor específico', descricao: 'Ensaiar em laboratório ou usar os valores tabelados da NBR 15220-2.' },
      { ordem: 3, titulo: 'Calcular a capacidade térmica', descricao: 'Somar a contribuição de cada camada do sistema.' },
    ],
  },
  {
    id: 'tst-005',
    obraId: OBRA_PRINCIPAL,
    categoria: 'estanqueidade',
    nome: 'Estanqueidade de fachada à chuva dirigida',
    codigo: 'EST-01',
    norma: 'NBR 15575-4',
    parte: 'Parte 4 — Vedações verticais',
    requisito: 'Ausência de infiltração na face interna sob chuva dirigida simulada por 7 h.',
    criterioMinimo: 'Sem infiltração e sem manchas de umidade',
    criterioIntermediario: 'Sem infiltração e sem escurecimento por umidade',
    criterioSuperior: 'Sem qualquer alteração de aparência na face interna',
    unidade: 'h sem infiltração',
    metodoEnsaio: 'NBR 15575-4 Anexo E — aspersão de água com pressão pneumática diferencial',
    local: 'Fachada Sul — Torre A, pavimento tipo',
    resultado: 'aprovado',
    nivel: 'M',
    valorMedido: 7,
    executadoPor: 'Marina Duarte',
    executadoEm: dias(-18),
    justificativa:
      'Sete horas de aspersão contínua sem qualquer sinal de infiltração ou mancha na face interna. Resultado atende ao nível Mínimo da NBR 15575-4, Anexo E.',
    equipamento: 'Câmara de aspersão + bomba de pressão diferencial 50 Pa',
    procedimento: [
      { ordem: 1, titulo: 'Montar a câmara de ensaio', descricao: 'Vedar o perímetro da câmara sobre o trecho de fachada a ser ensaiado.' },
      { ordem: 2, titulo: 'Aplicar a aspersão', descricao: 'Manter vazão de 3 L/min por metro quadrado durante todo o ensaio.' },
      { ordem: 3, titulo: 'Aplicar pressão diferencial', descricao: 'Manter a pressão pneumática de 50 Pa sobre a superfície molhada.' },
      { ordem: 4, titulo: 'Inspecionar a face interna', descricao: 'Registrar fotograficamente a face interna a cada hora de ensaio.' },
    ],
  },
  {
    id: 'tst-006',
    obraId: OBRA_PRINCIPAL,
    categoria: 'estanqueidade',
    nome: 'Estanqueidade de área molhada — box e piso',
    codigo: 'EST-02',
    norma: 'NBR 15575-3',
    parte: 'Parte 3 — Sistemas de pisos',
    requisito: 'Estanqueidade do sistema de piso de área molhada sob lâmina de água por 72 h.',
    criterioMinimo: 'Sem vazamento para o pavimento inferior',
    criterioIntermediario: 'Sem vazamento e sem umidade no contrapiso',
    criterioSuperior: 'Sem qualquer variação de umidade nas faces adjacentes',
    unidade: 'h sob lâmina',
    metodoEnsaio: 'NBR 9574 / NBR 15575-3 — lâmina de água de 5 cm com inspeção do pavimento inferior',
    local: 'Torre A — banheiro do apto 104',
    resultado: 'reprovado',
    valorMedido: 41,
    executadoPor: 'Carlos Silva',
    executadoEm: dias(-9),
    justificativa:
      'Surgimento de mancha de umidade no teto do pavimento inferior com 41 h de ensaio, antes das 72 h exigidas. Falha de estanqueidade caracterizada segundo a NBR 15575-3.',
    equipamento: 'Kit de vedação de ralo + medidor de umidade por impedância',
    procedimento: [
      { ordem: 1, titulo: 'Vedar ralos e saídas', descricao: 'Bloquear todas as saídas de água da área a ser ensaiada.' },
      { ordem: 2, titulo: 'Encher com lâmina de 5 cm', descricao: 'Manter a lâmina constante durante todo o período de ensaio.' },
      { ordem: 3, titulo: 'Inspecionar o pavimento inferior', descricao: 'Verificar teto e paredes do ambiente abaixo a cada 12 h.' },
      { ordem: 4, titulo: 'Registrar o resultado', descricao: 'Fotografar as faces inspecionadas e medir a umidade superficial.' },
    ],
  },
  {
    id: 'tst-007',
    obraId: OBRA_PRINCIPAL,
    categoria: 'estrutural',
    nome: 'Resistência a impacto de corpo mole em parede',
    codigo: 'ETR-01',
    norma: 'NBR 15575-4',
    parte: 'Parte 4 — Vedações verticais',
    requisito: 'Resistência da vedação vertical interna a impactos de corpo mole com energia de 240 J.',
    criterioMinimo: 'Sem ruína e sem falhas com energia de 240 J',
    criterioIntermediario: 'Sem fissuras visíveis com energia de 360 J',
    criterioSuperior: 'Sem qualquer dano com energia de 480 J',
    unidade: 'J',
    metodoEnsaio: 'NBR 11675 / NBR 15575-4 — saco de areia de 40 kg em pêndulo',
    local: 'Torre B — parede divisória do apto 203',
    resultado: 'aprovado',
    nivel: 'S',
    valorMedido: 480,
    executadoPor: 'Carlos Silva',
    executadoEm: dias(-21),
    justificativa:
      'A parede suportou impactos sucessivos até 480 J sem fissuras, deslocamentos residuais ou ruína, atendendo ao nível Superior da NBR 15575-4.',
    equipamento: 'Pêndulo com saco de areia 40 kg + relógio comparador',
    procedimento: [
      { ordem: 1, titulo: 'Montar o pêndulo', descricao: 'Fixar o dispositivo garantindo o ponto de impacto no centro do painel.' },
      { ordem: 2, titulo: 'Aplicar as energias crescentes', descricao: 'Executar os impactos nas energias de 120, 240, 360 e 480 J.' },
      { ordem: 3, titulo: 'Medir o deslocamento residual', descricao: 'Registrar o deslocamento horizontal após cada série de impactos.' },
      { ordem: 4, titulo: 'Inspecionar fissuras', descricao: 'Examinar as duas faces do painel com lupa graduada.' },
    ],
  },
  {
    id: 'tst-008',
    obraId: OBRA_PRINCIPAL,
    categoria: 'estrutural',
    nome: 'Deslocamento de laje sob carga de utilização',
    codigo: 'ETR-02',
    norma: 'NBR 15575-2',
    parte: 'Parte 2 — Sistemas estruturais',
    requisito: 'Deslocamento vertical da laje sob carga de utilização limitado a L/350.',
    criterioMinimo: 'Deslocamento ≤ L/250',
    criterioIntermediario: 'Deslocamento ≤ L/350',
    criterioSuperior: 'Deslocamento ≤ L/500',
    unidade: 'mm',
    metodoEnsaio: 'NBR 15575-2 — carregamento controlado com medição por relógio comparador',
    local: 'Torre A — laje do 4º pavimento',
    resultado: 'pendente',
    equipamento: 'Cargas calibradas + relógios comparadores digitais 0,01 mm',
    procedimento: [
      { ordem: 1, titulo: 'Posicionar os relógios comparadores', descricao: 'Instalar os medidores no meio do vão e nos apoios da laje.' },
      { ordem: 2, titulo: 'Aplicar a carga em etapas', descricao: 'Carregar em incrementos de 25% da carga de utilização, aguardando estabilização.' },
      { ordem: 3, titulo: 'Registrar os deslocamentos', descricao: 'Anotar a leitura de cada relógio ao final de cada etapa de carga.' },
      { ordem: 4, titulo: 'Descarregar e medir o residual', descricao: 'Remover as cargas e registrar o deslocamento residual após 24 h.' },
    ],
  },
]

/* -------------------------------------------------------------- checklists */

export const checklists: Checklist[] = [
  {
    id: 'chk-001',
    obraId: OBRA_PRINCIPAL,
    servico: 'Alvenaria de vedação',
    unidadeLabel: 'A-201',
    responsavel: 'Carlos Silva',
    atualizadoEm: horas(-3),
    itens: [
      { id: 'chk-001-1', descricao: 'Prumo da parede dentro da tolerância de 3 mm/m', norma: 'PBQP-H / SiAC 7.5', familiaNorma: 'PBQP-H', status: 'conforme', sugeridoPorIA: true, confirmado: true, evidenciaThumb: fotos.laje },
      { id: 'chk-001-2', descricao: 'Juntas de argamassa com espessura uniforme entre 10 e 15 mm', norma: 'PBQP-H / SiAC 7.5', familiaNorma: 'PBQP-H', status: 'conforme', sugeridoPorIA: true, confirmado: true, evidenciaThumb: fotos.laje },
      { id: 'chk-001-3', descricao: 'Ausência de fissuras na interface alvenaria/estrutura', norma: 'NBR 15575-4', familiaNorma: 'NBR 15575', status: 'nao_conforme', sugeridoPorIA: true, confirmado: false, evidenciaThumb: fotos.fissura, observacao: 'Fissura de 1,2 mm identificada pela IA no encontro com o pilar P12.' },
      { id: 'chk-001-4', descricao: 'Encunhamento executado após 7 dias do assentamento', norma: 'NBR 15575-4', familiaNorma: 'NBR 15575', status: 'requer_analise', sugeridoPorIA: true, confirmado: false, evidenciaThumb: fotos.reboco, observacao: 'Data de encunhamento não localizada no diário de obra.' },
      { id: 'chk-001-5', descricao: 'Vergas e contravergas com transpasse mínimo de 30 cm', norma: 'NBR 15575-4', familiaNorma: 'NBR 15575', status: 'conforme', sugeridoPorIA: false, confirmado: true, evidenciaThumb: fotos.esquadria },
      { id: 'chk-001-6', descricao: 'Amarração da alvenaria com telas metálicas a cada 2 fiadas', norma: 'PBQP-H / SiAC 7.5', familiaNorma: 'PBQP-H', status: 'conforme', sugeridoPorIA: true, confirmado: false, evidenciaThumb: fotos.laje },
      { id: 'chk-001-7', descricao: 'Registro fotográfico da etapa arquivado no dossiê da unidade', norma: 'PBQP-H / SiAC 8.2', familiaNorma: 'PBQP-H', status: 'conforme', sugeridoPorIA: true, confirmado: true, evidenciaThumb: fotos.fissura },
    ],
  },
  {
    id: 'chk-002',
    obraId: OBRA_PRINCIPAL,
    servico: 'Revestimento cerâmico',
    unidadeLabel: 'B-302',
    responsavel: 'Carlos Silva',
    atualizadoEm: horas(-26),
    itens: [
      { id: 'chk-002-1', descricao: 'Substrato limpo, curado e com planeza conferida', norma: 'PBQP-H / SiAC 7.5', familiaNorma: 'PBQP-H', status: 'conforme', sugeridoPorIA: true, confirmado: true, evidenciaThumb: fotos.ceramica },
      { id: 'chk-002-2', descricao: 'Argamassa colante compatível com o tipo de placa e ambiente', norma: 'PBQP-H / SiAC 7.4', familiaNorma: 'PBQP-H', status: 'conforme', sugeridoPorIA: true, confirmado: true, evidenciaThumb: fotos.ceramica },
      { id: 'chk-002-3', descricao: 'Ausência de som cavo no teste de percussão', norma: 'NBR 15575-3', familiaNorma: 'NBR 15575', status: 'conforme', sugeridoPorIA: true, confirmado: true, evidenciaThumb: fotos.ceramica },
      { id: 'chk-002-4', descricao: 'Juntas de assentamento alinhadas e com largura uniforme', norma: 'NBR 15575-3', familiaNorma: 'NBR 15575', status: 'conforme', sugeridoPorIA: true, confirmado: false, evidenciaThumb: fotos.ceramica },
      { id: 'chk-002-5', descricao: 'Juntas de movimentação executadas conforme projeto', norma: 'NBR 15575-3', familiaNorma: 'NBR 15575', status: 'requer_analise', sugeridoPorIA: true, confirmado: false, evidenciaThumb: fotos.reboco, observacao: 'Espaçamento entre juntas maior que o previsto em projeto. Confirmar com o projetista.' },
      { id: 'chk-002-6', descricao: 'Rejunte aplicado após 72 h do assentamento', norma: 'PBQP-H / SiAC 7.5', familiaNorma: 'PBQP-H', status: 'conforme', sugeridoPorIA: false, confirmado: true, evidenciaThumb: fotos.ceramica },
    ],
  },
]

/* ------------------------------------------------------------ notificações */

export const notificacoes: Notificacao[] = [
  { id: 'ntf-001', tipo: 'critica', canal: 'whatsapp', titulo: 'Infiltração crítica detectada em A-104', mensagem: 'A análise da foto identificou infiltração ativa no teto do banheiro social, classificada como não conformidade crítica pela NBR 15575-6.', destinatario: 'Marina Duarte', enviadaEm: horas(-9), lida: false, link: '/obras/obra-001/nao-conformidades', obraId: OBRA_PRINCIPAL, whatsapp: '🚨 *ObraCheck — NC Crítica*\n\n*Obra:* Residencial Vista Verde\n*Unidade:* A-104 — Banheiro social\n*Norma:* NBR 15575-6 (estanqueidade)\n\nInfiltração ativa detectada na vistoria de hoje. Prazo de correção: 24 h.\n\nAbrir NC-2026-042 no app 👉' },
  { id: 'ntf-002', tipo: 'critica', canal: 'whatsapp', titulo: 'Fissura em alvenaria — A-201', mensagem: 'Fissura de 1,2 mm na interface alvenaria/pilar. Severidade alta, prazo de 48 h para tratativa.', destinatario: 'Rafael Nogueira', enviadaEm: horas(-3), lida: false, link: '/obras/obra-001/vistoria/vst-001', obraId: OBRA_PRINCIPAL, whatsapp: '⚠️ *ObraCheck — Nova NC*\n\n*Unidade:* A-201 — Dormitório 1\n*Elemento:* Alvenaria de vedação\n*Norma:* NBR 15575-4\n\nFissura de 1,2 mm mapeada na interface com o pilar P12.\n\n*Ação:* abrir em V, aplicar tela e refazer o acabamento.\n*Prazo:* 48 h' },
  { id: 'ntf-003', tipo: 'info', canal: 'in_app', titulo: 'Teste acústico ACU-02 aprovado', mensagem: 'Ruído de impacto medido em 62 dB. Nível Intermediário atingido conforme NBR 15575-3.', destinatario: 'Carlos Silva', enviadaEm: dias(-12), lida: true, link: '/obras/obra-001/testes/tst-002', obraId: OBRA_PRINCIPAL },
  { id: 'ntf-004', tipo: 'alerta', canal: 'email', titulo: 'Prazo de NC-2026-034 vence em 36 h', mensagem: 'A não conformidade do rufo metálico na B-405 tem prazo de correção vencendo em 36 horas.', destinatario: 'Rafael Nogueira', enviadaEm: horas(-12), lida: false, link: '/obras/obra-001/nao-conformidades', obraId: OBRA_PRINCIPAL },
  { id: 'ntf-005', tipo: 'critica', canal: 'whatsapp', titulo: 'Reporte de operário — andaime sem guarda-corpo', mensagem: 'Mensagem recebida no WhatsApp do ObraCheck. Risco de queda de altura identificado.', destinatario: 'Carlos Silva', enviadaEm: dias(-10), lida: true, link: '/obras/obra-001/nao-conformidades', obraId: OBRA_PRINCIPAL, whatsapp: '🦺 *ObraCheck — Reporte de campo*\n\n*Quem reportou:* José Aparecido (pedreiro) via WhatsApp\n*Local:* Fachada Norte — 4º pavimento\n\n"Tem um pedaço do andaime sem o guarda-corpo aqui no quarto andar, está perigoso."\n\n*Classificação da IA:* risco crítico de queda de altura.\nEngenheiro responsável notificado.' },
  { id: 'ntf-006', tipo: 'alerta', canal: 'email', titulo: 'Teste TER-01 reprovado', mensagem: 'Transmitância térmica de 3,9 W/m²K excede o limite normativo de 3,7 W/m²K para a zona bioclimática 3.', destinatario: 'Carlos Silva', enviadaEm: dias(-7), lida: true, link: '/obras/obra-001/testes/tst-003', obraId: OBRA_PRINCIPAL },
  { id: 'ntf-007', tipo: 'info', canal: 'in_app', titulo: 'Relatório mensal PBQP-H gerado', mensagem: 'O relatório consolidado do mês está disponível para download e assinatura digital.', destinatario: 'Carlos Silva', enviadaEm: dias(-5), lida: true, link: '/relatorios/rel-2026-06', obraId: OBRA_PRINCIPAL },
  { id: 'ntf-008', tipo: 'alerta', canal: 'whatsapp', titulo: 'Ensaio de estanqueidade EST-02 reprovado', mensagem: 'Vazamento identificado com 41 h de ensaio, abaixo das 72 h exigidas pela norma.', destinatario: 'Marina Duarte', enviadaEm: dias(-9), lida: true, link: '/obras/obra-001/testes/tst-006', obraId: OBRA_PRINCIPAL, whatsapp: '💧 *ObraCheck — Ensaio reprovado*\n\n*Ensaio:* EST-02 — Estanqueidade de área molhada\n*Local:* A-104 — banheiro\n*Norma:* NBR 15575-3\n\nVazamento detectado às 41 h de ensaio (mínimo exigido: 72 h).\n\nNC-2026-042 aberta automaticamente.' },
  { id: 'ntf-009', tipo: 'info', canal: 'in_app', titulo: 'Checklist de alvenaria pré-preenchido pela IA', mensagem: '7 itens do checklist da unidade A-201 foram classificados automaticamente e aguardam sua confirmação.', destinatario: 'Carlos Silva', enviadaEm: horas(-3), lida: false, link: '/obras/obra-001/checklist/chk-001', obraId: OBRA_PRINCIPAL },
  { id: 'ntf-010', tipo: 'alerta', canal: 'email', titulo: 'NC-2026-028 sem movimentação há 5 dias', mensagem: 'A não conformidade de cobrimento de armadura na viga V7 continua em correção sem atualização de status.', destinatario: 'Carlos Silva', enviadaEm: dias(-2), lida: false, link: '/obras/obra-001/nao-conformidades', obraId: OBRA_PRINCIPAL },
  { id: 'ntf-011', tipo: 'critica', canal: 'whatsapp', titulo: 'Isolamento acústico abaixo do mínimo', mensagem: 'DnT,w de 42 dB entre A-301 e A-302, abaixo dos 45 dB exigidos pela NBR 15575-3.', destinatario: 'Marina Duarte', enviadaEm: dias(-4), lida: true, link: '/obras/obra-001/testes/tst-001', obraId: OBRA_PRINCIPAL, whatsapp: '🔇 *ObraCheck — Desempenho abaixo do mínimo*\n\n*Ensaio:* ACU-01 — Ruído aéreo entre unidades\n*Medido:* 42 dB | *Mínimo NBR:* 45 dB\n\nA parede geminada entre A-301 e A-302 não atinge o nível Mínimo da NBR 15575-3.\n\n*Ação sugerida:* revisar o preenchimento das juntas e reensaiar.' },
  { id: 'ntf-012', tipo: 'info', canal: 'in_app', titulo: 'Vistoria concluída sem não conformidades', mensagem: 'Revestimento cerâmico da B-302 aprovado em todos os 6 itens do checklist.', destinatario: 'Carlos Silva', enviadaEm: horas(-26), lida: true, link: '/obras/obra-001/vistoria/vst-003', obraId: OBRA_PRINCIPAL },
]

/* -------------------------------------------------------------------- feed */

export const feed: AtividadeFeed[] = [
  { id: 'fd-1', tipo: 'vistoria', titulo: 'Vistoria em A-201 — Alvenaria de vedação', descricao: 'IA classificou a evidência como não conforme pela NBR 15575-4.', autor: 'Carlos Silva', quando: horas(-3), link: '/obras/obra-001/vistoria/vst-001', conformidade: 'nao_conforme' },
  { id: 'fd-2', tipo: 'nc', titulo: 'NC-2026-042 aberta em A-104', descricao: 'Infiltração no teto do banheiro social, severidade crítica.', autor: 'Marina Duarte', quando: horas(-9), link: '/obras/obra-001/nao-conformidades', conformidade: 'nao_conforme' },
  { id: 'fd-3', tipo: 'vistoria', titulo: 'Vistoria em B-302 — Revestimento cerâmico', descricao: 'Todos os itens do checklist aprovados, nível Intermediário.', autor: 'Carlos Silva', quando: horas(-26), link: '/obras/obra-001/vistoria/vst-003', conformidade: 'conforme' },
  { id: 'fd-4', tipo: 'reporte', titulo: 'Reporte de operário pelo WhatsApp', descricao: 'Vazamento em registro de gaveta no banheiro da B-202.', autor: 'José Aparecido', quando: dias(-3), link: '/obras/obra-001/nao-conformidades' },
  { id: 'fd-5', tipo: 'teste', titulo: 'Ensaio ACU-01 pronto para execução', descricao: 'Isolamento de ruído aéreo entre A-301 e A-302 aguardando o engenheiro.', autor: 'Marina Duarte', quando: dias(-4), link: '/obras/obra-001/testes/tst-001' },
  { id: 'fd-6', tipo: 'teste', titulo: 'Ensaio TER-01 reprovado', descricao: 'Transmitância de 3,9 W/m²K acima do limite normativo.', autor: 'Carlos Silva', quando: dias(-7), link: '/obras/obra-001/testes/tst-003', conformidade: 'nao_conforme' },
  { id: 'fd-7', tipo: 'relatorio', titulo: 'Relatório consolidado emitido', descricao: 'PBQP-H e NBR 15575 reunidos em documento único.', autor: 'Carlos Silva', quando: dias(-5), link: '/relatorios/rel-2026-06' },
  { id: 'fd-8', tipo: 'teste', titulo: 'Ensaio ETR-01 aprovado no nível Superior', descricao: 'Parede resistiu a impacto de corpo mole de 480 J sem danos.', autor: 'Carlos Silva', quando: dias(-21), link: '/obras/obra-001/testes/tst-007', conformidade: 'conforme' },
]

/* -------------------------------------------------------------- agregações */

export const conformidadePorCategoria = [
  { categoria: 'Térmico', conforme: 62, naoConforme: 24, analise: 14 },
  { categoria: 'Acústico', conforme: 71, naoConforme: 19, analise: 10 },
  { categoria: 'Estanqueidade', conforme: 68, naoConforme: 26, analise: 6 },
  { categoria: 'Estrutural', conforme: 94, naoConforme: 3, analise: 3 },
]

export const evolucaoConformidade = [
  { mes: 'Jan', conformidade: 71, meta: 85 },
  { mes: 'Fev', conformidade: 74, meta: 85 },
  { mes: 'Mar', conformidade: 73, meta: 85 },
  { mes: 'Abr', conformidade: 79, meta: 85 },
  { mes: 'Mai', conformidade: 83, meta: 85 },
  { mes: 'Jun', conformidade: 87, meta: 85 },
]

/* --------------------------------------------------------------- seletores */

export const getObra = (id?: string) => obras.find((o) => o.id === id)
export const getVistoria = (id?: string) => vistorias.find((v) => v.id === id)
export const getTeste = (id?: string) => testes.find((t) => t.id === id)
export const getChecklist = (id?: string) => checklists.find((c) => c.id === id)
export const getUnidadesDaObra = (obraId: string) => unidades.filter((u) => u.obraId === obraId)
export const getVistoriasDaObra = (obraId: string) => vistorias.filter((v) => v.obraId === obraId)
export const getNCsDaObra = (obraId: string) => naoConformidades.filter((n) => n.obraId === obraId)
export const getTestesDaObra = (obraId: string) => testes.filter((t) => t.obraId === obraId)
export const getObraPorCodigo = (codigo: string) =>
  obras.find((o) => o.codigo.toLowerCase() === codigo.toLowerCase())

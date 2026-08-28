import type { EnvioOperario } from '@/types'
import { fotos } from './photos'
import { OBRA_PRINCIPAL } from './data'

const horas = (n: number) => {
  const d = new Date()
  d.setHours(d.getHours() + n)
  return d.toISOString()
}

/** Número do ObraCheck que os operários salvam na agenda. */
export const NUMERO_WHATSAPP = '+55 35 3471-8800'

/**
 * Fila de mensagens recebidas no WhatsApp do ObraCheck. O operário não tem
 * tela na plataforma: ele manda foto, áudio ou texto pela conversa, e a
 * mensagem cai aqui para o engenheiro validar.
 */
export const enviosSeed: EnvioOperario[] = [
  {
    id: 'env-001',
    tipo: 'problema',
    autor: 'José Aparecido',
    funcao: 'Pedreiro',
    telefone: '+55 35 99162-4408',
    obraId: OBRA_PRINCIPAL,
    obraNome: 'Residencial Vista Verde',
    unidadeLabel: 'B-202',
    foto: fotos.impermeabilizacao,
    transcricao:
      'Aqui no banheiro do duzentos e dois o registro tá vazando, pinga sem parar. Já falei com o encarregado mas continua igual.',
    duracaoSeg: 14,
    comentario: 'Vazamento no registro de gaveta',
    enviadoEm: horas(-2),
    status: 'pendente',
  },
  {
    id: 'env-002',
    tipo: 'etapa',
    autor: 'João Pereira',
    funcao: 'Pedreiro',
    telefone: '+55 35 99418-7702',
    obraId: OBRA_PRINCIPAL,
    obraNome: 'Residencial Vista Verde',
    servico: 'Alvenaria de vedação',
    unidadeLabel: 'A-302',
    foto: fotos.laje,
    comentario: 'Terminei a última fiada hoje de manhã, já com a tela na amarração.',
    enviadoEm: horas(-2),
    status: 'pendente',
  },
  {
    id: 'env-003',
    tipo: 'problema',
    autor: 'Sebastião Lima',
    funcao: 'Servente',
    telefone: '+55 35 99730-1155',
    obraId: OBRA_PRINCIPAL,
    obraNome: 'Residencial Vista Verde',
    unidadeLabel: 'Fachada Norte',
    foto: fotos.fachada,
    comentario: 'Sobrou material solto na borda da laje, pode cair na rua.',
    enviadoEm: horas(-6),
    status: 'pendente',
  },
  {
    id: 'env-004',
    tipo: 'etapa',
    autor: 'João Pereira',
    funcao: 'Pedreiro',
    telefone: '+55 35 99418-7702',
    obraId: OBRA_PRINCIPAL,
    obraNome: 'Residencial Vista Verde',
    servico: 'Contrapiso',
    unidadeLabel: 'A-205',
    foto: fotos.ceramica,
    enviadoEm: horas(-50),
    status: 'validado',
  },
  {
    id: 'env-005',
    tipo: 'problema',
    autor: 'João Pereira',
    funcao: 'Pedreiro',
    telefone: '+55 35 99418-7702',
    obraId: OBRA_PRINCIPAL,
    obraNome: 'Residencial Vista Verde',
    unidadeLabel: 'A-201',
    foto: fotos.fissura,
    comentario: 'Trinca na parede do quarto, achei melhor avisar antes de rebocar.',
    enviadoEm: horas(-26),
    status: 'validado',
    ncGerada: 'NC-2026-041',
  },
]

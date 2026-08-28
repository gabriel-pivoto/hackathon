/**
 * Banco de imagens mockadas. Todas apontam para o Unsplash; o componente
 * <SmartImage /> troca por um placeholder tecnico caso a rede falhe no pitch.
 */
const U = (id: string, w = 800) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

export const fotos = {
  obraVistaVerde: U('photo-1541888946425-d81bb19240f5', 1200),
  obraParqueDasAcacias: U('photo-1503387762-592deb58ef4e', 1200),
  obraHorizonteSul: U('photo-1486406146926-c627a92ad1ab', 1200),
  obraNucleoTech: U('photo-1487958449943-2429e8be8625', 1200),

  fissura: U('photo-1585128792020-803d29415281'),
  infiltracao: U('photo-1600585154340-be6161a56a0c'),
  ceramica: U('photo-1600566753190-17f0baa2a6c3'),
  eletrica: U('photo-1621905251189-08b45d6a269e'),
  reboco: U('photo-1581094794329-c8112a89af12'),
  estrutura: U('photo-1504307651254-35680f356dfd'),
  fachada: U('photo-1517581177682-a085bb7ffb15'),
  impermeabilizacao: U('photo-1558618666-fcd25c85cd64'),
  esquadria: U('photo-1523413651479-597eb2da0ad6'),
  laje: U('photo-1604709177225-055f99402ea3'),
  ensaioAcustico: U('photo-1516156008625-3a9d6067fab5'),
  ensaioTermico: U('photo-1497440001374-f26997328c1b'),
  planta: U('photo-1503387762-592deb58ef4e'),
  mapa: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80',
} as const

export type FotoKey = keyof typeof fotos

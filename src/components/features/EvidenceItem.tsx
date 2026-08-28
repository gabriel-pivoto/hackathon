import { useState } from 'react'
import { Camera, MapPin, Mic, Play, Clock, User } from 'lucide-react'
import type { Evidencia } from '@/types'
import { SmartImage } from '@/components/shared/SmartImage'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { NormaChip } from '@/components/shared/NormaChip'
import { AudioWaveform } from './AudioWaveform'
import { AIAnalysisCard } from './AIAnalysisCard'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatDateTime } from '@/lib/utils'

interface Props {
  evidencia: Evidencia
}

/** Foto ou audio com os metadados de rastreabilidade. */
export function EvidenceItem({ evidencia }: Props) {
  const [aberto, setAberto] = useState(false)
  const ehFoto = evidencia.tipo === 'foto'

  return (
    <>
      <div className="tech-card overflow-hidden">
        <div className="flex flex-col gap-4 p-4 sm:flex-row">
          {ehFoto ? (
            <button
              onClick={() => setAberto(true)}
              className="group relative h-36 w-full shrink-0 overflow-hidden rounded-md border sm:w-52"
            >
              <SmartImage
                src={evidencia.url}
                alt={evidencia.legenda}
                className="size-full transition-transform duration-500 group-hover:scale-105"
                wrapperClassName="size-full"
              />
              <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded bg-navy-900/80 px-1.5 py-0.5 font-mono text-[10px] text-slate-200 backdrop-blur">
                <Camera className="size-3" /> foto
              </span>
            </button>
          ) : (
            <div className="flex h-36 w-full shrink-0 flex-col justify-center gap-3 rounded-md border bg-surface-2/40 p-4 sm:w-52">
              <span className="inline-flex items-center gap-1.5 label-sm">
                <Mic className="size-3" /> áudio · {evidencia.duracaoSeg}s
              </span>
              <AudioWaveform barras={28} />
              <button
                onClick={() => setAberto(true)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
              >
                <Play className="size-3" /> ver transcrição
              </button>
            </div>
          )}

          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="font-semibold tracking-tight">{evidencia.legenda}</p>
              {evidencia.analise && <StatusBadge status={evidencia.analise.conformidade} size="sm" />}
            </div>

            {evidencia.transcricao && (
              <p className="line-clamp-2 text-sm italic text-muted-foreground">
                "{evidencia.transcricao}"
              </p>
            )}

            {evidencia.analise && (
              <div className="flex flex-wrap items-center gap-2">
                <NormaChip codigo={evidencia.analise.norma} />
                <span className="font-mono text-[11px] text-muted-foreground">
                  confiança {evidencia.analise.confianca}%
                </span>
              </div>
            )}

            <dl className="grid grid-cols-1 gap-x-6 gap-y-1 font-mono text-[11px] text-muted-foreground sm:grid-cols-2">
              <div className="flex items-center gap-1.5">
                <Clock className="size-3 shrink-0" />
                {formatDateTime(evidencia.timestamp)}
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="size-3 shrink-0" />
                {evidencia.geo}
              </div>
              <div className="flex items-center gap-1.5">
                <User className="size-3 shrink-0" />
                {evidencia.autor}
              </div>
              <div className="truncate">id {evidencia.id}</div>
            </dl>
          </div>
        </div>
      </div>

      <Dialog open={aberto} onOpenChange={setAberto}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{evidencia.legenda}</DialogTitle>
          </DialogHeader>

          {ehFoto ? (
            <SmartImage
              src={evidencia.url}
              alt={evidencia.legenda}
              className="max-h-[45vh] w-full rounded-md border object-cover"
              wrapperClassName="h-64 w-full rounded-md border"
            />
          ) : (
            <div className="rounded-md border bg-surface-2/40 p-4">
              <AudioWaveform barras={64} />
              <p className="mt-4 text-sm italic leading-relaxed">"{evidencia.transcricao}"</p>
            </div>
          )}

          {evidencia.analise && <AIAnalysisCard analise={evidencia.analise} />}

          <div className="rounded-md border border-dashed p-4">
            <p className="mb-2 label-sm">
              rastreabilidade
            </p>
            <div className="grid gap-1 font-mono text-[11px] text-muted-foreground sm:grid-cols-2">
              <span>timestamp: {formatDateTime(evidencia.timestamp)}</span>
              <span>geo: {evidencia.geo}</span>
              <span>autor: {evidencia.autor}</span>
              <span>hash: sha256:{evidencia.id.replace(/-/g, '').padEnd(16, '0').slice(0, 16)}…</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Activity } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  /** Roda a animacao enquanto true. */
  ativo: boolean
  /** Valor em dB no qual a leitura estabiliza ao final. */
  valorFinal: number
  duracaoMs?: number
  onFim?: (valor: number) => void
  className?: string
}

const BANDAS = ['125', '250', '500', '1k', '2k', '4k']

/**
 * Sonometro simulado: barra de nivel animada, leitura em dB e espectro por banda.
 * A medicao e puramente visual, o valor final vem do cenario mockado.
 */
export function SoundMeter({ ativo, valorFinal, duracaoMs = 5000, onFim, className }: Props) {
  const [nivel, setNivel] = useState(0)
  const [pico, setPico] = useState(0)
  const [bandas, setBandas] = useState<number[]>(() => BANDAS.map(() => 0))
  const [decorrido, setDecorrido] = useState(0)
  const rafRef = useRef<number>()
  const fimRef = useRef(onFim)
  fimRef.current = onFim

  useEffect(() => {
    if (!ativo) return

    const inicio = performance.now()
    let ultimoPico = 0

    const passo = (agora: number) => {
      const t = Math.min(1, (agora - inicio) / duracaoMs)
      setDecorrido((agora - inicio) / 1000)

      // Converge do ruido inicial para o valor final, com jitter decrescente.
      const jitter = (1 - t) * 14
      const base = valorFinal * (0.55 + 0.45 * t)
      const leitura = Math.max(0, base + (Math.random() - 0.5) * jitter)

      setNivel(leitura)
      ultimoPico = Math.max(ultimoPico, leitura)
      setPico(ultimoPico)
      setBandas(BANDAS.map((_, i) => leitura * (0.62 + 0.38 * Math.sin(i * 1.3 + agora / 260)) ))

      if (t < 1) {
        rafRef.current = requestAnimationFrame(passo)
      } else {
        setNivel(valorFinal)
        setBandas(BANDAS.map((_, i) => valorFinal * (0.7 + 0.25 * Math.sin(i * 1.3))))
        fimRef.current?.(valorFinal)
      }
    }

    rafRef.current = requestAnimationFrame(passo)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [ativo, valorFinal, duracaoMs])

  const escala = (v: number) => Math.max(0, Math.min(100, (v / 90) * 100))

  return (
    <div className={cn('rounded-lg border bg-navy-900 p-5 text-slate-100', className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'size-2 rounded-full',
              ativo ? 'animate-pulse-ring bg-red-500' : 'bg-slate-600',
            )}
          />
          <span className="font-mono text-[11px] uppercase tracking-widest text-slate-400">
            {ativo ? 'medindo' : nivel > 0 ? 'medição concluída' : 'sonômetro classe 1'}
          </span>
        </div>
        <span className="font-mono text-[11px] text-slate-500">
          {decorrido.toFixed(1)} s
        </span>
      </div>

      <div className="mt-5 flex items-end justify-between gap-6">
        <div className="flex items-baseline gap-2">
          <motion.span
            key={Math.round(nivel * 10)}
            className="font-mono text-6xl font-bold tabular-nums tracking-tighter text-emerald-400"
          >
            {nivel.toFixed(1)}
          </motion.span>
          <span className="font-mono text-xl text-slate-500">dB</span>
        </div>
        <div className="text-right">
          <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">pico</p>
          <p className="font-mono text-lg font-semibold tabular-nums text-slate-300">
            {pico.toFixed(1)}
          </p>
        </div>
      </div>

      {/* Barra de nivel principal */}
      <div className="relative mt-5 h-3 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-amber-500 transition-[width] duration-75"
          style={{ width: `${escala(nivel)}%` }}
        />
        <div
          className="absolute top-0 h-full w-0.5 bg-slate-100/70 transition-[left] duration-300"
          style={{ left: `${escala(pico)}%` }}
        />
      </div>
      <div className="mt-1.5 flex justify-between font-mono text-[10px] text-slate-600">
        <span>0</span>
        <span>30</span>
        <span>60</span>
        <span>90 dB</span>
      </div>

      {/* Espectro por banda de terco de oitava */}
      <div className="mt-6">
        <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-slate-500">
          <Activity className="size-3" />
          espectro por banda (Hz)
        </div>
        <div className="mt-3 flex h-24 items-end gap-2">
          {bandas.map((v, i) => (
            <div key={BANDAS[i]} className="flex flex-1 flex-col items-center gap-1.5">
              <div className="flex h-20 w-full items-end rounded-sm bg-slate-800/60">
                <div
                  className="w-full rounded-sm bg-emerald-400/80 transition-[height] duration-100"
                  style={{ height: `${escala(v)}%` }}
                />
              </div>
              <span className="font-mono text-[9px] text-slate-600">{BANDAS[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

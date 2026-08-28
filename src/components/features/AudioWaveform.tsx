import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface Props {
  ativo?: boolean
  barras?: number
  className?: string
  cor?: string
}

/** Onda de audio decorativa. Anima enquanto `ativo`, congela num padrao estavel depois. */
export function AudioWaveform({ ativo = false, barras = 44, className, cor }: Props) {
  const [alturas, setAlturas] = useState<number[]>(() =>
    Array.from({ length: barras }, (_, i) => 25 + Math.abs(Math.sin(i * 0.7)) * 55),
  )

  useEffect(() => {
    if (!ativo) return
    const id = setInterval(() => {
      setAlturas(Array.from({ length: barras }, () => 12 + Math.random() * 88))
    }, 110)
    return () => clearInterval(id)
  }, [ativo, barras])

  return (
    <div className={cn('flex h-10 items-center gap-[3px]', className)}>
      {alturas.map((h, i) => (
        <span
          key={i}
          className={cn('flex-1 rounded-full transition-[height] duration-100', cor ?? 'bg-emerald-400/70')}
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  )
}

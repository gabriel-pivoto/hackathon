import { useState } from 'react'
import { ImageOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  src?: string
  alt: string
  className?: string
  wrapperClassName?: string
}

/**
 * Imagem com fallback grafico. Se a foto nao carregar durante o pitch, o lugar
 * dela vira uma placa tecnica em vez de um icone quebrado.
 *
 * A legenda do fallback so aparece quando ha espaco (ver .img-fallback no
 * index.css): em miniatura, um titulo longo quebrava em varias linhas e ficava
 * pior do que a ausencia da foto.
 */
export function SmartImage({ src, alt, className, wrapperClassName }: Props) {
  const [falhou, setFalhou] = useState(!src)

  if (falhou) {
    return (
      <div
        className={cn(
          'img-fallback relative flex items-center justify-center overflow-hidden bg-surface-2 blueprint-grid',
          wrapperClassName,
          className,
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 via-transparent to-blue-400/5" />
        <ImageOff className="img-fallback-icone relative size-4 text-muted-foreground/50" />
        <span className="img-fallback-texto relative px-3 text-center text-[11px] leading-snug text-muted-foreground">
          {alt}
        </span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFalhou(true)}
      className={cn('object-cover', className)}
    />
  )
}

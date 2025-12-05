// src/components/LottieAvatar.tsx
'use client'

import React, { useEffect, useState } from 'react'
import Lottie from 'lottie-react'

type Props = {
  /** URL del .json (por ejemplo: /avatars/lottie/avatar1.json) */
  src: string
  size?: number
  loop?: boolean
  autoplay?: boolean
  className?: string
}

export default function LottieAvatar({
  src,
  size = 80,
  loop = true,
  autoplay = true,
  className = '',
}: Props) {
  const [data, setData] = useState<any | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    setData(null)
    setError(false)

    // Carga el JSON desde /public (no uses require con "@/public")
    fetch(src)
      .then((r) => {
        if (!r.ok) throw new Error('No se pudo cargar la animación')
        return r.json()
      })
      .then((json) => {
        if (!cancelled) setData(json)
      })
      .catch(() => !cancelled && setError(true))

    return () => {
      cancelled = true
    }
  }, [src])

  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded-full overflow-hidden ring-2 ring-primary/20 flex items-center justify-center bg-background ${className}`}
      aria-label="Avatar animado"
    >
      {data && !error ? (
        <Lottie animationData={data} loop={loop} autoplay={autoplay} style={{ width: '100%', height: '100%' }} />
      ) : (
        // Fallback/skeleton mientras carga o si falla
        <div className="w-full h-full animate-pulse" />
      )}
    </div>
  )
}

// src/components/Spotlight.tsx
'use client'

import { useEffect, useRef } from 'react'

export default function Spotlight() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // ✅ Desactivar en móviles/tablets (no mouse real + rendimiento)
    const isCoarsePointer =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(pointer: coarse)').matches

    if (isCoarsePointer) return

    let raf = 0
    let latestX = 0
    let latestY = 0

    const update = () => {
      raf = 0
      // ✅ Variables CSS (evita reescribir background completo cada vez)
      el.style.setProperty('--sx', `${latestX}px`)
      el.style.setProperty('--sy', `${latestY}px`)
    }

    const onMove = (e: MouseEvent) => {
      latestX = e.clientX
      latestY = e.clientY
      if (raf) return
      raf = window.requestAnimationFrame(update)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 -z-10"
      style={{
        background:
          'radial-gradient(220px 220px at var(--sx, 50%) var(--sy, 50%), rgba(255,255,255,0.12), transparent 60%)',
      }}
    />
  )
}

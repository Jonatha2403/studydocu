'use client'

import * as React from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Lottie from 'lottie-react'
import trophyAnimation from '@/assets/animations/trophy.json'
import { X } from 'lucide-react'

type Position =
  | 'bottom-right'
  | 'bottom-left'
  | 'top-right'
  | 'top-left'
  | 'top-center'
  | 'bottom-center'

interface Props {
  /** Nombre del logro (texto principal grande) */
  logro: string
  /** Control externo de visibilidad */
  visible: boolean
  /** Cierra el aviso */
  onClose: () => void
  /** Duración en ms hasta autocerrar (default 4000) */
  duration?: number
  /** Posición en la pantalla */
  position?: Position
  /** Título chico encima del logro */
  title?: string
  /** Mensaje auxiliar (bajo el logro) */
  message?: string
  /** Muestra confetti (usa import dinámico) */
  withConfetti?: boolean
  /** Reproducir sonido (importa y reproduce un .mp3/.wav) */
  soundUrl?: string
  /** Forzar silencio (prioriza sobre soundUrl) */
  mute?: boolean
  /** Callback del botón de acción (ej. “Ver logros”) */
  onAction?: () => void
  /** Texto del botón de acción */
  actionLabel?: string
  /** Si hay muchos toasts, z-index se puede ajustar */
  zIndex?: number
}

export default function LogroDesbloqueado({
  logro,
  visible,
  onClose,
  duration = 4000,
  position = 'bottom-right',
  title = '¡Logro desbloqueado!',
  message,
  withConfetti = true,
  soundUrl,
  mute = false,
  onAction,
  actionLabel = 'Ver logros',
  zIndex = 9999,
}: Props) {
  const [mounted, setMounted] = useState(false)
  const [show, setShow] = useState(visible)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Respeta reduce-motion
  const reducedMotion = usePrefersReducedMotion()

  // Clases según posición
  const posClass = useMemo(() => {
    const base = 'fixed p-0 m-0'
    const map: Record<Position, string> = {
      'bottom-right': 'bottom-6 right-6',
      'bottom-left': 'bottom-6 left-6',
      'top-right': 'top-6 right-6',
      'top-left': 'top-6 left-6',
      'top-center': 'top-6 left-1/2 -translate-x-1/2',
      'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2',
    }
    return `${base} ${map[position]}`
  }, [position])

  useEffect(() => {
    setMounted(true)
  }, [])

  // Sincroniza show con visible + temporizador de autocierre
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined
    if (visible) {
      setShow(true)
      if (withConfetti && !reducedMotion) triggerConfetti()
      if (!mute && soundUrl) playSound(soundUrl)
      if (duration > 0) {
        timer = setTimeout(() => {
          setShow(false)
          onClose()
        }, duration)
      }
    }
    return () => {
      if (timer) clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, duration, withConfetti, reducedMotion, mute, soundUrl])

  // Cerrar con Escape
  useEffect(() => {
    if (!show) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShow(false)
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [show, onClose])

  const handleAction = () => {
    onAction?.()
    setShow(false)
    onClose()
  }

  const content = (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: position.startsWith('top') ? -30 : 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: position.startsWith('top') ? -20 : 20, scale: 0.98 }}
          transition={{ duration: reducedMotion ? 0 : 0.28, ease: 'easeOut' }}
          className={posClass}
          style={{ zIndex }}
          role="status"
          aria-live="polite"
        >
          {/* Glow de fondo */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 blur-2xl rounded-3xl bg-gradient-to-r from-yellow-300/20 to-indigo-400/20" />
          </div>

          <div className="w-[340px] max-w-[92vw] rounded-2xl border bg-white/90 dark:bg-gray-900/90 backdrop-blur-md
                          border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden">
            {/* Header con botón cerrar */}
            <div className="flex items-center justify-between px-5 pt-4">
              <p className="text-xs font-medium text-muted-foreground">{title}</p>
              <button
                onClick={() => {
                  setShow(false)
                  onClose()
                }}
                aria-label="Cerrar notificación de logro"
                className="rounded-md p-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            {/* Cuerpo */}
            <div className="px-5 pb-4 pt-2">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 shrink-0">
                  <Lottie
                    animationData={trophyAnimation}
                    loop={false}
                    autoplay
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-lg font-semibold text-primary truncate">{logro}</p>
                  {message ? (
                    <p className="text-sm text-muted-foreground mt-0.5">{message}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground mt-0.5">
                      ¡Sigue acumulando insignias en StudyDocu! ✨
                    </p>
                  )}
                </div>
              </div>

              {/* Acciones */}
              <div className="mt-4 flex items-center justify-end gap-2">
                <button
                  onClick={() => {
                    // compartir o copiar
                    const url = typeof window !== 'undefined' ? window.location.href : ''
                    if (navigator.share) {
                      navigator.share({
                        title: 'Logro desbloqueado',
                        text: logro,
                        url,
                      }).catch(() => {})
                    } else {
                      navigator.clipboard?.writeText(url).then(() => {}).catch(() => {})
                    }
                  }}
                  className="text-xs rounded-md px-3 py-1.5 border bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800
                             border-gray-200 dark:border-gray-700 text-muted-foreground transition-colors"
                >
                  Compartir
                </button>

                {onAction && (
                  <button
                    onClick={handleAction}
                    className="text-xs rounded-md px-3 py-1.5 bg-primary text-primary-foreground shadow hover:opacity-95 transition-opacity"
                  >
                    {actionLabel}
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  // Portal para evitar stacking/contextos del layout
  if (!mounted) return null
  return createPortal(content, document.body)

  // Helpers
  async function triggerConfetti() {
    try {
      const confetti = (await import('canvas-confetti')).default
      confetti({
        particleCount: 90,
        spread: 70,
        origin: position.includes('top') ? { y: 0.12 } : { y: 0.88 },
        scalar: 0.9,
        disableForReducedMotion: reducedMotion,
      })
    } catch {
      // si no está disponible, seguimos sin confetti
    }
  }

  async function playSound(src: string) {
    try {
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        await audioRef.current.play()
        return
      }
      const audio = new Audio(src)
      audioRef.current = audio
      await audio.play()
    } catch {
      // usuario bloqueó autoplay o error de carga: ignorar
    }
  }
}

/** Hook: respeta prefers-reduced-motion */
function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const set = () => setPrefersReducedMotion(mediaQuery.matches)
    set()
    mediaQuery.addEventListener?.('change', set)
    return () => mediaQuery.removeEventListener?.('change', set)
  }, [])
  return prefersReducedMotion
}

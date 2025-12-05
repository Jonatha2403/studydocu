'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import Typed from 'typed.js'
import Lottie from 'lottie-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { toast } from 'sonner'
import { Sparkles, ChevronsDown, Shuffle } from 'lucide-react'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadBasic } from '@tsparticles/basic'
import type { Container } from '@tsparticles/engine'

import anim1 from '@/assets/animations/Animation - 1749589272445.json'
import anim2 from '@/assets/animations/Animation - 1749589955890.json'
import anim3 from '@/assets/animations/Animation - 1749590253588.json'

const animations = [anim1, anim2, anim3] as const

export default function HeroAI() {
  const titleRef = useRef<HTMLSpanElement | null>(null)
  const subtextRef = useRef<HTMLSpanElement | null>(null)
  const titleTypedRef = useRef<Typed | null>(null)
  const subTypedRef = useRef<Typed | null>(null)
  const [animIndex, setAnimIndex] = useState(0)
  const [isHover, setIsHover] = useState(false)

  const [engineReady, setEngineReady] = useState(false)

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadBasic(engine)
    }).then(() => setEngineReady(true))
  }, [])

  const particlesLoaded = useCallback(async (_container?: Container) => {
    // opcional
  }, [])

  useEffect(() => {
    const saved =
      typeof window !== 'undefined' ? localStorage.getItem('hero_anim_index') : null
    if (saved) setAnimIndex(Math.min(animations.length - 1, Math.max(0, Number(saved))))
  }, [])

  useEffect(() => {
    const options = {
      typeSpeed: 40,
      backSpeed: 20,
      backDelay: 2000,
      loop: true,
      showCursor: true,
      cursorChar: '|',
    }

    titleTypedRef.current?.destroy()
    subTypedRef.current?.destroy()

    if (titleRef.current) {
      titleTypedRef.current = new Typed(titleRef.current, {
        ...options,
        strings: [
          'Sube tus apuntes fácilmente',
          'Potencia tu día al máximo',
          'Ayuda a otros estudiantes',
        ],
      })
    }

    if (subtextRef.current) {
      subTypedRef.current = new Typed(subtextRef.current, {
        ...options,
        strings: [
          'Organiza tu universidad',
          'Comparte con tu comunidad',
          'Potencia tu productividad',
        ],
      })
    }

    return () => {
      titleTypedRef.current?.destroy()
      subTypedRef.current?.destroy()
    }
  }, [])

  useEffect(() => {
    if (isHover) return
    const id = setInterval(
      () => setAnimIndex((p) => (p + 1) % animations.length),
      8000
    )
    return () => clearInterval(id)
  }, [isHover])

  const handleNextAnimation = () => {
    setAnimIndex((prev) => {
      const next = (prev + 1) % animations.length
      if (typeof window !== 'undefined')
        localStorage.setItem('hero_anim_index', String(next))
      return next
    })
    toast.success('✨ Animación actualizada')
  }

  const handleGoto = (idx: number) => {
    setAnimIndex(idx)
    if (typeof window !== 'undefined')
      localStorage.setItem('hero_anim_index', String(idx))
    toast.message('Animación seleccionada', {
      description: `Mostrando animación #${idx + 1}`,
    })
  }

  return (
    <section className="relative overflow-hidden min-h-screen -mt-10 flex flex-col items-center justify-center px-4">
      {/* Partículas */}
      {engineReady && (
        <Particles
          id="tsparticles"
          className="absolute inset-0 -z-10"
          particlesLoaded={particlesLoaded}
          options={{
            fullScreen: { enable: false },
            background: { color: { value: 'transparent' } },
            fpsLimit: 60,
            particles: {
              number: { value: 30, density: { enable: true, width: 800, height: 800 } },
              size: { value: 2 },
              move: { enable: true, speed: 0.6 },
              opacity: { value: 0.4 },
              color: { value: '#a855f7' },
              links: {
                enable: true,
                distance: 120,
                color: '#a855f7',
                opacity: 0.3,
                width: 1,
              },
            },
          }}
        />
      )}

      {/* Fondos decorativos */}
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_at_top,rgba(99,102,241,0.12),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(168,85,247,0.10),transparent_60%)]" />
      <div className="pointer-events-none absolute -top-32 -right-32 h-72 w-72 rounded-full blur-3xl opacity-30 bg-indigo-400" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 rounded-full blur-3xl opacity-30 bg-fuchsia-400" />

      {/* Contenido */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl flex flex-col items-center"
      >
        <h1 className="mt-6 text-center text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-pink-500 drop-shadow-[0_0_20px_rgba(168,85,247,0.25)]">
            <span ref={titleRef} />
          </span>
        </h1>

        <p className="mt-6 text-center text-lg sm:text-xl text-gray-600 dark:text-gray-300">
          <span ref={subtextRef} />
        </p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-4 text-sm text-primary flex items-center gap-2"
        >
          <Sparkles className="h-4 w-4" /> Inspira. Comparte. Aprende.
        </motion.div>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {/* 🔁 AQUÍ EL CAMBIO: /registrarse */}
          <Button
            asChild
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold px-6 py-3 rounded-full shadow-md hover:scale-105 transition"
          >
            <Link href="/registrarse">🚀 Empezar gratis</Link>
          </Button>

          <Button asChild variant="outline" className="px-6 py-3 rounded-full">
            <Link href="/explorar">Explorar documentos</Link>
          </Button>
        </div>

        {/* Animación */}
        <div className="mt-12 w-full max-w-md">
          <motion.div
            className="relative p-[2px] rounded-3xl bg-gradient-to-r from-indigo-400/60 via-fuchsia-400/60 to-pink-400/60 shadow-[0_1px_40px_rgba(99,102,241,0.15)]"
            whileHover={{ scale: 1.01, rotateX: 2, rotateY: -2 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
          >
            <div
              className="relative rounded-3xl border border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-xl shadow-xl p-6"
              onMouseEnter={() => setIsHover(true)}
              onMouseLeave={() => setIsHover(false)}
            >
              <div className="w-full">
                <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] overflow-hidden rounded-2xl">
                  <motion.div
                    key={animIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="absolute inset-0 flex items-center justify-center"
                    aria-hidden
                  >
                    <Lottie
                      animationData={animations[animIndex]}
                      loop
                      className="h-full w-full"
                      rendererSettings={{ preserveAspectRatio: 'xMidYMid meet' }}
                    />
                  </motion.div>
                </div>
              </div>

              <div className="mt-6 flex flex-col items-center gap-4">
                <Button
                  onClick={handleNextAnimation}
                  className="group relative overflow-hidden rounded-full px-7 py-2 font-semibold shadow hover:shadow-lg transition bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white"
                >
                  <span className="absolute inset-0 translate-y-[120%] group-hover:translate-y-[-20%] transition-transform duration-700 bg-white/20" />
                  <Shuffle className="mr-2 h-4 w-4" /> Cambiar animación
                </Button>

                <div className="flex items-center gap-2">
                  {animations.map((_, idx) => (
                    <button
                      key={idx}
                      aria-label={`Ir a la animación ${idx + 1}`}
                      onClick={() => handleGoto(idx)}
                      className={`h-2.5 rounded-full transition-all ${
                        animIndex === idx
                          ? 'w-6 bg-gradient-to-r from-indigo-500 to-fuchsia-500'
                          : 'w-2.5 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          animate={{ opacity: [0, 1, 0], y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-10 text-gray-400 dark:text-gray-500"
        >
          <ChevronsDown size={28} />
        </motion.div>
      </motion.div>
    </section>
  )
}

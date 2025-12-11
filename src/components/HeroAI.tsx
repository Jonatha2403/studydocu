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

  // 🔆 Efecto de luz que sigue al mouse (estilo Apple Vision Pro)
  useEffect(() => {
    const el = document.getElementById('hero-light')
    if (!el) return

    const move = (e: MouseEvent) => {
      el.style.background = `
        radial-gradient(
          600px at ${e.clientX}px ${e.clientY}px,
          rgba(168,85,247,0.25),
          transparent 70%
        )
      `
    }

    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  // 🎇 Partículas de fondo
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadBasic(engine)
    }).then(() => setEngineReady(true))
  }, [])

  const particlesLoaded = useCallback(async (_container?: Container) => {
    // opcional
  }, [])

  // 💾 Recuperar animación elegida
  useEffect(() => {
    const saved =
      typeof window !== 'undefined' ? localStorage.getItem('hero_anim_index') : null
    if (saved) setAnimIndex(Math.min(animations.length - 1, Math.max(0, Number(saved))))
  }, [])

  // ⌨ Textos con Typed.js
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

  // 🔁 Rotación automática de animaciones
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
      {/* Capa de luz interactiva */}
      <div
        id="hero-light"
        className="pointer-events-none absolute inset-0 -z-20 transition-colors duration-300"
      />

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
              number: { value: 40, density: { enable: true, width: 800, height: 800 } },
              size: { value: 2 },
              move: { enable: true, speed: 0.7 },
              opacity: { value: 0.45 },
              color: { value: '#a855f7' },
              links: {
                enable: true,
                distance: 130,
                color: '#a855f7',
                opacity: 0.3,
                width: 1,
              },
            },
          }}
        />
      )}

      {/* Fondos gradiente suaves */}
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_at_top,rgba(99,102,241,0.18),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(236,72,153,0.16),transparent_60%)]" />
      <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full blur-3xl opacity-40 bg-indigo-400" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-80 w-80 rounded-full blur-3xl opacity-40 bg-fuchsia-400" />

      {/* Contenido principal */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="w-full max-w-6xl mx-auto flex flex-col gap-10 md:gap-14 lg:gap-16"
      >
        {/* Grid principal: texto + animación */}
        <div className="grid gap-10 md:grid-cols-[1.3fr,1.1fr] items-center">
          {/* Columna izquierda: textos y CTA */}
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 justify-center md:justify-start mb-4 px-3 py-1.5 rounded-full bg-white/70 dark:bg-white/5 border border-white/40 dark:border-white/10 shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4 text-purple-500" />
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-gray-700 dark:text-gray-200">
                StudyDocu · IA Académica
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-pink-500 drop-shadow-[0_0_30px_rgba(168,85,247,0.35)]">
                <span ref={titleRef} />
              </span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto md:mx-0">
              <span ref={subtextRef} />
            </p>

            <p className="mt-3 text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-lg mx-auto md:mx-0">
              Sube tus apuntes, explora documentos de tu carrera y apóyate en IA para estudiar
              más rápido, sin perder calidad académica.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-5 text-sm text-primary flex items-center gap-2 justify-center md:justify-start"
            >
              <Sparkles className="h-4 w-4" /> Inspira. Comparte. Aprende.
            </motion.div>

            {/* Botones principales */}
            <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-4">
              <Button
                asChild
                className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold px-8 py-4 rounded-full text-base sm:text-lg shadow-xl hover:shadow-2xl hover:scale-[1.03] transition-all duration-300"
              >
                <Link href="/registrarse">🚀 Empezar gratis</Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="border border-gray-300/70 dark:border-gray-700 bg-white/50 dark:bg-gray-900/60 hover:bg-gray-50 dark:hover:bg-gray-800/80 text-gray-800 dark:text-gray-100 px-7 py-3 rounded-full text-sm sm:text-base shadow-sm backdrop-blur"
              >
                <Link href="/explorar">Explorar documentos</Link>
              </Button>
            </div>

            {/* Beneficios rápidos */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-300 max-w-2xl mx-auto md:mx-0">
              <div className="bg-white/60 dark:bg-white/5 border border-white/60 dark:border-white/10 rounded-2xl px-4 py-3 backdrop-blur-sm shadow-sm">
                <p className="font-medium">Subidas rápidas</p>
                <p className="text-[11px] sm:text-xs mt-1">
                  Organiza tus documentos por universidad, carrera y materia.
                </p>
              </div>
              <div className="bg-white/60 dark:bg-white/5 border border-white/60 dark:border-white/10 rounded-2xl px-4 py-3 backdrop-blur-sm shadow-sm">
                <p className="font-medium">IA que potencia tu estudio</p>
                <p className="text-[11px] sm:text-xs mt-1">
                  Resume, explica y refuerza conceptos clave en segundos.
                </p>
              </div>
              <div className="bg-white/60 dark:bg-white/5 border border-white/60 dark:border-white/10 rounded-2xl px-4 py-3 backdrop-blur-sm shadow-sm">
                <p className="font-medium">Pensado para UTPL y Ecuador</p>
                <p className="text-[11px] sm:text-xs mt-1">
                  Adaptado a la realidad de las universidades ecuatorianas.
                </p>
              </div>
            </div>
          </div>

          {/* Columna derecha: tarjeta con animación */}
          <div className="w-full max-w-xl mx-auto">
            <motion.div
              className="relative p-[2px] rounded-[32px] bg-gradient-to-r from-indigo-400/70 via-fuchsia-400/70 to-pink-400/70 shadow-[0_18px_60px_rgba(79,70,229,0.35)]"
              whileHover={{ scale: 1.02, rotateX: 2, rotateY: -3 }}
              transition={{ type: 'spring', stiffness: 180, damping: 18 }}
            >
              <div
                className="relative rounded-[30px] border border-white/40 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-2xl shadow-2xl p-6 sm:p-7"
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
              >
                {/* Etiqueta superior */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500 dark:text-gray-300">
                    Vista previa interactiva
                  </p>
                  <span className="text-[11px] px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200">
                    En tiempo real
                  </span>
                </div>

                {/* Contenedor de la animación */}
                <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
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

                {/* Controles de animación */}
                <div className="mt-6 flex flex-col items-center gap-4">
                  <Button
                    onClick={handleNextAnimation}
                    className="group relative overflow-hidden rounded-full px-7 py-2.5 font-semibold shadow hover:shadow-lg transition bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white"
                  >
                    <span className="absolute inset-0 translate-y-[120%] group-hover:translate-y-[-20%] transition-transform duration-700 bg-white/15" />
                    <span className="relative flex items-center gap-2">
                      <Shuffle className="h-4 w-4" /> Cambiar animación
                    </span>
                  </Button>

                  <div className="flex items-center gap-2">
                    {animations.map((_, idx) => (
                      <button
                        key={idx}
                        aria-label={`Ir a la animación ${idx + 1}`}
                        onClick={() => handleGoto(idx)}
                        className={`h-2.5 rounded-full transition-all ${
                          animIndex === idx
                            ? 'w-7 bg-gradient-to-r from-indigo-500 to-fuchsia-500'
                            : 'w-2.5 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Flecha abajo animada */}
        <motion.div
          animate={{ opacity: [0, 1, 0], y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-4 md:mt-0 flex justify-center text-gray-400 dark:text-gray-500"
        >
          <ChevronsDown size={28} />
        </motion.div>
      </motion.div>
    </section>
  )
}

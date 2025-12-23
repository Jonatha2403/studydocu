// src/components/HeroAI.tsx
'use client'

import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import Typed from 'typed.js'
import Lottie from 'lottie-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { toast } from 'sonner'
import { Sparkles, ChevronsDown, Shuffle, FileText, Bot, MessageSquareText, ShieldCheck, Zap, GraduationCap } from 'lucide-react'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadBasic } from '@tsparticles/basic'
import type { Container } from '@tsparticles/engine'

import anim1 from '@/assets/animations/Animation - 1749589272445.json'
import anim2 from '@/assets/animations/Animation - 1749589955890.json'
import anim3 from '@/assets/animations/Animation - 1749590253588.json'

const animations = [anim1, anim2, anim3] as const
type TabKey = 'resumen' | 'vista' | 'chat'

export default function HeroAI() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const lightRef = useRef<HTMLDivElement | null>(null)

  // Typed solo en 1 línea (más premium)
  const typedRef = useRef<HTMLSpanElement | null>(null)
  const typedInstanceRef = useRef<Typed | null>(null)

  const [animIndex, setAnimIndex] = useState(0)
  const [isHover, setIsHover] = useState(false)
  const [engineReady, setEngineReady] = useState(false)
  const [tab, setTab] = useState<TabKey>('resumen')
  const [isInside, setIsInside] = useState(false)

  // 🎇 Partículas de fondo (más suaves / premium)
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadBasic(engine)
    }).then(() => setEngineReady(true))
  }, [])

  const particlesLoaded = useCallback(async (_container?: Container) => {}, [])

  // 💾 Recuperar animación elegida
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('hero_anim_index') : null
    if (saved) setAnimIndex(Math.min(animations.length - 1, Math.max(0, Number(saved))))
  }, [])

  // ⌨ Typed.js SOLO para subtítulo
  useEffect(() => {
    typedInstanceRef.current?.destroy()

    if (typedRef.current) {
      typedInstanceRef.current = new Typed(typedRef.current, {
        typeSpeed: 36,
        backSpeed: 18,
        backDelay: 2200,
        loop: true,
        showCursor: true,
        cursorChar: '▍',
        strings: [
          'Resume apuntes en segundos • IA académica',
          'Organiza por universidad, carrera y materia',
          'Explora documentos y aprende más rápido',
        ],
      })
    }

    return () => {
      typedInstanceRef.current?.destroy()
    }
  }, [])

  // 🔁 Rotación automática de animaciones (pausa al hover)
  useEffect(() => {
    if (isHover) return
    const id = setInterval(() => setAnimIndex((p) => (p + 1) % animations.length), 9000)
    return () => clearInterval(id)
  }, [isHover])

  const handleNextAnimation = () => {
    setAnimIndex((prev) => {
      const next = (prev + 1) % animations.length
      if (typeof window !== 'undefined') localStorage.setItem('hero_anim_index', String(next))
      return next
    })
    toast.success('✨ Vista actualizada')
  }

  const handleGoto = (idx: number) => {
    setAnimIndex(idx)
    if (typeof window !== 'undefined') localStorage.setItem('hero_anim_index', String(idx))
    toast.message('Vista seleccionada', { description: `Mostrando demo #${idx + 1}` })
  }

  // ✨ Luz interactiva SOLO dentro del hero (más elegante)
  useEffect(() => {
    const section = sectionRef.current
    const light = lightRef.current
    if (!section || !light) return

    const onEnter = () => setIsInside(true)
    const onLeave = () => setIsInside(false)

    const onMove = (e: MouseEvent) => {
      if (!isInside) return
      const rect = section.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Menos intensa, más grande y suave
      light.style.background = `
        radial-gradient(
          800px at ${x}px ${y}px,
          rgba(99,102,241,0.16),
          rgba(168,85,247,0.10),
          transparent 70%
        )
      `
    }

    section.addEventListener('mouseenter', onEnter)
    section.addEventListener('mouseleave', onLeave)
    window.addEventListener('mousemove', onMove)

    return () => {
      section.removeEventListener('mouseenter', onEnter)
      section.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('mousemove', onMove)
    }
  }, [isInside])

  const trustItems = useMemo(
    () => [
      { icon: GraduationCap, label: 'Enfoque UTPL + Ecuador' },
      { icon: ShieldCheck, label: 'Privacidad y control' },
      { icon: Zap, label: 'Flujo rápido y claro' },
    ],
    [],
  )

  return (
    <section
      ref={sectionRef}
      className="
        relative overflow-hidden
        min-h-[52vh] md:min-h-[60vh]
        pt-8 pb-0
        md:pt-10 md:pb-0
        lg:pt-12 lg:pb-0
        flex flex-col items-center
        flex flex-col items-center justify-center
        px-4
      "
    >
      {/* Capa de luz interactiva */}
      <div ref={lightRef} className="pointer-events-none absolute inset-0 -z-20 transition-colors duration-300" />

      {/* Partículas (suaves) */}
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
              number: { value: 26, density: { enable: true, width: 900, height: 900 } },
              size: { value: 2 },
              move: { enable: true, speed: 0.45 },
              opacity: { value: 0.28 },
              color: { value: '#6366f1' },
              links: {
                enable: true,
                distance: 150,
                color: '#a855f7',
                opacity: 0.16,
                width: 1,
              },
            },
          }}
        />
      )}

      {/* Fondos gradiente suaves */}
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_at_top,rgba(99,102,241,0.14),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(168,85,247,0.10),transparent_60%)]" />
      <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full blur-3xl opacity-35 bg-indigo-400" />
      <div className="pointer-events-none absolute -bottom-44 -left-44 h-80 w-80 rounded-full blur-3xl opacity-30 bg-fuchsia-400" />

      {/* Contenido */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: 'easeOut' }}
        className="w-full max-w-6xl mx-auto flex flex-col gap-10 md:gap-14"
      >
        <div className="grid gap-10 md:grid-cols-[1.25fr,1.1fr] items-center">
          {/* IZQUIERDA */}
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 justify-center md:justify-start mb-4 px-3 py-1.5 rounded-full bg-white/70 dark:bg-white/5 border border-white/40 dark:border-white/10 shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4 text-purple-500" />
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-gray-700 dark:text-gray-200">
                StudyDocu · Plataforma académica
              </span>
            </div>

            {/* H1 fijo (premium) */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.02]">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 drop-shadow-[0_0_22px_rgba(99,102,241,0.22)]">
                Tu universidad en orden,
              </span>
              <span className="block text-gray-900 dark:text-white">
                potenciada por IA.
              </span>
            </h1>

            {/* Typed SOLO 1 línea */}
            <p className="mt-5 text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto md:mx-0">
              <span ref={typedRef} />
            </p>

            <p className="mt-3 text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto md:mx-0">
              Sube apuntes, explora documentos de tu carrera y usa herramientas inteligentes para estudiar más rápido,
              con una experiencia limpia y profesional.
            </p>

            {/* CTA */}
            <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-4">
              <Button
                asChild
                className="bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 text-white font-semibold px-8 py-4 rounded-full text-base sm:text-lg shadow-xl hover:shadow-2xl hover:scale-[1.03] transition-all duration-300"
              >
                <Link href="/registrarse">🚀 Empezar gratis</Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="border border-gray-300/70 dark:border-gray-700 bg-white/55 dark:bg-gray-900/60 hover:bg-gray-50 dark:hover:bg-gray-800/80 text-gray-800 dark:text-gray-100 px-7 py-3 rounded-full text-sm sm:text-base shadow-sm backdrop-blur"
              >
                <Link href="/explorar">Explorar documentos</Link>
              </Button>
            </div>

            {/* microcopy pro */}
            <div className="mt-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 justify-center md:justify-start">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Sin tarjeta • 2 minutos • Acceso inmediato
            </div>

            {/* Chips métricas */}
            <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto md:mx-0">
              <div className="bg-white/65 dark:bg-white/5 border border-white/60 dark:border-white/10 rounded-2xl px-4 py-3 backdrop-blur-sm shadow-sm">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">⚡ Resumen rápido</p>
                <p className="text-[11px] sm:text-xs mt-1 text-gray-600 dark:text-gray-300">Convierte apuntes en ideas claras.</p>
              </div>
              <div className="bg-white/65 dark:bg-white/5 border border-white/60 dark:border-white/10 rounded-2xl px-4 py-3 backdrop-blur-sm shadow-sm">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">📚 Organización real</p>
                <p className="text-[11px] sm:text-xs mt-1 text-gray-600 dark:text-gray-300">Universidad • Carrera • Materia.</p>
              </div>
              <div className="bg-white/65 dark:bg-white/5 border border-white/60 dark:border-white/10 rounded-2xl px-4 py-3 backdrop-blur-sm shadow-sm">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">🤝 Comunidad</p>
                <p className="text-[11px] sm:text-xs mt-1 text-gray-600 dark:text-gray-300">Aprende y comparte con otros.</p>
              </div>
            </div>

            {/* Trust bar */}
            <div className="mt-7 flex flex-wrap gap-3 justify-center md:justify-start">
              {trustItems.map((t) => (
                <div
                  key={t.label}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/55 dark:bg-white/5 border border-white/50 dark:border-white/10 backdrop-blur-sm shadow-sm"
                >
                  <t.icon className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                  <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-200">{t.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* DERECHA (demo tipo app + animación) */}
          <div className="w-full max-w-xl mx-auto">
            <motion.div
              className="relative p-[2px] rounded-[32px] bg-gradient-to-r from-indigo-400/70 via-purple-400/70 to-fuchsia-400/70 shadow-[0_18px_60px_rgba(99,102,241,0.28)]"
              whileHover={{ scale: 1.015, rotateX: 1.5, rotateY: -2 }}
              transition={{ type: 'spring', stiffness: 170, damping: 18 }}
            >
              <div
                className="relative rounded-[30px] border border-white/40 dark:border-white/10 bg-white/65 dark:bg-white/5 backdrop-blur-2xl shadow-2xl p-5 sm:p-6"
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
              >
                {/* Window chrome */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                  </div>
                  <span className="text-[11px] px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200">
                    Demo en vivo
                  </span>
                </div>

                {/* Tabs */}
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setTab('resumen')}
                    className={`rounded-xl px-3 py-2 text-xs sm:text-sm border transition-all ${
                      tab === 'resumen'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white/60 dark:bg-gray-900/50 text-gray-700 dark:text-gray-200 border-white/40 dark:border-white/10 hover:bg-white/80 dark:hover:bg-gray-900/70'
                    }`}
                  >
                    <span className="inline-flex items-center gap-2 justify-center">
                      <Bot className="h-4 w-4" /> Resumen IA
                    </span>
                  </button>

                  <button
                    onClick={() => setTab('vista')}
                    className={`rounded-xl px-3 py-2 text-xs sm:text-sm border transition-all ${
                      tab === 'vista'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white/60 dark:bg-gray-900/50 text-gray-700 dark:text-gray-200 border-white/40 dark:border-white/10 hover:bg-white/80 dark:hover:bg-gray-900/70'
                    }`}
                  >
                    <span className="inline-flex items-center gap-2 justify-center">
                      <FileText className="h-4 w-4" /> Vista previa
                    </span>
                  </button>

                  <button
                    onClick={() => setTab('chat')}
                    className={`rounded-xl px-3 py-2 text-xs sm:text-sm border transition-all ${
                      tab === 'chat'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white/60 dark:bg-gray-900/50 text-gray-700 dark:text-gray-200 border-white/40 dark:border-white/10 hover:bg-white/80 dark:hover:bg-gray-900/70'
                    }`}
                  >
                    <span className="inline-flex items-center gap-2 justify-center">
                      <MessageSquareText className="h-4 w-4" /> Chat
                    </span>
                  </button>
                </div>

                {/* Demo area */}
                <div className="mt-4 relative w-full aspect-[16/10] overflow-hidden rounded-2xl border border-white/30 dark:border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
                  {/* Animación como “ambient layer” */}
                  <motion.div
                    key={animIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="absolute inset-0"
                    aria-hidden
                  >
                    <Lottie
                      animationData={animations[animIndex]}
                      loop
                      className="h-full w-full"
                      rendererSettings={{ preserveAspectRatio: 'xMidYMid meet' }}
                    />
                  </motion.div>

                  {/* Overlay UI */}
                  <div className="absolute inset-0 p-4 sm:p-5">
                    <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 p-4 h-full flex flex-col justify-between">
                      {tab === 'resumen' && (
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-xs text-white/70 uppercase tracking-wider">Documento</p>
                              <p className="text-sm sm:text-base font-semibold text-white">Macroeconomía • Unidad 6</p>
                            </div>
                            <span className="text-[11px] px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-100 border border-indigo-300/20">
                              Resumen IA
                            </span>
                          </div>

                          <div className="grid gap-2">
                            <div className="rounded-xl bg-black/25 border border-white/10 p-3">
                              <p className="text-xs text-white/75">Puntos clave</p>
                              <ul className="mt-2 space-y-1 text-[12px] sm:text-sm text-white/90">
                                <li>• IPC: canasta, ponderaciones y variación mensual.</li>
                                <li>• Inflación: cálculo y problemas de medición.</li>
                                <li>• Deflactor del PIB y comparaciones reales.</li>
                              </ul>
                            </div>

                            <div className="rounded-xl bg-black/25 border border-white/10 p-3">
                              <p className="text-xs text-white/75">Siguiente paso</p>
                              <p className="mt-1 text-[12px] sm:text-sm text-white/90">
                                Genera preguntas tipo examen y un mapa conceptual.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {tab === 'vista' && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-xs text-white/70 uppercase tracking-wider">Vista previa</p>
                              <p className="text-sm sm:text-base font-semibold text-white">“Capítulo 2 - PIB e Inflación”</p>
                            </div>
                            <span className="text-[11px] px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-100 border border-emerald-300/20">
                              PDF listo
                            </span>
                          </div>

                          <div className="rounded-xl bg-black/25 border border-white/10 p-3 h-[70%] flex flex-col gap-2">
                            <div className="h-3 w-3/4 rounded bg-white/20" />
                            <div className="h-3 w-full rounded bg-white/15" />
                            <div className="h-3 w-11/12 rounded bg-white/15" />
                            <div className="h-3 w-10/12 rounded bg-white/15" />
                            <div className="h-3 w-full rounded bg-white/15" />
                            <div className="mt-2 h-24 rounded bg-white/10 border border-white/10" />
                            <div className="h-3 w-4/5 rounded bg-white/15" />
                            <div className="h-3 w-2/3 rounded bg-white/15" />
                          </div>
                        </div>
                      )}

                      {tab === 'chat' && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-xs text-white/70 uppercase tracking-wider">Chat académico</p>
                              <p className="text-sm sm:text-base font-semibold text-white">“Explícame el IPC”</p>
                            </div>
                            <span className="text-[11px] px-2 py-1 rounded-full bg-fuchsia-500/15 text-fuchsia-100 border border-fuchsia-300/20">
                              IA en línea
                            </span>
                          </div>

                          <div className="space-y-2">
                            <div className="rounded-xl bg-black/25 border border-white/10 p-3">
                              <p className="text-[12px] sm:text-sm text-white/90">
                                <span className="text-white/70">Usuario:</span> ¿Cómo se calcula la inflación con IPC?
                              </p>
                            </div>
                            <div className="rounded-xl bg-indigo-500/15 border border-indigo-300/20 p-3">
                              <p className="text-[12px] sm:text-sm text-white/90">
                                <span className="text-white/70">StudyDocu IA:</span> Inflación ≈ % cambio del IPC entre dos periodos.
                                Te doy el paso a paso y un ejemplo.
                              </p>
                            </div>
                            <div className="rounded-xl bg-black/25 border border-white/10 p-3">
                              <p className="text-[12px] sm:text-sm text-white/90">
                                <span className="text-white/70">Sugerencia:</span> ¿Quieres que lo resuelva con tus datos del INEC?
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Footer acciones */}
                      <div className="pt-3 flex items-center justify-between gap-3">
                        <div className="text-[11px] text-white/70">
                          Tip: usa “Explorar” para encontrar material por materia.
                        </div>

                        <Button
                          onClick={handleNextAnimation}
                          className="group relative overflow-hidden rounded-full px-4 py-2 text-xs sm:text-sm font-semibold shadow hover:shadow-lg transition bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white"
                        >
                          <span className="absolute inset-0 translate-y-[120%] group-hover:translate-y-[-20%] transition-transform duration-700 bg-white/10" />
                          <span className="relative flex items-center gap-2">
                            <Shuffle className="h-4 w-4" /> Cambiar demo
                          </span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dots selector */}
                <div className="mt-4 flex items-center justify-center gap-2">
                  {animations.map((_, idx) => (
                    <button
                      key={idx}
                      aria-label={`Ir a demo ${idx + 1}`}
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
            </motion.div>
          </div>
        </div>

        {/* Flecha abajo */}
        <motion.div
          animate={{ opacity: [0, 1, 0], y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-2 md:mt-0 flex justify-center text-gray-400 dark:text-gray-500"
        >
          <ChevronsDown size={28} />
        </motion.div>
      </motion.div>
    </section>
  )
}

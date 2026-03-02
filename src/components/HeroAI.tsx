// src/components/HeroAI.tsx
'use client'

import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import Typed from 'typed.js'
import Lottie from 'lottie-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Sparkles,
  ArrowRight,
  Shuffle,
  FileText,
  Bot,
  MessageSquareText,
  ShieldCheck,
  Zap,
  GraduationCap,
  Lock,
  MessageCircle,
} from 'lucide-react'

import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadBasic } from '@tsparticles/basic'
import type { Container } from '@tsparticles/engine'

import anim1 from '@/assets/animations/Animation - 1749589272445.json'
import anim2 from '@/assets/animations/Animation - 1749589955890.json'
import anim3 from '@/assets/animations/Animation - 1749590253588.json'

const animations = [anim1, anim2, anim3] as const
type TabKey = 'resumen' | 'vista' | 'chat'

// ✅ WhatsApp (mismo número)
const WHATSAPP_URL =
  'https://wa.me/593958757302?text=Hola%20StudyDocu,%20deseo%20conocer%20m%C3%A1s%20sobre%20la%20plataforma%20y%20sus%20servicios.'

export default function HeroAI() {
  const sectionRef = useRef<HTMLElement | null>(null)

  // Typed (1 línea)
  const typedRef = useRef<HTMLSpanElement | null>(null)
  const typedInstanceRef = useRef<Typed | null>(null)

  const reduceMotion = useReducedMotion()

  const [animIndex, setAnimIndex] = useState(0)
  const [isHover, setIsHover] = useState(false)
  const [engineReady, setEngineReady] = useState(false)
  const [tab, setTab] = useState<TabKey>('resumen')
  const [isMobile, setIsMobile] = useState(true)

  // ✅ isMobile via matchMedia (liviano)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const sync = () => setIsMobile(mq.matches)
    sync()
    mq.addEventListener?.('change', sync)
    return () => mq.removeEventListener?.('change', sync)
  }, [])

  // ✅ Partículas SOLO desktop y sin reduceMotion
  useEffect(() => {
    if (isMobile || reduceMotion) return
    initParticlesEngine(async (engine) => {
      await loadBasic(engine)
    }).then(() => setEngineReady(true))
  }, [isMobile, reduceMotion])

  const particlesLoaded = useCallback(async (_container?: Container) => {}, [])

  // 💾 Recuperar animación elegida
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('hero_anim_index') : null
    if (saved) setAnimIndex(Math.min(animations.length - 1, Math.max(0, Number(saved))))
  }, [])

  // ⌨ Typed.js SOLO para subtítulo (en móvil menos intenso)
  useEffect(() => {
    typedInstanceRef.current?.destroy()

    if (!typedRef.current) return
    typedInstanceRef.current = new Typed(typedRef.current, {
      typeSpeed: isMobile ? 28 : 34,
      backSpeed: isMobile ? 14 : 18,
      backDelay: 2100,
      loop: true,
      showCursor: true,
      cursorChar: '▍',
      strings: [
        'Resume apuntes en segundos con IA.',
        'Organiza por universidad, carrera y materia.',
        'Explora documentos y aprende más rápido.',
      ],
    })

    return () => typedInstanceRef.current?.destroy()
  }, [isMobile])

  // 🔁 Rotación automática de animaciones (pausa al hover)
  useEffect(() => {
    if (isHover) return
    // ✅ en móvil rotación más lenta para no gastar
    const id = setInterval(
      () => setAnimIndex((p) => (p + 1) % animations.length),
      isMobile ? 12000 : 9000
    )
    return () => clearInterval(id)
  }, [isHover, isMobile])

  const handleNextAnimation = () => {
    setAnimIndex((prev) => {
      const next = (prev + 1) % animations.length
      if (typeof window !== 'undefined') localStorage.setItem('hero_anim_index', String(next))
      return next
    })
    toast.success('Vista actualizada')
  }

  const handleGoto = (idx: number) => {
    setAnimIndex(idx)
    if (typeof window !== 'undefined') localStorage.setItem('hero_anim_index', String(idx))
    toast.message('Demo seleccionada', { description: `Mostrando demo #${idx + 1}` })
  }

  const handleWhatsApp = () => {
    toast.success('Redirigiendo a WhatsApp...')
    window.open(WHATSAPP_URL, '_blank')
  }

  const trustItems = useMemo(
    () => [
      { icon: GraduationCap, label: 'Enfoque Ecuador (UTPL y más)' },
      { icon: ShieldCheck, label: 'Privacidad y control' },
      { icon: Zap, label: 'Flujo rápido y claro' },
    ],
    []
  )

  const motionEnabled = !reduceMotion && !isMobile
  const fadeFrom = motionEnabled ? { opacity: 0, y: 18 } : undefined
  const fadeTo = motionEnabled ? { opacity: 1, y: 0 } : undefined

  return (
    <section
      ref={sectionRef}
      className={['relative overflow-hidden', 'pt-8 md:pt-12', 'pb-8 md:pb-10', 'px-4'].join(' ')}
    >
      {/* ✅ Background enterprise: muy sutil y liviano */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(820px_420px_at_18%_12%,rgba(37,99,235,0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(780px_420px_at_88%_18%,rgba(6,182,212,0.10),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,hsl(var(--background)),hsl(var(--background)/0.78),hsl(var(--background)))]" />
      </div>

      {/* ✅ Partículas (desktop only) */}
      {engineReady && (
        <Particles
          id="tsparticles-hero"
          className="absolute inset-0 -z-10"
          particlesLoaded={particlesLoaded}
          options={{
            fullScreen: { enable: false },
            background: { color: { value: 'transparent' } },
            fpsLimit: 60,
            particles: {
              number: { value: 18, density: { enable: true, width: 900, height: 900 } },
              size: { value: 2 },
              move: { enable: true, speed: 0.35 },
              opacity: { value: 0.22 },
              color: { value: '#2563EB' },
              links: {
                enable: true,
                distance: 170,
                color: '#06B6D4',
                opacity: 0.14,
                width: 1,
              },
            },
          }}
        />
      )}

      <motion.div
        initial={fadeFrom}
        animate={fadeTo}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="w-full max-w-7xl mx-auto"
      >
        <div className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr] items-center">
          {/* LEFT */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 justify-center lg:justify-start mb-4 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-[0_8px_22px_-18px_rgba(2,6,23,0.18)]">
              <Sparkles className="h-4 w-4 text-cyan-700" />
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">
                StudyDocu · IA académica
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.02] text-slate-900">
              Organiza tu universidad.
              <span className="block text-slate-700 font-semibold">Estudia más rápido con IA.</span>
            </h1>

            {/* Typed (1 línea) */}
            <p className="mt-5 text-base sm:text-lg text-slate-700 max-w-xl mx-auto lg:mx-0">
              <span className="font-medium" ref={typedRef} />
            </p>

            <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Sube apuntes, explora documentos de tu carrera y usa herramientas inteligentes para
              convertir PDFs en estudio accionable, con una experiencia limpia y profesional.
            </p>

            {/* CTA */}
            <div className="mt-7 flex flex-wrap justify-center lg:justify-start gap-3">
              <Button
                asChild
                className="bg-slate-900 text-white font-semibold px-7 py-5 rounded-2xl text-sm sm:text-base hover:bg-slate-800 transition"
              >
                <Link href="/registrarse">
                  Empezar gratis <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="border-slate-200 bg-white hover:bg-slate-50 text-slate-900 px-7 py-5 rounded-2xl text-sm sm:text-base"
              >
                <Link href="/explorar">Explorar documentos</Link>
              </Button>

              {/* WhatsApp (pro y liviano) */}
              <Button
                onClick={handleWhatsApp}
                variant="outline"
                className="border-slate-200 bg-white hover:bg-slate-50 text-slate-900 px-5 py-5 rounded-2xl text-sm sm:text-base"
                aria-label="WhatsApp"
                title="WhatsApp"
              >
                <MessageCircle className="w-5 h-5 text-emerald-600" />
              </Button>
            </div>

            <div className="mt-3 text-xs sm:text-sm text-slate-500 flex items-center gap-2 justify-center lg:justify-start">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Sin tarjeta • 2 minutos • Acceso inmediato
            </div>

            {/* Trust bar */}
            <div className="mt-6 flex flex-wrap gap-3 justify-center lg:justify-start">
              {trustItems.map((t) => (
                <div
                  key={t.label}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-slate-200 shadow-[0_10px_26px_-20px_rgba(2,6,23,0.18)]"
                >
                  <t.icon className="h-4 w-4 text-slate-900" />
                  <span className="text-xs sm:text-sm text-slate-700">{t.label}</span>
                </div>
              ))}
            </div>

            {/* Mini benefits */}
            <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto lg:mx-0">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_26px_-20px_rgba(2,6,23,0.18)]">
                <p className="text-sm font-semibold text-slate-900">Resumen útil</p>
                <p className="text-[11px] sm:text-xs mt-1 text-slate-600">
                  Puntos clave y siguiente paso.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_26px_-20px_rgba(2,6,23,0.18)]">
                <p className="text-sm font-semibold text-slate-900">Orden real</p>
                <p className="text-[11px] sm:text-xs mt-1 text-slate-600">
                  Universidad • Carrera • Materia.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_26px_-20px_rgba(2,6,23,0.18)]">
                <p className="text-sm font-semibold text-slate-900">Seguro</p>
                <p className="text-[11px] sm:text-xs mt-1 text-slate-600">
                  Privacidad y control del usuario.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT (Demo card enterprise) */}
          <div className="w-full max-w-xl mx-auto">
            <motion.div
              initial={fadeFrom}
              animate={fadeTo}
              transition={{ duration: 0.7, ease: 'easeOut', delay: motionEnabled ? 0.08 : 0 }}
              className="rounded-3xl border border-slate-200 bg-white shadow-[0_18px_50px_-34px_rgba(2,6,23,0.35)] overflow-hidden"
              onMouseEnter={() => setIsHover(true)}
              onMouseLeave={() => setIsHover(false)}
            >
              {/* Header */}
              <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400/90" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400/90" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/90" />
                </div>

                <span className="text-[11px] px-2 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Demo
                </span>
              </div>

              {/* Tabs */}
              <div className="px-5 pt-4">
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setTab('resumen')}
                    className={[
                      'rounded-xl px-3 py-2 text-xs sm:text-sm border transition',
                      tab === 'resumen'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50',
                    ].join(' ')}
                  >
                    <span className="inline-flex items-center gap-2 justify-center">
                      <Bot className="h-4 w-4" /> Resumen
                    </span>
                  </button>

                  <button
                    onClick={() => setTab('vista')}
                    className={[
                      'rounded-xl px-3 py-2 text-xs sm:text-sm border transition',
                      tab === 'vista'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50',
                    ].join(' ')}
                  >
                    <span className="inline-flex items-center gap-2 justify-center">
                      <FileText className="h-4 w-4" /> Vista
                    </span>
                  </button>

                  <button
                    onClick={() => setTab('chat')}
                    className={[
                      'rounded-xl px-3 py-2 text-xs sm:text-sm border transition',
                      tab === 'chat'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50',
                    ].join(' ')}
                  >
                    <span className="inline-flex items-center gap-2 justify-center">
                      <MessageSquareText className="h-4 w-4" /> Chat
                    </span>
                  </button>
                </div>
              </div>

              {/* Demo area */}
              <div className="p-5">
                <div className="relative w-full aspect-[16/10] overflow-hidden rounded-2xl border border-slate-200 bg-slate-950">
                  {/* Ambient animation layer (más sutil) */}
                  <motion.div
                    key={animIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.45 }}
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
                    <div className="rounded-2xl bg-white/10 border border-white/15 backdrop-blur-lg p-4 h-full flex flex-col justify-between">
                      {tab === 'resumen' && (
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-xs text-white/70 uppercase tracking-wider">
                                Documento
                              </p>
                              <p className="text-sm sm:text-base font-semibold text-white">
                                Macroeconomía • Unidad 6
                              </p>
                            </div>
                            <span className="text-[11px] px-2 py-1 rounded-full bg-cyan-500/15 text-cyan-100 border border-cyan-300/20">
                              Resumen IA
                            </span>
                          </div>

                          <div className="grid gap-2">
                            <div className="rounded-xl bg-black/25 border border-white/10 p-3">
                              <p className="text-xs text-white/75">Puntos clave</p>
                              <ul className="mt-2 space-y-1 text-[12px] sm:text-sm text-white/90">
                                <li>• IPC: canasta, ponderaciones y variación.</li>
                                <li>• Inflación: cálculo y problemas de medición.</li>
                                <li>• Deflactor del PIB: comparación real.</li>
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
                              <p className="text-xs text-white/70 uppercase tracking-wider">
                                Vista previa
                              </p>
                              <p className="text-sm sm:text-base font-semibold text-white">
                                “Capítulo 2 - PIB e Inflación”
                              </p>
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
                              <p className="text-xs text-white/70 uppercase tracking-wider">
                                Chat académico
                              </p>
                              <p className="text-sm sm:text-base font-semibold text-white">
                                “Explícame el IPC”
                              </p>
                            </div>
                            <span className="text-[11px] px-2 py-1 rounded-full bg-fuchsia-500/15 text-fuchsia-100 border border-fuchsia-300/20">
                              IA en línea
                            </span>
                          </div>

                          <div className="space-y-2">
                            <div className="rounded-xl bg-black/25 border border-white/10 p-3">
                              <p className="text-[12px] sm:text-sm text-white/90">
                                <span className="text-white/70">Usuario:</span> ¿Cómo se calcula la
                                inflación con IPC?
                              </p>
                            </div>
                            <div className="rounded-xl bg-cyan-500/15 border border-cyan-300/20 p-3">
                              <p className="text-[12px] sm:text-sm text-white/90">
                                <span className="text-white/70">StudyDocu IA:</span> Inflación ≈ %
                                cambio del IPC entre dos periodos. Te doy el paso a paso y un
                                ejemplo.
                              </p>
                            </div>
                            <div className="rounded-xl bg-black/25 border border-white/10 p-3">
                              <p className="text-[12px] sm:text-sm text-white/90">
                                <span className="text-white/70">Sugerencia:</span> ¿Quieres que lo
                                resuelva con tus datos del INEC?
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Footer actions */}
                      <div className="pt-3 flex items-center justify-between gap-3">
                        <div className="text-[11px] text-white/70 inline-flex items-center gap-2">
                          <Lock className="w-3.5 h-3.5" />
                          Privado y seguro
                        </div>

                        <Button
                          onClick={handleNextAnimation}
                          className="rounded-full px-4 py-2 text-xs sm:text-sm font-semibold bg-white text-slate-900 hover:bg-slate-100"
                        >
                          <span className="flex items-center gap-2">
                            <Shuffle className="h-4 w-4" /> Cambiar
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
                      className={[
                        'h-2.5 rounded-full transition-all',
                        animIndex === idx ? 'w-7 bg-white' : 'w-2.5 bg-white/40 hover:bg-white/60',
                      ].join(' ')}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ✅ mini hint scroll (sin animación pesada) */}
        <div className="mt-6 flex justify-center">
          <a
            href="#funcionalidades"
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-500 hover:text-slate-700 transition"
          >
            Ver funcionalidades <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </motion.div>
    </section>
  )
}

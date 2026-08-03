import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BookOpenCheck,
  BrainCircuit,
  CalendarCheck2,
  CheckCircle2,
  ChevronRight,
  Clock3,
  GraduationCap,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Target,
} from 'lucide-react'

const PAGE_URL = 'https://www.studydocu.ec/examen-admision-universidad'
const DESCRIPTION =
  'Prepárate para tu examen de admisión universitaria en Ecuador con diagnóstico, plan de estudio, práctica guiada y simulacros. Solicita orientación por WhatsApp.'
const WHATSAPP_NUMBER = '593958757302'
const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  'Hola StudyDocu, quiero prepararme para un examen de admisión universitaria. ¿Me ayudan a conocer el plan y los horarios disponibles?'
)}`

export const metadata: Metadata = {
  title: { absolute: 'Preparación para Examen de Admisión Universitaria en Ecuador | StudyDocu' },
  description: DESCRIPTION,
  keywords: [
    'examen de admisión universidad',
    'examen de ingreso universidad Ecuador',
    'preparación examen de admisión',
    'curso examen de ingreso universidad',
    'simulacro examen de admisión',
    'prueba de ingreso universidad Ecuador',
    'preuniversitario Ecuador',
    'razonamiento lógico examen admisión',
    'razonamiento verbal examen admisión',
    'razonamiento matemático examen admisión',
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'Preparación para tu examen de admisión universitaria',
    description:
      'Plan personalizado, práctica por áreas y simulacros para llegar mejor preparado a tu prueba de ingreso.',
    url: PAGE_URL,
    siteName: 'StudyDocu',
    locale: 'es_EC',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'StudyDocu Ecuador' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Preparación para examen de admisión | StudyDocu',
    description: 'Diagnóstico, plan de estudio, práctica guiada y simulacros.',
    images: ['/og-image.jpg'],
  },
}

const areas = [
  {
    icon: BrainCircuit,
    title: 'Razonamiento lógico',
    text: 'Series, patrones y problemas para fortalecer tu agilidad mental.',
  },
  {
    icon: BarChart3,
    title: 'Razonamiento matemático',
    text: 'Ejercicios guiados para resolver con precisión y administrar el tiempo.',
  },
  {
    icon: BookOpenCheck,
    title: 'Razonamiento verbal',
    text: 'Comprensión lectora, vocabulario y análisis de textos.',
  },
  {
    icon: Clock3,
    title: 'Estrategia de examen',
    text: 'Técnicas para priorizar preguntas, controlar el tiempo y reducir errores.',
  },
]

const process = [
  {
    number: '01',
    title: 'Cuéntanos tu objetivo',
    text: 'Indícanos la universidad, la fecha y las áreas de tu evaluación.',
  },
  {
    number: '02',
    title: 'Realiza un diagnóstico',
    text: 'Identificamos tus fortalezas y los temas que necesitan mayor refuerzo.',
  },
  {
    number: '03',
    title: 'Sigue tu ruta de estudio',
    text: 'Practica con acompañamiento, material organizado y metas alcanzables.',
  },
  {
    number: '04',
    title: 'Mide tu avance',
    text: 'Resuelve simulacros y corrige errores antes del día de la prueba.',
  },
]

const proofPoints = [
  { icon: Target, label: 'Enfoque', text: 'Metas claras' },
  { icon: CalendarCheck2, label: 'Organización', text: 'Ruta de estudio' },
  { icon: BrainCircuit, label: 'Práctica', text: 'Ejercicios guiados' },
  { icon: BadgeCheck, label: 'Seguimiento', text: 'Revisión de avances' },
]

const faqs = [
  {
    q: '¿Cómo prepararme para un examen de admisión universitaria?',
    a: 'Empieza con un diagnóstico, organiza los contenidos por áreas y practica con tiempo limitado. Revisar los errores de cada simulacro es tan importante como resolver nuevas preguntas.',
  },
  {
    q: '¿Qué temas suelen evaluar en una prueba de ingreso?',
    a: 'Depende de cada universidad. Con frecuencia se evalúan razonamiento matemático, lógico y verbal, comprensión lectora y, en ciertos procesos, conocimientos específicos. Adaptamos la preparación al temario disponible.',
  },
  {
    q: '¿La preparación incluye simulacros?',
    a: 'Sí. Los simulacros permiten practicar el formato, medir tiempos e identificar áreas de mejora. La cantidad y el contenido se definen según tu proceso de admisión.',
  },
  {
    q: '¿La atención es para universidades de Ecuador?',
    a: 'Sí. Brindamos orientación académica para aspirantes en Ecuador y ajustamos el plan al proceso y temario de la universidad a la que deseas postular.',
  },
  {
    q: '¿StudyDocu realiza el examen por mí?',
    a: 'No. Nuestro servicio es de preparación y acompañamiento académico. El examen debe ser rendido personalmente por cada aspirante conforme a las reglas de su universidad.',
  },
]

export default function ExamenAdmisionUniversidadPage() {
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Preparación para examen de admisión universitaria',
      description: DESCRIPTION,
      url: PAGE_URL,
      areaServed: { '@type': 'Country', name: 'Ecuador' },
      provider: { '@type': 'Organization', name: 'StudyDocu', url: 'https://www.studydocu.ec' },
      serviceType: 'Preparación académica para exámenes de ingreso universitario',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://www.studydocu.ec' },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Servicios',
          item: 'https://www.studydocu.ec/servicios',
        },
        { '@type': 'ListItem', position: 3, name: 'Examen de admisión', item: PAGE_URL },
      ],
    },
  ]

  return (
    <main className="min-h-screen overflow-hidden bg-[#f8fafc] text-slate-950">
      <Script
        id="structured-data-examen-admision"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="relative border-b border-slate-200/80 bg-[#071a3d] text-white">
        <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_82%_18%,#2563eb_0,transparent_25%),radial-gradient(circle_at_15%_80%,#0ea5e9_0,transparent_22%)]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:42px_42px]" />

        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-7 sm:px-8 lg:pb-24 lg:pt-9">
          <nav
            aria-label="Migas de pan"
            className="flex items-center gap-2 text-sm text-blue-100/80"
          >
            <Link href="/" className="transition hover:text-white">
              Inicio
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/servicios" className="transition hover:text-white">
              Servicios
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white">Examen de admisión</span>
          </nav>

          <div className="mt-12 grid items-center gap-12 lg:grid-cols-[1.08fr_.92fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-sm font-medium text-blue-50 backdrop-blur">
                <Sparkles className="h-4 w-4 text-amber-300" /> Preparación personalizada en Ecuador
              </div>
              <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-[1.08] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
                Prepárate para tu <span className="text-amber-400">examen de admisión</span>{' '}
                universitaria
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-100/90 sm:text-xl">
                Convierte un temario amplio en un plan claro. Refuerza tus conocimientos, practica
                por áreas y mide tu avance con simulacros antes de tu prueba de ingreso.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-3.5 font-bold text-[#071a3d] shadow-lg shadow-amber-950/20 transition hover:-translate-y-0.5 hover:bg-amber-300"
                >
                  <MessageCircle className="h-5 w-5" /> Solicitar orientación
                </a>
                <a
                  href="#como-funciona"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 font-semibold text-white backdrop-blur transition hover:bg-white/15"
                >
                  Conocer el proceso <ArrowRight className="h-4 w-4" />
                </a>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-blue-50/90">
                {[
                  'Plan según tu objetivo',
                  'Práctica por áreas',
                  'Simulacros y retroalimentación',
                ].map((item) => (
                  <span key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-lg">
              <div className="absolute -inset-5 rounded-[2rem] bg-blue-400/20 blur-2xl" />
              <div className="relative overflow-hidden rounded-[1.75rem] border border-white/15 bg-white p-6 text-slate-900 shadow-2xl sm:p-8">
                <div className="flex items-center justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-700">
                    <GraduationCap className="h-7 w-7" />
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                    RUTA PERSONALIZADA
                  </span>
                </div>
                <h2 className="mt-6 text-2xl font-bold tracking-tight">
                  Tu preparación, paso a paso
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Una ruta enfocada en lo que necesitas reforzar antes de la evaluación.
                </p>
                <div className="mt-6 space-y-3">
                  {[
                    ['Diagnóstico inicial', 'Conoce tu punto de partida'],
                    ['Plan de estudio', 'Prioriza temas y organiza tu tiempo'],
                    ['Práctica guiada', 'Comprende cómo resolver cada ejercicio'],
                    ['Simulacro final', 'Llega con mayor seguridad'],
                  ].map(([title, text], index) => (
                    <div
                      key={title}
                      className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-3.5"
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#071a3d] text-sm font-bold text-white">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-semibold">{title}</p>
                        <p className="text-sm text-slate-500">{text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex items-center gap-2 rounded-xl bg-blue-50 p-3 text-sm font-medium text-blue-900">
                  <ShieldCheck className="h-5 w-5 text-blue-700" /> Orientación académica
                  responsable
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-slate-200 px-5 sm:px-8 md:grid-cols-4 md:divide-y-0">
          {proofPoints.map(({ icon: Icon, label, text }) => (
            <div key={label} className="flex items-center gap-3 px-4 py-6 md:justify-center">
              <Icon className="h-6 w-6 text-blue-700" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
                <p className="font-semibold text-slate-800">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700">
            Preparación integral
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Refuerza las habilidades clave de tu prueba
          </h2>
          <p className="mt-4 leading-7 text-slate-600">
            El contenido se ajusta al temario y al formato informado por la universidad a la que
            deseas postular.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {areas.map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
            >
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-blue-700 transition group-hover:bg-blue-700 group-hover:text-white">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="como-funciona" className="bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <span className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700">
                Cómo funciona
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Un proceso sencillo para estudiar con dirección
              </h2>
              <p className="mt-5 leading-7 text-slate-600">
                No todos los aspirantes parten del mismo nivel ni presentan la misma prueba. Por eso
                comenzamos entendiendo tu caso.
              </p>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex items-center gap-2 font-bold text-blue-700 hover:text-blue-900"
              >
                Hablar con un asesor <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <div className="space-y-4">
              {process.map((item) => (
                <article
                  key={item.number}
                  className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:grid-cols-[64px_1fr] sm:items-start"
                >
                  <span className="text-3xl font-bold text-blue-200">{item.number}</span>
                  <div>
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <p className="mt-2 leading-7 text-slate-600">{item.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
        <div className="overflow-hidden rounded-[2rem] bg-[#071a3d] px-6 py-12 text-white shadow-xl sm:px-10 lg:grid lg:grid-cols-[1fr_.8fr] lg:items-center lg:px-14">
          <div>
            <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-amber-400">
              <GraduationCap className="h-5 w-5" /> Tu meta comienza hoy
            </span>
            <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
              Llega a tu examen con un plan, práctica y mayor confianza
            </h2>
            <p className="mt-4 max-w-2xl leading-7 text-blue-100/85">
              Escríbenos con el nombre de tu universidad y la fecha aproximada de la prueba. Te
              orientaremos sobre la preparación disponible.
            </p>
          </div>
          <div className="mt-8 lg:mt-0 lg:text-right">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-4 font-bold text-[#071a3d] transition hover:bg-amber-300 sm:w-auto"
            >
              <MessageCircle className="h-5 w-5" /> Escríbenos por WhatsApp
            </a>
            <p className="mt-3 text-sm text-blue-200">Respuesta personalizada · Sin compromiso</p>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <div className="text-center">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700">
              Resolvemos tus dudas
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Preguntas frecuentes sobre el examen de admisión
            </h2>
          </div>
          <div className="mt-10 space-y-3">
            {faqs.map((item) => (
              <details
                key={item.q}
                className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 open:bg-white open:shadow-sm"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-bold">
                  <span>{item.q}</span>
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-100 text-blue-700 transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 max-w-3xl border-t border-slate-200 pt-4 leading-7 text-slate-600">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-blue-100 bg-blue-50 p-5 text-center sm:flex-row sm:text-left">
            <div>
              <p className="font-bold text-blue-950">¿Tu pregunta no aparece aquí?</p>
              <p className="mt-1 text-sm text-blue-800">Cuéntanos tu caso y te orientamos.</p>
            </div>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 font-bold text-white transition hover:bg-blue-800"
            >
              <MessageCircle className="h-4 w-4" /> Consultar ahora
            </a>
          </div>
          <p className="mt-8 text-center text-xs leading-5 text-slate-500">
            StudyDocu ofrece preparación académica independiente. No representa ni está afiliado a
            las universidades mencionadas por sus aspirantes y no garantiza resultados de admisión.
          </p>
        </div>
      </section>
    </main>
  )
}

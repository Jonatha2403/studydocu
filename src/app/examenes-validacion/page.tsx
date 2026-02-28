// src/app/examenes-validacion/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import { ArrowRight, CheckCircle2, ShieldCheck, ClipboardList, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Exámenes de Validación en Ecuador | Preparación Universitaria – StudyDocu',
  description:
    'Preparación para exámenes de validación universitaria en Ecuador. Acompañamiento académico estratégico, repaso estructurado, simulacros y orientación personalizada.',
  keywords: [
    'examenes de validacion Ecuador',
    'examen de validacion universitario',
    'validacion UTPL',
    'examen validacion universidad Ecuador',
    'preparacion examen validacion',
    'simulacros examen validacion',
    'guia examen validacion',
  ],
  alternates: { canonical: 'https://studydocu.ec/examenes-validacion' },
  openGraph: {
    title: 'Exámenes de Validación en Ecuador | StudyDocu',
    description:
      'Preparación estratégica para exámenes de validación universitaria en Ecuador: repaso por áreas, simulacros y acompañamiento académico.',
    url: 'https://studydocu.ec/examenes-validacion',
    siteName: 'StudyDocu',
    locale: 'es_EC',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Exámenes de Validación en Ecuador | StudyDocu',
    description:
      'Prepárate para tu examen de validación con repaso estructurado, simulacros y orientación personalizada.',
  },
}

const faq = [
  {
    q: '¿Qué es un examen de validación universitario?',
    a: 'Es una evaluación que permite demostrar conocimientos previos o aprobar asignaturas mediante una prueba. Suele usarse en procesos de homologación, regularización académica o reconocimiento de aprendizajes.',
  },
  {
    q: '¿Cómo prepararme para aprobar un examen de validación?',
    a: 'Lo más efectivo es estudiar por áreas temáticas, practicar con preguntas tipo examen y reforzar conceptos críticos. Un plan estructurado y simulacros aumentan la probabilidad de aprobación.',
  },
  {
    q: '¿Incluye simulacros y resolución paso a paso?',
    a: 'Sí. Trabajamos con simulacros tipo examen real y resolución guiada para que entiendas el razonamiento y no solo memorices respuestas.',
  },
]

const benefits = [
  {
    title: 'Repaso por áreas',
    desc: 'Organizamos contenidos por competencias y temas clave para estudiar con foco.',
  },
  {
    title: 'Simulacros tipo examen',
    desc: 'Entrenas con formato real para mejorar tiempo, precisión y seguridad.',
  },
  {
    title: 'Resolución paso a paso',
    desc: 'Explicamos el procedimiento para que aprendas la lógica detrás de cada ejercicio.',
  },
  {
    title: 'Orientación personalizada',
    desc: 'Te guiamos según tu carrera, tu nivel y el tipo de validación que necesitas.',
  },
]

export default function ExamenesValidacionPage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* FAQ Schema (Rich Results) */}
      <Script
        id="faq-jsonld-examenes-validacion"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-white" />
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-indigo-100/50 blur-3xl" />
        <div className="absolute -top-10 -left-24 h-72 w-72 rounded-full bg-blue-100/40 blur-3xl" />

        <section className="relative max-w-6xl mx-auto px-6 pt-10 pb-12">
          {/* Breadcrumbs */}
          <nav className="text-sm text-slate-600 flex items-center gap-2">
            <Link href="/" className="hover:text-slate-900 transition">
              Inicio
            </Link>
            <span className="text-slate-400">/</span>
            <Link href="/servicios" className="hover:text-slate-900 transition">
              Servicios
            </Link>
            <span className="text-slate-400">/</span>
            <span className="text-slate-900 font-medium">Exámenes de Validación</span>
          </nav>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 shadow-sm">
                <ShieldCheck className="h-4 w-4 text-indigo-700" />
                Preparación universitaria • Ecuador
              </div>

              <h1 className="mt-5 text-4xl md:text-5xl font-semibold tracking-tight">
                Exámenes de Validación en Ecuador:{' '}
                <span className="text-indigo-700">prepárate con estrategia</span>
              </h1>

              <p className="mt-5 text-lg text-slate-700 leading-relaxed max-w-2xl">
                Te ayudamos a prepararte para tu examen de validación universitaria con repaso por
                áreas, simulacros tipo examen real y resolución explicada paso a paso. Enfoque
                práctico, estructurado y adaptado a tus necesidades.
              </p>

              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/contacto"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-white font-semibold hover:bg-black transition shadow-sm"
                >
                  Solicitar preparación <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/servicios"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-slate-900 font-semibold hover:bg-slate-50 transition"
                >
                  Ver todos los servicios
                </Link>
              </div>

              {/* Quick bullets */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Bullet text="Preparación por competencias y materias" />
                <Bullet text="Simulacros tipo examen real" />
                <Bullet text="Resolución explicada paso a paso" />
                <Bullet text="Orientación académica personalizada" />
              </div>
            </div>

            {/* Side card */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="p-6 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-indigo-700" />
                    <h2 className="text-lg font-semibold">¿Qué incluye la preparación?</h2>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    Un plan claro para estudiar con foco y evaluar tu avance.
                  </p>
                </div>

                <div className="p-6 space-y-3">
                  <MiniItem
                    title="Diagnóstico inicial"
                    desc="Identificamos tu nivel y definimos temas prioritarios."
                    icon={<ClipboardList className="h-5 w-5 text-slate-900" />}
                  />
                  <MiniItem
                    title="Plan de estudio"
                    desc="Ruta semanal por áreas + ejercicios clave para validar."
                    icon={<ClipboardList className="h-5 w-5 text-slate-900" />}
                  />
                  <MiniItem
                    title="Simulacros + feedback"
                    desc="Practicas y corregimos contigo para subir tu puntaje."
                    icon={<ClipboardList className="h-5 w-5 text-slate-900" />}
                  />

                  <div className="pt-2">
                    <Link
                      href="/contacto"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-700 px-5 py-3 text-white font-semibold hover:bg-indigo-800 transition"
                    >
                      Agendar orientación <ArrowRight className="h-4 w-4" />
                    </Link>
                    <p className="mt-3 text-xs text-slate-500 text-center">
                      Orientación académica independiente. No afiliados a universidades.
                    </p>
                  </div>
                </div>
              </div>

              {/* Benefits cards */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {benefits.map((b) => (
                  <div
                    key={b.title}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <p className="font-semibold text-slate-900">{b.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{b.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* SEO contenido extendido */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="mt-2 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-2xl font-semibold">¿Qué es un examen de validación?</h2>
            <p className="mt-2 text-slate-600">
              Concepto, propósito y cómo aumentar tu probabilidad de aprobación.
            </p>
          </div>

          <div className="p-6">
            <p className="text-slate-700 leading-relaxed">
              El examen de validación es una evaluación académica que permite comprobar
              conocimientos previos o aprobar asignaturas. En Ecuador, este tipo de evaluación puede
              utilizarse para procesos de homologación, regularización académica o reconocimiento de
              aprendizajes.
            </p>

            <h3 className="text-xl font-semibold mt-8">¿Cómo prepararte correctamente?</h3>

            <p className="mt-3 text-slate-700 leading-relaxed">
              La clave está en estudiar por áreas temáticas, practicar con preguntas tipo examen y
              reforzar conceptos críticos. Una estrategia estructurada con simulacros y
              retroalimentación mejora el desempeño y reduce errores por tiempo o nervios.
            </p>
          </div>
        </div>

        {/* FAQ visible */}
        <div className="mt-10 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-2xl font-semibold">Preguntas frecuentes</h2>
            <p className="mt-2 text-slate-600">
              Respuestas rápidas sobre validación, simulacros y metodología.
            </p>
          </div>
          <div className="p-6 space-y-6">
            {faq.map((item) => (
              <div key={item.q} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="font-semibold text-slate-900">{item.q}</h3>
                <p className="mt-2 text-slate-700">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-6 text-xs text-slate-500">
          Orientación académica independiente. No afiliados a universidades.
        </p>
      </section>
    </main>
  )
}

/* ---------- UI helpers ---------- */

function Bullet({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <CheckCircle2 className="h-5 w-5 text-indigo-700 mt-0.5" />
      <p className="text-sm text-slate-700">{text}</p>
    </div>
  )
}

function MiniItem({ title, desc, icon }: { title: string; desc: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="rounded-lg border border-slate-200 bg-white p-2">{icon}</div>
      <div>
        <p className="font-semibold text-slate-900">{title}</p>
        <p className="mt-1 text-sm text-slate-600">{desc}</p>
      </div>
    </div>
  )
}

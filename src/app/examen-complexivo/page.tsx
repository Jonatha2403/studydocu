// src/app/examen-complexivo/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import type { ReactNode } from 'react'
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, ClipboardList } from 'lucide-react'

/** ✅ CAMBIA TU NÚMERO AQUÍ (sin +, sin espacios) */
const WHATSAPP_NUMBER = '593958757302'

function buildWhatsAppLink(message: string) {
  const text = encodeURIComponent(message)
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`
}

const WHATSAPP_MSG_APOYO =
  'Hola StudyDocu, quiero solicitar apoyo para mi examen complexivo. ¿Me pueden ayudar con orientación y simulacros?'

const WHATSAPP_MSG_AGENDAR =
  'Hola StudyDocu, quiero agendar una orientación para preparar mi examen complexivo. ¿Qué horarios tienen disponibles?'

export const metadata: Metadata = {
  title: 'Examen Complexivo en Ecuador | Preparación Académica – StudyDocu',
  description:
    'Preparación para examen complexivo en Ecuador. Acompañamiento estratégico, repaso por áreas, simulacros y orientación académica profesional.',
  keywords: [
    'examen complexivo Ecuador',
    'preparación examen complexivo',
    'ayuda examen complexivo',
    'complexivo UTPL',
    'simulacros complexivo',
    'guia examen complexivo',
  ],
  alternates: { canonical: 'https://studydocu.ec/examen-complexivo' },
  openGraph: {
    title: 'Examen Complexivo en Ecuador | StudyDocu',
    description:
      'Prepárate para el examen complexivo con repaso por áreas, simulacros tipo examen real y explicación paso a paso.',
    url: 'https://studydocu.ec/examen-complexivo',
    siteName: 'StudyDocu',
    locale: 'es_EC',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Examen Complexivo en Ecuador | StudyDocu',
    description:
      'Preparación estratégica para examen complexivo: repaso por áreas, simulacros y orientación académica.',
  },
}

const faq = [
  {
    q: '¿Qué es el examen complexivo?',
    a: 'Es una evaluación integradora que mide competencias y conocimientos clave de la carrera. Puede incluir preguntas teóricas, casos, ejercicios y componentes prácticos según la universidad.',
  },
  {
    q: '¿Cómo prepararme para aprobar el complexivo?',
    a: 'Lo más efectivo es estudiar por áreas, practicar con simulacros tipo examen, reforzar temas de mayor peso y corregir errores frecuentes con retroalimentación.',
  },
  {
    q: '¿Incluye simulacros y explicación paso a paso?',
    a: 'Sí. Trabajamos con simulacros y resolución guiada para que entiendas el razonamiento y mejores tu rendimiento.',
  },
]

const benefits = [
  'Simulacros tipo examen real',
  'Repaso por áreas clave',
  'Explicaciones paso a paso',
  'Orientación personalizada',
]

export default function ExamenComplexivoPage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  const whatsappApoYoHref = buildWhatsAppLink(WHATSAPP_MSG_APOYO)
  const whatsappAgendarHref = buildWhatsAppLink(WHATSAPP_MSG_AGENDAR)

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* FAQ Schema (Rich Results) */}
      <Script
        id="faq-jsonld-examen-complexivo"
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
            <span className="text-slate-900 font-medium">Examen Complexivo</span>
          </nav>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 shadow-sm">
                <ShieldCheck className="h-4 w-4 text-indigo-700" />
                Preparación universitaria • Ecuador
              </div>

              <h1 className="mt-5 text-4xl md:text-5xl font-semibold tracking-tight">
                Examen complexivo en Ecuador:{' '}
                <span className="text-indigo-700">prepárate con estrategia</span>
              </h1>

              <p className="mt-5 text-lg text-slate-700 leading-relaxed max-w-2xl">
                Te ayudamos a prepararte para tu examen complexivo con repaso estructurado por
                áreas, simulacros tipo examen real y explicación paso a paso. Enfoque práctico para
                mejorar tu rendimiento y aumentar la probabilidad de aprobación.
              </p>

              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                {/* ✅ WhatsApp: Solicitar apoyo */}
                <a
                  href={whatsappApoYoHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-white font-semibold hover:bg-black transition shadow-sm"
                >
                  Solicitar apoyo <ArrowRight className="h-4 w-4" />
                </a>

                <Link
                  href="/servicios"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-slate-900 font-semibold hover:bg-slate-50 transition"
                >
                  Ver servicios
                </Link>
              </div>

              {/* Quick bullets */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {benefits.map((b) => (
                  <Bullet key={b} text={b} />
                ))}
              </div>
            </div>

            {/* Side card */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="p-6 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-indigo-700" />
                    <h2 className="text-lg font-semibold">¿Cómo trabajamos contigo?</h2>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    Un flujo simple para estudiar con foco y subir tu nota.
                  </p>
                </div>

                <div className="p-6 space-y-3">
                  <MiniItem
                    title="Diagnóstico rápido"
                    desc="Revisamos temario, áreas y nivel para priorizar."
                    icon={<ClipboardList className="h-5 w-5 text-slate-900" />}
                  />
                  <MiniItem
                    title="Repaso + práctica"
                    desc="Teoría esencial + ejercicios con explicación paso a paso."
                    icon={<ClipboardList className="h-5 w-5 text-slate-900" />}
                  />
                  <MiniItem
                    title="Simulación final"
                    desc="Simulacro tipo examen y corrección con feedback."
                    icon={<ClipboardList className="h-5 w-5 text-slate-900" />}
                  />

                  <div className="pt-2">
                    {/* ✅ WhatsApp: Agendar orientación */}
                    <a
                      href={whatsappAgendarHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-700 px-5 py-3 text-white font-semibold hover:bg-indigo-800 transition"
                    >
                      Agendar orientación <ArrowRight className="h-4 w-4" />
                    </a>

                    <p className="mt-3 text-xs text-slate-500 text-center">
                      Orientación académica independiente. No afiliados a universidades.
                    </p>
                  </div>
                </div>
              </div>

              {/* Extra SEO box */}
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <h2 className="text-base font-semibold text-slate-900">
                  Tip rápido para el complexivo
                </h2>
                <p className="mt-2 text-sm text-slate-700">
                  Enfócate en áreas de mayor peso, practica con tiempo real y revisa tus errores
                  típicos. La mejora más grande viene de simulacros + corrección guiada.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* FAQ visible */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="mt-2 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-2xl font-semibold">Preguntas frecuentes</h2>
            <p className="mt-2 text-slate-600">
              Respuestas rápidas sobre el examen complexivo y cómo prepararte.
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

function MiniItem({ title, desc, icon }: { title: string; desc: string; icon: ReactNode }) {
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

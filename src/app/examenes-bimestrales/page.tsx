// src/app/examenes-bimestrales/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, ClipboardList } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Exámenes Bimestrales en Ecuador | Apoyo Académico – StudyDocu',
  description:
    'Apoyo en exámenes bimestrales, parciales, quices y recuperaciones universitarias en Ecuador. Explicaciones claras, práctica guiada y acompañamiento académico profesional.',
  keywords: [
    'examenes bimestrales Ecuador',
    'examen parcial universidad',
    'quices universidad',
    'recuperacion examen',
    'apoyo academico Ecuador',
    'preparacion examen parcial',
  ],
  alternates: { canonical: 'https://studydocu.ec/examenes-bimestrales' },
  openGraph: {
    title: 'Exámenes Bimestrales y Parciales en Ecuador | StudyDocu',
    description:
      'Apoyo académico para exámenes parciales, bimestrales, quices y recuperaciones: explicación paso a paso y práctica guiada.',
    url: 'https://studydocu.ec/examenes-bimestrales',
    siteName: 'StudyDocu',
    locale: 'es_EC',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Exámenes Bimestrales y Parciales | StudyDocu',
    description:
      'Apoyo académico para exámenes bimestrales, parciales, quices y recuperaciones en Ecuador.',
  },
}

const faq = [
  {
    q: '¿En qué tipos de evaluaciones ayudan?',
    a: 'Apoyamos en exámenes bimestrales, parciales, quices, lecciones y recuperaciones. Nos adaptamos a la materia, el temario y el tipo de evaluación.',
  },
  {
    q: '¿Cómo es la preparación?',
    a: 'Trabajamos con un repaso estructurado por temas, ejercicios guiados paso a paso y práctica con preguntas tipo examen para mejorar rendimiento y tiempo.',
  },
  {
    q: '¿Pueden ayudar con ejercicios y problemas?',
    a: 'Sí. Explicamos el procedimiento, reforzamos conceptos y te dejamos práctica para que puedas resolver por tu cuenta con confianza.',
  },
]

const benefits = [
  'Preparación por materias y temas clave',
  'Explicación paso a paso y métodos rápidos',
  'Simulaciones tipo examen (tiempo y formato)',
  'Orientación académica personalizada',
]

export default function ExamenesBimestralesPage() {
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
        id="faq-jsonld-examenes-bimestrales"
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
            <span className="text-slate-900 font-medium">Exámenes Bimestrales</span>
          </nav>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 shadow-sm">
                <ShieldCheck className="h-4 w-4 text-indigo-700" />
                Apoyo académico • Ecuador
              </div>

              <h1 className="mt-5 text-4xl md:text-5xl font-semibold tracking-tight">
                Exámenes bimestrales y parciales:{' '}
                <span className="text-indigo-700">prepárate con claridad</span>
              </h1>

              <p className="mt-5 text-lg text-slate-700 leading-relaxed max-w-2xl">
                Te apoyamos en evaluaciones parciales, quices y recuperaciones con un enfoque en
                comprensión real: explicación paso a paso, práctica guiada y simulaciones tipo
                examen para mejorar tu desempeño.
              </p>

              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/contacto"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-white font-semibold hover:bg-black transition shadow-sm"
                >
                  Solicitar apoyo <ArrowRight className="h-4 w-4" />
                </Link>

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
                    Un plan simple para estudiar con foco y subir tu nota.
                  </p>
                </div>

                <div className="p-6 space-y-3">
                  <MiniItem
                    title="Diagnóstico rápido"
                    desc="Revisamos temario, nivel y tipo de evaluación."
                    icon={<ClipboardList className="h-5 w-5 text-slate-900" />}
                  />
                  <MiniItem
                    title="Repaso + ejercicios"
                    desc="Explicación paso a paso y práctica guiada."
                    icon={<ClipboardList className="h-5 w-5 text-slate-900" />}
                  />
                  <MiniItem
                    title="Simulación final"
                    desc="Preguntas tipo examen para reforzar tiempo y seguridad."
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

              {/* Extra SEO box */}
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <h2 className="text-base font-semibold text-slate-900">
                  Consejos para rendir mejor en parciales
                </h2>
                <p className="mt-2 text-sm text-slate-700">
                  Prioriza temas de mayor peso, practica ejercicios similares a los del examen y
                  repasa errores típicos. Con simulaciones, mejoras tu tiempo y reduces nervios.
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
              Respuestas rápidas sobre exámenes parciales, quices y recuperaciones.
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

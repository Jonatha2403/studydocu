// src/app/tesis-maestria/page.tsx
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ClipboardList,
  BookOpenCheck,
  Target,
  FileText,
  Sparkles,
  GraduationCap,
  BadgeCheck,
  BarChart3,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Tesis de Maestría en Ecuador | Asesoría Profesional – StudyDocu',
  description:
    'Asesoría para tesis de maestría en Ecuador: estado del arte, metodología rigurosa, análisis (cuali/cuanti/mixto), normas APA y preparación para defensa.',
  keywords: [
    'tesis maestría Ecuador',
    'tesis de maestria',
    'ayuda tesis maestria',
    'asesoría tesis maestría',
    'marco teórico maestría',
    'estado del arte',
    'metodología cuantitativa',
    'metodología cualitativa',
    'normas APA maestría',
    'defensa tesis maestría',
  ],
  alternates: { canonical: 'https://studydocu.ec/tesis-maestria' },
  openGraph: {
    title: 'Tesis de Maestría en Ecuador | StudyDocu',
    description:
      'Acompañamiento profesional para tesis de maestría: estado del arte, metodología rigurosa, análisis y APA.',
    url: 'https://studydocu.ec/tesis-maestria',
    siteName: 'StudyDocu',
    locale: 'es_EC',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tesis de Maestría en Ecuador | StudyDocu',
    description:
      'Asesoría para tesis de maestría: estado del arte, metodología rigurosa, análisis y normas APA.',
  },
}

const faq = [
  {
    q: '¿Qué incluye la asesoría para tesis de maestría?',
    a: 'Incluye acompañamiento por etapas: definición y delimitación del tema, planteamiento del problema, estado del arte, diseño metodológico, construcción/validación de instrumentos, análisis de resultados, normas APA y preparación para defensa.',
  },
  {
    q: '¿Pueden ayudar con enfoque cualitativo, cuantitativo o mixto?',
    a: 'Sí. Adaptamos el diseño metodológico al enfoque del programa: cualitativo (entrevistas, categorías, codificación), cuantitativo (variables, hipótesis, modelos), o mixto (triangulación).',
  },
  {
    q: '¿Trabajan con lineamientos de universidades de Ecuador?',
    a: 'Podemos orientarte considerando el formato y lineamientos de tu universidad (por ejemplo UTPL y otras). La asesoría es independiente y se ajusta a tu carrera, modalidad y requisitos.',
  },
  {
    q: '¿También preparan para la defensa?',
    a: 'Sí. Te ayudamos con guion, estructura de presentación, narrativa de resultados y posibles preguntas del jurado.',
  },
]

/* ---------------- WhatsApp helper ---------------- */
const WHATSAPP_NUMBER = '593958757302'
const buildWhatsAppLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`

export default function TesisMaestriaPage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  // ✅ Mensajes por botón
  const waSolicitarAsesoria = buildWhatsAppLink(
    'Hola StudyDocu 👋 Necesito asesoría para mi tesis de MAESTRÍA. Quiero apoyo en estado del arte, metodología, instrumentos, análisis y APA. Mi universidad/programa es ___.'
  )
  const waAgendarOrientacion = buildWhatsAppLink(
    'Hola StudyDocu 👋 Quiero AGENDAR una orientación para tesis de maestría. Tema (breve): ___. Enfoque (cuali/cuanti/mixto): ___.'
  )
  const waAvanzarTesis = buildWhatsAppLink(
    'Hola StudyDocu 👋 Quiero avanzar mi tesis de MAESTRÍA. Estoy en la etapa de ___ (tema/problema/estado del arte/metodología/resultados/discusión/defensa). ¿Cómo empezamos?'
  )
  const waContactar = buildWhatsAppLink(
    'Hola StudyDocu 👋 Quiero contactarlos por asesoría de tesis de maestría. ¿Tienen disponibilidad hoy?'
  )

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Script
        id="faq-jsonld-tesis-maestria"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero background */}
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
            <span className="text-slate-900 font-medium">Tesis Maestría</span>
          </nav>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 shadow-sm">
                <ShieldCheck className="h-4 w-4 text-indigo-700" />
                Posgrado • Enfoque riguroso • Ecuador
              </div>

              <h1 className="mt-5 text-4xl md:text-5xl font-semibold tracking-tight">
                Tesis de maestría en Ecuador:{' '}
                <span className="text-indigo-700">estado del arte, método y análisis</span>
              </h1>

              <p className="mt-5 text-lg text-slate-700 leading-relaxed max-w-2xl">
                La tesis de maestría exige rigor: un estado del arte sólido, metodología coherente y
                análisis defendible. En StudyDocu te acompañamos por etapas: tema, problema,
                objetivos, metodología, instrumentos, análisis de resultados, normas APA y defensa.
              </p>

              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                {/* ✅ Solicitar asesoría -> WhatsApp */}
                <Link
                  href={waSolicitarAsesoria}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-white font-semibold hover:bg-black transition shadow-sm"
                >
                  Solicitar asesoría <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/ayuda-en-tesis-ecuador"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-slate-900 font-semibold hover:bg-slate-50 transition"
                >
                  Ver ayuda en tesis
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <TrustItem
                  icon={<BadgeCheck className="h-5 w-5 text-indigo-700" />}
                  text="Estado del arte y marco teórico avanzado"
                />
                <TrustItem
                  icon={<Target className="h-5 w-5 text-indigo-700" />}
                  text="Metodología rigurosa (cuali/cuanti/mixta)"
                />
                <TrustItem
                  icon={<BarChart3 className="h-5 w-5 text-indigo-700" />}
                  text="Análisis robusto y discusión defendible"
                />
                <TrustItem
                  icon={<BookOpenCheck className="h-5 w-5 text-indigo-700" />}
                  text="APA y presentación formal del documento"
                />
              </div>
            </div>

            {/* Side card */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="p-6 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-indigo-700" />
                    <h2 className="text-lg font-semibold">Qué incluye el acompañamiento</h2>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    Avance por entregas, con revisión y mejoras continuas.
                  </p>
                </div>

                <div className="p-6 space-y-4">
                  <MiniItem
                    icon={<GraduationCap className="h-5 w-5 text-slate-900" />}
                    title="Tema, problema y objetivos"
                    desc="Delimitación, justificación, preguntas y objetivos medibles."
                  />
                  <MiniItem
                    icon={<FileText className="h-5 w-5 text-slate-900" />}
                    title="Estado del arte"
                    desc="Búsqueda, síntesis crítica y brechas de investigación."
                  />
                  <MiniItem
                    icon={<ClipboardList className="h-5 w-5 text-slate-900" />}
                    title="Metodología e instrumentos"
                    desc="Diseño, variables/categorías, validez y procedimiento."
                  />
                  <MiniItem
                    icon={<BarChart3 className="h-5 w-5 text-slate-900" />}
                    title="Resultados y discusión"
                    desc="Análisis y redacción defendible para el jurado."
                  />

                  <div className="pt-2">
                    {/* ✅ Agendar orientación -> WhatsApp */}
                    <Link
                      href={waAgendarOrientacion}
                      target="_blank"
                      rel="noopener noreferrer"
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

              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-700">Páginas relacionadas:</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <ChipLink href="/tesis-pregrado" label="Tesis Pregrado" />
                  <ChipLink href="/tesis-doctorado" label="Tesis Doctorado" />
                  <ChipLink href="/tesis-utpl" label="Tesis UTPL" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Body */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-2xl font-semibold">Proceso recomendado (maestría)</h2>
            <p className="mt-2 text-slate-600">
              Un flujo claro para avanzar con rigor, sin perder tiempo en retrabajos.
            </p>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Step
              n="1"
              title="Diagnóstico y enfoque"
              desc="Revisamos requisitos del programa y definimos el enfoque metodológico."
            />
            <Step
              n="2"
              title="Estado del arte + método"
              desc="Marco teórico avanzado, instrumento y plan de análisis."
            />
            <Step
              n="3"
              title="Resultados + defensa"
              desc="Discusión, APA, formato final y preparación para sustentación."
            />
          </div>
        </div>

        {/* Estructura */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-2xl font-semibold">Estructura típica de tesis de maestría</h2>
              <p className="mt-2 text-slate-600">
                La estructura puede variar por programa, pero suele incluir:
              </p>
            </div>
            <div className="p-6">
              <ol className="list-decimal pl-5 space-y-2 text-slate-700">
                <li>Introducción y planteamiento del problema</li>
                <li>Objetivos, preguntas e hipótesis (si aplica)</li>
                <li>Estado del arte / marco teórico avanzado</li>
                <li>Metodología (diseño, muestra, instrumentos, procedimiento)</li>
                <li>Resultados</li>
                <li>Discusión y conclusiones</li>
                <li>Referencias (APA) y anexos</li>
              </ol>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-2xl font-semibold">Qué te ayudamos a mejorar</h2>
              <p className="mt-2 text-slate-600">
                Detalles que elevan calidad y reducen observaciones.
              </p>
            </div>
            <div className="p-6 space-y-3">
              <IncludeItem text="Coherencia: problema → objetivos → método → resultados" />
              <IncludeItem text="Estado del arte: síntesis crítica y brecha de investigación" />
              <IncludeItem text="Instrumentos: validez, confiabilidad y procedimiento" />
              <IncludeItem text="Análisis y discusión defendible para jurado" />
              <IncludeItem text="Formato APA: citas, referencias, tablas y figuras" />

              <div className="pt-3">
                {/* ✅ Quiero avanzar mi tesis -> WhatsApp */}
                <Link
                  href={waAvanzarTesis}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-white font-semibold hover:bg-black transition"
                >
                  Quiero avanzar mi tesis <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-10 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-2xl font-semibold">Preguntas frecuentes</h2>
            <p className="mt-2 text-slate-600">
              Respuestas rápidas sobre tesis de maestría en Ecuador.
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

        {/* Final CTA */}
        <div className="mt-10 rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-white shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h2 className="text-2xl font-semibold">¿Listo para avanzar tu tesis de maestría?</h2>
              <p className="mt-2 text-white/80 max-w-2xl">
                Trabajemos por etapas: estado del arte, metodología, análisis, APA y defensa.
                Comunicación clara, entregas parciales y enfoque profesional.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              {/* ✅ Contactar -> WhatsApp */}
              <Link
                href={waContactar}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-slate-900 font-semibold hover:bg-slate-100 transition"
              >
                Contactar <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/servicios"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-3 text-white font-semibold hover:bg-white/10 transition"
              >
                Ver servicios
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-6 text-xs text-slate-500">
          Nota: StudyDocu ofrece orientación académica independiente. No somos una entidad afiliada
          a universidades.
        </p>
      </section>
    </main>
  )
}

/* ---------- UI helpers ---------- */

function TrustItem({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mt-0.5">{icon}</div>
      <p className="text-sm text-slate-700">{text}</p>
    </div>
  )
}

function Step({ n, title, desc }: { n: string; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-semibold">
          {n}
        </div>
        <p className="font-semibold text-slate-900">{title}</p>
      </div>
      <p className="mt-3 text-sm text-slate-700 leading-relaxed">{desc}</p>
    </div>
  )
}

function IncludeItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2">
      <CheckCircle2 className="h-5 w-5 text-indigo-700 mt-0.5" />
      <p className="text-sm text-slate-700">{text}</p>
    </div>
  )
}

function MiniItem({ icon, title, desc }: { icon: ReactNode; title: string; desc: string }) {
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

function ChipLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="text-sm rounded-full border border-slate-200 bg-white px-3 py-1 hover:bg-slate-50 transition"
    >
      {label}
    </Link>
  )
}

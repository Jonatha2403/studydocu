// src/app/tesis-doctorado/page.tsx
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
  FileText,
  Sparkles,
  GraduationCap,
  BadgeCheck,
  FlaskConical,
  Target,
  Lightbulb,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Tesis de Doctorado en Ecuador | Asesoría de Alto Nivel – StudyDocu',
  description:
    'Asesoría para tesis doctoral en Ecuador: aporte original, rigor metodológico, validación, análisis avanzado, redacción científica, normas APA y preparación estratégica para defensa.',
  keywords: [
    'tesis doctorado Ecuador',
    'tesis doctoral Ecuador',
    'ayuda tesis doctoral',
    'asesoría tesis doctorado',
    'aporte científico',
    'estado del arte doctoral',
    'metodología doctoral',
    'defensa tesis doctoral',
    'normas APA doctorado',
  ],
  alternates: { canonical: 'https://studydocu.ec/tesis-doctorado' },
  openGraph: {
    title: 'Tesis de Doctorado en Ecuador | StudyDocu',
    description:
      'Acompañamiento doctoral: aporte original, validación metodológica, análisis y preparación para defensa.',
    url: 'https://studydocu.ec/tesis-doctorado',
    siteName: 'StudyDocu',
    locale: 'es_EC',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tesis de Doctorado en Ecuador | StudyDocu',
    description:
      'Asesoría doctoral: aporte científico, rigor metodológico, análisis avanzado y defensa.',
  },
}

const faq = [
  {
    q: '¿Qué hace diferente una tesis doctoral?',
    a: 'La tesis doctoral debe aportar conocimiento original. Exige un estado del arte profundo, metodología rigurosa, validación y una discusión sólida que sostenga el aporte científico.',
  },
  {
    q: '¿Incluye preparación para defensa doctoral?',
    a: 'Sí. Trabajamos la narrativa del aporte, estructura de presentación, anticipación de preguntas y estrategia de respuesta basada en evidencia.',
  },
  {
    q: '¿Pueden apoyar enfoques cualitativos, cuantitativos o mixtos?',
    a: 'Sí. Ajustamos el diseño según el campo y el programa: validez, confiabilidad/credibilidad, triangulación, robustez y coherencia con objetivos.',
  },
  {
    q: '¿Ayudan con redacción científica y APA?',
    a: 'Sí. Mejoramos claridad, coherencia, estilo académico y ordenamos citas/referencias según normas APA y lineamientos institucionales.',
  },
]

/* ---------------- WhatsApp helper ---------------- */
const WHATSAPP_NUMBER = '593958757302'
const buildWhatsAppLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`

export default function TesisDoctoradoPage() {
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
    'Hola StudyDocu 👋 Necesito asesoría para mi tesis de DOCTORADO. Quiero revisar aporte, metodología, análisis y plan de defensa. Mi programa/universidad es ___.'
  )
  const waAgendarOrientacion = buildWhatsAppLink(
    'Hola StudyDocu 👋 Quiero AGENDAR una orientación para tesis doctoral. Tema (breve): ___. Enfoque (cuali/cuanti/mixto): ___.'
  )
  const waAvanzarTesis = buildWhatsAppLink(
    'Hola StudyDocu 👋 Quiero avanzar mi tesis DOCTORAL. Estoy en la etapa de ___ (problema/estado del arte/metodología/resultados/discusión/defensa). ¿Cómo empezamos?'
  )
  const waContactar = buildWhatsAppLink(
    'Hola StudyDocu 👋 Quiero contactarlos por asesoría de tesis doctoral. ¿Tienen disponibilidad hoy?'
  )

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Script
        id="faq-jsonld-tesis-doctorado"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-white" />
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-100/50 blur-3xl" />
        <div className="absolute -top-10 -left-24 h-72 w-72 rounded-full bg-indigo-100/40 blur-3xl" />

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
            <span className="text-slate-900 font-medium">Tesis Doctorado</span>
          </nav>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 shadow-sm">
                <ShieldCheck className="h-4 w-4 text-blue-700" />
                Doctorado • Rigor científico • Ecuador
              </div>

              <h1 className="mt-5 text-4xl md:text-5xl font-semibold tracking-tight">
                Tesis de doctorado en Ecuador:{' '}
                <span className="text-blue-700">aporte original y defensa sólida</span>
              </h1>

              <p className="mt-5 text-lg text-slate-700 leading-relaxed max-w-2xl">
                Un doctorado requiere aporte científico, método validado y una discusión defendible.
                En StudyDocu te acompañamos por etapas: problema, estado del arte profundo,
                metodología rigurosa, análisis, redacción científica, APA y preparación estratégica
                para defensa doctoral.
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
                  href="/tesis-maestria"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-slate-900 font-semibold hover:bg-slate-50 transition"
                >
                  Ver Tesis Maestría
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <TrustItem
                  icon={<Lightbulb className="h-5 w-5 text-blue-700" />}
                  text="Definición del aporte científico (originalidad)"
                />
                <TrustItem
                  icon={<FlaskConical className="h-5 w-5 text-blue-700" />}
                  text="Validación metodológica y robustez"
                />
                <TrustItem
                  icon={<Target className="h-5 w-5 text-blue-700" />}
                  text="Coherencia: problema → método → evidencia"
                />
                <TrustItem
                  icon={<BookOpenCheck className="h-5 w-5 text-blue-700" />}
                  text="Redacción científica + normas APA"
                />
              </div>
            </div>

            {/* Side card */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="p-6 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-blue-700" />
                    <h2 className="text-lg font-semibold">Qué incluye el acompañamiento</h2>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    Enfoque doctoral: aporte, evidencia y defensa.
                  </p>
                </div>

                <div className="p-6 space-y-4">
                  <MiniItem
                    icon={<GraduationCap className="h-5 w-5 text-slate-900" />}
                    title="Problema + aporte"
                    desc="Delimitación, objetivos y definición del aporte original."
                  />
                  <MiniItem
                    icon={<FileText className="h-5 w-5 text-slate-900" />}
                    title="Estado del arte profundo"
                    desc="Síntesis crítica, brechas y posicionamiento teórico."
                  />
                  <MiniItem
                    icon={<ClipboardList className="h-5 w-5 text-slate-900" />}
                    title="Metodología y validación"
                    desc="Diseño, instrumentos, criterios de calidad y robustez."
                  />
                  <MiniItem
                    icon={<BadgeCheck className="h-5 w-5 text-slate-900" />}
                    title="Defensa doctoral"
                    desc="Guion, presentación, estrategia de preguntas del jurado."
                  />

                  <div className="pt-2">
                    {/* ✅ Agendar orientación -> WhatsApp */}
                    <Link
                      href={waAgendarOrientacion}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-white font-semibold hover:bg-blue-800 transition"
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
                  <ChipLink href="/tesis-maestria" label="Tesis Maestría" />
                  <ChipLink href="/ayuda-en-tesis-ecuador" label="Ayuda en Tesis Ecuador" />
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
            <h2 className="text-2xl font-semibold">Proceso recomendado (doctorado)</h2>
            <p className="mt-2 text-slate-600">
              Un flujo para sostener tu aporte con evidencia y una defensa estratégica.
            </p>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Step
              n="1"
              title="Aporte + enfoque"
              desc="Definimos el aporte original y el marco teórico para posicionarlo."
            />
            <Step
              n="2"
              title="Método + validación"
              desc="Rigor metodológico, criterios de calidad y plan de análisis."
            />
            <Step
              n="3"
              title="Discusión + defensa"
              desc="Argumento, evidencia, APA y preparación estratégica del jurado."
            />
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-2xl font-semibold">Estructura típica de tesis doctoral</h2>
              <p className="mt-2 text-slate-600">Suele incluir los siguientes componentes:</p>
            </div>
            <div className="p-6">
              <ol className="list-decimal pl-5 space-y-2 text-slate-700">
                <li>Introducción, problema y aporte científico</li>
                <li>Estado del arte y marco teórico profundo</li>
                <li>Metodología rigurosa y validación</li>
                <li>Resultados</li>
                <li>Discusión y aportes (teóricos/prácticos)</li>
                <li>Conclusiones, limitaciones y futuras líneas</li>
                <li>Referencias (APA) y anexos</li>
              </ol>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-2xl font-semibold">Qué te ayudamos a fortalecer</h2>
              <p className="mt-2 text-slate-600">Enfoque doctoral: rigor, evidencia y defensa.</p>
            </div>
            <div className="p-6 space-y-3">
              <IncludeItem text="Aporte original y coherencia del argumento" />
              <IncludeItem text="Criterios de calidad: validez/robustez/credibilidad" />
              <IncludeItem text="Discusión: sostener el aporte con evidencia" />
              <IncludeItem text="Redacción científica clara y formal" />
              <IncludeItem text="APA: citas, referencias, figuras y tablas" />

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
              Respuestas rápidas sobre tesis doctoral en Ecuador.
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
              <h2 className="text-2xl font-semibold">¿Listo para fortalecer tu tesis doctoral?</h2>
              <p className="mt-2 text-white/80 max-w-2xl">
                Aporte, método, evidencia y defensa: trabajamos por etapas con revisión continua y
                enfoque académico profesional.
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
      <CheckCircle2 className="h-5 w-5 text-blue-700 mt-0.5" />
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

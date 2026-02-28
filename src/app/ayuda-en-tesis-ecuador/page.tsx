// src/app/ayuda-en-tesis-ecuador/page.tsx
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
  Building2,
  School,
  BadgeCheck,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Ayuda en Tesis en Ecuador | Asesoría Académica Profesional – StudyDocu',
  description:
    'Ayuda en tesis en Ecuador: asesoría académica profesional para pregrado, maestría y doctorado. Apoyo en tema, propuesta, marco teórico, metodología, normas APA, análisis y defensa final.',
  keywords: [
    'ayuda en tesis Ecuador',
    'ayuda tesis',
    'asesoría de tesis Ecuador',
    'hacer tesis en Ecuador',
    'asesoría tesis',
    'tesis pregrado Ecuador',
    'tesis maestría Ecuador',
    'tesis doctorado Ecuador',
    'normas APA Ecuador',
    'trabajo de titulación Ecuador',
  ],
  alternates: { canonical: 'https://studydocu.ec/ayuda-en-tesis-ecuador' },
  openGraph: {
    title: 'Ayuda en Tesis en Ecuador | StudyDocu',
    description:
      'Asesoría académica profesional para tesis en Ecuador: propuesta, marco teórico, metodología, APA, análisis y defensa final.',
    url: 'https://studydocu.ec/ayuda-en-tesis-ecuador',
    siteName: 'StudyDocu',
    locale: 'es_EC',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ayuda en Tesis en Ecuador | StudyDocu',
    description:
      'Asesoría profesional para tesis en Ecuador: estructura, metodología, APA y defensa.',
  },
}

const faq = [
  {
    q: '¿Qué incluye la ayuda en tesis en Ecuador?',
    a: 'Incluye orientación académica por etapas: elección del tema, propuesta, marco teórico, metodología, análisis de resultados, revisión de normas APA, correcciones y preparación para defensa final.',
  },
  {
    q: '¿Ayudan con tesis de pregrado, maestría y doctorado?',
    a: 'Sí. Adaptamos el acompañamiento al nivel (pregrado, maestría o doctorado) y al enfoque metodológico (cualitativo, cuantitativo o mixto), según requisitos de cada programa.',
  },
  {
    q: '¿Trabajan con universidades específicas como UTPL?',
    a: 'Podemos orientarte considerando lineamientos y formatos de universidades del Ecuador (por ejemplo UTPL y otras). La asesoría es independiente y se ajusta a tu carrera y modalidad.',
  },
  {
    q: '¿Es obligatorio usar normas APA?',
    a: 'En muchas universidades sí. Las normas APA se aplican a citas, referencias, tablas, figuras y presentación formal. Te ayudamos a corregir y ordenar todo el formato.',
  },
]

const relatedPages = [
  {
    href: '/tesis-pregrado',
    title: 'Tesis Pregrado',
    desc: 'Estructura, metodología y APA.',
    Icon: School,
  },
  {
    href: '/tesis-maestria',
    title: 'Tesis Maestría',
    desc: 'Rigor metodológico + análisis avanzado.',
    Icon: BadgeCheck,
  },
  {
    href: '/tesis-utpl',
    title: 'Tesis UTPL',
    desc: 'Pregrado, maestría y doctorado UTPL.',
    Icon: GraduationCap,
  },
]

export default function AyudaEnTesisEcuadorPage() {
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
        id="faq-jsonld-ayuda-tesis-ecuador"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero background */}
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
            <span className="text-slate-900 font-medium">Ayuda en Tesis Ecuador</span>
          </nav>

          {/* Hero */}
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 shadow-sm">
                <ShieldCheck className="h-4 w-4 text-blue-700" />
                Asesoría académica profesional • Ecuador
              </div>

              <h1 className="mt-5 text-4xl md:text-5xl font-semibold tracking-tight">
                Ayuda en tesis en Ecuador:{' '}
                <span className="text-blue-700">acompañamiento profesional por etapas</span>
              </h1>

              <p className="mt-5 text-lg text-slate-700 leading-relaxed max-w-2xl">
                Si necesitas ayuda con tu tesis en Ecuador, en StudyDocu te acompañamos desde el
                tema y la propuesta hasta la redacción final y la defensa. Trabajamos con estructura
                clara, metodología defendible y normas APA, adaptando el proceso a tu carrera,
                modalidad y requisitos universitarios.
              </p>

              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/contacto"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-white font-semibold hover:bg-black transition shadow-sm"
                >
                  Solicitar asesoría <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/tesis-pregrado"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-slate-900 font-semibold hover:bg-slate-50 transition"
                >
                  Ver Tesis Pregrado
                </Link>
              </div>

              {/* Trust bullets */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <TrustItem
                  icon={<CheckCircle2 className="h-5 w-5 text-blue-700" />}
                  text="Plan de trabajo y entregas por etapas"
                />
                <TrustItem
                  icon={<BookOpenCheck className="h-5 w-5 text-blue-700" />}
                  text="Normas APA: citas, referencias y formato"
                />
                <TrustItem
                  icon={<ClipboardList className="h-5 w-5 text-blue-700" />}
                  text="Metodología clara (cuali, cuanti o mixta)"
                />
                <TrustItem
                  icon={<ShieldCheck className="h-5 w-5 text-blue-700" />}
                  text="Confidencialidad y acompañamiento profesional"
                />
              </div>
            </div>

            {/* Side card */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="p-6 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-blue-700" />
                    <h2 className="text-lg font-semibold">¿Qué podemos ayudarte a resolver?</h2>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    Enfoque académico, adaptado a universidades del Ecuador.
                  </p>
                </div>

                <div className="p-6 space-y-4">
                  <MiniItem
                    icon={<Target className="h-5 w-5 text-slate-900" />}
                    title="Tema y delimitación"
                    desc="Elegir un tema viable, con alcance claro y objetivo medible."
                  />
                  <MiniItem
                    icon={<FileText className="h-5 w-5 text-slate-900" />}
                    title="Marco teórico"
                    desc="Fuentes confiables, síntesis, citas y coherencia argumentativa."
                  />
                  <MiniItem
                    icon={<ClipboardList className="h-5 w-5 text-slate-900" />}
                    title="Metodología"
                    desc="Diseño, población/muestra, variables, instrumentos y procedimiento."
                  />
                  <MiniItem
                    icon={<GraduationCap className="h-5 w-5 text-slate-900" />}
                    title="Defensa final"
                    desc="Guion, diapositivas, preguntas frecuentes y preparación."
                  />

                  <div className="pt-2">
                    <Link
                      href="/contacto"
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

              {/* ✅ Internal links PRO cards */}
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-700 font-medium">Más páginas útiles</p>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {relatedPages.map(({ href, title, desc, Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-slate-900" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900">{title}</p>
                          <p className="mt-1 text-xs text-slate-600 leading-snug">{desc}</p>
                          <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-700">
                            Ver página <ArrowRight className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
                <Link
                  href="/servicios"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold hover:bg-slate-50 transition"
                >
                  Ver todos los servicios <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Body */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        {/* Process */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-2xl font-semibold">Cómo trabajamos tu tesis en Ecuador</h2>
            <p className="mt-2 text-slate-600">
              Un proceso claro para avanzar rápido, con revisiones y entregas parciales.
            </p>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Step
              n="1"
              title="Diagnóstico y plan"
              desc="Requisitos, tema, cronograma y objetivos. Definimos entregas por etapas."
            />
            <Step
              n="2"
              title="Desarrollo académico"
              desc="Marco teórico, metodología, análisis y redacción con normas APA."
            />
            <Step
              n="3"
              title="Corrección y defensa"
              desc="Formato final, coherencia, referencias y preparación para sustentación."
            />
          </div>
        </div>

        {/* Levels */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-5">
          <LevelCard
            title="Pregrado"
            desc="Tema, propuesta, marco teórico, metodología, resultados y APA."
            href="/tesis-pregrado"
          />
          <LevelCard
            title="Maestría"
            desc="Estado del arte, método riguroso, análisis y redacción técnica."
            href="/tesis-maestria"
          />
          <LevelCard
            title="Doctorado"
            desc="Aporte científico, validación metodológica y defensa doctoral."
            href="/tesis-doctorado"
          />
        </div>

        {/* Universities */}
        <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-700" />
            <h2 className="text-xl font-semibold">Atendemos universidades en Ecuador</h2>
          </div>
          <p className="mt-2 text-slate-700">
            Brindamos ayuda en tesis en Ecuador para distintas universidades y modalidades
            (presencial y online). Adaptamos el acompañamiento a los lineamientos de tu carrera y a
            tus requisitos de entrega.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm rounded-full border border-slate-200 bg-white px-3 py-1">
              UTPL
            </span>
            <span className="text-sm rounded-full border border-slate-200 bg-white px-3 py-1">
              Universidades públicas
            </span>
            <span className="text-sm rounded-full border border-slate-200 bg-white px-3 py-1">
              Universidades privadas
            </span>
            <span className="text-sm rounded-full border border-slate-200 bg-white px-3 py-1">
              Presencial / Online
            </span>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-10 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-2xl font-semibold">Preguntas frecuentes</h2>
            <p className="mt-2 text-slate-600">
              Ayuda rápida sobre tesis en Ecuador, APA y metodología.
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
              <h2 className="text-2xl font-semibold">¿Necesitas ayuda con tu tesis en Ecuador?</h2>
              <p className="mt-2 text-white/80 max-w-2xl">
                Trabajemos por etapas: propuesta, marco teórico, metodología, resultados y defensa.
                Comunicación clara, entregas parciales y enfoque académico profesional.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/contacto"
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

function LevelCard({ title, desc, href }: { title: string; desc: string; href: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="p-6 border-b border-slate-200">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="mt-2 text-slate-600">{desc}</p>
      </div>
      <div className="p-6">
        <Link
          href={href}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-white font-semibold hover:bg-black transition"
        >
          Ver detalles <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
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

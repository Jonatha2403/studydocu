// src/app/tesis-pregrado/page.tsx
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  GraduationCap,
  ClipboardList,
  BookOpenCheck,
  Target,
  FileText,
  Sparkles,
  School,
  BadgeCheck,
  Globe2,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Tesis de Pregrado en Ecuador | Asesoría Profesional – StudyDocu',
  description:
    'Asesoría profesional para tesis de pregrado en Ecuador. Acompañamiento académico en tema, propuesta, marco teórico, metodología, normas APA, análisis y defensa final.',
  keywords: [
    'tesis pregrado',
    'tesis de pregrado Ecuador',
    'ayuda tesis pregrado',
    'asesoría tesis pregrado',
    'hacer tesis de pregrado',
    'trabajo de titulación',
    'redacción académica',
    'normas APA',
    'asesoría de tesis en Ecuador',
  ],
  alternates: { canonical: 'https://studydocu.ec/tesis-pregrado' },
  openGraph: {
    title: 'Tesis de Pregrado en Ecuador | Asesoría Profesional – StudyDocu',
    description:
      'Acompañamiento académico para tesis de pregrado: propuesta, marco teórico, metodología, APA, análisis y defensa final.',
    url: 'https://studydocu.ec/tesis-pregrado',
    siteName: 'StudyDocu',
    locale: 'es_EC',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tesis de Pregrado en Ecuador | StudyDocu',
    description:
      'Asesoría profesional para tesis de pregrado: estructura, metodología, APA y defensa.',
  },
}

const faq = [
  {
    q: '¿Qué es una tesis de pregrado en Ecuador?',
    a: 'Es un trabajo de titulación que demuestra competencias de investigación y redacción académica. Generalmente incluye planteamiento del problema, marco teórico, metodología, resultados, conclusiones y referencias bajo normas de citación como APA.',
  },
  {
    q: '¿Cómo elegir un buen tema para tesis de pregrado?',
    a: 'Un buen tema debe ser relevante, viable en tiempo y recursos, contar con fuentes disponibles y permitir una metodología clara. Recomendamos delimitarlo por población, contexto, periodo y variables para evitar temas muy amplios.',
  },
  {
    q: '¿La tesis de pregrado debe cumplir normas APA?',
    a: 'En la mayoría de universidades sí. Se aplican en citas, referencias, tablas, figuras y presentación formal del documento, según la versión solicitada por tu carrera o programa.',
  },
  {
    q: '¿Cuánto tiempo toma hacer una tesis de pregrado?',
    a: 'Depende del alcance y la metodología. En promedio toma de 3 a 6 meses si se trabaja con entregas por etapas y revisiones continuas.',
  },
]

const relatedPages = [
  {
    href: '/tesis-utpl',
    title: 'Tesis UTPL',
    desc: 'Orientación enfocada en lineamientos UTPL.',
    Icon: School,
    tone: 'hover:border-blue-500 hover:shadow-blue-100/60',
    accent: 'text-blue-700',
  },
  {
    href: '/tesis-maestria',
    title: 'Tesis Maestría',
    desc: 'Rigor metodológico + análisis avanzado.',
    Icon: BadgeCheck,
    tone: 'hover:border-purple-500 hover:shadow-purple-100/60',
    accent: 'text-purple-700',
  },
  {
    href: '/ayuda-en-tesis-ecuador',
    title: 'Ayuda en Tesis Ecuador',
    desc: 'Asesoría nacional por etapas y APA.',
    Icon: Globe2,
    tone: 'hover:border-emerald-500 hover:shadow-emerald-100/60',
    accent: 'text-emerald-700',
  },
]

export default function TesisPregradoPage() {
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
      {/* FAQ Schema */}
      <Script
        id="faq-jsonld-tesis-pregrado"
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
            <span className="text-slate-900 font-medium">Tesis de Pregrado</span>
          </nav>

          {/* Hero */}
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 shadow-sm">
                <ShieldCheck className="h-4 w-4 text-blue-700" />
                Asesoría académica profesional • Ecuador
              </div>

              <h1 className="mt-5 text-4xl md:text-5xl font-semibold tracking-tight">
                Tesis de pregrado en Ecuador:{' '}
                <span className="text-blue-700">estructura, metodología y APA</span>
              </h1>

              <p className="mt-5 text-lg text-slate-700 leading-relaxed max-w-2xl">
                La tesis de pregrado es un trabajo de titulación que exige una estructura clara,
                investigación con fuentes confiables y una metodología defendible. En StudyDocu
                acompañamos el proceso por etapas: tema, propuesta, marco teórico, metodología,
                análisis de resultados, normas APA y preparación para defensa final en Ecuador.
              </p>

              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/contacto"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-white font-semibold hover:bg-black transition shadow-sm"
                >
                  Solicitar asesoría <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/servicios"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-slate-900 font-semibold hover:bg-slate-50 transition"
                >
                  Ver servicios
                </Link>
              </div>

              {/* Jump links */}
              <div className="mt-6 flex flex-wrap gap-2">
                <a
                  href="#pregrado"
                  className="text-sm rounded-full border border-slate-200 bg-white px-3 py-1 hover:bg-slate-50 transition"
                >
                  Ver Pregrado
                </a>
                <a
                  href="#maestria"
                  className="text-sm rounded-full border border-slate-200 bg-white px-3 py-1 hover:bg-slate-50 transition"
                >
                  Ver Posgrado / Maestría
                </a>
                <a
                  href="#doctorado"
                  className="text-sm rounded-full border border-slate-200 bg-white px-3 py-1 hover:bg-slate-50 transition"
                >
                  Ver Doctorado
                </a>
              </div>

              {/* Trust bullets */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <TrustItem
                  icon={<CheckCircle2 className="h-5 w-5 text-blue-700" />}
                  text="Entregas por etapas y revisión continua"
                />
                <TrustItem
                  icon={<BookOpenCheck className="h-5 w-5 text-blue-700" />}
                  text="Redacción académica y normas APA"
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
                    <h2 className="text-lg font-semibold">¿Qué incluye la asesoría?</h2>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    Enfoque profesional para tesis de pregrado con entregas parciales.
                  </p>
                </div>

                <div className="p-6 space-y-4">
                  <MiniItem
                    icon={<GraduationCap className="h-5 w-5 text-slate-900" />}
                    title="Tema y propuesta"
                    desc="Delimitación, objetivos, problema, justificación y plan."
                  />
                  <MiniItem
                    icon={<FileText className="h-5 w-5 text-slate-900" />}
                    title="Marco teórico"
                    desc="Búsqueda bibliográfica, síntesis y citación correcta."
                  />
                  <MiniItem
                    icon={<Target className="h-5 w-5 text-slate-900" />}
                    title="Metodología"
                    desc="Diseño, población/muestra, instrumentos y procedimiento."
                  />
                  <MiniItem
                    icon={<ClipboardList className="h-5 w-5 text-slate-900" />}
                    title="Resultados y defensa"
                    desc="Análisis, conclusiones, APA y preparación de sustentación."
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

              {/* Related pages */}
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-700 font-medium">Páginas relacionadas</p>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {relatedPages.map(({ href, title, desc, Icon, tone, accent }) => (
                    <Link
                      key={href}
                      href={href}
                      className={[
                        'group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition',
                        'hover:shadow-md',
                        tone,
                      ].join(' ')}
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center">
                          <Icon className={['h-5 w-5', accent].join(' ')} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 group-hover:text-slate-950">
                            {title}
                          </p>
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
            </div>
          </div>
        </section>
      </div>

      {/* Body */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        {/* Process */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-2xl font-semibold">Proceso recomendado para tu tesis</h2>
            <p className="mt-2 text-slate-600">
              Un flujo claro para avanzar con seguridad, entregas por etapas y revisión continua.
            </p>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Step
              n="1"
              title="Diagnóstico y plan"
              desc="Revisamos tema, requisitos y alcance. Definimos un plan con entregas parciales."
            />
            <Step
              n="2"
              title="Capítulos y metodología"
              desc="Marco teórico, metodología (cuali/cuanti/mixta) y redacción con normas APA."
            />
            <Step
              n="3"
              title="Resultados y defensa"
              desc="Análisis, conclusiones, formato final y preparación de sustentación."
            />
          </div>
        </div>

        {/* ====== ANCLA #pregrado ====== */}
        <section id="pregrado" className="scroll-mt-28 mt-10">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-2xl font-semibold">Tesis de Pregrado</h2>
              <p className="mt-2 text-slate-600">
                Acompañamiento integral: estructura, redacción, metodología y normas APA.
              </p>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <h3 className="text-lg font-semibold">Qué incluye</h3>
                <div className="mt-3 space-y-2">
                  <IncludeItem text="Delimitación del tema y formulación del problema" />
                  <IncludeItem text="Objetivos, justificación e hipótesis (si aplica)" />
                  <IncludeItem text="Marco teórico con fuentes confiables" />
                  <IncludeItem text="Metodología defendible y coherente" />
                  <IncludeItem text="Resultados, discusión y conclusiones" />
                  <IncludeItem text="Revisión de formato y normas APA" />
                </div>

                {/* ✅ BOTONES ALINEADOS (MISMO NIVEL) */}
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/contacto"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-white font-semibold hover:bg-black transition"
                  >
                    Solicitar apoyo en pregrado <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    href="/tesis-pregrado#pregrado"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-slate-900 font-semibold hover:bg-slate-50 transition"
                  >
                    Ver Tesis Pregrado
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="font-semibold">Recomendación</p>
                <p className="mt-2 text-sm text-slate-700">
                  Para acelerar tu avance, trabajamos con entregas parciales (por capítulo) y
                  revisiones continuas. Esto reduce observaciones y mejora la defensa final.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ====== ANCLA #maestria ====== */}
        <section id="maestria" className="scroll-mt-28 mt-10">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-2xl font-semibold">Tesis de Posgrado / Maestría</h2>
              <p className="mt-2 text-slate-600">
                Enfoque avanzado: estado del arte, diseño metodológico y análisis robusto.
              </p>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <h3 className="text-lg font-semibold">Qué incluye</h3>
                <div className="mt-3 space-y-2">
                  <IncludeItem text="Estado del arte y marco teórico avanzado" />
                  <IncludeItem text="Diseño metodológico (cuali/cuanti/mixto) con rigor" />
                  <IncludeItem text="Construcción de instrumentos y validación" />
                  <IncludeItem text="Análisis estadístico o cualitativo con coherencia" />
                  <IncludeItem text="Redacción técnica y formato APA" />
                </div>

                {/* ✅ BOTONES ALINEADOS (MISMO NIVEL) */}
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/contacto"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-white font-semibold hover:bg-black transition"
                  >
                    Solicitar apoyo en maestría <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    href="/tesis-maestria"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-slate-900 font-semibold hover:bg-slate-50 transition"
                  >
                    Ver Tesis Maestría
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="font-semibold">Tip académico</p>
                <p className="mt-2 text-sm text-slate-700">
                  En maestría, la consistencia entre objetivos, variables/categorías e instrumentos
                  es clave. Trabajamos para que tu tesis sea defendible y con argumentación sólida.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ====== ANCLA #doctorado ====== */}
        <section id="doctorado" className="scroll-mt-28 mt-10">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-2xl font-semibold">Tesis de Doctorado</h2>
              <p className="mt-2 text-slate-600">
                Rigor científico, aporte original, validación metodológica y preparación estratégica
                para defensa doctoral.
              </p>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <h3 className="text-lg font-semibold">Qué incluye</h3>
                <div className="mt-3 space-y-2">
                  <IncludeItem text="Planteamiento del aporte científico y problema de investigación" />
                  <IncludeItem text="Marco teórico/estado del arte con profundidad" />
                  <IncludeItem text="Diseño metodológico y validación rigurosa" />
                  <IncludeItem text="Análisis, discusión y conclusiones defendibles" />
                  <IncludeItem text="Preparación de defensa (guion y posibles preguntas)" />
                </div>

                {/* ✅ BOTONES ALINEADOS (MISMO NIVEL) */}
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/contacto"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-white font-semibold hover:bg-black transition"
                  >
                    Solicitar apoyo en doctorado <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    href="/tesis-doctorado"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-slate-900 font-semibold hover:bg-slate-50 transition"
                  >
                    Ver Tesis Doctorado
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="font-semibold">Enfoque doctoral</p>
                <p className="mt-2 text-sm text-slate-700">
                  Un doctorado requiere aporte original y un método sólido. Te acompañamos para
                  fortalecer el argumento, la evidencia y la defensa.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Structure + Includes */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-2xl font-semibold">Estructura típica de una tesis</h2>
              <p className="mt-2 text-slate-600">
                Una estructura clara facilita la evaluación y fortalece tu defensa.
              </p>
            </div>
            <div className="p-6">
              <ol className="list-decimal pl-5 space-y-2 text-slate-700">
                <li>Elección y delimitación del tema</li>
                <li>Planteamiento del problema, objetivos y justificación</li>
                <li>Marco teórico y antecedentes</li>
                <li>Metodología (enfoque, diseño, instrumentos, muestra)</li>
                <li>Resultados y análisis</li>
                <li>Discusión, conclusiones y recomendaciones</li>
                <li>Referencias y anexos (APA)</li>
              </ol>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-2xl font-semibold">Qué te ayudamos a mejorar</h2>
              <p className="mt-2 text-slate-600">
                Ajustes que elevan la calidad y reducen observaciones.
              </p>
            </div>
            <div className="p-6 space-y-3">
              <IncludeItem text="Coherencia y redacción académica formal" />
              <IncludeItem text="Normas APA: citas, referencias, tablas y figuras" />
              <IncludeItem text="Metodología consistente con objetivos e hipótesis" />
              <IncludeItem text="Análisis de resultados y discusión sólida" />
              <IncludeItem text="Preparación para defensa: guion y preguntas" />

              <div className="pt-3">
                <Link
                  href="/contacto"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-white font-semibold hover:bg-black transition"
                >
                  Quiero avanzar mi tesis <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Universities */}
        <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-xl font-semibold">Universidades que atendemos en Ecuador</h2>
          <p className="mt-2 text-slate-700">
            Podemos acompañarte según lineamientos de tu carrera y universidad (por ejemplo: UTPL y
            otras instituciones del Ecuador). Adaptamos el trabajo al tipo de investigación y a tus
            requisitos de entrega.
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
              Modalidad presencial y online
            </span>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-10 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-2xl font-semibold">Preguntas frecuentes</h2>
            <p className="mt-2 text-slate-600">
              Respuestas rápidas sobre tesis de pregrado, metodología y normas APA.
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
              <h2 className="text-2xl font-semibold">¿Listo para avanzar tu tesis?</h2>
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

import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import {
  ShieldCheck,
  CheckCircle2,
  FileText,
  GraduationCap,
  ClipboardList,
  BookOpenCheck,
  Target,
  Sparkles,
  ArrowRight,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Tesis UTPL en Ecuador | Asesoría Académica Profesional – StudyDocu',
  description:
    'Asesoría profesional para tesis UTPL en Ecuador. Acompañamiento en pregrado, maestría y doctorado: propuesta, marco teórico, metodología, normas APA y preparación para defensa.',
  keywords: [
    'tesis UTPL',
    'tesis UTPL Ecuador',
    'ayuda tesis UTPL',
    'asesoría tesis UTPL',
    'trabajo de titulación UTPL',
    'tesis pregrado UTPL',
    'tesis maestría UTPL',
    'tesis doctorado UTPL',
    'formato tesis UTPL',
    'normas APA UTPL',
  ],
  alternates: { canonical: 'https://studydocu.ec/tesis-utpl' },
  openGraph: {
    title: 'Tesis UTPL en Ecuador | Asesoría Académica Profesional – StudyDocu',
    description:
      'Acompañamiento académico para tesis UTPL: propuesta, marco teórico, metodología, APA y defensa. Pregrado, maestría y doctorado.',
    url: 'https://studydocu.ec/tesis-utpl',
    siteName: 'StudyDocu',
    locale: 'es_EC',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tesis UTPL | StudyDocu Ecuador',
    description:
      'Asesoría profesional para tesis UTPL: estructura, metodología, APA y defensa final.',
  },
}

const faq = [
  {
    q: '¿Qué es la asesoría de tesis UTPL?',
    a: 'Es un acompañamiento académico independiente para estudiantes de la UTPL, desde la elección del tema y la propuesta, hasta la redacción final, normas APA y preparación para defensa.',
  },
  {
    q: '¿La tesis UTPL debe cumplir normas APA?',
    a: 'Sí. Las citas, referencias, tablas y formato deben alinearse con normas APA actualizadas y con los lineamientos del programa correspondiente.',
  },
  {
    q: '¿Cuánto tiempo toma realizar una tesis en la UTPL?',
    a: 'Depende del tema y la metodología. En promedio puede tomar de 4 a 8 meses, considerando revisiones, ajustes y entregas parciales.',
  },
  {
    q: '¿Pueden ayudar en pregrado, maestría y doctorado UTPL?',
    a: 'Sí. Adaptamos el acompañamiento al nivel (pregrado, maestría o doctorado) y al enfoque metodológico (cualitativo, cuantitativo o mixto).',
  },
]

export default function TesisUTPLPage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* FAQ Schema (Rich Results) */}
      <Script
        id="faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Top subtle background */}
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
            <span className="text-slate-900 font-medium">Tesis UTPL</span>
          </nav>

          {/* Hero */}
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 shadow-sm">
                <ShieldCheck className="h-4 w-4 text-blue-700" />
                Acompañamiento académico independiente • Ecuador
              </div>

              <h1 className="mt-5 text-4xl md:text-5xl font-semibold tracking-tight">
                Tesis UTPL en Ecuador: asesoría profesional para{' '}
                <span className="text-blue-700">pregrado, maestría y doctorado</span>
              </h1>

              {/* “Snippet-friendly” paragraph (40–60 words aprox.) */}
              <p className="mt-5 text-lg text-slate-700 leading-relaxed max-w-2xl">
                La tesis UTPL es un trabajo de investigación y redacción académica que exige una
                estructura clara, metodología adecuada y cumplimiento de normas APA. En StudyDocu
                acompañamos a estudiantes de la Universidad Técnica Particular de Loja en propuesta,
                marco teórico, análisis y preparación para la defensa final.
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
                  Ver otros servicios
                </Link>
              </div>

              {/* Trust bullets */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <TrustItem
                  icon={<CheckCircle2 className="h-5 w-5 text-blue-700" />}
                  text="Entregas por etapas y revisión continua"
                />
                <TrustItem
                  icon={<BookOpenCheck className="h-5 w-5 text-blue-700" />}
                  text="Normas APA y redacción académica"
                />
                <TrustItem
                  icon={<ClipboardList className="h-5 w-5 text-blue-700" />}
                  text="Enfoque metodológico claro y defendible"
                />
                <TrustItem
                  icon={<ShieldCheck className="h-5 w-5 text-blue-700" />}
                  text="Confidencialidad y trato profesional"
                />
              </div>
            </div>

            {/* Side card */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="p-6 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-blue-700" />
                    <h2 className="text-lg font-semibold">¿Qué incluye el acompañamiento?</h2>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    Selecciona el nivel y trabajamos por objetivos con entregas parciales.
                  </p>
                </div>

                <div className="p-6 space-y-4">
                  <MiniPlan
                    title="Pregrado UTPL"
                    desc="Tema, problema, objetivos, marco teórico, metodología y resultados."
                    href="#pregrado"
                    icon={<GraduationCap className="h-5 w-5 text-slate-900" />}
                  />
                  <MiniPlan
                    title="Maestría UTPL"
                    desc="Revisión bibliográfica avanzada, diseño metodológico y análisis."
                    href="#maestria"
                    icon={<Target className="h-5 w-5 text-slate-900" />}
                  />
                  <MiniPlan
                    title="Doctorado UTPL"
                    desc="Rigor científico, validación metodológica y preparación de defensa."
                    href="#doctorado"
                    icon={<FileText className="h-5 w-5 text-slate-900" />}
                  />

                  <div className="pt-2">
                    <Link
                      href="/contacto"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-white font-semibold hover:bg-blue-800 transition"
                    >
                      Agendar orientación <ArrowRight className="h-4 w-4" />
                    </Link>
                    <p className="mt-3 text-xs text-slate-500 text-center">
                      Orientación académica independiente. No somos parte de la UTPL.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-700">También te puede interesar:</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    className="text-sm rounded-full border border-slate-200 bg-white px-3 py-1 hover:bg-slate-50 transition"
                    href="/tesis-pregrado"
                  >
                    Tesis Pregrado (Ecuador)
                  </Link>
                  <Link
                    className="text-sm rounded-full border border-slate-200 bg-white px-3 py-1 hover:bg-slate-50 transition"
                    href="/tesis-maestria"
                  >
                    Tesis Maestría
                  </Link>
                  <Link
                    className="text-sm rounded-full border border-slate-200 bg-white px-3 py-1 hover:bg-slate-50 transition"
                    href="/ayuda-en-tesis-ecuador"
                  >
                    Ayuda en Tesis Ecuador
                  </Link>
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
            <h2 className="text-2xl font-semibold">Nuestro proceso para tesis UTPL</h2>
            <p className="mt-2 text-slate-600">
              Un flujo claro para avanzar con seguridad, entregas por etapas y revisión continua.
            </p>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Step
              n="1"
              title="Diagnóstico y plan"
              desc="Analizamos tema, alcance y requisitos. Definimos un plan con entregas."
            />
            <Step
              n="2"
              title="Desarrollo por capítulos"
              desc="Marco teórico, metodología, análisis y redacción con APA."
            />
            <Step
              n="3"
              title="Revisión y defensa"
              desc="Corrección final, coherencia, formato y preparación de sustentación."
            />
          </div>
        </div>

        {/* Levels */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-5">
          <LevelCard
            id="pregrado"
            title="Tesis UTPL de Pregrado"
            desc="Acompañamiento integral: planteamiento del problema, objetivos, marco teórico, metodología y resultados."
            bullets={[
              'Propuesta y justificación',
              'Marco teórico con fuentes sólidas',
              'Metodología clara y defendible',
              'Corrección APA y coherencia',
            ]}
          />
          <LevelCard
            id="maestria"
            title="Tesis UTPL de Maestría"
            desc="Enfoque técnico avanzado: revisión sistemática, diseño metodológico y análisis robusto."
            bullets={[
              'Revisión bibliográfica especializada',
              'Diseño metodológico y variables',
              'Análisis cualitativo/cuantitativo',
              'Estructura y redacción académica',
            ]}
          />
          <LevelCard
            id="doctorado"
            title="Tesis UTPL de Doctorado"
            desc="Rigor científico: validación metodológica, aporte original y preparación estratégica para defensa."
            bullets={[
              'Planteamiento del aporte científico',
              'Validación metodológica',
              'Evidencia, discusión y conclusiones',
              'Preparación de defensa doctoral',
            ]}
          />
        </div>

        {/* Structure + Includes */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-2xl font-semibold">Estructura recomendada de una tesis UTPL</h2>
              <p className="mt-2 text-slate-600">
                Una estructura clara facilita la evaluación y fortalece tu defensa.
              </p>
            </div>
            <div className="p-6">
              <ol className="list-decimal pl-5 space-y-2 text-slate-700">
                <li>Propuesta y delimitación del tema</li>
                <li>Planteamiento del problema y objetivos</li>
                <li>Marco teórico y antecedentes</li>
                <li>Metodología (enfoque, diseño, muestra, instrumentos)</li>
                <li>Resultados y análisis</li>
                <li>Discusión, conclusiones y recomendaciones</li>
                <li>Referencias y anexos (APA)</li>
              </ol>

              <div className="mt-6 rounded-xl bg-slate-50 border border-slate-200 p-4">
                <p className="text-sm text-slate-700">
                  Tip SEO: usa variaciones naturales como <b>“tesis en la UTPL”</b>,{' '}
                  <b>“tesis UTPL Ecuador”</b> y <b>“trabajo de titulación UTPL”</b> dentro del
                  contenido.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-2xl font-semibold">Qué podemos ayudarte a mejorar</h2>
              <p className="mt-2 text-slate-600">
                Ajustes finos que elevan la calidad y evitan observaciones.
              </p>
            </div>
            <div className="p-6 space-y-3">
              <IncludeItem text="Coherencia y redacción académica (formal y clara)" />
              <IncludeItem text="Normas APA: citas, referencias, tablas y figuras" />
              <IncludeItem text="Metodología: consistencia entre objetivos y técnicas" />
              <IncludeItem text="Originalidad: estructura y enfoque para defender tu aporte" />
              <IncludeItem text="Preparación para defensa: guion, diapositivas y preguntas" />

              <div className="pt-3">
                <Link
                  href="/contacto"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-white font-semibold hover:bg-black transition"
                >
                  Quiero avanzar con mi tesis UTPL <ArrowRight className="h-4 w-4" />
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
              Respuestas rápidas sobre tesis UTPL, normas APA y tiempos estimados.
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
              <h2 className="text-2xl font-semibold">¿Listo para avanzar tu tesis UTPL?</h2>
              <p className="mt-2 text-white/80 max-w-2xl">
                Trabajemos por entregas: propuesta, marco teórico, metodología, resultados y
                defensa. Enfoque profesional, comunicación clara y acompañamiento académico
                independiente.
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

        {/* Small disclaimer */}
        <p className="mt-6 text-xs text-slate-500">
          Nota: StudyDocu ofrece orientación académica independiente. No somos una entidad afiliada
          a la UTPL.
        </p>
      </section>
    </main>
  )
}

/* ---------- Components ---------- */

function TrustItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mt-0.5">{icon}</div>
      <p className="text-sm text-slate-700">{text}</p>
    </div>
  )
}

function MiniPlan({
  title,
  desc,
  href,
  icon,
}: {
  title: string
  desc: string
  href: string
  icon: React.ReactNode
}) {
  return (
    <a
      href={href}
      className="group flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 hover:bg-slate-50 transition"
    >
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-2">{icon}</div>
      <div className="min-w-0">
        <div className="flex items-center justify-between gap-3">
          <p className="font-semibold text-slate-900">{title}</p>
          <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-slate-700 transition" />
        </div>
        <p className="mt-1 text-sm text-slate-600">{desc}</p>
      </div>
    </a>
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

function LevelCard({
  id,
  title,
  desc,
  bullets,
}: {
  id: string
  title: string
  desc: string
  bullets: string[]
}) {
  return (
    <section id={id} className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="mt-2 text-slate-600">{desc}</p>
      </div>
      <div className="p-6 space-y-2">
        {bullets.map((b) => (
          <div key={b} className="flex items-start gap-2">
            <CheckCircle2 className="h-5 w-5 text-blue-700 mt-0.5" />
            <p className="text-sm text-slate-700">{b}</p>
          </div>
        ))}
      </div>
    </section>
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

// src/app/que-es-studydocu/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'

export const metadata: Metadata = {
  title: '¿Qué es StudyDocu? | Plataforma académica con IA en Ecuador',
  description:
    'StudyDocu es una plataforma académica con inteligencia artificial creada en Ecuador para organizar apuntes, estudiar mejor y mejorar el rendimiento universitario. Fundador/CEO: Jonathan Octavio Rosado Lopez.',
  keywords: [
    'StudyDocu',
    'plataforma académica Ecuador',
    'IA para estudiantes',
    'apuntes universitarios',
    'UTPL',
    'resúmenes con IA',
    'organizar materias',
  ],
  alternates: {
    canonical: 'https://www.studydocu.ec/que-es-studydocu',
  },
  openGraph: {
    title: '¿Qué es StudyDocu? | Plataforma académica con IA en Ecuador',
    description:
      'Organiza apuntes, estudia mejor y potencia tu rendimiento con IA. StudyDocu fue creada en Ecuador por Jonathan Octavio Rosado Lopez.',
    url: 'https://www.studydocu.ec/que-es-studydocu',
    siteName: 'StudyDocu',
    locale: 'es_EC',
    type: 'article',
    images: [
      {
        url: 'https://www.studydocu.ec/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'StudyDocu - Plataforma académica con IA',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '¿Qué es StudyDocu? | Plataforma académica con IA en Ecuador',
    description:
      'Organiza apuntes, estudia mejor y potencia tu rendimiento con IA. Fundador/CEO: Jonathan Octavio Rosado Lopez.',
    images: ['https://www.studydocu.ec/og-image.jpg'],
  },
}

const BRAND = {
  name: 'StudyDocu',
  url: 'https://www.studydocu.ec/',
  pageUrl: 'https://www.studydocu.ec/que-es-studydocu',
  logo: 'https://www.studydocu.ec/logo.png',
  ogImage: 'https://www.studydocu.ec/og-image.jpg',
  description:
    'StudyDocu es una plataforma académica con IA creada en Ecuador para subir, organizar y resumir documentos universitarios, mejorar hábitos de estudio y conectar con apoyo académico.',
  founder: 'Jonathan Octavio Rosado Lopez',
  ceo: 'Jonathan Octavio Rosado Lopez',
  locale: 'es-EC',
}

export default function QueEsStudyDocuPage() {
  const schemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${BRAND.url}#organization`,
        name: BRAND.name,
        url: BRAND.url,
        logo: {
          '@type': 'ImageObject',
          url: BRAND.logo,
          width: 512,
          height: 512,
        },
        image: BRAND.ogImage,
        description: BRAND.description,
        founder: {
          '@type': 'Person',
          name: BRAND.founder,
        },
        // Nota: "chiefExecutiveOfficer" es usado en algunos casos; "employee" y "founder" son más estándar.
        // Lo dejamos simple y útil para Google.
      },
      {
        '@type': 'WebSite',
        '@id': `${BRAND.url}#website`,
        url: BRAND.url,
        name: BRAND.name,
        publisher: { '@id': `${BRAND.url}#organization` },
        inLanguage: BRAND.locale,
      },
      {
        '@type': 'WebPage',
        '@id': `${BRAND.pageUrl}#webpage`,
        url: BRAND.pageUrl,
        name: '¿Qué es StudyDocu? | Plataforma académica con IA en Ecuador',
        isPartOf: { '@id': `${BRAND.url}#website` },
        about: { '@id': `${BRAND.url}#organization` },
        inLanguage: BRAND.locale,
      },
      {
        '@type': 'FAQPage',
        '@id': `${BRAND.pageUrl}#faq`,
        mainEntity: [
          {
            '@type': 'Question',
            name: '¿Qué es StudyDocu?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'StudyDocu es una plataforma académica con inteligencia artificial creada en Ecuador para organizar apuntes, resumir documentos y mejorar el rendimiento universitario.',
            },
          },
          {
            '@type': 'Question',
            name: '¿StudyDocu está pensada para la UTPL?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Sí. StudyDocu fue diseñada para apoyar a estudiantes de la UTPL y de otras universidades en Ecuador, con herramientas de organización y apoyo al aprendizaje.',
            },
          },
          {
            '@type': 'Question',
            name: '¿Quién creó StudyDocu?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'StudyDocu fue creada por Jonathan Octavio Rosado Lopez (Founder/CEO).',
            },
          },
        ],
      },
    ],
  }

  return (
    <>
      {/* JSON-LD SEO (sin use client) */}
      <Script
        id="studydocu-que-es-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
      />

      <main className="relative">
        {/* Background suave */}
        <div className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(ellipse_at_top,rgba(99,102,241,0.12),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(236,72,153,0.10),transparent_55%)]" />

        <div className="max-w-5xl mx-auto px-4 py-10 sm:py-14">
          {/* Breadcrumb / mini header */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-6">
            <Link href="/" className="hover:underline">
              Inicio
            </Link>
            <span>›</span>
            <span className="text-gray-700 font-medium">¿Qué es StudyDocu?</span>
          </div>

          {/* Hero */}
          <section className="rounded-3xl border border-white/40 bg-white/70 dark:bg-gray-900/60 dark:border-white/10 backdrop-blur-xl shadow-xl p-6 sm:p-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200 text-xs font-semibold uppercase tracking-[0.18em]">
              Plataforma académica con IA • Ecuador
            </div>

            <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
              ¿Qué es <span className="text-indigo-600 dark:text-indigo-300">StudyDocu</span>?
            </h1>

            <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
              <strong>StudyDocu</strong> es una plataforma académica con inteligencia artificial creada en Ecuador para
              ayudarte a <strong>organizar tus apuntes</strong>, <strong>estudiar mejor</strong> y mejorar tu rendimiento
              universitario con herramientas modernas, rápidas y enfocadas en el aprendizaje.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/50 dark:border-white/10 bg-white/60 dark:bg-white/5 p-4">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Organización real</p>
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">
                  Documentos por universidad, carrera y materia.
                </p>
              </div>
              <div className="rounded-2xl border border-white/50 dark:border-white/10 bg-white/60 dark:bg-white/5 p-4">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">IA para aprender</p>
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">
                  Resúmenes, explicaciones y refuerzo de conceptos.
                </p>
              </div>
              <div className="rounded-2xl border border-white/50 dark:border-white/10 bg-white/60 dark:bg-white/5 p-4">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Comunidad</p>
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">
                  Comparte recursos y mejora tus hábitos de estudio.
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/registrarse"
                className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-lg hover:shadow-xl hover:scale-[1.02] transition"
              >
                Empezar gratis
              </Link>

              <Link
                href="/explorar"
                className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/50 text-gray-900 dark:text-white hover:bg-white hover:dark:bg-gray-800 transition"
              >
                Explorar documentos
              </Link>

              <Link
                href="/servicios"
                className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold border border-transparent bg-emerald-600 text-white hover:bg-emerald-700 transition"
              >
                Ver servicios académicos
              </Link>
            </div>

            <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              Fundador/CEO: <strong className="text-gray-700 dark:text-gray-200">Jonathan Octavio Rosado Lopez</strong>
            </p>
          </section>

          {/* Secciones SEO */}
          <section className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-white/40 bg-white/70 dark:bg-gray-900/60 dark:border-white/10 backdrop-blur-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">¿Para qué sirve StudyDocu?</h2>
              <ul className="mt-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li>✅ Subir y organizar apuntes universitarios.</li>
                <li>✅ Acceder a documentos por carrera y materia.</li>
                <li>✅ Usar IA para resumir, explicar y repasar.</li>
                <li>✅ Prepararte para exámenes, quices y trabajos.</li>
              </ul>
            </div>

            <div className="rounded-3xl border border-white/40 bg-white/70 dark:bg-gray-900/60 dark:border-white/10 backdrop-blur-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">¿Qué hace diferente a StudyDocu?</h2>
              <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                StudyDocu está diseñada para la realidad universitaria de Ecuador. No es solo un repositorio: integra
                organización, IA educativa y una experiencia pensada para mejorar hábitos y rendimiento.
              </p>

              <div className="mt-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/40 p-4">
                <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-200">
                  Enfoque en aprendizaje responsable
                </p>
                <p className="mt-1 text-xs text-indigo-900/80 dark:text-indigo-200/80">
                  Herramientas para comprender y estudiar mejor, no para “copiar y pegar”.
                </p>
              </div>
            </div>
          </section>

          {/* FAQ visible (para SEO + usuario) */}
          <section className="mt-10 rounded-3xl border border-white/40 bg-white/70 dark:bg-gray-900/60 dark:border-white/10 backdrop-blur-xl shadow-lg p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Preguntas frecuentes</h2>

            <div className="mt-5 space-y-4">
              <details className="group rounded-2xl border border-gray-200/70 dark:border-gray-700 bg-white/70 dark:bg-gray-900/40 p-4">
                <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">
                  ¿StudyDocu está pensada para la UTPL?
                </summary>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                  Sí. StudyDocu fue diseñada para apoyar a estudiantes de la UTPL y de otras universidades en Ecuador,
                  facilitando organización, acceso a materiales y herramientas de estudio.
                </p>
              </details>

              <details className="group rounded-2xl border border-gray-200/70 dark:border-gray-700 bg-white/70 dark:bg-gray-900/40 p-4">
                <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">
                  ¿Quién creó StudyDocu?
                </summary>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                  StudyDocu fue creada por <strong>Jonathan Octavio Rosado Lopez</strong> (Founder/CEO).
                </p>
              </details>

              <details className="group rounded-2xl border border-gray-200/70 dark:border-gray-700 bg-white/70 dark:bg-gray-900/40 p-4">
                <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">
                  ¿Cómo empiezo a usar StudyDocu?
                </summary>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                  Crea tu cuenta, sube tus apuntes y comienza a explorar contenido. Puedes organizar tus documentos por
                  materia y usar herramientas de IA para estudiar de forma más eficiente.
                </p>
              </details>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/registrarse"
                className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition"
              >
                Crear cuenta
              </Link>
              <Link
                href="/explorar"
                className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/50 text-gray-900 dark:text-white hover:bg-white hover:dark:bg-gray-800 transition"
              >
                Ver documentos
              </Link>
            </div>
          </section>

          {/* Footer mini */}
          <p className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} StudyDocu • Ecuador • Founder/CEO: Jonathan Octavio Rosado Lopez
          </p>
        </div>
      </main>
    </>
  )
}

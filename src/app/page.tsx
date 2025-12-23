// src/app/page.tsx
import type { Metadata } from 'next'
import HomeClient from './HomeClient'

export const metadata: Metadata = {
  title: 'StudyDocu | Plataforma académica con IA para estudiantes en Ecuador',
  description:
    'Sube, organiza y resume documentos universitarios con IA. Conecta con asesores verificados, gestiona tareas y mejora tu rendimiento académico en Ecuador.',
  keywords: [
    'StudyDocu',
    'plataforma académica',
    'inteligencia artificial',
    'documentos universitarios',
    'resúmenes IA',
    'UTPL',
    'asesorías académicas',
    'estudiantes Ecuador',
  ],
  alternates: { canonical: 'https://www.studydocu.ec/' },
  openGraph: {
    title: 'StudyDocu | Plataforma académica con IA',
    description:
      'Organiza tus apuntes universitarios, estudia con IA y mejora tu rendimiento académico.',
    url: 'https://www.studydocu.ec/',
    siteName: 'StudyDocu',
    locale: 'es_EC',
    type: 'website',
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
    title: 'StudyDocu | Plataforma académica con IA',
    description:
      'Organiza tus apuntes universitarios, estudia con IA y mejora tu rendimiento académico.',
    images: ['https://www.studydocu.ec/og-image.jpg'],
  },
}

export default function Page() {
  return (
    <>
      <HomeClient />

      {/* SEO: ¿Qué es StudyDocu? */}
      <section className="max-w-4xl mx-auto px-4 py-14">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
          ¿Qué es StudyDocu?
        </h2>

        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          <strong>StudyDocu</strong> es una plataforma académica con inteligencia artificial,
          creada en Ecuador, que ayuda a estudiantes universitarios a organizar sus apuntes,
          comprender mejor sus materias y mejorar su rendimiento académico de forma responsable.
        </p>

        <a
          href="/que-es-studydocu"
          className="inline-block mt-5 text-indigo-600 font-semibold hover:underline"
        >
          Leer más sobre StudyDocu →
        </a>
      </section>
    </>
  )
}

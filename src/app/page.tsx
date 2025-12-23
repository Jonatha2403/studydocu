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
  alternates: {
    canonical: 'https://www.studydocu.ec/',
  },
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
  return <HomeClient />
}

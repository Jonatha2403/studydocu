// src/app/page.tsx
import type { Metadata } from 'next'
import HomeClient from './HomeClient'

export const metadata: Metadata = {
  metadataBase: new URL('https://studydocu.ec'),
  title: 'StudyDocu | Plataforma académica con IA para estudiantes en Ecuador',
  description:
    'StudyDocu es una plataforma académica con IA en Ecuador: organiza documentos por universidad y materia, genera resúmenes y estudia más rápido.',
  keywords: [
    'StudyDocu',
    'plataforma académica',
    'IA para estudiantes',
    'resúmenes con IA',
    'apuntes universitarios',
    'documentos UTPL',
    'Ecuador',
    'organización académica',
    'estudiar mejor',
  ],
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title: 'StudyDocu | Plataforma académica con IA',
    description:
      'Organiza tus apuntes universitarios, genera resúmenes con IA y mejora tu rendimiento académico en StudyDocu.',
    url: '/',
    siteName: 'StudyDocu',
    locale: 'es_EC',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
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
      'Organiza tus apuntes universitarios, genera resúmenes con IA y estudia más rápido con StudyDocu.',
    images: ['/og-image.png'],
  },
}

export default function Page() {
  return (
    <>
      {/* ✅ H1 “seguro” para SEO (no rompe el diseño) */}
      <h1 className="sr-only">
        StudyDocu: Plataforma académica con IA para estudiantes en Ecuador
      </h1>

      {/* ✅ Micro-copy invisible para apoyar SEO sin afectar UI */}
      <p className="sr-only">
        Sube documentos, organiza por universidad, carrera y materia, crea resúmenes automáticos y
        estudia con herramientas inteligentes.
      </p>

      <HomeClient />
    </>
  )
}

// src/app/page.tsx
import type { Metadata } from 'next'
import HomeClient from './HomeClient'

export const metadata: Metadata = {
  title: 'Plataforma académica con IA para estudiantes en Ecuador',
  description:
    'StudyDocu es una plataforma académica con IA para estudiantes universitarios en Ecuador: organiza, resume y estudia mejor.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'StudyDocu | Plataforma académica con IA',
    description: 'Organiza tus apuntes universitarios, estudia con IA y mejora tu rendimiento académico.',
    url: 'https://studydocu.ec/',
    siteName: 'StudyDocu',
    locale: 'es_EC',
    type: 'website',
    images: [
      {
        url: 'https://studydocu.ec/og-image.png',
        width: 1200,
        height: 630,
        alt: 'StudyDocu - Plataforma académica con IA',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StudyDocu | Plataforma académica con IA',
    description: 'Organiza tus apuntes universitarios, estudia con IA y mejora tu rendimiento académico.',
    images: ['https://studydocu.ec/og-image.png'],
  },
}

export default function Page() {
  return (
    <>
      {/* ✅ H1 “seguro” para Bing (no rompe el diseño) */}
      <h1 className="sr-only">StudyDocu: Plataforma académica con IA para estudiantes en Ecuador</h1>
      <HomeClient />
    </>
  )
}

// src/app/servicios/page.tsx
import type { Metadata } from 'next'
import ServiciosClient from './ServiciosClient'

export const metadata: Metadata = {
  title: 'Servicios Académicos UTPL - Ensayos, Exámenes y Asesorías | StudyDocu',
  description:
    'Servicios académicos profesionales: ensayos en formato APA, exámenes, plataformas UTPL, resúmenes, asesorías y más. Atención para estudiantes de Ecuador.',
  keywords: [
    'servicios académicos',
    'UTPL',
    'ensayos APA',
    'exámenes UTPL',
    'plataformas universitarias',
    'tareas universitarias',
    'asesorías académicas',
    'StudyDocu',
  ],
  alternates: { canonical: 'https://www.studydocu.ec/servicios' },
  openGraph: {
    title: 'Servicios Académicos UTPL - Ensayos, Exámenes y Asesorías | StudyDocu',
    description:
      'Servicios académicos profesionales: ensayos en formato APA, exámenes, plataformas UTPL, resúmenes, asesorías y más. Atención para estudiantes de Ecuador.',
    url: 'https://www.studydocu.ec/servicios',
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
    title: 'Servicios Académicos UTPL – Ensayos, Exámenes y Asesorías | StudyDocu',
    description:
      'Ensayos APA, exámenes, plataformas UTPL, resúmenes y asesorías académicas. Atención para estudiantes de Ecuador.',
    images: ['https://www.studydocu.ec/og-image.jpg'],
  },
}

export default function Page() {
  return <ServiciosClient />
}

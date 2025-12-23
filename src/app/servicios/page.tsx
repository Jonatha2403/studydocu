// src/app/servicios/page.tsx
import type { Metadata } from 'next'
import ServiciosClient from './ServiciosClient'

export const metadata: Metadata = {
  title: 'Servicios Acad\u00e9micos UTPL \u2013 Ensayos, Ex\u00e1menes y Asesor\u00edas | StudyDocu',
  description:
    'Servicios acad\u00e9micos profesionales: ensayos en formato APA, ex\u00e1menes, plataformas UTPL, res\u00famenes, asesor\u00edas y m\u00e1s. Atenci\u00f3n para estudiantes de Ecuador.',
  keywords: [
    'servicios acad\u00e9micos',
    'UTPL',
    'ensayos APA',
    'ex\u00e1menes UTPL',
    'plataformas universitarias',
    'tareas universitarias',
    'asesor\u00edas acad\u00e9micas',
    'StudyDocu',
  ],
  alternates: {
    canonical: 'https://www.studydocu.ec/servicios',
  },
  openGraph: {
    title: 'Servicios Acad\u00e9micos UTPL \u2013 Ensayos, Ex\u00e1menes y Asesor\u00edas | StudyDocu',
    description:
      'Servicios acad\u00e9micos profesionales: ensayos en formato APA, ex\u00e1menes, plataformas UTPL, res\u00famenes, asesor\u00edas y m\u00e1s. Atenci\u00f3n para estudiantes de Ecuador.',
    url: 'https://www.studydocu.ec/servicios',
    siteName: 'StudyDocu',
    locale: 'es_EC',
    type: 'website',
    images: [
      {
        url: 'https://www.studydocu.ec/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'StudyDocu - Plataforma acad\u00e9mica con IA',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Servicios Acad\u00e9micos UTPL \u2013 Ensayos, Ex\u00e1menes y Asesor\u00edas | StudyDocu',
    description:
      'Ensayos APA, ex\u00e1menes, plataformas UTPL, res\u00famenes y asesor\u00edas acad\u00e9micas. Atenci\u00f3n para estudiantes de Ecuador.',
    images: ['https://www.studydocu.ec/og-image.jpg'],
  },
}

export default function Page() {
  return <ServiciosClient />
}

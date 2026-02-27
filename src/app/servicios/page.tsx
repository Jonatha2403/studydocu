// src/app/servicios/page.tsx
import type { Metadata } from 'next'
import ServiciosClient from './ServiciosClient'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.studydocu.ec'),
  title: 'Servicios Académicos UTPL y Ecuador | Ensayos, Exámenes, Tesis y Asesorías - StudyDocu',
  description:
    'Servicios académicos profesionales en Ecuador: ensayos APA, exámenes (bimestrales y complexivos), plataformas UTPL, resúmenes, presentaciones, asesorías por Zoom y tesis (pregrado, posgrado y doctorado).',
  keywords: [
    'servicios académicos',
    'servicios académicos Ecuador',
    'UTPL',
    'plataforma UTPL',
    'ensayos APA',
    'ensayos universitarios',
    'exámenes UTPL',
    'examen complexivo',
    'quices online',
    'resúmenes académicos',
    'normas APA',
    'presentaciones PowerPoint',
    'asesorías académicas',
    'asesorías por Zoom',
    'tesis pregrado',
    'tesis posgrado',
    'tesis doctorado',
    'StudyDocu',
  ],
  alternates: { canonical: '/servicios' },
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
    title: 'Servicios Académicos UTPL y Ecuador | Ensayos, Exámenes, Tesis y Asesorías - StudyDocu',
    description:
      'Ensayos APA, exámenes (bimestrales y complexivos), plataformas UTPL, resúmenes, presentaciones, asesorías por Zoom y tesis (pregrado, posgrado y doctorado).',
    url: '/servicios',
    siteName: 'StudyDocu',
    locale: 'es_EC',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'StudyDocu - Servicios académicos profesionales',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Servicios Académicos UTPL y Ecuador | StudyDocu',
    description:
      'Ensayos APA, exámenes, plataformas UTPL, asesorías por Zoom y tesis (pregrado, posgrado y doctorado).',
    images: ['/og-image.jpg'],
  },
}

export default function Page() {
  return (
    <>
      {/* Schema.org JSON-LD (SEO) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'StudyDocu',
              url: 'https://www.studydocu.ec',
              logo: 'https://www.studydocu.ec/og-image.jpg',
              sameAs: ['https://www.facebook.com/', 'https://www.instagram.com/'],
              contactPoint: [
                {
                  '@type': 'ContactPoint',
                  telephone: '+593958757302',
                  contactType: 'customer support',
                  areaServed: 'EC',
                  availableLanguage: ['es'],
                },
              ],
            },
            null,
            0
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              '@context': 'https://schema.org',
              '@type': 'Service',
              name: 'Servicios Académicos StudyDocu',
              serviceType: [
                'Ensayos académicos',
                'Exámenes y quices',
                'Plataformas universitarias',
                'Normas APA',
                'Presentaciones',
                'Asesorías por Zoom',
                'Tesis (pregrado, posgrado y doctorado)',
              ],
              provider: {
                '@type': 'Organization',
                name: 'StudyDocu',
                url: 'https://www.studydocu.ec',
              },
              areaServed: {
                '@type': 'Country',
                name: 'Ecuador',
              },
              url: 'https://www.studydocu.ec/servicios',
            },
            null,
            0
          ),
        }}
      />

      <ServiciosClient />
    </>
  )
}

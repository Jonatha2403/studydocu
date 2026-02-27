// src/app/servicios/page.tsx
import type { Metadata } from 'next'
import ServiciosClient from './ServiciosClient'

const SITE_URL = 'https://www.studydocu.ec'
const PAGE_PATH = '/servicios'
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`
const OG_IMAGE = `${SITE_URL}/og-image.jpg`

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: 'Servicios Académicos UTPL y Ecuador | Ensayos, Exámenes, Tesis y Asesorías - StudyDocu',
  description:
    'Servicios académicos profesionales en Ecuador: ensayos APA, exámenes (bimestrales y complexivos), plataformas UTPL, resúmenes, presentaciones, asesorías por Zoom y tesis (pregrado, posgrado y doctorado).',

  applicationName: 'StudyDocu',
  category: 'Education',
  creator: 'StudyDocu',
  publisher: 'StudyDocu',

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

  alternates: {
    canonical: PAGE_URL,
  },

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
    url: PAGE_URL,
    siteName: 'StudyDocu',
    locale: 'es_EC',
    type: 'website',
    images: [
      {
        url: OG_IMAGE,
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
    images: [OG_IMAGE],
  },
}

export default function Page() {
  // IMPORTANTE:
  // - No pongas redes sociales vacías, solo agrega las reales.
  // - Si aún no tienes redes, deja sameAs como [].
  const sameAs: string[] = [
    // 'https://www.facebook.com/tupagina',
    // 'https://www.instagram.com/tucuenta',
    // 'https://www.tiktok.com/@tucuenta',
  ]

  // JSON-LD: Organization + WebSite + WebPage + Service
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'StudyDocu',
      url: SITE_URL,
      logo: OG_IMAGE,
      image: OG_IMAGE,
      sameAs,
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
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'StudyDocu',
      url: SITE_URL,
      inLanguage: 'es-EC',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/explorar?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Servicios Académicos | StudyDocu',
      url: PAGE_URL,
      inLanguage: 'es-EC',
      description:
        'Servicios académicos profesionales: ensayos APA, exámenes, plataformas UTPL, asesorías por Zoom y tesis.',
      isPartOf: {
        '@type': 'WebSite',
        name: 'StudyDocu',
        url: SITE_URL,
      },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: OG_IMAGE,
        width: 1200,
        height: 630,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Servicios Académicos StudyDocu',
      url: PAGE_URL,
      areaServed: {
        '@type': 'Country',
        name: 'Ecuador',
      },
      provider: {
        '@type': 'Organization',
        name: 'StudyDocu',
        url: SITE_URL,
      },
      serviceType: [
        'Ensayos académicos',
        'Exámenes y quices',
        'Plataformas universitarias',
        'Normas APA',
        'Presentaciones',
        'Asesorías por Zoom',
        'Tesis (pregrado, posgrado y doctorado)',
      ],
    },
  ]

  return (
    <>
      {/* Schema.org JSON-LD (SEO) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ServiciosClient />
    </>
  )
}

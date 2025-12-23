// src/app/layout.tsx  (Server Component ✅)
import './globals.css'
import localFont from 'next/font/local'
import type { Metadata, Viewport } from 'next'

import Spotlight from '@/components/Spotlight' // client component, ok
import { UserProvider } from '@/context/UserContext'
import ClientLayoutWrapper from '@/components/ClientLayoutWrapper'

// ✅ Forzar render dinámico global (todas las rutas en /app)
export const dynamic = 'force-dynamic'
export const revalidate = 0

/* ---------------------- FUENTE SF PRO ---------------------- */
const sfPro = localFont({
  src: [
    { path: '../fonts/SF-Pro-Display-Regular.otf', weight: '400' },
    { path: '../fonts/SF-Pro-Display-Medium.otf', weight: '500' },
    { path: '../fonts/SF-Pro-Display-Semibold.otf', weight: '600' },
    { path: '../fonts/SF-Pro-Display-Bold.otf', weight: '700' },
  ],
  variable: '--font-sf',
  display: 'swap',
  preload: true,
})

/* ---------------------- METADATOS (solo en server) ---------------------- */
export const metadata: Metadata = {
  metadataBase: new URL('https://studydocu.ec'),
  title: {
    default: 'StudyDocu – Apuntes, resúmenes y documentos académicos con IA',
    template: '%s | StudyDocu',
  },
  description:
    'StudyDocu es una plataforma académica inteligente para subir, compartir y encontrar apuntes universitarios, resúmenes, ensayos y documentos de estudio. IA integrada para resumir al subir tus archivos y estudiar más rápido.',
  applicationName: 'StudyDocu',
  keywords: [
    'StudyDocu',
    'UTPL',
    'apuntes universitarios',
    'resúmenes académicos',
    'documentos académicos',
    'ejemplos de ensayos',
    'UTPL apuntes',
    'universidad Ecuador',
    'resúmenes de estudio',
    'plataforma para estudiantes',
    'material de estudio',
  ],
  authors: [{ name: 'StudyDocu', url: 'https://studydocu.ec' }],
  creator: 'StudyDocu',
  publisher: 'StudyDocu',
  category: 'education',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'StudyDocu – Apuntes, resúmenes y documentos académicos con IA',
    description:
      'Sube y comparte apuntes, resúmenes, ensayos y material académico. Descubre documentos de tu universidad y potencia tu estudio con inteligencia artificial.',
    url: 'https://studydocu.ec',
    siteName: 'StudyDocu',
    images: [
      {
        url: '/og-image.png', // asegúrate de tener este archivo en /public
        width: 1200,
        height: 630,
        alt: 'StudyDocu – Plataforma académica inteligente',
      },
    ],
    type: 'website',
    locale: 'es_EC',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StudyDocu – Apuntes, resúmenes y documentos académicos con IA',
    description:
      'Encuentra apuntes, resúmenes y ensayos de tu carrera. Sube documentos y deja que la IA de StudyDocu los resuma por ti.',
    images: ['/og-image.png'],
    // creator: '@studydocu', // descomenta si tienes usuario en X/Twitter
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
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
    apple: ['/favicon.png'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFCE00' },
    { media: '(prefers-color-scheme: dark)', color: '#0b1220' },
  ],
}

/* ---------------------- ROOT LAYOUT (server) ---------------------- */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={sfPro.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white antialiased">
        {/* Capas visuales globales */}
        <div className="aurora-bg" />
        <div className="radial-layer" />
        <div className="bg-grid fixed inset-0 -z-50 opacity-[.22] dark:opacity-[.16] pointer-events-none" />
        <div className="noise-layer" />
        <Spotlight />

        {/* Client boundaries */}
        <UserProvider>
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        </UserProvider>
      </body>
    </html>
  )
}

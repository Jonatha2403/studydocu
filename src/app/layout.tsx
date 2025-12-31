// src/app/layout.tsx  (Server Component ✅)
import './globals.css'
import localFont from 'next/font/local'
import type { Metadata, Viewport } from 'next'

import Spotlight from '@/components/Spotlight' // client component, ok
import { UserProvider } from '@/context/UserContext'
import ClientLayoutWrapper from '@/components/ClientLayoutWrapper'

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
    // ✅ Título base (home) + template para el resto
    default: 'StudyDocu | Plataforma académica con IA en Ecuador',
    template: '%s | StudyDocu',
  },
  // ✅ Bing: ideal 120–155 caracteres aprox.
  description:
    'Plataforma académica con IA en Ecuador: sube, organiza y resume documentos universitarios para estudiar más rápido con StudyDocu.',
  applicationName: 'StudyDocu',
  keywords: [
    'StudyDocu',
    'plataforma académica',
    'inteligencia artificial',
    'documentos universitarios',
    'resúmenes IA',
    'UTPL',
    'estudiantes Ecuador',
    'material de estudio',
  ],
  authors: [{ name: 'StudyDocu', url: 'https://studydocu.ec' }],
  creator: 'StudyDocu',
  publisher: 'StudyDocu',
  category: 'education',
  alternates: { canonical: '/' },

  openGraph: {
    title: 'StudyDocu | Plataforma académica con IA en Ecuador',
    description:
      'Sube, comparte y encuentra apuntes y documentos universitarios. Estudia mejor con herramientas de IA en StudyDocu.',
    url: 'https://studydocu.ec',
    siteName: 'StudyDocu',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'StudyDocu - Plataforma académica con IA',
      },
    ],
    type: 'website',
    locale: 'es_EC',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'StudyDocu | Plataforma académica con IA en Ecuador',
    description:
      'Encuentra apuntes y documentos de tu carrera. Sube archivos y deja que la IA de StudyDocu te ayude a estudiar mejor.',
    images: ['/og-image.png'],
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
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={sfPro.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white antialiased">
        {/* Capas visuales globales */}
        {/* ✅ En móvil: mantenerlo ligero (sin effects pesados) */}
        <div className="aurora-bg hidden md:block" />
        <div className="radial-layer hidden md:block" />

        {/* ✅ Fixed grid solo desktop (fixed + opacity = pesado en móvil) */}
        <div className="bg-grid fixed inset-0 -z-50 hidden md:block opacity-[.22] dark:opacity-[.16] pointer-events-none" />

        {/* ✅ Noise puede ser pesado si anima/mezcla: solo desktop */}
        <div className="noise-layer hidden md:block" />

        {/* ✅ Spotlight solo desktop */}
        <div className="hidden md:block">
          <Spotlight />
        </div>

        {/* Client boundaries */}
        <UserProvider>
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        </UserProvider>
      </body>
    </html>
  )
}

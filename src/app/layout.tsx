// src/app/layout.tsx (Server Component ✅)
import './globals.css'
import localFont from 'next/font/local'
import type { Metadata, Viewport } from 'next'

import Spotlight from '@/components/Spotlight'
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

/* ---------------------- METADATOS ---------------------- */
export const metadata: Metadata = {
  metadataBase: new URL('https://studydocu.ec'),
  title: {
    default: 'StudyDocu | Plataforma académica con IA en Ecuador',
    template: '%s | StudyDocu',
  },
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
  ],
  authors: [{ name: 'StudyDocu', url: 'https://studydocu.ec' }],
  creator: 'StudyDocu',
  publisher: 'StudyDocu',
  category: 'education',
  alternates: { canonical: '/' },

  openGraph: {
    title: 'StudyDocu | Plataforma académica con IA en Ecuador',
    description: 'Sube, comparte y encuentra apuntes universitarios. Estudia mejor con IA.',
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
    description: 'Encuentra apuntes y documentos de tu carrera con ayuda de IA.',
    images: ['/og-image.png'],
  },

  robots: { index: true, follow: true },

  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' },
      { url: '/favicon.png', type: 'image/png' },
    ],
  },
}

/* ---------------------- VIEWPORT ---------------------- */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#6366F1' },
    { media: '(prefers-color-scheme: dark)', color: '#0B1020' },
  ],
}

/* ---------------------- ROOT LAYOUT ---------------------- */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${sfPro.variable} scroll-smooth`} suppressHydrationWarning>
      <body
        className={[
          // base
          'min-h-screen antialiased selection:bg-indigo-500/20 selection:text-slate-900',
          // typography
          'text-slate-900 dark:text-slate-50',
          // backgrounds (light default)
          'bg-gradient-to-br from-slate-50 via-white to-indigo-50/60 bg-fixed',
          // backgrounds (dark)
          'dark:bg-gradient-to-br dark:from-[#0B1020] dark:via-[#0F172A] dark:to-[#111827]',
        ].join(' ')}
      >
        {/* Capas visuales globales */}
        <div aria-hidden className="pointer-events-none">
          {/* Aurora */}
          <div className="aurora-bg hidden md:block opacity-70 dark:opacity-40" />
          {/* Radial */}
          <div className="radial-layer hidden md:block opacity-60 dark:opacity-40" />
          {/* Grid */}
          <div className="bg-grid fixed inset-0 -z-50 hidden md:block opacity-[.18] dark:opacity-[.12]" />
          {/* Noise */}
          <div className="noise-layer hidden md:block opacity-[.35] dark:opacity-[.25]" />
        </div>

        {/* Spotlight solo desktop */}
        <div className="hidden md:block" aria-hidden>
          <Spotlight />
        </div>

        {/* Providers + Layout cliente */}
        <UserProvider>
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        </UserProvider>
      </body>
    </html>
  )
}
